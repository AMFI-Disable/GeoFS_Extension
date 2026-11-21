// Clean-room Night VFR LiDAR terrain point-cloud projection.
// Inspired by the night VFR terrain-dot concept in AviATR72/GeoFS-LiDAR-for-Night-VFR.

import type { GeoFSCesiumColor } from '../../../types/geofs.d';

export type LidarMode = 'auto' | 'on' | 'off';

export interface NightVfrLidarOptions {
  mode?: LidarMode;
  radiusMeters?: number;
  maxPoints?: number;
  scanIntervalMs?: number;
  moveThresholdMeters?: number;
}

interface CesiumPointCollectionLike {
  show: boolean;
  length?: number;
  add: (opts: {
    position: unknown;
    color: unknown;
    pixelSize?: number;
  }) => unknown;
  removeAll: () => void;
}

const METERS_PER_DEG_LAT = 111_320;
const METERS_TO_FEET = 3.280839895;

export function elevationFeetToLidarColor(
  elevFeet: number,
  cesiumColor?: typeof window.Cesium extends { Color?: infer C } ? C : unknown
): GeoFSCesiumColor | { red: number; green: number; blue: number; alpha: number } {
  const clamped = Math.max(0, Math.min(20_000, Number.isFinite(elevFeet) ? elevFeet : 0));
  let r = 0.15;
  let g = 0.72;
  let b = 1.0;

  if (clamped < 3_000) {
    const t = clamped / 3_000;
    r = 0.15;
    g = 0.55 + t * 0.45;
    b = 1.0 - t * 0.35;
  } else if (clamped < 6_000) {
    const t = (clamped - 3_000) / 3_000;
    r = 0.15 + t * 0.45;
    g = 1.0;
    b = 0.65 * (1 - t);
  } else if (clamped < 10_000) {
    const t = (clamped - 6_000) / 4_000;
    r = 0.6 + t * 0.4;
    g = 1.0 - t * 0.2;
    b = 0.05;
  } else if (clamped < 15_000) {
    const t = (clamped - 10_000) / 5_000;
    r = 1.0;
    g = 0.8 - t * 0.5;
    b = 0.05;
  } else {
    const t = (clamped - 15_000) / 5_000;
    r = 1.0 - t * 0.25;
    g = 0.3 * (1 - t);
    b = 0.05;
  }

  const ColorCtor = cesiumColor as { new (r: number, g: number, b: number, a: number): GeoFSCesiumColor } | undefined;
  if (typeof ColorCtor === 'function') {
    return new ColorCtor(r, g, b, 0.92);
  }
  return { red: r, green: g, blue: b, alpha: 0.92 };
}

export class NightVfrLidarController {
  private collection: CesiumPointCollectionLike | null = null;
  private lastScanAt = 0;
  private lastScanPos: { lat: number; lon: number } | null = null;
  private options: Required<NightVfrLidarOptions>;

  public constructor(options: NightVfrLidarOptions = {}) {
    this.options = {
      mode: options.mode ?? 'auto',
      radiusMeters: options.radiusMeters ?? 14_000,
      maxPoints: options.maxPoints ?? 1_200,
      scanIntervalMs: options.scanIntervalMs ?? 4_000,
      moveThresholdMeters: options.moveThresholdMeters ?? 800
    };
  }

  public setMode(mode: LidarMode): void {
    this.options.mode = mode;
    if (mode === 'off' && this.collection) {
      this.collection.show = false;
    }
  }

  public update(
    enabled: boolean,
    isNight: boolean,
    lat: number,
    lon: number,
    nowMs: number
  ): number {
    const shouldShow =
      enabled && (this.options.mode === 'on' || (this.options.mode === 'auto' && isNight));

    if (!shouldShow) {
      if (this.collection) {
        this.collection.show = false;
      }
      return 0;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return 0;
    }

    const col = this.ensureCollection();
    if (!col) return 0;
    col.show = true;

    const movedMeters = this.lastScanPos
      ? Math.hypot(
          (lat - this.lastScanPos.lat) * METERS_PER_DEG_LAT,
          (lon - this.lastScanPos.lon) * METERS_PER_DEG_LAT * Math.max(0.2, Math.cos((lat * Math.PI) / 180))
        )
      : Infinity;

    if (nowMs - this.lastScanAt < this.options.scanIntervalMs && movedMeters < this.options.moveThresholdMeters) {
      return col.length ?? 0;
    }

    this.lastScanAt = nowMs;
    this.lastScanPos = { lat, lon };
    return this.scanTerrainAround(col, lat, lon);
  }

