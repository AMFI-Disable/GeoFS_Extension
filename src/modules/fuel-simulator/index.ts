import type { GeoFSAircraftInstance } from '../../types/geofs.d';
import type { ExtensionSettings } from '../../types/settings';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export function resolveScaledInertiaVector(
  body: GeoFSAircraftInstance['rigidBody'] | undefined,
  definition: GeoFSAircraftInstance['definition'] | undefined,
  originalMass: number,
  targetMass: number
): { base: [number, number, number]; scaled: [number, number, number]; isConstantFactor?: boolean } | null {
  if (!Number.isFinite(originalMass) || originalMass <= 0 || !Number.isFinite(targetMass) || targetMass <= 0) {
    return null;
  }

  const extractPositiveVec3 = (candidate: unknown): [number, number, number] | null => {
    if (
      Array.isArray(candidate) &&
      candidate.length === 3 &&
      candidate.every((n) => typeof n === 'number' && Number.isFinite(n) && n > 0)
    ) {
      return [candidate[0], candidate[1], candidate[2]];
    }
    if (candidate && typeof candidate === 'object') {
      const obj = candidate as { x?: unknown; y?: unknown; z?: unknown };
      const readAxis = (val: unknown): number | null => {
        if (typeof val === 'number' && Number.isFinite(val) && val > 0) return val;
        if (typeof val === 'function') {
          try {
            const res = (val as () => unknown).call(candidate);
            if (typeof res === 'number' && Number.isFinite(res) && res > 0) return res;
          } catch {
            return null;
          }
        }
        return null;
      };
      const x = readAxis(obj.x);
      const y = readAxis(obj.y);
      const z = readAxis(obj.z);
      if (x !== null && y !== null && z !== null) return [x, y, z];
    }
    return null;
  };

  let base: [number, number, number] | null = null;
  const bodyRecord = body as Record<string, unknown> | undefined;

  // GeoFS V4.0 rigidBody stores m_localInvInertia as a 3x3 matrix where setMassProps(mass, a)
  // sets m_localInvInertia[i][i] = a[i] / mass. Recovering a[i] = diag[i] * originalMass
  // preserves exact rotational inertia scaling with mass and bit-exact teardown restoration.
  const localInvMat = bodyRecord?.m_localInvInertia;
  if (
    Array.isArray(localInvMat) &&
    localInvMat.length >= 3 &&
    Array.isArray(localInvMat[0]) &&
    Array.isArray(localInvMat[1]) &&
    Array.isArray(localInvMat[2])
  ) {
    const diag: [number, number, number] = [
      Number(localInvMat[0][0]),
      Number(localInvMat[1][1]),
      Number(localInvMat[2][2])
    ];
    if (diag.every((n) => Number.isFinite(n) && n > 0)) {
      const factor: [number, number, number] = [
        diag[0] * originalMass,
        diag[1] * originalMass,
        diag[2] * originalMass
      ];
      if (factor.every((n) => Number.isFinite(n) && n > 0)) {
        return { base: factor, scaled: factor, isConstantFactor: true };
      }
    }
  }

  for (const key of ['inertia', 'localInertia', 'inertiaTensor']) {
    const vec = extractPositiveVec3(bodyRecord?.[key]);
    if (vec) {
      base = vec;
      break;
    }
  }

  if (!base && typeof bodyRecord?.getInvInertiaDiagLocal === 'function') {
    try {
      const inv = extractPositiveVec3((bodyRecord.getInvInertiaDiagLocal as () => unknown)());
      if (inv) {
        const inverted: [number, number, number] = [1 / inv[0], 1 / inv[1], 1 / inv[2]];
        if (inverted.every((n) => Number.isFinite(n) && n > 0)) {
          base = inverted;
        }
      }
    } catch {
      base = null;
    }
  }

  // Only accept definition.inertiaTensor when it is an actual 3-axis inertia tensor (never tensorFactor or [1,1,1] factors).
  if (!base) {
    const candidate = extractPositiveVec3(definition?.inertiaTensor);
    if (candidate) {
      const looksLikeDimensionlessFactor = originalMass > 100 && Math.min(...candidate) <= 5;
      if (!looksLikeDimensionlessFactor) {
        base = candidate;
      }
    }
  }

  if (!base) return null;
  const scale = Math.max(0.25, Math.min(4, targetMass / originalMass));
  const scaled: [number, number, number] = [base[0] * scale, base[1] * scale, base[2] * scale];
  if (!scaled.every((n) => Number.isFinite(n) && n > 0)) return null;
  return { base, scaled };
}

