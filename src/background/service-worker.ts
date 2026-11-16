import type { LandingRecord } from '../types/settings';
import { SerializedLogbookStore } from './logbook-store';

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

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'GEOFS_EXT_APPEND_LOGBOOK' && msg.record) {
    store
      .append(msg.record as LandingRecord)
      .then((records) => sendResponse({ ok: true, count: records.length }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
  return false;
});
