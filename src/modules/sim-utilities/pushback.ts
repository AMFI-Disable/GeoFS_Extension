import type { FlightTelemetry } from '../../types/module';

export type PushbackMode = 'off' | 'straight' | 'left' | 'right';

export class PushbackController {
  private mode: PushbackMode = 'off';
  private lastTickMs = 0;

  public getMode(): PushbackMode {
    return this.mode;
  }

  public setMode(mode: PushbackMode): void {
    this.mode = mode;
    this.lastTickMs = Date.now();
  }

  public stop(): void {
    this.mode = 'off';
  }

  public update(telemetry: FlightTelemetry): boolean {
    if (this.mode === 'off') return false;
    if (!telemetry.groundContact || telemetry.kias > 15 || telemetry.paused || telemetry.crashed) {
      if (!telemetry.groundContact || telemetry.kias > 15) {
        this.mode = 'off';
      }
      return false;
    }

    const now = telemetry.timestamp || Date.now();
    const dt = Math.min(0.2, Math.max(0.01, (now - this.lastTickMs) / 1000));
    this.lastTickMs = now;

    const ac = window.geofs?.aircraft?.instance as
      | {
          llaLocation?: [number, number, number];
          htr?: [number, number, number];
          rigidBody?: {
            setLinearVelocity?: (v: [number, number, number]) => void;
          };
        }
      | undefined;
    if (!ac || !Array.isArray(ac.llaLocation)) return false;

    const hdgDeg = Number.isFinite(telemetry.heading) ? telemetry.heading : 0;
    const turnRateDegPerSec = this.mode === 'left' ? -6 : this.mode === 'right' ? 6 : 0;
    const nextHdg = (hdgDeg + turnRateDegPerSec * dt + 360) % 360;
    if (Array.isArray(ac.htr) && ac.htr.length >= 1) {
      ac.htr[0] = nextHdg;
    }

    // Reverse along aircraft heading at ~4 m/s (~8 kts)
    const revRad = ((nextHdg + 180) * Math.PI) / 180;
    const speedMps = 4.0;
    const dNorthM = Math.cos(revRad) * speedMps * dt;
    const dEastM = Math.sin(revRad) * speedMps * dt;
    const cosLat = Math.max(0.2, Math.cos((ac.llaLocation[0] * Math.PI) / 180));
    ac.llaLocation[0] += dNorthM / 111320;
    ac.llaLocation[1] += dEastM / (111320 * cosLat);
    return true;
  }

  public dispose(): void {
    this.mode = 'off';
  }
}
