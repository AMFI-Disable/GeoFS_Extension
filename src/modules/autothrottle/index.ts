import { controlMarkup, controlStyles } from './controls';
import type { GeoFSAircraftDefinition } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class AutothrottleModule implements IModule {
  public readonly id = 'autothrottle';
  public readonly name = 'Autothrottle';
  public readonly description = 'GeoFS native PID speed controller with KTS/MACH, landing arm, and OP-SYNC safety.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private engaged = false;
  private hasEngaged = false;
  private machMode = false;
  private landingArmed = false;
  private landingRetarded = false;
  private aircraftId: string | null = null;
  private targetKias = 250;
  private targetMach = 0.78;
  private reverse?: { definition: GeoFSAircraftDefinition; original: boolean | undefined };
  private previousSpeed: number | null = null;
  private acceleration = 0;
  private electricalFailure = false;

  private opSyncEngaged = false;
  private opPromptActive = false;
  private opPromptDismiss: (() => void) | null = null;
  private sessionOpSyncChoice: 'allow' | 'never' | null = null;

  private bar: HTMLElement | null = null;
  private disengageTimer: ReturnType<typeof setTimeout> | undefined;
  private restoreThrottleAxis?: () => void;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;
    const bar = document.createElement('div');
    bar.className = 'ext-autothrottle-bar';
    bar.innerHTML = controlMarkup;
    const style = document.createElement('style');
    style.id = 'geofs-ext-autothrottle-styles';
    style.textContent = controlStyles;
    document.head?.append(style);
    this.unmounts.push(() => style.remove());
    this.bar = bar;

    for (const control of bar.querySelectorAll<HTMLElement>('a, .ext-autothrottle-pad')) {
      control.tabIndex = 0;
      control.setAttribute('role', 'button');
      control.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (!event.repeat) control.click();
      });
      control.addEventListener('click', (event) => {
        event.stopPropagation();
        if (control.id === 'autothrottle-button') this.toggle();
        else if (control.dataset.step) this.adjustSpeed(control.dataset.step === '1' ? 1 : -1);
        else if (control.dataset.speedMode) this.setMode(control.dataset.speedMode === 'mach');
        else if (control.dataset.arm) {
          this.landingArmed = control.dataset.arm === 'on';
          if (!this.landingArmed) this.landingRetarded = false;
          this.renderControls();
        }
      });
    }

    const speed = bar.querySelector<HTMLInputElement>('input')!;
    speed.addEventListener('focus', () => {
      if (this.machMode) speed.value = String(Number(this.targetMach.toFixed(4)));
      speed.select();
    });
    speed.addEventListener('click', () => speed.select());
    const readSpeed = () => {
      const value = Number.parseFloat(speed.value);
      if (!Number.isFinite(value) || value <= 0) return;
      this.setTarget(value);
    };
    speed.addEventListener('input', readSpeed);
    speed.addEventListener('blur', () => this.renderControls());
    speed.addEventListener('change', () => {
      readSpeed();
      this.renderControls();
    });

    this.unmounts.push(context.anchors.mountControl('autothrottle-pad', 'autopilot', bar));
    this.attachToAutopilotBar();
    this.upgradeTooltips();
    this.renderControls();

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
    context.emitEvent('failure:request-active');
  }

  private upgradedTooltips = new Set<HTMLElement>();

  private upgradeTooltips(): void {
    if (!this.bar || !window.componentHandler?.upgradeElement) return;
    const newlyUpgraded: HTMLElement[] = [];
    for (const tip of this.bar.querySelectorAll<HTMLElement>('.mdl-tooltip')) {
      if (this.upgradedTooltips.has(tip)) continue;
      try {
        window.componentHandler.upgradeElement(tip);
        this.upgradedTooltips.add(tip);
        newlyUpgraded.push(tip);
      } catch {
        // Fallback to native title tooltips cleanly
      }
    }
    if (newlyUpgraded.length > 0) {
      this.unmounts.push(() => {
        try {
          window.componentHandler?.downgradeElements?.(newlyUpgraded);
        } catch {
          // ignore downgrade errors if GeoFS MDL has already torn down
        }
        for (const tip of newlyUpgraded) this.upgradedTooltips.delete(tip);
      });
    }
  }

  private attachToAutopilotBar(): void {
    if (!this.bar) return;
    const host = document.querySelector('.geofs-autopilot-bar');
    if (host && this.bar.parentElement !== host) {
      host.append(this.bar);
      this.upgradeTooltips();
    }
    this.bar.hidden = false;
  }

  private setTarget(value: number): void {
    if (this.machMode) this.targetMach = clamp(value, 0.01, 10);
    else this.targetKias = clamp(Math.round(value), 1, 9999);
    window.geofs?.autopilot?.setSpeed?.(this.machMode ? this.targetMach : this.targetKias);
  }

  private setMode(mach: boolean): void {
    if (mach !== this.machMode) {
      const values = window.geofs?.animation?.values;
      const kias = values?.kias ?? 0;
      const currentMach = values?.mach ?? 0;
      const ratio = kias > 50 && currentMach > 0 ? kias / currentMach : 661.47;
      this.machMode = mach;
      this.previousSpeed = null;
      this.applyNativeMode();
      this.setTarget(mach ? this.targetKias / ratio : this.targetMach * ratio);
    }
    this.renderControls();
  }

  private applyNativeMode(): void {
    window.geofs?.autopilot?.setSpeedMode?.(this.machMode ? 'mach' : this.ctx?.sim.getMajorVersion() === 3 ? 'knots' : 'kias');
  }

  public adjustSpeed(dir: -1 | 1): void {
    const target = this.machMode
      ? Number((this.targetMach + dir * 0.01).toFixed(6))
      : this.targetKias + dir * (this.targetKias < 100 ? 5 : 10);
    this.setTarget(target);
    this.renderControls();
  }

  private suppressThrottleAxis(): void {
    const setter = window.controls?.axisSetters?.throttle;
    const original = setter?.process;
    if (!setter || !original) return;
    const suppressed = () => {};
    setter.process = suppressed;
    this.restoreThrottleAxis = () => {
      if (setter.process === suppressed) setter.process = original;
    };
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
      this.ctx.emitDiag?.('AUTOTHROTTLE_ERROR', {
        level: 'error',
        aircraftId: snap.aircraft?.id ?? null,
        category: snap.aircraft?.category ?? null,
        crashed: snap.crashed,
        electricalFailure: this.electricalFailure,
        hasPid: Boolean(pid)
      });
      return;
    }
    if (autopilot?.on) autopilot.turnOff?.();
    if (autopilot?.on) return;
    clearTimeout(this.disengageTimer);
    this.bar?.querySelector('#autothrottle-button')?.classList.remove('red-pad');
    if (!this.hasEngaged) {
      this.machMode = autopilot?.speedMode === 'mach';
      const nativeTarget = autopilot?.values?.speed;
      const current = this.machMode ? (snap.mach || 0.8) : (snap.kias || 250);
      this.setTarget(nativeTarget && nativeTarget > 0 ? nativeTarget : current);
      this.hasEngaged = true;
    }
    this.applyNativeMode();
    this.setTarget(this.machMode ? this.targetMach : this.targetKias);
    this.suppressThrottleAxis();
    this.engaged = true;
    this.aircraftId = snap.aircraft.id;
    this.landingArmed = false;
    this.landingRetarded = false;
    this.previousSpeed = null;
    this.acceleration = 0;
    this.sessionOpSyncChoice = null;
    this.opPromptActive = false;
    this.opSyncEngaged = false;
    pid.initialize?.(snap.throttles[0] ?? 0, snap.kias);
    this.ctx.audio.playChime();
    this.ctx.anchors.showToast(`Autothrottle Engaged (${this.machMode ? `M ${this.targetMach.toFixed(2)}` : `${this.targetKias} KTS`})`);
    this.renderControls();
    this.ctx.emitEvent('autothrottle:state', { engaged: true });
  }

  private dismissOpPrompt(): void {
    this.opPromptDismiss?.();
    this.opPromptDismiss = null;
    this.opPromptActive = false;
  }

  public update(telemetry: FlightTelemetry): void {
    this.attachToAutopilotBar();
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

    if (this.landingArmed) {
      if (!telemetry.groundContact && telemetry.aglFeet > 0 && telemetry.aglFeet <= 27 && !this.landingRetarded) {
        this.landingRetarded = true;
        this.ctx.sim.setThrottle(0);
        this.ctx.anchors.showToast('Autothrottle Retard (27 ft RA)');
        return;
      }
      if (this.landingRetarded && !telemetry.groundContact) {
        this.ctx.sim.setThrottle(0);
        return;
      }
      if (telemetry.groundContact) {
        this.ctx.sim.setThrottle(0);
        if (window.controls?.airbrakes) {
          window.controls.airbrakes.target = 1;
          window.controls.setters?.setAirbrakes?.set?.();
        }
        this.stop();
        this.ctx.anchors.showToast('Autothrottle Auto-Retard & Spoilers Deployed');
        return;
      }
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

    this.bar?.querySelector<HTMLElement>('.ext-autothrottle-reverse')?.toggleAttribute('hidden', !this.reverse);

    const settings = this.ctx.getSettings();
    const error = Math.abs(target - speed);
    const boostLimit = (instance?.setup?.mass ?? 1000) < 10_000 ? 200 : 500;
    const deltaThreshold = Math.max(25, settings.opDeltaThresholdKts ?? 150);
    const highDelta = error >= deltaThreshold || target > boostLimit || Boolean(this.reverse && speed > boostLimit);
    const errorBoost = error > 1000 ? (error / 10) * (1 + error / 10_000) : error / 100;
    const computedDesired = clamp((this.reverse ? speed : target) / 500 + errorBoost, 1, 1e9);

    const configuredPolicy = settings.opSyncPolicy ?? 'ask';
    const effectivePolicy = configuredPolicy === 'ask' && this.sessionOpSyncChoice
      ? this.sessionOpSyncChoice
      : configuredPolicy;

    let desired: number | null = null;
    if (highDelta) {
      if (effectivePolicy === 'ask') {
        if (!this.opPromptActive) {
          this.opPromptActive = true;
          this.ctx.emitDiag?.('OPSYNC_PROMPT', {
            deltaKts: Math.round(error),
            targetKts: Math.round(target),
            speedKts: Math.round(speed)
          });
          this.opPromptDismiss = this.ctx.anchors.showPromptBanner(
            'op-sync-prompt',
            `Large speed delta (${Math.round(error)} kts). Allow A/THR to engage OP Engines?`,
            [
              {
                id: 'allow-once',
                label: 'Allow Once',
                variant: 'primary',
                onClick: () => {
                  this.sessionOpSyncChoice = 'allow';
                  this.opPromptActive = false;
                  this.opPromptDismiss = null;
                  this.ctx?.emitDiag?.('OPSYNC_DECISION', { choice: 'allow-once' });
                }
              },
              {
                id: 'keep-standard',
                label: 'Keep Standard',
                variant: 'neutral',
                onClick: () => {
                  this.sessionOpSyncChoice = 'never';
                  this.opPromptActive = false;
                  this.opPromptDismiss = null;
                  this.ctx?.emitDiag?.('OPSYNC_DECISION', { choice: 'keep-standard' });
                }
              },
              {
                id: 'always-allow',
                label: 'Always Allow',
                variant: 'primary',
                onClick: () => {
                  this.opPromptActive = false;
                  this.opPromptDismiss = null;
                  this.ctx?.updateSettings({ opSyncPolicy: 'allow' });
                  this.ctx?.emitDiag?.('OPSYNC_DECISION', { choice: 'always-allow' });
                }
              },
              {
                id: 'never-allow',
                label: 'Never Allow',
                variant: 'danger',
                onClick: () => {
                  this.opPromptActive = false;
                  this.opPromptDismiss = null;
                  this.ctx?.updateSettings({ opSyncPolicy: 'never' });
                  this.ctx?.emitDiag?.('OPSYNC_DECISION', { choice: 'never-allow' });
                }
              }
            ],
            0
          );
        }
      } else if (effectivePolicy === 'allow') {
        this.dismissOpPrompt();
        desired = computedDesired;
      } else {
        this.dismissOpPrompt();
      }
    } else {
      this.dismissOpPrompt();
    }

    const wantOpSync = desired !== null;
    if (wantOpSync !== this.opSyncEngaged) {
      this.opSyncEngaged = wantOpSync;
      this.ctx.emitEvent('autothrottle:opsync-state', { active: wantOpSync });
      this.ctx.emitDiag?.(wantOpSync ? 'OPSYNC_ENGAGED' : 'OPSYNC_RELEASED', { desired });
    }

    let multiplier = 1;
    this.ctx.emitEvent('autothrottle:boost', { desired, report: (value: number) => { multiplier = value; } });

    const dt = clamp(telemetry.dt, 0.001, 0.1);
    const acceleration = this.previousSpeed === null ? 0 : (speed - this.previousSpeed) / dt;
    this.previousSpeed = speed;
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
      const response = clamp(settings.autothrottleResponsiveness || 1, 0.5, 2);
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
    this.landingRetarded = false;
    this.sessionOpSyncChoice = null;
    this.dismissOpPrompt();
    if (this.opSyncEngaged) {
      this.opSyncEngaged = false;
      this.ctx?.emitEvent('autothrottle:opsync-state', { active: false });
    }
    this.restoreReverse();
    this.restoreThrottleAxis?.();
    this.restoreThrottleAxis = undefined;
    const button = this.bar?.querySelector('#autothrottle-button');
    button?.classList.add('red-pad');
    clearTimeout(this.disengageTimer);
    this.disengageTimer = setTimeout(() => button?.classList.remove('red-pad'), 3000);
    this.renderControls();
    this.ctx?.emitEvent('autothrottle:state', { engaged: false });
  }

  private renderControls(): void {
    const bar = this.bar;
    if (!bar) return;
    const button = bar.querySelector('#autothrottle-button')!;
    button.classList.toggle('green-pad', this.engaged);
    button.setAttribute('aria-pressed', String(this.engaged));
    bar.querySelector('.ext-autothrottle-controls')?.toggleAttribute('hidden', !this.engaged);
    bar.querySelector('.ext-autothrottle-reverse')?.toggleAttribute('hidden', !this.reverse);

    const speed = bar.querySelector<HTMLInputElement>('input')!;
    if (typeof document === 'undefined' || document.activeElement !== speed) {
      speed.value = this.machMode ? this.targetMach.toFixed(2) : String(this.targetKias);
    }
    speed.removeAttribute('maxlength');
    if (!this.machMode) speed.maxLength = 4;

    for (const control of bar.querySelectorAll<HTMLElement>('[data-speed-mode], [data-arm]')) {
      const off = control.dataset.arm === 'off';
      const selected = control.dataset.arm
        ? this.landingArmed !== off : this.machMode === (control.dataset.speedMode === 'mach');
      control.classList.toggle('active', selected);
      control.classList.toggle('green-pad', selected && !off);
      control.classList.toggle('landing-selected', selected && off);
      control.setAttribute('aria-pressed', String(selected));
    }
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('autothrottle-toggle', settings.keybindings.toggleAutothrottle);
    if (settings.opSyncPolicy !== 'ask') {
      this.dismissOpPrompt();
      this.sessionOpSyncChoice = null;
    }
  }

  public destroy(): void {
    this.stop();
    this.electricalFailure = false;
    for (const u of this.unmounts) u();
    this.unmounts = [];
    clearTimeout(this.disengageTimer);
    this.disengageTimer = undefined;
    this.bar = null;
    this.hasEngaged = false;
    this.ctx = null;
  }
}
