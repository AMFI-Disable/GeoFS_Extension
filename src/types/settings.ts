import type { LandingSample } from '../core/landing-replay';
import type { AircraftOverride } from '../core/aircraft-profile';

export type ThemeMode = 'auto' | 'dark' | 'light';
export type CalibratorPreset = '1080p' | '1440p' | '4k' | 'ultrawide' | 'laptop';
export type ImageryProviderMode = 'native' | 'esri' | 'bing' | 'osm' | 'custom';

export interface KeybindConfig {
  toggleAutothrottle: string;
  toggleOpEngines: string;
  toggleHud: string;
  toggleFpv: string;
  toggleChecklist: string;
}

export interface LandingRecord {
  id: string;
  timestamp: string;
  aircraftId: string;
  aircraftName: string;
  vsFpm: number;
  gForce: number;
  rollDeg: number;
  groundSpeedKts: number;
  rating: 'Butter' | 'Silky' | 'Great' | 'Smooth' | 'Firm' | 'Hard' | 'Bone Shaker' | 'Crash';
  score?: number;
  calibratedVsFpm?: number;
  indicatedAirspeedKts?: number;
  trueAirspeedKts?: number;
  pitchDeg?: number;
  qualityFeedback?: string;
  passengerFeedback?: string;
  bounces?: number;
  inTouchdownZone?: boolean;
  lat: number;
  lon: number;
  replay?: LandingSample[];
}

export interface RealismOptions {
  gBreath: boolean;
  windAudio: boolean;
  soundExpansion: boolean;
  blackout: boolean;
  cameraShake: boolean;
  propwash: boolean;
  spinFix: boolean;
  bladeCollisions: boolean;
  engineInertia: boolean;
  spoilerArming: boolean;
  performanceMode: boolean;
}

export interface ExtensionSettings {
  modules: Record<string, boolean>;
  themeMode: ThemeMode;
  calibratorPreset: CalibratorPreset;
  keybindings: KeybindConfig;
  autothrottleResponsiveness: number; // 0.5 to 2.0
  failureProbabilitiesEnabled: boolean;
  imageryProvider: ImageryProviderMode;
  opThrustMultiplier?: number;
  opCeilingFeet?: number;
  opStability?: boolean;
  fuelAutoRefuel?: boolean;
  fuelDynamicSfc?: boolean;
  fuelRealisticTanks?: boolean;
  landingReportAutoClose?: boolean;
  landingReportSeconds?: number;
  realismOptions?: Partial<RealismOptions>;
  customImageryUrl: string;
  customImageryToken: string;
  aircraftOverrides: Record<string, AircraftOverride>;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  modules: {
    'autothrottle': true,
    'information-display': true,
    'fuel-simulator': true,
    'overpowered-engines': false,
    'checklist-system': true,
    'realism-pack': true,
    'failure-simulator': false,
    'flight-path-vector': true,
    'landing-statistics': true,
    'satellite-imagery': false
  },
  themeMode: 'auto',
  calibratorPreset: '1080p',
  keybindings: {
    toggleAutothrottle: 'Shift+A',
    toggleOpEngines: 'Shift+O',
    toggleHud: 'Shift+H',
    toggleFpv: 'Shift+F',
    toggleChecklist: 'Shift+C'
  },
  autothrottleResponsiveness: 1.0,
  failureProbabilitiesEnabled: false,
  imageryProvider: 'native',
  customImageryUrl: '',
  customImageryToken: '',
  aircraftOverrides: {}
};
