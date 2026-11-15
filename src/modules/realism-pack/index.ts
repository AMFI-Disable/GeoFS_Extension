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

const OPTION_LABELS: Record<keyof RealismOptions, string> = {
  gBreath: 'G Breathing', windAudio: 'Wind Audio', blackout: 'Blackout', cameraShake: 'Camera Shake',
  propwash: 'Propwash', spinFix: 'Spin Recovery', bladeCollisions: 'Blade Collisions',
  engineInertia: 'Engine Inertia', spoilerArming: 'Spoiler Arming', performanceMode: 'Performance Mode'
};

function isEnabled(options: Partial<RealismOptions> | undefined, key: keyof RealismOptions): boolean {
  return options?.[key] ?? (key !== 'performanceMode');
}

export class RealismPackModule implements IModule {
  public readonly id = 'realism-pack';
  public readonly name = 'Realism Pack';
  public readonly description = 'Archived G-force, camera, handling and aircraft physics effects.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private optionKey = '';
  private panel: HTMLElement | null = null;
  private unmount: (() => void) | undefined;
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

  private onKeyDown = (event: KeyboardEvent) => {
    if (!isEnabled(this.ctx?.getSettings().realismOptions, 'spoilerArming') || event.key !== 'Shift' || event.repeat || event.defaultPrevented ||
        (event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable]'))) return;
    const aircraft = window.geofs?.aircraft?.instance;
    if (aircraft && !aircraft.groundContact && window.controls?.airbrakes?.position === 0) {
      this.spoilerArmed = true;
      this.ctx?.anchors.showToast('Spoilers Armed');
    }
  };

  public init(context: ModuleContext): void {
    this.ctx = context;
    const major = context.sim.getMajorVersion() ?? 4;
    const audioBase = major === 3 ? 'https://geofs-assets.evengao6688.workers.dev/audio/'
      : 'https://cdn.jsdelivr.net/gh/AMFI-Disable/GeoFS-V3.9_Assets@main/audio/';
    this.breath = new Audio(audioBase + 'cutgbreath.mp3');
    this.wind = new Audio(audioBase + 'wind.mp3');
    this.breath.preload = this.wind.preload = 'none';
    const panel = document.createElement('div');
    for (const [key, label] of Object.entries(OPTION_LABELS) as Array<[keyof RealismOptions, string]>) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'geofs-ext-pad';
      button.textContent = label;
      button.dataset.effect = key;
      button.addEventListener('click', () => {
        const options = context.getSettings().realismOptions;
        context.updateSettings({ realismOptions: { ...options, [key]: !isEnabled(options, key) } });
      });
      panel.append(button);
    }
    this.panel = panel;
    this.unmount = context.anchors.registerHudTab('realism', 'REALISM', panel);
    this.onSettingsChange(context.getSettings());
    document.addEventListener('keydown', this.onKeyDown);
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    const options = settings.realismOptions;
    const optionKey = JSON.stringify(options ?? {});
    if (optionKey === this.optionKey) return;
    this.optionKey = optionKey;
    this.restoreAircraft();
    if (!isEnabled(options, 'gBreath')) this.breath?.pause();
    if (!isEnabled(options, 'windAudio')) this.wind?.pause();
    if (!isEnabled(options, 'blackout')) {
      this.uniforms.strength = 0;
      this.overGSeconds = 0;
      this.blackoutActive = false;
    }
    for (const button of this.panel?.querySelectorAll<HTMLButtonElement>('[data-effect]') ?? []) {
      const enabled = isEnabled(options, button.dataset.effect as keyof RealismOptions);
      button.classList.toggle('is-active', enabled);
      button.setAttribute('aria-pressed', String(enabled));
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
    if (this.aircraft !== aircraft) {
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
      if (cockpit && Number(values.accZ) >= 50 && isEnabled(options, 'windAudio')) void this.wind?.play().catch(() => {});
      this.ensureStage(telemetry.simMajor);
    }
    const steps = telemetry.dt / 0.01;
    if (cockpit && g > 9 && isEnabled(options, 'blackout')) {
      this.overGSeconds += 0.05 * steps;
      if (this.overGSeconds > 0.1) this.blackoutActive = true;
      if (this.blackoutActive) this.uniforms.strength = Math.min(1, this.uniforms.strength + 0.001 * (g - 5) / 10 * steps);
    } else {
      this.overGSeconds = 0;
      this.uniforms.strength = Math.max(0, this.uniforms.strength - 0.0005 * steps);
      if (!this.uniforms.strength) this.blackoutActive = false;
    }

    const camera = sim?.camera;
    const intensity = (id === '4' ? 0 : Math.max(0, telemetry.aoa - 10) * 0.0002) +
      Math.max(0, telemetry.kias - 450) * 0.00001 + (Math.abs(g - 1) > 2 ? Math.abs(g - 1) * 0.0001 : 0);
    if (intensity > 0 && isEnabled(options, 'cameraShake') && camera?.translate && !this.cameraOffset) {
      const offset = intensity * Math.random();
      camera.translate(offset, offset, offset);
      const undo = () => camera.translate?.(-offset, -offset, -offset);
      const timer = setTimeout(() => {
        this.cameraOffset = undefined;
        undo();
      }, 5);
      this.cameraOffset = { undo, timer };
    }

    if (now >= this.nextPhysics) {
      this.nextPhysics = now + 100;
      if (PROPWASH_IDS.has(id) && isEnabled(options, 'propwash')) {
        for (const foil of aircraft.airfoils ?? []) this.setValue(foil, 'propwash', foil.forceDirection === 2 ? 0.005 : 0.01);
        const part = aircraft.setup?.parts?.[0];
        if (part && typeof values.rpm === 'number') this.setValue(part, 'centerOfMass', [values.rpm / 1000, 0, 0]);
      }
      const definition = aircraft.definition;
      if (definition?.maxRPM === 10_000 && typeof values.rpm === 'number' && isEnabled(options, 'engineInertia')) {
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

  private restoreAircraft(): void {
    for (const restore of this.restores.reverse()) restore();
    this.restores = [];
    this.captured = new WeakMap();
    this.spoilerArmed = false;
    this.spinSample = undefined;
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    this.unmount?.();
    this.unmount = undefined;
    this.panel = null;
    this.optionKey = '';
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
