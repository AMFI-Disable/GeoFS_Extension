import type { AircraftCategory, FlightTelemetry, IModule, ModuleContext } from '../../types/module';

interface ChecklistItem {
  id: string;
  label: string;
  autoCheck?: (t: FlightTelemetry) => boolean;
}

const CHECKLISTS_BY_CATEGORY: Record<AircraftCategory, ChecklistItem[]> = {
  'ga-piston': [
    { id: 'brk', label: 'Parking Brake SET', autoCheck: (t) => t.parkingBrake },
    { id: 'flaps', label: 'Flaps SET for Takeoff', autoCheck: (t) => t.flapsTarget >= 1 },
    { id: 'lights', label: 'Nav / Strobe Lights ON', autoCheck: (t) => t.lightsOn },
    { id: 'thr', label: 'Full Power Verified', autoCheck: (t) => (t.throttles[0] ?? 0) > 0.85 }
  ],
  'turboprop': [
    { id: 'brk', label: 'Parking Brake SET', autoCheck: (t) => t.parkingBrake },
    { id: 'flaps', label: 'Flaps Approach/TO', autoCheck: (t) => t.flapsTarget >= 1 },
    { id: 'gear', label: 'Gear Down & Locked', autoCheck: (t) => t.gearDown },
    { id: 'lights', label: 'Landing Lights ON', autoCheck: (t) => t.lightsOn }
  ],
  'airliner-twin': [
    { id: 'brk', label: 'Parking Brake SET', autoCheck: (t) => t.parkingBrake },
    { id: 'flaps', label: 'Takeoff Flaps CONFIG', autoCheck: (t) => t.flapsTarget >= 1 },
    { id: 'lights', label: 'Exterior Lights ON', autoCheck: (t) => t.lightsOn },
    { id: 'gear', label: 'Gear UP After Positive Climb', autoCheck: (t) => !t.groundContact && !t.gearDown }
  ],
  'airliner-quad': [
    { id: 'brk', label: 'Parking Brake SET', autoCheck: (t) => t.parkingBrake },
    { id: 'flaps', label: 'Flaps 10/20 SET', autoCheck: (t) => t.flapsTarget >= 2 },
    { id: 'lights', label: 'Strobes & Taxi ON', autoCheck: (t) => t.lightsOn },
    { id: 'gear', label: '4-Engine Symmetry & Gear UP', autoCheck: (t) => !t.groundContact && !t.gearDown }
  ],
  'fighter': [
    { id: 'brk', label: 'Wheel Chocks / Brake SET', autoCheck: (t) => t.parkingBrake },
    { id: 'lights', label: 'Anti-Collision ON', autoCheck: (t) => t.lightsOn },
    { id: 'ab', label: 'Afterburner / MIL Power', autoCheck: (t) => (t.throttles[0] ?? 0) > 0.9 },
    { id: 'gear', label: 'Gear UP < 250 KTS', autoCheck: (t) => !t.groundContact && !t.gearDown }
  ],
  'supersonic': [
    { id: 'brk', label: 'Brakes SET', autoCheck: (t) => t.parkingBrake },
    { id: 'lights', label: 'Landing Lights ON', autoCheck: (t) => t.lightsOn },
    { id: 'ab', label: 'Reheat Takeoff Power', autoCheck: (t) => (t.throttles[0] ?? 0) > 0.9 },
    { id: 'gear', label: 'Gear UP Positive Climb', autoCheck: (t) => !t.groundContact && !t.gearDown }
  ],
  'specialized': [
    { id: 'lights', label: 'Tracking Beacons ON', autoCheck: (t) => t.lightsOn },
    { id: 'gear', label: 'Gear Status Verified', autoCheck: (t) => t.gearDown || !t.groundContact }
  ]
};

export class ChecklistSystemModule implements IModule {
  public readonly id = 'checklist-system';
  public readonly name = 'Checklist System';
  public readonly description = 'Aircraft-category-aware checklists with live switch verification.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private rootEl: HTMLDivElement | null = null;
  private unmountTab: (() => void) | null = null;
  private lastCategory: AircraftCategory | null = null;
  private manualDone = new Set<string>();

  public init(context: ModuleContext): void {
    const root = document.createElement('div');
    this.rootEl = root;
    this.unmountTab = context.anchors.registerHudTab('chk', 'CHK', root);
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.rootEl || !telemetry.aircraft) return;
    const cat = telemetry.aircraft.category;
    if (cat !== this.lastCategory) {
      this.lastCategory = cat;
      this.manualDone.clear();
    }

    const items = CHECKLISTS_BY_CATEGORY[cat] || CHECKLISTS_BY_CATEGORY['ga-piston'];
    this.rootEl.innerHTML = '';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight:700;margin-bottom:6px;text-transform:uppercase;font-size:10px;';
    title.textContent = `${telemetry.aircraft.name} • ${cat}`;
    this.rootEl.appendChild(title);

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
    this.unmountTab?.();
    this.unmountTab = null;
    this.rootEl = null;
    this.manualDone.clear();
  }
}
