import type { GeoFSAircraftInstance } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

// Both archived Fuel Simulator scripts derive fuel consumption from engine thrust.
export function fuelBurnKgHr(aircraft: GeoFSAircraftInstance, telemetry: FlightTelemetry): number {
  if (aircraft.engine?.on === false) return 0;
  const profile = telemetry.aircraft;
  const name = profile?.name ?? '';
  if (profile?.id === '2953' || /atlantis/i.test(name)) return 0;

  const ratedThrust = Number(aircraft.definition?.maxThrust) || 0;
  const engines = aircraft.engines;
  const thrustOf = (engine: { thrust?: number }) =>
    typeof engine.thrust === 'number' && Number.isFinite(engine.thrust) ? Math.max(0, engine.thrust) : 0;
  let thrust = engines?.reduce((sum, engine) => sum + thrustOf(engine), 0) ?? 0;
  if (telemetry.simMajor === 4) {
    if (!engines?.length) {
      thrust = Object.values(aircraft.parts ?? {}).reduce((sum, part) => sum + thrustOf(part), 0);
    }
    if (thrust <= 0 && ratedThrust > 0) thrust = ratedThrust * Math.abs(telemetry.throttles[0] ?? 0);
  }

  const sfc = /shuttle|rocket|x-15/i.test(name) ? 0.85 : ratedThrust > 50_000 ? 0.0075 : 0.0095;
  const altitudeFactor = Math.max(0.1, 1 - telemetry.altitude / 50_000) ** 1.1;
  const reverseFactor = telemetry.simMajor === 4 && telemetry.reverserActive ? 1.35 : 1;
  return thrust * sfc * altitudeFactor * reverseFactor;
}

