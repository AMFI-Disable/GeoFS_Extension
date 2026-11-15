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
  private lastTouchdownMs = 0;
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

    if (!telemetry.groundContact && telemetry.aglFeet > 25) {
      this.wasAirborne = true;
      return;
    }

    if (this.wasAirborne && telemetry.groundContact && telemetry.timestamp - this.lastTouchdownMs > 6000) {
      this.wasAirborne = false;
      this.lastTouchdownMs = telemetry.timestamp;

      const rating = rateLanding(telemetry.vs, telemetry.gForce);
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
        lon: Number(telemetry.lon.toFixed(4))
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
    this.ctx = null;
  }
}
