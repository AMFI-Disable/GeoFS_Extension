import type { ChecklistProcedure } from '../checklist-system/procedures';
import type { GeoFSAircraftInstance, GeoFSEngine, GeoFSPositionControl } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';

const SYSTEMS = {
  gearFront: 'Nose Gear', gearLeft: 'Left Gear', gearRight: 'Right Gear',
  ailerons: 'Ailerons', elevators: 'Elevators', rudder: 'Rudder',
  flaps: 'Flaps', brakes: 'Brakes', spoilers: 'Spoilers',
  electrical: 'Electrical', fuelLeak: 'Fuel Leak', structural: 'Structural',
  pressurization: 'Pressurization', mcas: 'MCAS', pitotStatic: 'Pitot-Static'
} as const;
type System = keyof typeof SYSTEMS;
type FailureType = System | `engine${number}`;

interface FailureEffect {
  intervalMs: number;
  dueAt: number;
  apply: (telemetry?: FlightTelemetry) => void;
  restore: () => void;
}

export function pinValue<T extends object, K extends keyof T>(target: T, key: K, value: T[K]): Pick<FailureEffect, 'apply' | 'restore'> {
  const hadKey = Object.hasOwn(target, key);
  const original = target[key];
  return {
    apply: () => { target[key] = value; },
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

function label(type: FailureType): string {
  return type.startsWith('engine') ? `Engine ${Number(type.slice(6)) + 1}` : SYSTEMS[type as System];
}

function emergencyProcedure(type: FailureType): ChecklistProcedure | undefined {
  if (type.startsWith('engine')) {
    const index = Number(type.slice(6)) + 1;
    return { title: `ENG ${index} FAILURE`, items: [
      { text: `THR LEVER ${index} - IDLE`, desc: 'Reduce fuel flow and check for engine fire.' },
      { text: `FUEL COCK ${index} - OFF`, desc: 'Isolate engine from fuel supply.' },
      { text: 'ENGINE MASTER - OFF', desc: 'Shut down ignition systems.' },
      { text: 'AIRSPEED - MAINTAIN V2', desc: 'Ensure safe climb speed on remaining engine.' }
    ] };
  }
  if (type === 'fuelLeak') return { title: 'MAJOR FUEL LEAK', items: [
    { text: 'FUEL CROSSFEED - OFF', desc: 'Prevent leak from draining both tanks.' },
    { text: 'LAND - ASAP', desc: 'Aircraft will lose all power in 120 seconds.' },
    { text: 'ENGINES - SHUT DOWN ON ROLLOUT', desc: 'Prevent ground fire.' }
  ] };
  if (type === 'mcas') return { title: 'UNCOMMANDED NOSE DOWN TRIM', items: [
    { text: 'STAB TRIM CUTOUT - CUTOUT', desc: 'Disconnect electrical trim motors.' },
    { text: 'CONTROL COLUMN - PULL', desc: 'Manually override nose-down movement.' },
    { text: 'TRIM WHEEL - MANUAL', desc: 'Use physical trim wheel to level the aircraft.' }
  ] };
  return undefined;
}

function jamControl(control: GeoFSPositionControl, target: number, position: number) {
  const pins = [
    pinValue(control, 'target', target), pinValue(control, 'position', position),
    pinValue(control, 'positionTarget', position), pinValue(control, 'delta', 0)
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
      anchor, duration: 1e10, rate: 0.03, life: 1e4, easing: 'easeOutQuart',
      startScale: 0.01, endScale: 0.2, randomizeStartScale: 0.01, randomizeEndScale: 0.15,
      startOpacity: 1, endOpacity: 0.2, startRotation: 'random', texture: 'whitesmoke'
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

const SYSTEM_GROUPS: ReadonlyArray<readonly [string, readonly System[]]> = [
  ['Landing Gear', ['gearFront', 'gearLeft', 'gearRight']],
  ['Flight Controls', ['ailerons', 'elevators', 'rudder']],
  ['Hydraulics', ['flaps', 'brakes', 'spoilers']],
  ['Advanced Systems', ['electrical', 'fuelLeak', 'structural', 'pressurization', 'mcas', 'pitotStatic']]
];

export class FailureSimulatorModule implements IModule {
  public readonly id = 'failure-simulator';
  public readonly name = 'Failure Simulator';
  public readonly description = 'Manual and probability-based aircraft system failures.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private aircraft: GeoFSAircraftInstance | undefined;
  private active = new Map<FailureType, FailureEffect>();
  private chances = new Map<FailureType, number>();
  private nextProbabilityMs = 0;
  private list: HTMLElement | null = null;
  private probabilityToggle?: HTMLInputElement;
  private restoreWeather?: () => void;
  private lastAltitude = 0;
  private unsubscribe?: () => void;
  private unmount: (() => void) | undefined;

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.unsubscribe = context.onEvent('failure:request-active', () => {
      for (const type of this.active.keys()) this.emitFailure(type);
    });
    const root = document.createElement('div');
    root.innerHTML = '<div data-systems style="max-height:180px;overflow:auto;"></div>';
    this.list = root.querySelector('[data-systems]');
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'geofs-ext-pad';
    clear.textContent = 'Clear All Failures';
    clear.addEventListener('click', () => this.clear());
    const probability = document.createElement('input');
    probability.type = 'checkbox';
    probability.checked = context.getSettings().failureProbabilitiesEnabled;
    probability.addEventListener('change', () =>
      context.updateSettings({ failureProbabilitiesEnabled: probability.checked }));
    this.probabilityToggle = probability;
    const probabilityLabel = document.createElement('label');
    probabilityLabel.append(probability, ' Enable Probability');
    root.prepend(probabilityLabel);
    root.append(clear);
    this.unmount = context.anchors.registerHudTab('fail', 'FAIL', root);
    this.aircraft = window.geofs?.aircraft?.instance;
    this.render();
  }

  private render(): void {
    if (!this.list) return;
    const engines = this.aircraft?.engines?.length ?? (this.aircraft?.engine ? 1 : 0);
    const engineTypes = Array.from({ length: engines }, (_, index): FailureType => `engine${index}`);
    const groups: ReadonlyArray<readonly [string, readonly FailureType[]]> = [
      ['Engines', engineTypes], ...SYSTEM_GROUPS
    ];
    this.list.replaceChildren(...groups.filter(([, types]) => types.length).map(([group, types]) => {
      const section = document.createElement('fieldset');
      const title = document.createElement('legend');
      title.textContent = group;
      section.append(title);
      for (const action of ['Auto', 'Fail', 'Fix'] as const) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'geofs-ext-pad';
        button.textContent = action;
        button.setAttribute('aria-label', `${action} ${group}`);
        button.addEventListener('click', () => {
          for (const type of types) {
            if (action === 'Auto') this.chances.set(type, Math.random() * (group === 'Advanced Systems' ? 0.05 : 0.1));
            else if (action === 'Fail') this.fail(type, false);
            else if (this.active.has(type)) this.fix(type);
          }
          this.render();
        });
        section.append(button);
      }
      for (const type of types) section.append(this.systemRow(type));
      return section;
    }));
  }

  private systemRow(type: FailureType): HTMLElement {
    const row = document.createElement('div');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'geofs-ext-pad';
    button.classList.toggle('is-active', this.active.has(type));
    button.textContent = label(type);
    button.setAttribute('aria-pressed', String(this.active.has(type)));
    button.addEventListener('click', () => {
      if (this.active.has(type)) {
        this.fix(type);
        this.render();
      } else this.fail(type);
    });
    const chance = document.createElement('input');
    chance.type = 'number';
    chance.min = '0';
    chance.max = '100';
    chance.step = 'any';
    chance.value = String(Number(((this.chances.get(type) ?? 0) * 100).toFixed(2)));
    chance.setAttribute('aria-label', `${label(type)} failure probability (%)`);
    chance.style.width = '4em';
    chance.addEventListener('change', () => {
      this.chances.set(type, Math.max(0, Math.min(100, chance.valueAsNumber || 0)) / 100);
    });
    row.append(button, chance, '%');
    return row;
  }

  private effect(type: FailureType, aircraft: GeoFSAircraftInstance): FailureEffect | undefined {
    const now = Date.now();
    const repeat = (pins: Pick<FailureEffect, 'apply' | 'restore'>, intervalMs = 1000): FailureEffect =>
      ({ ...pins, intervalMs, dueAt: now });

    if (type.startsWith('engine')) {
      const index = Number(type.slice(6));
      const engine = aircraft.engines?.[index] ?? (index === 0 ? aircraft.engine : undefined);
      if (!engine) return;
      const thrust = pinValue(engine, 'thrust', 0);
      const smoke = engineSmoke(engine);
      return repeat({
        apply: () => { thrust.apply(); smoke?.apply(); },
        restore: () => { thrust.restore(); smoke?.restore(); }
      }, 50);
    }

    switch (type) {
      case 'gearFront':
      case 'gearLeft':
      case 'gearRight': {
        const [fallback, pattern] = gearSelection[type];
        const suspensions = aircraft.suspensions ?? [];
        const point = (suspensions.filter((item) => pattern.test(item.name?.toLowerCase() ?? '')).at(-1) ??
          suspensions[fallback])?.collisionPoints?.[0];
        return point && repeat(pinValue(point, 2, 30));
      }
      case 'ailerons':
      case 'elevators':
      case 'rudder': {
        const search = type === 'rudder' ? type : type.slice(0, -1);
        const pins = (aircraft.airfoils ?? []).flatMap((foil) =>
          foil.object3d && foil.name?.toLowerCase().includes(search)
            ? [pinValue(foil.object3d, '_scale', [0, 0, 0])]
            : []);
        if (!pins.length) return;
        return repeat({ apply: () => pins.forEach((pin) => pin.apply()), restore: () => pins.forEach((pin) => pin.restore()) });
      }
      case 'flaps':
      case 'spoilers': {
        const control = type === 'flaps' ? window.controls?.flaps : window.controls?.airbrakes;
        const position = control?.position;
        if (!control || typeof position !== 'number' || !Number.isFinite(position)) return;
        const limit = type === 'flaps' ? Math.max(0, aircraft.definition?.flapsSteps ?? 0) : 1;
        const target = Math.max(0, Math.min(limit, type === 'flaps' ? Math.round(control.target ?? 0) : position));
        return repeat(jamControl(control, target, position), 50);
      }
      case 'brakes':
        return window.controls && repeat(pinValue(window.controls, 'brakes', 0), 500);
      case 'electrical': {
        const autopilot = window.geofs?.autopilot;
        const instruments = window.instruments;
        const wasVisible = instruments?.visible !== false;
        const pins = (aircraft.cockpitSetup?.parts ?? []).slice(1, 6).flatMap((part) => part?.object3d
          ? [pinValue(part.object3d, '_scale', [0, 0, 0])] : []);
        return repeat({
          apply: () => {
            autopilot?.turnOff?.();
            instruments?.hide?.();
            pins.forEach((pin) => pin.apply());
          },
          restore: () => {
            pins.forEach((pin) => pin.restore());
            if (wasVisible) instruments?.show?.();
          }
        });
      }
      case 'pitotStatic': {
        const instruments = window.instruments;
        const original = instruments?.update;
        if (!instruments || !original) return;
        const wrapper = function(this: unknown, ...args: unknown[]) {
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
        return repeat({
          apply: () => { if (instruments.update === original) instruments.update = wrapper; },
          restore: () => { if (instruments.update === wrapper) instruments.update = original; }
        });
      }
      case 'fuelLeak': {
        let stopped = false;
        return {
          intervalMs: 1000, dueAt: now + 120_000,
          apply: () => {
            if (aircraft.engine?.on === false) return;
            stopped = (this.ctx?.sim.stopEngines() ?? false) || stopped;
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
        this.restoreWeather ??= pinValue(weather, 'turbulences', 3).restore;
        return repeat({
          apply: () => this.applyWeather(),
          restore: () => this.applyWeather()
        });
      }
      case 'mcas': {
        const controls = window.controls;
        if (!controls) return;
        const limit = pinValue(controls, 'elevatorTrimMin', -10);
        const trim = pinValue(controls, 'elevatorTrim', controls.elevatorTrim);
        return repeat({
          apply: (telemetry) => {
            limit.apply();
            if (telemetry && !telemetry.autopilotOn && controls.flaps?.position === 0 &&
                (telemetry.timestamp - now) % 10_000 < 5000 && (controls.elevatorTrim ?? 0) > -10) {
              controls.elevatorTrim = (controls.elevatorTrim ?? 0) - 0.01;
            }
          },
          restore: () => { limit.restore(); trim.restore(); }
        }, 50);
      }
    }
  }

  private applyWeather(): void {
    const weather = window.weather?.definition;
    if (weather && this.active.has('structural')) weather.turbulences = 3;
    else if (weather && this.active.has('pressurization')) {
      weather.turbulences = Math.max(0, (this.lastAltitude - 9000) / 5000);
    } else {
      this.restoreWeather?.();
      this.restoreWeather = undefined;
    }
  }

  private emitFailure(type: FailureType): void {
    this.ctx?.emitEvent('failure:triggered', { type, procedure: emergencyProcedure(type) });
  }

  private fail(type: FailureType, render = true): void {
    if (!this.aircraft || this.aircraft.crashed || this.active.has(type)) return;
    const effect = this.effect(type, this.aircraft);
    if (!effect) {
      this.ctx?.anchors.showToast(`${label(type)} unavailable on this aircraft.`, 'warn');
      return;
    }
    this.active.set(type, effect);
    if (type !== 'fuelLeak') effect.apply();
    this.ctx?.audio.playGpwsAlert();
    this.ctx?.anchors.showToast(`${label(type)} failure`, 'critical');
    this.emitFailure(type);
    if (render) this.render();
  }

  private fix(type: FailureType): void {
    const effect = this.active.get(type);
    this.active.delete(type);
    effect?.restore();
    this.ctx?.emitEvent('failure:cleared', { type });
  }

  private clear(): void {
    for (const type of [...this.active.keys()].reverse()) this.fix(type);
    this.render();
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    if (this.probabilityToggle) this.probabilityToggle.checked = settings.failureProbabilitiesEnabled;
  }

  public update(telemetry: FlightTelemetry): void {
    const aircraft = window.geofs?.aircraft?.instance;
    if (aircraft !== this.aircraft) {
      this.clear();
      this.aircraft = aircraft;
      this.render();
    }
    if (telemetry.paused || telemetry.crashed || !this.ctx) return;
    this.lastAltitude = telemetry.altitude;
    for (const effect of this.active.values()) {
      if (telemetry.timestamp >= effect.dueAt) {
        effect.apply(telemetry);
        effect.dueAt = telemetry.timestamp + effect.intervalMs;
      }
    }

    if (!this.ctx.getSettings().failureProbabilitiesEnabled) {
      this.nextProbabilityMs = 0;
    } else if (telemetry.timestamp >= this.nextProbabilityMs) {
      this.nextProbabilityMs = telemetry.timestamp + 60_000;
      for (const [type, chance] of this.chances) if (Math.random() < chance) this.fail(type);
    }
  }

  public destroy(): void {
    this.clear();
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.unmount?.();
    this.unmount = undefined;
    this.aircraft = undefined;
    this.list = null;
    this.probabilityToggle = undefined;
    this.ctx = null;
    this.nextProbabilityMs = 0;
  }
}
