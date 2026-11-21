export type ApPpLateralMode = 'off' | 'hdg' | 'latlon' | 'wpt' | 'hold' | 'loc';
export type ApPpVerticalMode = 'off' | 'alt' | 'vs' | 'flch' | 'vnav' | 'gs' | 'flare';
export type ApPpSpeedMode = 'off' | 'kts' | 'mach';
export type ApPpHoldTurnDir = 'R' | 'L';
export type ApPpHoldEntryType = 'direct' | 'parallel' | 'teardrop';
export type ApPpHoldLegPhase =
  | 'entry-teardrop'
  | 'entry-parallel'
  | 'inbound'
  | 'turn-outbound'
  | 'outbound'
  | 'turn-inbound';

export interface ApPpHoldConfig {
  fixLat: number;
  fixLon: number;
  inboundCourseDeg: number;
  legMinutes: number;
  turnDir: ApPpHoldTurnDir;
  phase: ApPpHoldLegPhase;
  legElapsedSec: number;
  entryType?: ApPpHoldEntryType;
  wcaDeg?: number;
}

export interface ApPpFmaState {
  thr: string;
  vert: string;
  lat: string;
  protection: 'ALPHA FLOOR' | 'OVERSPEED' | 'BANK LIMIT' | 'STICK DISC' | null;
}

export interface ApPpSnapshot {
  engaged: boolean;
  beta: true;
  speedMode: ApPpSpeedMode;
  lateralMode: ApPpLateralMode;
  verticalMode: ApPpVerticalMode;
  targetKias: number;
  targetMach: number;
  targetAltFt: number;
  targetHdgDeg: number;
  targetVsFpm: number;
  autoVs: boolean;
  targetLat: number;
  targetLon: number;
  waypointName: string;
  landingArmed: boolean;
  landingRetarded: boolean;
  envelopeProtection: boolean;
  hoverMode: boolean;
  isRotorcraft: boolean;
  ktas: number;
  crossoverAltFt: number;
  distanceToFixNm: number | null;
  bearingToFixDeg: number | null;
  holdConfig: ApPpHoldConfig;
  fma: ApPpFmaState;
  degradedReason: string | null;
}

export type ApPpCommand =
  | { type: 'engage' }
  | { type: 'disengage' }
  | { type: 'toggle' }
  | { type: 'setSpeed'; value: number }
  | { type: 'setSpeedMode'; mode: ApPpSpeedMode }
  | { type: 'setHeading'; deg: number }
  | { type: 'setLateralMode'; mode: ApPpLateralMode }
  | { type: 'setAltitude'; feet: number }
  | { type: 'setVs'; fpm: number | null }
  | { type: 'setVerticalMode'; mode: ApPpVerticalMode }
  | { type: 'setLatLon'; lat: number; lon: number; name?: string }
  | { type: 'holdHere'; legMinutes?: number; turnDir?: ApPpHoldTurnDir }
  | { type: 'setHoldConfig'; legMinutes?: number; turnDir?: ApPpHoldTurnDir }
  | { type: 'holdPresent'; axis: 'alt' | 'hdg' | 'spd' | 'all' }
  | { type: 'setLandingArm'; armed: boolean }
  | { type: 'setEnvelopeProtection'; enabled: boolean }
  | { type: 'setHoverMode'; enabled: boolean };
