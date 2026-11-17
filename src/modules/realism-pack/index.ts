import { BOEING_777_IDS, installAircraftSounds } from './aircraft-sounds';
import type { ExtensionSettings, RealismOptions } from '../../types/settings';
import type { GeoFSAircraftInstance } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext, SimMajorVersion } from '../../types/module';

export function buildGForceShader(simMajor: SimMajorVersion): string {
  const input = simMajor === 4 ? 'in' : 'varying';
  const sample = simMajor === 4 ? 'texture' : 'texture2D';
  const output = simMajor === 4 ? 'out_FragColor' : 'gl_FragColor';
  return `
    uniform sampler2D colorTexture;
    ${input} vec2 v_textureCoordinates;
    uniform float strength;
    vec4 vignette(float strength, vec2 coordinate, vec2 texCoord) {
        vec2 uv = coordinate.xy / czm_viewport.zw;
        uv *=  1.0 - uv.yx;
        float vig = (uv.x*uv.y) * 15.0;
        vig = pow(vig, strength);
        return mix(vec4(vig), ${sample}(colorTexture, texCoord), vig);
    }
    vec4 grayOut(float strength, vec2 coordinate, vec2 texCoord) {
      vec4 initialCol = vignette(strength * 20.0, coordinate, texCoord);
      vec4 grayCol = vec4(vec3(initialCol.r), 1.0);
      return mix(initialCol, grayCol, strength * 3.0);
    }
    vec4 blur(float strength, vec2 coordinate, vec2 texCoord) {
      float radius = strength / 10.0;
      vec4 initialCol  = grayOut(strength, coordinate, texCoord);
      vec4 blurCol1    = grayOut(strength, coordinate + vec2(radius, 0.0), texCoord + vec2(radius, 0.0));
      vec4 blurCol2    = grayOut(strength, coordinate + vec2(-radius, 0.0), texCoord + vec2(-radius, 0.0));
      vec4 blurCol3    = grayOut(strength, coordinate + vec2(0.0, radius), texCoord + vec2(0.0, radius));
      vec4 blurCol4    = grayOut(strength, coordinate + vec2(0.0, -radius), texCoord + vec2(0.0, -radius));
      return mix(initialCol, (blurCol1 + blurCol2 + blurCol3 + blurCol4) / 4.0, strength * 2.0);
    }
    void main() { ${output} = blur(strength, gl_FragCoord.xy, v_textureCoordinates); }
  `;
}

const PROPWASH_IDS = new Set(['21', '2', '2808', '1', '8', '12', '13', '40', '1069', '2750', '4251', '1022', '1026', '14', '16']);
const SPIN_IDS = new Set(['2948', '2581', '2808', '3460', '2988']);
const ROTOR_IDS = new Set(['9', '52', '2840', '4090']);

export interface RealismOptionMeta {
  key: keyof RealismOptions;
  label: string;
  group: 'physics' | 'systems' | 'performance';
  v4Unavailable?: boolean;
}

export const REALISM_OPTION_META: readonly RealismOptionMeta[] = [
  { key: 'gBreath', label: 'G Breathing', group: 'physics' },
  { key: 'blackout', label: 'Blackout', group: 'physics' },
  { key: 'windAudio', label: 'Wind Audio', group: 'physics' },
  { key: 'cameraShake', label: 'Camera Shake', group: 'physics' },
  { key: 'propwash', label: 'Propwash', group: 'physics' },
  { key: 'vortexEffects', label: 'Vortex Effects', group: 'physics', v4Unavailable: true },
  { key: 'spinFix', label: 'Spin Fix', group: 'systems' },
  { key: 'bladeCollisions', label: 'Blade X', group: 'systems' },
  { key: 'engineInertia', label: 'Engine Inertia', group: 'systems' },
  { key: 'spoilerArming', label: 'Spoiler Arming', group: 'systems' },
  { key: 'carrierOps', label: 'Carrier Ops', group: 'systems', v4Unavailable: true },
  { key: 'soundExpansion', label: 'Aircraft Sounds', group: 'systems' },
  { key: 'performanceMode', label: 'Perf Mode', group: 'performance' }
] as const;

export const OPTION_LABELS: Record<keyof RealismOptions, string> = {
  gBreath: 'G Breathing',
  windAudio: 'Wind Audio',
  soundExpansion: 'Aircraft Sounds',
  blackout: 'Blackout',
  cameraShake: 'Camera Shake',
  propwash: 'Propwash',
  vortexEffects: 'Vortex Effects',
  spinFix: 'Spin Recovery',
  bladeCollisions: 'Blade Collisions',
  engineInertia: 'Engine Inertia',
  spoilerArming: 'Spoiler Arming',
  carrierOps: 'Carrier Ops',
  performanceMode: 'Performance Mode'
};

