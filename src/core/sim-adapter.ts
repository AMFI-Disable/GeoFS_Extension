import { V_SPEEDS, type AircraftOverride, type VSpeeds } from './aircraft-profile';
import {
  AIRCRAFT_CATALOG,
  NAMED_AIRCRAFT_SPECS,
  getAllCatalogAircraft,
  type StaticAircraftSpec
} from './aircraft-catalog';
import type {
  AircraftCategory,
  AircraftProfile,
  FlightTelemetry,
  SimMajorVersion
} from '../types/module';
import type { GeoFSAircraftInstance } from '../types/geofs.d';

export { AIRCRAFT_CATALOG, NAMED_AIRCRAFT_SPECS, getAllCatalogAircraft, type StaticAircraftSpec };

export function parseSimMajor(rawVersion: unknown): SimMajorVersion | null {
  if (rawVersion === undefined || rawVersion === null) return null;
  const match = String(rawVersion).trim().match(/^(?:geofs\s*)?(?:v)?(\d+)(?:[.\-_\sa-z].*)?$/i);
  if (!match) return null;
  const major = Number(match[1]);
  return major === 3 || major === 4 ? major : null;
}

export function classifyAircraft(name: string, mass: number, engineCount: number, maxThrust: number): AircraftCategory {
  const lower = name.toLowerCase();
  if (/\b(?:helicopter|rotorcraft|robinson|alouette|ec135|h145|r[- ]?(?:22|44|66)|uh[- ]?60|mi[- ]?8|bo[- ]?105|bell[ -]?(?:206|407)|black hawk|chinook|apache|ch[- ]?47|ah[- ]?64)\b/.test(lower)) {
    return 'rotorcraft';
  }
  if (lower.includes('concorde') || lower.includes('xb-70') || lower.includes('tu-144') || lower.includes('sr-71')) {
    return 'supersonic';
  }
  if (lower.includes('shuttle') || lower.includes('falcon 9') || lower.includes('x-15')) {
    return 'specialized';
  }
  if (
    lower.includes('f-18') || lower.includes('f/a-18') || lower.includes('f-35') ||
    lower.includes('su-35') || lower.includes('rafale') || lower.includes('f-16') ||
    lower.includes('f-22') || lower.includes('yf-23') || lower.includes('t-38') ||
    lower.includes('typhoon') || lower.includes('gripen') || lower.includes('f-15')
  ) {
    return 'fighter';
  }
  if (lower.includes('atr') || lower.includes('dash') || lower.includes('q400') || lower.includes('king air') || lower.includes('pc-12')) {
    return 'turboprop';
  }
  if (engineCount >= 4 && mass > 80000) return 'airliner-quad';
  if (mass > 15000 || maxThrust > 25000) return 'airliner-twin';
  return 'ga-piston';
}

export class SimAdapter {
  private lastAcRef: GeoFSAircraftInstance | undefined;
  private lastDefinition: GeoFSAircraftInstance['definition'];
  private cachedProfile: AircraftProfile | null = null;
  private overrides: Record<string, AircraftOverride> = {};

  public setAircraftOverrides(overrides: Record<string, AircraftOverride> | undefined): void {
    this.overrides = overrides ?? {};
    this.cachedProfile = null;
  }

  public getMajorVersion(): SimMajorVersion | null {
    return parseSimMajor(window.geofs?.version);
  }

  public isNight(): boolean {
    const animNight = window.geofs?.animation?.values?.night;
    if (typeof animNight === 'boolean') return animNight;
    if (typeof animNight === 'number' && Number.isFinite(animNight)) return animNight > 0;
    const simHour = window.weather?.localTime;
    if (typeof simHour === 'number' && Number.isFinite(simHour)) {
      const hour = ((simHour % 24) + 24) % 24;
      return hour < 6 || hour >= 19;
    }
    const env = window.geofs?.environment;
    if (env && typeof env.sunElevation === 'number') {
      return env.sunElevation < -0.02;
    }
    if (env && typeof env.time === 'number') {
      const hour = ((env.time % 24) + 24) % 24;
      return hour < 6 || hour >= 19;
    }
    return false;
  }

  public getLitRunways() {
    return window.geofs?.fx?.litRunways ?? null;
  }

  public getNearRunways() {
    return window.geofs?.runways?.nearRunways ?? null;
  }

  public getCesiumScene() {
    return window.geofs?.api?.viewer?.scene ?? null;
  }