  private ensureCollection(): CesiumPointCollectionLike | null {
    if (this.collection) return this.collection;
    const CesiumGlobal = window.Cesium;
    const primitives = window.geofs?.api?.viewer?.scene?.primitives as
      | { add?: (p: unknown) => unknown }
      | undefined;
    if (!CesiumGlobal?.PointPrimitiveCollection || !primitives?.add) return null;
    try {
      const col = new CesiumGlobal.PointPrimitiveCollection() as unknown as CesiumPointCollectionLike;
      primitives.add(col);
      this.collection = col;
      return col;
    } catch {
      return null;
    }
  }

  private scanTerrainAround(col: CesiumPointCollectionLike, lat: number, lon: number): number {
    const CesiumGlobal = window.Cesium;
    const getGroundAltitude = window.geofs?.getGroundAltitude;
    if (!CesiumGlobal?.Cartesian3?.fromDegrees) return 0;

    col.removeAll();
    const cosLat = Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const rings = 20;
    const sectors = Math.max(12, Math.floor(this.options.maxPoints / rings));
    let added = 0;

    for (let rIdx = 1; rIdx <= rings; rIdx++) {
      const rFrac = rIdx / rings;
      const dist = this.options.radiusMeters * Math.sqrt(rFrac);
      for (let sIdx = 0; sIdx < sectors; sIdx++) {
        if (added >= this.options.maxPoints) break;
        const angle = ((sIdx + (rIdx % 2) * 0.5) / sectors) * Math.PI * 2;
        const dLat = (dist * Math.cos(angle)) / METERS_PER_DEG_LAT;
        const dLon = (dist * Math.sin(angle)) / (METERS_PER_DEG_LAT * cosLat);
        const sLat = lat + dLat;
        const sLon = lon + dLon;

        const altMeters = this.sampleTerrainMeters(sLat, sLon, getGroundAltitude);
        if (altMeters === null) continue;

        const elevFeet = altMeters * METERS_TO_FEET;
        const color = elevationFeetToLidarColor(elevFeet, CesiumGlobal.Color);
        const position = CesiumGlobal.Cartesian3.fromDegrees(sLon, sLat, altMeters + 2);
        col.add({
          position,
          color,
          pixelSize: 2.5
        });
        added++;
      }
    }
    return added;
  }

  private sampleTerrainMeters(
    lat: number,
    lon: number,
    getGroundAltitude: ((lat: number, lon: number) => { location?: number[] } | undefined) | undefined
  ): number | null {
    if (typeof getGroundAltitude === 'function') {
      try {
        const res = getGroundAltitude(lat, lon);
        const h = res?.location?.[2];
        if (typeof h === 'number' && Number.isFinite(h)) return h;
      } catch {
        // Fallback below
      }
    }
    const scene = window.geofs?.api?.viewer?.scene as
      | { globe?: { getHeight?: (carto: unknown) => number | undefined } }
      | undefined;
    const globe = scene?.globe;
    const Cartographic = window.Cesium?.Cartographic;
    if (globe?.getHeight && Cartographic?.fromDegrees) {
      try {
        const h = globe.getHeight(Cartographic.fromDegrees(lon, lat));
        if (typeof h === 'number' && Number.isFinite(h)) return h;
      } catch {
        return null;
      }
    }
    return null;
  }

  public dispose(): void {
    if (this.collection) {
      try {
        this.collection.show = false;
        this.collection.removeAll();
        const primitives = window.geofs?.api?.viewer?.scene?.primitives as
          | { remove?: (p: unknown) => void }
          | undefined;
        primitives?.remove?.(this.collection);
      } catch {
        // Ignore teardown errors
      }
      this.collection = null;
    }
    this.lastScanAt = 0;
    this.lastScanPos = null;
  }
}
