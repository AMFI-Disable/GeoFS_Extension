import { downloadFlightCardPng } from '../core/flight-card';
import { landingReplayCsv } from '../core/landing-replay';
import { formatLogbookCsv, triggerDownload } from '../core/logbook-export';
import type { DiagEntry, LiveTelemetrySummary } from '../shared/settings-store';
import type { LandingRecord } from '../types/settings';

export interface LogbookTabProps {
  logbook: LandingRecord[];
  avgScore: string;
  diags: DiagEntry[];
  live: LiveTelemetrySummary | null;
  onExportVerificationBundle: () => void;
  onClearLogbook: () => void;
}

export function LogbookTab({
  logbook,
  avgScore,
  diags,
  live,
  onExportVerificationBundle,
  onClearLogbook
}: LogbookTabProps) {
  return (
    <div class="field-col">
      <div class="telemetry-strip telemetry-strip--wide">
        <div>
          <div class="telemetry-cell-label">Total Flights</div>
          <div class="telemetry-cell-value">{logbook.length}</div>
        </div>
        <div>
          <div class="telemetry-cell-label">Avg Score</div>
          <div class="telemetry-cell-value">{avgScore}/10</div>
        </div>
        <div>
          <div class="telemetry-cell-label">Diag Events</div>
          <div class="telemetry-cell-value">{diags.length}</div>
        </div>
        <div>
          <div class="telemetry-cell-label">Active Failures</div>
          <div class="telemetry-cell-value">{live?.activeFailures?.length ?? 0}</div>
        </div>
      </div>

      <div class="preset-row">
        <button
          type="button"
          class="btn-sm"
          disabled={logbook.length === 0}
          onClick={() => triggerDownload('geofs-landing-logbook.json', JSON.stringify(logbook, null, 2), 'application/json')}
        >
          Export All JSON
        </button>
        <button
          type="button"
          class="btn-sm"
          disabled={logbook.length === 0}
          onClick={() => triggerDownload('geofs-landing-logbook.csv', formatLogbookCsv(logbook), 'text/csv')}
        >
          Export All CSV
        </button>
        <button type="button" class="btn-sm btn-accent" onClick={onExportVerificationBundle}>
          Download Verification Bundle (JSON)
        </button>
        <button type="button" class="btn-sm" onClick={onClearLogbook}>
          Clear Logbook
        </button>
      </div>

      <div class="panel-card">
        <div class="section-heading">Touchdown Logbook &amp; Replay Traces</div>
        {logbook.length === 0 ? (
          <div style="color:var(--muted);padding:10px 0">No recorded landings yet. Complete a flight to populate the logbook.</div>
        ) : (
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Aircraft</th>
                  <th>Rating</th>
                  <th>Stars</th>
                  <th>Session</th>
                  <th>Score</th>
                  <th>V/S (fpm)</th>
                  <th>G-Force</th>
                  <th>GS (kt)</th>
                  <th>Replay Pts</th>
                  <th>Exports</th>
                </tr>
              </thead>
              <tbody>
                {logbook.map((rec) => (
                  <tr
                    key={rec.id}
                    title={
                      rec.phaseCritique
                        ? `${rec.phaseCritique.departure} | ${rec.phaseCritique.cruise} | ${rec.phaseCritique.approach}`
                        : undefined
                    }
                  >
                    <td>{new Date(rec.timestamp).toLocaleString()}</td>
                    <td>{rec.aircraftName}</td>
                    <td>{rec.rating}</td>
                    <td>{rec.stars ? '★'.repeat(rec.stars) + '☆'.repeat(5 - rec.stars) : '--'}</td>
                    <td>
                      {rec.authenticFlight === undefined ? (
                        '--'
                      ) : (
                        <span class={`badge ${rec.authenticFlight ? 'badge--ok' : ''}`}>
                          {rec.authenticFlight ? 'Authentic' : 'Practice'}
                        </span>
                      )}
                    </td>
                    <td>{rec.score !== undefined ? `${rec.score.toFixed(1)}/10` : '--'}</td>
                    <td>{rec.vsFpm}</td>
                    <td>{rec.gForce.toFixed(2)}G</td>
                    <td>{rec.groundSpeedKts}</td>
                    <td>{rec.replay?.length ?? 0}</td>
                    <td>
                      <div class="chip-group">
                        <button
                          type="button"
                          class="chip-btn"
                          onClick={() => downloadFlightCardPng(rec)}
                        >
                          PNG
                        </button>
                        <button
                          type="button"
                          class="chip-btn"
                          onClick={() =>
                            triggerDownload(
                              `geofs-landing-${rec.id}.json`,
                              JSON.stringify(rec, null, 2),
                              'application/json'
                            )
                          }
                        >
                          JSON
                        </button>
                        <button
                          type="button"
                          class="chip-btn"
                          onClick={() =>
                            triggerDownload(`geofs-landing-${rec.id}.csv`, landingReplayCsv(rec), 'text/csv')
                          }
                        >
                          CSV
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div class="panel-card">
        <div class="section-heading">Session Diagnostic Log</div>
        <div class="diag-feed">
          {diags.length === 0 ? (
            <div style="color:var(--muted)">Waiting for GeoFS telemetry stream...</div>
          ) : (
            diags
              .slice()
              .reverse()
              .map((entry, idx) => (
                <div
                  class={`diag-line ${
                    entry.level === 'error' ? 'diag-line--error' : entry.level === 'warn' ? 'diag-line--warn' : ''
                  }`}
                  key={`${entry.time}-${idx}`}
                >
                  <span style="color:var(--accent)">[{entry.time.slice(11, 19)}]</span>{' '}
                  {entry.level === 'error' && <span style="color:#ef4444;font-weight:700">[ERROR] </span>}
                  <strong>{entry.code}</strong> {entry.payload ? JSON.stringify(entry.payload) : ''}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
