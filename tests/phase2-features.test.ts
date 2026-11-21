import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GenericGpwsController } from '../src/modules/realism-pack/generic-gpws';
import {
  destinationPoint,
  filterGates,
  spawnAtGate,
  type GateEntry
} from '../src/modules/gate-spawner';
import type { FlightTelemetry } from '../src/types/module';

function makeTelemetry(overrides: Partial<FlightTelemetry> = {}): FlightTelemetry {
  return {
    simMajor: 4,
    timestamp: 10_000,
    dt: 0.1,
    paused: false,
    isNight: false,
    autopilotOn: false,
    lightsOn: false,
    crashed: false,
    kias: 140,
    mach: 0.22,
    groundSpeed: 138,
    altitude: 1500,
    aglFeet: 600,
    vs: -700,
    heading: 280,
    pitch: -3,
    roll: 0,
    aoa: 4,
    gForce: 1,
    lat: 37.62,
    lon: -122.38,
    groundContact: false,
    gearDown: true,
    parkingBrake: false,
    flapsTarget: 3,
    airbrakesPosition: 0,
    reverserActive: false,
    throttles: [0.4],
    collective: null,
    rotorTorque: null,
    glideslopeDeviation: 0,
    aircraft: {
      id: '2',
      name: 'Cessna 172',
      category: 'ga-piston',
      engineCount: 1,
      maxFlaps: 3,
      hasGear: false,
      hasSpoilers: false,
      oew: 757,
      mtow: 1157,
      maxFuel: 160,
      isDynamic: false
    },
    ...overrides
  };
}

describe('Phase 2 Features: Generic GPWS', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('triggers descent altitude callouts once per crossing and resets above 1200 ft AGL', () => {
    const gpws = new GenericGpwsController();
    // Initial sample at 550 ft
    expect(gpws.update(makeTelemetry({ aglFeet: 550, timestamp: 1000 }), true)).toBeNull();
    // Descend through 500
    const a500 = gpws.update(makeTelemetry({ aglFeet: 495, timestamp: 1500 }), true);
    expect(a500?.text).toBe('500');
    // Stay below 500 -> does not repeat
    expect(gpws.update(makeTelemetry({ aglFeet: 480, timestamp: 2000 }), true)).toBeNull();
    // Descend through 100 -> 50 -> 20
    expect(gpws.update(makeTelemetry({ aglFeet: 95, timestamp: 3000 }), true)?.text).toBe('100');
    expect(gpws.update(makeTelemetry({ aglFeet: 48, timestamp: 4000 }), true)?.text).toBe('50');

    // Climb above 1200 ft resets latches
    expect(gpws.update(makeTelemetry({ aglFeet: 1300, vs: 800, timestamp: 5000 }), true)).toBeNull();
    expect(gpws.update(makeTelemetry({ aglFeet: 520, vs: -600, timestamp: 6000 }), true)).toBeNull();
    expect(gpws.update(makeTelemetry({ aglFeet: 490, vs: -600, timestamp: 6500 }), true)?.text).toBe('500');
    gpws.dispose();
  });

  it('triggers PULL UP, SINK RATE, TOO LOW GEAR, and BANK ANGLE warnings with cooldowns', () => {
    const gpws = new GenericGpwsController();
    expect(gpws.update(makeTelemetry({ aglFeet: 800, vs: -4000, timestamp: 1000 }), true)?.text).toBe('PULL UP');
    // Cooldown suppresses immediate repeat
    expect(gpws.update(makeTelemetry({ aglFeet: 750, vs: -4000, timestamp: 2000 }), true)).toBeNull();

    // SINK RATE
    expect(gpws.update(makeTelemetry({ aglFeet: 1800, vs: -2800, timestamp: 6000 }), true)?.text).toBe('SINK RATE');

    // TOO LOW, GEAR on gear-equipped aircraft
    const jetAc = { ...makeTelemetry().aircraft!, id: '5', hasGear: true };
    expect(
      gpws.update(makeTelemetry({ aircraft: jetAc, aglFeet: 400, vs: -600, gearDown: false, timestamp: 12_000 }), true)?.text
    ).toBe('TOO LOW, GEAR');

    // BANK ANGLE
    expect(gpws.update(makeTelemetry({ aglFeet: 1200, roll: 44, vs: 0, timestamp: 18_000 }), true)?.text).toBe('BANK ANGLE');
    gpws.dispose();
  });

  it('defers to built-in aircraft callouts when geofs-ext-realism-50 is active', () => {
    (window as unknown as Record<string, unknown>).audio = {
      sounds: { 'geofs-ext-realism-50': { id: 'geofs-ext-realism-50', file: '50.mp3' } }
    };
    const gpws = new GenericGpwsController();
    expect(gpws.update(makeTelemetry({ aglFeet: 550, timestamp: 1000 }), true)).toBeNull();
    expect(gpws.update(makeTelemetry({ aglFeet: 490, timestamp: 1500 }), true)).toBeNull();
    gpws.dispose();
  });
});

describe('Phase 2 Features: Gate Spawner', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('filters gates by search query and aircraft category chips', () => {
    const gates: GateEntry[] = [
      { ref: 'A10', lat: 51.47, lon: -0.45, heading: 90, width_code: 'E', airplane_types: ['heavy'] },
      { ref: 'B22', lat: 51.47, lon: -0.46, heading: 180, width_code: 'F', airplane_types: ['heavy'], operation_type: 'cargo' },
      { ref: 'GA1', lat: 51.48, lon: -0.47, heading: 0, operation_type: 'general_aviation' }
    ];

    expect(filterGates(gates, 'b22', new Set())).toHaveLength(1);
    expect(filterGates(gates, '', new Set(['codeF']))).toHaveLength(1);
    expect(filterGates(gates, '', new Set(['heavy']))).toHaveLength(2);
    expect(filterGates(gates, '', new Set(['ga']))[0].ref).toBe('GA1');
  });

  it('computes back-offset spawn coordinates and places aircraft parked at gate', () => {
    const pt = destinationPoint(51.47, -0.45, 180, 6);
    expect(pt.lat).toBeLessThan(51.47);
    expect(pt.lon).toBeCloseTo(-0.45, 5);

    const placeSpy = vi.fn();
    const brakeSpy = vi.fn();
    const rigidBody: Record<string, unknown> = { v_linearVelocity: [10, 0, 0] };
    (window as unknown as Record<string, unknown>).geofs = {
      getGroundAltitude: () => ({ location: [51.47, -0.45, 25] }),
      animation: { values: { parkingBrake: 0 } },
      aircraft: { instance: { place: placeSpy, rigidBody, groundContact: false } }
    };
    (window as unknown as Record<string, unknown>).controls = {
      setters: { setParkingBrake: { set: brakeSpy } }
    };

    const ok = spawnAtGate({ ref: 'T5', lat: 51.47, lon: -0.45, heading: 0 });
    expect(ok).toBe(true);
    expect(placeSpy).toHaveBeenCalledTimes(1);
    expect(placeSpy.mock.calls[0][0][2]).toBe(25);
    expect(placeSpy.mock.calls[0][1]).toEqual([0, 0, 0]);
    expect(rigidBody.v_linearVelocity).toEqual([0, 0, 0]);
    expect(brakeSpy).toHaveBeenCalledTimes(1);
  });
});
