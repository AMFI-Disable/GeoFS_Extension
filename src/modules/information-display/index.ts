import { formatVSpeeds } from '../../core/aircraft-profile';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

const UNKNOWN_JOKES = [
  'Mystery Flying Object',
  'Classified Area 51 Project',
  'Paper Plane with Jet Engines',
  'UFO (Unidentified Flying Object)',
  'Identity Obscured by Clouds',
  'Skunkworks Prototype',
  'Experimental Lawn Ornament',
  'Ghost Flight 99',
  'Stealthy Pizza Delivery',
  'Aerodynamic Brick'
] as const;

function pickDeterministicJoke(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return UNKNOWN_JOKES[hash % UNKNOWN_JOKES.length];
}

function buildCell(label: string, field: string): string {
  return `
    <div style="min-width:0;overflow:hidden;padding:3px 4px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.22);border-radius:6px;">
      <div style="font-size:8px;color:#9ca3af;letter-spacing:0.4px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${label}</div>
      <div data-field="${field}" style="font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</div>
    </div>
  `;
}

export class InformationDisplayModule implements IModule {
  public readonly id = 'information-display';
  public readonly name = 'Information Display';
  public readonly description = 'GeoFS Native HUD telemetry grid with registry badge, trend indicators, glideslope, and multi-engine % THR.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private rootEl: HTMLDivElement | null = null;
  private unmountTab: (() => void) | null = null;
  private cells = new Map<string, HTMLElement>();
  private lastAcKey = '';
  private lastKias = 0;
  private trend = '';