function isEnabled(options: Partial<RealismOptions> | undefined, key: keyof RealismOptions): boolean {
  return options?.[key] ?? (key !== 'performanceMode');
}

export class RealismPackModule implements IModule {
  public readonly id = 'realism-pack';
  public readonly name = 'Realism Pack';
  public readonly description = 'Background G-force shaders, camera shake, 777/A320/737 SFX, and flight physics.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private optionKey = '';
  private lastSimMajor: SimMajorVersion | null = null;
  private stage: unknown = null;
  private removeStage: (() => void) | undefined;
  private uniforms = { strength: 0 };
  private overGSeconds = 0;
  private blackoutActive = false;
  private nextBreath = 0;
  private nextWind = 0;
  private nextPhysics = 0;
  private nextRotor = 0;
  private spinSample?: { time: number; pitch: number };
  private nextSpin = 0;
  private cameraOffset?: { undo: () => void; timer: ReturnType<typeof setTimeout> };
  private aircraft?: GeoFSAircraftInstance;
  private restores: Array<() => void> = [];
  private captured = new WeakMap<object, Set<PropertyKey>>();
  private spoilerArmed = false;
  private breath?: HTMLAudioElement;
  private wind?: HTMLAudioElement;
  private restoreRunwayVisibility?: () => void;
  private aircraftSounds?: ReturnType<typeof installAircraftSounds>;
  private checkedAircraftSounds = false;

