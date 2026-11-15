import { LandingReplay } from '../../core/landing-replay';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { LandingRecord } from '../../types/settings';

export function rateLanding(vsFpm: number, gForce: number): LandingRecord['rating'] {
  const sink = Math.abs(vsFpm);
  if (sink > 900 || gForce > 2.8) return 'Crash';
  if (sink > 450 || gForce > 2.0) return 'Hard';
  if (sink > 220) return 'Firm';
  if (sink > 90) return 'Smooth';
  return 'Butter';
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
  private lastTouchdownMs = 0;
  private gpwsFired = new Set<number>();
  private sessionRecords: LandingRecord[] = [];
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
  }

  public update(telemetry: FlightTelemetry): void {
    if (telemetry.paused || !this.ctx) return;

    const aircraftId = telemetry.aircraft?.id ?? null;
    if (aircraftId !== this.aircraftId) {
      this.aircraftId = aircraftId;
      this.wasAirborne = false;
      this.lastTouchdownMs = 0;
      this.gpwsFired.clear();
      this.replay.reset();
    }
    if (!aircraftId) return;

    if (!telemetry.groundContact && !telemetry.crashed) {
      if (telemetry.aglFeet > 25) this.wasAirborne = true;
      if (this.wasAirborne) this.replay.record(telemetry);
      if (telemetry.aglFeet > 80) this.gpwsFired.clear();
      if (this.wasAirborne && telemetry.vs < -100) {
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
      if (telemetry.timestamp - this.lastTouchdownMs <= 6000) {
        this.replay.reset();
        return;
      }
      this.lastTouchdownMs = telemetry.timestamp;

      const rating = telemetry.crashed ? 'Crash' : rateLanding(telemetry.vs, telemetry.gForce);
      const record: LandingRecord = {
        id: `${telemetry.timestamp}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date(telemetry.timestamp).toISOString(),
        aircraftId: telemetry.aircraft?.id || 'unknown',
        aircraftName: telemetry.aircraft?.name || 'Unknown Aircraft',
        vsFpm: Math.round(telemetry.vs),
        gForce: Number(telemetry.gForce.toFixed(2)),
        rollDeg: Number(telemetry.roll.toFixed(1)),
        groundSpeedKts: Math.round(telemetry.groundSpeed),
        rating,
        lat: Number(telemetry.lat.toFixed(4)),
        lon: Number(telemetry.lon.toFixed(4)),
        replay: this.replay.finish(telemetry)
      };

      this.sessionRecords = [record, ...this.sessionRecords].slice(0, 10);
      this.renderSessionList();

      this.ctx.audio.playTouchdown(rating);
      this.ctx.anchors.showToast(
        `Touchdown: ${record.vsFpm} fpm | ${record.gForce}G | ${rating}`,
        rating === 'Crash' || rating === 'Hard' ? 'warn' : 'info'
      );

      if (typeof window !== 'undefined') {
        window.postMessage({ type: 'GEOFS_EXT_LANDING_RECORD', record }, '*');
      }
    }
  }

  private renderSessionList(): void {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';
    for (const r of this.sessionRecords) {
      const row = document.createElement('div');
      row.style.cssText = 'border-bottom:1px solid rgba(136,136,136,0.3);padding-bottom:3px;';
      row.textContent = `${r.rating} • ${r.vsFpm} fpm • ${r.gForce}G • ${r.groundSpeedKts} kt`;
      this.listEl.appendChild(row);
    }
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.listEl = null;
    this.wasAirborne = false;
    this.aircraftId = null;
    this.lastTouchdownMs = 0;
    this.replay.reset();
    this.ctx = null;
  }
}
