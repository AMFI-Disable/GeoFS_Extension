import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export class InformationDisplayModule implements IModule {
  public readonly id = 'information-display';
  public readonly name = 'Information Display';
  public readonly description = 'HUD telemetry grid with multi-engine % THR / REV readouts and dynamic aircraft detection.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private rootEl: HTMLDivElement | null = null;
  private unmountTab: (() => void) | null = null;
  private cells = new Map<string, HTMLElement>();

  public init(context: ModuleContext): void {
    const root = document.createElement('div');
    root.innerHTML = `
      <div data-field="ac-name" style="font-weight:700;margin-bottom:6px;">Loading Aircraft...</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;font-size:11px;">
        <div>KIAS: <strong data-field="kias">--</strong></div>
        <div>MACH: <strong data-field="mach">--</strong></div>
        <div>ALT: <strong data-field="alt">--</strong></div>
        <div>V/S: <strong data-field="vs">--</strong></div>
        <div>HDG: <strong data-field="hdg">--</strong></div>
        <div>AGL: <strong data-field="agl">--</strong></div>
        <div>G: <strong data-field="g">--</strong></div>
        <div>THR: <strong data-field="thr">--</strong></div>
      </div>
    `;

    root.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
      const key = el.dataset.field;
      if (key) this.cells.set(key, el);
    });

    this.rootEl = root;
    this.unmountTab = context.anchors.registerHudTab('info', 'INFO', root, true);
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.rootEl) return;
    this.setText('ac-name', telemetry.aircraft ? `${telemetry.aircraft.name} (${telemetry.aircraft.id})` : 'No Aircraft');
    this.setText('kias', telemetry.kias.toFixed(1));
    this.setText('mach', telemetry.mach.toFixed(2));
    this.setText('alt', `${Math.round(telemetry.altitude).toLocaleString()} ft`);
    this.setText('vs', `${Math.round(telemetry.vs)} fpm`);
    this.setText('hdg', `${Math.round(telemetry.heading).toString().padStart(3, '0')}°`);
    this.setText('agl', `${Math.round(telemetry.aglFeet).toLocaleString()} ft`);
    this.setText('g', telemetry.gForce.toFixed(2));

    const rev = telemetry.reverserActive ? '[REV] ' : '';
    const thrText = telemetry.throttles.map((t) => `${Math.round(t * 100)}%`).join(' / ');
    this.setText('thr', `${rev}${thrText}`);
  }

  private setText(field: string, value: string): void {
    const el = this.cells.get(field);
    if (el && el.textContent !== value) el.textContent = value;
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.cells.clear();
    this.rootEl = null;
  }
}
