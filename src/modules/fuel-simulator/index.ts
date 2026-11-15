import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export class FuelSimulatorModule implements IModule {
  public readonly id = 'fuel-simulator';
  public readonly name = 'Fuel Simulator';
  public readonly description = 'Multi-engine specific fuel consumption physics with tank burn and mass sync.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private unmountTab: (() => void) | null = null;
  private currentAcId: string | null = null;
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
      this.flameoutTriggered = false;
      this.ctx?.anchors.showToast('Aircraft refueled to 100%');
    });

    this.unmountTab = context.anchors.registerHudTab('fuel', 'FUEL', el);
  }

  public update(telemetry: FlightTelemetry): void {
    if (!telemetry.aircraft) return;
    if (telemetry.aircraft.id !== this.currentAcId) {
      this.currentAcId = telemetry.aircraft.id;
      this.maxFuelKg = telemetry.aircraft.maxFuel;
      this.fuelKg = this.maxFuelKg;
      this.flameoutTriggered = false;
    } else if (this.maxFuelKg !== telemetry.aircraft.maxFuel) {
      const fraction = this.maxFuelKg > 0 ? this.fuelKg / this.maxFuelKg : 1;
      this.maxFuelKg = telemetry.aircraft.maxFuel;
      this.fuelKg = fraction * this.maxFuelKg;
      if (this.fuelKg > 0) this.flameoutTriggered = false;
    }
    if (this.maxFuelKg <= 0) {
      if (this.pctEl) this.pctEl.textContent = '—';
      if (this.burnEl) this.burnEl.textContent = '—';
    }
    if (this.maxFuelKg <= 0) return;
    if (telemetry.paused || telemetry.crashed) {
      if (this.pctEl) this.pctEl.textContent = `${((this.fuelKg / this.maxFuelKg) * 100).toFixed(1)}%`;
      if (this.burnEl) this.burnEl.textContent = '0 kg/h';
      return;
    }

    const avgThr = telemetry.throttles.reduce((a, b) => a + Math.abs(b), 0) / Math.max(1, telemetry.throttles.length);
    const altMult = Math.max(0.15, Math.pow(1 - Math.min(45000, telemetry.altitude) / 50000, 1.1));
    const revMult = telemetry.reverserActive ? 1.35 : 1.0;
    const baseRateKgHr = Math.max(40, this.maxFuelKg * 0.18) * avgThr * altMult * revMult;

    this.fuelKg = Math.max(0, this.fuelKg - (baseRateKgHr * telemetry.dt) / 3600);
    if (this.fuelKg <= 0 && !this.flameoutTriggered) {
      this.flameoutTriggered = true;
      this.ctx?.emitEvent('fuel:exhausted', { aircraftId: this.currentAcId });
      const stopped = this.ctx?.sim.stopEngines();
      this.ctx?.anchors.showToast(stopped ? 'FUEL EXHAUSTED — ENGINE FLAMEOUT' : 'FUEL EXHAUSTED', 'critical');
    }

    if (this.pctEl) this.pctEl.textContent = `${((this.fuelKg / this.maxFuelKg) * 100).toFixed(1)}%`;
    if (this.burnEl) this.burnEl.textContent = `${Math.round(this.fuelKg > 0 ? baseRateKgHr : 0).toLocaleString()} kg/h`;
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.pctEl = null;
    this.burnEl = null;
    this.ctx = null;
  }
}
