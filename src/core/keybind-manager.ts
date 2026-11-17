export type OsPlatform = 'mac' | 'windows' | 'linux';

export function detectOsPlatform(): OsPlatform {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = (navigator.platform || navigator.userAgent || '').toLowerCase();
  if (ua.includes('mac')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'windows';
}

export function normalizeComboString(combo: string): string {
  if (!combo) return '';
  return combo
    .replace(/⌘/g, 'Cmd+')
    .replace(/⌃/g, 'Ctrl+')
    .replace(/⌥/g, 'Alt+')
    .replace(/⇧/g, 'Shift+')
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, idx, arr) => {
      if (idx < arr.length - 1) {
        const lower = p.toLowerCase();
        if (lower === 'shift') return 'Shift';
        if (lower === 'ctrl' || lower === 'control') return 'Ctrl';
        if (lower === 'alt' || lower === 'option') return 'Alt';
        if (lower === 'cmd' || lower === 'meta') return 'Cmd';
      }
      return p.length === 1 ? p.toUpperCase() : p;
    })
    .join('+');
}

export function formatComboForOs(combo: string, os: OsPlatform): string {
  const normalized = normalizeComboString(combo);
  if (os !== 'mac') return normalized;
  return normalized
    .replace(/Cmd\+/gi, '⌘')
    .replace(/Ctrl\+/gi, '⌃')
    .replace(/Alt\+/gi, '⌥')
    .replace(/Shift\+/gi, '⇧');
}

export function matchesKeyEvent(event: KeyboardEvent, combo: string): boolean {
  const normalized = normalizeComboString(combo);
  if (!normalized) return false;
  const parts = normalized.split('+').map((p) => p.trim().toLowerCase());
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

const GEOFS_DEFAULT_KEYS: Record<string, string> = {
  a: 'Autopilot',
  b: 'Airbrakes / Spoilers',
  c: 'Cycle Camera',
  e: 'Engine Start/Stop',
  f: 'Flaps',
  g: 'Landing Gear',
  m: 'Map',
  p: 'Pause Simulator',
  s: 'Toggle Sound',
  v: 'Cockpit View',
  space: 'Wheel Brakes'
};

export function detectGeoFSKeyCollision(combo: string): string | null {
  const normalized = normalizeComboString(combo);
  if (!normalized) return null;
  const parts = normalized.split('+').map((p) => p.trim().toLowerCase()).filter(Boolean);
  if (parts.length === 0) return null;
  const hasModifier = parts.some((p) => p === 'shift' || p === 'ctrl' || p === 'alt' || p === 'cmd' || p === 'meta');
  const key = parts[parts.length - 1];
  if (!hasModifier) {
    if (GEOFS_DEFAULT_KEYS[key]) return `Conflicts with GeoFS "${GEOFS_DEFAULT_KEYS[key]}" (${key.toUpperCase()})`;
    if (/^[0-9]$/.test(key)) return `Conflicts with GeoFS Throttle / Preset (${key})`;
  }
  return null;
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
