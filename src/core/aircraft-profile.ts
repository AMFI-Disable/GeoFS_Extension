import { AIRCRAFT_CATEGORIES, type AircraftCategory, type AircraftProfile } from '../types/module';

export const V_SPEEDS = ['V1', 'VR', 'V2', 'Vref', 'Vfe', 'Vne'] as const;
export type VSpeeds = Partial<Record<(typeof V_SPEEDS)[number], number>>;

export type AircraftOverride = Partial<Pick<AircraftProfile,
  'name' | 'category' | 'oew' | 'mtow' | 'maxFuel' | 'maxFlaps' | 'vSpeeds'
>>;

export const AIRCRAFT_OVERRIDE_PREFIX = 'geofs_ext_aircraft_';
export const AIRCRAFT_NUMBER_FIELDS = [
  ['oew', 'Empty Weight (kg)'],
  ['mtow', 'Maximum Takeoff Weight (kg)'],
  ['maxFuel', 'Fuel Capacity (kg)'],
  ['maxFlaps', 'Flap Steps']
] as const;

export function parseAircraftOverride(raw: unknown): AircraftOverride {
  if (!raw || typeof raw !== 'object') throw new Error('Enter an aircraft profile.');
  const input = raw as Record<string, unknown>;
  const result: AircraftOverride = {};
  if (typeof input.name === 'string' && input.name.trim()) result.name = input.name.trim().slice(0, 120);
  if (input.category !== undefined) {
    if (!AIRCRAFT_CATEGORIES.includes(input.category as AircraftCategory)) throw new Error('Choose an aircraft category.');
    result.category = input.category as AircraftCategory;
  }
  for (const [field, label] of AIRCRAFT_NUMBER_FIELDS) {
    const value = input[field];
    if (value === undefined) continue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 ||
      ((field === 'oew' || field === 'mtow') && value === 0) ||
      (field === 'maxFlaps' && !Number.isSafeInteger(value))) {
      throw new Error(`Enter a valid value for ${label}.`);
    }
    result[field] = value;
  }
  if (result.oew !== undefined && result.mtow !== undefined && result.oew > result.mtow) {
    throw new Error('Maximum takeoff weight must be at least the empty weight.');
  }
  if (input.vSpeeds !== undefined) {
    const speeds = input.vSpeeds as Record<string, unknown>;
    result.vSpeeds = {};
    for (const speed of V_SPEEDS) {
      const value = speeds?.[speed];
      if (value === undefined) continue;
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        throw new Error(`Enter a positive KIAS value for ${speed}.`);
      }
      result.vSpeeds[speed] = value;
    }
  }
  return result;
}

export function formatVSpeeds(speeds: VSpeeds | undefined, machSpeeds?: VSpeeds): string {
  const entries = V_SPEEDS.flatMap((speed) => {
    if (speeds?.[speed] !== undefined) return [`${speed} ${speeds[speed]} kt`];
    if (machSpeeds?.[speed] !== undefined) return [`${speed} Mach ${machSpeeds[speed]}`];
    return [];
  });
  return entries.length ? `V-Speeds: ${entries.join(' · ')}` : 'V-Speeds: Unavailable';
}
