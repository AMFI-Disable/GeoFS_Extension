import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export class OverpoweredEnginesModule implements IModule {
  public readonly id = 'overpowered-engines';
  public readonly name = 'Overpowered Engines';
  public readonly description = 'Boosts engine thrust and ceiling limits with clean state restoration.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private active = false;
  private multiplier = 2.5;
  private origMaxThrust: number | null = null;
  private origAcId: string | null = null;
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
  }

  public toggle(): void {
    this.active = !this.active;
    if (!this.active) this.restoreOriginal();
    if (this.btnEl) {
      this.btnEl.classList.toggle('is-active', this.active);
      this.btnEl.textContent = `OP ${this.multiplier}x ${this.active ? 'ON' : 'OFF'}`;
    }
    this.ctx?.anchors.showToast(`OP Engines ${this.active ? 'Engaged' : 'Disengaged'}`);
  }

  public update(telemetry: FlightTelemetry): void {
    const def = window.geofs?.aircraft?.instance?.definition;
    if (!def || !telemetry.aircraft) return;

    if (telemetry.aircraft.id !== this.origAcId) {
      this.origAcId = telemetry.aircraft.id;
      this.origMaxThrust = typeof def.maxThrust === 'number' ? def.maxThrust : null;
    }
    if (this.active && this.origMaxThrust !== null) {
      def.maxThrust = this.origMaxThrust * this.multiplier;
    }
  }

  private restoreOriginal(): void {
    const def = window.geofs?.aircraft?.instance?.definition;
    if (def && this.origMaxThrust !== null) {
      def.maxThrust = this.origMaxThrust;
    }
  }

  public destroy(): void {
    this.active = false;
    this.restoreOriginal();
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.btnEl = null;
    this.ctx = null;
  }
}
