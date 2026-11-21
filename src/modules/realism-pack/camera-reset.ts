// Clean-room middle-mouse double-click camera reset QoL controller.
// Behavior inspired by krunchiekrunch/GeoFS-Camera-Reset.

export class CameraResetController {
  private lastMiddleClickAt = 0;
  private attached = false;
  private enabled = true;
  private onReset?: () => void;

  public constructor(onReset?: () => void) {
    this.onReset = onReset;
  }

  private handleMouseDown = (event: MouseEvent): void => {
    if (!this.enabled || event.button !== 1) return;
    const target = event.target as HTMLElement | null;
    if (target && typeof target.matches === 'function' && target.matches('input, textarea, select, [contenteditable]')) {
      return;
    }
    const now = Date.now();
    if (now - this.lastMiddleClickAt <= 320) {
      this.lastMiddleClickAt = 0;
      const resetFn = window.geofs?.camera?.reset;
      if (typeof resetFn === 'function') {
        resetFn.call(window.geofs?.camera);
        this.onReset?.();
      }
    } else {
      this.lastMiddleClickAt = now;
    }
  };

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.lastMiddleClickAt = 0;
    }
  }

  public attach(): void {
    if (this.attached || typeof document === 'undefined') return;
    document.addEventListener('mousedown', this.handleMouseDown, false);
    this.attached = true;
  }

  public dispose(): void {
    if (this.attached && typeof document !== 'undefined') {
      document.removeEventListener('mousedown', this.handleMouseDown, false);
    }
    this.attached = false;
    this.lastMiddleClickAt = 0;
  }
}
