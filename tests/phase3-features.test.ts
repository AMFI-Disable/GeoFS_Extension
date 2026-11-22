import { afterEach, describe, expect, it, vi } from 'vitest';
import { computeRunwayWind, fetchFaaCharts } from '../src/shared/airport-charts';
import { generateRandomJob, getPilotRank } from '../src/shared/career-jobs';
import { fetchAdsbTraffic, syncGlobalRelay } from '../src/shared/global-traffic';
import { fetchSimBriefOfp } from '../src/shared/simbrief';
import { compareSemver } from '../src/shared/update-checker';
import { PushbackController } from '../src/modules/sim-utilities/pushback';
import { WalkaroundController } from '../src/modules/sim-utilities/walkaround';
import { detectImmersiveAirports } from '../src/modules/visuals-lighting';
import type { FlightTelemetry } from '../src/types/module';

function makeTelemetry(overrides: Partial<FlightTelemetry> = {}): FlightTelemetry {
  return {
    timestamp: Date.now(),
    dt: 0.1,
    simMajor: 4,
    paused: false,
    isNight: false,
    aircraft: null,
    kias: 0,
    mach: 0,
    altitude: 15,
    aglFeet: 0,
    vs: 0,
    heading: 90,
    groundSpeed: 0,
    gForce: 1,
    aoa: 0,
    pitch: 0,
    roll: 0,
    groundContact: true,
    crashed: false,
    autopilotOn: false,
    reverserActive: false,
    throttles: [0, 0],
    collective: null,
    rotorTorque: null,
    parkingBrake: false,
    gearDown: true,
    flapsTarget: 0,
    lightsOn: false,
    lat: 37.62,
    lon: -122.38,
    ...overrides
  };
}

const origWindow = globalThis.window;
const origDocument = globalThis.document;
const origFetch = globalThis.fetch;

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(globalThis, 'window', { value: origWindow, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'document', { value: origDocument, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'fetch', { value: origFetch, configurable: true, writable: true });
});

describe('SimBrief OFP Fetcher', () => {
  it('uses userid= for numeric Pilot IDs and username= for string usernames', async () => {
    const urls: string[] = [];
    const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
      urls.push(String(input));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          fetch: { status: 'Success' },
          origin: { icao_code: 'KSFO' },
          destination: { icao_code: 'KLAX' },
          general: { route: 'SSTIK5 PORTE', initial_altitude: '35000' },
          atc: { callsign: 'UAL123' },
          aircraft: { icaocode: 'A321' },
          fuel: { plan_ramp: '14250' },
          navlog: {
            fix: { ident: 'PORTE', pos_lat: '37.45', pos_long: '-122.48', altitude_feet: '12000' }
          }
        })
      } as unknown as Response;
    });
    Object.defineProperty(globalThis, 'fetch', { value: mockFetch, configurable: true, writable: true });

    const ofpId = await fetchSimBriefOfp(' 123456 ');
    expect(urls[0]).toContain('userid=123456');
    expect(ofpId.callsign).toBe('UAL123');
    expect(ofpId.origin).toBe('KSFO');
    expect(ofpId.destination).toBe('KLAX');
    expect(ofpId.cruiseAltFt).toBe(35000);
    expect(ofpId.blockFuelKg).toBe(14250);
    expect(ofpId.waypoints).toHaveLength(1);
    expect(ofpId.waypoints[0].ident).toBe('PORTE');

    await fetchSimBriefOfp('pilot_alpha');
    expect(urls[1]).toContain('username=pilot_alpha');
  });

  it('rejects empty username and propagates API error status', async () => {
    await expect(fetchSimBriefOfp('   ')).rejects.toThrow(/SimBrief username or Pilot ID/i);

    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ fetch: { status: 'Error: Unknown UserID' } })
    })) as unknown as typeof fetch;
    Object.defineProperty(globalThis, 'fetch', { value: mockFetch, configurable: true, writable: true });

    await expect(fetchSimBriefOfp('999999')).rejects.toThrow('Error: Unknown UserID');
  });
});

