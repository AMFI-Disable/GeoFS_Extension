import { AIRCRAFT_OVERRIDE_PREFIX, parseAircraftOverride } from '../core/aircraft-profile';
import type { AircraftProfile } from '../types/module';
import {
  DEFAULT_SETTINGS,
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

export interface LiveTelemetrySummary {
  simMajor?: number;
  aircraftProfile?: AircraftProfile | null;
  kias?: number;
  altitude?: number;
  vs?: number;
  agl?: number;
  mach?: number;
  fuelPct?: number;
  burnKgHr?: number;
  activeFailures?: string[];
  opSyncActive?: boolean;
  sasActive?: boolean;
  checklistPhase?: string;
  checklistPending?: number;
}

export interface DiagEntry {
  time: string;
  code: string;
  level?: 'info' | 'warn' | 'error';
  payload?: unknown;
}

export const MODULE_META: ReadonlyArray<{ id: string; name: string; desc: string }> = [
  { id: 'autothrottle', name: 'Autothrottle', desc: 'GeoFS PID, reverse thrust, LCD landing pad & OP-SYNC' },
  { id: 'information-display', name: 'Information Display', desc: 'HUD telemetry, AGL/GS dev & multi-engine % THR' },
  { id: 'fuel-simulator', name: 'Fuel Simulator', desc: 'Multi-throttle altitude burn, tank balance & flameout' },
  { id: 'overpowered-engines', name: 'Overpowered Engines', desc: 'Native thrust/ceiling card & closed-loop SAS' },
  { id: 'checklist-system', name: 'Checklist System', desc: '4-gate mandatory checks, situational guide & QRH' },
  { id: 'realism-pack', name: 'Realism Pack', desc: 'Adaptive V3/V4 shaders, G-audio & 777/A320/737 SFX' },
  { id: 'failure-simulator', name: 'Failure Simulator', desc: 'Modal failure probabilities, QRH override & recovery' },
  { id: 'flight-path-vector', name: 'Flight Path Vector', desc: 'GeoFS V3.9 Cesium 3D billboard & glideslope badge' },
  { id: 'landing-statistics', name: 'Landing Statistics', desc: 'Slide-in touchdown scorecard & persistent logbook' },
  { id: 'satellite-imagery', name: 'Satellite Imagery', desc: 'Configurable Esri, Bing, OSM & custom map tiles' }
];

export function mergeExtensionPatch(
  current: ExtensionSettings,
  patch: Partial<ExtensionSettings>
): ExtensionSettings {
  return {
    ...current,
    ...patch,
    modules: patch.modules ? { ...current.modules, ...patch.modules } : current.modules,
    keybindings: patch.keybindings ? { ...current.keybindings, ...patch.keybindings } : current.keybindings,
    simKeyRemaps: patch.simKeyRemaps ? { ...patch.simKeyRemaps } : current.simKeyRemaps,
    aircraftOverrides: patch.aircraftOverrides ?? current.aircraftOverrides,
    failureSystemChances: patch.failureSystemChances
      ? { ...current.failureSystemChances, ...patch.failureSystemChances }
      : current.failureSystemChances,
    realismOptions: patch.realismOptions
      ? { ...current.realismOptions, ...patch.realismOptions }
      : current.realismOptions
  };
}

export function extractSettingsFromStorageItems(items: Record<string, unknown> | null | undefined): ExtensionSettings {
  const safe = items ?? {};
  const extRaw = safe[EXTENSION_CONFIG_KEY] as Partial<ExtensionConfig> | undefined;
  const scrRaw = safe[SCRIPT_CONFIG_KEY] as Partial<ScriptConfig> | undefined;
  const legacyRaw = safe[LEGACY_SETTINGS_KEY] as Partial<ExtensionSettings> | undefined;
  const settings = mergeSettings(extRaw, scrRaw, legacyRaw);

  for (const [key, value] of Object.entries(safe)) {
    if (!key.startsWith(AIRCRAFT_OVERRIDE_PREFIX)) continue;
    try {
      settings.aircraftOverrides[key.slice(AIRCRAFT_OVERRIDE_PREFIX.length)] = parseAircraftOverride(value);
    } catch {
      // Ignore malformed per-aircraft overrides so remaining storage stays intact.
    }
  }
  return settings;
}

export function loadSplitSettings(): Promise<ExtensionSettings> {
  return new Promise((resolve) => {
    if (!chrome.storage?.sync) {
      resolve({ ...DEFAULT_SETTINGS });
      return;
    }
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        resolve({ ...DEFAULT_SETTINGS });
        return;
      }
      const extRaw = items[EXTENSION_CONFIG_KEY];
      const scrRaw = items[SCRIPT_CONFIG_KEY];
      const legacyRaw = items[LEGACY_SETTINGS_KEY];
      const settings = extractSettingsFromStorageItems(items);
      if (!extRaw && !scrRaw && legacyRaw) {
        const { extensionConfig, scriptConfig } = splitSettings(settings);
        chrome.storage.sync.set({
          [EXTENSION_CONFIG_KEY]: extensionConfig,
          [SCRIPT_CONFIG_KEY]: scriptConfig
        });
      }
      resolve(settings);
    });
  });
}

