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
import { triggerDownload } from '../core/logbook-export';
import { getAllCatalogAircraft, type StaticAircraftSpec } from '../core/sim-adapter';
import { getMandatoryProcedures } from '../modules/checklist-system/procedures';
import { AircraftEditor } from '../shared/aircraft-editor';
import { detectDisplayProfile } from '../shared/display-calibrator';
import { HelpLabel, SETTING_TIPS } from '../shared/help-tip';
import {
  MODULE_CATEGORY_META,
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
import { UpdateBanner } from '../shared/update-banner';
import {
  checkForExtensionUpdate,
  getCachedUpdateInfo,
  getCurrentExtensionVersion,
  type UpdateInfo
} from '../shared/update-checker';
import type { AircraftCategory, AircraftProfile } from '../types/module';
import {
  DEFAULT_SETTINGS,
  splitSettings,
  type CalibratorPreset,
  type ExtensionSettings,
  type ImageryProviderMode,
  type KeybindConfig,
  type KeyboardOsProfile,
  type LandingRecord,
  type MacKeyboardType,
  type ThemeMode
} from '../types/settings';
import { CatalogTab } from './catalog-tab';
import { LogbookTab } from './logbook-tab';
import { ScriptTab } from './script-tab';

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
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [updateStatus, setUpdateStatus] = useState('');
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
    void getCachedUpdateInfo().then(setUpdateInfo);
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

  const applyPreset = (mode: 'all' | 'ifr' | 'vfr' | 'minimal' | 'none') => {
    const nextModules: Record<string, boolean> = {};
    for (const m of MODULE_META) {
      if (mode === 'all') nextModules[m.id] = true;
      else if (mode === 'none') nextModules[m.id] = false;
      else if (mode === 'ifr') {
        nextModules[m.id] = [
          'autothrottle',
          'information-display',
          'checklist-system',
          'fuel-simulator',
          'landing-statistics',
          'flight-path-vector',
          'realism-pack',
          'gate-spawner'
        ].includes(m.id);
      } else if (mode === 'vfr') {
        nextModules[m.id] = [
          'information-display',
          'landing-statistics',
          'flight-path-vector',
          'realism-pack',
          'gate-spawner'
        ].includes(m.id);
      } else {
        nextModules[m.id] = ['information-display', 'autothrottle', 'landing-statistics'].includes(m.id);
      }
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
          <button
            type="button"
            class="btn-sm"
            onClick={async () => {
              setUpdateStatus('Checking...');
              const info = await checkForExtensionUpdate(true);
              setUpdateInfo(info);
              setUpdateStatus(info ? `Update v${info.latestVersion} found!` : `Up to date (v${getCurrentExtensionVersion()})`);
            }}
          >
            Check Updates
          </button>
        </div>
      </div>

      {updateStatus && !updateInfo && (
        <div class="muted-hint" style="margin-bottom:6px;text-align:right;font-size:11px;">
          {updateStatus}
        </div>
      )}

      <UpdateBanner info={updateInfo} showNotes />

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
              <button type="button" class="btn-sm" onClick={() => applyPreset('ifr')}>
                Airliner IFR
              </button>
              <button type="button" class="btn-sm" onClick={() => applyPreset('vfr')}>
                VFR / Glider
              </button>
              <button type="button" class="btn-sm" onClick={() => applyPreset('minimal')}>
                Minimal
              </button>
              <button type="button" class="btn-sm" onClick={() => applyPreset('none')}>
                All Off
              </button>
            </div>
            <div class="list">
              {MODULE_CATEGORY_META.map((cat) => {
                const items = MODULE_META.filter((m) => m.category === cat.id);
                if (!items.length) return null;
                return (
                  <div key={cat.id} style="display:flex;flex-direction:column;gap:4px;margin-top:6px">
                    <div style="font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--muted);padding-bottom:2px;border-bottom:1px solid var(--border)">
                      {cat.label}
                    </div>
                    {items.map((m) => (
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
                );
              })}
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

            <div class="panel-card">
              <div class="section-heading">Profile Backup &amp; Share (JSON)</div>
              <div class="muted-hint" style="margin-bottom:8px;">
                Export your modules, keybindings, realism toggles, and custom aircraft overrides to a shareable JSON file, or import a saved profile.
              </div>
              <div class="chip-group">
                <button
                  type="button"
                  class="btn-sm"
                  onClick={() =>
                    triggerDownload(
                      `geofs-extension-profile-${new Date().toISOString().slice(0, 10)}.json`,
                      JSON.stringify(settings, null, 2),
                      'application/json'
                    )
                  }
                >
                  Export Profile JSON
                </button>
                <label class="btn-sm" style="cursor:pointer;display:inline-flex;align-items:center;">
                  Import Profile JSON
                  <input
                    type="file"
                    accept="application/json,.json"
                    style="display:none;"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        try {
                          const parsed = JSON.parse(String(reader.result || '{}')) as Partial<ExtensionSettings>;
                          const merged = mergeExtensionPatch(DEFAULT_SETTINGS, parsed);
                          setSettings(merged);
                          const { extensionConfig, scriptConfig } = splitSettings(merged);
                          void saveExtensionPatch(extensionConfig);
                          void saveScriptPatch(scriptConfig);
                          setUpdateStatus(`Imported profile "${file.name}"`);
                        } catch {
                          setUpdateStatus('Invalid profile JSON file.');
                        }
                      };
                      reader.readAsText(file);
                      (e.target as HTMLInputElement).value = '';
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'script' && <ScriptTab settings={settings} isV4={isV4} patchScr={patchScr} />}

      {tab === 'catalog' && (
        <CatalogTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          filteredCatalog={filteredCatalog}
          selectedSpec={selectedSpec}
          setSelectedId={setSelectedId}
          selectedProfile={selectedProfile}
          selectedProcedures={selectedProcedures}
        />
      )}

      {tab === 'logbook' && (
        <LogbookTab
          logbook={logbook}
          avgScore={avgScore}
          diags={diags}
          live={live}
          onExportVerificationBundle={exportVerificationBundle}
          onClearLogbook={() => {
            setLogbook([]);
            void clearLogbook();
          }}
        />
      )}
    </div>
  );
}
