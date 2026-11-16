import type { SimMajorVersion } from '../../types/module';

// Markup and styles from the archived V3.9 and V4.0 Autothrottle controls.
export const controlMarkup = (major: SimMajorVersion) => `
<div class="ext-autothrottle-control-pad ext-autothrottle-pad" id="autothrottle-button" tabindex="0" style="cursor: pointer; pointer-events: all;">
    <div class="control-pad-label transp-pad" style="pointer-events: none;">A/THR</div>
</div>
<div class="ext-autothrottle-controls" style="display: none;">
    <div class="ext-autothrottle-control" style="position: relative;">
        <div id="V${major === 3 ? 39 : 40}-at-rev" style="display: none; font-size: 8px; color: #ef4444; font-weight: 900; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); letter-spacing: 1px; text-shadow: 0 0 5px #ef4444;">[REV]</div>
        <a class="ext-autothrottle-numberDown numberDown ext-autothrottle-control">-</a><input class="ext-autothrottle-numberValue numberValue ext-autothrottle-speed" min="0" ${major === 3 ? 'data-smallstep="5" data-stepthreshold="100"' : 'smallstep="5" stepthreshold="100"'} step="10" data-method="setSpeed" maxlength="4" max="9999" value="0"><a class="ext-autothrottle-numberUp numberUp">+</a>
        <span class="ext-autothrottle-switch ext-autothrottle-speedMode">
            <a class="ext-autothrottle-switchLeft switchLeft green-pad" data-method="setAutothrottleSpeedMode" value="knots" id="knotsMode">KTS</a>
            <a class="ext-autothrottle-switchRight switchRight" data-method="setAutothrottleSpeedMode" value="mach" id="machMode">M.</a>
        </span>
    </div>
    <div class="geofs-autopilot-control" style="display: inline-block; vertical-align: bottom; margin-left: 5px; text-align: center;">
        <span style="display: block; font-size: 10px; font-weight: bold; color: #aaa; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">LANDING</span>
        <span class="ext-autothrottle-switch ext-autothrottle-mode" id="autothrottle-landing-mode-switch" role="group" aria-label="Landing mode">
            <a class="ext-autothrottle-switchLeft switchLeft landing-selected" data-method="setArm" value="false" id="armOff" role="button" tabindex="0" aria-pressed="true">OFF</a>
            <a class="ext-autothrottle-switchRight switchRight" data-method="setArm" value="true" id="armOn" role="button" tabindex="0" aria-pressed="false">ARM</a>
        </span>
    </div>
</div>
<div class="mdl-tooltip" id="autothrottle-tooltip" for="autothrottle-button">Toggle autothrottle on/off</div>
<div class="mdl-tooltip" id="autothrottle-landing-mode-tooltip" for="autothrottle-landing-mode-switch">Landing mode: when armed, throttle goes to idle at touchdown</div>
`;

export const controlStyles = `
.ext-autothrottle-pad {
    width: 60px;
    margin: 0px 10px;
}
.ext-autothrottle-bar {
    white-space: nowrap;
    display: flex;
    align-items: flex-start;
    pointer-events: all;
}
.ext-autothrottle-control-pad {
    border: 1px solid #888;
    background-color: #000;
    box-shadow: 0px 0px 5px #000;
    border-radius: 15px;
    cursor: pointer !important;
}
.ext-autothrottle-controls {
    vertical-align: bottom;
    display: none;
    margin-right: 10px;
}
.ext-autothrottle-control {
    position: relative;
    text-align: center;
    margin: 0px 5px;
    color: white;
    line-height: 25px;
    display: inline-block;
}
.ext-autothrottle-control span {
    display: block;
    text-align: center;
    text-shadow: #000 1px 1px 3px;
    font-size: 12px;
    top: 0px;
    position: relative;
}
.ext-autothrottle-bar .ext-autothrottle-switch .ext-autothrottle-switchRight {
    top: 0px !important;
    border-radius: 0px 15px 15px 0px;
    left: 0px;
}
.ext-autothrottle-bar .ext-autothrottle-switch .ext-autothrottle-switchLeft {
    top: 0px !important;
    border-radius: 15px 0px 0px 15px;
    border-right: 5px;
    right: -3px;
}
.ext-autothrottle-bar .ext-autothrottle-switch a {
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    display: inline-block;
    width: 35px;
    height: 17px;
    line-height: 19px;
    cursor: pointer;
    color: white;
    background: #000;
    margin: 2px 0px;
    display: inline-block;
    border: 1px solid white;
    box-shadow: 0px 0px 5px #000;
}
.ext-autothrottle-bar .ext-autothrottle-control {
    position: relative;
    text-align: center;
    margin: 0px 5px;
    color: white;
    line-height: 25px;
    display: inline-block;
}
.ext-autothrottle-bar .ext-autothrottle-speed {
    width: 50px !important;
}
.ext-autothrottle-numberDown {
    border-radius: 15px 0px 0px 15px;
    line-height: 23px;
    right: -5px;
    position: relative !important;
}
.ext-autothrottle-numberUp {
    border-radius: 0px 15px 15px 0px;
    line-height: 26px;
    left: -5px;
    position: relative !important;
}
.ext-autothrottle-control .ext-autothrottle-numberDown,.ext-autothrottle-control .ext-autothrottle-numberUp {
    user-select: none;
    -webkit-user-select: none;
    vertical-align: top;
    cursor: pointer;
    text-align: center;
    color: white;
    background: #000;
    margin: 0px;
    width: 30px;
    display: inline-block;
    border: 1px solid white;
    height: 25px;
    box-shadow: 0px 0px 5px #000;
}
.ext-autothrottle-control .ext-autothrottle-numberValue {
    font-family: 'LCD-Bold', monospace;
    font-size: 20px !important;
    letter-spacing: 1px;
    display: inline-block;
    vertical-align: top;
    padding: 0px 5px;
    margin: 0px;
    background: #000;
    border: 1px solid;
    border-radius: 0px;
    height: 25px;
    line-height: 26px;
    box-shadow: 0px 0px 5px #000;
    color: white;
    width: 120px; /* overriden in ext-autothrottle-speed */
    text-align: right;
 }
 .ext-autothrottle-bar .green-pad {
    border-color: #10b981 !important;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.4) !important;
 }
 .ext-autothrottle-bar .red-pad {
    border-color: #ef4444 !important;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4) !important;
 }
 #autothrottle-landing-mode-switch .landing-selected {
    background: #555;
    border-color: #888;
 }
`;
