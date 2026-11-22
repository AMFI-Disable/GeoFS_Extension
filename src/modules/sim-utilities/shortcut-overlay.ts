import type { KeybindConfig } from '../../types/settings';

const OVERLAY_ID = 'geofs-ext-shortcut-overlay';

export class ShortcutOverlay {
  private el: HTMLDivElement | null = null;
  private keyListener: ((e: KeyboardEvent) => void) | null = null;
  private getKeybinds: () => Partial<KeybindConfig> | undefined;

  constructor(getKeybinds: () => Partial<KeybindConfig> | undefined) {
    this.getKeybinds = getKeybinds;
  }

  public attach(): void {
    if (this.keyListener) return;
    this.keyListener = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.el && !this.el.hidden) {
        this.hide();
      }
    };
    window.addEventListener('keydown', this.keyListener);
  }

  public toggle(): void {
    if (this.el && !this.el.hidden) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show(): void {
    const kb = this.getKeybinds() ?? {};
    const rows: Array<[string, string]> = [
      ['Toggle Autothrottle', kb.toggleAutothrottle || 'Alt+A'],
      ['Toggle OP Engines', kb.toggleOpEngines || 'Alt+O'],
      ['Toggle Shared HUD', kb.toggleHud || 'Alt+H'],
      ['Toggle Flight Path Vector', kb.toggleFpv || 'Alt+F'],
      ['Open / Advance Checklists', kb.toggleChecklist || 'Alt+C'],
      ['Toggle Landing Lights', kb.toggleLandingLights || 'Alt+L'],
      ['Toggle FSX Slew Mode', kb.toggleSlewMode || 'Alt+Y'],
      ['Pre-Flight Walkaround', 'Alt+W'],
      ['Camera Reset', 'Double Middle-Click'],
      ['Shortcut Cheatsheet', '? (Shift+/)']
    ];

    if (!this.el) {
      const div = document.createElement('div');
      div.id = OVERLAY_ID;
      div.style.cssText = [
        'position:fixed',
        'top:50%',
        'left:50%',
        'transform:translate(-50%,-50%)',
        'z-index:2147483640',
        'width:320px',
        'max-width:92vw',
        'background:rgba(15,23,42,0.94)',
        'color:#f8fafc',
        'border:1px solid rgba(148,163,184,0.35)',
        'border-radius:12px',
        'padding:14px 16px',
        'font-family:system-ui,-apple-system,sans-serif',
        'box-shadow:0 20px 50px rgba(0,0,0,0.65)',
        'backdrop-filter:blur(10px)'
      ].join(';');
      document.body.appendChild(div);
      this.el = div;
    }

    this.el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid var(--geofs-ext-divider,rgba(255,255,255,0.14));padding-bottom:6px;">
        <span style="font-size:12px;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;">Keyboard Shortcuts</span>
        <button type="button" data-close-shortcuts style="background:none;border:none;color:var(--geofs-ext-muted,#9e9e9e);font-size:14px;cursor:pointer;line-height:1;">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:11px;">
        ${rows
          .map(
            ([label, key]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <span style="color:var(--geofs-ext-fg,#ffffff);">${label}</span>
              <kbd style="background:var(--geofs-ext-surface,rgba(255,255,255,0.08));border:1px solid var(--geofs-ext-border,#888888);border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;color:var(--geofs-ext-accent,#ffc107);white-space:nowrap;">${key}</kbd>
            </div>
          `
          )
          .join('')}
      </div>
    `;
    this.el.querySelector('[data-close-shortcuts]')?.addEventListener('click', () => this.hide());
    this.el.hidden = false;
  }

  public hide(): void {
    if (this.el) this.el.hidden = true;
  }

  public dispose(): void {
    if (this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
    this.el?.remove();
    this.el = null;
  }
}
