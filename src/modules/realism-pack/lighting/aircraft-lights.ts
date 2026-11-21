/**
 * Aircraft Ground & Exterior Lighting
 * Ported from frietjesbeer/GeoFS-headlights (MIT License) with GeoFS_Extension presets and gear gating.
 */
import type { GeoFSAircraftInstance } from '../../../types/geofs.d';
import type { HeadlightMode } from '../../../types/settings';
import type { LightPointUniform, SpotUniform } from './light-shader';

export type SpotType = 'landing' | 'taxi' | 'turnoff';
export type LightGroup = 'nav' | 'beacon' | 'strobe' | 'landing' | 'taxi' | 'turnoff' | 'logo';
export type LightPreset = 'coldAndDark' | 'takeoff' | 'allOn' | 'allOff';

export interface LightSwitches {
  nav: boolean;
  beacon: boolean;
  strobe: boolean;
  landing: boolean;
  taxi: boolean;
  turnoff: boolean;
  logo: boolean;
}

export const DEFAULT_LIGHT_SWITCHES: LightSwitches = {
  nav: true,
  beacon: true,
  strobe: true,
  landing: true,
  taxi: true,
  turnoff: true,
  logo: true
};

export interface LampDef {
  type: SpotType;
  x: number;
  y: number;
  z: number;
  tilt?: number;
  yaw?: number;
  strength?: number;
  mirror?: boolean;
  coneInner?: number;
  coneOuter?: number;
  range?: number;
  falloff?: number;
  color?: [number, number, number];
}

