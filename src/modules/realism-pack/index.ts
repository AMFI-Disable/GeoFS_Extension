import type { FlightTelemetry, IModule, ModuleContext, SimMajorVersion } from '../../types/module';

export function buildGForceShader(simMajor: SimMajorVersion): string {
  if (simMajor === 4) {
    return `
      uniform sampler2D colorTexture;
      in vec2 v_textureCoordinates;
      uniform float strength;
      uniform vec3 tintColor;
      void main() {
        vec4 col = texture(colorTexture, v_textureCoordinates);
        vec2 uv = v_textureCoordinates - 0.5;
        float vig = smoothstep(0.25, 0.75, length(uv)) * strength;
        out_FragColor = mix(col, vec4(tintColor, 1.0), clamp(vig, 0.0, 0.92));
      }
    `;
  }
  return `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    uniform float strength;
    uniform vec3 tintColor;
    void main() {
      vec4 col = texture2D(colorTexture, v_textureCoordinates);
      vec2 uv = v_textureCoordinates - 0.5;
      float vig = smoothstep(0.25, 0.75, length(uv)) * strength;
      gl_FragColor = mix(col, vec4(tintColor, 1.0), clamp(vig, 0.0, 0.92));
    }
  `;
}

export class RealismPackModule implements IModule {
  public readonly id = 'realism-pack';
  public readonly name = 'Realism Pack';
  public readonly description = 'Version-adaptive G-force blackout/redout shaders and synthesized audio cues.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private stage: unknown = null;
  private uniforms = { strength: 0, tintColor: [0, 0, 0] };
  private lastAlertMs = 0;

  public init(context: ModuleContext): void {
    this.ctx = context;
    const major = context.sim.getMajorVersion() ?? 4;
    const PostProcessStage = window.Cesium?.PostProcessStage;
    const stages = window.geofs?.api?.viewer?.scene?.postProcessStages;

    if (PostProcessStage && stages?.add) {
      try {
        this.stage = stages.add(
          new PostProcessStage({
            fragmentShader: buildGForceShader(major),
            uniforms: this.uniforms
          })
        );
      } catch (err) {
        console.warn('[GeoFS Extension] Realism shader fallback (PostProcessStage unavailable):', err);
      }
    }
  }

  public update(telemetry: FlightTelemetry): void {
    if (telemetry.paused) return;
    const g = telemetry.gForce;
    let targetStrength = 0;

    if (g > 4.5) {
      targetStrength = Math.min(0.95, (g - 4.5) * 0.22);
      this.uniforms.tintColor = [0, 0, 0];
    } else if (g < -1.5) {
      targetStrength = Math.min(0.85, (-1.5 - g) * 0.3);
      this.uniforms.tintColor = [0.65, 0.02, 0.02];
    }

    this.uniforms.strength += (targetStrength - this.uniforms.strength) * 0.15;

    if (g > 6.0 && telemetry.timestamp - this.lastAlertMs > 3000) {
      this.lastAlertMs = telemetry.timestamp;
      this.ctx?.audio.playTone(140, 0.25, 'sine', 0.04);
    }
  }

  public destroy(): void {
    if (this.stage) {
      window.geofs?.api?.viewer?.scene?.postProcessStages?.remove?.(this.stage);
      this.stage = null;
    }
    this.ctx = null;
  }
}
