import type { GeoFSAircraftInstance, GeoFSEngine, GeoFSPositionControl } from '../../types/geofs.d';
import type { FlightTelemetry } from '../../types/module';
import type { FailureType } from './procedures';

export interface FailureEffect {
  intervalMs: number;
  dueAt: number;
  apply: (telemetry?: FlightTelemetry) => void;
  restore: () => void;
  verifyRestored?: () => boolean;
}

export interface FailureEffectHost {
  stopEngines: () => boolean;
  ensureWeatherRestore: (restore: () => void) => void;
  applyWeather: () => void;
}

export function pinValue<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K]
): Pick<FailureEffect, 'apply' | 'restore'> {
  const hadKey = Object.hasOwn(target, key);
  const original = target[key];
  return {
    apply: () => {
      target[key] = value;
    },
    restore: () => {
      if (hadKey) target[key] = original;
      else delete target[key];
    }
  };
}

const gearSelection = {
  gearFront: [0, /front|nose|tail|steer/],
  gearLeft: [1, /left|l_g|main l|l-gear/],
  gearRight: [2, /right|r_g|main r|r-gear/]
} as const;

function jamControl(control: GeoFSPositionControl, target: number, position: number) {
  const pins = [
    pinValue(control, 'target', target),
    pinValue(control, 'position', position),
    pinValue(control, 'positionTarget', position),
    pinValue(control, 'delta', 0)
  ];
  return {
    apply: () => pins.forEach((pin) => pin.apply()),
    restore: () => pins.forEach((pin) => pin.restore())
  };
}

function engineSmoke(engine: GeoFSEngine) {
  const fx = window.geofs?.fx;
  const Emitter = fx?.ParticleEmitter;
  const position = engine.object3d?.worldPosition;
  const anchor = engine.points?.contrailAnchor ?? (position && { worldPosition: position });
  if (!Emitter || !anchor) return;
  try {
    const emitter = new Emitter({
      anchor,
      duration: 1e10,
      rate: 0.03,
      life: 1e4,
      easing: 'easeOutQuart',
      startScale: 0.01,
      endScale: 0.2,
      randomizeStartScale: 0.01,
      randomizeEndScale: 0.15,
      startOpacity: 1,
      endOpacity: 0.2,
      startRotation: 'random',
      texture: 'whitesmoke'
    });
    const Color = window.Cesium?.Color;
    const smokeColor = Color && new Color(0.1, 0.1, 0.1, 1);
    return {
      apply: () => {
        for (const particle of Object.values(fx.particles ?? {})) {
          if (particle?._emitter === emitter && smokeColor) particle.setColor?.(smokeColor);
        }
      },
      restore: () => {
        emitter.destroy();
        for (const particle of Object.values(fx.particles ?? {})) {
          if (particle?._emitter === emitter) particle.destroy();
        }
      }
    };
  } catch (error) {
    console.warn('[GeoFS Extension] Could not start engine smoke:', error);
    return undefined;
  }
}

