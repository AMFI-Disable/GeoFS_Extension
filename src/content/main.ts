import { SimAdapter, parseSimMajor } from '../core/SimAdapter';
import { TelemetryBus } from '../core/TelemetryBus';
import { AudioEngine } from '../core/AudioEngine';
import { KeybindManager } from '../core/KeybindManager';
import { AnchorManager } from '../core/AnchorManager';
import { ModuleManager } from '../core/ModuleManager';
import { createBuiltinModules } from '../modules';
import { DEFAULT_SETTINGS, type ExtensionSettings } from '../types/settings';

(function bootstrapGeoFSExtension() {
  const startedAt = Date.now();

  const waitForSim = () => {
    const major = parseSimMajor(window.geofs?.version);
    if (major && window.geofs?.aircraft?.instance && document.body) {
      startSuite(major);
      return;
    }
    if (Date.now() - startedAt > 60000) {
      console.warn('[GeoFS Extension] Timed out waiting for GeoFS simulator.');
      return;
    }
    setTimeout(waitForSim, 250);
  };

  const startSuite = (simMajor: 3 | 4) => {
    let settings: ExtensionSettings = { ...DEFAULT_SETTINGS };

    const sim = new SimAdapter();
    const audio = new AudioEngine();
    const keybinds = new KeybindManager();
    const anchors = new AnchorManager();
    const bus = new TelemetryBus(sim, simMajor);

    const manager = new ModuleManager(simMajor, {
      sim,
      audio,
      anchors,
      keybinds,
      getSettings: () => settings,
      updateSettings: (patch) => {
        settings = { ...settings, ...patch };
        window.postMessage({ type: 'GEOFS_EXT_SETTINGS_PATCH', patch }, '*');
        applyGlobalVisuals(settings, sim.isNight());
        manager.applySettings(settings);
      }
    });

    const applyGlobalVisuals = (cfg: ExtensionSettings, simIsNight: boolean) => {
      const resolvedTheme = cfg.themeMode === 'auto' ? (simIsNight ? 'dark' : 'light') : cfg.themeMode;
      anchors.setTheme(resolvedTheme);
      anchors.setCalibratorPreset(cfg.calibratorPreset);
    };

    anchors.init();
    keybinds.start();
    keybinds.register('hud-toggle', settings.keybindings.toggleHud, () => {
      anchors.toggleHudVisibility();
    });

    for (const mod of createBuiltinModules()) {
      manager.register(mod);
    }

    let lastBridgeSyncMs = 0;
    bus.subscribe((telemetry) => {
      applyGlobalVisuals(settings, telemetry.isNight);
      manager.dispatchTelemetry(telemetry);

      if (telemetry.timestamp - lastBridgeSyncMs >= 500) {
        lastBridgeSyncMs = telemetry.timestamp;
        window.postMessage(
          {
            type: 'GEOFS_EXT_LIVE_TELEMETRY',
            telemetry: {
              simMajor: telemetry.simMajor,
              isNight: telemetry.isNight,
              aircraftName: telemetry.aircraft?.name || null,
              aircraftCategory: telemetry.aircraft?.category || null,
              kias: Math.round(telemetry.kias),
              altitude: Math.round(telemetry.altitude),
              vs: Math.round(telemetry.vs)
            }
          },
          '*'
        );
      }
    });

    window.addEventListener('message', (event) => {
      if (event.source !== window || !event.data || typeof event.data !== 'object') return;
      const msg = event.data as { type?: string; settings?: ExtensionSettings };
      if (msg.type === 'GEOFS_EXT_SETTINGS' && msg.settings) {
        settings = msg.settings;
        keybinds.updateCombo('hud-toggle', settings.keybindings.toggleHud);
        applyGlobalVisuals(settings, sim.isNight());
        manager.applySettings(settings);
      }
    });

    applyGlobalVisuals(settings, sim.isNight());
    manager.applySettings(settings);
    bus.start();
    window.postMessage({ type: 'GEOFS_EXT_REQUEST_SETTINGS' }, '*');
    anchors.showToast(`GeoFS Extension Active (GeoFS V${simMajor})`);
  };

  waitForSim();
})();