export interface AircraftLightLayout {
  name?: string;
  headlightIntensity: number;
  lamps: LampDef[];
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface AircraftFrame {
  pos: Vec3;
  fwd: Vec3;
  right: Vec3;
  up: Vec3;
  radius: number;
}

const SPOT_DEFAULTS: Record<SpotType, {
  tilt: number;
  coneInner: number;
  coneOuter: number;
  range: number;
  falloff: number;
  intensity: number;
  color: [number, number, number];
}> = {
  landing: { tilt: -3.5, coneInner: 5, coneOuter: 14, range: 650, falloff: 0.00018, intensity: 1.25, color: [1.0, 0.96, 0.88] },
  taxi: { tilt: -6.0, coneInner: 10, coneOuter: 28, range: 280, falloff: 0.0006, intensity: 0.9, color: [1.0, 0.94, 0.84] },
  turnoff: { tilt: -5.0, coneInner: 8, coneOuter: 26, range: 220, falloff: 0.0008, intensity: 0.85, color: [1.0, 0.94, 0.84] }
};

const LAMP_COLORS: Record<string, [number, number, number]> = {
  red: [1.0, 0.12, 0.08],
  green: [0.15, 1.0, 0.3],
  white: [1.0, 0.95, 0.88],
  yellow: [1.0, 0.72, 0.25],
  amber: [1.0, 0.65, 0.2],
  orange: [1.0, 0.55, 0.15],
  blue: [0.3, 0.5, 1.0]
};

const lamp = (type: SpotType, x: number, y: number, z: number, opts?: Partial<LampDef>): LampDef => ({
  type,
  x,
  y,
  z,
  ...opts
});

export const AIRCRAFT_LIGHT_LAYOUTS: Record<string, AircraftLightLayout> = {
  '2': {
    name: 'Cessna 172',
    headlightIntensity: 2,
    lamps: [
      lamp('landing', 0, 2.1, -0.8, { tilt: -9, range: 200, coneOuter: 15, coneInner: 4 }),
      lamp('taxi', 0, 2.1, -0.8, { tilt: -9, coneOuter: 30, coneInner: 4, strength: 0.7 })
    ]
  },
  '4': {
    name: 'Boeing 737-700',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0, 13.4, -1.85, { tilt: -5, strength: 0.6 }),
      lamp('landing', 2.2, 5, -0.5, { tilt: -1, yaw: 2, mirror: true }),
      lamp('turnoff', 2.5, 4.8, -0.4, { yaw: 20, mirror: true, strength: 0.7 })
    ]
  },
  '5': {
    name: 'Embraer Phenom 100',
    headlightIntensity: 1.6,
    lamps: [
      lamp('landing', 0.77, 1.5, -0.35, { tilt: -1, yaw: 4, mirror: true, strength: 1.5 }),
      lamp('taxi', 0.77, 1.5, -0.35, { mirror: true, tilt: -1, yaw: 3, coneOuter: 19, coneInner: 10, strength: 0.7 })
    ]
  },
  '6': {
    name: 'DHC-6 Twin Otter',
    headlightIntensity: 1.6,
    lamps: [
      lamp('taxi', -0.3, 3.4, -1.05, { tilt: -5, strength: 0.9 }),
      lamp('landing', 3.6, -0.1, 1.27, { tilt: -11, yaw: 2, mirror: true, strength: 0.8, coneOuter: 15, coneInner: 4 })
    ]
  },
  '7': {
    name: 'F-16 Fighting Falcon',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0.28, 3.5, -1.03, { strength: 0.8, coneOuter: 30, coneInner: 10 }),
      lamp('landing', 0.28, 3.5, -1.2, { coneOuter: 15, coneInner: 4, strength: 1.3 })
    ]
  },
  '9': { name: 'Eurocopter EC135', headlightIntensity: 2, lamps: [] },
  '10': {
    name: 'Airbus A380',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0, 29.1, -2.9, { tilt: -6, strength: 0.8 }),
      lamp('landing', 5.06, 13.2, 0.2, { tilt: -1.5, yaw: 2, mirror: true, strength: 0.8 }),
      lamp('turnoff', 0.2, 28.8, -2.43, { yaw: 22, mirror: true, strength: 0.7 })
    ]
  },
  '12': {
    name: 'Pilatus PC-7 Mk-I',
    headlightIntensity: 1.8,
    lamps: [lamp('landing', 1.2, -0.12, -0.3, { tilt: -1, yaw: 4, mirror: true, strength: 1.2 })]
  },
  '16': {
    name: 'Douglas DC-3',
    headlightIntensity: 2,
    lamps: [lamp('landing', 5.55, 0.5, -0.58, { yaw: 2, mirror: true, tilt: -20, coneOuter: 20, coneInner: 4, strength: 0.8, range: 800 })]
  },
  '17': {
    name: 'McDonnell Douglas DC-10-40',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0.18, 22.7, -1.5, { tilt: -6, strength: 0.7, mirror: true, coneOuter: 35, coneInner: 10 }),
      lamp('landing', 2.48, 25, 0.4, { tilt: -1.5, yaw: 8, mirror: true, range: 300, strength: 0.8 }),
      lamp('turnoff', 3.6, 9, 0.5, { mirror: true, yaw: 30, strength: 1.5, range: 250 }),
      lamp('landing', 0.18, 22.7, -1.5, { mirror: true, strength: 1 })
    ]
  },
  '18': {
    name: 'Sukhoi Su-35',
    headlightIntensity: 2,
    lamps: [
      lamp('landing', 0.13, 5, -0.25, { yaw: 5, mirror: true, strength: 0.9, tilt: -4, coneOuter: 15, coneInner: 4 }),
      lamp('taxi', 0, 5.1, -0.82, { coneOuter: 35, coneInner: 10, tilt: -4, strength: 0.8, range: 400 })
    ]
  },
  '20': {
    name: 'Concorde',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0.3, 16.3, -0.6, { strength: 0.7, mirror: true }),
      lamp('landing', 1.2, 13.9, -0.25, { yaw: 2, mirror: true, strength: 1.4 }),
      lamp('turnoff', 0.85, 26.85, -0.1, { mirror: true, strength: 1, coneOuter: 30, coneInner: 12, yaw: 35 })
    ]
  },
  '22': {
    name: 'Cessna 152',
    headlightIntensity: 2,
    lamps: [
      lamp('landing', 0, 1.5, -0.1, { range: 250, coneOuter: 15, coneInner: 4, strength: 0.8, tilt: -4 }),
      lamp('taxi', 0, 1.5, -0.1, { mirror: true, coneOuter: 30, coneInner: 10, strength: 0.3 })
    ]
  },
  '24': {
    name: 'Airbus A350-900',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0, 27.6, -2.6, { tilt: -6, strength: 0.9 }),
      lamp('landing', 4.2, 9, -0.2, { tilt: -1.5, yaw: 6, mirror: true, coneOuter: 13, coneInner: 4, range: 700, strength: 1.3 }),
      lamp('turnoff', 0.14, 27.5, -2.77, { yaw: 30, mirror: true, strength: 1.4, coneOuter: 30, coneInner: 1, range: 200 }),
      lamp('landing', 0.28, 27.3, -1.84, { mirror: true, strength: 0.8 })
    ]
  },
  '25': {
    name: 'Boeing 777-300ER',
    headlightIntensity: 2,
    lamps: [
      lamp('landing', 3.8, 7.3, 0.3, { tilt: -1.5, yaw: 2, mirror: true }),
      lamp('turnoff', 3.9, 7.3, 0.3, { yaw: 20, mirror: true, strength: 0.8, range: 200 }),
      lamp('taxi', 0.26, 28.8, -2.2, { mirror: true, strength: 0.5 }),
      lamp('landing', 0.232, 28.8, -1.9, { mirror: true, strength: 1 })
    ]
  },
  '27': {
    name: 'Boeing F/A-18F Super Hornet',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0, 5.3, -1, { strength: 0.8, coneOuter: 35, coneInner: 10 }),
      lamp('landing', 0, 5.3, -1, { coneOuter: 15, coneInner: 4 })
    ]
  },
  '28': {
    name: 'Beechcraft Baron B55',
    headlightIntensity: 1.8,
    lamps: [
      lamp('taxi', 0, 2, -0.63, { tilt: -4, strength: 1, coneOuter: 35, coneInner: 10 }),
      lamp('landing', 4.9, 0.5, 0.08, { tilt: -5, yaw: 1, mirror: true, range: 250, strength: 0.9 })
    ]
  },
  '29': {
    name: 'Dassault Rafale',
    headlightIntensity: 2,
    lamps: [
      lamp('landing', 0.14, 3.9, -0.98, { yaw: 3, mirror: true, strength: 1, coneOuter: 15, coneInner: 4 }),
      lamp('taxi', 0.14, 3.9, -0.98, { mirror: true, yaw: 10, strength: 0.7, coneOuter: 30, coneInner: 10 })
    ]
  },
  '6012': {
    name: 'Airbus A330-300',
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0.25, 22.7, -1.6, { strength: 0.5, mirror: true }),
      lamp('landing', 3.3, 5.9, 0.2, { yaw: 4, mirror: true, coneOuter: 9, coneInner: 4 }),
      lamp('landing', 0.25, 22.7, -1.6, { mirror: true, strength: 0.6, coneOuter: 8, coneInner: 4, tilt: -1.5 }),
      lamp('turnoff', 0.2, 22.7, -2.35, { mirror: true, strength: 1, yaw: 25 })
    ]
  }
};

