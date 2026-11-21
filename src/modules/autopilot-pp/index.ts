import { buildTopbarPadStyles } from '../../shared/topbar-styles';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';
import {
  PidController,
  clamp,
  classifyHoldEntry,
  crossoverAltitudeFt,
  greatCircleBearingDeg,
  greatCircleDistanceNm,
  headingDeltaDeg,
  kiasToKtas,
  machToKias,
  normalizeHeading,
  stepHoldPattern
} from './math';
import type {
  ApPpCommand,
  ApPpFmaState,
  ApPpHoldConfig,
  ApPpLateralMode,
  ApPpSnapshot,
  ApPpSpeedMode,
  ApPpVerticalMode
} from './types';

const AP_PP_PAD_STYLES = `
  .ext-ap-pp-bar,
  .ext-ap-pp-bar * {
    box-sizing: border-box;
  }
  .ext-ap-pp-bar {
    display: inline-flex;
    align-items: center;
    vertical-align: var(--geofs-ext-ap-valign, middle);
    pointer-events: all;
  }
  ${buildTopbarPadStyles('#ap-pp-button.ext-ap-pp-pad')}
  #ap-pp-button.ext-ap-pp-pad {
    position: relative;
  }
  #ap-pp-button .ext-ap-pp-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.05;
    gap: 1px;
  }
  #ap-pp-button .ext-ap-pp-title-row {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  #ap-pp-button .ext-ap-pp-beta {
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.4px;
    padding: 0 3px;
    border-radius: 3px;
    background: rgba(245, 158, 11, 0.25);
    border: 1px solid rgba(245, 158, 11, 0.7);
    color: #fbbf24;
  }
  #ap-pp-button .ext-ap-pp-fma {
    font-size: 8px;
    letter-spacing: 0.3px;
    opacity: 0.85;
    font-family: monospace;
  }
`;

export class AutopilotPlusModule implements IModule {
  public readonly id = 'autopilot-pp';
  public readonly name = 'AP++ (Beta)';
  public readonly description =
    'Unified Autopilot++ flight management: VNAV/FLCH, Mach crossover, racetrack HOLD, LAT/LON, Autoland & Envelope Protection.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private barEl: HTMLElement | null = null;
  private padEl: HTMLElement | null = null;
  private fmaLineEl: HTMLElement | null = null;
  private hudFmaEl: HTMLElement | null = null;
  private syncHudTab: (() => void) | null = null;
  private unmounts: Array<() => void> = [];

  private engaged = false;
  private speedMode: ApPpSpeedMode = 'kts';
  private lateralMode: ApPpLateralMode = 'hdg';
  private verticalMode: ApPpVerticalMode = 'alt';

  private targetKias = 250;
  private targetMach = 0.78;
  private targetAltFt = 10000;
  private targetHdgDeg = 0;
  private targetVsFpm = 0;
  private autoVs = true;
  private targetLat = 0;
  private targetLon = 0;
  private waypointName = 'CUSTOM';
  private landingArmed = false;
  private landingRetarded = false;
  private envelopeProtection = true;
  private hoverMode = false;

  private holdConfig: ApPpHoldConfig = {
    fixLat: 0,
    fixLon: 0,
    inboundCourseDeg: 0,
    legMinutes: 1.0,
    turnDir: 'R',
    phase: 'inbound',
    legElapsedSec: 0
  };

  private fma: ApPpFmaState = {
    thr: 'OFF',
    vert: 'OFF',
    lat: 'OFF',
    protection: null
  };

  private lastTelemetry: FlightTelemetry | null = null;
  private lastEmitMs = 0;
  private stickOverrideSec = 0;
  private activeFailures = new Set<string>();

  private readonly rollPid = new PidController(0.032, 0.001, 0.015, -0.8, 0.8, 10);
  private readonly pitchPid = new PidController(0.038, 0.004, 0.018, -0.8, 0.8, 12);
  private readonly speedPitchPid = new PidController(0.18, 0.012, 0.04, -12, 16, 20);
  private readonly throttlePid = new PidController(0.015, 0.003, 0.004, 0, 1, 30);

