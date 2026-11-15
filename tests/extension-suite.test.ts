import { describe, it, expect, beforeEach } from 'vitest';
import { parseSimMajor, classifyAircraft, SimAdapter } from '../src/core/sim-adapter';
import { ModuleManager } from '../src/core/module-manager';
import { detectGeoFSKeyCollision, formatComboForOs } from '../src/core/keybind-manager';
import { formatLogbookCsv } from '../src/core/logbook-export';
import { buildGForceShader } from '../src/modules/realism-pack';
import { rateLanding } from '../src/modules/landing-statistics';
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
    expect(rateLanding(-65, 1.05)).toBe('Butter');
    expect(rateLanding(-160, 1.15)).toBe('Smooth');
    expect(rateLanding(-310, 1.35)).toBe('Firm');
    expect(rateLanding(-600, 2.2)).toBe('Hard');
    expect(rateLanding(-1200, 3.5)).toBe('Crash');
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
    expect(matched?.vSpeeds.vref).toBe(134);

    sim.setOverrides({ '9999': { category: 'specialized', vSpeeds: { vref: 150, vne: 400 } } });
    const overridden = sim.getAircraftProfile();
    expect(overridden?.category).toBe('specialized');
    expect(overridden?.vSpeeds.vref).toBe(150);
    expect(overridden?.vSpeeds.vne).toBe(400);
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
