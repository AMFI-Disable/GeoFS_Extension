import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_EXTENSION_CONFIG,
  DEFAULT_SCRIPT_CONFIG,
  DEFAULT_SETTINGS,
  mergeSettings,
  splitSettings,
  type ExtensionSettings
} from '../src/types/settings';
import { EffectiveSasController, readPilotControls } from '../src/modules/overpowered-engines';
import {
  MANDATORY_PHASE_ORDER,
  evaluateChecklistSync,
  getMandatoryProcedures,
  isHardwareSync
} from '../src/modules/checklist-system/procedures';
import { fuelBurnKgHr } from '../src/modules/fuel-simulator';
import {
  computeRecoverySuccess,
  contingencyProcedure,
  emergencyProcedure,
  isFailureRecoverable
} from '../src/modules/failure-simulator';
import { resolveFpvImageUrl } from '../src/modules/flight-path-vector';
import { REALISM_OPTION_META } from '../src/modules/realism-pack';
import { SimAdapter, getAllCatalogAircraft } from '../src/core/sim-adapter';
import type { AircraftProfile, FlightTelemetry } from '../src/types/module';

function makeTelemetry(overrides: Partial<FlightTelemetry> = {}): FlightTelemetry {
  vi.stubGlobal('window', {});
  const base = new SimAdapter().buildTelemetrySnapshot(0.02, 4);
  return { ...base, ...overrides };
}

afterEach(() => vi.unstubAllGlobals());

describe('Split Settings Schema & Legacy Migration', () => {
  it('separates extensionConfig and scriptConfig cleanly without key leakage', () => {
    const custom: ExtensionSettings = {
      ...DEFAULT_SETTINGS,
      themeMode: 'light',
      calibratorPreset: '4k',
      opSyncPolicy: 'allow',
      opDeltaThresholdKts: 220,
      sasStrength: 1.7,
      failureRecoveryChancePct: 75,
      fpvProjectionFactor: 22
    };

    const { extensionConfig, scriptConfig } = splitSettings(custom);
    expect(Object.keys(extensionConfig).sort()).toEqual(Object.keys(DEFAULT_EXTENSION_CONFIG).sort());
    expect(Object.keys(scriptConfig).sort()).toEqual(Object.keys(DEFAULT_SCRIPT_CONFIG).sort());
    expect(extensionConfig.themeMode).toBe('light');
    expect(extensionConfig.calibratorPreset).toBe('4k');
    expect(scriptConfig.opSyncPolicy).toBe('allow');
    expect(scriptConfig.sasStrength).toBe(1.7);
    expect(scriptConfig.fpvProjectionFactor).toBe(22);
  });

  it('migrates legacy storage keys while preferring split configs', () => {
    const legacy = {
      ...DEFAULT_SETTINGS,
      themeMode: 'light' as const,
      opSyncPolicy: 'never' as const,
      opThrustMultiplier: 500
    };
    const migrated = mergeSettings(undefined, undefined, legacy);
    expect(migrated.themeMode).toBe('light');
    expect(migrated.opSyncPolicy).toBe('never');
    expect(migrated.opThrustMultiplier).toBe(500);

    const overridden = mergeSettings({ themeMode: 'dark' }, { opSyncPolicy: 'allow' }, legacy);
    expect(overridden.themeMode).toBe('dark');
    expect(overridden.opSyncPolicy).toBe('allow');
    expect(overridden.opThrustMultiplier).toBe(500);
  });
});

