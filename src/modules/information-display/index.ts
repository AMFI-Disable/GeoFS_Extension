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
      <div style="display:flex;gap:4px;padding-top:2px;border-top:1px solid rgba(136,136,136,0.25);">
        <button type="button" data-toggle="metar" style="flex:1;background:rgba(255,255,255,0.06);color:#9ca3af;border:1px solid rgba(136,136,136,0.3);border-radius:4px;padding:2px 4px;font-size:8.5px;font-weight:700;cursor:pointer;">METAR</button>
        <button type="button" data-toggle="minimap" style="flex:1;background:rgba(255,255,255,0.06);color:#9ca3af;border:1px solid rgba(136,136,136,0.3);border-radius:4px;padding:2px 4px;font-size:8.5px;font-weight:700;cursor:pointer;">MINI-MAP</button>
        <button type="button" data-toggle="tug" style="flex:1;background:rgba(255,255,255,0.06);color:#9ca3af;border:1px solid rgba(136,136,136,0.3);border-radius:4px;padding:2px 4px;font-size:8.5px;font-weight:700;cursor:pointer;">TUG</button>
      </div>
      <div data-panel="metar" hidden style="font-size:8.5px;line-height:1.35;color:#cbd5e1;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.22);border-radius:6px;padding:4px 5px;word-break:break-word;">--</div>
      <div data-panel="minimap" hidden style="background:rgba(2,6,23,0.75);border:1px solid rgba(136,136,136,0.25);border-radius:6px;padding:3px;">
        <svg data-field="minimap-svg" viewBox="-90 -48 180 96" style="width:100%;height:90px;display:block;"></svg>
        <div data-field="minimap-info" style="font-size:8px;color:#94a3b8;text-align:center;margin-top:2px;">No runway nearby</div>
      </div>
      <div data-panel="tug" hidden style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.22);border-radius:6px;padding:4px;">
        <button type="button" data-push="left" style="background:rgba(255,255,255,0.08);color:#e2e8f0;border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">L</button>
        <button type="button" data-push="straight" style="background:rgba(255,255,255,0.08);color:#e2e8f0;border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">BACK</button>
        <button type="button" data-push="right" style="background:rgba(255,255,255,0.08);color:#e2e8f0;border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">R</button>
        <button type="button" data-push="off" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:none;border-radius:3px;padding:3px 2px;font-size:8px;font-weight:700;cursor:pointer;">STOP</button>
      </div>
    `;

    root.querySelectorAll<HTMLElement>('[data-field]').forEach((el) => {
      const key = el.dataset.field;
      if (key) this.cells.set(key, el);
    });

    const metarBtn = root.querySelector<HTMLButtonElement>('[data-toggle="metar"]');
    const mapBtn = root.querySelector<HTMLButtonElement>('[data-toggle="minimap"]');
    const tugBtn = root.querySelector<HTMLButtonElement>('[data-toggle="tug"]');
    const metarPanel = root.querySelector<HTMLDivElement>('[data-panel="metar"]');
    const mapPanel = root.querySelector<HTMLDivElement>('[data-panel="minimap"]');
    const tugPanel = root.querySelector<HTMLDivElement>('[data-panel="tug"]');
    metarBtn?.addEventListener('click', () => {
      if (!metarPanel) return;
      metarPanel.hidden = !metarPanel.hidden;
      metarBtn.style.color = metarPanel.hidden ? '#9ca3af' : '#10b981';
      metarBtn.style.borderColor = metarPanel.hidden ? 'rgba(136,136,136,0.3)' : '#10b981';
    });
    mapBtn?.addEventListener('click', () => {
      if (!mapPanel) return;
      mapPanel.hidden = !mapPanel.hidden;
      mapBtn.style.color = mapPanel.hidden ? '#9ca3af' : '#10b981';
      mapBtn.style.borderColor = mapPanel.hidden ? 'rgba(136,136,136,0.3)' : '#10b981';
    });
    tugBtn?.addEventListener('click', () => {
      if (!tugPanel) return;
      tugPanel.hidden = !tugPanel.hidden;
      tugBtn.style.color = tugPanel.hidden ? '#9ca3af' : '#10b981';
      tugBtn.style.borderColor = tugPanel.hidden ? 'rgba(136,136,136,0.3)' : '#10b981';
    });
    root.querySelectorAll<HTMLButtonElement>('[data-push]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('geofs-ext:pushback', { detail: { mode: btn.dataset.push || 'off' } }));
      });
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
      telemetry.glideslopeDeviation === undefined ? '--' : `${telemetry.glideslopeDeviation.toFixed(1)}°`
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
    if (vEl) {
      vEl.hidden = !vSpeedsText;
      vEl.title = vSpeedsText;
    }

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
    this.updateMetarAndMinimap(telemetry);
  }

  private updateMetarAndMinimap(telemetry: FlightTelemetry): void {
    const metarPanel = this.rootEl?.querySelector<HTMLDivElement>('[data-panel="metar"]');
    const nearRunways = window.geofs?.runways?.nearRunways;

    let nearestIcao = '';
    let nearestDistNm = Infinity;
    const runwayLines: Array<{ x1: number; y1: number; x2: number; y2: number; icao: string }> = [];

    if (nearRunways && Number.isFinite(telemetry.lat) && Number.isFinite(telemetry.lon)) {
      const cosLat = Math.max(0.1, Math.cos((telemetry.lat * Math.PI) / 180));
      const nmPerDegLat = 60;
      const nmPerDegLon = 60 * cosLat;
      const scale = 6; // px per NM (~15 NM radius across 180px width)

      for (const rw of Object.values(nearRunways)) {
        const t1 = rw?.threshold1;
        const t2 = rw?.threshold2;
        if (!Array.isArray(t1) || !Array.isArray(t2) || t1.length < 2 || t2.length < 2) continue;
        const x1 = (t1[1] - telemetry.lon) * nmPerDegLon * scale;
        const y1 = -(t1[0] - telemetry.lat) * nmPerDegLat * scale;
        const x2 = (t2[1] - telemetry.lon) * nmPerDegLon * scale;
        const y2 = -(t2[0] - telemetry.lat) * nmPerDegLat * scale;
        const midNm = Math.hypot((x1 + x2) / 2, (y1 + y2) / 2) / scale;
        if (midNm < nearestDistNm) {
          nearestDistNm = midNm;
          nearestIcao = rw.icao ?? 'RWY';
        }
        if (midNm <= 20) {
          runwayLines.push({ x1, y1, x2, y2, icao: rw.icao ?? '' });
        }
      }
    }

    if (metarPanel && !metarPanel.hidden) {
      const metar = window.geofs?.environment?.metar;
      const windKts = window.weather?.currentWindSpeed;
      if (metar?.raw) {
        metarPanel.textContent = `${nearestIcao ? `[${nearestIcao}] ` : ''}${metar.raw}`;
      } else {
        const parts: string[] = [];
        if (nearestIcao) parts.push(`NEAR: ${nearestIcao} (${nearestDistNm.toFixed(1)} NM)`);
        if (typeof metar?.temp === 'number') parts.push(`${Math.round(metar.temp)}°C`);
        if (typeof windKts === 'number') parts.push(`WIND ${Math.round(windKts)}KT`);
        if (typeof metar?.visibility === 'number') parts.push(`VIS ${Math.round(metar.visibility)}M`);
        if (typeof metar?.clouds === 'number') parts.push(`CLD ${Math.round(metar.clouds)}%`);
        metarPanel.textContent = parts.length > 0 ? parts.join(' · ') : 'METAR unavailable';
      }
    }

    const mapPanel = this.rootEl?.querySelector<HTMLDivElement>('[data-panel="minimap"]');
    const svg = this.cells.get('minimap-svg');
    if (mapPanel && !mapPanel.hidden && svg) {
      const linesHtml = runwayLines
        .map((r) => `<line x1="${r.x1.toFixed(1)}" y1="${r.y1.toFixed(1)}" x2="${r.x2.toFixed(1)}" y2="${r.y2.toFixed(1)}" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round"/>`)
        .join('');

      // TCAS / Nearby Multiplayer Traffic
      const trafficHtmlParts: string[] = [];
      let trafficCount = 0;
      const mpUsers = (window.geofs as unknown as { multiplayer?: { users?: Record<string, { lastUpdate?: { co?: number[] }; lla?: number[] }> } })?.multiplayer?.users;
      if (mpUsers && Number.isFinite(telemetry.lat) && Number.isFinite(telemetry.lon)) {
        const cosLat = Math.max(0.1, Math.cos((telemetry.lat * Math.PI) / 180));
        const scale = 6;
        for (const u of Object.values(mpUsers)) {
          const co = u?.lla ?? u?.lastUpdate?.co;
          if (!Array.isArray(co) || co.length < 2) continue;
          const uLat = Number(co[0]);
          const uLon = Number(co[1]);
          if (!Number.isFinite(uLat) || !Number.isFinite(uLon)) continue;
          const tx = (uLon - telemetry.lon) * 60 * cosLat * scale;
          const ty = -(uLat - telemetry.lat) * 60 * scale;
          const distNm = Math.hypot(tx, ty) / scale;
          if (distNm > 20 || distNm < 0.01) continue;
          trafficCount++;
          const uAltFt = Number.isFinite(co[2]) ? Number(co[2]) * 3.28084 : telemetry.altitude;
          const relHundreds = Math.round((uAltFt - telemetry.altitude) / 100);
          const relTag = `${relHundreds >= 0 ? '+' : ''}${relHundreds}`;
          trafficHtmlParts.push(
            `<g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)})"><polygon points="0,-3 3,0 0,3 -3,0" fill="#f59e0b"/><text x="4" y="2.5" font-size="6" fill="#fbbf24" font-weight="700">${relTag}</text></g>`
          );
        }
      }

      const hdg = Number.isFinite(telemetry.heading) ? telemetry.heading : 0;
      svg.innerHTML = `
        <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(148,163,184,0.22)" stroke-width="0.8" stroke-dasharray="2,2"/>
        <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(148,163,184,0.14)" stroke-width="0.8"/>
        ${linesHtml}
        ${trafficHtmlParts.join('')}
        <g transform="rotate(${hdg.toFixed(1)})">
          <polygon points="0,-6 4,5 0,2 -4,5" fill="#10b981"/>
        </g>
      `;
      const rwInfo = nearestIcao ? `${nearestIcao} · ${nearestDistNm.toFixed(1)} NM` : 'No runway < 20 NM';
      const tcasInfo = trafficCount > 0 ? ` · ${trafficCount} TFC` : '';
      this.setText('minimap-info', `${rwInfo}${tcasInfo}`);
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
    this.lastAcKey = '';
    this.lastKias = 0;
    this.trend = '';
    this.rootEl = null;
  }
}