export function presetToSwitches(preset: LightPreset): LightSwitches {
  switch (preset) {
    case 'coldAndDark':
      return { nav: true, beacon: false, strobe: false, landing: false, taxi: false, turnoff: false, logo: true };
    case 'takeoff':
      return { nav: true, beacon: true, strobe: true, landing: true, taxi: false, turnoff: false, logo: true };
    case 'allOff':
      return { nav: false, beacon: false, strobe: false, landing: false, taxi: false, turnoff: false, logo: false };
    case 'allOn':
    default:
      return { ...DEFAULT_LIGHT_SWITCHES };
  }
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z);
  if (len < 1e-9) return { x: 0, y: 0, z: 1 };
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

const WGS84_A = 6378137.0;
const WGS84_E2 = 0.00669437999014;

export function llaToEcef(latDeg: number, lonDeg: number, altM: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);
  return {
    x: (N + altM) * cosLat * Math.cos(lon),
    y: (N + altM) * cosLat * Math.sin(lon),
    z: (N * (1 - WGS84_E2) + altM) * sinLat
  };
}

function enuToEcefDir(latDeg: number, lonDeg: number, e: number, n: number, u: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const sinLon = Math.sin(lon);
  const cosLon = Math.cos(lon);

  const east = { x: -sinLon, y: cosLon, z: 0 };
  const north = { x: -sinLat * cosLon, y: -sinLat * sinLon, z: cosLat };
  const up = { x: cosLat * cosLon, y: cosLat * sinLon, z: sinLat };

  return normalize({
    x: east.x * e + north.x * n + up.x * u,
    y: east.y * e + north.y * n + up.y * u,
    z: east.z * e + north.z * n + up.z * u
  });
}

export function localToWorld(frame: AircraftFrame, x: number, y: number, z: number): Vec3 {
  return {
    x: frame.pos.x + frame.right.x * x + frame.fwd.x * y + frame.up.x * z,
    y: frame.pos.y + frame.right.y * x + frame.fwd.y * y + frame.up.y * z,
    z: frame.pos.z + frame.right.z * x + frame.fwd.z * y + frame.up.z * z
  };
}

