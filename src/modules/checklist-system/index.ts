import { formatVSpeeds } from '../../core/aircraft-profile';
import type { AircraftCategory, FlightTelemetry, IModule, ModuleContext } from '../../types/module';

type ChecklistPhase = 'preflight' | 'takeoff' | 'cruise' | 'approach' | 'emergency';

interface ChecklistItem {
  id: string;
  label: string;
  autoCheck?: (t: FlightTelemetry) => boolean;
}

const PHASE_LABELS: Record<ChecklistPhase, string> = {
  preflight: 'PRE',
  takeoff: 'T/O',
  cruise: 'CRZ',
  approach: 'APP',
  emergency: 'EMERG'
};

const ROTORCRAFT_CHECKLISTS: Record<ChecklistPhase, ChecklistItem[]> = {
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
  if (category === 'rotorcraft') return ROTORCRAFT_CHECKLISTS[phase];
  if (phase === 'emergency') {
    return [
      { id: 'em-thr', label: 'Thrust / Mixture VERIFY', autoCheck: (t) => (t.throttles[0] ?? 0) <= 0.5 },
      { id: 'em-spd', label: 'Best Glide / Safe Airspeed', autoCheck: (t) => t.kias > 70 && t.kias < 260 },
      { id: 'em-gear', label: 'Landing Gear AS REQUIRED', autoCheck: (t) => t.gearDown }
    ];
  }
  if (phase === 'cruise') {
    return [
      { id: 'crz-gear', label: 'Landing Gear UP', autoCheck: (t) => !t.gearDown },
      { id: 'crz-flaps', label: 'Flaps RETRACTED (0)', autoCheck: (t) => t.flapsTarget === 0 },
      { id: 'crz-alt', label: 'Cruise Altitude Established', autoCheck: (t) => Math.abs(t.vs) < 300 }
    ];
  }
  if (phase === 'approach') {
    return [
      { id: 'app-spd', label: 'Approach Speed < 210 KTS', autoCheck: (t) => t.kias < 210 },
      { id: 'app-flaps', label: 'Landing Flaps CONFIG', autoCheck: (t) => t.flapsTarget >= 1 },
      { id: 'app-gear', label: 'Landing Gear DOWN & LOCKED', autoCheck: (t) => t.gearDown },
      { id: 'app-lights', label: 'Landing Lights ON', autoCheck: (t) => t.lightsOn }
    ];
  }
  if (phase === 'takeoff') {
    return [
      { id: 'to-brk', label: 'Parking Brake RELEASED', autoCheck: (t) => !t.parkingBrake },
      { id: 'to-flaps', label: 'Takeoff Flaps SET', autoCheck: (t) => category === 'supersonic' || t.flapsTarget >= 1 },
      { id: 'to-thr', label: 'Takeoff Power SET', autoCheck: (t) => (t.throttles[0] ?? 0) > 0.8 },
      { id: 'to-gear', label: 'Positive Climb → Gear UP', autoCheck: (t) => !t.groundContact && !t.gearDown }
    ];
  }

  // preflight
  const base: ChecklistItem[] = [
    { id: 'pre-brk', label: 'Parking Brake SET', autoCheck: (t) => t.parkingBrake },
    { id: 'pre-lights', label: 'Beacon / Nav Lights ON', autoCheck: (t) => t.lightsOn }
  ];
  if (category === 'airliner-twin' || category === 'airliner-quad') {
    base.push({ id: 'pre-flaps', label: 'Verify Flap Detents Free', autoCheck: (t) => t.flapsTarget >= 0 });
  } else if (category === 'fighter' || category === 'supersonic') {
    base.push({ id: 'pre-canopy', label: 'Ejection / Flight Controls CHECK', autoCheck: (t) => t.groundContact });
  }
  return base;
}

export class ChecklistSystemModule implements IModule {
  public readonly id = 'checklist-system';
  public readonly name = 'Checklist System';
  public readonly description = 'Aircraft-category and flight-phase checklists with live switch verification.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private rootEl: HTMLDivElement | null = null;
  private unmounts: Array<() => void> = [];
  private activePhase: ChecklistPhase = 'preflight';
  private lastAircraftKey = '';
  private lastRender = '';
  private manualDone = new Set<string>();

  public init(context: ModuleContext): void {
    const root = document.createElement('div');
    this.rootEl = root;
    this.unmounts.push(context.anchors.registerHudTab('chk', 'CHK', root));

    const rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'geofs-ext-pad';
    rightBtn.textContent = 'CHK';
    rightBtn.addEventListener('click', () => {
      const phases: ChecklistPhase[] = ['preflight', 'takeoff', 'cruise', 'approach', 'emergency'];
      const nextIdx = (phases.indexOf(this.activePhase) + 1) % phases.length;
      this.activePhase = phases[nextIdx];
      context.anchors.showToast(`Checklist Phase: ${PHASE_LABELS[this.activePhase]}`);
    });
    this.unmounts.push(context.anchors.mountControl('checklist-right-pad', 'right', rightBtn));
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
    }

    const items = getPhaseChecklist(cat, this.activePhase).map((item) => ({
      ...item,
      checked: this.manualDone.has(item.id) || Boolean(item.autoCheck?.(telemetry))
    }));
    const speeds = formatVSpeeds(telemetry.aircraft.vSpeeds, telemetry.aircraft.machSpeeds);
    const render = JSON.stringify([key, telemetry.aircraft.name, this.activePhase, speeds, items.map((item) => item.checked)]);
    if (render === this.lastRender) return;
    this.lastRender = render;
    this.rootEl.replaceChildren();

    const title = document.createElement('div');
    title.style.cssText = 'font-weight:700;margin-bottom:6px;text-transform:uppercase;font-size:10px;';
    title.textContent = `${telemetry.aircraft.name} • ${cat}`;
    this.rootEl.appendChild(title);

    const phaseBar = document.createElement('div');
    phaseBar.style.cssText = 'display:flex;gap:3px;margin-bottom:6px;flex-wrap:wrap;';
    (Object.keys(PHASE_LABELS) as ChecklistPhase[]).forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `geofs-ext-hud-tab ${this.activePhase === p ? 'is-active' : ''}`;
      btn.textContent = PHASE_LABELS[p];
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
  }
}
