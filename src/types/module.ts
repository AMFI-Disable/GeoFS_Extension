import type { SimAdapter } from '../core/sim-adapter';
import type { AudioEngine } from '../core/audio-engine';
import type { AnchorManager } from '../core/anchor-manager';
import type { KeybindManager } from '../core/keybind-manager';
import type { VSpeeds } from '../core/aircraft-profile';
import type { ExtensionSettings } from './settings';

export type SimMajorVersion = 3 | 4;

export const AIRCRAFT_CATEGORIES = [
  'ga-piston', 'turboprop', 'airliner-twin', 'airliner-quad', 'fighter',
  'supersonic', 'rotorcraft', 'specialized'
] as const;

export type AircraftCategory = (typeof AIRCRAFT_CATEGORIES)[number];

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
  isDynamic: boolean;
  vSpeeds?: VSpeeds;
  machSpeeds?: VSpeeds;
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
  crashed: boolean;
  autopilotOn: boolean;
  reverserActive: boolean;
  throttles: number[];
  collective: number | null;
  rotorTorque: number | null;
  parkingBrake: boolean;
  gearDown: boolean;
  flapsTarget: number;
  airbrakesPosition?: number;
  glideslopeDeviation?: number;
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
