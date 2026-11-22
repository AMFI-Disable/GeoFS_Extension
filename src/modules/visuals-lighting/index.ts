import {
  DEFAULT_LIGHT_SWITCHES,
  computeAircraftLighting,
  getAircraftFrame,
  presetToSwitches,
  type LightPreset,
  type LightSwitches
} from '../realism-pack/lighting/aircraft-lights';
import { LightingShaderController } from '../realism-pack/lighting/light-shader';
import { RunwayGlowController } from '../realism-pack/lighting/runway-glow';
import { TaxiwayLightsController } from '../realism-pack/lighting/taxiway-lights';
import { NightVfrLidarController } from '../realism-pack/lidar/lidar';
import { WindThermalsController } from '../realism-pack/wind-thermals';
import type { GeoFSAircraftInstance } from '../../types/geofs.d';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings, RealismOptions } from '../../types/settings';

function isOptEnabled(options: Partial<RealismOptions> | undefined, key: keyof RealismOptions): boolean {
  if (key === 'taxiwayLights' || key === 'nightVfrLidar' || key === 'windThermals') {
    return options?.[key] ?? false;
  }
  return options?.[key] ?? true;
}

export function detectImmersiveAirports(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as Record<string, unknown>;
  if (w.immersiveAirports || w.ImmersiveAirports || w.IA_CONFIG || (window.geofs as unknown as Record<string, unknown>)?.immersiveAirports) {
    return true;
  }
  if (typeof document !== 'undefined') {
    if (
      document.querySelector(
        '[id*="immersive-airport" i], [id*="immersiveAirport" i], [class*="immersive-airport" i], script[src*="immersive" i][src*="airport" i]'
      )
    ) {
      return true;
    }
  }
  return false;
}

export class VisualsLightingModule implements IModule {
  public readonly id = 'visuals-lighting';
  public readonly name = 'Visuals & Lighting';
  public readonly description = 'Aircraft ground headlights, runway glow, OSM taxiway lights, Night VFR LiDAR & glider thermals.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private optionKey = '';
  private lightShader = new LightingShaderController();
  private runwayGlow = new RunwayGlowController();
  private taxiwayLights = new TaxiwayLightsController();
  private lidar = new NightVfrLidarController();
  private windThermals = new WindThermalsController();
  private lightSwitches: LightSwitches = { ...DEFAULT_LIGHT_SWITCHES };
  private nextTaxiwayUpdate = 0;
  private nextCompatCheck = 0;
  private immersiveAirportsDetected = false;
  private unmountTab: (() => void) | null = null;
  private syncHudTab: (() => void) | null = null;
  private unbindLightsKey: (() => void) | null = null;

  private applyLightPreset(preset: LightPreset): void {
    this.lightSwitches = presetToSwitches(preset);
    this.syncHudTab?.();
    const label = preset === 'coldAndDark' ? 'Cold & Dark' : preset === 'takeoff' ? 'Takeoff' : preset;
    this.ctx?.anchors.showToast(`Lights: ${label}`);
  }

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.onSettingsChange(context.getSettings());
    this.unbindLightsKey =
      context.keybinds?.register?.(
        'visuals-lights-toggle',
        context.getSettings().keybindings?.toggleLandingLights ?? 'Shift+L',
        () => {
          const nextOn = !(this.lightSwitches.landing || this.lightSwitches.taxi);
          this.lightSwitches = {
            ...this.lightSwitches,
            landing: nextOn,
            taxi: nextOn,
            turnoff: nextOn
          };
          this.syncHudTab?.();
          this.ctx?.anchors.showToast(nextOn ? 'Landing & Taxi Lights ON' : 'Landing & Taxi Lights OFF');
        }
      ) ?? null;

