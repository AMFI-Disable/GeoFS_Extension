export const controlMarkup = `
  <div class="control-pad ext-autothrottle-control-pad ext-autothrottle-pad" id="autothrottle-button"
       role="button" tabindex="0" aria-pressed="false" title="Toggle autothrottle on/off">
    <div class="control-pad-label transp-pad">A/THR</div>
  </div>
  <div class="ext-autothrottle-controls" hidden>
    <div class="ext-autothrottle-control">
      <div class="ext-autothrottle-reverse" hidden>[REV]</div>
      <a class="ext-autothrottle-numberDown numberDown" data-step="-1" aria-label="Decrease target speed">-</a><input
        class="ext-autothrottle-numberValue numberValue ext-autothrottle-speed" type="text"
        inputmode="decimal" aria-label="Autothrottle target speed" value="0"><a
        class="ext-autothrottle-numberUp numberUp" data-step="1" aria-label="Increase target speed">+</a>
      <span class="ext-autothrottle-switch" role="group" aria-label="Speed mode">
        <a class="ext-autothrottle-switchLeft switchLeft" data-speed-mode="knots">KTS</a>
        <a class="ext-autothrottle-switchRight switchRight" data-speed-mode="mach">M.</a>
      </span>
    </div>
    <div class="geofs-autopilot-control ext-autothrottle-landing">
      <span>LANDING</span>
      <span class="ext-autothrottle-switch" role="group" aria-label="Landing mode"
            title="Landing mode: when armed, throttle goes to idle at touchdown">
        <a class="ext-autothrottle-switchLeft switchLeft" data-arm="off">OFF</a>
        <a class="ext-autothrottle-switchRight switchRight" data-arm="on">ARM</a>
      </span>
    </div>
  </div>
`;

export const controlStyles = `
  .ext-autothrottle-bar { white-space: nowrap; display: flex; align-items: flex-start; pointer-events: all; }
  .ext-autothrottle-bar [hidden] { display: none !important; }
  .ext-autothrottle-bar .ext-autothrottle-pad { width: 60px; margin: 0 10px; cursor: pointer; pointer-events: all; }
  .ext-autothrottle-pad .control-pad-label { pointer-events: none; }
  .ext-autothrottle-controls { margin-right: 10px; }
  .ext-autothrottle-control { position: relative; margin: 0 5px; text-align: center; color: white; line-height: 25px; display: inline-block; }
  .ext-autothrottle-control .ext-autothrottle-switch { display: block; font-size: 12px; }
  .ext-autothrottle-bar a { user-select: none; display: inline-block; cursor: pointer; color: white; background: #000; border: 1px solid white; box-shadow: 0 0 5px #000; }
  .ext-autothrottle-switch a { width: 35px; height: 17px; line-height: 19px; margin: 2px 0; text-align: center; }
  .ext-autothrottle-switchLeft, .ext-autothrottle-numberDown { border-radius: 15px 0 0 15px; }
  .ext-autothrottle-switchRight, .ext-autothrottle-numberUp { border-radius: 0 15px 15px 0; }
  .ext-autothrottle-control .numberDown, .ext-autothrottle-control .numberUp { width: 30px; height: 25px; margin: 0; vertical-align: top; }
  .ext-autothrottle-control .ext-autothrottle-speed {
    font: 20px/26px 'LCD-Bold', monospace; letter-spacing: 1px; vertical-align: top;
    background: #000; color: white; text-align: right; width: 50px; height: 25px;
    padding: 0 5px; margin: 0; border: 1px solid white; border-radius: 0; box-shadow: 0 0 5px #000;
  }
  .ext-autothrottle-landing { display: inline-block; vertical-align: bottom; margin-left: 5px; text-align: center; }
  .ext-autothrottle-landing > span:first-child { display: block; font-size: 10px; font-weight: bold; color: #aaa; margin-bottom: 2px; letter-spacing: .5px; }
  .ext-autothrottle-bar .green-pad { border-color: #10b981 !important; box-shadow: 0 0 10px rgba(16, 185, 129, .4) !important; }
  .ext-autothrottle-bar .red-pad { border-color: #ef4444 !important; box-shadow: 0 0 10px rgba(239, 68, 68, .4) !important; }
  .ext-autothrottle-bar .landing-selected { background: #555; border-color: #888; }
  .ext-autothrottle-reverse {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 8px;
    color: #ef4444; font-weight: 900; letter-spacing: 1px; text-shadow: 0 0 5px #ef4444;
  }
`;
