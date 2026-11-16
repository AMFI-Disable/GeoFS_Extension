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

export class LandingStatisticsModule implements IModule {
  public readonly id = 'landing-statistics';
  public readonly name = 'Landing Statistics';
  public readonly description = 'Touchdown telemetry analysis, rating, audio cue, and persistent flight logbook.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private wasAirborne = false;
  private aircraftId: string | null = null;
  private replay = new LandingReplay();
  private reportTimer: ReturnType<typeof setTimeout> | undefined;
  private report: HTMLElement | null = null;
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
  private unmountTab: (() => void) | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    const root = document.createElement('div');
    root.innerHTML = '<div style="font-weight:700;margin-bottom:6px;font-size:11px;">Session Touchdowns</div>';
    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:4px;font-size:10px;max-height:150px;overflow-y:auto;';
    list.textContent = 'No landings recorded in this session.';
    root.appendChild(list);
    this.listEl = list;
    this.unmountTab = context.anchors.registerHudTab('land', 'LAND', root);
    const timer = document.createElement('input');
    timer.type = 'checkbox';
    timer.checked = context.getSettings().landingReportAutoClose ?? true;
    timer.addEventListener('change', () => context.updateSettings({ landingReportAutoClose: timer.checked }));
    const timerLabel = document.createElement('label');
    timerLabel.append(timer, ' Auto-close report');
    const seconds = document.createElement('input');
    seconds.type = 'number';
    seconds.min = '1';
    seconds.max = '3600';
    seconds.value = String(context.getSettings().landingReportSeconds ?? 15);
    seconds.style.width = '4em';
    seconds.setAttribute('aria-label', 'Landing report duration in seconds');
    seconds.addEventListener('change', () => {
      const duration = Math.max(1, Math.min(3600, seconds.valueAsNumber || 15));
      seconds.value = String(duration);
      context.updateSettings({ landingReportSeconds: duration });
    });
    root.prepend(timerLabel, seconds, ' s');
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
      if (base && !this.sounds) {
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

      if (typeof window !== 'undefined') {
        window.postMessage({ type: 'GEOFS_EXT_LANDING_RECORD', record }, '*');
      }
    }
  }

  private showReport(record: LandingRecord, bounce: boolean): void {
    this.closeReport();
    const report = document.createElement('section');
    report.className = 'geofs-ext-landing-report';
    report.setAttribute('aria-label', 'Landing Statistics');
    const title = document.createElement('strong');
    title.textContent = `Landing Statistics · ${record.rating}${bounce ? ' (Bounce)' : ''} · ${record.score?.toFixed(1)}/10`;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'geofs-ext-pad';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close landing report');
    close.addEventListener('click', () => this.closeReport());
    const stats = document.createElement('dl');
    const entries: Array<[string, string]> = [
      ['Pre-Impact V/S', `${record.vsFpm} fpm`],
      ['Touchdown G-Force', `${record.gForce.toFixed(2)} G`],
      ['Calibrated V/S', record.calibratedVsFpm === undefined ? '—' : `${record.calibratedVsFpm.toFixed(1)} fpm`],
      ['Indicated Airspeed', `${record.indicatedAirspeedKts?.toFixed(1)} kt`],
      ['True Airspeed', record.trueAirspeedKts === undefined ? '—' : `${record.trueAirspeedKts.toFixed(1)} kt`],
      ['Ground Speed', `${record.groundSpeedKts} kt`],
      ['Roll', `${record.rollDeg.toFixed(1)}°`],
      ['Pitch', `${record.pitchDeg?.toFixed(1)}°`],
      ['Touchdown Zone', record.inTouchdownZone ? 'On Target' : 'Off Target'],
      ['Bounces', String(record.bounces)]
    ];
    for (const [label, value] of entries) {
      const term = document.createElement('dt');
      term.textContent = label;
      const detail = document.createElement('dd');
      detail.textContent = value;
      stats.append(term, detail);
    }
    const quality = document.createElement('p');
    quality.textContent = record.qualityFeedback ?? '';
    const passenger = document.createElement('p');
    passenger.textContent = record.passengerFeedback ?? '';
    report.append(close, title, stats, quality, passenger);
    document.body.append(report);
    this.ctx?.anchors.makeDraggable(report, 'geofs_ext_landing_report_pos');
    this.report = report;
    this.reportOpen = true;
    this.scheduleReportClose();
  }

  public onSettingsChange(): void {
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
      row.style.cssText = 'border-bottom:1px solid rgba(136,136,136,0.3);padding-bottom:3px;';
      row.textContent = `${r.rating} • ${r.vsFpm} fpm • ${r.gForce}G • ${r.groundSpeedKts} kt • ${r.score?.toFixed(1) ?? '—'}/10`;
      this.listEl.appendChild(row);
    }
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.listEl = null;
    this.wasAirborne = false;
    this.aircraftId = null;
    this.closeReport();
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
