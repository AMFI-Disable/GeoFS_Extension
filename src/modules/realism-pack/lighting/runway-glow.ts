/**
 * Clean-room Runway Light Pavement Glow
 * Reads GeoFS's native `geofs.fx.litRunways` billboard positions and feeds the nearest lights
 * into the shared Realism Pack lighting shader.
 */
import type { GeoFSGlobal } from '../../../types/geofs.d';
import { MAX_RUNWAY_LIGHTS, type LightPointUniform } from './light-shader';
import type { Vec3 } from './aircraft-lights';

export interface RunwayWorldLight {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
  strength: number;
  dist2: number;
}

const RW_COLORS = {
  red: [1.0, 0.16, 0.1] as const,
  yellow: [1.0, 0.74, 0.24] as const,
  green: [0.16, 1.0, 0.36] as const,
  white: [1.0, 0.94, 0.84] as const
};

export function mapRunwayImageColor(imageId: string | undefined): readonly [number, number, number] {
  const lower = (imageId ?? '').toLowerCase();
  if (lower.includes('red')) return RW_COLORS.red;
  if (lower.includes('yellow') || lower.includes('amber')) return RW_COLORS.yellow;
  if (lower.includes('green')) return RW_COLORS.green;
  return RW_COLORS.white;
}

export function collectNearestRunwayLights(
  litRunways: NonNullable<GeoFSGlobal['fx']>['litRunways'],
  aircraftPos: Vec3 | null,
  maxDistanceM = 280,
  limit = MAX_RUNWAY_LIGHTS
): RunwayWorldLight[] {
  if (!litRunways || !aircraftPos) return [];
  const maxD2 = maxDistanceM * maxDistanceM;
  const collected: RunwayWorldLight[] = [];

  for (const rw of Object.values(litRunways)) {
    const lights = rw?.lights;
    if (!Array.isArray(lights)) continue;
    for (const light of lights) {
      const bb = light?._billboard?._billboard;
      const pos = bb?._actualPosition ?? bb?.position;
      if (!pos || !Number.isFinite(pos.x) || !Number.isFinite(pos.y) || !Number.isFinite(pos.z)) continue;
      const dx = pos.x - aircraftPos.x;
      const dy = pos.y - aircraftPos.y;
      const dz = pos.z - aircraftPos.z;
      const dist2 = dx * dx + dy * dy + dz * dz;
      if (dist2 > maxD2) continue;
      const [r, g, b] = mapRunwayImageColor(bb?._imageId);
      collected.push({
        x: pos.x,
        y: pos.y,
        z: pos.z,
        r,
        g,
        b,
        strength: 2.4,
        dist2
      });
    }
  }

  if (collected.length > limit) {
    collected.sort((a, b) => a.dist2 - b.dist2);
    collected.length = limit;
  }
  return collected;
}

export function transformRunwayLightsToEye(
  lights: RunwayWorldLight[],
  viewMatrix: unknown
): LightPointUniform[] {
  const m = viewMatrix as number[] | Float64Array | undefined;
  const hasMat = Boolean(m && typeof m.length === 'number' && m.length >= 16);
  return lights.map((l) => {
    if (!hasMat || !m) {
      return { x: l.x, y: l.y, z: l.z, w: l.strength, r: l.r, g: l.g, b: l.b };
    }
    return {
      x: m[0] * l.x + m[4] * l.y + m[8] * l.z + m[12],
      y: m[1] * l.x + m[5] * l.y + m[9] * l.z + m[13],
      z: m[2] * l.x + m[6] * l.y + m[10] * l.z + m[14],
      w: l.strength,
      r: l.r,
      g: l.g,
      b: l.b
    };
  });
}

export class RunwayGlowController {
  private cached: RunwayWorldLight[] = [];
  private lastScanMs = 0;

  public update(
    litRunways: NonNullable<GeoFSGlobal['fx']>['litRunways'],
    aircraftPos: Vec3 | null,
    viewMatrix: unknown,
    nowMs: number
  ): LightPointUniform[] {
    if (nowMs - this.lastScanMs >= 1000) {
      this.lastScanMs = nowMs;
      this.cached = collectNearestRunwayLights(litRunways, aircraftPos);
    }
    if (this.cached.length === 0) return [];
    return transformRunwayLightsToEye(this.cached, viewMatrix);
  }

  public reset(): void {
    this.cached = [];
    this.lastScanMs = 0;
  }
}
