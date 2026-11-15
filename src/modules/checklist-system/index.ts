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

function getPhaseChecklist(category: AircraftCategory, phase: ChecklistPhase): ChecklistItem[] {
  if (category === 'rotorcraft') {
    if (phase === 'emergency') {
      return [
        { id: 'heli-em-coll', label: 'Collective LOWER (Autorotation)', autoCheck: (t) => t.collectivePct <= 25 },
        { id: 'heli-em-spd', label: 'Best Glide / Auto 60-80 KTS', autoCheck: (t) => t.kias >= 55 && t.kias <= 85 },
        { id: 'heli-em-flare', label: 'Flare & Level Before Touchdown', autoCheck: (t) => t.aglFeet < 50 && Math.abs(t.roll) < 8 }
      ];
    }
    if (phase === 'taxi' || phase === 'takeoff') {
      return [
        { id: 'heli-to-coll', label: 'Collective RAISE Smoothly', autoCheck: (t) => t.collectivePct > 45 },
        { id: 'heli-to-hover', label: 'Hover Check (5-15 ft AGL)', autoCheck: (t) => !t.groundContact && t.aglFeet >= 3 },
        { id: 'heli-to-etl', label: 'Effective Translational Lift > 20 KTS', autoCheck: (t) => t.kias >= 20 }
      ];
    }
    if (phase === 'climb' || phase === 'cruise') {
      return [
        { id: 'heli-crz-trq', label: 'Torque Within Green (< 95%)', autoCheck: (t) => t.torquePct <= 95 },
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
        { id: 'heli-sdn-coll', label: 'Collective FULL DOWN', autoCheck: (t) => t.collectivePct <= 5 },
        { id: 'heli-sdn-gnd', label: 'Skids / Gear Grounded', autoCheck: (t) => t.groundContact }
      ];
    }
    return [
      { id: 'heli-pre-coll', label: 'Collective FULL DOWN', autoCheck: (t) => t.collectivePct <= 10 },
      { id: 'heli-pre-lights', label: 'Anti-Collision / Nav Lights ON', autoCheck: (t) => t.lightsOn },
      { id: 'heli-pre-ground', label: 'Skids / Gear Level On Ground', autoCheck: (t) => t.groundContact }
    ];
  }

  if (phase === 'emergency') {
    return [
      { id: 'em-thr', label: 'Thrust / Mixture VERIFY', autoCheck: (t) => (t.throttles[0] ?? 0) <= 0.5 },
      { id: 'em-spd', label: 'Best Glide / Safe Airspeed', autoCheck: (t) => t.kias > 70 && t.kias < 260 },
      { id: 'em-gear', label: 'Landing Gear AS REQUIRED', autoCheck: (t) => t.gearDown }
    ];
  }
  if (phase === 'taxi') {
    return [
      { id: 'tx-brk', label: 'Parking Brake RELEASED', autoCheck: (t) => !t.parkingBrake },
      { id: 'tx-spd', label: 'Taxi Speed < 25 KTS', autoCheck: (t) => t.groundSpeed < 25 },
      { id: 'tx-flaps', label: 'Takeoff Flaps PRESET', autoCheck: (t) => category === 'supersonic' || t.flapsTarget >= 1 }
    ];
  }
  if (phase === 'climb') {
    return [
      { id: 'clb-gear', label: 'Landing Gear UP', autoCheck: (t) => !t.gearDown },
      { id: 'clb-flaps', label: 'Flaps RETRACTED (0)', autoCheck: (t) => t.flapsTarget === 0 },
      { id: 'clb-vs', label: 'Positive Climb Rate', autoCheck: (t) => t.vs > 200 }
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
  if (phase === 'landing') {
    return [
      { id: 'ldg-gear', label: 'Gear DOWN Three Green', autoCheck: (t) => t.gearDown },
      { id: 'ldg-flaps', label: 'Full Landing Flaps', autoCheck: (t) => t.flapsTarget >= 1 },
      { id: 'ldg-thr', label: 'Throttle IDLE On Touchdown', autoCheck: (t) => t.groundContact && (t.throttles[0] ?? 0) <= 0.1 }
    ];
  }
  if (phase === 'shutdown') {
    return [
      { id: 'sdn-brk', label: 'Parking Brake SET', autoCheck: (t) => t.parkingBrake },
      { id: 'sdn-thr', label: 'Throttles CUTOFF / IDLE', autoCheck: (t) => (t.throttles[0] ?? 0) <= 0.05 },
      { id: 'sdn-lights', label: 'Landing Lights OFF', autoCheck: (t) => !t.lightsOn }
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
  public readonly description = '9-phase aircraft-category checklists with live switch verification.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private rootEl: HTMLDivElement | null = null;
  private unmounts: Array<() => void> = [];
  private activePhase: ChecklistPhase = 'preflight';
  private lastCategory: AircraftCategory | null = null;
  private manualDone = new Set<string>();

  public init(context: ModuleContext): void {
    this.ctx = context;
    const root = document.createElement('div');
    this.rootEl = root;
    this.unmounts.push(context.anchors.registerHudTab('chk', 'CHK', root));

    const cyclePhase = () => {
      const phases = Object.keys(PHASE_LABELS) as ChecklistPhase[];
      const nextIdx = (phases.indexOf(this.activePhase) + 1) % phases.length;
      this.activePhase = phases[nextIdx];
      context.anchors.showToast(`Checklist Phase: ${PHASE_LABELS[this.activePhase]}`);
    };

    const rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'geofs-ext-pad';
    rightBtn.textContent = 'CHK';
    rightBtn.addEventListener('click', cyclePhase);
    this.unmounts.push(context.anchors.mountControl('checklist-right-pad', 'right', rightBtn));

    const combo = context.getSettings().keybindings.toggleChecklist;
    this.unmounts.push(context.keybinds.register('checklist-cycle', combo, cyclePhase));
  }

  public onSettingsChange(settings: import('../../types/settings').ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('checklist-cycle', settings.keybindings.toggleChecklist);
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.rootEl || !telemetry.aircraft) return;
    const cat = telemetry.aircraft.category;
    if (cat !== this.lastCategory) {
      this.lastCategory = cat;
      this.manualDone.clear();
    }

    const items = getPhaseChecklist(cat, this.activePhase);
    this.rootEl.innerHTML = '';

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

    for (const item of items) {
      const checked = this.manualDone.has(item.id) || Boolean(item.autoCheck?.(telemetry));
      const row = document.createElement('label');
      row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;cursor:pointer;font-size:11px;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = checked;
      cb.addEventListener('change', () => {
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
    this.manualDone.clear();
  }
}
