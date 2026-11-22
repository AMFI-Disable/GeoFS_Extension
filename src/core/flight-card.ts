import type { LandingRecord } from '../types/settings';

export function downloadFlightCardPng(record: LandingRecord): void {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Native GeoFS dark background
  const grad = ctx.createLinearGradient(0, 0, 800, 420);
  grad.addColorStop(0, '#1a1a1a');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 420);

  // GeoFS Blue border
  ctx.strokeStyle = '#0d5f8d';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 772, 392);

  // Header
  ctx.fillStyle = '#00bbff';
  ctx.font = '700 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('GEOFS FLIGHT SUITE · TOUCHDOWN DEBRIEF', 36, 48);

  ctx.fillStyle = '#9e9e9e';
  ctx.font = '500 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(new Date(record.timestamp).toLocaleString(), 764, 48);
  ctx.textAlign = 'left';

  // Aircraft title
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 28px system-ui, -apple-system, sans-serif';
  ctx.fillText(record.aircraftName || `Aircraft ${record.aircraftId}`, 36, 90);

  // Rating & Stars
  const stars = record.stars ?? 3;
  const starStr = `${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}`;
  ctx.fillStyle = '#ffc107';
  ctx.font = '700 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${starStr}  ${record.rating.toUpperCase()}`, 36, 128);

  const authLabel =
    record.authenticFlight === undefined
      ? ''
      : record.authenticFlight
        ? 'AUTHENTIC FLIGHT'
        : 'PRACTICE SESSION';
  if (authLabel) {
    ctx.fillStyle = record.authenticFlight ? '#00bbff' : '#ffc107';
    ctx.font = '700 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(authLabel, 764, 125);
    ctx.textAlign = 'left';
  }

  // Telemetry grid
  const metrics: Array<[string, string]> = [
    ['SCORE', record.score !== undefined ? `${record.score.toFixed(1)} / 10` : '--'],
    ['TOUCHDOWN V/S', `${Math.round(record.vsFpm)} fpm`],
    ['G-FORCE', `${record.gForce.toFixed(2)} G`],
    ['GROUND SPEED', `${Math.round(record.groundSpeedKts)} kts`],
    ['ROLL ANGLE', `${record.rollDeg.toFixed(1)}°`],
    ['TOUCHDOWN ZONE', record.inTouchdownZone ? 'ON TARGET' : 'OFF TARGET']
  ];

  metrics.forEach(([label, val], idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 36 + col * 246;
    const y = 158 + row * 72;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(x, y, 232, 58);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 232, 58);

    ctx.fillStyle = '#9e9e9e';
    ctx.font = '700 10px system-ui, -apple-system, sans-serif';
    ctx.fillText(label, x + 12, y + 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(val, x + 12, y + 44);
  });

  // Phase critique footer
  if (record.phaseCritique) {
    ctx.fillStyle = '#121212';
    ctx.fillRect(36, 310, 728, 76);
    ctx.strokeStyle = 'rgba(13, 95, 141, 0.6)';
    ctx.strokeRect(36, 310, 728, 76);

    ctx.fillStyle = '#e0e0e0';
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.fillText(`DEP: ${record.phaseCritique.departure}`, 48, 332);
    ctx.fillText(`CRZ: ${record.phaseCritique.cruise}`, 48, 352);
    ctx.fillText(`APP: ${record.phaseCritique.approach}`, 48, 372);
  }

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `geofs-flight-card-${record.id}.png`;
  link.click();
}
