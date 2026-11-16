import type { AircraftProfile, FlightTelemetry } from '../../types/module';

export type MandatoryGateId = 'pre-takeoff' | 'pre-cruise' | 'pre-landing' | 'pre-chocks-on';

export const MANDATORY_PHASE_ORDER: readonly MandatoryGateId[] = [
  'pre-takeoff',
  'pre-cruise',
  'pre-landing',
  'pre-chocks-on'
] as const;

export const MANDATORY_PHASE_LABELS: Record<MandatoryGateId, string> = {
  'pre-takeoff': 'PRE-T/O',
  'pre-cruise': 'PRE-CRZ',
  'pre-landing': 'PRE-LDG',
  'pre-chocks-on': 'CHOCKS'
};

export interface ChecklistItemSpec {
  text: string;
  desc: string;
  sync?: string;
}

export interface ChecklistProcedure {
  title: string;
  gateId?: MandatoryGateId;
  items: ChecklistItemSpec[];
}

export interface SituationalGuide {
  id: string;
  title: string;
  steps: string[];
}

// Preserved legacy V3.9/V4.0 procedural data for backward compatibility
export const ARCHIVED_PROCEDURES: Record<string, ChecklistProcedure[]> = {
  'boeing 737': [
    {
      title: 'COCKPIT PREPARATION',
      items: [
        { text: 'Parking Brake - SET', desc: 'Ensure the aircraft does not roll during power-up.', sync: 'parkingBrake' },
        { text: 'Battery Switch - ON/GUARD', desc: 'Main DC power is required for all systems.' },
        { text: 'Standby Power - AUTO', desc: 'Backup power for critical instruments.' },
        { text: 'L/R Fuel Pumps - ON', desc: 'Provides fuel pressure to the APU.' },
        { text: 'APU - START', desc: 'Wait for APU GEN OFF BUS light before continuing.' }
      ]
    },
    {
      title: 'BEFORE TAXI',
      items: [
        { text: 'Generators 1 & 2 - ON', desc: 'Transfer power from APU to engine generators.' },
        { text: 'Probe Heat - ON', desc: 'Prevents ice buildup on speed sensors.' },
        { text: 'Flaps - 5', desc: 'Standard takeoff configuration for 737.', sync: 'flaps:2' },
        { text: 'Flight Controls - CHECK', desc: 'Move stick and rudder to ensure full travel.' }
      ]
    },
    {
      title: 'DESCENT & APPROACH',
      items: [
        { text: 'Altimeter - SET', desc: 'Update barometric pressure to local airport setting.' },
        { text: 'Auto-brake - 2', desc: 'Sets the automatic braking intensity for landing.' },
        { text: 'Speed Brake - ARMED', desc: 'Spoilers will deploy automatically upon touchdown.', sync: 'airbrakes' },
        { text: 'Landing Gear - DOWN', desc: 'Must be confirmed down before 1,000ft AGL.', sync: 'gear:down' }
      ]
    }
  ],
  'airbus a320': [
    {
      title: 'PRELIMINARY COCKPIT PREP',
      items: [
        { text: 'Batteries 1 & 2 - ON', desc: 'Check voltage is above 25.5V.' },
        { text: 'External Power - AS REQ', desc: 'Use ground power if available to save fuel.' },
        { text: 'ADIRS 1, 2, 3 - NAV', desc: 'Aligns the Inertial Reference System (takes 7-10 mins).' },
        { text: 'Crew Oxygen - CHECK', desc: 'Ensure pressure is sufficient for the flight.' }
      ]
    },
    {
      title: 'AFTER START',
      items: [
        { text: 'APU Bleed - OFF', desc: 'Engines now provide air pressure for air conditioning.' },
        { text: 'Engine Anti-ice - AS REQ', desc: 'Turn ON if OAT is below 10°C in visible moisture.' },
        { text: 'ECAM Status - CHECK', desc: 'Ensure no BLUE items remain on the status page.' }
      ]
    },
    {
      title: 'LANDING CONFIG',
      items: [
        { text: 'Auto-land - MONITOR', desc: 'Confirm CAT III status if performing an auto-land.' },
        { text: 'Flaps - FULL', desc: 'Landing configuration for shortest rollout.', sync: 'flaps:full' },
        { text: 'Cabin - READY', desc: 'Confirm cabin crew have secured the galley.' }
      ]
    }
  ],
  'cessna 172': [
    {
      title: 'PRE-FLIGHT',
      items: [
        { text: 'Fuel Selector - BOTH', desc: 'Ensure fuel flows from both wing tanks.' },
        { text: 'Mixture - RICH', desc: 'Maximum fuel flow for engine start.' },
        { text: 'Master Switch - ON', desc: 'Activates the electrical bus.' },
        { text: 'Beacon Light - ON', desc: 'Warns ground crew that engine is about to start.' }
      ]
    },
    {
      title: 'BEFORE TAKEOFF',
      items: [
        { text: 'Elevator Trim - TAKEOFF', desc: 'Set neutral pitch for rotation.' },
        { text: 'Magnetos - CHECK', desc: 'Run-up at 1800 RPM to check ignition systems.' },
        { text: 'Carb Heat - COLD', desc: 'Ensure full engine power for takeoff.' }
      ]
    }
  ],
  generic: [
    {
      title: 'PRE-FLIGHT',
      items: [
        { text: 'Parking Brake - SET', desc: 'Prevent uncommanded movement.', sync: 'parkingBrake' },
        { text: 'Fuel Level - CHECK', desc: 'Verify sufficient fuel for planned route.' },
        { text: 'Instruments - SET', desc: 'Check PFD and Navigation displays.' }
      ]
    },
    {
      title: 'TAKEOFF',
      items: [
        { text: 'Lights - ON', desc: 'Landing and Strobe lights for visibility.', sync: 'lightsOn' },
        { text: 'Flaps - SET', desc: 'Standard takeoff flap setting.', sync: 'flaps' },
        { text: 'Throttle - MAX', desc: 'Apply full power smoothly.', sync: 'throttle>=0.90' }
      ]
    },
    {
      title: 'LANDING',
      items: [
        { text: 'Gear - DOWN', desc: 'Confirm three green lights.', sync: 'gear:down' },
        { text: 'Flaps - FULL', desc: 'Increase drag and lower stall speed.', sync: 'flaps:full' },
        { text: 'Airspeed - VREF', desc: 'Maintain stable approach speed.', sync: 'vref' }
      ]
    }
  ]
};

