import { hasAircraftCallouts } from '../realism-pack/aircraft-sounds';
import { landingFeedback } from './feedback';
import { LandingReplay } from '../../core/landing-replay';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { LandingRecord } from '../../types/settings';

export function rateLanding(vsFpm: number): LandingRecord['rating'] {
  const sink = Math.abs(vsFpm);
  if (sink < 80) return 'Butter';
  if (sink < 160) return 'Silky';
  if (sink < 300) return 'Great';
  if (sink < 500) return 'Firm';
  if (sink < 800) return 'Hard';
  if (sink < 1100) return 'Bone Shaker';
  return 'Crash';
}

export function scoreLanding(sink: number, gForce: number, roll: number, bounces: number, inZone: boolean): number {
  const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));
  const penalties = clamp((Math.abs(sink) - 50) / 70, 5) + clamp(Math.abs(gForce - 1) * 2, 2) +
    Math.min(bounces * 2, 6) + clamp(Math.abs(roll) / 10, 1.5) + (inZone ? 0 : 1);
  return clamp(10 - penalties, 10);
}

function isInTouchdownZone(): boolean {
  const geofs = window.geofs;
  const location = geofs?.aircraft?.instance?.llaLocation;
  if (!location || !geofs?.runways?.getNearestRunway || !geofs.utils?.distanceBetweenLocations) return false;
  try {
    const runway = geofs.runways.getNearestRunway(location);
    if (!runway?.aimingPointLla1 || !runway.aimingPointLla2) return false;
    return Math.min(
      geofs.utils.distanceBetweenLocations(location, runway.aimingPointLla1),
      geofs.utils.distanceBetweenLocations(location, runway.aimingPointLla2)
    ) < 600;
  } catch {
    return false;
  }
}

function badgeClassFor(rating: LandingRecord['rating']): string {
  if (rating === 'Butter' || rating === 'Silky') return 'badge-butter';
  if (rating === 'Great' || rating === 'Smooth' || rating === 'Firm') return 'badge-acceptable';
  if (rating === 'Crash') return 'badge-crash';
  return 'badge-hard';
}

function feedbackBorderColor(record: LandingRecord): string {
  const sink = Math.abs(record.vsFpm);
  const bounces = record.bounces ?? 0;
  if (record.rating === 'Crash' || sink >= 800 || bounces >= 3) return '#7f1d1d';
  if (sink >= 500 || bounces === 2) return '#ef4444';
  if (sink >= 300 || bounces === 1) return '#eab308';
  if (sink < 160) return '#22c55e';
  return '#84cc16';
}

export class LandingStatisticsModule implements IModule {
  public readonly id = 'landing-statistics';
  public readonly name = 'Landing Statistics';
  public readonly description = 'Slide-in touchdown score card, GPWS callouts, rating badges, and Chrome logbook sync.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private wasAirborne = false;
  private aircraftId: string | null = null;
  private replay = new LandingReplay();
  private reportTimer: ReturnType<typeof setTimeout> | undefined;
  private report: HTMLElement | null = null;
  private reportDragCleanup: (() => void) | null = null;
  private reportOpen = false;
  private reportDuration: number | null = null;
  private lastGroundHeight: { feet: number; time: number } | undefined;
  private calibratedVsFpm: number | undefined;
  private lastApproach: FlightTelemetry | null = null;
  private bounces = 0;
  private inTouchdownZone = false;
  private gpwsFired = new Set<number>();
  private sessionRecords: LandingRecord[] = [];
  private sounds: Record<'soft' | 'hard' | 'crash', HTMLAudioElement> | undefined;
  private listEl: HTMLDivElement | null = null;
  private timerCheckboxEl: HTMLInputElement | null = null;
  private secondsInputEl: HTMLInputElement | null = null;
  private unmountTab: (() => void) | null = null;
  private styleEl: HTMLStyleElement | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.injectStyles();
    if (typeof document === 'undefined') return;

    const root = document.createElement('div');
    root.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:10px;';

    const timer = document.createElement('input');
    timer.type = 'checkbox';
    timer.checked = context.getSettings().landingReportAutoClose ?? true;
    timer.addEventListener('change', () => context.updateSettings({ landingReportAutoClose: timer.checked }));
    this.timerCheckboxEl = timer;

    const timerLabel = document.createElement('label');
    timerLabel.style.cssText = 'display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap;';
    timerLabel.append(timer, ' Auto-close');

