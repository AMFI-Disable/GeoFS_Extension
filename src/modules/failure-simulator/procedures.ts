import type { ChecklistProcedure } from '../checklist-system/procedures';

export const SYSTEMS = {
  gearFront: 'Nose Gear',
  gearLeft: 'Left Main Gear',
  gearRight: 'Right Main Gear',
  ailerons: 'Ailerons',
  elevators: 'Elevators',
  rudder: 'Rudder',
  flaps: 'Flaps',
  brakes: 'Brakes',
  spoilers: 'Spoilers',
  electrical: 'Electrical',
  fuelLeak: 'Fuel Leak',
  structural: 'Structural',
  pressurization: 'Pressurization',
  mcas: 'MCAS',
  pitotStatic: 'Pitot-Static'
} as const;

export type System = keyof typeof SYSTEMS;
export type FailureType = System | `engine${number}`;

export const SYSTEM_DESCRIPTIONS: Record<System, string> = {
  gearFront: 'Nose/Tail wheel collapse. May cause steering loss and ground loops.',
  gearLeft: 'Left main landing gear collapse. Aircraft will tilt heavily to the left.',
  gearRight: 'Right main landing gear collapse. Aircraft will tilt heavily to the right.',
  ailerons: 'Roll surface jam. Total loss of roll control; aircraft will be hard to level.',
  elevators: 'Pitch surface jam. Loss of pitch control; aircraft may become unstable.',
  rudder: 'Yaw surface jam. Loss of directional control; critical during crosswinds.',
  flaps: 'Hydraulic loss preventing flap extension. Higher landing speeds expected.',
  brakes: 'Wheel brakes non-functional. Requires long runway or reverse thrust to stop.',
  spoilers: 'Speedbrakes fail to deploy. Difficult to slow down after touchdown.',
  electrical: 'Total instrument blackout. Autopilot and glass cockpit parts go dark.',
  fuelLeak: 'Critical fuel loss. Engines will starve and flame out in 120 seconds.',
  structural: 'Airframe damage. Severe vibrations and speed-limited stability.',
  pressurization: 'Cabin decompression above 9,000 ft causing severe turbulence.',
  mcas: 'Erroneous stabilizer commands cycling nose-down trim repeatedly.',
  pitotStatic: 'Air data sensor failure. Airspeed and altitude instruments read zero.'
};

export const SYSTEM_GROUPS: ReadonlyArray<readonly [string, string, readonly System[]]> = [
  ['gear', 'Landing Gear', ['gearFront', 'gearLeft', 'gearRight']],
  ['ctrl', 'Flight Controls', ['ailerons', 'elevators', 'rudder']],
  ['hyd', 'Hydraulics & Systems', ['flaps', 'brakes', 'spoilers']],
  ['adv', 'Advanced Emergencies', ['electrical', 'fuelLeak', 'structural', 'pressurization', 'mcas', 'pitotStatic']]
];

export function label(type: FailureType): string {
  return type.startsWith('engine') ? `Engine ${Number(type.slice(6)) + 1}` : SYSTEMS[type as System];
}

export function isFailureRecoverable(type: FailureType): boolean {
  return type !== 'structural';
}

export function recoverabilityMultiplier(type: FailureType): number {
  if (type === 'structural') return 0;
  if (type === 'gearFront' || type === 'gearLeft' || type === 'gearRight') return 0.7;
  if (type === 'fuelLeak' || type === 'flaps' || type === 'brakes' || type === 'spoilers') return 0.75;
  return 1.0;
}

export function computeRecoverySuccess(
  type: FailureType,
  recoveryChancePct: number,
  rollValue: number
): boolean {
  const chance = Math.max(0, Math.min(1, (recoveryChancePct / 100) * recoverabilityMultiplier(type)));
  return chance > 0 && rollValue < chance;
}