// Both archived Fuel Simulator scripts derive fuel consumption from engine thrust across active throttles.
export function fuelBurnKgHr(aircraft: GeoFSAircraftInstance, telemetry: FlightTelemetry, dynamicSfc = false): number {
  if (aircraft.engine?.on === false) return 0;
  const profile = telemetry.aircraft;
  const name = profile?.name ?? '';
  if (profile?.id === '2953' || /atlantis/i.test(name)) return 0;

  const rawRated = Number(aircraft.definition?.maxThrust);
  const ratedThrust = Number.isFinite(rawRated) && rawRated > 0 ? rawRated : 0;
  const engines = aircraft.engines;
  const thrustOf = (engine: { currentThrust?: number; thrust?: number; on?: boolean }) => {
    if (engine.on === false) return 0;
    if (typeof engine.currentThrust === 'number' && Number.isFinite(engine.currentThrust)) {
      return Math.abs(engine.currentThrust);
    }
    return typeof engine.thrust === 'number' && Number.isFinite(engine.thrust)
      ? Math.max(0, engine.thrust)
      : 0;
  };
  let thrust = engines?.reduce((sum, engine) => sum + thrustOf(engine), 0) ?? 0;

  if (telemetry.simMajor === 4 && !engines?.length) {
    thrust = Object.values(aircraft.parts ?? {}).reduce((sum, part) => sum + thrustOf(part), 0);
  }
  if (thrust <= 0 && ratedThrust > 0) {
    const throttles = telemetry.throttles.length ? telemetry.throttles : [0];
    const avgThrottle = throttles.reduce((sum, t) => sum + (Number.isFinite(t) ? Math.abs(t) : 0), 0) / throttles.length;
    thrust = ratedThrust * avgThrottle;
  }

  const alt = Number.isFinite(telemetry.altitude) ? telemetry.altitude : 0;
  const sfc = /shuttle|rocket|x-15/i.test(name) ? 0.85 : ratedThrust > 50_000 ? 0.0075 : 0.0095;
  const altitudeFactor = dynamicSfc ? Math.max(0.1, 1 - alt / 50_000) ** 1.1 : 1;
  const reverseActive = telemetry.reverserActive || telemetry.throttles.some((t) => Number.isFinite(t) && t < -0.05);
  const reverseFactor = telemetry.simMajor === 4 && reverseActive ? 1.35 : 1;
  const burn = thrust * sfc * altitudeFactor * reverseFactor;
  return Number.isFinite(burn) && burn >= 0 ? burn : 0;
}

const FUEL_OPTIONS: ReadonlyArray<readonly [keyof Pick<ExtensionSettings, 'fuelDynamicSfc' | 'fuelRealisticTanks' | 'fuelAutoRefuel'>, string, string]> = [
  ['fuelDynamicSfc', 'ALTITUDE BURN', 'Scales fuel consumption with air density, altitude, and multi-throttle reverse thrust'],
  ['fuelRealisticTanks', 'REAL TANKS', 'Drains center tank first, then wing tanks with roll imbalance physics'],
  ['fuelAutoRefuel', 'AUTO-REFUEL', 'Automatically maintains 100% fuel load']
];

export interface FuelTanks {
  left: number;
  center: number;
  right: number;
}

