import type { LandingRecord } from '../types/settings';

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function formatLogbookCsv(records: LandingRecord[]): string {
  const header = ['ID', 'Timestamp', 'Aircraft ID', 'Aircraft Name', 'V/S (fpm)', 'G-Force', 'Roll (deg)', 'Ground Speed (kts)', 'Rating', 'Lat', 'Lon', 'Score', 'Bounces', 'Touchdown Zone', 'Calibrated V/S (fpm)', 'IAS (kt)', 'TAS (kt)', 'Pitch (deg)', 'Quality Feedback', 'Passenger Feedback'].join(',');
  const rows = records.map((r) => [
    r.id,
    r.timestamp,
    r.aircraftId,
    r.aircraftName,
    r.vsFpm,
    r.gForce,
    r.rollDeg,
    r.groundSpeedKts,
    r.rating,
    r.lat,
    r.lon,
    r.score ?? '',
    r.bounces ?? '',
    r.inTouchdownZone === undefined ? '' : r.inTouchdownZone ? 'On Target' : 'Off Target',
    r.calibratedVsFpm ?? '',
    r.indicatedAirspeedKts ?? '',
    r.trueAirspeedKts ?? '',
    r.pitchDeg ?? '',
    r.qualityFeedback ?? '',
    r.passengerFeedback ?? ''
  ].map(escapeCsvCell).join(','));
  return [header, ...rows].join('\n');
}

export function triggerDownload(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
