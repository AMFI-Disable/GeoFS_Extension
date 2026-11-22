import type { StaticAircraftSpec } from '../core/sim-adapter';
import {
  MANDATORY_PHASE_LABELS,
  SITUATIONAL_GUIDES,
  type ChecklistProcedure
} from '../modules/checklist-system/procedures';
import { AircraftEditor } from '../shared/aircraft-editor';
import type { AircraftCategory, AircraftProfile } from '../types/module';

export interface CatalogTabProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: 'all' | AircraftCategory;
  setCategoryFilter: (cat: 'all' | AircraftCategory) => void;
  filteredCatalog: Array<StaticAircraftSpec & { id: string }>;
  selectedSpec: StaticAircraftSpec & { id: string };
  setSelectedId: (id: string) => void;
  selectedProfile: AircraftProfile;
  selectedProcedures: ChecklistProcedure[];
}

export function CatalogTab({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  filteredCatalog,
  selectedSpec,
  setSelectedId,
  selectedProfile,
  selectedProcedures
}: CatalogTabProps) {
  return (
    <div class="surface-grid-2">
      <div class="panel-card">
        <div class="section-heading">Supported GeoFS Aircraft Catalog</div>
        <div class="field-row">
          <input
            type="search"
            style="flex:1"
            placeholder="Search ID, airframe name, or category..."
            value={searchQuery}
            onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter((e.target as HTMLSelectElement).value as 'all' | AircraftCategory)}
          >
            <option value="all">All Categories</option>
            <option value="ga-piston">GA Piston</option>
            <option value="turboprop">Turboprop</option>
            <option value="airliner-twin">Airliner Twin</option>
            <option value="airliner-quad">Airliner Quad</option>
            <option value="fighter">Fighter</option>
            <option value="supersonic">Supersonic</option>
            <option value="rotorcraft">Rotorcraft</option>
            <option value="specialized">Specialized</option>
          </select>
        </div>

        <div class="table-wrap" style="max-height:520px;overflow-y:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Aircraft</th>
                <th>Type</th>
                <th>Max Fuel</th>
                <th>Flaps</th>
                <th>Vref</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalog.length === 0 ? (
                <tr>
                  <td colSpan={6} style="text-align:center;color:var(--muted);padding:16px">
                    No aircraft matched your search.
                  </td>
                </tr>
              ) : (
                filteredCatalog.map((ac) => (
                  <tr
                    key={ac.id}
                    class={ac.id === selectedSpec.id ? 'selected' : ''}
                    style="cursor:pointer"
                    onClick={() => setSelectedId(ac.id)}
                  >
                    <td>{ac.id}</td>
                    <td>{ac.name}</td>
                    <td>{ac.category}</td>
                    <td>{ac.maxFuel.toLocaleString()} kg</td>
                    <td>{ac.maxFlaps}</td>
                    <td>{ac.vSpeeds.vref ?? '--'} kt</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div class="field-col">
        <AircraftEditor key={selectedProfile.id} profile={selectedProfile} />

        <div class="panel-card">
          <div class="section-heading">
            Mandatory 4-Gate Checklists · {selectedProfile.name}
          </div>
          {selectedProcedures.map((proc) => (
            <div key={proc.title} style="margin-bottom:6px">
              <div style="font-weight:700;color:var(--accent);font-size:11px;margin-bottom:3px">
                {proc.gateId ? `${MANDATORY_PHASE_LABELS[proc.gateId]} · ` : ''}
                {proc.title}
              </div>
              {proc.items.map((item) => (
                <div key={item.text} style="padding:2px 0;border-bottom:1px solid var(--border-soft)">
                  <div style="font-weight:700;font-size:11px">
                    {item.text} {item.sync && <span class="badge badge--info">{item.sync}</span>}
                  </div>
                  <div style="font-size:10px;color:var(--muted)">{item.desc}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div class="panel-card">
          <div class="section-heading">Supplemental Situation Guides ({SITUATIONAL_GUIDES.length})</div>
          {SITUATIONAL_GUIDES.map((g) => (
            <details key={g.id}>
              <summary style="cursor:pointer;font-weight:700;font-size:11px">{g.title}</summary>
              <ul style="margin:4px 0 6px 18px;padding:0;font-size:10px;color:var(--muted)">
                {g.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
