import type { GeoFSAircraftDefinition } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

import type { ExtensionSettings } from '../../types/settings';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class AutothrottleModule implements IModule {
  public readonly id = 'autothrottle';
  public readonly name = 'Autothrottle';
  public readonly description = 'GeoFS native PID speed controller with KTS/MACH, landing arm, and multi-engine sync.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private engaged = false;
  private machMode = false;
  private landingArmed = false;
  private wasAirborne = false;
  private aircraftId: string | null = null;
  private targetKias = 250;
  private targetMach = 0.78;
  private reverse?: { definition: GeoFSAircraftDefinition; original: boolean | undefined };
  private previousKias: number | null = null;
  private acceleration = 0;
  private electricalFailure = false;

  private toggleBtn: HTMLButtonElement | null = null;
  private speedLabel: HTMLInputElement | null = null;
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

    const speedLabel = document.createElement('input');
    speedLabel.type = 'number';
    speedLabel.className = 'geofs-ext-pad';
    speedLabel.style.width = '5em';
    speedLabel.setAttribute('aria-label', 'Autothrottle target speed');
    speedLabel.addEventListener('focus', () => speedLabel.select());
    speedLabel.addEventListener('change', () => {
      const speed = speedLabel.valueAsNumber;
      if (Number.isFinite(speed) && speed > 0) {
        if (this.machMode) this.targetMach = Math.min(10, speed);
        else this.targetKias = Math.min(9999, Math.round(speed));
      }
      this.renderControls();
    });

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
      this.previousKias = null;
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

    this.unmounts.push(context.anchors.mountControl('autothrottle-pad', 'autopilot', bar));
    const combo = context.getSettings().keybindings.toggleAutothrottle;
    this.unmounts.push(context.keybinds.register('autothrottle-toggle', combo, () => this.toggle()));
    this.unmounts.push(context.onEvent<{ type: string }>('failure:triggered', ({ type }) => {
      if (type !== 'electrical') return;
      this.electricalFailure = true;
      if (this.engaged) this.stop();
    }));
    this.unmounts.push(context.onEvent<{ type: string }>('failure:cleared', ({ type }) => {
      if (type === 'electrical') this.electricalFailure = false;
    }));
  }

  public adjustSpeed(dir: -1 | 1): void {
    if (this.machMode) {
      this.targetMach = clamp(Number((this.targetMach + dir * 0.01).toFixed(2)), 0.01, 10);
    } else {
      this.targetKias = clamp(this.targetKias + dir * (this.targetKias < 100 ? 5 : 10), 1, 9999);
    }
    this.renderControls();
  }

  public toggle(): void {
    if (!this.ctx) return;
    if (this.engaged) {
      this.stop();
      this.ctx.anchors.showToast('Autothrottle Disengaged');
      return;
    }

    const sim = window.geofs;
    const autopilot = sim?.autopilot;
    const pid = autopilot?.PIDs?.throttle;
    const snap = this.ctx.sim.buildTelemetrySnapshot(0.016, this.ctx.sim.getMajorVersion() ?? 4);
    if (!snap.aircraft || snap.crashed || snap.aircraft.category === 'rotorcraft' || this.electricalFailure || !pid) {
      this.ctx.anchors.showToast('Autothrottle unavailable for the current aircraft or aircraft state.', 'warn');
      return;
    }
    autopilot?.turnOff?.();
    if (autopilot?.on) return;
    this.engaged = true;
    this.aircraftId = snap.aircraft.id;
    this.wasAirborne = !snap.groundContact;
    this.landingArmed = false;
    this.previousKias = null;
    this.acceleration = 0;
    pid.initialize?.(snap.throttles[0] ?? 0, snap.kias);
    this.ctx.audio.playChime();
    this.ctx.anchors.showToast(`Autothrottle Engaged (${this.machMode ? `M ${this.targetMach.toFixed(2)}` : `${this.targetKias} KTS`})`);
    this.renderControls();
    this.ctx.emitEvent('autothrottle:state', { engaged: true });
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.engaged || !this.ctx) return;
    const sim = window.geofs;
    const instance = sim?.aircraft?.instance;
    const aircraft = telemetry.aircraft;
    const definition = instance?.definition;
    const pid = sim?.autopilot?.PIDs?.throttle;
    if (!aircraft || aircraft.id !== this.aircraftId || aircraft.category === 'rotorcraft' ||
        !pid || !definition || telemetry.crashed || telemetry.autopilotOn || this.electricalFailure) {
      this.stop();
      return;
    }
    if (telemetry.paused) return;
    const touchdown = this.wasAirborne && telemetry.groundContact;
    this.wasAirborne = !telemetry.groundContact;
    if (this.landingArmed && touchdown) {
      this.ctx.sim.setThrottle(0);
      this.stop();
      this.ctx.anchors.showToast('Autothrottle Auto-Retard on Touchdown');
      return;
    }

    const toKnots = (mach: number) => sim?.utils?.machToKnots?.(mach) ?? mach * 661.47;
    const target = this.machMode ? toKnots(this.targetMach) : this.targetKias;
    const speed = this.machMode ? toKnots(telemetry.mach) : telemetry.kias;
    if (!Number.isFinite(target) || !Number.isFinite(speed)) return;
    if (this.reverse?.definition !== definition) this.restoreReverse();
    const reverseThreshold = clamp(0.8 - (telemetry.mach || speed / 661.47) * 0.05, 0.1, 0.8);
    if (!this.reverse && target < speed * reverseThreshold) {
      this.reverse = { definition, original: definition.reverse };
      definition.reverse = true;
    } else if (this.reverse && speed <= target * 1.05) {
      this.restoreReverse();
    }

    const error = Math.abs(target - speed);
    const boostLimit = (instance?.setup?.mass ?? 1000) < 10_000 ? 200 : 500;
    const wantsBoost = target > boostLimit || Boolean(this.reverse && speed > boostLimit);
    const errorBoost = error > 1000 ? (error / 10) * (1 + error / 10_000) : error / 100;
    const desired = wantsBoost ? clamp((this.reverse ? speed : target) / 500 + errorBoost, 1, 1e9) : null;
    let multiplier = 1;
    this.ctx.emitEvent('autothrottle:boost', { desired, report: (value: number) => { multiplier = value; } });

    const dt = clamp(telemetry.dt, 0.001, 0.1);
    const acceleration = this.previousKias === null ? 0 : (telemetry.kias - this.previousKias) / dt;
    this.previousKias = telemetry.kias;
    if (Math.abs(acceleration * dt) < 2000) this.acceleration = this.acceleration * 0.8 + acceleration * 0.2;

    const ratio = clamp(error / 1000, 0, 1);
    const damping = (50 / (multiplier + 49) * (1 - ratio) + ratio) *
      (1 + 0.2 * Math.sin(Math.min(error / 150, Math.PI / 2)));
    const physicsMs = sim?.api?.renderingSettings?.physicsDeltaMs;
    const steps = physicsMs && physicsMs > 0 ? clamp(Math.floor(dt * 1000 / physicsMs), 1, 10) : 1;
    pid.set(target, this.reverse ? -1 : 0, 1);
    let command = pid.compute(speed, dt / steps);
    if (this.reverse) command = -Math.abs(command);
    if (multiplier > 1 && this.acceleration > 100) command *= 100 / this.acceleration;
    if (Number.isFinite(command)) {
      const response = clamp(this.ctx.getSettings().autothrottleResponsiveness || 1, 0.5, 2);
      this.ctx.sim.setThrottle(clamp(command * damping * response, this.reverse ? -1 : 0, this.reverse ? 0 : 1));
    }
  }

  private restoreReverse(): void {
    if (!this.reverse) return;
    const { definition, original } = this.reverse;
    if (original === undefined) delete definition.reverse;
    else definition.reverse = original;
    this.reverse = undefined;
  }

  private stop(): void {
    if (!this.engaged) return;
    this.engaged = false;
    this.landingArmed = false;
    this.restoreReverse();
    this.renderControls();
    this.ctx?.emitEvent('autothrottle:state', { engaged: false });
  }

  private renderControls(): void {
    if (this.toggleBtn) {
      this.toggleBtn.classList.toggle('is-active', this.engaged);
      this.toggleBtn.textContent = this.engaged ? 'A/T ON' : 'A/T OFF';
    }
    if (this.speedLabel) {
      this.speedLabel.min = this.machMode ? '0.01' : '1';
      this.speedLabel.max = this.machMode ? '10' : '9999';
      this.speedLabel.step = this.machMode ? '0.01' : '1';
      this.speedLabel.value = this.machMode ? this.targetMach.toFixed(2) : String(this.targetKias);
    }
    if (this.modeBtn) {
      this.modeBtn.textContent = this.machMode ? 'MACH' : 'KTS';
    }
    if (this.armBtn) {
      this.armBtn.classList.toggle('is-active', this.landingArmed);
      this.armBtn.textContent = this.landingArmed ? 'ARM' : 'RET';
    }
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('autothrottle-toggle', settings.keybindings.toggleAutothrottle);
  }

  public destroy(): void {
    this.stop();
    this.electricalFailure = false;
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.toggleBtn = null;
    this.speedLabel = null;
    this.modeBtn = null;
    this.armBtn = null;
    this.ctx = null;
  }
}
