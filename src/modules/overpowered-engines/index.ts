import type { GeoFSAircraftInstance, GeoFSEnginePart } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings, OpSyncPolicy } from '../../types/settings';
import {
  EffectiveSasController,
  EngineCeiling,
  EngineThrust,
  clamp,
  formatNumberCompact,
  readPilotControls,
  type PilotControlsSample
} from './controllers';
import { CARD_STYLES, CEILING_PRESETS, THRUST_PRESETS } from './styles';

export {
  EffectiveSasController,
  EngineCeiling,
  EngineThrust,
  formatNumberCompact,
  readPilotControls,
  type PilotControlsSample
};

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
  private apPpEngaged = false;
  private opSyncActive = false;
  private automaticMultiplier: number | null = null;
  private sasElapsed = 0;
  private thrust = new EngineThrust();
  private ceiling = new EngineCeiling();
  private sas = new EffectiveSasController();
  private torque = new Map<GeoFSEnginePart, number>();

  private barBtn: HTMLElement | null = null;
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

      const barBtn = document.createElement('div');
      barBtn.id = 'opEngineBarBtn';
      barBtn.className = 'control-pad geofs-ext-op-bar-btn';
      barBtn.setAttribute('role', 'button');
      barBtn.tabIndex = 0;
      barBtn.innerHTML = '<div class="control-pad-label transp-pad">OP ENG</div>';
      barBtn.title = 'Toggle Overpowered Engines & SAS Card';
      barBtn.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        if (!e.repeat) barBtn.click();
      });
      barBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.card) return;
        const willOpen = this.card.style.display === 'none' || !this.card.style.display;
        this.card.style.display = willOpen ? 'block' : 'none';
        try {
          localStorage.setItem('geofs_ext_op_card_open', willOpen ? '1' : '0');
        } catch {
          // ignore storage errors
        }
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
                    <span style="white-space:nowrap;flex-shrink:0;"><input type="number" id="opMultInput" data-role="multiplier" min="1" max="1000000000" step="any" value="${settings.opThrustMultiplier}"> x</span>
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

          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0;">
            <button type="button" id="opKeybindBtn" class="op-pill" style="flex-shrink:0;" title="Click to rebind Overpowered Thrust hotkey">${settings.keybindings.toggleOpEngines}</button>
            <div style="flex:1;min-width:0;text-align:right;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              <span id="opStatusMsg" style="color:#aaaaaa;font-style:italic;display:${settings.opStability ? 'none' : 'inline'};">Hotkey toggles thrust</span>
              <span id="opSASMsg" style="color:#4caf50;font-weight:700;display:${settings.opStability ? 'inline' : 'none'};">SAS ACTIVE (Attitude Hold)</span>
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
        try {
          localStorage.setItem('geofs_ext_op_card_open', '0');
        } catch {
          // ignore storage errors
        }
      });
      try {
        if (localStorage.getItem('geofs_ext_op_card_open') === '1') {
          card.style.display = 'block';
          context.anchors.bringToFront(card);
          context.anchors.clampElementToViewport(card);
        }
      } catch {
        // ignore storage errors
      }
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
    this.unmounts.push(context.onEvent<{ engaged?: boolean }>('autopilot-pp:state', (detail) => {
      this.apPpEngaged = Boolean(detail?.engaged);
      if (this.apPpEngaged) this.sas.reset();
    }));
    this.unmounts.push(context.onEvent<{ desired: number | null; report: (multiplier: number) => void }>(
      'autothrottle:boost', ({ desired, report }) => {
        const settings = context.getSettings();
        if (desired === null || !Number.isFinite(desired) || desired <= 0) {
          this.automaticMultiplier = null;
        } else {
          const baseMultiplier = this.thrustEnabled ? (settings.opThrustMultiplier ?? 1) : 1;
          const rawCurrent = this.automaticMultiplier ?? baseMultiplier;
          const current = Number.isFinite(rawCurrent) && rawCurrent >= 1 ? rawCurrent : 1;
          const clampedDesired = clamp(desired, 1, 250);
          const next = clamp(current + (clampedDesired - current) * 0.15, 1, 250);
          this.automaticMultiplier = Number.isFinite(next) && next >= 1 ? next : 1;
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
    this.ctx?.anchors.syncAutopilotPad(this.barBtn);
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
          groundContact: telemetry.groundContact,
          autopilotOn: telemetry.autopilotOn || this.apPpEngaged
        });
      }
    }
  }

  private render(): void {
    const settings = this.ctx?.getSettings();
    if (!settings) return;

    if (this.barBtn) {
      const isActive = this.thrustEnabled || this.opSyncActive || Boolean(settings.opStability);
      const isOpen = Boolean(this.card && this.card.style.display !== 'none' && this.card.style.display !== '');
      this.barBtn.classList.toggle('green-pad', isActive);
      this.barBtn.classList.toggle('is-open', !isActive && isOpen);
      this.barBtn.setAttribute('aria-pressed', String(this.thrustEnabled || this.opSyncActive));
      this.barBtn.setAttribute('aria-expanded', String(isOpen));
    }

    const card = this.card;
    if (!card) return;

    const lockThrust = this.opSyncActive;
    const lockCeiling = this.atEngaged || this.opSyncActive;

    const headerText = card.querySelector<HTMLElement>('#opEngineHeaderText');
    if (headerText) {
      headerText.textContent = lockThrust ? 'OP ENG [AUTO-MANAGED BY A/THR]' : 'Overpowered Engines';
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
    const statusMsg = card.querySelector<HTMLElement>('#opStatusMsg');
    if (statusMsg) statusMsg.style.display = settings.opStability ? 'none' : 'inline';
    const sasMsg = card.querySelector<HTMLElement>('#opSASMsg');
    if (sasMsg) sasMsg.style.display = settings.opStability ? 'inline' : 'none';
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
