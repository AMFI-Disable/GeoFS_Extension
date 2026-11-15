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

    let audioBase: string | undefined;
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
      getAudioUrl: (file) => audioBase && audioBase + file,
      getSettings: () => settings,
      updateSettings: (patch) => {
        settings = { ...settings, ...patch };
        window.postMessage({ type: 'GEOFS_EXT_SETTINGS_PATCH', patch }, '*');
        applyGlobalVisuals(settings, sim.isNight());
        manager.applySettings(settings);
      }
    });

    const applyGlobalVisuals = (cfg: ExtensionSettings, simIsNight: boolean) => {
      anchors.setTheme(simIsNight ? 'dark' : 'light');
      anchors.setCalibratorPreset(cfg.calibratorPreset);
    };

    anchors.init();
    const topHudBtn = document.createElement('button');
    topHudBtn.type = 'button';
    topHudBtn.className = 'geofs-ext-pad is-active';
    topHudBtn.textContent = 'HUD';
    topHudBtn.addEventListener('click', () => {
      const shown = anchors.toggleHudVisibility();
      topHudBtn.classList.toggle('is-active', shown);
    });
    anchors.mountControl('top-hud-toggle', 'top', topHudBtn);

    keybinds.start();
    keybinds.register('hud-toggle', settings.keybindings.toggleHud, () => {
      const shown = anchors.toggleHudVisibility();
      topHudBtn.classList.toggle('is-active', shown);
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
              aircraftProfile: telemetry.aircraft,
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
      const msg = event.data as { type?: string; settings?: ExtensionSettings; audioBase?: string };
      if (msg.type === 'GEOFS_EXT_SETTINGS' && msg.settings) {
        if (typeof msg.audioBase === 'string' && /^chrome-extension:\/\/[a-p]{32}\/audio\/$/.test(msg.audioBase)) {
          audioBase = msg.audioBase;
        }
        settings = msg.settings;
        sim.setAircraftOverrides(settings.aircraftOverrides);
        keybinds.updateCombo('hud-toggle', settings.keybindings.toggleHud);
        applyGlobalVisuals(settings, sim.isNight());
        manager.applySettings(settings);
      }
    });

    sim.setAircraftOverrides(settings.aircraftOverrides);
    applyGlobalVisuals(settings, sim.isNight());
    manager.applySettings(settings);
    bus.start();
    window.postMessage({ type: 'GEOFS_EXT_REQUEST_SETTINGS' }, '*');
    anchors.showToast(`GeoFS Extension Active (GeoFS V${simMajor})`);
  };

  waitForSim();
})();
