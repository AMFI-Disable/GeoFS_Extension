import type { FlightTelemetry, IModule, ModuleContext, SimMajorVersion } from '../types/module';
import type { ExtensionSettings } from '../types/settings';

export class ModuleManager {
  private registry = new Map<string, IModule>();
  private active = new Set<string>();
  private eventBus = new Map<string, Set<(detail: unknown) => void>>();

  private settingsUpdate = Promise.resolve();

  constructor(
    private readonly simMajor: SimMajorVersion,
    private readonly baseContext: Omit<ModuleContext, 'emitEvent' | 'onEvent'>
  ) {}

  public register(mod: IModule): void {
    this.registry.set(mod.id, mod);
  }

  public getModules(): IModule[] {
    return Array.from(this.registry.values());
  }

  public isActive(id: string): boolean {
    return this.active.has(id);
  }

  public applySettings(settings: ExtensionSettings): Promise<void> {
    const next = this.settingsUpdate.then(() => this.reconcileSettings(settings));
    this.settingsUpdate = next.catch((error) => {
      console.error('[GeoFS Extension] Could not apply module settings:', error);
    });
    return next;
  }

  private async reconcileSettings(settings: ExtensionSettings): Promise<void> {
    for (const [id, mod] of this.registry) {
      const supported = mod.supportedMajors.includes(this.simMajor);
      const wantEnabled = supported && (settings.modules[id] ?? mod.defaultEnabled);

      if (wantEnabled && !this.active.has(id)) {
        await this.enable(id);
      } else if (!wantEnabled && this.active.has(id)) {
        await this.disable(id);
      } else if (wantEnabled && this.active.has(id)) {
        try {
          mod.onSettingsChange?.(settings);
        } catch (err) {
          console.error(`[GeoFS Extension] onSettingsChange error in ${id}:`, err);
        }
      }
    }
  }

  public async enable(id: string): Promise<void> {
    const mod = this.registry.get(id);
    if (!mod || this.active.has(id)) return;
    if (!mod.supportedMajors.includes(this.simMajor)) return;

    const ctx: ModuleContext = {
      ...this.baseContext,
      emitEvent: (event, detail) => this.emit(event, detail),
      onEvent: (event, handler) => this.on(event, handler as (d: unknown) => void)
    };

    try {
      await mod.init(ctx);
      this.active.add(id);
    } catch (err) {
      console.error(`[GeoFS Extension] Failed to initialize module "${id}":`, err);
    }
  }

  public async disable(id: string): Promise<void> {
    const mod = this.registry.get(id);
    if (!mod || !this.active.has(id)) return;

    try {
      await mod.destroy();
    } catch (err) {
      console.error(`[GeoFS Extension] Failed to destroy module "${id}":`, err);
    } finally {
      this.active.delete(id);
    }
  }

  public dispatchTelemetry(telemetry: FlightTelemetry): void {
    for (const id of this.active) {
      const mod = this.registry.get(id);
      if (!mod?.update) continue;
      try {
        mod.update(telemetry);
      } catch (err) {
        console.error(`[GeoFS Extension] Telemetry tick error in "${id}":`, err);
      }
    }
  }

  public async destroyAll(): Promise<void> {
    for (const id of Array.from(this.active)) {
      await this.disable(id);
    }
    this.eventBus.clear();
  }

  private emit(event: string, detail?: unknown): void {
    const handlers = this.eventBus.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      try {
        handler(detail);
      } catch (err) {
        console.error(`[GeoFS Extension] Event handler error (${event}):`, err);
      }
    }
  }

  private on(event: string, handler: (detail: unknown) => void): () => void {
    let set = this.eventBus.get(event);
    if (!set) {
      set = new Set();
      this.eventBus.set(event, set);
    }
    set.add(handler);
    return () => set?.delete(handler);
  }
}