describe('Effective Closed-Loop SAS Controller', () => {
  it('reads rawRoll/rawPitch/rawYaw over smoothed controls and applies deadzone', () => {
    expect(readPilotControls({ rawRoll: 0.01, rawPitch: -0.02, roll: 0.4, pitch: -0.3 })).toEqual({
      roll: 0.01,
      pitch: -0.02,
      yaw: 0,
      controlling: false
    });
    expect(readPilotControls({ rawRoll: 0.15, pitch: 0.2 })).toEqual({
      roll: 0.15,
      pitch: 0.2,
      yaw: 0,
      controlling: true
    });
  });

  it('captures neutral attitude on stick release, damps rates on maneuver, and zeros on ground/deadband', () => {
    const sas = new EffectiveSasController();
    let currentAv: [number, number, number] = [2.4, -1.8, 0.9];
    const torques: [number, number, number][] = [];
    const rigidBody = {
      mass: 25000,
      getAngularVelocity: () => currentAv,
      setAngularVelocity: (next: [number, number, number]) => {
        currentAv = next;
      },
      applyTorque: (torque: [number, number, number]) => {
        torques.push(torque);
      }
    };

    const manRes = sas.step({
      rigidBody,
      controls: { rawRoll: 0.3, rawPitch: 0, rawYaw: 0 },
      pitchDeg: 6,
      rollDeg: 18,
      kias: 650,
      multiplier: 1000,
      sasStrength: 1.2,
      groundContact: false
    });
    expect(manRes.mode).toBe('maneuver');
    expect(manRes.controlling).toBe(true);
    expect(Math.abs(currentAv[0])).toBeLessThan(2.4);

    // Release stick at pitch=8, roll=12
    const holdCapture = sas.step({
      rigidBody,
      controls: { rawRoll: 0, rawPitch: 0, rawYaw: 0 },
      pitchDeg: 8,
      rollDeg: 12,
      kias: 650,
      multiplier: 1000,
      sasStrength: 1.5,
      groundContact: false
    });
    expect(holdCapture.mode).toBe('hold');
    expect(sas.targetPitch).toBe(8);
    expect(sas.targetRoll).toBe(12);
    expect(currentAv).toEqual([0, 0, 0]);

    // Perturb aircraft away from captured attitude -> corrective angular velocity & torque applied
    const disturbRes = sas.step({
      rigidBody,
      controls: { rawRoll: 0, rawPitch: 0, rawYaw: 0 },
      pitchDeg: 4,
      rollDeg: 22,
      kias: 650,
      multiplier: 1000,
      sasStrength: 1.5,
      groundContact: false
    });
    expect(disturbRes.mode).toBe('hold');
    expect(disturbRes.nextAngularVelocity?.[0]).toBeGreaterThan(0);
    expect(disturbRes.nextAngularVelocity?.[1]).toBeLessThan(0);
    expect(torques.length).toBeGreaterThan(0);

    // Ground contact stops stabilization torque/rates cleanly
    const groundRes = sas.step({
      rigidBody,
      controls: { rawRoll: 0, rawPitch: 0, rawYaw: 0 },
      pitchDeg: 4,
      rollDeg: 22,
      kias: 80,
      multiplier: 1000,
      sasStrength: 1.5,
      groundContact: true
    });
    expect(groundRes.nextAngularVelocity).toEqual([0, 0, 0]);
  });
});

