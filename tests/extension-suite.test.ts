import { pinValue } from '../src/modules/failure-simulator';
import { describe, it, expect, beforeEach } from 'vitest';
import { AnchorManager } from '../src/core/anchor-manager';
import { parseSimMajor, classifyAircraft, SimAdapter } from '../src/core/sim-adapter';
import { ModuleManager } from '../src/core/module-manager';
import { detectGeoFSKeyCollision, formatComboForOs } from '../src/core/keybind-manager';
import { formatLogbookCsv } from '../src/core/logbook-export';
import { SerializedLogbookStore } from '../src/background/logbook-store';
import { hasAircraftCallouts, installAircraftSounds } from '../src/modules/realism-pack/aircraft-sounds';
import { buildGForceShader } from '../src/modules/realism-pack';
import { rateLanding, scoreLanding } from '../src/modules/landing-statistics';
import { EngineCeiling, EngineThrust } from '../src/modules/overpowered-engines';
import { drainFuelTanks, fuelBurnKgHr } from '../src/modules/fuel-simulator';
import { projectFlightPath, resolveFpvColorState, resolveGlideslopeAppearance } from '../src/modules/flight-path-vector';
import { DEFAULT_SETTINGS } from '../src/types/settings';
import type { GeoFSAnimationValues, GeoFSSound } from '../src/types/geofs.d';
import type { IModule } from '../src/types/module';

