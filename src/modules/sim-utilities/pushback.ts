import type { FlightTelemetry } from '../../types/module';

export type PushbackMode = 'off' | 'straight' | 'left' | 'right';

export class PushbackController {
  private mode: PushbackMode = 'off';
  private lastTickMs = 0;
  private lat = 0;
  private lon = 0;
  private altMeters = 0;
  private headingDeg = 0;

  public getMode(): PushbackMode {
    return this.mode;
  }

  public setMode(mode: PushbackMode): void {
    const prev = this.mode;
    this.mode = mode;
    this.lastTickMs = Date.now();
    if (mode !== 'off') {
      const ac = window.geofs?.aircraft?.instance;
      const lla = ac?.llaLocation;
      if (prev === 'off' && Array.isArray(lla) && lla.length >= 2) {
        this.lat = Number(lla[0]) || 0;
        this.lon = Number(lla[1]) || 0;
        this.altMeters = Number(lla[2]) || 0;
        this.headingDeg = Number(window.geofs?.animation?.values?.heading360) || 0;
      }
      this.stepPose(0.05);
    }
  }

  public stop(): void {
    this.mode = 'off';
  }

  public update(telemetry: FlightTelemetry): boolean {
    if (this.mode === 'off') return false;
    if (telemetry.paused || telemetry.crashed) return false;
    const rawGc = Boolean(
      telemetry.groundContact ||
        window.geofs?.aircraft?.instance?.groundContact ||
        window.geofs?.animation?.values?.groundContact
    );
    if ((!rawGc && telemetry.aglFeet > 60) || telemetry.kias > 25) {
      this.mode = 'off';
      return false;
    }

    const now = telemetry.timestamp || Date.now();
    const dt = Math.min(0.2, Math.max(0.01, (now - this.lastTickMs) / 1000));
    this.lastTickMs = now;
    return this.stepPose(dt);
  }

  private stepPose(dt: number): boolean {
    const ac = window.geofs?.aircraft?.instance;
    if (!ac || !Array.isArray(ac.llaLocation)) return false;

    if (!Number.isFinite(this.lat) || (this.lat === 0 && this.lon === 0)) {
      this.lat = Number(ac.llaLocation[0]) || 0;
      this.lon = Number(ac.llaLocation[1]) || 0;
      this.altMeters = Number(ac.llaLocation[2]) || 0;
      this.headingDeg = Number(window.geofs?.animation?.values?.heading360) || 0;
    } else {
      this.altMeters = Number(ac.llaLocation[2]) || this.altMeters;
    }

    const turnRateDegPerSec = this.mode === 'left' ? -6 : this.mode === 'right' ? 6 : 0;
    this.headingDeg = (this.headingDeg + turnRateDegPerSec * dt + 360) % 360;
    const htr = (ac as unknown as { htr?: [number, number, number] }).htr;
    if (Array.isArray(htr) && htr.length >= 1) {
      htr[0] = this.headingDeg;
    }

    // Reverse along aircraft heading at ~4 m/s (~8 kts)
    const revRad = ((this.headingDeg + 180) * Math.PI) / 180;
    const speedMps = 4.0;
    const dNorthM = Math.cos(revRad) * speedMps * dt;
    const dEastM = Math.sin(revRad) * speedMps * dt;
    const cosLat = Math.max(0.2, Math.cos((this.lat * Math.PI) / 180));
    this.lat += dNorthM / 111320;
    this.lon += dEastM / (111320 * cosLat);

    ac.llaLocation[0] = this.lat;
    ac.llaLocation[1] = this.lon;
    ac.llaLocation[2] = this.altMeters;
    const setLoc = (ac as unknown as { setLocation?: (lla: number[]) => void }).setLocation;
    if (typeof setLoc === 'function') {
      try {
        setLoc.call(ac, [this.lat, this.lon, this.altMeters]);
      } catch {
        // ignore if setLocation expects different args
      }
    }
    const rigid = ac.rigidBody as {
      v_linearVelocity?: [number, number, number];
      v_angularVelocity?: [number, number, number];
    } | undefined;
    if (rigid) {
      if (Array.isArray(rigid.v_linearVelocity)) rigid.v_linearVelocity = [0, 0, 0];
      if (Array.isArray(rigid.v_angularVelocity)) rigid.v_angularVelocity = [0, 0, 0];
    }
    return true;
  }

  public dispose(): void {
    this.mode = 'off';
  }
}