describe('Tailored Per-Aircraft Mandatory Checklists & Telemetry Predicates', () => {
  it('provides all 4 mandatory flight-gate phases across every catalog aircraft category', () => {
    const catalog = getAllCatalogAircraft();
    expect(catalog.length).toBeGreaterThanOrEqual(20);

    const representativeIds = ['1', '2', '24', '25', '5193', '20', '27', '2953'];
    for (const id of representativeIds) {
      const entry = catalog.find((item) => item.id === id);
      expect(entry).toBeDefined();
      const profile: AircraftProfile = {
        id: entry!.id,
        name: entry!.name,
        category: entry!.category,
        engineCount: entry!.engineCount,
        maxFlaps: entry!.maxFlaps,
        hasGear: entry!.hasGear,
        hasSpoilers: entry!.hasSpoilers,
        oew: entry!.oew,
        mtow: entry!.mtow,
        maxFuel: entry!.maxFuel,
        isDynamic: false,
        vSpeeds: entry!.vSpeeds
          ? {
              V1: entry!.vSpeeds.v1,
              VR: entry!.vSpeeds.vr,
              V2: entry!.vSpeeds.v2,
              Vref: entry!.vSpeeds.vref,
              Vfe: entry!.vSpeeds.vfe,
              Vne: entry!.vSpeeds.vne
            }
          : undefined
      };
      const procs = getMandatoryProcedures(profile);
      expect(procs.map((p) => p.gateId)).toEqual([...MANDATORY_PHASE_ORDER]);
      expect(procs.every((p) => p.items.length >= 2)).toBe(true);
    }
  });

  it('uses aircraft-specific flap nomenclature for Airbus vs Boeing 737 vs rotorcraft', () => {
    const base: AircraftProfile = {
      id: '320',
      name: 'Airbus A320neo',
      category: 'airliner-twin',
      oew: 44300,
      mtow: 79000,
      maxFuel: 21000,
      maxFlaps: 4,
      engineCount: 2,
      hasGear: true,
      hasSpoilers: true,
      isDynamic: false
    };
    const airbusProcs = getMandatoryProcedures(base);
    expect(airbusProcs[0].items.some((i) => i.text.includes('CONF 1+F'))).toBe(true);

    const boeingProcs = getMandatoryProcedures({ ...base, id: '738', name: 'Boeing 737-800', maxFlaps: 8 });
    expect(boeingProcs[0].items.some((i) => i.text.includes('FLAPS 5'))).toBe(true);

    const heliProcs = getMandatoryProcedures({ ...base, id: '4090', name: 'Robinson R44', category: 'rotorcraft', hasGear: false, maxFlaps: 0 });
    expect(heliProcs[0].items.some((i) => i.text.includes('Collective'))).toBe(true);
  });

  it('distinguishes clickable hardware actuators from passive compound telemetry checks', () => {
    expect(isHardwareSync('parkingBrake')).toBe(true);
    expect(isHardwareSync('flaps:2')).toBe(true);
    expect(isHardwareSync('kias>=250')).toBe(false);
    expect(isHardwareSync('groundStopped&parkingBrake')).toBe(false);

    const profile: AircraftProfile = {
      id: '24',
      name: 'Airbus A350-900',
      category: 'airliner-twin',
      oew: 142400,
      mtow: 280000,
      maxFuel: 110000,
      maxFlaps: 4,
      engineCount: 2,
      hasGear: true,
      hasSpoilers: true,
      isDynamic: false,
      vSpeeds: { Vref: 138 }
    };

    const cruiseTelemetry = makeTelemetry({
      aircraft: profile,
      altitude: 32000,
      mach: 0.84,
      kias: 290,
      throttles: [0.85, 0.85],
      groundContact: false,
      aglFeet: 31500
    });
    expect(evaluateChecklistSync('altitude>=28000&mach>=0.82', cruiseTelemetry, profile)).toBe(true);
    expect(evaluateChecklistSync('agl<=150', cruiseTelemetry, profile)).toBe(false);

    const parkedTelemetry = makeTelemetry({
      aircraft: profile,
      groundContact: true,
      groundSpeed: 0.5,
      parkingBrake: true,
      throttles: [0, 0]
    });
    expect(evaluateChecklistSync('groundStopped&parkingBrake', parkedTelemetry, profile)).toBe(true);
    expect(evaluateChecklistSync('enginesOff', parkedTelemetry, profile)).toBe(true);
    expect(evaluateChecklistSync('groundStopped&parkingBrake', { ...parkedTelemetry, parkingBrake: false }, profile)).toBe(false);
  });
});

describe('Multi-Throttle Fuel Burn & Dynamic Altitude Burn', () => {
  it('sums multi-throttle channels when live engine thrust is unavailable and applies dynamic altitude scaling', () => {
    const profile: AircraftProfile = {
      id: '5193',
      name: 'Boeing 747-8i',
      category: 'airliner-quad',
      oew: 220000,
      mtow: 447700,
      maxFuel: 193000,
      maxFlaps: 6,
      engineCount: 4,
      hasGear: true,
      hasSpoilers: true,
      isDynamic: false
    };
    const telemetry = makeTelemetry({
      simMajor: 4,
      aircraft: profile,
      altitude: 35000,
      throttles: [0.8, 0.2, 0.8, 0.8],
      reverserActive: false
    });
    const aircraft = { definition: { name: 'Boeing 747-8i', maxThrust: 200_000 } };
    const staticBurn = fuelBurnKgHr(aircraft, telemetry, false);
    const dynBurn = fuelBurnKgHr(aircraft, telemetry, true);
    // Average throttle = (0.8 + 0.2 + 0.8 + 0.8)/4 = 0.65 -> thrust 130,000 * 0.0075 = 975 kg/h
    expect(staticBurn).toBeCloseTo(975, 2);
    expect(dynBurn).toBeLessThan(staticBurn);

    const revBurn = fuelBurnKgHr(aircraft, { ...telemetry, reverserActive: true }, false);
    expect(revBurn).toBeCloseTo(975 * 1.35, 2);
  });

  it('exempts Space Shuttle Atlantis from fuel depletion math', () => {
    const telemetry = makeTelemetry({
      aircraft: {
        id: '2953',
        name: 'Space Shuttle Atlantis',
        category: 'specialized',
        oew: 78000,
        mtow: 109000,
        maxFuel: 0,
        maxFlaps: 0,
        engineCount: 3,
        hasGear: true,
        hasSpoilers: true,
        isDynamic: false
      },
      throttles: [1, 1, 1]
    });
    expect(fuelBurnKgHr({ definition: { maxThrust: 500_000 } }, telemetry, true)).toBe(0);
  });
});

