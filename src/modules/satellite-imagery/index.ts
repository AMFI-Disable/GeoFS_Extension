import type { IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';

export class SatelliteImageryModule implements IModule {
  public readonly id = 'satellite-imagery';
  public readonly name = 'Satellite Imagery';
  public readonly description = 'User-configurable map tile provider (Esri, OSM, Custom URL).';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private origProvider: unknown = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    const viewer = window.geofs?.api?.viewer as { imageryLayers?: { get?: (i: number) => { imageryProvider?: unknown } } } | undefined;
    if (!this.origProvider) {
      this.origProvider = viewer?.imageryLayers?.get?.(0)?.imageryProvider ?? null;
    }
    this.applyProvider(context.getSettings());
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.applyProvider(settings);
  }

  private applyProvider(settings: ExtensionSettings): void {
    const Cesium = window.Cesium;
    const setImagery = window.geofs?.api?.setImageryProvider;
    if (!Cesium || !setImagery) return;

    if (settings.imageryProvider === 'native') {
      if (this.origProvider) {
        try {
          setImagery(this.origProvider, false);
          this.ctx?.anchors.showToast('Imagery restored to GeoFS Native');
          this.ctx?.emitDiag?.('IMAGERY_CHANGED', { provider: 'native' });
        } catch (err) {
          console.warn('[GeoFS Extension] Failed to restore native imagery:', err);
        }
      }
      return;
    }

    if (settings.imageryProvider === 'bing' && settings.customImageryToken && Cesium.BingMapsImageryProvider) {
      try {
        const provider = new Cesium.BingMapsImageryProvider({
          url: 'https://dev.virtualearth.net',
          key: settings.customImageryToken,
          mapStyle: 'Aerial'
        });
        setImagery(provider, false);
        this.ctx?.anchors.showToast('Imagery switched to BING AERIAL');
        this.ctx?.emitDiag?.('IMAGERY_CHANGED', { provider: 'bing' });
      } catch (err) {
        console.warn('[GeoFS Extension] Failed to apply Bing imagery:', err);
      }
      return;
    }

    if (!Cesium.UrlTemplateImageryProvider) return;

    let url = '';
    let credit = 'Custom Imagery';

    if (settings.imageryProvider === 'osm') {
      url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      credit = 'OpenStreetMap contributors';
    } else if (settings.imageryProvider === 'esri' && settings.customImageryToken) {
      url = `https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${encodeURIComponent(settings.customImageryToken)}`;
      credit = 'Powered by Esri';
    } else if (settings.imageryProvider === 'custom' && settings.customImageryUrl) {
      url = settings.customImageryUrl;
    } else {
      return;
    }

    try {
      const provider = new Cesium.UrlTemplateImageryProvider({
        url,
        maximumLevel: 19,
        credit: Cesium.Credit ? new Cesium.Credit(credit, true) : undefined
      });
      setImagery(provider, false);
      this.ctx?.anchors.showToast(`Imagery switched to ${settings.imageryProvider.toUpperCase()}`);
      this.ctx?.emitDiag?.('IMAGERY_CHANGED', { provider: settings.imageryProvider });
    } catch (err) {
      console.warn('[GeoFS Extension] Failed to apply imagery provider:', err);
    }
  }

  public destroy(): void {
    if (this.origProvider) {
      try {
        window.geofs?.api?.setImageryProvider?.(this.origProvider, false);
      } catch {
        // ignore
      }
    }
    this.origProvider = null;
    this.ctx = null;
  }
}
