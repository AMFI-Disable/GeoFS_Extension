export const SETTING_TIPS: Record<string, string> = {
  // Display & UI
  calibratorPreset:
    'Automatically sizes the in-game cockpit panels to fit your screen—including when you move GeoFS onto an external monitor.',
  themeMode: 'Matches GeoFS dark glass panels by default, or lets you force Dark or Light mode.',
  showStartupDiagnostics: 'Shows a brief notification in GeoFS when the extension finishes loading.',
  sidePanelAutoTelemetry: 'Keeps the Chrome Side Panel updated with your live speed, altitude, and fuel while you fly.',
  hudPositionFallback:
    'If GeoFS hides or moves its bottom autopilot bar, this places the addon buttons in a safe backup spot so nothing disappears.',

  // Autothrottle & OP-SYNC
  autothrottleResponsiveness:
    'How quickly Autothrottle adjusts power. Higher values react faster; lower values give smoother, gentler throttle changes.',
  opSyncPolicy:
    'When you ask Autothrottle for a huge speed jump, it can temporarily boost engine power. Choose whether it asks first, does it automatically, or never does.',
  opDeltaThresholdKts: 'How big a speed change (in knots) triggers the OP-SYNC boost prompt.',

  // Overpowered Engines & SAS
  opThrustMultiplier: 'Multiplies your engine power (from normal 1x up to extreme speeds).',
  opCeilingFeet: 'Raises the maximum altitude limit so high-altitude jets and rockets keep climbing.',
  opStability:
    'Keeps your plane’s nose and wings steady when you let go of the controls—very helpful at extreme speeds.',
  sasStrength: 'How firmly stability assist resists unwanted pitch and roll movements.',

  // Checklists & Fuel
  checklistAutoAdvance:
    'Automatically moves your checklist to the next flight stage as soon as you finish all required items.',
  checklistEnforceMandatoryGates:
    'Keeps the four main flight stages (Takeoff, Cruise, Landing, Chocks) in order so nothing gets skipped.',
  fuelDynamicSfc:
    'Makes fuel burn more realistic by factoring in your altitude and how hard each engine is working.',
  fuelRealisticTanks:
    'Drains the center tank before the wing tanks. If one wing gets heavier than the other, the plane will gently roll toward the heavier side.',
  fuelAutoRefuel: 'Automatically tops up your fuel when you hit 0% so your engines do not shut off mid-flight.',

  // Failures, Landing & FPV
  failureProbabilitiesEnabled:
    'Occasionally triggers random system faults during flight based on your chance sliders below.',
  failureProbabilityIntervalSec: 'How often (in seconds) the simulator rolls the dice for a random failure.',
  failureRecoveryChancePct:
    'Your odds of fixing an active failure when you click Attempt Recovery in the emergency checklist.',
  landingReportAutoClose: 'Automatically hides the touchdown scorecard after a few seconds so it stays out of your way.',
  landingReportSeconds: 'How many seconds the touchdown scorecard stays on screen before closing.',
  fpvProjectionFactor:
    'How far ahead of the plane the Flight Path Vector marker is drawn. Higher values make small climbs and descents easier to spot.',
  fpvResolutionMode: 'Chooses crisp high-resolution reticle graphics or a lighter low-res version for older GPUs.',

  // Realism Pack
  'realism.gBreath': 'Plays subtle pilot breathing sounds during high-G turns and pull-ups.',
  'realism.blackout': 'Dims and blurs your vision when pulling heavy G-forces, just like real pilots experience.',
  'realism.windAudio': 'Adds realistic rushing wind noise outside the cockpit as your airspeed climbs.',
  'realism.cameraShake': 'Adds gentle cockpit vibration during takeoff, turbulence, spoilers, and touchdown.',
  'realism.propwash': 'Simulates propeller airflow pushing on the tail and wings at low speeds.',
  'realism.vortexEffects': 'Draws subtle wingtip condensation trails during sharp maneuvers (GeoFS V3 only).',
  'realism.spinFix': 'Improves stall and spin recovery behavior on light aircraft and aerobatic planes.',
  'realism.bladeCollisions': 'Detects helicopter rotor strikes if you tilt too close to the ground.',
  'realism.engineInertia': 'Gives jet and prop engines realistic spool-up and spool-down delay instead of instant power.',
  'realism.spoilerArming': 'Lets you arm speedbrakes before landing so they pop open automatically on touchdown.',
  'realism.carrierOps': 'Enables aircraft carrier catapult launches and arresting hook landings (GeoFS V3 only).',
  'realism.soundExpansion': 'Adds authentic Boeing 737/777 and Airbus cockpit callouts, GPWS warnings, and flap sounds.',
  'realism.performanceMode': 'Reduces heavy visual effects to keep frame rates smooth on laptops and older computers.'
};

export function HelpLabel({ label, tip, badge }: { label: string; tip?: string; badge?: string }) {
  return (
    <span class="help-label">
      <span>{label}</span>
      {badge && <span class="badge">{badge}</span>}
      {tip && (
        <span class="help-wrap" tabIndex={0} aria-label={`${label}: ${tip}`}>
          <span class="help-icon" aria-hidden="true">?</span>
          <span class="help-bubble" role="tooltip">
            {tip}
          </span>
        </span>
      )}
    </span>
  );
}
