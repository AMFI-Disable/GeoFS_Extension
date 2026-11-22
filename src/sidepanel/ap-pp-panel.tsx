import { useState } from 'preact/hooks';
import type { ApPpCommand, ApPpSnapshot } from '../modules/autopilot-pp/types';
import { sendApPpCommand } from '../shared/settings-store';

interface ApPpPanelProps {
  enabled: boolean;
  snapshot: ApPpSnapshot | null | undefined;
  tabId?: number;
  onEnableBeta: () => void;
}

export function ApPpPanel({ enabled, snapshot, tabId, onEnableBeta }: ApPpPanelProps) {
  const [latInput, setLatInput] = useState('37.619');
  const [lonInput, setLonInput] = useState('-122.375');
  const [spdInput, setSpdInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [hdgInput, setHdgInput] = useState('');
  const [vsInput, setVsInput] = useState('');

  const send = (cmd: ApPpCommand) => {
    void sendApPpCommand(cmd, tabId);
  };

  if (!enabled) {
    return (
      <div class="panel-card">
        <div class="section-heading" style="display:flex;align-items:center;justify-content:space-between">
          <span>AP++ Flight Management</span>
          <span class="badge badge--warn">BETA</span>
        </div>
        <div style="font-size:11px;color:var(--muted);line-height:1.45;margin-bottom:10px">
          Unified Autopilot++ replaces the standalone <code>A/THR</code> bar with a compact <code>AP++</code> pad
          and brings VNAV/FLCH, Mach crossover, racetrack HOLD, LAT/LON great-circle steering, Autoland, and Envelope
          Protection into this Side Panel.
        </div>
        <button type="button" class="btn-sm active" style="width:100%" onClick={onEnableBeta}>
          Enable AP++ (Beta)
        </button>
      </div>
    );
  }

  const ap = snapshot;
  const fma = ap?.fma ?? { thr: 'OFF', vert: 'OFF', lat: 'OFF', protection: null };

  return (
    <div style="display:flex;flex-direction:column;gap:8px">
      {/* FMA & Master Control */}
      <div class="panel-card">
        <div class="section-heading" style="display:flex;align-items:center;justify-content:space-between">
          <span>Flight Mode Annunciator</span>
          <span class="badge badge--warn">BETA</span>
        </div>

        <div class="telemetry-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:8px">
          <div>
            <div class="telemetry-cell-label">THR</div>
            <div class="telemetry-cell-value" style="font-size:12px">{fma.thr}</div>
          </div>
          <div>
            <div class="telemetry-cell-label">VERT</div>
            <div class="telemetry-cell-value" style="font-size:12px">{fma.vert}</div>
          </div>
          <div>
            <div class="telemetry-cell-label">LAT</div>
            <div class="telemetry-cell-value" style="font-size:12px">{fma.lat}</div>
          </div>
        </div>

        {fma.protection && (
          <div class="badge badge--danger" style="width:100%;justify-content:center;margin-bottom:6px">
            PROT: {fma.protection}
          </div>
        )}
        {ap?.degradedReason && (
          <div class="badge badge--warn" style="width:100%;justify-content:center;margin-bottom:6px">
            {ap.degradedReason}
          </div>
        )}

        <div class="chip-group" style="justify-content:space-between">
          <button
            type="button"
            class={`btn-sm ${ap?.engaged ? 'active' : ''}`}
            style="flex:1"
            onClick={() => send({ type: 'toggle' })}
          >
            {ap?.engaged ? 'AP++ ENGAGED (DISENGAGE)' : 'ENGAGE AP++'}
          </button>
          <button
            type="button"
            class={`chip-btn ${ap?.envelopeProtection === false ? 'is-disabled-state' : 'active'}`}
            onClick={() => send({ type: 'setEnvelopeProtection', enabled: !(ap?.envelopeProtection ?? true) })}
            title="Alpha-floor, Vne/Mmo overspeed, and bank-angle protection"
          >
            PROT {ap?.envelopeProtection === false ? 'OFF' : 'ON'}
          </button>
        </div>

        <div class="chip-group" style="margin-top:6px">
          <button type="button" class="chip-btn" onClick={() => send({ type: 'holdPresent', axis: 'all' })}>
            HOLD ALL
          </button>
          <button type="button" class="chip-btn" onClick={() => send({ type: 'holdPresent', axis: 'alt' })}>
            HOLD ALT
          </button>
          <button type="button" class="chip-btn" onClick={() => send({ type: 'holdPresent', axis: 'hdg' })}>
            HOLD HDG
          </button>
          <button type="button" class="chip-btn" onClick={() => send({ type: 'holdPresent', axis: 'spd' })}>
            HOLD SPD
          </button>
        </div>
      </div>

      {/* Speed & Autothrottle */}
      <div class="panel-card">
        <div class="section-heading" style="display:flex;justify-content:space-between">
          <span>Speed & Autothrottle</span>
          <span style="font-size:10px;color:var(--muted)">
            KTAS {ap?.ktas ?? '--'} · XOVER {ap?.crossoverAltFt ? `FL${Math.round(ap.crossoverAltFt / 100)}` : '--'}
          </span>
        </div>

        <div class="chip-group" style="margin-bottom:6px">
          {(['kts', 'mach', 'off'] as const).map((m) => (
            <button
              type="button"
              key={m}
              class={`chip-btn ${ap?.speedMode === m ? (m === 'off' ? 'is-disabled-state' : 'active') : ''}`}
              onClick={() => send({ type: 'setSpeedMode', mode: m })}
            >
              {m.toUpperCase()}
            </button>
          ))}
          <button
            type="button"
            class={`chip-btn ${ap?.landingArmed ? 'active' : ''}`}
            style="margin-left:auto"
            onClick={() => send({ type: 'setLandingArm', armed: !(ap?.landingArmed ?? false) })}
          >
            {ap?.landingRetarded ? 'RETARDED' : ap?.landingArmed ? 'LDG ARMED' : 'LDG ARM'}
          </button>
        </div>

        <div class="field-row">
          <button
            type="button"
            class="btn-sm"
            onClick={() =>
              send({
                type: 'setSpeed',
                value: ap?.speedMode === 'mach' ? (ap.targetMach ?? 0.78) - 0.01 : (ap?.targetKias ?? 250) - 5
              })
            }
          >
            −
          </button>
          <input
            type="text"
            class="input-sm"
            style="width:76px;text-align:center"
            placeholder={ap?.speedMode === 'mach' ? String(ap.targetMach) : String(ap?.targetKias ?? 250)}
            value={spdInput}
            onInput={(e) => setSpdInput((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const v = Number.parseFloat(spdInput);
                if (Number.isFinite(v) && v > 0) send({ type: 'setSpeed', value: v });
                setSpdInput('');
              }
            }}
          />
          <button
            type="button"
            class="btn-sm"
            onClick={() =>
              send({
                type: 'setSpeed',
                value: ap?.speedMode === 'mach' ? (ap.targetMach ?? 0.78) + 0.01 : (ap?.targetKias ?? 250) + 5
              })
            }
          >
            +
          </button>
          <span style="font-size:11px;color:var(--muted);margin-left:auto">
            TGT: {ap?.speedMode === 'mach' ? `M${ap.targetMach.toFixed(2)}` : `${ap?.targetKias ?? 250} KTS`}
          </span>
        </div>
      </div>

      {/* Lateral & Racetrack Hold */}
      <div class="panel-card">
        <div class="section-heading" style="display:flex;justify-content:space-between">
          <span>Lateral & Auto-Hold</span>
          {ap?.distanceToFixNm !== null && ap?.distanceToFixNm !== undefined && (
            <span style="font-size:10px;color:var(--muted)">
              {ap.distanceToFixNm} NM · {String(ap.bearingToFixDeg ?? 0).padStart(3, '0')}°
            </span>
          )}
        </div>

        <div class="chip-group" style="margin-bottom:6px">
          {(['hdg', 'latlon', 'hold', 'loc', 'off'] as const).map((m) => (
            <button
              type="button"
              key={m}
              class={`chip-btn ${ap?.lateralMode === m ? (m === 'off' ? 'is-disabled-state' : 'active') : ''}`}
              onClick={() => send({ type: 'setLateralMode', mode: m })}
            >
              {m === 'latlon' ? 'LAT/LON' : m.toUpperCase()}
            </button>
          ))}
        </div>

        <div class="field-row">
          <span>HDG {String(ap?.targetHdgDeg ?? 0).padStart(3, '0')}°</span>
          <div class="chip-group">
            <button type="button" class="btn-sm" onClick={() => send({ type: 'setHeading', deg: (ap?.targetHdgDeg ?? 0) - 5 })}>
              −5°
            </button>
            <input
              type="text"
              class="input-sm"
              style="width:54px;text-align:center"
              placeholder={String(ap?.targetHdgDeg ?? 0)}
              value={hdgInput}
              onInput={(e) => setHdgInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = Number.parseFloat(hdgInput);
                  if (Number.isFinite(v)) send({ type: 'setHeading', deg: v });
                  setHdgInput('');
                }
              }}
            />
            <button type="button" class="btn-sm" onClick={() => send({ type: 'setHeading', deg: (ap?.targetHdgDeg ?? 0) + 5 })}>
              +5°
            </button>
          </div>
        </div>

        <div class="field-row" style="margin-top:6px">
          <button
            type="button"
            class={`btn-sm ${ap?.engaged && ap?.lateralMode === 'hold' ? 'active' : ''}`}
            onClick={() => send({ type: 'holdHere' })}
          >
            HOLD ({ap?.holdConfig.entryType?.toUpperCase() ?? 'DIR'} · {ap?.holdConfig.phase.toUpperCase() ?? 'IN'} · WCA {ap?.holdConfig.wcaDeg ?? 0}°)
          </button>
          <div class="chip-group">
            <button
              type="button"
              class={`chip-btn ${ap?.holdConfig.legMinutes === 1 ? 'active' : ''}`}
              onClick={() => send({ type: 'setHoldConfig', legMinutes: 1 })}
            >
              1.0m
            </button>
            <button
              type="button"
              class={`chip-btn ${ap?.holdConfig.legMinutes === 1.5 ? 'active' : ''}`}
              onClick={() => send({ type: 'setHoldConfig', legMinutes: 1.5 })}
            >
              1.5m
            </button>
            <button
              type="button"
              class="chip-btn"
              onClick={() =>
                send({ type: 'setHoldConfig', turnDir: ap?.holdConfig.turnDir === 'L' ? 'R' : 'L' })
              }
            >
              {ap?.holdConfig.turnDir ?? 'R'}-TURN
            </button>
            <button
              type="button"
              class={`chip-btn ${ap?.hoverMode ? 'active' : ''}`}
              title="Rotorcraft Auto-Hover & SAS"
              onClick={() => send({ type: 'setHoverMode', enabled: !ap?.hoverMode })}
            >
              {ap?.hoverMode ? 'HOVER ON' : 'HOVER'}
            </button>
          </div>
        </div>

        <div class="field-row" style="margin-top:6px;gap:4px">
          <input
            type="text"
            class="input-sm"
            style="width:68px"
            value={latInput}
            onInput={(e) => setLatInput((e.target as HTMLInputElement).value)}
            placeholder="Lat"
          />
          <input
            type="text"
            class="input-sm"
            style="width:74px"
            value={lonInput}
            onInput={(e) => setLonInput((e.target as HTMLInputElement).value)}
            placeholder="Lon"
          />
          <button
            type="button"
            class="btn-sm"
            onClick={() => {
              const lat = Number.parseFloat(latInput);
              const lon = Number.parseFloat(lonInput);
              if (Number.isFinite(lat) && Number.isFinite(lon)) {
                send({ type: 'setLatLon', lat, lon });
              }
            }}
          >
            GO LAT/LON
          </button>
        </div>
      </div>

      {/* Vertical & VNAV */}
      <div class="panel-card">
        <div class="section-heading">Vertical & VNAV</div>
        <div class="chip-group" style="margin-bottom:6px">
          {(['alt', 'vs', 'flch', 'vnav', 'gs', 'off'] as const).map((m) => (
            <button
              type="button"
              key={m}
              class={`chip-btn ${ap?.verticalMode === m ? (m === 'off' ? 'is-disabled-state' : 'active') : ''}`}
              onClick={() => send({ type: 'setVerticalMode', mode: m })}
            >
              {m === 'gs' ? 'G/S' : m.toUpperCase()}
            </button>
          ))}
        </div>

        <div class="field-row">
          <span>ALT {ap?.targetAltFt ?? 10000} ft</span>
          <div class="chip-group">
            <button
              type="button"
              class="btn-sm"
              onClick={() => send({ type: 'setAltitude', feet: (ap?.targetAltFt ?? 10000) - 500 })}
            >
              −500
            </button>
            <input
              type="text"
              class="input-sm"
              style="width:64px;text-align:center"
              placeholder={String(ap?.targetAltFt ?? 10000)}
              value={altInput}
              onInput={(e) => setAltInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = Number.parseFloat(altInput);
                  if (Number.isFinite(v)) send({ type: 'setAltitude', feet: v });
                  setAltInput('');
                }
              }}
            />
            <button
              type="button"
              class="btn-sm"
              onClick={() => send({ type: 'setAltitude', feet: (ap?.targetAltFt ?? 10000) + 500 })}
            >
              +500
            </button>
          </div>
        </div>

        <div class="field-row" style="margin-top:6px">
          <span>V/S {ap?.autoVs ? '----- (AUTO)' : `${ap?.targetVsFpm ?? 0} fpm`}</span>
          <div class="chip-group">
            <button
              type="button"
              class={`chip-btn ${ap?.autoVs ? 'active' : ''}`}
              onClick={() => send({ type: 'setVs', fpm: null })}
            >
              AUTO
            </button>
            <input
              type="text"
              class="input-sm"
              style="width:62px;text-align:center"
              placeholder="fpm"
              value={vsInput}
              onInput={(e) => setVsInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const trimmed = vsInput.trim();
                  if (!trimmed) {
                    send({ type: 'setVs', fpm: null });
                  } else {
                    const v = Number.parseFloat(trimmed);
                    if (Number.isFinite(v)) send({ type: 'setVs', fpm: v });
                  }
                  setVsInput('');
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
