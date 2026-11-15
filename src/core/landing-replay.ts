import type { FlightTelemetry } from '../types/module';
import type { LandingRecord } from '../types/settings';

const REPLAY_DURATION_MS = 30_000;
const SAMPLE_INTERVAL_MS = 250;
const MAX_SAMPLES = REPLAY_DURATION_MS / SAMPLE_INTERVAL_MS + 1;

export interface LandingSample {
  timestampMs: number;
  lat: number;
  lon: number;
  altitudeFt: number;
  aglFt: number;
  kias: number;
  groundSpeedKts: number;
  vsFpm: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  gForce: number;
  groundContact: boolean;
}

export class LandingReplay {
  private samples: LandingSample[] = [];

  public record(t: FlightTelemetry, touchdown = false): void {
    const lastSample = this.samples.at(-1);
    if (!touchdown && lastSample && t.timestamp - lastSample.timestampMs < SAMPLE_INTERVAL_MS) return;
    const sample: LandingSample = {
      timestampMs: t.timestamp,
      lat: t.lat,
      lon: t.lon,
      altitudeFt: t.altitude,
      aglFt: t.aglFeet,
      kias: t.kias,
      groundSpeedKts: t.groundSpeed,
      vsFpm: t.vs,
      headingDeg: t.heading,
      pitchDeg: t.pitch,
      rollDeg: t.roll,
      gForce: t.gForce,
      groundContact: t.groundContact
    };
    this.samples.push(sample);
    while (this.samples.length > MAX_SAMPLES || this.samples[0].timestampMs < t.timestamp - REPLAY_DURATION_MS) {
      this.samples.shift();
    }
  }

  public finish(touchdown: FlightTelemetry): LandingSample[] {
    this.record(touchdown, true);
    const replay = this.samples;
    this.reset();
    return replay;
  }

  public reset(): void {
    this.samples = [];
  }
}

const SAMPLE_COLUMNS = [
  'timestampMs', 'lat', 'lon', 'altitudeFt', 'aglFt', 'kias', 'groundSpeedKts',
  'vsFpm', 'headingDeg', 'pitchDeg', 'rollDeg', 'gForce', 'groundContact'
] as const;

function csvCell(value: string | number | boolean): string {
  if (typeof value !== 'string') return String(value);
  const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}

export function landingReplayCsv(record: LandingRecord): string {
  const columns = ['id', 'timestamp', 'aircraftId', 'aircraftName', 'rating',
    'touchdownVsFpm', 'touchdownGForce', 'touchdownRollDeg', 'touchdownGroundSpeedKts',
    'touchdownLat', 'touchdownLon', ...SAMPLE_COLUMNS];
  const summary = [record.id, record.timestamp, record.aircraftId, record.aircraftName, record.rating,
    record.vsFpm, record.gForce, record.rollDeg, record.groundSpeedKts, record.lat, record.lon];
  const rows = (record.replay?.length ? record.replay : [null]).map((sample) => [
    ...summary, ...SAMPLE_COLUMNS.map((key) => sample?.[key] ?? '')
  ].map(csvCell).join(','));
  return [columns.join(','), ...rows].join('\r\n') + '\r\n';
}
