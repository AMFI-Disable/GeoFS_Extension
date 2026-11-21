import { describe, expect, it, vi } from 'vitest';
import { AutopilotPlusModule } from '../src/modules/autopilot-pp';
import {
  classifyHoldEntry,
  computeWcaDeg,
  crossoverAltitudeFt,
  greatCircleBearingDeg,
  greatCircleDistanceNm,
  headingDeltaDeg,
  kiasToKtas,
  kiasToMach,
  machToKias,
  stepHoldPattern
} from '../src/modules/autopilot-pp/math';
import type { ApPpHoldConfig, ApPpSnapshot } from '../src/modules/autopilot-pp/types';
import { AnchorManager } from '../src/core/anchor-manager';
import { AudioEngine } from '../src/core/audio-engine';
import { KeybindManager } from '../src/core/keybind-manager';
import { SimAdapter } from '../src/core/sim-adapter';
import type { FlightTelemetry, ModuleContext } from '../src/types/module';
import { DEFAULT_SETTINGS } from '../src/types/settings';

function makeTelemetry(overrides: Partial<FlightTelemetry> = {}): FlightTelemetry {
  return {
    timestamp: 1000,
    dt: 0.05,
    simMajor: 4,
    paused: false,
    isNight: false,
    aircraft: {
      id: '242',
      name: 'Airbus A321neo',
      category: 'airliner-twin',
      engineCount: 2,
      maxFlaps: 4,
      hasGear: true,
      hasSpoilers: true,
      oew: 50000,
      mtow: 97000,
      maxFuel: 26730,
      isDynamic: false,
      vSpeeds: { Vne: 360 }
    },
    kias: 250,
    mach: 0.65,
    altitude: 20000,
    aglFeet: 20000,
    vs: 0,
    heading: 90,
    groundSpeed: 330,
    gForce: 1.0,
    aoa: 2.5,
    pitch: 2.0,
    roll: 0,
    groundContact: false,
    crashed: false,
    autopilotOn: false,
    reverserActive: false,
    throttles: [0.7, 0.7],
    collective: null,
    rotorTorque: null,
    parkingBrake: false,
    gearDown: false,
    flapsTarget: 0,
    lightsOn: true,
    lat: 37.619,
    lon: -122.375,
    ...overrides
  };
}

describe('AP++ (Beta) Air-Data & Navigation Math', () => {
  it('computes KTAS > KIAS at altitude and round-trips Mach/KIAS', () => {
    const ktas = kiasToKtas(280, 30000);
    expect(ktas).toBeGreaterThan(420);
    const mach = kiasToMach(280, 30000);
    expect(mach).toBeGreaterThan(0.7);
    const backKias = machToKias(mach, 30000);
    expect(backKias).toBeCloseTo(280, 1);
    const xover = crossoverAltitudeFt(290, 0.78);
    expect(xover).toBeGreaterThan(22000);
    expect(xover).toBeLessThan(36000);
  });

  it('computes great-circle bearing and distance accurately', () => {
    const brgNorth = greatCircleBearingDeg(37.0, -122.0, 38.0, -122.0);
    expect(brgNorth).toBeCloseTo(0, 0);
    const dist = greatCircleDistanceNm(37.0, -122.0, 38.0, -122.0);
    expect(dist).toBeCloseTo(60, 0);
    expect(headingDeltaDeg(10, 350)).toBe(20);
    expect(headingDeltaDeg(350, 10)).toBe(-20);
  });

  it('advances racetrack hold state machine from outbound to inbound', () => {
    const hold: ApPpHoldConfig = {
      fixLat: 37.619,
      fixLon: -122.375,
      inboundCourseDeg: 90,
      legMinutes: 1.0,
      turnDir: 'R',
      phase: 'outbound',
      legElapsedSec: 59
    };
    const res1 = stepHoldPattern(hold, 37.619, -122.38, 270, 2);
    expect(hold.phase).toBe('turn-inbound');
    expect(res1.targetHeadingDeg).toBe(270);

    const res2 = stepHoldPattern(hold, 37.619, -122.38, 88, 1);
    expect(hold.phase).toBe('inbound');
    expect(res2.targetHeadingDeg).toBe(90);
    expect(res2.distToFixNm).toBeGreaterThan(0);
  });
});

