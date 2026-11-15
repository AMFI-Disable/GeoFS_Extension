import { ARCHIVED_PROCEDURES, type ChecklistProcedure } from './procedures';
import { formatVSpeeds } from '../../core/aircraft-profile';
import type { AircraftCategory, FlightTelemetry, IModule, ModuleContext } from '../../types/module';

type ChecklistPhase =
  | 'preflight'
  | 'taxi'
  | 'takeoff'
  | 'climb'
  | 'cruise'
  | 'approach'
  | 'landing'
  | 'shutdown'
  | 'emergency';

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  autoCheck?: (t: FlightTelemetry) => boolean;
}

const PHASE_LABELS: Record<ChecklistPhase, string> = {
  preflight: 'PRE',
  taxi: 'TAXI',
  takeoff: 'T/O',
  climb: 'CLB',
  cruise: 'CRZ',
  approach: 'APP',
  landing: 'LDG',
  shutdown: 'SDN',
  emergency: 'EMERG'
};

const ROTORCRAFT_CHECKLISTS: Partial<Record<ChecklistPhase, ChecklistItem[]>> = {
  preflight: [
    { id: 'rotor-clear', label: 'Rotor And Tail Area Clear' },
    { id: 'collective-low', label: 'Collective Fully Lowered', autoCheck: (t) => t.collective !== null && t.collective <= 0.05 },
    { id: 'flight-controls', label: 'Cyclic And Anti-Torque Controls Checked' }
  ],
  takeoff: [
    { id: 'takeoff-clear', label: 'Departure Path Clear' },
    { id: 'hover', label: 'Hover And Control Response Checked' }
  ],
  cruise: [
    { id: 'cruise-rotor', label: 'Rotor RPM And Power Checked' },
    { id: 'cruise-trim', label: 'Airspeed And Flight Path Confirmed' }
  ],
  approach: [
    { id: 'landing-zone', label: 'Landing Zone And Escape Path Clear' },
    { id: 'approach-power', label: 'Approach Power And Descent Checked' }
  ],
  emergency: [
    { id: 'emergency-rotor', label: 'Rotor RPM Checked' },
    { id: 'emergency-zone', label: 'Landing Site Identified' },
    { id: 'emergency-procedure', label: 'Aircraft Emergency Procedure Reviewed' }
  ]
};

function getPhaseChecklist(category: AircraftCategory, phase: ChecklistPhase): ChecklistItem[] {
  if (category === 'rotorcraft' && ROTORCRAFT_CHECKLISTS[phase]) {
    return ROTORCRAFT_CHECKLISTS[phase]!;
  }
  if (category === 'rotorcraft') {
    if (phase === 'emergency') {
      return [
        { id: 'heli-em-coll', label: 'Collective LOWER (Autorotation)', autoCheck: (t) => t.collective !== null && t.collective * 100 <= 25 },
        { id: 'heli-em-spd', label: 'Best Glide / Auto 60-80 KTS', autoCheck: (t) => t.kias >= 55 && t.kias <= 85 },
        { id: 'heli-em-flare', label: 'Flare & Level Before Touchdown', autoCheck: (t) => t.aglFeet < 50 && Math.abs(t.roll) < 8 }
      ];
    }
    if (phase === 'taxi' || phase === 'takeoff') {
      return [
        { id: 'heli-to-coll', label: 'Collective RAISE Smoothly', autoCheck: (t) => t.collective !== null && t.collective * 100 > 45 },
        { id: 'heli-to-hover', label: 'Hover Check (5-15 ft AGL)', autoCheck: (t) => !t.groundContact && t.aglFeet >= 3 },
        { id: 'heli-to-etl', label: 'Effective Translational Lift > 20 KTS', autoCheck: (t) => t.kias >= 20 }
      ];
    }
    if (phase === 'climb' || phase === 'cruise') {
      return [
        { id: 'heli-crz-trq', label: 'Torque Within Operating Limits' },
        { id: 'heli-crz-alt', label: 'Cruise Altitude Stabilized', autoCheck: (t) => Math.abs(t.vs) < 250 }
      ];
    }
    if (phase === 'approach' || phase === 'landing') {
      return [
        { id: 'heli-app-spd', label: 'Approach Decel < 70 KTS', autoCheck: (t) => t.kias < 70 },
        { id: 'heli-app-lights', label: 'Landing Light ON', autoCheck: (t) => t.lightsOn },
        { id: 'heli-app-hover', label: 'Stabilized Hover < 15 ft AGL', autoCheck: (t) => t.aglFeet <= 15 && t.kias < 15 }
      ];
    }
    if (phase === 'shutdown') {
      return [
        { id: 'heli-sdn-coll', label: 'Collective FULL DOWN', autoCheck: (t) => t.collective !== null && t.collective * 100 <= 5 },
        { id: 'heli-sdn-gnd', label: 'Skids / Gear Grounded', autoCheck: (t) => t.groundContact }
      ];
    }
    return [
      { id: 'heli-pre-coll', label: 'Collective FULL DOWN', autoCheck: (t) => t.collective !== null && t.collective * 100 <= 10 },
      { id: 'heli-pre-lights', label: 'Anti-Collision / Nav Lights ON', autoCheck: (t) => t.lightsOn },
      { id: 'heli-pre-ground', label: 'Skids / Gear Level On Ground', autoCheck: (t) => t.groundContact }
    ];
  }

  return [];
}

