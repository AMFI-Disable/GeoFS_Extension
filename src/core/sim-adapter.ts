import { V_SPEEDS, type AircraftOverride, type VSpeeds } from './aircraft-profile';
import type {
  AircraftCategory,
  AircraftProfile,
  FlightTelemetry,
  SimMajorVersion
} from '../types/module';
import type { GeoFSAircraftInstance } from '../types/geofs.d';

interface StaticAircraftSpec {
  name: string;
  category: AircraftCategory;
  engineCount: number;
  maxFlaps: number;
  hasGear: boolean;
  hasSpoilers: boolean;
  oew: number;
  mtow: number;
  maxFuel: number;
}

const AIRCRAFT_CATALOG: Record<string, StaticAircraftSpec> = {
  '1': { name: 'Piper Cub', category: 'ga-piston', engineCount: 1, maxFlaps: 0, hasGear: false, hasSpoilers: false, oew: 340, mtow: 550, maxFuel: 45 },
  '2': { name: 'Cessna 172', category: 'ga-piston', engineCount: 1, maxFlaps: 3, hasGear: false, hasSpoilers: false, oew: 757, mtow: 1157, maxFuel: 160 },
  '10': { name: 'Airbus A380', category: 'airliner-quad', engineCount: 4, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 277000, mtow: 575000, maxFuel: 253983 },
  '16': { name: 'Douglas DC-3', category: 'ga-piston', engineCount: 2, maxFlaps: 3, hasGear: true, hasSpoilers: false, oew: 7650, mtow: 11430, maxFuel: 1800 },
  '18': { name: 'Sukhoi Su-35', category: 'fighter', engineCount: 2, maxFlaps: 2, hasGear: true, hasSpoilers: true, oew: 18400, mtow: 34500, maxFuel: 11500 },
  '20': { name: 'Concorde', category: 'supersonic', engineCount: 4, maxFlaps: 0, hasGear: true, hasSpoilers: false, oew: 78700, mtow: 185000, maxFuel: 95600 },
  '22': { name: 'Cessna 152', category: 'ga-piston', engineCount: 1, maxFlaps: 3, hasGear: false, hasSpoilers: false, oew: 490, mtow: 757, maxFuel: 98 },
  '23': { name: 'Piper PA-28 Warrior II', category: 'ga-piston', engineCount: 1, maxFlaps: 3, hasGear: false, hasSpoilers: false, oew: 612, mtow: 1107, maxFuel: 145 },
  '24': { name: 'Airbus A350-900', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 142400, mtow: 280000, maxFuel: 112600 },
  '25': { name: 'Boeing 777-300ER', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 167800, mtow: 351500, maxFuel: 145538 },
  '27': { name: 'Boeing F/A-18F Super Hornet', category: 'fighter', engineCount: 2, maxFlaps: 3, hasGear: true, hasSpoilers: true, oew: 14552, mtow: 29937, maxFuel: 6200 },
  '29': { name: 'Dassault Rafale', category: 'fighter', engineCount: 2, maxFlaps: 0, hasGear: true, hasSpoilers: false, oew: 10300, mtow: 24500, maxFuel: 4700 },
  '242': { name: 'Airbus A321neo', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 50100, mtow: 97000, maxFuel: 26000 },
  '2953': { name: 'Space Shuttle Atlantis', category: 'specialized', engineCount: 3, maxFlaps: 1, hasGear: true, hasSpoilers: true, oew: 78000, mtow: 110000, maxFuel: 0 },
  '2973': { name: 'Airbus A350-1000 XWB', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 155000, mtow: 319000, maxFuel: 125000 },
  '3179': { name: 'Boeing 787-10', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 135500, mtow: 254000, maxFuel: 101000 },
  '5086': { name: 'Airbus A321-211', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 48500, mtow: 93500, maxFuel: 23700 },
  '5193': { name: 'Boeing 747-8i', category: 'airliner-quad', engineCount: 4, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 220128, mtow: 447700, maxFuel: 191000 },
  '5527': { name: 'Boeing 747-400', category: 'airliner-quad', engineCount: 4, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 183520, mtow: 396890, maxFuel: 173472 },
  '5551': { name: 'Comac C919-100', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 42000, mtow: 71500, maxFuel: 15600 },
  '5566': { name: 'Embraer E175', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 21886, mtow: 38790, maxFuel: 9335 }
};

export function parseSimMajor(rawVersion: unknown): SimMajorVersion | null {
  if (rawVersion === undefined || rawVersion === null) return null;
  const match = String(rawVersion).trim().match(/^(?:v)?([34])(?:\.\d+)*$/i);
  if (!match) return null;
  return Number(match[1]) as SimMajorVersion;
}

