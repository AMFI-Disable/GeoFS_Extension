export type OsPlatform = 'mac' | 'windows' | 'linux';

export function detectOsPlatform(): OsPlatform {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = (navigator.platform || navigator.userAgent || '').toLowerCase();
  if (ua.includes('mac')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

export function formatComboForOs(combo: string, os: OsPlatform): string {
  if (os !== 'mac') return combo;
  return combo
    .replace(/Cmd\+/gi, '⌘')
    .replace(/Ctrl\+/gi, '⌃')
    .replace(/Alt\+/gi, '⌥')
    .replace(/Shift\+/gi, '⇧');
}

export function matchesKeyEvent(event: KeyboardEvent, combo: string): boolean {
  if (!combo) return false;
  const parts = combo.split('+').map((p) => p.trim().toLowerCase());
  const key = parts[parts.length - 1];
  const needShift = parts.includes('shift');
  const needCtrl = parts.includes('ctrl');
  const needAlt = parts.includes('alt');
  const needMeta = parts.includes('cmd') || parts.includes('meta');

  return (
    event.key.toLowerCase() === key &&
    event.shiftKey === needShift &&
    event.ctrlKey === needCtrl &&
    event.altKey === needAlt &&
    event.metaKey === needMeta
  );
}

export class KeybindManager {
  public readonly os: OsPlatform = detectOsPlatform();
  private bindings = new Map<string, { combo: string; handler: () => void }>();
  private listening = false;

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat || e.defaultPrevented) return;
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
      return;
    }
    for (const entry of this.bindings.values()) {
      if (matchesKeyEvent(e, entry.combo)) {
        e.preventDefault();
        entry.handler();
        return;
      }
    }
  };

  public start(): void {
    if (this.listening || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.onKeyDown);
    this.listening = true;
  }

  public register(id: string, combo: string, handler: () => void): () => void {
    this.bindings.set(id, { combo, handler });
    return () => this.bindings.delete(id);
  }

  public updateCombo(id: string, combo: string): void {
    const existing = this.bindings.get(id);
    if (existing) existing.combo = combo;
  }

  public destroy(): void {
    if (this.listening && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
      this.listening = false;
    }
    this.bindings.clear();
  }
}