describe('Global Traffic & ADS-B', () => {
  it('parses Airplanes.live ADS-B payload, clamps radius, and handles ground altitude', async () => {
    let calledUrl = '';
    const mockFetch = vi.fn(async (input: RequestInfo | URL) => {
      calledUrl = String(input);
      return {
        ok: true,
        json: async () => ({
          ac: [
            { hex: 'a1b2c3', flight: 'SWA42 ', t: 'B738', lat: 37.6, lon: -122.4, alt_baro: 'ground', track: -10, gs: 14.6, baro_rate: 0 },
            { hex: 'd4e5f6', r: 'N172SP', t: 'C172', lat: 37.7, lon: -122.3, alt_geom: 2500.4, track: 375, gs: 105.2, baro_rate: 500 },
            { hex: 'bad', lat: undefined, lon: -122.1 }
          ]
        })
      } as unknown as Response;
    });
    Object.defineProperty(globalThis, 'fetch', { value: mockFetch, configurable: true, writable: true });

    const traffic = await fetchAdsbTraffic(37.62, -122.38, 999);
    expect(calledUrl).toContain('/37.620/-122.380/250');
    expect(traffic).toHaveLength(2);
    expect(traffic[0]).toMatchObject({
      id: 'adsb-a1b2c3',
      callsign: 'SWA42',
      altFt: 0,
      heading: 350,
      speedKts: 15,
      source: 'adsb'
    });
    expect(traffic[1]).toMatchObject({
      id: 'adsb-d4e5f6',
      callsign: 'N172SP',
      altFt: 2500,
      heading: 15,
      speedKts: 105,
      vsFpm: 500
    });
  });

  it('rejects non-HTTP relay URLs and maps relay traffic safely', async () => {
    expect(await syncGlobalRelay('javascript:alert(1)', null)).toEqual([]);
    expect(await syncGlobalRelay('', null)).toEqual([]);

    const mockFetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        traffic: [
          { id: '1', callsign: 'DAL10', aircraft: 'A350', lat: 40.6, lon: -73.7, altFt: 36000, heading: 90, speedKts: 480 }
        ]
      })
    })) as unknown as typeof fetch;
    Object.defineProperty(globalThis, 'fetch', { value: mockFetch, configurable: true, writable: true });

    const relay = await syncGlobalRelay('https://relay.example.com/traffic', null);
    expect(relay).toHaveLength(1);
    expect(relay[0].id).toBe('rly-1');
    expect(relay[0].source).toBe('relay');
  });
});

describe('Airport Charts & Crosswind Calculator', () => {
  it('computes headwind, tailwind, and crosswind components accurately', () => {
    expect(computeRunwayWind(280, 280, 20)).toEqual({ headwindKts: 20, crosswindKts: 0, side: 'CALM' });
    expect(computeRunwayWind(280, 100, 15)).toEqual({ headwindKts: -15, crosswindKts: 0, side: 'CALM' });
    expect(computeRunwayWind(360, 90, 12)).toEqual({ headwindKts: 0, crosswindKts: 12, side: 'RIGHT' });
    expect(computeRunwayWind(360, 270, 12)).toEqual({ headwindKts: 0, crosswindKts: 12, side: 'LEFT' });
    expect(computeRunwayWind(180, 90, 0)).toEqual({ headwindKts: 0, crosswindKts: 0, side: 'CALM' });
  });

  it('validates ICAO codes and parses FAA chart payloads', async () => {
    expect(await fetchFaaCharts('INVALID_ICAO')).toEqual([]);
    const mockFetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        KSFO: [
          { chart_name: 'ILS OR LOC RWY 28R', chart_code: 'IAP', pdf_path: 'https://charts.example.com/28r.pdf' },
          { chart_name: 'Missing PDF', chart_code: 'INFO' }
        ]
      })
    })) as unknown as typeof fetch;
    Object.defineProperty(globalThis, 'fetch', { value: mockFetch, configurable: true, writable: true });

    const charts = await fetchFaaCharts('ksfo');
    expect(charts).toEqual([
      { chartName: 'ILS OR LOC RWY 28R', chartCode: 'IAP', pdfUrl: 'https://charts.example.com/28r.pdf' }
    ]);
  });
});

describe('Career Jobs & Semver Update Checker', () => {
  it('maps XP thresholds to pilot ranks and generates valid flight jobs', () => {
    expect(getPilotRank(0)).toBe('Student Pilot');
    expect(getPilotRank(600)).toBe('First Officer');
    expect(getPilotRank(2000)).toBe('Captain');
    expect(getPilotRank(5000)).toBe('Senior Captain');
    expect(getPilotRank(10000)).toBe('Chief Pilot');

    const job = generateRandomJob();
    expect(job.origin).not.toBe(job.destination);
    expect(job.distanceNm).toBeGreaterThanOrEqual(85);
    expect(job.rewardXp).toBeGreaterThanOrEqual(150);
    expect(['PASSENGER', 'CARGO', 'VIP CHARTER']).toContain(job.jobType);
  });

  it('compares semantic versions with or without v-prefix', () => {
    expect(compareSemver('v0.3.1', '0.3.0')).toBe(1);
    expect(compareSemver('0.3.0', 'v0.3.0')).toBe(0);
    expect(compareSemver('0.2.9', '0.3.0')).toBe(-1);
    expect(compareSemver('1.0.0', '0.99.99')).toBe(1);
  });
});