    const rightBox = document.createElement('div');
    rightBox.style.cssText = 'display:flex;align-items:center;gap:3px;white-space:nowrap;';
    const seconds = document.createElement('input');
    seconds.type = 'number';
    seconds.min = '1';
    seconds.max = '3600';
    seconds.value = String(context.getSettings().landingReportSeconds ?? 15);
    seconds.style.cssText = 'width:44px;background:#000;color:#fff;border:1px solid #888;border-radius:6px;padding:1px 4px;font-size:10px;';
    seconds.setAttribute('aria-label', 'Landing report duration in seconds');
    seconds.addEventListener('change', () => {
      const duration = Math.max(1, Math.min(3600, seconds.valueAsNumber || 15));
      seconds.value = String(duration);
      context.updateSettings({ landingReportSeconds: duration });
    });
    this.secondsInputEl = seconds;
    const sSuffix = document.createElement('span');
    sSuffix.textContent = 's';
    rightBox.append(seconds, sSuffix);

    controls.append(timerLabel, rightBox);

    const header = document.createElement('div');
    header.style.cssText = 'font-weight:700;font-size:11px;letter-spacing:0.4px;text-transform:uppercase;color:#ddd;';
    header.textContent = 'Session Touchdowns';

    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:4px;font-size:10px;max-height:175px;overflow-y:auto;';
    list.textContent = 'No landings recorded in this session.';
    this.listEl = list;

