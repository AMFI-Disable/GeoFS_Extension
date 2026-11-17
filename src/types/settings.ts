import type { LandingSample } from '../core/landing-replay';
import { parseAircraftOverrides, type AircraftOverride } from '../core/aircraft-profile';

export const EXTENSION_CONFIG_KEY = 'geofs_ext_config';
export const SCRIPT_CONFIG_KEY = 'geofs_script_config';
export const LEGACY_SETTINGS_KEY = 'geofs_ext_settings';
export const LOGBOOK_KEY = 'geofs_ext_logbook';

export type ThemeMode = 'auto' | 'dark' | 'light';
export type CalibratorPreset = 'auto' | '1080p' | '1440p' | '4k' | 'ultrawide' | 'laptop';
export type ImageryProviderMode = 'native' | 'esri' | 'bing' | 'osm' | 'custom';
export type OpSyncPolicy = 'ask' | 'allow' | 'never';
export type FpvResolutionMode = 'auto' | 'hires' | 'lowres';
export type KeyboardOsProfile = 'auto' | 'mac' | 'windows' | 'linux';
export type MacKeyboardType = 'macbook' | 'magic';

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
  vortexEffects: boolean;
  spinFix: boolean;
  bladeCollisions: boolean;
  engineInertia: boolean;
  spoilerArming: boolean;
  carrierOps: boolean;
  performanceMode: boolean;
}

export const DEFAULT_REALISM_OPTIONS: RealismOptions = {
  gBreath: true,
  windAudio: true,
  soundExpansion: true,
  blackout: true,
  cameraShake: true,
  propwash: true,
  vortexEffects: true,
  spinFix: true,
  bladeCollisions: true,
  engineInertia: true,
  spoilerArming: true,
  carrierOps: true,
  performanceMode: false
};

export interface ExtensionConfig {
  modules: Record<string, boolean>;
  themeMode: ThemeMode;
  calibratorPreset: CalibratorPreset;
  keybindings: KeybindConfig;
  imageryProvider: ImageryProviderMode;
  customImageryUrl: string;
  customImageryToken: string;
  aircraftOverrides: Record<string, AircraftOverride>;
  showStartupDiagnostics: boolean;
  sidePanelAutoTelemetry: boolean;
  hudPositionFallback: boolean;
  keyboardOsProfile: KeyboardOsProfile;
  macKeyboardType: MacKeyboardType | null;
  simKeyTranslatorEnabled: boolean;
  simKeyRemaps: Record<string, string>;
}

export interface ScriptConfig {
  autothrottleResponsiveness: number; // 0.5 to 2.0
  opSyncPolicy: OpSyncPolicy;
  opDeltaThresholdKts: number;
  opThrustMultiplier: number;
  opCeilingFeet: number;
  opStability: boolean;
  sasStrength: number; // 0.5 to 2.0
  checklistAutoAdvance: boolean;
  checklistEnforceMandatoryGates: boolean;
  fuelDynamicSfc: boolean;
  fuelRealisticTanks: boolean;
  fuelAutoRefuel: boolean;
  failureProbabilitiesEnabled: boolean;
  failureProbabilityIntervalSec: number;
  failureSystemChances: Record<string, number>;
  failureRecoveryChancePct: number;
  landingReportAutoClose: boolean;
  landingReportSeconds: number;
  fpvProjectionFactor: number;
  fpvResolutionMode: FpvResolutionMode;
  realismOptions: RealismOptions;
}

export type ExtensionSettings = ExtensionConfig & ScriptConfig;

export const DEFAULT_EXTENSION_CONFIG: ExtensionConfig = {
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
  calibratorPreset: 'auto',
  keybindings: {
    toggleAutothrottle: 'Shift+A',
    toggleOpEngines: 'Shift+O',
    toggleHud: 'Shift+H',
    toggleFpv: 'Shift+F',
    toggleChecklist: 'Shift+C'
  },
  imageryProvider: 'native',
  customImageryUrl: '',
  customImageryToken: '',
  aircraftOverrides: {},
  showStartupDiagnostics: true,
  sidePanelAutoTelemetry: true,
  hudPositionFallback: true,
  keyboardOsProfile: 'auto',
  macKeyboardType: null,
  simKeyTranslatorEnabled: true,
  simKeyRemaps: {}
};

export const DEFAULT_SCRIPT_CONFIG: ScriptConfig = {
  autothrottleResponsiveness: 1.0,
  opSyncPolicy: 'ask',
  opDeltaThresholdKts: 150,
  opThrustMultiplier: 1,
  opCeilingFeet: 3_000_000,
  opStability: false,
  sasStrength: 1.0,
  checklistAutoAdvance: true,
  checklistEnforceMandatoryGates: true,
  fuelDynamicSfc: false,
  fuelRealisticTanks: false,
  fuelAutoRefuel: false,
  failureProbabilitiesEnabled: false,
  failureProbabilityIntervalSec: 60,
  failureSystemChances: {},
  failureRecoveryChancePct: 60,
  landingReportAutoClose: true,
  landingReportSeconds: 15,
  fpvProjectionFactor: 15,
  fpvResolutionMode: 'auto',
  realismOptions: { ...DEFAULT_REALISM_OPTIONS }
};

