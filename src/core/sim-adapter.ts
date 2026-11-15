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
  vSpeeds: Record<string, number>;
}

const AIRCRAFT_CATALOG: Record<string, StaticAircraftSpec> = {
  '1': { name: 'Piper Cub', category: 'ga-piston', engineCount: 1, maxFlaps: 0, hasGear: false, hasSpoilers: false, oew: 340, mtow: 550, maxFuel: 45, vSpeeds: { vr: 38, vref: 50, vne: 106 } },
  '2': { name: 'Cessna 172', category: 'ga-piston', engineCount: 1, maxFlaps: 3, hasGear: false, hasSpoilers: false, oew: 757, mtow: 1157, maxFuel: 160, vSpeeds: { vr: 55, vref: 65, vfe: 85, vne: 163 } },
  '10': { name: 'Airbus A380', category: 'airliner-quad', engineCount: 4, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 277000, mtow: 575000, maxFuel: 253983, vSpeeds: { v1: 145, vr: 155, v2: 165, vref: 142, vfe: 222, vne: 340 } },
  '16': { name: 'Douglas DC-3', category: 'ga-piston', engineCount: 2, maxFlaps: 3, hasGear: true, hasSpoilers: false, oew: 7650, mtow: 11430, maxFuel: 1800, vSpeeds: { vr: 78, vref: 85, vfe: 112, vne: 211 } },
  '18': { name: 'Sukhoi Su-35', category: 'fighter', engineCount: 2, maxFlaps: 2, hasGear: true, hasSpoilers: true, oew: 18400, mtow: 34500, maxFuel: 11500, vSpeeds: { vr: 130, vref: 142, vfe: 250, vne: 755 } },
  '20': { name: 'Concorde', category: 'supersonic', engineCount: 4, maxFlaps: 0, hasGear: true, hasSpoilers: false, oew: 78700, mtow: 185000, maxFuel: 95600, vSpeeds: { v1: 165, vr: 195, v2: 220, vref: 162, vne: 1350 } },
  '22': { name: 'Cessna 152', category: 'ga-piston', engineCount: 1, maxFlaps: 3, hasGear: false, hasSpoilers: false, oew: 490, mtow: 757, maxFuel: 98, vSpeeds: { vr: 50, vref: 60, vfe: 85, vne: 149 } },
  '23': { name: 'Piper PA-28 Warrior II', category: 'ga-piston', engineCount: 1, maxFlaps: 3, hasGear: false, hasSpoilers: false, oew: 612, mtow: 1107, maxFuel: 145, vSpeeds: { vr: 55, vref: 63, vfe: 103, vne: 160 } },
  '24': { name: 'Airbus A350-900', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 142400, mtow: 280000, maxFuel: 112600, vSpeeds: { v1: 142, vr: 148, v2: 156, vref: 138, vfe: 230, vne: 340 } },
  '25': { name: 'Boeing 777-300ER', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 167800, mtow: 351500, maxFuel: 145538, vSpeeds: { v1: 152, vr: 160, v2: 168, vref: 146, vfe: 235, vne: 330 } },
  '27': { name: 'Boeing F/A-18F Super Hornet', category: 'fighter', engineCount: 2, maxFlaps: 3, hasGear: true, hasSpoilers: true, oew: 14552, mtow: 29937, maxFuel: 6200, vSpeeds: { vr: 135, vref: 138, vfe: 250, vne: 750 } },
  '29': { name: 'Dassault Rafale', category: 'fighter', engineCount: 2, maxFlaps: 0, hasGear: true, hasSpoilers: false, oew: 10300, mtow: 24500, maxFuel: 4700, vSpeeds: { vr: 125, vref: 132, vne: 750 } },
  '242': { name: 'Airbus A321neo', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 50100, mtow: 97000, maxFuel: 26000, vSpeeds: { v1: 138, vr: 143, v2: 149, vref: 135, vfe: 230, vne: 350 } },
  '2953': { name: 'Space Shuttle Atlantis', category: 'specialized', engineCount: 3, maxFlaps: 1, hasGear: true, hasSpoilers: true, oew: 78000, mtow: 110000, maxFuel: 0, vSpeeds: { vr: 195, vref: 195, vne: 450 } },
  '2973': { name: 'Airbus A350-1000 XWB', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 155000, mtow: 319000, maxFuel: 125000, vSpeeds: { v1: 148, vr: 155, v2: 162, vref: 143, vfe: 230, vne: 340 } },
  '3179': { name: 'Boeing 787-10', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 135500, mtow: 254000, maxFuel: 101000, vSpeeds: { v1: 146, vr: 152, v2: 160, vref: 141, vfe: 235, vne: 340 } },
  '5086': { name: 'Airbus A321-211', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 48500, mtow: 93500, maxFuel: 23700, vSpeeds: { v1: 136, vr: 142, v2: 148, vref: 134, vfe: 230, vne: 350 } },
  '5193': { name: 'Boeing 747-8i', category: 'airliner-quad', engineCount: 4, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 220128, mtow: 447700, maxFuel: 191000, vSpeeds: { v1: 154, vr: 164, v2: 174, vref: 150, vfe: 240, vne: 365 } },
  '5527': { name: 'Boeing 747-400', category: 'airliner-quad', engineCount: 4, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 183520, mtow: 396890, maxFuel: 173472, vSpeeds: { v1: 150, vr: 160, v2: 170, vref: 146, vfe: 235, vne: 365 } },
  '5551': { name: 'Comac C919-100', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 42000, mtow: 71500, maxFuel: 15600, vSpeeds: { v1: 132, vr: 138, v2: 145, vref: 130, vfe: 225, vne: 340 } },
  '5566': { name: 'Embraer E175', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 21886, mtow: 38790, maxFuel: 9335, vSpeeds: { v1: 124, vr: 130, v2: 138, vref: 122, vfe: 215, vne: 320 } }
};

