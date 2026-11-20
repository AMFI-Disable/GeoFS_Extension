import { AIRBUS_IDS, BOEING_737_IDS, BOEING_777_IDS, installAircraftSounds } from './aircraft-sounds';
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
    vec4 vignette(float s, vec2 coordinate, vec2 texCoord) {
        vec2 uv = coordinate.xy / czm_viewport.zw;
        uv *= 1.0 - uv.yx;
        float vig = clamp((uv.x * uv.y) * 15.0, 0.0, 1.0);
        vig = s > 0.0001 ? pow(max(vig, 0.0001), s) : 1.0;
        return mix(vec4(0.0, 0.0, 0.0, 1.0), ${sample}(colorTexture, texCoord), vig);
    }
    vec4 grayOut(float s, vec2 coordinate, vec2 texCoord) {
      vec4 initialCol = vignette(s * 20.0, coordinate, texCoord);
      vec4 grayCol = vec4(vec3(initialCol.r), 1.0);
      return mix(initialCol, grayCol, clamp(s * 3.0, 0.0, 1.0));
    }
    vec4 blur(float s, vec2 coordinate, vec2 texCoord) {
      float uvRadius = s * 0.005;
      vec2 pxRadius = vec2(uvRadius) * czm_viewport.zw;
      vec4 initialCol  = grayOut(s, coordinate, texCoord);
      vec4 blurCol1    = grayOut(s, coordinate + vec2(pxRadius.x, 0.0), clamp(texCoord + vec2(uvRadius, 0.0), 0.0, 1.0));
      vec4 blurCol2    = grayOut(s, coordinate + vec2(-pxRadius.x, 0.0), clamp(texCoord + vec2(-uvRadius, 0.0), 0.0, 1.0));
      vec4 blurCol3    = grayOut(s, coordinate + vec2(0.0, pxRadius.y), clamp(texCoord + vec2(0.0, uvRadius), 0.0, 1.0));
      vec4 blurCol4    = grayOut(s, coordinate + vec2(0.0, -pxRadius.y), clamp(texCoord + vec2(0.0, -uvRadius), 0.0, 1.0));
      return mix(initialCol, (blurCol1 + blurCol2 + blurCol3 + blurCol4) / 4.0, clamp(s * 2.0, 0.0, 1.0));
    }
    void main() {
      if (strength <= 0.0001) {
        ${output} = ${sample}(colorTexture, v_textureCoordinates);
        return;
      }
      ${output} = blur(strength, gl_FragCoord.xy, v_textureCoordinates);
    }
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

