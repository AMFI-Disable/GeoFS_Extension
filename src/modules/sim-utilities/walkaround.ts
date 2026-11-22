import type { FlightTelemetry } from '../../types/module';

export class WalkaroundController {
  private active = false;
  private offsetX = 12; // meters right of aircraft
  private offsetY = 0; // meters forward of aircraft
  private offsetZ = 1.7; // eye height meters
  private savedMode = 0;
  private heldKeys = new Set<string>();
  private bannerEl: HTMLDivElement | null = null;
  private listenersAttached = false;

  public isActive(): boolean {
    return this.active;
  }

  public toggle(onStatus?: (active: boolean) => void): boolean {
    if (this.active) {
      this.deactivate();
    } else {
      this.activate();
    }
    onStatus?.(this.active);
    return this.active;
  }

  public activate(): boolean {
    const cam = window.geofs?.camera as
      | { currentMode?: number; set?: (mode: number) => void; currentDefinition?: { position?: number[] } }
      | undefined;
    if (!cam) return false;
    this.savedMode = typeof cam.currentMode === 'number' ? cam.currentMode : 0;
    this.offsetX = 14;
    this.offsetY = 4;
    this.offsetZ = 1.8;
    this.active = true;
    this.attachListeners();
    this.showBanner();
    return true;
  }

  public deactivate(): void {
    if (!this.active) return;
    this.active = false;
    this.heldKeys.clear();
    this.detachListeners();
    this.removeBanner();
    try {
      const cam = window.geofs?.camera as { set?: (mode: number) => void; reset?: () => void } | undefined;
      cam?.set?.(this.savedMode);
      cam?.reset?.();
    } catch {
      // ignore camera restore errors
    }
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.active) return;
    if (telemetry.kias > 25 && !telemetry.groundContact) {
      this.deactivate();
      return;
    }

    const dt = Number.isFinite(telemetry.dt) && telemetry.dt > 0 ? Math.min(telemetry.dt, 0.2) : 0.03;
    const speedMps = this.heldKeys.has('ShiftLeft') || this.heldKeys.has('ShiftRight') ? 9.0 : 4.2;

    if (this.heldKeys.has('KeyW')) this.offsetY += speedMps * dt;
    if (this.heldKeys.has('KeyS')) this.offsetY -= speedMps * dt;
    if (this.heldKeys.has('KeyD')) this.offsetX += speedMps * dt;
    if (this.heldKeys.has('KeyA')) this.offsetX -= speedMps * dt;
    if (this.heldKeys.has('KeyE')) this.offsetZ = Math.min(18, this.offsetZ + 2.5 * dt);
    if (this.heldKeys.has('KeyQ')) this.offsetZ = Math.max(0.8, this.offsetZ - 2.5 * dt);

    // Clamp walkaround radius to 120m from aircraft
    this.offsetX = Math.max(-120, Math.min(120, this.offsetX));
    this.offsetY = Math.max(-120, Math.min(120, this.offsetY));

    const cam = window.geofs?.camera as
      | {
          currentDefinition?: { position?: [number, number, number] };
          setPosition?: (pos: [number, number, number]) => void;
        }
      | undefined;
    if (cam?.currentDefinition) {
      cam.currentDefinition.position = [this.offsetX, this.offsetY, this.offsetZ];
    }
    if (this.bannerEl) {
      const dist = Math.hypot(this.offsetX, this.offsetY).toFixed(0);
      this.bannerEl.textContent = `WALKAROUND · DIST ${dist}m · EYE ${this.offsetZ.toFixed(1)}m · [WASD Move · Q/E Height · Shift+W Exit]`;
    }
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.active) return;
    const target = e.target as HTMLElement | null;
    if (target && typeof target.matches === 'function' && target.matches('input, textarea, select, [contenteditable]')) {
      return;
    }
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
      this.heldKeys.add(e.code);
      if (e.code !== 'ShiftLeft' && e.code !== 'ShiftRight') e.preventDefault();
    } else if (e.code === 'Escape') {
      this.deactivate();
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.heldKeys.delete(e.code);
  };

  private attachListeners(): void {
    if (this.listenersAttached || typeof document === 'undefined') return;
    document.addEventListener('keydown', this.onKeyDown, { capture: true });
    document.addEventListener('keyup', this.onKeyUp, { capture: true });
    this.listenersAttached = true;
  }

  private detachListeners(): void {
    if (!this.listenersAttached || typeof document === 'undefined') return;
    document.removeEventListener('keydown', this.onKeyDown, { capture: true });
    document.removeEventListener('keyup', this.onKeyUp, { capture: true });
    this.listenersAttached = false;
  }

  private showBanner(): void {
    if (this.bannerEl || typeof document === 'undefined' || !document.body) return;
    const el = document.createElement('div');
    el.id = 'geofs-ext-walkaround-banner';
    el.style.cssText =
      'position:fixed;top:38px;left:10px;z-index:2147483640;padding:4px 8px;border-radius:4px;background:rgba(15,23,42,0.88);border:1px solid rgba(56,189,248,0.6);color:#38bdf8;font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace;pointer-events:none;';
    document.body.appendChild(el);
    this.bannerEl = el;
  }

  private removeBanner(): void {
    this.bannerEl?.remove();
    this.bannerEl = null;
  }

  public dispose(): void {
    this.deactivate();
  }
}