const NAMED_AIRCRAFT_SPECS: Array<{ match: string; spec: StaticAircraftSpec }> = [
  { match: 'a320', spec: { name: 'Airbus A320', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 42600, mtow: 78000, maxFuel: 19150, vSpeeds: { v1: 132, vr: 138, v2: 145, vref: 130, vfe: 230, vne: 350 } } },
  { match: 'a330', spec: { name: 'Airbus A330-300', category: 'airliner-twin', engineCount: 2, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 124500, mtow: 242000, maxFuel: 78000, vSpeeds: { v1: 138, vr: 146, v2: 154, vref: 136, vfe: 225, vne: 330 } } },
  { match: 'a340', spec: { name: 'Airbus A340-600', category: 'airliner-quad', engineCount: 4, maxFlaps: 5, hasGear: true, hasSpoilers: true, oew: 177800, mtow: 380000, maxFuel: 155000, vSpeeds: { v1: 150, vr: 158, v2: 168, vref: 144, vfe: 230, vne: 330 } } },
  { match: '737 max', spec: { name: 'Boeing 737 MAX 8', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 45070, mtow: 82190, maxFuel: 20730, vSpeeds: { v1: 136, vr: 142, v2: 149, vref: 135, vfe: 230, vne: 340 } } },
  { match: '737', spec: { name: 'Boeing 737-800', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 41413, mtow: 79015, maxFuel: 20894, vSpeeds: { v1: 135, vr: 141, v2: 148, vref: 134, vfe: 230, vne: 340 } } },
  { match: '757', spec: { name: 'Boeing 757-200', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 57840, mtow: 115680, maxFuel: 34700, vSpeeds: { v1: 138, vr: 144, v2: 152, vref: 132, vfe: 235, vne: 350 } } },
  { match: '767', spec: { name: 'Boeing 767-300ER', category: 'airliner-twin', engineCount: 2, maxFlaps: 6, hasGear: true, hasSpoilers: true, oew: 90010, mtow: 186880, maxFuel: 73000, vSpeeds: { v1: 142, vr: 149, v2: 157, vref: 138, vfe: 235, vne: 360 } } },
  { match: 'atr 72', spec: { name: 'ATR 72-600', category: 'turboprop', engineCount: 2, maxFlaps: 4, hasGear: true, hasSpoilers: false, oew: 13500, mtow: 23000, maxFuel: 5000, vSpeeds: { v1: 98, vr: 103, v2: 112, vref: 106, vfe: 175, vne: 250 } } },
  { match: 'q400', spec: { name: 'Dash 8 Q400', category: 'turboprop', engineCount: 2, maxFlaps: 4, hasGear: true, hasSpoilers: false, oew: 17819, mtow: 29574, maxFuel: 5318, vSpeeds: { v1: 105, vr: 110, v2: 118, vref: 112, vfe: 180, vne: 285 } } },
  { match: 'king air', spec: { name: 'Beechcraft King Air 350i', category: 'turboprop', engineCount: 2, maxFlaps: 3, hasGear: true, hasSpoilers: false, oew: 4513, mtow: 6804, maxFuel: 1640, vSpeeds: { v1: 96, vr: 100, v2: 108, vref: 102, vfe: 170, vne: 263 } } },
  { match: 'f-16', spec: { name: 'F-16C Fighting Falcon', category: 'fighter', engineCount: 1, maxFlaps: 2, hasGear: true, hasSpoilers: true, oew: 8570, mtow: 19200, maxFuel: 3200, vSpeeds: { vr: 140, vref: 148, vne: 800 } } },
  { match: 'f-22', spec: { name: 'F-22A Raptor', category: 'fighter', engineCount: 2, maxFlaps: 2, hasGear: true, hasSpoilers: true, oew: 19700, mtow: 38000, maxFuel: 8200, vSpeeds: { vr: 135, vref: 140, vne: 800 } } },
  { match: 'f-35', spec: { name: 'F-35A Lightning II', category: 'fighter', engineCount: 1, maxFlaps: 2, hasGear: true, hasSpoilers: true, oew: 13290, mtow: 31750, maxFuel: 8278, vSpeeds: { vr: 138, vref: 145, vne: 750 } } },
  { match: 'typhoon', spec: { name: 'Eurofighter Typhoon', category: 'fighter', engineCount: 2, maxFlaps: 2, hasGear: true, hasSpoilers: true, oew: 11000, mtow: 23500, maxFuel: 4500, vSpeeds: { vr: 130, vref: 136, vne: 800 } } },
  { match: 'sr-71', spec: { name: 'Lockheed SR-71 Blackbird', category: 'supersonic', engineCount: 2, maxFlaps: 0, hasGear: true, hasSpoilers: false, oew: 30600, mtow: 78000, maxFuel: 46180, vSpeeds: { v1: 170, vr: 210, v2: 235, vref: 175, vne: 1900 } } },
  { match: 'r44', spec: { name: 'Robinson R44', category: 'rotorcraft', engineCount: 1, maxFlaps: 0, hasGear: false, hasSpoilers: false, oew: 657, mtow: 1134, maxFuel: 140, vSpeeds: { vref: 55, vne: 130 } } },
  { match: 'bell 407', spec: { name: 'Bell 407', category: 'rotorcraft', engineCount: 1, maxFlaps: 0, hasGear: false, hasSpoilers: false, oew: 1210, mtow: 2268, maxFuel: 390, vSpeeds: { vref: 60, vne: 140 } } },
  { match: 'uh-60', spec: { name: 'Sikorsky UH-60 Black Hawk', category: 'rotorcraft', engineCount: 2, maxFlaps: 0, hasGear: true, hasSpoilers: false, oew: 4819, mtow: 9979, maxFuel: 1100, vSpeeds: { vref: 65, vne: 159 } } }
];

export function parseSimMajor(rawVersion: unknown): SimMajorVersion | null {
  if (rawVersion === undefined || rawVersion === null) return null;
  const match = String(rawVersion).trim().match(/^(?:v)?([34])(?:\.\d+)*$/i);
  if (!match) return null;
  return Number(match[1]) as SimMajorVersion;
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
      const mass = Number(def.mass || ac.setup?.mass || 1200);
      const maxThrust = Number(def.maxThrust || 0);
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
      airbrakesPosition: Number.isFinite(v.airbrakesPosition) ? v.airbrakesPosition : undefined,
      glideslopeDeviation: v.NAVVNAV && Number.isFinite(v.NAVGlideAngleDeviation) ? v.NAVGlideAngleDeviation : undefined,
      lightsOn: Boolean(v.lights),
      lat: Number(lla[0] || 0),
      lon: Number(lla[1] || 0)
    });
  }
}
