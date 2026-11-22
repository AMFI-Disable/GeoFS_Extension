import { buildTopbarPadStyles } from '../../shared/topbar-styles';

export const THRUST_PRESETS = [1, 2, 5, 10, 50, 100, 500, 1000, 5000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
export const CEILING_PRESETS = [3000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000, 1000000000000];

export const CARD_STYLES = `
  ${buildTopbarPadStyles('#opEngineBarBtn.geofs-ext-op-bar-btn')}
  #opEngineCard .op-native-btn.green-pad {
    border-color: #4caf50 !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
  }
  #opEngineCard {
    box-sizing: border-box;
    position: fixed;
    bottom: 120px;
    left: 540px;
    width: 320px;
    min-width: 320px;
    max-width: min(320px, calc(100vw - 24px));
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    z-index: 2147483002;
    overflow: hidden;
    user-select: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  #opEngineCard * {
    box-sizing: border-box;
  }
  #opEngineHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(136, 136, 136, 0.45);
    background: rgba(0, 0, 0, 0.5);
    cursor: grab;
    user-select: none;
    touch-action: none;
  }
  #opEngineHeaderText {
    flex: 1;
    min-width: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: #ffffff;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .op-card-body {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .op-btn-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  #opEngineCard .op-native-btn {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 7px 10px;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 0 5px #000000;
    white-space: nowrap;
    text-align: center;
  }
  #opEngineCard .op-native-btn:hover {
    border-color: #ffffff;
  }
  #opEngineCard .op-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    font-size: 10px;
    color: #cccccc;
    text-transform: uppercase;
    white-space: nowrap;
  }
  #opMultInput {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 6px;
    width: 72px;
    text-align: center;
    font-weight: 700;
    font-size: 12px;
    padding: 2px 4px;
  }
  .op-slider {
    width: 100%;
    margin: 0;
    accent-color: #4caf50;
    cursor: pointer;
  }
  .op-lock-wrap {
    position: relative;
  }
  .op-lock-overlay {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 5;
    cursor: not-allowed;
  }
  .op-policy-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px solid rgba(136, 136, 136, 0.35);
    font-size: 10px;
  }
  .op-policy-pills {
    display: inline-flex;
    gap: 4px;
  }
  #opEngineCard .op-pill {
    background: #000000;
    color: #aaaaaa;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }
  #opEngineCard .op-pill.is-active {
    border-color: #4caf50;
    color: #ffffff;
    background: rgba(76, 175, 80, 0.2);
  }
`;