  public init(context: ModuleContext): void {
    this.ctx = context;

    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'geofs-ext-ap-pp-styles';
      style.textContent = AP_PP_PAD_STYLES;
      document.head?.append(style);
      this.unmounts.push(() => style.remove());

      const bar = document.createElement('div');
      bar.className = 'ext-ap-pp-bar';
      bar.innerHTML = `
      <div class="control-pad ext-ap-pp-pad" id="ap-pp-button"
           role="button" tabindex="0" aria-pressed="false"
           title="AP++ (Beta): Toggle master autopilot & open Side Panel">
        <div class="control-pad-label transp-pad ext-ap-pp-label">
          <span class="ext-ap-pp-title-row">AP++ <span class="ext-ap-pp-beta">BETA</span></span>
          <span class="ext-ap-pp-fma">STBY</span>
        </div>
      </div>
    `;

      const pad = bar.querySelector<HTMLElement>('#ap-pp-button')!;
      this.fmaLineEl = bar.querySelector<HTMLElement>('.ext-ap-pp-fma');
      pad.addEventListener('click', (event) => {
        event.stopPropagation();
        this.toggleMaster();
        window.postMessage({ type: 'GEOFS_EXT_OPEN_SIDEPANEL' }, '*');
      });
      pad.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (!event.repeat) pad.click();
      });

      this.barEl = bar;
      this.padEl = pad;
      this.unmounts.push(context.anchors.mountControl('autopilot-pp-pad', 'autopilot', bar));
      context.anchors.syncAutopilotPad(pad, bar, true);

      if (typeof context.anchors?.registerHudTab === 'function') {
        const hudTab = document.createElement('div');
        hudTab.style.cssText = 'display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;';
        const fmaRow = document.createElement('div');
        fmaRow.style.cssText = 'font-family:monospace;font-size:10px;font-weight:700;color:#fbbf24;display:flex;justify-content:space-between;';
        fmaRow.textContent = 'AP++ STBY';
        this.hudFmaEl = fmaRow;

        const btnGrid = document.createElement('div');
        btnGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;';
        const makeBtn = (label: string, onClick: () => void) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = label;
          b.style.cssText = 'background:rgba(255,255,255,0.06);color:#e5e7eb;border:1px solid rgba(255,255,255,0.16);border-radius:4px;padding:4px 4px;font-size:9px;font-weight:700;cursor:pointer;';
          b.addEventListener('click', onClick);
          return b;
        };

        const masterBtn = makeBtn('AP++', () => this.handleCommand({ type: 'toggle' }));
        const holdAllBtn = makeBtn('HOLD ALL', () => this.handleCommand({ type: 'holdPresent', axis: 'all' }));
        const raceBtn = makeBtn('RACETRACK', () => this.handleCommand({ type: 'holdHere' }));
        const ldgBtn = makeBtn('LDG ARM', () => this.handleCommand({ type: 'setLandingArm', armed: !this.landingArmed }));
        const hoverBtn = makeBtn('HOVER', () => this.handleCommand({ type: 'setHoverMode', enabled: !this.hoverMode }));
        const protBtn = makeBtn('PROT', () => this.handleCommand({ type: 'setEnvelopeProtection', enabled: !this.envelopeProtection }));
        btnGrid.append(masterBtn, holdAllBtn, raceBtn, ldgBtn, hoverBtn, protBtn);

        this.syncHudTab = () => {
          fmaRow.textContent = this.engaged
            ? `${this.fma.thr} · ${this.fma.vert} · ${this.fma.lat}${this.fma.protection ? ` [${this.fma.protection}]` : ''}`
            : 'AP++ STBY';
          const mark = (b: HTMLButtonElement, active: boolean) => {
            b.style.borderColor = active ? '#10b981' : 'rgba(255,255,255,0.16)';
            b.style.color = active ? '#10b981' : '#a1a1aa';
          };
          mark(masterBtn, this.engaged);
          mark(raceBtn, this.engaged && this.lateralMode === 'hold');
          mark(ldgBtn, this.landingArmed);
          mark(hoverBtn, this.engaged && this.hoverMode);
          mark(protBtn, this.envelopeProtection);
        };
        hudTab.append(fmaRow, btnGrid);
        this.unmounts.push(context.anchors.registerHudTab('ap-pp', 'AP++', hudTab, false, { defaultClosed: true }));
      }
    }

    if (typeof window !== 'undefined') {
      const onMessage = (event: MessageEvent) => {
        if (event.source !== window || !event.data || typeof event.data !== 'object') return;
        const data = event.data as { type?: string; command?: ApPpCommand };
        if (data.type === 'GEOFS_EXT_AP_PP_COMMAND' && data.command) {
          this.handleCommand(data.command);
        }
      };
      window.addEventListener('message', onMessage);
      this.unmounts.push(() => window.removeEventListener('message', onMessage));
    }

    this.unmounts.push(
      context.onEvent<{ type: string }>('failure:triggered', ({ type }) => {
        if (!type) return;
        this.activeFailures.add(type);
        if (type === 'electrical' && this.engaged) {
          this.disengage('ELEC FAIL');
        } else if (type === 'pitot' && this.engaged && (this.verticalMode === 'flch' || this.verticalMode === 'vnav')) {
          this.verticalMode = 'alt';
        }
        this.emitSnapshot(true);
      })
    );
    this.unmounts.push(
      context.onEvent<{ type: string }>('failure:cleared', ({ type }) => {
        if (!type) return;
        this.activeFailures.delete(type);
        this.emitSnapshot(true);
      })
    );
    context.emitEvent('failure:request-active');

    this.renderPad();
    this.emitSnapshot(true);
  }

  public update(telemetry: FlightTelemetry): void {
    this.lastTelemetry = telemetry;
    if (this.padEl && this.barEl) {
      this.ctx?.anchors.syncAutopilotPad(this.padEl, this.barEl);
    }

    if (telemetry.paused || telemetry.crashed) return;

    const dt = clamp(telemetry.dt || 0.05, 0.01, 0.25);

    // Check pilot stick override when engaged
    if (this.engaged && this.checkStickOverride(dt)) {
      this.disengage('STICK DISC');
      this.fma.protection = 'STICK DISC';
      this.ctx?.anchors.showToast('AP++ Disconnected: Manual Stick Input');
      this.emitSnapshot(true);
      return;
    }

    if (!this.engaged) {
      // Passive envelope protection if armed? Keep FMA clear unless active
      if (this.fma.protection && this.fma.protection !== 'STICK DISC') {
        this.fma.protection = null;
      }
      if (telemetry.timestamp - this.lastEmitMs >= 400) {
        this.emitSnapshot(false);
      }
      return;
    }

    if (this.activeFailures.has('electrical')) {
      this.disengage('ELEC FAIL');
      return;
    }

    // 1. Envelope Protection Check
    const protection = this.envelopeProtection ? this.evaluateEnvelope(telemetry) : null;
    this.fma.protection = protection;

    // 2. Speed / Autothrottle Channel
    this.stepThrottleChannel(telemetry, dt, protection);

    // 3. Lateral Channel (HDG, LATLON, WPT, HOLD, LOC)
    this.stepLateralChannel(telemetry, dt);

    // 4. Vertical Channel (ALT, VS, FLCH/VNAV, GS, FLARE)
    this.stepVerticalChannel(telemetry, dt, protection);

    this.updateFmaLabels();
    this.renderPad();

    if (telemetry.timestamp - this.lastEmitMs >= 250) {
      this.emitSnapshot(false);
    }
  }

  public onSettingsChange(_settings: ExtensionSettings): void {
    this.renderPad();
  }

  public destroy(): void {
    if (this.engaged) {
      this.disengage();
    }
    for (const fn of this.unmounts) fn();
    this.unmounts = [];
    this.barEl = null;
    this.padEl = null;
    this.fmaLineEl = null;
    this.ctx = null;
  }

  public handleCommand(cmd: ApPpCommand): void {
    switch (cmd.type) {
      case 'engage':
        this.engage();
        break;
      case 'disengage':
        this.disengage();
        break;
      case 'toggle':
        this.toggleMaster();
        break;
      case 'setSpeed':
        if (Number.isFinite(cmd.value) && cmd.value > 0) {
          if (this.speedMode === 'mach') {
            this.targetMach = clamp(cmd.value, 0.2, 3.0);
          } else {
            this.targetKias = clamp(Math.round(cmd.value), 40, 999);
          }
        }
        break;
      case 'setSpeedMode':
        this.speedMode = cmd.mode;
        break;
      case 'setHeading':
        this.targetHdgDeg = normalizeHeading(cmd.deg);
        if (window.geofs?.autopilot?.values) {
          (window.geofs.autopilot.values as Record<string, unknown>).course = this.targetHdgDeg;
        }
        break;
      case 'setLateralMode':
        this.lateralMode = cmd.mode;
        if (cmd.mode === 'hold' && this.lastTelemetry) {
          this.initHoldAtCurrent(this.lastTelemetry);
        }
        this.rollPid.reset();
        break;
      case 'setAltitude':
        if (Number.isFinite(cmd.feet)) {
          this.targetAltFt = clamp(Math.round(cmd.feet), 0, 80000);
          if (window.geofs?.autopilot?.values) {
            (window.geofs.autopilot.values as Record<string, unknown>).altitude = this.targetAltFt;
          }
        }
        break;
      case 'setVs':
        if (cmd.fpm === null) {
          this.autoVs = true;
        } else if (Number.isFinite(cmd.fpm)) {
          this.autoVs = false;
          this.targetVsFpm = clamp(Math.round(cmd.fpm), -6000, 6000);
        }
        break;
      case 'setVerticalMode':
        this.verticalMode = cmd.mode;
        this.pitchPid.reset();
        this.speedPitchPid.reset();
        break;
      case 'setLatLon':
        if (Number.isFinite(cmd.lat) && Number.isFinite(cmd.lon)) {
          this.targetLat = clamp(cmd.lat, -90, 90);
          this.targetLon = clamp(cmd.lon, -180, 180);
          this.waypointName = cmd.name?.trim() || 'LAT/LON';
          this.lateralMode = 'latlon';
        }
        break;
      case 'holdHere': {
        if (this.lastTelemetry) {
          this.initHoldAtCurrent(this.lastTelemetry, cmd.legMinutes, cmd.turnDir);
        } else {
          if (cmd.legMinutes) this.holdConfig.legMinutes = clamp(cmd.legMinutes, 0.5, 5);
          if (cmd.turnDir) this.holdConfig.turnDir = cmd.turnDir;
        }
        this.lateralMode = 'hold';
        if (!this.engaged) this.engage();
        break;
      }
      case 'setHoldConfig':
        if (cmd.legMinutes && Number.isFinite(cmd.legMinutes)) {
          this.holdConfig.legMinutes = clamp(cmd.legMinutes, 0.5, 5);
        }
        if (cmd.turnDir) this.holdConfig.turnDir = cmd.turnDir;
        break;
      case 'holdPresent':
        if (this.lastTelemetry) {
          if (cmd.axis === 'alt' || cmd.axis === 'all') {
            this.targetAltFt = Math.round(this.lastTelemetry.altitude / 50) * 50;
            this.verticalMode = 'alt';
          }
          if (cmd.axis === 'hdg' || cmd.axis === 'all') {
            this.targetHdgDeg = Math.round(normalizeHeading(this.lastTelemetry.heading));
            this.lateralMode = 'hdg';
          }
          if (cmd.axis === 'spd' || cmd.axis === 'all') {
            this.targetKias = Math.max(60, Math.round(this.lastTelemetry.kias));
            this.speedMode = 'kts';
          }
        }
        if (!this.engaged) this.engage();
        break;
      case 'setLandingArm':
        this.landingArmed = cmd.armed;
        if (!cmd.armed) this.landingRetarded = false;
        break;
      case 'setEnvelopeProtection':
        this.envelopeProtection = cmd.enabled;
        if (!cmd.enabled) this.fma.protection = null;
        break;
      case 'setHoverMode':
        this.hoverMode = cmd.enabled;
        if (cmd.enabled && !this.engaged) {
          this.engage();
        }
        break;
    }

    this.updateFmaLabels();
    this.renderPad();
    this.emitSnapshot(true);
  }

  private toggleMaster(): void {
    if (this.engaged) {
      this.disengage();
    } else {
      this.engage();
    }
  }

  private engage(): void {
    if (this.activeFailures.has('electrical')) {
      this.ctx?.anchors.showToast('AP++ Unavailable: Electrical Failure');
      return;
    }
    this.engaged = true;
    this.stickOverrideSec = 0;
    this.fma.protection = null;
    this.rollPid.reset();
    this.pitchPid.reset();
    this.speedPitchPid.reset();
    this.throttlePid.reset();

    if (this.lastTelemetry) {
      if (this.targetAltFt <= 0) {
        this.targetAltFt = Math.max(500, Math.round(this.lastTelemetry.altitude / 100) * 100);
      }
      if (this.lateralMode === 'hdg' && this.targetHdgDeg === 0) {
        this.targetHdgDeg = Math.round(normalizeHeading(this.lastTelemetry.heading));
      }
      if (this.targetKias <= 0) {
        this.targetKias = Math.max(120, Math.round(this.lastTelemetry.kias));
      }
    }

    this.ctx?.emitDiag?.('AP_PP_ENGAGED', {
      lat: this.lateralMode,
      vert: this.verticalMode,
      spd: this.speedMode
    });
    this.updateFmaLabels();
    this.renderPad();
    this.emitSnapshot(true);
  }

  private disengage(reason?: string): void {
    this.engaged = false;
    this.landingRetarded = false;
    try {
      window.geofs?.autopilot?.turnOff?.();
    } catch {
      // Ignore sim teardown differences
    }
    this.ctx?.emitDiag?.('AP_PP_DISENGAGED', { reason: reason ?? 'manual' });
    this.updateFmaLabels();
    this.renderPad();
    this.emitSnapshot(true);
  }

  private initHoldAtCurrent(t: FlightTelemetry, legMinutes?: number, turnDir?: 'L' | 'R'): void {
    const inboundCourseDeg = Math.round(normalizeHeading(t.heading));
    const resolvedTurnDir = turnDir ?? this.holdConfig.turnDir;
    const entryType = classifyHoldEntry(t.heading, inboundCourseDeg, resolvedTurnDir);
    const phase =
      entryType === 'teardrop'
        ? 'entry-teardrop'
        : entryType === 'parallel'
          ? 'entry-parallel'
          : 'outbound';
    this.holdConfig = {
      fixLat: t.lat,
      fixLon: t.lon,
      inboundCourseDeg,
      legMinutes: legMinutes ? clamp(legMinutes, 0.5, 5) : this.holdConfig.legMinutes,
      turnDir: resolvedTurnDir,
      entryType,
      wcaDeg: 0,
      phase,
      legElapsedSec: 0
    };
  }

  private checkStickOverride(dt: number): boolean {
    const controls = window.controls;
    if (!controls) return false;
    const rawRoll = Math.abs(Number(controls.rawRoll ?? 0));
    const rawPitch = Math.abs(Number(controls.rawPitch ?? 0));
    if (Math.max(rawRoll, rawPitch) > 0.25) {
      this.stickOverrideSec += dt;
      return this.stickOverrideSec >= 0.3;
    }
    this.stickOverrideSec = 0;
    return false;
  }

  private evaluateEnvelope(t: FlightTelemetry): ApPpFmaState['protection'] {
    if (t.groundContact) return null;
    const vne = t.aircraft?.vSpeeds?.Vne ?? 380;
    const mmo = t.aircraft?.machSpeeds?.Vne ?? 0.92;
    if (t.aoa > 14.5 || (t.aglFeet > 100 && t.kias < 85 && t.aircraft?.category !== 'rotorcraft' && !this.hoverMode)) {
      return 'ALPHA FLOOR';
    }
    if (t.kias > vne * 0.98 || t.mach > mmo * 0.99) {
      return 'OVERSPEED';
    }
    if (Math.abs(t.roll) > 33) {
      return 'BANK LIMIT';
    }
    return null;
  }

  private stepThrottleChannel(t: FlightTelemetry, dt: number, protection: ApPpFmaState['protection']): void {
    if (this.activeFailures.has('pitot')) return;

    if (this.hoverMode) {
      const altErr = this.targetAltFt - t.altitude;
      const desiredVs = clamp(altErr * 1.5, -600, 600);
      const vsErr = desiredVs - t.vs;
      const collCmd = clamp(0.54 + vsErr * 0.00045, 0.05, 0.98);
      this.ctx?.sim.setThrottle(collCmd);
      return;
    }

    if (protection === 'ALPHA FLOOR') {
      this.ctx?.sim.setThrottle(1.0);
      return;
    }
    if (protection === 'OVERSPEED') {
      this.ctx?.sim.setThrottle(0.05);
      return;
    }

    if (this.landingArmed && !this.landingRetarded && t.aglFeet <= 27 && !t.groundContact) {
      this.landingRetarded = true;
      this.verticalMode = 'flare';
      this.ctx?.sim.setThrottle(0);
      return;
    }
    if (this.landingRetarded) {
      this.ctx?.sim.setThrottle(0);
      if (t.groundContact && window.controls?.airbrakes) {
        window.controls.airbrakes.positionTarget = 1;
      }
      return;
    }

    if (this.verticalMode === 'flch' || this.verticalMode === 'vnav') {
      const altDiff = this.targetAltFt - t.altitude;
      if (Math.abs(altDiff) > 350) {
        // FLCH: climb at CLB thrust, descend at IDLE
        this.ctx?.sim.setThrottle(altDiff > 0 ? 0.92 : 0.04);
        return;
      }
    }

    if (this.speedMode === 'off') return;

    // Automatic KIAS <-> Mach crossover in climb/cruise
    const crossAlt = crossoverAltitudeFt(this.targetKias, this.targetMach);
    const effectiveKias =
      this.speedMode === 'mach' || (this.verticalMode === 'vnav' && t.altitude >= crossAlt)
        ? machToKias(this.targetMach, t.altitude)
        : this.targetKias;

    const speedErr = effectiveKias - t.kias;
    const throttleCmd = this.throttlePid.step(speedErr, dt);
    this.ctx?.sim.setThrottle(clamp(throttleCmd, 0, 1));
  }

  private stepLateralChannel(t: FlightTelemetry, dt: number): void {
    const hydFail = this.activeFailures.has('hydraulics') || this.activeFailures.has('controls');
    const maxBank = this.lateralMode === 'hold' && t.kias < 180 ? 15 : hydFail ? 15 : 25;

    if (this.hoverMode) {
      // Self-leveling rotorcraft SAS roll damping
      const rollCmd = this.rollPid.step(0 - t.roll, dt);
      if (window.controls) {
        window.controls.roll = clamp(rollCmd, -0.5, 0.5);
      }
      return;
    }

    if (this.lateralMode === 'off') return;

    if (this.landingArmed && t.groundContact) {
      // Wing-level rollout on runway
      const rollCmd = this.rollPid.step(0 - t.roll, dt);
      if (window.controls) {
        window.controls.roll = clamp(rollCmd, -0.4, 0.4);
      }
      return;
    }

    // Hybrid Override: delegate basic HDG to native GeoFS autopilot if available and no bank limit hit
    if (this.lateralMode === 'hdg' && window.geofs?.autopilot && Math.abs(t.roll) <= 30) {
      const ap = window.geofs.autopilot;
      if (ap.values) {
        (ap.values as Record<string, unknown>).course = this.targetHdgDeg;
      }
      return;
    }

    // Custom PID roll guidance for HOLD, LAT/LON, WPT, LOC
    let desiredHeading = this.targetHdgDeg;
    if (this.lateralMode === 'hold') {
      const windSpeedKts = Number(window.weather?.currentWindSpeed ?? 0);
      const windDirFromDeg = Number((window.weather as { currentWindDirection?: number } | undefined)?.currentWindDirection ?? 0);
      const res = stepHoldPattern(this.holdConfig, t.lat, t.lon, t.heading, dt, {
        tasKts: kiasToKtas(t.kias, t.altitude),
        windSpeedKts: Number.isFinite(windSpeedKts) ? windSpeedKts : 0,
        windDirFromDeg: Number.isFinite(windDirFromDeg) ? windDirFromDeg : 0
      });
      desiredHeading = res.targetHeadingDeg;
    } else if (this.lateralMode === 'latlon' || this.lateralMode === 'wpt') {
      desiredHeading = greatCircleBearingDeg(t.lat, t.lon, this.targetLat, this.targetLon);
    }

    const hdgErr = headingDeltaDeg(desiredHeading, t.heading);
    const desiredBank = clamp(hdgErr * 0.9, -maxBank, maxBank);
    const bankErr = desiredBank - t.roll;
    const rollCmd = this.rollPid.step(bankErr, dt) * (hydFail ? 0.5 : 1.0);

    if (window.controls) {
      window.controls.roll = clamp(rollCmd, -0.7, 0.7);
    }
  }

  private stepVerticalChannel(t: FlightTelemetry, dt: number, protection: ApPpFmaState['protection']): void {
    const controls = window.controls;
    if (!controls) return;

    if (this.hoverMode) {
      // Arrest forward drift into a steady hover
      const desiredPitch = clamp(-t.groundSpeed * 0.12, -8, 8);
      controls.pitch = clamp(this.pitchPid.step(desiredPitch - t.pitch, dt), -0.5, 0.5);
      return;
    }

    if (protection === 'ALPHA FLOOR') {
      const pitchCmd = this.pitchPid.step(-2 - t.pitch, dt);
      controls.pitch = clamp(pitchCmd, -0.6, 0.6);
      return;
    }
    if (protection === 'OVERSPEED') {
      const pitchCmd = this.pitchPid.step(6 - t.pitch, dt);
      controls.pitch = clamp(pitchCmd, -0.6, 0.6);
      return;
    }

    if (this.verticalMode === 'off') return;

    if (this.landingArmed && t.aglFeet <= 50 && !t.groundContact && this.verticalMode !== 'flare') {
      this.verticalMode = 'flare';
    }

    if (this.verticalMode === 'flare') {
      const flareProgress = clamp((50 - t.aglFeet) / 50, 0, 1);
      const targetPitch = t.groundContact ? 0 : 1.5 + flareProgress * 3.0;
      controls.pitch = clamp(this.pitchPid.step(targetPitch - t.pitch, dt), -0.4, 0.5);
      return;
    }

    // Hybrid Override: basic ALT delegates to native GeoFS autopilot when available
    if (this.verticalMode === 'alt' && window.geofs?.autopilot?.values) {
      (window.geofs.autopilot.values as Record<string, unknown>).altitude = this.targetAltFt;
      return;
    }

    const altErr = this.targetAltFt - t.altitude;

    if ((this.verticalMode === 'flch' || this.verticalMode === 'vnav') && Math.abs(altErr) > 350) {
      const crossAlt = crossoverAltitudeFt(this.targetKias, this.targetMach);
      const targetSpd =
        this.speedMode === 'mach' || t.altitude >= crossAlt ? machToKias(this.targetMach, t.altitude) : this.targetKias;
      // Pitch up if faster than target speed during climb, pitch down if slower
      const spdDiff = t.kias - targetSpd;
      const basePitch = altErr > 0 ? 7.5 : -4.5;
      const desiredPitch = clamp(basePitch + this.speedPitchPid.step(spdDiff, dt), -14, 18);
      controls.pitch = clamp(this.pitchPid.step(desiredPitch - t.pitch, dt), -0.6, 0.6);
      return;
    }

    // Auto-V/S or manual V/S or ALT* capture
    let desiredVs = this.targetVsFpm;
    if (this.verticalMode === 'gs' && Number.isFinite(t.glideslopeDeviation)) {
      desiredVs = clamp(-700 + Number(t.glideslopeDeviation) * 250, -1800, 500);
    } else if (this.autoVs || this.verticalMode === 'flch' || this.verticalMode === 'vnav') {
      desiredVs = clamp(altErr * 2.5, -2400, 2400);
    }

    const vsErr = desiredVs - t.vs;
    const desiredPitch = clamp(t.pitch + vsErr * 0.0035, -12, 16);
    controls.pitch = clamp(this.pitchPid.step(desiredPitch - t.pitch, dt), -0.6, 0.6);
  }

  private updateFmaLabels(): void {
    if (!this.engaged) {
      this.fma = { thr: 'OFF', vert: 'OFF', lat: 'OFF', protection: this.fma.protection };
      return;
    }
    if (this.hoverMode) {
      this.fma = { thr: 'HOV', vert: 'ALT HOV', lat: 'LVL', protection: this.fma.protection };
      return;
    }
    const thr =
      this.landingRetarded
        ? 'IDLE'
        : this.fma.protection === 'ALPHA FLOOR'
          ? 'TOGA'
          : this.verticalMode === 'flch' || this.verticalMode === 'vnav'
            ? this.targetAltFt > (this.lastTelemetry?.altitude ?? 0)
              ? 'THR CLB'
              : 'THR IDLE'
            : this.speedMode === 'mach'
              ? 'MACH'
              : this.speedMode === 'kts'
                ? 'SPD'
                : 'MAN';

    const vert =
      this.verticalMode === 'off'
        ? 'OFF'
        : this.verticalMode === 'flare'
          ? 'FLARE'
          : this.verticalMode === 'flch'
            ? 'FLCH'
            : this.verticalMode === 'vnav'
              ? 'VNAV'
              : this.verticalMode === 'gs'
                ? 'G/S'
                : this.verticalMode === 'vs'
                  ? this.autoVs
                    ? 'V/S AUTO'
                    : 'V/S'
                  : 'ALT';

    const lat =
      this.lateralMode === 'off'
        ? 'OFF'
        : this.lateralMode === 'hold'
          ? `HOLD ${this.holdConfig.phase === 'inbound' ? 'IN' : this.holdConfig.phase === 'outbound' ? 'OUT' : 'TRN'}`
          : this.lateralMode === 'latlon'
            ? 'LAT/LON'
            : this.lateralMode === 'wpt'
              ? 'WPT'
              : this.lateralMode === 'loc'
                ? 'LOC'
                : 'HDG';

    this.fma = { thr, vert, lat, protection: this.fma.protection };
  }

  private renderPad(): void {
    if (!this.padEl) return;
    this.padEl.classList.toggle('pad-active', this.engaged);
    this.padEl.setAttribute('aria-pressed', String(this.engaged));
    if (this.fmaLineEl) {
      this.fmaLineEl.textContent = this.engaged ? `${this.fma.thr}·${this.fma.lat}` : 'STBY';
    }
  }

  private getSnapshot(): ApPpSnapshot {
    const t = this.lastTelemetry;
    const ktas = t ? Math.round(kiasToKtas(t.kias, t.altitude)) : 0;
    const cross = crossoverAltitudeFt(this.targetKias, this.targetMach);
    let dist: number | null = null;
    let brg: number | null = null;
    if (t && (this.lateralMode === 'hold' || this.lateralMode === 'latlon' || this.lateralMode === 'wpt')) {
      const lat = this.lateralMode === 'hold' ? this.holdConfig.fixLat : this.targetLat;
      const lon = this.lateralMode === 'hold' ? this.holdConfig.fixLon : this.targetLon;
      dist = Number(greatCircleDistanceNm(t.lat, t.lon, lat, lon).toFixed(1));
      brg = Math.round(greatCircleBearingDeg(t.lat, t.lon, lat, lon));
    }

    const degradedReason = this.activeFailures.has('electrical')
      ? 'Electrical Failure'
      : this.activeFailures.has('pitot')
        ? 'Pitot-Static Failure'
        : this.activeFailures.has('hydraulics')
          ? 'Hydraulic Degradation'
          : null;

    return {
      engaged: this.engaged,
      beta: true,
      speedMode: this.speedMode,
      lateralMode: this.lateralMode,
      verticalMode: this.verticalMode,
      targetKias: this.targetKias,
      targetMach: Number(this.targetMach.toFixed(2)),
      targetAltFt: this.targetAltFt,
      targetHdgDeg: this.targetHdgDeg,
      targetVsFpm: this.targetVsFpm,
      autoVs: this.autoVs,
      targetLat: this.targetLat,
      targetLon: this.targetLon,
      waypointName: this.waypointName,
      landingArmed: this.landingArmed,
      landingRetarded: this.landingRetarded,
      envelopeProtection: this.envelopeProtection,
      hoverMode: this.hoverMode,
      isRotorcraft: t?.aircraft?.category === 'rotorcraft' || t?.collective !== null && t?.collective !== undefined,
      ktas,
      crossoverAltFt: cross,
      distanceToFixNm: dist,
      bearingToFixDeg: brg,
      holdConfig: { ...this.holdConfig },
      fma: { ...this.fma },
      degradedReason
    };
  }

  private emitSnapshot(force: boolean): void {
    if (!this.ctx) return;
    if (force || (this.lastTelemetry && this.lastTelemetry.timestamp - this.lastEmitMs >= 250)) {
      this.lastEmitMs = this.lastTelemetry?.timestamp ?? Date.now();
      this.ctx.emitEvent('autopilot-pp:state', this.getSnapshot());
    }
  }
}
