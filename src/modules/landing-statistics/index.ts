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

  public init(context: ModuleContext): void {
    this.ctx = context;
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

  public destroy(): void {
    this.wasAirborne = false;
    this.ctx = null;
  }
}