export const DEFAULT_SETTINGS: ExtensionSettings = {
  ...DEFAULT_EXTENSION_CONFIG,
  ...DEFAULT_SCRIPT_CONFIG
};

export function splitSettings(settings: ExtensionSettings): {
  extensionConfig: ExtensionConfig;
  scriptConfig: ScriptConfig;
} {
  return {
    extensionConfig: {
      modules: { ...DEFAULT_EXTENSION_CONFIG.modules, ...settings.modules },
      themeMode: settings.themeMode,
      calibratorPreset: settings.calibratorPreset,
      keybindings: { ...DEFAULT_EXTENSION_CONFIG.keybindings, ...settings.keybindings },
      imageryProvider: settings.imageryProvider,
      customImageryUrl: settings.customImageryUrl,
      customImageryToken: settings.customImageryToken,
      aircraftOverrides: parseAircraftOverrides(settings.aircraftOverrides),
      showStartupDiagnostics: settings.showStartupDiagnostics,
      sidePanelAutoTelemetry: settings.sidePanelAutoTelemetry,
      hudPositionFallback: settings.hudPositionFallback,
      keyboardOsProfile: settings.keyboardOsProfile,
      macKeyboardType: settings.macKeyboardType ?? null,
      simKeyTranslatorEnabled: settings.simKeyTranslatorEnabled,
      simKeyRemaps: { ...settings.simKeyRemaps }
    },
    scriptConfig: {
      autothrottleResponsiveness: settings.autothrottleResponsiveness,
      opSyncPolicy: settings.opSyncPolicy,
      opDeltaThresholdKts: settings.opDeltaThresholdKts,
      opThrustMultiplier: settings.opThrustMultiplier,
      opCeilingFeet: settings.opCeilingFeet,
      opStability: settings.opStability,
      sasStrength: settings.sasStrength,
      checklistAutoAdvance: settings.checklistAutoAdvance,
      checklistEnforceMandatoryGates: settings.checklistEnforceMandatoryGates,
      fuelDynamicSfc: settings.fuelDynamicSfc,
      fuelRealisticTanks: settings.fuelRealisticTanks,
      fuelAutoRefuel: settings.fuelAutoRefuel,
      failureProbabilitiesEnabled: settings.failureProbabilitiesEnabled,
      failureProbabilityIntervalSec: settings.failureProbabilityIntervalSec,
      failureSystemChances: { ...settings.failureSystemChances },
      failureRecoveryChancePct: settings.failureRecoveryChancePct,
      landingReportAutoClose: settings.landingReportAutoClose,
      landingReportSeconds: settings.landingReportSeconds,
      fpvProjectionFactor: settings.fpvProjectionFactor,
      fpvResolutionMode: settings.fpvResolutionMode,
      realismOptions: { ...DEFAULT_REALISM_OPTIONS, ...settings.realismOptions }
    }
  };
}

export function mergeSettings(
  extRaw?: Partial<ExtensionConfig> | null,
  scriptRaw?: Partial<ScriptConfig> | null,
  legacyRaw?: Partial<ExtensionSettings> | null
): ExtensionSettings {
  const legacy = legacyRaw ?? {};
  const ext = extRaw ?? {};
  const scr = scriptRaw ?? {};
  return {
    ...DEFAULT_SETTINGS,
    ...legacy,
    ...scr,
    ...ext,
    modules: {
      ...DEFAULT_EXTENSION_CONFIG.modules,
      ...(legacy.modules ?? {}),
      ...(ext.modules ?? {})
    },
    keybindings: {
      ...DEFAULT_EXTENSION_CONFIG.keybindings,
      ...(legacy.keybindings ?? {}),
      ...(ext.keybindings ?? {})
    },
    simKeyRemaps: {
      ...(legacy.simKeyRemaps ?? {}),
      ...(ext.simKeyRemaps ?? {})
    },
    aircraftOverrides: parseAircraftOverrides(ext.aircraftOverrides ?? legacy.aircraftOverrides),
    failureSystemChances: {
      ...(legacy.failureSystemChances ?? {}),
      ...(scr.failureSystemChances ?? {})
    },
    realismOptions: {
      ...DEFAULT_REALISM_OPTIONS,
      ...(legacy.realismOptions ?? {}),
      ...(scr.realismOptions ?? {})
    }
  };
}
