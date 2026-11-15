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
    aircraftOverrides: { ...DEFAULT_SETTINGS.aircraftOverrides, ...(raw?.aircraftOverrides || {}) }
  };
}

function broadcastSettings(settings: ExtensionSettings): void {
  window.postMessage({ type: 'GEOFS_EXT_SETTINGS', settings }, '*');
}

chrome.storage.sync.get([SETTINGS_KEY], (res) => {
  const settings = mergeSettings(res[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined);
  broadcastSettings(settings);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes[SETTINGS_KEY]) {
    const settings = mergeSettings(changes[SETTINGS_KEY].newValue as Partial<ExtensionSettings> | undefined);
    broadcastSettings(settings);
  }
});

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || typeof event.data !== 'object') return;
  const msg = event.data as { type?: string; patch?: Partial<ExtensionSettings>; record?: LandingRecord; telemetry?: unknown };

  if (msg.type === 'GEOFS_EXT_REQUEST_SETTINGS') {
    chrome.storage.sync.get([SETTINGS_KEY], (res) => {
      broadcastSettings(mergeSettings(res[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined));
    });
  } else if (msg.type === 'GEOFS_EXT_SETTINGS_PATCH' && msg.patch) {
    chrome.storage.sync.get([SETTINGS_KEY], (res) => {
      const current = mergeSettings(res[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined);
      const next = mergeSettings({ ...current, ...msg.patch });
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
  } else if (msg?.type === 'GEOFS_EXT_APPLY_SETTINGS' && msg.settings) {
    broadcastSettings(mergeSettings(msg.settings as Partial<ExtensionSettings>));
    sendResponse({ ok: true });
  }
  return false;
});
