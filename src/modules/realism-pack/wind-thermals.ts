// Adapted under the MIT License from Tokke1111ALT/GeoFS-Wind-Terrain-and-Thermals-Addon
// Copyright (c) 2026 Tokke_1111

import type { GeoFSCesiumColor } from '../../types/geofs.d';

interface CesiumPointCollectionLike {
  show: boolean;
  length?: number;
  add: (opts: { position: unknown; color: unknown; pixelSize?: number }) => unknown;
  removeAll: () => void;
}

const METERS_PER_DEG_LAT = 111_320;

export function thermalStrengthToColor(
  strength: number,
  cesiumColor?: typeof window.Cesium extends { Color?: infer C } ? C : unknown
): GeoFSCesiumColor | { red: number; green: number; blue: number; alpha: number } {
  const s = Math.max(0, Math.min(1, strength));
  const r = s < 0.5 ? s * 2 : 1;
  const g = s < 0.5 ? 0.9 : 1 - (s - 0.5) * 1.4;
  const b = 0.12;
  const ColorCtor = cesiumColor as { new (r: number, g: number, b: number, a: number): GeoFSCesiumColor } | undefined;
  if (typeof ColorCtor === 'function') {
    return new ColorCtor(r, g, b, 0.85);
  }
  return { red: r, green: g, blue: b, alpha: 0.85 };
}

export class WindThermalsController {
  private collection: CesiumPointCollectionLike | null = null;
  private lastUpdateAt = 0;

  public update(enabled: boolean, lat: number, lon: number, altFeet: number, nowMs: number): number {
    if (!enabled) {
      if (this.collection) {
        this.collection.show = false;
      }
      return 0;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return 0;

    // In GeoFS V3.9, native debug atmosphere visualizer can be nudged if present
    const debugApi = window.geofs?.debug as { drawAtmosphere?: () => void } | undefined;
    if (typeof debugApi?.drawAtmosphere === 'function' && nowMs - this.lastUpdateAt >= 2000) {
      try {
        debugApi.drawAtmosphere();
      } catch {
        // Ignore V3.9 debug draw failures
      }
    }

    const col = this.ensureCollection();
    if (!col) return 0;
    col.show = true;

    if (nowMs - this.lastUpdateAt < 3_000) {
      return col.length ?? 0;
    }
    this.lastUpdateAt = nowMs;
    return this.renderThermalsGrid(col, lat, lon, altFeet);
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

  private renderThermalsGrid(col: CesiumPointCollectionLike, lat: number, lon: number, altFeet: number): number {
    const CesiumGlobal = window.Cesium;
    if (!CesiumGlobal?.Cartesian3?.fromDegrees) return 0;

    col.removeAll();
    const cosLat = Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const getLocalThermal = (window as unknown as { weather?: { getLocalThermal?: (la: number, lo: number) => number } }).weather?.getLocalThermal;
    const getGroundAltitude = window.geofs?.getGroundAltitude;

    const baseAltMeters = Math.max(300, altFeet * 0.3048);
    const radiusMeters = 8_000;
    const steps = 6;
    let count = 0;

    for (let ix = -steps; ix <= steps; ix++) {
      for (let iy = -steps; iy <= steps; iy++) {
        const dLat = ((iy / steps) * radiusMeters) / METERS_PER_DEG_LAT;
        const dLon = ((ix / steps) * radiusMeters) / (METERS_PER_DEG_LAT * cosLat);
        const sLat = lat + dLat;
        const sLon = lon + dLon;

        let strength = 0;
        if (typeof getLocalThermal === 'function') {
          try {
            const val = Number(getLocalThermal(sLat, sLon));
            if (Number.isFinite(val)) strength = Math.max(0, Math.min(1, val / 5));
          } catch {
            strength = 0;
          }
        } else {
          // Terrain-contrast / ridge-lift fallback for GeoFS V4.0
          const centerH = getGroundAltitude?.(sLat, sLon)?.location?.[2] ?? 0;
          const neighborH = getGroundAltitude?.(sLat + 0.004, sLon)?.location?.[2] ?? centerH;
          const slope = Math.abs(centerH - neighborH) / 445;
          const pseudoThermal = Math.max(0, Math.sin(sLat * 120) * Math.cos(sLon * 120));
          strength = Math.max(0, Math.min(1, slope * 1.8 + pseudoThermal * 0.65));
        }

        if (strength < 0.35) continue;

        const color = thermalStrengthToColor(strength, CesiumGlobal.Color);
        for (let hIdx = 0; hIdx < 3; hIdx++) {
          const z = Math.max(150, baseAltMeters - 250 + hIdx * 250);
          col.add({
            position: CesiumGlobal.Cartesian3.fromDegrees(sLon, sLat, z),
            color,
            pixelSize: 4 + strength * 4
          });
          count++;
        }
      }
    }
    return count;
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
    this.lastUpdateAt = 0;
  }
}
