import { AIRCRAFT_OVERRIDE_PREFIX, parseAircraftOverride, parseAircraftOverrides } from '../core/aircraft-profile';
import { DEFAULT_SETTINGS, type ExtensionSettings, type LandingRecord } from '../types/settings';

const SETTINGS_KEY = 'geofs_ext_settings';
const LOGBOOK_KEY = 'geofs_ext_logbook';

let latestTelemetry: unknown = null;

function mergeSettings(raw: Partial<ExtensionSettings> | undefined): ExtensionSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    modules: { ...DEFAULT_SETTINGS.modules, ...(raw?.modules || {}) },
    keybindings: { ...DEFAULT_SETTINGS.keybindings, ...(raw?.keybindings || {}) },
    aircraftOverrides: parseAircraftOverrides(raw?.aircraftOverrides)
  };
}

function broadcastSettings(settings: ExtensionSettings): void {
  window.postMessage({ type: 'GEOFS_EXT_SETTINGS', settings, audioBase: chrome.runtime.getURL('audio/') }, '*');
}

function refreshSettings(): void {
  chrome.storage.sync.get(null, (items) => {
    if (chrome.runtime.lastError) return;
    const settings = mergeSettings(items[SETTINGS_KEY]);
    const { aircraftOverrides } = settings;
    for (const [key, value] of Object.entries(items)) {
      if (!key.startsWith(AIRCRAFT_OVERRIDE_PREFIX)) continue;
      try {
        aircraftOverrides[key.slice(AIRCRAFT_OVERRIDE_PREFIX.length)] = parseAircraftOverride(value);
      } catch {
        // A malformed override must not prevent loading the other profiles.
      }
    }
    broadcastSettings(settings);
  });
}

refreshSettings();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && Object.keys(changes).some(
    (key) => key === SETTINGS_KEY || key.startsWith(AIRCRAFT_OVERRIDE_PREFIX)
  )) refreshSettings();
});

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || typeof event.data !== 'object') return;
  const msg = event.data as { type?: string; patch?: Partial<ExtensionSettings>; record?: LandingRecord; telemetry?: unknown };

  if (msg.type === 'GEOFS_EXT_REQUEST_SETTINGS') {
    refreshSettings();
  } else if (msg.type === 'GEOFS_EXT_SETTINGS_PATCH' && msg.patch) {
    chrome.storage.sync.get([SETTINGS_KEY], (res) => {
      const current = mergeSettings(res[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined);
      const next = mergeSettings({ ...current, ...msg.patch, aircraftOverrides: current.aircraftOverrides });
      chrome.storage.sync.set({ [SETTINGS_KEY]: next });
    });
  } else if (msg.type === 'GEOFS_EXT_LANDING_RECORD' && msg.record) {
    chrome.storage.local.get([LOGBOOK_KEY], (res) => {
      const list = Array.isArray(res[LOGBOOK_KEY]) ? (res[LOGBOOK_KEY] as LandingRecord[]) : [];
      const updated = [msg.record!, ...list].slice(0, 100);
      chrome.storage.local.set({ [LOGBOOK_KEY]: updated });
    });
  } else if (msg.type === 'GEOFS_EXT_LIVE_TELEMETRY') {
    latestTelemetry = msg.telemetry;
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'GET_LIVE_TELEMETRY') {
    sendResponse({ telemetry: latestTelemetry });
  } else if (msg?.type === 'GEOFS_EXT_APPLY_SETTINGS') {
    refreshSettings();
    sendResponse({ ok: true });
  }
  return false;
});
