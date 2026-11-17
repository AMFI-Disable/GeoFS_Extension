import type { ChecklistProcedure } from '../checklist-system/procedures';
import type { GeoFSAircraftInstance, GeoFSEngine, GeoFSPositionControl } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';

const SYSTEMS = {
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

type System = keyof typeof SYSTEMS;
export type FailureType = System | `engine${number}`;

const SYSTEM_DESCRIPTIONS: Record<System, string> = {
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

interface FailureEffect {
  intervalMs: number;
  dueAt: number;
  apply: (telemetry?: FlightTelemetry) => void;
  restore: () => void;
  verifyRestored?: () => boolean;
}

export function pinValue<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K]
): Pick<FailureEffect, 'apply' | 'restore'> {
  const hadKey = Object.hasOwn(target, key);
  const original = target[key];
  return {
    apply: () => {
      target[key] = value;
    },
    restore: () => {
      if (hadKey) target[key] = original;
      else delete target[key];
    }
  };
}

const gearSelection = {
  gearFront: [0, /front|nose|tail|steer/],
  gearLeft: [1, /left|l_g|main l|l-gear/],
  gearRight: [2, /right|r_g|main r|r-gear/]
} as const;

function label(type: FailureType): string {
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

function jamControl(control: GeoFSPositionControl, target: number, position: number) {
  const pins = [
    pinValue(control, 'target', target),
    pinValue(control, 'position', position),
    pinValue(control, 'positionTarget', position),
    pinValue(control, 'delta', 0)
  ];
  return {
    apply: () => pins.forEach((pin) => pin.apply()),
    restore: () => pins.forEach((pin) => pin.restore())
  };
}

function engineSmoke(engine: GeoFSEngine) {
  const fx = window.geofs?.fx;
  const Emitter = fx?.ParticleEmitter;
  const position = engine.object3d?.worldPosition;
  const anchor = engine.points?.contrailAnchor ?? (position && { worldPosition: position });
  if (!Emitter || !anchor) return;
  try {
    const emitter = new Emitter({
      anchor,
      duration: 1e10,
      rate: 0.03,
      life: 1e4,
      easing: 'easeOutQuart',
      startScale: 0.01,
      endScale: 0.2,
      randomizeStartScale: 0.01,
      randomizeEndScale: 0.15,
      startOpacity: 1,
      endOpacity: 0.2,
      startRotation: 'random',
      texture: 'whitesmoke'
    });
    const Color = window.Cesium?.Color;
    const smokeColor = Color && new Color(0.1, 0.1, 0.1, 1);
    return {
      apply: () => {
        for (const particle of Object.values(fx.particles ?? {})) {
          if (particle?._emitter === emitter && smokeColor) particle.setColor?.(smokeColor);
        }
      },
      restore: () => {
        emitter.destroy();
        for (const particle of Object.values(fx.particles ?? {})) {
          if (particle?._emitter === emitter) particle.destroy();
        }
      }
    };
  } catch (error) {
    console.warn('[GeoFS Extension] Could not start engine smoke:', error);
    return undefined;
  }
}

const SYSTEM_GROUPS: ReadonlyArray<readonly [string, string, readonly System[]]> = [
  ['gear', 'Landing Gear', ['gearFront', 'gearLeft', 'gearRight']],
  ['ctrl', 'Flight Controls', ['ailerons', 'elevators', 'rudder']],
  ['hyd', 'Hydraulics & Systems', ['flaps', 'brakes', 'spoilers']],
  ['adv', 'Advanced Emergencies', ['electrical', 'fuelLeak', 'structural', 'pressurization', 'mcas', 'pitotStatic']]
];

const FAILURE_STYLES = `
  @keyframes geofsExtPulseRed {
    from { box-shadow: 0 0 4px #ef4444; }
    to { box-shadow: 0 0 12px #ef4444; }
  }
  .geofs-ext-fail-pill {
    position: fixed;
    right: 15px;
    bottom: 15px;
    z-index: 2147483003;
    padding: 5px 14px;
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 10px;
    cursor: grab;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    user-select: none;
    touch-action: none;
    white-space: nowrap;
  }
  .geofs-ext-fail-pill.has-failures {
    border-color: #ef4444;
    color: #ff8d8d;
    animation: geofsExtPulseRed 1s infinite alternate;
  }
  #geofs-failure-menu {
    box-sizing: border-box;
    position: fixed;
    left: 50px;
    top: 80px;
    width: 420px;
    max-width: calc(100vw - 24px);
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #888888;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);
    color: #ffffff;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    z-index: 2147483004;
    display: none;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  #geofs-failure-menu * {
    box-sizing: border-box;
  }
  .geofs-ext-fail-led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 5px #22c55e;
    flex-shrink: 0;
  }
  .geofs-ext-fail-led.is-failed {
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
    animation: geofsExtPulseRed 1s infinite alternate;
  }
  .geofs-ext-fail-btn {
    background: #000000;
    color: #ffffff;
    border: 1px solid #888888;
    border-radius: 15px;
    padding: 4px 8px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }
  .geofs-ext-fail-btn--danger {
    border-color: #ef4444;
    color: #ff6b6b;
  }
  .geofs-ext-fail-btn--ok {
    border-color: #4caf50;
    color: #4ade80;
  }
  .geofs-ext-fail-btn--warn {
    border-color: #eab308;
    color: #facc15;
  }
`;

export class FailureSimulatorModule implements IModule {
  public readonly id = 'failure-simulator';
  public readonly name = 'Failure Simulator';
  public readonly description = 'Draggable modal failures with probability rolls, emergency QRH overrides, and verified recovery.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private aircraft: GeoFSAircraftInstance | undefined;
  private active = new Map<FailureType, FailureEffect>();
  private chances = new Map<FailureType, number>();
  private collapsedSections = new Set<string>();
  private nextProbabilityMs = 0;

  private pill: HTMLButtonElement | null = null;
  private modal: HTMLDivElement | null = null;
  private bodyEl: HTMLDivElement | null = null;
  private probBtn: HTMLButtonElement | null = null;
  private probInfoEl: HTMLElement | null = null;
  private styleEl: HTMLStyleElement | null = null;

  private restoreWeather?: () => void;
  private lastAltitude = 0;
  private lastTimestamp = 0;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.ctx = context;
    const savedChances = context.getSettings().failureSystemChances ?? {};
    for (const [k, v] of Object.entries(savedChances)) {
      if (typeof v === 'number' && Number.isFinite(v)) {
        this.chances.set(k as FailureType, Math.max(0, Math.min(1, v)));
      }
    }

    this.unmounts.push(
      context.onEvent('failure:request-active', () => {
        for (const type of this.active.keys()) this.emitFailure(type);
      })
    );
    this.unmounts.push(
      context.onEvent<{ type: FailureType }>('failure:attempt-recovery', ({ type }) => {
        this.attemptRecovery(type);
      })
    );

    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'geofs-ext-failure-styles';
      style.textContent = FAILURE_STYLES;
      document.head?.appendChild(style);
      this.styleEl = style;

      const pill = document.createElement('button');
      pill.type = 'button';
      pill.id = 'fail-btn';
      pill.className = 'geofs-ext-fail-pill';
      pill.textContent = 'FAILURES';
      pill.title = 'Open Failure Simulator Modal (Drag to move)';
      document.body?.appendChild(pill);
      this.pill = pill;
      this.unmounts.push(context.anchors.makeDraggable(pill, 'geofs_ext_fail_pill_pos', pill));
      this.unmounts.push(() => pill.remove());

      pill.addEventListener('click', () => {
        if (pill.dataset.justDragged === '1' || !this.modal) return;
        const willOpen = this.modal.style.display === 'none' || !this.modal.style.display;
        this.modal.style.display = willOpen ? 'flex' : 'none';
        if (willOpen) {
          this.render();
          context.anchors.bringToFront(this.modal);
          context.anchors.clampElementToViewport(this.modal);
        }
      });

      const modal = document.createElement('div');
      modal.id = 'geofs-failure-menu';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div id="fail-header" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:rgba(0,0,0,0.5);border-bottom:1px solid rgba(136,136,136,0.45);cursor:grab;user-select:none;touch-action:none;">
          <span style="font-weight:700;font-size:12px;letter-spacing:0.6px;color:#ffffff;">FAILURE SIMULATOR</span>
          <button type="button" data-role="close" style="background:none;border:none;color:#cccccc;cursor:pointer;font-size:15px;line-height:1;">✕</button>
        </div>
        <div style="padding:12px 16px;border-bottom:1px solid rgba(136,136,136,0.3);display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;gap:8px;">
            <button type="button" id="enBtn" class="geofs-ext-fail-btn geofs-ext-fail-btn--ok" style="flex:1;padding:7px 10px;">ENABLE PROBABILITY</button>
            <button type="button" data-role="clear-all" class="geofs-ext-fail-btn geofs-ext-fail-btn--danger" style="padding:7px 10px;">CLEAR ALL FAILURES</button>
          </div>
          <div data-role="prob-info" style="font-size:10px;color:#aaaaaa;display:flex;justify-content:space-between;">
            <span>Probability rolls off</span>
            <span>Recovery: 60%</span>
          </div>
        </div>
        <div data-role="sections" style="max-height:58vh;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px;"></div>
      `;
      document.body?.appendChild(modal);
      this.modal = modal;
      this.bodyEl = modal.querySelector('[data-role="sections"]');
      this.probBtn = modal.querySelector('#enBtn');
      this.probInfoEl = modal.querySelector('[data-role="prob-info"]');

      const header = modal.querySelector<HTMLElement>('#fail-header') ?? modal;
      this.unmounts.push(context.anchors.makeDraggable(modal, 'geofs_ext_fail_modal_pos', header));
      this.unmounts.push(() => modal.remove());

      modal.querySelector('[data-role="close"]')?.addEventListener('click', () => {
        modal.style.display = 'none';
      });
      modal.querySelector('[data-role="clear-all"]')?.addEventListener('click', () => this.clear());
      this.probBtn?.addEventListener('click', () => {
        context.updateSettings({ failureProbabilitiesEnabled: !context.getSettings().failureProbabilitiesEnabled });
      });
    }

    this.aircraft = window.geofs?.aircraft?.instance;
    this.syncProbabilityUi(context.getSettings());
    this.render();
  }

  private updatePillBadge(): void {
    if (!this.pill) return;
    const count = this.active.size;
    this.pill.textContent = count > 0 ? `FAILURES (${count})` : 'FAILURES';
    this.pill.classList.toggle('has-failures', count > 0);
  }

  private syncProbabilityUi(settings: ExtensionSettings): void {
    if (this.probBtn) {
      const enabled = Boolean(settings.failureProbabilitiesEnabled);
      this.probBtn.textContent = enabled ? 'DISABLE PROBABILITY' : 'ENABLE PROBABILITY';
      this.probBtn.className = `geofs-ext-fail-btn ${enabled ? 'geofs-ext-fail-btn--danger' : 'geofs-ext-fail-btn--ok'}`;
      this.probBtn.setAttribute('aria-pressed', String(enabled));
    }
    if (this.probInfoEl) {
      const intervalSec = Math.max(10, settings.failureProbabilityIntervalSec || 60);
      const remSec =
        settings.failureProbabilitiesEnabled && this.nextProbabilityMs > this.lastTimestamp
          ? Math.ceil((this.nextProbabilityMs - this.lastTimestamp) / 1000)
          : intervalSec;
      const statusText = settings.failureProbabilitiesEnabled
        ? `Roll every ${intervalSec}s · Next: ${remSec}s`
        : `Probability off (${intervalSec}s cycle)`;
      this.probInfoEl.innerHTML = `<span>${statusText}</span><span>Recovery: ${settings.failureRecoveryChancePct ?? 60}%</span>`;
    }
  }

  private persistChances(): void {
    const obj: Record<string, number> = {};
    for (const [k, v] of this.chances.entries()) {
      if (v > 0) obj[k] = Number(v.toFixed(3));
    }
    this.ctx?.updateSettings({ failureSystemChances: obj });
  }

  private render(): void {
    this.updatePillBadge();
    if (!this.bodyEl) return;

    const engines = this.aircraft?.engines?.length ?? (this.aircraft?.engine ? 1 : 0);
    const engineTypes = Array.from({ length: engines }, (_, index): FailureType => `engine${index}`);
    const groups: ReadonlyArray<readonly [string, string, readonly FailureType[]]> = [
      ...SYSTEM_GROUPS,
      ['eng', 'Engines', engineTypes]
    ];

    this.bodyEl.replaceChildren(
      ...groups
        .filter(([, , types]) => types.length > 0)
        .map(([groupId, title, types]) => {
          const wrap = document.createElement('div');
          const collapsed = this.collapsedSections.has(groupId);

          const sectHeader = document.createElement('div');
          sectHeader.style.cssText =
            'display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:rgba(255,255,255,0.06);border:1px solid rgba(136,136,136,0.3);border-radius:10px;cursor:pointer;';

          const left = document.createElement('div');
          left.style.cssText = 'display:flex;align-items:center;gap:6px;';
          const arrow = document.createElement('span');
          arrow.style.cssText = `font-size:9px;transition:transform 0.15s;transform:${collapsed ? 'rotate(0deg)' : 'rotate(90deg)'};`;
          arrow.textContent = '▶';
          const heading = document.createElement('span');
          heading.style.cssText = 'font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;';
          heading.textContent = title;
          left.append(arrow, heading);

          const groupActions = document.createElement('div');
          groupActions.style.cssText = 'display:flex;gap:4px;';
          for (const action of ['AUTO', 'FAIL', 'FIX'] as const) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `geofs-ext-fail-btn ${
              action === 'FAIL' ? 'geofs-ext-fail-btn--danger' : action === 'FIX' ? 'geofs-ext-fail-btn--ok' : ''
            }`;
            btn.textContent = action;
            btn.setAttribute('aria-label', `${action} ${title}`);
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              for (const type of types) {
                if (action === 'AUTO') {
                  this.chances.set(type, Number((Math.random() * (groupId === 'adv' ? 0.05 : 0.1)).toFixed(2)));
                } else if (action === 'FAIL') {
                  this.fail(type, false);
                } else if (this.active.has(type)) {
                  this.fix(type);
                }
              }
              if (action === 'AUTO') this.persistChances();
              this.render();
            });
            groupActions.appendChild(btn);
          }

          sectHeader.append(left, groupActions);
          sectHeader.addEventListener('click', () => {
            if (this.collapsedSections.has(groupId)) this.collapsedSections.delete(groupId);
            else this.collapsedSections.add(groupId);
            this.render();
          });

          const content = document.createElement('div');
          content.style.cssText = `display:${collapsed ? 'none' : 'flex'};flex-direction:column;gap:6px;padding-top:6px;`;
          for (const type of types) {
            content.appendChild(this.systemRow(type));
          }

          wrap.append(sectHeader, content);
          return wrap;
        })
    );
  }

  private systemRow(type: FailureType): HTMLElement {
    const failed = this.active.has(type);
    const chancePct = Math.round((this.chances.get(type) ?? 0) * 100);

    const card = document.createElement('div');
    card.dataset.failureType = type;
    card.style.cssText = 'padding:8px 10px;background:rgba(255,255,255,0.03);border:1px solid rgba(136,136,136,0.28);border-radius:10px;';

    const top = document.createElement('div');
    top.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;';
    const titleWrap = document.createElement('div');
    titleWrap.style.cssText = 'display:flex;align-items:center;gap:7px;';
    const led = document.createElement('div');
    led.id = `led-${type}`;
    led.className = `geofs-ext-fail-led ${failed ? 'is-failed' : ''}`;
    const nameSpan = document.createElement('span');
    nameSpan.style.cssText = 'font-size:11px;font-weight:700;color:#ffffff;';
    nameSpan.textContent = label(type);
    titleWrap.append(led, nameSpan);

    const valSpan = document.createElement('span');
    valSpan.style.cssText = 'font-size:10px;color:#aaaaaa;';
    valSpan.textContent = `${chancePct}%`;
    top.append(titleWrap, valSpan);

    const desc = document.createElement('div');
    desc.style.cssText = 'font-size:9.5px;font-style:italic;color:#9ca3af;margin-bottom:6px;line-height:1.25;';
    desc.textContent = type.startsWith('engine')
      ? 'Thrust loss and heavy smoke. Expect yaw asymmetry and reduced climb performance.'
      : SYSTEM_DESCRIPTIONS[type as System];

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.step = '1';
    slider.value = String(chancePct);
    slider.style.cssText = 'width:100%;height:4px;margin-bottom:7px;accent-color:#4caf50;cursor:pointer;';
    slider.setAttribute('aria-label', `${label(type)} probability percentage`);
    slider.addEventListener('input', () => {
      valSpan.textContent = `${slider.value}%`;
      this.chances.set(type, Math.max(0, Math.min(100, Number(slider.value) || 0)) / 100);
    });
    slider.addEventListener('change', () => this.persistChances());

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:5px;';

    const failBtn = document.createElement('button');
    failBtn.type = 'button';
    failBtn.dataset.action = 'fail';
    failBtn.className = 'geofs-ext-fail-btn geofs-ext-fail-btn--danger';
    failBtn.style.flex = '1';
    failBtn.textContent = 'FAIL';
    failBtn.disabled = failed;
    failBtn.addEventListener('click', () => this.fail(type));

    const recoverBtn = document.createElement('button');
    recoverBtn.type = 'button';
    recoverBtn.dataset.action = 'recover';
    recoverBtn.className = 'geofs-ext-fail-btn geofs-ext-fail-btn--warn';
    recoverBtn.style.flex = '1';
    recoverBtn.textContent = 'RECOVER';
    recoverBtn.disabled = !failed || !isFailureRecoverable(type);
    recoverBtn.title = isFailureRecoverable(type)
      ? 'Roll probability recovery via QRH procedure'
      : 'Permanent airframe damage cannot be repaired in flight';
    recoverBtn.addEventListener('click', () => this.attemptRecovery(type));

    const fixBtn = document.createElement('button');
    fixBtn.type = 'button';
    fixBtn.dataset.action = 'fix';
    fixBtn.className = 'geofs-ext-fail-btn geofs-ext-fail-btn--ok';
    fixBtn.style.flex = '1';
    fixBtn.textContent = 'FIX';
    fixBtn.disabled = !failed;
    fixBtn.addEventListener('click', () => {
      this.fix(type);
      this.render();
    });

    actions.append(failBtn, recoverBtn, fixBtn);
    card.append(top, desc, slider, actions);
    return card;
  }

  private effect(type: FailureType, aircraft: GeoFSAircraftInstance): FailureEffect | undefined {
    const now = Date.now();
    const repeat = (
      pins: Pick<FailureEffect, 'apply' | 'restore'>,
      intervalMs = 1000,
      verifyRestored?: () => boolean
    ): FailureEffect => ({ ...pins, intervalMs, dueAt: now, verifyRestored });

    if (type.startsWith('engine')) {
      const index = Number(type.slice(6));
      const engine = aircraft.engines?.[index] ?? (index === 0 ? aircraft.engine : undefined);
      if (!engine) return;
      const originalThrust = engine.thrust;
      const thrust = pinValue(engine, 'thrust', 0);
      const smoke = engineSmoke(engine);
      return repeat(
        {
          apply: () => {
            thrust.apply();
            smoke?.apply();
          },
          restore: () => {
            thrust.restore();
            smoke?.restore();
          }
        },
        50,
        () => engine.thrust === originalThrust
      );
    }

    switch (type) {
      case 'gearFront':
      case 'gearLeft':
      case 'gearRight': {
        const [fallback, pattern] = gearSelection[type];
        const suspensions = aircraft.suspensions ?? [];
        const point =
          (suspensions.filter((item) => pattern.test(item.name?.toLowerCase() ?? '')).at(-1) ??
            suspensions[fallback])?.collisionPoints?.[0];
        if (!point) return undefined;
        const originalZ = point[2];
        return repeat(pinValue(point, 2, 30), 1000, () => point[2] === originalZ);
      }
      case 'ailerons':
      case 'elevators':
      case 'rudder': {
        const search = type === 'rudder' ? type : type.slice(0, -1);
        const targets: Array<{ object3d: NonNullable<GeoFSAircraftInstance['airfoils']>[number]['object3d']; orig: [number, number, number] | undefined }> = [];
        const pins = (aircraft.airfoils ?? []).flatMap((foil) => {
          if (!foil.object3d || !foil.name?.toLowerCase().includes(search)) return [];
          targets.push({ object3d: foil.object3d, orig: foil.object3d._scale });
          return [pinValue(foil.object3d, '_scale', [0, 0, 0])];
        });
        if (!pins.length) return;
        return repeat(
          {
            apply: () => pins.forEach((pin) => pin.apply()),
            restore: () => pins.forEach((pin) => pin.restore())
          },
          1000,
          () => targets.every((t) => JSON.stringify(t.object3d?._scale) === JSON.stringify(t.orig))
        );
      }
      case 'flaps':
      case 'spoilers': {
        const control = type === 'flaps' ? window.controls?.flaps : window.controls?.airbrakes;
        const position = control?.position;
        if (!control || typeof position !== 'number' || !Number.isFinite(position)) return;
        const limit = type === 'flaps' ? Math.max(0, aircraft.definition?.flapsSteps ?? 0) : 1;
        const target = Math.max(0, Math.min(limit, type === 'flaps' ? Math.round(control.target ?? 0) : position));
        return repeat(jamControl(control, target, position), 50, () => control.delta !== 0);
      }
      case 'brakes':
        return window.controls && repeat(pinValue(window.controls, 'brakes', 0), 500);
      case 'electrical': {
        const autopilot = window.geofs?.autopilot;
        const instruments = window.instruments;
        const wasVisible = instruments?.visible !== false;
        const pins = (aircraft.cockpitSetup?.parts ?? []).slice(1, 6).flatMap((part) =>
          part?.object3d ? [pinValue(part.object3d, '_scale', [0, 0, 0])] : []
        );
        return repeat(
          {
            apply: () => {
              autopilot?.turnOff?.();
              instruments?.hide?.();
              pins.forEach((pin) => pin.apply());
            },
            restore: () => {
              pins.forEach((pin) => pin.restore());
              if (wasVisible) instruments?.show?.();
            }
          },
          1000,
          () => !wasVisible || instruments?.visible !== false
        );
      }
      case 'pitotStatic': {
        const instruments = window.instruments;
        const original = instruments?.update;
        if (!instruments || !original) return;
        const wrapper = function (this: unknown, ...args: unknown[]) {
          const values = window.geofs?.animation?.values;
          if (!values) return original.apply(this, args);
          const kias = pinValue(values, 'kias', 0);
          const altitude = pinValue(values, 'altitude', 0);
          try {
            kias.apply();
            altitude.apply();
            return original.apply(this, args);
          } finally {
            kias.restore();
            altitude.restore();
          }
        };
        return repeat(
          {
            apply: () => {
              if (instruments.update === original) instruments.update = wrapper;
            },
            restore: () => {
              if (instruments.update === wrapper) instruments.update = original;
            }
          },
          1000,
          () => instruments.update === original
        );
      }
      case 'fuelLeak': {
        let stopped = false;
        return {
          intervalMs: 1000,
          dueAt: now + 120_000,
          apply: () => {
            if (aircraft.engine?.on === false) return;
            stopped = (this.ctx?.sim.stopEngines() ?? false) || stopped;
          },
          restore: () => {
            if (!stopped || aircraft.crashed || aircraft !== window.geofs?.aircraft?.instance) return;
            if (aircraft.startEngines) aircraft.startEngines();
            else aircraft.startEngine?.();
          }
        };
      }
      case 'structural':
      case 'pressurization': {
        const weather = window.weather?.definition;
        if (!weather) return;
        this.restoreWeather ??= pinValue(weather, 'turbulences', 3).restore;
        return repeat(
          {
            apply: () => this.applyWeather(),
            restore: () => this.applyWeather()
          },
          1000
        );
      }
      case 'mcas': {
        const controls = window.controls;
        if (!controls) return;
        const origMin = controls.elevatorTrimMin;
        const limit = pinValue(controls, 'elevatorTrimMin', -10);
        const trim = pinValue(controls, 'elevatorTrim', controls.elevatorTrim);
        return repeat(
          {
            apply: (telemetry) => {
              limit.apply();
              if (
                telemetry &&
                !telemetry.autopilotOn &&
                controls.flaps?.position === 0 &&
                (telemetry.timestamp - now) % 10_000 < 5000 &&
                (controls.elevatorTrim ?? 0) > -10
              ) {
                controls.elevatorTrim = (controls.elevatorTrim ?? 0) - 0.01;
              }
            },
            restore: () => {
              limit.restore();
              trim.restore();
            }
          },
          50,
          () => controls.elevatorTrimMin === origMin
        );
      }
    }
  }

  private applyWeather(): void {
    const weather = window.weather?.definition;
    if (weather && this.active.has('structural')) weather.turbulences = 3;
    else if (weather && this.active.has('pressurization')) {
      weather.turbulences = Math.max(0, (this.lastAltitude - 9000) / 5000);
    } else {
      this.restoreWeather?.();
      this.restoreWeather = undefined;
    }
  }

  private emitFailure(type: FailureType): void {
    this.ctx?.emitEvent('failure:triggered', {
      type,
      procedure: emergencyProcedure(type),
      recoverable: isFailureRecoverable(type)
    });
  }

  public attemptRecovery(type: FailureType, forcedRoll?: number): boolean {
    if (!this.active.has(type) || !this.ctx) return false;
    const recoveryPct = this.ctx.getSettings().failureRecoveryChancePct ?? 60;
    const roll = forcedRoll ?? Math.random();
    const ok = computeRecoverySuccess(type, recoveryPct, roll);

    if (ok) {
      const verified = this.fix(type);
      if (verified) {
        this.ctx.emitDiag?.('RESTORE_VERIFIED', { type });
        this.ctx.anchors.showToast(`${label(type)} RECOVERED & RESTORED`, 'info');
        this.render();
        return true;
      }
    }

    this.ctx.emitDiag?.('RECOVERY_FAILED', { type });
    this.ctx.anchors.showToast(`${label(type)} recovery failed — Contingency checklist loaded`, 'critical');
    this.ctx.emitEvent('failure:contingency', {
      type,
      procedure: contingencyProcedure(type)
    });
    this.render();
    return false;
  }

  private fail(type: FailureType, render = true): void {
    if (!this.aircraft || this.aircraft.crashed || this.active.has(type)) return;
    const effect = this.effect(type, this.aircraft);
    if (!effect) {
      this.ctx?.anchors.showToast(`${label(type)} unavailable on this aircraft.`, 'warn');
      return;
    }
    this.active.set(type, effect);
    if (type !== 'fuelLeak') effect.apply();
    this.ctx?.audio.playGpwsAlert();
    this.ctx?.anchors.showToast(`${label(type)} failure`, 'critical');
    this.ctx?.emitDiag?.('FAILURE_TRIGGERED', { type });
    this.emitFailure(type);
    if (render) this.render();
  }

  private fix(type: FailureType): boolean {
    const effect = this.active.get(type);
    if (!effect) return false;
    this.active.delete(type);
    effect.restore();
    const verified = effect.verifyRestored ? effect.verifyRestored() : true;
    this.ctx?.emitDiag?.('RESTORE_VERIFIED', { type, verified });
    this.ctx?.emitEvent('failure:cleared', { type });
    return verified;
  }

  private clear(): void {
    for (const type of [...this.active.keys()].reverse()) this.fix(type);
    this.render();
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.syncProbabilityUi(settings);
  }

  public update(telemetry: FlightTelemetry): void {
    const aircraft = window.geofs?.aircraft?.instance;
    if (aircraft !== this.aircraft) {
      this.clear();
      this.aircraft = aircraft;
      this.render();
    }
    if (telemetry.paused || telemetry.crashed || !this.ctx) return;

    this.lastAltitude = telemetry.altitude;
    this.lastTimestamp = telemetry.timestamp;

    for (const effect of this.active.values()) {
      if (telemetry.timestamp >= effect.dueAt) {
        effect.apply(telemetry);
        effect.dueAt = telemetry.timestamp + effect.intervalMs;
      }
    }

    const settings = this.ctx.getSettings();
    const intervalMs = Math.max(10_000, (settings.failureProbabilityIntervalSec || 60) * 1000);
    if (!settings.failureProbabilitiesEnabled) {
      this.nextProbabilityMs = 0;
    } else if (this.nextProbabilityMs === 0) {
      this.nextProbabilityMs = telemetry.timestamp + intervalMs;
    } else if (telemetry.timestamp >= this.nextProbabilityMs) {
      this.nextProbabilityMs = telemetry.timestamp + intervalMs;
      for (const [type, chance] of this.chances) {
        if (chance > 0 && Math.random() < chance) this.fail(type);
      }
    }
    if (this.modal && this.modal.style.display !== 'none') {
      this.syncProbabilityUi(settings);
    }
  }

  public destroy(): void {
    this.clear();
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.styleEl?.remove();
    this.styleEl = null;
    this.pill = null;
    this.modal = null;
    this.bodyEl = null;
    this.probBtn = null;
    this.probInfoEl = null;
    this.aircraft = undefined;
    this.ctx = null;
    this.nextProbabilityMs = 0;
  }
}
