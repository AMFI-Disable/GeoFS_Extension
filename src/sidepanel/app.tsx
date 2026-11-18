import { useEffect, useState } from 'preact/hooks';
import { REALISM_OPTION_META } from '../modules/realism-pack';
import {
  loadSplitSettings,
  openOptionsPage,
  requestActiveTabDiagnostics,
  requestActiveTabTelemetry,
  saveExtensionPatch,
  saveScriptPatch,
  subscribeSettings,
  type DiagEntry,
  type LiveTelemetrySummary
} from '../shared/settings-store';
import { ApPpPanel } from './ap-pp-panel';
import {
  DEFAULT_SETTINGS,
  type ExtensionSettings,
  type OpSyncPolicy,
  type RealismOptions
} from '../types/settings';

const OP_SYNC_POLICIES: readonly { id: OpSyncPolicy; label: string }[] = [
  { id: 'ask', label: 'Ask' },
  { id: 'allow', label: 'Allow' },
  { id: 'never', label: 'Never' }
];

const THRUST_PRESETS = [1, 2, 10, 100, 1000, 1000000] as const;

export function App() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [live, setLive] = useState<LiveTelemetrySummary | null>(null);
  const [diags, setDiags] = useState<DiagEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'ap-pp' | 'realism' | 'diag'>('ap-pp');

  useEffect(() => {
    void loadSplitSettings().then(setSettings);
    const unsubSettings = subscribeSettings(setSettings);

    const refreshLive = () => {
      void requestActiveTabTelemetry().then(setLive);
      void requestActiveTabDiagnostics().then((entries) => {
        if (entries.length) setDiags(entries.slice(-30));
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
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
  }, [settings.themeMode]);

  const patchScript = (patch: Partial<ExtensionSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...patch,
      realismOptions: patch.realismOptions ? { ...prev.realismOptions, ...patch.realismOptions } : prev.realismOptions
    }));
    void saveScriptPatch(patch).then(setSettings);
  };

  const toggleRealism = (key: keyof RealismOptions) => {
    const nextRealism = { ...settings.realismOptions, [key]: !settings.realismOptions[key] };
    patchScript({ realismOptions: nextRealism });
  };

  const isV4 = live?.simMajor === 4;

  return (
    <div class="surface-shell">
      <div class="header">
        <div style="min-width:0">
          <div class="title">Cockpit Companion</div>
          <div style="font-size:10px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            {live?.aircraftProfile ? live.aircraftProfile.name : 'Waiting for GeoFS flight...'}
          </div>
        </div>
        <div style="display:flex;gap:4px;align-items:center">
          <span class={`badge ${live?.simMajor ? 'badge--ok' : ''}`}>
            {live?.simMajor ? `V${live.simMajor}` : 'Offline'}
          </span>
          <button type="button" class="btn-sm" onClick={() => openOptionsPage()}>
            Full Settings
          </button>
        </div>
      </div>

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

      <div class="chip-group" style="margin-bottom:2px">
        <button
          type="button"
          class={`chip-btn ${activeTab === 'ap-pp' ? 'active' : ''}`}
          style="flex:1"
          onClick={() => setActiveTab('ap-pp')}
        >
          AP++ (Beta)
        </button>
        <button
          type="button"
          class={`chip-btn ${activeTab === 'realism' ? 'active' : ''}`}
          style="flex:1"
          onClick={() => setActiveTab('realism')}
        >
          Realism & Fuel
        </button>
        <button
          type="button"
          class={`chip-btn ${activeTab === 'diag' ? 'active' : ''}`}
          style="flex:1"
          onClick={() => setActiveTab('diag')}
        >
          OP / Diag
        </button>
      </div>

      {activeTab === 'ap-pp' && (
        <ApPpPanel
          enabled={Boolean(settings.modules['autopilot-pp'])}
          snapshot={live?.apPp}
          onEnableBeta={() => {
            const nextModules = { ...settings.modules, 'autopilot-pp': true, 'autothrottle': false };
            setSettings((prev) => ({ ...prev, modules: nextModules }));
            void saveExtensionPatch({ modules: nextModules }).then(setSettings);
          }}
        />
      )}

      {activeTab === 'diag' && (
        <>
          <div class="panel-card">
        <div class="section-heading">Autothrottle & OP-SYNC</div>
        <div class="field-row">
          <span>OP-SYNC Confirmation</span>
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
          <span>High-Delta Prompt (kts)</span>
          <input
            type="number"
            min="25"
            max="1000"
            step="25"
            style="width:76px;text-align:right"
            value={settings.opDeltaThresholdKts}
            onChange={(e) =>
              patchScript({
                opDeltaThresholdKts: Math.max(25, Math.min(2000, Number((e.target as HTMLInputElement).value) || 150))
              })
            }
          />
        </div>
        <div class="field-row">
          <span>A/THR Gain ({settings.autothrottleResponsiveness.toFixed(1)}x)</span>
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
        <div class="section-heading">OP Engines & Closed-Loop SAS</div>
        <label class="switch-row">
          <span>Effective SAS Stability</span>
          <input
            type="checkbox"
            checked={settings.opStability}
            onChange={(e) => patchScript({ opStability: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <div class="field-row">
          <span>SAS Strength ({settings.sasStrength.toFixed(1)}x)</span>
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
          <span>Thrust Multiplier</span>
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

      <div class="panel-card">
        <div class="section-heading">Fuel & Failures Live Control</div>
        <label class="switch-row">
          <span>Altitude Burn (Across All Throttles)</span>
          <input
            type="checkbox"
            checked={settings.fuelDynamicSfc}
            onChange={(e) => patchScript({ fuelDynamicSfc: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <span>Real Tanks (Center → Wings Imbalance)</span>
          <input
            type="checkbox"
            checked={settings.fuelRealisticTanks}
            onChange={(e) => patchScript({ fuelRealisticTanks: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <span>Auto-Refuel on Empty</span>
          <input
            type="checkbox"
            checked={settings.fuelAutoRefuel}
            onChange={(e) => patchScript({ fuelAutoRefuel: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <span>Failure Probability Timer</span>
          <input
            type="checkbox"
            checked={settings.failureProbabilitiesEnabled}
            onChange={(e) =>
              patchScript({ failureProbabilitiesEnabled: (e.target as HTMLInputElement).checked })
            }
          />
        </label>
        <div class="field-row">
          <span>Recovery Chance ({settings.failureRecoveryChancePct}%)</span>
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
        <div class="section-heading">Realism Pack (Background Engine)</div>
        <div class="field-col">
          {REALISM_OPTION_META.filter((item) => !(isV4 && item.v4Unavailable)).map((item) => (
            <label class="switch-row" key={item.key}>
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={Boolean(settings.realismOptions[item.key])}
                onChange={() => toggleRealism(item.key)}
              />
            </label>
          ))}
        </div>
      </div>
        </>
      )}

      {activeTab === 'diag' && (
      <div class="panel-card">
        <div class="field-row">
          <span class="section-heading" style="border:none;padding:0">
            Live Diagnostics ([GeoFS-EXT][DIAG])
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
      )}
    </div>
  );
}