  public getAircraftProfile(): AircraftProfile | null {
    const ac = window.geofs?.aircraft?.instance;
    const rawId = ac?.id ?? ac?.aircraftRecord?.id;
    if (!ac || rawId == null) {
      this.lastAcRef = undefined;
      this.cachedProfile = null;
      return null;
    }
    if (ac === this.lastAcRef && ac.definition === this.lastDefinition && this.cachedProfile?.id === String(rawId)) {
      return this.cachedProfile;
    }

    const acId = String(rawId);
    const def = ac.definition || {};
    const catalogEntry = window.geofs?.aircraftList?.[acId] || ac.aircraftRecord;
    const rawName = String(catalogEntry?.name || def.externalName || def.name || ac.name || `Aircraft ${acId}`);
    const idSpec = Object.hasOwn(AIRCRAFT_CATALOG, acId) ? AIRCRAFT_CATALOG[acId] : undefined;
    const catalogSpec = idSpec ?? NAMED_AIRCRAFT_SPECS.find((entry) => rawName.toLowerCase().includes(entry.match))?.spec;
    const engineCount = Array.isArray(ac.engines) && ac.engines.length > 0 ? ac.engines.length : (catalogSpec?.engineCount ?? 1);

    let profile: AircraftProfile;
    if (catalogSpec) {
      profile = {
        id: acId,
        ...catalogSpec,
        vSpeeds: undefined,
        name: idSpec ? catalogSpec.name : rawName,
        engineCount,
        isDynamic: !idSpec
      };
    } else {
      const rawMass = Number(def.mass || ac.setup?.mass || 1200);
      const mass = Number.isFinite(rawMass) && rawMass > 0 ? rawMass : 1200;
      const rawThrust = Number(def.maxThrust);
      const maxThrust = Number.isFinite(rawThrust) && rawThrust >= 0 ? rawThrust : 0;
      const hasGear = def.hasGear !== undefined ? Boolean(def.hasGear) : (Boolean(def.gearPositions?.length) || ac.parts?.gear !== undefined);
      const hasSpoilers = def.hasAirbrakes !== undefined ? Boolean(def.hasAirbrakes) : (ac.parts?.airbrakes !== undefined || ac.parts?.spoilers !== undefined);
      const maxFlaps = def.flapsSteps ?? (def.flapsPositions ? Math.max(0, def.flapsPositions.length - 1) : 0);
      const category = classifyAircraft(rawName, mass, engineCount, maxThrust);

      profile = {
        id: acId,
        name: rawName,
        category,
        engineCount,
        maxFlaps,
        hasGear,
        hasSpoilers,
        oew: Math.round(mass * 0.55),
        mtow: Math.round(mass * 1.25),
        maxFuel: Math.round(mass * 0.35),
        isDynamic: true
      };
    }

    const vSpeeds: VSpeeds = {};
    const machSpeeds: VSpeeds = {};
    const rawSpeeds = ac.definition?.Vspeeds;
    for (const speed of V_SPEEDS) {
      const value = rawSpeeds?.[speed.toUpperCase()] ?? rawSpeeds?.[speed];
      if (value === undefined && !rawSpeeds) {
        const fallback = catalogSpec?.vSpeeds[speed.toLowerCase()];
        if (fallback !== undefined) vSpeeds[speed] = fallback;
      }
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) continue;
      // GeoFS aircraft definitions encode positive reference speeds below 10 in Mach.
      if (value < 10) machSpeeds[speed] = value;
      else vSpeeds[speed] = value;
    }

