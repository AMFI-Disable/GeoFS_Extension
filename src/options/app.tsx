import { useEffect, useMemo, useState } from 'preact/hooks';
import { parseAircraftOverride } from '../core/aircraft-profile';
import {
  detectGeoFSKeyCollision,
  detectOsPlatform,
  eventToComboString,
  formatComboForOs,
  normalizeComboString
} from '../core/keybind-manager';
import {
  SIM_TARGET_KEYS,
  resolveEffectiveOs,
  resolveEffectiveSimRemaps
} from '../core/keyboard-translator';
import { landingReplayCsv } from '../core/landing-replay';
import { formatLogbookCsv, triggerDownload } from '../core/logbook-export';
import { getAllCatalogAircraft, type StaticAircraftSpec } from '../core/sim-adapter';
import { MANDATORY_PHASE_LABELS, SITUATIONAL_GUIDES, getMandatoryProcedures } from '../modules/checklist-system/procedures';
import { REALISM_OPTION_META } from '../modules/realism-pack';
import { AircraftEditor } from '../shared/aircraft-editor';
import { detectDisplayProfile } from '../shared/display-calibrator';
import { HelpLabel, SETTING_TIPS } from '../shared/help-tip';
import {
  MODULE_META,
  clearLogbook,
  focusGeoFSTab,
  getOpenGeoFSTabs,
  loadLogbook,
  loadSplitSettings,
  mergeExtensionPatch,
  requestActiveTabDiagnostics,
  requestActiveTabTelemetry,
  saveExtensionPatch,
  saveScriptPatch,
  subscribeLogbook,
  subscribeSettings,
  type DiagEntry,
  type GeoFSTabInfo,
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
  type KeybindConfig,
  type KeyboardOsProfile,
  type LandingRecord,
  type MacKeyboardType,
  type OpSyncPolicy,
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

const KEYBIND_LABELS: Record<keyof KeybindConfig, string> = {
  toggleAutothrottle: 'Toggle Autothrottle',
  toggleOpEngines: 'Toggle OP Engines',
  toggleHud: 'Toggle Shared HUD',
  toggleFpv: 'Toggle Flight Path Vector',
  toggleChecklist: 'Open / Advance Checklists',
  toggleLandingLights: 'Toggle Landing & Taxi Lights',
  toggleSlewMode: 'Toggle FSX Slew Mode'
};

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
  const [geofsTabs, setGeofsTabs] = useState<GeoFSTabInfo[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<number | undefined>(undefined);
  const [displayInfo, setDisplayInfo] = useState(() => detectDisplayProfile());
  const [recordingKey, setRecordingKey] = useState<keyof KeybindConfig | null>(null);
  const [newRemapSource, setNewRemapSource] = useState('');
  const [newRemapTarget, setNewRemapTarget] = useState('PageUp');

  const catalog = useMemo(() => getAllCatalogAircraft(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AircraftCategory>('all');
  const [selectedId, setSelectedId] = useState<string>('4');

  const os = detectOsPlatform();
  const effectiveOs = resolveEffectiveOs(settings.keyboardOsProfile);

  useEffect(() => {
    if (!recordingKey) return;
    const onCapture = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') {
        setRecordingKey(null);
        return;
      }
      const combo = eventToComboString(e);
      if (!combo) return;
      const next = { ...settings.keybindings, [recordingKey]: combo };
      setSettings((prev) => mergeExtensionPatch(prev, { keybindings: next }));
      void saveExtensionPatch({ keybindings: next });
      setRecordingKey(null);
    };
    window.addEventListener('keydown', onCapture, { capture: true });
    return () => window.removeEventListener('keydown', onCapture, { capture: true });
  }, [recordingKey, settings.keybindings]);

  useEffect(() => {
    const onResize = () => setDisplayInfo(detectDisplayProfile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    void loadSplitSettings().then(setSettings);
    void loadLogbook().then(setLogbook);
    const unsubSettings = subscribeSettings(setSettings);
    const unsubLogbook = subscribeLogbook(setLogbook);

    const poll = () => {
      void getOpenGeoFSTabs().then((tabs) => {
        setGeofsTabs(tabs);
        const targetId =
          selectedTabId !== undefined && tabs.some((t) => t.id === selectedTabId) ? selectedTabId : tabs[0]?.id;
        void requestActiveTabTelemetry(targetId).then(setLive);
        void requestActiveTabDiagnostics(targetId).then((entries) => {
          if (entries.length) setDiags(entries);
        });
      });
    };
    poll();

    const onRuntimeMessage = (msg: { type?: string; telemetry?: LiveTelemetrySummary; entry?: DiagEntry }) => {
      if (msg?.type === 'GEOFS_EXT_LIVE_TELEMETRY_EVENT' && msg.telemetry) {
        setLive(msg.telemetry);
      } else if (msg?.type === 'GEOFS_EXT_DIAG_EVENT' && msg.entry) {
        const incoming = msg.entry;
        setDiags((prev) => {
          if (prev.some((d) => d.time === incoming.time && d.code === incoming.code)) return prev;
          return [...prev.slice(-49), incoming];
        });
      }
    };
    chrome.runtime?.onMessage?.addListener(onRuntimeMessage);

    const timer = setInterval(poll, 1500);
    return () => {
      clearInterval(timer);
      unsubSettings();
      unsubLogbook();
      chrome.runtime?.onMessage?.removeListener(onRuntimeMessage);
    };
  }, [selectedTabId]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
  }, [settings.themeMode]);

  const patchExt = (patch: Partial<ExtensionSettings>) => {
    setSettings((prev) => mergeExtensionPatch(prev, patch));
    void saveExtensionPatch(patch);
  };

  const patchScr = (patch: Partial<ExtensionSettings>) => {
    setSettings((prev) => mergeExtensionPatch(prev, patch));
    void saveScriptPatch(patch);
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
  const activeTab = geofsTabs.find((t) => t.id === selectedTabId) ?? geofsTabs[0];

  return (
    <div class="surface-shell">
      <div class="header">
        <div>
          <div class="title">GeoFS Extension Settings</div>
          <div class="muted-hint">
            All changes save automatically and sync live with any open GeoFS flight tab.
          </div>
        </div>
        <div class="chip-group">
          <span class={`badge ${live?.simMajor ? 'badge--ok' : ''}`}>
            {live?.simMajor ? `Live · GeoFS V${live.simMajor}` : 'GeoFS Standby'}
          </span>
          <span class="badge">{os.toUpperCase()}</span>
        </div>
      </div>

      <div class={`sync-banner ${activeTab ? 'sync-banner--live' : ''}`}>
        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
          <span class={`sync-dot ${activeTab ? 'sync-dot--live' : ''}`} />
          {activeTab ? (
            <div style="min-width:0">
              <strong>Synced with GeoFS</strong>
              {live?.aircraftProfile ? (
                <span style="color:var(--muted)">
                  {' '}
                  · {live.aircraftProfile.name} · {live.kias ?? '--'} kt · {live.altitude ?? '--'} ft
                </span>
              ) : (
                <span style="color:var(--muted)"> · Connected to open simulator tab</span>
              )}
            </div>
          ) : (
            <span style="color:var(--muted)">
              No GeoFS tab detected. Adjustments are saved and will apply as soon as you open GeoFS.
            </span>
          )}
        </div>
        {activeTab && (
          <div style="display:flex;align-items:center;gap:6px">
            {geofsTabs.length > 1 && (
              <select
                aria-label="Select GeoFS Tab"
                value={activeTab.id}
                onChange={(e) => setSelectedTabId(Number((e.target as HTMLSelectElement).value))}
              >
                {geofsTabs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.url.includes('beta.') ? 'GeoFS V4' : 'GeoFS V3'} · {t.title.slice(0, 24)}
                  </option>
                ))}
              </select>
            )}
            <button type="button" class="chip-btn active" onClick={() => void focusGeoFSTab(activeTab.id)}>
              Jump to GeoFS
            </button>
          </div>
        )}
      </div>

      {live?.aircraftProfile && (
        <AircraftEditor key={`live-${live.aircraftProfile.id}`} profile={live.aircraftProfile} />
      )}

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
            <div class="section-heading">Modules</div>
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
                    <div class="muted-hint">{m.desc}</div>
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
              <div class="section-heading">Display &amp; Interface</div>
              <div class="field-row">
                <HelpLabel label="Theme Appearance" tip={SETTING_TIPS.themeMode} />
                <select
                  value={settings.themeMode}
                  onChange={(e) => patchExt({ themeMode: (e.target as HTMLSelectElement).value as ThemeMode })}
                >
                  <option value="auto">Auto (Match GeoFS)</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div class="field-row">
                <HelpLabel label="HUD Display Scaling" tip={SETTING_TIPS.calibratorPreset} />
                <select
                  aria-label="Screen Calibrator"
                  value={settings.calibratorPreset}
                  onChange={(e) =>
                    patchExt({ calibratorPreset: (e.target as HTMLSelectElement).value as CalibratorPreset })
                  }
                >
                  <option value="auto">
                    Auto · {displayInfo.label} ({displayInfo.resolution})
                  </option>
                  <option value="1080p">Manual: 1080p FHD (1.0x)</option>
                  <option value="1440p">Manual: 1440p QHD (1.1x)</option>
                  <option value="4k">Manual: 4K UHD (1.35x)</option>
                  <option value="ultrawide">Manual: Ultrawide (1.08x)</option>
                  <option value="laptop">Manual: Laptop (0.9x)</option>
                </select>
              </div>
              <div class="muted-hint">
                Detected screen: {displayInfo.resolution} → {displayInfo.scale}x scale
              </div>
              <label class="switch-row">
                <HelpLabel label="Show Startup Notification" tip={SETTING_TIPS.showStartupDiagnostics} />
                <input
                  type="checkbox"
                  checked={settings.showStartupDiagnostics}
                  onChange={(e) => patchExt({ showStartupDiagnostics: (e.target as HTMLInputElement).checked })}
                />
              </label>
              <label class="switch-row">
                <HelpLabel label="Live Side Panel Updates" tip={SETTING_TIPS.sidePanelAutoTelemetry} />
                <input
                  type="checkbox"
                  checked={settings.sidePanelAutoTelemetry}
                  onChange={(e) => patchExt({ sidePanelAutoTelemetry: (e.target as HTMLInputElement).checked })}
                />
              </label>
              <label class="switch-row">
                <HelpLabel label="Backup Autopilot Bar Placement" tip={SETTING_TIPS.hudPositionFallback} />
                <input
                  type="checkbox"
                  checked={settings.hudPositionFallback}
                  onChange={(e) => patchExt({ hudPositionFallback: (e.target as HTMLInputElement).checked })}
                />
              </label>
            </div>

            <div class="panel-card">
              <div class="section-heading">Keyboard &amp; OS Adapter ({effectiveOs.toUpperCase()})</div>

              <div class="field-row">
                <HelpLabel label="OS Keyboard Profile" tip={SETTING_TIPS.keyboardOsProfile} />
                <select
                  aria-label="OS Keyboard Profile"
                  value={settings.keyboardOsProfile}
                  onChange={(e) =>
                    patchExt({ keyboardOsProfile: (e.target as HTMLSelectElement).value as KeyboardOsProfile })
                  }
                >
                  <option value="auto">Auto ({os.toUpperCase()})</option>
                  <option value="mac">macOS</option>
                  <option value="windows">Windows</option>
                  <option value="linux">Linux</option>
                </select>
              </div>

              {effectiveOs === 'mac' && (
                <div class="field-row">
                  <HelpLabel label="Mac Keyboard Hardware" tip={SETTING_TIPS.macKeyboardType} />
                  <select
                    aria-label="Mac Keyboard Hardware"
                    value={settings.macKeyboardType ?? ''}
                    onChange={(e) => {
                      const val = (e.target as HTMLSelectElement).value;
                      patchExt({ macKeyboardType: val ? (val as MacKeyboardType) : null });
                    }}
                  >
                    <option value="">Select Mac keyboard...</option>
                    <option value="macbook">MacBook / Compact (No Numpad or Del)</option>
                    <option value="magic">Apple Magic (With Numpad &amp; Forward Del)</option>
                  </select>
                </div>
              )}

              <label class="switch-row">
                <HelpLabel label="Sim Keystroke Translator" tip={SETTING_TIPS.simKeyTranslatorEnabled} />
                <input
                  type="checkbox"
                  checked={settings.simKeyTranslatorEnabled}
                  onChange={(e) => patchExt({ simKeyTranslatorEnabled: (e.target as HTMLInputElement).checked })}
                />
              </label>

              <div class="section-heading" style="margin-top:4px">
                Extension Shortcuts (Click Record or Type)
              </div>
              {(Object.keys(settings.keybindings) as Array<keyof KeybindConfig>).map((k) => {
                const collision = detectGeoFSKeyCollision(settings.keybindings[k]);
                const isRec = recordingKey === k;
                return (
                  <div class="field-col" key={k} style="gap:2px">
                    <div class="field-row">
                      <span>{KEYBIND_LABELS[k] ?? k}</span>
                      <div style="display:flex;gap:4px;align-items:center">
                        <input
                          type="text"
                          style={`width:110px;text-align:right;${collision ? 'border-color:#ef4444' : ''}`}
                          value={formatComboForOs(settings.keybindings[k], effectiveOs)}
                          onChange={(e) =>
                            patchExt({
                              keybindings: {
                                ...settings.keybindings,
                                [k]: normalizeComboString((e.target as HTMLInputElement).value)
                              }
                            })
                          }
                        />
                        <button
                          type="button"
                          class={`chip-btn ${isRec ? 'active' : ''}`}
                          onClick={() => setRecordingKey(isRec ? null : k)}
                        >
                          {isRec ? 'Press keys...' : 'Record'}
                        </button>
                      </div>
                    </div>
                    {collision && <div style="font-size:10px;color:#ef4444;text-align:right">{collision}</div>}
                  </div>
                );
              })}

              {settings.simKeyTranslatorEnabled && (
                <details style="margin-top:4px">
                  <summary style="cursor:pointer;font-size:11px;font-weight:700;color:var(--muted)">
                    Active Sim Key Translations (
                    {
                      Object.keys(
                        resolveEffectiveSimRemaps(
                          settings.keyboardOsProfile,
                          settings.macKeyboardType,
                          settings.simKeyRemaps
                        )
                      ).length
                    }
                    )
                  </summary>
                  <div class="field-col" style="margin-top:6px;gap:4px">
                    {Object.entries(
                      resolveEffectiveSimRemaps(
                        settings.keyboardOsProfile,
                        settings.macKeyboardType,
                        settings.simKeyRemaps
                      )
                    ).map(([src, dst]) => (
                      <div class="field-row" key={src} style="font-size:10px">
                        <span>
                          <code>{formatComboForOs(src, effectiveOs)}</code> → <strong>{dst}</strong>
                        </span>
                        {settings.simKeyRemaps[src] !== undefined && (
                          <button
                            type="button"
                            class="chip-btn"
                            onClick={() => {
                              const next = { ...settings.simKeyRemaps };
                              delete next[src];
                              patchExt({ simKeyRemaps: next });
                            }}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    ))}
                    <div class="field-row" style="margin-top:4px">
                      <input
                        type="text"
                        placeholder="e.g. Alt+Q"
                        style="width:100px"
                        value={newRemapSource}
                        onInput={(e) => setNewRemapSource((e.target as HTMLInputElement).value)}
                      />
                      <select
                        value={newRemapTarget}
                        onChange={(e) => setNewRemapTarget((e.target as HTMLSelectElement).value)}
                      >
                        {Object.keys(SIM_TARGET_KEYS).map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        class="chip-btn"
                        onClick={() => {
                          const norm = normalizeComboString(newRemapSource);
                          if (!norm) return;
                          patchExt({ simKeyRemaps: { ...settings.simKeyRemaps, [norm]: newRemapTarget } });
                          setNewRemapSource('');
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </details>
              )}
            </div>

            <div class="panel-card">
              <div class="section-heading">Satellite Map Imagery</div>
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
            <div class="section-heading">Autothrottle &amp; Auto-Boost</div>
            <div class="field-row">
              <HelpLabel
                label={`Throttle Response (${settings.autothrottleResponsiveness.toFixed(1)}x)`}
                tip={SETTING_TIPS.autothrottleResponsiveness}
              />
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
              <HelpLabel label="OP-SYNC Engagement Policy" tip={SETTING_TIPS.opSyncPolicy} />
              <select
                value={settings.opSyncPolicy}
                onChange={(e) => patchScr({ opSyncPolicy: (e.target as HTMLSelectElement).value as OpSyncPolicy })}
              >
                <option value="ask">Ask When Large Speed Jump Detected</option>
                <option value="allow">Always Allow Auto-Boost</option>
                <option value="never">Never Allow (Standard Engine Only)</option>
              </select>
            </div>
            <div class="field-row">
              <HelpLabel label="Speed Jump Threshold (KIAS)" tip={SETTING_TIPS.opDeltaThresholdKts} />
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
            <div class="section-heading">Overpowered Engines &amp; Stability Assist</div>
            <div class="field-row">
              <HelpLabel label="Thrust Multiplier" tip={SETTING_TIPS.opThrustMultiplier} />
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
              <HelpLabel label="Altitude Ceiling (ft)" tip={SETTING_TIPS.opCeilingFeet} />
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
              <HelpLabel label="Stability Assist (SAS)" tip={SETTING_TIPS.opStability} />
              <input
                type="checkbox"
                checked={settings.opStability}
                onChange={(e) => patchScr({ opStability: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <div class="field-row">
              <HelpLabel label={`Stability Strength (${settings.sasStrength.toFixed(1)}x)`} tip={SETTING_TIPS.sasStrength} />
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
            <div class="section-heading">Checklists &amp; Fuel Behavior</div>
            <label class="switch-row">
              <HelpLabel label="Auto-Advance Completed Stages" tip={SETTING_TIPS.checklistAutoAdvance} />
              <input
                type="checkbox"
                checked={settings.checklistAutoAdvance}
                onChange={(e) => patchScr({ checklistAutoAdvance: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <label class="switch-row">
              <HelpLabel label="Enforce 4 Mandatory Flight Gates" tip={SETTING_TIPS.checklistEnforceMandatoryGates} />
              <input
                type="checkbox"
                checked={settings.checklistEnforceMandatoryGates}
                onChange={(e) =>
                  patchScr({ checklistEnforceMandatoryGates: (e.target as HTMLInputElement).checked })
                }
              />
            </label>
            <label class="switch-row">
              <HelpLabel label="Altitude Burn (Realistic Fuel Flow)" tip={SETTING_TIPS.fuelDynamicSfc} />
              <input
                type="checkbox"
                checked={settings.fuelDynamicSfc}
                onChange={(e) => patchScr({ fuelDynamicSfc: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <label class="switch-row">
              <HelpLabel label="Real Wing Tanks (Fuel Imbalance)" tip={SETTING_TIPS.fuelRealisticTanks} />
              <input
                type="checkbox"
                checked={settings.fuelRealisticTanks}
                onChange={(e) => patchScr({ fuelRealisticTanks: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <label class="switch-row">
              <HelpLabel label="Auto-Refuel on Empty" tip={SETTING_TIPS.fuelAutoRefuel} />
              <input
                type="checkbox"
                checked={settings.fuelAutoRefuel}
                onChange={(e) => patchScr({ fuelAutoRefuel: (e.target as HTMLInputElement).checked })}
              />
            </label>
          </div>

          <div class="panel-card">
            <div class="section-heading">Failures, Landing Card &amp; Flight Path</div>
            <label class="switch-row">
              <HelpLabel label="Enable Random Failures" tip={SETTING_TIPS.failureProbabilitiesEnabled} />
              <input
                type="checkbox"
                checked={settings.failureProbabilitiesEnabled}
                onChange={(e) =>
                  patchScr({ failureProbabilitiesEnabled: (e.target as HTMLInputElement).checked })
                }
              />
            </label>
            <div class="field-row">
              <HelpLabel label="Failure Check Interval (sec)" tip={SETTING_TIPS.failureProbabilityIntervalSec} />
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
              <HelpLabel
                label={`Base Recovery Success Chance (${settings.failureRecoveryChancePct}%)`}
                tip={SETTING_TIPS.failureRecoveryChancePct}
              />
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
                  <span>{sys.label} ({chancePct}%)</span>
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
              <HelpLabel label="Auto-Close Landing Scorecard" tip={SETTING_TIPS.landingReportAutoClose} />
              <input
                type="checkbox"
                checked={settings.landingReportAutoClose}
                onChange={(e) => patchScr({ landingReportAutoClose: (e.target as HTMLInputElement).checked })}
              />
            </label>
            <div class="field-row">
              <HelpLabel label="Scorecard Display Time (sec)" tip={SETTING_TIPS.landingReportSeconds} />
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
              <HelpLabel
                label={`FPV Marker Distance (${settings.fpvProjectionFactor})`}
                tip={SETTING_TIPS.fpvProjectionFactor}
              />
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
              <HelpLabel label="FPV Marker Quality" tip={SETTING_TIPS.fpvResolutionMode} />
              <select
                value={settings.fpvResolutionMode}
                onChange={(e) =>
                  patchScr({ fpvResolutionMode: (e.target as HTMLSelectElement).value as FpvResolutionMode })
                }
              >
                <option value="auto">Auto (Best for Screen)</option>
                <option value="hires">Force High-Res</option>
                <option value="lowres">Force Low-Res (Faster)</option>
              </select>
            </div>
          </div>

          <div class="panel-card" style="grid-column: 1 / -1">
            <div class="section-heading">Realism &amp; Audio Effects</div>
            <div class="surface-grid-2">
              {REALISM_OPTION_META.filter((item) => !(isV4 && item.v4Unavailable)).map((item) => (
                <label class="switch-row" key={item.key}>
                  <HelpLabel
                    label={item.label}
                    tip={SETTING_TIPS[`realism.${item.key}`]}
                    badge={item.v4Unavailable ? 'V3 Only' : undefined}
                  />
                  <input
                    type="checkbox"
                    checked={Boolean(settings.realismOptions[item.key])}
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
              ))}
            </div>
            <div class="surface-grid-2" style="margin-top:12px;">
              <div class="field-row">
                <HelpLabel label="Headlight Mode" tip={SETTING_TIPS['realism.headlightMode']} />
                <select
                  value={settings.headlightMode}
                  onChange={(e) => patchScr({ headlightMode: (e.target as HTMLSelectElement).value as 'auto' | 'on' | 'off' })}
                >
                  <option value="auto">Auto (Night Only)</option>
                  <option value="on">Always On</option>
                  <option value="off">Off</option>
                </select>
              </div>
              <div class="field-row">
                <HelpLabel label={`Light Intensity (${settings.lightIntensity.toFixed(1)}×)`} tip={SETTING_TIPS['realism.lightIntensity']} />
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  value={settings.lightIntensity}
                  onInput={(e) => patchScr({ lightIntensity: Number((e.target as HTMLInputElement).value) })}
                />
              </div>
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
                      <th>Stars</th>
                      <th>Session</th>
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
                      <tr
                        key={rec.id}
                        title={
                          rec.phaseCritique
                            ? `${rec.phaseCritique.departure} | ${rec.phaseCritique.cruise} | ${rec.phaseCritique.approach}`
                            : undefined
                        }
                      >
                        <td>{new Date(rec.timestamp).toLocaleString()}</td>
                        <td>{rec.aircraftName}</td>
                        <td>{rec.rating}</td>
                        <td>{rec.stars ? '★'.repeat(rec.stars) + '☆'.repeat(5 - rec.stars) : '--'}</td>
                        <td>
                          {rec.authenticFlight === undefined ? (
                            '--'
                          ) : (
                            <span class={`badge ${rec.authenticFlight ? 'badge--ok' : ''}`}>
                              {rec.authenticFlight ? 'Authentic' : 'Practice'}
                            </span>
                          )}
                        </td>
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
            <div class="section-heading">Session Diagnostic Log</div>
            <div class="diag-feed">
              {diags.length === 0 ? (
                <div style="color:var(--muted)">Waiting for GeoFS telemetry stream...</div>
              ) : (
                diags
                  .slice()
                  .reverse()
                  .map((entry, idx) => (
                    <div
                      class={`diag-line ${
                        entry.level === 'error' ? 'diag-line--error' : entry.level === 'warn' ? 'diag-line--warn' : ''
                      }`}
                      key={`${entry.time}-${idx}`}
                    >
                      <span style="color:var(--accent)">[{entry.time.slice(11, 19)}]</span>{' '}
                      {entry.level === 'error' && <span style="color:#ef4444;font-weight:700">[ERROR] </span>}
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
