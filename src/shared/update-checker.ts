export interface UpdateInfo {
  latestVersion: string;
  currentVersion: string;
  releaseUrl: string;
  downloadUrl: string;
  releaseNotes?: string;
  checkedAt: number;
}

interface UpdateCache {
  checkedAt: number;
  info: UpdateInfo | null;
}

const UPDATE_CACHE_KEY = 'geofs_ext_update_cache';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const LATEST_RELEASE_API = 'https://api.github.com/repos/AMFI-Disable/GeoFS_Extension/releases/latest';
const LATEST_RELEASE_PAGE = 'https://github.com/AMFI-Disable/GeoFS_Extension/releases/latest';

export function compareSemver(a: string, b: string): number {
  const pa = a.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length, 3);
  for (let i = 0; i < len; i++) {
    const va = pa[i] ?? 0;
    const vb = pb[i] ?? 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
}

export function getCurrentExtensionVersion(): string {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
      return chrome.runtime.getManifest().version || '0.0.0';
    }
  } catch {
    // ignore outside extension runtime
  }
  return '0.0.0';
}

export async function getCachedUpdateInfo(): Promise<UpdateInfo | null> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return null;
  const current = getCurrentExtensionVersion();
  return new Promise((resolve) => {
    chrome.storage.local.get([UPDATE_CACHE_KEY], (res) => {
      const cached = res?.[UPDATE_CACHE_KEY] as UpdateCache | undefined;
      if (cached?.info && compareSemver(cached.info.latestVersion, current) > 0) {
        resolve(cached.info);
      } else {
        resolve(null);
      }
    });
  });
}

export async function checkForExtensionUpdate(force = false): Promise<UpdateInfo | null> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return null;
  const currentVersion = getCurrentExtensionVersion();
  if (currentVersion === '0.0.0') return null;

  if (!force) {
    const cached = await new Promise<UpdateCache | null>((resolve) => {
      chrome.storage.local.get([UPDATE_CACHE_KEY], (res) => {
        resolve((res?.[UPDATE_CACHE_KEY] as UpdateCache | undefined) ?? null);
      });
    });
    if (cached && Date.now() - cached.checkedAt < CACHE_TTL_MS) {
      return cached.info && compareSemver(cached.info.latestVersion, currentVersion) > 0
        ? cached.info
        : null;
    }
  }

  try {
    const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(8000)
      : undefined;
    const resp = await fetch(LATEST_RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
      ...(signal ? { signal } : {})
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as {
      tag_name?: string;
      html_url?: string;
      body?: string;
      assets?: Array<{ name?: string; browser_download_url?: string }>;
    };
    const latestVersion = (data.tag_name ?? '').replace(/^v/i, '').trim();
    if (!latestVersion) return null;

    const zipAsset = data.assets?.find((a) => a.name?.endsWith('.zip') && a.browser_download_url);
    const releaseUrl = data.html_url || LATEST_RELEASE_PAGE;
    const downloadUrl = zipAsset?.browser_download_url || releaseUrl;
    const rawNotes = (data.body ?? '').replace(/\s+/g, ' ').trim();
    const releaseNotes = rawNotes ? (rawNotes.length > 220 ? `${rawNotes.slice(0, 217)}...` : rawNotes) : undefined;

    const info: UpdateInfo | null =
      compareSemver(latestVersion, currentVersion) > 0
        ? {
            latestVersion,
            currentVersion,
            releaseUrl,
            downloadUrl,
            releaseNotes,
            checkedAt: Date.now()
          }
        : null;

    chrome.storage.local.set({
      [UPDATE_CACHE_KEY]: { checkedAt: Date.now(), info } satisfies UpdateCache
    });
    return info;
  } catch {
    return null;
  }
}
