import type { KeyboardOsProfile, MacKeyboardType } from '../types/settings';
import { detectOsPlatform, eventToComboString, normalizeComboString, type OsPlatform } from './keybind-manager';

export interface TargetKeySpec {
  key: string;
  code: string;
  keyCode: number;
  location?: number;
}

export const SIM_TARGET_KEYS: Record<string, TargetKeySpec> = {
  PageUp: { key: 'PageUp', code: 'PageUp', keyCode: 33 },
  PageDown: { key: 'PageDown', code: 'PageDown', keyCode: 34 },
  End: { key: 'End', code: 'End', keyCode: 35 },
  Home: { key: 'Home', code: 'Home', keyCode: 36 },
  Insert: { key: 'Insert', code: 'Insert', keyCode: 45 },
  Delete: { key: 'Delete', code: 'Delete', keyCode: 46 },
  Numpad0: { key: '0', code: 'Numpad0', keyCode: 96, location: 3 },
  Numpad1: { key: '1', code: 'Numpad1', keyCode: 97, location: 3 },
  Numpad2: { key: '2', code: 'Numpad2', keyCode: 98, location: 3 },
  Numpad3: { key: '3', code: 'Numpad3', keyCode: 99, location: 3 },
  Numpad4: { key: '4', code: 'Numpad4', keyCode: 100, location: 3 },
  Numpad5: { key: '5', code: 'Numpad5', keyCode: 101, location: 3 },
  Numpad6: { key: '6', code: 'Numpad6', keyCode: 102, location: 3 },
  Numpad7: { key: '7', code: 'Numpad7', keyCode: 103, location: 3 },
  Numpad8: { key: '8', code: 'Numpad8', keyCode: 104, location: 3 },
  Numpad9: { key: '9', code: 'Numpad9', keyCode: 105, location: 3 }
};

export const MACBOOK_DEFAULT_REMAPS: Readonly<Record<string, string>> = {
  'Alt+ArrowUp': 'PageUp',
  'Alt+ArrowDown': 'PageDown',
  'Alt+Backspace': 'Delete',
  'Alt+ArrowLeft': 'Home',
  'Alt+ArrowRight': 'End',
  'Alt+1': 'Numpad1',
  'Alt+2': 'Numpad2',
  'Alt+3': 'Numpad3',
  'Alt+4': 'Numpad4',
  'Alt+5': 'Numpad5',
  'Alt+6': 'Numpad6',
  'Alt+7': 'Numpad7',
  'Alt+8': 'Numpad8',
  'Alt+9': 'Numpad9',
  'Alt+0': 'Numpad0'
};

export const MAGIC_DEFAULT_REMAPS: Readonly<Record<string, string>> = {};

export function resolveEffectiveOs(profile: KeyboardOsProfile): OsPlatform {
  return profile === 'auto' ? detectOsPlatform() : profile;
}

export function resolveEffectiveSimRemaps(
  osProfile: KeyboardOsProfile,
  macKeyboardType: MacKeyboardType | null,
  customRemaps: Record<string, string> = {}
): Record<string, string> {
  const effectiveOs = resolveEffectiveOs(osProfile);
  const base: Record<string, string> =
    effectiveOs === 'mac'
      ? macKeyboardType === 'magic'
        ? { ...MAGIC_DEFAULT_REMAPS }
        : { ...MACBOOK_DEFAULT_REMAPS }
      : {};

  for (const [source, target] of Object.entries(customRemaps)) {
    const normSource = normalizeComboString(source);
    if (normSource && target) {
      base[normSource] = target;
    } else if (normSource && target === '') {
      delete base[normSource];
    }
  }
  return base;
}

export interface KeyboardTranslatorConfig {
  enabled: boolean;
  osProfile: KeyboardOsProfile;
  macKeyboardType: MacKeyboardType | null;
  customRemaps: Record<string, string>;
}

export class KeyboardTranslator {
  private enabled = true;
  private remaps: Record<string, string> = {};
  private listening = false;
  private activeTranslations = new Map<string, TargetKeySpec>();

  private dispatchSynthetic(type: 'keydown' | 'keyup', spec: TargetKeySpec, repeat = false): void {
    if (typeof document === 'undefined') return;
    const init: KeyboardEventInit & { keyCode?: number; which?: number } = {
      key: spec.key,
      code: spec.code,
      location: spec.location ?? 0,
      repeat,
      bubbles: true,
      cancelable: true,
      keyCode: spec.keyCode,
      which: spec.keyCode
    };
    const synthetic = new KeyboardEvent(type, init);
    document.dispatchEvent(synthetic);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled || !e.isTrusted) return;
    const targetEl = e.target as HTMLElement | null;
    if (
      targetEl &&
      (targetEl.tagName === 'INPUT' ||
        targetEl.tagName === 'TEXTAREA' ||
        targetEl.tagName === 'SELECT' ||
        targetEl.isContentEditable)
    ) {
      return;
    }

    const combo = eventToComboString(e);
    if (!combo) return;
    const targetName = this.remaps[combo];
    if (!targetName) return;

    const spec = SIM_TARGET_KEYS[targetName] ?? { key: targetName, code: targetName, keyCode: 0 };
    e.preventDefault();
    e.stopImmediatePropagation();
    const sourceCode = e.code || combo;
    this.activeTranslations.set(sourceCode, spec);
    this.dispatchSynthetic('keydown', spec, e.repeat);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (!e.isTrusted) return;
    const sourceCode = e.code || eventToComboString(e) || '';
    const active = this.activeTranslations.get(sourceCode);
    if (!active) return;

    this.activeTranslations.delete(sourceCode);
    e.preventDefault();
    e.stopImmediatePropagation();
    this.dispatchSynthetic('keyup', active, false);
  };

  public updateConfig(cfg: KeyboardTranslatorConfig): void {
    this.enabled = cfg.enabled;
    this.remaps = resolveEffectiveSimRemaps(cfg.osProfile, cfg.macKeyboardType, cfg.customRemaps);
    if (!this.enabled) {
      this.releaseAllActive();
    }
  }

  public releaseAllActive(): void {
    for (const spec of this.activeTranslations.values()) {
      this.dispatchSynthetic('keyup', spec, false);
    }
    this.activeTranslations.clear();
  }

  public start(): void {
    if (this.listening || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.onKeyDown, { capture: true });
    window.addEventListener('keyup', this.onKeyUp, { capture: true });
    this.listening = true;
  }

  public destroy(): void {
    this.releaseAllActive();
    if (this.listening && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown, { capture: true });
      window.removeEventListener('keyup', this.onKeyUp, { capture: true });
      this.listening = false;
    }
  }
}
