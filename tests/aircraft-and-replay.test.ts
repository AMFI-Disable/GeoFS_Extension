import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatVSpeeds, parseAircraftOverride, parseAircraftOverrides } from '../src/core/aircraft-profile';
import { LandingReplay, landingReplayCsv } from '../src/core/landing-replay';
import { NAMED_AIRCRAFT_SPECS, SimAdapter, getAllCatalogAircraft } from '../src/core/sim-adapter';
import type { LandingRecord } from '../src/types/settings';

afterEach(() => vi.unstubAllGlobals());

describe('Aircraft Profiles', () => {
  it.each([3, 4] as const)('uses GeoFS V%s aircraft records, speeds, local time and rotor controls', (major) => {
    const simulator = {
      weather: { localTime: 23 },
      geofs: {
        aircraft: { instance: {
          aircraftRecord: { id: 4090, name: 'Robinson R-44' },
          definition: { Vspeeds: { VNE: 130, VFE: -1 } }
        } },
        animation: { values: { rotorTorque: 0 } }
      },
      controls: { throttle: 0.45 }
    };
    vi.stubGlobal('window', simulator);
    const adapter = new SimAdapter();
    const initial = adapter.buildTelemetrySnapshot(0.02, major);
    expect(initial).toMatchObject({
      isNight: true, collective: 0.45, rotorTorque: 0,
      aircraft: { id: '4090', category: 'rotorcraft', vSpeeds: { Vne: 130 } }
    });
    adapter.setAircraftOverrides({ '4090': parseAircraftOverride({ maxFuel: 90, vSpeeds: { Vne: 125, Vref: 65 } }) });
    expect(adapter.getAircraftProfile()).toMatchObject({ maxFuel: 90, vSpeeds: { Vne: 125, Vref: 65 } });
    expect(formatVSpeeds(adapter.getAircraftProfile()?.vSpeeds)).toContain('Vref 65');
    adapter.setAircraftOverrides({});
    expect(adapter.getAircraftProfile()?.vSpeeds).toEqual({ Vne: 130 });

    simulator.weather.localTime = 12;
    simulator.geofs.aircraft.instance.aircraftRecord = { id: 2, name: 'Cessna 172' };
    expect(adapter.buildTelemetrySnapshot(0.02, major)).toMatchObject({
      isNight: false, collective: null, rotorTorque: null, aircraft: { id: '2', category: 'ga-piston' }
    });
  });

  it('labels simulator Mach limits and prefers a user override in knots', () => {
    const instance = { id: 20, definition: { Vspeeds: { V1: 130, VNE: 2.04 } } };
    vi.stubGlobal('window', { geofs: { aircraft: { instance } } });
    const adapter = new SimAdapter();
    const profile = adapter.getAircraftProfile();
    expect(formatVSpeeds(profile?.vSpeeds, profile?.machSpeeds)).toBe('V-Speeds: V1 130 kt · Vne Mach 2.04');
    adapter.setAircraftOverrides({ '20': { vSpeeds: { Vne: 400 } } });
    const overridden = adapter.getAircraftProfile();
    expect(formatVSpeeds(overridden?.vSpeeds, overridden?.machSpeeds)).toBe('V-Speeds: V1 130 kt · Vne 400 kt');
  });

  it.each(['stopEngine', 'stopEngines'] as const)('stops engines with the simulator %s method', (method) => {
    const stop = vi.fn();
    const instance = { id: 20, [method]: stop };
    vi.stubGlobal('window', { geofs: { aircraft: { instance } } });
    expect(new SimAdapter().stopEngines()).toBe(true);
    expect(stop).toHaveBeenCalledOnce();
  });

  it('normalizes older saved profiles keyed by aircraft name', () => {
    vi.stubGlobal('window', { geofs: { aircraft: {
      instance: { id: 1234, aircraftRecord: { name: 'Boeing 737-800' } }
    } } });
    const adapter = new SimAdapter();
    adapter.setAircraftOverrides(parseAircraftOverrides({
      ' Boeing 737-800 ': { vSpeeds: { vref: 142 } },
      '1234': { category: 'invalid' }
    }));
    expect(adapter.getAircraftProfile()?.vSpeeds?.Vref).toBe(142);
  });

  it('keeps valid partial overrides and rejects invalid profile values', () => {
    expect(parseAircraftOverride({ maxFuel: 0, maxFlaps: 0, id: '123' })).toEqual({ maxFuel: 0, maxFlaps: 0 });
    expect(() => parseAircraftOverride({ vSpeeds: { VR: NaN } })).toThrow('VR');
    expect(() => parseAircraftOverride({ oew: 400, mtow: 350 })).toThrow('empty weight');
    expect(() => parseAircraftOverride({ category: 'ignored' })).toThrow('category');
  });
});