function isCockpitView(): boolean {
  const view = window.geofs?.animation?.values?.view;
  const mode = window.geofs?.camera?.currentModeName;
  return view === 'cockpit' || mode === 'cockpit';
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
  private stage: { enabled?: boolean } | null = null;
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
  private nextSpinToast = 0;
  private next777Impulse = 0;
  private cameraOffset?: { undo: () => void; timer: ReturnType<typeof setTimeout> };
  private aircraft?: GeoFSAircraftInstance;
  private restores: Array<() => void> = [];
  private captured = new WeakMap<object, Set<PropertyKey>>();
  private spoilerArmed = false;
  private breath?: HTMLAudioElement;
  private wind?: HTMLAudioElement;
  private aircraftSounds?: ReturnType<typeof installAircraftSounds>;
  private checkedAircraftSounds = false;
  private unmountTab: (() => void) | null = null;
  private syncHudTab: (() => void) | null = null;

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
    this.lastSimMajor = context.simMajor ?? null;
    this.onSettingsChange(context.getSettings());
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.onKeyDown);
      if (typeof context.anchors?.registerHudTab === 'function') {
        const hudTab = document.createElement('div');
        hudTab.style.cssText = 'display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;';
        const keys: Array<[keyof RealismOptions, string]> = [
          ['gBreath', 'G-Breath'],
          ['blackout', 'Blackout'],
          ['windAudio', 'Wind SFX'],
          ['cameraShake', 'Shake'],
          ['soundExpansion', '737/777 SFX'],
          ['spoilerArming', 'Spoilers']
        ];
        const statusLine = document.createElement('div');
        statusLine.style.cssText = 'font-size:9px;color:#a1a1aa;display:flex;justify-content:space-between;';
        statusLine.innerHTML = `<span>REALISM PACK</span><span>${this.lastSimMajor === 4 ? 'V4 (Vortex/Carrier N/A)' : 'V3 FULL'}</span>`;
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;';
        const btns = new Map<keyof RealismOptions, HTMLButtonElement>();
        for (const [key, label] of keys) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = label;
          btn.style.cssText = 'background:rgba(255,255,255,0.06);color:#e5e7eb;border:1px solid rgba(255,255,255,0.16);border-radius:4px;padding:4px 5px;font-size:9.5px;font-weight:700;cursor:pointer;';
          btn.addEventListener('click', () => {
            const current = context.getSettings().realismOptions ?? {};
            context.updateSettings({ realismOptions: { ...current, [key]: !isEnabled(current, key) } });
          });
          btns.set(key, btn);
          grid.appendChild(btn);
        }
        const sync = () => {
          const opts = context.getSettings().realismOptions;
          for (const [key, btn] of btns) {
            const active = isEnabled(opts, key);
            btn.style.borderColor = active ? '#10b981' : 'rgba(255,255,255,0.16)';
            btn.style.color = active ? '#10b981' : '#a1a1aa';
          }
        };
        this.syncHudTab = sync;
        sync();
        hudTab.append(statusLine, grid);
        this.unmountTab = context.anchors.registerHudTab('realism', 'REALISM', hudTab, false, { defaultClosed: true });
      }
    }
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    const options = settings.realismOptions;
    this.syncHudTab?.();
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
      if (this.stage) this.stage.enabled = false;
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
    const atmoStage = window.geofs?.fx?.atmosphere?.atmospherePostProcessStage;
    if (!Stage || !stages?.add) return;
    if (atmoStage && !atmoStage._ready) return;
    try {
      const added = stages.add(new Stage({
        fragmentShader: buildGForceShader(major),
        uniforms: { strength: () => this.uniforms.strength }
      })) as { enabled?: boolean } | undefined;
      if (added) {
        added.enabled = false;
        this.stage = added;
        this.removeStage = () => stages.remove?.(added);
      }
    } catch (err) {
      console.warn('[GeoFS Extension] Could not initialize the blackout effect:', err);
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
    if (!aircraft || !values || telemetry.paused || telemetry.crashed) {
      if (this.stage) this.stage.enabled = false;
      return;
    }
    const now = telemetry.timestamp;
    const g = telemetry.gForce;
    const cockpit = isCockpitView();
    const id = telemetry.aircraft?.id ?? '';
    const options = this.ctx?.getSettings().realismOptions;

    if (!this.breath) {
      const base = this.ctx?.getAudioUrl?.('');
      if (base && typeof Audio !== 'undefined') {
        this.breath = new Audio(base + 'cutgbreath.mp3');
        this.wind = new Audio(base + 'wind.mp3');
        this.breath.preload = this.wind.preload = 'none';
      }
    }

    if (!cockpit || !isEnabled(options, 'gBreath')) {
      this.breath?.pause();
    } else if (now >= this.nextBreath) {
      this.nextBreath = now + 3500;
      if (g >= 3) void this.breath?.play().catch(() => {});
      if (g > 6) this.ctx?.anchors.showToast('High G-Load — Pilot Strain Detected', 'warn');
    }

    if (now >= this.nextWind) {
      this.nextWind = now + 1000;
      if (!this.checkedAircraftSounds && isEnabled(options, 'soundExpansion')) {
        const supportsSoundPack = BOEING_737_IDS.has(id) || BOEING_777_IDS.has(id) || AIRBUS_IDS.has(id);
        if (!supportsSoundPack) {
          this.checkedAircraftSounds = true;
        } else if (
          aircraft.definition?.sounds?.length &&
          window.audio?.soundplayer?.stopSound &&
          window.audio?.sounds &&
          Object.keys(window.audio.sounds).length > 0
        ) {
          this.aircraftSounds = installAircraftSounds(aircraft);
          if (this.aircraftSounds) {
            this.checkedAircraftSounds = true;
          }
        }
      }
      if (cockpit && Number(values.accZ) >= 50 && isEnabled(options, 'windAudio')) void this.wind?.play().catch(() => {});
    }
    this.aircraftSounds?.update(telemetry, values);
    const safeDt = Number.isFinite(telemetry.dt) && telemetry.dt > 0 ? Math.min(telemetry.dt, 0.25) : 0.016;
    const steps = safeDt / 0.01;
    const safeG = Number.isFinite(g) ? g : 1;
    const blackoutEnabled = isEnabled(options, 'blackout');
    if (cockpit && blackoutEnabled) {
      if (safeG > 9) {
        this.overGSeconds += 0.05 * steps;
        if (this.overGSeconds > 0.1) this.blackoutActive = true;
        if (this.blackoutActive) this.uniforms.strength = Math.min(1, this.uniforms.strength + 0.001 * (safeG - 5) / 10 * steps);
      } else {
        this.overGSeconds = 0;
        this.uniforms.strength = Math.max(0, this.uniforms.strength - 0.0005 * steps);
        if (!this.uniforms.strength) this.blackoutActive = false;
      }
    } else {
      this.overGSeconds = 0;
      this.uniforms.strength = 0;
      this.blackoutActive = false;
    }

    const stageActive = cockpit && blackoutEnabled && this.uniforms.strength > 0;
    if (stageActive) {
      this.ensureStage(telemetry.simMajor);
    }
    if (this.stage) {
      this.stage.enabled = stageActive;
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
    if (SPIN_IDS.has(id) && isEnabled(options, 'spinFix') && !telemetry.groundContact && telemetry.aglFeet > 50) {
      const pitch = Number(values.atilt) || telemetry.pitch;
      if (Number.isFinite(pitch)) {
        if (this.spinSample && now >= this.spinSample.time + 500) {
          const delta = Math.abs((((pitch - this.spinSample.pitch) + 540) % 360) - 180);
          if (delta > 50) {
            const rigid = aircraft.rigidBody;
            const av = rigid?.getAngularVelocity?.();
            if (Array.isArray(av) && av.length >= 3 && av.every((v) => typeof v === 'number' && Number.isFinite(v))) {
              const damped: [number, number, number] = [
                Math.max(-2, Math.min(2, av[0] * 0.5)),
                Math.max(-2, Math.min(2, av[1] * 0.5)),
                Math.max(-2, Math.min(2, av[2] * 0.5))
              ];
              rigid?.setAngularVelocity?.(damped);
            }
            if (now >= this.nextSpinToast) {
              this.nextSpinToast = now + 3000;
              this.ctx?.anchors.showToast('Spin Recovery Active');
            }
          }
          this.spinSample = undefined;
        }
        if (now >= this.nextSpin) {
          this.nextSpin = now + 1000;
          this.spinSample = { time: now, pitch };
        }
      }
    } else if (SPIN_IDS.has(id)) {
      this.spinSample = undefined;
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
    const now = telemetry.timestamp;
    const hagl = telemetry.aglFeet;
    const kias = telemetry.kias;
    const rigid = aircraft.rigidBody;
    if (now >= this.next777Impulse) {
      this.next777Impulse = now + 100;
      const dt = Number.isFinite(telemetry.dt) && telemetry.dt > 0 ? Math.min(telemetry.dt, 0.25) : 0.02;
      const dtScale = Math.max(0.25, Math.min(2.5, dt / 0.02));
      if (
        !telemetry.groundContact &&
        Number.isFinite(hagl) &&
        hagl >= 5 &&
        hagl <= 80 &&
        Number.isFinite(kias) &&
        kias >= 80 &&
        kias <= 450 &&
        (!Number.isFinite(telemetry.vs) || telemetry.vs < 1500) &&
        (!Number.isFinite(telemetry.gForce) || telemetry.gForce < 1.8)
      ) {
        const impulseZ = Math.max(0, Math.min(2_500, (80 - hagl) * 20 * dtScale));
        if (Number.isFinite(impulseZ) && impulseZ > 0) {
          rigid?.applyCentralImpulse?.([0, 0, impulseZ]);
        }
      }
      if (
        !telemetry.groundContact &&
        Number.isFinite(hagl) &&
        hagl >= 50 &&
        Number.isFinite(kias) &&
        kias >= 60 &&
        kias <= 450 &&
        Number.isFinite(telemetry.aoa) &&
        telemetry.aoa > 12 &&
        telemetry.aoa < 75
      ) {
        const rawHeading = Number(values.heading360);
        const heading = Number.isFinite(rawHeading) ? rawHeading : telemetry.heading;
        if (Number.isFinite(heading)) {
          const headingRad = heading * (Math.PI / 180);
          const force = Math.min(1_500, Math.random() * (telemetry.aoa - 12) * 50 * dtScale);
          if (Number.isFinite(force) && force > 0) {
            rigid?.applyTorqueImpulse?.([force * Math.sin(headingRad), force * Math.cos(headingRad), 0]);
          }
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
    this.next777Impulse = 0;
  }

  public destroy(): void {
    this.unmountTab?.();
    this.unmountTab = null;
    this.syncHudTab = null;
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.onKeyDown);
    }
    this.optionKey = '';
    this.lastSimMajor = null;
    this.resetAircraftSounds();
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
