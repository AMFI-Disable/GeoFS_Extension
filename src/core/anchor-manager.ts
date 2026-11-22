import { HUD_STYLES } from './hud-styles';
import {
  TAB_ORDER,
  applyDockPresetStyles as applyDockPreset,
  createDefaultHudTabsState,
  loadHudTabsState,
  saveHudTabsState,
  type HudDockPreset,
  type HudTabsState
} from './hud-state';
import { attachDraggable, attachEdgeTabInteraction, type DragHost } from './drag-controller';
import type { CalibratorPreset } from '../types/settings';
import { resolveCalibratorScale } from '../shared/display-calibrator';

export type AnchorZone = 'top' | 'bottom' | 'right' | 'corner' | 'autopilot';
export type { HudDockPreset, HudTabsState };

export interface PromptAction {
  id: string;
  label: string;
  variant?: 'primary' | 'danger' | 'neutral';
  onClick: () => void;
}

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
  private hudState: HudTabsState = createDefaultHudTabsState();
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

  private createDragHost(): DragHost {
    return {
      trackElement: (el) => {
        this.trackedElements.add(el);
        this.resizeObserver?.observe(el);
      },
      untrackElement: (el) => {
        this.resizeObserver?.unobserve(el);
        this.trackedElements.delete(el);
      },
      clampElementToViewport: (el) => this.clampElementToViewport(el),
      bringToFront: (el) => this.bringToFront(el),
      registerCleanup: (cleanup) => this.dragCleanups.add(cleanup),
      unregisterCleanup: (cleanup) => this.dragCleanups.delete(cleanup),
      onDragEnd: (el) => {
        if (el === this.hudRoot) {
          this.syncEdgeHandle();
        }
      }
    };
  }

  public makeDraggable(
    card: HTMLElement,
    storageKey: string,
    dragHandle?: HTMLElement,
    options?: { axis?: 'both' | 'vertical' }
  ): () => void {
    return attachDraggable(card, storageKey, this.createDragHost(), dragHandle, options);
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
    return attachEdgeTabInteraction(edgeTab, {
      ...this.createDragHost(),
      getHudRoot: () => this.hudRoot,
      onDockOut: () => {
        this.hudHidden = false;
        this.applyHudMinimizedState(true);
      }
    });
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
    const loaded = loadHudTabsState();
    if (!loaded) return;
    this.hudState = loaded.hudState;
    this.savedActiveTabId = loaded.savedActiveTabId;
    this.hudMinimized = loaded.hudMinimized;
    this.hudHidden = loaded.hudHidden;
  }

  private saveHudState(): void {
    saveHudTabsState(this.hudState, this.activeTabId, this.hudMinimized, this.hudHidden);
  }

  private applyDockPresetStyles(root: HTMLElement, preset: HudDockPreset): void {
    applyDockPreset(root, preset);
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
    style.textContent = HUD_STYLES;
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