export function createFailureEffect(
  type: FailureType,
  aircraft: GeoFSAircraftInstance,
  host: FailureEffectHost
): FailureEffect | undefined {
  const now = Date.now();
  const repeat = (
    pins: Pick<FailureEffect, 'apply' | 'restore'>,
    intervalMs = 1000,
    verifyRestored?: () => boolean
  ): FailureEffect => ({ ...pins, intervalMs, dueAt: now, verifyRestored });

  if (type.startsWith('engine')) {
    const index = Number(type.slice(6));
    const engine = aircraft.engines?.[index] ?? (index === 0 ? aircraft.engine : undefined);
    if (!engine) return;
    const originalThrust = engine.thrust;
    const thrust = pinValue(engine, 'thrust', 0);
    const smoke = engineSmoke(engine);
    return repeat(
      {
        apply: () => {
          thrust.apply();
          smoke?.apply();
        },
        restore: () => {
          thrust.restore();
          smoke?.restore();
        }
      },
      50,
      () => engine.thrust === originalThrust
    );
  }

  switch (type) {
    case 'gearFront':
    case 'gearLeft':
    case 'gearRight': {
      const [fallback, pattern] = gearSelection[type];
      const suspensions = aircraft.suspensions ?? [];
      const point =
        (suspensions.filter((item) => pattern.test(item.name?.toLowerCase() ?? '')).at(-1) ??
          suspensions[fallback])?.collisionPoints?.[0];
      if (!point) return undefined;
      const originalZ = point[2];
      const collapsedZ = Math.max((Number.isFinite(originalZ) ? originalZ : -2.5) + 2, 0.5);
      return repeat(pinValue(point, 2, collapsedZ), 1000, () => point[2] === originalZ);
    }
    case 'ailerons':
    case 'elevators':
    case 'rudder': {
      const search = type === 'rudder' ? type : type.slice(0, -1);
      const targets: Array<{ object3d: NonNullable<GeoFSAircraftInstance['airfoils']>[number]['object3d']; orig: [number, number, number] | undefined }> = [];
      const pins = (aircraft.airfoils ?? []).flatMap((foil) => {
        if (!foil.object3d || !foil.name?.toLowerCase().includes(search)) return [];
        targets.push({ object3d: foil.object3d, orig: foil.object3d._scale });
        return [pinValue(foil.object3d, '_scale', [0, 0, 0])];
      });
      if (!pins.length) return;
      return repeat(
        {
          apply: () => pins.forEach((pin) => pin.apply()),
          restore: () => pins.forEach((pin) => pin.restore())
        },
        1000,
        () => targets.every((t) => JSON.stringify(t.object3d?._scale) === JSON.stringify(t.orig))
      );
    }
    case 'flaps':
    case 'spoilers': {
      const control = type === 'flaps' ? window.controls?.flaps : window.controls?.airbrakes;
      const position = control?.position;
      if (!control || typeof position !== 'number' || !Number.isFinite(position)) return;
      const limit = type === 'flaps' ? Math.max(0, aircraft.definition?.flapsSteps ?? 0) : 1;
      const target = Math.max(0, Math.min(limit, type === 'flaps' ? Math.round(control.target ?? 0) : position));
      return repeat(jamControl(control, target, position), 50, () => control.delta !== 0);
    }
    case 'brakes':
      return window.controls && repeat(pinValue(window.controls, 'brakes', 0), 500);
    case 'electrical': {
      const autopilot = window.geofs?.autopilot;
      const instruments = window.instruments;
      const wasVisible = instruments?.visible !== false;
      const pins = (aircraft.cockpitSetup?.parts ?? []).slice(1, 6).flatMap((part) =>
        part?.object3d ? [pinValue(part.object3d, '_scale', [0, 0, 0])] : []
      );
      return repeat(
        {
          apply: () => {
            autopilot?.turnOff?.();
            instruments?.hide?.();
            pins.forEach((pin) => pin.apply());
          },
          restore: () => {
            pins.forEach((pin) => pin.restore());
            if (wasVisible) instruments?.show?.();
          }
        },
        1000,
        () => !wasVisible || instruments?.visible !== false
      );
    }
    case 'pitotStatic': {
      const instruments = window.instruments;
      const original = instruments?.update;
      if (!instruments || !original) return;
      const wrapper = function (this: unknown, ...args: unknown[]) {
        const values = window.geofs?.animation?.values;
        if (!values) return original.apply(this, args);
        const kias = pinValue(values, 'kias', 0);
        const altitude = pinValue(values, 'altitude', 0);
        try {
          kias.apply();
          altitude.apply();
          return original.apply(this, args);
        } finally {
          kias.restore();
          altitude.restore();
        }
      };
      return repeat(
        {
          apply: () => {
            if (instruments.update === original) instruments.update = wrapper;
          },
          restore: () => {
            if (instruments.update === wrapper) instruments.update = original;
          }
        },
        1000,
        () => instruments.update === original
      );
    }
    case 'fuelLeak': {
      let stopped = false;
      return {
        intervalMs: 1000,
        dueAt: now + 120_000,
        apply: () => {
          if (aircraft.engine?.on === false) return;
          stopped = host.stopEngines() || stopped;
        },
        restore: () => {
          if (!stopped || aircraft.crashed || aircraft !== window.geofs?.aircraft?.instance) return;
          if (aircraft.startEngines) aircraft.startEngines();
          else aircraft.startEngine?.();
        }
      };
    }
    case 'structural':
    case 'pressurization': {
      const weather = window.weather?.definition;
      if (!weather) return;
      host.ensureWeatherRestore(pinValue(weather, 'turbulences', 3).restore);
      return repeat(
        {
          apply: () => host.applyWeather(),
          restore: () => host.applyWeather()
        },
        1000
      );
    }
    case 'mcas': {
      const controls = window.controls;
      if (!controls) return;
      const origMin = controls.elevatorTrimMin;
      const limit = pinValue(controls, 'elevatorTrimMin', -10);
      const trim = pinValue(controls, 'elevatorTrim', controls.elevatorTrim);
      return repeat(
        {
          apply: (telemetry) => {
            limit.apply();
            if (
              telemetry &&
              !telemetry.autopilotOn &&
              controls.flaps?.position === 0 &&
              (telemetry.timestamp - now) % 10_000 < 5000 &&
              (controls.elevatorTrim ?? 0) > -10
            ) {
              controls.elevatorTrim = (controls.elevatorTrim ?? 0) - 0.01;
            }
          },
          restore: () => {
            limit.restore();
            trim.restore();
          }
        },
        50,
        () => controls.elevatorTrimMin === origMin
      );
    }
  }
}
