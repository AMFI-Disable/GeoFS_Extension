import type { FlightTelemetry, IModule, ModuleContext, SimMajorVersion } from '../types/module';
import type { ExtensionSettings } from '../types/settings';

export class ModuleManager {
  private registry = new Map<string, IModule>();
  private active = new Set<string>();
  private eventBus = new Map<string, Set<(detail: unknown) => void>>();

  private settingsUpdate = Promise.resolve();

  private reportedUnsupported = new Set<string>();

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
      this.baseContext.emitDiag?.('MODULE_SETTINGS_ERROR', { level: 'error', error: String(error) });
    });
    return next;
  }

  private async reconcileSettings(settings: ExtensionSettings): Promise<void> {
    for (const [id, mod] of this.registry) {
      const supported = mod.supportedMajors.includes(this.simMajor);
      const userWant = settings.modules[id] ?? mod.defaultEnabled;
      if (!supported && userWant && !this.reportedUnsupported.has(id)) {
        this.reportedUnsupported.add(id);
        this.baseContext.emitDiag?.('MODULE_UNSUPPORTED_ERROR', {
          level: 'error',
          moduleId: id,
          simMajor: this.simMajor
        });
      }
      const wantEnabled = supported && userWant;

      if (wantEnabled && !this.active.has(id)) {
        await this.enable(id);
      } else if (!wantEnabled && this.active.has(id)) {
        await this.disable(id);
      } else if (wantEnabled && this.active.has(id)) {
        try {
          mod.onSettingsChange?.(settings);
        } catch (err) {
          this.baseContext.emitDiag?.('MODULE_SETTINGS_ERROR', {
            level: 'error',
            moduleId: id,
            error: String(err)
          });
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
      this.baseContext.emitDiag?.('MODULE_INIT_ERROR', {
        level: 'error',
        moduleId: id,
        error: String(err)
      });
    }
  }

  public async disable(id: string): Promise<void> {
    const mod = this.registry.get(id);
    if (!mod || !this.active.has(id)) return;

    try {
      await mod.destroy();
    } catch (err) {
      this.baseContext.emitDiag?.('MODULE_DESTROY_ERROR', {
        level: 'error',
        moduleId: id,
        error: String(err)
      });
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
        this.baseContext.emitDiag?.('MODULE_UPDATE_ERROR', {
          level: 'error',
          moduleId: id,
          error: String(err)
        });
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
