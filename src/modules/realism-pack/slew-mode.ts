// Clean-room FSX-style Slew Mode controller for GeoFS.
// Behavior inspired by tylerbmusic/GeoFS-Slew-Mode (zero copied code, zero telemetry).

import type { GeoFSAircraftInstance } from '../../types/geofs.d';
import type { FlightTelemetry } from '../../types/module';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const METERS_TO_FEET = 3.280839895;

export class SlewModeController {
  private active = false;
  private lat = 0;
  private lon = 0;
  private altMeters = 0;
  private headingRad = 0;
  private tiltRad = 0;
  private rollRad = 0;
  private savedGravity: [number, number, number] | null = null;
  private heldKeys = new Set<string>();
  private bannerEl: HTMLDivElement | null = null;
  private listenersAttached = false;

  public isActive(): boolean {
    return this.active;
  }

  public toggle(onStatus?: (active: boolean) => void): boolean {
    if (this.active) {
      this.deactivate();
    } else {
      this.activate();
    }
    onStatus?.(this.active);
    return this.active;
  }

  public activate(): boolean {
    const aircraft = window.geofs?.aircraft?.instance;
    const lla = aircraft?.llaLocation;
    if (!aircraft || !lla || lla.length < 3) return false;

    this.lat = Number(lla[0]) || 0;
    this.lon = Number(lla[1]) || 0;
    this.altMeters = Number(lla[2]) || 0;
    const hdgDeg = Number(window.geofs?.animation?.values?.heading360) || 0;
    this.headingRad = hdgDeg * DEG_TO_RAD;
    this.tiltRad = 0;
    this.rollRad = 0;
    const rigid = aircraft.rigidBody as { gravityForce?: unknown } | undefined;
    const gf = rigid?.gravityForce;
    this.savedGravity = Array.isArray(gf) && gf.length >= 3 ? [Number(gf[0]) || 0, Number(gf[1]) || 0, Number(gf[2]) || 0] : null;

    this.active = true;
    this.attachKeyListeners();
    this.ensureBanner();
    this.renderBanner();
    return true;
  }

  public deactivate(): void {
    if (!this.active) return;
    this.active = false;
    this.heldKeys.clear();
    this.detachKeyListeners();
    this.removeBanner();

    const aircraft = window.geofs?.aircraft?.instance;
    const rigid = aircraft?.rigidBody as {
      gravityForce?: [number, number, number];
      applyCentralImpulse?: (v: [number, number, number]) => void;
    } | undefined;

    if (rigid && this.savedGravity) {
      rigid.gravityForce = this.savedGravity;
    }
    this.savedGravity = null;

    // Gentle forward impulse if airborne so aircraft does not stall immediately on slew exit
    if (aircraft && !aircraft.groundContact && rigid?.applyCentralImpulse) {
      const worldFrame = (aircraft.object3d as { getWorldFrame?: () => number[][] } | undefined)?.getWorldFrame?.();
      const forward = worldFrame?.[1];
      const mass = Number(aircraft.definition?.mass) || 10_000;
      const minSpeed = Number(aircraft.definition?.minimumSpeed) || 60;
      if (forward && forward.length >= 3) {
        const impulseScale = (minSpeed / 2.0) * mass;
        rigid.applyCentralImpulse([
          forward[0] * impulseScale,
          forward[1] * impulseScale,
          forward[2] * impulseScale
        ]);
      }
    }
  }

