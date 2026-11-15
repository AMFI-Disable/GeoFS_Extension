export class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public playTone(freqHz: number, durationSec: number, type: OscillatorType = 'sine', gain = 0.08): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqHz, ctx.currentTime);

    vol.gain.setValueAtTime(0.0001, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.015);
    vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

    osc.connect(vol);
    vol.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationSec + 0.02);
  }

  public playChime(): void {
    this.playTone(880, 0.14, 'sine', 0.07);
    setTimeout(() => this.playTone(1174.66, 0.2, 'sine', 0.06), 110);
  }

  public playTouchdown(rating: string): void {
    if (rating === 'Butter' || rating === 'Smooth') {
      this.playTone(587.33, 0.15, 'triangle', 0.07);
      setTimeout(() => this.playTone(880, 0.25, 'sine', 0.06), 90);
    } else if (rating === 'Hard' || rating === 'Crash') {
      this.playTone(180, 0.25, 'sawtooth', 0.09);
      setTimeout(() => this.playTone(130, 0.35, 'sawtooth', 0.08), 120);
    } else {
      this.playChime();
    }
  }

  public playGpwsAlert(): void {
    this.playTone(440, 0.12, 'square', 0.06);
    setTimeout(() => this.playTone(620, 0.14, 'square', 0.06), 130);
  }

  public playGpwsCallout(callout: '50' | '40' | '30' | '20' | '10' | 'RETARD' | 'PULL_UP'): void {
    if (this.muted) return;
    if (callout === 'PULL_UP') {
      this.playGpwsAlert();
    } else if (callout === 'RETARD') {
      this.playTone(523.25, 0.1, 'triangle', 0.06);
      setTimeout(() => this.playTone(392, 0.14, 'triangle', 0.06), 110);
    } else {
      const pitchMap: Record<'50' | '40' | '30' | '20' | '10', number> = {
        '50': 784,
        '40': 740,
        '30': 698,
        '20': 659,
        '10': 587
      };
      this.playTone(pitchMap[callout], 0.09, 'sine', 0.05);
    }
  }

  public destroy(): void {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
