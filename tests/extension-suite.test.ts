import { pinValue } from '../src/modules/failure-simulator';
import { describe, it, expect, beforeEach } from 'vitest';
import { parseSimMajor, classifyAircraft, SimAdapter } from '../src/core/sim-adapter';
import { ModuleManager } from '../src/core/module-manager';
import { detectGeoFSKeyCollision, formatComboForOs } from '../src/core/keybind-manager';
import { formatLogbookCsv } from '../src/core/logbook-export';
import { buildGForceShader } from '../src/modules/realism-pack';
import { rateLanding, scoreLanding } from '../src/modules/landing-statistics';
import { EngineCeiling, EngineThrust } from '../src/modules/overpowered-engines';
import { drainFuelTanks, fuelBurnKgHr } from '../src/modules/fuel-simulator';
import { projectFlightPath } from '../src/modules/flight-path-vector';
import { DEFAULT_SETTINGS } from '../src/types/settings';
import type { IModule } from '../src/types/module';

describe('SimAdapter & Version Detection', () => {
  beforeEach(() => {
    (globalThis as unknown as { window: Record<string, unknown> }).window = {};
  });

  it('recognizes GeoFS V3 and V4 while ignoring minor versions', () => {
    expect(parseSimMajor('3.9')).toBe(3);
    expect(parseSimMajor('v3.9.4')).toBe(3);
    expect(parseSimMajor('4.0')).toBe(4);
    expect(parseSimMajor('4.12.3')).toBe(4);
    expect(parseSimMajor('v4')).toBe(4);
    expect(parseSimMajor('2.9')).toBeNull();
    expect(parseSimMajor('5.0')).toBeNull();
  });

  it('classifies aircraft into correct categories for checklists and PID presets', () => {
    expect(classifyAircraft('Cessna 172', 1100, 1, 200)).toBe('ga-piston');
    expect(classifyAircraft('ATR 72-600', 22000, 2, 5000)).toBe('turboprop');
    expect(classifyAircraft('Airbus A350-900', 142400, 2, 160000)).toBe('airliner-twin');
    expect(classifyAircraft('Boeing 747-8i', 220000, 4, 280000)).toBe('airliner-quad');
    expect(classifyAircraft('F/A-18F Super Hornet', 15000, 2, 90000)).toBe('fighter');
    expect(classifyAircraft('Concorde', 78700, 4, 150000)).toBe('supersonic');
  });

  it('synchronizes multi-engine throttle channels in SimAdapter.setThrottle', () => {
    const controls: Record<string, unknown> = {
      throttle: 0,
      throttleLeft: 0,
      throttleRight: 0,
      throttle1: 0,
      throttle2: 0
    };
    (globalThis as unknown as { window: { controls: Record<string, unknown> } }).window.controls = controls;
    const sim = new SimAdapter();
    sim.setThrottle(0.75);
    expect(controls.throttle).toBe(0.75);
    expect(controls.throttleLeft).toBe(0.75);
    expect(controls.throttleRight).toBe(0.75);
    expect(controls.throttle1).toBe(0.75);
    expect(controls.throttle2).toBe(0.75);
  });
});

describe('ModuleManager Lifecycle & Error Isolation', () => {
  it('supports hot-toggling init() and destroy() cleanly', async () => {
    let inits = 0;
    let destroys = 0;
    const testMod: IModule = {
      id: 'autothrottle',
      name: 'Test',
      description: 'Test',
      supportedMajors: [3, 4],
      defaultEnabled: true,
      init() { inits++; },
      destroy() { destroys++; }
    };

    const manager = new ModuleManager(4, {
      sim: new SimAdapter(),
      audio: {} as never,
      anchors: {} as never,
      keybinds: {} as never,
      getSettings: () => DEFAULT_SETTINGS,
      updateSettings: () => {}
    });

    manager.register(testMod);
    await manager.applySettings({ ...DEFAULT_SETTINGS, modules: { autothrottle: true } });
    expect(manager.isActive('autothrottle')).toBe(true);
    expect(inits).toBe(1);

    await manager.applySettings({ ...DEFAULT_SETTINGS, modules: { autothrottle: false } });
    expect(manager.isActive('autothrottle')).toBe(false);
    expect(destroys).toBe(1);
  });
});

