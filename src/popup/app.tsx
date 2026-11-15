import { parseAircraftOverrides } from '../core/aircraft-profile';
import { landingReplayCsv } from '../core/landing-replay';
import { AircraftEditor } from './aircraft-editor';
import type { AircraftProfile } from '../types/module';
import { useEffect, useState } from 'preact/hooks';
import {
  DEFAULT_SETTINGS,
  type CalibratorPreset,
  type ExtensionSettings,
  type ImageryProviderMode,
  type LandingRecord,
  type ThemeMode
} from '../types/settings';
import { detectGeoFSKeyCollision, detectOsPlatform, formatComboForOs } from '../core/keybind-manager';
import { formatLogbookCsv, triggerDownload } from '../core/logbook-export';
import type { AircraftCategory } from '../types/module';

const SETTINGS_KEY = 'geofs_ext_settings';
const LOGBOOK_KEY = 'geofs_ext_logbook';

const MODULE_META: Array<{ id: string; name: string; desc: string }> = [
  { id: 'autothrottle', name: 'Autothrottle', desc: 'Aircraft-class PID & touchdown retard' },
  { id: 'information-display', name: 'Information Display', desc: 'HUD telemetry & multi-engine % THR' },
  { id: 'fuel-simulator', name: 'Fuel Simulator', desc: 'Multi-engine SFC & tank burn' },
  { id: 'overpowered-engines', name: 'Overpowered Engines', desc: 'Live engine thrust multiplier' },
  { id: 'checklist-system', name: 'Checklist System', desc: 'Type-aware auto-sync checklists' },
  { id: 'realism-pack', name: 'Realism Pack', desc: 'Adaptive V3/V4 shaders & G-audio' },
  { id: 'failure-simulator', name: 'Failure Simulator', desc: 'Manual & probability failures' },
  { id: 'flight-path-vector', name: 'Flight Path Vector', desc: 'SVG 3D flight path marker' },
  { id: 'landing-statistics', name: 'Landing Statistics', desc: 'Touchdown grading & logbook' },
  { id: 'satellite-imagery', name: 'Satellite Imagery', desc: 'Configurable tile providers' }
];

interface LiveTelemetrySummary {
  simMajor?: number;
  aircraftProfile?: AircraftProfile | null;
  kias?: number;
  altitude?: number;
  vs?: number;
}

