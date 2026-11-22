import type { RadarTraffic } from './settings-store';

interface AirplanesLiveAc {
  hex?: string;
  flight?: string;
  r?: string;
  t?: string;
  lat?: number;
  lon?: number;
  alt_baro?: number | 'ground';
  alt_geom?: number;
  track?: number;
  gs?: number;
  baro_rate?: number;
}

function timeoutSignal(ms: number): AbortSignal | undefined {
  return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(ms)
    : undefined;
}

export async function fetchAdsbTraffic(
  lat: number,
  lon: number,
  radiusNm: number
): Promise<RadarTraffic[]> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return [];
  const dist = Math.max(5, Math.min(250, Math.round(radiusNm)));
  const url = `https://api.airplanes.live/v2/point/${lat.toFixed(3)}/${lon.toFixed(3)}/${dist}`;
  try {
    const resp = await fetch(url, { headers: { Accept: 'application/json' }, signal: timeoutSignal(8000) });
    if (!resp.ok) return [];
    const data = (await resp.json()) as { ac?: AirplanesLiveAc[] };
    if (!Array.isArray(data.ac)) return [];
    const out: RadarTraffic[] = [];
    for (const ac of data.ac) {
      if (typeof ac.lat !== 'number' || typeof ac.lon !== 'number') continue;
      const altFt =
        ac.alt_baro === 'ground'
          ? 0
          : typeof ac.alt_baro === 'number'
            ? Math.round(ac.alt_baro)
            : typeof ac.alt_geom === 'number'
              ? Math.round(ac.alt_geom)
              : 0;
      const cs = (ac.flight || ac.r || ac.hex || 'ADSB').trim();
      out.push({
        id: `adsb-${ac.hex || cs}`,
        callsign: cs,
        aircraft: (ac.t || 'ADSB').trim(),
        lat: ac.lat,
        lon: ac.lon,
        altFt,
        heading: typeof ac.track === 'number' ? Math.round(((ac.track % 360) + 360) % 360) : 0,
        speedKts: typeof ac.gs === 'number' ? Math.round(ac.gs) : 0,
        vsFpm: typeof ac.baro_rate === 'number' ? Math.round(ac.baro_rate) : 0,
        source: 'adsb'
      });
      if (out.length >= 80) break;
    }
    return out;
  } catch {
    return [];
  }
}

export async function syncGlobalRelay(
  relayUrl: string,
  ownship: { callsign: string; aircraft: string; lat: number; lon: number; altFt: number; heading: number; speedKts: number } | null
): Promise<RadarTraffic[]> {
  const clean = relayUrl.trim();
  if (!clean || !/^https?:\/\//i.test(clean)) return [];
  try {
    if (ownship && Number.isFinite(ownship.lat) && Number.isFinite(ownship.lon)) {
      await fetch(clean, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ownship, ts: Date.now() }),
        signal: timeoutSignal(8000)
      }).catch(() => {});
    }
    const resp = await fetch(clean, { headers: { Accept: 'application/json' }, signal: timeoutSignal(8000) });
    if (!resp.ok) return [];
    const data = (await resp.json()) as { traffic?: RadarTraffic[] } | RadarTraffic[];
    const list = Array.isArray(data) ? data : Array.isArray(data?.traffic) ? data.traffic : [];
    return list
      .filter((t) => Number.isFinite(t?.lat) && Number.isFinite(t?.lon))
      .slice(0, 120)
      .map((t) => ({ ...t, id: `rly-${t.id || t.callsign}`, source: 'relay' as const }));
  } catch {
    return [];
  }
}
