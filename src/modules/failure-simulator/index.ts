import type { GeoFSAircraftInstance } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';
import { createFailureEffect, pinValue, type FailureEffect } from './effects';
import {
  SYSTEMS,
  SYSTEM_DESCRIPTIONS,
  SYSTEM_GROUPS,
  computeRecoverySuccess,
  contingencyProcedure,
  emergencyProcedure,
  isFailureRecoverable,
  label,
  recoverabilityMultiplier,
  type FailureType,
  type System
} from './procedures';
import { FAILURE_STYLES } from './styles';

export {
  computeRecoverySuccess,
  contingencyProcedure,
  emergencyProcedure,
  isFailureRecoverable,
  pinValue,
  recoverabilityMultiplier,
  type FailureType
};

export class FailureSimulatorModule implements IModule {
  public readonly id = 'failure-simulator';
  public readonly name = 'Failure Simulator';
  public readonly description = 'Draggable modal failures with probability rolls, emergency QRH overrides, and verified recovery.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private aircraft: GeoFSAircraftInstance | undefined;
  private active = new Map<FailureType, FailureEffect>();
  private chances = new Map<FailureType, number>();
  private collapsedSections = new Set<string>();
  private nextProbabilityMs = 0;

  private pill: HTMLButtonElement | null = null;
  private modal: HTMLDivElement | null = null;
  private bodyEl: HTMLDivElement | null = null;
  private probBtn: HTMLButtonElement | null = null;
  private probInfoEl: HTMLElement | null = null;
  private styleEl: HTMLStyleElement | null = null;

  private restoreWeather?: () => void;
  private lastAltitude = 0;
  private lastTimestamp = 0;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;
    const savedChances = context.getSettings().failureSystemChances ?? {};
    for (const [k, v] of Object.entries(savedChances)) {
      if (typeof v === 'number' && Number.isFinite(v)) {
        this.chances.set(k as FailureType, Math.max(0, Math.min(1, v)));
      }
    }

    this.unmounts.push(
      context.onEvent('failure:request-active', () => {
        for (const type of this.active.keys()) this.emitFailure(type);
      })
    );
    this.unmounts.push(
      context.onEvent<{ type: FailureType }>('failure:attempt-recovery', ({ type }) => {
        this.attemptRecovery(type);
      })
    );

    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'geofs-ext-failure-styles';
      style.textContent = FAILURE_STYLES;
      document.head?.appendChild(style);
      this.styleEl = style;

      const pill = document.createElement('button');
      pill.type = 'button';
      pill.id = 'fail-btn';
      pill.className = 'geofs-ext-fail-pill';
      pill.textContent = 'FAILURES';
      pill.title = 'Open Failure Simulator Modal (Drag to move)';
      document.body?.appendChild(pill);
      this.pill = pill;
      this.unmounts.push(context.anchors.makeDraggable(pill, 'geofs_ext_fail_pill_pos', pill));
      this.unmounts.push(() => pill.remove());

      const setModalOpen = (open: boolean) => {
        modal.style.display = open ? 'flex' : 'none';
        try {
          localStorage.setItem('geofs_ext_fail_modal_open', open ? '1' : '0');
        } catch {
          // ignore storage errors
        }
        if (open) {
          this.render();
          context.anchors.bringToFront(modal);
          context.anchors.clampElementToViewport(modal);
        }
      };

      pill.addEventListener('click', () => {
        if (pill.dataset.justDragged === '1' || !this.modal) return;
        const willOpen = this.modal.style.display === 'none' || !this.modal.style.display;
        setModalOpen(willOpen);
      });