describe('PushbackController', () => {
  it('blocks activation when airborne or moving fast and pushes back cleanly on ground', () => {
    const lla = [37.62, -122.38, 5];
    const htr = [0, 0, 0];
    const setLocation = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      value: {
        geofs: {
          isPaused: () => false,
          aircraft: {
            instance: {
              crashed: false,
              groundContact: false,
              llaLocation: lla,
              htr,
              setLocation,
              rigidBody: { v_linearVelocity: [1, 2, 3], v_angularVelocity: [1, 1, 1] }
            }
          },
          animation: {
            values: { kias: 120, haglFeet: 1500, groundContact: 0, heading360: 0 }
          }
        }
      },
      configurable: true,
      writable: true
    });

    const pb = new PushbackController();
    pb.setMode('straight');
    expect(pb.getMode()).toBe('off');
    expect(setLocation).not.toHaveBeenCalled();

    // Put aircraft parked on ground
    const g = (globalThis.window as unknown as { geofs: { aircraft: { instance: { groundContact: boolean } }; animation: { values: { kias: number; haglFeet: number; groundContact: number } } } }).geofs;
    g.aircraft.instance.groundContact = true;
    g.animation.values.kias = 0;
    g.animation.values.haglFeet = 0;
    g.animation.values.groundContact = 1;

    pb.setMode('right');
    expect(pb.getMode()).toBe('right');
    expect(setLocation).toHaveBeenCalled();
    // Heading 0 -> reverse moves south (lat decreases) and right turn increases heading
    expect(lla[0]).toBeLessThan(37.62);
    expect(htr[0]).toBeGreaterThan(0);

    // Airborne telemetry stops pushback
    const moved = pb.update(makeTelemetry({ groundContact: false, aglFeet: 120, kias: 40 }));
    expect(moved).toBe(false);
    expect(pb.getMode()).toBe('off');
  });
});

describe('WalkaroundController', () => {
  it('moves camera on WASD, ignores Alt+W modifier combos, and restores saved position on deactivate', () => {
    const camDef: { position: [number, number, number] } = { position: [1, 2, 3] };
    const setSpy = vi.fn();
    const resetSpy = vi.fn();
    const listeners = new Map<string, Set<(e: KeyboardEvent) => void>>();

    Object.defineProperty(globalThis, 'window', {
      value: {
        geofs: {
          camera: {
            currentMode: 2,
            currentDefinition: camDef,
            set: setSpy,
            reset: resetSpy
          }
        }
      },
      configurable: true,
      writable: true
    });
    Object.defineProperty(globalThis, 'document', {
      value: {
        addEventListener: (type: string, fn: (e: KeyboardEvent) => void) => {
          if (!listeners.has(type)) listeners.set(type, new Set());
          listeners.get(type)!.add(fn);
        },
        removeEventListener: (type: string, fn: (e: KeyboardEvent) => void) => {
          listeners.get(type)?.delete(fn);
        },
        getElementById: () => null,
        createElement: () => ({ id: '', style: { cssText: '' }, textContent: '', remove: vi.fn() }),
        body: { appendChild: vi.fn() }
      },
      configurable: true,
      writable: true
    });

    const walk = new WalkaroundController();
    expect(walk.activate()).toBe(true);

    // Alt+W should be ignored so it does not hijack exit hotkey
    const preventAlt = vi.fn();
    for (const fn of listeners.get('keydown') ?? []) {
      fn({ code: 'KeyW', altKey: true, ctrlKey: false, metaKey: false, target: null, preventDefault: preventAlt } as unknown as KeyboardEvent);
    }
    expect(preventAlt).not.toHaveBeenCalled();

    // Plain W moves forward
    const preventW = vi.fn();
    for (const fn of listeners.get('keydown') ?? []) {
      fn({ code: 'KeyW', altKey: false, ctrlKey: false, metaKey: false, target: null, preventDefault: preventW } as unknown as KeyboardEvent);
    }
    expect(preventW).toHaveBeenCalled();

    walk.update(makeTelemetry({ dt: 0.2 }));
    expect(camDef.position[1]).toBeGreaterThan(4);

    walk.deactivate();
    expect(walk.isActive()).toBe(false);
    expect(camDef.position).toEqual([1, 2, 3]);
    expect(setSpy).toHaveBeenCalledWith(2);
    expect(resetSpy).toHaveBeenCalled();
  });
});

describe('Immersive Airports Detection', () => {
  it('detects Immersive Airports via window globals or DOM markers', () => {
    Object.defineProperty(globalThis, 'window', { value: {}, configurable: true, writable: true });
    Object.defineProperty(globalThis, 'document', { value: { querySelector: () => null }, configurable: true, writable: true });
    expect(detectImmersiveAirports()).toBe(false);

    Object.defineProperty(globalThis, 'window', { value: { immersiveAirports: true }, configurable: true, writable: true });
    expect(detectImmersiveAirports()).toBe(true);
  });
});
