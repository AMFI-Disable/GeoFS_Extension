import { CameraResetController } from '../realism-pack/camera-reset';
import { SlewModeController } from '../realism-pack/slew-mode';
import type { FlightTelemetry, IModule, ModuleContext } from '../../types/module';
import type { ExtensionSettings, RealismOptions } from '../../types/settings';

function isSlewEnabled(options: Partial<RealismOptions> | undefined): boolean {
  return options?.slewMode ?? false;
}

function isCameraResetEnabled(options: Partial<RealismOptions> | undefined): boolean {
  return options?.cameraReset ?? true;
}

export class SimUtilitiesModule implements IModule {
  public readonly id = 'sim-utilities';
  public readonly name = 'Sim Utilities';
  public readonly description = 'FSX-style Slew Mode (Shift+Y) and double middle-click camera reset QoL.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private slewMode = new SlewModeController();
  private cameraReset = new CameraResetController(() => {
    this.ctx?.anchors.showToast('Camera Reset');
  });
  private unbindSlewKey: (() => void) | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.cameraReset.attach();
    this.onSettingsChange(context.getSettings());
    this.unbindSlewKey =
      context.keybinds?.register?.(
        'utilities-slew-toggle',
        context.getSettings().keybindings?.toggleSlewMode ?? 'Shift+Y',
        () => {
          const current = context.getSettings().realismOptions ?? {};
          const nextOn = !isSlewEnabled(current);
          context.updateSettings({ realismOptions: { ...current, slewMode: nextOn } });
          this.ctx?.anchors.showToast(nextOn ? 'Slew Mode ON' : 'Slew Mode OFF');
        }
      ) ?? null;
  }

  public onSettingsChange(settings: ExtensionSettings): void {
    const options = settings.realismOptions;
    this.ctx?.keybinds?.updateCombo?.('utilities-slew-toggle', settings.keybindings?.toggleSlewMode ?? 'Shift+Y');
    this.cameraReset.setEnabled(isCameraResetEnabled(options));
    const slewEnabled = isSlewEnabled(options);
    if (slewEnabled && !this.slewMode.isActive()) {
      this.slewMode.activate();
    } else if (!slewEnabled && this.slewMode.isActive()) {
      this.slewMode.deactivate();
    }
  }

  public update(telemetry: FlightTelemetry): void {
    if (telemetry.paused || telemetry.crashed) return;
    if (isSlewEnabled(this.ctx?.getSettings().realismOptions)) {
      this.slewMode.update(telemetry);
    }
  }

  public destroy(): void {
    this.unbindSlewKey?.();
    this.unbindSlewKey = null;
    this.slewMode.dispose();
    this.cameraReset.dispose();
    this.ctx = null;
  }
}