export function beamDir(frame: AircraftFrame, tiltDeg: number, yawDeg: number): Vec3 {
  const t = (tiltDeg * Math.PI) / 180;
  const y = (yawDeg * Math.PI) / 180;
  const cf = Math.cos(t) * Math.cos(y);
  const cr = Math.cos(t) * Math.sin(y);
  const cu = Math.sin(t);
  return normalize({
    x: frame.fwd.x * cf + frame.right.x * cr + frame.up.x * cu,
    y: frame.fwd.y * cf + frame.right.y * cr + frame.up.y * cu,
    z: frame.fwd.z * cf + frame.right.z * cr + frame.up.z * cu
  });
}

export function getAircraftFrame(inst: GeoFSAircraftInstance | undefined): AircraftFrame | null {
  if (!inst) return null;
  const radius = Number(inst.boundingSphereRadius) || 20;
  const lla = inst.llaLocation;
  const htr = inst.htr;
  const Cesium = (typeof window !== 'undefined' ? window.Cesium : undefined) as Record<string, unknown> | undefined;
  const Matrix4 = Cesium?.Matrix4 as {
    getTranslation?: (m: unknown, out: Vec3) => Vec3;
    getColumn?: (m: unknown, idx: number, out: { x: number; y: number; z: number; w: number }) => void;
  } | undefined;

  const modelObj = inst.object3d?.model;
  const mm = (modelObj?._model?.modelMatrix ?? modelObj?.modelMatrix) as unknown;

  if (mm && Matrix4?.getTranslation && Matrix4?.getColumn) {
    const pos = { x: 0, y: 0, z: 0 };
    Matrix4.getTranslation(mm, pos);
    const c0 = { x: 0, y: 0, z: 0, w: 0 };
    const c1 = { x: 0, y: 0, z: 0, w: 0 };
    const c2 = { x: 0, y: 0, z: 0, w: 0 };
    Matrix4.getColumn(mm, 0, c0);
    Matrix4.getColumn(mm, 1, c1);
    Matrix4.getColumn(mm, 2, c2);
    let right = normalize(c0);
    let fwd = normalize(c1);
    const up = normalize(c2);

    if (lla && htr && Number.isFinite(Number(htr[0]))) {
      const h = (Number(htr[0]) * Math.PI) / 180;
      const hdgDir = enuToEcefDir(Number(lla[0]), Number(lla[1]), Math.sin(h), Math.cos(h), 0);
      const candidates = [
        fwd,
        { x: -fwd.x, y: -fwd.y, z: -fwd.z },
        right,
        { x: -right.x, y: -right.y, z: -right.z }
      ];
      let best = fwd;
      let bestDot = -2;
      for (const cand of candidates) {
        const d = dot(cand, hdgDir);
        if (d > bestDot) {
          bestDot = d;
          best = cand;
        }
      }
      fwd = best;
      right = normalize(cross(fwd, up));
    }
    return { pos, fwd, right, up, radius };
  }

  if (!lla || !htr) return null;
  const lat = Number(lla[0]);
  const lon = Number(lla[1]);
  const alt = Number(lla[2]) || 0;
  const h = (Number(htr[0]) * Math.PI) / 180;
  const p = (Number(htr[1]) * Math.PI) / 180;
  const rl = ((Number(htr[2]) || 0) * Math.PI) / 180;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(h) || !Number.isFinite(p)) return null;

  const pos = llaToEcef(lat, lon, alt);
  const fwd = enuToEcefDir(lat, lon, Math.sin(h) * Math.cos(p), Math.cos(h) * Math.cos(p), Math.sin(p));
  let right = enuToEcefDir(lat, lon, Math.cos(h), -Math.sin(h), 0);
  let up = normalize(cross(right, fwd));

  if (rl !== 0) {
    const c = Math.cos(rl);
    const sn = Math.sin(rl);
    const r0 = right;
    const u0 = up;
    right = normalize({ x: r0.x * c - u0.x * sn, y: r0.y * c - u0.y * sn, z: r0.z * c - u0.z * sn });
    up = normalize({ x: u0.x * c + r0.x * sn, y: u0.y * c + r0.y * sn, z: u0.z * c + r0.z * sn });
  }

  return { pos, fwd, right, up, radius };
}

