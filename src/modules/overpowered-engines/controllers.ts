import type {
  GeoFSAircraftDefinition,
  GeoFSAircraftInstance,
  GeoFSControls,
  GeoFSEnginePart
} from '../../types/geofs.d';

const THRUST_FIELDS = ['thrust', 'afterBurnerThrust', 'reverseThrust'] as const;
type ThrustValues = Pick<GeoFSEnginePart, (typeof THRUST_FIELDS)[number]>;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatNumberCompact(val: number): string {
  if (val >= 1_000_000_000_000) return `${(val / 1_000_000_000_000).toFixed(1)}T`;
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  return Math.round(val).toLocaleString();
}

export interface PilotControlsSample {
  roll: number;
  pitch: number;
  yaw: number;
  controlling: boolean;
}

export function readPilotControls(controls: GeoFSControls | undefined, deadzone = 0.03): PilotControlsSample {
  const rawRoll = Number(controls?.rawRoll ?? controls?.roll ?? 0);
  const rawPitch = Number(controls?.rawPitch ?? controls?.pitch ?? 0);
  const rawYaw = Number(controls?.rawYaw ?? controls?.yaw ?? 0);
  const roll = Number.isFinite(rawRoll) ? rawRoll : 0;
  const pitch = Number.isFinite(rawPitch) ? rawPitch : 0;
  const yaw = Number.isFinite(rawYaw) ? rawYaw : 0;
  const controlling = Math.max(Math.abs(roll), Math.abs(pitch), Math.abs(yaw)) > deadzone;
  return { roll, pitch, yaw, controlling };
}

export class EffectiveSasController {
  public targetPitch: number | null = null;
  public targetRoll: number | null = null;
  private wasControlling = false;
  private pitchIntegral = 0;
  private rollIntegral = 0;
  private prevPitchDeg: number | null = null;
  private prevRollDeg: number | null = null;
  private lastCmdPitch = 0;
  private lastCmdRoll = 0;

  public reset(): void {
    this.targetPitch = null;
    this.targetRoll = null;
    this.wasControlling = false;
    this.pitchIntegral = 0;
    this.rollIntegral = 0;
    this.prevPitchDeg = null;
    this.prevRollDeg = null;
    this.lastCmdPitch = 0;
    this.lastCmdRoll = 0;
  }

