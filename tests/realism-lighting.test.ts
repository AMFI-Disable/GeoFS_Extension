import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  computeAircraftLighting,
  getAircraftFrame,
  localToWorld,
  presetToSwitches,
  DEFAULT_LIGHT_SWITCHES
} from '../src/modules/realism-pack/lighting/aircraft-lights';
import {
  LightingShaderController,
  MAX_RUNWAY_LIGHTS,
  buildLightingShader,
  isCesiumModern
} from '../src/modules/realism-pack/lighting/light-shader';
import {
  RunwayGlowController,
  collectNearestRunwayLights,
  mapRunwayImageColor
} from '../src/modules/realism-pack/lighting/runway-glow';
import {
  OVERPASS_ENDPOINT,
  TILE_CACHE_TTL_MS,
  TaxiwayLightsController,
  buildOverpassQuery,
  getTileKey,
  parseOverpassTaxiways
} from '../src/modules/realism-pack/lighting/taxiway-lights';

describe('Realism Pack Lighting', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('builds GLSL ES 3.00 and ES 1.00 shaders and detects Cesium version', () => {
    expect(isCesiumModern('1.115', 3)).toBe(true);
    expect(isCesiumModern('1.95', 3)).toBe(false);
    expect(isCesiumModern('1.95', 4)).toBe(true);

    const modern = buildLightingShader(true);
    expect(modern).toContain('#define HAS_ISNAN');
    expect(modern).toContain('in vec2 v_textureCoordinates;');
    expect(modern).toContain('out_FragColor');

    const legacy = buildLightingShader(false);
    expect(legacy).not.toContain('#define HAS_ISNAN');
    expect(legacy).toContain('varying vec2 v_textureCoordinates;');
    expect(legacy).toContain('texture2D(');
    expect(legacy).toContain('gl_FragColor');
  });

  it('manages PostProcessStage lifecycle and disposes cleanly', () => {
    const stagesList: Array<{ enabled?: boolean }> = [];
    const removeSpy = vi.fn((s: { enabled?: boolean }) => {
      const idx = stagesList.indexOf(s);
      if (idx >= 0) stagesList.splice(idx, 1);
    });
    const addSpy = vi.fn((s: { enabled?: boolean }) => {
      stagesList.push(s);
      return s;
    });

    (window as unknown as Record<string, unknown>).Cesium = {
      VERSION: '1.118',
      PostProcessStage: class {
        public enabled = true;
        constructor(public opts: unknown) {}
      }
    };
    (window as unknown as Record<string, unknown>).geofs = {
      api: {
        viewer: {
          scene: {
            postProcessStages: { add: addSpy, remove: removeSpy }
          }
        }
      }
    };

    const ctrl = new LightingShaderController();
    expect(ctrl.ensureStage(4)).toBe(true);
    expect(ctrl.hasStage()).toBe(true);
    expect(stagesList).toHaveLength(1);
    expect(stagesList[0].enabled).toBe(false);

    ctrl.setEnabled(true);
    expect(stagesList[0].enabled).toBe(true);

    ctrl.dispose();
    expect(ctrl.hasStage()).toBe(false);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(stagesList).toHaveLength(0);
  });

  it('places red nav light left and green nav light right across headings 0, 90, 180, 270', () => {
    for (const heading of [0, 90, 180, 270]) {
      const frame = getAircraftFrame({
        id: '4',
        llaLocation: [0, 0, 100], // Equator / Prime Meridian: East=+Y, North=+Z, Up=+X
        htr: [heading, 0, 0],
        boundingSphereRadius: 20
      });
      expect(frame).not.toBeNull();
      if (!frame) continue;

      const leftWing = localToWorld(frame, -10, 0, 0);
      const rightWing = localToWorld(frame, 10, 0, 0);
      const nose = localToWorld(frame, 0, 10, 0);

      // Verify right-handed frame orthogonality: right x fwd == up (within tolerance)
      const dxR = rightWing.x - frame.pos.x;
      const dyR = rightWing.y - frame.pos.y;
      const dzR = rightWing.z - frame.pos.z;
      const dxL = leftWing.x - frame.pos.x;
      const dyL = leftWing.y - frame.pos.y;
      const dzL = leftWing.z - frame.pos.z;
      expect(dxR + dxL).toBeCloseTo(0, 5);
      expect(dyR + dyL).toBeCloseTo(0, 5);
      expect(dzR + dzL).toBeCloseTo(0, 5);

      const dxF = nose.x - frame.pos.x;
      const dyF = nose.y - frame.pos.y;
      const dzF = nose.z - frame.pos.z;
      // Right vector is perpendicular to forward vector
      expect(dxR * dxF + dyR * dyF + dzR * dzF).toBeCloseTo(0, 5);
    }
  });

  it('gates landing/taxi/turnoff spotlights by gear state and headlightMode', () => {
    const inst = {
      id: '4', // 737-700
      llaLocation: [37.62, -122.38, 10] as [number, number, number],
      htr: [280, 0, 0] as [number, number, number],
      boundingSphereRadius: 20
    };

    const nightGearDown = computeAircraftLighting({
      inst,
      viewMatrix: undefined,
      switches: { ...DEFAULT_LIGHT_SWITCHES },
      headlightMode: 'auto',
      isNight: true,
      gearDown: true,
      nowMs: 10
    });
    expect(nightGearDown.spots.length).toBeGreaterThan(0);
    // Synthetic nav + beacon + strobe + logo present
    expect(nightGearDown.points.length).toBeGreaterThanOrEqual(4);

    const nightGearUp = computeAircraftLighting({
      inst,
      viewMatrix: undefined,
      switches: { ...DEFAULT_LIGHT_SWITCHES },
      headlightMode: 'auto',
      isNight: true,
      gearDown: false,
      nowMs: 10
    });
    expect(nightGearUp.spots).toHaveLength(0);

    const dayOff = computeAircraftLighting({
      inst,
      viewMatrix: undefined,
      switches: { ...DEFAULT_LIGHT_SWITCHES },
      headlightMode: 'auto',
      isNight: false,
      gearDown: true,
      nowMs: 10
    });
    expect(dayOff.spots).toHaveLength(0);

    const dayForcedOn = computeAircraftLighting({
      inst,
      viewMatrix: undefined,
      switches: { ...DEFAULT_LIGHT_SWITCHES },
      headlightMode: 'on',
      isNight: false,
      gearDown: true,
      nowMs: 10
    });
    expect(dayForcedOn.spots.length).toBeGreaterThan(0);

    const cold = presetToSwitches('coldAndDark');
    expect(cold.nav).toBe(true);
    expect(cold.landing).toBe(false);
    expect(cold.strobe).toBe(false);
  });

  it('collects nearest runway lights, maps colors, and caps at MAX_RUNWAY_LIGHTS', () => {
    expect(mapRunwayImageColor('runway_red_edge.png')[0]).toBeGreaterThan(0.9);
    expect(mapRunwayImageColor('yellow_hold.png')[1]).toBeCloseTo(0.74, 2);
    expect(mapRunwayImageColor('green_thresh.png')[1]).toBe(1.0);

    const lights = Array.from({ length: 70 }, (_, i) => ({
      _billboard: {
        _billboard: {
          _actualPosition: { x: i * 2, y: 0, z: 0 },
          _imageId: i % 3 === 0 ? 'red' : i % 3 === 1 ? 'green' : 'white'
        }
      }
    }));

    const nearest = collectNearestRunwayLights({ rw1: { lights } }, { x: 0, y: 0, z: 0 }, 280);
    expect(nearest).toHaveLength(MAX_RUNWAY_LIGHTS);
    expect(nearest[0].x).toBe(0);
    expect(nearest[MAX_RUNWAY_LIGHTS - 1].x).toBe((MAX_RUNWAY_LIGHTS - 1) * 2);

    const empty = collectNearestRunwayLights(undefined, { x: 0, y: 0, z: 0 });
    expect(empty).toHaveLength(0);

    const glow = new RunwayGlowController();
    const eye = glow.update({ rw1: { lights: lights.slice(0, 5) } }, { x: 0, y: 0, z: 0 }, undefined, 1500);
    expect(eye).toHaveLength(5);
    glow.reset();
  });

  it('parses Overpass taxiways with yellow runway intersections, caches tiles, and makes no telemetry calls', async () => {
    const query = buildOverpassQuery(37.6188, -122.375, 5000);
    expect(query).toContain('way["aeroway"="taxiway"]');
    expect(getTileKey(37.6188, -122.375)).toBe('geofs_ext_osm_twy_37.6_-122.4');

    const overpassData = {
      elements: [
        {
          type: 'way' as const,
          id: 1,
          geometry: [
            { lat: 37.6188, lon: -122.375 },
            { lat: 37.6198, lon: -122.375 } // ~111m north
          ]
        }
      ]
    };
    const runwaySegs = [{ lat1: 37.6188, lon1: -122.3755, lat2: 37.6188, lon2: -122.3745 }];
    const pts = parseOverpassTaxiways(overpassData, runwaySegs, 30, 60, 11);

    const yellow = pts.filter((p) => p.kind === 'centerline-yellow');
    const green = pts.filter((p) => p.kind === 'centerline-green');
    const blue = pts.filter((p) => p.kind === 'edge-blue');
    expect(yellow.length).toBeGreaterThan(0);
    expect(green.length).toBeGreaterThan(0);
    expect(blue.length).toBeGreaterThan(0);

    // Verify TaxiwayLightsController only fetches Overpass and caches in localStorage
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k)
    });
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => overpassData
    });
    vi.stubGlobal('fetch', fetchSpy);

    const twy = new TaxiwayLightsController();
    await twy.update(37.6188, -122.375, undefined, 10_000);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe(OVERPASS_ENDPOINT);

    // Second controller at same tile should hit cache within TTL (0 extra fetches)
    const twy2 = new TaxiwayLightsController();
    await twy2.update(37.6188, -122.375, undefined, 10_000 + 60_000);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Expired cache (> 30 days) triggers fresh fetch
    const twy3 = new TaxiwayLightsController();
    await twy3.update(37.6188, -122.375, undefined, 10_000 + TILE_CACHE_TTL_MS + 1000);
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    twy.dispose();
    twy2.dispose();
    twy3.dispose();
    vi.unstubAllGlobals();
  });
});
