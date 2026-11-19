import {
  MANDATORY_PHASE_LABELS,
  SITUATIONAL_GUIDES,
  evaluateChecklistSync,
  getMandatoryProcedures,
  isHardwareSync,
  type ChecklistProcedure
} from './procedures';
import { formatVSpeeds } from '../../core/aircraft-profile';
import type { AircraftProfile, FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';

interface EmergencyEntry {
  type: string;
  procedure: ChecklistProcedure;
  recoverable: boolean;
  contingency: boolean;
}

const CHECKLIST_STYLES = `
  .geofs-ext-chk-root {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    font-family: Helvetica, Arial, sans-serif;
  }
  .geofs-ext-chk-phases {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 3px;
  }
  .geofs-ext-chk-phase {
    background: #000000;
    color: #cccccc;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 2px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .geofs-ext-chk-phase.is-active {
    background: #4caf50;
    border-color: #4caf50;
    color: #ffffff;
  }
  .geofs-ext-chk-phase.is-emergency {
    border-color: #ef4444;
    color: #ff8d8d;
  }
  .geofs-ext-chk-phase.is-emergency.is-active {
    background: #ef4444;
    border-color: #ef4444;
    color: #ffffff;
  }
  .geofs-ext-chk-item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 4px 5px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(136, 136, 136, 0.25);
    cursor: pointer;
  }
  .geofs-ext-chk-item.is-done {
    border-color: rgba(76, 175, 80, 0.5);
    opacity: 0.72;
  }
  .geofs-ext-chk-box {
    width: 12px;
    height: 12px;
    border: 1px solid #888888;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 900;
    flex-shrink: 0;
    margin-top: 1px;
    color: #4caf50;
  }
  .geofs-ext-chk-item.is-done .geofs-ext-chk-box {
    background: #4caf50;
    border-color: #4caf50;
    color: #ffffff;
  }
  .geofs-ext-chk-btn {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 7px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }
  .geofs-ext-chk-btn.is-active {
    border-color: #4caf50;
    color: #4caf50;
  }
  .geofs-ext-chk-recovery {
    width: 100%;
    padding: 5px 8px;
    background: #000000;
    border: 1px solid #eab308;
    border-radius: 15px;
    color: #facc15;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
  }
`;

export function executeChecklistHardwareAction(
  sync: string | undefined,
  telemetry: FlightTelemetry,
  profile: AircraftProfile | null,
  context: ModuleContext
): boolean {
  if (!sync || !profile) return false;
  const c = window.controls as (Record<string, unknown> & typeof window.controls) | undefined;

  if (sync === 'parkingBrake' || sync === 'parkingBrake:off') {
    const want = sync === 'parkingBrake';
    if (telemetry.parkingBrake !== want) {
      if (typeof c?.setters?.setParkingBrake?.set === 'function') {
        c.setters.setParkingBrake.set();
      } else if (c) {
        c.brakes = want ? 1 : 0;
      }
      return true;
    }
    return false;
  }

  if (sync === 'gear' || sync === 'gear:down' || sync === 'gear:up') {
    const wantDown = sync !== 'gear:up';
    if (profile.hasGear && telemetry.gearDown !== wantDown) {
      context.sim.toggleGear();
      return true;
    }
    return false;
  }

  if (sync === 'flaps') {
    context.sim.setFlaps(telemetry.flapsTarget > 0 ? telemetry.flapsTarget : Math.min(profile.maxFlaps, 1));
    return true;
  }
  if (sync === 'flaps:0') {
    context.sim.setFlaps(0);
    return true;
  }
  if (sync === 'flaps:full') {
    context.sim.setFlaps(profile.maxFlaps);
    return true;
  }
  if (sync.startsWith('flaps:')) {
    const target = Number(sync.slice(6));
    if (Number.isFinite(target)) {
      context.sim.setFlaps(Math.min(profile.maxFlaps, Math.max(0, target)));
      return true;
    }
  }

  if (sync === 'airbrakes' || sync === 'airbrakes:arm' || sync === 'airbrakes:off') {
    const want = sync !== 'airbrakes:off';
    if (c?.airbrakes) {
      c.airbrakes.target = want ? 1 : 0;
      c.setters?.setAirbrakes?.set?.();
      return true;
    }
  }

  if (sync === 'lightsOn' && c) {
    if (telemetry.lightsOn) return false;
    const setters = c.setters as { setLights?: { set?: () => void } } | undefined;
    if (typeof setters?.setLights?.set === 'function') {
      setters.setLights.set();
      return true;
    }
    const toggleLights =
      (c as { toggleLights?: () => void }).toggleLights ??
      (window.geofs?.aircraft?.instance as { toggleLights?: () => void } | undefined)?.toggleLights;
    if (typeof toggleLights === 'function') {
      toggleLights();
      return true;
    }
    return false;
  }

  return false;
}

export class ChecklistSystemModule implements IModule {
  public readonly id = 'checklist-system';
  public readonly name = 'Checklist System';
  public readonly description = '4 mandatory flight-gate checklists with live auto-checks, situational guide & emergency QRH overrides.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private rootEl: HTMLDivElement | null = null;
  private unmounts: Array<() => void> = [];
  private activePhase = 0;
  private autoAdvance = false;
  private showGuide = false;
  private phaseTitles: string[] = [];
  private emergencies = new Map<string, EmergencyEntry>();
  private lastAircraftKey = '';
  private lastTelemetry: FlightTelemetry | null = null;
  private lastRender = '';
  private lastEmittedPhase = '';
  private manualDone = new Set<string>();

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.autoAdvance = Boolean(context.getSettings().checklistAutoAdvance);

    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'geofs-ext-checklist-styles';
      style.textContent = CHECKLIST_STYLES;
      document.head?.appendChild(style);
      this.unmounts.push(() => style.remove());
    }

    const root = document.createElement('div');
    root.className = 'geofs-ext-chk-root';
    this.rootEl = root;
    this.unmounts.push(context.anchors.registerHudTab('checks', 'CHECKS', root));

    const cyclePhase = () => {
      if (!this.phaseTitles.length) return;
      this.activePhase = (this.activePhase + 1) % this.phaseTitles.length;
      this.lastRender = '';
      context.anchors.openHudTab('checks');
      context.anchors.showToast(`Checklist Phase: ${this.phaseTitles[this.activePhase]}`);
    };

    const combo = context.getSettings().keybindings.toggleChecklist;
    this.unmounts.push(context.keybinds.register('checklist-cycle', combo, cyclePhase));

    this.unmounts.push(
      context.onEvent<{ type: string; procedure?: ChecklistProcedure; recoverable?: boolean }>(
        'failure:triggered',
        ({ type, procedure, recoverable }) => {
          if (!procedure) return;
          const isRecoverable = recoverable !== false;
          this.emergencies.set(type, {
            type,
            procedure,
            recoverable: isRecoverable,
            contingency: !isRecoverable
          });
          // Switch directly to emergency QRH tab
          this.activePhase = 4 + Array.from(this.emergencies.keys()).indexOf(type);
          this.lastRender = '';
          context.anchors.openHudTab('checks');
        }
      )
    );

    this.unmounts.push(
      context.onEvent<{ type: string; procedure?: ChecklistProcedure }>(
        'failure:contingency',
        ({ type, procedure }) => {
          if (!procedure) return;
          const existing = this.emergencies.get(type);
          this.emergencies.set(type, {
            type,
            procedure,
            recoverable: false,
            contingency: true
          });
          if (!existing) {
            this.activePhase = 4 + Array.from(this.emergencies.keys()).indexOf(type);
          }
          this.lastRender = '';
          context.anchors.openHudTab('checks');
        }
      )
    );

    this.unmounts.push(
      context.onEvent<{ type: string }>('failure:cleared', ({ type }) => {
        if (this.emergencies.delete(type)) {
          this.lastRender = '';
        }
      })
    );

    context.emitEvent('failure:request-active');
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('checklist-cycle', settings.keybindings.toggleChecklist);
    if (this.autoAdvance !== Boolean(settings.checklistAutoAdvance)) {
      this.autoAdvance = Boolean(settings.checklistAutoAdvance);
      this.lastRender = '';
    }
  }

  public update(telemetry: FlightTelemetry): void {
    this.lastTelemetry = telemetry;
    if (!this.rootEl || !this.ctx) return;

    const ac = telemetry.aircraft;
    if (!ac) {
      if (this.lastRender) this.rootEl.replaceChildren();
      this.lastRender = '';
      this.lastAircraftKey = '';
      return;
    }

    const key = `${ac.id}:${ac.name}:${ac.maxFlaps}:${JSON.stringify(ac.vSpeeds ?? {})}`;
    if (key !== this.lastAircraftKey) {
      this.lastAircraftKey = key;
      this.manualDone.clear();
      this.activePhase = 0;
      this.emergencies.clear();
      this.lastRender = '';
    }

    const mandatory = getMandatoryProcedures(ac);
    const emergencies = Array.from(this.emergencies.values());
    const normalTitles = mandatory.map((p) => (p.gateId ? MANDATORY_PHASE_LABELS[p.gateId] : p.title));
    this.phaseTitles = [...normalTitles, ...emergencies.map((e) => `QRH:${e.procedure.title.slice(0, 8)}`)];

    if (this.activePhase >= this.phaseTitles.length) this.activePhase = 0;

    const isEmergencyPhase = this.activePhase >= mandatory.length;
    const activeEmergency = isEmergencyPhase ? emergencies[this.activePhase - mandatory.length] : undefined;
    const activeProcedure = activeEmergency ? activeEmergency.procedure : mandatory[this.activePhase];

    const items = activeProcedure.items.map((item, idx) => {
      const id = `${activeEmergency ? `em-${activeEmergency.type}-${activeEmergency.contingency ? 'cont' : 'qrh'}` : `gate-${this.activePhase}`}-${idx}`;
      const hardware = isHardwareSync(item.sync);
      const autoDone = !activeEmergency && evaluateChecklistSync(item.sync, telemetry, ac);
      const checked = this.manualDone.has(id) || autoDone;
      return { id, item, hardware, autoDone, checked };
    });

    const pendingCount = items.filter((i) => !i.checked).length;
    const phaseEmitKey = `${activeProcedure.title}:${pendingCount}`;
    if (phaseEmitKey !== this.lastEmittedPhase) {
      this.lastEmittedPhase = phaseEmitKey;
      this.ctx.emitEvent('checklist:phase', { phase: activeProcedure.title, pending: pendingCount });
    }

    if (this.autoAdvance && !isEmergencyPhase && items.length > 0 && pendingCount === 0 && this.activePhase < mandatory.length - 1) {
      this.activePhase += 1;
      this.lastRender = '';
      return;
    }

    const speeds = formatVSpeeds(ac.vSpeeds, ac.machSpeeds);
    const renderKey = JSON.stringify([
      key,
      this.activePhase,
      this.autoAdvance,
      this.showGuide,
      this.phaseTitles,
      activeEmergency?.contingency ?? false,
      activeEmergency?.recoverable ?? false,
      speeds,
      items.map((i) => [i.id, i.checked])
    ]);
    if (renderKey === this.lastRender) return;
    this.lastRender = renderKey;

    this.rootEl.replaceChildren();

    // Header row with aircraft + AUTO/GUIDE/RST controls
    const topBar = document.createElement('div');
    topBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:4px;';

    const acLabel = document.createElement('span');
    acLabel.style.cssText = 'font-size:10px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    acLabel.textContent = `${ac.name} (${pendingCount} left)`;
    acLabel.title = ac.name;

    const btnGroup = document.createElement('span');
    btnGroup.style.cssText = 'display:inline-flex;gap:3px;flex-shrink:0;';

    const autoBtn = document.createElement('button');
    autoBtn.type = 'button';
    autoBtn.className = `geofs-ext-chk-btn ${this.autoAdvance ? 'is-active' : ''}`;
    autoBtn.textContent = 'AUTO';
    autoBtn.title = 'Auto-advance through mandatory phases';
    autoBtn.addEventListener('click', () => {
      this.autoAdvance = !this.autoAdvance;
      this.ctx?.updateSettings({ checklistAutoAdvance: this.autoAdvance });
      this.lastRender = '';
    });

    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';
    guideBtn.className = `geofs-ext-chk-btn ${this.showGuide ? 'is-active' : ''}`;
    guideBtn.textContent = 'GUIDE';
    guideBtn.title = 'Toggle Situational Procedure Guide';
    guideBtn.addEventListener('click', () => {
      this.showGuide = !this.showGuide;
      this.lastRender = '';
    });

    const rstBtn = document.createElement('button');
    rstBtn.type = 'button';
    rstBtn.className = 'geofs-ext-chk-btn';
    rstBtn.textContent = 'RST';
    rstBtn.title = 'Reset All Checklist Items';
    rstBtn.addEventListener('click', () => {
      this.manualDone.clear();
      this.lastRender = '';
    });

    btnGroup.append(autoBtn, guideBtn, rstBtn);
    topBar.append(acLabel, btnGroup);
    this.rootEl.appendChild(topBar);

    // Phase selector pills (Mandatory 4 gates + dynamic QRH pills)
    const phaseBar = document.createElement('div');
    phaseBar.className = 'geofs-ext-chk-phases';
    this.phaseTitles.forEach((label, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isEmg = idx >= mandatory.length;
      btn.className = `geofs-ext-chk-phase ${!this.showGuide && idx === this.activePhase ? 'is-active' : ''} ${isEmg ? 'is-emergency' : ''}`;
      btn.textContent = label;
      btn.title = label;
      btn.addEventListener('click', () => {
        this.showGuide = false;
        this.activePhase = idx;
        this.lastRender = '';
      });
      phaseBar.appendChild(btn);
    });
    this.rootEl.appendChild(phaseBar);

    if (speeds) {
      const speedBanner = document.createElement('div');
      speedBanner.style.cssText = 'font-size:9px;color:#aaaaaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      speedBanner.textContent = speeds;
      speedBanner.title = speeds;
      this.rootEl.appendChild(speedBanner);
    }

    if (activeEmergency && !this.showGuide) {
      const qrhHeader = document.createElement('div');
      qrhHeader.style.cssText = 'padding:5px 7px;border-radius:6px;background:rgba(239,68,68,0.18);border:1px solid #ef4444;display:flex;flex-direction:column;gap:5px;';
      const qrhTitle = document.createElement('div');
      qrhTitle.style.cssText = 'font-size:10px;font-weight:700;color:#fca5a5;';
      qrhTitle.textContent = activeEmergency.contingency
        ? `CONTINGENCY SOLUTION: ${activeEmergency.procedure.title}`
        : `EMERGENCY QRH: ${activeEmergency.procedure.title}`;
      qrhHeader.appendChild(qrhTitle);

      if (activeEmergency.recoverable) {
        const recoverBtn = document.createElement('button');
        recoverBtn.type = 'button';
        recoverBtn.className = 'geofs-ext-chk-recovery';
        recoverBtn.textContent = 'ATTEMPT RECOVERY';
        recoverBtn.addEventListener('click', () => {
          this.ctx?.emitEvent('failure:attempt-recovery', { type: activeEmergency.type });
        });
        qrhHeader.appendChild(recoverBtn);
      }
      this.rootEl.appendChild(qrhHeader);
    }

    if (this.showGuide) {
      const guideBox = document.createElement('div');
      guideBox.style.cssText = 'display:flex;flex-direction:column;gap:4px;';
      const guideHeading = document.createElement('div');
      guideHeading.style.cssText = 'font-size:9.5px;font-weight:700;color:#4caf50;text-transform:uppercase;letter-spacing:0.4px;';
      guideHeading.textContent = 'Situational Procedures Guide';
      guideBox.appendChild(guideHeading);

      const detailEls: HTMLDetailsElement[] = [];
      for (const guide of SITUATIONAL_GUIDES) {
        const det = document.createElement('details');
        det.style.cssText = 'background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.25);border-radius:6px;padding:4px 6px;';
        const sum = document.createElement('summary');
        sum.style.cssText = 'font-size:10px;font-weight:700;color:#ffffff;cursor:grab;';
        sum.textContent = guide.title;
        det.appendChild(sum);
        const ul = document.createElement('ul');
        ul.style.cssText = 'margin:4px 0 2px 14px;padding:0;font-size:9px;color:#cccccc;line-height:1.3;';
        for (const step of guide.steps) {
          const li = document.createElement('li');
          li.textContent = step;
          ul.appendChild(li);
        }
        det.appendChild(ul);
        det.addEventListener('toggle', () => {
          if (det.open) {
            for (const other of detailEls) {
              if (other !== det && other.open) other.open = false;
            }
          }
        });
        detailEls.push(det);
        guideBox.appendChild(det);
      }
      this.rootEl.appendChild(guideBox);
      return;
    }

    for (const entry of items) {
      const row = document.createElement('div');
      row.className = `geofs-ext-chk-item ${entry.checked ? 'is-done' : ''}`;
      row.setAttribute('role', 'checkbox');
      row.setAttribute('aria-checked', String(entry.checked));
      row.tabIndex = 0;

      const box = document.createElement('span');
      box.className = 'geofs-ext-chk-box';
      box.textContent = entry.checked ? '✓' : '';

      const textCol = document.createElement('div');
      textCol.style.cssText = 'flex:1;min-width:0;';

      const titleRow = document.createElement('div');
      titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:10.5px;font-weight:700;color:#ffffff;';
      const itemText = document.createElement('span');
      itemText.textContent = entry.item.text;
      if (entry.checked) itemText.style.textDecoration = 'line-through';
      titleRow.appendChild(itemText);

      if (entry.item.sync) {
        const badge = document.createElement('span');
        badge.style.cssText = 'font-size:9px;flex-shrink:0;color:' + (entry.hardware ? '#facc15' : '#38bdf8') + ';';
        badge.textContent = entry.hardware ? '⚡' : '⏱';
        badge.title = entry.hardware ? 'Click to execute simulator control' : 'Auto-verified by live flight telemetry';
        titleRow.appendChild(badge);
      }

      const desc = document.createElement('div');
      desc.style.cssText = 'font-size:8.5px;font-style:italic;color:#aaaaaa;margin-top:1px;line-height:1.25;';
      desc.textContent = entry.item.desc;

      textCol.append(titleRow, desc);
      row.append(box, textCol);

      const handleActivate = () => {
        if (entry.hardware && this.lastTelemetry && this.ctx) {
          const actuated = executeChecklistHardwareAction(entry.item.sync, this.lastTelemetry, ac, this.ctx);
          if (!actuated && !entry.autoDone) {
            this.ctx.anchors.showToast('Control unavailable — toggle manually in GeoFS', 'warn');
          }
          this.manualDone.delete(entry.id);
          this.lastRender = '';
          return;
        }
        if (this.manualDone.has(entry.id)) {
          this.manualDone.delete(entry.id);
        } else {
          this.manualDone.add(entry.id);
        }
        this.lastRender = '';
      };

      row.addEventListener('click', handleActivate);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate();
        }
      });

      this.rootEl.appendChild(row);
    }
  }

  public destroy(): void {
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.rootEl = null;
    this.lastRender = '';
    this.lastEmittedPhase = '';
    this.lastAircraftKey = '';
    this.lastTelemetry = null;
    this.manualDone.clear();
    this.emergencies.clear();
    this.activePhase = 0;
    this.phaseTitles = [];
    this.ctx = null;
  }
}
