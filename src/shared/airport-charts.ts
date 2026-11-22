export interface AirportChartEntry {
  chartName: string;
  chartCode: string;
  pdfUrl: string;
}

export interface CrosswindResult {
  headwindKts: number;
  crosswindKts: number;
  side: 'LEFT' | 'RIGHT' | 'CALM';
}

export function computeRunwayWind(
  runwayHdgDeg: number,
  windFromDeg: number,
  windSpeedKts: number
): CrosswindResult {
  if (!Number.isFinite(windSpeedKts) || windSpeedKts <= 0) {
    return { headwindKts: 0, crosswindKts: 0, side: 'CALM' };
  }
  const diffRad = (((windFromDeg - runwayHdgDeg + 540) % 360) - 180) * (Math.PI / 180);
  const headwindKts = Math.round(windSpeedKts * Math.cos(diffRad));
  const rawCross = windSpeedKts * Math.sin(diffRad);
  const crosswindKts = Math.round(Math.abs(rawCross));
  const side: 'LEFT' | 'RIGHT' | 'CALM' =
    crosswindKts === 0 ? 'CALM' : rawCross > 0 ? 'RIGHT' : 'LEFT';
  return { headwindKts, crosswindKts, side };
}

export async function fetchFaaCharts(icao: string): Promise<AirportChartEntry[]> {
  const clean = icao.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,4}$/.test(clean)) return [];
  const url = `https://api.aviationapi.com/v1/charts?apt=${encodeURIComponent(clean)}`;
  try {
    const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(8000)
      : undefined;
    const resp = await fetch(url, { headers: { Accept: 'application/json' }, ...(signal ? { signal } : {}) });
    if (!resp.ok) return [];
    const data = (await resp.json()) as Record<string, Array<{ chart_name?: string; chart_code?: string; pdf_path?: string }>>;
    const list = data[clean] ?? Object.values(data)[0] ?? [];
    if (!Array.isArray(list)) return [];
    return list
      .filter((c) => c?.pdf_path)
      .slice(0, 24)
      .map((c) => ({
        chartName: c.chart_name || 'Chart',
        chartCode: c.chart_code || 'INFO',
        pdfUrl: String(c.pdf_path)
      }));
  } catch {
    return [];
  }
}
