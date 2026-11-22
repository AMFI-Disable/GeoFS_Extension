export interface RadarTrafficContact {
  id: string;
  callsign: string;
  aircraft: string;
  lat: number;
  lon: number;
  altFt: number;
  heading: number;
  speedKts: number;
  vsFpm: number;
}

export interface RadarRunwaySegment {
  icao: string;
  t1: [number, number];
  t2: [number, number];
}

export interface RadarSnapshot {
  lat: number;
  lon: number;
  heading: number;
  groundSpeed: number;
  traffic: RadarTrafficContact[];
  runways: RadarRunwaySegment[];
}

export function collectRadarSnapshot(
  lat: number,
  lon: number,
  heading: number,
  groundSpeed: number
): RadarSnapshot | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const cosLat = Math.max(0.15, Math.cos((lat * Math.PI) / 180));
  const traffic: Array<RadarTrafficContact & { distNm: number }> = [];

  const mpUsers = (
    window.geofs as unknown as {
      multiplayer?: {
        users?: Record<
          string,
          {
            id?: string | number;
            callsign?: string;
            cs?: string;
            aircraftName?: string;
            ac?: string | number;
            lla?: number[];
            htr?: number[];
            st?: { as?: number; vs?: number };
            lastUpdate?: { co?: number[]; st?: { as?: number; vs?: number }; ac?: string | number };
          }
        >;
      };
    }
  )?.multiplayer?.users;

  if (mpUsers) {
    for (const [key, u] of Object.entries(mpUsers)) {
      const co = u?.lla ?? u?.lastUpdate?.co;
      if (!Array.isArray(co) || co.length < 2) continue;
      const uLat = Number(co[0]);
      const uLon = Number(co[1]);
      if (!Number.isFinite(uLat) || !Number.isFinite(uLon)) continue;
      const distNm = Math.hypot((uLat - lat) * 60, (uLon - lon) * 60 * cosLat);
      if (distNm < 0.005 || distNm > 220) continue;
      const altFt = Number.isFinite(co[2]) ? Math.round(Number(co[2]) * 3.28084) : 0;
      const hdg = Number.isFinite(u?.htr?.[0])
        ? Math.round(Number(u.htr![0]))
        : Number.isFinite(co[3])
          ? Math.round(Number(co[3]))
          : 0;
      const spd = Number(u?.st?.as ?? u?.lastUpdate?.st?.as ?? 0);
      const vs = Number(u?.st?.vs ?? u?.lastUpdate?.st?.vs ?? 0);
      traffic.push({
        id: String(u?.id ?? key),
        callsign: String(u?.callsign || u?.cs || `FLT-${key.slice(0, 5)}`).trim(),
        aircraft: String(u?.aircraftName || u?.ac || u?.lastUpdate?.ac || 'ACFT'),
        lat: uLat,
        lon: uLon,
        altFt,
        heading: ((hdg % 360) + 360) % 360,
        speedKts: Number.isFinite(spd) ? Math.round(spd) : 0,
        vsFpm: Number.isFinite(vs) ? Math.round(vs) : 0,
        distNm
      });
    }
  }
  traffic.sort((a, b) => a.distNm - b.distNm);

  const runways: RadarRunwaySegment[] = [];
  const nearRunways = window.geofs?.runways?.nearRunways;
  if (nearRunways) {
    for (const rw of Object.values(nearRunways)) {
      const t1 = rw?.threshold1;
      const t2 = rw?.threshold2;
      if (!Array.isArray(t1) || !Array.isArray(t2) || t1.length < 2 || t2.length < 2) continue;
      runways.push({
        icao: rw.icao || 'RWY',
        t1: [Number(t1[0]), Number(t1[1])],
        t2: [Number(t2[0]), Number(t2[1])]
      });
      if (runways.length >= 24) break;
    }
  }

  return {
    lat,
    lon,
    heading: Math.round(heading),
    groundSpeed: Math.round(groundSpeed),
    traffic: traffic.slice(0, 40).map(({ distNm: _d, ...rest }) => rest),
    runways
  };
}
