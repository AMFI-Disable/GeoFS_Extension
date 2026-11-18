import { SimAdapter, parseSimMajor } from '../core/sim-adapter';
import { TelemetryBus } from '../core/telemetry-bus';
import { AudioEngine } from '../core/audio-engine';
import { KeybindManager } from '../core/keybind-manager';
import { AnchorManager } from '../core/anchor-manager';
import { ModuleManager } from '../core/module-manager';
import { createBuiltinModules } from '../modules';
import { DEFAULT_SETTINGS, type ExtensionSettings } from '../types/settings';

(function bootstrapGeoFSExtension() {
  const startedAt = Date.now();
  let suiteStarted = false;
  let warnedSlow = false;

  const waitForSim = () => {
    if (suiteStarted) return;
    const major = parseSimMajor(window.geofs?.version);
    if (major && window.geofs?.aircraft?.instance && document.body) {
      suiteStarted = true;
      startSuite(major);
      return;
    }

    const elapsed = Date.now() - startedAt;
    const isSimPage = /geofs\.php/i.test(window.location.pathname) || Boolean(window.geofs);
    if (!isSimPage && elapsed > 15000) {
      return;
    }
    if (elapsed > 60000 && !warnedSlow) {
      warnedSlow = true;
      console.warn('[GeoFS Extension] Still waiting for GeoFS simulator instance...');
    }
    if (elapsed > 600000) {
      return;
    }
    setTimeout(waitForSim, elapsed < 60000 ? 250 : 1000);
  };

  const startSuite = (simMajor: 3 | 4) => {
    const emitDiag = (code: string, payload?: unknown) => {
      const payloadLevel =
        payload && typeof payload === 'object' && 'level' in payload
          ? (payload as { level?: unknown }).level
          : undefined;
      const level: 'info' | 'warn' | 'error' =
        payloadLevel === 'error' || payloadLevel === 'warn'
          ? payloadLevel
          : code.endsWith('_ERROR')
            ? 'error'
            : 'info';
      const entry = { time: new Date().toISOString(), code, level, payload };
      if (!Array.isArray(window.__geofsExtDiag)) window.__geofsExtDiag = [];
      window.__geofsExtDiag.push(entry);
      if (window.__geofsExtDiag.length > 100) window.__geofsExtDiag.shift();
      console.info(`[GeoFS-EXT][DIAG]${level === 'error' ? '[ERROR]' : ''} ${code}`, payload ?? '');
      window.postMessage({ type: 'GEOFS_EXT_DIAG', entry }, '*');
    };

    try {
      emitDiag('UI_SCRIPT_LOADED', {
        simMajor,
        rawVersion: String(window.geofs?.version ?? ''),
        path: window.location.pathname
      });

      let settings: ExtensionSettings = { ...DEFAULT_SETTINGS };
      let audioBase: string | undefined;
      let assetBase: string | undefined;

      const sim = new SimAdapter();
      const audio = new AudioEngine();
      const keybinds = new KeybindManager();
      const anchors = new AnchorManager();
      const bus = new TelemetryBus(sim, simMajor);

      const mergePatch = (patch: Partial<ExtensionSettings>): ExtensionSettings => ({
        ...settings,
        ...patch,
        modules: patch.modules ? { ...settings.modules, ...patch.modules } : settings.modules,
        keybindings: patch.keybindings ? { ...settings.keybindings, ...patch.keybindings } : settings.keybindings,
        failureSystemChances: patch.failureSystemChances
          ? { ...settings.failureSystemChances, ...patch.failureSystemChances }
          : settings.failureSystemChances,
        realismOptions: patch.realismOptions
          ? { ...settings.realismOptions, ...patch.realismOptions }
          : settings.realismOptions
      });

      const applyGlobalVisuals = (cfg: ExtensionSettings) => {
        // Keep native GeoFS dark translucent glass styling in auto/dark mode; allow explicit light theme.
        anchors.setTheme(cfg.themeMode === 'light' ? 'light' : 'dark');
        anchors.setCalibratorPreset(cfg.calibratorPreset);
      };

      const manager = new ModuleManager(simMajor, {
        sim,
        audio,
        anchors,
        keybinds,
        getAudioUrl: (file) => (audioBase ? audioBase + file : undefined),
        getAssetUrl: (file) => (assetBase ? assetBase + file : undefined),
        emitDiag,
        getSettings: () => settings,
        updateSettings: (patch) => {
          settings = mergePatch(patch);
          window.postMessage({ type: 'GEOFS_EXT_SETTINGS_PATCH', patch }, '*');
          applyGlobalVisuals(settings);
          void manager.applySettings(settings);
        }
      });

      const liveState = {
        fuelPct: 100,
        burnKgHr: 0,
        activeFailures: new Set<string>(),
        opSyncActive: false,
        sasActive: false,
        checklistPhase: 'PRE-TAKEOFF',
        checklistPending: 0,
        apPp: null as unknown
      };

      anchors.init();

      keybinds.start();
      keybinds.register('hud-toggle', settings.keybindings.toggleHud, () => {
        anchors.toggleHudVisibility();
      });

      for (const mod of createBuiltinModules()) {
        manager.register(mod);
      }

      const subscribe = (manager as unknown as { on: <T = unknown>(e: string, h: (d: T) => void) => () => void }).on.bind(manager);
      subscribe<{ pct: number; burnKgHr: number }>('fuel:state', (d) => {
        if (d && Number.isFinite(d.pct)) liveState.fuelPct = d.pct;
        if (d && Number.isFinite(d.burnKgHr)) liveState.burnKgHr = d.burnKgHr;
      });
      subscribe<{ type: string }>('failure:triggered', ({ type }) => {
        if (type) liveState.activeFailures.add(type);
      });
      subscribe<{ type: string }>('failure:cleared', ({ type }) => {
        if (type) liveState.activeFailures.delete(type);
      });
      subscribe<{ active: boolean }>('autothrottle:opsync-state', ({ active }) => {
        liveState.opSyncActive = Boolean(active);
      });
      subscribe<{ active: boolean }>('overpowered:sas-state', ({ active }) => {
        liveState.sasActive = Boolean(active);
      });
      subscribe<{ phase: string; pending: number }>('checklist:phase', ({ phase, pending }) => {
        if (phase) liveState.checklistPhase = phase;
        if (Number.isFinite(pending)) liveState.checklistPending = pending;
      });
      subscribe<unknown>('autopilot-pp:state', (snapshot) => {
        liveState.apPp = snapshot ?? null;
      });

      window.__geofsExt = {
        manager,
        sim,
        bus,
        anchors,
        emitDiag,
        getSettings: () => settings
      };

      let lastBridgeSyncMs = 0;
      bus.subscribe((telemetry) => {
        applyGlobalVisuals(settings);
        manager.dispatchTelemetry(telemetry);

        if (telemetry.timestamp - lastBridgeSyncMs >= 250) {
          lastBridgeSyncMs = telemetry.timestamp;
          window.postMessage(
            {
              type: 'GEOFS_EXT_LIVE_TELEMETRY',
              telemetry: {
                simMajor: telemetry.simMajor,
                aircraftProfile: telemetry.aircraft,
                kias: Math.round(telemetry.kias),
                altitude: Math.round(telemetry.altitude),
                vs: Math.round(telemetry.vs),
                agl: Math.round(telemetry.aglFeet),
                mach: Number(telemetry.mach.toFixed(2)),
                fuelPct: Number(liveState.fuelPct.toFixed(1)),
                burnKgHr: Math.round(liveState.burnKgHr),
                activeFailures: Array.from(liveState.activeFailures),
                opSyncActive: liveState.opSyncActive,
                sasActive: liveState.sasActive || Boolean(settings.opStability),
                checklistPhase: liveState.checklistPhase,
                checklistPending: liveState.checklistPending,
                apPp: liveState.apPp
              }
            },
            '*'
          );
        }
      });

      let mountReported = false;
      window.addEventListener('message', (event) => {
        if (event.source !== window || !event.data || typeof event.data !== 'object') return;
        const msg = event.data as {
          type?: string;
          settings?: ExtensionSettings;
          audioBase?: string;
          assetBase?: string;
        };
        if (msg.type === 'GEOFS_EXT_SETTINGS' && msg.settings) {
          if (typeof msg.audioBase === 'string' && /^chrome-extension:\/\/[a-p]{32}\/audio\/$/.test(msg.audioBase)) {
            audioBase = msg.audioBase;
          }
          if (typeof msg.assetBase === 'string' && /^chrome-extension:\/\/[a-p]{32}\/assets\/$/.test(msg.assetBase)) {
            assetBase = msg.assetBase;
          }
          settings = msg.settings;
          sim.setAircraftOverrides(settings.aircraftOverrides);
          keybinds.updateCombo('hud-toggle', settings.keybindings.toggleHud);
          applyGlobalVisuals(settings);
          void manager.applySettings(settings).then(() => {
            if (!mountReported) {
              mountReported = true;
              emitDiag('UI_MOUNT', {
                simMajor,
                activeModules: manager.getModules().filter((m) => manager.isActive(m.id)).map((m) => m.id)
              });
              if (settings.showStartupDiagnostics) {
                anchors.showToast(`GeoFS Extension Active (GeoFS V${simMajor})`);
              }
            }
          });
        }
      });

      sim.setAircraftOverrides(settings.aircraftOverrides);
      applyGlobalVisuals(settings);
      void manager.applySettings(settings).then(() => {
        if (!mountReported) {
          emitDiag('UI_BOOT', { simMajor });
        }
      });
      bus.start();
      window.postMessage({ type: 'GEOFS_EXT_REQUEST_SETTINGS' }, '*');
      setTimeout(() => {
        if (!mountReported) {
          window.postMessage({ type: 'GEOFS_EXT_REQUEST_SETTINGS' }, '*');
        }
      }, 1000);
    } catch (err) {
      emitDiag('UI_BOOT_ERROR', {
        simMajor,
        message: err instanceof Error ? err.message : String(err)
      });
      console.error('[GeoFS Extension] Bootstrap failed:', err);
    }
  };

  waitForSim();
})();
