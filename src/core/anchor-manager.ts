import type { CalibratorPreset } from '../types/settings';

export type AnchorZone = 'top' | 'bottom' | 'right' | 'corner' | 'autopilot';

export interface PromptAction {
  id: string;
  label: string;
  variant?: 'primary' | 'danger' | 'neutral';
  onClick: () => void;
}

const PRESET_SCALES: Record<CalibratorPreset, number> = {
  '1080p': 1.0,
  '1440p': 1.1,
  '4k': 1.35,
  'ultrawide': 1.08,
  'laptop': 0.9
};

const TAB_ORDER = ['info', 'checks', 'fuel', 'land'] as const;

export class AnchorManager {
  private styleEl: HTMLStyleElement | null = null;
  private hudRoot: HTMLDivElement | null = null;
  private hudTabsEl: HTMLDivElement | null = null;
  private hudBodyEl: HTMLDivElement | null = null;
  private edgeHandleEl: HTMLButtonElement | null = null;
  private minBtnEl: HTMLButtonElement | null = null;
  private tabPanels = new Map<string, { label: string; el: HTMLElement }>();
  private activeTabId: string | null = null;
  private currentTheme: 'dark' | 'light' = 'dark';
  private currentPreset: CalibratorPreset = '1080p';
  private mountedControls = new Map<string, HTMLElement>();
  private dragCleanups = new Set<() => void>();
  private trackedElements = new Set<HTMLElement>();
  private resizeObserver: ResizeObserver | null = null;
  private resizeListener: (() => void) | null = null;
  private hudMinimized = false;
  private hudHidden = false;
  private nextZIndex = 2147483006;

  public bringToFront(el: HTMLElement | null | undefined): void {
    if (!el) return;
    if (this.nextZIndex >= 2147483500) {
      this.nextZIndex = 2147483010;
    }
    el.style.zIndex = String(this.nextZIndex++);
  }

  public init(): void {
    if (typeof document === 'undefined') return;
    this.injectStyles();
    this.setupViewportGuards();
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
    this.clampAll();
    return () => {
      this.tabPanels.delete(id);
      if (this.activeTabId === id) {
        const ordered = this.orderedTabEntries();
        this.activeTabId = ordered[0]?.[0] ?? null;
      }
      this.renderTabs();
      if (this.activeTabId) this.selectTab(this.activeTabId);
      else if (this.hudBodyEl) this.hudBodyEl.innerHTML = '';
    };
  }

  public openHudTab(id: string): void {
    this.ensureHud();
    if (!this.hudRoot || !this.tabPanels.has(id)) return;
    this.hudHidden = false;
    this.hudRoot.style.display = 'flex';
    if (this.hudMinimized) {
      this.setHudMinimized(false);
    }
    this.selectTab(id);
    this.bringToFront(this.hudRoot);
    this.syncEdgeHandle();
    this.clampElementToViewport(this.hudRoot);
  }

  public toggleHudVisibility(): boolean {
    this.ensureHud();
    if (!this.hudRoot) return false;
    this.hudHidden = !this.hudHidden;
    this.hudRoot.style.display = this.hudHidden ? 'none' : 'flex';
    this.syncEdgeHandle();
    if (!this.hudHidden) {
      this.bringToFront(this.hudRoot);
      this.clampElementToViewport(this.hudRoot);
    }
    return !this.hudHidden;
  }

  public showToast(message: string, level: 'info' | 'warn' | 'critical' = 'info'): void {
    if (typeof document === 'undefined' || !document.body) return;
    const region = this.ensureToastRegion();
    const toast = document.createElement('div');
    toast.className = `geofs-ext-toast geofs-ext-toast--${level}`;
    toast.textContent = message;
    region.appendChild(toast);
    const timeout = level === 'critical' ? 8500 : 4500;
    setTimeout(() => {
      toast.remove();
      if (region && !region.childElementCount) region.remove();
    }, timeout);
  }