export function autoLightLayout(inst: GeoFSAircraftInstance, radius: number): AircraftLightLayout {
  let noseY = 0;
  let noseZ = 0;
  let hasNose = false;
  let minZ = 0;
  for (const p of inst.collisionPoints ?? []) {
    const v = p?.worldPosition;
    if (Array.isArray(v) && v.length >= 3 && v.every((n) => typeof n === 'number' && Number.isFinite(n))) {
      if (Math.abs(v[0]) < 1.0 && v[2] < -0.5 && (!hasNose || v[1] > noseY)) {
        noseY = v[1];
        noseZ = v[2];
        hasNose = true;
      }
      if (Math.abs(v[0]) < 8 && v[2] < minZ) minZ = v[2];
    }
  }
  if (hasNose && noseY < radius * 0.2) hasNose = false;
  const ty = hasNose ? noseY + 0.4 : Math.min(40, Math.max(1.5, radius * 0.47));
  const tz = hasNose ? noseZ - 0.6 : (minZ < 0 ? Math.max(minZ * 0.9, -3) : -Math.min(3, Math.max(0.4, radius * 0.05)));
  return {
    headlightIntensity: 2,
    lamps: [
      lamp('taxi', 0, ty, tz, { strength: 0.6 }),
      lamp('landing', Math.min(6, Math.max(0.8, radius * 0.085)), ty * 0.22, tz + 0.6, { yaw: 2, mirror: true })
    ]
  };
}

function toEyePoint(viewMatrix: unknown, world: Vec3): Vec3 {
  const m = viewMatrix as number[] | Float64Array | undefined;
  if (m && typeof m.length === 'number' && m.length >= 16) {
    // Cesium Matrix4 is column-major
    return {
      x: m[0] * world.x + m[4] * world.y + m[8] * world.z + m[12],
      y: m[1] * world.x + m[5] * world.y + m[9] * world.z + m[13],
      z: m[2] * world.x + m[6] * world.y + m[10] * world.z + m[14]
    };
  }
  return world;
}

function toEyeDir(viewMatrix: unknown, dir: Vec3): Vec3 {
  const m = viewMatrix as number[] | Float64Array | undefined;
  if (m && typeof m.length === 'number' && m.length >= 16) {
    return normalize({
      x: m[0] * dir.x + m[4] * dir.y + m[8] * dir.z,
      y: m[1] * dir.x + m[5] * dir.y + m[9] * dir.z,
      z: m[2] * dir.x + m[6] * dir.y + m[10] * dir.z
    });
  }
  return dir;
}

function classifyBuiltinLight(raw: Record<string, unknown>): { color: [number, number, number]; group: 'nav' | 'beacon' | 'strobe' } | null {
  const text = [raw.color, raw.light, raw.name, raw.type, raw.id]
    .filter((v) => typeof v === 'string')
    .join(' ')
    .toLowerCase();
  if (/landing|taxi|ldg|turnoff|headlight|spot/.test(text)) return null;
  let color: [number, number, number] = LAMP_COLORS.white;
  for (const [name, rgb] of Object.entries(LAMP_COLORS)) {
    if (text.includes(name)) {
      color = rgb;
      break;
    }
  }
  const group: 'nav' | 'beacon' | 'strobe' =
    text.includes('beacon') || (text.includes('strobe') && color === LAMP_COLORS.red)
      ? 'beacon'
      : text.includes('strobe')
        ? 'strobe'
        : 'nav';
  return { color, group };
}

