/**
 * Gate Spawner Module
 * Ported from machpoint82/geofs-gate-spawner (MIT License).
 * Loads airport gate/stand coordinates on demand and places the aircraft parked at a gate.
 */
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export const GATES_DB_URL =
  'https://raw.githubusercontent.com/machpoint82/geofs-gate-spawner/refs/heads/main/gates.json';

export interface GateEntry {
  name?: string;
  ref?: string;
  lat: number;
  lon: number;
  heading: number;
  width_code?: string;
  airplane_types?: string[];
  operation_type?: string;
}

export type GatesDatabase = Record<string, GateEntry[]>;

export interface GateFilter {
  key: 'codeF' | 'codeE' | 'heavy' | 'cargo' | 'ga';
  label: string;
  test: (g: GateEntry) => boolean;
}

export const GATE_FILTERS: readonly GateFilter[] = [
  { key: 'codeF', label: 'Code F', test: (g) => g.width_code === 'F' },
  { key: 'codeE', label: 'Code E', test: (g) => g.width_code === 'E' },
  { key: 'heavy', label: 'Heavy', test: (g) => Array.isArray(g.airplane_types) && g.airplane_types.includes('heavy') },
  { key: 'cargo', label: 'Cargo', test: (g) => g.operation_type === 'cargo' },
  { key: 'ga', label: 'GA', test: (g) => g.operation_type === 'general_aviation' }
];

export function destinationPoint(
  latDeg: number,
  lonDeg: number,
  bearingDeg: number,
  distM: number
): { lat: number; lon: number } {
  const R = 6371000;
  const lat1 = (latDeg * Math.PI) / 180;
  const lon1 = (lonDeg * Math.PI) / 180;
  const brng = (bearingDeg * Math.PI) / 180;
  const dR = distM / R;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dR) + Math.cos(lat1) * Math.sin(dR) * Math.cos(brng)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(dR) * Math.cos(lat1),
      Math.cos(dR) - Math.sin(lat1) * Math.sin(lat2)
    );
  return { lat: (lat2 * 180) / Math.PI, lon: (lon2 * 180) / Math.PI };
}

export function gateLabel(gate: GateEntry): string {
  return String(gate.ref || gate.name || `${gate.lat.toFixed(4)},${gate.lon.toFixed(4)}`);
}

export function filterGates(
  gates: GateEntry[],
  search: string,
  activeFilters: Set<GateFilter['key']>
): GateEntry[] {
  const q = search.trim().toLowerCase();
  return gates.filter((g) => {
    if (q && !gateLabel(g).toLowerCase().includes(q)) return false;
    for (const f of GATE_FILTERS) {
      if (activeFilters.has(f.key) && !f.test(g)) return false;
    }
    return true;
  });
}

export function spawnAtGate(gate: GateEntry): boolean {
  const ac = window.geofs?.aircraft?.instance as (Record<string, unknown> & {
    place?: (lla: [number, number, number], htr: [number, number, number]) => void;
    rigidBody?: Record<string, unknown>;
    groundContact?: boolean;
  }) | undefined;
  if (!ac?.place) return false;

  const backBearing = (gate.heading + 180) % 360;
  const pt = destinationPoint(gate.lat, gate.lon, backBearing, 6);
  let groundAlt = 0;
  try {
    const fn = window.geofs?.getGroundAltitude as
      | ((lla: [number, number, number]) => { location?: number[] })
      | undefined;
    const res = fn?.([pt.lat, pt.lon, 100]);
    if (res?.location && Number.isFinite(res.location[2])) {
      groundAlt = res.location[2];
    }
  } catch {
    groundAlt = 0;
  }

  ac.place([pt.lat, pt.lon, groundAlt], [gate.heading, 0, 0]);
  if (ac.rigidBody) {
    ac.rigidBody.v_linearVelocity = [0, 0, 0];
    ac.rigidBody.v_angularVelocity = [0, 0, 0];
    ac.rigidBody.v_totalForce = [0, 0, 0];
    ac.rigidBody.v_totalTorque = [0, 0, 0];
  }
  ac.groundContact = true;

  const parkingBrake = window.controls?.setters?.setParkingBrake?.set;
  if (typeof parkingBrake === 'function' && !window.geofs?.animation?.values?.parkingBrake) {
    try {
      parkingBrake();
    } catch {
      // ignore if parking brake toggle isn't active
    }
  }
  return true;
}

export class GateSpawnerModule implements IModule {
  public readonly id = 'gate-spawner';
  public readonly name = 'Gate Spawner';
  public readonly description = 'Spawn parked at real airport gates/stands worldwide with size & category filters.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private unmountTab: (() => void) | null = null;
  private gatesDb: GatesDatabase | null = null;
  private loading = false;
  private abortController: AbortController | null = null;
  private activeFilters = new Set<GateFilter['key']>();

