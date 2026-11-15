import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export type FailureType = 'engine' | 'electrical' | 'pitot' | 'gear';

export class FailureSimulatorModule implements IModule {
  public readonly id = 'failure-simulator';
  public readonly name = 'Failure Simulator';
  public readonly description = 'Manual and probability-based system failures (flameout, electrical, pitot icing, gear jam).';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private unmountTab: (() => void) | null = null;
  private activeFailures = new Set<FailureType>();
  private lastProbCheckMs = 0;
  private statusEl: HTMLElement | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    const root = document.createElement('div');
    root.innerHTML = `
      <div style="font-size:11px;margin-bottom:6px;">Active: <strong data-role="status">None</strong></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
        <button type="button" data-fail="engine" class="geofs-ext-pad">Engine Fail</button>
        <button type="button" data-fail="electrical" class="geofs-ext-pad">Electrical</button>
        <button type="button" data-fail="pitot" class="geofs-ext-pad">Pitot Freeze</button>
        <button type="button" data-fail="gear" class="geofs-ext-pad">Gear Jam</button>
      </div>
      <button type="button" data-role="clear" class="geofs-ext-pad" style="width:100%;margin-top:6px;">Clear All Failures</button>
    `;
    this.statusEl = root.querySelector('[data-role="status"]');

    root.querySelectorAll<HTMLButtonElement>('[data-fail]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.fail as FailureType;
        this.triggerFailure(type, 'Manual');
      });
    });

    root.querySelector('[data-role="clear"]')?.addEventListener('click', () => this.clearFailures());
    this.unmountTab = context.anchors.registerHudTab('fail', 'FAIL', root);
  }

  public triggerFailure(type: FailureType, source: 'Manual' | 'Auto'): void {
    if (this.activeFailures.has(type)) return;
    this.activeFailures.add(type);
    this.ctx?.audio.playGpwsAlert();
    this.ctx?.anchors.showToast(`${source} Failure: ${type.toUpperCase()}`, 'critical');
    this.ctx?.emitEvent('failure:triggered', { type, source });

    if (type === 'engine') {
      window.geofs?.aircraft?.instance?.stopEngines?.();
    }
    this.renderStatus();
  }

  public clearFailures(): void {
    this.activeFailures.clear();
    window.geofs?.aircraft?.instance?.startEngines?.();
    this.ctx?.anchors.showToast('All system failures cleared');
    this.renderStatus();
  }

  public update(telemetry: FlightTelemetry): void {
    if (telemetry.paused || !this.ctx) return;
    if (!this.ctx.getSettings().failureProbabilitiesEnabled) return;

    if (telemetry.timestamp - this.lastProbCheckMs < 5000) return;
    this.lastProbCheckMs = telemetry.timestamp;

    // Low-altitude climb bird strike probability
    if (!telemetry.groundContact && telemetry.aglFeet > 50 && telemetry.aglFeet < 2500 && telemetry.vs > 300) {
      if (Math.random() < 0.005) this.triggerFailure('engine', 'Auto');
    }
    // High-altitude icing pitot freeze probability
    if (telemetry.altitude > 22000 && Math.random() < 0.004) {
      this.triggerFailure('pitot', 'Auto');
    }
  }

  private renderStatus(): void {
    if (!this.statusEl) return;
    this.statusEl.textContent = this.activeFailures.size ? Array.from(this.activeFailures).join(', ').toUpperCase() : 'None';
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.activeFailures.clear();
    this.statusEl = null;
    this.ctx = null;
  }
}