function aircraftProcedures(name: string): ChecklistProcedure[] {
  const match = Object.keys(ARCHIVED_PROCEDURES).find((key) => name.toLowerCase().includes(key));
  return ARCHIVED_PROCEDURES[match ?? 'generic'];
}

function isProcedureItemComplete(sync: string | undefined, telemetry: FlightTelemetry): boolean {
  if (sync === 'parkingBrake') return telemetry.parkingBrake;
  if (sync === 'airbrakes') return (telemetry.airbrakesPosition ?? 0) > 0;
  if (sync === 'flaps') return telemetry.flapsTarget > 0;
  if (sync === 'flaps:full') return telemetry.flapsTarget === telemetry.aircraft?.maxFlaps;
  if (sync?.startsWith('flaps:')) return telemetry.flapsTarget === Number(sync.slice(6));
  return false;
}

export class ChecklistSystemModule implements IModule {
  public readonly id = 'checklist-system';
  public readonly name = 'Checklist System';
  public readonly description = '9-phase aircraft-category checklists with live switch verification.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private rootEl: HTMLDivElement | null = null;
  private unmounts: Array<() => void> = [];
  private activePhase = 0;
  private phaseTitles: string[] = [];
  private emergencies = new Map<string, ChecklistProcedure>();
  private lastAircraftKey = '';
  private lastRender = '';
  private manualDone = new Set<string>();

  public init(context: ModuleContext): void {
    this.ctx = context;
    const root = document.createElement('div');
    this.rootEl = root;
    this.unmounts.push(context.anchors.registerHudTab('chk', 'CHK', root));

    const cyclePhase = () => {
      if (!this.phaseTitles.length) return;
      this.activePhase = (this.activePhase + 1) % this.phaseTitles.length;
      context.anchors.openHudTab('chk');
      context.anchors.showToast(`Checklist Phase: ${this.phaseTitles[this.activePhase]}`);
    };

    const rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'geofs-ext-pad';
    rightBtn.textContent = 'CHK';
    rightBtn.addEventListener('click', cyclePhase);
    this.unmounts.push(context.anchors.mountControl('checklist-right-pad', 'right', rightBtn));

    const combo = context.getSettings().keybindings.toggleChecklist;
    this.unmounts.push(context.keybinds.register('checklist-cycle', combo, cyclePhase));
    this.unmounts.push(context.onEvent<{ type: string; procedure?: ChecklistProcedure }>('failure:triggered', ({ type, procedure }) => {
      if (!procedure) return;
      this.emergencies.set(type, procedure);
      context.anchors.openHudTab('chk');
    }));
    this.unmounts.push(context.onEvent<{ type: string }>('failure:cleared', ({ type }) => {
      this.emergencies.delete(type);
    }));
    context.emitEvent('failure:request-active');
  }