describe('Failure Simulator QRH & Recovery Probabilities', () => {
  it('generates distinct initial QRH and contingency procedures across systems and engines', () => {
    const engineQrh = emergencyProcedure('engine0');
    const engineCont = contingencyProcedure('engine0');
    expect(engineQrh.title).toContain('ENG 1 FAILURE');
    expect(engineCont.title).toContain('CONTINGENCY');
    expect(engineCont.items).not.toEqual(engineQrh.items);

    const mcasQrh = emergencyProcedure('mcas');
    const mcasCont = contingencyProcedure('mcas');
    expect(mcasQrh.title).toContain('TRIM');
    expect(mcasCont.items[0].text).toContain('CUTOUT');
  });

  it('enforces unrecoverable structural damage and probabilistic recovery rolls', () => {
    expect(isFailureRecoverable('structural')).toBe(false);
    expect(isFailureRecoverable('electrical')).toBe(true);
    expect(computeRecoverySuccess('structural', 100, 0)).toBe(false);
    expect(computeRecoverySuccess('electrical', 60, 0.59)).toBe(true);
    expect(computeRecoverySuccess('electrical', 60, 0.61)).toBe(false);
    // Gear has 0.7x factor -> 60% * 0.7 = 42%
    expect(computeRecoverySuccess('gearLeft', 60, 0.45)).toBe(false);
    expect(computeRecoverySuccess('gearLeft', 60, 0.40)).toBe(true);
  });
});

describe('FPV Asset Resolution & Realism V4 Gating Metadata', () => {
  it('selects hires/lowres FPV billboard URLs dynamically and provides safe fallback URI', () => {
    const ctx = { getAssetUrl: (file: string) => `chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/assets/${file}` };
    expect(resolveFpvImageUrl(ctx, { fpvResolutionMode: 'auto' }, 1.0)).toEqual({
      url: 'chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/assets/fpv_hires.png',
      variant: 'hires'
    });
    expect(resolveFpvImageUrl(ctx, { fpvResolutionMode: 'auto' }, 0.5)).toEqual({
      url: 'chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/assets/fpv_lowres.png',
      variant: 'lowres'
    });
    expect(resolveFpvImageUrl(ctx, { fpvResolutionMode: 'lowres' }, 1.0).variant).toBe('lowres');
    expect(resolveFpvImageUrl(null, { fpvResolutionMode: 'hires' }, 1.0).url).toContain('data:image/svg+xml');
  });

  it('exposes all 13 Realism Pack toggles with explicit V4 unavailability flags', () => {
    expect(REALISM_OPTION_META).toHaveLength(13);
    const v4OnlyDisabled = REALISM_OPTION_META.filter((m) => m.v4Unavailable).map((m) => m.key);
    expect(v4OnlyDisabled).toEqual(['vortexEffects', 'carrierOps']);
  });
});

