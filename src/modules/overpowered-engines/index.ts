import type { GeoFSAircraftDefinition, GeoFSAircraftInstance, GeoFSEnginePart } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

const THRUST_FIELDS = ['thrust', 'afterBurnerThrust', 'reverseThrust'] as const;
type ThrustValues = Pick<GeoFSEnginePart, (typeof THRUST_FIELDS)[number]>;

// Both archived Overpowered Engines scripts apply their multiplier to the live engine parts.
export class EngineThrust {
  private originals = new Map<GeoFSEnginePart, ThrustValues>();

  public apply(parts: Record<string, GeoFSEnginePart> | undefined, multiplier: number): void {
    const engines = new Set(Object.values(parts ?? {}).filter((part) => Number.isFinite(part?.thrust)));
    for (const [part, original] of this.originals) {
      if (!engines.has(part)) {
        Object.assign(part, original);
        this.originals.delete(part);
      }
    }
    for (const part of engines) {
      let original = this.originals.get(part);
      if (!original) {
        original = {};
        for (const field of THRUST_FIELDS) {
          if (Number.isFinite(part[field])) original[field] = part[field];
        }
        this.originals.set(part, original);
      }
      for (const field of THRUST_FIELDS) {
        const value = original[field];
        if (value !== undefined) part[field] = value * multiplier;
      }
    }
  }

  public restore(): void {
    for (const [part, original] of this.originals) Object.assign(part, original);
    this.originals.clear();
  }
}

export class EngineCeiling {
  private original?: { definition: GeoFSAircraftDefinition; thrust: number | undefined; rpm: number | undefined };

  public apply(definition: GeoFSAircraftDefinition, feet: number): void {
    if (this.original?.definition !== definition) {
      this.restore();
      this.original = { definition, thrust: definition.zeroThrustAltitude, rpm: definition.zeroRPMAltitude };
    }
    definition.zeroThrustAltitude = feet;
    definition.zeroRPMAltitude = feet;
  }

  public restore(): void {
    if (!this.original) return;
    const { definition, thrust, rpm } = this.original;
    if (thrust === undefined) delete definition.zeroThrustAltitude;
    else definition.zeroThrustAltitude = thrust;
    if (rpm === undefined) delete definition.zeroRPMAltitude;
    else definition.zeroRPMAltitude = rpm;
    this.original = undefined;
  }
}

