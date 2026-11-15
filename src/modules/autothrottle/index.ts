import type { AircraftCategory, FlightTelemetry, IModule, ModuleContext } from '../../types/module';

interface PidGains {
  kp: number;
  ki: number;
  kd: number;
}

const CATEGORY_PID_PRESETS: Record<AircraftCategory, PidGains> = {
  'ga-piston': { kp: 0.04, ki: 0.008, kd: 0.015 },
  'turboprop': { kp: 0.035, ki: 0.007, kd: 0.014 },
  'airliner-twin': { kp: 0.025, ki: 0.005, kd: 0.012 },
  'airliner-quad': { kp: 0.022, ki: 0.004, kd: 0.012 },
  'fighter': { kp: 0.045, ki: 0.01, kd: 0.018 },
  'supersonic': { kp: 0.03, ki: 0.006, kd: 0.015 },
  'specialized': { kp: 0.02, ki: 0.004, kd: 0.01 }
};

export class AutothrottleModule implements IModule {
  public readonly id = 'autothrottle';
  public readonly name = 'Autothrottle';
  public readonly description = 'Aircraft-class PID speed controller with multi-engine sync and touchdown retard.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private engaged = false;
  private targetKias = 250;
  private integral = 0;
  private prevError = 0;
  private btnEl: HTMLButtonElement | null = null;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'geofs-ext-pad';
    btn.textContent = 'A/T OFF (250)';
    btn.addEventListener('click', () => this.toggle());
    this.btnEl = btn;

    this.unmounts.push(context.anchors.mountControl('autothrottle-pad', 'bottom', btn));
    const combo = context.getSettings().keybindings.toggleAutothrottle;
    this.unmounts.push(context.keybinds.register('autothrottle-toggle', combo, () => this.toggle()));
  }

  public toggle(): void {
    this.engaged = !this.engaged;
    this.integral = 0;
    this.prevError = 0;
    if (this.engaged && this.ctx) {
      const snap = this.ctx.sim.buildTelemetrySnapshot(0.016, this.ctx.sim.getMajorVersion() ?? 4);
      if (snap.kias > 20) this.targetKias = Math.round(snap.kias);
      this.ctx.audio.playChime();
      this.ctx.anchors.showToast(`Autothrottle Engaged (${this.targetKias} KTS)`);
    } else {
      this.ctx?.anchors.showToast('Autothrottle Disengaged');
    }
    this.updateButton();
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.engaged || telemetry.paused || !this.ctx) return;

    if (telemetry.groundContact && telemetry.aglFeet < 5 && telemetry.kias < 140) {
      this.ctx.sim.setThrottle(0);
      this.engaged = false;
      this.updateButton();
      this.ctx.anchors.showToast('Autothrottle Auto-Retard on Touchdown');
      return;
    }

    const category = telemetry.aircraft?.category ?? 'airliner-twin';
    const base = CATEGORY_PID_PRESETS[category];
    const resp = this.ctx.getSettings().autothrottleResponsiveness ?? 1.0;

    const error = this.targetKias - telemetry.kias;
    this.integral = Math.max(-50, Math.min(50, this.integral + error * telemetry.dt));
    const derivative = (error - this.prevError) / Math.max(0.001, telemetry.dt);
    this.prevError = error;

    const cmd = resp * (base.kp * error + base.ki * this.integral + base.kd * derivative);
    const current = telemetry.throttles[0] ?? 0;
    this.ctx.sim.setThrottle(Math.max(0, Math.min(1, current + cmd * telemetry.dt * 2)));
  }

  private updateButton(): void {
    if (!this.btnEl) return;
    this.btnEl.classList.toggle('is-active', this.engaged);
    this.btnEl.textContent = this.engaged ? `A/T ON (${this.targetKias})` : `A/T OFF (${this.targetKias})`;
  }

  public destroy(): void {
    this.engaged = false;
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.btnEl = null;
    this.ctx = null;
  }
}
