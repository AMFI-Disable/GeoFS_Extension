import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { triggerDownload } from '../core/logbook-export';
import { fetchAdsbTraffic, syncGlobalRelay } from '../shared/global-traffic';
import type { RadarSnapshot, RadarTraffic } from '../shared/settings-store';
import type { SimBriefOfp } from '../shared/simbrief';

interface TrailPoint {
  lat: number;
  lon: number;
  altFt: number;
  ts: number;
}

interface RadarPanelProps {
  radar: RadarSnapshot | null | undefined;
  ownAltFt: number;
  ownKias: number;
  ownName: string;
  simbriefOfp: SimBriefOfp | null;
  fullTab?: boolean;
  onPopOut?: () => void;
}

type TrafficSourceMode = 'both' | 'geofs' | 'adsb';

const RANGES_NM = [5, 15, 40, 100, 250] as const;

const WORLD_HUBS: ReadonlyArray<{ code: string; lat: number; lon: number }> = [
  { code: 'KSFO', lat: 37.6213, lon: -122.379 },
  { code: 'KJFK', lat: 40.6413, lon: -73.7781 },
  { code: 'EGLL', lat: 51.47, lon: -0.4543 },
  { code: 'RJTT', lat: 35.5494, lon: 139.7798 },
  { code: 'OMDB', lat: 25.2532, lon: 55.3657 }
];

function altColor(altFt: number): string {
  if (altFt < 3000) return '#22c55e';
  if (altFt < 18000) return '#38bdf8';
  return '#a855f7';
}

function formatFl(altFt: number): string {
  if (altFt >= 18000) return `FL${Math.round(altFt / 100)}`;
  return `${Math.max(0, Math.round(altFt / 100)).toString().padStart(3, '0')}`;
}