    const override = [acId, rawName.toLowerCase(), profile.name.toLowerCase()]
      .map((key) => Object.hasOwn(this.overrides, key) ? this.overrides[key] : undefined)
      .find(Boolean);
    profile = { ...profile, ...override, vSpeeds: { ...vSpeeds, ...override?.vSpeeds }, machSpeeds };
    this.lastAcRef = ac;
    this.lastDefinition = ac.definition;
    this.cachedProfile = profile;
    return profile;
  }

  public getThrottles(): number[] {
    const c = window.controls;
    const ac = window.geofs?.aircraft?.instance;
    if (!c) return [0];

    const engineCount = Array.isArray(ac?.engines) ? ac.engines.length : 1;
    if (engineCount >= 2) {
      const numbered: number[] = [];
      for (let i = 1; i <= Math.min(engineCount, 4); i++) {
        const val = c[`throttle${i}`];
        if (typeof val === 'number' && Number.isFinite(val)) numbered.push(val);
      }
      if (numbered.length === engineCount) return numbered;
      if (typeof c.throttleLeft === 'number' && Number.isFinite(c.throttleLeft) &&
          typeof c.throttleRight === 'number' && Number.isFinite(c.throttleRight)) {
        return [c.throttleLeft, c.throttleRight];
      }
    }
    return [typeof c.throttle === 'number' && Number.isFinite(c.throttle) ? c.throttle : 0];
  }

  public setThrottle(value: number): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) return;
    const c = window.controls;
    if (!c) return;
    const clamped = Math.max(-1, Math.min(1, value));
    if (typeof c.manipulatorSetters?.setThrottle === 'function') {
      c.manipulatorSetters.setThrottle(clamped);
    } else {
      c.throttle = clamped;
    }
    if (c.throttleLeft !== undefined) c.throttleLeft = clamped;
    if (c.throttleRight !== undefined) c.throttleRight = clamped;
    if (c.throttle1 !== undefined) c.throttle1 = clamped;
    if (c.throttle2 !== undefined) c.throttle2 = clamped;
    if (c.throttle3 !== undefined) c.throttle3 = clamped;
    if (c.throttle4 !== undefined) c.throttle4 = clamped;
  }

  public stopEngines(): boolean {
    const aircraft = window.geofs?.aircraft?.instance;
    if (typeof aircraft?.stopEngines === 'function') aircraft.stopEngines();
    else if (typeof aircraft?.stopEngine === 'function') aircraft.stopEngine();
    else return false;
    return true;
  }

  public setFlaps(step: number): void {
    if (!Number.isFinite(step)) return;
    const ac = window.geofs?.aircraft?.instance;
    const c = window.controls;
    if (c?.flaps && typeof c.setters?.setFlaps?.set === 'function') {
      c.flaps.target = step;
      c.setters.setFlaps.set();
    } else if (typeof ac?.setFlaps === 'function') {
      ac.setFlaps(step);
    }
  }

  public toggleGear(): void {
    window.controls?.setters?.setGear?.set?.();
  }

  private isCrashed(
    ac: { crashed?: unknown; animationValue?: Record<string, unknown> } | undefined,
    v: Record<string, unknown>
  ): boolean {
    if (ac?.crashed) return true;
    const geofsAny = window.geofs as Record<string, unknown> | undefined;
    if (geofsAny?.crashed) return true;
    if (v?.crashed || ac?.animationValue?.crashed) return true;
    if (typeof document !== 'undefined' && typeof document.querySelector === 'function') {
      const crashOverlay = document.querySelector('.geofs-crash, .geofs-crash-overlay');
      if (crashOverlay instanceof HTMLElement) {
        const style = typeof getComputedStyle === 'function' ? getComputedStyle(crashOverlay) : null;
        if (style ? style.display !== 'none' && style.visibility !== 'hidden' : crashOverlay.offsetParent !== null) {
          return true;
        }
      }
    }
    return false;
  }

  public buildTelemetrySnapshot(dt: number, simMajor: SimMajorVersion): FlightTelemetry {
    const v = window.geofs?.animation?.values || {};
    const ac = window.geofs?.aircraft?.instance;
    const lla = ac?.llaLocation || [0, 0, 0];
    const aircraft = this.getAircraftProfile();
    const isRotorcraft = aircraft?.category === 'rotorcraft';
    const collective = window.controls?.throttle;
    const torque = v.rotorTorque ?? v.torque;
    const finite = (value: unknown, fallback = 0): number =>
      typeof value === 'number' && Number.isFinite(value) ? value : fallback;

    return Object.freeze({
      timestamp: Date.now(),
      dt: finite(dt, 0.016),
      simMajor,
      paused: Boolean(window.geofs?.isPaused?.()),
      isNight: this.isNight(),
      aircraft,
      kias: finite(v.kias, 0),
      mach: finite(v.mach, 0),
      altitude: finite(v.altitude, 0),
      aglFeet: finite(v.haglFeet, 0),
      vs: finite(v.verticalSpeed, 0),
      heading: finite(v.heading360, 0),
      groundSpeed: finite(v.groundSpeedKnt, finite(v.groundSpeed, 0)),
      gForce: finite(v.loadFactor, 1),
      aoa: finite(v.aoa, 0),
      pitch: finite(v.atilt, finite(v.pitch, 0)),
      roll: finite(v.aroll, finite(v.roll, 0)),
      groundContact: Boolean(ac?.groundContact),
      crashed: this.isCrashed(ac, v),
      autopilotOn: Boolean(window.geofs?.autopilot?.on),
      reverserActive: Boolean(v.reverser || window.controls?.reversers),
      throttles: this.getThrottles(),
      collective: isRotorcraft && typeof collective === 'number' && Number.isFinite(collective)
        ? Math.min(1, Math.max(0, collective)) : null,
      rotorTorque: isRotorcraft && typeof torque === 'number' && Number.isFinite(torque) ? torque : null,
      parkingBrake: Boolean(v.parkingBrake),
      gearDown: finite(v.gearPosition, 0) < 0.5,
      flapsTarget: finite(v.flapsTarget, 0),
      airbrakesPosition: Number.isFinite(v.airbrakesPosition) ? Number(v.airbrakesPosition) : undefined,
      glideslopeDeviation: v.NAVVNAV && Number.isFinite(v.NAVGlideAngleDeviation) ? Number(v.NAVGlideAngleDeviation) : undefined,
      lightsOn: Boolean(v.lights),
      lat: finite(lla[0], 0),
      lon: finite(lla[1], 0)
    });
  }
}