describe('SimAdapter & Version Detection', () => {
  beforeEach(() => {
    (globalThis as unknown as { window: Record<string, unknown> }).window = {};
  });

  it('recognizes GeoFS V3 and V4 while ignoring minor and suffix tokens', () => {
    expect(parseSimMajor('3.9')).toBe(3);
    expect(parseSimMajor('v3.9.4')).toBe(3);
    expect(parseSimMajor('3.9-beta')).toBe(3);
    expect(parseSimMajor('GeoFS 3.9')).toBe(3);
    expect(parseSimMajor('4.0')).toBe(4);
    expect(parseSimMajor('4.12.3')).toBe(4);
    expect(parseSimMajor('v4')).toBe(4);
    expect(parseSimMajor('2.9')).toBeNull();
    expect(parseSimMajor('5.0')).toBeNull();
    expect(parseSimMajor('30')).toBeNull();
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

  it('restores native aircraft sounds and callout values after a live toggle', () => {
    const nativeEngine = { id: 'rpm1', file: 'native.mp3', effects: { volume: { value: 'rpm' }, pitch: { value: 'rpm' } } };
    const nativeWarning = { id: 'native-warning', file: 'warning.mp3' };
    const sounds: Record<string, GeoFSSound> = { rpm1: nativeEngine, 'native-warning': nativeWarning };
    const stopped: GeoFSSound[] = [];
    window.audio = { sounds, soundplayer: { stopSound: (sound) => stopped.push(sound) } };
    const aircraft = { id: 25, definition: { sounds: [nativeEngine] } };
    const effects = installAircraftSounds(aircraft);
    expect(effects).toBeDefined();
    expect(sounds.rpm1.file).toContain('777enginelow.mp3');
    expect(sounds['native-warning']).toBe(nativeWarning);
    expect(hasAircraftCallouts()).toBe(true);

    const values: GeoFSAnimationValues = { gearPosition: 0, flapsPosition: 3 };
    const telemetry = new SimAdapter().buildTelemetrySnapshot(0.02, 4);
    effects?.update({ ...telemetry, aglFeet: 62, vs: -400, groundContact: false }, values);
    expect(values['geofs-ext-realism-50']).toBe(1);
    effects?.restore();
    expect(stopped).toContain(nativeEngine);
    expect(sounds).toEqual({ rpm1: nativeEngine, 'native-warning': nativeWarning });
    expect(values).toEqual({ gearPosition: 0, flapsPosition: 3 });
    delete window.audio;
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

  it('serializes concurrent logbook writes without dropping records', async () => {
    let mem: import('../src/types/settings').LandingRecord[] = [];
    const store = new SerializedLogbookStore({
      get: async () => {
        await new Promise((r) => setTimeout(r, 5));
        return mem;
      },
      set: async (_k, next) => {
        await new Promise((r) => setTimeout(r, 5));
        mem = next;
      }
    });

    const base = {
      timestamp: '2026-11-16T00:00:00Z',
      aircraftId: '24',
      aircraftName: 'Airbus A350-900',
      vsFpm: -80,
      gForce: 1.05,
      rollDeg: 0.4,
      groundSpeedKts: 135,
      rating: 'Butter' as const,
      lat: 37.62,
      lon: -122.38
    };

    await Promise.all([
      store.append({ ...base, id: 'stable-tab-1' }),
      store.append({ ...base, id: 'beta-tab-2' }),
      store.append({ ...base, id: 'stable-tab-1' })
    ]);

    expect(mem.map((r) => r.id)).toEqual(['stable-tab-1', 'beta-tab-2']);
  });

  it('adapts glideslope text color for daytime, twilight, and night in-game time', () => {
    const win = (globalThis as unknown as { window: Record<string, unknown> }).window;
    win.geofs = { version: '4.0', environment: { sunElevation: 0.45 } };
    expect(resolveGlideslopeAppearance()).toMatchObject({ phase: 'day', color: '#000000' });

    win.geofs = { version: '4.0', environment: { sunElevation: 0.01 } };
    expect(resolveGlideslopeAppearance()).toMatchObject({ phase: 'twilight', color: '#f8fafc' });

    win.geofs = { version: '4.0', environment: { sunElevation: -0.25 } };
    expect(resolveGlideslopeAppearance()).toMatchObject({ phase: 'night', color: '#ffffff' });

    win.geofs = { version: '3.9', camera: { lla: [37.6, -122.4, 500] }, api: { viewer: { clock: { currentTime: 't' } } } };
    win.Cesium = { JulianDate: { toDate: () => new Date('2026-11-16T20:00:00Z') } };
    expect(resolveGlideslopeAppearance()).toMatchObject({ phase: 'day', color: '#000000' });

    win.Cesium = { JulianDate: { toDate: () => new Date('2026-11-16T06:00:00Z') } };
    expect(resolveGlideslopeAppearance()).toMatchObject({ phase: 'night', color: '#ffffff' });

    delete win.Cesium;
    win.geofs = { version: '4.0' };
    win.weather = { localTime: 18.5 };
    expect(resolveGlideslopeAppearance()).toMatchObject({ phase: 'twilight', color: '#f8fafc' });
    win.weather = { localTime: 22.0 };
    expect(resolveGlideslopeAppearance()).toMatchObject({ phase: 'night', color: '#ffffff' });
  });

  it('synchronizes autopilot pad CSS variables from native .geofs-autopilot-pad', () => {
    const props = new Map<string, string>();
    const wrapperProps = new Map<string, string>();
    const nativeLabel = { kind: 'label' };
    const nativePad = {
      getBoundingClientRect: () => ({ width: 88, height: 27 }),
      querySelector: () => nativeLabel
    };
    const host = {
      querySelector: () => nativePad
    };
    const padEl = {
      isConnected: true,
      closest: () => host,
      style: { setProperty: (k: string, v: string) => props.set(k, v) }
    } as unknown as HTMLElement;
    const wrapperEl = {
      style: { setProperty: (k: string, v: string) => wrapperProps.set(k, v) }
    } as unknown as HTMLElement;

    (globalThis as unknown as { window: Record<string, unknown> }).window = {};
    (globalThis as unknown as { document: Record<string, unknown> }).document = {
      querySelector: () => null
    };
    (globalThis as unknown as { getComputedStyle: (el: unknown) => CSSStyleDeclaration }).getComputedStyle = (el) =>
      (el === nativeLabel
        ? { fontFamily: '"Roboto", sans-serif', fontSize: '12px', fontWeight: '400', letterSpacing: '0.5px' }
        : { borderRadius: '15px', margin: '0px 8px', verticalAlign: 'middle' }) as unknown as CSSStyleDeclaration;

    const anchors = new AnchorManager();
    anchors.syncAutopilotPad(padEl, wrapperEl, true);

    expect(props.get('--geofs-ext-ap-width')).toBe('88px');
    expect(props.get('--geofs-ext-ap-height')).toBe('27px');
    expect(props.get('--geofs-ext-ap-radius')).toBe('15px');
    expect(props.get('--geofs-ext-ap-margin')).toBe('0px 8px');
    expect(props.get('--geofs-ext-ap-valign')).toBe('middle');
    expect(props.get('--geofs-ext-ap-font-family')).toBe('"Roboto", sans-serif');
    expect(props.get('--geofs-ext-ap-font-size')).toBe('12px');
    expect(props.get('--geofs-ext-ap-font-weight')).toBe('400');
    expect(props.get('--geofs-ext-ap-letter-spacing')).toBe('0.5px');
    expect(wrapperProps.get('--geofs-ext-ap-valign')).toBe('middle');
    delete (globalThis as unknown as { document?: unknown }).document;
    delete (globalThis as unknown as { getComputedStyle?: unknown }).getComputedStyle;
  });

  it('keeps FPV green/amber on ground, low speed, and normal descents while warning red only on valid airborne stall/AoA', () => {
    expect(resolveFpvColorState({ vs: 0, aoa: 90, kias: 0, groundContact: true }, { stalling: true }))
      .toEqual({ isWarning: false, hue: 120 });

    expect(resolveFpvColorState({ vs: 0, aoa: 45, kias: 18, groundContact: false }, { stalling: true }))
      .toEqual({ isWarning: false, hue: 120 });

    expect(resolveFpvColorState({ vs: 200, aoa: 180, kias: 120, groundContact: false }, { stalling: false }).isWarning)
      .toBe(false);

    const descent = resolveFpvColorState({ vs: -3000, aoa: 2, kias: 280, groundContact: false }, { stalling: false });
    expect(descent.isWarning).toBe(false);
    expect(descent.hue).toBeGreaterThanOrEqual(60);

    const steepDive = resolveFpvColorState({ vs: -6000, aoa: 1, kias: 340, groundContact: false }, { stalling: false });
    expect(steepDive).toEqual({ isWarning: false, hue: 30 });

    expect(resolveFpvColorState({ vs: 3000, aoa: 8, kias: 220, groundContact: false }, { stalling: false }))
      .toEqual({ isWarning: false, hue: 200 });

    expect(resolveFpvColorState({ vs: -800, aoa: 19, kias: 110, groundContact: false, aglFeet: 500 }, { stalling: false }))
      .toEqual({ isWarning: true, hue: 0 });
    expect(resolveFpvColorState({ vs: -200, aoa: 19, kias: 135, groundContact: false, aglFeet: 12 }, { stalling: true }))
      .toEqual({ isWarning: false, hue: 116 });
    expect(resolveFpvColorState({ vs: 1200, aoa: 19, kias: 260, groundContact: false, aglFeet: 5000 }, { stalling: false }))
      .toEqual({ isWarning: false, hue: 152 });
    expect(resolveFpvColorState({ vs: -1200, aoa: 10, kias: 95, groundContact: false, aglFeet: 500 }, { stalling: true }))
      .toEqual({ isWarning: true, hue: 0 });
    expect(resolveFpvColorState({ vs: Number.NaN, aoa: Number.NaN, kias: 200, groundContact: false }, null))
      .toEqual({ isWarning: false, hue: 120 });
  });
});
