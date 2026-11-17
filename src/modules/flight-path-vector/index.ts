import type { GeoFSAircraftInstance, GeoFSCartesian, GeoFSCesiumEntity } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';

const FALLBACK_FPV_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">' +
      '<circle cx="64" cy="64" r="22" fill="none" stroke="#ffffff" stroke-width="7"/>' +
      '<line x1="16" y1="64" x2="42" y2="64" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="86" y1="64" x2="112" y2="64" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="64" y1="20" x2="64" y2="42" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>' +
    '</svg>'
  );

// Projects the movement vector from the camera 1.5 seconds ahead (retained for unit contracts).
export function projectFlightPath(
  previous: GeoFSCartesian, current: GeoFSCartesian, camera: GeoFSCartesian, elapsed: number
): GeoFSCartesian | null {
  const dx = current.x - previous.x;
  const dy = current.y - previous.y;
  const dz = current.z - previous.z;
  if (elapsed <= 0 || elapsed > 5 || (dx === 0 && dy === 0 && dz === 0)) return null;
  const factor = 1.5 / elapsed;
  const point = { x: camera.x + dx * factor, y: camera.y + dy * factor, z: camera.z + dz * factor };
  return Object.values(point).every(Number.isFinite) ? point : null;
}

export function resolveFpvImageUrl(
  context: Pick<ModuleContext, 'getAssetUrl'> | null,
  settings: Pick<ExtensionSettings, 'fpvResolutionMode'>,
  resolutionScale: number
): { url: string; variant: 'hires' | 'lowres' } {
  const useLowRes =
    settings.fpvResolutionMode === 'lowres' ||
    (settings.fpvResolutionMode === 'auto' && resolutionScale <= 0.6);
  const variant: 'hires' | 'lowres' = useLowRes ? 'lowres' : 'hires';
  const file = variant === 'lowres' ? 'fpv_lowres.png' : 'fpv_hires.png';
  return {
    url: context?.getAssetUrl?.(file) || FALLBACK_FPV_DATA_URI,
    variant
  };
}

export class FlightPathVectorModule implements IModule {
  public readonly id = 'flight-path-vector';
  public readonly name = 'Flight Path Vector';
  public readonly description = 'GeoFS V3.9 Cesium 3D FPV billboard with bundled hi-res reticle and Glideslope widget.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private visible = true;
  private lastCameraCartesian: GeoFSCartesian | null = null;
  private lastSample: { aircraft: GeoFSAircraftInstance; position: GeoFSCartesian; time: number } | undefined;
  private cesiumEntity: GeoFSCesiumEntity | null = null;
  private currentAssetVariant: 'hires' | 'lowres' | null = null;
  private svgEl: SVGSVGElement | null = null;
  private birdEl: SVGGElement | null = null;
  private glideslopeEl: HTMLDivElement | null = null;
  private glideslopeSpan: HTMLSpanElement | null = null;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.visible = true;
    this.ctx = context;

    if (typeof document !== 'undefined') {
      this.ensureGlideslopeWidget();
    }