export function emergencyProcedure(type: FailureType): ChecklistProcedure {
  if (type.startsWith('engine')) {
    const index = Number(type.slice(6)) + 1;
    return {
      title: `ENG ${index} FAILURE`,
      items: [
        { text: `THR LEVER ${index} - IDLE`, desc: 'Reduce fuel flow and check for engine fire.' },
        { text: `FUEL COCK ${index} - OFF`, desc: 'Isolate damaged engine from fuel manifold.' },
        { text: 'IGNITION & APU BLEED - SELECT RELIGHT', desc: 'Prepare APU cross-bleed for in-flight restart attempt.' },
        { text: 'AIRSPEED - MAINTAIN V2 / BEST L/D', desc: 'Fly symmetric rudder toward live engine.' }
      ]
    };
  }
  switch (type) {
    case 'gearFront':
    case 'gearLeft':
    case 'gearRight':
      return {
        title: `${label(type).toUpperCase()} FAULT`,
        items: [
          { text: 'LANDING GEAR LEVER - CYCLE DOWN', desc: 'Verify hydraulic pressure and downlock pins.' },
          { text: 'ALTERNATE GEAR EXTEND - PULL', desc: 'Release mechanical uplift latches via free-fall.' },
          { text: 'INDICATION LIGHTS - CHECK 3 GREEN', desc: 'Confirm green downlock before committing to landing.' }
        ]
      };
    case 'ailerons':
      return {
        title: 'AILERON JAM',
        items: [
          { text: 'HYDRAULIC AILERON BYPASS - ACTUATE', desc: 'Switch to secondary servo actuator loop.' },
          { text: 'USE RUDDER TO KEEP WINGS LEVEL', desc: 'Avoid abrupt roll inputs while troubleshooting.' }
        ]
      };
    case 'elevators':
      return {
        title: 'ELEVATOR JAM',
        items: [
          { text: 'STAB TRIM - SELECT BACKUP', desc: 'Switch pitch authority to electric stabilizer trim.' },
          { text: 'USE THRUST TO CONTROL PITCH', desc: 'Increase thrust pitches nose up; idle lowers nose.' }
        ]
      };
    case 'rudder':
      return {
        title: 'RUDDER JAM',
        items: [
          { text: 'YAW DAMPER - OFF', desc: 'Disconnect yaw damper servo from rudder actuator.' },
          { text: 'DIFFERENTIAL THRUST - AS REQ', desc: 'Maintain directional alignment using asymmetric thrust.' }
        ]
      };
    case 'flaps':
      return {
        title: 'FLAPS JAM / HYD LOSS',
        items: [
          { text: 'ALTN FLAP MOTOR - ENGAGE', desc: 'Use electric backup drive to cycle flap position.' },
          { text: 'COMPUTE NO-FLAP VREF (+15 KTS)', desc: 'Increase approach target speed if slats/flaps stay jammed.' }
        ]
      };
    case 'brakes':
      return {
        title: 'WHEEL BRAKES FAILURE',
        items: [
          { text: 'ANTI-SKID / ALT BRAKE ACCUM - CYCLE', desc: 'Pressurize standby brake accumulator.' },
          { text: 'PREPARE MAX REVERSE & SPOILERS', desc: 'Ensure full spoilers immediately upon touchdown.' }
        ]
      };
    case 'spoilers':
      return {
        title: 'SPOILERS INOPERATIVE',
        items: [
          { text: 'HYDRAULIC SYS B - RESET', desc: 'Check spoiler servo valve solenoid.' },
          { text: 'FLY STABILIZED ON VREF', desc: 'Avoid floating in flare due to reduced rollout drag.' }
        ]
      };
    case 'electrical':
      return {
        title: 'TOTAL ELECTRICAL FAILURE',
        items: [
          { text: 'APU - START IMMEDIATELY', desc: 'Establish emergency backup electrical generation.' },
          { text: 'BUS TIE & GEN 1/2 - CYCLE RESET', desc: 'Restore main instrument & autopilot busses.' },
          { text: 'STANDBY COMPASS & VISUAL FLY', desc: 'Maintain aircraft pitch & bank visually until restored.' }
        ]
      };
    case 'fuelLeak':
      return {
        title: 'MAJOR FUEL LEAK',
        items: [
          { text: 'FUEL CROSSFEED - CLOSED', desc: 'Isolate undamaged wing tank from leaking supply.' },
          { text: 'LEAK VALVE ISOLATION - ATTEMPT RECOVERY', desc: 'Engines flame out in 120s unless isolated.' },
          { text: 'LAND - NEAREST SUITABLE FIELD', desc: 'Declare emergency with ATC immediately.' }
        ]
      };
    case 'structural':
      return {
        title: 'STRUCTURAL AIRFRAME DAMAGE',
        items: [
          { text: 'AIRSPEED - REDUCE BELOW 220 KTS', desc: 'Permanent structural compromise; minimize aerodynamic load.' },
          { text: 'AVOID > 1.5G MANEUVERS', desc: 'Shallow bank turns only; divert immediately.' }
        ]
      };
    case 'pressurization':
      return {
        title: 'CABIN DEPRESSURIZATION',
        items: [
          { text: 'OXYGEN MASKS - ON & 100%', desc: 'Establish supplemental breathing above 10,000 ft.' },
          { text: 'EMERGENCY DESCENT <= 10,000 FT', desc: 'Idle thrust, extend speedbrakes, descend cleanly.' },
          { text: 'OUTFLOW VALVE - MANUAL CLOSE', desc: 'Attempt cabin pressure seal restoration.' }
        ]
      };
    case 'mcas':
      return {
        title: 'UNCOMMANDED NOSE DOWN TRIM',
        items: [
          { text: 'STAB TRIM CUTOUT - CUTOUT', desc: 'Disconnect runaway stabilizer trim motor.' },
          { text: 'CONTROL COLUMN - PULL TO LEVEL', desc: 'Manually arrest nose-down pitch excursion.' },
          { text: 'TRIM WHEEL - MANUAL RESET', desc: 'Re-trim airframe manually.' }
        ]
      };
    case 'pitotStatic':
      return {
        title: 'PITOT-STATIC SENSOR FAILURE',
        items: [
          { text: 'PITOT / PROBE HEAT - HIGH', desc: 'Clear icing obstruction from primary pitot tubes.' },
          { text: 'ALTERNATE STATIC SOURCE - OPEN', desc: 'Switch ADC to standby static port.' },
          { text: 'FLY PITCH + POWER ATTITUDE', desc: 'Hold +4 deg pitch / 65% thrust if sensors stay frozen.' }
        ]
      };
    default:
      return {
        title: `${label(type).toUpperCase()} ABNORMAL`,
        items: [
          { text: 'MAINTAIN AIRCRAFT CONTROL & AIRSPEED', desc: 'Establish safe altitude and monitor primary flight instruments.' },
          { text: 'DIVERT TO NEAREST SUITABLE AIRPORT', desc: 'Prepare emergency crew & abnormal landing briefing.' }
        ]
      };
  }
}

