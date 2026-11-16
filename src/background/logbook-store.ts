import type { LandingRecord } from '../types/settings';

export const LOGBOOK_KEY = 'geofs_ext_logbook';
const MAX_LOGBOOK_RECORDS = 100;

export interface LogbookStorageAdapter {
  get: (key: string) => Promise<LandingRecord[]>;
  set: (key: string, records: LandingRecord[]) => Promise<void>;
}

export class SerializedLogbookStore {
  private queue: Promise<LandingRecord[]> = Promise.resolve([]);

  constructor(private readonly storage: LogbookStorageAdapter) {}

  public append(record: LandingRecord): Promise<LandingRecord[]> {
    const next = this.queue.then(async () => {
      const current = await this.storage.get(LOGBOOK_KEY);
      const deduped = current.filter((item) => item.id !== record.id);
      const updated = [record, ...deduped].slice(0, MAX_LOGBOOK_RECORDS);
      await this.storage.set(LOGBOOK_KEY, updated);
      return updated;
    });
    this.queue = next.catch(() => []);
    return next;
  }
}
