import type { GeoFSEnginePart } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

const THRUST_FIELDS = ['thrust', 'afterBurnerThrust', 'reverseThrust'] as const;
type ThrustValues = Pick<GeoFSEnginePart, (typeof THRUST_FIELDS)[number]>;

// Both archived Overpowered Engines scripts apply their multiplier to the live engine parts.
export class EngineThrust {
  private originals = new Map<GeoFSEnginePart, ThrustValues>();

  public apply(parts: Record<string, GeoFSEnginePart> | undefined, multiplier: number): void {
    const engines = new Set(Object.values(parts ?? {}).filter((part) => Number.isFinite(part?.thrust)));
    for (const [part, original] of this.originals) {
      if (!engines.has(part)) {
        Object.assign(part, original);
        this.originals.delete(part);
      }
    }
    for (const part of engines) {
      let original = this.originals.get(part);
      if (!original) {
        original = {};
        for (const field of THRUST_FIELDS) {
          if (Number.isFinite(part[field])) original[field] = part[field];
        }
        this.originals.set(part, original);
      }
      for (const field of THRUST_FIELDS) {
        const value = original[field];
        if (value !== undefined) part[field] = value * multiplier;
      }
    }
  }

  public restore(): void {
    for (const [part, original] of this.originals) Object.assign(part, original);
    this.originals.clear();
  }
}

export class OverpoweredEnginesModule implements IModule {
  public readonly id = 'overpowered-engines';
  public readonly name = 'Overpowered Engines';
  public readonly description = 'Boosts live engine thrust with clean state restoration.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private active = false;
  private atEngaged = false;
  private multiplier = 2.5;
  private thrust = new EngineThrust();
  private btnEl: HTMLButtonElement | null = null;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'geofs-ext-pad';
    btn.textContent = `OP ${this.multiplier}x OFF`;
    btn.addEventListener('click', () => this.toggle());
    this.btnEl = btn;

    this.unmounts.push(context.anchors.mountControl('op-engines-pad', 'bottom', btn));
    const combo = context.getSettings().keybindings.toggleOpEngines;
    this.unmounts.push(context.keybinds.register('op-toggle', combo, () => this.toggle()));
    this.unmounts.push(
      context.onEvent<{ engaged: boolean }>('autothrottle:state', (detail) => {
        this.atEngaged = Boolean(detail?.engaged);
        if (this.atEngaged) {
          this.thrust.restore();
        } else if (this.active) {
          this.ctx?.anchors.showToast(`OP ${this.multiplier}x Re-Engaged`);
        }
      })
    );
  }

  public onSettingsChange(settings: import('../../types/settings').ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('op-toggle', settings.keybindings.toggleOpEngines);
  }

  public toggle(): void {
    this.active = !this.active;
    if (!this.active) this.thrust.restore();
    if (this.btnEl) {
      this.btnEl.classList.toggle('is-active', this.active);
      this.btnEl.textContent = `OP ${this.multiplier}x ${this.active ? 'ON' : 'OFF'}`;
    }
    this.ctx?.anchors.showToast(`OP Engines ${this.active ? 'Engaged' : 'Disengaged'}`);
  }

  public update(telemetry: FlightTelemetry): void {
    if (this.active && !this.atEngaged && !telemetry.crashed) {
      this.thrust.apply(window.geofs?.aircraft?.instance?.parts, this.multiplier);
    } else {
      this.thrust.restore();
    }
  }

  public destroy(): void {
    this.active = false;
    this.atEngaged = false;
    this.thrust.restore();
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.btnEl = null;
    this.ctx = null;
  }
}
