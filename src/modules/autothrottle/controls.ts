export const controlMarkup = `
  <div class="control-pad ext-autothrottle-control-pad ext-autothrottle-pad" id="autothrottle-button"
       role="button" tabindex="0" aria-pressed="false" title="Toggle autothrottle on/off">
    <div class="control-pad-label transp-pad">A/THR</div>
  </div>
  <div class="ext-autothrottle-controls" hidden>
    <div class="geofs-autopilot-control ext-autothrottle-control">
      <div class="ext-autothrottle-value-row">
        <div class="ext-autothrottle-reverse" hidden>[REV]</div>
        <a class="ext-autothrottle-numberDown numberDown" data-step="-1" aria-label="Decrease target speed">-</a><input
          class="ext-autothrottle-numberValue numberValue ext-autothrottle-speed" type="text"
          inputmode="decimal" aria-label="Autothrottle target speed" value="0"><a
          class="ext-autothrottle-numberUp numberUp" data-step="1" aria-label="Increase target speed">+</a>
      </div>
      <span class="ext-autothrottle-switch" role="group" aria-label="Speed mode">
        <a class="ext-autothrottle-switchLeft switchLeft" data-speed-mode="knots">KTS</a><a
          class="ext-autothrottle-switchRight switchRight" data-speed-mode="mach">M.</a>
      </span>
    </div>
    <div class="geofs-autopilot-control ext-autothrottle-control ext-autothrottle-landing">
      <div class="ext-autothrottle-value-row">
        <span class="ext-autothrottle-landing-label">LANDING</span>
      </div>
      <span class="ext-autothrottle-switch" id="autothrottle-landing-mode-switch" role="group" aria-label="Landing mode"
            title="Landing mode: when armed, throttle retards to idle by 27 ft RA and deploys spoilers on touchdown">
        <a class="ext-autothrottle-switchLeft switchLeft" data-arm="off">OFF</a><a
          class="ext-autothrottle-switchRight switchRight" data-arm="on">ARM</a>
      </span>
    </div>
  </div>
  <div class="mdl-tooltip" id="autothrottle-tooltip" for="autothrottle-button">Toggle autothrottle on/off</div>
  <div class="mdl-tooltip" id="autothrottle-landing-mode-tooltip" for="autothrottle-landing-mode-switch">Landing mode: when armed, throttle retards to idle at 27 ft RA and deploys spoilers on touchdown</div>
`;

export const controlStyles = `
  .ext-autothrottle-bar,
  .ext-autothrottle-bar * {
    box-sizing: border-box;
  }
  .ext-autothrottle-bar {
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    vertical-align: var(--geofs-ext-ap-valign, middle);
    pointer-events: all;
    font-weight: 400;
  }
  .ext-autothrottle-bar [hidden] {
    display: none !important;
  }
  :where(.ext-autothrottle-bar .ext-autothrottle-pad) {
    background-color: #000000;
    border: 1px solid #888888;
    box-shadow: 0 0 5px #000000;
  }
  #autothrottle-button.ext-autothrottle-pad {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: var(--geofs-ext-ap-height, 27px);
    min-width: 0;
    min-height: var(--geofs-ext-ap-height, 27px);
    padding: 0 12px;
    margin: var(--geofs-ext-ap-margin, 0 10px);
    border-radius: var(--geofs-ext-ap-radius, 15px);
    vertical-align: var(--geofs-ext-ap-valign, middle);
    cursor: pointer;
    pointer-events: all;
    text-align: center;
    white-space: nowrap;
    flex: 0 0 auto;
    font-weight: 400;
  }
  #autothrottle-button.ext-autothrottle-pad .control-pad-label {
    pointer-events: none;
    line-height: 1.15;
    font-family: var(--geofs-ext-ap-font-family, "Roboto", "Helvetica", "Arial", sans-serif);
    font-size: var(--geofs-ext-ap-font-size, 12px);
    font-weight: var(--geofs-ext-ap-font-weight, 400);
    letter-spacing: var(--geofs-ext-ap-letter-spacing, normal);
    text-align: center;
    white-space: nowrap;
  }
  :where(#autothrottle-button.ext-autothrottle-pad .control-pad-label) {
    color: rgba(255, 255, 255, 0.78);
  }
  :where(#autothrottle-button.ext-autothrottle-pad.green-pad .control-pad-label) {
    color: #ffffff;
  }
  .ext-autothrottle-controls {
    margin-right: 10px;
    display: inline-flex;
    align-items: flex-start;
    gap: 8px;
  }
  .ext-autothrottle-bar .ext-autothrottle-control {
    position: relative;
    margin: 0 5px;
    text-align: center;
    color: #ffffff;
    line-height: 25px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    vertical-align: top;
  }
  .ext-autothrottle-value-row {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    line-height: 25px;
  }
  .ext-autothrottle-bar a {
    user-select: none;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    background: #000000;
    border: 1px solid #ffffff;
    box-shadow: 0 0 5px #000000;
    text-decoration: none;
    font-weight: 400;
  }
  .ext-autothrottle-control .numberDown,
  .ext-autothrottle-control .numberUp {
    position: relative;
    width: 30px;
    height: 25px;
    line-height: 23px;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    vertical-align: top;
  }
  .ext-autothrottle-control .numberDown {
    border-radius: 15px 0 0 15px;
    margin-right: -5px;
    z-index: 1;
  }
  .ext-autothrottle-control .numberUp {
    border-radius: 0 15px 15px 0;
    margin-left: -5px;
    z-index: 1;
  }
  .ext-autothrottle-control .ext-autothrottle-speed {
    position: relative;
    z-index: 2;
    font: 20px/25px 'LCD-Bold', monospace;
    letter-spacing: 1px;
    vertical-align: top;
    background: #000000;
    color: #ffffff;
    text-align: right;
    width: 50px;
    height: 25px;
    padding: 0 5px;
    margin: 0;
    border: 1px solid #ffffff;
    border-radius: 0;
    box-shadow: 0 0 5px #000000;
  }
  .ext-autothrottle-switch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    margin: 2px 0 0;
  }
  .ext-autothrottle-switch a {
    position: relative;
    width: 35px;
    height: 17px;
    line-height: 15px;
    text-align: center;
    font-weight: 400;
    font-size: 10px;
  }
  .ext-autothrottle-switchLeft {
    border-radius: 15px 0 0 15px;
    margin-right: -3px;
    z-index: 1;
  }
  .ext-autothrottle-switchRight {
    border-radius: 0 15px 15px 0;
  }
  .ext-autothrottle-landing {
    text-align: center;
  }
  .ext-autothrottle-landing-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    font-family: 'LCD-Bold', monospace;
    font-size: 20px;
    font-weight: 400;
    line-height: 25px;
    letter-spacing: 1px;
    color: #ffffff;
    text-shadow: 0 0 5px #000000;
    white-space: nowrap;
    user-select: none;
  }
  .ext-autothrottle-bar .green-pad {
    border-color: #4caf50 !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.45) !important;
    z-index: 2;
  }
  .ext-autothrottle-bar .red-pad {
    border-color: #ef4444 !important;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.45) !important;
  }
  .ext-autothrottle-reverse {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8px;
    color: #ef4444;
    font-weight: 900;
    letter-spacing: 1px;
    text-shadow: 0 0 5px #ef4444;
    white-space: nowrap;
  }
  .ext-autothrottle-bar .mdl-tooltip:not(.is-active) {
    position: fixed;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
`;
