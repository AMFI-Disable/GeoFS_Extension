import type { ApPpHoldConfig } from './types';

const EARTH_RADIUS_NM = 3440.065;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function normalizeHeading(deg: number): number {
  if (!Number.isFinite(deg)) return 0;
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

export function headingDeltaDeg(targetDeg: number, currentDeg: number): number {
  let delta = normalizeHeading(targetDeg) - normalizeHeading(currentDeg);
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

/**
 * Standard-atmosphere density ratio sigma = rho / rho0 up to ~65,000 ft.
 */
export function airDensityRatio(altitudeFt: number): number {
  const h = Math.max(0, altitudeFt);
  if (h <= 36089) {
    const tempRatio = 1 - 6.8756e-6 * h;
    return Math.pow(Math.max(0.1, tempRatio), 4.25588);
  }
  const tropoSigma = 0.297076;
  return tropoSigma * Math.exp(-(h - 36089) / 20806);
}

/**
 * Speed of sound in knots using ISA temperature lapse.
 */
export function speedOfSoundKts(altitudeFt: number): number {
  const h = Math.max(0, altitudeFt);
  const tempK = h <= 36089 ? 288.15 - 0.0019812 * h : 216.65;
  return 661.4786 * Math.sqrt(Math.max(0.5, tempK / 288.15));
}

export function kiasToKtas(kias: number, altitudeFt: number): number {
  const sigma = Math.max(0.04, airDensityRatio(altitudeFt));
  return kias / Math.sqrt(sigma);
}

export function ktasToKias(ktas: number, altitudeFt: number): number {
  const sigma = Math.max(0.04, airDensityRatio(altitudeFt));
  return ktas * Math.sqrt(sigma);
}

export function kiasToMach(kias: number, altitudeFt: number): number {
  const ktas = kiasToKtas(kias, altitudeFt);
  return ktas / speedOfSoundKts(altitudeFt);
}

export function machToKias(mach: number, altitudeFt: number): number {
  const ktas = mach * speedOfSoundKts(altitudeFt);
  return ktasToKias(ktas, altitudeFt);
}

/**
 * Approximate altitude (ft) where target KIAS equals target Mach.
 */
export function crossoverAltitudeFt(targetKias: number, targetMach: number): number {
  const safeKias = clamp(targetKias, 100, 600);
  const safeMach = clamp(targetMach, 0.3, 2.5);
  let low = 0;
  let high = 60000;
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) * 0.5;
    if (kiasToMach(safeKias, mid) < safeMach) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return Math.round((low + high) * 0.5);
}

export function greatCircleBearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = lat1 * DEG_TO_RAD;
  const phi2 = lat2 * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const y = Math.sin(dLon) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);
  return normalizeHeading(Math.atan2(y, x) * RAD_TO_DEG);
}

export function greatCircleDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = lat1 * DEG_TO_RAD;
  const phi2 = lat2 * DEG_TO_RAD;
  const dPhi = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const a =
    Math.sin(dPhi * 0.5) * Math.sin(dPhi * 0.5) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon * 0.5) * Math.sin(dLon * 0.5);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
  return EARTH_RADIUS_NM * c;
}

export class PidController {
  private integral = 0;
  private prevError = 0;
  private hasPrev = false;

  constructor(
    private readonly kp: number,
    private readonly ki: number,
    private readonly kd: number,
    private readonly minOut: number,
    private readonly maxOut: number,
    private readonly maxIntegral = 50
  ) {}

  public reset(): void {
    this.integral = 0;
    this.prevError = 0;
    this.hasPrev = false;
  }

  public step(error: number, dt: number): number {
    const safeDt = clamp(dt, 0.005, 0.5);
    this.integral = clamp(this.integral + error * safeDt, -this.maxIntegral, this.maxIntegral);
    const derivative = this.hasPrev ? (error - this.prevError) / safeDt : 0;
    this.prevError = error;
    this.hasPrev = true;
    const raw = this.kp * error + this.ki * this.integral + this.kd * derivative;
    return clamp(raw, this.minOut, this.maxOut);
  }
}

/**
 * Advances the racetrack holding state machine and returns the desired heading.
 */
export function stepHoldPattern(
  hold: ApPpHoldConfig,
  lat: number,
  lon: number,
  headingDeg: number,
  dt: number
): { targetHeadingDeg: number; distToFixNm: number; bearingToFixDeg: number } {
  const distToFixNm = greatCircleDistanceNm(lat, lon, hold.fixLat, hold.fixLon);
  const bearingToFixDeg = greatCircleBearingDeg(lat, lon, hold.fixLat, hold.fixLon);
  const inbound = normalizeHeading(hold.inboundCourseDeg);
  const outbound = normalizeHeading(inbound + 180);
  const legSec = clamp(hold.legMinutes, 0.5, 5) * 60;

  if (hold.phase === 'inbound') {
    hold.legElapsedSec += dt;
    if (distToFixNm < 0.6 && hold.legElapsedSec > 10) {
      hold.phase = 'turn-outbound';
      hold.legElapsedSec = 0;
    }
    // Intercept inbound radial toward fix
    const interceptBias = clamp(headingDeltaDeg(bearingToFixDeg, inbound) * 1.4, -30, 30);
    return {
      targetHeadingDeg: normalizeHeading(bearingToFixDeg + interceptBias * 0.25),
      distToFixNm,
      bearingToFixDeg
    };
  }

  if (hold.phase === 'turn-outbound') {
    hold.legElapsedSec += dt;
    const delta = Math.abs(headingDeltaDeg(outbound, headingDeg));
    if (delta < 12 || hold.legElapsedSec > 70) {
      hold.phase = 'outbound';
      hold.legElapsedSec = 0;
    }
    return { targetHeadingDeg: outbound, distToFixNm, bearingToFixDeg };
  }

  if (hold.phase === 'outbound') {
    hold.legElapsedSec += dt;
    if (hold.legElapsedSec >= legSec) {
      hold.phase = 'turn-inbound';
      hold.legElapsedSec = 0;
    }
    return { targetHeadingDeg: outbound, distToFixNm, bearingToFixDeg };
  }

  // turn-inbound
  hold.legElapsedSec += dt;
  const delta = Math.abs(headingDeltaDeg(inbound, headingDeg));
  if (delta < 15 || hold.legElapsedSec > 70) {
    hold.phase = 'inbound';
    hold.legElapsedSec = 0;
  }
  return { targetHeadingDeg: inbound, distToFixNm, bearingToFixDeg };
}