    if (typeof document !== 'undefined' && typeof context.anchors?.registerHudTab === 'function') {
      const hudTab = document.createElement('div');
      hudTab.style.cssText = 'display:flex;flex-direction:column;gap:5px;font-size:10px;color:#e5e7eb;';
      const keys: Array<[keyof RealismOptions, string]> = [
        ['aircraftLights', 'Acft Lights'],
        ['runwayGlow', 'RWY Glow'],
        ['taxiwayLights', 'TWY Lights'],
        ['nightVfrLidar', 'LiDAR'],
        ['windThermals', 'Thermals']
      ];
      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;';
      const btns = new Map<keyof RealismOptions, HTMLButtonElement>();
      for (const [key, label] of keys) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.style.cssText =
          'background:rgba(255,255,255,0.06);color:#e5e7eb;border:1px solid rgba(255,255,255,0.16);border-radius:4px;padding:4px 4px;font-size:9px;font-weight:700;cursor:pointer;';
        btn.addEventListener('click', () => {
          const current = context.getSettings().realismOptions ?? {};
          context.updateSettings({ realismOptions: { ...current, [key]: !isOptEnabled(current, key) } });
        });
        btns.set(key, btn);
        grid.appendChild(btn);
      }

      const presetRow = document.createElement('div');
      presetRow.style.cssText = 'display:flex;gap:4px;';
      const makePresetBtn = (label: string, preset: LightPreset) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.style.cssText =
          'flex:1;background:rgba(255,255,255,0.04);color:#cbd5e1;border:1px solid rgba(255,255,255,0.14);border-radius:4px;padding:3px 4px;font-size:8.5px;font-weight:700;cursor:pointer;';
        b.addEventListener('click', () => this.applyLightPreset(preset));
        return b;
      };
      presetRow.append(
        makePresetBtn('Cold & Dark', 'coldAndDark'),
        makePresetBtn('Takeoff', 'takeoff'),
        makePresetBtn('All On', 'allOn')
      );

      const sync = () => {
        const opts = context.getSettings().realismOptions;
        for (const [key, btn] of btns) {
          const active = isOptEnabled(opts, key);
          btn.style.borderColor = active ? 'var(--geofs-ext-accent, #ffc107)' : 'var(--geofs-ext-border, rgba(255,255,255,0.16))';
          btn.style.color = active ? 'var(--geofs-ext-accent, #ffc107)' : 'var(--geofs-ext-muted, #9e9e9e)';
        }
      };
      this.syncHudTab = sync;
      sync();
      hudTab.append(grid, presetRow);
      this.unmountTab = context.anchors.registerHudTab('lights', 'LIGHTS', hudTab, false, { defaultClosed: true });
    }
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    const options = settings.realismOptions;
    this.ctx?.keybinds?.updateCombo?.('visuals-lights-toggle', settings.keybindings?.toggleLandingLights ?? 'Shift+L');
    this.syncHudTab?.();
    const optionKey = JSON.stringify({
      aircraftLights: isOptEnabled(options, 'aircraftLights'),
      runwayGlow: isOptEnabled(options, 'runwayGlow'),
      taxiwayLights: isOptEnabled(options, 'taxiwayLights'),
      nightVfrLidar: isOptEnabled(options, 'nightVfrLidar'),
      windThermals: isOptEnabled(options, 'windThermals'),
      lightIntensity: settings.lightIntensity,
      headlightMode: settings.headlightMode
    });
    if (optionKey === this.optionKey) return;
    this.optionKey = optionKey;

    if (!isOptEnabled(options, 'aircraftLights') && !isOptEnabled(options, 'runwayGlow')) {
      this.lightShader.setEnabled(false);
    }
    if (!isOptEnabled(options, 'runwayGlow')) {
      this.runwayGlow.reset();
    }
    if (!isOptEnabled(options, 'taxiwayLights')) {
      this.taxiwayLights.dispose();
    }
    if (!isOptEnabled(options, 'nightVfrLidar')) {
      this.lidar.dispose();
    }
    if (!isOptEnabled(options, 'windThermals')) {
      this.windThermals.dispose();
    }
  }

  public update(telemetry: FlightTelemetry): void {
    const sim = window.geofs;
    const aircraft: GeoFSAircraftInstance | undefined = sim?.aircraft?.instance;
    if (!aircraft || telemetry.paused || telemetry.crashed) {
      this.lightShader.setEnabled(false);
      return;
    }

    if (telemetry.timestamp >= this.nextCompatCheck) {
      this.nextCompatCheck = telemetry.timestamp + 5000;
      const found = detectImmersiveAirports();
      if (found !== this.immersiveAirportsDetected) {
        this.immersiveAirportsDetected = found;
        if (found) {
          this.runwayGlow.reset();
          this.taxiwayLights.dispose();
          this.ctx?.emitDiag?.('COMPANION_DETECTED', {
            companion: 'Immersive Airports',
            yielded: ['runwayGlow', 'taxiwayLights']
          });
        }
        this.syncHudTab?.();
      }
    }

    const settings = this.ctx?.getSettings();
    const options = settings?.realismOptions;
    const acLightsOn = isOptEnabled(options, 'aircraftLights');
    const rwGlowOn = !this.immersiveAirportsDetected && isOptEnabled(options, 'runwayGlow');
    const twyLightsOn = !this.immersiveAirportsDetected && isOptEnabled(options, 'taxiwayLights');
    const isNight = Boolean(this.ctx?.sim.isNight());

    if (acLightsOn || rwGlowOn) {
      this.lightShader.ensureStage(telemetry.simMajor);
      const viewMatrix = sim?.api?.viewer?.scene?.camera?.viewMatrix;
      const headlightMode = settings?.headlightMode ?? 'auto';
      const gearDown = telemetry.aircraft?.hasGear === false ? true : telemetry.gearDown;
      const acResult = acLightsOn
        ? computeAircraftLighting({
            inst: aircraft,
            viewMatrix,
            switches: this.lightSwitches,
            headlightMode,
            isNight,
            gearDown,
            nowMs: telemetry.timestamp
          })
        : { points: [], spots: [] };

      const frame = rwGlowOn ? getAircraftFrame(aircraft) : null;
      const rwLights = rwGlowOn
        ? this.runwayGlow.update(sim?.fx?.litRunways, frame?.pos ?? null, viewMatrix, telemetry.timestamp)
        : [];

      const intensity = Number.isFinite(settings?.lightIntensity) ? Number(settings?.lightIntensity) : 1.5;
      const dayFactor = headlightMode === 'on' ? 0.55 : 0.08;
      this.lightShader.setData(acResult.points, rwLights, acResult.spots, intensity, dayFactor);
      this.lightShader.setEnabled(acResult.points.length > 0 || rwLights.length > 0 || acResult.spots.length > 0);
    } else {
      this.lightShader.setEnabled(false);
    }

    if (twyLightsOn && telemetry.timestamp >= this.nextTaxiwayUpdate) {
      this.nextTaxiwayUpdate = telemetry.timestamp + 3000;
      void this.taxiwayLights.update(telemetry.lat, telemetry.lon, sim?.runways?.nearRunways);
    }

    this.lidar.update(isOptEnabled(options, 'nightVfrLidar'), isNight, telemetry.lat, telemetry.lon, telemetry.timestamp);
    this.windThermals.update(
      isOptEnabled(options, 'windThermals'),
      telemetry.lat,
      telemetry.lon,
      telemetry.altitude,
      telemetry.timestamp
    );
  }

  public destroy(): void {
    this.unbindLightsKey?.();
    this.unbindLightsKey = null;
    this.unmountTab?.();
    this.unmountTab = null;
    this.syncHudTab = null;
    this.optionKey = '';
    this.lightShader.dispose();
    this.runwayGlow.reset();
    this.taxiwayLights.dispose();
    this.lidar.dispose();
    this.windThermals.dispose();
    this.nextTaxiwayUpdate = 0;
    this.nextCompatCheck = 0;
    this.immersiveAirportsDetected = false;
    this.ctx = null;
  }
}