describe('Subsystems (Shaders, Landing Ratings, OS Keybinds)', () => {
  it('compiles GLSL 3.00 ES for V4 and GLSL 1.00 for V3', () => {
    const v4 = buildGForceShader(4);
    const v3 = buildGForceShader(3);
    expect(v4).toContain('in vec2 v_textureCoordinates');
    expect(v4).toContain('out_FragColor');
    expect(v3).toContain('varying vec2 v_textureCoordinates');
    expect(v3).toContain('gl_FragColor');
  });

  it('grades landings accurately', () => {
    expect([79, 80, 160, 300, 500, 800, 1100].map(rateLanding))
      .toEqual(['Butter', 'Silky', 'Great', 'Firm', 'Hard', 'Bone Shaker', 'Crash']);
    expect(scoreLanding(-50, 1, 0, 0, true)).toBe(10);
    expect(scoreLanding(-120, 1.5, 10, 1, false)).toBe(4);
  });

  it('formats Mac vs Windows keybind labels and detects GeoFS key collisions', () => {
    expect(formatComboForOs('Ctrl+Shift+A', 'mac')).toBe('⌃⇧A');
    expect(formatComboForOs('Ctrl+Shift+A', 'windows')).toBe('Ctrl+Shift+A');
    expect(detectGeoFSKeyCollision('G')).toContain('Landing Gear');
    expect(detectGeoFSKeyCollision('Shift+G')).toBeNull();
  });

  it('classifies rotorcraft and applies custom aircraft profile overrides', () => {
    expect(classifyAircraft('Robinson R44', 1134, 1, 180)).toBe('rotorcraft');

    const win = (globalThis as unknown as { window: Record<string, unknown> }).window;
    win.geofs = {
      version: '4.0',
      aircraft: {
        instance: {
          id: '9999',
          definition: { name: 'Boeing 737-800', mass: 41413 }
        }
      }
    };

    const sim = new SimAdapter();
    const matched = sim.getAircraftProfile();
    expect(matched?.category).toBe('airliner-twin');
    expect(matched?.vSpeeds?.Vref).toBe(134);

    sim.setAircraftOverrides({ '9999': { category: 'specialized', vSpeeds: { Vref: 150, Vne: 400 } } });
    const overridden = sim.getAircraftProfile();
    expect(overridden?.category).toBe('specialized');
    expect(overridden?.vSpeeds?.Vref).toBe(150);
    expect(overridden?.vSpeeds?.Vne).toBe(400);
  });

  it('exports landing logbook records as escaped CSV', () => {
    const csv = formatLogbookCsv([
      {
        id: '1',
        timestamp: '2026-11-15T12:00:00Z',
        aircraftId: '24',
        aircraftName: 'Airbus A350, XWB',
        vsFpm: -65,
        gForce: 1.04,
        rollDeg: 0.5,
        groundSpeedKts: 136,
        rating: 'Butter',
        lat: 37.62,
        lon: -122.38
      }
    ]);
    expect(csv).toContain('ID,Timestamp,Aircraft ID,Aircraft Name');
    expect(csv).toContain('"Airbus A350, XWB"');
    expect(csv).toContain('Butter');
  });
});

describe('Archived Engine and Flight Path Behavior', () => {
  it('applies forward, afterburner and reverse thrust, then restores the original aircraft parts', () => {
    const first = { thrust: 100, afterBurnerThrust: 180, reverseThrust: -50 };
    const replacement = { thrust: 200, reverseThrust: 0 };
    const engine = new EngineThrust();
    engine.apply({ first }, 2.5);
    engine.apply({ first }, 2.5);
    expect(first).toEqual({ thrust: 250, afterBurnerThrust: 450, reverseThrust: -125 });
    engine.apply({ replacement }, 2.5);
    expect(first).toEqual({ thrust: 100, afterBurnerThrust: 180, reverseThrust: -50 });
    expect(replacement).toEqual({ thrust: 500, reverseThrust: 0 });
    engine.restore();
    expect(replacement).toEqual({ thrust: 200, reverseThrust: 0 });
  });

  it('restores ceiling fields when switching aircraft or disabling the module', () => {
    const first = { zeroThrustAltitude: 50_000 };
    const second = { zeroRPMAltitude: 30_000 };
    const ceiling = new EngineCeiling();
    ceiling.apply(first, 3_000_000);
    expect(first).toEqual({ zeroThrustAltitude: 3_000_000, zeroRPMAltitude: 3_000_000 });
    ceiling.apply(second, 10_000_000);
    expect(first).toEqual({ zeroThrustAltitude: 50_000 });
    ceiling.restore();
    expect(second).toEqual({ zeroRPMAltitude: 30_000 });
  });

  it('restores original and absent failure properties', () => {
    const controls: { target: number; positionTarget?: number } = { target: 2 };
    const target = pinValue(controls, 'target', 0);
    const position = pinValue(controls, 'positionTarget', 0);
    target.apply();
    position.apply();
    expect(controls).toEqual({ target: 0, positionTarget: 0 });
    position.restore();
    target.restore();
    expect(controls).toEqual({ target: 2 });
  });

  it('drains the center fuel tank before both wing tanks', () => {
    expect(drainFuelTanks({ left: 30, center: 40, right: 30 }, 50)).toEqual({ left: 25, center: 0, right: 25 });
  });

  it('uses archived V3 and V4 thrust consumption and reverse scaling', () => {
    const telemetry = new SimAdapter().buildTelemetrySnapshot(0.1, 3);
    const aircraft = { engines: [{ thrust: 10_000 }, { thrust: 20_000 }], definition: { maxThrust: 60_000 } };
    expect(fuelBurnKgHr(aircraft, { ...telemetry, reverserActive: true })).toBeCloseTo(225);
    expect(fuelBurnKgHr(aircraft, { ...telemetry, simMajor: 4, reverserActive: true })).toBeCloseTo(303.75);
    expect(fuelBurnKgHr({ ...aircraft, engine: { on: false } }, telemetry)).toBe(0);
  });

  it('projects the measured flight path from the camera and drops stale samples', () => {
    const previous = { x: 0, y: 0, z: 0 };
    const current = { x: 5, y: 10, z: -2 };
    const camera = { x: 50, y: 60, z: 70 };
    expect(projectFlightPath(previous, current, camera, 0.5)).toEqual({ x: 65, y: 90, z: 64 });
    expect(projectFlightPath(previous, current, camera, 6)).toBeNull();
    expect(projectFlightPath(current, current, camera, 0.5)).toBeNull();
  });
});
