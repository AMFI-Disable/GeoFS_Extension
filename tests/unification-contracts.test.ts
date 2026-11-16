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
