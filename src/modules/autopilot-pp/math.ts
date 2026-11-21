import type { ApPpHoldConfig, ApPpHoldEntryType, ApPpHoldTurnDir } from './types';

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
 * ICAO standard holding entry classification (MIT-adapted from nafeesnazzim/geofs-holding-pattern).
 * For right turns: teardrop [110, 180), parallel [180, 290), direct [290, 110).
 * For left turns: mirrored across inbound course.
 */
export function classifyHoldEntry(
  headingDeg: number,
  inboundCourseDeg: number,
  turnDir: ApPpHoldTurnDir
): ApPpHoldEntryType {
  const rel = normalizeHeading(headingDeg - inboundCourseDeg);
  const sector = turnDir === 'L' ? normalizeHeading(360 - rel) : rel;
  if (sector >= 110 && sector < 180) return 'teardrop';
  if (sector >= 180 && sector < 290) return 'parallel';
  return 'direct';
}

/**
 * Computes wind correction angle (WCA) in degrees for a desired ground track.
 */
export function computeWcaDeg(
  trackDeg: number,
  tasKts: number,
  windSpeedKts: number,
  windDirFromDeg: number
): number {
  if (!Number.isFinite(windSpeedKts) || windSpeedKts <= 0.5 || !Number.isFinite(windDirFromDeg)) {
    return 0;
  }
  const safeTas = Math.max(45, Number.isFinite(tasKts) ? tasKts : 120);
  const angleRad = (windDirFromDeg - trackDeg) * DEG_TO_RAD;
  const cross = windSpeedKts * Math.sin(angleRad);
  const wca = Math.asin(clamp(cross / safeTas, -0.44, 0.44)) * RAD_TO_DEG;
  return Math.round(clamp(wca, -26, 26));
}

/**
 * Advances the ICAO racetrack holding state machine and returns the desired wind-corrected heading.
 */
export function stepHoldPattern(
  hold: ApPpHoldConfig,
  lat: number,
  lon: number,
  headingDeg: number,
  dt: number,
  wind?: { tasKts: number; windSpeedKts: number; windDirFromDeg: number }
): { targetHeadingDeg: number; distToFixNm: number; bearingToFixDeg: number } {
  const distToFixNm = greatCircleDistanceNm(lat, lon, hold.fixLat, hold.fixLon);
  const bearingToFixDeg = greatCircleBearingDeg(lat, lon, hold.fixLat, hold.fixLon);
  const inbound = normalizeHeading(hold.inboundCourseDeg);
  const outbound = normalizeHeading(inbound + 180);
  const legSec = clamp(hold.legMinutes, 0.5, 5) * 60;
  const wcaForTrack = (track: number) =>
    wind ? computeWcaDeg(track, wind.tasKts, wind.windSpeedKts, wind.windDirFromDeg) : 0;

  if (hold.phase === 'entry-teardrop') {
    hold.legElapsedSec += dt;
    // Fly 30 deg into the holding side on outbound leg
    const tdTrack = normalizeHeading(outbound + (hold.turnDir === 'R' ? -30 : 30));
    const wca = wcaForTrack(tdTrack);
    hold.wcaDeg = wca;
    if (hold.legElapsedSec >= legSec) {
      hold.phase = 'turn-inbound';
      hold.legElapsedSec = 0;
    }
    return { targetHeadingDeg: normalizeHeading(tdTrack + wca), distToFixNm, bearingToFixDeg };
  }

  if (hold.phase === 'entry-parallel') {
    hold.legElapsedSec += dt;
    const wca = wcaForTrack(outbound);
    hold.wcaDeg = wca;
    if (hold.legElapsedSec >= legSec) {
      hold.phase = 'inbound';
      hold.legElapsedSec = 0;
    }
    return { targetHeadingDeg: normalizeHeading(outbound + wca), distToFixNm, bearingToFixDeg };
  }

  if (hold.phase === 'inbound') {
    hold.legElapsedSec += dt;
    const wca = wcaForTrack(inbound);
    hold.wcaDeg = wca;
    if (distToFixNm < 0.6 && hold.legElapsedSec > 10) {
      hold.phase = 'turn-outbound';
      hold.legElapsedSec = 0;
    }
    const interceptBias = clamp(headingDeltaDeg(bearingToFixDeg, inbound) * 1.4, -30, 30);
    return {
      targetHeadingDeg: normalizeHeading(bearingToFixDeg + interceptBias * 0.25 + wca),
      distToFixNm,
      bearingToFixDeg
    };
  }

  if (hold.phase === 'turn-outbound') {
    hold.legElapsedSec += dt;
    const wca = wcaForTrack(outbound);
    hold.wcaDeg = wca;
    const desired = normalizeHeading(outbound + wca);
    const delta = Math.abs(headingDeltaDeg(desired, headingDeg));
    if (delta < 12 || hold.legElapsedSec > 70) {
      hold.phase = 'outbound';
      hold.legElapsedSec = 0;
    }
    return { targetHeadingDeg: desired, distToFixNm, bearingToFixDeg };
  }

  if (hold.phase === 'outbound') {
    hold.legElapsedSec += dt;
    const wca = wcaForTrack(outbound);
    hold.wcaDeg = wca;
    if (hold.legElapsedSec >= legSec) {
      hold.phase = 'turn-inbound';
      hold.legElapsedSec = 0;
    }
    return { targetHeadingDeg: normalizeHeading(outbound + wca), distToFixNm, bearingToFixDeg };
  }

  // turn-inbound
  hold.legElapsedSec += dt;
  const wca = wcaForTrack(inbound);
  hold.wcaDeg = wca;
  const desired = normalizeHeading(inbound + wca);
  const delta = Math.abs(headingDeltaDeg(desired, headingDeg));
  if (delta < 15 || hold.legElapsedSec > 70) {
    hold.phase = 'inbound';
    hold.legElapsedSec = 0;
  }
  return { targetHeadingDeg: desired, distToFixNm, bearingToFixDeg };
}