    const combo = context.getSettings().keybindings.toggleFpv;
    this.unmounts.push(context.keybinds.register('fpv-toggle', combo, () => this.toggle()));
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('fpv-toggle', settings.keybindings.toggleFpv);
    this.currentAssetVariant = null;
  }

  public toggle(): void {
    this.visible = !this.visible;
    this.lastCameraCartesian = null;
    this.lastSample = undefined;
    if (this.cesiumEntity) this.cesiumEntity.show = this.visible;
    if (this.birdEl) this.birdEl.style.display = 'none';
    if (this.svgEl) this.svgEl.style.display = this.visible ? 'block' : 'none';
    if (this.glideslopeEl) this.glideslopeEl.style.display = this.visible ? 'inline-block' : 'none';
  }

  private ensureGlideslopeWidget(): HTMLDivElement | null {
    if (typeof document === 'undefined' || !document.body) return null;
    let el = document.getElementById('flightDataDisplay0') as HTMLDivElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'flightDataDisplay0';
      document.body.appendChild(el);
    }
    el.style.cssText =
      'position:fixed;bottom:40px;right:calc(10px + 48px + 16px);height:36px;min-width:64px;padding:0 16px;' +
      'display:inline-block;background:0 0;border:none;border-radius:0;box-shadow:none;' +
      'backdrop-filter:none;-webkit-backdrop-filter:none;' +
      'font-family:"Roboto","Helvetica","Arial",sans-serif;font-size:14px;font-weight:400;text-transform:uppercase;' +
      'overflow:hidden;will-change:box-shadow;' +
      'transition:box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);' +
      'text-align:center;line-height:36px;vertical-align:middle;z-index:9999;pointer-events:none;';
    let span = el.querySelector('span');
    if (!span) {
      el.innerHTML =
        '<span style="background: 0 0; border: none; border-radius: 2px; color: #000; display: inline-block; padding: 0 8px;">Glideslope N/A</span>';
      span = el.querySelector('span');
    }
    this.glideslopeEl = el;
    this.glideslopeSpan = span;
    return el;
  }

  private ensureSvgFallback(): void {
    if (this.svgEl || typeof document === 'undefined' || !document.body) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147482000;';
    const bird = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bird.innerHTML = `
      <circle cx="50" cy="50" r="1.4" fill="none" stroke="#22c55e" stroke-width="0.35" />
      <line x1="46.5" y1="50" x2="48.6" y2="50" stroke="#22c55e" stroke-width="0.35" />
      <line x1="51.4" y1="50" x2="53.5" y2="50" stroke="#22c55e" stroke-width="0.35" />
      <line x1="50" y1="48.6" x2="50" y2="47.1" stroke="#22c55e" stroke-width="0.35" />
    `;
    bird.style.display = 'none';
    svg.appendChild(bird);
    document.body.appendChild(svg);
    this.svgEl = svg;
    this.birdEl = bird;
  }

  public update(telemetry: FlightTelemetry): void {
    const sim = window.geofs;
    const aircraft = sim?.aircraft?.instance;
    const camera = sim?.camera?.lla;
    const fromDegrees = window.Cesium?.Cartesian3?.fromDegrees;

    this.updateGlideslopeReadout(telemetry);

    if (!this.visible || telemetry.paused || telemetry.crashed || !aircraft || !camera?.every(Number.isFinite) || !fromDegrees) {
      if (this.cesiumEntity) this.cesiumEntity.show = false;
      if (this.birdEl) this.birdEl.style.display = 'none';
      this.lastCameraCartesian = null;
      this.lastSample = undefined;
      return;
    }

    const vs = Math.max(-1, Math.min(1, telemetry.vs / 3000));
    const isWarning = Boolean(aircraft.stalling || telemetry.aoa > 14);
    const hue = isWarning ? 0 : 120 + vs * (vs > 0 ? 80 : 120);

    const entities = sim?.api?.viewer?.entities;
    const resolutionScale = Math.max(0.25, Number(sim?.api?.renderingSettings?.resolutionScale) || 1);
    const settings = this.ctx?.getSettings();

    // Primary path: classic GeoFS V3.9 Cesium 3D entity billboard
    if (entities?.add && settings) {
      const currLoc = fromDegrees(camera[1], camera[0], camera[2]);
      if (!currLoc || !Object.values(currLoc).every(Number.isFinite)) return;

      const { url, variant } = resolveFpvImageUrl(this.ctx, settings, resolutionScale);
      if (!this.cesiumEntity) {
        const groundElevM = (Number(sim?.animation?.values?.groundElevationFeet) || 0) / 3.2808399;
        const initialLoc = fromDegrees(camera[1], camera[0], Number.isFinite(groundElevM) ? groundElevM : camera[2]) || currLoc;
        this.cesiumEntity = entities.add({
          position: initialLoc,
          billboard: {
            image: url,
            scale: 0.03 * (1 / resolutionScale),
            color: window.Cesium?.Color?.LIME
          }
        });
        this.currentAssetVariant = variant;
        this.ctx?.emitDiag?.('FPV_BILLBOARD_READY', { variant, howFar: settings.fpvProjectionFactor ?? 15 });
      }

      const howFar = Math.max(1, Math.min(100, Number(settings.fpvProjectionFactor) || 15));
      let targetPos: GeoFSCartesian | null = null;
      if (this.lastCameraCartesian) {
        const dx = currLoc.x - this.lastCameraCartesian.x;
        const dy = currLoc.y - this.lastCameraCartesian.y;
        const dz = currLoc.z - this.lastCameraCartesian.z;
        if (Number.isFinite(dx) && Number.isFinite(dy) && Number.isFinite(dz) && (dx !== 0 || dy !== 0 || dz !== 0)) {
          const cand = {
            x: currLoc.x + howFar * dx,
            y: currLoc.y + howFar * dy,
            z: currLoc.z + howFar * dz
          };
          if (Object.values(cand).every(Number.isFinite)) {
            targetPos = cand;
          }
        }
      }
      this.lastCameraCartesian = currLoc;

      this.cesiumEntity.show = this.visible;
      if (this.cesiumEntity.billboard) {
        if (this.currentAssetVariant !== variant) {
          this.cesiumEntity.billboard.image = url;
          this.currentAssetVariant = variant;
        }
        this.cesiumEntity.billboard.scale = 0.03 * (1 / resolutionScale);
        const CesiumColor = window.Cesium?.Color;
        this.cesiumEntity.billboard.color = isWarning
          ? CesiumColor?.RED ?? 'red'
          : CesiumColor?.fromHsl?.(hue / 360, 1.0, 0.5) ?? CesiumColor?.LIME ?? 'lime';
      }
      if (targetPos) {
        this.cesiumEntity.position = targetPos;
      }
      return;
    }

    // Fallback SVG overlay only if Cesium viewer.entities API is unavailable
    this.ensureSvgFallback();
    const bird = this.birdEl;
    const svg = this.svgEl;
    const position = aircraft.llaLocation;
    const scene = sim?.api?.viewer?.scene;
    const canvas = scene?.canvas;
    const transforms = window.Cesium?.SceneTransforms;
    const toWindow = transforms?.worldToWindowCoordinates ?? transforms?.wgs84ToWindowCoordinates;
    if (!bird || !svg || !position?.every(Number.isFinite) || !canvas || !toWindow) {
      if (bird) bird.style.display = 'none';
      return;
    }

    const world = fromDegrees(position[1], position[0], position[2]);
    const previous = this.lastSample;
    this.lastSample = { aircraft, position: world, time: telemetry.timestamp };
    const projected = previous?.aircraft === aircraft
      ? projectFlightPath(previous.position, world, fromDegrees(camera[1], camera[0], camera[2]),
          (telemetry.timestamp - previous.time) / 1000)
      : null;
    const screen = projected && toWindow(scene, projected);
    if (!screen || !Number.isFinite(screen.x) || !Number.isFinite(screen.y)) {
      bird.style.display = 'none';
      return;
    }

    const viewport = svg.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const size = Math.min(viewport.width, viewport.height);
    if (size <= 0) return;
    const x = (canvasRect.left + screen.x - viewport.left - viewport.width / 2) * 100 / size;
    const y = (canvasRect.top + screen.y - viewport.top - viewport.height / 2) * 100 / size;
    bird.style.display = '';
    bird.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    for (const mark of bird.children) mark.setAttribute('stroke', `hsl(${hue}, 100%, 50%)`);
  }

  private updateGlideslopeReadout(telemetry: FlightTelemetry): void {
    const el = this.glideslopeEl ?? this.ensureGlideslopeWidget();
    if (!el) return;
    el.style.display = this.visible ? 'inline-block' : 'none';
    const sim = window.geofs;
    const navDir = sim?.animation?.getValue?.('NAV1Direction') as string | undefined;
    const navDist = Number(sim?.animation?.getValue?.('NAV1Distance'));
    let gsText = 'N/A';

    if (navDir && Number.isFinite(navDist) && navDist !== 600 && Number.isFinite(telemetry.aglFeet)) {
      const denom = navDir === 'to' ? navDist + 600 : Math.abs(navDist - 600);
      if (denom > 0) {
        const deg = Math.atan((telemetry.aglFeet * 0.3048) / denom) * (180 / Math.PI);
        if (Number.isFinite(deg)) gsText = deg.toFixed(1);
      }
    } else if (typeof telemetry.glideslopeDeviation === 'number' && Number.isFinite(telemetry.glideslopeDeviation)) {
      gsText = telemetry.glideslopeDeviation.toFixed(1);
    }

    const span = this.glideslopeSpan ?? el.querySelector('span');
    if (span) {
      span.textContent = `Glideslope ${gsText}`;
    } else {
      el.innerHTML = `<span style="background: 0 0; border: none; border-radius: 2px; color: #000; display: inline-block; padding: 0 8px;">Glideslope ${gsText}</span>`;
      this.glideslopeSpan = el.querySelector('span');
    }
  }

  public destroy(): void {
    for (const u of this.unmounts) u();
    this.unmounts = [];
    if (this.cesiumEntity) {
      try {
        window.geofs?.api?.viewer?.entities?.remove?.(this.cesiumEntity);
      } catch {
        // ignore entity cleanup errors during teardown
      }
      this.cesiumEntity = null;
    }
    this.lastCameraCartesian = null;
    this.lastSample = undefined;
    this.currentAssetVariant = null;
    this.svgEl?.remove();
    this.svgEl = null;
    this.birdEl = null;
    this.glideslopeEl?.remove();
    this.glideslopeEl = null;
    this.glideslopeSpan = null;
    this.ctx = null;
  }
}
