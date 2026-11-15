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
  public readonly description = 'Aircraft-class PID speed controller with KTS/MACH, landing arm, and multi-engine sync.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private engaged = false;
  private machMode = false;
  private landingArmed = false;
  private targetKias = 250;
  private targetMach = 0.78;
  private integral = 0;
  private prevError = 0;

  private toggleBtn: HTMLButtonElement | null = null;
  private speedLabel: HTMLSpanElement | null = null;
  private modeBtn: HTMLButtonElement | null = null;
  private armBtn: HTMLButtonElement | null = null;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;

    const bar = document.createElement('div');
    bar.style.cssText = 'display:inline-flex;align-items:center;gap:4px;';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'geofs-ext-pad';
    toggleBtn.addEventListener('click', () => this.toggle());

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'geofs-ext-pad';
    downBtn.textContent = '-';
    downBtn.addEventListener('click', () => this.adjustSpeed(-1));

    const speedLabel = document.createElement('span');
    speedLabel.className = 'geofs-ext-pad';
    speedLabel.style.cursor = 'default';

    const upBtn = document.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'geofs-ext-pad';
    upBtn.textContent = '+';
    upBtn.addEventListener('click', () => this.adjustSpeed(1));

    const modeBtn = document.createElement('button');
    modeBtn.type = 'button';
    modeBtn.className = 'geofs-ext-pad';
    modeBtn.addEventListener('click', () => {
      this.machMode = !this.machMode;
      this.renderControls();
    });

    const armBtn = document.createElement('button');
    armBtn.type = 'button';
    armBtn.className = 'geofs-ext-pad';
    armBtn.addEventListener('click', () => {
      this.landingArmed = !this.landingArmed;
      this.renderControls();
    });

    bar.append(toggleBtn, downBtn, speedLabel, upBtn, modeBtn, armBtn);
    this.toggleBtn = toggleBtn;
    this.speedLabel = speedLabel;
    this.modeBtn = modeBtn;
    this.armBtn = armBtn;
    this.renderControls();

    this.unmounts.push(context.anchors.mountControl('autothrottle-pad', 'bottom', bar));
    const combo = context.getSettings().keybindings.toggleAutothrottle;
    this.unmounts.push(context.keybinds.register('autothrottle-toggle', combo, () => this.toggle()));
  }

  public adjustSpeed(dir: -1 | 1): void {
    if (this.machMode) {
      this.targetMach = Math.max(0.2, Math.min(3.0, Number((this.targetMach + dir * 0.02).toFixed(2))));
    } else {
      this.targetKias = Math.max(40, Math.min(1200, this.targetKias + dir * 10));
    }
    this.renderControls();
  }

  public toggle(): void {
    this.engaged = !this.engaged;
    this.integral = 0;
    this.prevError = 0;
    if (this.engaged && this.ctx) {
      const snap = this.ctx.sim.buildTelemetrySnapshot(0.016, this.ctx.sim.getMajorVersion() ?? 4);
      if (!this.machMode && snap.kias > 25) this.targetKias = Math.round(snap.kias);
      if (this.machMode && snap.mach > 0.15) this.targetMach = Number(snap.mach.toFixed(2));
      this.ctx.audio.playChime();
      this.ctx.anchors.showToast(
        `Autothrottle Engaged (${this.machMode ? `M ${this.targetMach.toFixed(2)}` : `${this.targetKias} KTS`})`
      );
    } else {
      this.ctx?.anchors.showToast('Autothrottle Disengaged');
    }
    this.renderControls();
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.engaged || telemetry.paused || !this.ctx) return;

    if (this.landingArmed && telemetry.groundContact && telemetry.aglFeet < 10) {
      this.ctx.sim.setThrottle(0);
      this.engaged = false;
      this.renderControls();
      this.ctx.anchors.showToast('Autothrottle Auto-Retard on Touchdown');
      return;
    }

    const category = telemetry.aircraft?.category ?? 'airliner-twin';
    const base = CATEGORY_PID_PRESETS[category];
    const resp = this.ctx.getSettings().autothrottleResponsiveness ?? 1.0;

    const currentVal = this.machMode ? telemetry.mach : telemetry.kias;
    const targetVal = this.machMode ? this.targetMach : this.targetKias;
    const errorScale = this.machMode ? 350 : 1;

    const error = (targetVal - currentVal) * errorScale;
    this.integral = Math.max(-50, Math.min(50, this.integral + error * telemetry.dt));
    const derivative = (error - this.prevError) / Math.max(0.001, telemetry.dt);
    this.prevError = error;

    const cmd = resp * (base.kp * error + base.ki * this.integral + base.kd * derivative);
    const current = telemetry.throttles[0] ?? 0;
    this.ctx.sim.setThrottle(Math.max(0, Math.min(1, current + cmd * telemetry.dt * 2)));
  }

  private renderControls(): void {
    if (this.toggleBtn) {
      this.toggleBtn.classList.toggle('is-active', this.engaged);
      this.toggleBtn.textContent = this.engaged ? 'A/T ON' : 'A/T OFF';
    }
    if (this.speedLabel) {
      this.speedLabel.textContent = this.machMode ? `M${this.targetMach.toFixed(2)}` : `${this.targetKias}`;
    }
    if (this.modeBtn) {
      this.modeBtn.textContent = this.machMode ? 'MACH' : 'KTS';
    }
    if (this.armBtn) {
      this.armBtn.classList.toggle('is-active', this.landingArmed);
      this.armBtn.textContent = this.landingArmed ? 'ARM' : 'RET';
    }
  }

  public destroy(): void {
    this.engaged = false;
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.toggleBtn = null;
    this.speedLabel = null;
    this.modeBtn = null;
    this.armBtn = null;
    this.ctx = null;
  }
}
