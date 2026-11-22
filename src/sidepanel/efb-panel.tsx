import { useEffect, useState } from 'preact/hooks';
import { computeRunwayWind, fetchFaaCharts, type AirportChartEntry } from '../shared/airport-charts';
import {
  generateRandomJob,
  getPilotRank,
  loadCareerProfile,
  saveCareerProfile,
  type CareerProfile
} from '../shared/career-jobs';
import { loadLogbook } from '../shared/settings-store';

interface EfbPanelProps {
  ownCallsign: string;
}

const ATC_TEMPLATES: ReadonlyArray<{ label: string; text: (freq: string, cs: string, apt: string) => string }> = [
  {
    label: 'IFR Clearance',
    text: (f, cs, apt) => `[${f}] ${apt} Delivery, ${cs} requesting IFR clearance as filed.`
  },
  {
    label: 'Push & Start',
    text: (f, cs, apt) => `[${f}] ${apt} Ground, ${cs} ready for pushback and engine start.`
  },
  {
    label: 'Ready T/O',
    text: (f, cs, apt) => `[${f}] ${apt} Tower, ${cs} holding short, ready for departure.`
  },
  {
    label: 'Final Approach',
    text: (f, cs, apt) => `[${f}] ${apt} Tower, ${cs} established on final, requesting landing clearance.`
  },
  {
    label: 'Clear of RWY',
    text: (f, cs, apt) => `[${f}] ${apt} Ground, ${cs} vacated runway, requesting taxi to gate.`
  }
];

