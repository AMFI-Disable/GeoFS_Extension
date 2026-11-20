import { useEffect, useState } from 'preact/hooks';
import { detectOsPlatform } from '../core/keybind-manager';
import { formatLogbookCsv, triggerDownload } from '../core/logbook-export';
import { AircraftEditor } from '../shared/aircraft-editor';
import {
  MODULE_META,
  loadLogbook,
  loadSplitSettings,
  openOptionsPage,
  openSidePanelFromAction,
  requestActiveTabTelemetry,
  saveExtensionPatch,
  subscribeLogbook,
  subscribeSettings,
  type LiveTelemetrySummary
} from '../shared/settings-store';
import { detectDisplayProfile } from '../shared/display-calibrator';
import {
  DEFAULT_SETTINGS,
  type CalibratorPreset,
  type ExtensionSettings,
  type LandingRecord,
  type ThemeMode
} from '../types/settings';

export function App() {
  const [tab, setTab] = useState<'modules' | 'quick'>(() => {
    try {
      return localStorage.getItem('geofs_ext_popup_tab') === 'quick' ? 'quick' : 'modules';
    } catch {
      return 'modules';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('geofs_ext_popup_tab', tab);
    } catch {
      // ignore storage errors
    }
  }, [tab]);
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [logbook, setLogbook] = useState<LandingRecord[]>([]);
  const [live, setLive] = useState<LiveTelemetrySummary | null>(null);
  const [panelHint, setPanelHint] = useState('');
  const os = detectOsPlatform();

  useEffect(() => {
    void loadSplitSettings().then(setSettings);
    void loadLogbook().then(setLogbook);
    const unsubSettings = subscribeSettings(setSettings);
    const unsubLogbook = subscribeLogbook(setLogbook);

    const poll = () => {
      void requestActiveTabTelemetry().then(setLive);
    };
    poll();
    const timer = setInterval(poll, 1000);
    return () => {
      clearInterval(timer);
      unsubSettings();
      unsubLogbook();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
  }, [settings.themeMode]);

  const toggleModule = (id: string) => {
    const nextModules = { ...settings.modules, [id]: !settings.modules[id] };
    setSettings((prev) => ({ ...prev, modules: nextModules }));
    void saveExtensionPatch({ modules: nextModules }).then(setSettings);
  };

  const applyPreset = (mode: 'all' | 'minimal' | 'none') => {
    const nextModules: Record<string, boolean> = {};
    for (const m of MODULE_META) {
      if (mode === 'all') nextModules[m.id] = true;
      else if (mode === 'none') nextModules[m.id] = false;
      else nextModules[m.id] = ['information-display', 'autothrottle', 'landing-statistics'].includes(m.id);
    }
    setSettings((prev) => ({ ...prev, modules: nextModules }));
    void saveExtensionPatch({ modules: nextModules }).then(setSettings);
  };

  const handleOpenSidePanel = async () => {
    const opened = await openSidePanelFromAction();
    if (!opened) {
      setPanelHint('Use Chrome toolbar Side Panel button to dock cockpit panel.');
    }
  };

  return (
    <div class="popup-shell">
      <div class="header">
        <div style="display:flex;align-items:center;gap:6px;min-width:0">
          <span class="title">GeoFS Ext</span>
          <span class={`badge ${live?.simMajor ? 'badge--ok' : ''}`}>
            {live?.simMajor ? `V${live.simMajor}` : 'STBY'} · {os.toUpperCase()}
          </span>
        </div>
        <div class="header-actions">
          <button
            type="button"
            class="icon-btn icon-btn--accent"
            title="Open Side Panel"
            aria-label="Open Side Panel"
            onClick={() => void handleOpenSidePanel()}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
              <line x1="10" y1="2.5" x2="10" y2="13.5" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn"
            title="Open Full Settings"
            aria-label="Open Full Settings"
            onClick={() => openOptionsPage()}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">
              <circle cx="8" cy="8" r="2.2" />
              <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>

      {panelHint && <p class="reload-notice">{panelHint}</p>}

      {live ? (
        <div class="telemetry-strip" style="grid-template-columns:repeat(4,minmax(0,1fr))">
          <div>
            <div class="telemetry-cell-label">KIAS</div>
            <div class="telemetry-cell-value">{live.kias ?? '--'}</div>
          </div>
          <div>
            <div class="telemetry-cell-label">ALT</div>
            <div class="telemetry-cell-value">{live.altitude ?? '--'}</div>
          </div>
          <div>
            <div class="telemetry-cell-label">V/S</div>
            <div class="telemetry-cell-value">{live.vs ?? '--'}</div>
          </div>
          <div>
            <div class="telemetry-cell-label">FUEL</div>
            <div class="telemetry-cell-value">{live.fuelPct !== undefined ? `${live.fuelPct}%` : '--'}</div>
          </div>
        </div>
      ) : (
        <p class="reload-notice">Reload GeoFS after updating the extension to activate all modules.</p>
      )}

      <div class="tabs">
        <button type="button" class={`tab-btn ${tab === 'modules' ? 'active' : ''}`} onClick={() => setTab('modules')}>
          Modules
        </button>
        <button type="button" class={`tab-btn ${tab === 'quick' ? 'active' : ''}`} onClick={() => setTab('quick')}>
          Quick ({logbook.length})
        </button>
      </div>

      {tab === 'modules' && (
        <>
          <div class="preset-bar">
            <span class="preset-bar-label">Avionics & Addons</span>
            <div class="preset-links">
              <button type="button" class="link-btn" onClick={() => applyPreset('all')}>
                All On
              </button>
              <button type="button" class="link-btn" onClick={() => applyPreset('minimal')}>
                Minimal
              </button>
              <button type="button" class="link-btn" onClick={() => applyPreset('none')}>
                All Off
              </button>
            </div>
          </div>
          <div class="panel-group panel-group--scroll">
            {MODULE_META.map((m) => (
              <label class="module-row" key={m.id}>
                <div style="min-width:0">
                  <div class="module-row-title">{m.name}</div>
                  <div class="module-row-desc">{m.desc}</div>
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

      {tab === 'quick' && (
        <div class="field-col">
          <div class="panel-group">
            <div class="module-row" style="cursor:default">
              <span>HUD Display Size</span>
              <select
                aria-label="Screen Calibrator"
                value={settings.calibratorPreset}
                onChange={(e) => {
                  const preset = (e.target as HTMLSelectElement).value as CalibratorPreset;
                  setSettings((p) => ({ ...p, calibratorPreset: preset }));
                  void saveExtensionPatch({ calibratorPreset: preset }).then(setSettings);
                }}
              >
                <option value="auto">Auto · {detectDisplayProfile().label}</option>
                <option value="1080p">1080p FHD (1.0x)</option>
                <option value="1440p">1440p QHD (1.1x)</option>
                <option value="4k">4K UHD (1.35x)</option>
                <option value="ultrawide">Ultrawide (1.08x)</option>
                <option value="laptop">Laptop (0.9x)</option>
              </select>
            </div>

            <div class="module-row" style="cursor:default">
              <span>Appearance</span>
              <select
                aria-label="Appearance"
                value={settings.themeMode}
                onChange={(e) => {
                  const themeMode = (e.target as HTMLSelectElement).value as ThemeMode;
                  setSettings((p) => ({ ...p, themeMode }));
                  void saveExtensionPatch({ themeMode }).then(setSettings);
                }}
              >
                <option value="auto">Auto (GeoFS Dark)</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          {live?.aircraftProfile && <AircraftEditor key={live.aircraftProfile.id} profile={live.aircraftProfile} />}

          <div class="panel-card">
            <div class="field-row">
              <strong>Recent Touchdowns</strong>
              <span class="badge mono-num">{logbook.length} Logged</span>
            </div>
            {logbook.slice(0, 2).map((rec) => (
              <div class="field-row" key={rec.id} style="font-size:10px;color:var(--muted)">
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                  {rec.aircraftName}
                </span>
                <span class="badge mono-num">
                  {rec.rating} · {rec.vsFpm} fpm
                </span>
              </div>
            ))}
            <div class="preset-row">
              <button
                type="button"
                class="btn-sm"
                disabled={logbook.length === 0}
                onClick={() => triggerDownload('geofs-landing-logbook.csv', formatLogbookCsv(logbook), 'text/csv')}
              >
                Export CSV
              </button>
              <button type="button" class="btn-sm btn-accent" onClick={() => openOptionsPage()}>
                All Script Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
