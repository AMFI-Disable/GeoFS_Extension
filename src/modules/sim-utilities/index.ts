import { CameraResetController } from '../realism-pack/camera-reset';
import { SlewModeController } from '../realism-pack/slew-mode';
import { PushbackController, type PushbackMode } from './pushback';
import { ShortcutOverlay } from './shortcut-overlay';
import { WalkaroundController } from './walkaround';
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
  public readonly description = 'FSX-style Slew Mode (Shift+Y), Pushback Tug, Pre-Flight Walkaround (Shift+W), Shortcut Overlay (?), and camera reset.';
  public readonly supportedMajors = [3, 4] as const;
  public readonly defaultEnabled = true;

  private ctx: ModuleContext | null = null;
  private slewMode = new SlewModeController();
  private pushback = new PushbackController();
  private walkaround = new WalkaroundController();
  private shortcutOverlay = new ShortcutOverlay(() => this.ctx?.getSettings().keybindings);
  private cameraReset = new CameraResetController(() => {
    this.ctx?.anchors.showToast('Camera Reset');
  });
  private unbindSlewKey: (() => void) | null = null;
  private unbindWalkKey: (() => void) | null = null;
  private pushbackEventHandler: ((e: Event) => void) | null = null;
  private shortcutEventHandler: (() => void) | null = null;
  private walkaroundEventHandler: (() => void) | null = null;

  public init(context: ModuleContext): void {
    this.ctx = context;
    this.cameraReset.attach();
    this.shortcutOverlay.attach();
    this.onSettingsChange(context.getSettings());

    this.pushbackEventHandler = (e: Event) => {
      const mode = ((e as CustomEvent<{ mode?: PushbackMode }>).detail?.mode ?? 'off') as PushbackMode;
      this.pushback.setMode(mode);
      this.ctx?.anchors.showToast(mode === 'off' ? 'Pushback Stopped' : `Pushback: ${mode.toUpperCase()}`);
    };
    this.shortcutEventHandler = () => {
      this.shortcutOverlay.toggle();
    };
    this.walkaroundEventHandler = () => {
      const on = this.walkaround.toggle();
      this.ctx?.anchors.showToast(on ? 'Walkaround ON (WASD)' : 'Walkaround OFF');
    };
    window.addEventListener('geofs-ext:pushback', this.pushbackEventHandler);
    window.addEventListener('geofs-ext:shortcuts', this.shortcutEventHandler);
    window.addEventListener('geofs-ext:walkaround', this.walkaroundEventHandler);

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

    this.unbindWalkKey =
      context.keybinds?.register?.('utilities-walkaround-toggle', 'Shift+W', () => {
        const on = this.walkaround.toggle();
        this.ctx?.anchors.showToast(on ? 'Walkaround ON (WASD)' : 'Walkaround OFF');
      }) ?? null;
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
    this.pushback.update(telemetry);
    this.walkaround.update(telemetry);
  }

  public destroy(): void {
    if (this.pushbackEventHandler) {
      window.removeEventListener('geofs-ext:pushback', this.pushbackEventHandler);
      this.pushbackEventHandler = null;
    }
    if (this.shortcutEventHandler) {
      window.removeEventListener('geofs-ext:shortcuts', this.shortcutEventHandler);
      this.shortcutEventHandler = null;
    }
    if (this.walkaroundEventHandler) {
      window.removeEventListener('geofs-ext:walkaround', this.walkaroundEventHandler);
      this.walkaroundEventHandler = null;
    }
    this.unbindSlewKey?.();
    this.unbindSlewKey = null;
    this.unbindWalkKey?.();
    this.unbindWalkKey = null;
    this.pushback.dispose();
    this.walkaround.dispose();
    this.shortcutOverlay.dispose();
    this.slewMode.dispose();
    this.cameraReset.dispose();
    this.ctx = null;
  }
}
