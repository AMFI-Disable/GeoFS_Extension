import { useEffect, useMemo, useState } from 'preact/hooks';
import { parseAircraftOverride } from '../core/aircraft-profile';
import { detectGeoFSKeyCollision, detectOsPlatform, formatComboForOs } from '../core/keybind-manager';
import { landingReplayCsv } from '../core/landing-replay';
import { formatLogbookCsv, triggerDownload } from '../core/logbook-export';
import { getAllCatalogAircraft, type StaticAircraftSpec } from '../core/sim-adapter';
import { MANDATORY_PHASE_LABELS, SITUATIONAL_GUIDES, getMandatoryProcedures } from '../modules/checklist-system/procedures';
import { REALISM_OPTION_META } from '../modules/realism-pack';
import { AircraftEditor } from '../shared/aircraft-editor';
import {
  MODULE_META,
  clearLogbook,
  loadLogbook,
  loadSplitSettings,
  requestActiveTabDiagnostics,
  requestActiveTabTelemetry,
  saveExtensionPatch,
  saveScriptPatch,
  subscribeLogbook,
  subscribeSettings,
  type DiagEntry,
  type LiveTelemetrySummary
} from '../shared/settings-store';
import type { AircraftCategory, AircraftProfile } from '../types/module';
import {
  DEFAULT_SETTINGS,
  splitSettings,
  type CalibratorPreset,
  type ExtensionSettings,
  type FpvResolutionMode,
  type ImageryProviderMode,
  type LandingRecord,
  type OpSyncPolicy,
  type RealismOptions,
  type ThemeMode
} from '../types/settings';

const FAILURE_QUICK_SYSTEMS = [
  { id: 'gearLeft', label: 'Left Gear Fault' },
  { id: 'electrical', label: 'Electrical Blackout' },
  { id: 'fuelLeak', label: 'Major Fuel Leak' },
  { id: 'mcas', label: 'MCAS Runaway Trim' },
  { id: 'pitotStatic', label: 'Pitot-Static Failure' },
  { id: 'engine0', label: 'Engine 1 Failure' }
] as const;

function catalogSpecToProfile(spec: StaticAircraftSpec & { id: string }): AircraftProfile {
  const parsed = parseAircraftOverride({ vSpeeds: spec.vSpeeds });
  return {
    id: spec.id,
    name: spec.name,
    category: spec.category,
    engineCount: spec.engineCount,
    maxFlaps: spec.maxFlaps,
    hasGear: spec.hasGear,
    hasSpoilers: spec.hasSpoilers,
    oew: spec.oew,
    mtow: spec.mtow,
    maxFuel: spec.maxFuel,
    isDynamic: false,
    vSpeeds: parsed.vSpeeds
  };
}