  public init(context: ModuleContext): void {
    const root = document.createElement('div');
    root.style.cssText = 'display:flex;flex-direction:column;gap:5px;width:100%;';
    root.innerHTML = `
      <div id="hud-ac-header" style="padding-bottom:6px;border-bottom:1px solid rgba(136,136,136,0.35);">
        <div id="hud-ac-name" data-field="ac-name" style="font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Loading Aircraft...</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:3px;">
          <span id="hud-ac-id-badge" data-field="ac-id" style="display:inline-block;font-size:9px;padding:1px 5px;background:#dddddd;color:#000000;border-radius:3px;font-weight:800;white-space:nowrap;">ID: --</span>
          <span data-field="ac-cat" style="font-size:9px;color:#aaaaaa;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</span>
        </div>
      </div>
      <div class="hud-section-header" style="font-size:9px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.6px;">Performance</div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;">
        ${buildCell('KTS KIAS', 'kias')}
        ${buildCell('FT ALT', 'alt')}
        ${buildCell('FPM V/S', 'vs')}
        ${buildCell('DEG HDG', 'hdg')}
        <div style="grid-column:span 2;min-width:0;overflow:hidden;padding:3px 4px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.22);border-radius:6px;display:flex;justify-content:space-between;align-items:center;gap:6px;">
          <span data-field="power-label" style="font-size:8px;color:#9ca3af;letter-spacing:0.4px;text-transform:uppercase;white-space:nowrap;">% THR</span>
          <strong data-field="thr" style="font-size:11px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">--</strong>
        </div>
      </div>
      <div class="hud-section-header" style="font-size:9px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.6px;margin-top:2px;">Additional Data</div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;">
        ${buildCell('M MACH', 'mach')}
        ${buildCell('DEG AOA', 'aoa')}
        ${buildCell('G G-FORCE', 'g')}
        ${buildCell('FT AGL', 'agl')}
        ${buildCell('KTS GS', 'gs')}
        ${buildCell('DEG GSLOPE', 'glideslope')}
      </div>
      <div style="display:flex;justify-content:space-between;gap:6px;font-size:9px;color:#cccccc;padding-top:2px;border-top:1px solid rgba(136,136,136,0.25);">
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">FLAPS: <strong data-field="flaps">--</strong></span>
        <span style="white-space:nowrap;">GEAR: <strong data-field="gear">--</strong></span>
        <span style="white-space:nowrap;">BRK: <strong data-field="brk">--</strong></span>
      </div>
      <div data-field="rotor-torque" hidden style="font-size:9px;color:#38bdf8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
      <div data-field="v-speeds" style="font-size:9px;color:#aaaaaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
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

    const ac = telemetry.aircraft;
    const acKey = ac ? `${ac.id}:${ac.name}:${ac.isDynamic}` : 'none';
    if (acKey !== this.lastAcKey) {
      this.lastAcKey = acKey;
      const nameEl = this.cells.get('ac-name');
      const badgeEl = this.cells.get('ac-id');
      if (ac && nameEl && badgeEl) {
        const isGenericUnknown = ac.isDynamic && ac.name === `Aircraft ${ac.id}`;
        if (!ac.isDynamic) {
          nameEl.textContent = ac.name;
          nameEl.title = ac.name;
          badgeEl.style.background = '#dddddd';
          badgeEl.style.color = '#000000';
          badgeEl.textContent = `REG: ${ac.id}`;
        } else if (!isGenericUnknown) {
          nameEl.textContent = ac.name;
          nameEl.title = `${ac.name} (Dynamic Profile)`;
          badgeEl.style.background = '#38bdf8';
          badgeEl.style.color = '#000000';
          badgeEl.textContent = `AUTO: ${ac.id}`;
        } else {
          const joke = pickDeterministicJoke(ac.id);
          nameEl.textContent = `${joke} (${ac.name})`;
          nameEl.title = `${joke} (${ac.name})`;
          badgeEl.style.background = '#94a3b8';
          badgeEl.style.color = '#000000';
          badgeEl.textContent = `ID: ${ac.id}`;
        }
      } else if (nameEl && badgeEl) {
        nameEl.textContent = 'No Aircraft';
        badgeEl.style.background = '#94a3b8';
        badgeEl.textContent = 'ID: --';
      }
    }

    if (Math.abs(telemetry.kias - this.lastKias) > 0.1) {
      this.trend = telemetry.kias > this.lastKias ? ' ▲' : ' ▼';
      this.lastKias = telemetry.kias;
    } else if (Math.abs(telemetry.kias - this.lastKias) < 0.01) {
      this.trend = '';
    }

    this.setText('ac-cat', ac?.category ?? '--');
    this.setText('kias', `${telemetry.kias.toFixed(1)}${this.trend}`);
    this.setText('mach', telemetry.mach.toFixed(2));
    this.setText('alt', `${Math.round(telemetry.altitude).toLocaleString()}`);

    const vsColor = telemetry.vs > 100 ? '#22c55e' : telemetry.vs < -1000 ? '#ef4444' : '#ffffff';
    this.setText('vs', `${Math.round(telemetry.vs)}`, vsColor);

    this.setText('hdg', `${Math.round(telemetry.heading).toString().padStart(3, '0')}°`);
    this.setText('agl', `${Math.round(telemetry.aglFeet).toLocaleString()}`);
    this.setText('gs', `${telemetry.groundSpeed.toFixed(1)}`);
    this.setText(
      'glideslope',
      telemetry.glideslopeDeviation === undefined ? 'N/A' : `${telemetry.glideslopeDeviation.toFixed(1)}°`
    );

    const aoaColor = telemetry.aoa > 16 ? '#ef4444' : telemetry.aoa > 12 ? '#eab308' : '#ffffff';
    this.setText('aoa', `${telemetry.aoa.toFixed(1)}°`, aoaColor);

    const gColor = telemetry.gForce > 3 || telemetry.gForce < -1 ? '#ef4444' : '#ffffff';
    this.setText('g', telemetry.gForce.toFixed(1), gColor);

    this.setText('flaps', `${telemetry.flapsTarget}/${ac?.maxFlaps ?? 0}`);
    this.setText('gear', telemetry.gearDown ? 'DOWN' : 'UP', telemetry.gearDown ? '#22c55e' : '#ffffff');
    this.setText('brk', telemetry.parkingBrake ? 'PARK' : 'OFF', telemetry.parkingBrake ? '#eab308' : '#ffffff');

    const vSpeedsText = formatVSpeeds(ac?.vSpeeds, ac?.machSpeeds);
    this.setText('v-speeds', vSpeedsText);
    const vEl = this.cells.get('v-speeds');
    if (vEl) vEl.title = vSpeedsText;

    const rotorcraft = ac?.category === 'rotorcraft';
    const torque = this.cells.get('rotor-torque');
    if (torque) torque.hidden = !rotorcraft;
    this.setText('power-label', rotorcraft ? '% COLL' : '% THR');
    if (rotorcraft) {
      this.setText('thr', telemetry.collective === null ? '—' : `${Math.round(telemetry.collective * 100)}%`);
      this.setText('rotor-torque', `Rotor Torque: ${telemetry.rotorTorque ?? '—'}`);
      return;
    }

    const rev = telemetry.reverserActive ? '[REV] ' : '';
    const thrText = telemetry.throttles.map((t) => `${Math.round(t * 100)}%`).join('/');
    this.setText('thr', `${rev}${thrText}`, telemetry.reverserActive ? '#f97316' : '#ffffff');
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
    this.lastAcKey = '';
    this.lastKias = 0;
    this.trend = '';
    this.rootEl = null;
  }
}
