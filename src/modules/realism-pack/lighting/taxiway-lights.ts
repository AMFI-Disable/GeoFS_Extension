/**
 * Clean-room Opt-in OSM Taxiway Lights
 * Queries OpenStreetMap Overpass API (`aeroway=taxiway`) when explicitly enabled.
 * Data: © OpenStreetMap contributors (ODbL). Zero third-party telemetry.
 */
import type { GeoFSGlobal } from '../../../types/geofs.d';
import { llaToEcef } from './aircraft-lights';

export const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
export const TILE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const TILE_CACHE_PREFIX = 'geofs_ext_osm_twy_';

export interface TaxiwayLightPoint {
  lat: number;
  lon: number;
  kind: 'centerline-green' | 'centerline-yellow' | 'edge-blue';
}

export interface OverpassNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
}

export interface OverpassWay {
  type: 'way';
  id: number;
  nodes?: number[];
  geometry?: Array<{ lat: number; lon: number }>;
}

export interface OverpassResponse {
  elements?: Array<OverpassNode | OverpassWay>;
}

export interface RunwaySegment {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

export function getTileKey(lat: number, lon: number): string {
  const latTile = Math.floor(lat * 10) / 10;
  const lonTile = Math.floor(lon * 10) / 10;
  return `${TILE_CACHE_PREFIX}${latTile.toFixed(1)}_${lonTile.toFixed(1)}`;
}

export function buildOverpassQuery(lat: number, lon: number, radiusM = 5000): string {
  return `[out:json][timeout:15];way["aeroway"="taxiway"](around:${Math.round(radiusM)},${lat.toFixed(5)},${lon.toFixed(5)});out geom;`;
}

export function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pointToSegmentDistanceMeters(
  lat: number,
  lon: number,
  seg: RunwaySegment
): number {
  const cosLat = Math.cos((lat * Math.PI) / 180);
  const mPerDegLat = 111320;
  const mPerDegLon = 111320 * Math.max(0.1, cosLat);
  const px = (lon - seg.lon1) * mPerDegLon;
  const py = (lat - seg.lat1) * mPerDegLat;
  const sx = (seg.lon2 - seg.lon1) * mPerDegLon;
  const sy = (seg.lat2 - seg.lat1) * mPerDegLat;
  const len2 = sx * sx + sy * sy;
  if (len2 < 1e-6) return Math.hypot(px, py);
  const t = Math.max(0, Math.min(1, (px * sx + py * sy) / len2));
  return Math.hypot(px - t * sx, py - t * sy);
}

export function extractRunwaySegments(
  nearRunways: NonNullable<GeoFSGlobal['runways']>['nearRunways'] | null | undefined
): RunwaySegment[] {
  if (!nearRunways) return [];
  const segs: RunwaySegment[] = [];
  for (const rw of Object.values(nearRunways)) {
    const t1 = rw?.threshold1;
    const t2 = rw?.threshold2;
    if (
      Array.isArray(t1) && t1.length >= 2 &&
      Array.isArray(t2) && t2.length >= 2 &&
      Number.isFinite(t1[0]) && Number.isFinite(t1[1]) &&
      Number.isFinite(t2[0]) && Number.isFinite(t2[1])
    ) {
      segs.push({ lat1: t1[0], lon1: t1[1], lat2: t2[0], lon2: t2[1] });
    }
  }
  return segs;
}

export function parseOverpassTaxiways(
  data: OverpassResponse,
  runwaySegments: RunwaySegment[],
  centerlineSpacingM = 30,
  edgeSpacingM = 60,
  edgeOffsetM = 11
): TaxiwayLightPoint[] {
  const elements = data?.elements;
  if (!Array.isArray(elements)) return [];

  const nodeMap = new Map<number, { lat: number; lon: number }>();
  for (const el of elements) {
    if (el.type === 'node' && Number.isFinite(el.lat) && Number.isFinite(el.lon)) {
      nodeMap.set(el.id, { lat: el.lat, lon: el.lon });
    }
  }

  const out: TaxiwayLightPoint[] = [];

  for (const el of elements) {
    if (el.type !== 'way') continue;
    const pts: Array<{ lat: number; lon: number }> =
      Array.isArray(el.geometry) && el.geometry.length >= 2
        ? el.geometry
        : (el.nodes ?? [])
            .map((id) => nodeMap.get(id))
            .filter((n): n is { lat: number; lon: number } => Boolean(n));
    if (pts.length < 2) continue;

    let clAccum = 0;
    let edgeAccum = 0;

    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const segLen = haversineMeters(a.lat, a.lon, b.lat, b.lon);
      if (segLen < 1) continue;

      const dLat = b.lat - a.lat;
      const dLon = b.lon - a.lon;
      const cosLat = Math.max(0.1, Math.cos((a.lat * Math.PI) / 180));
      const dxM = dLon * 111320 * cosLat;
      const dyM = dLat * 111320;
      const normLen = Math.hypot(dxM, dyM) || 1;
      const perpLat = (dxM / normLen) * (edgeOffsetM / 111320);
      const perpLon = (-dyM / normLen) * (edgeOffsetM / (111320 * cosLat));

      let dist = clAccum === 0 ? 0 : centerlineSpacingM - clAccum;
      while (dist <= segLen) {
        const t = dist / segLen;
        const lat = a.lat + dLat * t;
        const lon = a.lon + dLon * t;
        const nearRw = runwaySegments.some((seg) => pointToSegmentDistanceMeters(lat, lon, seg) <= 60);
        out.push({
          lat,
          lon,
          kind: nearRw ? 'centerline-yellow' : 'centerline-green'
        });
        dist += centerlineSpacingM;
      }
      clAccum = (clAccum + segLen) % centerlineSpacingM;

      let eDist = edgeAccum === 0 ? 0 : edgeSpacingM - edgeAccum;
      while (eDist <= segLen) {
        const t = eDist / segLen;
        const lat = a.lat + dLat * t;
        const lon = a.lon + dLon * t;
        out.push({ lat: lat + perpLat, lon: lon + perpLon, kind: 'edge-blue' });
        out.push({ lat: lat - perpLat, lon: lon - perpLon, kind: 'edge-blue' });
        eDist += edgeSpacingM;
      }
      edgeAccum = (edgeAccum + segLen) % edgeSpacingM;
    }
  }