  public init(context: ModuleContext): void {
    this.ctx = context;
    if (typeof document === 'undefined' || typeof context.anchors?.registerHudTab !== 'function') return;

    const root = document.createElement('div');
    root.style.cssText = 'display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;';

    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;gap:4px;align-items:center;';
    const icaoInput = document.createElement('input');
    icaoInput.type = 'text';
    icaoInput.placeholder = 'ICAO (e.g. EGLL)';
    icaoInput.style.cssText = 'flex:1;min-width:0;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(136,136,136,0.35);border-radius:4px;padding:3px 6px;font-size:10px;text-transform:uppercase;';

    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.textContent = 'Load';
    loadBtn.style.cssText = 'background:#1d4ed8;color:#fff;border:none;border-radius:4px;padding:3px 7px;font-size:9.5px;font-weight:700;cursor:pointer;';
    topRow.append(icaoInput, loadBtn);

    const gateFilterInput = document.createElement('input');
    gateFilterInput.type = 'text';
    gateFilterInput.placeholder = 'Filter gate (e.g. B12)';
    gateFilterInput.style.cssText = 'width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(136,136,136,0.28);border-radius:4px;padding:3px 6px;font-size:9.5px;';

    const chipsRow = document.createElement('div');
    chipsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:3px;';
    for (const f of GATE_FILTERS) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.textContent = f.label;
      chip.style.cssText = 'background:rgba(255,255,255,0.06);color:#cbd5e1;border:1px solid rgba(136,136,136,0.3);border-radius:999px;padding:1px 6px;font-size:8.5px;cursor:pointer;';
      chip.addEventListener('click', () => {
        if (this.activeFilters.has(f.key)) {
          this.activeFilters.delete(f.key);
          chip.style.borderColor = 'rgba(136,136,136,0.3)';
          chip.style.color = '#cbd5e1';
        } else {
          this.activeFilters.add(f.key);
          chip.style.borderColor = '#10b981';
          chip.style.color = '#10b981';
        }
        renderGates();
      });
      chipsRow.appendChild(chip);
    }

    const select = document.createElement('select');
    select.size = 4;
    select.style.cssText = 'width:100%;background:rgba(0,0,0,0.5);color:#fff;border:1px solid rgba(136,136,136,0.35);border-radius:4px;font-size:9.5px;padding:2px;';

    const spawnBtn = document.createElement('button');
    spawnBtn.type = 'button';
    spawnBtn.textContent = 'Spawn At Selected Gate';
    spawnBtn.style.cssText = 'width:100%;background:#10b981;color:#052e16;border:none;border-radius:4px;padding:4px 6px;font-size:9.5px;font-weight:800;cursor:pointer;';

    const status = document.createElement('div');
    status.style.cssText = 'font-size:8.5px;color:#94a3b8;';
    status.textContent = 'Click Load to fetch gate database on demand.';

    let currentGates: GateEntry[] = [];

    const renderGates = () => {
      select.innerHTML = '';
      if (!this.gatesDb) return;
      const icao = icaoInput.value.trim().toUpperCase();
      const raw = this.gatesDb[icao] ?? [];
      currentGates = filterGates(raw, gateFilterInput.value, this.activeFilters);
      for (let i = 0; i < currentGates.length; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = `${gateLabel(currentGates[i])} (HDG ${Math.round(currentGates[i].heading)}°)`;
        select.appendChild(opt);
      }
      if (icao && raw.length === 0) {
        status.textContent = `No gates found for ${icao}.`;
      } else if (icao) {
        status.textContent = `${currentGates.length} / ${raw.length} gates at ${icao}.`;
      } else {
        status.textContent = `Loaded ${Object.keys(this.gatesDb).length} airports. Enter ICAO.`;
      }
    };

    const ensureLoaded = async () => {
      if (this.gatesDb) {
        renderGates();
        return;
      }
      if (this.loading) return;
      this.loading = true;
      status.textContent = 'Downloading gates database...';
      this.abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
      try {
        const res = await fetch(GATES_DB_URL, { signal: this.abortController?.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        this.gatesDb = (await res.json()) as GatesDatabase;
        renderGates();
      } catch {
        status.textContent = 'Could not load gates database.';
      } finally {
        this.loading = false;
      }
    };

    loadBtn.addEventListener('click', () => {
      void ensureLoaded();
    });
    icaoInput.addEventListener('input', renderGates);
    icaoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') void ensureLoaded();
    });
    gateFilterInput.addEventListener('input', renderGates);
    spawnBtn.addEventListener('click', () => {
      const idx = Number(select.value);
      const gate = Number.isFinite(idx) ? currentGates[idx] : undefined;
      if (!gate) {
        status.textContent = 'Select a gate first.';
        return;
      }
      if (spawnAtGate(gate)) {
        this.ctx?.anchors.showToast(`Spawned at gate ${gateLabel(gate)}`);
        status.textContent = `Parked at ${gateLabel(gate)}.`;
      } else {
        status.textContent = 'Aircraft not ready to place.';
      }
    });

    root.append(topRow, gateFilterInput, chipsRow, select, spawnBtn, status);
    this.unmountTab = context.anchors.registerHudTab('gates', 'GATES', root, false, { defaultClosed: true });
  }

  public update(_telemetry: FlightTelemetry): void {
    // Event-driven UI module
  }

  public destroy(): void {
    this.abortController?.abort();
    this.abortController = null;
    this.loading = false;
    this.unmountTab?.();
    this.unmountTab = null;
    this.gatesDb = null;
    this.activeFilters.clear();
    this.ctx = null;
  }
}
