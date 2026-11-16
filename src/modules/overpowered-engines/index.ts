import type {
  GeoFSAircraftDefinition,
  GeoFSAircraftInstance,
  GeoFSControls,
  GeoFSEnginePart
} from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings, OpSyncPolicy } from '../../types/settings';

const THRUST_FIELDS = ['thrust', 'afterBurnerThrust', 'reverseThrust'] as const;
type ThrustValues = Pick<GeoFSEnginePart, (typeof THRUST_FIELDS)[number]>;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatNumberCompact(val: number): string {
  if (val >= 1_000_000_000_000) return `${(val / 1_000_000_000_000).toFixed(1)}T`;
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  return Math.round(val).toLocaleString();
}

export interface PilotControlsSample {
  roll: number;
  pitch: number;
  yaw: number;
  controlling: boolean;
}

export function readPilotControls(controls: GeoFSControls | undefined, deadzone = 0.03): PilotControlsSample {
  const rawRoll = Number(controls?.rawRoll ?? controls?.roll ?? 0);
  const rawPitch = Number(controls?.rawPitch ?? controls?.pitch ?? 0);
  const rawYaw = Number(controls?.rawYaw ?? controls?.yaw ?? 0);
  const roll = Number.isFinite(rawRoll) ? rawRoll : 0;
  const pitch = Number.isFinite(rawPitch) ? rawPitch : 0;
  const yaw = Number.isFinite(rawYaw) ? rawYaw : 0;
  const controlling = Math.max(Math.abs(roll), Math.abs(pitch), Math.abs(yaw)) > deadzone;
  return { roll, pitch, yaw, controlling };
}

export class EffectiveSasController {
  public targetPitch: number | null = null;
  public targetRoll: number | null = null;
  private wasControlling = false;

  public reset(): void {
    this.targetPitch = null;
    this.targetRoll = null;
    this.wasControlling = false;
  }

  public step(params: {
    rigidBody?: GeoFSAircraftInstance['rigidBody'];
    controls?: GeoFSControls;
    pitchDeg: number;
    rollDeg: number;
    kias: number;
    multiplier: number;
    sasStrength: number;
    groundContact: boolean;
  }): { mode: 'maneuver' | 'hold'; controlling: boolean; nextAngularVelocity: [number, number, number] | null } {
    const {
      rigidBody,
      controls,
      pitchDeg,
      rollDeg,
      kias,
      multiplier,
      sasStrength,
      groundContact
    } = params;
    const sample = readPilotControls(controls);
    const strength = clamp(sasStrength || 1.0, 0.25, 2.5);
    const av = rigidBody?.getAngularVelocity?.();

    if (sample.controlling) {
      this.targetPitch = null;
      this.targetRoll = null;
      this.wasControlling = true;
      if (!av || !rigidBody?.setAngularVelocity) {
        return { mode: 'maneuver', controlling: true, nextAngularVelocity: null };
      }
      const multScale = Math.min(0.45, Math.log10(Math.max(1, multiplier)) * 0.08);
      const speedScale = kias > 300 ? Math.max(0.4, 300 / kias) : 1;
      const damp = clamp(1 - (0.12 + multScale) * strength * 0.5, 0.35, 0.92);
      const maxRate = clamp((3.2 / Math.max(1, Math.log10(Math.max(1, multiplier)))) / strength * speedScale, 0.35, 4.0);
      const next: [number, number, number] = [
        clamp(av[0] * damp, -maxRate, maxRate),
        clamp(av[1] * damp, -maxRate, maxRate),
        clamp(av[2] * damp, -maxRate, maxRate)
      ];
      rigidBody.setAngularVelocity(next);
      return { mode: 'maneuver', controlling: true, nextAngularVelocity: next };
    }

    if (this.wasControlling || this.targetPitch === null || this.targetRoll === null) {
      this.targetPitch = pitchDeg;
      this.targetRoll = clamp(rollDeg, -65, 65);
      this.wasControlling = false;
    }

    const pitchErr = clamp((this.targetPitch ?? pitchDeg) - pitchDeg, -25, 25);
    const rollErr = clamp((this.targetRoll ?? rollDeg) - rollDeg, -25, 25);

    if (!rigidBody?.setAngularVelocity) {
      return { mode: 'hold', controlling: false, nextAngularVelocity: null };
    }

    const residualDamp = clamp(0.06 / strength, 0.005, 0.15);
    const current = av ?? [0, 0, 0];
    if (groundContact || (Math.abs(pitchErr) < 0.15 && Math.abs(rollErr) < 0.15)) {
      const zeroed: [number, number, number] = [0, 0, 0];
      rigidBody.setAngularVelocity(zeroed);
      return { mode: 'hold', controlling: false, nextAngularVelocity: zeroed };
    }

    const corrGain = 0.014 * strength;
    const next: [number, number, number] = [
      clamp(current[0] * residualDamp + pitchErr * corrGain, -0.4, 0.4),
      clamp(current[1] * residualDamp + rollErr * corrGain, -0.4, 0.4),
      clamp(current[2] * residualDamp, -0.25, 0.25)
    ];
    rigidBody.setAngularVelocity(next);

    if (rigidBody.applyTorque) {
      const mass = Math.max(500, Number(rigidBody.mass || 2000));
      const tGain = mass * 0.08 * strength;
      rigidBody.applyTorque([
        clamp(pitchErr * tGain, -mass * 1.5, mass * 1.5),
        clamp(rollErr * tGain, -mass * 1.5, mass * 1.5),
        clamp(-current[2] * mass * 0.4, -mass * 0.8, mass * 0.8)
      ]);
    }

    return { mode: 'hold', controlling: false, nextAngularVelocity: next };
  }
}

