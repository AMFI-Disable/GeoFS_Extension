import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export class InformationDisplayModule implements IModule {
  public readonly id = 'information-display';
  public readonly name = 'Information Display';
  public readonly description = 'HUD telemetry grid with speed trends, color-coded alerts, and multi-engine % THR / REV.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private rootEl: HTMLDivElement | null = null;
  private unmountTab: (() => void) | null = null;
  private cells = new Map<string, HTMLElement>();
  private lastKias = 0;
  private trend = '';

  public init(context: ModuleContext): void {
    const root = document.createElement('div');
    root.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span data-field="ac-name" style="font-weight:700;">Loading Aircraft...</span>
        <span data-field="ac-cat" style="font-size:9px;opacity:0.7;text-transform:uppercase;">--</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;font-size:11px;">
        <div>KIAS: <strong data-field="kias">--</strong></div>
        <div>MACH: <strong data-field="mach">--</strong></div>
        <div>ALT: <strong data-field="alt">--</strong></div>
        <div>V/S: <strong data-field="vs">--</strong></div>
        <div>HDG: <strong data-field="hdg">--</strong></div>
        <div>AGL: <strong data-field="agl">--</strong></div>
        <div>GS: <strong data-field="gs">--</strong></div>
        <div>AOA: <strong data-field="aoa">--</strong></div>
        <div>G: <strong data-field="g">--</strong></div>
        <div><span data-field="thr-label">THR</span>: <strong data-field="thr">--</strong></div>
      </div>
      <div data-field="vspeeds" style="margin-top:6px;padding-top:4px;border-top:1px solid rgba(128,128,128,0.25);font-size:9px;opacity:0.85;">V-Speeds: --</div>
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
    if (Math.abs(telemetry.kias - this.lastKias) > 0.15) {
      this.trend = telemetry.kias > this.lastKias ? ' ▲' : ' ▼';
      this.lastKias = telemetry.kias;
    } else if (Math.abs(telemetry.kias - this.lastKias) < 0.02) {
      this.trend = '';
    }

    this.setText('ac-name', telemetry.aircraft ? `${telemetry.aircraft.name} (${telemetry.aircraft.id})` : 'No Aircraft');
    this.setText('ac-cat', telemetry.aircraft?.category ?? '--');
    this.setText('kias', `${telemetry.kias.toFixed(1)}${this.trend}`);
    this.setText('mach', telemetry.mach.toFixed(2));
    this.setText('alt', `${Math.round(telemetry.altitude).toLocaleString()} ft`);

    const vsColor = telemetry.vs > 150 ? '#22c55e' : telemetry.vs < -1000 ? '#ef4444' : '';
    this.setText('vs', `${Math.round(telemetry.vs)} fpm`, vsColor);

    this.setText('hdg', `${Math.round(telemetry.heading).toString().padStart(3, '0')}°`);
    this.setText('agl', `${Math.round(telemetry.aglFeet).toLocaleString()} ft`);
    this.setText('gs', `${Math.round(telemetry.groundSpeed)} kt`);

    const aoaColor = telemetry.aoa > 16 ? '#ef4444' : telemetry.aoa > 12 ? '#eab308' : '';
    this.setText('aoa', `${telemetry.aoa.toFixed(1)}°`, aoaColor);

    const gColor = telemetry.gForce > 3 || telemetry.gForce < -1 ? '#ef4444' : '';
    this.setText('g', telemetry.gForce.toFixed(2), gColor);

    if (telemetry.aircraft?.category === 'rotorcraft') {
      this.setText('thr-label', 'COLL/TRQ');
      const trqColor = telemetry.torquePct > 100 ? '#ef4444' : telemetry.torquePct > 90 ? '#eab308' : '';
      this.setText('thr', `${telemetry.collectivePct}% / ${telemetry.torquePct}%`, trqColor);
    } else {
      this.setText('thr-label', 'THR');
      const rev = telemetry.reverserActive ? '[REV] ' : '';
      const thrText = telemetry.throttles.map((t) => `${Math.round(t * 100)}%`).join('/');
      this.setText('thr', `${rev}${thrText}`, telemetry.reverserActive ? '#f97316' : '');
    }

    const vs = telemetry.aircraft?.vSpeeds;
    if (vs) {
      const parts: string[] = [];
      if (vs.v1) parts.push(`V1 ${vs.v1}`);
      if (vs.vr) parts.push(`VR ${vs.vr}`);
      if (vs.v2) parts.push(`V2 ${vs.v2}`);
      parts.push(`Vref ${vs.vref}`);
      if (vs.vfe) parts.push(`Vfe ${vs.vfe}`);
      parts.push(`Vne ${vs.vne}`);
      const overspeed = telemetry.kias > vs.vne;
      this.setText('vspeeds', parts.join(' • '), overspeed ? '#ef4444' : '');
    } else {
      this.setText('vspeeds', 'V-Speeds: --');
    }
  }

  private setText(field: string, value: string, color = ''): void {
    const el = this.cells.get(field);
    if (!el) return;
    if (el.textContent !== value) el.textContent = value;
    el.style.color = color;
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.cells.clear();
    this.rootEl = null;
  }
}
