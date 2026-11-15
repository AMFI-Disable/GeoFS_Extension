import type { SimAdapter } from '../core/sim-adapter';
import type { AudioEngine } from '../core/audio-engine';
import type { AnchorManager } from '../core/anchor-manager';
import type { KeybindManager } from '../core/keybind-manager';
import type { ExtensionSettings } from './settings';

export type SimMajorVersion = 3 | 4;

export type AircraftCategory =
  | 'ga-piston'
  | 'turboprop'
  | 'airliner-twin'
  | 'airliner-quad'
  | 'fighter'
  | 'supersonic'
  | 'rotorcraft'
  | 'specialized';

export interface VSpeedReference {
  v1?: number;
  vr?: number;
  v2?: number;
  vref: number;
  vfe?: number;
  vne: number;
}

export interface AircraftProfile {
  id: string;
  name: string;
  category: AircraftCategory;
  engineCount: number;
  maxFlaps: number;
  hasGear: boolean;
  hasSpoilers: boolean;
  oew: number;
  mtow: number;
  maxFuel: number;
  vSpeeds: VSpeedReference;
  isDynamic: boolean;
}

export interface FlightTelemetry {
  timestamp: number;
  dt: number;
  simMajor: SimMajorVersion;
  paused: boolean;
  isNight: boolean;
  aircraft: AircraftProfile | null;
  kias: number;
  mach: number;
  altitude: number;
  aglFeet: number;
  vs: number;
  heading: number;
  groundSpeed: number;
  gForce: number;
  aoa: number;
  pitch: number;
  roll: number;
  groundContact: boolean;
  reverserActive: boolean;
  throttles: number[];
  collectivePct: number;
  torquePct: number;
  parkingBrake: boolean;
  gearDown: boolean;
  flapsTarget: number;
  lightsOn: boolean;
  lat: number;
  lon: number;
}

export interface ModuleContext {
  sim: SimAdapter;
  audio: AudioEngine;
  anchors: AnchorManager;
  keybinds: KeybindManager;
  getSettings: () => ExtensionSettings;
  updateSettings: (patch: Partial<ExtensionSettings>) => void;
  emitEvent: <T = unknown>(event: string, detail?: T) => void;
  onEvent: <T = unknown>(event: string, handler: (detail: T) => void) => () => void;
}

export interface IModule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly supportedMajors: readonly SimMajorVersion[];
  readonly defaultEnabled: boolean;

  init(context: ModuleContext): Promise<void> | void;
  update?(telemetry: FlightTelemetry): void;
  onSettingsChange?(settings: ExtensionSettings): void;
  destroy(): Promise<void> | void;
}
