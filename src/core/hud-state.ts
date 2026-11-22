export type HudDockPreset = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface HudTabsState {
  order: string[];
  closed: string[];
  pinned: string[];
  detached: string[];
  dockPreset: HudDockPreset;
  activeTabId?: string | null;
  hudMinimized?: boolean;
  hudHidden?: boolean;
}

export const TAB_ORDER = ['info', 'checks', 'fuel', 'land'] as const;
export const HUD_TABS_STATE_KEY = 'geofs_ext_hud_tabs_state';

export function createDefaultHudTabsState(): HudTabsState {
  return {
    order: [...TAB_ORDER],
    closed: [],
    pinned: [],
    detached: [],
    dockPreset: 'top-right'
  };
}

export function loadHudTabsState(): {
  hudState: HudTabsState;
  savedActiveTabId: string | null;
  hudMinimized: boolean;
  hudHidden: boolean;
} | null {
  try {
    const raw = localStorage.getItem(HUD_TABS_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HudTabsState>;
    const validPreset = (p: unknown): p is HudDockPreset =>
      p === 'top-right' || p === 'top-left' || p === 'bottom-right' || p === 'bottom-left';
    return {
      hudState: {
        order: Array.isArray(parsed.order) ? parsed.order.filter((x): x is string => typeof x === 'string') : [...TAB_ORDER],
        closed: Array.isArray(parsed.closed) ? parsed.closed.filter((x): x is string => typeof x === 'string') : [],
        pinned: Array.isArray(parsed.pinned) ? parsed.pinned.filter((x): x is string => typeof x === 'string') : [],
        detached: Array.isArray(parsed.detached) ? parsed.detached.filter((x): x is string => typeof x === 'string') : [],
        dockPreset: validPreset(parsed.dockPreset) ? parsed.dockPreset : 'top-right'
      },
      savedActiveTabId: typeof parsed.activeTabId === 'string' ? parsed.activeTabId : null,
      hudMinimized: Boolean(parsed.hudMinimized),
      hudHidden: Boolean(parsed.hudHidden)
    };
  } catch {
    return null;
  }
}

export function saveHudTabsState(
  hudState: HudTabsState,
  activeTabId: string | null,
  hudMinimized: boolean,
  hudHidden: boolean
): void {
  try {
    const payload: HudTabsState = {
      ...hudState,
      activeTabId,
      hudMinimized,
      hudHidden
    };
    localStorage.setItem(HUD_TABS_STATE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage quota errors
  }
}

export function applyDockPresetStyles(root: HTMLElement, preset: HudDockPreset): void {
  root.style.top = 'auto';
  root.style.right = 'auto';
  root.style.bottom = 'auto';
  root.style.left = 'auto';
  if (preset === 'top-right') {
    root.style.top = '70px';
    root.style.right = '54px';
    root.style.transformOrigin = 'top right';
  } else if (preset === 'top-left') {
    root.style.top = '70px';
    root.style.left = '20px';
    root.style.transformOrigin = 'top left';
  } else if (preset === 'bottom-right') {
    root.style.bottom = '20px';
    root.style.right = '54px';
    root.style.transformOrigin = 'bottom right';
  } else {
    root.style.bottom = '20px';
    root.style.left = '20px';
    root.style.transformOrigin = 'bottom left';
  }
}
