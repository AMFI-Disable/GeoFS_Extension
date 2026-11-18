import { AIRCRAFT_OVERRIDE_PREFIX, parseAircraftOverride } from '../core/aircraft-profile';
import {
  EXTENSION_CONFIG_KEY,
  LEGACY_SETTINGS_KEY,
  LOGBOOK_KEY,
  SCRIPT_CONFIG_KEY,
  mergeSettings,
  splitSettings,
  type ExtensionConfig,
  type ExtensionSettings,
  type LandingRecord,
  type ScriptConfig
} from '../types/settings';

export interface DiagEntry {
  time: string;
  code: string;
  payload?: unknown;
}

let latestTelemetry: unknown = null;
const diagBuffer: DiagEntry[] = [];
const MAX_DIAG_ENTRIES = 50;

function appendDiag(entry: DiagEntry): void {
  diagBuffer.push(entry);
  if (diagBuffer.length > MAX_DIAG_ENTRIES) {
    diagBuffer.splice(0, diagBuffer.length - MAX_DIAG_ENTRIES);
  }
}

function broadcastSettings(settings: ExtensionSettings): void {
  window.postMessage(
    {
      type: 'GEOFS_EXT_SETTINGS',
      settings,
      audioBase: chrome.runtime.getURL('audio/'),
      assetBase: chrome.runtime.getURL('assets/')
    },
    '*'
  );
}

function mergePatch(current: ExtensionSettings, patch: Partial<ExtensionSettings>): ExtensionSettings {
  return {
    ...current,
    ...patch,
    modules: patch.modules ? { ...current.modules, ...patch.modules } : current.modules,
    keybindings: patch.keybindings ? { ...current.keybindings, ...patch.keybindings } : current.keybindings,
    failureSystemChances: patch.failureSystemChances
      ? { ...current.failureSystemChances, ...patch.failureSystemChances }
      : current.failureSystemChances,
    realismOptions: patch.realismOptions
      ? { ...current.realismOptions, ...patch.realismOptions }
      : current.realismOptions,
    aircraftOverrides: current.aircraftOverrides
  };
}

function refreshSettings(): void {
  chrome.storage.sync.get(null, (items) => {
    if (chrome.runtime.lastError || !items) {
      broadcastSettings(mergeSettings(undefined, undefined, undefined));
      return;
    }
    const extRaw = items[EXTENSION_CONFIG_KEY] as Partial<ExtensionConfig> | undefined;
    const scrRaw = items[SCRIPT_CONFIG_KEY] as Partial<ScriptConfig> | undefined;
    const legacyRaw = items[LEGACY_SETTINGS_KEY] as Partial<ExtensionSettings> | undefined;
    const settings = mergeSettings(extRaw, scrRaw, legacyRaw);

    if (!extRaw && !scrRaw && legacyRaw) {
      const split = splitSettings(settings);
      chrome.storage.sync.set({
        [EXTENSION_CONFIG_KEY]: split.extensionConfig,
        [SCRIPT_CONFIG_KEY]: split.scriptConfig
      });
    }

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
  if (
    areaName === 'sync' &&
    Object.keys(changes).some(
      (key) =>
        key === EXTENSION_CONFIG_KEY ||
        key === SCRIPT_CONFIG_KEY ||
        key === LEGACY_SETTINGS_KEY ||
        key.startsWith(AIRCRAFT_OVERRIDE_PREFIX)
    )
  ) {
    refreshSettings();
  }
});

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || typeof event.data !== 'object') return;
  const msg = event.data as {
    type?: string;
    patch?: Partial<ExtensionSettings>;
    record?: LandingRecord;
    telemetry?: unknown;
    entry?: DiagEntry;
  };

  if (msg.type === 'GEOFS_EXT_REQUEST_SETTINGS') {
    refreshSettings();
  } else if (msg.type === 'GEOFS_EXT_SETTINGS_PATCH' && msg.patch) {
    chrome.storage.sync.get([EXTENSION_CONFIG_KEY, SCRIPT_CONFIG_KEY, LEGACY_SETTINGS_KEY], (res) => {
      if (chrome.runtime.lastError) return;
      const current = mergeSettings(
        res[EXTENSION_CONFIG_KEY] as Partial<ExtensionConfig> | undefined,
        res[SCRIPT_CONFIG_KEY] as Partial<ScriptConfig> | undefined,
        res[LEGACY_SETTINGS_KEY] as Partial<ExtensionSettings> | undefined
      );
      const merged = mergePatch(current, msg.patch!);
      const { extensionConfig, scriptConfig } = splitSettings(merged);
      chrome.storage.sync.set({
        [EXTENSION_CONFIG_KEY]: extensionConfig,
        [SCRIPT_CONFIG_KEY]: scriptConfig
      });
    });
  } else if (msg.type === 'GEOFS_EXT_LANDING_RECORD' && msg.record) {
    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GEOFS_EXT_APPEND_LOGBOOK', record: msg.record }, () => {
        void chrome.runtime.lastError;
      });
    } else {
      chrome.storage.local.get([LOGBOOK_KEY], (res) => {
        const list = Array.isArray(res[LOGBOOK_KEY]) ? (res[LOGBOOK_KEY] as LandingRecord[]) : [];
        const updated = [msg.record!, ...list.filter((r) => r.id !== msg.record!.id)].slice(0, 100);
        chrome.storage.local.set({ [LOGBOOK_KEY]: updated });
      });
    }
  } else if (msg.type === 'GEOFS_EXT_LIVE_TELEMETRY') {
    latestTelemetry = msg.telemetry;
    chrome.runtime?.sendMessage?.({ type: 'GEOFS_EXT_LIVE_TELEMETRY_EVENT', telemetry: msg.telemetry }, () => {
      void chrome.runtime.lastError;
    });
  } else if (msg.type === 'GEOFS_EXT_DIAG' && msg.entry && typeof msg.entry.code === 'string') {
    appendDiag(msg.entry);
    chrome.runtime?.sendMessage?.({ type: 'GEOFS_EXT_DIAG_EVENT', entry: msg.entry }, () => {
      void chrome.runtime.lastError;
    });
  } else if (msg.type === 'GEOFS_EXT_OPEN_SIDEPANEL') {
    chrome.runtime?.sendMessage?.({ type: 'GEOFS_EXT_OPEN_SIDEPANEL' }, () => {
      void chrome.runtime.lastError;
    });
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'GET_LIVE_TELEMETRY') {
    sendResponse({ telemetry: latestTelemetry });
  } else if (msg?.type === 'GET_LIVE_DIAGNOSTICS') {
    sendResponse({ diagnostics: diagBuffer });
  } else if (msg?.type === 'GEOFS_EXT_APPLY_SETTINGS') {
    refreshSettings();
    sendResponse({ ok: true });
  } else if (msg?.type === 'GEOFS_EXT_AP_PP_COMMAND' && msg.command) {
    window.postMessage({ type: 'GEOFS_EXT_AP_PP_COMMAND', command: msg.command }, '*');
    sendResponse({ ok: true });
  } else if (msg?.type === 'GEOFS_EXT_PING') {
    sendResponse({ ok: true });
  }
  return false;
});