export const SITUATIONAL_GUIDES: SituationalGuide[] = [
  {
    id: 'cold-start',
    title: 'Cold & Dark Engine Start Guide',
    steps: [
      'Set Parking Brake ON and verify Fuel Quantity & Balance in FUEL tab.',
      'Battery Master & Nav/Beacon Lights ON; start APU for jets before Bleed Air.',
      'Advance Engine Masters / Mixture Rich sequentially and verify positive oil pressure & RPM.'
    ]
  },
  {
    id: 'rto',
    title: 'Rejected Takeoff (Before V1)',
    steps: [
      'Immediately retard thrust levers to IDLE and disengage Autothrottle.',
      'Apply Maximum Wheel Braking and full Reverse Thrust (if fitted).',
      'Extend Spoilers / Speedbrakes fully and bring aircraft to a full stop before inspecting brakes.'
    ]
  },
  {
    id: 'go-around',
    title: 'Go-Around / Missed Approach',
    steps: [
      'Apply TO/GA thrust smoothly and pitch up to +12 to +15 deg.',
      'Retract one notch of flaps immediately, then retract Gear on positive rate of climb.',
      'Accelerate cleanly to climb speed, retract remaining flaps on schedule, and re-arm approach.'
    ]
  },
  {
    id: 'crosswind',
    title: 'Crosswind Takeoff & Landing',
    steps: [
      'Apply upwind aileron correction on takeoff roll and delay liftoff slightly past Vr.',
      'On approach, fly crabbed or wing-low into the wind, align nose with runway before touchdown.',
      'Lower windward wing slightly on rollout to keep upwind tires planted.'
    ]
  },
  {
    id: 'short-field',
    title: 'Short-Field Operations',
    steps: [
      'Hold brakes while running power up to max takeoff thrust before releasing brakes.',
      'Fly exact Vref over threshold at FULL flaps; aim directly for first 500 ft of runway.',
      'Retract flaps after touchdown if needed to place maximum weight on main wheels for braking.'
    ]
  },
  {
    id: 'mountain',
    title: 'Mountain / High-Altitude Ops',
    steps: [
      'Expect longer takeoff ground roll (higher TAS for same KIAS) due to low air density.',
      'Monitor ALTITUDE BURN in FUEL tab and step-climb efficiently.',
      'Execute steep approaches carefully without overspeeding Vfe flap limits.'
    ]
  }
];

function computeInteractiveAction(sync: string | undefined): string | null {
  if (!sync) return null;
  if (sync.includes('&')) return null;
  if (['parkingBrake', 'parkingBrake:off', 'gear', 'gear:down', 'gear:up', 'flaps', 'flaps:0', 'flaps:full', 'airbrakes', 'airbrakes:arm', 'airbrakes:off', 'lightsOn'].includes(sync)) {
    return sync;
  }
  if (/^flaps:\d+$/.test(sync)) return sync;
  return null;
}

export function isHardwareSync(sync: string | undefined): boolean {
  return computeInteractiveAction(sync) !== null;
}

