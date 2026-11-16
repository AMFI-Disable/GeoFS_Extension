import type { GeoFSAircraftInstance, GeoFSCartesian } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

// The archived FPV projects the movement vector from the camera, 1.5 seconds ahead.
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

export class FlightPathVectorModule implements IModule {
  public readonly id = 'flight-path-vector';
  public readonly name = 'Flight Path Vector';
  public readonly description = 'Camera-relative flight path projected into the SVG HUD.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private visible = true;
  private lastSample: { aircraft: GeoFSAircraftInstance; position: GeoFSCartesian; time: number } | undefined;
  private svgEl: SVGSVGElement | null = null;
  private birdEl: SVGGElement | null = null;
  private btnEl: HTMLButtonElement | null = null;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
    this.visible = true;
    this.ctx = context;
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
    document.body?.appendChild(svg);

    this.svgEl = svg;
    this.birdEl = bird;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'geofs-ext-pad is-active';
    btn.textContent = 'FPV ON';
    btn.addEventListener('click', () => this.toggle());
    this.btnEl = btn;

    this.unmounts.push(context.anchors.mountControl('fpv-pad', 'corner', btn));
    const combo = context.getSettings().keybindings.toggleFpv;
    this.unmounts.push(context.keybinds.register('fpv-toggle', combo, () => this.toggle()));
  }

  public onSettingsChange(settings: import('../../types/settings').ExtensionSettings): void {
    this.ctx?.keybinds.updateCombo('fpv-toggle', settings.keybindings.toggleFpv);
  }

  public toggle(): void {
    this.visible = !this.visible;
    this.lastSample = undefined;
    if (this.birdEl) this.birdEl.style.display = 'none';
    if (this.svgEl) this.svgEl.style.display = this.visible ? 'block' : 'none';
    if (this.btnEl) {
      this.btnEl.classList.toggle('is-active', this.visible);
      this.btnEl.textContent = this.visible ? 'FPV ON' : 'FPV OFF';
    }
  }

  public update(telemetry: FlightTelemetry): void {
    const bird = this.birdEl;
    const svg = this.svgEl;
    if (!this.visible || !bird || !svg) return;

    const sim = window.geofs;
    const aircraft = sim?.aircraft?.instance;
    const position = aircraft?.llaLocation;
    const camera = sim?.camera?.lla;
    const scene = sim?.api?.viewer?.scene;
    const canvas = scene?.canvas;
    const fromDegrees = window.Cesium?.Cartesian3?.fromDegrees;
    const transforms = window.Cesium?.SceneTransforms;
    const toWindow = transforms?.worldToWindowCoordinates ?? transforms?.wgs84ToWindowCoordinates;
    if (telemetry.paused || telemetry.crashed || !aircraft || !position?.every(Number.isFinite) ||
        !camera?.every(Number.isFinite) || !canvas || !fromDegrees || !toWindow) {
      this.lastSample = undefined;
      bird.style.display = 'none';
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

    const vs = Math.max(-1, Math.min(1, telemetry.vs / 3000));
    const hue = aircraft.stalling || telemetry.aoa > 14 ? 0 : 120 + vs * (vs > 0 ? 80 : 120);
    for (const mark of bird.children) mark.setAttribute('stroke', `hsl(${hue}, 100%, 50%)`);
  }

  public destroy(): void {
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.lastSample = undefined;
    this.svgEl?.remove();
    this.svgEl = null;
    this.birdEl = null;
    this.btnEl = null;
    this.ctx = null;
  }
}
