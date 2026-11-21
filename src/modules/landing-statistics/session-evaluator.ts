import type { FlightTelemetry } from '../../types/module';
import type { LandingRecord } from '../../types/settings';

export interface PhaseCritique {
  departure: string;
  cruise: string;
  approach: string;
  touchdown: string;
}

export interface SessionEvaluation {
  authenticFlight: boolean;
  stars: 1 | 2 | 3 | 4 | 5;
  phaseCritique: PhaseCritique;
}

const METERS_PER_DEG_LAT = 111_320;
const NM_PER_METER = 1 / 1852;

export class FlightSessionEvaluator {
  private sawGroundBeforeTakeoff = false;
  private airborne = false;
  private teleportOrSlewDetected = false;
  private lastLat: number | null = null;
  private lastLon: number | null = null;
  private maxAltFt = 0;
  private maxGForce = 1;
  private departureMaxBankDeg = 0;
  private approach500Stable = true;
  private approach500Checked = false;

  public reset(): void {
    this.sawGroundBeforeTakeoff = false;
    this.airborne = false;
    this.teleportOrSlewDetected = false;
    this.lastLat = null;
    this.lastLon = null;
    this.maxAltFt = 0;
    this.maxGForce = 1;
    this.departureMaxBankDeg = 0;
    this.approach500Stable = true;
    this.approach500Checked = false;
  }

  public sample(telemetry: FlightTelemetry, slewActive = false): void {
    if (slewActive) {
      this.teleportOrSlewDetected = true;
    }

    if (this.lastLat !== null && this.lastLon !== null && Number.isFinite(telemetry.lat) && Number.isFinite(telemetry.lon)) {
      const cosLat = Math.max(0.2, Math.cos((telemetry.lat * Math.PI) / 180));
      const dMeters = Math.hypot(
        (telemetry.lat - this.lastLat) * METERS_PER_DEG_LAT,
        (telemetry.lon - this.lastLon) * METERS_PER_DEG_LAT * cosLat
      );
      if (dMeters * NM_PER_METER > 5) {
        this.teleportOrSlewDetected = true;
      }
    }
    this.lastLat = telemetry.lat;
    this.lastLon = telemetry.lon;

    if (telemetry.groundContact && telemetry.aglFeet < 30) {
      if (!this.airborne) {
        this.sawGroundBeforeTakeoff = true;
      }
      return;
    }

    if (!this.airborne && telemetry.aglFeet > 50) {
      this.airborne = true;
    }

    if (this.airborne) {
      this.maxAltFt = Math.max(this.maxAltFt, telemetry.altitude);
      if (Number.isFinite(telemetry.gForce)) {
        this.maxGForce = Math.max(this.maxGForce, Math.abs(telemetry.gForce));
      }
      if (telemetry.aglFeet <= 1500) {
        this.departureMaxBankDeg = Math.max(this.departureMaxBankDeg, Math.abs(telemetry.roll));
      }
      if (telemetry.aglFeet <= 550 && telemetry.aglFeet >= 400 && telemetry.vs < 0) {
        this.approach500Checked = true;
        if (Math.abs(telemetry.vs) > 1300 || Math.abs(telemetry.roll) > 25) {
          this.approach500Stable = false;
        }
      }
    }
  }

  public evaluate(record: {
    rating: LandingRecord['rating'];
    score: number;
    vsFpm: number;
    bounces: number;
    inTouchdownZone: boolean;
  }): SessionEvaluation {
    const authenticFlight = this.sawGroundBeforeTakeoff && this.airborne && !this.teleportOrSlewDetected;

    let starFloat = (record.score / 10) * 5;
    if (!this.approach500Stable) starFloat -= 0.4;
    if (this.maxGForce > 2.4) starFloat -= 0.3;
    if (record.rating === 'Crash') starFloat = 1;
    const stars = Math.max(1, Math.min(5, Math.round(starFloat))) as 1 | 2 | 3 | 4 | 5;

    const departure = !this.sawGroundBeforeTakeoff
      ? 'Mid-air spawn (untracked departure)'
      : this.departureMaxBankDeg > 32
        ? `Aggressive initial bank (${Math.round(this.departureMaxBankDeg)}°)`
        : 'Clean runway departure & climb-out';

    const cruise = this.teleportOrSlewDetected
      ? 'Slew/teleport discontinuity detected'
      : this.maxGForce > 2.4
        ? `High cruise G-load (${this.maxGForce.toFixed(1)}G)`
        : `Smooth cruise discipline (peak ${Math.round(this.maxAltFt)} ft)`;

    const approach = !this.approach500Checked
      ? 'Short pattern / direct final'
      : this.approach500Stable
        ? 'Stabilized 500 ft AGL gate'
        : 'Unstabilized 500 ft AGL gate (high sink/bank)';

    const touchdown = `${record.rating} (${record.vsFpm} fpm${record.bounces ? `, ${record.bounces} bounce` : ''}${record.inTouchdownZone ? ', TDZ' : ', off-TDZ'})`;

    return {
      authenticFlight,
      stars,
      phaseCritique: { departure, cruise, approach, touchdown }
    };
  }
}