function evalSinglePredicate(token: string, telemetry: FlightTelemetry, profile: AircraftProfile): boolean {
  if (token === 'parkingBrake') return telemetry.parkingBrake;
  if (token === 'parkingBrake:off') return !telemetry.parkingBrake;
  if (token === 'gear' || token === 'gear:down') return !profile.hasGear || telemetry.gearDown;
  if (token === 'gear:up') return !profile.hasGear || !telemetry.gearDown;
  if (token === 'flaps') return profile.maxFlaps <= 0 || telemetry.flapsTarget > 0;
  if (token === 'flaps:0') return telemetry.flapsTarget === 0;
  if (token === 'flaps:full') return profile.maxFlaps <= 0 || telemetry.flapsTarget >= profile.maxFlaps;
  if (token.startsWith('flaps:')) {
    const step = Number(token.slice(6));
    return profile.maxFlaps <= 0 || telemetry.flapsTarget >= Math.min(profile.maxFlaps, step);
  }
  if (token === 'airbrakes' || token === 'airbrakes:arm') {
    return !profile.hasSpoilers || (telemetry.airbrakesPosition ?? 0) > 0;
  }
  if (token === 'airbrakes:off') {
    return !profile.hasSpoilers || (telemetry.airbrakesPosition ?? 0) <= 0.05;
  }
  if (token === 'lightsOn') return telemetry.lightsOn;
  if (token === 'airborne') return !telemetry.groundContact && telemetry.aglFeet >= 35;
  if (token === 'groundStopped') return telemetry.groundContact && telemetry.groundSpeed <= 3;
  if (token === 'enginesOff') {
    const maxThr = Math.max(...telemetry.throttles.map((t) => Math.abs(t)), 0);
    return telemetry.groundContact && telemetry.groundSpeed <= 3 && maxThr <= 0.05;
  }
  if (token === 'vref') {
    const targetVref = profile.vSpeeds?.Vref ?? (profile.category === 'ga-piston' ? 65 : 138);
    return !telemetry.groundContact && telemetry.aglFeet <= 2000 && telemetry.kias <= targetVref + 15 && telemetry.kias >= 25;
  }
  if (token.startsWith('kias>=')) return telemetry.kias >= Number(token.slice(6));
  if (token.startsWith('kias<=')) return telemetry.kias <= Number(token.slice(6));
  if (token.startsWith('mach>=')) return telemetry.mach >= Number(token.slice(6));
  if (token.startsWith('altitude>=')) return telemetry.altitude >= Number(token.slice(10));
  if (token.startsWith('agl<=')) return telemetry.aglFeet <= Number(token.slice(5));
  if (token.startsWith('throttle>=')) {
    const avg = telemetry.throttles.reduce((a, b) => a + b, 0) / Math.max(1, telemetry.throttles.length);
    return avg >= Number(token.slice(10));
  }
  return false;
}

export function evaluateChecklistSync(
  sync: string | undefined,
  telemetry: FlightTelemetry,
  profile: AircraftProfile | null
): boolean {
  if (!sync || !profile) return false;
  return sync.split('&').every((token) => evalSinglePredicate(token.trim(), telemetry, profile));
}

function getFlapLabels(profile: AircraftProfile): { toStep: number; toLabel: string; appStep: number; ldgLabel: string } {
  const lower = profile.name.toLowerCase();
  if (lower.includes('a318') || lower.includes('a319') || lower.includes('a320') || lower.includes('a321') || lower.includes('a330') || lower.includes('a340') || lower.includes('a350') || lower.includes('a380')) {
    return { toStep: Math.min(profile.maxFlaps, 1), toLabel: 'CONF 1+F', appStep: profile.maxFlaps, ldgLabel: 'CONF FULL' };
  }
  if (lower.includes('737')) {
    return { toStep: Math.min(profile.maxFlaps, 2), toLabel: 'FLAPS 5', appStep: profile.maxFlaps, ldgLabel: 'FLAPS 30/40' };
  }
  if (lower.includes('747')) {
    return { toStep: Math.min(profile.maxFlaps, 2), toLabel: 'FLAPS 10', appStep: profile.maxFlaps, ldgLabel: 'FLAPS 30' };
  }
  if (lower.includes('777') || lower.includes('787') || lower.includes('757') || lower.includes('767')) {
    return { toStep: Math.min(profile.maxFlaps, 2), toLabel: 'FLAPS 5/15', appStep: profile.maxFlaps, ldgLabel: 'FLAPS 30' };
  }
  if (lower.includes('atr') || lower.includes('q400') || lower.includes('king air') || lower.includes('twin otter') || lower.includes('pc-7')) {
    return { toStep: Math.min(profile.maxFlaps, 1), toLabel: 'FLAPS 15', appStep: profile.maxFlaps, ldgLabel: 'FLAPS FULL' };
  }
  if (profile.maxFlaps <= 0) {
    return { toStep: 0, toLabel: 'UP (CLEAN WING)', appStep: 0, ldgLabel: 'DELTA / NO-FLAP TRIM' };
  }
  const toStep = Math.max(1, Math.min(profile.maxFlaps, Math.round(profile.maxFlaps / 3)));
  return {
    toStep,
    toLabel: `NOTCH ${toStep}/${profile.maxFlaps}`,
    appStep: profile.maxFlaps,
    ldgLabel: `FULL (${profile.maxFlaps}/${profile.maxFlaps})`
  };
}

