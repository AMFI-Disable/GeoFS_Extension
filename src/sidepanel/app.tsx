import { useEffect, useState } from 'preact/hooks';
import { resolveEffectiveOs } from '../core/keyboard-translator';
import { REALISM_OPTION_GROUPS, REALISM_OPTION_META } from '../modules/realism-pack';
import { HelpLabel, SETTING_TIPS } from '../shared/help-tip';
import {
  focusGeoFSTab,
  getOpenGeoFSTabs,
  loadSplitSettings,
  mergeExtensionPatch,
  openOptionsPage,
  requestActiveTabDiagnostics,
  requestActiveTabTelemetry,
  saveExtensionPatch,
  saveScriptPatch,
  sendApPpCommand,
  subscribeSettings,
  type DiagEntry,
  type GeoFSTabInfo,
  type LiveTelemetrySummary
} from '../shared/settings-store';
import {
  clearCachedSimBriefOfp,
  fetchSimBriefOfp,
  loadCachedSimBriefOfp,
  type SimBriefOfp
} from '../shared/simbrief';
import { getCachedUpdateInfo, type UpdateInfo } from '../shared/update-checker';
import { ApPpPanel } from './ap-pp-panel';
import {
  DEFAULT_SETTINGS,
  type ExtensionSettings,
  type MacKeyboardType,
  type OpSyncPolicy,
  type RealismOptions
} from '../types/settings';

const OP_SYNC_POLICIES: readonly { id: OpSyncPolicy; label: string }[] = [
  { id: 'ask', label: 'Ask' },
  { id: 'allow', label: 'Auto' },
  { id: 'never', label: 'Off' }
];

const THRUST_PRESETS = [1, 2, 10, 100, 1000, 1000000] as const;