export class FuelSimulatorModule implements IModule {
  public readonly id = 'fuel-simulator';
  public readonly name = 'Fuel Simulator';
  public readonly description = 'Multi-engine specific fuel consumption physics with tank burn and mass sync.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private unmountTab: (() => void) | null = null;
  private aircraft: GeoFSAircraftInstance | undefined;
  private massTarget: {
    definition: NonNullable<GeoFSAircraftInstance['definition']>;
    originalDefinitionMass: number | undefined;
    body: NonNullable<GeoFSAircraftInstance['rigidBody']>;
    originalMass: number;
    inertia: unknown;
  } | undefined;
  private massSyncElapsed = 0;
  private fuelKg = 0;
  private maxFuelKg = 0;
  private flameoutTriggered = false;
  private pctEl: HTMLElement | null = null;
  private burnEl: HTMLElement | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span>Fuel Remaining</span><strong data-role="pct">--%</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span>Burn Rate</span><strong data-role="burn">0 kg/h</strong>
      </div>
      <button type="button" data-role="refuel" class="geofs-ext-pad" style="width:100%;">Refuel 100%</button>
    `;
    this.pctEl = el.querySelector('[data-role="pct"]');
    this.burnEl = el.querySelector('[data-role="burn"]');
    el.querySelector('[data-role="refuel"]')?.addEventListener('click', () => {
      this.fuelKg = this.maxFuelKg;
      this.restoreFuelEngine();
      this.massSyncElapsed = 1;
      this.ctx?.anchors.showToast('Aircraft refueled to 100%');
    });

    this.unmountTab = context.anchors.registerHudTab('fuel', 'FUEL', el);
  }

  public update(telemetry: FlightTelemetry): void {
    const aircraft = window.geofs?.aircraft?.instance;
    const profile = telemetry.aircraft;
    if (aircraft !== this.aircraft) {
      this.restoreMass();
      this.aircraft = aircraft;
      this.fuelKg = this.maxFuelKg = profile?.maxFuel ?? 0;
      this.flameoutTriggered = false;
      this.massSyncElapsed = 1;
    }
    if (!aircraft?.definition || !profile) return;

    if (this.maxFuelKg !== profile.maxFuel) {
      const fraction = this.maxFuelKg > 0 ? this.fuelKg / this.maxFuelKg : 1;
      this.maxFuelKg = profile.maxFuel;
      this.fuelKg = fraction * this.maxFuelKg;
      if (this.fuelKg > 0) this.restoreFuelEngine();
    }
    if (this.maxFuelKg <= 0) {
      this.restoreMass();
      if (this.pctEl) this.pctEl.textContent = '—';
      if (this.burnEl) this.burnEl.textContent = '—';
      return;
    }
    if (telemetry.paused || telemetry.crashed) {
      if (this.pctEl) this.pctEl.textContent = `${((this.fuelKg / this.maxFuelKg) * 100).toFixed(1)}%`;
      if (this.burnEl) this.burnEl.textContent = '0 kg/h';
      return;
    }

    const burnRate = fuelBurnKgHr(aircraft, telemetry);
    this.fuelKg = Math.max(0, this.fuelKg - (burnRate * telemetry.dt) / 3600);
    if (this.fuelKg === 0 && !this.flameoutTriggered && aircraft.engine?.on !== false) {
      this.flameoutTriggered = this.ctx?.sim.stopEngines() ?? false;
      if (this.flameoutTriggered) {
        this.ctx?.emitEvent('fuel:exhausted', { aircraftId: profile.id });
        this.ctx?.anchors.showToast('FUEL EXHAUSTED — ENGINE FLAMEOUT', 'critical');
      }
    }

    if (profile.id !== '2953' && !/atlantis/i.test(profile.name)) {
      this.massSyncElapsed += telemetry.dt;
      if (this.massSyncElapsed >= 1) {
        this.massSyncElapsed = 0;
        const payload = Math.max(profile.mtow * 0.1, profile.mtow - profile.oew - profile.maxFuel) * 0.5;
        this.syncMass(aircraft, profile.oew + payload + this.fuelKg);
      }
    }

    if (this.pctEl) this.pctEl.textContent = `${((this.fuelKg / this.maxFuelKg) * 100).toFixed(1)}%`;
    if (this.burnEl) this.burnEl.textContent = `${Math.round(this.fuelKg > 0 ? burnRate : 0).toLocaleString()} kg/h`;
  }

  private syncMass(aircraft: GeoFSAircraftInstance, mass: number): void {
    const body = aircraft.rigidBody;
    const definition = aircraft.definition;
    if (body !== this.massTarget?.body || definition !== this.massTarget?.definition) this.restoreMass();
    if (!definition || !body?.setMassProps || !Number.isFinite(mass) || mass <= 0) return;
    if (!this.massTarget) {
      const originalMass = body.mass ?? definition.mass;
      if (typeof originalMass !== 'number' || !Number.isFinite(originalMass) || originalMass <= 0) return;
      this.massTarget = {
        body,
        definition,
        originalDefinitionMass: definition.mass,
        originalMass,
        inertia: definition.inertiaTensor ?? definition.tensorFactor
      };
    }
    definition.mass = mass;
    body.setMassProps(mass, this.massTarget.inertia);
  }

  private restoreMass(): void {
    const target = this.massTarget;
    if (target) {
      if (target.originalDefinitionMass === undefined) delete target.definition.mass;
      else target.definition.mass = target.originalDefinitionMass;
      target.body.setMassProps?.(target.originalMass, target.inertia);
    }
    this.massTarget = undefined;
  }

  private restoreFuelEngine(): void {
    if (!this.flameoutTriggered || !this.aircraft || this.aircraft.crashed) return;
    if (this.aircraft !== window.geofs?.aircraft?.instance) return;
    if (this.aircraft.startEngines) this.aircraft.startEngines();
    else this.aircraft.startEngine?.();
    this.flameoutTriggered = false;
  }

  public destroy(): void {
    this.restoreMass();
    this.aircraft = undefined;
    this.unmountTab?.();
    this.unmountTab = null;
    this.pctEl = null;
    this.burnEl = null;
    this.ctx = null;
  }
}