export function App() {
  const [tab, setTab] = useState<'modules' | 'logbook' | 'setup'>('modules');
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [logbook, setLogbook] = useState<LandingRecord[]>([]);
  const [live, setLive] = useState<LiveTelemetrySummary | null>(null);
  const [overrideKey, setOverrideKey] = useState('');
  const [overrideCat, setOverrideCat] = useState<AircraftCategory>('airliner-twin');
  const [overrideVref, setOverrideVref] = useState('135');
  const [overrideVne, setOverrideVne] = useState('340');
  const os = detectOsPlatform();

  useEffect(() => {
    chrome.storage?.sync?.get([SETTINGS_KEY], (res) => {
      const raw = res?.[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined;
      if (raw) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...raw,
          modules: { ...DEFAULT_SETTINGS.modules, ...(raw.modules || {}) },
          keybindings: { ...DEFAULT_SETTINGS.keybindings, ...(raw.keybindings || {}) },
          aircraftOverrides: parseAircraftOverrides(raw.aircraftOverrides)
        });
      }
    });

    chrome.storage?.local?.get([LOGBOOK_KEY], (res) => {
      if (Array.isArray(res?.[LOGBOOK_KEY])) {
        setLogbook(res[LOGBOOK_KEY] as LandingRecord[]);
      }
    });

    const refreshLogbook = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === 'local' && changes[LOGBOOK_KEY]) {
        const records: unknown = changes[LOGBOOK_KEY].newValue;
        setLogbook(Array.isArray(records) ? records : []);
      }
    };
    chrome.storage.onChanged.addListener(refreshLogbook);

    const queryLive = () => {
      chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs?.[0]?.id;
        if (tabId === undefined) {
          setLive(null);
          return;
        }
        chrome.tabs.sendMessage(tabId, { type: 'GET_LIVE_TELEMETRY' }, (resp) => {
          if (chrome.runtime.lastError) {
            setLive(null);
            return;
          }
          setLive((resp?.telemetry as LiveTelemetrySummary | undefined) ?? null);
        });
      });
    };

    queryLive();
    const timer = setInterval(queryLive, 1000);
    return () => {
      clearInterval(timer);
      chrome.storage.onChanged.removeListener(refreshLogbook);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
  }, [settings.themeMode]);

  const saveSettings = (next: ExtensionSettings) => {
    setSettings(next);
    chrome.storage?.sync?.set({ [SETTINGS_KEY]: next }, () => {
      if (chrome.runtime.lastError) return;
      chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs?.[0]?.id;
        if (tabId === undefined) return;
        chrome.tabs.sendMessage(tabId, { type: 'GEOFS_EXT_APPLY_SETTINGS' }, () => {
          void chrome.runtime.lastError;
        });
      });
    });
  };

  const toggleModule = (id: string) => {
    saveSettings({
      ...settings,
      modules: { ...settings.modules, [id]: !settings.modules[id] }
    });
  };

  const applyPreset = (mode: 'all' | 'minimal' | 'none') => {
    const nextModules: Record<string, boolean> = {};
    for (const m of MODULE_META) {
      if (mode === 'all') nextModules[m.id] = true;
      else if (mode === 'none') nextModules[m.id] = false;
      else nextModules[m.id] = ['information-display', 'autothrottle', 'landing-statistics'].includes(m.id);
    }
    saveSettings({ ...settings, modules: nextModules });
  };

  const exportLanding = (record: LandingRecord, format: 'json' | 'csv') => {
    const data = format === 'json' ? JSON.stringify(record, null, 2) : landingReplayCsv(record);
    const type = format === 'json' ? 'application/json' : 'text/csv;charset=utf-8';
    const url = URL.createObjectURL(new Blob([data], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `geofs-landing-${record.id}.${format}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const clearLogbook = () => {
    setLogbook([]);
    chrome.storage?.local?.set({ [LOGBOOK_KEY]: [] });
  };

  return (
    <div class="popup-shell">
      <div class="header">
        <span class="title">GEOFS EXTENSION</span>
        <span class="badge">
          {live?.simMajor ? `GeoFS V${live.simMajor}` : 'Standby'} • {os.toUpperCase()}
        </span>
      </div>

      <p class="reload-notice">Reload the GeoFS tab after installing or updating the extension to activate the addons.</p>

      {live && (
        <div class="telemetry-strip">
          <div><div style="color:var(--muted);font-size:10px">KIAS</div><strong>{live.kias ?? '--'}</strong></div>
          <div><div style="color:var(--muted);font-size:10px">ALT</div><strong>{live.altitude ?? '--'}</strong></div>
          <div><div style="color:var(--muted);font-size:10px">V/S</div><strong>{live.vs ?? '--'}</strong></div>
        </div>
      )}

      <div class="tabs">
        <button class={`tab-btn ${tab === 'modules' ? 'active' : ''}`} onClick={() => setTab('modules')}>Modules</button>
        <button class={`tab-btn ${tab === 'logbook' ? 'active' : ''}`} onClick={() => setTab('logbook')}>Logbook ({logbook.length})</button>
        <button class={`tab-btn ${tab === 'setup' ? 'active' : ''}`} onClick={() => setTab('setup')}>Setup</button>
      </div>

      {tab === 'modules' && (
        <>
          <div class="preset-row">
            <button class="btn-sm" onClick={() => applyPreset('all')}>All On</button>
            <button class="btn-sm" onClick={() => applyPreset('minimal')}>Minimal</button>
            <button class="btn-sm" onClick={() => applyPreset('none')}>All Off</button>
          </div>
          <div class="list">
            {MODULE_META.map((m) => (
              <label class="card" key={m.id} style="cursor:pointer">
                <div>
                  <div style="font-weight:700">{m.name}</div>
                  <div style="font-size:10px;color:var(--muted)">{m.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.modules[m.id])}
                  onChange={() => toggleModule(m.id)}
                />
              </label>
            ))}
          </div>
        </>
      )}

      {tab === 'logbook' && (
        <div class="field-col">
          <div class="preset-row">
            <button
              class="btn-sm"
              disabled={logbook.length === 0}
              onClick={() => triggerDownload('geofs-landing-logbook.json', JSON.stringify(logbook, null, 2), 'application/json')}
            >
              Export JSON
            </button>
            <button
              class="btn-sm"
              disabled={logbook.length === 0}
              onClick={() => triggerDownload('geofs-landing-logbook.csv', formatLogbookCsv(logbook), 'text/csv')}
            >
              Export CSV
            </button>
            <button class="btn-sm" onClick={clearLogbook}>Clear History</button>
          </div>
          <div class="list">
            {logbook.length === 0 && (
              <div class="card" style="justify-content:center;color:var(--muted)">No recorded landings yet.</div>
            )}
            {logbook.map((rec) => (
              <div class="card" key={rec.id} style="flex-direction:column;align-items:stretch;gap:3px">
                <div class="field-row">
                  <strong>{rec.aircraftName}</strong>
                  <span class="badge">{rec.rating}</span>
                </div>
                <div style="font-size:10px;color:var(--muted)">
                  {rec.vsFpm} fpm • {rec.gForce}G • {rec.groundSpeedKts} kts • {new Date(rec.timestamp).toLocaleString()}
                </div>
                <div class="preset-row">
                  <button class="btn-sm" onClick={() => exportLanding(rec, 'json')}>Export JSON</button>
                  <button class="btn-sm" onClick={() => exportLanding(rec, 'csv')}>Export CSV</button>
                </div>
                {!rec.replay?.length && <small>Touchdown summary only</small>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'setup' && (
        <div class="list">
          {live?.aircraftProfile ? (
            <AircraftEditor key={live.aircraftProfile.id} profile={live.aircraftProfile} />
          ) : (
            <div class="card">Open GeoFS to edit the active aircraft profile.</div>
          )}
          <div class="card field-row">
            <span>Popup Appearance</span>
            <select
              aria-label="Popup Appearance"
              value={settings.themeMode}
              onChange={(e) => saveSettings({ ...settings, themeMode: (e.target as HTMLSelectElement).value as ThemeMode })}
            >
              <option value="auto">Auto (System)</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div class="card field-row">
            <span>Screen Calibrator</span>
            <select
              value={settings.calibratorPreset}
              onChange={(e) => saveSettings({ ...settings, calibratorPreset: (e.target as HTMLSelectElement).value as CalibratorPreset })}
            >
              <option value="1080p">1080p FHD (1.0x)</option>
              <option value="1440p">1440p QHD (1.1x)</option>
              <option value="4k">4K UHD (1.35x)</option>
              <option value="ultrawide">Ultrawide (1.08x)</option>
              <option value="laptop">Laptop (0.9x)</option>
            </select>
          </div>

          <div class="card field-row">
            <span>A/T Responsiveness ({settings.autothrottleResponsiveness.toFixed(1)}x)</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.autothrottleResponsiveness}
              onInput={(e) => saveSettings({ ...settings, autothrottleResponsiveness: Number((e.target as HTMLInputElement).value) })}
            />
          </div>

          <label class="card field-row" style="cursor:pointer">
            <span>Auto Probability Failures</span>
            <input
              type="checkbox"
              checked={settings.failureProbabilitiesEnabled}
              onChange={(e) => saveSettings({ ...settings, failureProbabilitiesEnabled: (e.target as HTMLInputElement).checked })}
            />
          </label>

          <div class="card field-col" style="align-items:stretch">
            <div class="field-row">
              <span>Imagery Provider</span>
              <select
                value={settings.imageryProvider}
                onChange={(e) => saveSettings({ ...settings, imageryProvider: (e.target as HTMLSelectElement).value as ImageryProviderMode })}
              >
                <option value="native">GeoFS Native</option>
                <option value="osm">OpenStreetMap</option>
                <option value="esri">Esri (API Token)</option>
                <option value="bing">Bing Maps Aerial (API Key)</option>
                <option value="custom">Custom Tile URL</option>
              </select>
            </div>
            {(settings.imageryProvider === 'esri' || settings.imageryProvider === 'bing') && (
              <input
                type="text"
                placeholder={settings.imageryProvider === 'bing' ? 'Bing Maps API Key' : 'Esri ArcGIS API Token'}
                value={settings.customImageryToken}
                onInput={(e) => saveSettings({ ...settings, customImageryToken: (e.target as HTMLInputElement).value })}
              />
            )}
            {settings.imageryProvider === 'custom' && (
              <input
                type="text"
                placeholder="https://tiles.example.com/{z}/{x}/{y}.png"
                value={settings.customImageryUrl}
                onInput={(e) => saveSettings({ ...settings, customImageryUrl: (e.target as HTMLInputElement).value })}
              />
            )}
          </div>

          <div class="card field-col" style="align-items:stretch">
            <div style="font-weight:700">Keybindings ({os.toUpperCase()})</div>
            {(Object.keys(settings.keybindings) as Array<keyof ExtensionSettings['keybindings']>).map((k) => {
              const collision = detectGeoFSKeyCollision(settings.keybindings[k]);
              return (
                <div class="field-col" key={k} style="gap:2px">
                  <div class="field-row">
                    <span style="font-size:10px;color:var(--muted)">{k}</span>
                    <input
                      type="text"
                      style={`width:110px;text-align:right;${collision ? 'border-color:#ef4444' : ''}`}
                      value={formatComboForOs(settings.keybindings[k], os)}
                      onChange={(e) => saveSettings({
                        ...settings,
                        keybindings: { ...settings.keybindings, [k]: (e.target as HTMLInputElement).value }
                      })}
                    />
                  </div>
                  {collision && <div style="font-size:9px;color:#ef4444;text-align:right">{collision}</div>}
                </div>
              );
            })}
          </div>

          <div class="card field-col" style="align-items:stretch;gap:6px">
            <div style="font-weight:700">Aircraft Profile Overrides</div>
            <div class="field-row" style="gap:4px">
              <input
                type="text"
                placeholder="ID or Name (e.g. 242)"
                style="flex:1"
                value={overrideKey}
                onInput={(e) => setOverrideKey((e.target as HTMLInputElement).value)}
              />
              <select
                value={overrideCat}
                onChange={(e) => setOverrideCat((e.target as HTMLSelectElement).value as AircraftCategory)}
              >
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
            <div class="field-row" style="gap:4px">
              <input
                type="number"
                placeholder="Vref"
                style="width:72px"
                value={overrideVref}
                onInput={(e) => setOverrideVref((e.target as HTMLInputElement).value)}
              />
              <input
                type="number"
                placeholder="Vne"
                style="width:72px"
                value={overrideVne}
                onInput={(e) => setOverrideVne((e.target as HTMLInputElement).value)}
              />
              <button
                class="btn-sm"
                onClick={() => {
                  const key = overrideKey.trim().toLowerCase();
                  if (!key) return;
                  saveSettings({
                    ...settings,
                    aircraftOverrides: {
                      ...settings.aircraftOverrides,
                      [key]: {
                        category: overrideCat,
                        vSpeeds: {
                          Vref: Number(overrideVref) || 130,
                          Vne: Number(overrideVne) || 340
                        }
                      }
                    }
                  });
                  setOverrideKey('');
                }}
              >
                Save Override
              </button>
            </div>
            {Object.entries(settings.aircraftOverrides).map(([key, ov]) => (
              <div class="field-row" key={key} style="font-size:10px">
                <span><strong>{key}</strong> • {ov.category || 'auto'} (Vref {ov.vSpeeds?.Vref ?? '--'} / Vne {ov.vSpeeds?.Vne ?? '--'})</span>
                <button
                  class="btn-sm"
                  onClick={() => {
                    const next = { ...settings.aircraftOverrides };
                    delete next[key];
                    saveSettings({ ...settings, aircraftOverrides: next });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
