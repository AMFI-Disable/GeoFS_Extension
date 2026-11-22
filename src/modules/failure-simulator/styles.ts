export const FAILURE_STYLES = `
  @keyframes geofsExtPulseRed {
    from { box-shadow: 0 0 4px #ef4444; }
    to { box-shadow: 0 0 12px #ef4444; }
  }
  .geofs-ext-fail-pill {
    position: fixed;
    right: 15px;
    bottom: 15px;
    z-index: 2147483003;
    padding: 5px 14px;
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 10px;
    cursor: grab;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    user-select: none;
    touch-action: none;
    white-space: nowrap;
  }
  .geofs-ext-fail-pill.has-failures {
    border-color: #ef4444;
    color: #ff8d8d;
    animation: geofsExtPulseRed 1s infinite alternate;
  }
  #geofs-failure-menu {
    box-sizing: border-box;
    position: fixed;
    left: 50px;
    top: 60px;
    width: 460px;
    min-width: 460px;
    max-width: min(460px, calc(100vw - 24px));
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #888888;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    color: #ffffff;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    z-index: 2147483004;
    display: none;
    flex-direction: column;
    overflow: visible;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  #geofs-failure-menu * {
    box-sizing: border-box;
  }
  .geofs-ext-fail-led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 5px #22c55e;
    flex-shrink: 0;
  }
  .geofs-ext-fail-led.is-failed {
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
    animation: geofsExtPulseRed 1s infinite alternate;
  }
  .geofs-ext-fail-btn {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 6px;
    font-size: 9px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    text-align: center;
  }
  .geofs-ext-fail-btn--danger {
    border-color: #ef4444;
    color: #ff6b6b;
  }
  .geofs-ext-fail-btn--ok {
    border-color: #4caf50;
    color: #4ade80;
  }
  .geofs-ext-fail-btn--warn {
    border-color: #eab308;
    color: #ffc107;
  }
`;