export function computeAircraftLighting(params: {
  inst: GeoFSAircraftInstance | undefined;
  viewMatrix: unknown;
  switches: LightSwitches;
  headlightMode: HeadlightMode;
  isNight: boolean;
  gearDown: boolean;
  nowMs: number;
}): { points: LightPointUniform[]; spots: SpotUniform[] } {
  const { inst, viewMatrix, switches, headlightMode, isNight, gearDown, nowMs } = params;
  const points: LightPointUniform[] = [];
  const spots: SpotUniform[] = [];
  if (!inst) return { points, spots };

  const frame = getAircraftFrame(inst);
  const phase = (nowMs % 1000) / 1000;
  const strobeOn = phase < 0.07 || (phase > 0.16 && phase < 0.23);
  const beaconOn = (nowMs % 1200) < 180;

  // Built-in GeoFS aircraft lights if present
  const rawLights = inst.lights;
  let hasBuiltin = false;
  if (rawLights && typeof rawLights === 'object') {
    const arr = Array.isArray(rawLights) ? rawLights : Object.values(rawLights as Record<string, unknown>);
    for (const item of arr) {
      if (!item || typeof item !== 'object') continue;
      const obj = item as Record<string, unknown>;
      const info = classifyBuiltinLight(obj);
      if (!info || !switches[info.group]) continue;
      const prim = (obj.lightBillboard ?? obj._billboard ?? obj.billboard ?? obj.primitive) as Record<string, unknown> | undefined;
      const pos = (prim?._actualPosition ?? prim?.position) as Vec3 | undefined;
      if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y) && Number.isFinite(pos.z)) {
        hasBuiltin = true;
        const active = info.group === 'strobe' ? strobeOn : info.group === 'beacon' ? beaconOn : true;
        if (!active) continue;
        const ec = toEyePoint(viewMatrix, pos);
        points.push({
          x: ec.x,
          y: ec.y,
          z: ec.z,
          w: info.group === 'strobe' ? 1.8 : info.group === 'beacon' ? 1.4 : 1.0,
          r: info.color[0],
          g: info.color[1],
          b: info.color[2]
        });
      }
    }
  }

  // Synthesize exterior nav/strobe/beacon/logo lights from aircraft frame when built-in billboards aren't exposed
  if (frame && !hasBuiltin) {
    const span = Math.max(4.5, frame.radius * 0.52);
    const len = Math.max(3.5, frame.radius * 0.45);
    const pushSynth = (x: number, y: number, z: number, color: [number, number, number], strength: number) => {
      const wc = localToWorld(frame, x, y, z);
      const ec = toEyePoint(viewMatrix, wc);
      points.push({ x: ec.x, y: ec.y, z: ec.z, w: strength, r: color[0], g: color[1], b: color[2] });
    };
    if (switches.nav) {
      pushSynth(-span, 0, 0.2, LAMP_COLORS.red, 1.0);
      pushSynth(span, 0, 0.2, LAMP_COLORS.green, 1.0);
      pushSynth(0, -len, 0.6, LAMP_COLORS.white, 0.85);
    }
    if (switches.beacon && beaconOn) {
      pushSynth(0, 0.4, 1.8, LAMP_COLORS.red, 1.4);
      pushSynth(0, 0.4, -1.2, LAMP_COLORS.red, 1.2);
    }
    if (switches.strobe && strobeOn) {
      pushSynth(-span, -0.2, 0.2, LAMP_COLORS.white, 1.8);
      pushSynth(span, -0.2, 0.2, LAMP_COLORS.white, 1.8);
    }
    if (switches.logo && isNight && gearDown) {
      pushSynth(0, -len * 0.9, 2.2, [1.0, 0.95, 0.85], 0.7);
    }
  }

  // Ground-illuminating headlights (landing / taxi / turnoff)
  const wantHeadlights = headlightMode === 'on' || (headlightMode === 'auto' && isNight);
  if (frame && wantHeadlights && gearDown) {
    const id = String(inst.id ?? inst.aircraftRecord?.id ?? '');
    const layout = AIRCRAFT_LIGHT_LAYOUTS[id] ?? autoLightLayout(inst, frame.radius);
    const scale = layout.headlightIntensity;
    for (const lp of layout.lamps) {
      if (!switches[lp.type]) continue;
      const spec = SPOT_DEFAULTS[lp.type];
      const tilt = lp.tilt ?? spec.tilt;
      const yaw = lp.yaw ?? 0;
      const color = lp.color ?? spec.color;
      const cosInner = Math.cos(((Math.min(lp.coneInner ?? spec.coneInner, (lp.coneOuter ?? spec.coneOuter) - 0.5)) * Math.PI) / 180);
      const cosOuter = Math.cos((((lp.coneOuter ?? spec.coneOuter)) * Math.PI) / 180);
      const range = lp.range ?? spec.range;
      const falloff = lp.falloff ?? spec.falloff;
      const strength = (lp.strength ?? 1) * spec.intensity * scale;

      const emitSpot = (sx: number, syaw: number) => {
        const wc = localToWorld(frame, sx, lp.y, lp.z);
        const dc = beamDir(frame, tilt, syaw);
        const ec = toEyePoint(viewMatrix, wc);
        const ed = toEyeDir(viewMatrix, dc);
        spots.push({
          x: ec.x,
          y: ec.y,
          z: ec.z,
          w: strength,
          dx: ed.x,
          dy: ed.y,
          dz: ed.z,
          cosInner,
          cosOuter,
          range,
          falloff,
          r: color[0],
          g: color[1],
          b: color[2]
        });
      };

      if (lp.mirror) {
        emitSpot(-Math.abs(lp.x), -yaw);
        emitSpot(Math.abs(lp.x), yaw);
      } else {
        emitSpot(lp.x, yaw);
      }
    }
  }

  return { points, spots };
}
