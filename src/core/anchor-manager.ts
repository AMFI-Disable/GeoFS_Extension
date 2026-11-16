import type { CalibratorPreset } from '../types/settings';

export type AnchorZone = 'top' | 'bottom' | 'right' | 'corner' | 'autopilot';

const PRESET_SCALES: Record<CalibratorPreset, number> = {
  '1080p': 1.0,
  '1440p': 1.1,
  '4k': 1.35,
  'ultrawide': 1.08,
  'laptop': 0.9
};

export class AnchorManager {
  private styleEl: HTMLStyleElement | null = null;
  private hudRoot: HTMLDivElement | null = null;
  private hudTabsEl: HTMLDivElement | null = null;
  private hudBodyEl: HTMLDivElement | null = null;
  private tabPanels = new Map<string, { label: string; el: HTMLElement }>();
  private activeTabId: string | null = null;
  private currentTheme: 'dark' | 'light' = 'dark';
  private currentPreset: CalibratorPreset = '1080p';
  private mountedControls = new Map<string, HTMLElement>();
  private dragCleanups = new Set<() => void>();

  public init(): void {
    if (typeof document === 'undefined') return;
    this.injectStyles();
    this.ensureHud();
  }

  public setTheme(theme: 'dark' | 'light'): void {
    this.currentTheme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-geofs-ext-theme', theme);
    }
  }

  public setCalibratorPreset(preset: CalibratorPreset): void {
    this.currentPreset = preset;
    const scale = PRESET_SCALES[preset] ?? 1.0;
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--geofs-ext-scale', String(scale));
    }
  }

  public mountControl(id: string, zone: AnchorZone, el: HTMLElement): () => void {
    this.unmountControl(id);
    el.dataset.geofsExtControl = id;
    const host = this.resolveZoneHost(zone);
    host.appendChild(el);
    this.mountedControls.set(id, el);
    return () => this.unmountControl(id);
  }

  public unmountControl(id: string): void {
    const existing = this.mountedControls.get(id);
    if (existing) {
      existing.remove();
      this.mountedControls.delete(id);
    }
  }

  public registerHudTab(id: string, label: string, contentEl: HTMLElement, activate = false): () => void {
    this.ensureHud();
    this.tabPanels.set(id, { label, el: contentEl });
    this.renderTabs();
    if (activate || !this.activeTabId) {
      this.selectTab(id);
    }
    return () => {
      this.tabPanels.delete(id);
      if (this.activeTabId === id) {
        this.activeTabId = this.tabPanels.keys().next().value ?? null;
      }
      this.renderTabs();
      if (this.activeTabId) this.selectTab(this.activeTabId);
      else if (this.hudBodyEl) this.hudBodyEl.innerHTML = '';
    };
  }

  public openHudTab(id: string): void {
    this.ensureHud();
    if (!this.hudRoot || !this.tabPanels.has(id)) return;
    this.hudRoot.style.display = 'block';
    this.selectTab(id);
  }

  public toggleHudVisibility(): boolean {
    this.ensureHud();
    if (!this.hudRoot) return false;
    const nextHidden = this.hudRoot.style.display !== 'none';
    this.hudRoot.style.display = nextHidden ? 'none' : 'block';
    return !nextHidden;
  }

  public showToast(message: string, level: 'info' | 'warn' | 'critical' = 'info'): void {
    if (typeof document === 'undefined' || !document.body) return;
    let region = document.getElementById('geofs-ext-toasts');
    if (!region) {
      region = document.createElement('div');
      region.id = 'geofs-ext-toasts';
      document.body.appendChild(region);
    }
    const toast = document.createElement('div');
    toast.className = `geofs-ext-toast geofs-ext-toast--${level}`;
    toast.textContent = message;
    region.appendChild(toast);
    setTimeout(() => {
      toast.remove();
      if (region && !region.childElementCount) region.remove();
    }, 4500);
  }

  private resolveZoneHost(zone: AnchorZone): HTMLElement {
    const selectors: Record<AnchorZone, string[]> = {
      top: ['.geofs-ui-top', '#geofs-ui-top'],
      bottom: ['.geofs-ui-bottom'],
      autopilot: ['.geofs-autopilot-bar'],
      right: ['.geofs-ui-right', '.geofs-radio-stack'],
      corner: []
    };

    for (const sel of selectors[zone]) {
      const found = document.querySelector(sel) as HTMLElement | null;
      if (found) return found;
    }

    if (zone === 'autopilot') return this.resolveZoneHost('top');

    const fallbackId = `geofs-ext-zone-${zone}`;
    let fallback = document.getElementById(fallbackId);
    if (!fallback) {
      fallback = document.createElement('div');
      fallback.id = fallbackId;
      fallback.className = `geofs-ext-zone geofs-ext-zone--${zone}`;
      document.body.appendChild(fallback);
    }
    return fallback;
  }

  public makeDraggable(card: HTMLElement, storageKey: string): () => void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return () => {};
    let isDragging = false;
    let dragMoved = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { left, top } = JSON.parse(saved) as { left?: string; top?: string };
        if (left && top) {
          card.style.left = left;
          card.style.top = top;
          card.style.bottom = 'auto';
          card.style.right = 'auto';
        }
      }
    } catch {
      // ignore invalid saved coordinates
    }

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['BUTTON', 'INPUT', 'A', 'SELECT', 'TEXTAREA', 'LABEL'].includes(target.tagName)) return;
      isDragging = true;
      dragMoved = false;
      const rect = card.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      card.style.left = `${rect.left}px`;
      card.style.top = `${rect.top}px`;
      card.style.bottom = 'auto';
      card.style.right = 'auto';
      card.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      dragMoved = true;
      const maxX = Math.max(0, window.innerWidth - card.offsetWidth);
      const maxY = Math.max(0, window.innerHeight - card.offsetHeight);
      const newLeft = Math.max(0, Math.min(e.clientX - dragOffsetX, maxX));
      const newTop = Math.max(0, Math.min(e.clientY - dragOffsetY, maxY));
      card.style.left = `${newLeft}px`;
      card.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      card.style.cursor = 'default';
      if (dragMoved) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ left: card.style.left, top: card.style.top }));
        } catch {
          // ignore storage quota errors
        }
      }
    };

    card.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    const cleanup = () => {
      card.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.dragCleanups.delete(cleanup);
    };
    this.dragCleanups.add(cleanup);
    return cleanup;
  }

  private ensureHud(): void {
    if (typeof document === 'undefined' || this.hudRoot || !document.body) return;
    const root = document.createElement('div');
    root.id = 'geofs-ext-hud';

    const header = document.createElement('div');
    header.className = 'geofs-ext-hud-header';
    header.textContent = 'GEOFS FLIGHT SUITE';

    const tabs = document.createElement('div');
    tabs.className = 'geofs-ext-hud-tabs';

    const body = document.createElement('div');
    body.className = 'geofs-ext-hud-body';

    root.append(header, tabs, body);
    document.body.appendChild(root);
    this.makeDraggable(root, 'geofs_ext_hud_pos');

    this.hudRoot = root;
    this.hudTabsEl = tabs;
    this.hudBodyEl = body;
  }

  private renderTabs(): void {
    if (!this.hudTabsEl) return;
    this.hudTabsEl.innerHTML = '';
    for (const [id, { label }] of this.tabPanels) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `geofs-ext-hud-tab ${this.activeTabId === id ? 'is-active' : ''}`;
      btn.textContent = label;
      btn.addEventListener('click', () => this.selectTab(id));
      this.hudTabsEl.appendChild(btn);
    }
  }

  private selectTab(id: string): void {
    const entry = this.tabPanels.get(id);
    if (!entry || !this.hudBodyEl) return;
    this.activeTabId = id;
    this.hudBodyEl.innerHTML = '';
    this.hudBodyEl.appendChild(entry.el);
    this.renderTabs();
  }

  private injectStyles(): void {
    if (this.styleEl || typeof document === 'undefined') return;
    const style = document.createElement('style');
    style.id = 'geofs-ext-styles';
    style.textContent = `
      :root {
        --geofs-ext-scale: 1;
        --geofs-ext-bg: rgba(0, 0, 0, 0.8);
        --geofs-ext-fg: #ffffff;
        --geofs-ext-muted: rgba(255, 255, 255, 0.65);
        --geofs-ext-border: #888888;
      }
      :root[data-geofs-ext-theme="light"] {
        --geofs-ext-bg: rgba(248, 250, 252, 0.9);
        --geofs-ext-fg: #0f172a;
        --geofs-ext-muted: #475569;
        --geofs-ext-border: #64748b;
      }
      #geofs-ext-hud, .geofs-ext-landing-report {
        position: fixed;
        top: 64px;
        left: 16px;
        width: 260px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 10px;
        z-index: 2147483000;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top left;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
      }
      .geofs-ext-landing-report {
        top: 12%;
        left: auto;
        right: 16px;
        width: min(320px, 85vw);
        transform-origin: top right;
      }
      .geofs-ext-landing-report button { float: right; }
      .geofs-ext-landing-report dl {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 4px 12px;
      }
      .geofs-ext-landing-report dd { margin: 0; text-align: right; }
      .geofs-ext-hud-header {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.8px;
        color: var(--geofs-ext-muted);
        margin-bottom: 6px;
      }
      .geofs-ext-hud-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 8px;
      }
      .geofs-ext-hud-tab {
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 8px;
        padding: 3px 7px;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
      }
      .geofs-ext-hud-tab.is-active {
        background: var(--geofs-ext-fg);
        color: var(--geofs-ext-bg);
      }
      .geofs-ext-zone {
        position: fixed;
        z-index: 2147483000;
        display: flex;
        gap: 6px;
        transform: scale(var(--geofs-ext-scale));
      }
      .geofs-ext-zone--top { top: 10px; left: 50%; transform: translateX(-50%) scale(var(--geofs-ext-scale)); }
      .geofs-ext-zone--bottom { bottom: 14px; left: 50%; transform: translateX(-50%) scale(var(--geofs-ext-scale)); }
      .geofs-ext-zone--right { top: 45%; right: 12px; flex-direction: column; transform-origin: right center; }
      .geofs-ext-zone--corner { bottom: 14px; right: 14px; transform-origin: bottom right; }
      .geofs-ext-pad {
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 5px 10px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      .geofs-ext-pad.is-active {
        border-color: #22c55e;
        color: #22c55e;
      }
      #geofs-ext-toasts {
        position: fixed;
        top: 14px;
        right: 14px;
        z-index: 2147483647;
        display: grid;
        gap: 6px;
        pointer-events: none;
      }
      .geofs-ext-toast {
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 10px;
        padding: 8px 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
      }
      .geofs-ext-toast--warn { border-color: #eab308; }
      .geofs-ext-toast--critical { border-color: #ef4444; }
    `;
    document.head?.appendChild(style);
    this.styleEl = style;
  }

  public destroy(): void {
    for (const cleanup of Array.from(this.dragCleanups)) cleanup();
    for (const el of this.mountedControls.values()) el.remove();
    this.mountedControls.clear();
    this.hudRoot?.remove();
    this.hudRoot = null;
    this.styleEl?.remove();
    this.styleEl = null;
  }
}
