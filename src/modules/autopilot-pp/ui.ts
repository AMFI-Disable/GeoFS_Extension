import { buildTopbarPadStyles } from '../../shared/topbar-styles';
import type { ModuleContext } from '../../types/module';
import type { ApPpCommand, ApPpFmaState, ApPpLateralMode } from './types';

export const AP_PP_PAD_STYLES = `
  .ext-ap-pp-bar,
  .ext-ap-pp-bar * {
    box-sizing: border-box;
  }
  .ext-ap-pp-bar {
    display: inline-flex;
    align-items: center;
    vertical-align: var(--geofs-ext-ap-valign, middle);
    pointer-events: all;
  }
  ${buildTopbarPadStyles('#ap-pp-button.ext-ap-pp-pad')}
  #ap-pp-button.ext-ap-pp-pad {
    position: relative;
  }
  #ap-pp-button .ext-ap-pp-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.05;
    gap: 1px;
  }
  #ap-pp-button .ext-ap-pp-title-row {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }
  #ap-pp-button .ext-ap-pp-beta {
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.4px;
    padding: 0 3px;
    border-radius: 3px;
    background: rgba(245, 158, 11, 0.25);
    border: 1px solid rgba(245, 158, 11, 0.7);
    color: #fbbf24;
  }
  #ap-pp-button .ext-ap-pp-fma {
    font-size: 8px;
    letter-spacing: 0.3px;
    opacity: 0.85;
    font-family: monospace;
  }
`;

export interface ApPpUiState {
  engaged: boolean;
  lateralMode: ApPpLateralMode;
  landingArmed: boolean;
  hoverMode: boolean;
  envelopeProtection: boolean;
  fma: ApPpFmaState;
}

export interface MountedApPpUi {
  barEl: HTMLElement;
  padEl: HTMLElement;
  fmaLineEl: HTMLElement | null;
  hudFmaEl: HTMLElement | null;
  syncHudTab: (() => void) | null;
  unmounts: Array<() => void>;
}

export function mountApPpUi(
  context: ModuleContext,
  handlers: {
    onToggleMaster: () => void;
    onCommand: (cmd: ApPpCommand) => void;
    getState: () => ApPpUiState;
  }
): MountedApPpUi | null {
  if (typeof document === 'undefined') return null;

  const unmounts: Array<() => void> = [];
  const style = document.createElement('style');
  style.id = 'geofs-ext-ap-pp-styles';
  style.textContent = AP_PP_PAD_STYLES;
  document.head?.append(style);
  unmounts.push(() => style.remove());

  const bar = document.createElement('div');
  bar.className = 'ext-ap-pp-bar';
  bar.innerHTML = `
    <div class="control-pad ext-ap-pp-pad" id="ap-pp-button"
         role="button" tabindex="0" aria-pressed="false"
         title="AP++ (Beta): Toggle master autopilot & open Side Panel">
      <div class="control-pad-label transp-pad ext-ap-pp-label">
        <span class="ext-ap-pp-title-row">AP++ <span class="ext-ap-pp-beta">BETA</span></span>
        <span class="ext-ap-pp-fma">STBY</span>
      </div>
    </div>
  `;

  const pad = bar.querySelector<HTMLElement>('#ap-pp-button')!;
  const fmaLineEl = bar.querySelector<HTMLElement>('.ext-ap-pp-fma');
  pad.addEventListener('click', (event) => {
    event.stopPropagation();
    handlers.onToggleMaster();
    window.postMessage({ type: 'GEOFS_EXT_OPEN_SIDEPANEL' }, '*');
  });
  pad.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (!event.repeat) pad.click();
  });

  unmounts.push(context.anchors.mountControl('autopilot-pp-pad', 'autopilot', bar));
  context.anchors.syncAutopilotPad(pad, bar, true);

  let hudFmaEl: HTMLElement | null = null;
  let syncHudTab: (() => void) | null = null;

  if (typeof context.anchors?.registerHudTab === 'function') {
    const hudTab = document.createElement('div');
    hudTab.style.cssText = 'display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;';
    const fmaRow = document.createElement('div');
    fmaRow.style.cssText = 'font-family:monospace;font-size:10px;font-weight:700;color:#fbbf24;display:flex;justify-content:space-between;';
    fmaRow.textContent = 'AP++ STBY';
    hudFmaEl = fmaRow;

    const btnGrid = document.createElement('div');
    btnGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;';
    const makeBtn = (label: string, onClick: () => void) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'background:rgba(255,255,255,0.06);color:#e5e7eb;border:1px solid rgba(255,255,255,0.16);border-radius:4px;padding:4px 4px;font-size:9px;font-weight:700;cursor:pointer;';
      b.addEventListener('click', onClick);
      return b;
    };

    const masterBtn = makeBtn('AP++', () => handlers.onCommand({ type: 'toggle' }));
    const holdAllBtn = makeBtn('HOLD ALL', () => handlers.onCommand({ type: 'holdPresent', axis: 'all' }));
    const raceBtn = makeBtn('RACETRACK', () => handlers.onCommand({ type: 'holdHere' }));
    const ldgBtn = makeBtn('LDG ARM', () => handlers.onCommand({ type: 'setLandingArm', armed: !handlers.getState().landingArmed }));
    const hoverBtn = makeBtn('HOVER', () => handlers.onCommand({ type: 'setHoverMode', enabled: !handlers.getState().hoverMode }));
    const protBtn = makeBtn('PROT', () => handlers.onCommand({ type: 'setEnvelopeProtection', enabled: !handlers.getState().envelopeProtection }));
    btnGrid.append(masterBtn, holdAllBtn, raceBtn, ldgBtn, hoverBtn, protBtn);

    syncHudTab = () => {
      const s = handlers.getState();
      fmaRow.textContent = s.engaged
        ? `${s.fma.thr} · ${s.fma.vert} · ${s.fma.lat}${s.fma.protection ? ` [${s.fma.protection}]` : ''}`
        : 'AP++ STBY';
      fmaRow.style.color = s.fma.protection
        ? '#f87171'
        : s.engaged
          ? '#4ade80'
          : '#9ca3af';
      const mark = (b: HTMLButtonElement, state: 'active' | 'disabled' | 'idle') => {
        if (state === 'active') {
          b.style.borderColor = '#22c55e';
          b.style.color = '#4ade80';
          b.style.background = 'rgba(34, 197, 94, 0.16)';
        } else if (state === 'disabled') {
          b.style.borderColor = '#ef4444';
          b.style.color = '#f87171';
          b.style.background = 'rgba(239, 68, 68, 0.16)';
        } else {
          b.style.borderColor = 'var(--geofs-ext-border, rgba(156, 163, 175, 0.35))';
          b.style.color = '#9ca3af';
          b.style.background = 'rgba(255, 255, 255, 0.04)';
        }
      };
      mark(masterBtn, s.engaged ? 'active' : 'idle');
      mark(raceBtn, s.engaged && s.lateralMode === 'hold' ? 'active' : 'idle');
      mark(ldgBtn, s.landingArmed ? 'active' : 'idle');
      mark(hoverBtn, s.engaged && s.hoverMode ? 'active' : 'idle');
      mark(protBtn, s.envelopeProtection ? 'active' : 'disabled');
    };
    hudTab.append(fmaRow, btnGrid);
    unmounts.push(context.anchors.registerHudTab('ap-pp', 'AP++', hudTab, false, { defaultClosed: true }));
  }

  return { barEl: bar, padEl: pad, fmaLineEl, hudFmaEl, syncHudTab, unmounts };
}
