import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GenericGpwsController } from '../src/modules/realism-pack/generic-gpws';
import { NightVfrLidarController, elevationFeetToLidarColor } from '../src/modules/realism-pack/lidar/lidar';
import { CameraResetController } from '../src/modules/realism-pack/camera-reset';
import { SlewModeController } from '../src/modules/realism-pack/slew-mode';
import { WindThermalsController, thermalStrengthToColor } from '../src/modules/realism-pack/wind-thermals';
import { FlightSessionEvaluator } from '../src/modules/landing-statistics/session-evaluator';
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

  it('triggers V1, ROTATE, and V2 callouts once per takeoff roll', () => {
    const gpws = new GenericGpwsController();
    const acWithV = {
      ...makeTelemetry().aircraft!,
      id: '4',
      vSpeeds: { V1: 130, VR: 136, V2: 144 }
    };
    expect(
      gpws.update(makeTelemetry({ aircraft: acWithV, aglFeet: 0, groundContact: true, kias: 120, throttles: [0.95], timestamp: 1000 }), true)
    ).toBeNull();
    expect(
      gpws.update(makeTelemetry({ aircraft: acWithV, aglFeet: 0, groundContact: true, kias: 131, throttles: [0.95], timestamp: 1500 }), true)?.text
    ).toBe('V1');
    expect(
      gpws.update(makeTelemetry({ aircraft: acWithV, aglFeet: 0, groundContact: true, kias: 137, throttles: [0.95], timestamp: 2000 }), true)?.text
    ).toBe('ROTATE');
    expect(
      gpws.update(makeTelemetry({ aircraft: acWithV, aglFeet: 20, groundContact: false, kias: 145, throttles: [0.95], timestamp: 2500 }), true)?.text
    ).toBe('V2');
    // Does not repeat
    expect(
      gpws.update(makeTelemetry({ aircraft: acWithV, aglFeet: 40, groundContact: false, kias: 148, throttles: [0.95], timestamp: 3000 }), true)
    ).toBeNull();
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

describe('Phase 2 Features: Night VFR LiDAR, Camera Reset, Slew Mode, Wind & Thermals', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('projects elevation-colored LiDAR terrain points at night when enabled and cleans up on dispose', () => {
    const addedPoints: Array<{ position: unknown; color: unknown; pixelSize?: number }> = [];
    const removedPrimitives: unknown[] = [];
    class MockPointCollection {
      public show = false;
      public get length() {
        return addedPoints.length;
      }
      public add(p: { position: unknown; color: unknown; pixelSize?: number }) {
        addedPoints.push(p);
        return p;
      }
      public removeAll() {
        addedPoints.length = 0;
      }
    }

    vi.stubGlobal('window', {
      Cesium: {
        PointPrimitiveCollection: MockPointCollection,
        Cartesian3: { fromDegrees: (lon: number, lat: number, alt: number) => ({ lon, lat, alt }) }
      },
      geofs: {
        getGroundAltitude: () => ({ location: [37.6, -122.4, 1500] }),
        api: {
          viewer: {
            scene: {
              primitives: {
                add: vi.fn(),
                remove: (p: unknown) => removedPrimitives.push(p)
              }
            }
          }
        }
      }
    });

    const lidar = new NightVfrLidarController({ maxPoints: 100 });
    // Daytime in auto mode -> 0 points
    expect(lidar.update(true, false, 37.6, -122.4, 10_000)).toBe(0);
    // Nighttime -> projects points
    const count = lidar.update(true, true, 37.6, -122.4, 15_000);
    expect(count).toBeGreaterThan(0);
    expect(addedPoints.length).toBe(count);

    const lowCol = elevationFeetToLidarColor(200) as { blue: number; red: number };
    const highCol = elevationFeetToLidarColor(18_000) as { blue: number; red: number };
    expect(lowCol.blue).toBeGreaterThan(highCol.blue);
    expect(highCol.red).toBeGreaterThan(lowCol.red);

    lidar.dispose();
    expect(removedPrimitives).toHaveLength(1);
  });

  it('triggers CameraResetController only on double middle-click', () => {
    const listeners: Record<string, (e: unknown) => void> = {};
    vi.stubGlobal('document', {
      addEventListener: (ev: string, fn: (e: unknown) => void) => {
        listeners[ev] = fn;
      },
      removeEventListener: vi.fn()
    });
    const resetSpy = vi.fn();
    vi.stubGlobal('window', {
      geofs: { camera: { reset: resetSpy } }
    });

    const onReset = vi.fn();
    const ctrl = new CameraResetController(onReset);
    ctrl.attach();

    // Left click ignored
    listeners.mousedown({ button: 0 });
    expect(resetSpy).not.toHaveBeenCalled();

    // Single middle click -> not reset yet
    listeners.mousedown({ button: 1 });
    expect(resetSpy).not.toHaveBeenCalled();

    // Second middle click within 320ms -> resets camera
    listeners.mousedown({ button: 1 });
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);

    ctrl.dispose();
  });

  it('activates, moves aircraft, zeroes gravity, and restores on SlewModeController deactivate', () => {
    const setRotSpy = vi.fn();
    const impulseSpy = vi.fn();
    const rigidBody = {
      gravityForce: [0, 0, -9.81] as [number, number, number],
      v_linearVelocity: [50, 0, 0] as [number, number, number],
      v_angularVelocity: [1, 0, 0] as [number, number, number],
      applyCentralImpulse: impulseSpy
    };
    const aircraft = {
      llaLocation: [37.62, -122.38, 500] as [number, number, number],
      groundContact: false,
      definition: { mass: 10_000, minimumSpeed: 60 },
      object3d: {
        setInitialRotation: setRotSpy,
        getWorldFrame: () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
      },
      rigidBody
    };
    const docListeners: Record<string, (e: unknown) => void> = {};
    vi.stubGlobal('document', {
      body: null,
      addEventListener: (ev: string, fn: (e: unknown) => void) => {
        docListeners[ev] = fn;
      },
      removeEventListener: vi.fn()
    });
    vi.stubGlobal('window', {
      geofs: {
        aircraft: { instance: aircraft },
        animation: { values: { heading360: 0 } }
      }
    });

    const slew = new SlewModeController();
    expect(slew.activate()).toBe(true);
    expect(slew.isActive()).toBe(true);

    // Hold 'KeyI' (forward north at heading 0) and 'KeyU' (up)
    docListeners.keydown({ code: 'KeyI', preventDefault: vi.fn() });
    docListeners.keydown({ code: 'KeyU', preventDefault: vi.fn() });
    slew.update(makeTelemetry({ dt: 0.1, aglFeet: 1500, groundContact: false }));

    expect(aircraft.llaLocation[0]).toBeGreaterThan(37.62);
    expect(aircraft.llaLocation[2]).toBeGreaterThan(500);
    expect(rigidBody.gravityForce).toEqual([0, 0, 0]);
    expect(setRotSpy).toHaveBeenCalled();

    slew.deactivate();
    expect(slew.isActive()).toBe(false);
    expect(rigidBody.gravityForce).toEqual([0, 0, -9.81]);
    expect(impulseSpy).toHaveBeenCalledTimes(1);
  });

  it('renders thermal & ridge-lift points in WindThermalsController when enabled', () => {
    const addedPoints: unknown[] = [];
    class MockPointCollection {
      public show = false;
      public add(p: unknown) {
        addedPoints.push(p);
        return p;
      }
      public removeAll() {
        addedPoints.length = 0;
      }
    }

    vi.stubGlobal('window', {
      Cesium: {
        PointPrimitiveCollection: MockPointCollection,
        Cartesian3: { fromDegrees: (lon: number, lat: number, alt: number) => ({ lon, lat, alt }) }
      },
      weather: {
        getLocalThermal: () => 4.2
      },
      geofs: {
        api: {
          viewer: {
            scene: {
              primitives: {
                add: vi.fn(),
                remove: vi.fn()
              }
            }
          }
        }
      }
    });

    const thermals = new WindThermalsController();
    expect(thermals.update(false, 37.6, -122.4, 3000, 1000)).toBe(0);
    const count = thermals.update(true, 37.6, -122.4, 3000, 5000);
    expect(count).toBeGreaterThan(0);
    expect(addedPoints.length).toBe(count);

    const weakCol = thermalStrengthToColor(0.1) as { red: number; green: number };
    const strongCol = thermalStrengthToColor(0.95) as { red: number; green: number };
    expect(strongCol.red).toBeGreaterThan(weakCol.red);
    thermals.dispose();
  });

  it('evaluates Authentic Flights vs Practice/Slew flights and computes 1-5 star ratings', () => {
    const ev = new FlightSessionEvaluator();
    // 1. Authentic flight: ground takeoff -> climb -> stabilized 500 ft approach -> butter TDZ
    ev.sample(makeTelemetry({ groundContact: true, aglFeet: 0, altitude: 100 }));
    ev.sample(makeTelemetry({ groundContact: false, aglFeet: 1200, altitude: 1300, roll: 12, gForce: 1.1 }));
    ev.sample(makeTelemetry({ groundContact: false, aglFeet: 480, altitude: 580, vs: -700, roll: 4 }));
    const authRes = ev.evaluate({ rating: 'Butter', score: 9.8, vsFpm: -65, bounces: 0, inTouchdownZone: true });
    expect(authRes.authenticFlight).toBe(true);
    expect(authRes.stars).toBe(5);
    expect(authRes.phaseCritique.approach).toContain('Stabilized');

    // 2. Practice / Slew flight -> authenticFlight is false
    ev.reset();
    ev.sample(makeTelemetry({ groundContact: false, aglFeet: 3000, altitude: 3100 }), true);
    const pracRes = ev.evaluate({ rating: 'Hard', score: 5.0, vsFpm: -620, bounces: 1, inTouchdownZone: false });
    expect(pracRes.authenticFlight).toBe(false);
    expect(pracRes.stars).toBeLessThanOrEqual(3);
  });
});