export function EfbPanel({ ownCallsign }: EfbPanelProps) {
  const [icao, setIcao] = useState('KSFO');
  const [charts, setCharts] = useState<AirportChartEntry[]>([]);
  const [chartStatus, setChartStatus] = useState('');
  const [rwyHdg, setRwyHdg] = useState(280);
  const [windDir, setWindDir] = useState(300);
  const [windSpd, setWindSpd] = useState(14);

  const [career, setCareer] = useState<CareerProfile>({ xp: 0, completedCount: 0, activeJob: null });
  const [jobMsg, setJobMsg] = useState('');

  const [freq, setFreq] = useState('121.900');
  const [copiedMsg, setCopiedMsg] = useState('');

  useEffect(() => {
    void loadCareerProfile().then(setCareer);
  }, []);

  const wind = computeRunwayWind(rwyHdg, windDir, windSpd);
  const cleanIcao = icao.trim().toUpperCase() || 'KSFO';

  const handleLoadCharts = async () => {
    setChartStatus('Loading FAA charts...');
    const res = await fetchFaaCharts(cleanIcao);
    setCharts(res);
    setChartStatus(res.length > 0 ? `${res.length} FAA charts found` : 'No US FAA charts — use SkyVector / ChartFox links below.');
  };

  const handleNewJob = () => {
    const next: CareerProfile = { ...career, activeJob: generateRandomJob() };
    setCareer(next);
    setJobMsg('');
    void saveCareerProfile(next);
  };

  const handleCompleteJob = async () => {
    if (!career.activeJob) return;
    const logbook = await loadLogbook();
    const latest = logbook[0];
    const stars = latest?.stars ?? 3;
    const authBonus = latest?.authenticFlight ? 1.25 : 1.0;
    const earned = Math.round(career.activeJob.rewardXp * (0.6 + stars * 0.1) * authBonus);
    const next: CareerProfile = {
      xp: career.xp + earned,
      completedCount: career.completedCount + 1,
      activeJob: null
    };
    setCareer(next);
    setJobMsg(`+${earned} XP awarded (${stars}★${latest?.authenticFlight ? ' Authentic' : ''})`);
    void saveCareerProfile(next);
  };

  const handleCopyPhrase = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg('Copied ATC call to clipboard!');
    } catch {
      setCopiedMsg(text);
    }
    setTimeout(() => setCopiedMsg(''), 2500);
  };

  return (
    <div style="display:flex;flex-direction:column;gap:8px;">
      {/* 1. Career & Random Flight Jobs */}
      <div class="panel-card" style="padding:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span class="section-heading" style="margin:0;">Pilot Career &amp; Jobs</span>
          <span class="badge badge--ok">{getPilotRank(career.xp)} · {career.xp.toLocaleString()} XP</span>
        </div>
        {career.activeJob ? (
          <div style="font-size:11px;display:flex;flex-direction:column;gap:4px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong>{career.activeJob.origin} → {career.activeJob.destination}</strong>
              <span class="badge">{career.activeJob.jobType}</span>
            </div>
            <div class="muted-hint">
              {career.activeJob.distanceNm} NM · Payload {career.activeJob.payloadKg.toLocaleString()} kg · Base +{career.activeJob.rewardXp} XP
            </div>
            <div style="display:flex;gap:4px;margin-top:2px;">
              <button type="button" class="btn-sm" onClick={() => void handleCompleteJob()}>
                Complete &amp; Claim XP
              </button>
              <button type="button" class="chip-btn" onClick={handleNewJob}>
                Reroll
              </button>
            </div>
          </div>
        ) : (
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <span class="muted-hint" style="font-size:11px;">Completed: {career.completedCount} flights</span>
            <button type="button" class="btn-sm" onClick={handleNewJob}>
              Generate Flight Job
            </button>
          </div>
        )}
        {jobMsg && <div style="font-size:10.5px;color:var(--accent-strong);margin-top:4px;font-weight:700;">{jobMsg}</div>}
      </div>

      {/* 2. Free Airport Charts & Crosswind Calculator */}
      <div class="panel-card" style="padding:8px;">
        <div class="section-heading">Airport Charts &amp; Crosswind</div>
        <div style="display:flex;gap:6px;margin-bottom:6px;">
          <input
            type="text"
            maxLength={4}
            placeholder="ICAO (e.g. KSFO)"
            value={icao}
            onInput={(e) => setIcao((e.target as HTMLInputElement).value.toUpperCase())}
            style="width:90px;text-transform:uppercase;font-weight:700;"
          />
          <button type="button" class="btn-sm" onClick={() => void handleLoadCharts()}>
            FAA Charts
          </button>
          <a
            href={`https://skyvector.com/airport/${encodeURIComponent(cleanIcao)}`}
            target="_blank"
            rel="noreferrer"
            class="chip-btn"
            style="text-decoration:none;display:inline-flex;align-items:center;"
          >
            SkyVector ↗
          </a>
        </div>
        {chartStatus && <div class="muted-hint" style="font-size:10.5px;margin-bottom:4px;">{chartStatus}</div>}
        {charts.length > 0 && (
          <div style="max-height:110px;overflow-y:auto;display:flex;flex-direction:column;gap:3px;margin-bottom:6px;">
            {charts.map((c, idx) => (
              <a
                key={idx}
                href={c.pdfUrl}
                target="_blank"
                rel="noreferrer"
                style="display:flex;justify-content:space-between;font-size:10.5px;padding:3px 6px;border-radius:4px;background:var(--surface-alt);color:var(--info);text-decoration:none;"
              >
                <span>{c.chartName}</span>
                <span style="color:var(--muted);">{c.chartCode} ↗</span>
              </a>
            ))}
          </div>
        )}
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px;font-size:10px;">
          <label>
            RWY HDG
            <input type="number" min={0} max={360} value={rwyHdg} onInput={(e) => setRwyHdg(Number((e.target as HTMLInputElement).value) || 0)} style="width:100%;" />
          </label>
          <label>
            WIND DIR
            <input type="number" min={0} max={360} value={windDir} onInput={(e) => setWindDir(Number((e.target as HTMLInputElement).value) || 0)} style="width:100%;" />
          </label>
          <label>
            WIND KTS
            <input type="number" min={0} max={120} value={windSpd} onInput={(e) => setWindSpd(Number((e.target as HTMLInputElement).value) || 0)} style="width:100%;" />
          </label>
        </div>
        <div style="margin-top:5px;font-size:11px;display:flex;justify-content:space-between;">
          <span>{wind.headwindKts >= 0 ? `Headwind: ${wind.headwindKts} kt` : `Tailwind: ${Math.abs(wind.headwindKts)} kt`}</span>
          <span style={`font-weight:700;color:${wind.crosswindKts > 15 ? 'var(--warn)' : 'var(--info)'};`}>
            X-Wind: {wind.crosswindKts} kt ({wind.side})
          </span>
        </div>
      </div>

      {/* 3. ATC Frequency & Quick Readbacks */}
      <div class="panel-card" style="padding:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span class="section-heading" style="margin:0;">ATC VHF Radio &amp; Readbacks</span>
          <input
            type="text"
            value={freq}
            onInput={(e) => setFreq((e.target as HTMLInputElement).value)}
            style="width:76px;font-family:monospace;font-weight:700;text-align:center;"
          />
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          {ATC_TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              class="chip-btn"
              onClick={() => void handleCopyPhrase(tpl.text(freq, ownCallsign || 'GEOFS1', cleanIcao))}
            >
              {tpl.label}
            </button>
          ))}
        </div>
        {copiedMsg && <div style="font-size:10.5px;color:var(--info);margin-top:4px;">{copiedMsg}</div>}
      </div>
    </div>
  );
}