describe('Physics Stability & Void-Crash Prevention Regressions', () => {
  it('never passes undefined, scalar, or dimensionless tensorFactor to setMassProps and scales valid inertia cleanly', async () => {
    const { FuelSimulatorModule, resolveScaledInertiaVector } = await import('../src/modules/fuel-simulator');

    // Missing/dimensionless inertia must resolve to null instead of corrupting rigidBody physics
    expect(resolveScaledInertiaVector({}, { tensorFactor: 1.5 }, 50000, 48000)).toBeNull();
    expect(resolveScaledInertiaVector({}, { tensorFactor: [1, 1, 1] }, 50000, 48000)).toBeNull();
    expect(resolveScaledInertiaVector({}, { inertiaTensor: [1, 1, 1] }, 50000, 48000)).toBeNull();

    // Valid rigidBody or definition inertia tensor scales proportionally
    const scaledFromDef = resolveScaledInertiaVector(
      {},
      { inertiaTensor: [1_000_000, 2_000_000, 3_000_000] },
      100_000,
      120_000
    );
    expect(scaledFromDef).toEqual({
      base: [1_000_000, 2_000_000, 3_000_000],
      scaled: [1_200_000, 2_400_000, 3_600_000]
    });

    // FuelSimulatorModule captures true originalDefinitionMass and skips setMassProps when inertia is missing
    const setMassPropsCalls: unknown[][] = [];
    const docEl = {
      innerHTML: '',
      className: '',
      querySelector: () => null,
      querySelectorAll: () => [],
      remove: () => {}
    };
    vi.stubGlobal('document', {
      createElement: () => ({ ...docEl, setAttribute: () => {}, addEventListener: () => {} })
    });
    const aircraftInstance = {
      id: '24',
      engine: { on: true },
      engines: [{ on: true, thrust: 10_000 }],
      definition: { name: 'Airbus A350-900', mass: 180_000, tensorFactor: [1, 1, 1], maxThrust: 374_000 },
      rigidBody: {
        mass: 180_000,
        setMassProps: (...args: unknown[]) => setMassPropsCalls.push(args)
      }
    };
    vi.stubGlobal('window', {
      geofs: { version: '4.0', aircraft: { instance: aircraftInstance }, animation: { values: {} } },
      controls: { throttle: 0.25 }
    });

    const fuelMod = new FuelSimulatorModule();
    const sim = new SimAdapter();
    fuelMod.init({
      sim,
      audio: {} as never,
      anchors: {
        registerHudTab: () => () => {},
        showToast: () => {}
      } as never,
      keybinds: {} as never,
      emitEvent: () => {},
      onEvent: () => () => {},
      getSettings: () => DEFAULT_SETTINGS,
      updateSettings: () => {}
    });

    fuelMod.update(sim.buildTelemetrySnapshot(0.02, 4));
    expect(setMassPropsCalls).toHaveLength(0);
    expect(aircraftInstance.definition.mass).not.toBe(180_000);

    fuelMod.destroy();
    expect(aircraftInstance.definition.mass).toBe(180_000);

    // When a real 3-axis inertiaTensor is provided, setMassProps is called with scaled [Ixx,Iyy,Izz] and restored on destroy
    const validInertiaCalls: unknown[][] = [];
    const rigidAircraft = {
      id: '24',
      engine: { on: true },
      engines: [{ on: true, thrust: 10_000 }],
      definition: { name: 'Airbus A350-900', mass: 200_000, inertiaTensor: [1_000_000, 2_000_000, 3_000_000], maxThrust: 374_000 },
      rigidBody: {
        mass: 200_000,
        setMassProps: (...args: unknown[]) => validInertiaCalls.push(args)
      }
    };
    vi.stubGlobal('window', {
      geofs: { version: '4.0', aircraft: { instance: rigidAircraft }, animation: { values: {} } },
      controls: { throttle: 0.25 }
    });
    const fuelModValid = new FuelSimulatorModule();
    fuelModValid.init({
      sim,
      audio: {} as never,
      anchors: { registerHudTab: () => () => {}, showToast: () => {} } as never,
      keybinds: {} as never,
      emitEvent: () => {},
      onEvent: () => () => {},
      getSettings: () => DEFAULT_SETTINGS,
      updateSettings: () => {}
    });
    fuelModValid.update(sim.buildTelemetrySnapshot(0.02, 4));
    expect(validInertiaCalls).toHaveLength(1);
    const [updatedMass, updatedInertia] = validInertiaCalls[0] as [number, number[]];
    expect(updatedMass).toBeGreaterThan(200_000);
    expect(updatedInertia.every((n) => Number.isFinite(n) && n > 1_000_000)).toBe(true);
    fuelModValid.destroy();
    expect(validInertiaCalls).toHaveLength(2);
    expect(validInertiaCalls[1]).toEqual([200_000, [1_000_000, 2_000_000, 3_000_000]]);
  });

  it('never shifts setup.parts[0].centerOfMass on propwash aircraft and never fires 777 impulses on runway/low speed', async () => {
    const { RealismPackModule } = await import('../src/modules/realism-pack');
    const mod = new RealismPackModule();
    const origCom: [number, number, number] = [0, 0, 0];
    const impulses: unknown[][] = [];
    const torques: unknown[][] = [];
    const ac: Record<string, unknown> = {
      id: '2',
      airfoils: [{ forceDirection: 2 }, { forceDirection: 0 }],
      setup: { parts: [{ centerOfMass: origCom }] },
      definition: { name: 'Cessna 172' },
      groundContact: true,
      rigidBody: {
        applyCentralImpulse: (...args: unknown[]) => impulses.push(args),
        applyTorqueImpulse: (...args: unknown[]) => torques.push(args)
      }
    };
    vi.stubGlobal('document', { addEventListener: () => {}, removeEventListener: () => {} });
    vi.stubGlobal('window', {
      geofs: {
        version: '4.0',
        aircraft: { instance: ac },
        animation: { values: { rpm: 2400, kias: 12, haglFeet: 3, aoa: 45, accZ: 9.81 } }
      }
    });

    mod.init({
      sim: new SimAdapter(),
      audio: {} as never,
      anchors: { showToast: () => {} } as never,
      keybinds: {} as never,
      emitEvent: () => {},
      onEvent: () => () => {},
      getSettings: () => DEFAULT_SETTINGS,
      updateSettings: () => {}
    });

    const sim = new SimAdapter();
    mod.update({ ...sim.buildTelemetrySnapshot(0.02, 4), timestamp: Date.now() + 2000 });
    expect((ac.setup as { parts: Array<{ centerOfMass: number[] }> }).parts[0].centerOfMass).toEqual([0, 0, 0]);

    // Switch to Boeing 777-300ER ('25') on runway with high AoA sensor noise and low speed
    ac.id = '25';
    mod.update({
      ...sim.buildTelemetrySnapshot(0.02, 4),
      aircraft: {
        id: '25',
        name: 'Boeing 777-300ER',
        category: 'airliner-twin',
        engineCount: 2,
        maxFlaps: 6,
        hasGear: true,
        hasSpoilers: true,
        oew: 167800,
        mtow: 351500,
        maxFuel: 145538,
        isDynamic: false
      },
      groundContact: true,
      kias: 18,
      aglFeet: 16,
      aoa: 42,
      timestamp: Date.now() + 4000
    });
    expect(impulses).toHaveLength(0);
    expect(torques).toHaveLength(0);
    mod.destroy();
  });

  it('guards SimAdapter.setThrottle and EffectiveSasController against NaN propagation', () => {
    const controls = { throttle: 0.4, rawRoll: 0, rawPitch: 0, rawYaw: 0 };
    vi.stubGlobal('window', { controls });
    const sim = new SimAdapter();
    sim.setThrottle(Number.NaN);
    expect(controls.throttle).toBe(0.4);

    const sas = new EffectiveSasController();
    let av: [number, number, number] = [Number.NaN, 0.2, 0];
    const res = sas.step({
      rigidBody: {
        mass: 5000,
        getAngularVelocity: () => av,
        setAngularVelocity: (next) => { av = next; }
      },
      controls: { rawRoll: 0.5 },
      pitchDeg: Number.NaN,
      rollDeg: Number.NaN,
      kias: Number.NaN,
      multiplier: Number.NaN,
      sasStrength: Number.NaN,
      groundContact: false
    });
    expect(res.nextAngularVelocity).toBeNull();
    expect(Number.isNaN(av[0])).toBe(true);
  });
});