// Both archived Overpowered Engines scripts apply their multiplier to the live engine parts.
export class EngineThrust {
  private originals = new Map<GeoFSEnginePart, ThrustValues>();

  public apply(parts: Record<string, GeoFSEnginePart> | undefined, multiplier: number): void {
    const engines = new Set(Object.values(parts ?? {}).filter((part) => Number.isFinite(part?.thrust)));
    for (const [part, original] of this.originals) {
      if (!engines.has(part)) {
        Object.assign(part, original);
        this.originals.delete(part);
      }
    }
    for (const part of engines) {
      let original = this.originals.get(part);
      if (!original) {
        original = {};
        for (const field of THRUST_FIELDS) {
          if (Number.isFinite(part[field])) original[field] = part[field];
        }
        this.originals.set(part, original);
      }
      for (const field of THRUST_FIELDS) {
        const value = original[field];
        if (value !== undefined) part[field] = value * multiplier;
      }
    }
  }

  public restore(): void {
    for (const [part, original] of this.originals) Object.assign(part, original);
    this.originals.clear();
  }
}

export class EngineCeiling {
  private original?: { definition: GeoFSAircraftDefinition; thrust: number | undefined; rpm: number | undefined };

  public apply(definition: GeoFSAircraftDefinition, feet: number): void {
    if (this.original?.definition !== definition) {
      this.restore();
      this.original = { definition, thrust: definition.zeroThrustAltitude, rpm: definition.zeroRPMAltitude };
    }
    definition.zeroThrustAltitude = feet;
    definition.zeroRPMAltitude = feet;
  }

  public restore(): void {
    if (!this.original) return;
    const { definition, thrust, rpm } = this.original;
    if (thrust === undefined) delete definition.zeroThrustAltitude;
    else definition.zeroThrustAltitude = thrust;
    if (rpm === undefined) delete definition.zeroRPMAltitude;
    else definition.zeroRPMAltitude = rpm;
    this.original = undefined;
  }
}