export function getMandatoryProcedures(profile: AircraftProfile): ChecklistProcedure[] {
  const vr = Math.round(profile.vSpeeds?.VR ?? (profile.category === 'ga-piston' ? 55 : profile.category === 'fighter' ? 135 : 140));
  const vref = Math.round(profile.vSpeeds?.Vref ?? (profile.category === 'ga-piston' ? 65 : profile.category === 'fighter' ? 140 : 136));
  const lower = profile.name.toLowerCase();
  const id = profile.id;
  const flaps = getFlapLabels(profile);
  const isAirbus = /a3\d\d/.test(lower);
  const isBoeingWide = /(747|757|767|777|787)/.test(lower);
  const isBoeing737 = lower.includes('737');

  // Rotorcraft specialized 4 gates
  if (profile.category === 'rotorcraft') {
    return [
      {
        gateId: 'pre-takeoff',
        title: 'PRE-TAKEOFF',
        items: [
          { text: `${profile.name} Collective - FULL DOWN`, desc: 'Verify minimum collective pitch prior to rotor spin-up.', sync: 'throttle>=0' },
          { text: 'Anti-Collision & Nav Lights - ON', desc: 'Alert ramp personnel of spinning rotors.', sync: 'lightsOn' },
          { text: 'Rotor RPM 100% & Pedals Check', desc: 'Confirm nominal Nr and cyclic freedom before hover.' },
          { text: 'Hover Check (5-15 ft AGL)', desc: 'Check CG balance and directional stability in hover.' }
        ]
      },
      {
        gateId: 'pre-cruise',
        title: 'PRE-CRUISE',
        items: [
          { text: 'Translational Lift (> 20 KTS)', desc: 'Smoothly transition forward past effective translational lift.', sync: 'kias>=20' },
          { text: 'Landing Gear - UP (If Retractable)', desc: profile.hasGear ? 'Retract gear once clear of obstacles.' : 'Fixed skids verified.', sync: profile.hasGear ? 'gear:up' : undefined },
          { text: 'Climb & Cruise Altitude (>= 500 ft)', desc: 'Verify clear vertical obstacle clearance.', sync: 'altitude>=500' },
          { text: 'Cruise Airspeed (> 70 KTS)', desc: 'Trim cyclic for steady cruise speed.', sync: 'kias>=70' }
        ]
      },
      {
        gateId: 'pre-landing',
        title: 'PRE-LANDING',
        items: [
          { text: `Approach Decel (<= ${Math.max(55, vref)} KTS)`, desc: 'Capture steady approach profile toward helipad.', sync: `kias<=${Math.max(55, vref)}` },
          { text: 'Landing Gear - DOWN / SKIDS CHECK', desc: profile.hasGear ? 'Confirm gear down and locked.' : 'Verify fixed skid alignment.', sync: profile.hasGear ? 'gear:down' : undefined },
          { text: 'Lights & Final Descent (AGL <= 150 ft)', desc: 'Confirm clear LZ and escape route.', sync: 'agl<=150' }
        ]
      },
      {
        gateId: 'pre-chocks-on',
        title: 'PRE-CHOCKS-ON',
        items: [
          { text: 'Touchdown & Zero Ground Speed', desc: 'Set skids firmly before lowering collective.', sync: 'groundStopped' },
          { text: 'Collective Full Down & Idle', desc: 'Lower collective smoothly to flat pitch.', sync: 'enginesOff' },
          { text: 'Fuel Valve / Battery - OFF', desc: 'Complete rotor brake and shutdown.', sync: 'groundStopped' }
        ]
      }
    ];
  }

  // Glider / Electro Sustainer (ID 11 Silent 2 Electro)
  if (id === '11' || lower.includes('silent') || lower.includes('jantar')) {
    return [
      {
        gateId: 'pre-takeoff',
        title: 'PRE-TAKEOFF',
        items: [
          { text: 'Spoilers / Airbrakes - CLOSED & LOCKED', desc: 'Double-check airbrake lever locked forward prior to launch.', sync: 'airbrakes:off' },
          { text: 'Controls Free & Canopy Latched', desc: 'Verify full roll, pitch, and yaw authority.' },
          { text: `Target Rotation / Liftoff Speed (${vr} KTS)`, desc: 'Rotate gently cleanly onto tow / electric climb.' }
        ]
      },
      {
        gateId: 'pre-cruise',
        title: 'PRE-CRUISE',
        items: [
          { text: 'Gear - UP & LOCKED', desc: 'Retract main wheel after leaving circuit.', sync: 'gear:up' },
          { text: 'Thermaling / Cruise Altitude (>= 1,500 ft)', desc: 'Establish energy margin for cross-country soar.', sync: 'altitude>=1500' },
          { text: `Cruise Speed (>= ${Math.max(45, vr + 10)} KTS)`, desc: 'Fly MacCready best L/D speed.', sync: `kias>=${Math.max(45, vr + 10)}` }
        ]
      },
      {
        gateId: 'pre-landing',
        title: 'PRE-LANDING',
        items: [
          { text: 'Undercarriage - DOWN', desc: 'Confirm main wheel extended prior to base leg.', sync: 'gear:down' },
          { text: `Approach Speed (<= ${vref + 10} KTS)`, desc: 'Fly stable approach at target speed.', sync: `kias<=${vref + 10}` },
          { text: 'Airbrakes - MODULATE APPROACH', desc: 'Use spoilers smoothly to control glidepath.', sync: 'airbrakes' }
        ]
      },
      {
        gateId: 'pre-chocks-on',
        title: 'PRE-CHOCKS-ON',
        items: [
          { text: 'Full Stop on Field', desc: 'Keep wings level until wheel comes to a stop.', sync: 'groundStopped' },
          { text: 'Master / Sustainer - OFF', desc: 'Secure glider battery and canopy.' }
        ]
      }
    ];
  }

  // Spacecraft & Orbital (Falcon 9 2844, Shuttle Atlantis 2953, X-15 2988)
  if (id === '2844' || id === '2953' || id === '2988' || profile.category === 'specialized') {
    const isShuttle = id === '2953' || lower.includes('atlantis');
    return [
      {
        gateId: 'pre-takeoff',
        title: 'PRE-TAKEOFF',
        items: [
          { text: `${profile.name} Hold-Down / Brakes`, desc: 'Check vehicle attitude and launch clear.', sync: 'parkingBrake' },
          { text: 'Flaps / Body Flap - T/O TRIM', desc: profile.maxFlaps > 0 ? `Set takeoff flap notch (${flaps.toLabel}).` : 'Elevons & RCS neutral.', sync: profile.maxFlaps > 0 ? 'flaps:0' : undefined },
          { text: 'Main Propulsion - FULL THRUST', desc: `Smoothly advance throttle to 100% for liftoff (Vr ~${vr} KTS).`, sync: 'throttle>=0.90' }
        ]
      },
      {
        gateId: 'pre-cruise',
        title: 'PRE-CRUISE',
        items: [
          { text: 'Gear - UP', desc: 'Retract undercarriage once positive climb verified.', sync: 'gear:up' },
          { text: 'High-Altitude Profile (>= 35,000 ft)', desc: 'Follow energy corridor above 35,000 ft.', sync: 'altitude>=35000' },
          { text: isShuttle ? 'Hypersonic Entry / Energy (>= 250 KTS)' : 'Supersonic / Boost Profile (M >= 1.50)', desc: 'Verify velocity stability prior to coast/entry.', sync: isShuttle ? 'kias>=250' : 'mach>=1.50' }
        ]
      },
      {
        gateId: 'pre-landing',
        title: 'PRE-LANDING',
        items: [
          { text: `Steep Glide Intercept (<= ${vref + 25} KTS)`, desc: 'Capture steep -18 deg outer glideslope corridor.', sync: `kias<=${vref + 25}` },
          { text: 'Landing Gear - DOWN (Below 300 ft AGL)', desc: 'Deploy heavy landing gear cleanly before flare.', sync: 'gear:down' },
          { text: 'Speedbrake - AS REQUIRED FOR ENERGY', desc: 'Modulate speedbrake to nail aiming point.', sync: profile.hasSpoilers ? 'airbrakes' : undefined }
        ]
      },
      {
        gateId: 'pre-chocks-on',
        title: 'PRE-CHOCKS-ON',
        items: [
          { text: 'Wheel Stop & Drag Chute', desc: 'Full stop on lakebed or long runway.', sync: 'groundStopped' },
          { text: 'Propulsion & APU - SECURED', desc: 'All engines and hydraulic systems off.', sync: 'enginesOff' }
        ]
      }
    ];
  }

  // Supersonic (Concorde 19/20, XB-70 2948, Tu-144 5642, SR-71)
  if (profile.category === 'supersonic') {
    return [
      {
        gateId: 'pre-takeoff',
        title: 'PRE-TAKEOFF',
        items: [
          { text: `${profile.name} Parking Brake - SET`, desc: 'Confirm runway alignment prior to reheat check.', sync: 'parkingBrake' },
          { text: 'External & Landing Lights - ON', desc: 'Max visibility during high-speed departure.', sync: 'lightsOn' },
          { text: 'Reheat / Afterburners - MAX FOR T/O', desc: `Smoothly engage full thrust; rotate at ${vr} KTS.`, sync: 'throttle>=0.95' }
        ]
      },
      {
        gateId: 'pre-cruise',
        title: 'PRE-CRUISE',
        items: [
          { text: 'Undercarriage - UP & LOCKED', desc: 'Retract below 270 KTS immediately after positive climb.', sync: 'gear:up' },
          { text: 'Supercruise Altitude (>= 45,000 ft)', desc: 'Climb smoothly into supersonic cruise block.', sync: 'altitude>=45000' },
          { text: 'Mach Cruise Established (M >= 1.80)', desc: 'Stabilize at Concorde/XB-70 Mach 2.0+ cruise.', sync: 'mach>=1.80' }
        ]
      },
      {
        gateId: 'pre-landing',
        title: 'PRE-LANDING',
        items: [
          { text: 'Decelerate Subsonic Before Approach', desc: 'Pass below 250 KTS prior to final vectoring.', sync: 'kias<=250' },
          { text: 'Landing Gear - DOWN (3 Green)', desc: 'Confirm gear extended cleanly by 1,500 ft AGL.', sync: 'gear:down' },
          { text: `Delta Vortex Approach (Vref ${vref} KTS)`, desc: 'Hold high nose attitude (12-13 deg pitch) with autothrottle.', sync: 'vref' }
        ]
      },
      {
        gateId: 'pre-chocks-on',
        title: 'PRE-CHOCKS-ON',
        items: [
          { text: 'Full Stop & Parking Brake - SET', desc: 'Engage reverse idle and apply firm wheel brakes.', sync: 'groundStopped&parkingBrake' },
          { text: 'Fuel Master Switches - OFF', desc: 'Shut down all powerplants and secure avionics.', sync: 'enginesOff' }
        ]
      }
    ];
  }

  // Fighters (F-16, F/A-18, F-22, F-35, Su-35, Rafale, T-38, Alphajet, YF-23, Typhoon)
  if (profile.category === 'fighter') {
    return [
      {
        gateId: 'pre-takeoff',
        title: 'PRE-TAKEOFF',
        items: [
          { text: `${profile.name} Parking Brake Check`, desc: 'Hold brakes while checking engine gauges.', sync: 'parkingBrake' },
          ...(profile.maxFlaps > 0
            ? [{ text: `Takeoff Flaps - ${flaps.toLabel}`, desc: 'Set combat takeoff flap configuration.', sync: `flaps:${flaps.toStep}` }]
            : [{ text: 'Automatic Leading-Edge Slats - ARMED', desc: 'Flight control computer auto-schedules maneuvering slats.' }]),
          { text: 'Lights & Speedbrake Closed', desc: 'Ensure speedbrake retracted cleanly for runway roll.', sync: profile.hasSpoilers ? 'airbrakes:off' : 'lightsOn' },
          { text: 'MIL / AB Thrust Selected', desc: `Rotate briskly at ${vr} KTS.`, sync: 'throttle>=0.85' }
        ]
      },
      {
        gateId: 'pre-cruise',
        title: 'PRE-CRUISE',
        items: [
          { text: 'Landing Gear - UP (< 250 KTS)', desc: 'Retract promptly before gear overspeed limit.', sync: 'gear:up' },
          { text: 'Flaps - UP / CLEAN', desc: 'Retract takeoff flaps accelerating past 230 KTS.', sync: 'flaps:0' },
          { text: 'Tactical Cruise Altitude (>= 15,000 ft)', desc: 'Level off at assigned flight level.', sync: 'altitude>=15000' },
          { text: 'Cruise Mach / Speed (>= 300 KTS)', desc: 'Verify steady cruise speed and G-limit clearance.', sync: 'kias>=300' }
        ]
      },
      {
        gateId: 'pre-landing',
        title: 'PRE-LANDING',
        items: [
          { text: `Pattern Entry Speed (<= ${Math.max(220, vref + 60)} KTS)`, desc: 'Extend speedbrake on downwind break as required.', sync: `kias<=${Math.max(220, vref + 60)}` },
          { text: 'Landing Gear - DOWN & LOCKED', desc: 'Deploy below 250 KTS; check 3 green.', sync: 'gear:down' },
          ...(profile.maxFlaps > 0 ? [{ text: `Landing Flaps - ${flaps.ldgLabel}`, desc: 'Configure full flaps on base turn.', sync: 'flaps:full' }] : []),
          { text: `On-Speed AOA / Vref (${vref} KTS)`, desc: 'Fly E-bracket velocity vector directly to runway.', sync: 'vref' }
        ]
      },
      {
        gateId: 'pre-chocks-on',
        title: 'PRE-CHOCKS-ON',
        items: [
          { text: 'Speedbrake & Flaps Retracted', desc: 'Clean aircraft Clear of Active Runway.', sync: profile.maxFlaps > 0 ? 'flaps:0' : 'airbrakes:off' },
          { text: 'Full Stop & Parking Brake - SET', desc: 'Secure ejection seat pin prior to cutoff.', sync: 'groundStopped&parkingBrake' },
          { text: 'Throttles OFF & Master Battery Off', desc: 'Shut down turbine(s) cleanly.', sync: 'enginesOff' }
        ]
      }
    ];
  }

  // Commercial Twin/Quad Jets (Boeing, Airbus, Regional, MD-11, C-5, C919)
  if (profile.category === 'airliner-twin' || profile.category === 'airliner-quad') {
    const cruiseMach = isBoeingWide || lower.includes('a350') || lower.includes('a380') ? 0.82 : 0.76;
    const cruiseAlt = isBoeingWide || lower.includes('a350') || lower.includes('a380') ? 28000 : 24000;
    const flapTitle = isAirbus
      ? `CONF (${flaps.toLabel}) & T.O CONFIG`
      : isBoeing737
      ? `Takeoff Flaps - FLAPS 5`
      : `Takeoff Flaps - ${flaps.toLabel}`;
    const cutText = isAirbus ? 'ENG MASTER 1 & 2 - OFF' : isBoeing737 ? 'Fuel Control Switches - CUTOFF' : `${profile.engineCount}x Fuel Cutoff - OFF`;

    return [
      {
        gateId: 'pre-takeoff',
        title: 'PRE-TAKEOFF',
        items: [
          { text: `${profile.name} Parking Brake Set`, desc: 'Hold position for pushback/runup check before brake release.', sync: 'parkingBrake' },
          { text: flapTitle, desc: `Configure ${profile.name} takeoff flaps (V2 / VR ${vr} KTS).`, sync: `flaps:${flaps.toStep}` },
          { text: 'Spoilers / Speedbrake - RETRACTED (0)', desc: 'Verify ground spoilers down prior to takeoff.', sync: profile.hasSpoilers ? 'airbrakes:off' : undefined },
          { text: 'Landing & Strobe Lights - ON', desc: 'Required prior to entering active runway.', sync: 'lightsOn' },
          { text: 'TO/GA or FLEX Thrust Applied', desc: 'Verify symmetric N1/EPR spool across all engines.', sync: 'throttle>=0.80' }
        ]
      },
      {
        gateId: 'pre-cruise',
        title: 'PRE-CRUISE',
        items: [
          { text: 'Landing Gear - UP & OFF', desc: 'Retract on positive rate of climb.', sync: 'gear:up' },
          { text: 'Flaps - UP / CLEAN', desc: 'Retract flaps cleanly above minimum clean speed.', sync: 'flaps:0' },
          { text: `Climb to Cruise Level (>= ${(cruiseAlt / 100).toFixed(0)} FL)`, desc: `Level off at FL${(cruiseAlt / 100).toFixed(0)}+ / verify cabin press.`, sync: `altitude>=${cruiseAlt}` },
          { text: `Cruise Mach Established (M >= ${cruiseMach.toFixed(2)})`, desc: 'Confirm A/THR Mach hold and ALTITUDE BURN nominal.', sync: `mach>=${cruiseMach.toFixed(2)}` }
        ]
      },
      {
        gateId: 'pre-landing',
        title: 'PRE-LANDING',
        items: [
          { text: 'Speed Brake - ARMED', desc: 'Arm ground spoilers for automatic touchdown deployment.', sync: profile.hasSpoilers ? 'airbrakes' : undefined },
          { text: 'Landing Gear - DOWN (3 Green)', desc: 'Confirm gear locked down prior to outer marker / 1,500 ft.', sync: 'gear:down' },
          { text: `Landing Flaps - ${flaps.ldgLabel}`, desc: `Full landing configuration for ${profile.name}.`, sync: 'flaps:full' },
          { text: `Stabilized on Vref (${vref} KTS)`, desc: 'On glidepath with A/THR LANDING mode armed if desired.', sync: 'vref' }
        ]
      },
      {
        gateId: 'pre-chocks-on',
        title: 'PRE-CHOCKS-ON',
        items: [
          { text: 'Speedbrakes DOWN & Flaps UP', desc: 'Clean wing after vacating runway onto taxiway.', sync: 'flaps:0&airbrakes:off' },
          { text: 'Aircraft Stopped & Parking Brake - SET', desc: 'Set brake on arrival stand once chocks ready.', sync: 'groundStopped&parkingBrake' },
          { text: cutText, desc: 'Cut fuel masters, confirm N1 spool down & beacon OFF.', sync: 'enginesOff' }
        ]
      }
    ];
  }

  // Turboprops (ATR 42/72, Dash 8 Q400, King Air, DHC-6 Twin Otter, PC-7)
  if (profile.category === 'turboprop') {
    return [
      {
        gateId: 'pre-takeoff',
        title: 'PRE-TAKEOFF',
        items: [
          { text: `${profile.name} Parking Brake - SET`, desc: 'Runup torque and prop feather check complete.', sync: 'parkingBrake' },
          ...(profile.maxFlaps > 0 ? [{ text: `Takeoff Flaps - ${flaps.toLabel}`, desc: 'Set takeoff flap notch.', sync: `flaps:${flaps.toStep}` }] : []),
          { text: 'Recognition / Strobe Lights - ON', desc: 'Clear departure runway.', sync: 'lightsOn' },
          { text: 'Takeoff Power Applied', desc: `Smooth power advance; rotate cleanly at ${vr} KTS.`, sync: 'throttle>=0.85' }
        ]
      },
      {
        gateId: 'pre-cruise',
        title: 'PRE-CRUISE',
        items: [
          ...(profile.hasGear ? [{ text: 'Landing Gear - UP', desc: 'Retract gear with positive rate of climb.', sync: 'gear:up' }] : []),
          ...(profile.maxFlaps > 0 ? [{ text: 'Flaps - 0 / CLEAN', desc: 'Accelerate past climb flap retraction speed.', sync: 'flaps:0' }] : []),
          { text: 'Turboprop Cruise Alt (>= 10,000 ft)', desc: 'Climb to economical turboprop cruise block.', sync: 'altitude>=10000' },
          { text: 'Cruise Airspeed (>= 150 KTS)', desc: 'Confirm prop sync ON and torque balanced.', sync: 'kias>=150' }
        ]
      },
      {
        gateId: 'pre-landing',
        title: 'PRE-LANDING',
        items: [
          ...(profile.hasGear ? [{ text: 'Undercarriage - DOWN', desc: 'Check 3 green lights prior to final.', sync: 'gear:down' }] : []),
          ...(profile.maxFlaps > 0 ? [{ text: `Landing Flaps - ${flaps.ldgLabel}`, desc: 'Set full approach/landing flaps.', sync: 'flaps:full' }] : []),
          { text: `Stabilized Approach Vref (${vref} KTS)`, desc: 'Hold target Vref down the glideslope.', sync: 'vref' }
        ]
      },
      {
        gateId: 'pre-chocks-on',
        title: 'PRE-CHOCKS-ON',
        items: [
          ...(profile.maxFlaps > 0 ? [{ text: 'Flaps - UP (0)', desc: 'Retract flaps after clearing runway.', sync: 'flaps:0' }] : []),
          { text: 'Full Stop & Parking Brake - SET', desc: 'Confirm beta/reverse idle before chocking.', sync: 'groundStopped&parkingBrake' },
          { text: 'Condition Levers - FUEL CUTOFF', desc: 'Shut down turboprop engines cleanly.', sync: 'enginesOff' }
        ]
      }
    ];
  }

  // General Aviation Piston (Fixed & Retractable: Cessna 152/172, Cub, Warrior, Beaver, Baron, DC-3, P-38, Spitfire, Zlin)
  return [
    {
      gateId: 'pre-takeoff',
      title: 'PRE-TAKEOFF',
      items: [
        { text: `${profile.name} Parking Brake & Controls Check`, desc: 'Full & free control deflection verified.', sync: 'parkingBrake' },
        ...(profile.maxFlaps > 0
          ? [{ text: `Takeoff Flaps - ${flaps.toLabel}`, desc: `Short/standard takeoff flaps (VR ${vr} KTS).`, sync: `flaps:${flaps.toStep}` }]
          : [{ text: 'Elevator & Rudder Trim - SET T/O', desc: `Clean wing aircraft; neutral trim (VR ${vr} KTS).` }]),
        { text: 'Mixture RICH & Beacon/Landing Light ON', desc: 'Ensure full rich mixture for takeoff.', sync: 'lightsOn' },
        { text: 'Full Power Takeoff Check', desc: 'Verify full RPM / manifold pressure cleanly.', sync: 'throttle>=0.85' }
      ]
    },
    {
      gateId: 'pre-cruise',
      title: 'PRE-CRUISE',
      items: [
        ...(profile.hasGear ? [{ text: 'Landing Gear - UP', desc: 'Retract undercarriage once runway clear.', sync: 'gear:up' }] : []),
        ...(profile.maxFlaps > 0 ? [{ text: 'Flaps - UP (0)', desc: 'Retract flaps above safe climb speed.', sync: 'flaps:0' }] : []),
        { text: 'Cruise Altitude (>= 2,500 ft)', desc: 'Reach planned VFR/IFR cruising level.', sync: 'altitude>=2500' },
        { text: `Cruise Speed (>= ${Math.max(70, vr + 20)} KTS)`, desc: 'Level off, trim pitch, and lean mixture.', sync: `kias>=${Math.max(70, vr + 20)}` }
      ]
    },
    {
      gateId: 'pre-landing',
      title: 'PRE-LANDING',
      items: [
        { text: 'GUMPS: Gas / Mixture RICH', desc: 'Select fullest tank and full rich mixture.' },
        ...(profile.hasGear ? [{ text: 'Undercarriage - DOWN & WELDED', desc: 'Verify gear indicator green before final.', sync: 'gear:down' }] : []),
        ...(profile.maxFlaps > 0 ? [{ text: `Landing Flaps - ${flaps.ldgLabel}`, desc: `Below Vfe speed; configure ${flaps.ldgLabel}.`, sync: 'flaps:full' }] : []),
        { text: `Target Approach Speed Vref (${vref} KTS)`, desc: `Establish stabilized ${vref} KTS final approach.`, sync: 'vref' }
      ]
    },
    {
      gateId: 'pre-chocks-on',
      title: 'PRE-CHOCKS-ON',
      items: [
        ...(profile.maxFlaps > 0 ? [{ text: 'Flaps - UP (0)', desc: 'Retract flaps after vacating runway.', sync: 'flaps:0' }] : []),
        { text: 'Full Stop & Parking Brake - SET', desc: 'Apply wheel brakes and tie down / chock.', sync: 'groundStopped&parkingBrake' },
        { text: 'Mixture IDLE CUT-OFF & Master OFF', desc: 'Stop propeller and switch off mags & avionics.', sync: 'enginesOff' }
      ]
    }
  ];
}