export function App() {
  const [tab, setTab] = useState<'extension' | 'script' | 'catalog' | 'logbook'>('extension');
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [logbook, setLogbook] = useState<LandingRecord[]>([]);
  const [live, setLive] = useState<LiveTelemetrySummary | null>(null);
  const [diags, setDiags] = useState<DiagEntry[]>([]);

  const catalog = useMemo(() => getAllCatalogAircraft(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AircraftCategory>('all');
  const [selectedId, setSelectedId] = useState<string>('4');

  const os = detectOsPlatform();

  useEffect(() => {
    void loadSplitSettings().then(setSettings);
    void loadLogbook().then(setLogbook);
    const unsubSettings = subscribeSettings(setSettings);
    const unsubLogbook = subscribeLogbook(setLogbook);

    const poll = () => {
      void requestActiveTabTelemetry().then(setLive);
      void requestActiveTabDiagnostics().then(setDiags);
    };
    poll();
    const timer = setInterval(poll, 2000);
    return () => {
      clearInterval(timer);
      unsubSettings();
      unsubLogbook();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
  }, [settings.themeMode]);

  const patchExt = (patch: Partial<ExtensionSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...patch,
      modules: patch.modules ? { ...prev.modules, ...patch.modules } : prev.modules,
      keybindings: patch.keybindings ? { ...prev.keybindings, ...patch.keybindings } : prev.keybindings
    }));
    void saveExtensionPatch(patch).then(setSettings);
  };

  const patchScr = (patch: Partial<ExtensionSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...patch,
      failureSystemChances: patch.failureSystemChances
        ? { ...prev.failureSystemChances, ...patch.failureSystemChances }
        : prev.failureSystemChances,
      realismOptions: patch.realismOptions
        ? { ...prev.realismOptions, ...patch.realismOptions }
        : prev.realismOptions
    }));
    void saveScriptPatch(patch).then(setSettings);
  };

  const applyPreset = (mode: 'all' | 'minimal' | 'none') => {
    const nextModules: Record<string, boolean> = {};
    for (const m of MODULE_META) {
      if (mode === 'all') nextModules[m.id] = true;
      else if (mode === 'none') nextModules[m.id] = false;
      else nextModules[m.id] = ['information-display', 'autothrottle', 'landing-statistics'].includes(m.id);
    }
    patchExt({ modules: nextModules });
  };

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalog.filter((ac) => {
      if (categoryFilter !== 'all' && ac.category !== categoryFilter) return false;
      if (!q) return true;
      return ac.name.toLowerCase().includes(q) || ac.id.includes(q) || ac.category.includes(q);
    });
  }, [catalog, searchQuery, categoryFilter]);

  const selectedSpec = useMemo(
    () => catalog.find((c) => c.id === selectedId) ?? catalog[0],
    [catalog, selectedId]
  );

  const selectedProfile = useMemo(() => catalogSpecToProfile(selectedSpec), [selectedSpec]);
  const selectedProcedures = useMemo(() => getMandatoryProcedures(selectedProfile), [selectedProfile]);

  const avgScore = useMemo(() => {
    const scored = logbook.filter((r) => typeof r.score === 'number');
    if (!scored.length) return '--';
    return (scored.reduce((s, r) => s + (r.score ?? 0), 0) / scored.length).toFixed(1);
  }, [logbook]);

  const exportVerificationBundle = () => {
    const split = splitSettings(settings);
    const bundle = {
      exportedAt: new Date().toISOString(),
      geofs_ext_config: split.extensionConfig,
      geofs_script_config: split.scriptConfig,
      liveTelemetry: live,
      diagnostics: diags,
      logbookCount: logbook.length,
      recentLogbook: logbook.slice(0, 20)
    };
    triggerDownload(
      `geofs-verification-bundle-${Date.now()}.json`,
      JSON.stringify(bundle, null, 2),
      'application/json'
    );
  };

  const isV4 = live?.simMajor === 4;

  return (
    <div class="surface-shell">
      <div class="header">
        <div>
          <div class="title">GeoFS Extension · Unified Settings Portal</div>
          <div style="font-size:11px;color:var(--muted)">
            Separated Storage: <code>geofs_ext_config</code> (Extension) &amp; <code>geofs_script_config</code> (In-Sim Behavior)
          </div>
        </div>
        <div class="chip-group">
          <span class={`badge ${live?.simMajor ? 'badge--ok' : ''}`}>
            {live?.simMajor ? `Live GeoFS V${live.simMajor}` : 'GeoFS Standby'}
          </span>
          <span class="badge">OS: {os.toUpperCase()}</span>
        </div>
      </div>

      <div class="tabs">
        <button type="button" class={`tab-btn ${tab === 'extension' ? 'active' : ''}`} onClick={() => setTab('extension')}>
          1. Extension Settings
        </button>
        <button type="button" class={`tab-btn ${tab === 'script' ? 'active' : ''}`} onClick={() => setTab('script')}>
          2. Script Parameters
        </button>
        <button type="button" class={`tab-btn ${tab === 'catalog' ? 'active' : ''}`} onClick={() => setTab('catalog')}>
          3. Aircraft Catalog &amp; Checklists ({catalog.length})
        </button>
        <button type="button" class={`tab-btn ${tab === 'logbook' ? 'active' : ''}`} onClick={() => setTab('logbook')}>
          4. Logbook &amp; Verification ({logbook.length})
        </button>
      </div>

      {tab === 'extension' && (
        <div class="surface-grid-2">
          <div class="panel-card">
            <div class="section-heading">Module Registry</div>
            <div class="preset-row">
              <button type="button" class="btn-sm" onClick={() => applyPreset('all')}>
                All On
              </button>
              <button type="button" class="btn-sm" onClick={() => applyPreset('minimal')}>
                Minimal
              </button>
              <button type="button" class="btn-sm" onClick={() => applyPreset('none')}>
                All Off
              </button>
            </div>
            <div class="list">
              {MODULE_META.map((m) => (
                <label class="switch-row" key={m.id}>
                  <div>
                    <div style="font-weight:700">{m.name}</div>
                    <div style="font-size:10px;color:var(--muted)">{m.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.modules[m.id])}
                    onChange={() =>
                      patchExt({ modules: { ...settings.modules, [m.id]: !settings.modules[m.id] } })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          <div class="field-col">
            <div class="panel-card">
              <div class="section-heading">UI, Calibrator &amp; Diagnostics Flags</div>
              <div class="field-row">
                <span>Theme Appearance</span>
                <select
                  value={settings.themeMode}
                  onChange={(e) => patchExt({ themeMode: (e.target as HTMLSelectElement).value as ThemeMode })}
                >
                  <option value="auto">Auto (Native Dark HUD)</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div class="field-row">
                <span>Screen Calibrator</span>
                <select
                  value={settings.calibratorPreset}
                  onChange={(e) =>
                    patchExt({ calibratorPreset: (e.target as HTMLSelectElement).value as CalibratorPreset })
                  }
                >
                  <option value="1080p">1080p FHD (1.0x)</option>
                  <option value="1440p">1440p QHD (1.1x)</option>
                  <option value="4k">4K UHD (1.35x)</option>
                  <option value="ultrawide">Ultrawide (1.08x)</option>
                  <option value="laptop">Laptop (0.9x)</option>
                </select>
              </div>
              <label class="switch-row">
                <span>Show Startup Toast Banner</span>
                <input
                  type="checkbox"
                  checked={settings.showStartupDiagnostics}
                  onChange={(e) => patchExt({ showStartupDiagnostics: (e.target as HTMLInputElement).checked })}
                />
              </label>
              <label class="switch-row">
                <span>Auto-Stream Side Panel Telemetry</span>
                <input
                  type="checkbox"
                  checked={settings.sidePanelAutoTelemetry}
                  onChange={(e) => patchExt({ sidePanelAutoTelemetry: (e.target as HTMLInputElement).checked })}
                />
              </label>
              <label class="switch-row">
                <span>Use Native Fallback Autopilot Bar if Unanchored</span>
                <input
                  type="checkbox"
                  checked={settings.hudPositionFallback}
                  onChange={(e) => patchExt({ hudPositionFallback: (e.target as HTMLInputElement).checked })}
                />
              </label>
            </div>

            <div class="panel-card">
              <div class="section-heading">OS-Aware Keybindings ({os.toUpperCase()})</div>
              {(Object.keys(settings.keybindings) as Array<keyof ExtensionSettings['keybindings']>).map((k) => {
                const collision = detectGeoFSKeyCollision(settings.keybindings[k]);
                return (
                  <div class="field-col" key={k} style="gap:2px">
                    <div class="field-row">
                      <span>{k}</span>
                      <input
                        type="text"
                        style={`width:140px;text-align:right;${collision ? 'border-color:#ef4444' : ''}`}
                        value={formatComboForOs(settings.keybindings[k], os)}
                        onChange={(e) =>
                          patchExt({
                            keybindings: {
                              ...settings.keybindings,
                              [k]: (e.target as HTMLInputElement).value
                            }
                          })
                        }
                      />
                    </div>
                    {collision && <div style="font-size:10px;color:#ef4444;text-align:right">{collision}</div>}
                  </div>
                );
              })}
            </div>

            <div class="panel-card">
              <div class="section-heading">Satellite Imagery Provider</div>
              <div class="field-row">
                <span>Tile Source</span>
                <select
                  value={settings.imageryProvider}
                  onChange={(e) =>
                    patchExt({ imageryProvider: (e.target as HTMLSelectElement).value as ImageryProviderMode })
                  }
                >
                  <option value="native">GeoFS Native</option>
                  <option value="osm">OpenStreetMap</option>
                  <option value="esri">Esri World Imagery (Token)</option>
                  <option value="bing">Bing Maps Aerial (API Key)</option>
                  <option value="custom">Custom Template URL</option>
                </select>
              </div>
              {(settings.imageryProvider === 'esri' || settings.imageryProvider === 'bing') && (
                <input
                  type="text"
                  placeholder={settings.imageryProvider === 'bing' ? 'Bing Maps API Key' : 'Esri ArcGIS Token'}
                  value={settings.customImageryToken}
                  onInput={(e) => patchExt({ customImageryToken: (e.target as HTMLInputElement).value })}
                />
              )}
              {settings.imageryProvider === 'custom' && (
                <input
                  type="text"
                  placeholder="https://tiles.example.com/{z}/{x}/{y}.png"
                  value={settings.customImageryUrl}
                  onInput={(e) => patchExt({ customImageryUrl: (e.target as HTMLInputElement).value })}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'script' && (
        <div class="surface-grid-2">
          <div class="panel-card">
            <div class="section-heading">Autothrottle &amp; OP-SYNC</div>
            <div class="field-row">
              <span>Responsiveness ({settings.autothrottleResponsiveness.toFixed(1)}x)</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.autothrottleResponsiveness}
                onInput={(e) =>
                  patchScr({ autothrottleResponsiveness: Number((e.target as HTMLInputElement).value) })
                }
              />
            </div>
            <div class="field-row">
              <span>OP-SYNC Engagement Policy</span>
              <select
                value={settings.opSyncPolicy}
                onChange={(e) => patchScr({ opSyncPolicy: (e.target as HTMLSelectElement).value as OpSyncPolicy })}
              >
                <option value="ask">Ask When Large Delta Detected</option>
                <option value="allow">Always Allow Auto-OP</option>
                <option value="never">Never Allow (Keep Standard Envelope)</option>
              </select>
            </div>
            <div class="field-row">
              <span>High-Delta Threshold (KIAS)</span>
              <input
                type="number"
                min="25"
                max="2000"
                step="25"
                style="width:90px"
                value={settings.opDeltaThresholdKts}
                onChange={(e) =>
                  patchScr({
                    opDeltaThresholdKts: Math.max(25, Math.min(2000, Number((e.target as HTMLInputElement).value) || 150))
                  })
                }
              />
            </div>
          </div>

          <div class="panel-card">
            <div class="section-heading">Overpowered Engines &amp; Closed-Loop SAS</div>
            <div class="field-row">
              <span>Thrust Multiplier (1–1,000,000,000x)</span>
              <input
                type="number"
                min="1"
                max="1000000000"
                style="width:120px"
                value={settings.opThrustMultiplier}
                onChange={(e) =>
                  patchScr({
                    opThrustMultiplier: Math.max(1, Math.min(1_000_000_000, Number((e.target as HTMLInputElement).value) || 1))
                  })
                }
              />
            </div>
            <div class="field-row">
              <span>Atmosphere Ceiling (ft)</span>
              <select
                value={settings.opCeilingFeet}
                onChange={(e) => patchScr({ opCeilingFeet: Number((e.target as HTMLSelectElement).value) })}
              >
                <option value={3_000_000}>3.0M ft</option>
                <option value={10_000_000}>10.0M ft</option>
                <option value={100_000_000}>100.0M ft</option>
                <option value={1_000_000_000}>1.0B ft</option>
                <option value={1_000_000_000_000}>1.0T ft</option>
              </select>
            </div>
            <label class="switch-row">
              <span>Closed-Loop SAS Attitude Hold &amp; Rate Damper</span>
              <input
                type="checkbox"
                checked={settings.opStability}
                onChange={(e) => patchScr({ opStability: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <div class="field-row">
              <span>SAS Damping Strength ({settings.sasStrength.toFixed(1)}x)</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.sasStrength}
                onInput={(e) => patchScr({ sasStrength: Number((e.target as HTMLInputElement).value) })}
              />
            </div>
          </div>

          <div class="panel-card">
            <div class="section-heading">Checklists &amp; Fuel Physics</div>
            <label class="switch-row">
              <span>Auto-Advance Phase on Gate Completion</span>
              <input
                type="checkbox"
                checked={settings.checklistAutoAdvance}
                onChange={(e) => patchScr({ checklistAutoAdvance: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <label class="switch-row">
              <span>Enforce 4 Mandatory Flight Gates</span>
              <input
                type="checkbox"
                checked={settings.checklistEnforceMandatoryGates}
                onChange={(e) =>
                  patchScr({ checklistEnforceMandatoryGates: (e.target as HTMLInputElement).checked })
                }
              />
            </label>
            <label class="switch-row">
              <span>Altitude Burn (Scales Density &amp; All Engine Throttles)</span>
              <input
                type="checkbox"
                checked={settings.fuelDynamicSfc}
                onChange={(e) => patchScr({ fuelDynamicSfc: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <label class="switch-row">
              <span>Real Tanks (Center → Wings Drain &amp; Roll Torque)</span>
              <input
                type="checkbox"
                checked={settings.fuelRealisticTanks}
                onChange={(e) => patchScr({ fuelRealisticTanks: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <label class="switch-row">
              <span>Auto-Refuel on Empty Tank</span>
              <input
                type="checkbox"
                checked={settings.fuelAutoRefuel}
                onChange={(e) => patchScr({ fuelAutoRefuel: (e.target as HTMLInputElement).checked })}
              />
            </label>
          </div>

          <div class="panel-card">
            <div class="section-heading">Failures, Landing Card &amp; FPV</div>
            <label class="switch-row">
              <span>Enable Random Probability Failures</span>
              <input
                type="checkbox"
                checked={settings.failureProbabilitiesEnabled}
                onChange={(e) =>
                  patchScr({ failureProbabilitiesEnabled: (e.target as HTMLInputElement).checked })
                }
              />
            </label>
            <div class="field-row">
              <span>Probability Check Interval (sec)</span>
              <input
                type="number"
                min="10"
                max="600"
                style="width:80px"
                value={settings.failureProbabilityIntervalSec}
                onChange={(e) =>
                  patchScr({
                    failureProbabilityIntervalSec: Math.max(
                      10,
                      Math.min(600, Number((e.target as HTMLInputElement).value) || 60)
                    )
                  })
                }
              />
            </div>
            <div class="field-row">
              <span>Base Recovery Success Chance ({settings.failureRecoveryChancePct}%)</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.failureRecoveryChancePct}
                onInput={(e) =>
                  patchScr({ failureRecoveryChancePct: Number((e.target as HTMLInputElement).value) })
                }
              />
            </div>
            {FAILURE_QUICK_SYSTEMS.map((sys) => {
              const chancePct = Math.round((settings.failureSystemChances[sys.id] ?? 0) * 100);
              return (
                <div class="field-row" key={sys.id} style="font-size:11px">
                  <span>{sys.label} Prob ({chancePct}%)</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={chancePct}
                    onInput={(e) =>
                      patchScr({
                        failureSystemChances: {
                          ...settings.failureSystemChances,
                          [sys.id]: Number((e.target as HTMLInputElement).value) / 100
                        }
                      })
                    }
                  />
                </div>
              );
            })}
            <label class="switch-row">
              <span>Auto-Close Slide-In Landing Card</span>
              <input
                type="checkbox"
                checked={settings.landingReportAutoClose}
                onChange={(e) => patchScr({ landingReportAutoClose: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <div class="field-row">
              <span>Landing Card Duration (sec)</span>
              <input
                type="number"
                min="1"
                max="3600"
                style="width:80px"
                value={settings.landingReportSeconds}
                onChange={(e) =>
                  patchScr({
                    landingReportSeconds: Math.max(1, Math.min(3600, Number((e.target as HTMLInputElement).value) || 15))
                  })
                }
              />
            </div>
            <div class="field-row">
              <span>FPV Vector Projection Factor ({settings.fpvProjectionFactor})</span>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={settings.fpvProjectionFactor}
                onInput={(e) => patchScr({ fpvProjectionFactor: Number((e.target as HTMLInputElement).value) })}
              />
            </div>
            <div class="field-row">
              <span>FPV Reticle Resolution</span>
              <select
                value={settings.fpvResolutionMode}
                onChange={(e) =>
                  patchScr({ fpvResolutionMode: (e.target as HTMLSelectElement).value as FpvResolutionMode })
                }
              >
                <option value="auto">Auto (512px Hi-Res / Low-Res Scale)</option>
                <option value="hires">Force 512px Hi-Res Asset</option>
                <option value="lowres">Force Low-Res Compatibility Asset</option>
              </select>
            </div>
          </div>

          <div class="panel-card" style="grid-column: 1 / -1">
            <div class="section-heading">Realism Pack Controls (Background Engine)</div>
            <div class="surface-grid-2">
              {REALISM_OPTION_META.map((item) => {
                const unavailable = Boolean(isV4 && item.v4Unavailable);
                return (
                  <label class="switch-row" key={item.key} style={unavailable ? 'opacity:0.6' : ''}>
                    <span style="display:flex;align-items:center;gap:6px">
                      <span>{item.label}</span>
                      {item.v4Unavailable && (
                        <span class={`badge ${unavailable ? 'badge--warn' : ''}`}>
                          {unavailable ? 'UNAVAILABLE ON V4' : 'V3 Only'}
                        </span>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      disabled={unavailable}
                      checked={!unavailable && Boolean(settings.realismOptions[item.key])}
                      onChange={() =>
                        patchScr({
                          realismOptions: {
                            ...settings.realismOptions,
                            [item.key]: !settings.realismOptions[item.key]
                          }
                        })
                      }
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'catalog' && (
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
                  {filteredCatalog.map((ac) => (
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
                  ))}
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
      )}

      {tab === 'logbook' && (
        <div class="field-col">
          <div class="telemetry-strip telemetry-strip--wide">
            <div>
              <div class="telemetry-cell-label">Total Flights</div>
              <div class="telemetry-cell-value">{logbook.length}</div>
            </div>
            <div>
              <div class="telemetry-cell-label">Avg Score</div>
              <div class="telemetry-cell-value">{avgScore}/10</div>
            </div>
            <div>
              <div class="telemetry-cell-label">Diag Events</div>
              <div class="telemetry-cell-value">{diags.length}</div>
            </div>
            <div>
              <div class="telemetry-cell-label">Active Failures</div>
              <div class="telemetry-cell-value">{live?.activeFailures?.length ?? 0}</div>
            </div>
          </div>

          <div class="preset-row">
            <button
              type="button"
              class="btn-sm"
              disabled={logbook.length === 0}
              onClick={() => triggerDownload('geofs-landing-logbook.json', JSON.stringify(logbook, null, 2), 'application/json')}
            >
              Export All JSON
            </button>
            <button
              type="button"
              class="btn-sm"
              disabled={logbook.length === 0}
              onClick={() => triggerDownload('geofs-landing-logbook.csv', formatLogbookCsv(logbook), 'text/csv')}
            >
              Export All CSV
            </button>
            <button type="button" class="btn-sm btn-accent" onClick={exportVerificationBundle}>
              Download Verification Bundle (JSON)
            </button>
            <button
              type="button"
              class="btn-sm"
              onClick={() => {
                setLogbook([]);
                void clearLogbook();
              }}
            >
              Clear Logbook
            </button>
          </div>

          <div class="panel-card">
            <div class="section-heading">Touchdown Logbook &amp; Replay Traces</div>
            {logbook.length === 0 ? (
              <div style="color:var(--muted);padding:10px 0">No recorded landings yet. Complete a flight to populate the logbook.</div>
            ) : (
              <div class="table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Aircraft</th>
                      <th>Rating</th>
                      <th>Score</th>
                      <th>V/S (fpm)</th>
                      <th>G-Force</th>
                      <th>GS (kt)</th>
                      <th>Replay Pts</th>
                      <th>Exports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logbook.map((rec) => (
                      <tr key={rec.id}>
                        <td>{new Date(rec.timestamp).toLocaleString()}</td>
                        <td>{rec.aircraftName}</td>
                        <td>{rec.rating}</td>
                        <td>{rec.score !== undefined ? `${rec.score.toFixed(1)}/10` : '--'}</td>
                        <td>{rec.vsFpm}</td>
                        <td>{rec.gForce.toFixed(2)}G</td>
                        <td>{rec.groundSpeedKts}</td>
                        <td>{rec.replay?.length ?? 0}</td>
                        <td>
                          <div class="chip-group">
                            <button
                              type="button"
                              class="chip-btn"
                              onClick={() =>
                                triggerDownload(
                                  `geofs-landing-${rec.id}.json`,
                                  JSON.stringify(rec, null, 2),
                                  'application/json'
                                )
                              }
                            >
                              JSON
                            </button>
                            <button
                              type="button"
                              class="chip-btn"
                              onClick={() =>
                                triggerDownload(`geofs-landing-${rec.id}.csv`, landingReplayCsv(rec), 'text/csv')
                              }
                            >
                              CSV
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div class="panel-card">
            <div class="section-heading">Session Diagnostic Log ([GeoFS-EXT][DIAG])</div>
            <div class="diag-feed">
              {diags.length === 0 ? (
                <div style="color:var(--muted)">Waiting for GeoFS telemetry stream...</div>
              ) : (
                diags
                  .slice()
                  .reverse()
                  .map((entry, idx) => (
                    <div class="diag-line" key={`${entry.time}-${idx}`}>
                      <span style="color:var(--accent)">[{entry.time.slice(11, 19)}]</span>{' '}
                      <strong>{entry.code}</strong> {entry.payload ? JSON.stringify(entry.payload) : ''}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
