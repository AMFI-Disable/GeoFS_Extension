export interface DragHost {
  trackElement: (el: HTMLElement) => void;
  untrackElement: (el: HTMLElement) => void;
  clampElementToViewport: (el: HTMLElement) => void;
  bringToFront: (el: HTMLElement | null | undefined) => void;
  registerCleanup: (cleanup: () => void) => void;
  unregisterCleanup: (cleanup: () => void) => void;
  onDragEnd?: (el: HTMLElement) => void;
}

export interface EdgeTabHost extends DragHost {
  getHudRoot: () => HTMLDivElement | null;
  onDockOut: () => void;
}

export function attachDraggable(
  card: HTMLElement,
  storageKey: string,
  host: DragHost,
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

  host.trackElement(card);

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
          host.clampElementToViewport(card);
        }
      } else if (Number.isFinite(parsedLeft) && Number.isFinite(parsedTop)) {
        card.style.left = `${Math.max(0, parsedLeft)}px`;
        card.style.top = `${Math.max(0, parsedTop)}px`;
        card.style.bottom = 'auto';
        card.style.right = 'auto';
        card.style.transformOrigin = 'top left';
        host.clampElementToViewport(card);
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
      host.onDragEnd?.(card);
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
    host.bringToFront(card);
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
    host.untrackElement(card);
    host.unregisterCleanup(cleanup);
  };
  host.registerCleanup(cleanup);
  return cleanup;
}

export function attachEdgeTabInteraction(edgeTab: HTMLButtonElement, host: EdgeTabHost): () => void {
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

  host.trackElement(edgeTab);

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
        host.clampElementToViewport(edgeTab);
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
    const hudRoot = host.getHudRoot();

    if (rawLeft > BORDER_DOCK_PX && hudRoot) {
      if (!dockedOut) {
        dockedOut = true;
        host.onDockOut();
        edgeTab.style.display = 'none';
        hudRoot.style.display = 'flex';
        hudRoot.style.right = 'auto';
        hudRoot.style.bottom = 'auto';
        hudRoot.style.transformOrigin = 'top left';
        hudRoot.classList.add('is-dragging');
        host.bringToFront(hudRoot);
      }
      const circleRect = hudRoot.getBoundingClientRect();
      const circleW = circleRect.width || 40;
      const circleH = circleRect.height || 40;
      const maxX = Math.max(0, window.innerWidth - circleW);
      const maxY = Math.max(0, window.innerHeight - circleH);
      const clampedLeft = Math.max(0, Math.min(rawLeft, maxX));
      const clampedTop = Math.max(0, Math.min(rawTop, maxY));
      hudRoot.style.left = `${Math.round(clampedLeft)}px`;
      hudRoot.style.top = `${Math.round(clampedTop)}px`;
    } else {
      if (dockedOut && hudRoot) {
        dockedOut = false;
        hudRoot.classList.remove('is-dragging');
        hudRoot.style.display = 'none';
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
    const hudRoot = host.getHudRoot();
    edgeTab.classList.remove('is-dragging');
    hudRoot?.classList.remove('is-dragging');
    document.documentElement.classList.remove('geofs-ext-dragging');
    if (dragMoved) {
      dragMoved = false;
      edgeTab.dataset.justDragged = '1';
      setTimeout(() => {
        delete edgeTab.dataset.justDragged;
      }, 0);
      if (dockedOut && hudRoot) {
        hudRoot.dataset.justDragged = '1';
        setTimeout(() => {
          const currentHud = host.getHudRoot();
          if (currentHud) delete currentHud.dataset.justDragged;
        }, 0);
        try {
          localStorage.setItem(
            'geofs_ext_hud_pos',
            JSON.stringify({ left: hudRoot.style.left, top: hudRoot.style.top })
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
        if (hudRoot) {
          hudRoot.style.top = edgeTab.style.top;
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
      host.getHudRoot()?.classList.remove('is-dragging');
      document.documentElement.classList.remove('geofs-ext-dragging');
    }
    edgeTab.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', endDrag);
    window.removeEventListener('blur', endDrag);
    edgeTab.removeEventListener('click', onClickCapture, true);
    host.untrackElement(edgeTab);
    host.unregisterCleanup(cleanup);
  };
  host.registerCleanup(cleanup);
  return cleanup;
}
