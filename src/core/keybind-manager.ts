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

function normalizeCodeToken(code: string | undefined): string {
  if (!code) return '';
  if (code.startsWith('Key') && code.length === 4) return code.slice(3).toLowerCase();
  if (code.startsWith('Digit') && code.length === 6) return code.slice(5);
  return code.toLowerCase();
}

export function eventToComboString(event: KeyboardEvent): string | null {
  const rawCode = event.code || '';
  if (
    rawCode === 'ShiftLeft' ||
    rawCode === 'ShiftRight' ||
    rawCode === 'ControlLeft' ||
    rawCode === 'ControlRight' ||
    rawCode === 'AltLeft' ||
    rawCode === 'AltRight' ||
    rawCode === 'MetaLeft' ||
    rawCode === 'MetaRight'
  ) {
    return null;
  }

  let keyPart = '';
  if (rawCode.startsWith('Key') && rawCode.length === 4) {
    keyPart = rawCode.slice(3).toUpperCase();
  } else if (rawCode.startsWith('Digit') && rawCode.length === 6) {
    keyPart = rawCode.slice(5);
  } else if (rawCode) {
    keyPart = rawCode;
  } else if (event.key) {
    keyPart = event.key.length === 1 ? event.key.toUpperCase() : event.key;
  }
  if (!keyPart) return null;

  const mods: string[] = [];
  if (event.metaKey) mods.push('Cmd');
  if (event.ctrlKey) mods.push('Ctrl');
  if (event.altKey) mods.push('Alt');
  if (event.shiftKey) mods.push('Shift');
  return [...mods, keyPart].join('+');
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

  const keyMatch =
    (event.code && normalizeCodeToken(event.code) === key) ||
    (typeof event.key === 'string' && event.key.toLowerCase() === key);

  return (
    keyMatch &&
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
  o: 'Options / Settings',
  p: 'Pause Simulator',
  s: 'Toggle Sound',
  v: 'Cockpit View',
  space: 'Wheel Brakes'
};

const BROWSER_RESERVED_COMBOS: Record<string, string> = {
  'cmd+w': 'Reserved by macOS/Chrome (Close Tab)',
  'cmd+q': 'Reserved by macOS (Quit Browser)',
  'cmd+r': 'Reserved by macOS/Chrome (Reload Page)',
  'ctrl+w': 'Reserved by Browser (Close Tab)',
  'ctrl+r': 'Reserved by Browser (Reload Page)',
  'alt+f4': 'Reserved by Windows/Linux (Close Window)'
};

export function detectGeoFSKeyCollision(combo: string): string | null {
  const normalized = normalizeComboString(combo);
  if (!normalized) return null;
  const lowerCombo = normalized.toLowerCase();
  if (BROWSER_RESERVED_COMBOS[lowerCombo]) {
    return BROWSER_RESERVED_COMBOS[lowerCombo];
  }
  const parts = lowerCombo.split('+').map((p) => p.trim()).filter(Boolean);
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
  private consumedCodes = new Set<string>();
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
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.code) this.consumedCodes.add(e.code);
        entry.handler();
        return;
      }
    }
  };

  private onKeyPressOrUp = (e: KeyboardEvent) => {
    if (!e.code || !this.consumedCodes.has(e.code)) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.type === 'keyup') {
      this.consumedCodes.delete(e.code);
    }
  };

  public start(): void {
    if (this.listening || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.onKeyDown, { capture: true });
    window.addEventListener('keypress', this.onKeyPressOrUp, { capture: true });
    window.addEventListener('keyup', this.onKeyPressOrUp, { capture: true });
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
      window.removeEventListener('keydown', this.onKeyDown, { capture: true });
      window.removeEventListener('keypress', this.onKeyPressOrUp, { capture: true });
      window.removeEventListener('keyup', this.onKeyPressOrUp, { capture: true });
      this.listening = false;
    }
    this.consumedCodes.clear();
    this.bindings.clear();
  }
}