  return out;
}

function createDotDataUrl(hex: string): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const grad = ctx.createRadialGradient(8, 8, 1, 8, 8, 7.5);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.35, hex);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 16);
  return canvas.toDataURL();
}

export class TaxiwayLightsController {
  private collection: { removeAll?: () => void; add?: (opts: Record<string, unknown>) => unknown; show?: boolean } | null = null;
  private lastTileKey = '';
  private abortController: AbortController | null = null;
  private icons: Record<TaxiwayLightPoint['kind'], string> | null = null;
  private loadingTile = '';

  public async update(lat: number, lon: number, nearRunways: NonNullable<GeoFSGlobal['runways']>['nearRunways'] | null | undefined, nowMs = Date.now()): Promise<void> {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    const tileKey = getTileKey(lat, lon);
    if (tileKey === this.lastTileKey || tileKey === this.loadingTile) return;

    const cached = this.readCache(tileKey, nowMs);
    if (cached) {
      this.lastTileKey = tileKey;
      this.renderLights(cached);
      return;
    }

    this.loadingTile = tileKey;
    this.abortController?.abort();
    const ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
    this.abortController = ac;

    try {
      const query = buildOverpassQuery(lat, lon, 5000);
      const res = await fetch(OVERPASS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: `data=${encodeURIComponent(query)}`,
        signal: ac?.signal
      });
      if (!res.ok) return;
      const json = (await res.json()) as OverpassResponse;
      const segs = extractRunwaySegments(nearRunways);
      const points = parseOverpassTaxiways(json, segs);
      this.writeCache(tileKey, points, nowMs);
      if (this.loadingTile === tileKey) {
        this.lastTileKey = tileKey;
        this.renderLights(points);
      }
    } catch {
      // Ignore abort or network failures silently
    } finally {
      if (this.loadingTile === tileKey) this.loadingTile = '';
    }
  }

  private readCache(key: string, nowMs: number): TaxiwayLightPoint[] | null {
    try {
      const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;
      const raw = storage?.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { savedAt?: number; points?: TaxiwayLightPoint[] };
      if (!parsed || typeof parsed.savedAt !== 'number' || !Array.isArray(parsed.points)) return null;
      if (nowMs - parsed.savedAt > TILE_CACHE_TTL_MS) {
        storage?.removeItem(key);
        return null;
      }
      return parsed.points;
    } catch {
      return null;
    }
  }

  private writeCache(key: string, points: TaxiwayLightPoint[], nowMs: number): void {
    try {
      const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;
      storage?.setItem(key, JSON.stringify({ savedAt: nowMs, points }));
    } catch {
      // Ignore quota errors
    }
  }

  private ensureCollection(): void {
    if (this.collection) return;
    const scene = window.geofs?.api?.viewer?.scene;
    const Cesium = window.Cesium as Record<string, unknown> | undefined;
    const BillboardCollection = Cesium?.BillboardCollection as (new (opts: Record<string, unknown>) => {
      removeAll?: () => void;
      add?: (opts: Record<string, unknown>) => unknown;
      show?: boolean;
    }) | undefined;
    if (!scene?.primitives?.add || !BillboardCollection) return;
    const col = new BillboardCollection({ scene });
    scene.primitives.add(col);
    this.collection = col;
  }

  private renderLights(points: TaxiwayLightPoint[]): void {
    this.ensureCollection();
    if (!this.collection?.add) return;
    this.collection.removeAll?.();

    if (!this.icons) {
      this.icons = {
        'centerline-green': createDotDataUrl('#22c55e'),
        'centerline-yellow': createDotDataUrl('#fbbf24'),
        'edge-blue': createDotDataUrl('#3b82f6')
      };
    }

    const Cesium = window.Cesium as Record<string, unknown> | undefined;
    const C3 = Cesium?.Cartesian3 as { fromDegrees?: (lon: number, lat: number, alt: number) => unknown } | undefined;
    const NearFar = Cesium?.NearFarScalar as (new (n: number, nv: number, f: number, fv: number) => unknown) | undefined;
    const DistCond = Cesium?.DistanceDisplayCondition as (new (n: number, f: number) => unknown) | undefined;
    const HeightRef = Cesium?.HeightReference as { CLAMP_TO_GROUND?: unknown } | undefined;

    for (const pt of points) {
      const groundAlt = window.geofs?.getGroundAltitude ? Number((window.geofs.getGroundAltitude as (a: number, b: number) => { location?: number[] })?.(pt.lat, pt.lon)?.location?.[2]) || 0 : 0;
      const position = C3?.fromDegrees
        ? C3.fromDegrees(pt.lon, pt.lat, groundAlt + 0.35)
        : llaToEcef(pt.lat, pt.lon, groundAlt + 0.35);
      this.collection.add({
        position,
        image: this.icons[pt.kind],
        scale: pt.kind === 'edge-blue' ? 0.45 : 0.5,
        heightReference: HeightRef?.CLAMP_TO_GROUND,
        scaleByDistance: NearFar ? new NearFar(50, 1.0, 4500, 0.25) : undefined,
        distanceDisplayCondition: DistCond ? new DistCond(0, 6000) : undefined
      });
    }
  }

  public dispose(): void {
    this.abortController?.abort();
    this.abortController = null;
    this.loadingTile = '';
    this.lastTileKey = '';
    if (this.collection) {
      this.collection.removeAll?.();
      window.geofs?.api?.viewer?.scene?.primitives?.remove?.(this.collection);
      this.collection = null;
    }
  }
}
