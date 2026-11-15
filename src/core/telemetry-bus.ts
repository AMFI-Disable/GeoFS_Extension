import type { FlightTelemetry, SimMajorVersion } from '../types/module';
import type { SimAdapter } from './sim-adapter';

export type TelemetryListener = (telemetry: FlightTelemetry) => void;

export class TelemetryBus {
  private listeners = new Set<TelemetryListener>();
  private rafId: number | null = null;
  private lastTickMs = 0;
  private lastSnapshot: FlightTelemetry | null = null;

  constructor(
    private readonly sim: SimAdapter,
    private readonly simMajor: SimMajorVersion
  ) {}

  public start(): void {
    if (this.rafId !== null) return;
    this.lastTickMs = performance.now();
    const loop = (now: number) => {
      const dt = Math.max(0.001, Math.min((now - this.lastTickMs) / 1000, 0.25));
      this.lastTickMs = now;
      const snapshot = this.sim.buildTelemetrySnapshot(dt, this.simMajor);
      this.lastSnapshot = snapshot;
      for (const listener of this.listeners) {
        try {
          listener(snapshot);
        } catch (err) {
          console.error('[GeoFS Extension] Telemetry subscriber error:', err);
        }
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getLatest(): FlightTelemetry | null {
    return this.lastSnapshot;
  }
}