export function RadarPanel({
  radar,
  ownAltFt,
  ownKias,
  ownName,
  simbriefOfp,
  fullTab = false,
  onPopOut
}: RadarPanelProps) {
  const [rangeNm, setRangeNm] = useState<number>(40);
  const [hdgUp, setHdgUp] = useState(false);
  const [sourceMode, setSourceMode] = useState<TrafficSourceMode>('both');
  const [panCenter, setPanCenter] = useState<{ lat: number; lon: number; label: string } | null>(null);
  const [filterText, setFilterText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [adsbTraffic, setAdsbTraffic] = useState<RadarTraffic[]>([]);
  const [relayTraffic, setRelayTraffic] = useState<RadarTraffic[]>([]);
  const [relayUrl, setRelayUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('geofs_ext_radar_relay_url') || '';
    } catch {
      return '';
    }
  });
  const dragRef = useRef<{ x: number; y: number; lat: number; lon: number } | null>(null);

  const centerLat = panCenter?.lat ?? radar?.lat ?? 37.6213;
  const centerLon = panCenter?.lon ?? radar?.lon ?? -122.379;
  const isLockedOwn = panCenter === null && Boolean(radar);

  useEffect(() => {
    try {
      localStorage.setItem('geofs_ext_radar_relay_url', relayUrl);
    } catch {
      // ignore storage errors
    }
  }, [relayUrl]);

  useEffect(() => {
    if (!radar || !Number.isFinite(radar.lat) || !Number.isFinite(radar.lon)) return;
    setTrail((prev) => {
      const last = prev[prev.length - 1];
      if (last && Math.hypot(last.lat - radar.lat, last.lon - radar.lon) < 0.0004) return prev;
      const next = [...prev, { lat: radar.lat, lon: radar.lon, altFt: ownAltFt, ts: Date.now() }];
      return next.length > 300 ? next.slice(next.length - 300) : next;
    });
  }, [radar?.lat, radar?.lon, ownAltFt]);

  // Poll free real-world ADS-B traffic (airplanes.live) every 10s when Both or ADS-B is active
  useEffect(() => {
    if (sourceMode === 'geofs') {
      setAdsbTraffic([]);
      return;
    }
    let cancelled = false;
    const pollAdsb = () => {
      void fetchAdsbTraffic(centerLat, centerLon, Math.min(250, Math.max(25, rangeNm))).then((list) => {
        if (!cancelled) setAdsbTraffic(list);
      });
    };
    pollAdsb();
    const timer = setInterval(pollAdsb, 10000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [sourceMode, Math.round(centerLat * 10), Math.round(centerLon * 10), rangeNm]);

  // Optional user-configured Global GeoFS Relay sync every 10s
  useEffect(() => {
    if (!relayUrl.trim()) {
      setRelayTraffic([]);
      return;
    }
    let cancelled = false;
    const pollRelay = () => {
      const ownPayload = radar
        ? {
            callsign: ownName.slice(0, 12),
            aircraft: ownName,
            lat: radar.lat,
            lon: radar.lon,
            altFt: ownAltFt,
            heading: radar.heading,
            speedKts: radar.groundSpeed
          }
        : null;
      void syncGlobalRelay(relayUrl, ownPayload).then((list) => {
        if (!cancelled) setRelayTraffic(list);
      });
    };
    pollRelay();
    const timer = setInterval(pollRelay, 10000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [relayUrl, Boolean(radar)]);

  const projected = useMemo(() => {
    const cosLat = Math.max(0.15, Math.cos((centerLat * Math.PI) / 180));
    const pxPerNm = 110 / rangeNm;
    const useHdgUp = hdgUp && isLockedOwn && Boolean(radar);
    const rotRad = useHdgUp && radar ? (-radar.heading * Math.PI) / 180 : 0;
    const cosR = Math.cos(rotRad);
    const sinR = Math.sin(rotRad);

    const project = (lat: number, lon: number): { x: number; y: number; distNm: number; brgDeg: number } => {
      const dNorthNm = (lat - centerLat) * 60;
      const dEastNm = (lon - centerLon) * 60 * cosLat;
      const distNm = Math.hypot(dNorthNm, dEastNm);
      const brgDeg = ((Math.atan2(dEastNm, dNorthNm) * 180) / Math.PI + 360) % 360;
      const rawX = dEastNm * pxPerNm;
      const rawY = -dNorthNm * pxPerNm;
      return {
        x: rawX * cosR - rawY * sinR,
        y: rawX * sinR + rawY * cosR,
        distNm,
        brgDeg
      };
    };

    const rawTraffic: RadarTraffic[] = [];
    if (sourceMode === 'both' || sourceMode === 'geofs') {
      for (const t of radar?.traffic ?? []) {
        rawTraffic.push({ ...t, source: t.source ?? 'geofs' });
      }
      for (const t of relayTraffic) {
        rawTraffic.push(t);
      }
    }
    if (sourceMode === 'both' || sourceMode === 'adsb') {
      for (const t of adsbTraffic) {
        rawTraffic.push(t);
      }
    }

    const q = filterText.trim().toLowerCase();
    const traffic = rawTraffic
      .filter((t) => !q || t.callsign.toLowerCase().includes(q) || t.aircraft.toLowerCase().includes(q))
      .map((t) => {
        const p = project(t.lat, t.lon);
        const dAlt = Math.abs(t.altFt - ownAltFt);
        const isGeofsOwnProximity = isLockedOwn && t.source !== 'adsb';
        const tcas: 'RA' | 'TA' | null =
          isGeofsOwnProximity && p.distNm <= 2 && dAlt <= 800
            ? 'RA'
            : isGeofsOwnProximity && p.distNm <= 5 && dAlt <= 1500
              ? 'TA'
              : null;
        const leadNm = (Math.max(0, t.speedKts) / 60) * 1.0;
        const tRad = (t.heading * Math.PI) / 180;
        const leadPt = project(
          t.lat + (Math.cos(tRad) * leadNm) / 60,
          t.lon + (Math.sin(tRad) * leadNm) / (60 * cosLat)
        );
        return { ...t, ...p, tcas, leadX: leadPt.x, leadY: leadPt.y };
      })
      .sort((a, b) => a.distNm - b.distNm);

    const runways = (radar?.runways ?? []).map((rw) => {
      const p1 = project(rw.t1[0], rw.t1[1]);
      const p2 = project(rw.t2[0], rw.t2[1]);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy) || 1;
      const extPx = Math.min(80, 10 * pxPerNm);
      return {
        icao: rw.icao,
        p1,
        p2,
        ext1: { x: p1.x - (dx / len) * extPx, y: p1.y - (dy / len) * extPx },
        ext2: { x: p2.x + (dx / len) * extPx, y: p2.y + (dy / len) * extPx }
      };
    });

    const routePts = (simbriefOfp?.waypoints || []).map((w) => ({
      ident: w.ident,
      ...project(w.lat, w.lon)
    }));

    const trailSegs: Array<{ x1: number; y1: number; x2: number; y2: number; color: string }> = [];
    for (let i = 1; i < trail.length; i++) {
      const a = project(trail[i - 1].lat, trail[i - 1].lon);
      const b = project(trail[i].lat, trail[i].lon);
      trailSegs.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, color: altColor(trail[i].altFt) });
    }

    const ownPt = radar ? project(radar.lat, radar.lon) : null;
    const alerts = traffic.filter((t) => t.tcas !== null);
    return { traffic, runways, routePts, trailSegs, ownPt, alerts, useHdgUp };
  }, [centerLat, centerLon, isLockedOwn, radar, adsbTraffic, relayTraffic, sourceMode, rangeNm, hdgUp, filterText, ownAltFt, simbriefOfp, trail]);

  const exportGpx = () => {
    const pts = trail
      .map(
        (p) =>
          `      <trkpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}"><ele>${(p.altFt / 3.28084).toFixed(1)}</ele><time>${new Date(p.ts).toISOString()}</time></trkpt>`
      )
      .join('\n');
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="GeoFS Flight Suite">\n  <trk><name>${ownName}</name><trkseg>\n${pts}\n  </trkseg></trk>\n</gpx>`;
    triggerDownload(`geofs-radar-track-${Date.now()}.gpx`, gpx, 'application/gpx+xml');
  };

  const exportGeoJson = () => {
    const geo = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { aircraft: ownName, exportedAt: new Date().toISOString() },
          geometry: {
            type: 'LineString',
            coordinates: trail.map((p) => [p.lon, p.lat, Math.round(p.altFt / 3.28084)])
          }
        }
      ]
    };
    triggerDownload(`geofs-radar-track-${Date.now()}.geojson`, JSON.stringify(geo, null, 2), 'application/geo+json');
  };

  const selectedTraffic = projected.traffic.find((t) => t.id === selectedId);
  const hasRa = projected.alerts.some((a) => a.tcas === 'RA');

  const onSvgPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, y: e.clientY, lat: centerLat, lon: centerLon };
  };

  const onSvgPointerMove = (e: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) < 4) return;
    const nmPerPx = rangeNm / 110;
    const cosLat = Math.max(0.15, Math.cos((drag.lat * Math.PI) / 180));
    const nextLat = Math.max(-82, Math.min(82, drag.lat + (dy * nmPerPx) / 60));
    const nextLon = ((drag.lon - (dx * nmPerPx) / (60 * cosLat) + 540) % 360) - 180;
    setPanCenter({ lat: nextLat, lon: nextLon, label: `${nextLat.toFixed(2)}, ${nextLon.toFixed(2)}` });
  };

  const onSvgPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      style={
        fullTab
          ? 'display:grid;grid-template-columns:minmax(0,1.45fr) minmax(280px,1fr);gap:12px;align-items:start;'
          : 'display:flex;flex-direction:column;gap:8px;'
      }
    >
      <div class="panel-card" style="padding:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:4px;flex-wrap:wrap;">
          <span class="section-heading" style="margin:0;">Global ATC Radar</span>
          <div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap;">
            {RANGES_NM.map((r) => (
              <button
                key={r}
                type="button"
                class={`chip-btn ${rangeNm === r ? 'active' : ''}`}
                style="padding:2px 5px;font-size:10px;"
                onClick={() => setRangeNm(r)}
              >
                {r}
              </button>
            ))}
            <button
              type="button"
              class={`chip-btn ${projected.useHdgUp ? 'active' : ''}`}
              style="padding:2px 5px;font-size:10px;"
              onClick={() => setHdgUp((v) => !v)}
            >
              {projected.useHdgUp ? 'HDG' : 'N-UP'}
            </button>
            {!fullTab && onPopOut && (
              <button
                type="button"
                class="chip-btn"
                style="padding:2px 5px;font-size:10px;"
                title="Open full-screen ATC Radar tab"
                onClick={onPopOut}
              >
                ↗
              </button>
            )}
          </div>
        </div>

        {/* Traffic Source & World Hub Selector */}
        <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:6px;">
          <div style="display:flex;gap:3px;">
            {(['both', 'geofs', 'adsb'] as const).map((m) => (
              <button
                key={m}
                type="button"
                class={`chip-btn ${sourceMode === m ? 'active' : ''}`}
                style="padding:2px 6px;font-size:10px;"
                onClick={() => setSourceMode(m)}
              >
                {m === 'both' ? 'Both' : m === 'geofs' ? 'GeoFS MP' : 'Real ADS-B'}
              </button>
            ))}
          </div>
          <div style="display:flex;gap:3px;flex-wrap:wrap;">
            <button
              type="button"
              class={`chip-btn ${panCenter === null ? 'active' : ''}`}
              style="padding:2px 5px;font-size:9.5px;"
              onClick={() => setPanCenter(null)}
            >
              OWN
            </button>
            {WORLD_HUBS.map((h) => (
              <button
                key={h.code}
                type="button"
                class={`chip-btn ${panCenter?.label === h.code ? 'active' : ''}`}
                style="padding:2px 5px;font-size:9.5px;"
                onClick={() => setPanCenter({ lat: h.lat, lon: h.lon, label: h.code })}
              >
                {h.code}
              </button>
            ))}
          </div>
        </div>

        {projected.alerts.length > 0 && (
          <div
            style={`padding:4px 8px;margin-bottom:6px;border-radius:4px;font-size:11px;font-weight:800;text-align:center;background:${hasRa ? 'rgba(239,68,68,0.22)' : 'rgba(245,158,11,0.2)'};border:1px solid ${hasRa ? '#ef4444' : '#f59e0b'};color:${hasRa ? '#fca5a5' : '#fde68a'};`}
          >
            TCAS {hasRa ? 'RA — TRAFFIC ALERT' : 'TA — PROXIMITY'}: {projected.alerts[0].callsign} ({projected.alerts[0].distNm.toFixed(1)} NM)
          </div>
        )}

        <svg
          viewBox="-120 -120 240 240"
          onPointerDown={onSvgPointerDown}
          onPointerMove={onSvgPointerMove}
          onPointerUp={onSvgPointerUp}
          onPointerLeave={onSvgPointerUp}
          style={`width:100%;height:${fullTab ? '520px' : '240px'};display:block;background:#020617;border-radius:8px;border:1px solid rgba(56,189,248,0.25);cursor:grab;user-select:none;`}
        >
          {/* Range rings & crosshairs */}
          <circle cx="0" cy="0" r="36.6" fill="none" stroke="rgba(56,189,248,0.16)" stroke-width="0.7" stroke-dasharray="2,2" />
          <circle cx="0" cy="0" r="73.3" fill="none" stroke="rgba(56,189,248,0.16)" stroke-width="0.7" stroke-dasharray="2,2" />
          <circle cx="0" cy="0" r="110" fill="none" stroke="rgba(56,189,248,0.28)" stroke-width="0.9" />
          <line x1="-110" y1="0" x2="110" y2="0" stroke="rgba(148,163,184,0.12)" stroke-width="0.6" />
          <line x1="0" y1="-110" x2="0" y2="110" stroke="rgba(148,163,184,0.12)" stroke-width="0.6" />
          <text x="2" y="-102" font-size="7" fill="#64748b">{projected.useHdgUp && radar ? `${radar.heading}°` : 'N'}</text>
          <text x="2" y="-39" font-size="6" fill="#475569">{Math.round(rangeNm / 3)}NM</text>
          <text x="2" y="-75" font-size="6" fill="#475569">{Math.round((rangeNm * 2) / 3)}NM</text>

          {/* Runways & extended final approach cones */}
          {projected.runways.map((rw, idx) => (
            <g key={`${rw.icao}-${idx}`}>
              <line x1={rw.ext1.x} y1={rw.ext1.y} x2={rw.p1.x} y2={rw.p1.y} stroke="rgba(56,189,248,0.28)" stroke-width="0.9" stroke-dasharray="3,2" />
              <line x1={rw.p2.x} y1={rw.p2.y} x2={rw.ext2.x} y2={rw.ext2.y} stroke="rgba(56,189,248,0.28)" stroke-width="0.9" stroke-dasharray="3,2" />
              <line x1={rw.p1.x} y1={rw.p1.y} x2={rw.p2.x} y2={rw.p2.y} stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
            </g>
          ))}

          {/* SimBrief LNAV route overlay */}
          {projected.routePts.length > 1 && (
            <polyline
              fill="none"
              stroke="#e879f9"
              stroke-width="1.2"
              stroke-dasharray="4,2"
              points={projected.routePts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
            />
          )}
          {projected.routePts.map((w, i) =>
            Math.abs(w.x) <= 115 && Math.abs(w.y) <= 115 ? (
              <g key={`${w.ident}-${i}`} transform={`translate(${w.x.toFixed(1)},${w.y.toFixed(1)})`}>
                <polygon points="0,-2.5 2.5,0 0,2.5 -2.5,0" fill="#e879f9" />
                <text x="4" y="2" font-size="5.5" fill="#f0abfc">{w.ident}</text>
              </g>
            ) : null
          )}

          {/* Own breadcrumb trail */}
          {projected.trailSegs.map((s, i) => (
            <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.color} stroke-width="1.4" opacity="0.85" />
          ))}

          {/* Traffic targets (GeoFS MP = cyan, ADS-B = gold, Relay = green) */}
          {projected.traffic.map((t) => {
            if (Math.abs(t.x) > 116 || Math.abs(t.y) > 116) return null;
            const baseColor = t.source === 'adsb' ? '#facc15' : t.source === 'relay' ? '#4ade80' : '#22d3ee';
            const color = t.tcas === 'RA' ? '#ef4444' : t.tcas === 'TA' ? '#f59e0b' : t.id === selectedId ? '#ffffff' : baseColor;
            const arrow = t.vsFpm > 200 ? '↑' : t.vsFpm < -200 ? '↓' : '';
            return (
              <g key={t.id} style="cursor:pointer;" onClick={() => setSelectedId(t.id)}>
                <line x1={t.x} y1={t.y} x2={t.leadX} y2={t.leadY} stroke={color} stroke-width="0.8" opacity="0.65" />
                <polygon
                  points="0,-3.2 3.2,0 0,3.2 -3.2,0"
                  transform={`translate(${t.x.toFixed(1)},${t.y.toFixed(1)})`}
                  fill={color}
                />
                <text x={t.x + 4.5} y={t.y - 1} font-size="5.2" fill={color} font-weight="700">
                  {t.callsign.slice(0, 8)}
                </text>
                <text x={t.x + 4.5} y={t.y + 5.2} font-size="4.8" fill="#94a3b8">
                  {formatFl(t.altFt)}{arrow} {t.speedKts}kt
                </text>
              </g>
            );
          })}

          {/* Ownship icon */}
          {projected.ownPt && Math.abs(projected.ownPt.x) <= 116 && Math.abs(projected.ownPt.y) <= 116 && (
            <g transform={`translate(${projected.ownPt.x.toFixed(1)},${projected.ownPt.y.toFixed(1)}) rotate(${projected.useHdgUp ? 0 : radar?.heading ?? 0})`}>
              <polygon points="0,-7 5,5 0,2 -5,5" fill="#10b981" stroke="#022c22" stroke-width="0.7" />
            </g>
          )}
        </svg>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:10px;color:var(--muted);flex-wrap:wrap;gap:4px;">
          <span>
            {panCenter ? `PAN: ${panCenter.label}` : radar ? `OWN: ${formatFl(ownAltFt)} · ${ownKias}kt · ${radar.heading}°` : 'VIEW: KSFO'}
          </span>
          <span>
            <span style="color:#22d3ee;">■ MP</span> · <span style="color:#facc15;">■ ADS-B</span> · {projected.traffic.length} TFC
          </span>
        </div>

        <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;">
          <button type="button" class="chip-btn" disabled={trail.length < 2} onClick={exportGpx}>
            Export GPX
          </button>
          <button type="button" class="chip-btn" disabled={trail.length < 2} onClick={exportGeoJson}>
            Export GeoJSON
          </button>
          <button type="button" class="chip-btn" onClick={() => setTrail([])}>
            Clear Trail
          </button>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        {selectedTraffic && (
          <div class="panel-card" style="padding:8px;font-size:11px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <strong>
                {selectedTraffic.callsign} ({selectedTraffic.aircraft}){' '}
                <span class="badge" style="font-size:9px;">
                  {selectedTraffic.source === 'adsb' ? 'ADS-B' : selectedTraffic.source === 'relay' ? 'RELAY' : 'GEOFS'}
                </span>
              </strong>
              <button type="button" class="chip-btn" onClick={() => setSelectedId(null)}>✕</button>
            </div>
            <div class="muted-hint">
              DIST {selectedTraffic.distNm.toFixed(1)} NM · BRG {Math.round(selectedTraffic.brgDeg)}° · ALT {selectedTraffic.altFt.toLocaleString()} ft · GS {selectedTraffic.speedKts} kt · HDG {selectedTraffic.heading}°
            </div>
          </div>
        )}

        <div class="panel-card" style="padding:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
            <span class="section-heading" style="margin:0;">ATC Traffic Strip</span>
            <input
              type="text"
              placeholder="Filter callsign..."
              value={filterText}
              onInput={(e) => setFilterText((e.target as HTMLInputElement).value)}
              style="width:120px;padding:2px 6px;font-size:11px;"
            />
          </div>
          {projected.traffic.length === 0 ? (
            <div class="muted-hint" style="font-size:11px;">No aircraft in range. Pan to KSFO/KJFK/EGLL or switch to Both / Real ADS-B.</div>
          ) : (
            <div style={`max-height:${fullTab ? '360px' : '150px'};overflow-y:auto;display:flex;flex-direction:column;gap:3px;`}>
              {projected.traffic.slice(0, fullTab ? 60 : 25).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  style={`display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;padding:4px 6px;border-radius:4px;border:1px solid ${t.id === selectedId ? '#38bdf8' : 'rgba(148,163,184,0.18)'};background:rgba(255,255,255,0.03);color:inherit;font-size:10.5px;cursor:pointer;`}
                >
                  <span style="font-weight:700;display:flex;align-items:center;gap:4px;">
                    <span style={`color:${t.source === 'adsb' ? '#facc15' : t.source === 'relay' ? '#4ade80' : '#22d3ee'};`}>●</span>
                    {t.callsign}
                  </span>
                  <span style="color:var(--muted);">
                    {formatFl(t.altFt)} · {t.speedKts}kt · {t.distNm.toFixed(1)}NM
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <details class="panel-card" style="padding:8px;">
          <summary style="font-size:11px;font-weight:700;cursor:pointer;">Global GeoFS Relay (Optional)</summary>
          <div class="muted-hint" style="font-size:10px;margin:4px 0 6px;">
            Connect a free Cloudflare Worker / Firebase JSON relay URL to share &amp; receive global GeoFS multiplayer positions across sectors.
          </div>
          <input
            type="url"
            placeholder="https://your-relay.workers.dev/traffic"
            value={relayUrl}
            onInput={(e) => setRelayUrl((e.target as HTMLInputElement).value)}
            style="width:100%;font-size:11px;"
          />
        </details>
      </div>
    </div>
  );
}