  public showPromptBanner(
    id: string,
    message: string,
    actions: PromptAction[],
    timeoutMs = 20000
  ): () => void {
    if (typeof document === 'undefined' || !document.body) return () => {};
    const region = this.ensureToastRegion();
    const existing = region.querySelector(`[data-prompt-id="${id}"]`);
    existing?.remove();

    const card = document.createElement('div');
    card.className = 'geofs-ext-prompt';
    card.dataset.promptId = id;
    card.setAttribute('role', 'alertdialog');

    const textEl = document.createElement('div');
    textEl.className = 'geofs-ext-prompt-text';
    textEl.textContent = message;

    const btnRow = document.createElement('div');
    btnRow.className = 'geofs-ext-prompt-actions';

    let timer: ReturnType<typeof setTimeout> | undefined;
    const dismiss = () => {
      clearTimeout(timer);
      card.remove();
      if (!region.childElementCount) region.remove();
    };

    for (const action of actions) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.actionId = action.id;
      btn.className = `geofs-ext-prompt-btn geofs-ext-prompt-btn--${action.variant ?? 'neutral'}`;
      btn.textContent = action.label;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismiss();
        action.onClick();
      });
      btnRow.appendChild(btn);
    }

    card.append(textEl, btnRow);
    region.appendChild(card);

    if (timeoutMs > 0) {
      timer = setTimeout(dismiss, timeoutMs);
    }
    return dismiss;
  }

  private ensureToastRegion(): HTMLElement {
    let region = document.getElementById('geofs-ext-toasts');
    if (!region) {
      region = document.createElement('div');
      region.id = 'geofs-ext-toasts';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    return region;
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

  public clampElementToViewport(el: HTMLElement): void {
    if (typeof window === 'undefined' || !el.isConnected) return;
    const style = el.style;
    if (style.display === 'none') return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 && rect.height <= 0) return;

    const maxX = Math.max(0, window.innerWidth - rect.width);
    const maxY = Math.max(0, window.innerHeight - rect.height);

    if (style.left && style.left !== 'auto') {
      const curLeft = Number.parseFloat(style.left);
      if (Number.isFinite(curLeft)) {
        const clampedX = Math.max(0, Math.min(curLeft, maxX));
        if (clampedX !== curLeft) style.left = `${Math.round(clampedX)}px`;
      }
    } else if (rect.left < 0) {
      style.left = '0px';
      style.right = 'auto';
    }

    if (style.top && style.top !== 'auto') {
      const curTop = Number.parseFloat(style.top);
      if (Number.isFinite(curTop)) {
        const clampedY = Math.max(0, Math.min(curTop, maxY));
        if (clampedY !== curTop) style.top = `${Math.round(clampedY)}px`;
      }
    } else if (rect.top < 0) {
      style.top = '0px';
      style.bottom = 'auto';
    }
  }

  private clampAll(): void {
    for (const el of this.trackedElements) {
      this.clampElementToViewport(el);
    }
  }

  private setupViewportGuards(): void {
    if (typeof window === 'undefined') return;
    if (typeof ResizeObserver !== 'undefined' && !this.resizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.clampElementToViewport(entry.target as HTMLElement);
        }
      });
    }
    if (!this.resizeListener) {
      this.resizeListener = () => this.clampAll();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  public makeDraggable(card: HTMLElement, storageKey: string, dragHandle?: HTMLElement): () => void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return () => {};
    let isPointerDown = false;
    let dragMoved = false;
    let startX = 0;
    let startY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let dragWidth = 0;
    let dragHeight = 0;

    this.trackedElements.add(card);
    this.resizeObserver?.observe(card);

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { left, top } = JSON.parse(saved) as { left?: string; top?: string };
        const parsedLeft = left ? Number.parseFloat(left) : NaN;
        const parsedTop = top ? Number.parseFloat(top) : NaN;
        if (Number.isFinite(parsedLeft) && Number.isFinite(parsedTop)) {
          card.style.left = `${Math.max(0, parsedLeft)}px`;
          card.style.top = `${Math.max(0, parsedTop)}px`;
          card.style.bottom = 'auto';
          card.style.right = 'auto';
          this.clampElementToViewport(card);
        }
      }
    } catch {
      // ignore invalid saved coordinates
    }

    const triggerEl = dragHandle ?? card;
    const isSelfButton = triggerEl === card && card.tagName === 'BUTTON';

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, a, select, textarea, label')) return;
      if (target?.closest('button')) {
        const inHudHeader = Boolean(target.closest('.geofs-ext-hud-header'));
        if (!card.classList.contains('is-minimized') && !isSelfButton && !inHudHeader) {
          return;
        }
      }
      isPointerDown = true;
      dragMoved = false;
      startX = e.clientX;
      startY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerDown) return;
      if (!dragMoved) {
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist < 4) return;
        dragMoved = true;
        const rect = card.getBoundingClientRect();
        dragOffsetX = startX - rect.left;
        dragOffsetY = startY - rect.top;
        dragWidth = rect.width || card.offsetWidth;
        dragHeight = rect.height || card.offsetHeight;
        card.style.left = `${Math.round(rect.left)}px`;
        card.style.top = `${Math.round(rect.top)}px`;
        card.style.bottom = 'auto';
        card.style.right = 'auto';
        card.style.cursor = 'grabbing';
      }

      const maxX = Math.max(0, window.innerWidth - dragWidth);
      const maxY = Math.max(0, window.innerHeight - dragHeight);
      const newLeft = Math.max(0, Math.min(e.clientX - dragOffsetX, maxX));
      const newTop = Math.max(0, Math.min(e.clientY - dragOffsetY, maxY));
      card.style.left = `${Math.round(newLeft)}px`;
      card.style.top = `${Math.round(newTop)}px`;
    };

    const onMouseUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      card.style.cursor = '';
      if (dragMoved) {
        card.dataset.justDragged = '1';
        setTimeout(() => {
          delete card.dataset.justDragged;
        }, 80);
        try {
          localStorage.setItem(storageKey, JSON.stringify({ left: card.style.left, top: card.style.top }));
        } catch {
          // ignore storage quota errors
        }
        if (card === this.hudRoot) {
          this.syncEdgeHandle();
        }
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (card.dataset.justDragged === '1') {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        delete card.dataset.justDragged;
      }
    };

    const onCardFocusDown = () => {
      this.bringToFront(card);
    };

    triggerEl.addEventListener('mousedown', onMouseDown);
    card.addEventListener('mousedown', onCardFocusDown, true);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    card.addEventListener('click', onClickCapture, true);

    const cleanup = () => {
      triggerEl.removeEventListener('mousedown', onMouseDown);
      card.removeEventListener('mousedown', onCardFocusDown, true);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      card.removeEventListener('click', onClickCapture, true);
      this.resizeObserver?.unobserve(card);
      this.trackedElements.delete(card);
      this.dragCleanups.delete(cleanup);
    };
    this.dragCleanups.add(cleanup);
    return cleanup;
  }

  private setHudMinimized(minimized: boolean): void {
    if (!this.hudRoot || !this.hudTabsEl || !this.hudBodyEl || !this.minBtnEl) return;
    this.hudMinimized = minimized;
    this.hudRoot.classList.toggle('is-minimized', minimized);
    this.minBtnEl.textContent = minimized ? 'HUD' : '−';
    this.minBtnEl.title = minimized ? 'Restore HUD' : 'Minimize HUD';
    this.hudTabsEl.style.display = minimized ? 'none' : 'flex';
    this.hudBodyEl.style.display = minimized ? 'none' : 'block';
    this.clampElementToViewport(this.hudRoot);
    this.syncEdgeHandle();
  }

  private syncEdgeHandle(): void {
    if (!this.edgeHandleEl || !this.hudRoot) return;
    const leftVal = Number.parseFloat(this.hudRoot.style.left || '');
    const dockedLeftMinimized = this.hudMinimized && Number.isFinite(leftVal) && leftVal <= 16;
    const showEdge = this.hudHidden || dockedLeftMinimized;
    this.edgeHandleEl.style.display = showEdge ? 'flex' : 'none';
  }

  private ensureHud(): void {
    if (typeof document === 'undefined' || this.hudRoot || !document.body) return;
    const root = document.createElement('div');
    root.id = 'flightDataDisplay';

    const header = document.createElement('div');
    header.className = 'geofs-ext-hud-header';

    const grip = document.createElement('span');
    grip.className = 'geofs-ext-hud-grip';
    grip.title = 'Drag HUD';
    grip.setAttribute('aria-label', 'Drag HUD');
    grip.innerHTML =
      '<svg width="6" height="12" viewBox="0 0 6 12" aria-hidden="true" focusable="false"><circle cx="1.5" cy="2" r="1"/><circle cx="4.5" cy="2" r="1"/><circle cx="1.5" cy="6" r="1"/><circle cx="4.5" cy="6" r="1"/><circle cx="1.5" cy="10" r="1"/><circle cx="4.5" cy="10" r="1"/></svg>';

    const tabs = document.createElement('div');
    tabs.id = 'hud-unified-tabs';
    tabs.className = 'unified-tabs';

    const minBtn = document.createElement('button');
    minBtn.type = 'button';
    minBtn.className = 'geofs-ext-hud-min';
    minBtn.title = 'Minimize HUD';
    minBtn.textContent = '−';
    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (root.dataset.justDragged === '1') return;
      this.setHudMinimized(!this.hudMinimized);
    });

    header.append(grip, tabs, minBtn);

    const body = document.createElement('div');
    body.className = 'geofs-ext-hud-body';

    root.append(header, body);
    document.body.appendChild(root);

    const edgeTab = document.createElement('button');
    edgeTab.id = 'hudMinimizeBtn';
    edgeTab.type = 'button';
    edgeTab.className = 'unified-hud-edge-tab';
    edgeTab.title = 'Show Flight HUD';
    edgeTab.textContent = '▸';
    edgeTab.style.display = 'none';
    edgeTab.addEventListener('click', () => {
      this.hudHidden = false;
      root.style.display = 'flex';
      this.setHudMinimized(false);
    });
    document.body.appendChild(edgeTab);

    this.hudRoot = root;
    this.hudTabsEl = tabs;
    this.hudBodyEl = body;
    this.minBtnEl = minBtn;
    this.edgeHandleEl = edgeTab;

    this.makeDraggable(root, 'geofs_ext_hud_pos');
    this.clampElementToViewport(root);
    this.syncEdgeHandle();
  }

  private orderedTabEntries(): Array<[string, { label: string; el: HTMLElement }]> {
    const entries = Array.from(this.tabPanels.entries());
    entries.sort(([a], [b]) => {
      const idxA = TAB_ORDER.indexOf(a as (typeof TAB_ORDER)[number]);
      const idxB = TAB_ORDER.indexOf(b as (typeof TAB_ORDER)[number]);
      const rankA = idxA >= 0 ? idxA : TAB_ORDER.length;
      const rankB = idxB >= 0 ? idxB : TAB_ORDER.length;
      return rankA - rankB;
    });
    return entries;
  }

  private renderTabs(): void {
    if (!this.hudTabsEl) return;
    this.hudTabsEl.innerHTML = '';
    const entries = this.orderedTabEntries();

    for (const [id, { label }] of entries) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `tab-btn-${id}`;
      btn.className = `unified-tab ${this.activeTabId === id ? 'active is-active' : ''}`;
      btn.textContent = label;
      btn.title = label;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectTab(id);
      });
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
    if (this.hudRoot) this.clampElementToViewport(this.hudRoot);
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
        --geofs-ext-accent: #4caf50;
      }
      :root[data-geofs-ext-theme="light"] {
        --geofs-ext-bg: rgba(248, 250, 252, 0.92);
        --geofs-ext-fg: #0f172a;
        --geofs-ext-muted: #475569;
        --geofs-ext-border: #64748b;
        --geofs-ext-accent: #16a34a;
      }
      #flightDataDisplay, .geofs-ext-native-card {
        box-sizing: border-box;
        position: fixed;
        top: 70px;
        right: 20px;
        width: 250px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 9px 8px;
        z-index: 2147483000;
        display: flex;
        flex-direction: column;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top right;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      #flightDataDisplay * {
        box-sizing: border-box;
      }
      .geofs-ext-hud-header {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-bottom: 8px;
        cursor: move;
        user-select: none;
      }
      .geofs-ext-hud-grip {
        width: 10px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--geofs-ext-muted);
        fill: currentColor;
        cursor: grab;
      }
      .geofs-ext-hud-grip:hover {
        color: var(--geofs-ext-fg);
      }
      #hud-unified-tabs.unified-tabs {
        display: flex;
        align-items: stretch;
        gap: 3px;
        flex: 1;
        min-width: 0;
      }
      .unified-tab {
        flex: 1 1 auto;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 3px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer;
        text-align: center;
        line-height: 1.2;
      }
      .unified-tab:hover {
        border-color: var(--geofs-ext-fg);
        color: var(--geofs-ext-fg);
      }
      .unified-tab.active,
      .unified-tab.is-active {
        background: var(--geofs-ext-accent);
        border-color: var(--geofs-ext-accent);
        border-radius: 15px;
        color: #ffffff;
      }
      .geofs-ext-hud-min {
        flex-shrink: 0;
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        min-width: 20px;
        height: 22px;
        padding: 0 4px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        line-height: 20px;
        cursor: pointer;
        text-align: center;
      }
      .geofs-ext-hud-body {
        width: 100%;
        max-height: min(440px, calc(100vh - 140px));
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
      }
      #flightDataDisplay.is-minimized {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: move;
      }
      #flightDataDisplay.is-minimized .geofs-ext-hud-header {
        margin-bottom: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
      }
      #flightDataDisplay.is-minimized .geofs-ext-hud-grip {
        display: none;
      }
      #flightDataDisplay.is-minimized .geofs-ext-hud-min {
        border: none;
        background: transparent;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 10px;
        line-height: 40px;
      }
      #hudMinimizeBtn.unified-hud-edge-tab {
        position: fixed;
        left: 0;
        top: 50%;
        margin-top: -20px;
        width: 24px;
        height: 40px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-left: none;
        border-radius: 0 7px 7px 0;
        z-index: 2147483001;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
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
      .geofs-ext-zone--autopilot {
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%) scale(var(--geofs-ext-scale));
        background: var(--geofs-ext-bg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 8px;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      .geofs-ext-zone--right { top: 45%; right: 12px; flex-direction: column; transform-origin: right center; }
      .geofs-ext-zone--corner { bottom: 14px; right: 106px; transform-origin: bottom right; }
      .geofs-ext-pad {
        box-sizing: border-box;
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 10px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      .geofs-ext-pad.is-active,
      .geofs-ext-pad.green-pad {
        border-color: #4caf50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.45);
        color: #ffffff;
      }
      #geofs-ext-toasts {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: min(320px, calc(100vw - 40px));
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        pointer-events: none;
      }
      .geofs-ext-toast {
        box-sizing: border-box;
        max-width: 100%;
        background: rgba(40, 40, 40, 0.96);
        color: #eeeeee;
        border: 1px solid #777777;
        border-radius: 4px;
        padding: 8px 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        line-height: 1.35;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        overflow-wrap: anywhere;
      }
      .geofs-ext-toast--warn { border-color: #eab308; color: #ffd37a; }
      .geofs-ext-toast--critical { border-color: #ef4444; color: #ff8d8d; }
      .geofs-ext-prompt {
        box-sizing: border-box;
        pointer-events: auto;
        width: 100%;
        background: rgba(0, 0, 0, 0.9);
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        padding: 10px 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      }
      .geofs-ext-prompt-text {
        margin-bottom: 8px;
        line-height: 1.35;
      }
      .geofs-ext-prompt-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: flex-end;
      }
      .geofs-ext-prompt-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        padding: 4px 9px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
      }
      .geofs-ext-prompt-btn--primary { border-color: #4caf50; color: #4caf50; }
      .geofs-ext-prompt-btn--danger { border-color: #ef4444; color: #ff6b6b; }
    `;
    document.head?.appendChild(style);
    this.styleEl = style;
  }

  public destroy(): void {
    for (const cleanup of Array.from(this.dragCleanups)) cleanup();
    for (const el of this.mountedControls.values()) el.remove();
    this.mountedControls.clear();
    this.trackedElements.clear();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
    this.hudRoot?.remove();
    this.hudRoot = null;
    this.edgeHandleEl?.remove();
    this.edgeHandleEl = null;
    document.getElementById('geofs-ext-toasts')?.remove();
    for (const zone of ['top', 'bottom', 'right', 'corner', 'autopilot']) {
      document.getElementById(`geofs-ext-zone-${zone}`)?.remove();
    }
    this.styleEl?.remove();
    this.styleEl = null;
  }
}
