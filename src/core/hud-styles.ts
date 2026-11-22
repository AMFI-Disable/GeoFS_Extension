export const HUD_STYLES = `
      :root {
        --geofs-ext-scale: 1;
        --geofs-ext-bg: rgba(0, 0, 0, 0.8);
        --geofs-ext-surface: rgba(255, 255, 255, 0.08);
        --geofs-ext-fg: #ffffff;
        --geofs-ext-muted: rgba(255, 255, 255, 0.58);
        --geofs-ext-border: #888888;
        --geofs-ext-divider: rgba(255, 255, 255, 0.14);
        --geofs-ext-accent: #ffc107;
        --geofs-ext-accent-fg: #000000;
        --geofs-ext-blue: #0d5f8d;
        --geofs-ext-sky: #00bbff;
        --geofs-ext-radar-bg: #000000;
      }
      :root[data-geofs-ext-theme="light"] {
        --geofs-ext-bg: rgba(255, 255, 255, 0.92);
        --geofs-ext-surface: rgba(0, 0, 0, 0.05);
        --geofs-ext-fg: #000000;
        --geofs-ext-muted: rgba(0, 0, 0, 0.56);
        --geofs-ext-border: rgba(0, 0, 0, 0.22);
        --geofs-ext-divider: rgba(0, 0, 0, 0.12);
        --geofs-ext-accent: #0d5f8d;
        --geofs-ext-accent-fg: #ffffff;
        --geofs-ext-blue: #0d5f8d;
        --geofs-ext-sky: #0d5f8d;
        --geofs-ext-radar-bg: #ffffff;
      }
      html.geofs-ext-dragging,
      html.geofs-ext-dragging *,
      html.geofs-ext-dragging #flightDataDisplay.geofs-ext-hud,
      html.geofs-ext-dragging #flightDataDisplay.geofs-ext-hud * {
        cursor: grabbing !important;
        user-select: none !important;
      }
      .is-dragging {
        transition: none !important;
      }
      #flightDataDisplay.geofs-ext-hud, .geofs-ext-native-card {
        box-sizing: border-box;
        position: fixed;
        top: 70px;
        right: 54px;
        width: 250px;
        min-width: 250px;
        max-width: 250px;
        height: auto;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 8px;
        z-index: 2147483000;
        display: flex;
        flex-direction: column;
        gap: 0;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top right;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        user-select: none;
        touch-action: none;
      }
      html:not(.geofs-ext-dragging) #flightDataDisplay.geofs-ext-hud,
      html:not(.geofs-ext-dragging) #flightDataDisplay.geofs-ext-hud * {
        cursor: grab !important;
      }
      #flightDataDisplay.geofs-ext-hud * {
        box-sizing: border-box;
      }
      #flightDataDisplay.geofs-ext-hud {
        overflow: visible;
      }
      #flightDataDisplay.geofs-ext-hud .mdl-tooltip {
        display: none !important;
      }
      #flightDataDisplay.geofs-ext-hud > .geofs-ext-hud-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        width: 100%;
        height: auto;
        min-height: 22px;
        gap: 3px;
        margin-bottom: 6px;
        cursor: grab;
        user-select: none;
      }
      .geofs-ext-hud-grip {
        position: relative;
        width: 10px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--geofs-ext-muted);
        fill: currentColor;
        cursor: grab;
      }
      .geofs-ext-hud-grip:hover {
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud #hud-unified-tabs.unified-tabs {
        display: flex;
        align-items: stretch;
        gap: 2px;
        flex: 1;
        min-width: 0;
        margin: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      #flightDataDisplay.geofs-ext-hud #hud-unified-tabs.unified-tabs::-webkit-scrollbar {
        display: none;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        flex: 1 1 auto;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 3px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer !important;
        text-align: center;
        line-height: 1.2;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab * {
        cursor: pointer !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-label {
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-close {
        display: none;
        flex-shrink: 0;
        font-size: 10px;
        line-height: 1;
        opacity: 0.75;
        padding: 0 1px;
        border-radius: 50%;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab:hover .geofs-ext-tab-close,
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-active .geofs-ext-tab-close {
        display: inline-flex;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-tab-close:hover {
        opacity: 1;
        color: #ff6b6b;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-drag-over {
        border-color: var(--geofs-ext-sky);
        box-shadow: 0 0 6px rgba(0, 187, 255, 0.45);
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-tab-dragging {
        opacity: 0.5;
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab:hover {
        border-color: var(--geofs-ext-fg);
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud .unified-tab.active,
      #flightDataDisplay.geofs-ext-hud .unified-tab.is-active {
        background: var(--geofs-ext-accent);
        border-color: var(--geofs-ext-accent);
        border-radius: 15px;
        color: var(--geofs-ext-accent-fg);
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 22px;
        padding: 0;
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add:hover,
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-add.is-open {
        border-color: var(--geofs-ext-fg);
        color: var(--geofs-ext-fg);
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-menu {
        display: none !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 6px;
        padding: 6px;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 8px;
        background: var(--geofs-ext-bg);
        cursor: default !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu * {
        cursor: default !important;
      }
      #flightDataDisplay.geofs-ext-hud .geofs-ext-hud-menu button {
        cursor: pointer !important;
      }
      .geofs-ext-hud-menu-title {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: var(--geofs-ext-muted);
      }
      .geofs-ext-hud-menu-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
      }
      .geofs-ext-hud-menu-name {
        flex: 1;
        min-width: 0;
        text-align: left;
        background: transparent;
        border: none;
        padding: 2px 0;
        color: var(--geofs-ext-fg);
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .geofs-ext-hud-menu-name:hover {
        color: var(--geofs-ext-sky);
      }
      .geofs-ext-hud-menu-actions {
        display: inline-flex;
        gap: 3px;
        flex-shrink: 0;
      }
      .geofs-ext-hud-preset-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px;
      }
      .geofs-ext-hud-menu-chip {
        background: var(--geofs-ext-surface);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 9px;
        font-weight: 700;
      }
      .geofs-ext-hud-menu-chip.is-active {
        border-color: var(--geofs-ext-accent);
        color: var(--geofs-ext-accent);
      }
      .geofs-ext-hud-menu-reset {
        background: transparent;
        color: var(--geofs-ext-muted);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 4px;
        padding: 3px 6px;
        font-size: 9.5px;
        font-weight: 700;
      }
      .geofs-ext-hud-menu-reset:hover {
        color: var(--geofs-ext-fg);
        border-color: var(--geofs-ext-fg);
      }
      .geofs-ext-detached-panel {
        box-sizing: border-box;
        position: fixed;
        top: 110px;
        right: 280px;
        width: 250px;
        min-width: 240px;
        max-width: 260px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        padding: 8px;
        z-index: 2147483002;
        display: flex;
        flex-direction: column;
        gap: 6px;
        transform: scale(var(--geofs-ext-scale));
        transform-origin: top left;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      }
      .geofs-ext-detached-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        cursor: grab;
        user-select: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        padding-bottom: 4px;
      }
      .geofs-ext-detached-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.4px;
        text-transform: uppercase;
      }
      .geofs-ext-detached-actions {
        display: inline-flex;
        gap: 4px;
      }
      .geofs-ext-detached-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 4px;
        width: 18px;
        height: 18px;
        padding: 0;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
      }
      .geofs-ext-hud-min {
        position: relative;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        min-width: 20px;
        height: 22px;
        padding: 0 4px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: grab;
        text-align: center;
      }
      #flightDataDisplay.geofs-ext-hud > .geofs-ext-hud-body {
        flex: 0 0 auto;
        width: 100%;
        max-height: none;
        overflow: visible;
        cursor: grab;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized {
        width: 40px;
        min-width: 40px;
        max-width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized > .geofs-ext-hud-header {
        margin-bottom: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-grip {
        display: none;
      }
      #flightDataDisplay.geofs-ext-hud.is-minimized .geofs-ext-hud-min {
        border: none;
        background: transparent;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 10px;
        line-height: 1;
      }
      [data-hud-tip]:hover::after,
      [data-hud-tip]:focus-visible::after {
        content: attr(data-hud-tip);
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        background: rgba(0, 0, 0, 0.92);
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 6px;
        padding: 3px 7px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10px;
        font-weight: 600;
        line-height: 1.2;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
        z-index: 2147483050;
      }
      [data-hud-tip][data-tip-v="above"]:hover::after,
      [data-hud-tip][data-tip-v="above"]:focus-visible::after {
        top: auto;
        bottom: calc(100% + 4px);
      }
      [data-hud-tip][data-tip-h="left"]:hover::after,
      [data-hud-tip][data-tip-h="left"]:focus-visible::after {
        left: 0;
        right: auto;
      }
      [data-hud-tip][data-tip-h="center"]:hover::after,
      [data-hud-tip][data-tip-h="center"]:focus-visible::after {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }
      html.geofs-ext-dragging [data-hud-tip]::after,
      .is-dragging [data-hud-tip]::after,
      .is-dragging[data-hud-tip]::after {
        display: none !important;
      }
      #hudMinimizeBtn.unified-hud-edge-tab {
        position: fixed;
        left: 0;
        top: calc(50% - 20px);
        width: 24px;
        height: 40px;
        background: var(--geofs-ext-bg);
        color: var(--geofs-ext-fg);
        border: 1px solid var(--geofs-ext-border);
        border-left: none;
        border-radius: 0 7px 7px 0;
        z-index: 2147483001;
        align-items: center;
        justify-content: center;
        cursor: grab;
        user-select: none;
        touch-action: none;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      #hudMinimizeBtn.unified-hud-edge-tab[data-hud-tip]:hover::after,
      #hudMinimizeBtn.unified-hud-edge-tab[data-hud-tip]:focus-visible::after {
        top: 50%;
        bottom: auto;
        left: calc(100% + 6px);
        right: auto;
        transform: translateY(-50%);
      }
      .geofs-ext-zone {
        position: fixed;
        z-index: 2147483000;
        display: flex;
        gap: 6px;
        transform: scale(var(--geofs-ext-scale));
      }
      .geofs-ext-zone--top { top: 10px; left: 50%; transform: translateX(-50%) scale(var(--geofs-ext-scale)); }
      .geofs-ext-zone--bottom { bottom: 14px; left: 50%; transform: translateX(-50%) scale(var(--geofs-ext-scale)); }
      .geofs-ext-zone--autopilot {
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%) scale(var(--geofs-ext-scale));
        background: var(--geofs-ext-bg);
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 8px;
        align-items: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      .geofs-ext-zone--right { top: 45%; right: 12px; flex-direction: column; transform-origin: right center; }
      .geofs-ext-zone--corner { bottom: 14px; right: 106px; transform-origin: bottom right; }
      .geofs-ext-pad {
        box-sizing: border-box;
        background: #000000;
        color: #ffffff;
        border: 1px solid var(--geofs-ext-border);
        border-radius: 15px;
        padding: 4px 10px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
      }
      .geofs-ext-pad.is-active,
      .geofs-ext-pad.green-pad {
        border-color: #4caf50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.45);
        color: #ffffff;
      }
      #geofs-ext-toasts {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: min(320px, calc(100vw - 40px));
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        pointer-events: none;
      }
      .geofs-ext-toast {
        box-sizing: border-box;
        max-width: 100%;
        background: rgba(40, 40, 40, 0.96);
        color: #eeeeee;
        border: 1px solid #777777;
        border-radius: 4px;
        padding: 8px 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        line-height: 1.35;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        overflow-wrap: anywhere;
      }
      .geofs-ext-toast--warn { border-color: #eab308; color: #ffd37a; }
      .geofs-ext-toast--critical { border-color: #ef4444; color: #ff8d8d; }
      .geofs-ext-prompt {
        box-sizing: border-box;
        pointer-events: auto;
        width: 100%;
        background: rgba(0, 0, 0, 0.9);
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        padding: 10px 12px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      }
      .geofs-ext-prompt-text {
        margin-bottom: 8px;
        line-height: 1.35;
      }
      .geofs-ext-prompt-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: flex-end;
      }
      .geofs-ext-prompt-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        padding: 4px 9px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
      }
      .geofs-ext-prompt-btn--primary { border-color: #4caf50; color: #4caf50; }
      .geofs-ext-prompt-btn--danger { border-color: #ef4444; color: #ff6b6b; }
`;