export function classifyAircraft(name: string, mass: number, engineCount: number, maxThrust: number): AircraftCategory {
  const lower = name.toLowerCase();
  if (/\b(?:helicopter|rotorcraft|robinson|alouette|ec135|h145|r[- ]?(?:22|44|66)|uh[- ]?60|mi[- ]?8|bo[- ]?105|bell[ -]?(?:206|407))\b/.test(lower)) {
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
    lower.includes('f-22') || lower.includes('yf-23') || lower.includes('t-38')
  ) {
    return 'fighter';
  }
  if (lower.includes('atr') || lower.includes('dash') || lower.includes('q400') || lower.includes('king air')) {
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
    const catalogSpec = Object.hasOwn(AIRCRAFT_CATALOG, acId) ? AIRCRAFT_CATALOG[acId] : undefined;
    const engineCount = Array.isArray(ac.engines) && ac.engines.length > 0 ? ac.engines.length : (catalogSpec?.engineCount ?? 1);

    let profile: AircraftProfile;
    if (catalogSpec) {
      profile = {
        id: acId,
        ...catalogSpec,
        engineCount,
        isDynamic: false
      };
    } else {
      const def = ac.definition || {};
      const catalogEntry = window.geofs?.aircraftList?.[acId] || ac.aircraftRecord;
      const name = String(catalogEntry?.name || def.externalName || def.name || ac.name || `Aircraft ${acId}`);
      const mass = Number(def.mass || ac.setup?.mass || 1200);
      const maxThrust = Number(def.maxThrust || 0);
      const hasGear = def.hasGear !== undefined ? Boolean(def.hasGear) : (Boolean(def.gearPositions?.length) || ac.parts?.gear !== undefined);
      const hasSpoilers = def.hasAirbrakes !== undefined ? Boolean(def.hasAirbrakes) : (ac.parts?.airbrakes !== undefined || ac.parts?.spoilers !== undefined);
      const maxFlaps = def.flapsSteps ?? (def.flapsPositions ? Math.max(0, def.flapsPositions.length - 1) : 0);

      profile = {
        id: acId,
        name,
        category: classifyAircraft(name, mass, engineCount, maxThrust),
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
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) continue;
      // GeoFS aircraft definitions encode positive reference speeds below 10 in Mach.
      if (value < 10) machSpeeds[speed] = value;
      else vSpeeds[speed] = value;
    }

    const override = Object.hasOwn(this.overrides, acId) ? this.overrides[acId] : undefined;
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
      if (typeof c.throttleLeft === 'number' && typeof c.throttleRight === 'number') {
        return [c.throttleLeft, c.throttleRight];
      }
    }
    return [typeof c.throttle === 'number' && Number.isFinite(c.throttle) ? c.throttle : 0];
  }

  public setThrottle(value: number): void {
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

  public buildTelemetrySnapshot(dt: number, simMajor: SimMajorVersion): FlightTelemetry {
    const v = window.geofs?.animation?.values || {};
    const ac = window.geofs?.aircraft?.instance;
    const lla = ac?.llaLocation || [0, 0, 0];

    const aircraft = this.getAircraftProfile();
    const isRotorcraft = aircraft?.category === 'rotorcraft';
    const collective = window.controls?.throttle;
    const torque = v.rotorTorque ?? v.torque;

    return Object.freeze({
      timestamp: Date.now(),
      dt,
      simMajor,
      paused: Boolean(window.geofs?.isPaused?.()),
      isNight: this.isNight(),
      aircraft,
      kias: Number.isFinite(v.kias) ? Number(v.kias) : 0,
      mach: Number.isFinite(v.mach) ? Number(v.mach) : 0,
      altitude: Number.isFinite(v.altitude) ? Number(v.altitude) : 0,
      aglFeet: Number.isFinite(v.haglFeet) ? Number(v.haglFeet) : 0,
      vs: Number.isFinite(v.verticalSpeed) ? Number(v.verticalSpeed) : 0,
      heading: Number.isFinite(v.heading360) ? Number(v.heading360) : 0,
      groundSpeed: Number.isFinite(v.groundSpeedKnt) ? Number(v.groundSpeedKnt) : (Number.isFinite(v.groundSpeed) ? Number(v.groundSpeed) : 0),
      gForce: Number.isFinite(v.loadFactor) ? Number(v.loadFactor) : 1,
      aoa: Number.isFinite(v.aoa) ? Number(v.aoa) : 0,
      pitch: Number.isFinite(v.pitch) ? Number(v.pitch) : 0,
      roll: Number.isFinite(v.roll) ? Number(v.roll) : 0,
      groundContact: Boolean(ac?.groundContact),
      crashed: Boolean(ac?.crashed),
      autopilotOn: Boolean(window.geofs?.autopilot?.on),
      reverserActive: Boolean(v.reverser || window.controls?.reversers),
      throttles: this.getThrottles(),
      collective: isRotorcraft && typeof collective === 'number' && Number.isFinite(collective)
        ? Math.min(1, Math.max(0, collective)) : null,
      rotorTorque: isRotorcraft && typeof torque === 'number' && Number.isFinite(torque) ? torque : null,
      parkingBrake: Boolean(v.parkingBrake),
      gearDown: Number(v.gearPosition ?? 0) > 0.5,
      flapsTarget: Number(v.flapsTarget ?? 0),
      lightsOn: Boolean(v.lights),
      lat: Number(lla[0] || 0),
      lon: Number(lla[1] || 0)
    });
  }
}