export function App() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [live, setLive] = useState<LiveTelemetrySummary | null>(null);
  const [diags, setDiags] = useState<DiagEntry[]>([]);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [simbriefUser, setSimbriefUser] = useState('');
  const [simbriefOfp, setSimbriefOfp] = useState<SimBriefOfp | null>(null);
  const [simbriefStatus, setSimbriefStatus] = useState('');
  const [panelTab, setActiveTab] = useState<'ap-pp' | 'realism' | 'diag'>(() => {
    try {
      const saved = localStorage.getItem('geofs_ext_sidepanel_tab');
      return saved === 'realism' || saved === 'diag' ? saved : 'ap-pp';
    } catch {
      return 'ap-pp';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('geofs_ext_sidepanel_tab', panelTab);
    } catch {
      // ignore storage errors
    }
  }, [panelTab]);
  const [geofsTabs, setGeofsTabs] = useState<GeoFSTabInfo[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<number | undefined>(undefined);

  useEffect(() => {
    void loadSplitSettings().then(setSettings);
    void getCachedUpdateInfo().then(setUpdateInfo);
    void loadCachedSimBriefOfp().then((ofp) => {
      if (ofp) {
        setSimbriefOfp(ofp);
        setSimbriefUser(ofp.username);
      }
    });
    const unsubSettings = subscribeSettings(setSettings);

    const refreshLive = () => {
      void getOpenGeoFSTabs().then((tabs) => {
        setGeofsTabs(tabs);
        const targetId =
          selectedTabId !== undefined && tabs.some((t) => t.id === selectedTabId) ? selectedTabId : tabs[0]?.id;
        void requestActiveTabTelemetry(targetId).then(setLive);
        void requestActiveTabDiagnostics(targetId).then((entries) => {
          if (entries.length) setDiags(entries.slice(-30));
        });
      });
    };
    refreshLive();

    const onRuntimeMessage = (msg: { type?: string; telemetry?: LiveTelemetrySummary; entry?: DiagEntry }) => {
      if (msg?.type === 'GEOFS_EXT_LIVE_TELEMETRY_EVENT' && msg.telemetry) {
        setLive(msg.telemetry);
      } else if (msg?.type === 'GEOFS_EXT_DIAG_EVENT' && msg.entry) {
        const incoming = msg.entry;
        setDiags((prev) => {
          if (prev.some((d) => d.time === incoming.time && d.code === incoming.code)) return prev;
          return [...prev.slice(-29), incoming];
        });
      }
    };
    chrome.runtime?.onMessage?.addListener(onRuntimeMessage);

    const timer = setInterval(refreshLive, 1200);
    return () => {
      clearInterval(timer);
      unsubSettings();
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

  const patchScript = (patch: Partial<ExtensionSettings>) => {
    setSettings((prev) => mergeExtensionPatch(prev, patch));
    void saveScriptPatch(patch);
  };

  const toggleRealism = (key: keyof RealismOptions) => {
    const nextRealism = { ...settings.realismOptions, [key]: !settings.realismOptions[key] };
    patchScript({ realismOptions: nextRealism });
  };

  const isV4 = live?.simMajor === 4;
  const activeTab = geofsTabs.find((t) => t.id === selectedTabId) ?? geofsTabs[0];
  const effectiveOs = resolveEffectiveOs(settings.keyboardOsProfile);

  return (
    <div class="surface-shell">
      <div class="header">
        <div style="min-width:0">
          <div class="title">Cockpit Companion</div>
          <div class="muted-hint" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            {live?.aircraftProfile ? live.aircraftProfile.name : 'Open GeoFS to sync live flight data'}
          </div>
        </div>
        <div style="display:flex;gap:4px;align-items:center;flex-shrink:0">
          <span class={`badge ${live?.simMajor ? 'badge--ok' : ''}`}>
            {live?.simMajor ? `V${live.simMajor}` : 'Offline'}
          </span>
          {activeTab && !activeTab.active && (
            <button type="button" class="chip-btn" onClick={() => void focusGeoFSTab(activeTab.id)}>
              Focus
            </button>
          )}
          <button type="button" class="btn-sm" onClick={() => openOptionsPage()}>
            Settings
          </button>
        </div>
      </div>

      {updateInfo && (
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 8px;margin-bottom:8px;border-radius:6px;background:rgba(16,185,129,0.14);border:1px solid rgba(16,185,129,0.4);font-size:11px;">
          <span>Update <strong>v{updateInfo.latestVersion}</strong> available</span>
          <a
            href={updateInfo.downloadUrl}
            target="_blank"
            rel="noreferrer"
            style="color:#10b981;font-weight:700;text-decoration:none;white-space:nowrap;"
          >
            Download ↗
          </a>
        </div>
      )}

      {effectiveOs === 'mac' && settings.macKeyboardType === null && (
        <div class="panel-card" style="border-color:var(--accent)">
          <div class="section-heading" style="color:var(--accent-strong)">
            Mac Keyboard Setup
          </div>
          <div class="muted-hint">
            Which Mac keyboard are you using? This tunes PageUp/PageDown, Delete, and Numpad keys for GeoFS.
          </div>
          <div class="preset-row">
            <button
              type="button"
              class="btn-sm btn-accent"
              onClick={() => patchExt({ macKeyboardType: 'macbook' as MacKeyboardType })}
            >
              MacBook / Compact
            </button>
            <button
              type="button"
              class="btn-sm"
              onClick={() => patchExt({ macKeyboardType: 'magic' as MacKeyboardType })}
            >
              Magic (Numpad + Del)
            </button>
          </div>
        </div>
      )}

      {geofsTabs.length > 1 && (
        <div class="field-row" style="font-size:11px">
          <span class="muted-hint">Synced Tab</span>
          <select
            aria-label="Synced GeoFS Tab"
            value={activeTab?.id ?? ''}
            onChange={(e) => setSelectedTabId(Number((e.target as HTMLSelectElement).value))}
          >
            {geofsTabs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.url.includes('beta.') ? 'GeoFS V4' : 'GeoFS V3'} · {t.title.slice(0, 22)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div class="telemetry-strip telemetry-strip--wide">
        <div>
          <div class="telemetry-cell-label">KIAS</div>
          <div class="telemetry-cell-value">{live?.kias ?? '--'}</div>
        </div>
        <div>
          <div class="telemetry-cell-label">MACH</div>
          <div class="telemetry-cell-value">{live?.mach !== undefined ? live.mach.toFixed(2) : '--'}</div>
        </div>
        <div>
          <div class="telemetry-cell-label">ALT</div>
          <div class="telemetry-cell-value">{live?.altitude ?? '--'}</div>
        </div>
        <div>
          <div class="telemetry-cell-label">AGL</div>
          <div class="telemetry-cell-value">{live?.agl ?? '--'}</div>
        </div>
        <div>
          <div class="telemetry-cell-label">V/S</div>
          <div class="telemetry-cell-value">{live?.vs ?? '--'}</div>
        </div>
        <div>
          <div class="telemetry-cell-label">FUEL</div>
          <div class="telemetry-cell-value">{live?.fuelPct !== undefined ? `${live.fuelPct}%` : '--'}</div>
        </div>
      </div>

      <div class="chip-group">
        <span class={`badge ${live?.checklistPending ? 'badge--warn' : 'badge--ok'}`}>
          Gate: {live?.checklistPhase ?? 'PRE-TAKEOFF'} ({live?.checklistPending ?? 0})
        </span>
        <span class={`badge ${live?.sasActive || settings.opStability ? 'badge--ok' : ''}`}>
          SAS: {live?.sasActive || settings.opStability ? 'ON' : 'OFF'}
        </span>
        <span class={`badge ${live?.opSyncActive ? 'badge--info' : ''}`}>
          OP-SYNC: {settings.opSyncPolicy.toUpperCase()}
        </span>
        <span class={`badge ${(live?.activeFailures?.length ?? 0) > 0 ? 'badge--danger' : 'badge--ok'}`}>
          Failures: {live?.activeFailures?.length ?? 0}
        </span>
      </div>

      <div class="tabs" style="margin-bottom:2px">
        <button
          type="button"
          class={`tab-btn ${panelTab === 'ap-pp' ? 'active' : ''}`}
          onClick={() => setActiveTab('ap-pp')}
        >
          AP++ (Beta)
        </button>
        <button
          type="button"
          class={`tab-btn ${panelTab === 'realism' ? 'active' : ''}`}
          onClick={() => setActiveTab('realism')}
        >
          Realism &amp; Fuel
        </button>
        <button
          type="button"
          class={`tab-btn ${panelTab === 'diag' ? 'active' : ''}`}
          onClick={() => setActiveTab('diag')}
        >
          OP / Diag
        </button>
      </div>

      {panelTab === 'ap-pp' && (
        <>
          <ApPpPanel
            enabled={Boolean(settings.modules['autopilot-pp'])}
            snapshot={live?.apPp}
            tabId={activeTab?.id}
            onEnableBeta={() => {
              const nextModules = { ...settings.modules, 'autopilot-pp': true, 'autothrottle': false };
              setSettings((prev) => ({ ...prev, modules: nextModules }));
              void saveExtensionPatch({ modules: nextModules }).then(setSettings);
            }}
          />
          <div class="panel-card" style="margin-top:8px;">
            <div class="section-heading">SimBrief OFP Importer</div>
            <div style="display:flex;gap:6px;margin-bottom:6px;">
              <input
                type="text"
                placeholder="SimBrief Username / Pilot ID"
                value={simbriefUser}
                onInput={(e) => setSimbriefUser((e.target as HTMLInputElement).value)}
                style="flex:1;min-width:0;"
              />
              <button
                type="button"
                class="btn-sm"
                onClick={async () => {
                  setSimbriefStatus('Fetching...');
                  try {
                    const ofp = await fetchSimBriefOfp(simbriefUser);
                    setSimbriefOfp(ofp);
                    setSimbriefStatus('');
                  } catch (err) {
                    setSimbriefStatus(err instanceof Error ? err.message : 'Fetch failed');
                  }
                }}
              >
                Import
              </button>
            </div>
            {simbriefStatus && <div class="muted-hint" style="font-size:11px;">{simbriefStatus}</div>}
            {simbriefOfp && (
              <div style="font-size:11px;display:flex;flex-direction:column;gap:4px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong>{simbriefOfp.origin} → {simbriefOfp.destination}</strong>
                  <span class="badge">{simbriefOfp.aircraftIcao} · {simbriefOfp.callsign}</span>
                </div>
                <div class="muted-hint" style="word-break:break-word;">{simbriefOfp.route}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span>
                    CRZ: {simbriefOfp.cruiseAltFt.toLocaleString()} ft · Fuel: {simbriefOfp.blockFuelKg.toLocaleString()} kg
                    {simbriefOfp.waypoints.length > 0 ? ` · ${simbriefOfp.waypoints.length} WPTs` : ''}
                  </span>
                  <div style="display:flex;gap:4px;flex-wrap:wrap;">
                    {simbriefOfp.waypoints.length > 0 && (
                      <button
                        type="button"
                        class="chip-btn active"
                        onClick={() =>
                          void sendApPpCommand(
                            { type: 'setRoute', waypoints: simbriefOfp.waypoints },
                            activeTab?.id
                          )
                        }
                      >
                        Load LNAV
                      </button>
                    )}
                    {simbriefOfp.cruiseAltFt > 0 && (
                      <button
                        type="button"
                        class="chip-btn"
                        onClick={() => void sendApPpCommand({ type: 'setAltitude', feet: simbriefOfp.cruiseAltFt }, activeTab?.id)}
                      >
                        Set CRZ Alt
                      </button>
                    )}
                    <button
                      type="button"
                      class="chip-btn"
                      onClick={() => {
                        void clearCachedSimBriefOfp();
                        setSimbriefOfp(null);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {panelTab === 'diag' && (
        <>
          <div class="panel-card">
        <div class="section-heading">Autothrottle &amp; Boost</div>
        <div class="field-row">
          <HelpLabel label="Auto-Boost (OP-SYNC)" tip={SETTING_TIPS.opSyncPolicy} />
          <div class="chip-group">
            {OP_SYNC_POLICIES.map((p) => (
              <button
                type="button"
                key={p.id}
                class={`chip-btn ${settings.opSyncPolicy === p.id ? 'active' : ''}`}
                onClick={() => patchScript({ opSyncPolicy: p.id })}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div class="field-row">
          <HelpLabel label="Boost Prompt Threshold (kts)" tip={SETTING_TIPS.opDeltaThresholdKts} />
          <input
            type="number"
            min="25"
            max="1000"
            step="25"
            style="width:72px;text-align:right"
            value={settings.opDeltaThresholdKts}
            onChange={(e) =>
              patchScript({
                opDeltaThresholdKts: Math.max(25, Math.min(2000, Number((e.target as HTMLInputElement).value) || 150))
              })
            }
          />
        </div>
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
            onInput={(e) => patchScript({ autothrottleResponsiveness: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
      </div>

      <div class="panel-card">
        <div class="section-heading">Engine Power &amp; Stability</div>
        <label class="switch-row">
          <HelpLabel label="Stability Assist (SAS)" tip={SETTING_TIPS.opStability} />
          <input
            type="checkbox"
            checked={settings.opStability}
            onChange={(e) => patchScript({ opStability: (e.target as HTMLInputElement).checked })}
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
            onInput={(e) => patchScript({ sasStrength: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
        <div class="field-row">
          <HelpLabel label="Thrust Multiplier" tip={SETTING_TIPS.opThrustMultiplier} />
          <span class="badge">{settings.opThrustMultiplier.toLocaleString()}x</span>
        </div>
        <div class="chip-group">
          {THRUST_PRESETS.map((m) => (
            <button
              type="button"
              key={m}
              class={`chip-btn ${settings.opThrustMultiplier === m ? 'active' : ''}`}
              onClick={() => patchScript({ opThrustMultiplier: m })}
            >
              {m >= 1000000 ? `${m / 1000000}Mx` : m >= 1000 ? `${m / 1000}kx` : `${m}x`}
            </button>
          ))}
        </div>
      </div>

        </>
      )}

      {panelTab === 'realism' && (
        <>
      <div class="panel-card">
        <div class="section-heading">Fuel &amp; Failures</div>
        <label class="switch-row">
          <HelpLabel label="Altitude Burn" tip={SETTING_TIPS.fuelDynamicSfc} />
          <input
            type="checkbox"
            checked={settings.fuelDynamicSfc}
            onChange={(e) => patchScript({ fuelDynamicSfc: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <HelpLabel label="Real Wing Tanks" tip={SETTING_TIPS.fuelRealisticTanks} />
          <input
            type="checkbox"
            checked={settings.fuelRealisticTanks}
            onChange={(e) => patchScript({ fuelRealisticTanks: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <HelpLabel label="Auto-Refuel on Empty" tip={SETTING_TIPS.fuelAutoRefuel} />
          <input
            type="checkbox"
            checked={settings.fuelAutoRefuel}
            onChange={(e) => patchScript({ fuelAutoRefuel: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <HelpLabel label="Random Failures" tip={SETTING_TIPS.failureProbabilitiesEnabled} />
          <input
            type="checkbox"
            checked={settings.failureProbabilitiesEnabled}
            onChange={(e) =>
              patchScript({ failureProbabilitiesEnabled: (e.target as HTMLInputElement).checked })
            }
          />
        </label>
        <div class="field-row">
          <HelpLabel
            label={`Recovery Chance (${settings.failureRecoveryChancePct}%)`}
            tip={SETTING_TIPS.failureRecoveryChancePct}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.failureRecoveryChancePct}
            onInput={(e) => patchScript({ failureRecoveryChancePct: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
      </div>

      <div class="panel-card">
        <div class="section-heading">Realism, Lighting &amp; Utilities</div>
        <div class="field-col">
          {REALISM_OPTION_GROUPS.map((grp) => {
            const items = REALISM_OPTION_META.filter((item) => item.group === grp.id);
            if (!items.length) return null;
            return (
              <div key={grp.id} class="field-col" style="gap:4px;margin-top:4px">
                <div style="font-size:9px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--muted);padding-bottom:2px;border-bottom:1px solid var(--border)">
                  {grp.label}
                </div>
                {items.map((item) => (
                  <label class="switch-row" key={item.key}>
                    <HelpLabel
                      label={item.label}
                      tip={SETTING_TIPS[`realism.${item.key}`]}
                      badge={isV4 && item.v4Unavailable ? 'Unavailable on V4' : undefined}
                    />
                    <input
                      type="checkbox"
                      checked={Boolean(settings.realismOptions[item.key])}
                      disabled={isV4 && item.v4Unavailable}
                      onChange={() => toggleRealism(item.key)}
                    />
                  </label>
                ))}
              </div>
            );
          })}
          <div class="field-row" style="margin-top:6px;">
            <HelpLabel label="Headlight Mode" tip={SETTING_TIPS['realism.headlightMode']} />
            <select
              value={settings.headlightMode}
              onChange={(e) => patchScript({ headlightMode: (e.target as HTMLSelectElement).value as 'auto' | 'on' | 'off' })}
            >
              <option value="auto">Auto (Night)</option>
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
              onInput={(e) => patchScript({ lightIntensity: Number((e.target as HTMLInputElement).value) })}
            />
          </div>
        </div>
      </div>
        </>
      )}

      {panelTab === 'diag' && (
        <>
          <div class="panel-card">
        <div class="section-heading">Keyboard &amp; OS Adapter ({effectiveOs.toUpperCase()})</div>
        <label class="switch-row">
          <HelpLabel label="Sim Key Translator" tip={SETTING_TIPS.simKeyTranslatorEnabled} />
          <input
            type="checkbox"
            checked={settings.simKeyTranslatorEnabled}
            onChange={(e) => patchExt({ simKeyTranslatorEnabled: (e.target as HTMLInputElement).checked })}
          />
        </label>
        {effectiveOs === 'mac' && (
          <div class="field-row">
            <HelpLabel label="Mac Keyboard" tip={SETTING_TIPS.macKeyboardType} />
            <div class="chip-group">
              <button
                type="button"
                class={`chip-btn ${settings.macKeyboardType !== 'magic' ? 'active' : ''}`}
                onClick={() => patchExt({ macKeyboardType: 'macbook' })}
              >
                MacBook
              </button>
              <button
                type="button"
                class={`chip-btn ${settings.macKeyboardType === 'magic' ? 'active' : ''}`}
                onClick={() => patchExt({ macKeyboardType: 'magic' })}
              >
                Magic (Numpad)
              </button>
            </div>
          </div>
        )}
      </div>

      <div class="panel-card">
        <div class="field-row">
          <span class="section-heading" style="border:none;padding:0">
            Session Log
          </span>
          <button type="button" class="chip-btn" onClick={() => setDiags([])}>
            Clear
          </button>
        </div>
        <div class="diag-feed">
          {diags.length === 0 ? (
            <div style="color:var(--muted)">No events recorded yet in active session.</div>
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
                  title={JSON.stringify(entry.payload ?? '')}
                >
                  <span style="color:var(--accent)">[{entry.time.slice(11, 19)}]</span>{' '}
                  {entry.level === 'error' && <span style="color:#ef4444;font-weight:700">[ERROR] </span>}
                  <strong>{entry.code}</strong>{' '}
                  {entry.payload ? JSON.stringify(entry.payload) : ''}
                </div>
              ))
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
