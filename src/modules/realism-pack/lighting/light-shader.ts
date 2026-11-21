import type { SimMajorVersion } from '../../../types/module';

export const MAX_AIRCRAFT_LIGHTS = 16;
export const MAX_RUNWAY_LIGHTS = 48;
export const MAX_SPOTS = 12;

export interface LightPointUniform {
  x: number;
  y: number;
  z: number;
  w: number;
  r: number;
  g: number;
  b: number;
}

export interface SpotUniform {
  x: number;
  y: number;
  z: number;
  w: number;
  dx: number;
  dy: number;
  dz: number;
  cosInner: number;
  cosOuter: number;
  range: number;
  falloff: number;
  r: number;
  g: number;
  b: number;
}

export function isCesiumModern(version?: unknown, simMajor?: SimMajorVersion | null): boolean {
  if (simMajor === 4) return true;
  const v = String(version ?? '');
  const m = v.match(/^(\d+)\.(\d+)/);
  if (!m) return simMajor !== 3;
  return Number(m[1]) > 1 || Number(m[2]) >= 102;
}

const SHADER_CORE = `
    uniform sampler2D colorTexture;
    uniform sampler2D depthTexture;
    in vec2 v_textureCoordinates;

    #define MAX_LIGHTS ${MAX_AIRCRAFT_LIGHTS}
    #define MAX_RW_LIGHTS ${MAX_RUNWAY_LIGHTS}
    #define MAX_SPOTS ${MAX_SPOTS}

    uniform vec4 u_lightPosEC[MAX_LIGHTS];
    uniform vec3 u_lightColor[MAX_LIGHTS];
    uniform int u_count;

    uniform vec4 u_rwPosEC[MAX_RW_LIGHTS];
    uniform vec3 u_rwColor[MAX_RW_LIGHTS];
    uniform int u_rwCount;

    uniform vec4 u_spotPosEC[MAX_SPOTS];
    uniform vec3 u_spotDirEC[MAX_SPOTS];
    uniform vec4 u_spotCone[MAX_SPOTS];
    uniform vec3 u_spotColor[MAX_SPOTS];
    uniform int u_spotCount;

    uniform float u_logDepth;
    uniform float u_intensity;
    uniform float u_range;
    uniform float u_falloff;
    uniform float u_halo;
    uniform float u_core;
    uniform float u_lampSize;
    uniform float u_pixelAngle;
    uniform float u_spotGlare;
    uniform float u_dayFactor;
    uniform float u_nearFade;

    vec3 rayAt(vec2 uv) {
      vec4 n = czm_inverseProjection * vec4(uv * 2.0 - 1.0, -1.0, 1.0);
      return normalize(n.xyz / n.w);
    }

    vec4 surfaceAt(vec2 uv) {
      float raw = czm_unpackDepth(texture(depthTexture, uv));
      if (raw >= 0.9999999) return vec4(0.0);
      vec3 p;
      if (u_logDepth > 0.5) {
        float zLin = pow(2.0, raw * czm_log2FarDepthFromNearPlusOne) - 1.0 + czm_currentFrustum.x;
        vec3 r = rayAt(uv);
        p = r * (zLin / max(-r.z, 1e-4));
      } else {
        float d = czm_readDepth(depthTexture, uv);
        vec4 e = czm_windowToEyeCoordinates(uv * czm_viewport.zw + czm_viewport.xy, d);
        p = e.xyz / e.w;
      }
      if (length(p) > 500000.0) return vec4(0.0);
      return vec4(p, 1.0);
    }

    vec3 normalAt(vec2 uv, vec3 p) {
      vec2 px = 1.0 / czm_viewport.zw;
      vec4 r = surfaceAt(uv + vec2(px.x, 0.0));
      vec4 l = surfaceAt(uv - vec2(px.x, 0.0));
      vec4 t = surfaceAt(uv + vec2(0.0, px.y));
      vec4 b = surfaceAt(uv - vec2(0.0, px.y));
      vec3 dx1 = r.xyz - p;
      vec3 dx2 = p - l.xyz;
      vec3 dy1 = t.xyz - p;
      vec3 dy2 = p - b.xyz;
      vec3 dx = (r.w < 0.5) ? dx2 : (l.w < 0.5) ? dx1 : (dot(dx1, dx1) < dot(dx2, dx2) ? dx1 : dx2);
      vec3 dy = (t.w < 0.5) ? dy2 : (b.w < 0.5) ? dy1 : (dot(dy1, dy1) < dot(dy2, dy2) ? dy1 : dy2);
      vec3 n = cross(dx, dy);
      float len = length(n);
      if (len < 1e-8) return -normalize(p);
      n /= len;
      if (dot(n, -p) < 0.0) n = -n;
      return n;
    }

    float lampVisibility(vec3 L) {
      vec4 clip = czm_projection * vec4(L, 1.0);
      if (clip.w <= 0.0) return 0.0;
      vec2 uv = clip.xy / clip.w * 0.5 + 0.5;
      if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
      float dl = length(L);
      float bias = 0.35 + dl * 0.002;
      vec2 px = 1.5 / czm_viewport.zw;
      float v = 0.0;
      vec4 s;
      s = surfaceAt(uv);                     v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv + vec2(px.x, 0.0));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv - vec2(px.x, 0.0));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv + vec2(0.0, px.y));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      s = surfaceAt(uv - vec2(0.0, px.y));   v += (s.w < 0.5 || length(s.xyz) > dl - bias) ? 1.0 : 0.0;
      return v / 5.0;
    }

    vec3 lampGlow(vec3 L, vec3 c, float sizeM, float bloomK, vec3 rayDir) {
      float t = dot(L, rayDir);
      if (t <= 0.3) return vec3(0.0);
      float ang = length(L - rayDir * t) / t;
      if (ang > 0.25) return vec3(0.0);
      float r = max(sizeM / t, u_pixelAngle * 1.2);
      float x = ang / r;
      float maxX = mix(14.0, 5.0, clamp(t / 800.0, 0.0, 1.0));
      if (x > maxX) return vec3(0.0);
      float vis = lampVisibility(L);
      if (vis <= 0.0) return vec3(0.0);
      float farK = 1.0 / (1.0 + t / 350.0);
      float core = 1.0 - smoothstep(0.65, 1.0, x);
      float bloom = (exp(-x * x * 0.3) * 0.6 + 0.35 / (1.0 + x * x * 0.2)) * (1.0 - smoothstep(maxX * 0.65, maxX, x));
      float peak = max(c.r, max(c.g, c.b));
      vec3 coreCol = mix(c, vec3(peak), 0.55);
      return vis * (coreCol * core * u_core + c * bloom * bloomK * farK);
    }

    void main() {
      vec4 color = texture(colorTexture, v_textureCoordinates);
      if (u_count <= 0 && u_rwCount <= 0 && u_spotCount <= 0) {
        out_FragColor = color;
        return;
      }

      vec3 rayDir = rayAt(v_textureCoordinates);
      vec4 surf = surfaceAt(v_textureCoordinates);
      bool sky = surf.w < 0.5;
      vec3 posEC = surf.xyz;
      vec3 n = sky ? -rayDir : normalAt(v_textureCoordinates, posEC);

      vec3 upEC = normalize(czm_viewRotation * normalize(czm_viewerPositionWC));
      float sunElev = dot(normalize(czm_sunDirectionEC), upEC);
      float night = mix(u_dayFactor, 1.0, 1.0 - smoothstep(-0.08, 0.12, sunElev));

      float range2 = u_range * u_range;
      float nearK = sky ? 0.0 : smoothstep(u_nearFade * 0.5, u_nearFade, length(posEC));
      vec3 add = vec3(0.0);

      for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i >= u_count) break;
        vec4 L = u_lightPosEC[i];
        if (L.w <= 0.0) continue;
        vec3 c = u_lightColor[i] * L.w;
        if (!sky) {
          vec3 d = L.xyz - posEC;
          float dist2 = dot(d, d);
          if (dist2 < range2) {
            float att = 1.0 / (1.0 + dist2 * u_falloff);
            float edge = 1.0 - smoothstep(0.4 * range2, range2, dist2);
            float ndl = clamp(dot(n, d * inversesqrt(dist2 + 0.0001)) * 0.9 + 0.1, 0.0, 1.0);
            add += c * att * edge * ndl * nearK;
          }
        }
        add += lampGlow(L.xyz, c, u_lampSize, u_halo, rayDir);
      }

      if (!sky) {
        float rwRange2 = 22500.0;
        for (int k = 0; k < MAX_RW_LIGHTS; k++) {
          if (k >= u_rwCount) break;
          vec4 R = u_rwPosEC[k];
          if (R.w <= 0.0) continue;
          vec3 d = R.xyz - posEC;
          float dist2 = dot(d, d);
          if (dist2 < rwRange2) {
            float att = 1.0 / (1.0 + dist2 * 0.015);
            float edge = 1.0 - smoothstep(0.35 * rwRange2, rwRange2, dist2);
            float ndl = clamp(dot(n, d * inversesqrt(dist2 + 0.0001)) * 0.8 + 0.2, 0.0, 1.0);
            add += u_rwColor[k] * R.w * att * edge * ndl;
          }
        }
      }

      for (int j = 0; j < MAX_SPOTS; j++) {
        if (j >= u_spotCount) break;
        vec4 S = u_spotPosEC[j];
        if (S.w <= 0.0) continue;
        vec3 D = u_spotDirEC[j];
        vec4 K = u_spotCone[j];
        vec3 c = u_spotColor[j] * S.w;
        if (!sky) {
          vec3 d = posEC - S.xyz;
          float dist = length(d);
          if (dist > 0.5 && dist < K.z) {
            vec3 dn = d / dist;
            float cone = smoothstep(K.y, K.x, dot(dn, D));
            if (cone > 0.0) {
              float att = 1.0 / (1.0 + dist * dist * K.w);
              float edge = 1.0 - smoothstep(0.6 * K.z, K.z, dist);
              float ndl = max(dot(n, -dn), 0.0);
              add += c * cone * att * edge * ndl * nearK;
            }
          }
        }
        float tl = max(length(S.xyz), 0.001);
        float facing = max(smoothstep(K.y, 1.0, dot(-S.xyz / tl, D)), 0.06);
        add += lampGlow(S.xyz, c * facing, u_lampSize * 1.3, u_spotGlare, rayDir);
      }

      add *= u_intensity * night;
    #ifdef HAS_ISNAN
      if (any(isnan(add)) || any(isinf(add))) add = vec3(0.0);
    #else
      if (!(add.x == add.x && add.y == add.y && add.z == add.z)) add = vec3(0.0);
    #endif
      add = max(add, vec3(0.0));
      add = add / (1.0 + 0.2 * add);
      out_FragColor = vec4(color.rgb + add, color.a);
    }
`;