export function drainFuelTanks(tanks: FuelTanks, drain: number): FuelTanks {
  const safeDrain = Number.isFinite(drain) && drain > 0 ? drain : 0;
  const center = Math.max(0, tanks.center - safeDrain);
  const wingDrain = Math.max(0, safeDrain - tanks.center) / 2;
  return { center, left: Math.max(0, tanks.left - wingDrain), right: Math.max(0, tanks.right - wingDrain) };
}

const FUEL_STYLES = `
  .geofs-ext-fuel-root {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    font-family: Helvetica, Arial, sans-serif;
  }
  .geofs-ext-fuel-bar-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 3px;
  }
  .geofs-ext-fuel-bar-fill {
    height: 100%;
    background: #4caf50;
    transition: width 0.2s ease, background 0.2s ease;
  }
  .geofs-ext-fuel-btn {
    background: #000000;
    color: #cccccc;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 5px 6px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .geofs-ext-fuel-btn.is-active {
    background: rgba(34, 197, 94, 0.2);
    border-color: #4caf50;
    color: #ffffff;
  }
`;

export class FuelSimulatorModule implements IModule {
  public readonly id = 'fuel-simulator';
  public readonly name = 'Fuel Simulator';
  public readonly description = 'Multi-engine specific fuel consumption physics with tank burn, flameout lock, and mass sync.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private unmountTab: (() => void) | null = null;
  private styleEl: HTMLStyleElement | null = null;
  private aircraft: GeoFSAircraftInstance | undefined;
  private massTarget:
    | {
        definition: NonNullable<GeoFSAircraftInstance['definition']>;
        originalDefinitionMass: number | undefined;
        body: NonNullable<GeoFSAircraftInstance['rigidBody']> | undefined;
        originalMass: number | undefined;
        originalInertia: [number, number, number] | null;
        inertiaConstantFactor: boolean;
        lastBodyMass: number | undefined;
        calledSetMassProps: boolean;
      }
    | undefined;
  private massSyncElapsed = 0;
  private fuelKg = 0;
  private maxFuelKg = 0;
  private flameoutTriggered = false;
  private tanks: FuelTanks = { left: 0, center: 0, right: 0 };
  private lowAlert = false;
  private bingoAlert = false;
  private panel: HTMLElement | null = null;
  private weightEl: HTMLElement | null = null;
  private tanksEl: HTMLElement | null = null;
  private statusEl: HTMLElement | null = null;
  private slider: HTMLInputElement | null = null;
  private sliderLabelEl: HTMLElement | null = null;
  private barFillEl: HTMLElement | null = null;
  private pctEl: HTMLElement | null = null;
  private burnEl: HTMLElement | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;

    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'geofs-ext-fuel-styles';
      style.textContent = FUEL_STYLES;
      document.head?.appendChild(style);
      this.styleEl = style;
    }

    const el = document.createElement('div');
    el.className = 'geofs-ext-fuel-root';
    el.innerHTML = `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:10px;color:#aaaaaa;text-transform:uppercase;">Fuel Quantity</span>
          <strong data-role="pct" style="font-size:18px;font-weight:700;color:#ffffff;">--%</strong>
        </div>
        <div class="geofs-ext-fuel-bar-track"><div data-role="bar-fill" class="geofs-ext-fuel-bar-fill" style="width:100%;"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;font-size:11px;">
        <div>
          <div style="font-size:9px;color:#aaaaaa;text-transform:uppercase;">Burn Rate</div>
          <strong data-role="burn" style="font-size:12px;white-space:nowrap;">0 kg/h</strong>
        </div>
        <div>
          <div style="font-size:9px;color:#aaaaaa;text-transform:uppercase;">Gross Weight</div>
          <strong data-role="weight" style="font-size:12px;white-space:nowrap;">—</strong>
        </div>
      </div>
      <div data-role="tanks" style="font-size:9px;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Tanks L/C/R: —</div>
      <div>
        <input type="range" min="0" max="100" step="1" value="100" data-role="slider" style="width:100%;margin:0;accent-color:#4caf50;cursor:pointer;">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:#aaaaaa;margin-top:2px;">
          <span>SET FUEL</span><span data-role="slider-label">100%</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;">
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelDynamicSfc" title="${FUEL_OPTIONS[0][2]}">${FUEL_OPTIONS[0][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelRealisticTanks" title="${FUEL_OPTIONS[1][2]}">${FUEL_OPTIONS[1][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="fuelAutoRefuel" title="${FUEL_OPTIONS[2][2]}">${FUEL_OPTIONS[2][1]}</button>
        <button type="button" class="geofs-ext-fuel-btn" data-role="refuel" style="border-color:#4caf50;color:#ffffff;">REFUEL 100%</button>
      </div>
      <div data-role="status" style="font-size:9px;font-weight:700;color:#4caf50;text-align:center;letter-spacing:0.6px;white-space:nowrap;">SYSTEMS LIVE</div>
    `;

    this.pctEl = el.querySelector('[data-role="pct"]');
    this.barFillEl = el.querySelector('[data-role="bar-fill"]');
    this.burnEl = el.querySelector('[data-role="burn"]');
    this.weightEl = el.querySelector('[data-role="weight"]');
    this.tanksEl = el.querySelector('[data-role="tanks"]');
    this.slider = el.querySelector('[data-role="slider"]');
    this.sliderLabelEl = el.querySelector('[data-role="slider-label"]');
    this.statusEl = el.querySelector('[data-role="status"]');
    this.panel = el;

    const setPercent = (percent: number) => {
      if (!this.aircraft || this.maxFuelKg <= 0 || !Number.isFinite(percent)) return;
      const clamped = Math.max(0, Math.min(100, percent));
      this.fuelKg = (clamped / 100) * this.maxFuelKg;
      if (this.fuelKg > 0) this.restoreFuelEngine();
      this.distributeFuel();
      this.massSyncElapsed = 1;
      const profile = context.sim.getAircraftProfile();
      if (profile && profile.id !== '2953' && !/atlantis/i.test(profile.name)) {
        const payload = Math.max(profile.mtow * 0.1, profile.mtow - profile.oew - profile.maxFuel) * 0.5;
        const mass = profile.oew + payload + this.fuelKg;
        if (Number.isFinite(mass) && mass > 0) {
          this.syncMass(this.aircraft, mass, true);
          this.massSyncElapsed = 0;
          if (this.weightEl) this.weightEl.textContent = `${Math.round(mass).toLocaleString()} kg`;
        }
      }
      if (this.sliderLabelEl) this.sliderLabelEl.textContent = `${Math.round(clamped)}%`;
      context.anchors.showToast(`Fuel set to ${Math.round(clamped)}%`);
    };

    this.slider?.addEventListener('input', () => {
      if (this.sliderLabelEl) this.sliderLabelEl.textContent = `${Math.round(this.slider?.valueAsNumber ?? 100)}%`;
    });
    this.slider?.addEventListener('change', () => setPercent(this.slider?.valueAsNumber ?? 100));
    el.querySelector('[data-role="refuel"]')?.addEventListener('click', () => setPercent(100));

    for (const [key] of FUEL_OPTIONS) {
      el.querySelector(`[data-role="${key}"]`)?.addEventListener('click', () => {
        context.updateSettings({ [key]: !context.getSettings()[key] });
      });
    }

    this.onSettingsChange(context.getSettings());
    this.unmountTab = context.anchors.registerHudTab('fuel', 'FUEL', el);
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    for (const [key] of FUEL_OPTIONS) {
      const button = this.panel?.querySelector(`[data-role="${key}"]`);
      button?.classList.toggle('is-active', Boolean(settings[key]));
      button?.setAttribute('aria-pressed', String(Boolean(settings[key])));
    }
  }

  private distributeFuel(): void {
    this.tanks = { left: this.fuelKg * 0.3, center: this.fuelKg * 0.4, right: this.fuelKg * 0.3 };
  }

  public update(telemetry: FlightTelemetry): void {
    const aircraft = window.geofs?.aircraft?.instance;
    const profile = telemetry.aircraft;
    if (aircraft !== this.aircraft) {
      this.restoreMass();
      this.aircraft = aircraft;
      const safeMaxFuel = typeof profile?.maxFuel === 'number' && Number.isFinite(profile.maxFuel) && profile.maxFuel > 0
        ? profile.maxFuel
        : 0;
      this.fuelKg = this.maxFuelKg = safeMaxFuel;
      this.flameoutTriggered = false;
      this.distributeFuel();
      this.lowAlert = this.bingoAlert = false;
      this.massSyncElapsed = 1;
    }
    if (!aircraft?.definition || !profile) return;

    const nextMaxFuel = Number.isFinite(profile.maxFuel) && profile.maxFuel > 0 ? profile.maxFuel : 0;
    if (this.maxFuelKg !== nextMaxFuel) {
      const fraction = this.maxFuelKg > 0 ? this.fuelKg / this.maxFuelKg : 1;
      this.maxFuelKg = nextMaxFuel;
      this.fuelKg = fraction * this.maxFuelKg;
      this.distributeFuel();
      if (this.fuelKg > 0) this.restoreFuelEngine();
    }
    if (this.maxFuelKg <= 0) {
      this.restoreMass();
      if (this.pctEl) this.pctEl.textContent = '—';
      if (this.burnEl) this.burnEl.textContent = '—';
      if (this.weightEl) this.weightEl.textContent = '—';
      if (this.tanksEl) this.tanksEl.textContent = 'Tanks L/C/R: —';
      return;
    }
    if (telemetry.paused || telemetry.crashed) {
      if (this.pctEl) this.pctEl.textContent = `${((this.fuelKg / this.maxFuelKg) * 100).toFixed(1)}%`;
      if (this.burnEl) this.burnEl.textContent = '0 kg/h';
      return;
    }

    const settings = this.ctx?.getSettings();
    const dt = Number.isFinite(telemetry.dt) && telemetry.dt > 0 ? Math.min(telemetry.dt, 1) : 0;
    const burnRate = fuelBurnKgHr(aircraft, telemetry, Boolean(settings?.fuelDynamicSfc));
    const rawDrain = (burnRate * dt) / 3600;
    const drain = Number.isFinite(rawDrain) && rawDrain > 0 ? Math.min(this.fuelKg, rawDrain) : 0;
    this.fuelKg = Number.isFinite(this.fuelKg) ? Math.max(0, this.fuelKg - drain) : this.maxFuelKg;
    const atlantis = profile.id === '2953' || /atlantis/i.test(profile.name);

    if (settings?.fuelAutoRefuel || atlantis) {
      this.fuelKg = this.maxFuelKg;
      this.restoreFuelEngine();
      this.distributeFuel();
    } else if (settings?.fuelRealisticTanks) {
      this.tanks = drainFuelTanks(this.tanks, drain);
      const imbalance = this.tanks.left - this.tanks.right;
      const axis = aircraft.object3d?.worldRotation?.[0];
      if (
        !telemetry.groundContact &&
        telemetry.kias >= 10 &&
        Array.isArray(axis) &&
        axis.length >= 3 &&
        Number.isFinite(imbalance) &&
        Math.abs(imbalance) > 10 &&
        Number.isFinite(axis[0]) &&
        Number.isFinite(axis[1]) &&
        Number.isFinite(axis[2])
      ) {
        const axisLen = Math.hypot(axis[0], axis[1], axis[2]);
        const torque = Math.max(-5, Math.min(5, imbalance * 0.000001));
        if (axisLen > 0.001 && Number.isFinite(axisLen) && Number.isFinite(torque)) {
          const invLen = 1 / axisLen;
          aircraft.rigidBody?.applyTorque?.([axis[0] * invLen * torque, axis[1] * invLen * torque, axis[2] * invLen * torque]);
        }
      }
    } else {
      this.distributeFuel();
    }

    if (this.fuelKg <= 0) {
      this.fuelKg = 0;
      if (!this.flameoutTriggered && aircraft.engine?.on !== false) {
        this.flameoutTriggered = this.ctx?.sim.stopEngines() ?? false;
        if (this.flameoutTriggered) {
          this.ctx?.emitEvent('fuel:exhausted', { aircraftId: profile.id });
          this.ctx?.anchors.showToast('FUEL EXHAUSTED — ENGINE FLAMEOUT', 'critical');
        }
      }
      if (this.flameoutTriggered) {
        this.ctx?.sim.setThrottle(0);
      }
    }

    if (!atlantis) {
      this.massSyncElapsed += dt;
      if (this.massSyncElapsed >= 1) {
        this.massSyncElapsed = 0;
        const payload = Math.max(profile.mtow * 0.1, profile.mtow - profile.oew - profile.maxFuel) * 0.5;
        const mass = profile.oew + payload + this.fuelKg;
        if (Number.isFinite(mass) && mass > 0) {
          this.syncMass(aircraft, mass);
          if (this.weightEl) this.weightEl.textContent = `${Math.round(mass).toLocaleString()} kg`;
        }
      }
    }

    const percent = (this.fuelKg / this.maxFuelKg) * 100;
    if (percent < 5 && !this.bingoAlert) {
      this.ctx?.anchors.showToast('Bingo Fuel — Emergency Declared', 'critical');
      this.bingoAlert = true;
    } else if (percent < 15 && !this.lowAlert) {
      this.ctx?.anchors.showToast('Low Fuel Alert', 'warn');
      this.lowAlert = true;
    } else if (percent > 16) {
      this.lowAlert = this.bingoAlert = false;
    }

    if (this.slider && (typeof document === 'undefined' || document.activeElement !== this.slider)) {
      this.slider.value = String(Math.round(percent));
      if (this.sliderLabelEl) this.sliderLabelEl.textContent = `${Math.round(percent)}%`;
    }
    if (this.pctEl) this.pctEl.textContent = `${percent.toFixed(1)}%`;
    if (this.barFillEl) {
      this.barFillEl.style.width = `${Math.max(0, Math.min(100, percent)).toFixed(1)}%`;
      this.barFillEl.style.background = percent < 5 ? '#ef4444' : percent < 15 ? '#eab308' : '#4caf50';
    }
    const displayedBurn = Math.round(this.fuelKg > 0 ? burnRate : 0);
    if (this.burnEl) this.burnEl.textContent = `${displayedBurn.toLocaleString()} kg/h`;
    if (this.tanksEl) {
      this.tanksEl.textContent = `Tanks L/C/R: ${Math.round(this.tanks.left)} / ${Math.round(this.tanks.center)} / ${Math.round(this.tanks.right)} kg`;
    }
    if (this.statusEl) {
      if (this.fuelKg <= 0) {
        this.statusEl.textContent = 'EMPTY — THROTTLE LOCKED';
        this.statusEl.style.color = '#ef4444';
      } else if (percent < 5) {
        this.statusEl.textContent = 'BINGO FUEL EMERGENCY';
        this.statusEl.style.color = '#ef4444';
      } else if (percent < 15) {
        this.statusEl.textContent = 'LOW FUEL ADVISORY';
        this.statusEl.style.color = '#eab308';
      } else {
        this.statusEl.textContent = 'SYSTEMS LIVE';
        this.statusEl.style.color = '#4caf50';
      }
    }

    this.ctx?.emitEvent('fuel:state', { pct: percent, burnKgHr: displayedBurn });
  }

  private syncMass(aircraft: GeoFSAircraftInstance, mass: number, manualChange = false): void {
    const body = aircraft.rigidBody;
    const definition = aircraft.definition;
    if (body !== this.massTarget?.body || definition !== this.massTarget?.definition) this.restoreMass();
    if (!definition || !Number.isFinite(mass) || mass <= 0) return;

    const safeMass = Math.max(1, Math.min(10_000_000, mass));
    const prevDefMass = definition.mass;
    const changed = Math.abs((prevDefMass ?? 0) - safeMass) > 5;

    if (!this.massTarget) {
      const initialBodyMass = typeof body?.mass === 'number' && Number.isFinite(body.mass) && body.mass > 0
        ? body.mass
        : prevDefMass;
      this.massTarget = {
        definition,
        originalDefinitionMass: prevDefMass,
        body,
        originalMass: initialBodyMass,
        originalInertia: null,
        inertiaConstantFactor: false,
        lastBodyMass: initialBodyMass,
        calledSetMassProps: false
      };
    }

    definition.mass = safeMass;

    let bodySynced = false;
    if (body && typeof body.setMassProps === 'function' && this.massTarget.originalMass !== undefined) {
      let scaledInertia: [number, number, number] | null = null;
      if (this.massTarget.originalInertia) {
        if (this.massTarget.inertiaConstantFactor) {
          scaledInertia = this.massTarget.originalInertia;
        } else {
          const scale = Math.max(0.25, Math.min(4, safeMass / this.massTarget.originalMass));
          scaledInertia = [
            this.massTarget.originalInertia[0] * scale,
            this.massTarget.originalInertia[1] * scale,
            this.massTarget.originalInertia[2] * scale
          ];
        }
      } else {
        const inertiaInfo = resolveScaledInertiaVector(body, definition, this.massTarget.originalMass, safeMass);
        if (inertiaInfo) {
          this.massTarget.originalInertia = inertiaInfo.base;
          this.massTarget.inertiaConstantFactor = Boolean(inertiaInfo.isConstantFactor);
          scaledInertia = inertiaInfo.scaled;
        }
      }

      if (scaledInertia) {
        const prevBodyMass = this.massTarget.lastBodyMass ?? this.massTarget.originalMass;
        // Apply pilot-selected fuel loads exactly. Batch small changes from continuous fuel burn.
        const bodyThreshold = manualChange ? 0 : Math.max(2, this.massTarget.originalMass * 0.01);
        if (!this.massTarget.calledSetMassProps || Math.abs(prevBodyMass - safeMass) > bodyThreshold) {
          body.setMassProps(safeMass, scaledInertia);
          this.massTarget.calledSetMassProps = true;
          this.massTarget.lastBodyMass = safeMass;
          bodySynced = true;
        }
      }
    }

    if (changed || bodySynced) {
      this.ctx?.emitDiag?.('FUEL_MASS_SYNC', {
        massKg: Math.round(safeMass),
        fuelKg: Math.round(this.fuelKg),
        rigidBodySynced: this.massTarget.calledSetMassProps
      });
    }
  }

  private restoreMass(): void {
    const target = this.massTarget;
    if (target) {
      if (target.originalDefinitionMass === undefined) delete target.definition.mass;
      else target.definition.mass = target.originalDefinitionMass;

      if (
        target.calledSetMassProps &&
        target.body &&
        typeof target.body.setMassProps === 'function' &&
        target.originalMass !== undefined &&
        target.originalInertia
      ) {
        target.body.setMassProps(target.originalMass, target.originalInertia);
      }
    }
    this.massTarget = undefined;
  }

  private restoreFuelEngine(): void {
    if (!this.flameoutTriggered || !this.aircraft || this.aircraft.crashed) return;
    if (this.aircraft !== window.geofs?.aircraft?.instance) return;
    if (this.aircraft.startEngines) this.aircraft.startEngines();
    else this.aircraft.startEngine?.();
    this.flameoutTriggered = false;
  }

  public destroy(): void {
    this.restoreMass();
    this.aircraft = undefined;
    this.unmountTab?.();
    this.unmountTab = null;
    this.styleEl?.remove();
    this.styleEl = null;
    this.pctEl = null;
    this.barFillEl = null;
    this.burnEl = null;
    this.weightEl = null;
    this.tanksEl = null;
    this.statusEl = null;
    this.slider = null;
    this.sliderLabelEl = null;
    this.panel = null;
    this.ctx = null;
  }
}
