/**
 * Clean-room Generic GPWS & Ground Proximity Callouts
 * Provides altitude callouts and sink-rate / pull-up / bank-angle / gear alerts
 * for all GeoFS aircraft when aircraft-specific callouts are not active.
 */
import type { FlightTelemetry } from '../../types/module';
import { hasAircraftCallouts } from './aircraft-sounds';

const ALT_CALLOUTS = [500, 400, 300, 200, 100, 50, 40, 30, 20, 10] as const;

export interface GpwsAlert {
  kind: 'altitude' | 'warning' | 'vspeed';
  text: string;
  level: 'info' | 'warn';
}

export class GenericGpwsController {
  private prevHagl = Infinity;
  private prevKias = 0;
  private triggeredAlts = new Set<number>();
  private triggeredVSpeeds = new Set<'v1' | 'vr' | 'v2'>();
  private lastWarningMs: Record<string, number> = {};
  private audioCtx: AudioContext | null = null;
  private onAlert?: (alert: GpwsAlert) => void;

  constructor(onAlert?: (alert: GpwsAlert) => void) {
    this.onAlert = onAlert;
  }

  public reset(): void {
    this.prevHagl = Infinity;
    this.prevKias = 0;
    this.triggeredAlts.clear();
    this.triggeredVSpeeds.clear();
    this.lastWarningMs = {};
  }

  public update(telemetry: FlightTelemetry, enabled: boolean): GpwsAlert | null {
    if (!enabled || telemetry.paused || telemetry.crashed) {
      return null;
    }

    const hagl = telemetry.aglFeet;
    const vs = telemetry.vs;
    const kias = telemetry.kias;
    const now = telemetry.timestamp;

    // Takeoff V-Speed callouts (V1, Rotate, V2) apply to all aircraft
    if (Number.isFinite(kias) && Number.isFinite(hagl)) {
      if ((telemetry.groundContact && kias < 30) || hagl > 800) {
        this.triggeredVSpeeds.clear();
      }
      const vSpeeds = telemetry.aircraft?.vSpeeds;
      const accelerating = kias > this.prevKias && telemetry.throttles.some((t) => t > 0.5);
      if (vSpeeds && accelerating && hagl < 200) {
        const checks: Array<['v1' | 'vr' | 'v2', number | undefined, string, string]> = [
          ['v1', vSpeeds.V1, 'V1', 'V1'],
          ['vr', vSpeeds.VR, 'ROTATE', 'Rotate'],
          ['v2', vSpeeds.V2, 'V2', 'V2']
        ];
        for (const [key, target, label, speech] of checks) {
          if (
            typeof target === 'number' &&
            Number.isFinite(target) &&
            !this.triggeredVSpeeds.has(key) &&
            this.prevKias < target &&
            kias >= target
          ) {
            this.triggeredVSpeeds.add(key);
            this.prevKias = kias;
            this.prevHagl = hagl;
            const alert: GpwsAlert = { kind: 'vspeed', text: label, level: 'info' };
            this.speak(speech, false);
            this.onAlert?.(alert);
            return alert;
          }
        }
      }
      this.prevKias = kias;
    }

    if (hasAircraftCallouts()) {
      return null;
    }

    if (!Number.isFinite(hagl) || !Number.isFinite(vs)) return null;

    if (telemetry.groundContact) {
      this.prevHagl = hagl;
      return null;
    }

    // Reset altitude callouts on climbout
    if (hagl > 1200) {
      this.triggeredAlts.clear();
    }

    let emitted: GpwsAlert | null = null;

    // 1. Critical warnings take priority (throttled per warning key)
    if (hagl < 1000 && vs < -3500) {
      if (this.canWarn('pullUp', now, 3000)) {
        emitted = { kind: 'warning', text: 'PULL UP', level: 'warn' };
        this.speak('Pull up', true);
        this.playTone(880, 0.16);
      }
    } else if (hagl < 2500 && vs < -2500) {
      if (this.canWarn('sinkRate', now, 4000)) {
        emitted = { kind: 'warning', text: 'SINK RATE', level: 'warn' };
        this.speak('Sink rate', true);
        this.playTone(660, 0.14);
      }
    } else if (
      telemetry.aircraft?.hasGear !== false &&
      hagl < 500 &&
      !telemetry.gearDown &&
      vs < -300 &&
      this.canWarn('gear', now, 6000)
    ) {
      emitted = { kind: 'warning', text: 'TOO LOW, GEAR', level: 'warn' };
      this.speak('Too low, gear', true);
      this.playTone(540, 0.14);
    } else if (
      ((Math.abs(telemetry.roll) > 38 && hagl < 2500) || Math.abs(telemetry.roll) > 48) &&
      this.canWarn('bank', now, 5000)
    ) {
      emitted = { kind: 'warning', text: 'BANK ANGLE', level: 'warn' };
      this.speak('Bank angle', false);
      this.playTone(580, 0.12);
    }

    // 2. Descent altitude callouts (pick lowest newly crossed altitude and latch higher ones)
    if (!emitted && vs < -100 && Number.isFinite(this.prevHagl)) {
      for (let i = ALT_CALLOUTS.length - 1; i >= 0; i--) {
        const alt = ALT_CALLOUTS[i];
        if (!this.triggeredAlts.has(alt) && this.prevHagl > alt && hagl <= alt) {
          for (let j = 0; j <= i; j++) {
            this.triggeredAlts.add(ALT_CALLOUTS[j]);
          }
          emitted = { kind: 'altitude', text: String(alt), level: 'info' };
          this.speak(String(alt), false);
          break;
        }
      }
    }

    this.prevHagl = hagl;
    if (emitted) this.onAlert?.(emitted);
    return emitted;
  }

  private canWarn(key: string, now: number, cooldownMs: number): boolean {
    const last = this.lastWarningMs[key] ?? -Infinity;
    if (now - last < cooldownMs) return false;
    this.lastWarningMs[key] = now;
    return true;
  }

  private speak(phrase: string, urgent: boolean): void {
    try {
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
      if (urgent) synth.cancel();
      const utter = new SpeechSynthesisUtterance(phrase);
      utter.rate = urgent ? 1.15 : 1.05;
      utter.pitch = urgent ? 1.05 : 0.95;
      utter.volume = 0.8;
      synth.speak(utter);
    } catch {
      // Ignore speech synthesis errors in restricted environments
    }
  }

  private playTone(freqHz: number, durationSec: number): void {
    try {
      const Ctx =
        typeof window !== 'undefined'
          ? (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
          : undefined;
      if (!Ctx) return;
      if (!this.audioCtx) this.audioCtx = new Ctx();
      if (this.audioCtx.state === 'suspended') void this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freqHz;
      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + durationSec);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + durationSec);
    } catch {
      // Ignore audio errors
    }
  }

  public dispose(): void {
    this.reset();
    try {
      typeof window !== 'undefined' && window.speechSynthesis?.cancel();
    } catch {
      // ignore
    }
    if (this.audioCtx) {
      void this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