  public update(telemetry: FlightTelemetry): void {
    if (!this.active) return;
    const aircraft = window.geofs?.aircraft?.instance;
    if (!aircraft) {
      this.deactivate();
      return;
    }

    const dt = Number.isFinite(telemetry.dt) && telemetry.dt > 0 ? Math.min(telemetry.dt, 0.2) : 0.016;
    const haglMult = Math.max(1, Math.log10(Math.max(10, Math.abs(telemetry.aglFeet) * 0.25)));
    const latStepDeg = 0.0025 * haglMult * dt;
    const vertStepM = 35 * haglMult * dt;
    const rotStepRad = 45 * DEG_TO_RAD * dt;

    let fwd = 0;
    let strafe = 0;
    let vert = 0;
    if (this.heldKeys.has('KeyI')) fwd += latStepDeg;
    if (this.heldKeys.has('KeyK')) fwd -= latStepDeg;
    if (this.heldKeys.has('KeyL')) strafe += latStepDeg;
    if (this.heldKeys.has('KeyJ')) strafe -= latStepDeg;
    if (this.heldKeys.has('KeyU')) vert += vertStepM;
    if (this.heldKeys.has('Enter') || this.heldKeys.has('KeyN')) vert -= vertStepM;

    if (this.heldKeys.has('Comma')) this.headingRad -= rotStepRad;
    if (this.heldKeys.has('Period')) this.headingRad += rotStepRad;
    if (this.heldKeys.has('ArrowUp')) this.tiltRad += rotStepRad;
    if (this.heldKeys.has('ArrowDown')) this.tiltRad -= rotStepRad;
    if (this.heldKeys.has('ArrowLeft')) this.rollRad += rotStepRad;
    if (this.heldKeys.has('ArrowRight')) this.rollRad -= rotStepRad;

    this.headingRad = ((this.headingRad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    const dLat = Math.cos(this.headingRad) * fwd - Math.sin(this.headingRad) * strafe;
    const dLon = Math.sin(this.headingRad) * fwd + Math.cos(this.headingRad) * strafe;
    this.lat = Math.max(-85, Math.min(85, this.lat + dLat));
    this.lon = ((this.lon + dLon + 540) % 360) - 180;
    if (!(telemetry.groundContact && vert < 0)) {
      this.altMeters = Math.max(-50, this.altMeters + vert);
    }

    this.applyPose(aircraft);
    this.renderBanner();
  }

  private applyPose(aircraft: GeoFSAircraftInstance): void {
    aircraft.llaLocation = [this.lat, this.lon, this.altMeters];
    const obj3d = aircraft.object3d as { setInitialRotation?: (rot: [number, number, number]) => void } | undefined;
    obj3d?.setInitialRotation?.([this.tiltRad, this.rollRad, this.headingRad]);

    const rigid = aircraft.rigidBody as {
      v_linearVelocity?: [number, number, number];
      v_angularVelocity?: [number, number, number];
      v_acceleration?: [number, number, number];
      v_angularAcceleration?: [number, number, number];
      gravityForce?: [number, number, number];
    } | undefined;

    if (rigid) {
      if (Array.isArray(rigid.v_acceleration)) rigid.v_acceleration = [0, 0, 0];
      if (Array.isArray(rigid.v_angularAcceleration)) rigid.v_angularAcceleration = [0, 0, 0];
      if (Array.isArray(rigid.v_linearVelocity)) rigid.v_linearVelocity = [0, 0, 0];
      if (Array.isArray(rigid.v_angularVelocity)) rigid.v_angularVelocity = [0, 0, 0];
      if (Array.isArray(rigid.gravityForce)) rigid.gravityForce = [0, 0, 0];
    }
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.active) return;
    const target = e.target as HTMLElement | null;
    if (target && typeof target.matches === 'function' && target.matches('input, textarea, select, [contenteditable]')) {
      return;
    }
    if (
      ['KeyI', 'KeyJ', 'KeyK', 'KeyL', 'KeyU', 'KeyN', 'Enter', 'Comma', 'Period', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
        e.code
      )
    ) {
      this.heldKeys.add(e.code);
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.heldKeys.delete(e.code);
  };

  private attachKeyListeners(): void {
    if (this.listenersAttached || typeof document === 'undefined') return;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    this.listenersAttached = true;
  }

  private detachKeyListeners(): void {
    if (!this.listenersAttached || typeof document === 'undefined') return;
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    this.listenersAttached = false;
  }

  private ensureBanner(): void {
    if (typeof document === 'undefined' || !document.body) return;
    let el = document.getElementById('geofs-ext-mode-banner') as HTMLDivElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = 'geofs-ext-mode-banner';
      document.body.appendChild(el);
    }
    el.style.cssText =
      'position:fixed;top:8px;left:10px;z-index:2147483640;padding:4px 8px;border-radius:4px;background:rgba(15,23,42,0.84);border:1px solid rgba(239,68,68,0.6);color:#f87171;font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace;pointer-events:none;';
    this.bannerEl = el;
  }

  private renderBanner(): void {
    if (!this.bannerEl) return;
    const altFt = (this.altMeters * METERS_TO_FEET).toFixed(0);
    const hdgDeg = Math.round(this.headingRad * RAD_TO_DEG);
    this.bannerEl.textContent = `SLEW  LAT ${this.lat.toFixed(4)}  LON ${this.lon.toFixed(4)}  ALT ${altFt} FT  HDG ${hdgDeg}°  [I/J/K/L U/N ,/.]`;
  }

  private removeBanner(): void {
    this.bannerEl?.remove();
    this.bannerEl = null;
  }

  public dispose(): void {
    this.deactivate();
  }
}