  private onKeyDown = (event: KeyboardEvent) => {
    if (!isEnabled(this.ctx?.getSettings().realismOptions, 'spoilerArming') || event.key !== 'Shift' || event.repeat || event.defaultPrevented ||
        (typeof HTMLElement !== 'undefined' && event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable]'))) return;
    const aircraft = window.geofs?.aircraft?.instance;
    if (aircraft && !aircraft.groundContact && window.controls?.airbrakes?.position === 0) {
      this.spoilerArmed = true;
      this.ctx?.anchors.showToast('Spoilers Armed');
    }
  };

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.onSettingsChange(context.getSettings());
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.onKeyDown);
    }
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    const options = settings.realismOptions;
    const optionKey = JSON.stringify(options ?? {});
    if (optionKey === this.optionKey) return;
    this.optionKey = optionKey;
    this.restoreAircraft();
    if (!isEnabled(options, 'gBreath')) this.breath?.pause();
    if (!isEnabled(options, 'windAudio')) this.wind?.pause();
    if (!isEnabled(options, 'soundExpansion')) this.resetAircraftSounds();
    if (!isEnabled(options, 'blackout')) {
      this.uniforms.strength = 0;
      this.overGSeconds = 0;
      this.blackoutActive = false;
    }
    this.emitRealismDiag(options);
  }

  private emitRealismDiag(options: Partial<RealismOptions> | undefined): void {
    const major = this.lastSimMajor;
    const v4Unsupported = major === 4;
    this.ctx?.emitDiag?.('REALISM_STATE', {
      simMajor: major,
      blackout: isEnabled(options, 'blackout'),
      soundExpansion: isEnabled(options, 'soundExpansion'),
      vortexStatus: v4Unsupported ? 'V4_UNSUPPORTED' : isEnabled(options, 'vortexEffects') ? 'ACTIVE' : 'OFF',
      carrierStatus: v4Unsupported ? 'V4_UNSUPPORTED' : isEnabled(options, 'carrierOps') ? 'ACTIVE' : 'OFF'
    });
    if (v4Unsupported) {
      this.ctx?.emitDiag?.('REALISM_FEATURE_ERROR', {
        level: 'error',
        simMajor: 4,
        features: ['vortexEffects', 'carrierOps'],
        message: 'Vortex Effects and Carrier Ops require GeoFS V3.9'
      });
    }
  }

  private ensureStage(major: SimMajorVersion): void {
    if (this.stage) return;
    const Stage = window.Cesium?.PostProcessStage;
    const stages = window.geofs?.api?.viewer?.scene?.postProcessStages;
    if (!Stage || !stages?.add) return;
    try {
      this.stage = stages.add(new Stage({
        fragmentShader: buildGForceShader(major),
        uniforms: { strength: () => this.uniforms.strength }
      }));
      const stage = this.stage;
      this.removeStage = () => stages.remove?.(stage);
    } catch (err) {
      console.warn('[GeoFS Extension] Could not initialize the archived blackout effect:', err);
    }
  }

  private setValue<T extends object, K extends keyof T>(target: T, key: K, value: T[K]): void {
    let fields = this.captured.get(target);
    if (!fields) this.captured.set(target, fields = new Set());
    if (!fields.has(key)) {
      fields.add(key);
      const original = target[key];
      const own = Object.hasOwn(target, key);
      this.restores.push(() => { if (own) target[key] = original; else delete target[key]; });
    }
    target[key] = value;
  }

  public update(telemetry: FlightTelemetry): void {
    const sim = window.geofs;
    const aircraft = sim?.aircraft?.instance;
    const values = sim?.animation?.values;
    if (this.lastSimMajor !== telemetry.simMajor) {
      this.lastSimMajor = telemetry.simMajor;
      this.emitRealismDiag(this.ctx?.getSettings().realismOptions);
    }
    if (this.aircraft !== aircraft) {
      this.resetAircraftSounds();
      this.restoreAircraft();
      this.aircraft = aircraft;
    }
    if (!aircraft || !values || telemetry.paused || telemetry.crashed) return;
    const now = telemetry.timestamp;
    const g = telemetry.gForce;
    const cockpit = values.view === 'cockpit';
    const id = telemetry.aircraft?.id ?? '';
    const options = this.ctx?.getSettings().realismOptions;

    if (now >= this.nextBreath) {
      this.nextBreath = now + 3500;
      if (g >= 3 && isEnabled(options, 'gBreath')) void this.breath?.play().catch(() => {});
      if (g > 6 && isEnabled(options, 'gBreath')) this.ctx?.anchors.showToast('High G-Load — Pilot Strain Detected', 'warn');
    }
    if (now >= this.nextWind) {
      this.nextWind = now + 1000;
      const base = this.ctx?.getAudioUrl?.('');
      if (base && !this.breath && typeof Audio !== 'undefined') {
        this.breath = new Audio(base + 'cutgbreath.mp3');
        this.wind = new Audio(base + 'wind.mp3');
        this.breath.preload = this.wind.preload = 'none';
      }
      if (!this.checkedAircraftSounds && aircraft.definition?.sounds?.length && window.audio?.soundplayer &&
          isEnabled(options, 'soundExpansion')) {
        this.aircraftSounds = installAircraftSounds(aircraft);
        this.checkedAircraftSounds = true;
      }
      const runways = sim?.runways;
      if (runways?.nearRunways && runways.setRunwayModelVisibility && runways.modelVisibility !== undefined) {
        const visible = Object.values(runways.nearRunways)[0]?.icao === 'VNLK';
        if (Boolean(runways.modelVisibility) !== visible) {
          const original = runways.modelVisibility;
          this.restoreRunwayVisibility ??= () => runways.setRunwayModelVisibility?.(original);
          runways.setRunwayModelVisibility(Number(visible));
        }
      }
      if (cockpit && Number(values.accZ) >= 50 && isEnabled(options, 'windAudio')) void this.wind?.play().catch(() => {});
      this.ensureStage(telemetry.simMajor);
    }
    this.aircraftSounds?.update(telemetry, values);
    const safeDt = Number.isFinite(telemetry.dt) && telemetry.dt > 0 ? Math.min(telemetry.dt, 0.25) : 0.016;
    const steps = safeDt / 0.01;
    const safeG = Number.isFinite(g) ? g : 1;
    if (cockpit && safeG > 9 && isEnabled(options, 'blackout')) {
      this.overGSeconds += 0.05 * steps;
      if (this.overGSeconds > 0.1) this.blackoutActive = true;
      if (this.blackoutActive) this.uniforms.strength = Math.min(1, this.uniforms.strength + 0.001 * (safeG - 5) / 10 * steps);
    } else {
      this.overGSeconds = 0;
      this.uniforms.strength = Math.max(0, this.uniforms.strength - 0.0005 * steps);
      if (!this.uniforms.strength) this.blackoutActive = false;
    }

    const camera = sim?.camera;
    const safeAoa = Number.isFinite(telemetry.aoa) ? telemetry.aoa : 0;
    const safeKias = Number.isFinite(telemetry.kias) ? telemetry.kias : 0;
    const aoaTerm =
      id === '4' || telemetry.groundContact || safeKias < 30 || safeAoa >= 85
        ? 0
        : Math.max(0, safeAoa - 10) * 0.0002;
    const speedTerm = Math.max(0, safeKias - 450) * 0.00001;
    const gTerm = Math.abs(safeG - 1) > 2 ? Math.abs(safeG - 1) * 0.0001 : 0;
    const rawIntensity = aoaTerm + speedTerm + gTerm;
    const intensity = Number.isFinite(rawIntensity) ? Math.min(0.05, rawIntensity) : 0;
    if (intensity > 0 && isEnabled(options, 'cameraShake') && camera?.translate && !this.cameraOffset) {
      const offset = intensity * Math.random();
      if (Number.isFinite(offset) && offset > 0) {
        camera.translate(offset, offset, offset);
        const undo = () => camera.translate?.(-offset, -offset, -offset);
        const timer = setTimeout(() => {
          this.cameraOffset = undefined;
          undo();
        }, 5);
        this.cameraOffset = { undo, timer };
      }
    }

    if (now >= this.nextPhysics) {
      this.nextPhysics = now + 100;
      if (PROPWASH_IDS.has(id) && isEnabled(options, 'propwash')) {
        for (const foil of aircraft.airfoils ?? []) {
          this.setValue(foil, 'propwash', foil.forceDirection === 2 ? 0.005 : 0.01);
        }
      }
      const definition = aircraft.definition;
      if (definition?.maxRPM === 10_000 && typeof values.rpm === 'number' && Number.isFinite(values.rpm) && isEnabled(options, 'engineInertia')) {
        this.setValue(definition, 'engineInertia', values.rpm < 6000 ? 0.2 : values.rpm < 7000 ? 0.5 : 1);
      }
      if (this.spoilerArmed && telemetry.groundContact) {
        if (window.controls?.airbrakes) window.controls.airbrakes.target = 1;
        this.spoilerArmed = false;
      }
    }
    if (now >= this.nextRotor) {
      this.nextRotor = now + 1000;
      const rendering = sim?.api?.renderingSettings;
      if (rendering && isEnabled(options, 'performanceMode')) {
        this.setValue(rendering, 'degradedCollisions', true);
        this.setValue(rendering, 'lowResRunways', true);
      }
      if (isEnabled(options, 'bladeCollisions') && ROTOR_IDS.has(id) && Math.abs(Number(values.aroll) || telemetry.roll) > 70 &&
          telemetry.aglFeet <= 5 && sim?.preferences?.crashDetection) aircraft.crash?.();
    }
    if (SPIN_IDS.has(id) && isEnabled(options, 'spinFix')) {
      const pitch = Number(values.atilt) || telemetry.pitch;
      if (Number.isFinite(pitch)) {
        if (this.spinSample && now >= this.spinSample.time + 500) {
          if (Math.abs(pitch - this.spinSample.pitch) > 50) {
            sim?.flyToCamera?.();
            this.ctx?.anchors.showToast('Spin Recovery Active');
          }
          this.spinSample = undefined;
        }
        if (now >= this.nextSpin) {
          this.nextSpin = now + 1000;
          this.spinSample = { time: now, pitch };
        }
      }
    }

    if (BOEING_777_IDS.has(id) && isEnabled(options, 'engineInertia')) {
      this.update777Effects(aircraft, values, telemetry);
    }
  }

  private update777Effects(
    aircraft: GeoFSAircraftInstance,
    values: NonNullable<NonNullable<typeof window.geofs>['animation']>['values'] & object,
    telemetry: FlightTelemetry
  ): void {
    const hagl = telemetry.aglFeet;
    const kias = telemetry.kias;
    const rigid = aircraft.rigidBody;
    const dt = Number.isFinite(telemetry.dt) && telemetry.dt > 0 ? Math.min(telemetry.dt, 0.25) : 0.02;
    const dtScale = Math.max(0.25, Math.min(2.5, dt / 0.02));
    if (!telemetry.groundContact && Number.isFinite(hagl) && hagl > 0 && hagl <= 100 && Number.isFinite(kias) && kias >= 50) {
      const impulseZ = Math.max(0, Math.min(50_000, (100 - hagl) * kias * 0.25 * dtScale));
      if (Number.isFinite(impulseZ) && impulseZ > 0) {
        rigid?.applyCentralImpulse?.([0, 0, impulseZ]);
      }
    }
    if (!telemetry.groundContact && Number.isFinite(kias) && kias >= 60 && Number.isFinite(telemetry.aoa) && telemetry.aoa > 10 && telemetry.aoa < 85) {
      const rawHeading = Number(values.heading360);
      const heading = Number.isFinite(rawHeading) ? rawHeading : telemetry.heading;
      if (Number.isFinite(heading)) {
        const headingRad = heading * (Math.PI / 180);
        const force = Math.min(25_000, Math.random() * (telemetry.aoa - 10) * 800 * dtScale);
        if (Number.isFinite(force) && force > 0) {
          rigid?.applyTorqueImpulse?.([force * Math.sin(headingRad), force * Math.cos(headingRad), 0]);
        }
      }
    }

    const safeKias = Number.isFinite(kias) ? kias : 0;
    const rawYaw = Number(values.yaw);
    const yaw = Number.isFinite(rawYaw) ? rawYaw : 0;
    this.setValue(values, 'tiller', safeKias >= 50 ? yaw / (safeKias / 5) : yaw);
    const airbrakesPos = Number.isFinite(Number(values.airbrakesPosition)) ? Number(values.airbrakesPosition) : 0;
    this.setValue(
      values,
      'spoilersShake',
      airbrakesPos === 1 ? 1 - (Math.random() / 20) * (safeKias / 200) : airbrakesPos
    );
    this.setValue(
      values,
      'flapsShake',
      values.flapsPosition === 6 ? (Math.random() / 20) * (safeKias / 100) : 0
    );

    const rawAccZ = Number(values.accZ);
    const accZ = Number.isFinite(rawAccZ) ? rawAccZ : 9.81;
    const rawLeftLift = Number(aircraft.parts?.wingleft?.lift);
    const rawRightLift = Number(aircraft.parts?.wingright?.lift);
    const wingLeftLift = Number.isFinite(rawLeftLift) ? rawLeftLift : 0;
    const wingRightLift = Number.isFinite(rawRightLift) ? rawRightLift : 0;
    this.setValue(values, 'liftLeftWing', (-wingLeftLift / 200000) + accZ / 20);
    this.setValue(values, 'liftRightWing', (-wingRightLift / 200000) + accZ / 20);
    if (Number.isFinite(hagl) && hagl <= 18) {
      const rawTilt = (16.152139372973117 * Math.max(0, hagl)) / 15;
      this.setValue(values, 'gearTilt', Math.max(18.5, Math.min(20, rawTilt)));
    }

    const setupParts = aircraft.setup?.parts;
    if (setupParts) {
      const tillerAnim = setupParts[106]?.animations?.[1];
      if (tillerAnim) this.setValue(tillerAnim, 'value', 'tiller');
      for (let i = 60; i <= 73; i++) {
        const anim = setupParts[i]?.animations?.[0];
        if (anim) this.setValue(anim, 'value', 'spoilersShake');
      }
      const leftWingAnims: Array<[number, number]> = [[3, 1], [4, 1], [5, 0], [6, 0], [7, 1]];
      for (const [partIdx, animIdx] of leftWingAnims) {
        const anim = setupParts[partIdx]?.animations?.[animIdx];
        if (anim) this.setValue(anim, 'value', 'liftLeftWing');
      }
      const rightWingAnims: Array<[number, number]> = [[8, 1], [9, 0], [10, 0]];
      for (const [partIdx, animIdx] of rightWingAnims) {
        const anim = setupParts[partIdx]?.animations?.[animIdx];
        if (anim) this.setValue(anim, 'value', 'liftRightWing');
      }
    }

    const defParts = aircraft.definition?.parts;
    if (defParts) {
      for (const idx of [87, 98]) {
        const anim = defParts[idx]?.animations?.[0];
        if (anim) {
          this.setValue(anim, 'value', 'gearTilt');
          this.setValue(anim, 'offset', -27);
          if ('lt' in anim) this.setValue(anim, 'lt', undefined);
        }
      }
    }
  }

  private resetAircraftSounds(): void {
    this.aircraftSounds?.restore();
    this.aircraftSounds = undefined;
    this.checkedAircraftSounds = false;
  }

  private restoreAircraft(): void {
    for (const restore of this.restores.reverse()) restore();
    this.restores = [];
    this.captured = new WeakMap();
    this.spoilerArmed = false;
    this.spinSample = undefined;
  }

  public destroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.onKeyDown);
    }
    this.optionKey = '';
    this.lastSimMajor = null;
    this.resetAircraftSounds();
    this.restoreRunwayVisibility?.();
    this.restoreRunwayVisibility = undefined;
    this.removeStage?.();
    this.stage = null;
    this.removeStage = undefined;
    this.restoreAircraft();
    this.aircraft = undefined;
    if (this.cameraOffset) {
      clearTimeout(this.cameraOffset.timer);
      this.cameraOffset.undo();
      this.cameraOffset = undefined;
    }
    this.breath?.pause();
    this.wind?.pause();
    this.breath = this.wind = undefined;
    this.uniforms.strength = 0;
    this.blackoutActive = false;
    this.overGSeconds = 0;
    this.ctx = null;
  }
}