export function contingencyProcedure(type: FailureType): ChecklistProcedure {
  if (type.startsWith('engine')) {
    const index = Number(type.slice(6)) + 1;
    return {
      title: `ENG ${index} UNRECOVERABLE CONTINGENCY`,
      items: [
        { text: `ENG ${index} MASTER - STAY OFF`, desc: 'Do not attempt further restarts; fire risk.' },
        { text: 'TRIM RUDDER TOWARD LIVE ENGINE', desc: 'Maintain coordinated flight and climb gradient.' },
        { text: 'FLY SINGLE-ENGINE LANDING VREF+5', desc: 'Expect reduced go-around climb capability.' }
      ]
    };
  }
  switch (type) {
    case 'gearFront':
    case 'gearLeft':
    case 'gearRight':
      return {
        title: `${label(type).toUpperCase()} ABNORMAL LANDING`,
        items: [
          { text: 'DUMP / BURN FUEL TO LIGHT WEIGHT', desc: 'Reduce touchdown speed and impact energy.' },
          { text: 'HOLD AFFECTED SIDE OFF UNTIL LOW SPEED', desc: 'Lower nose/wing gently during rollout.' },
          { text: 'FUEL & BATTERY MASTER - OFF ON TOUCHDOWN', desc: 'Eliminate post-slide spark hazards.' }
        ]
      };
    case 'ailerons':
      return {
        title: 'NO-AILERON CONTINGENCY',
        items: [
          { text: 'BANK EXCLUSIVELY WITH RUDDER', desc: 'Coordinate gentle yaw inputs to keep wings level.' },
          { text: 'WIDE FINAL ALIGNMENT ONLY', desc: 'Avoid low-altitude S-turns on short final.' }
        ]
      };
    case 'elevators':
      return {
        title: 'NO-ELEVATOR CONTINGENCY',
        items: [
          { text: 'FLY GLIDEPATH USING THROTTLE', desc: 'Small throttle pulses smoothly adjust vertical speed.' },
          { text: 'FLAPS - MINIMUM REQUIRED', desc: 'Avoid large configuration pitch moments.' }
        ]
      };
    case 'rudder':
      return {
        title: 'JAMMED RUDDER CONTINGENCY',
        items: [
          { text: 'SELECT RUNWAY INTO WIND', desc: 'Avoid crosswind landing beyond bank capability.' },
          { text: 'USE ASYMMETRIC BRAKES BELOW 60 KTS', desc: 'Maintain centerline after nosewheel lowers.' }
        ]
      };
    case 'flaps':
      return {
        title: 'NO-FLAP CONTINGENCY LANDING',
        items: [
          { text: 'APPROACH SPEED - VREF + 15 KTS', desc: 'Compensate for lost high-lift boundary margin.' },
          { text: 'SHALLOW FLARE & LONG RUNWAY', desc: 'Higher ground speed increases stopping distance.' }
        ]
      };
    case 'brakes':
      return {
        title: 'BRAKELESS ROLLOUT SOLUTION',
        items: [
          { text: 'TOUCH DOWN NEAR RUNWAY THRESHOLD', desc: 'Maximize available rollout pavement.' },
          { text: 'MAX REVERSE + SPOILERS ON TOUCHDOWN', desc: 'Keep reverse active down to taxi speed.' }
        ]
      };
    case 'spoilers':
      return {
        title: 'NO-SPOILER ROLLOUT SOLUTION',
        items: [
          { text: 'TOUCH DOWN ON VREF WITH FIRM CONTACT', desc: 'Firm contact minimizes float and aquaplaning.' },
          { text: 'MAX WHEEL BRAKES & REVERSE', desc: 'Maintain continuous braking until taxi speed.' }
        ]
      };
    case 'electrical':
      return {
        title: 'TOTAL BLACKOUT CONTINGENCY',
        items: [
          { text: 'FLY PITCH & HORIZON VISUALLY', desc: 'Autopilot and A/THR remain offline permanently.' },
          { text: 'DAYLIGHT VMC DIVERT', desc: 'Land at nearest visual runway immediately.' }
        ]
      };
    case 'fuelLeak':
      return {
        title: 'FUEL STARVATION CONTINGENCY',
        items: [
          { text: 'ESTABLISH BEST GLIDE SPEED', desc: 'Clean configuration (flaps 0, gear UP) for max range.' },
          { text: 'SELECT EMERGENCY LANDING FIELD NOW', desc: 'Prepare deadstick approach before total flameout.' }
        ]
      };
    case 'pressurization':
      return {
        title: 'UNPRESSURIZED CRUISE SOLUTION',
        items: [
          { text: 'REMAIN AT OR BELOW 10,000 FT MSL', desc: 'Clear mountains; monitor increased ALTITUDE BURN.' },
          { text: 'DIVERT TO NEAREST SUITABLE AIRPORT', desc: 'Plan unhurried VMC/ILS approach.' }
        ]
      };
    case 'mcas':
      return {
        title: 'MCAS DISCONNECT SOLUTION',
        items: [
          { text: 'KEEP STAB TRIM CUTOUT OFF', desc: 'Do not re-engage electric stab trim for rest of flight.' },
          { text: 'EXTEND FLAPS TO DAMP PITCH SENSITIVITY', desc: 'MCAS stays inhibited when flaps > 0.' }
        ]
      };
    case 'pitotStatic':
      return {
        title: 'UNRELIABLE AIRSPEED TABLE SOLUTION',
        items: [
          { text: 'CLIMB: +10 DEG PITCH / 85% N1', desc: 'Disregard primary ASI and Altimeter.' },
          { text: 'APPROACH: +3 DEG PITCH / 58% N1', desc: 'Cross-check HUD AGL & Ground Speed on final.' }
        ]
      };
    default:
      return emergencyProcedure(type);
  }
}