const THRUST_PRESETS = [1, 2, 5, 10, 50, 100, 500, 1000, 5000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
const CEILING_PRESETS = [3000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000, 1000000000000];

export class OverpoweredEnginesModule implements IModule {
  public readonly id = 'overpowered-engines';
  public readonly name = 'Overpowered Engines';
  public readonly description = 'Live engine thrust, ceiling limits and stability augmentation.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private aircraft?: GeoFSAircraftInstance;
  private thrustEnabled = false;
  private ceilingEnabled = false;
  private atEngaged = false;
  private automaticMultiplier: number | null = null;
  private sasElapsed = 0;
  private thrust = new EngineThrust();
  private ceiling = new EngineCeiling();
  private torque = new Map<GeoFSEnginePart, number>();
  private panel: HTMLDivElement | null = null;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'geofs-ext-pad';
    button.textContent = 'OP ENG';
    button.addEventListener('click', () => context.anchors.openHudTab('op'));

    const panel = document.createElement('div');
    panel.innerHTML = `
      <label>Thrust Multiplier <input data-role="multiplier" type="number" min="1" max="1000000000" step="any" list="geofs-ext-thrust-presets"></label>
      <datalist id="geofs-ext-thrust-presets">${THRUST_PRESETS.map((value) => `<option value="${value}"></option>`).join('')}</datalist>
      <button type="button" class="geofs-ext-pad" data-role="thrust"></button>
      <label>Ceiling <select data-role="limit">${CEILING_PRESETS.map((value) =>
        `<option value="${value}">${value.toLocaleString()} ft</option>`).join('')}</select></label>
      <button type="button" class="geofs-ext-pad" data-role="ceiling"></button>
      <button type="button" class="geofs-ext-pad" data-role="sas"></button>
    `;
    this.panel = panel;
    panel.querySelector('[data-role="multiplier"]')?.addEventListener('change', (event) => {
      const input = event.currentTarget as HTMLInputElement;
      if (input.validity.valid && Number.isFinite(input.valueAsNumber)) {
        context.updateSettings({ opThrustMultiplier: input.valueAsNumber });
      } else {
        this.render();
      }
    });
    panel.querySelector('[data-role="limit"]')?.addEventListener('change', (event) => {
      context.updateSettings({ opCeilingFeet: Number((event.currentTarget as HTMLSelectElement).value) });
    });
    panel.querySelector('[data-role="thrust"]')?.addEventListener('click', () => this.toggle());
    panel.querySelector('[data-role="ceiling"]')?.addEventListener('click', () => {
      this.ceilingEnabled = !this.ceilingEnabled;
      if (!this.ceilingEnabled) this.ceiling.restore();
      this.render();
    });
    panel.querySelector('[data-role="sas"]')?.addEventListener('click', () => {
      context.updateSettings({ opStability: !context.getSettings().opStability });
    });
    this.render();
    this.unmounts.push(context.anchors.mountControl('op-engines-pad', 'autopilot', button));
    this.unmounts.push(context.anchors.registerHudTab('op', 'OP ENG', panel));
    this.unmounts.push(context.keybinds.register('op-toggle', context.getSettings().keybindings.toggleOpEngines, () => this.toggle()));
    this.unmounts.push(context.onEvent<{ engaged: boolean }>('autothrottle:state', (detail) => {
      this.atEngaged = detail.engaged;
      if (!this.atEngaged) this.automaticMultiplier = null;
      this.render();
    }));
    this.unmounts.push(context.onEvent<{ desired: number | null; report: (multiplier: number) => void }>(
      'autothrottle:boost', ({ desired, report }) => {
        const settings = context.getSettings();
        if (desired === null) this.automaticMultiplier = null;
        else {
          const current = this.automaticMultiplier ?? settings.opThrustMultiplier ?? 1;
          this.automaticMultiplier = current + (desired - current) * 0.15;
        }
        report(this.automaticMultiplier ?? (this.thrustEnabled ? settings.opThrustMultiplier ?? 1 : 1));
      }
    ));
  }

  public onSettingsChange(settings: import('../../types/settings').ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('op-toggle', settings.keybindings.toggleOpEngines);
    if (!settings.opStability) this.restoreTorque();
    this.render();
  }

  public toggle(): void {
    if (this.atEngaged) return;
    this.thrustEnabled = !this.thrustEnabled;
    if (!this.thrustEnabled) this.thrust.restore();
    this.render();
  }

  public update(telemetry: FlightTelemetry): void {
    const aircraft = window.geofs?.aircraft?.instance;
    const settings = this.ctx?.getSettings();
    if (aircraft !== this.aircraft) {
      this.restore();
      if (this.aircraft) {
        this.thrustEnabled = false;
        this.ceilingEnabled = false;
        this.automaticMultiplier = null;
        this.render();
      }
      this.aircraft = aircraft;
    }
    if (!aircraft || !settings || telemetry.crashed) {
      this.restore();
      return;
    }
    const automatic = this.automaticMultiplier;
    if (this.thrustEnabled || automatic !== null) {
      this.thrust.apply(aircraft.parts, automatic ?? settings.opThrustMultiplier ?? 1);
    } else {
      this.thrust.restore();
    }
    if ((this.ceilingEnabled || automatic !== null) && aircraft.definition) {
      this.ceiling.apply(aircraft.definition, settings.opCeilingFeet ?? CEILING_PRESETS[0]);
    } else {
      this.ceiling.restore();
    }
    if (settings.opStability) {
      const parts = new Set(Object.values(aircraft.parts ?? {}));
      for (const [part, original] of this.torque) {
        if (!parts.has(part)) {
          part.torque = original;
          this.torque.delete(part);
        }
      }
      for (const part of parts) {
        if (typeof part?.torque !== 'number') continue;
        if (!this.torque.has(part)) this.torque.set(part, part.torque);
        part.torque = 0;
      }
      this.sasElapsed += telemetry.paused ? 0 : telemetry.dt;
      if (this.sasElapsed >= 0.02) {
        this.sasElapsed %= 0.02;
        const values = window.geofs?.animation?.values;
        const controlling = [values?.roll, values?.pitch, values?.yaw]
          .some((value) => Math.abs(Number(value) || 0) > 0.05);
        const body = aircraft.rigidBody;
        const velocity = body?.getAngularVelocity?.();
        if (body?.setAngularVelocity && velocity) {
          body.setAngularVelocity(controlling
            ? [velocity[0] * 0.95, velocity[1] * 0.95, velocity[2] * 0.95]
            : [0, 0, 0]);
        }
      }
    }
  }

  private render(): void {
    const settings = this.ctx?.getSettings();
    const panel = this.panel;
    if (!settings || !panel) return;
    const multiplier = panel.querySelector<HTMLInputElement>('[data-role="multiplier"]')!;
    multiplier.value = String(settings.opThrustMultiplier ?? 1);
    multiplier.disabled = this.thrustEnabled || this.atEngaged;
    const limit = panel.querySelector<HTMLSelectElement>('[data-role="limit"]')!;
    limit.value = String(settings.opCeilingFeet ?? CEILING_PRESETS[0]);
    limit.disabled = this.ceilingEnabled;
    for (const [role, label, active] of [
      ['thrust', 'Thrust', this.thrustEnabled], ['ceiling', 'Ceiling', this.ceilingEnabled],
      ['sas', 'SAS', Boolean(settings.opStability)]
    ] as const) {
      const button = panel.querySelector<HTMLButtonElement>(`[data-role="${role}"]`)!;
      button.textContent = `${label} ${active ? 'ON' : 'OFF'}`;
      button.classList.toggle('is-active', active);
      button.disabled = role === 'thrust' && this.atEngaged;
    }
  }

  private restoreTorque(): void {
    for (const [part, original] of this.torque) part.torque = original;
    this.torque.clear();
    this.sasElapsed = 0;
  }

  private restore(): void {
    this.thrust.restore();
    this.ceiling.restore();
    this.restoreTorque();
  }

  public destroy(): void {
    this.restore();
    this.aircraft = undefined;
    this.thrustEnabled = false;
    this.ceilingEnabled = false;
    this.atEngaged = false;
    this.automaticMultiplier = null;
    for (const unmount of this.unmounts) unmount();
    this.unmounts = [];
    this.panel = null;
    this.ctx = null;
  }
}
