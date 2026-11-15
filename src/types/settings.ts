export type ThemeMode = 'auto' | 'dark' | 'light';
export type CalibratorPreset = '1080p' | '1440p' | '4k' | 'ultrawide' | 'laptop';
export type ImageryProviderMode = 'native' | 'esri' | 'osm' | 'custom';

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
  rating: 'Butter' | 'Smooth' | 'Firm' | 'Hard' | 'Crash';
  lat: number;
  lon: number;
}

import type { AircraftCategory, VSpeedReference } from './module';

export interface AircraftProfileOverride {
  name?: string;
  category?: AircraftCategory;
  oew?: number;
  mtow?: number;
  maxFuel?: number;
  vSpeeds?: Partial<VSpeedReference>;
}

export interface ExtensionSettings {
  modules: Record<string, boolean>;
  themeMode: ThemeMode;
  calibratorPreset: CalibratorPreset;
  keybindings: KeybindConfig;
  autothrottleResponsiveness: number; // 0.5 to 2.0
  failureProbabilitiesEnabled: boolean;
  imageryProvider: ImageryProviderMode;
  customImageryUrl: string;
  customImageryToken: string;
  aircraftOverrides: Record<string, AircraftProfileOverride>;
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
