import { REALISM_OPTION_GROUPS, REALISM_OPTION_META } from '../modules/realism-pack';
import { HelpLabel, SETTING_TIPS } from '../shared/help-tip';
import type {
  ExtensionSettings,
  FpvResolutionMode,
  OpSyncPolicy,
  ScriptConfig
} from '../types/settings';

const FAILURE_QUICK_SYSTEMS = [
  { id: 'gearLeft', label: 'Left Gear Fault' },
  { id: 'electrical', label: 'Electrical Blackout' },
  { id: 'fuelLeak', label: 'Major Fuel Leak' },
  { id: 'mcas', label: 'MCAS Runaway Trim' },
  { id: 'pitotStatic', label: 'Pitot-Static Failure' },
  { id: 'engine0', label: 'Engine 1 Failure' }
] as const;

export interface ScriptTabProps {
  settings: ExtensionSettings;
  isV4: boolean;
  patchScr: (patch: Partial<ScriptConfig>) => void;
}

export function ScriptTab({ settings, isV4, patchScr }: ScriptTabProps) {
  return (
    <div class="surface-grid-2">
      <div class="panel-card">
        <div class="section-heading">Autothrottle &amp; Auto-Boost</div>
        <div class="field-row">
          <HelpLabel
            label={`Throttle Response (${settings.autothrottleResponsiveness.toFixed(1)}x)`}
            tip={SETTING_TIPS.autothrottleResponsiveness}
          />
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.autothrottleResponsiveness}
            onInput={(e) =>
              patchScr({ autothrottleResponsiveness: Number((e.target as HTMLInputElement).value) })
            }
          />
        </div>
        <div class="field-row">
          <HelpLabel label="OP-SYNC Engagement Policy" tip={SETTING_TIPS.opSyncPolicy} />
          <select
            value={settings.opSyncPolicy}
            onChange={(e) => patchScr({ opSyncPolicy: (e.target as HTMLSelectElement).value as OpSyncPolicy })}
          >
            <option value="ask">Ask When Large Speed Jump Detected</option>
            <option value="allow">Always Allow Auto-Boost</option>
            <option value="never">Never Allow (Standard Engine Only)</option>
          </select>
        </div>
        <div class="field-row">
          <HelpLabel label="Speed Jump Threshold (KIAS)" tip={SETTING_TIPS.opDeltaThresholdKts} />
          <input
            type="number"
            min="25"
            max="2000"
            step="25"
            style="width:90px"
            value={settings.opDeltaThresholdKts}
            onChange={(e) =>
              patchScr({
                opDeltaThresholdKts: Math.max(25, Math.min(2000, Number((e.target as HTMLInputElement).value) || 150))
              })
            }
          />
        </div>
      </div>

      <div class="panel-card">
        <div class="section-heading">Overpowered Engines &amp; Stability Assist</div>
        <div class="field-row">
          <HelpLabel label="Thrust Multiplier" tip={SETTING_TIPS.opThrustMultiplier} />
          <input
            type="number"
            min="1"
            max="1000000000"
            style="width:120px"
            value={settings.opThrustMultiplier}
            onChange={(e) =>
              patchScr({
                opThrustMultiplier: Math.max(1, Math.min(1_000_000_000, Number((e.target as HTMLInputElement).value) || 1))
              })
            }
          />
        </div>
        <div class="field-row">
          <HelpLabel label="Altitude Ceiling (ft)" tip={SETTING_TIPS.opCeilingFeet} />
          <select
            value={settings.opCeilingFeet}
            onChange={(e) => patchScr({ opCeilingFeet: Number((e.target as HTMLSelectElement).value) })}
          >
            <option value={3_000_000}>3.0M ft</option>
            <option value={10_000_000}>10.0M ft</option>
            <option value={100_000_000}>100.0M ft</option>
            <option value={1_000_000_000}>1.0B ft</option>
            <option value={1_000_000_000_000}>1.0T ft</option>
          </select>
        </div>
        <label class="switch-row">
          <HelpLabel label="Stability Assist (SAS)" tip={SETTING_TIPS.opStability} />
          <input
            type="checkbox"
            checked={settings.opStability}
            onChange={(e) => patchScr({ opStability: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <div class="field-row">
          <HelpLabel label={`Stability Strength (${settings.sasStrength.toFixed(1)}x)`} tip={SETTING_TIPS.sasStrength} />
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.sasStrength}
            onInput={(e) => patchScr({ sasStrength: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
      </div>

      <div class="panel-card">
        <div class="section-heading">Checklists &amp; Fuel Behavior</div>
        <label class="switch-row">
          <HelpLabel label="Auto-Advance Completed Stages" tip={SETTING_TIPS.checklistAutoAdvance} />
          <input
            type="checkbox"
            checked={settings.checklistAutoAdvance}
            onChange={(e) => patchScr({ checklistAutoAdvance: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <HelpLabel label="Enforce 4 Mandatory Flight Gates" tip={SETTING_TIPS.checklistEnforceMandatoryGates} />
          <input
            type="checkbox"
            checked={settings.checklistEnforceMandatoryGates}
            onChange={(e) =>
              patchScr({ checklistEnforceMandatoryGates: (e.target as HTMLInputElement).checked })
            }
          />
        </label>
        <label class="switch-row">
          <HelpLabel label="Altitude Burn (Realistic Fuel Flow)" tip={SETTING_TIPS.fuelDynamicSfc} />
          <input
            type="checkbox"
            checked={settings.fuelDynamicSfc}
            onChange={(e) => patchScr({ fuelDynamicSfc: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <HelpLabel label="Real Wing Tanks (Fuel Imbalance)" tip={SETTING_TIPS.fuelRealisticTanks} />
          <input
            type="checkbox"
            checked={settings.fuelRealisticTanks}
            onChange={(e) => patchScr({ fuelRealisticTanks: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <label class="switch-row">
          <HelpLabel label="Auto-Refuel on Empty" tip={SETTING_TIPS.fuelAutoRefuel} />
          <input
            type="checkbox"
            checked={settings.fuelAutoRefuel}
            onChange={(e) => patchScr({ fuelAutoRefuel: (e.target as HTMLInputElement).checked })}
          />
        </label>
      </div>

      <div class="panel-card">
        <div class="section-heading">Failures, Landing Card &amp; Flight Path</div>
        <label class="switch-row">
          <HelpLabel label="Enable Random Failures" tip={SETTING_TIPS.failureProbabilitiesEnabled} />
          <input
            type="checkbox"
            checked={settings.failureProbabilitiesEnabled}
            onChange={(e) =>
              patchScr({ failureProbabilitiesEnabled: (e.target as HTMLInputElement).checked })
            }
          />
        </label>
        <div class="field-row">
          <HelpLabel label="Failure Check Interval (sec)" tip={SETTING_TIPS.failureProbabilityIntervalSec} />
          <input
            type="number"
            min="10"
            max="600"
            style="width:80px"
            value={settings.failureProbabilityIntervalSec}
            onChange={(e) =>
              patchScr({
                failureProbabilityIntervalSec: Math.max(
                  10,
                  Math.min(600, Number((e.target as HTMLInputElement).value) || 60)
                )
              })
            }
          />
        </div>
        <div class="field-row">
          <HelpLabel
            label={`Base Recovery Success Chance (${settings.failureRecoveryChancePct}%)`}
            tip={SETTING_TIPS.failureRecoveryChancePct}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.failureRecoveryChancePct}
            onInput={(e) =>
              patchScr({ failureRecoveryChancePct: Number((e.target as HTMLInputElement).value) })
            }
          />
        </div>
        {FAILURE_QUICK_SYSTEMS.map((sys) => {
          const chancePct = Math.round((settings.failureSystemChances[sys.id] ?? 0) * 100);
          return (
            <div class="field-row" key={sys.id} style="font-size:11px">
              <span>{sys.label} ({chancePct}%)</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={chancePct}
                onInput={(e) =>
                  patchScr({
                    failureSystemChances: {
                      ...settings.failureSystemChances,
                      [sys.id]: Number((e.target as HTMLInputElement).value) / 100
                    }
                  })
                }
              />
            </div>
          );
        })}
        <label class="switch-row">
          <HelpLabel label="Auto-Close Landing Scorecard" tip={SETTING_TIPS.landingReportAutoClose} />
          <input
            type="checkbox"
            checked={settings.landingReportAutoClose}
            onChange={(e) => patchScr({ landingReportAutoClose: (e.target as HTMLInputElement).checked })}
          />
        </label>
        <div class="field-row">
          <HelpLabel label="Scorecard Display Time (sec)" tip={SETTING_TIPS.landingReportSeconds} />
          <input
            type="number"
            min="1"
            max="3600"
            style="width:80px"
            value={settings.landingReportSeconds}
            onChange={(e) =>
              patchScr({
                landingReportSeconds: Math.max(1, Math.min(3600, Number((e.target as HTMLInputElement).value) || 15))
              })
            }
          />
        </div>
        <div class="field-row">
          <HelpLabel
            label={`FPV Marker Distance (${settings.fpvProjectionFactor})`}
            tip={SETTING_TIPS.fpvProjectionFactor}
          />
          <input
            type="range"
            min="5"
            max="40"
            step="1"
            value={settings.fpvProjectionFactor}
            onInput={(e) => patchScr({ fpvProjectionFactor: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
        <div class="field-row">
          <HelpLabel label="FPV Marker Quality" tip={SETTING_TIPS.fpvResolutionMode} />
          <select
            value={settings.fpvResolutionMode}
            onChange={(e) =>
              patchScr({ fpvResolutionMode: (e.target as HTMLSelectElement).value as FpvResolutionMode })
            }
          >
            <option value="auto">Auto (Best for Screen)</option>
            <option value="hires">Force High-Res</option>
            <option value="lowres">Force Low-Res (Faster)</option>
          </select>
        </div>
      </div>

      <div class="panel-card" style="grid-column: 1 / -1">
        <div class="section-heading">Realism, Lighting &amp; Utilities</div>
        <div class="field-col" style="gap:10px">
          {REALISM_OPTION_GROUPS.map((grp) => {
            const items = REALISM_OPTION_META.filter((item) => item.group === grp.id && !(isV4 && item.v4Unavailable));
            if (!items.length) return null;
            return (
              <div key={grp.id}>
                <div style="font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;padding-bottom:2px;border-bottom:1px solid var(--border)">
                  {grp.label}
                </div>
                <div class="surface-grid-2">
                  {items.map((item) => (
                    <label class="switch-row" key={item.key}>
                      <HelpLabel
                        label={item.label}
                        tip={SETTING_TIPS[`realism.${item.key}`]}
                        badge={item.v4Unavailable ? 'V3 Only' : undefined}
                      />
                      <input
                        type="checkbox"
                        checked={Boolean(settings.realismOptions[item.key])}
                        onChange={() =>
                          patchScr({
                            realismOptions: {
                              ...settings.realismOptions,
                              [item.key]: !settings.realismOptions[item.key]
                            }
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div class="surface-grid-2" style="margin-top:12px;">
          <div class="field-row">
            <HelpLabel label="Headlight Mode" tip={SETTING_TIPS['realism.headlightMode']} />
            <select
              value={settings.headlightMode}
              onChange={(e) => patchScr({ headlightMode: (e.target as HTMLSelectElement).value as 'auto' | 'on' | 'off' })}
            >
              <option value="auto">Auto (Night Only)</option>
              <option value="on">Always On</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div class="field-row">
            <HelpLabel label={`Light Intensity (${settings.lightIntensity.toFixed(1)}×)`} tip={SETTING_TIPS['realism.lightIntensity']} />
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.1}
              value={settings.lightIntensity}
              onInput={(e) => patchScr({ lightIntensity: Number((e.target as HTMLInputElement).value) })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
