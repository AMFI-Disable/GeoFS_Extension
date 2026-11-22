import type { LandingRecord } from '../types/settings';
import { checkForExtensionUpdate } from '../shared/update-checker';
import { SerializedLogbookStore } from './logbook-store';

interface CachedDiagEntry {
  time: string;
  code: string;
  payload?: unknown;
}

interface TabLiveCache {
  telemetry: unknown;
  diagnostics: CachedDiagEntry[];
  updatedAt: number;
}

const MAX_CACHED_DIAGS = 50;
const liveTabCaches = new Map<number, TabLiveCache>();
let lastActiveLiveTabId: number | null = null;

function getOrCreateTabCache(tabId: number): TabLiveCache {
  let cache = liveTabCaches.get(tabId);
  if (!cache) {
    cache = { telemetry: null, diagnostics: [], updatedAt: Date.now() };
    liveTabCaches.set(tabId, cache);
  }
  return cache;
}

if (typeof chrome !== 'undefined' && chrome.tabs) {
  chrome.tabs.onRemoved?.addListener((tabId) => {
    liveTabCaches.delete(tabId);
    if (lastActiveLiveTabId === tabId) {
      let newestId: number | null = null;
      let newestTime = -1;
      for (const [id, entry] of liveTabCaches) {
        if (entry.updatedAt > newestTime) {
          newestTime = entry.updatedAt;
          newestId = id;
        }
      }
      lastActiveLiveTabId = newestId;
    }
  });

  chrome.tabs.onUpdated?.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
      liveTabCaches.delete(tabId);
    }
  });
}

const store = new SerializedLogbookStore({
  get: (key) =>
    new Promise((resolve) => {
      chrome.storage.local.get([key], (res) => {
        resolve(Array.isArray(res?.[key]) ? (res[key] as LandingRecord[]) : []);
      });
    }),
  set: (key, records) =>
    new Promise((resolve) => {
      chrome.storage.local.set({ [key]: records }, () => resolve());
    })
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'GEOFS_EXT_APPEND_LOGBOOK' && msg.record) {
    store
      .append(msg.record as LandingRecord)
      .then((records) => sendResponse({ ok: true, count: records.length }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }

  const senderTabId = sender?.tab?.id;
  if (msg?.type === 'GEOFS_EXT_LIVE_TELEMETRY_EVENT' && senderTabId !== undefined) {
    const cache = getOrCreateTabCache(senderTabId);
    cache.telemetry = msg.telemetry ?? null;
    cache.updatedAt = Date.now();
    lastActiveLiveTabId = senderTabId;
    return false;
  }

  if (msg?.type === 'GEOFS_EXT_DIAG_EVENT' && msg.entry && senderTabId !== undefined) {
    const cache = getOrCreateTabCache(senderTabId);
    cache.diagnostics.push(msg.entry as CachedDiagEntry);
    if (cache.diagnostics.length > MAX_CACHED_DIAGS) {
      cache.diagnostics.splice(0, cache.diagnostics.length - MAX_CACHED_DIAGS);
    }
    cache.updatedAt = Date.now();
    lastActiveLiveTabId = senderTabId;
    return false;
  }

  if (msg?.type === 'GEOFS_EXT_OPEN_SIDEPANEL') {
    const windowId = sender?.tab?.windowId;
    const sp = (chrome as unknown as { sidePanel?: { open?: (opts: { windowId?: number }) => Promise<void> } }).sidePanel;
    if (windowId !== undefined && sp?.open) {
      sp.open({ windowId }).catch(() => {
        // Chrome may reject non-extension-gesture sidePanel.open calls; ignore gracefully
      });
    }
    return false;
  }

  if (msg?.type === 'GET_CACHED_LIVE_STATE') {
    const candidateIds: number[] = [];
    if (typeof msg.tabId === 'number') candidateIds.push(msg.tabId);
    if (lastActiveLiveTabId !== null && !candidateIds.includes(lastActiveLiveTabId)) {
      candidateIds.push(lastActiveLiveTabId);
    }
    for (const id of liveTabCaches.keys()) {
      if (!candidateIds.includes(id)) candidateIds.push(id);
    }
    for (const id of candidateIds) {
      const cache = liveTabCaches.get(id);
      if (cache && (cache.telemetry || cache.diagnostics.length > 0)) {
        sendResponse({
          tabId: id,
          telemetry: cache.telemetry,
          diagnostics: cache.diagnostics
        });
        return false;
      }
    }
    sendResponse({ tabId: null, telemetry: null, diagnostics: [] });
    return false;
  }

  return false;
});

async function refreshUpdateBadge(): Promise<void> {
  const info = await checkForExtensionUpdate();
  const action = (chrome as unknown as {
    action?: {
      setBadgeText?: (opts: { text: string }) => Promise<void> | void;
      setBadgeBackgroundColor?: (opts: { color: string }) => Promise<void> | void;
    };
  })?.action;
  if (!action?.setBadgeText) return;
  if (info) {
    await action.setBadgeBackgroundColor?.({ color: '#0d5f8d' });
    await action.setBadgeText({ text: 'UPD' });
  } else {
    await action.setBadgeText({ text: '' });
  }
}

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onInstalled?.addListener(() => {
    void refreshUpdateBadge();
  });
  chrome.runtime.onStartup?.addListener(() => {
    void refreshUpdateBadge();
  });
}