export function buildLightingShader(modern: boolean): string {
  if (modern) return '#define HAS_ISNAN\n' + SHADER_CORE;
  return SHADER_CORE
    .replace(/\bin vec2 v_textureCoordinates;/g, 'varying vec2 v_textureCoordinates;')
    .replace(/\btexture\(/g, 'texture2D(')
    .replace(/\bout_FragColor\b/g, 'gl_FragColor');
}

interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

interface Vec4Like extends Vec3Like {
  w: number;
}

export class LightingShaderController {
  private stage: { enabled?: boolean } | null = null;
  private removeStage: (() => void) | null = null;
  private lightPosArr: Vec4Like[] = [];
  private lightColArr: Vec3Like[] = [];
  private rwPosArr: Vec4Like[] = [];
  private rwColArr: Vec3Like[] = [];
  private spotPosArr: Vec4Like[] = [];
  private spotDirArr: Vec3Like[] = [];
  private spotConeArr: Vec4Like[] = [];
  private spotColArr: Vec3Like[] = [];

  private count = 0;
  private rwCount = 0;
  private spotCount = 0;
  private intensity = 1.5;
  private dayFactor = 0.08;

  private initArrays(): boolean {
    if (this.spotColArr.length === MAX_SPOTS) return true;
    this.lightPosArr = [];
    this.lightColArr = [];
    this.rwPosArr = [];
    this.rwColArr = [];
    this.spotPosArr = [];
    this.spotDirArr = [];
    this.spotConeArr = [];
    this.spotColArr = [];

    const Cesium = window.Cesium as Record<string, unknown> | undefined;
    const C4 = Cesium?.Cartesian4 as (new (x: number, y: number, z: number, w: number) => Vec4Like) | undefined;
    const C3 = Cesium?.Cartesian3 as (new (x: number, y: number, z: number) => Vec3Like) | undefined;
    const make4 = (x: number, y: number, z: number, w: number): Vec4Like => {
      if (typeof C4 === 'function') {
        try { return new C4(x, y, z, w); } catch { /* fallback */ }
      }
      return { x, y, z, w };
    };
    const make3 = (x: number, y: number, z: number): Vec3Like => {
      if (typeof C3 === 'function') {
        try { return new C3(x, y, z); } catch { /* fallback */ }
      }
      return { x, y, z };
    };

    for (let i = 0; i < MAX_AIRCRAFT_LIGHTS; i++) {
      this.lightPosArr.push(make4(0, 0, 0, 0));
      this.lightColArr.push(make3(0, 0, 0));
    }
    for (let i = 0; i < MAX_RUNWAY_LIGHTS; i++) {
      this.rwPosArr.push(make4(0, 0, 0, 0));
      this.rwColArr.push(make3(0, 0, 0));
    }
    for (let i = 0; i < MAX_SPOTS; i++) {
      this.spotPosArr.push(make4(0, 0, 0, 0));
      this.spotDirArr.push(make3(0, 0, 1));
      this.spotConeArr.push(make4(1, 0.9, 600, 0.0001));
      this.spotColArr.push(make3(0, 0, 0));
    }
    return true;
  }

  public ensureStage(simMajor: SimMajorVersion | null): boolean {
    if (this.stage) return true;
    const Stage = window.Cesium?.PostProcessStage;
    const scene = window.geofs?.api?.viewer?.scene;
    const stages = scene?.postProcessStages;
    const atmoStage = window.geofs?.fx?.atmosphere?.atmospherePostProcessStage;
    if (!Stage || !stages?.add) return false;
    if (atmoStage && atmoStage._ready === false) return false;

    this.initArrays();
    const modern = isCesiumModern((window.Cesium as Record<string, unknown> | undefined)?.VERSION, simMajor);
    try {
      const added = stages.add(new Stage({
        fragmentShader: buildLightingShader(modern),
        uniforms: {
          u_lightPosEC: () => this.lightPosArr,
          u_lightColor: () => this.lightColArr,
          u_count: () => this.count,
          u_rwPosEC: () => this.rwPosArr,
          u_rwColor: () => this.rwColArr,
          u_rwCount: () => this.rwCount,
          u_spotPosEC: () => this.spotPosArr,
          u_spotDirEC: () => this.spotDirArr,
          u_spotCone: () => this.spotConeArr,
          u_spotColor: () => this.spotColArr,
          u_spotCount: () => this.spotCount,
          u_logDepth: () => ((scene as Record<string, unknown>)?.logarithmicDepthBuffer ? 1.0 : 0.0),
          u_intensity: () => this.intensity,
          u_range: () => 55.0,
          u_falloff: () => 0.04,
          u_halo: () => 0.45,
          u_core: () => 1.3,
          u_lampSize: () => 0.25,
          u_pixelAngle: () => {
            const h = scene?.canvas?.clientHeight || window.innerHeight || 900;
            const fov = scene?.camera?.frustum?.fovy || scene?.camera?.frustum?.fov || 1.047;
            return fov / Math.max(1, h);
          },
          u_spotGlare: () => 0.55,
          u_dayFactor: () => this.dayFactor,
          u_nearFade: () => 1.2
        }
      })) as { enabled?: boolean } | undefined;

      if (added) {
        added.enabled = false;
        this.stage = added;
        this.removeStage = () => stages.remove?.(added);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  public setData(
    lights: LightPointUniform[],
    runwayLights: LightPointUniform[],
    spots: SpotUniform[],
    intensity: number,
    dayFactor: number
  ): void {
    this.initArrays();
    this.intensity = intensity;
    this.dayFactor = dayFactor;

    const lc = Math.min(lights.length, MAX_AIRCRAFT_LIGHTS);
    for (let i = 0; i < lc; i++) {
      const src = lights[i];
      this.lightPosArr[i].x = src.x;
      this.lightPosArr[i].y = src.y;
      this.lightPosArr[i].z = src.z;
      this.lightPosArr[i].w = src.w;
      this.lightColArr[i].x = src.r;
      this.lightColArr[i].y = src.g;
      this.lightColArr[i].z = src.b;
    }
    for (let i = lc; i < MAX_AIRCRAFT_LIGHTS; i++) this.lightPosArr[i].w = 0;
    this.count = lc;

    const rc = Math.min(runwayLights.length, MAX_RUNWAY_LIGHTS);
    for (let i = 0; i < rc; i++) {
      const src = runwayLights[i];
      this.rwPosArr[i].x = src.x;
      this.rwPosArr[i].y = src.y;
      this.rwPosArr[i].z = src.z;
      this.rwPosArr[i].w = src.w;
      this.rwColArr[i].x = src.r;
      this.rwColArr[i].y = src.g;
      this.rwColArr[i].z = src.b;
    }
    for (let i = rc; i < MAX_RUNWAY_LIGHTS; i++) this.rwPosArr[i].w = 0;
    this.rwCount = rc;

    const sc = Math.min(spots.length, MAX_SPOTS);
    for (let i = 0; i < sc; i++) {
      const src = spots[i];
      this.spotPosArr[i].x = src.x;
      this.spotPosArr[i].y = src.y;
      this.spotPosArr[i].z = src.z;
      this.spotPosArr[i].w = src.w;
      this.spotDirArr[i].x = src.dx;
      this.spotDirArr[i].y = src.dy;
      this.spotDirArr[i].z = src.dz;
      this.spotConeArr[i].x = src.cosInner;
      this.spotConeArr[i].y = src.cosOuter;
      this.spotConeArr[i].z = src.range;
      this.spotConeArr[i].w = src.falloff;
      this.spotColArr[i].x = src.r;
      this.spotColArr[i].y = src.g;
      this.spotColArr[i].z = src.b;
    }
    for (let i = sc; i < MAX_SPOTS; i++) this.spotPosArr[i].w = 0;
    this.spotCount = sc;
  }

  public setEnabled(enabled: boolean): void {
    if (this.stage) this.stage.enabled = enabled;
  }

  public hasStage(): boolean {
    return this.stage !== null;
  }

  public dispose(): void {
    if (this.stage) {
      this.stage.enabled = false;
    }
    this.removeStage?.();
    this.stage = null;
    this.removeStage = null;
    this.count = 0;
    this.rwCount = 0;
    this.spotCount = 0;
  }
}