describe('Landing Replay', () => {
  it('bounds the approach history and always preserves the touchdown sample', () => {
    vi.stubGlobal('window', {});
    const snapshot = new SimAdapter().buildTelemetrySnapshot(0.02, 4);
    const replay = new LandingReplay();
    for (let timestamp = 0; timestamp < 90_050; timestamp += 50) {
      replay.record({ ...snapshot, timestamp });
    }
    const samples = replay.finish({ ...snapshot, timestamp: 90_050, groundContact: true });
    expect(samples.length).toBeLessThanOrEqual(121);
    expect(samples[0].timestampMs).toBeGreaterThanOrEqual(60_050);
    expect(samples.at(-1)).toMatchObject({ timestampMs: 90_050, groundContact: true });
    expect(replay.finish({ ...snapshot, timestamp: 95_000 })).toHaveLength(1);
  });

  it('exports legacy records and escapes user-supplied CSV fields', () => {
    const record: LandingRecord = {
      id: 'id', timestamp: '2026-11-15T00:00:00.000Z', aircraftId: '2', aircraftName: '=1,"Aircraft"',
      rating: 'Smooth', vsFpm: -110, gForce: 1.2, rollDeg: 2, groundSpeedKts: 65, lat: 0, lon: 0
    };
    const csv = landingReplayCsv(record);
    expect(csv).toContain('"\'=1,""Aircraft"""');
    expect(csv).toContain(',"Smooth",-110,');
  });
});

describe('Expanded Aircraft Catalog Integrity', () => {
  it('enforces valid weight, fuel, and V-speed invariants across all catalog and named specs', () => {
    const allSpecs = [...getAllCatalogAircraft(), ...NAMED_AIRCRAFT_SPECS.map((entry) => entry.spec)];
    expect(allSpecs.length).toBeGreaterThanOrEqual(100);
    for (const spec of allSpecs) {
      expect(spec.oew).toBeGreaterThan(0);
      expect(spec.mtow).toBeGreaterThan(spec.oew);
      expect(spec.maxFuel).toBeGreaterThanOrEqual(0);
      expect(spec.vSpeeds.vref).toBeGreaterThan(0);
      expect(spec.vSpeeds.vne).toBeGreaterThan(spec.vSpeeds.vref);
    }
  });

  it('resolves newly added named aircraft profiles (airliners, turboprops, bizjets, fighters, rotorcraft, gliders)', () => {
    const samples: Array<[string, string, number]> = [
      ['Airbus A220-300', 'airliner-twin', 126],
      ['Boeing 787-9 Dreamliner', 'airliner-twin', 139],
      ['Antonov An-225 Mriya', 'airliner-quad', 145],
      ['Pilatus PC-12', 'turboprop', 85],
      ['Gulfstream G650', 'airliner-twin', 126],
      ['Boeing F-15E Strike Eagle', 'fighter', 148],
      ['Airbus H145', 'rotorcraft', 65],
      ['Schleicher ASK 21', 'specialized', 48]
    ];
    for (const [name, expectedCategory, expectedVref] of samples) {
      vi.stubGlobal('window', {
        geofs: {
          aircraft: {
            instance: { id: '99999', name, definition: {} }
          }
        }
      });
      const profile = new SimAdapter().getAircraftProfile();
      expect(profile?.category).toBe(expectedCategory);
      expect(profile?.vSpeeds?.Vref).toBe(expectedVref);
    }
  });
});