const THRUST_PRESETS = [1, 2, 5, 10, 50, 100, 500, 1000, 5000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
const CEILING_PRESETS = [3000000, 10000000, 100000000, 1000000000, 10000000000, 100000000000, 1000000000000];

const CARD_STYLES = `
  .geofs-ext-op-bar-btn {
    width: 65px;
    height: 25px;
    line-height: 23px;
    margin: 0 6px;
    cursor: pointer;
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    box-shadow: 0 0 5px #000000;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    padding: 0 6px;
    box-sizing: border-box;
  }
  .geofs-ext-op-bar-btn.green-pad,
  #opEngineCard .op-native-btn.green-pad {
    border-color: #4caf50 !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.45) !important;
    color: #ffffff;
  }
  #opEngineCard {
    box-sizing: border-box;
    position: fixed;
    bottom: 120px;
    left: 540px;
    width: 320px;
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
    padding: 11px 14px;
    border-bottom: 1px solid rgba(136, 136, 136, 0.45);
    background: rgba(0, 0, 0, 0.5);
    cursor: move;
  }
  #opEngineHeaderText {
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
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
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
    padding: 8px 10px;
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
    margin-bottom: 5px;
    font-size: 10px;
    color: #cccccc;
    text-transform: uppercase;
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

export class OverpoweredEnginesModule implements IModule {
  public readonly id = 'overpowered-engines';
  public readonly name = 'Overpowered Engines';
  public readonly description = 'Native GeoFS thrust multiplier, ceiling bypass, OP-SYNC policy & closed-loop SAS.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private aircraft?: GeoFSAircraftInstance;
  private thrustEnabled = false;
  private ceilingEnabled = false;
  private atEngaged = false;
  private opSyncActive = false;
  private automaticMultiplier: number | null = null;
  private sasElapsed = 0;
  private thrust = new EngineThrust();
  private ceiling = new EngineCeiling();
  private sas = new EffectiveSasController();
  private torque = new Map<GeoFSEnginePart, number>();

  private barBtn: HTMLButtonElement | null = null;
  private card: HTMLDivElement | null = null;
  private isListeningKey = false;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;

    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'geofs-ext-op-styles';
      style.textContent = CARD_STYLES;
      document.head?.appendChild(style);
      this.unmounts.push(() => style.remove());

      const barBtn = document.createElement('button');
      barBtn.type = 'button';
      barBtn.id = 'opEngineBarBtn';
      barBtn.className = 'geofs-ext-op-bar-btn';
      barBtn.textContent = 'OP ENG';
      barBtn.title = 'Toggle Overpowered Engines & SAS Card';
      barBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.card) return;
        const willOpen = this.card.style.display === 'none' || !this.card.style.display;
        this.card.style.display = willOpen ? 'block' : 'none';
        if (willOpen) {
          context.anchors.bringToFront(this.card);
          context.anchors.clampElementToViewport(this.card);
        }
      });
      this.barBtn = barBtn;
      this.unmounts.push(context.anchors.mountControl('op-engines-pad', 'autopilot', barBtn));
      this.attachToAutopilotBar();

      const card = document.createElement('div');
      card.id = 'opEngineCard';
      card.style.display = 'none';
      const settings = context.getSettings();
      card.innerHTML = `
        <div id="opEngineHeader">
          <span id="opEngineHeaderText">Overpowered Engines</span>
          <button type="button" data-role="close" style="background:none;border:none;color:#cccccc;cursor:pointer;font-size:14px;line-height:1;padding:0 2px;" aria-label="Close Overpowered Engines card">✕</button>
        </div>
        <div class="op-card-body">
          <div id="opThrustContainer">
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div class="op-btn-row">
                <div class="op-lock-wrap" style="flex:1;">
                  <div id="opThrustLockOverlay" data-role="thrust-lock-overlay" class="op-lock-overlay" title="Auto-managed by Autothrottle OP-SYNC"></div>
                  <div class="op-thrust-lock-target">
                    <button type="button" id="opThrustBtn" data-role="thrust" class="op-native-btn" style="width:100%;">ACTIVATE THRUST</button>
                  </div>
                </div>
                <button type="button" id="opSASBtn" data-role="sas" class="op-native-btn" style="width:50px;" title="Closed-Loop Stability Augmentation System">SAS</button>
              </div>
              <div class="op-lock-wrap">
                <div data-role="thrust-lock-overlay" class="op-lock-overlay" title="Auto-managed by Autothrottle OP-SYNC"></div>
                <div class="op-thrust-lock-target">
                  <div class="op-label-row">
                    <span>Thrust Multiplier</span>
                    <span><input type="number" id="opMultInput" data-role="multiplier" min="1" max="1000000000" step="any" value="${settings.opThrustMultiplier}"> x</span>
                  </div>
                  <input type="range" id="opMultSlider" data-role="mult-slider" class="op-slider" min="0" max="${THRUST_PRESETS.length - 1}" step="1" value="${this.getThrustIndex(settings.opThrustMultiplier)}">
                </div>
              </div>
            </div>
          </div>

          <div id="opCeilingContainer" class="op-lock-wrap">
            <div id="opCeilingLockOverlay" class="op-lock-overlay" title="Locked while A/THR manages flight envelope"></div>
            <div id="opCeilingSection" style="display:flex;flex-direction:column;gap:8px;">
              <button type="button" id="opCeilingBtn" data-role="ceiling" class="op-native-btn" style="width:100%;">BYPASS ATMOSPHERE</button>
              <div>
                <div class="op-label-row">
                  <span>Altitude Ceiling</span>
                  <strong id="opCeilingReadout" data-role="ceiling-readout" style="color:#ffffff;">${formatNumberCompact(settings.opCeilingFeet)} ft</strong>
                </div>
                <input type="range" id="opCeilingSlider" data-role="limit-slider" class="op-slider" min="0" max="${CEILING_PRESETS.length - 1}" step="1" value="${this.getCeilingIndex(settings.opCeilingFeet)}">
              </div>
            </div>
          </div>

          <div class="op-policy-row">
            <span style="color:#aaaaaa;text-transform:uppercase;font-weight:700;" title="Controls whether A/THR prompts or automatically engages OP Engines on large speed deltas">OP-SYNC</span>
            <div class="op-policy-pills">
              <button type="button" class="op-pill" data-opsync="ask">Ask</button>
              <button type="button" class="op-pill" data-opsync="allow">Auto</button>
              <button type="button" class="op-pill" data-opsync="never">Off</button>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <button type="button" id="opKeybindBtn" class="op-pill" title="Click to rebind Overpowered Thrust hotkey">${settings.keybindings.toggleOpEngines}</button>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:10px;">
              <div id="opStatusMsg" style="color:#aaaaaa;font-style:italic;">Hotkey toggles thrust</div>
              <div id="opSASMsg" style="color:#4caf50;display:${settings.opStability ? 'block' : 'none'};">SAS ACTIVE (Attitude Hold)</div>
            </div>
          </div>
        </div>
      `;
      document.body?.appendChild(card);
      this.card = card;

      const header = card.querySelector<HTMLElement>('#opEngineHeader') ?? card;
      this.unmounts.push(context.anchors.makeDraggable(card, 'geofs_ext_op_card_pos', header));
      this.unmounts.push(() => card.remove());

      card.querySelector('[data-role="close"]')?.addEventListener('click', () => {
        card.style.display = 'none';
      });
      card.querySelector('[data-role="thrust"]')?.addEventListener('click', () => this.toggle());
      card.querySelector('[data-role="ceiling"]')?.addEventListener('click', () => {
        if (this.atEngaged) return;
        this.ceilingEnabled = !this.ceilingEnabled;
        if (!this.ceilingEnabled) this.ceiling.restore();
        this.render();
      });
      card.querySelector('[data-role="sas"]')?.addEventListener('click', () => {
        const nextSas = !context.getSettings().opStability;
        this.sas.reset();
        context.updateSettings({ opStability: nextSas });
        context.emitEvent('overpowered:sas-state', { active: nextSas });
        context.emitDiag?.(nextSas ? 'SAS_ACTIVE' : 'SAS_DISENGAGED');
      });

      const multInput = card.querySelector<HTMLInputElement>('[data-role="multiplier"]');
      const multSlider = card.querySelector<HTMLInputElement>('[data-role="mult-slider"]');
      multInput?.addEventListener('input', () => {
        if (this.thrustEnabled || this.opSyncActive) return;
        const val = Number.parseFloat(multInput.value);
        if (Number.isFinite(val) && val >= 1) {
          context.updateSettings({ opThrustMultiplier: Math.min(1e9, val) });
          if (multSlider) multSlider.value = String(this.getThrustIndex(val));
        }
      });
      multSlider?.addEventListener('input', () => {
        if (this.thrustEnabled || this.opSyncActive) return;
        const preset = THRUST_PRESETS[Number(multSlider.value)] ?? 1;
        context.updateSettings({ opThrustMultiplier: preset });
        if (multInput) multInput.value = String(preset);
      });

      const ceilingSlider = card.querySelector<HTMLInputElement>('[data-role="limit-slider"]');
      ceilingSlider?.addEventListener('input', () => {
        if (this.ceilingEnabled || this.atEngaged) return;
        const preset = CEILING_PRESETS[Number(ceilingSlider.value)] ?? CEILING_PRESETS[0];
        context.updateSettings({ opCeilingFeet: preset });
      });

      for (const pill of card.querySelectorAll<HTMLButtonElement>('[data-opsync]')) {
        pill.addEventListener('click', () => {
          const policy = pill.dataset.opsync as OpSyncPolicy;
          context.updateSettings({ opSyncPolicy: policy });
        });
      }

      const keyBtn = card.querySelector<HTMLButtonElement>('#opKeybindBtn');
      const onRebindKey = (event: KeyboardEvent) => {
        if (!this.isListeningKey) return;
        event.preventDefault();
        event.stopPropagation();
        if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
        this.isListeningKey = false;
        document.removeEventListener('keydown', onRebindKey, true);
        const parts: string[] = [];
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.shiftKey) parts.push('Shift');
        if (event.altKey) parts.push('Alt');
        if (event.metaKey) parts.push('Meta');
        const main = event.key.length === 1 ? event.key.toUpperCase() : event.key;
        if (!parts.includes(main)) parts.push(main);
        const combo = parts.join('+');
        context.updateSettings({
          keybindings: { ...context.getSettings().keybindings, toggleOpEngines: combo }
        });
      };
      this.unmounts.push(() => document.removeEventListener('keydown', onRebindKey, true));

      keyBtn?.addEventListener('click', () => {
        if (this.isListeningKey) return;
        this.isListeningKey = true;
        keyBtn.textContent = 'PRESS KEY...';
        document.addEventListener('keydown', onRebindKey, true);
      });

      card.querySelectorAll('[data-role="thrust-lock-overlay"]').forEach((overlay) => {
        overlay.addEventListener('click', () => {
          context.anchors.showToast('OP Engines thrust is auto-managed by Autothrottle OP-SYNC.', 'warn');
        });
      });
      card.querySelector('#opCeilingLockOverlay')?.addEventListener('click', () => {
        context.anchors.showToast('OP Engines ceiling is managed while A/THR is active.', 'warn');
      });
    }

    this.render();
    this.unmounts.push(context.keybinds.register('op-toggle', context.getSettings().keybindings.toggleOpEngines, () => this.toggle()));
    this.unmounts.push(context.onEvent<{ engaged: boolean }>('autothrottle:state', (detail) => {
      this.atEngaged = detail.engaged;
      if (!this.atEngaged) {
        this.automaticMultiplier = null;
        this.opSyncActive = false;
      }
      this.render();
    }));
    this.unmounts.push(context.onEvent<{ active: boolean }>('autothrottle:opsync-state', ({ active }) => {
      this.opSyncActive = Boolean(active);
      this.render();
    }));
    this.unmounts.push(context.onEvent<{ desired: number | null; report: (multiplier: number) => void }>(
      'autothrottle:boost', ({ desired, report }) => {
        const settings = context.getSettings();
        if (desired === null) this.automaticMultiplier = null;
        else {
          const current = this.automaticMultiplier ?? settings.opThrustMultiplier ?? 1;
          this.automaticMultiplier = current + (desired - current) * 0.15;
        }
        report(this.automaticMultiplier ?? (this.thrustEnabled ? settings.opThrustMultiplier ?? 1 : 1));
      }
    ));
    context.emitEvent('overpowered:sas-state', { active: Boolean(context.getSettings().opStability) });
  }

  private attachToAutopilotBar(): void {
    if (!this.barBtn) return;
    const host = document.querySelector('.geofs-autopilot-bar');
    if (host && this.barBtn.parentElement !== host) {
      host.append(this.barBtn);
    }
  }

  private getThrustIndex(val: number): number {
    return THRUST_PRESETS.reduce(
      (prev, curr, idx) => (Math.abs(curr - val) < Math.abs(THRUST_PRESETS[prev] - val) ? idx : prev),
      0
    );
  }

  private getCeilingIndex(val: number): number {
    return CEILING_PRESETS.reduce(
      (prev, curr, idx) => (Math.abs(curr - val) < Math.abs(CEILING_PRESETS[prev] - val) ? idx : prev),
      0
    );
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('op-toggle', settings.keybindings.toggleOpEngines);
    if (!settings.opStability) {
      this.restoreTorque();
      this.sas.reset();
    }
    this.ctx?.emitEvent('overpowered:sas-state', { active: Boolean(settings.opStability) });
    this.render();
  }

  public toggle(): void {
    if (this.atEngaged && this.opSyncActive) return;
    this.thrustEnabled = !this.thrustEnabled;
    if (!this.thrustEnabled) this.thrust.restore();
    this.render();
  }

  public update(telemetry: FlightTelemetry): void {
    this.attachToAutopilotBar();
    const aircraft = window.geofs?.aircraft?.instance;
    const settings = this.ctx?.getSettings();
    if (aircraft !== this.aircraft) {
      this.restore();
      this.sas.reset();
      if (this.aircraft) {
        this.thrustEnabled = false;
        this.ceilingEnabled = false;
        this.automaticMultiplier = null;
        this.render();
      }
      this.aircraft = aircraft;
    }
    if (!aircraft || !settings || telemetry.crashed) {
      this.restore();
      return;
    }

    const automatic = this.automaticMultiplier;
    const activeMultiplier = automatic ?? (this.thrustEnabled ? settings.opThrustMultiplier ?? 1 : 1);
    if (this.thrustEnabled || automatic !== null) {
      this.thrust.apply(aircraft.parts, activeMultiplier);
    } else {
      this.thrust.restore();
    }
    if ((this.ceilingEnabled || automatic !== null) && aircraft.definition) {
      this.ceiling.apply(aircraft.definition, settings.opCeilingFeet ?? CEILING_PRESETS[0]);
    } else {
      this.ceiling.restore();
    }

    if (settings.opStability && !telemetry.paused) {
      const parts = new Set(Object.values(aircraft.parts ?? {}));
      for (const [part, original] of this.torque) {
        if (!parts.has(part)) {
          part.torque = original;
          this.torque.delete(part);
        }
      }
      for (const part of parts) {
        if (typeof part?.torque !== 'number') continue;
        if (!this.torque.has(part)) this.torque.set(part, part.torque);
        part.torque = 0;
      }
      this.sasElapsed += telemetry.dt;
      if (this.sasElapsed >= 0.02) {
        this.sasElapsed %= 0.02;
        this.sas.step({
          rigidBody: aircraft.rigidBody,
          controls: window.controls,
          pitchDeg: telemetry.pitch,
          rollDeg: telemetry.roll,
          kias: telemetry.kias,
          multiplier: activeMultiplier,
          sasStrength: settings.sasStrength ?? 1.0,
          groundContact: telemetry.groundContact
        });
      }
    }
  }

  private render(): void {
    const settings = this.ctx?.getSettings();
    if (!settings) return;

    if (this.barBtn) {
      this.barBtn.classList.toggle('green-pad', this.thrustEnabled || this.opSyncActive || Boolean(settings.opStability));
      this.barBtn.setAttribute('aria-pressed', String(this.thrustEnabled || this.opSyncActive));
    }

    const card = this.card;
    if (!card) return;

    const lockThrust = this.opSyncActive;
    const lockCeiling = this.atEngaged || this.opSyncActive;

    const headerText = card.querySelector<HTMLElement>('#opEngineHeaderText');
    if (headerText) {
      headerText.textContent = lockThrust ? 'OP ENGINES [AUTO-MANAGED BY A/THR]' : 'Overpowered Engines';
      headerText.style.color = lockThrust ? '#a855f7' : '#ffffff';
    }

    card.querySelectorAll<HTMLElement>('.op-thrust-lock-target').forEach((section) => {
      section.style.opacity = lockThrust ? '0.45' : '1';
      section.style.pointerEvents = lockThrust ? 'none' : 'auto';
    });
    card.querySelectorAll<HTMLElement>('[data-role="thrust-lock-overlay"]').forEach((overlay) => {
      overlay.style.display = lockThrust ? 'block' : 'none';
    });

    const ceilingSection = card.querySelector<HTMLElement>('#opCeilingSection');
    const ceilingOverlay = card.querySelector<HTMLElement>('#opCeilingLockOverlay');
    if (ceilingSection) {
      ceilingSection.style.opacity = lockCeiling ? '0.45' : '1';
      ceilingSection.style.pointerEvents = lockCeiling ? 'none' : 'auto';
    }
    if (ceilingOverlay) ceilingOverlay.style.display = lockCeiling ? 'block' : 'none';

    const thrustBtn = card.querySelector<HTMLButtonElement>('[data-role="thrust"]');
    if (thrustBtn) {
      thrustBtn.textContent = this.thrustEnabled || lockThrust ? 'THRUST: ACTIVE' : 'ACTIVATE THRUST';
      thrustBtn.classList.toggle('green-pad', this.thrustEnabled || lockThrust);
      thrustBtn.disabled = lockThrust;
    }

    const sasBtn = card.querySelector<HTMLButtonElement>('[data-role="sas"]');
    if (sasBtn) {
      sasBtn.classList.toggle('green-pad', Boolean(settings.opStability));
      sasBtn.setAttribute('aria-pressed', String(Boolean(settings.opStability)));
    }

    const ceilingBtn = card.querySelector<HTMLButtonElement>('[data-role="ceiling"]');
    if (ceilingBtn) {
      ceilingBtn.textContent = this.ceilingEnabled || this.opSyncActive ? 'CEILING: BYPASSED' : 'BYPASS ATMOSPHERE';
      ceilingBtn.classList.toggle('green-pad', this.ceilingEnabled || this.opSyncActive);
    }

    const multVal = this.automaticMultiplier ?? settings.opThrustMultiplier ?? 1;
    const multInput = card.querySelector<HTMLInputElement>('[data-role="multiplier"]');
    if (multInput && (typeof document === 'undefined' || document.activeElement !== multInput)) {
      multInput.value = this.automaticMultiplier !== null ? multVal.toFixed(1) : String(multVal);
      multInput.disabled = this.thrustEnabled || lockThrust;
    }
    const multSlider = card.querySelector<HTMLInputElement>('[data-role="mult-slider"]');
    if (multSlider) {
      multSlider.value = String(this.getThrustIndex(multVal));
      multSlider.disabled = this.thrustEnabled || lockThrust;
    }

    const ceilingVal = settings.opCeilingFeet ?? CEILING_PRESETS[0];
    const ceilingReadout = card.querySelector<HTMLElement>('[data-role="ceiling-readout"]');
    if (ceilingReadout) ceilingReadout.textContent = `${formatNumberCompact(ceilingVal)} ft`;
    const ceilingSlider = card.querySelector<HTMLInputElement>('[data-role="limit-slider"]');
    if (ceilingSlider) {
      ceilingSlider.value = String(this.getCeilingIndex(ceilingVal));
      ceilingSlider.disabled = this.ceilingEnabled || lockCeiling;
    }

    for (const pill of card.querySelectorAll<HTMLButtonElement>('[data-opsync]')) {
      const selected = (settings.opSyncPolicy ?? 'ask') === pill.dataset.opsync;
      pill.classList.toggle('is-active', selected);
      pill.setAttribute('aria-pressed', String(selected));
    }

    const keyBtn = card.querySelector<HTMLButtonElement>('#opKeybindBtn');
    if (keyBtn && !this.isListeningKey) {
      keyBtn.textContent = settings.keybindings.toggleOpEngines;
    }
    const sasMsg = card.querySelector<HTMLElement>('#opSASMsg');
    if (sasMsg) sasMsg.style.display = settings.opStability ? 'block' : 'none';
  }

  private restoreTorque(): void {
    for (const [part, original] of this.torque) part.torque = original;
    this.torque.clear();
    this.sasElapsed = 0;
  }

  private restore(): void {
    this.thrust.restore();
    this.ceiling.restore();
    this.restoreTorque();
  }

  public destroy(): void {
    this.restore();
    this.sas.reset();
    this.aircraft = undefined;
    this.thrustEnabled = false;
    this.ceilingEnabled = false;
    this.atEngaged = false;
    this.opSyncActive = false;
    this.automaticMultiplier = null;
    this.isListeningKey = false;
    for (const unmount of this.unmounts) unmount();
    this.unmounts = [];
    this.barBtn = null;
    this.card = null;
    this.ctx = null;
  }
}
