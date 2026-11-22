import type { FlightTelemetry } from '../../types/module';

import { ensureModeBanner, removeModeBanner } from '../../core/mode-banner';

export class WalkaroundController {
  private active = false;
  private offsetX = 12; // meters right of aircraft
  private offsetY = 0; // meters forward of aircraft
  private offsetZ = 1.7; // eye height meters
  private savedMode = 0;
  private savedPosition: [number, number, number] | null = null;
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
    const pos = cam.currentDefinition?.position;
    this.savedPosition =
      Array.isArray(pos) && pos.length >= 3
        ? [Number(pos[0]) || 0, Number(pos[1]) || 0, Number(pos[2]) || 0]
        : null;
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
      const cam = window.geofs?.camera as
        | {
            set?: (mode: number) => void;
            reset?: () => void;
            currentDefinition?: { position?: [number, number, number] };
          }
        | undefined;
      if (this.savedPosition && cam?.currentDefinition) {
        cam.currentDefinition.position = [...this.savedPosition] as [number, number, number];
      }
      cam?.set?.(this.savedMode);
      cam?.reset?.();
    } catch {
      // ignore camera restore errors
    } finally {
      this.savedPosition = null;
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
      this.bannerEl.textContent = `WALKAROUND · DIST ${dist}m · EYE ${this.offsetZ.toFixed(1)}m · [WASD Move · Q/E Height · Alt+W Exit]`;
    }
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.active) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
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
    this.bannerEl = ensureModeBanner('accent');
  }

  private removeBanner(): void {
    removeModeBanner(this.bannerEl);
    this.bannerEl = null;
  }

  public dispose(): void {
    this.deactivate();
  }
}
