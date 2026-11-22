import type { CalibratorPreset } from '../types/settings';
import { resolveCalibratorScale } from '../shared/display-calibrator';

export type AnchorZone = 'top' | 'bottom' | 'right' | 'corner' | 'autopilot';
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

export interface PromptAction {
  id: string;
  label: string;
  variant?: 'primary' | 'danger' | 'neutral';
  onClick: () => void;
}

const TAB_ORDER = ['info', 'checks', 'fuel', 'land'] as const;
const HUD_TABS_STATE_KEY = 'geofs_ext_hud_tabs_state';

export class AnchorManager {
  private styleEl: HTMLStyleElement | null = null;
  private hudRoot: HTMLDivElement | null = null;
  private hudTabsEl: HTMLDivElement | null = null;
  private hudBodyEl: HTMLDivElement | null = null;
  private hudMenuEl: HTMLDivElement | null = null;
  private edgeHandleEl: HTMLButtonElement | null = null;
  private minBtnEl: HTMLButtonElement | null = null;
  private tabPanels = new Map<string, { label: string; el: HTMLElement; defaultClosed: boolean }>();
  private detachedPanels = new Map<string, { el: HTMLDivElement; cleanupDrag: () => void }>();
  private hudState: HudTabsState = {
    order: [...TAB_ORDER],
    closed: [],
    pinned: [],
    detached: [],
    dockPreset: 'top-right'
  };
  private hudMenuOpen = false;
  private draggingTabId: string | null = null;
  private savedActiveTabId: string | null = null;
  private activeTabId: string | null = null;
  private currentTheme: 'dark' | 'light' = 'dark';
  private currentPreset: CalibratorPreset = 'auto';
  private mountedControls = new Map<string, HTMLElement>();
  private syncedAutopilotPads = new Map<HTMLElement, { wrapper?: HTMLElement; sig: string; lastCheckMs: number }>();
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
    this.loadHudState();
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
    const { scale } = resolveCalibratorScale(preset);
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
      this.syncedAutopilotPads.delete(existing);
      for (const [pad, meta] of this.syncedAutopilotPads) {
        if (meta.wrapper === existing || existing.contains(pad)) {
          this.syncedAutopilotPads.delete(pad);
        }
      }
      existing.remove();
      this.mountedControls.delete(id);
    }
  }

  public syncAutopilotPad(padEl: HTMLElement, wrapperEl?: HTMLElement, force = false): void {
    if (typeof document === 'undefined' || typeof window === 'undefined' || !padEl.isConnected) return;
    const now = Date.now();
    const prev = this.syncedAutopilotPads.get(padEl);
    if (!force && prev && now - prev.lastCheckMs < 1000) return;

    const host = padEl.closest('.geofs-autopilot-bar') ?? document.querySelector('.geofs-autopilot-bar');
    const nativePad =
      host?.querySelector<HTMLElement>('.geofs-autopilot-pad:not(#autothrottle-button):not(#opEngineBarBtn)') ?? null;
    if (!nativePad) {
      this.syncedAutopilotPads.set(padEl, { wrapper: wrapperEl, sig: '', lastCheckMs: now });
      return;
    }

    const rect = nativePad.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      this.syncedAutopilotPads.set(padEl, { wrapper: wrapperEl, sig: prev?.sig ?? '', lastCheckMs: now });
      return;
    }

    const padStyle = getComputedStyle(nativePad);
    const nativeLabel = nativePad.querySelector<HTMLElement>('.control-pad-label') ?? nativePad;
    const labelStyle = getComputedStyle(nativeLabel);
    const fmtPx = (n: number) => `${Number(n.toFixed(2))}px`;

    const metrics: Array<[string, string]> = [
      ['--geofs-ext-ap-width', fmtPx(rect.width)],
      ['--geofs-ext-ap-height', fmtPx(rect.height)],
      ['--geofs-ext-ap-radius', padStyle.borderRadius || '15px'],
      ['--geofs-ext-ap-margin', padStyle.margin || '0 10px'],
      ['--geofs-ext-ap-valign', padStyle.verticalAlign || 'middle'],
      ['--geofs-ext-ap-font-family', labelStyle.fontFamily || 'inherit'],
      ['--geofs-ext-ap-font-size', labelStyle.fontSize || '12px'],
      ['--geofs-ext-ap-font-weight', labelStyle.fontWeight || '400'],
      ['--geofs-ext-ap-letter-spacing', labelStyle.letterSpacing || 'normal']
    ];

    const sig = metrics.map(([, v]) => v).join('|');
    this.syncedAutopilotPads.set(padEl, { wrapper: wrapperEl, sig, lastCheckMs: now });
    if (prev?.sig === sig) return;

    for (const [prop, val] of metrics) {
      padEl.style.setProperty(prop, val);
    }
    if (wrapperEl) {
      wrapperEl.style.setProperty('--geofs-ext-ap-valign', padStyle.verticalAlign || 'middle');
    }
  }

  public registerHudTab(
    id: string,
    label: string,
    contentEl: HTMLElement,
    activate = false,
    options?: { defaultClosed?: boolean }
  ): () => void {
    this.ensureHud();
    const defaultClosed = Boolean(options?.defaultClosed);
    this.tabPanels.set(id, { label, el: contentEl, defaultClosed });
    if (!this.hudState.order.includes(id)) {
      this.hudState.order.push(id);
      if (defaultClosed && !this.hudState.closed.includes(id) && !this.hudState.detached.includes(id)) {
        this.hudState.closed.push(id);
      }
    }

    if (this.hudState.detached.includes(id)) {
      this.mountDetachedPanel(id);
    } else if (!this.hudState.closed.includes(id)) {
      if (this.savedActiveTabId === id) {
        this.savedActiveTabId = null;
        this.selectTab(id);
      } else if ((activate && !this.savedActiveTabId) || !this.activeTabId) {
        this.selectTab(id);
      }
    }
    this.renderTabs();
    this.renderHudMenu();
    this.clampAll();
    return () => {
      this.unmountDetachedPanel(id);
      this.tabPanels.delete(id);
      if (this.activeTabId === id) {
        const visible = this.visibleDockedEntries();
        this.activeTabId = visible[0]?.[0] ?? null;
      }
      this.renderTabs();
      this.renderHudMenu();
      if (this.activeTabId) this.selectTab(this.activeTabId);
      else if (this.hudBodyEl) this.hudBodyEl.innerHTML = '';
    };
  }

  public openHudTab(id: string): void {
    this.ensureHud();
    if (!this.hudRoot || !this.tabPanels.has(id)) return;
    if (this.hudState.detached.includes(id)) {
      const panel = this.detachedPanels.get(id)?.el;
      if (panel) {
        panel.style.display = 'flex';
        this.bringToFront(panel);
        this.clampElementToViewport(panel);
        return;
      }
      this.hudState.detached = this.hudState.detached.filter((item) => item !== id);
    }
    this.hudState.closed = this.hudState.closed.filter((item) => item !== id);
    this.saveHudState();
    this.hudHidden = false;
    this.hudRoot.style.display = 'flex';
    if (this.hudMinimized) {
      this.setHudMinimized(false);
    }
    this.selectTab(id);
    this.bringToFront(this.hudRoot);
    this.syncEdgeHandle();
    this.clampElementToViewport(this.hudRoot);
    this.renderHudMenu();
  }

  public closeHudTab(id: string): void {
    if (!this.tabPanels.has(id) || this.hudState.pinned.includes(id)) return;
    if (this.hudState.detached.includes(id)) {
      this.unmountDetachedPanel(id);
      this.hudState.detached = this.hudState.detached.filter((item) => item !== id);
      if (!this.hudState.closed.includes(id)) this.hudState.closed.push(id);
      this.saveHudState();
      this.renderTabs();
      this.renderHudMenu();
      return;
    }
    const visible = this.visibleDockedEntries();
    if (visible.length <= 1 && visible[0]?.[0] === id) return;
    if (!this.hudState.closed.includes(id)) {
      this.hudState.closed.push(id);
    }
    if (this.activeTabId === id) {
      const next = this.visibleDockedEntries()[0]?.[0] ?? null;
      this.activeTabId = next;
    }
    this.saveHudState();
    this.renderTabs();
    if (this.activeTabId) this.selectTab(this.activeTabId);
    else if (this.hudBodyEl) this.hudBodyEl.innerHTML = '';
    this.renderHudMenu();
  }

  public pinHudTab(id: string, pinned?: boolean): void {
    if (!this.tabPanels.has(id)) return;
    const currentlyPinned = this.hudState.pinned.includes(id);
    const nextPinned = pinned ?? !currentlyPinned;
    if (nextPinned && !currentlyPinned) {
      this.hudState.pinned.push(id);
      this.hudState.closed = this.hudState.closed.filter((item) => item !== id);
    } else if (!nextPinned && currentlyPinned) {
      this.hudState.pinned = this.hudState.pinned.filter((item) => item !== id);
    }
    this.saveHudState();
    this.renderTabs();
    this.renderHudMenu();
  }

  public detachHudTab(id: string): void {
    if (!this.tabPanels.has(id)) return;
    this.hudState.closed = this.hudState.closed.filter((item) => item !== id);
    if (!this.hudState.detached.includes(id)) {
      this.hudState.detached.push(id);
    }
    if (this.activeTabId === id) {
      const next = this.visibleDockedEntries().find(([tabId]) => tabId !== id)?.[0] ?? null;
      this.activeTabId = next;
    }
    this.saveHudState();
    this.mountDetachedPanel(id);
    this.renderTabs();
    if (this.activeTabId) this.selectTab(this.activeTabId);
    else if (this.hudBodyEl) this.hudBodyEl.innerHTML = '';
    this.renderHudMenu();
  }

  public redockHudTab(id: string): void {
    if (!this.tabPanels.has(id)) return;
    this.unmountDetachedPanel(id);
    this.hudState.detached = this.hudState.detached.filter((item) => item !== id);
    this.hudState.closed = this.hudState.closed.filter((item) => item !== id);
    this.saveHudState();
    this.openHudTab(id);
  }

  public reorderHudTab(sourceId: string, targetId: string): void {
    if (sourceId === targetId || !this.tabPanels.has(sourceId) || !this.tabPanels.has(targetId)) return;
    const order = [...this.hudState.order];
    if (!order.includes(sourceId)) order.push(sourceId);
    if (!order.includes(targetId)) order.push(targetId);
    const fromIdx = order.indexOf(sourceId);
    const toIdx = order.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    order.splice(fromIdx, 1);
    order.splice(toIdx, 0, sourceId);
    this.hudState.order = order;
    this.saveHudState();
    this.renderTabs();
    this.renderHudMenu();
  }

  public setHudDockPreset(preset: HudDockPreset): void {
    this.hudState.dockPreset = preset;
    this.saveHudState();
    try {
      localStorage.removeItem('geofs_ext_hud_pos');
    } catch {
      // ignore storage errors
    }
    if (this.hudRoot) {
      this.applyDockPresetStyles(this.hudRoot, preset);
      this.syncEdgeHandle();
      this.clampElementToViewport(this.hudRoot);
    }
    this.renderHudMenu();
  }

  public resetHudLayout(): void {
    for (const id of Array.from(this.detachedPanels.keys())) {
      this.unmountDetachedPanel(id);
    }
    const defaultClosed: string[] = [];
    for (const [id, meta] of this.tabPanels.entries()) {
      if (meta.defaultClosed) defaultClosed.push(id);
    }
    this.hudState = {
      order: [...TAB_ORDER, ...Array.from(this.tabPanels.keys()).filter((id) => !TAB_ORDER.includes(id as (typeof TAB_ORDER)[number]))],
      closed: defaultClosed,
      pinned: [],
      detached: [],
      dockPreset: 'top-right'
    };
    this.saveHudState();
    try {
      localStorage.removeItem('geofs_ext_hud_pos');
    } catch {
      // ignore storage errors
    }
    if (this.hudRoot) {
      this.applyDockPresetStyles(this.hudRoot, 'top-right');
    }
    const first = this.visibleDockedEntries()[0]?.[0] ?? null;
    this.activeTabId = first;
    this.renderTabs();
    if (first) this.selectTab(first);
    this.renderHudMenu();
  }

  public getHudTabsState(): HudTabsState & { activeTabId: string | null } {
    return {
      order: [...this.hudState.order],
      closed: [...this.hudState.closed],
      pinned: [...this.hudState.pinned],
      detached: [...this.hudState.detached],
      dockPreset: this.hudState.dockPreset,
      activeTabId: this.activeTabId
    };
  }

  public toggleHudVisibility(): boolean {
    this.ensureHud();
    if (!this.hudRoot) return false;
    const leftVal = Number.parseFloat(this.hudRoot.style.left || '');
    const dockedLeftMinimized = this.hudMinimized && Number.isFinite(leftVal) && leftVal <= 16;
    if (this.hudHidden || dockedLeftMinimized) {
      this.hudHidden = false;
      this.setHudMinimized(false);
      this.syncEdgeHandle();
      this.bringToFront(this.hudRoot);
      this.clampElementToViewport(this.hudRoot);
      return true;
    }
    this.hudHidden = true;
    this.syncEdgeHandle();
    this.saveHudState();
    return false;
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
    if (el.classList.contains('addonpack-card') && !el.classList.contains('active')) return;
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
      this.resizeListener = () => {
        if (this.currentPreset === 'auto') {
          this.setCalibratorPreset('auto');
        }
        this.clampAll();
        for (const [pad, meta] of Array.from(this.syncedAutopilotPads.entries())) {
          if (!pad.isConnected) {
            this.syncedAutopilotPads.delete(pad);
            continue;
          }
          this.syncAutopilotPad(pad, meta.wrapper, true);
        }
      };
      window.addEventListener('resize', this.resizeListener);
      if (typeof window.screen !== 'undefined' && 'onchange' in window.screen) {
        (window.screen as Screen & { addEventListener?: (t: string, cb: () => void) => void }).addEventListener?.(
          'change',
          this.resizeListener
        );
      }
    }
  }

  public makeDraggable(
    card: HTMLElement,
    storageKey: string,
    dragHandle?: HTMLElement,
    options?: { axis?: 'both' | 'vertical' }
  ): () => void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return () => {};
    const axis = options?.axis ?? 'both';
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
        if (axis === 'vertical') {
          if (Number.isFinite(parsedTop)) {
            card.style.left = '0px';
            card.style.top = `${Math.max(0, parsedTop)}px`;
            card.style.bottom = 'auto';
            card.style.right = 'auto';
            this.clampElementToViewport(card);
          }
        } else if (Number.isFinite(parsedLeft) && Number.isFinite(parsedTop)) {
          card.style.left = `${Math.max(0, parsedLeft)}px`;
          card.style.top = `${Math.max(0, parsedTop)}px`;
          card.style.bottom = 'auto';
          card.style.right = 'auto';
          card.style.transformOrigin = 'top left';
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
      delete card.dataset.justDragged;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, a, select, textarea, label, .geofs-ext-hud-menu, .geofs-ext-hud-add, .geofs-ext-tab-close')) return;
      if (target?.closest('.unified-tab')) return;
      if (target?.closest('button')) {
        const inHudHeader = Boolean(target.closest('.geofs-ext-hud-header'));
        if (!card.classList.contains('is-minimized') && !isSelfButton && !inHudHeader) {
          return;
        }
      }
      e.preventDefault();
      isPointerDown = true;
      dragMoved = false;
      startX = e.clientX;
      startY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerDown) return;
      if (!dragMoved) {
        const dist =
          axis === 'vertical'
            ? Math.abs(e.clientY - startY)
            : Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist < 4) return;
        dragMoved = true;
        window.getSelection()?.removeAllRanges();
        const rect = card.getBoundingClientRect();
        dragOffsetX = startX - rect.left;
        dragOffsetY = startY - rect.top;
        dragWidth = rect.width || card.offsetWidth;
        dragHeight = rect.height || card.offsetHeight;
        if (axis === 'vertical') {
          card.style.left = '0px';
        } else {
          card.style.left = `${Math.round(rect.left)}px`;
          card.style.transformOrigin = 'top left';
        }
        card.style.top = `${Math.round(rect.top)}px`;
        card.style.bottom = 'auto';
        card.style.right = 'auto';
        card.classList.add('is-dragging');
        document.documentElement.classList.add('geofs-ext-dragging');
      }

      const maxY = Math.max(0, window.innerHeight - dragHeight);
      const newTop = Math.max(0, Math.min(e.clientY - dragOffsetY, maxY));
      if (axis === 'vertical') {
        card.style.left = '0px';
        card.style.top = `${Math.round(newTop)}px`;
      } else {
        const maxX = Math.max(0, window.innerWidth - dragWidth);
        const newLeft = Math.max(0, Math.min(e.clientX - dragOffsetX, maxX));
        card.style.left = `${Math.round(newLeft)}px`;
        card.style.top = `${Math.round(newTop)}px`;
      }
    };

    const endDrag = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      card.style.cursor = '';
      card.classList.remove('is-dragging');
      document.documentElement.classList.remove('geofs-ext-dragging');
      if (dragMoved) {
        dragMoved = false;
        card.dataset.justDragged = '1';
        setTimeout(() => {
          delete card.dataset.justDragged;
        }, 0);
        try {
          const payload =
            axis === 'vertical'
              ? { top: card.style.top }
              : { left: card.style.left, top: card.style.top };
          localStorage.setItem(storageKey, JSON.stringify(payload));
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
    document.addEventListener('mouseup', endDrag);
    window.addEventListener('blur', endDrag);
    card.addEventListener('click', onClickCapture, true);

    const cleanup = () => {
      if (isPointerDown) {
        isPointerDown = false;
        dragMoved = false;
        card.style.cursor = '';
        card.classList.remove('is-dragging');
        document.documentElement.classList.remove('geofs-ext-dragging');
      }
      triggerEl.removeEventListener('mousedown', onMouseDown);
      card.removeEventListener('mousedown', onCardFocusDown, true);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', endDrag);
      window.removeEventListener('blur', endDrag);
      card.removeEventListener('click', onClickCapture, true);
      this.resizeObserver?.unobserve(card);
      this.trackedElements.delete(card);
      this.dragCleanups.delete(cleanup);
    };
    this.dragCleanups.add(cleanup);
    return cleanup;
  }

  private applyHudMinimizedState(minimized: boolean): void {
    if (!this.hudRoot || !this.hudTabsEl || !this.hudBodyEl || !this.minBtnEl) return;
    this.hudMinimized = minimized;
    this.hudRoot.classList.toggle('is-minimized', minimized);
    this.minBtnEl.textContent = minimized ? 'HUD' : '−';
    const label = minimized ? 'Restore HUD' : 'Minimize HUD';
    this.minBtnEl.setAttribute('aria-label', label);
    this.minBtnEl.dataset.hudTip = label;
    this.hudTabsEl.style.display = minimized ? 'none' : 'flex';
    this.hudBodyEl.style.display = minimized ? 'none' : 'block';
  }

  private setHudMinimized(minimized: boolean): void {
    if (!this.hudRoot) return;
    this.applyHudMinimizedState(minimized);
    this.syncEdgeHandle();
    this.clampElementToViewport(this.hudRoot);
    this.saveHudState();
  }

  private syncEdgeHandle(): void {
    if (!this.edgeHandleEl || !this.hudRoot) return;
    const leftVal = Number.parseFloat(this.hudRoot.style.left || '');
    const dockedLeftMinimized = this.hudMinimized && Number.isFinite(leftVal) && leftVal <= 16;
    const showEdge = this.hudHidden || dockedLeftMinimized;
    this.edgeHandleEl.style.display = showEdge ? 'flex' : 'none';
    this.hudRoot.style.display = showEdge ? 'none' : 'flex';
    if (showEdge) {
      if (dockedLeftMinimized && this.hudRoot.style.top) {
        this.edgeHandleEl.style.top = this.hudRoot.style.top;
        this.edgeHandleEl.style.bottom = 'auto';
        try {
          localStorage.setItem('geofs_ext_edge_tab_top', JSON.stringify({ top: this.edgeHandleEl.style.top }));
        } catch {
          // ignore storage quota errors
        }
      }
      this.edgeHandleEl.style.left = '0px';
      this.edgeHandleEl.style.right = 'auto';
      this.clampElementToViewport(this.edgeHandleEl);
    }
  }

  private bindHudTip(el: HTMLElement): () => void {
    const updatePlacement = () => {
      if (typeof window === 'undefined') return;
      const rect = el.getBoundingClientRect();
      el.dataset.tipV = rect.bottom + 32 > window.innerHeight ? 'above' : 'below';
      if (rect.right > window.innerWidth - 110) {
        el.dataset.tipH = 'right';
      } else if (rect.left < 110) {
        el.dataset.tipH = 'left';
      } else {
        el.dataset.tipH = 'center';
      }
    };
    el.addEventListener('mouseenter', updatePlacement);
    el.addEventListener('focus', updatePlacement);
    return () => {
      el.removeEventListener('mouseenter', updatePlacement);
      el.removeEventListener('focus', updatePlacement);
    };
  }

  private setupEdgeTabInteraction(edgeTab: HTMLButtonElement): () => void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return () => {};
    const BORDER_DOCK_PX = 16;
    let isPointerDown = false;
    let dragMoved = false;
    let dockedOut = false;
    let startX = 0;
    let startY = 0;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let edgeHeight = 40;

    this.trackedElements.add(edgeTab);
    this.resizeObserver?.observe(edgeTab);

    try {
      const saved = localStorage.getItem('geofs_ext_edge_tab_top');
      if (saved) {
        const { top } = JSON.parse(saved) as { top?: string };
        const parsedTop = top ? Number.parseFloat(top) : NaN;
        if (Number.isFinite(parsedTop)) {
          edgeTab.style.left = '0px';
          edgeTab.style.top = `${Math.max(0, parsedTop)}px`;
          edgeTab.style.bottom = 'auto';
          edgeTab.style.right = 'auto';
          this.clampElementToViewport(edgeTab);
        }
      }
    } catch {
      // ignore invalid saved coordinates
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      delete edgeTab.dataset.justDragged;
      isPointerDown = true;
      dragMoved = false;
      dockedOut = false;
      startX = e.clientX;
      startY = e.clientY;
      const rect = edgeTab.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      edgeHeight = rect.height || edgeTab.offsetHeight || 40;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerDown) return;
      if (!dragMoved) {
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist < 4) return;
        dragMoved = true;
        window.getSelection()?.removeAllRanges();
        edgeTab.classList.add('is-dragging');
        document.documentElement.classList.add('geofs-ext-dragging');
      }

      const rawLeft = e.clientX - dragOffsetX;
      const rawTop = e.clientY - dragOffsetY;

      if (rawLeft > BORDER_DOCK_PX && this.hudRoot) {
        if (!dockedOut) {
          dockedOut = true;
          this.hudHidden = false;
          this.applyHudMinimizedState(true);
          edgeTab.style.display = 'none';
          this.hudRoot.style.display = 'flex';
          this.hudRoot.style.right = 'auto';
          this.hudRoot.style.bottom = 'auto';
          this.hudRoot.style.transformOrigin = 'top left';
          this.hudRoot.classList.add('is-dragging');
          this.bringToFront(this.hudRoot);
        }
        const circleRect = this.hudRoot.getBoundingClientRect();
        const circleW = circleRect.width || 40;
        const circleH = circleRect.height || 40;
        const maxX = Math.max(0, window.innerWidth - circleW);
        const maxY = Math.max(0, window.innerHeight - circleH);
        const clampedLeft = Math.max(0, Math.min(rawLeft, maxX));
        const clampedTop = Math.max(0, Math.min(rawTop, maxY));
        this.hudRoot.style.left = `${Math.round(clampedLeft)}px`;
        this.hudRoot.style.top = `${Math.round(clampedTop)}px`;
      } else {
        if (dockedOut && this.hudRoot) {
          dockedOut = false;
          this.hudRoot.classList.remove('is-dragging');
          this.hudRoot.style.display = 'none';
          edgeTab.style.display = 'flex';
        }
        const maxY = Math.max(0, window.innerHeight - edgeHeight);
        const clampedTop = Math.max(0, Math.min(rawTop, maxY));
        edgeTab.style.left = '0px';
        edgeTab.style.right = 'auto';
        edgeTab.style.bottom = 'auto';
        edgeTab.style.top = `${Math.round(clampedTop)}px`;
      }
    };

    const endDrag = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      edgeTab.classList.remove('is-dragging');
      this.hudRoot?.classList.remove('is-dragging');
      document.documentElement.classList.remove('geofs-ext-dragging');
      if (dragMoved) {
        dragMoved = false;
        edgeTab.dataset.justDragged = '1';
        setTimeout(() => {
          delete edgeTab.dataset.justDragged;
        }, 0);
        if (dockedOut && this.hudRoot) {
          this.hudRoot.dataset.justDragged = '1';
          setTimeout(() => {
            if (this.hudRoot) delete this.hudRoot.dataset.justDragged;
          }, 0);
          try {
            localStorage.setItem(
              'geofs_ext_hud_pos',
              JSON.stringify({ left: this.hudRoot.style.left, top: this.hudRoot.style.top })
            );
          } catch {
            // ignore storage quota errors
          }
        } else {
          try {
            localStorage.setItem('geofs_ext_edge_tab_top', JSON.stringify({ top: edgeTab.style.top }));
          } catch {
            // ignore storage quota errors
          }
          if (this.hudRoot) {
            this.hudRoot.style.top = edgeTab.style.top;
          }
        }
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (edgeTab.dataset.justDragged === '1') {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        delete edgeTab.dataset.justDragged;
      }
    };

    edgeTab.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', endDrag);
    window.addEventListener('blur', endDrag);
    edgeTab.addEventListener('click', onClickCapture, true);

    const cleanup = () => {
      if (isPointerDown) {
        isPointerDown = false;
        dragMoved = false;
        dockedOut = false;
        edgeTab.classList.remove('is-dragging');
        this.hudRoot?.classList.remove('is-dragging');
        document.documentElement.classList.remove('geofs-ext-dragging');
      }
      edgeTab.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', endDrag);
      window.removeEventListener('blur', endDrag);
      edgeTab.removeEventListener('click', onClickCapture, true);
      this.resizeObserver?.unobserve(edgeTab);
      this.trackedElements.delete(edgeTab);
      this.dragCleanups.delete(cleanup);
    };
    this.dragCleanups.add(cleanup);
    return cleanup;
  }

  private ensureHud(): void {
    if (typeof document === 'undefined' || this.hudRoot || !document.body) return;
    const stale = document.getElementById('flightDataDisplay');
    if (stale && !stale.classList.contains('geofs-ext-hud')) {
      stale.remove();
    }
    const staleEdge = document.getElementById('hudMinimizeBtn');
    if (staleEdge && !staleEdge.classList.contains('unified-hud-edge-tab')) {
      staleEdge.remove();
    }

    const root = document.createElement('div');
    root.id = 'flightDataDisplay';
    root.className = 'geofs-ext-hud';

    const header = document.createElement('div');
    header.className = 'geofs-ext-hud-header';

    const grip = document.createElement('span');
    grip.className = 'geofs-ext-hud-grip';
    grip.dataset.hudTip = 'Drag HUD';
    grip.setAttribute('aria-label', 'Drag HUD');
    grip.innerHTML =
      '<svg width="6" height="12" viewBox="0 0 6 12" aria-hidden="true" focusable="false"><circle cx="1.5" cy="2" r="1"/><circle cx="4.5" cy="2" r="1"/><circle cx="1.5" cy="6" r="1"/><circle cx="4.5" cy="6" r="1"/><circle cx="1.5" cy="10" r="1"/><circle cx="4.5" cy="10" r="1"/></svg>';

    const tabs = document.createElement('div');
    tabs.id = 'hud-unified-tabs';
    tabs.className = 'unified-tabs';

    const minBtn = document.createElement('button');
    minBtn.type = 'button';
    minBtn.className = 'geofs-ext-hud-min';
    minBtn.dataset.hudTip = 'Minimize HUD';
    minBtn.setAttribute('aria-label', 'Minimize HUD');
    minBtn.textContent = '−';
    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (root.dataset.justDragged === '1') return;
      this.setHudMinimized(!this.hudMinimized);
    });

    header.append(grip, tabs, minBtn);

    const body = document.createElement('div');
    body.className = 'geofs-ext-hud-body';

    const menu = document.createElement('div');
    menu.className = 'geofs-ext-hud-menu';
    menu.style.display = 'none';

    root.append(header, menu, body);
    document.body.appendChild(root);

    const edgeTab = document.createElement('button');
    edgeTab.id = 'hudMinimizeBtn';
    edgeTab.type = 'button';
    edgeTab.className = 'unified-hud-edge-tab';
    edgeTab.dataset.hudTip = 'Click to expand · Drag out for HUD circle';
    edgeTab.setAttribute('aria-label', 'Expand or drag Flight HUD');
    edgeTab.textContent = '▸';
    edgeTab.style.display = 'none';
    edgeTab.addEventListener('click', () => {
      if (edgeTab.dataset.justDragged === '1') return;
      if (edgeTab.style.top) {
        root.style.top = edgeTab.style.top;
      }
      this.hudHidden = false;
      this.setHudMinimized(false);
    });
    document.body.appendChild(edgeTab);

    this.hudRoot = root;
    this.hudTabsEl = tabs;
    this.hudBodyEl = body;
    this.hudMenuEl = menu;
    this.minBtnEl = minBtn;
    this.edgeHandleEl = edgeTab;

    this.applyDockPresetStyles(root, this.hudState.dockPreset);
    this.makeDraggable(root, 'geofs_ext_hud_pos');
    this.setupEdgeTabInteraction(edgeTab);
    this.dragCleanups.add(this.bindHudTip(grip));
    this.dragCleanups.add(this.bindHudTip(minBtn));
    if (this.hudMinimized) {
      this.applyHudMinimizedState(true);
    }
    this.clampElementToViewport(root);
    this.syncEdgeHandle();
  }

  private loadHudState(): void {
    try {
      const raw = localStorage.getItem(HUD_TABS_STATE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<HudTabsState>;
      const validPreset = (p: unknown): p is HudDockPreset =>
        p === 'top-right' || p === 'top-left' || p === 'bottom-right' || p === 'bottom-left';
      this.hudState = {
        order: Array.isArray(parsed.order) ? parsed.order.filter((x): x is string => typeof x === 'string') : [...TAB_ORDER],
        closed: Array.isArray(parsed.closed) ? parsed.closed.filter((x): x is string => typeof x === 'string') : [],
        pinned: Array.isArray(parsed.pinned) ? parsed.pinned.filter((x): x is string => typeof x === 'string') : [],
        detached: Array.isArray(parsed.detached) ? parsed.detached.filter((x): x is string => typeof x === 'string') : [],
        dockPreset: validPreset(parsed.dockPreset) ? parsed.dockPreset : 'top-right'
      };
      this.savedActiveTabId = typeof parsed.activeTabId === 'string' ? parsed.activeTabId : null;
      this.hudMinimized = Boolean(parsed.hudMinimized);
      this.hudHidden = Boolean(parsed.hudHidden);
    } catch {
      // ignore invalid saved tab state
    }
  }

  private saveHudState(): void {
    try {
      const payload: HudTabsState = {
        ...this.hudState,
        activeTabId: this.activeTabId,
        hudMinimized: this.hudMinimized,
        hudHidden: this.hudHidden
      };
      localStorage.setItem(HUD_TABS_STATE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }

  private applyDockPresetStyles(root: HTMLElement, preset: HudDockPreset): void {
    root.style.top = 'auto';
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    root.style.left = 'auto';
    if (preset === 'top-right') {
      root.style.top = '70px';
      root.style.right = '20px';
      root.style.transformOrigin = 'top right';
    } else if (preset === 'top-left') {
      root.style.top = '70px';
      root.style.left = '20px';
      root.style.transformOrigin = 'top left';
    } else if (preset === 'bottom-right') {
      root.style.bottom = '20px';
      root.style.right = '20px';
      root.style.transformOrigin = 'bottom right';
    } else {
      root.style.bottom = '20px';
      root.style.left = '20px';
      root.style.transformOrigin = 'bottom left';
    }
  }

  private orderedTabEntries(): Array<[string, { label: string; el: HTMLElement; defaultClosed: boolean }]> {
    const entries = Array.from(this.tabPanels.entries());
    const pinnedSet = new Set(this.hudState.pinned);
    entries.sort(([a], [b]) => {
      const pinA = pinnedSet.has(a) ? 0 : 1;
      const pinB = pinnedSet.has(b) ? 0 : 1;
      if (pinA !== pinB) return pinA - pinB;
      const idxA = this.hudState.order.indexOf(a);
      const idxB = this.hudState.order.indexOf(b);
      const rankA = idxA >= 0 ? idxA : this.hudState.order.length + TAB_ORDER.length;
      const rankB = idxB >= 0 ? idxB : this.hudState.order.length + TAB_ORDER.length;
      return rankA - rankB;
    });
    return entries;
  }

  private visibleDockedEntries(): Array<[string, { label: string; el: HTMLElement; defaultClosed: boolean }]> {
    const closedSet = new Set(this.hudState.closed);
    const detachedSet = new Set(this.hudState.detached);
    return this.orderedTabEntries().filter(([id]) => !closedSet.has(id) && !detachedSet.has(id));
  }

  private mountDetachedPanel(id: string): void {
    if (typeof document === 'undefined' || !document.body) return;
    const entry = this.tabPanels.get(id);
    if (!entry) return;
    this.unmountDetachedPanel(id);

    const panel = document.createElement('div');
    panel.id = `geofs-ext-detached-${id}`;
    panel.className = 'geofs-ext-detached-panel';

    const header = document.createElement('div');
    header.className = 'geofs-ext-detached-header';

    const title = document.createElement('span');
    title.className = 'geofs-ext-detached-title';
    title.textContent = entry.label;

    const actions = document.createElement('span');
    actions.className = 'geofs-ext-detached-actions';

    const dockBtn = document.createElement('button');
    dockBtn.type = 'button';
    dockBtn.className = 'geofs-ext-detached-btn';
    dockBtn.textContent = '↙';
    dockBtn.title = 'Re-dock to HUD';
    dockBtn.setAttribute('aria-label', `Re-dock ${entry.label}`);
    dockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.redockHudTab(id);
    });

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'geofs-ext-detached-btn';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close detached panel';
    closeBtn.setAttribute('aria-label', `Close ${entry.label}`);
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeHudTab(id);
    });

    actions.append(dockBtn, closeBtn);
    header.append(title, actions);

    const body = document.createElement('div');
    body.className = 'geofs-ext-detached-body';
    body.appendChild(entry.el);

    panel.append(header, body);
    document.body.appendChild(panel);
    this.bringToFront(panel);
    const cleanupDrag = this.makeDraggable(panel, `geofs_ext_hud_detached_${id}`, header);
    this.detachedPanels.set(id, { el: panel, cleanupDrag });
    this.clampElementToViewport(panel);
  }

  private unmountDetachedPanel(id: string): void {
    const existing = this.detachedPanels.get(id);
    if (!existing) return;
    existing.cleanupDrag();
    existing.el.remove();
    this.detachedPanels.delete(id);
  }

  private renderTabs(): void {
    if (!this.hudTabsEl) return;
    this.hudTabsEl.innerHTML = '';
    const entries = this.visibleDockedEntries();
    const pinnedSet = new Set(this.hudState.pinned);

    for (const [id, { label }] of entries) {
      const isPinned = pinnedSet.has(id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `tab-btn-${id}`;
      btn.className = `unified-tab ${this.activeTabId === id ? 'active is-active' : ''} ${isPinned ? 'is-pinned' : ''}`;
      btn.draggable = true;
      btn.setAttribute('aria-label', label);
      btn.title = isPinned ? `${label} (Pinned — drag to reorder)` : `${label} (Drag to reorder)`;

      const labelEl = document.createElement('span');
      labelEl.className = 'geofs-ext-tab-label';
      labelEl.textContent = isPinned ? `• ${label}` : label;
      btn.appendChild(labelEl);

      if (!isPinned && entries.length > 1) {
        const closeEl = document.createElement('span');
        closeEl.className = 'geofs-ext-tab-close';
        closeEl.setAttribute('role', 'button');
        closeEl.setAttribute('aria-label', `Close ${label} tab`);
        closeEl.title = `Close ${label}`;
        closeEl.textContent = '×';
        closeEl.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.closeHudTab(id);
        });
        btn.appendChild(closeEl);
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hudMenuOpen = false;
        if (this.hudMenuEl) this.hudMenuEl.style.display = 'none';
        this.selectTab(id);
      });

      btn.addEventListener('dragstart', (e) => {
        this.draggingTabId = id;
        btn.classList.add('is-tab-dragging');
        e.dataTransfer?.setData('text/plain', id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });
      btn.addEventListener('dragover', (e) => {
        if (!this.draggingTabId || this.draggingTabId === id) return;
        e.preventDefault();
        btn.classList.add('is-drag-over');
      });
      btn.addEventListener('dragleave', () => {
        btn.classList.remove('is-drag-over');
      });
      btn.addEventListener('drop', (e) => {
        e.preventDefault();
        btn.classList.remove('is-drag-over');
        const sourceId = this.draggingTabId || e.dataTransfer?.getData('text/plain');
        if (sourceId && sourceId !== id) {
          this.reorderHudTab(sourceId, id);
        }
      });
      btn.addEventListener('dragend', () => {
        this.draggingTabId = null;
        btn.classList.remove('is-tab-dragging', 'is-drag-over');
      });

      this.hudTabsEl.appendChild(btn);
    }

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.id = 'hud-tab-add-btn';
    addBtn.className = `geofs-ext-hud-add ${this.hudMenuOpen ? 'is-open' : ''}`;
    addBtn.textContent = '+';
    addBtn.title = 'Open tabs, pin/detach modules & dock presets';
    addBtn.setAttribute('aria-label', 'Open tab or dock preset');
    addBtn.setAttribute('aria-expanded', String(this.hudMenuOpen));
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hudMenuOpen = !this.hudMenuOpen;
      this.renderTabs();
      this.renderHudMenu();
    });
    this.hudTabsEl.appendChild(addBtn);
  }

  private renderHudMenu(): void {
    if (!this.hudMenuEl) return;
    if (!this.hudMenuOpen) {
      this.hudMenuEl.style.display = 'none';
      return;
    }

    this.hudMenuEl.style.display = 'flex';
    this.hudMenuEl.innerHTML = '';

    const tabsTitle = document.createElement('div');
    tabsTitle.className = 'geofs-ext-hud-menu-title';
    tabsTitle.textContent = 'HUD Modules & Tabs';
    this.hudMenuEl.appendChild(tabsTitle);

    const closedSet = new Set(this.hudState.closed);
    const pinnedSet = new Set(this.hudState.pinned);
    const detachedSet = new Set(this.hudState.detached);

    for (const [id, { label }] of this.orderedTabEntries()) {
      const row = document.createElement('div');
      row.className = 'geofs-ext-hud-menu-row';

      const nameBtn = document.createElement('button');
      nameBtn.type = 'button';
      nameBtn.className = 'geofs-ext-hud-menu-name';
      const isClosed = closedSet.has(id);
      const isDetached = detachedSet.has(id);
      const isPinned = pinnedSet.has(id);
      nameBtn.textContent = `${label}${isDetached ? ' (Detached)' : isClosed ? ' (Closed)' : ''}`;
      nameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hudMenuOpen = false;
        this.openHudTab(id);
        this.renderTabs();
      });

      const actions = document.createElement('span');
      actions.className = 'geofs-ext-hud-menu-actions';

      const pinBtn = document.createElement('button');
      pinBtn.type = 'button';
      pinBtn.className = `geofs-ext-hud-menu-chip ${isPinned ? 'is-active' : ''}`;
      pinBtn.textContent = isPinned ? 'Unpin' : 'Pin';
      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pinHudTab(id);
      });

      const detachBtn = document.createElement('button');
      detachBtn.type = 'button';
      detachBtn.className = `geofs-ext-hud-menu-chip ${isDetached ? 'is-active' : ''}`;
      detachBtn.textContent = isDetached ? 'Dock' : 'Detach';
      detachBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isDetached) this.redockHudTab(id);
        else this.detachHudTab(id);
      });

      actions.append(pinBtn, detachBtn);
      row.append(nameBtn, actions);
      this.hudMenuEl.appendChild(row);
    }

    const dockTitle = document.createElement('div');
    dockTitle.className = 'geofs-ext-hud-menu-title';
    dockTitle.textContent = 'Dock Presets';
    this.hudMenuEl.appendChild(dockTitle);

    const presetGrid = document.createElement('div');
    presetGrid.className = 'geofs-ext-hud-preset-grid';
    const presets: Array<[HudDockPreset, string]> = [
      ['top-left', 'Top-Left'],
      ['top-right', 'Top-Right'],
      ['bottom-left', 'Bot-Left'],
      ['bottom-right', 'Bot-Right']
    ];
    for (const [preset, text] of presets) {
      const pBtn = document.createElement('button');
      pBtn.type = 'button';
      pBtn.className = `geofs-ext-hud-menu-chip ${this.hudState.dockPreset === preset ? 'is-active' : ''}`;
      pBtn.textContent = text;
      pBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setHudDockPreset(preset);
      });
      presetGrid.appendChild(pBtn);
    }
    this.hudMenuEl.appendChild(presetGrid);

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'geofs-ext-hud-menu-reset';
    resetBtn.textContent = 'Reset Default Layout';
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hudMenuOpen = false;
      this.resetHudLayout();
    });
    this.hudMenuEl.appendChild(resetBtn);
  }

  private selectTab(id: string): void {
    const entry = this.tabPanels.get(id);
    if (!entry || !this.hudBodyEl) return;
    if (this.hudState.detached.includes(id)) return;
    this.hudState.closed = this.hudState.closed.filter((item) => item !== id);
    this.activeTabId = id;
    this.hudBodyEl.innerHTML = '';
    this.hudBodyEl.appendChild(entry.el);
    this.renderTabs();
    this.saveHudState();
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
        --geofs-ext-surface: rgba(255, 255, 255, 0.08);
        --geofs-ext-fg: #ffffff;
        --geofs-ext-muted: rgba(255, 255, 255, 0.58);
        --geofs-ext-border: #888888;
        --geofs-ext-divider: rgba(255, 255, 255, 0.14);
        --geofs-ext-accent: #ffc107;
        --geofs-ext-accent-fg: #000000;
        --geofs-ext-blue: #0d5f8d;
        --geofs-ext-sky: #00bbff;
        --geofs-ext-radar-bg: #000000;
      }
      :root[data-geofs-ext-theme="light"] {
        --geofs-ext-bg: rgba(255, 255, 255, 0.92);
        --geofs-ext-surface: rgba(0, 0, 0, 0.05);
        --geofs-ext-fg: #000000;
        --geofs-ext-muted: rgba(0, 0, 0, 0.56);
        --geofs-ext-border: rgba(0, 0, 0, 0.22);
        --geofs-ext-divider: rgba(0, 0, 0, 0.12);
        --geofs-ext-accent: #0d5f8d;
        --geofs-ext-accent-fg: #ffffff;
        --geofs-ext-blue: #0d5f8d;
        --geofs-ext-sky: #0d5f8d;
        --geofs-ext-radar-bg: #ffffff;
      }
      html.geofs-ext-dragging,
      html.geofs-ext-dragging *,
      html.geofs-ext-dragging #flightDataDisplay.geofs-ext-hud,
      html.geofs-ext-dragging #flightDataDisplay.geofs-ext-hud * {
        cursor: grabbing !important;
        user-select: none !important;
      }
      .is-dragging {
        transition: none !important;
      }
      #flightDataDisplay.geofs-ext-hud, .geofs-ext-native-card {
        box-sizing: border-box;
        position: fixed;
        top: 70px;
        right: 20px;
        width: 250px;
        min-width: 250px;
        max-width: 250px;
        height: auto;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 8px;
        z-index: 2147483000;
        display: flex;
        flex-direction: column;
        gap: 0;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top right;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        user-select: none;
        touch-action: none;
      }
      html:not(.geofs-ext-dragging) #flightDataDisplay.geofs-ext-hud,
      html:not(.geofs-ext-dragging) #flightDataDisplay.geofs-ext-hud * {
        cursor: grab !important;
      }
      #flightDataDisplay.geofs-ext-hud * {
        box-sizing: border-box;
      }
      #flightDataDisplay.geofs-ext-hud {
        overflow: visible;
      }
      #flightDataDisplay.geofs-ext-hud .mdl-tooltip {
        display: none !important;
      }
      #flightDataDisplay.geofs-ext-hud > .geofs-ext-hud-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        width: 100%;
        height: auto;
        min-height: 22px;
        gap: 3px;
        margin-bottom: 6px;
        cursor: grab;
        user-select: none;
      }
      .geofs-ext-hud-grip {
        position: relative;
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
      #flightDataDisplay.geofs-ext-hud #hud-unified-tabs.unified-tabs {
        display: flex;
        align-items: stretch;
        gap: 2px;
        flex: 1;
        min-width: 0;
        margin: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      #flightDataDisplay.geofs-ext-hud #hud-unified-tabs.unified-tabs::-webkit-scrollbar {
        display: none;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
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
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer !important;
        text-align: center;
        line-height: 1.2;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab * {
        cursor: pointer !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-label {
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-close {
        display: none;
        flex-shrink: 0;
        font-size: 10px;
        line-height: 1;
        opacity: 0.75;
        padding: 0 1px;
        border-radius: 50%;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab:hover .geofs-ext-tab-close,
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-active .geofs-ext-tab-close {
        display: inline-flex;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-close:hover {
        opacity: 1;
        color: #ff6b6b;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-drag-over {
        border-color: var(--geofs-ext-sky);
        box-shadow: 0 0 6px rgba(0, 187, 255, 0.45);
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-tab-dragging {
        opacity: 0.5;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab:hover {
        border-color: var(--geofs-ext-fg);
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.active,
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-active {
        background: var(--geofs-ext-accent);
        border-color: var(--geofs-ext-accent);
        border-radius: 15px;
        color: var(--geofs-ext-accent-fg);
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 22px;
        padding: 0;
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add:hover,
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add.is-open {
        border-color: var(--geofs-ext-fg);
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-menu {
        display: none !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 6px;
        padding: 6px;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 8px;
        background: var(--geofs-ext-bg);
        cursor: default !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu * {
        cursor: default !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu button {
        cursor: pointer !important;
      }
      .geofs-ext-hud-menu-title {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: var(--geofs-ext-muted);
      }
      .geofs-ext-hud-menu-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
      }
      .geofs-ext-hud-menu-name {
        flex: 1;
        min-width: 0;
        text-align: left;
        background: transparent;
        border: none;
        padding: 2px 0;
        color: var(--geofs-ext-fg);
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .geofs-ext-hud-menu-name:hover {
        color: var(--geofs-ext-sky);
      }
      .geofs-ext-hud-menu-actions {
        display: inline-flex;
        gap: 3px;
        flex-shrink: 0;
      }
      .geofs-ext-hud-preset-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px;
      }
      .geofs-ext-hud-menu-chip {
        background: var(--geofs-ext-surface);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 9px;
        font-weight: 700;
      }
      .geofs-ext-hud-menu-chip.is-active {
        border-color: var(--geofs-ext-accent);
        color: var(--geofs-ext-accent);
      }
      .geofs-ext-hud-menu-reset {
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 4px;
        padding: 3px 6px;
        font-size: 9.5px;
        font-weight: 700;
      }
      .geofs-ext-hud-menu-reset:hover {
        color: var(--geofs-ext-fg);
        border-color: var(--geofs-ext-fg);
      }
      .geofs-ext-detached-panel {
        box-sizing: border-box;
        position: fixed;
        top: 110px;
        right: 280px;
        width: 250px;
        min-width: 240px;
        max-width: 260px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 8px;
        z-index: 2147483002;
        display: flex;
        flex-direction: column;
        gap: 6px;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top left;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      }
      .geofs-ext-detached-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        cursor: grab;
        user-select: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        padding-bottom: 4px;
      }
      .geofs-ext-detached-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.4px;
        text-transform: uppercase;
      }
      .geofs-ext-detached-actions {
        display: inline-flex;
        gap: 4px;
      }
      .geofs-ext-detached-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 4px;
        width: 18px;
        height: 18px;
        padding: 0;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
      }
      .geofs-ext-hud-min {
        position: relative;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
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
        line-height: 1;
        cursor: grab;
        text-align: center;
      }
      #flightDataDisplay.geofs-ext-hud > .geofs-ext-hud-body {
        flex: 0 0 auto;
        width: 100%;
        max-height: none;
        overflow: visible;
        cursor: grab;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized {
        width: 40px;
        min-width: 40px;
        max-width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized > .geofs-ext-hud-header {
        margin-bottom: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-grip {
        display: none;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-min {
        border: none;
        background: transparent;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 10px;
        line-height: 1;
      }
      [data-hud-tip]:hover::after,
      [data-hud-tip]:focus-visible::after {
        content: attr(data-hud-tip);
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        background: rgba(0, 0, 0, 0.92);
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 6px;
        padding: 3px 7px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10px;
        font-weight: 600;
        line-height: 1.2;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
        z-index: 2147483050;
      }
      [data-hud-tip][data-tip-v="above"]:hover::after,
      [data-hud-tip][data-tip-v="above"]:focus-visible::after {
        top: auto;
        bottom: calc(100% + 4px);
      }
      [data-hud-tip][data-tip-h="left"]:hover::after,
      [data-hud-tip][data-tip-h="left"]:focus-visible::after {
        left: 0;
        right: auto;
      }
      [data-hud-tip][data-tip-h="center"]:hover::after,
      [data-hud-tip][data-tip-h="center"]:focus-visible::after {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }
      html.geofs-ext-dragging [data-hud-tip]::after,
      .is-dragging [data-hud-tip]::after,
      .is-dragging[data-hud-tip]::after {
        display: none !important;
      }
      #hudMinimizeBtn.unified-hud-edge-tab {
        position: fixed;
        left: 0;
        top: calc(50% - 20px);
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
        cursor: grab;
        user-select: none;
        touch-action: none;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      #hudMinimizeBtn.unified-hud-edge-tab[data-hud-tip]:hover::after,
      #hudMinimizeBtn.unified-hud-edge-tab[data-hud-tip]:focus-visible::after {
        top: 50%;
        bottom: auto;
        left: calc(100% + 6px);
        right: auto;
        transform: translateY(-50%);
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
    this.syncedAutopilotPads.clear();
    this.trackedElements.clear();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
    for (const id of Array.from(this.detachedPanels.keys())) {
      this.unmountDetachedPanel(id);
    }
    this.hudMenuEl = null;
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
