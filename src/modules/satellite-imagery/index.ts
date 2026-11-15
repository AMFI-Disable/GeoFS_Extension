import type { IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings } from '../../types/settings';

export class SatelliteImageryModule implements IModule {
  public readonly id = 'satellite-imagery';
  public readonly name = 'Satellite Imagery';
  public readonly description = 'User-configurable map tile provider (Esri, OSM, Custom URL) and ad cleaner.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = false;

  private ctx: ModuleContext | null = null;
  private cleanTimer: number | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.applyProvider(context.getSettings());
    this.cleanAds();
    this.cleanTimer = window.setInterval(() => this.cleanAds(), 3000);
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    this.applyProvider(settings);
  }

  private applyProvider(settings: ExtensionSettings): void {
    const Cesium = window.Cesium;
    const setImagery = window.geofs?.api?.setImageryProvider;
    if (!Cesium?.UrlTemplateImageryProvider || !setImagery) return;

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
    } catch (err) {
      console.warn('[GeoFS Extension] Failed to apply imagery provider:', err);
    }
  }

  private cleanAds(): void {
    document
      .querySelectorAll('.geofs-adbanner, .geofs-adsense-container, .geofs-ad-container, #geofs-adbanner')
      .forEach((el) => el.remove());
  }

  public destroy(): void {
    if (this.cleanTimer !== null) {
      clearInterval(this.cleanTimer);
      this.cleanTimer = null;
    }
    this.ctx = null;
  }
}
