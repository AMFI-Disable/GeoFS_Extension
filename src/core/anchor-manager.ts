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

    root.append(header, body);
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
    this.minBtnEl = minBtn;
    this.edgeHandleEl = edgeTab;

    this.makeDraggable(root, 'geofs_ext_hud_pos');
    this.setupEdgeTabInteraction(edgeTab);
    this.dragCleanups.add(this.bindHudTip(grip));
    this.dragCleanups.add(this.bindHudTip(minBtn));
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
      btn.setAttribute('aria-label', label);
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
        gap: 3px;
        flex: 1;
        min-width: 0;
        margin: 0;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab {
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
        cursor: grab;
        text-align: center;
        line-height: 1.2;
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
        color: #ffffff;
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