    root.append(controls, header, list);
    this.unmountTab = context.anchors.registerHudTab('land', 'LAND', root);
  }

  private injectStyles(): void {
    if (this.styleEl || typeof document === 'undefined' || !document.head) return;
    if (document.getElementById('geofs-ext-landing-stats-styles')) return;
    const style = document.createElement('style');
    style.id = 'geofs-ext-landing-stats-styles';
    style.textContent = `
      #statsCard.addonpack-card {
        box-sizing: border-box;
        position: fixed;
        left: 20px;
        bottom: 60px;
        width: 330px;
        max-width: calc(100vw - 40px);
        background: var(--geofs-ext-bg, rgba(0, 0, 0, 0.8));
        color: var(--geofs-ext-fg, #ffffff);
        border: 1px solid var(--geofs-ext-border, #888888);
        border-radius: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 12px;
        z-index: 2147483000;
        display: flex;
        flex-direction: column;
        transform: translateX(-120%);
        transition: transform 0.35s ease, opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
      }
      #statsCard.addonpack-card * { box-sizing: border-box; }
      #statsCard.addonpack-card.active {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
      }
      #statsCard .addonpack-card-header {
        padding: 10px 14px;
        background: rgba(255, 255, 255, 0.04);
        border-bottom: 1px solid rgba(136, 136, 136, 0.45);
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
        user-select: none;
        touch-action: none;
      }
      #statsCard .addonpack-card-header span {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #dddddd;
      }
      #statsCard .addonpack-close-btn {
        background: #000000;
        color: #ffffff;
        border: 1px solid #888888;
        border-radius: 15px;
        width: 22px;
        height: 22px;
        padding: 0;
        line-height: 20px;
        text-align: center;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      #statsCard .addonpack-card-content {
        padding: 12px 14px 14px;
      }
      #statsCard .stats-main-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        gap: 10px;
      }
      #statsCard .addonpack-score-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 2px solid #dddddd;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      #statsCard .score-value {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        line-height: 1.1;
      }
      #statsCard .score-label {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.78);
        text-transform: uppercase;
        font-weight: 700;
      }
      #statsCard .addonpack-badge {
        flex: 1;
        min-width: 0;
        padding: 10px 8px;
        border-radius: 12px;
        text-align: center;
        font-weight: 900;
        font-size: 13px;
        letter-spacing: 0.7px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #statsCard .badge-butter { background: linear-gradient(135deg, #22c55e, #16a34a); color: #ffffff; }
      #statsCard .badge-acceptable { background: linear-gradient(135deg, #eab308, #ca8a04); color: #000000; }
      #statsCard .badge-hard { background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; }
      #statsCard .badge-crash { background: linear-gradient(135deg, #7f1d1d, #450a0a); color: #ffffff; }
      #statsCard .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px 10px;
        margin-bottom: 10px;
      }
      #statsCard .stat-item {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      #statsCard .stat-label {
        font-size: 9px;
        color: rgba(100, 200, 255, 0.7);
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #statsCard .stat-value {
        font-size: 12px;
        color: #ffffff;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #statsCard .feedback-box {
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.35);
        border-left: 4px solid #22c55e;
        font-size: 10px;
        line-height: 1.35;
        color: #e2e8f0;
      }
    `;
    document.head.appendChild(style);
    this.styleEl = style;
  }

  public update(telemetry: FlightTelemetry): void {
    if (telemetry.paused || !this.ctx || window.geofs?.cautiousWithTerrain) return;

    const aircraftId = telemetry.aircraft?.id ?? null;
    if (aircraftId !== this.aircraftId) {
      this.aircraftId = aircraftId;
      this.wasAirborne = false;
      this.closeReport();
      this.lastGroundHeight = undefined;
      this.calibratedVsFpm = undefined;
      this.lastApproach = null;
      this.gpwsFired.clear();
      this.replay.reset();
    }
    if (!aircraftId) return;

    const aircraft = window.geofs?.aircraft?.instance;
    const values = window.geofs?.animation?.values;
    const collisionOffset = aircraft?.collisionPoints?.at(-2)?.worldPosition?.[2] ?? 0;
    const groundHeight = typeof values?.altitude === 'number' && typeof values.groundElevationFeet === 'number'
      ? values.altitude - values.groundElevationFeet + collisionOffset * 3.2808399 : telemetry.aglFeet;
    const previousHeight = this.lastGroundHeight;
    if (Number.isFinite(groundHeight) && (!previousHeight || groundHeight !== previousHeight.feet)) {
      if (previousHeight && telemetry.timestamp > previousHeight.time) {
        this.calibratedVsFpm = (groundHeight - previousHeight.feet) * 60_000 / (telemetry.timestamp - previousHeight.time);
      }
      this.lastGroundHeight = { feet: groundHeight, time: telemetry.timestamp };
    }

    if (!telemetry.groundContact && !telemetry.crashed) {
      this.wasAirborne = true;
      this.lastApproach = telemetry;
      this.replay.record(telemetry);
      if (telemetry.aglFeet > 80) this.gpwsFired.clear();
      if (!hasAircraftCallouts() && telemetry.vs < -100) {
        const thresholds: Array<{ ft: number; callout: '50' | '40' | '30' | '20' | '10' }> = [
          { ft: 50, callout: '50' },
          { ft: 40, callout: '40' },
          { ft: 30, callout: '30' },
          { ft: 20, callout: '20' },
          { ft: 10, callout: '10' }
        ];
        const reached = thresholds.filter((item) => telemetry.aglFeet <= item.ft);
        const next = reached.at(-1);
        if (next && !this.gpwsFired.has(next.ft)) {
          for (const item of reached) this.gpwsFired.add(item.ft);
          this.ctx.audio.playGpwsCallout(next.callout);
          if (next.ft === 20 && (telemetry.throttles[0] ?? 0) > 0.15) {
            this.ctx.audio.playGpwsCallout('RETARD');
          }
        }
      }
      return;
    }

    if (this.wasAirborne) {
      this.wasAirborne = false;
      this.gpwsFired.clear();
      if (!telemetry.crashed && groundHeight >= 500) {
        this.replay.reset();
        return;
      }
      const isBounce = this.reportOpen;
      this.bounces = isBounce ? this.bounces + 1 : 0;
      if (!isBounce) this.inTouchdownZone = isInTouchdownZone();

      const approach = this.lastApproach ?? telemetry;
      this.lastApproach = null;
      const gForce = typeof values?.accZ === 'number' && Number.isFinite(values.accZ)
        ? values.accZ / 9.80665 : telemetry.gForce;
      const rating = telemetry.crashed ? 'Crash' : rateLanding(approach.vs);
      const record: LandingRecord = {
        id: `${telemetry.timestamp}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date(telemetry.timestamp).toISOString(),
        aircraftId: telemetry.aircraft?.id || 'unknown',
        aircraftName: telemetry.aircraft?.name || 'Unknown Aircraft',
        vsFpm: Math.round(approach.vs),
        gForce: Number(gForce.toFixed(2)),
        rollDeg: Number(approach.roll.toFixed(1)),
        groundSpeedKts: Math.round(telemetry.groundSpeed),
        rating,
        calibratedVsFpm: this.calibratedVsFpm,
        indicatedAirspeedKts: approach.kias,
        trueAirspeedKts: typeof aircraft?.trueAirSpeed === 'number' ? aircraft.trueAirSpeed * 1.94384449 : undefined,
        pitchDeg: Math.abs(typeof values?.atilt === 'number' ? values.atilt : telemetry.pitch),
        ...landingFeedback(rating, approach.vs, this.bounces),
        bounces: this.bounces,
        inTouchdownZone: this.inTouchdownZone,
        score: scoreLanding(approach.vs, gForce, approach.roll, this.bounces, this.inTouchdownZone),
        lat: Number(telemetry.lat.toFixed(4)),
        lon: Number(telemetry.lon.toFixed(4)),
        replay: this.replay.finish(telemetry)
      };

      this.sessionRecords = [record, ...this.sessionRecords].slice(0, 10);
      this.renderSessionList();
      this.showReport(record, isBounce);

      const base = this.ctx.getAudioUrl?.('');
      if (base && !this.sounds && typeof Audio !== 'undefined') {
        this.sounds = {
          soft: new Audio(base + 'soft_landing.wav'),
          hard: new Audio(base + 'hard_landing.wav'),
          crash: new Audio(base + 'crash_landing.wav')
        };
        for (const sound of Object.values(this.sounds)) sound.preload = 'none';
      }

      const sounds = this.sounds;
      if (sounds) {
        for (const sound of Object.values(sounds)) {
          sound.pause();
          sound.currentTime = 0;
        }
        const effect = rating === 'Crash' ? sounds.crash :
          rating === 'Firm' || rating === 'Hard' || rating === 'Bone Shaker' ? sounds.hard : sounds.soft;
        void effect.play().catch(() => {});
      }
      this.ctx.anchors.showToast(
        `${isBounce ? `Bounce #${this.bounces}` : 'Touchdown'}: ${record.vsFpm} fpm | ${record.gForce}G | ${rating}`,
        rating === 'Crash' ? 'critical' : rating === 'Hard' || rating === 'Bone Shaker' ? 'warn' : 'info'
      );
      this.ctx.emitDiag?.('LANDING_RECORDED', {
        rating: record.rating,
        vsFpm: record.vsFpm,
        gForce: record.gForce,
        score: record.score,
        bounces: record.bounces
      });

      if (typeof window !== 'undefined' && typeof window.postMessage === 'function') {
        window.postMessage({ type: 'GEOFS_EXT_LANDING_RECORD', record }, '*');
      }
    }
  }

  private showReport(record: LandingRecord, bounce: boolean): void {
    if (typeof document === 'undefined' || !document.body) return;
    this.closeReport();

    const card = document.createElement('section');
    card.id = 'statsCard';
    card.className = 'addonpack-card';
    card.setAttribute('aria-label', 'Landing Statistics');

    const header = document.createElement('div');
    header.className = 'addonpack-card-header';
    const title = document.createElement('span');
    title.textContent = `Landing Statistics · ${record.aircraftName}`;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'addonpack-close-btn';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close landing report');
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeReport();
    });
    header.append(title, close);

    const content = document.createElement('div');
    content.className = 'addonpack-card-content';

    const mainRow = document.createElement('div');
    mainRow.className = 'stats-main-row';

    const circle = document.createElement('div');
    circle.className = 'addonpack-score-circle';
    const scoreVal = document.createElement('span');
    scoreVal.className = 'score-value';
    scoreVal.textContent = record.score !== undefined ? record.score.toFixed(1) : '—';
    const scoreLbl = document.createElement('span');
    scoreLbl.className = 'score-label';
    scoreLbl.textContent = '/ 10';
    circle.append(scoreVal, scoreLbl);

    const badge = document.createElement('div');
    badge.className = `addonpack-badge ${badgeClassFor(record.rating)}`;
    badge.textContent = `${record.rating.toUpperCase()}${bounce ? ' (BOUNCE)' : ''}`;

    mainRow.append(circle, badge);

    const grid = document.createElement('div');
    grid.className = 'stats-grid';
    const entries: Array<[string, string]> = [
      ['Pre-Impact V/S', `${record.vsFpm} fpm`],
      ['Touchdown G-Force', `${record.gForce.toFixed(2)} G`],
      ['Calibrated V/S', record.calibratedVsFpm === undefined ? '—' : `${record.calibratedVsFpm.toFixed(1)} fpm`],
      ['Indicated Airspeed', record.indicatedAirspeedKts === undefined ? '—' : `${record.indicatedAirspeedKts.toFixed(1)} kt`],
      ['True Airspeed', record.trueAirspeedKts === undefined ? '—' : `${record.trueAirspeedKts.toFixed(1)} kt`],
      ['Ground Speed', `${record.groundSpeedKts} kt`],
      ['Roll', `${record.rollDeg.toFixed(1)}°`],
      ['Pitch', record.pitchDeg === undefined ? '—' : `${record.pitchDeg.toFixed(1)}°`],
      ['Touchdown Zone', record.inTouchdownZone ? 'On Target' : 'Off Target'],
      ['Bounces', String(record.bounces ?? 0)]
    ];
    for (const [label, value] of entries) {
      const item = document.createElement('div');
      item.className = 'stat-item';
      const lbl = document.createElement('span');
      lbl.className = 'stat-label';
      lbl.textContent = label;
      const val = document.createElement('span');
      val.className = 'stat-value';
      val.textContent = value;
      item.append(lbl, val);
      grid.appendChild(item);
    }

    const feedback = document.createElement('div');
    feedback.className = 'feedback-box';
    feedback.style.borderLeftColor = feedbackBorderColor(record);
    const qLine = document.createElement('div');
    qLine.style.fontWeight = '700';
    qLine.textContent = record.qualityFeedback ?? '';
    const pLine = document.createElement('div');
    pLine.style.marginTop = '2px';
    pLine.textContent = record.passengerFeedback ?? '';
    feedback.append(qLine, pLine);

    content.append(mainRow, grid, feedback);
    card.append(header, content);
    document.body.appendChild(card);

    this.reportDragCleanup = this.ctx?.anchors.makeDraggable(card, 'geofs_ext_landing_report_pos', header) ?? null;
    this.report = card;
    this.reportOpen = true;
    void card.offsetWidth;
    card.classList.add('active');
    this.ctx?.anchors.bringToFront(card);
    this.ctx?.anchors.clampElementToViewport(card);
    this.scheduleReportClose();
  }

  public onSettingsChange(): void {
    const settings = this.ctx?.getSettings();
    if (this.timerCheckboxEl && settings) {
      this.timerCheckboxEl.checked = settings.landingReportAutoClose ?? true;
    }
    if (this.secondsInputEl && settings) {
      this.secondsInputEl.value = String(settings.landingReportSeconds ?? 15);
    }
    if (this.reportOpen) this.scheduleReportClose();
  }

  private scheduleReportClose(): void {
    const settings = this.ctx?.getSettings();
    const seconds = settings?.landingReportAutoClose === false
      ? null : Math.max(1, Math.min(3600, settings?.landingReportSeconds || 15));
    if (seconds === this.reportDuration) return;
    clearTimeout(this.reportTimer);
    this.reportDuration = seconds;
    this.reportTimer = seconds === null ? undefined : setTimeout(() => this.closeReport(), seconds * 1000);
  }

  private closeReport(): void {
    clearTimeout(this.reportTimer);
    this.reportTimer = undefined;
    this.reportDragCleanup?.();
    this.reportDragCleanup = null;
    this.report?.remove();
    this.report = null;
    this.reportDuration = null;
    this.reportOpen = false;
  }

  private renderSessionList(): void {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';
    for (const r of this.sessionRecords) {
      const row = document.createElement('div');
      row.style.cssText = 'border-bottom:1px solid rgba(136,136,136,0.3);padding-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      row.textContent = `${r.rating} • ${r.vsFpm} fpm • ${r.gForce}G • ${r.groundSpeedKts} kt • ${r.score?.toFixed(1) ?? '—'}/10`;
      row.title = row.textContent;
      this.listEl.appendChild(row);
    }
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.listEl = null;
    this.timerCheckboxEl = null;
    this.secondsInputEl = null;
    this.wasAirborne = false;
    this.aircraftId = null;
    this.closeReport();
    this.styleEl?.remove();
    this.styleEl = null;
    this.lastGroundHeight = undefined;
    this.calibratedVsFpm = undefined;
    this.lastApproach = null;
    this.gpwsFired.clear();
    this.sessionRecords = [];
    if (this.sounds) for (const sound of Object.values(this.sounds)) sound.pause();
    this.sounds = undefined;
    this.replay.reset();
    this.ctx = null;
  }
}
