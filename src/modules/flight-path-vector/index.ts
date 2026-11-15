import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';

export class FlightPathVectorModule implements IModule {
  public readonly id = 'flight-path-vector';
  public readonly name = 'Flight Path Vector';
  public readonly description = 'Pure SVG HUD flight path bird and pitch ladder projected in 3D view.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private visible = true;
  private svgEl: SVGSVGElement | null = null;
  private birdEl: SVGGElement | null = null;
  private btnEl: HTMLButtonElement | null = null;
  private unmounts: Array<() => void> = [];

  public init(context: ModuleContext): void {
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

  public toggle(): void {
    this.visible = !this.visible;
    if (this.svgEl) this.svgEl.style.display = this.visible ? 'block' : 'none';
    if (this.btnEl) {
      this.btnEl.classList.toggle('is-active', this.visible);
      this.btnEl.textContent = this.visible ? 'FPV ON' : 'FPV OFF';
    }
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.visible || !this.birdEl) return;
    const fpaDeg = telemetry.groundSpeed > 15
      ? Math.atan2(telemetry.vs / 60, telemetry.groundSpeed * 1.68781) * (180 / Math.PI)
      : 0;
    const dy = Math.max(-22, Math.min(22, -fpaDeg * 0.8));
    const roll = Math.max(-45, Math.min(45, telemetry.roll));
    this.birdEl.setAttribute('transform', `translate(0 ${dy.toFixed(2)}) rotate(${roll.toFixed(1)} 50 50)`);
  }

  public destroy(): void {
    for (const u of this.unmounts) u();
    this.unmounts = [];
    this.svgEl?.remove();
    this.svgEl = null;
    this.birdEl = null;
    this.btnEl = null;
  }
}