  public onSettingsChange(settings: import('../../types/settings').ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('checklist-cycle', settings.keybindings.toggleChecklist);
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.rootEl) return;
    if (!telemetry.aircraft) {
      if (this.lastRender) this.rootEl.replaceChildren();
      this.lastRender = '';
      this.lastAircraftKey = '';
      return;
    }
    const cat = telemetry.aircraft.category;
    const key = JSON.stringify([telemetry.aircraft.id, cat]);
    if (key !== this.lastAircraftKey) {
      this.lastAircraftKey = key;
      this.manualDone.clear();
      this.activePhase = 0;
      this.emergencies.clear();
    }

    const rotorPhases = Object.keys(PHASE_LABELS) as ChecklistPhase[];
    const procedures = cat === 'rotorcraft' ? [] : aircraftProcedures(telemetry.aircraft.name);
    const emergencies = [...this.emergencies.entries()];
    const normalTitles = cat === 'rotorcraft' ? rotorPhases.map((phase) => PHASE_LABELS[phase]) : procedures.map(({ title }) => title);
    this.phaseTitles = [...normalTitles, ...emergencies.map(([, { title }]) => title)];
    if (this.activePhase >= this.phaseTitles.length) this.activePhase = 0;
    const emergency = emergencies[this.activePhase - normalTitles.length];
    const procedure = emergency?.[1] ?? procedures[this.activePhase];
    const source: ChecklistItem[] = procedure ? procedure.items.map((item, index) => ({
      id: `${emergency?.[0] ?? this.activePhase}-${index}`, label: item.text, description: item.desc,
      autoCheck: (snapshot) => isProcedureItemComplete(item.sync, snapshot)
    })) : getPhaseChecklist(cat, rotorPhases[this.activePhase]);
    const items = source.map((item) => ({
      ...item,
      checked: this.manualDone.has(item.id) || Boolean(item.autoCheck?.(telemetry))
    }));
    const speeds = formatVSpeeds(telemetry.aircraft.vSpeeds, telemetry.aircraft.machSpeeds);
    const render = JSON.stringify([key, telemetry.aircraft.name, this.activePhase, this.phaseTitles, speeds, items.map((item) => [item.id, item.checked])]);
    if (render === this.lastRender) return;
    this.lastRender = render;
    this.rootEl.replaceChildren();

    const title = document.createElement('div');
    title.style.cssText = 'font-weight:700;margin-bottom:6px;text-transform:uppercase;font-size:10px;';
    title.textContent = `${telemetry.aircraft.name} • ${cat}`;
    this.rootEl.appendChild(title);

    const phaseBar = document.createElement('div');
    phaseBar.style.cssText = 'display:flex;gap:3px;margin-bottom:6px;flex-wrap:wrap;';
    this.phaseTitles.forEach((phaseTitle, p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `geofs-ext-hud-tab ${this.activePhase === p ? 'is-active' : ''}`;
      btn.textContent = phaseTitle;
      btn.addEventListener('click', () => {
        this.activePhase = p;
      });
      phaseBar.appendChild(btn);
    });
    this.rootEl.appendChild(phaseBar);

    const speedCard = document.createElement('div');
    speedCard.style.cssText = 'margin-bottom:6px;font-size:10px;';
    speedCard.textContent = speeds;
    this.rootEl.appendChild(speedCard);

    for (const item of items) {
      const { checked } = item;
      const row = document.createElement('label');
      row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;cursor:pointer;font-size:11px;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = checked;
      cb.addEventListener('change', () => {
        this.lastRender = '';
        if (cb.checked) this.manualDone.add(item.id);
        else this.manualDone.delete(item.id);
      });
      const span = document.createElement('span');
      span.textContent = item.label;
      if (item.description) span.title = item.description;
      if (checked) span.style.textDecoration = 'line-through';
      row.append(cb, span);
      this.rootEl.appendChild(row);
    }
  }

  public destroy(): void {
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.rootEl = null;
    this.lastRender = '';
    this.lastAircraftKey = '';
    this.manualDone.clear();
    this.emergencies.clear();
    this.activePhase = 0;
    this.phaseTitles = [];
  }
}