const GEOFS_TAB_URL_PATTERNS = ['*://*.geo-fs.com/*', '*://geo-fs.com/*'];

function isGeoFSUrl(url: string | undefined): boolean {
  return Boolean(url && /^https?:\/\/(?:[a-z0-9-]+\.)*geo-fs\.com(?:\/|$)/i.test(url));
}

export function notifyGeoFSTabsApplySettings(): void {
  if (!chrome.tabs) return;
  const sendToTabs = (tabs: chrome.tabs.Tab[]) => {
    for (const tab of tabs) {
      if (tab.id === undefined) continue;
      chrome.tabs.sendMessage(tab.id, { type: 'GEOFS_EXT_APPLY_SETTINGS' }, () => {
        void chrome.runtime.lastError;
      });
    }
  };
  chrome.tabs.query({ url: GEOFS_TAB_URL_PATTERNS }, (geofsTabs) => {
    if (chrome.runtime.lastError || !geofsTabs?.length) {
      chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
        if (!chrome.runtime.lastError && activeTabs?.length) sendToTabs(activeTabs);
      });
      return;
    }
    sendToTabs(geofsTabs);
  });
}

export function persistSplitSettings(next: ExtensionSettings): Promise<void> {
  return new Promise((resolve) => {
    if (!chrome.storage?.sync) {
      resolve();
      return;
    }
    const { extensionConfig, scriptConfig } = splitSettings(next);
    chrome.storage.sync.set(
      {
        [EXTENSION_CONFIG_KEY]: extensionConfig,
        [SCRIPT_CONFIG_KEY]: scriptConfig
      },
      () => {
        notifyGeoFSTabsApplySettings();
        resolve();
      }
    );
  });
}

export async function saveSettingsPatch(patch: Partial<ExtensionSettings>): Promise<ExtensionSettings> {
  const current = await loadSplitSettings();
  const merged = mergeExtensionPatch(current, patch);
  await persistSplitSettings(merged);
  return merged;
}

export function saveExtensionPatch(patch: Partial<ExtensionConfig>): Promise<ExtensionSettings> {
  return saveSettingsPatch(patch);
}

export function saveScriptPatch(patch: Partial<ScriptConfig>): Promise<ExtensionSettings> {
  return saveSettingsPatch(patch);
}

export function subscribeSettings(onChange: (settings: ExtensionSettings) => void): () => void {
  if (!chrome.storage?.onChanged) return () => {};
  const listener = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (
      area === 'sync' &&
      Object.keys(changes).some(
        (key) =>
          key === EXTENSION_CONFIG_KEY ||
          key === SCRIPT_CONFIG_KEY ||
          key === LEGACY_SETTINGS_KEY ||
          key.startsWith(AIRCRAFT_OVERRIDE_PREFIX)
      )
    ) {
      void loadSplitSettings().then(onChange);
    }
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}

export function loadLogbook(): Promise<LandingRecord[]> {
  return new Promise((resolve) => {
    if (!chrome.storage?.local) {
      resolve([]);
      return;
    }
    chrome.storage.local.get([LOGBOOK_KEY], (res) => {
      resolve(Array.isArray(res?.[LOGBOOK_KEY]) ? (res[LOGBOOK_KEY] as LandingRecord[]) : []);
    });
  });
}

export function clearLogbook(): Promise<void> {
  return new Promise((resolve) => {
    if (!chrome.storage?.local) {
      resolve();
      return;
    }
    chrome.storage.local.set({ [LOGBOOK_KEY]: [] }, () => resolve());
  });
}

export function subscribeLogbook(onChange: (records: LandingRecord[]) => void): () => void {
  if (!chrome.storage?.onChanged) return () => {};
  const listener = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area === 'local' && changes[LOGBOOK_KEY]) {
      const next = changes[LOGBOOK_KEY].newValue;
      onChange(Array.isArray(next) ? (next as LandingRecord[]) : []);
    }
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}

function getCandidateGeoFSTabIds(): Promise<number[]> {
  return new Promise((resolve) => {
    if (!chrome.tabs) {
      resolve([]);
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      const active = activeTabs?.[0];
      chrome.tabs.query({ url: GEOFS_TAB_URL_PATTERNS }, (geofsTabs) => {
        const list = !chrome.runtime.lastError && Array.isArray(geofsTabs) ? geofsTabs.slice() : [];
        list.sort((a, b) => {
          const score = (tab: chrome.tabs.Tab) => {
            let s = 0;
            if (tab.id === active?.id) s += 100;
            if (tab.active) s += 40;
            if (tab.url && /geofs\.php/i.test(tab.url)) s += 20;
            return s;
          };
          return score(b) - score(a);
        });
        const ids = list.map((t) => t.id).filter((id): id is number => id !== undefined);
        if (active?.id !== undefined && isGeoFSUrl(active.url) && !ids.includes(active.id)) {
          ids.unshift(active.id);
        }
        resolve(ids);
      });
    });
  });
}