describe('AutopilotPlusModule (Beta)', () => {
  it('handles HOLD HERE, envelope protection, stick disconnect, and electrical failure', () => {
    const sim = new SimAdapter();
    const setThrottlesSpy = vi.spyOn(sim, 'setThrottle').mockImplementation(() => {});
    const anchors = new AnchorManager();
    anchors.init();
    const snapshots: ApPpSnapshot[] = [];
    const failureHandlers = new Map<string, Array<(d: { type: string }) => void>>();

    const ctx: ModuleContext = {
      sim,
      audio: new AudioEngine(),
      anchors,
      keybinds: new KeybindManager(),
      getSettings: () => DEFAULT_SETTINGS,
      updateSettings: () => {},
      emitEvent: (ev, detail) => {
        if (ev === 'autopilot-pp:state' && detail) {
          snapshots.push(detail as unknown as ApPpSnapshot);
        }
      },
      onEvent: (ev, handler) => {
        const list = failureHandlers.get(ev) ?? [];
        list.push(handler as (d: { type: string }) => void);
        failureHandlers.set(ev, list);
        return () => {};
      }
    };

    const mod = new AutopilotPlusModule();
    expect(mod.name).toContain('Beta');
    mod.init(ctx);

    const g = globalThis as unknown as { window?: Record<string, unknown>; controls?: Record<string, unknown> };
    const prevWindow = g.window;
    g.window = { controls: { rawRoll: 0, rawPitch: 0, roll: 0, pitch: 0 } };
    g.controls = g.window.controls as Record<string, unknown>;

    mod.update(makeTelemetry({ timestamp: 1000 }));
    mod.handleCommand({ type: 'holdHere', legMinutes: 1.5, turnDir: 'L' });
    let latest = snapshots[snapshots.length - 1];
    expect(latest.engaged).toBe(true);
    expect(latest.lateralMode).toBe('hold');
    expect(latest.holdConfig.legMinutes).toBe(1.5);
    expect(latest.holdConfig.turnDir).toBe('L');

    // Alpha floor protection triggers TOGA thrust
    mod.update(makeTelemetry({ timestamp: 1300, aoa: 16.0, kias: 130 }));
    latest = snapshots[snapshots.length - 1];
    expect(latest.fma.protection).toBe('ALPHA FLOOR');
    expect(setThrottlesSpy).toHaveBeenCalledWith(1.0);

    // Sustained manual stick input disconnects AP++
    g.window.controls = { rawRoll: 0.6, rawPitch: 0, roll: 0, pitch: 0 };
    mod.update(makeTelemetry({ timestamp: 1400, dt: 0.2 }));
    mod.update(makeTelemetry({ timestamp: 1600, dt: 0.2 }));
    latest = snapshots[snapshots.length - 1];
    expect(latest.engaged).toBe(false);
    expect(latest.fma.protection).toBe('STICK DISC');

    // Electrical failure trips AP++
    g.window.controls = { rawRoll: 0, rawPitch: 0, roll: 0, pitch: 0 };
    mod.handleCommand({ type: 'engage' });
    expect(snapshots[snapshots.length - 1].engaged).toBe(true);
    for (const h of failureHandlers.get('failure:triggered') ?? []) {
      h({ type: 'electrical' });
    }
    expect(snapshots[snapshots.length - 1].engaged).toBe(false);
    expect(snapshots[snapshots.length - 1].degradedReason).toBe('Electrical Failure');

    mod.destroy();
    g.window = prevWindow;
  });

  it('classifies ICAO hold entries, computes WCA, and runs rotorcraft hover + autoland flare', () => {
    expect(classifyHoldEntry(90, 90, 'R')).toBe('direct');
    expect(classifyHoldEntry(210, 90, 'R')).toBe('teardrop');
    expect(classifyHoldEntry(320, 90, 'R')).toBe('parallel');
    expect(computeWcaDeg(90, 150, 30, 180)).toBeGreaterThan(0);

    const sim = new SimAdapter();
    const setThrottlesSpy = vi.spyOn(sim, 'setThrottle').mockImplementation(() => {});
    const anchors = new AnchorManager();
    anchors.init();
    const snapshots: ApPpSnapshot[] = [];

    const ctx: ModuleContext = {
      sim,
      audio: new AudioEngine(),
      anchors,
      keybinds: new KeybindManager(),
      getSettings: () => DEFAULT_SETTINGS,
      updateSettings: () => {},
      emitEvent: (ev, detail) => {
        if (ev === 'autopilot-pp:state' && detail) snapshots.push(detail as unknown as ApPpSnapshot);
      },
      onEvent: () => () => {}
    };

    const g = globalThis as unknown as { window?: Record<string, unknown>; controls?: Record<string, unknown> };
    const prevWindow = g.window;
    g.window = {
      controls: { rawRoll: 0, rawPitch: 0, roll: 0, pitch: 0 },
      addEventListener: () => {},
      removeEventListener: () => {}
    };
    g.controls = g.window.controls as Record<string, unknown>;

    const mod = new AutopilotPlusModule();
    mod.init(ctx);

    // Rotorcraft hover mode
    mod.handleCommand({ type: 'setHoverMode', enabled: true });
    mod.update(
      makeTelemetry({
        timestamp: 2000,
        altitude: 500,
        aglFeet: 450,
        kias: 12,
        groundSpeed: 10,
        roll: 8,
        pitch: 2,
        aircraft: { ...makeTelemetry().aircraft!, id: '9', name: 'EC-135', category: 'rotorcraft' }
      })
    );
    const hovSnap = snapshots[snapshots.length - 1];
    expect(hovSnap.fma.thr).toBe('HOV');
    expect(hovSnap.fma.vert).toBe('ALT HOV');
    expect(hovSnap.fma.lat).toBe('LVL');
    expect(setThrottlesSpy).toHaveBeenCalled();

    // Autoland flare & 27 ft RA retard
    mod.handleCommand({ type: 'setHoverMode', enabled: false });
    mod.handleCommand({ type: 'setLandingArm', armed: true });
    mod.update(makeTelemetry({ timestamp: 2500, aglFeet: 24, kias: 135, groundContact: false }));
    const ldgSnap = snapshots[snapshots.length - 1];
    expect(ldgSnap.landingRetarded).toBe(true);
    expect(ldgSnap.verticalMode).toBe('flare');
    expect(ldgSnap.fma.thr).toBe('IDLE');
    expect(ldgSnap.fma.vert).toBe('FLARE');

    mod.destroy();
    g.window = prevWindow;
  });
});