      const modal = document.createElement('div');
      modal.id = 'geofs-failure-menu';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div id="fail-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(0,0,0,0.5);border-bottom:1px solid rgba(136,136,136,0.45);border-radius:15px 15px 0 0;cursor:grab;user-select:none;touch-action:none;">
          <span style="font-weight:700;font-size:11px;letter-spacing:0.6px;color:#ffffff;">FAILURE SIMULATOR</span>
          <button type="button" data-role="close" style="background:none;border:none;color:#cccccc;cursor:pointer;font-size:14px;line-height:1;padding:0 2px;">✕</button>
        </div>
        <div style="padding:8px 12px;border-bottom:1px solid rgba(136,136,136,0.3);display:flex;flex-direction:column;gap:6px;">
          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;">
            <button type="button" id="enBtn" class="geofs-ext-fail-btn geofs-ext-fail-btn--ok" style="padding:6px 8px;font-size:9.5px;">ENABLE PROBABILITY</button>
            <button type="button" data-role="clear-all" class="geofs-ext-fail-btn geofs-ext-fail-btn--danger" style="padding:6px 8px;font-size:9.5px;">CLEAR ALL FAILURES</button>
          </div>
          <div data-role="prob-info" style="font-size:9.5px;color:#aaaaaa;display:flex;justify-content:space-between;white-space:nowrap;">
            <span>Probability rolls off</span>
            <span>Recovery: 60%</span>
          </div>
        </div>
        <div data-role="sections" style="padding:8px 12px;display:flex;flex-direction:column;gap:6px;overflow:visible;"></div>
      `;
      document.body?.appendChild(modal);
      this.modal = modal;
      this.bodyEl = modal.querySelector('[data-role="sections"]');
      this.probBtn = modal.querySelector('#enBtn');
      this.probInfoEl = modal.querySelector('[data-role="prob-info"]');

      const header = modal.querySelector<HTMLElement>('#fail-header') ?? modal;
      this.unmounts.push(context.anchors.makeDraggable(modal, 'geofs_ext_fail_modal_pos', header));
      this.unmounts.push(() => modal.remove());

      modal.querySelector('[data-role="close"]')?.addEventListener('click', () => {
        setModalOpen(false);
      });
      try {
        if (localStorage.getItem('geofs_ext_fail_modal_open') === '1') {
          setModalOpen(true);
        }
      } catch {
        // ignore storage errors
      }
      modal.querySelector('[data-role="clear-all"]')?.addEventListener('click', () => this.clear());
      this.probBtn?.addEventListener('click', () => {
        context.updateSettings({ failureProbabilitiesEnabled: !context.getSettings().failureProbabilitiesEnabled });
      });
    }

    this.aircraft = window.geofs?.aircraft?.instance;
    this.syncProbabilityUi(context.getSettings());
    this.render();
  }

  private updatePillBadge(): void {
    if (!this.pill) return;
    const count = this.active.size;
    this.pill.textContent = count > 0 ? `FAILURES (${count})` : 'FAILURES';
    this.pill.classList.toggle('has-failures', count > 0);
  }

  private syncProbabilityUi(settings: ExtensionSettings): void {
    if (this.probBtn) {
      const enabled = Boolean(settings.failureProbabilitiesEnabled);
      this.probBtn.textContent = enabled ? 'DISABLE PROBABILITY' : 'ENABLE PROBABILITY';
      this.probBtn.className = `geofs-ext-fail-btn ${enabled ? 'geofs-ext-fail-btn--danger' : 'geofs-ext-fail-btn--ok'}`;
      this.probBtn.setAttribute('aria-pressed', String(enabled));
    }
    if (this.probInfoEl) {
      const intervalSec = Math.max(10, settings.failureProbabilityIntervalSec || 60);
      const remSec =
        settings.failureProbabilitiesEnabled && this.nextProbabilityMs > this.lastTimestamp
          ? Math.ceil((this.nextProbabilityMs - this.lastTimestamp) / 1000)
          : intervalSec;
      const statusText = settings.failureProbabilitiesEnabled
        ? `Roll every ${intervalSec}s · Next: ${remSec}s`
        : `Probability off (${intervalSec}s cycle)`;
      this.probInfoEl.innerHTML = `<span>${statusText}</span><span>Recovery: ${settings.failureRecoveryChancePct ?? 60}%</span>`;
    }
  }

  private persistChances(): void {
    const obj: Record<string, number> = {};
    for (const [k, v] of this.chances.entries()) {
      if (v > 0) obj[k] = Number(v.toFixed(3));
    }
    this.ctx?.updateSettings({ failureSystemChances: obj });
  }

  private render(): void {
    this.updatePillBadge();
    if (!this.bodyEl) return;

    const engines = this.aircraft?.engines?.length ?? (this.aircraft?.engine ? 1 : 0);
    const engineTypes = Array.from({ length: engines }, (_, index): FailureType => `engine${index}`);
    const groups: ReadonlyArray<readonly [string, string, readonly FailureType[]]> = [
      ...SYSTEM_GROUPS,
      ['eng', 'Engines', engineTypes]
    ];

    this.bodyEl.replaceChildren(
      ...groups
        .filter(([, , types]) => types.length > 0)
        .map(([groupId, title, types]) => {
          const wrap = document.createElement('div');
          const collapsed = this.collapsedSections.has(groupId);

          const sectHeader = document.createElement('div');
          sectHeader.style.cssText =
            'display:flex;justify-content:space-between;align-items:center;padding:5px 9px;background:rgba(255,255,255,0.06);border:1px solid rgba(136,136,136,0.3);border-radius:10px;cursor:pointer;';

          const left = document.createElement('div');
          left.style.cssText = 'display:flex;align-items:center;gap:6px;';
          const arrow = document.createElement('span');
          arrow.style.cssText = `font-size:9px;transition:transform 0.15s;transform:${collapsed ? 'rotate(0deg)' : 'rotate(90deg)'};`;
          arrow.textContent = '▶';
          const heading = document.createElement('span');
          heading.style.cssText = 'font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;';
          heading.textContent = title;
          left.append(arrow, heading);

          const groupActions = document.createElement('div');
          groupActions.style.cssText = 'display:flex;gap:4px;';
          for (const action of ['AUTO', 'FAIL', 'FIX'] as const) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `geofs-ext-fail-btn ${
              action === 'FAIL' ? 'geofs-ext-fail-btn--danger' : action === 'FIX' ? 'geofs-ext-fail-btn--ok' : ''
            }`;
            btn.textContent = action;
            btn.setAttribute('aria-label', `${action} ${title}`);
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              for (const type of types) {
                if (action === 'AUTO') {
                  this.chances.set(type, Number((Math.random() * (groupId === 'adv' ? 0.05 : 0.1)).toFixed(2)));
                } else if (action === 'FAIL') {
                  this.fail(type, false);
                } else if (this.active.has(type)) {
                  this.fix(type);
                }
              }
              if (action === 'AUTO') this.persistChances();
              this.render();
            });
            groupActions.appendChild(btn);
          }

          sectHeader.append(left, groupActions);
          sectHeader.addEventListener('click', () => {
            if (this.collapsedSections.has(groupId)) this.collapsedSections.delete(groupId);
            else this.collapsedSections.add(groupId);
            this.render();
          });

          const n = types.length;
          const cols = n <= 1 ? 1 : n === 2 || n === 4 ? 2 : 3;
          const content = document.createElement('div');
          content.dataset.sectionGridCols = String(cols);
          content.style.cssText = `display:${collapsed ? 'none' : 'grid'};grid-template-columns:repeat(${cols},minmax(0,1fr));gap:5px;padding-top:5px;`;
          for (const type of types) {
            content.appendChild(this.systemRow(type));
          }

          wrap.append(sectHeader, content);
          return wrap;
        })
    );
  }

  private systemRow(type: FailureType): HTMLElement {
    const failed = this.active.has(type);
    const chancePct = Math.round((this.chances.get(type) ?? 0) * 100);
    const description = type.startsWith('engine')
      ? 'Thrust loss and heavy smoke. Expect yaw asymmetry and reduced climb performance.'
      : SYSTEM_DESCRIPTIONS[type as System];

    const card = document.createElement('div');
    card.dataset.failureType = type;
    card.title = description;
    card.style.cssText = 'min-width:0;padding:6px 7px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.28);border-radius:10px;display:flex;flex-direction:column;gap:4px;';

    const top = document.createElement('div');
    top.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:4px;min-width:0;';
    const titleWrap = document.createElement('div');
    titleWrap.style.cssText = 'display:flex;align-items:center;gap:5px;flex:1;min-width:0;';
    const led = document.createElement('div');
    led.id = `led-${type}`;
    led.className = `geofs-ext-fail-led ${failed ? 'is-failed' : ''}`;
    const nameSpan = document.createElement('span');
    nameSpan.style.cssText = 'font-size:10px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    nameSpan.textContent = label(type);
    titleWrap.append(led, nameSpan);

    const valSpan = document.createElement('span');
    valSpan.style.cssText = 'font-size:9px;color:#aaaaaa;flex-shrink:0;';
    valSpan.textContent = `${chancePct}%`;
    top.append(titleWrap, valSpan);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.step = '1';
    slider.value = String(chancePct);
    slider.style.cssText = 'width:100%;height:4px;margin:0;accent-color:#4caf50;cursor:pointer;';
    slider.setAttribute('aria-label', `${label(type)} probability percentage`);
    slider.addEventListener('input', () => {
      valSpan.textContent = `${slider.value}%`;
      this.chances.set(type, Math.max(0, Math.min(100, Number(slider.value) || 0)) / 100);
    });
    slider.addEventListener('change', () => this.persistChances());

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:3px;';

    const failBtn = document.createElement('button');
    failBtn.type = 'button';
    failBtn.dataset.action = 'fail';
    failBtn.className = 'geofs-ext-fail-btn geofs-ext-fail-btn--danger';
    failBtn.style.cssText = 'flex:1;min-width:0;padding:3px 2px;font-size:8.5px;';
    failBtn.textContent = 'FAIL';
    failBtn.disabled = failed;
    failBtn.addEventListener('click', () => this.fail(type));

    const recoverBtn = document.createElement('button');
    recoverBtn.type = 'button';
    recoverBtn.dataset.action = 'recover';
    recoverBtn.className = 'geofs-ext-fail-btn geofs-ext-fail-btn--warn';
    recoverBtn.style.cssText = 'flex:1;min-width:0;padding:3px 2px;font-size:8.5px;';
    recoverBtn.textContent = 'REC';
    recoverBtn.disabled = !failed || !isFailureRecoverable(type);
    recoverBtn.title = isFailureRecoverable(type)
      ? 'Roll probability recovery via QRH procedure'
      : 'Permanent airframe damage cannot be repaired in flight';
    recoverBtn.addEventListener('click', () => this.attemptRecovery(type));

    const fixBtn = document.createElement('button');
    fixBtn.type = 'button';
    fixBtn.dataset.action = 'fix';
    fixBtn.className = 'geofs-ext-fail-btn geofs-ext-fail-btn--ok';
    fixBtn.style.cssText = 'flex:1;min-width:0;padding:3px 2px;font-size:8.5px;';
    fixBtn.textContent = 'FIX';
    fixBtn.disabled = !failed;
    fixBtn.addEventListener('click', () => {
      this.fix(type);
      this.render();
    });

    actions.append(failBtn, recoverBtn, fixBtn);
    card.append(top, slider, actions);
    return card;
  }

  private effect(type: FailureType, aircraft: GeoFSAircraftInstance): FailureEffect | undefined {
    return createFailureEffect(type, aircraft, {
      stopEngines: () => this.ctx?.sim.stopEngines() ?? false,
      ensureWeatherRestore: (restore) => {
        this.restoreWeather ??= restore;
      },
      applyWeather: () => this.applyWeather()
    });
  }

  private applyWeather(): void {
    const weather = window.weather?.definition;
    if (weather && this.active.has('structural')) weather.turbulences = 3;
    else if (weather && this.active.has('pressurization')) {
      weather.turbulences = Math.max(0, (this.lastAltitude - 9000) / 5000);
    } else {
      this.restoreWeather?.();
      this.restoreWeather = undefined;
    }
  }

  private emitFailure(type: FailureType): void {
    this.ctx?.emitEvent('failure:triggered', {
      type,
      procedure: emergencyProcedure(type),
      recoverable: isFailureRecoverable(type)
    });
  }

  public attemptRecovery(type: FailureType, forcedRoll?: number): boolean {
    if (!this.active.has(type) || !this.ctx) return false;
    const recoveryPct = this.ctx.getSettings().failureRecoveryChancePct ?? 60;
    const roll = forcedRoll ?? Math.random();
    const ok = computeRecoverySuccess(type, recoveryPct, roll);

    if (ok) {
      const verified = this.fix(type);
      if (verified) {
        this.ctx.anchors.showToast(`${label(type)} RECOVERED & RESTORED`, 'info');
        this.render();
        return true;
      }
    }

    this.ctx.emitDiag?.('RECOVERY_FAILED', { type });
    this.ctx.anchors.showToast(`${label(type)} recovery failed — Contingency checklist loaded`, 'critical');
    this.ctx.emitEvent('failure:contingency', {
      type,
      procedure: contingencyProcedure(type)
    });
    this.render();
    return false;
  }

  private fail(type: FailureType, render = true): void {
    if (!this.aircraft || this.aircraft.crashed || this.active.has(type)) return;
    const effect = this.effect(type, this.aircraft);
    if (!effect) {
      this.ctx?.emitDiag?.('FAILURE_SYSTEM_ERROR', {
        level: 'error',
        type,
        system: label(type),
        reason: 'Target control surface or system missing on current aircraft'
      });
      return;
    }
    this.active.set(type, effect);
    if (type !== 'fuelLeak') effect.apply();
    this.ctx?.audio.playGpwsAlert();
    this.ctx?.anchors.showToast(`${label(type)} failure`, 'critical');
    this.ctx?.emitDiag?.('FAILURE_TRIGGERED', { type });
    this.emitFailure(type);
    if (render) this.render();
  }

  private fix(type: FailureType): boolean {
    const effect = this.active.get(type);
    if (!effect) return false;
    this.active.delete(type);
    effect.restore();
    const verified = effect.verifyRestored ? effect.verifyRestored() : true;
    this.ctx?.emitDiag?.('RESTORE_VERIFIED', { type, verified });
    this.ctx?.emitEvent('failure:cleared', { type });
    return verified;
  }

  private clear(): void {
    for (const type of [...this.active.keys()].reverse()) this.fix(type);
    this.render();
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.syncProbabilityUi(settings);
  }

  public update(telemetry: FlightTelemetry): void {
    const aircraft = window.geofs?.aircraft?.instance;
    if (aircraft !== this.aircraft) {
      this.clear();
      this.aircraft = aircraft;
      this.render();
    }
    if (telemetry.paused || telemetry.crashed || !this.ctx) return;

    this.lastAltitude = telemetry.altitude;
    this.lastTimestamp = telemetry.timestamp;

    for (const effect of this.active.values()) {
      if (telemetry.timestamp >= effect.dueAt) {
        effect.apply(telemetry);
        effect.dueAt = telemetry.timestamp + effect.intervalMs;
      }
    }

    const settings = this.ctx.getSettings();
    const intervalMs = Math.max(10_000, (settings.failureProbabilityIntervalSec || 60) * 1000);
    if (!settings.failureProbabilitiesEnabled) {
      this.nextProbabilityMs = 0;
    } else if (this.nextProbabilityMs === 0) {
      this.nextProbabilityMs = telemetry.timestamp + intervalMs;
    } else if (telemetry.timestamp >= this.nextProbabilityMs) {
      this.nextProbabilityMs = telemetry.timestamp + intervalMs;
      for (const [type, chance] of this.chances) {
        if (chance > 0 && Math.random() < chance) this.fail(type);
      }
    }
    if (this.modal && this.modal.style.display !== 'none') {
      this.syncProbabilityUi(settings);
    }
  }

  public destroy(): void {
    this.clear();
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.styleEl?.remove();
    this.styleEl = null;
    this.pill = null;
    this.modal = null;
    this.bodyEl = null;
    this.probBtn = null;
    this.probInfoEl = null;
    this.aircraft = undefined;
    this.ctx = null;
    this.nextProbabilityMs = 0;
  }
}