  public step(params: {
    rigidBody?: GeoFSAircraftInstance['rigidBody'];
    controls?: GeoFSControls;
    pitchDeg: number;
    rollDeg: number;
    kias: number;
    multiplier: number;
    sasStrength: number;
    groundContact: boolean;
    autopilotOn?: boolean;
  }): { mode: 'maneuver' | 'hold'; controlling: boolean; nextAngularVelocity: [number, number, number] | null } {
    const {
      rigidBody,
      controls,
      pitchDeg,
      rollDeg,
      kias,
      multiplier,
      sasStrength,
      groundContact,
      autopilotOn
    } = params;
    if (groundContact || autopilotOn) {
      this.reset();
      return { mode: 'hold', controlling: false, nextAngularVelocity: null };
    }

    const baseSample = readPilotControls(controls);
    const rawPitchMissing = controls?.rawPitch === undefined && controls?.pitch !== undefined;
    const rawRollMissing = controls?.rawRoll === undefined && controls?.roll !== undefined;
    const pitchActive = rawPitchMissing
      ? Math.abs((controls?.pitch ?? 0) - this.lastCmdPitch) > 0.03
      : Math.abs(baseSample.pitch) > 0.03;
    const rollActive = rawRollMissing
      ? Math.abs((controls?.roll ?? 0) - this.lastCmdRoll) > 0.03
      : Math.abs(baseSample.roll) > 0.03;
    const yawActive = Math.abs(baseSample.yaw) > 0.03;
    const controlling = pitchActive || rollActive || yawActive;

    const safePitch = Number.isFinite(pitchDeg) ? pitchDeg : 0;
    const safeRoll = Number.isFinite(rollDeg) ? rollDeg : 0;
    const safeKias = Number.isFinite(kias) ? kias : 0;
    const safeMultiplier = Number.isFinite(multiplier) && multiplier >= 1 ? multiplier : 1;
    const strength = clamp(Number.isFinite(sasStrength) && sasStrength > 0 ? sasStrength : 1.0, 0.25, 2.5);
    const av = rigidBody?.getAngularVelocity?.();
    const hasValidAv =
      Array.isArray(av) &&
      av.length >= 3 &&
      Number.isFinite(av[0]) &&
      Number.isFinite(av[1]) &&
      Number.isFinite(av[2]);

    if (controlling) {
      this.targetPitch = null;
      this.targetRoll = null;
      this.pitchIntegral = 0;
      this.rollIntegral = 0;
      this.prevPitchDeg = null;
      this.prevRollDeg = null;
      this.lastCmdPitch = 0;
      this.lastCmdRoll = 0;
      this.wasControlling = true;
      if (!hasValidAv || !rigidBody?.setAngularVelocity) {
        return { mode: 'maneuver', controlling: true, nextAngularVelocity: null };
      }
      const multScale = Math.min(0.45, Math.log10(Math.max(1, safeMultiplier)) * 0.08);
      const speedScale = safeKias > 300 ? Math.max(0.4, 300 / safeKias) : 1;
      const damp = clamp(1 - (0.12 + multScale) * strength * 0.5, 0.35, 0.92);
      const maxRate = clamp((3.2 / Math.max(1, Math.log10(Math.max(1, safeMultiplier)))) / strength * speedScale, 0.35, 4.0);
      const next: [number, number, number] = [
        clamp(av[0] * damp, -maxRate, maxRate),
        clamp(av[1] * damp, -maxRate, maxRate),
        clamp(av[2] * damp, -maxRate, maxRate)
      ];
      rigidBody.setAngularVelocity(next);
      return { mode: 'maneuver', controlling: true, nextAngularVelocity: next };
    }

    if (this.wasControlling || this.targetPitch === null || this.targetRoll === null) {
      this.targetPitch = safePitch;
      this.targetRoll = clamp(safeRoll, -65, 65);
      this.pitchIntegral = 0;
      this.rollIntegral = 0;
      this.prevPitchDeg = safePitch;
      this.prevRollDeg = safeRoll;
      this.wasControlling = false;
    }

    const targetPitch = Number.isFinite(this.targetPitch) ? this.targetPitch : safePitch;
    const targetRoll = Number.isFinite(this.targetRoll) ? this.targetRoll : clamp(safeRoll, -65, 65);
    const pitchErr = clamp(targetPitch - safePitch, -30, 30);
    const rollErr = clamp(targetRoll - safeRoll, -30, 30);

    const pitchRate = this.prevPitchDeg !== null ? clamp((safePitch - this.prevPitchDeg) / 0.02, -120, 120) : 0;
    const rollRate = this.prevRollDeg !== null ? clamp((safeRoll - this.prevRollDeg) / 0.02, -180, 180) : 0;
    this.prevPitchDeg = safePitch;
    this.prevRollDeg = safeRoll;

    const maxInt = 0.5 / Math.max(0.5, strength);
    this.pitchIntegral = clamp(this.pitchIntegral + pitchErr * 0.02, -maxInt, maxInt);
    this.rollIntegral = clamp(this.rollIntegral + rollErr * 0.02, -maxInt, maxInt);

    if (controls) {
      const aeroScale = safeKias > 220 ? clamp(220 / safeKias, 0.35, 1) : 1;
      const pitchCmd = clamp((pitchErr * 0.045 + this.pitchIntegral * 0.85 - pitchRate * 0.015) * strength * aeroScale, -0.8, 0.8);
      const rollCmd = clamp((rollErr * 0.04 + this.rollIntegral * 0.75 - rollRate * 0.014) * strength * aeroScale, -0.8, 0.8);
      controls.pitch = pitchCmd;
      controls.roll = rollCmd;
      this.lastCmdPitch = pitchCmd;
      this.lastCmdRoll = rollCmd;
    }

    if (!hasValidAv || !rigidBody?.setAngularVelocity) {
      return { mode: 'hold', controlling: false, nextAngularVelocity: null };
    }

    const settled = Math.abs(pitchErr) < 0.15 && Math.abs(rollErr) < 0.15 && Math.abs(pitchRate) < 0.5 && Math.abs(rollRate) < 0.5;
    if (settled) {
      const zeroed: [number, number, number] = [0, 0, 0];
      rigidBody.setAngularVelocity(zeroed);
      return { mode: 'hold', controlling: false, nextAngularVelocity: zeroed };
    }

    const damp = clamp(0.88 - 0.06 * strength, 0.65, 0.92);
    const next: [number, number, number] = [
      clamp(av[0] * damp, -0.8, 0.8),
      clamp(av[1] * damp, -0.8, 0.8),
      clamp(av[2] * damp, -0.5, 0.5)
    ];
    if (next.every(Number.isFinite)) {
      rigidBody.setAngularVelocity(next);
    }

    return { mode: 'hold', controlling: false, nextAngularVelocity: next };
  }
}

// Both archived Overpowered Engines scripts apply their multiplier to the live engine parts.
export class EngineThrust {
  private originals = new Map<GeoFSEnginePart, ThrustValues>();

  public apply(parts: Record<string, GeoFSEnginePart> | undefined, multiplier: number): void {
    if (!Number.isFinite(multiplier) || multiplier <= 0) return;
    const engines = new Set(Object.values(parts ?? {}).filter((part) => Number.isFinite(part?.thrust)));
    for (const [part, original] of this.originals) {
      if (!engines.has(part)) {
        Object.assign(part, original);
        this.originals.delete(part);
      }
    }
    for (const part of engines) {
      let original = this.originals.get(part);
      if (!original) {
        original = {};
        for (const field of THRUST_FIELDS) {
          if (Number.isFinite(part[field])) original[field] = part[field];
        }
        this.originals.set(part, original);
      }
      for (const field of THRUST_FIELDS) {
        const value = original[field];
        if (value !== undefined) {
          const scaled = value * multiplier;
          if (Number.isFinite(scaled)) part[field] = scaled;
        }
      }
    }
  }

  public restore(): void {
    for (const [part, original] of this.originals) Object.assign(part, original);
    this.originals.clear();
  }
}

export class EngineCeiling {
  private original?: { definition: GeoFSAircraftDefinition; thrust: number | undefined; rpm: number | undefined };

  public apply(definition: GeoFSAircraftDefinition, feet: number): void {
    if (!Number.isFinite(feet) || feet <= 0) return;
    if (this.original?.definition !== definition) {
      this.restore();
      this.original = { definition, thrust: definition.zeroThrustAltitude, rpm: definition.zeroRPMAltitude };
    }
    definition.zeroThrustAltitude = feet;
    definition.zeroRPMAltitude = feet;
  }

  public restore(): void {
    if (!this.original) return;
    const { definition, thrust, rpm } = this.original;
    if (thrust === undefined) delete definition.zeroThrustAltitude;
    else definition.zeroThrustAltitude = thrust;
    if (rpm === undefined) delete definition.zeroRPMAltitude;
    else definition.zeroRPMAltitude = rpm;
    this.original = undefined;
  }
}