function sendTabMessageSafe<T>(tabId: number, payload: unknown): Promise<T | null> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, payload, (resp) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve((resp as T) ?? null);
    });
  });
}

function getCachedLiveState(tabId?: number): Promise<{ telemetry: LiveTelemetrySummary | null; diagnostics: DiagEntry[] }> {
  return new Promise((resolve) => {
    if (!chrome.runtime?.sendMessage) {
      resolve({ telemetry: null, diagnostics: [] });
      return;
    }
    chrome.runtime.sendMessage({ type: 'GET_CACHED_LIVE_STATE', tabId }, (resp) => {
      if (chrome.runtime.lastError || !resp) {
        resolve({ telemetry: null, diagnostics: [] });
        return;
      }
      resolve({
        telemetry: (resp.telemetry as LiveTelemetrySummary | null | undefined) ?? null,
        diagnostics: Array.isArray(resp.diagnostics) ? (resp.diagnostics as DiagEntry[]) : []
      });
    });
  });
}

export interface GeoFSTabInfo {
  id: number;
  title: string;
  url: string;
  active: boolean;
  windowId?: number;
}

export function getOpenGeoFSTabs(): Promise<GeoFSTabInfo[]> {
  return new Promise((resolve) => {
    if (!chrome.tabs) {
      resolve([]);
      return;
    }
    chrome.tabs.query({ url: GEOFS_TAB_URL_PATTERNS }, (geofsTabs) => {
      if (chrome.runtime.lastError || !Array.isArray(geofsTabs)) {
        resolve([]);
        return;
      }
      const tabs = geofsTabs
        .filter((t): t is chrome.tabs.Tab & { id: number } => t.id !== undefined)
        .sort((a, b) => {
          const score = (t: chrome.tabs.Tab) =>
            (t.active ? 40 : 0) + (t.url && /geofs\.php/i.test(t.url) ? 20 : 0);
          return score(b) - score(a);
        })
        .map((t) => ({
          id: t.id,
          title: t.title || 'GeoFS',
          url: t.url || '',
          active: Boolean(t.active),
          windowId: t.windowId
        }));
      resolve(tabs);
    });
  });
}

export async function focusGeoFSTab(tabId: number): Promise<void> {
  if (!chrome.tabs) return;
  try {
    const tab = await chrome.tabs.update(tabId, { active: true });
    if (tab?.windowId !== undefined && chrome.windows?.update) {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
  } catch {
    // Ignore if tab was closed before focusing.
  }
}

export async function requestActiveTabTelemetry(preferredTabId?: number): Promise<LiveTelemetrySummary | null> {
  const tabIds = await getCandidateGeoFSTabIds();
  if (preferredTabId !== undefined) {
    const idx = tabIds.indexOf(preferredTabId);
    if (idx > 0) tabIds.splice(idx, 1);
    if (idx !== 0) tabIds.unshift(preferredTabId);
  }
  if (!tabIds.length || !chrome.tabs) return null;
  for (const tabId of tabIds) {
    const resp = await sendTabMessageSafe<{ telemetry?: LiveTelemetrySummary | null }>(tabId, {
      type: 'GET_LIVE_TELEMETRY'
    });
    if (resp?.telemetry) return resp.telemetry;
  }
  const cached = await getCachedLiveState(tabIds[0]);
  return cached.telemetry;
}

export async function requestActiveTabDiagnostics(preferredTabId?: number): Promise<DiagEntry[]> {
  const tabIds = await getCandidateGeoFSTabIds();
  if (preferredTabId !== undefined) {
    const idx = tabIds.indexOf(preferredTabId);
    if (idx > 0) tabIds.splice(idx, 1);
    if (idx !== 0) tabIds.unshift(preferredTabId);
  }
  if (!tabIds.length || !chrome.tabs) return [];
  for (const tabId of tabIds) {
    const resp = await sendTabMessageSafe<{ diagnostics?: DiagEntry[] }>(tabId, {
      type: 'GET_LIVE_DIAGNOSTICS'
    });
    if (Array.isArray(resp?.diagnostics) && resp.diagnostics.length > 0) {
      return resp.diagnostics;
    }
  }
  const cached = await getCachedLiveState(tabIds[0]);
  return cached.diagnostics;
}

export async function openSidePanelFromAction(): Promise<boolean> {
  const sidePanelApi = (chrome as unknown as {
    sidePanel?: { open?: (opts: { windowId?: number }) => Promise<void> };
  }).sidePanel;
  if (!sidePanelApi?.open) return false;
  try {
    const win = await chrome.windows?.getCurrent?.();
    if (win?.id === undefined) return false;
    await sidePanelApi.open({ windowId: win.id });
    return true;
  } catch {
    return false;
  }
}

export function openOptionsPage(): void {
  if (chrome.runtime?.openOptionsPage) {
    chrome.runtime.openOptionsPage();
    return;
  }
  const url = chrome.runtime?.getURL?.('options/index.html');
  if (url && chrome.tabs?.create) {
    chrome.tabs.create({ url });
  }
}
