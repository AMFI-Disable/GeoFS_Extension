import { useEffect, useState } from 'preact/hooks';
import {
  AIRCRAFT_NUMBER_FIELDS,
  AIRCRAFT_OVERRIDE_PREFIX,
  V_SPEEDS,
  parseAircraftOverride
} from '../core/aircraft-profile';
import { AIRCRAFT_CATEGORIES, type AircraftProfile } from '../types/module';
import { notifyGeoFSTabsApplySettings } from './settings-store';

export function AircraftEditor({ profile, onSaved }: { profile: AircraftProfile; onSaved?: () => void }) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(true);
  const key = AIRCRAFT_OVERRIDE_PREFIX + profile.id;

  useEffect(() => {
    let active = true;
    setDraft({});
    setStatus('');
    if (!chrome.storage?.sync) {
      setBusy(false);
      return;
    }
    chrome.storage.sync
      .get(key)
      .then((items) => {
        if (!active) return;
        if (items[key]) {
          const { vSpeeds, ...fields } = parseAircraftOverride(items[key]);
          setDraft(
            Object.fromEntries(
              Object.entries({ ...fields, ...vSpeeds }).map(([field, value]) => [field, String(value)])
            )
          );
        }
      })
      .catch((error: Error) => {
        if (active) setStatus(error.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [key]);

  const edit = (field: string, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setStatus('');
  };

  const save = async (reset = false) => {
    setBusy(true);
    try {
      const numbers = (fields: readonly string[]) =>
        Object.fromEntries(
          fields.filter((field) => draft[field]?.trim()).map((field) => [field, Number(draft[field])])
        );
      if (reset) {
        await chrome.storage?.sync?.remove(key);
        setDraft({});
      } else {
        const override = parseAircraftOverride({
          name: draft.name,
          category: draft.category || undefined,
          ...numbers(AIRCRAFT_NUMBER_FIELDS.map(([field]) => field)),
          vSpeeds: numbers(V_SPEEDS)
        });
        await chrome.storage?.sync?.set({ [key]: override });
      }
      notifyGeoFSTabsApplySettings();
      onSaved?.();
      setStatus(reset ? 'Simulator defaults restored.' : 'Aircraft profile saved.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save the aircraft profile.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <details class="card aircraft-editor">
      <summary>
        Aircraft Profile · {profile.name} ({profile.id})
      </summary>
      <p style="margin:6px 0;color:var(--muted);font-size:11px;">
        Blank fields use simulator defaults. Enter reference speeds in KIAS.
      </p>
      <label class="field-row">
        Aircraft Name
        <input
          type="text"
          maxLength={120}
          value={draft.name ?? ''}
          placeholder={profile.name}
          disabled={busy}
          onInput={(event) => edit('name', event.currentTarget.value)}
        />
      </label>
      <label class="field-row">
        Aircraft Category
        <select
          value={draft.category ?? ''}
          disabled={busy}
          onChange={(event) => edit('category', event.currentTarget.value)}
        >
          <option value="">Default ({profile.category})</option>
          {AIRCRAFT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      {AIRCRAFT_NUMBER_FIELDS.map(([field, label]) => (
        <label class="field-row" key={field}>
          {label}
          <input
            type="number"
            min="0"
            step={field === 'maxFlaps' ? '1' : 'any'}
            value={draft[field] ?? ''}
            placeholder={String(profile[field])}
            disabled={busy}
            onInput={(event) => edit(field, event.currentTarget.value)}
          />
        </label>
      ))}
      {V_SPEEDS.map((speed) => (
        <label class="field-row" key={speed}>
          {speed} (KIAS)
          <input
            type="number"
            min="0"
            step="any"
            value={draft[speed] ?? ''}
            placeholder={String(profile.vSpeeds?.[speed] ?? '—')}
            disabled={busy}
            onInput={(event) => edit(speed, event.currentTarget.value)}
          />
        </label>
      ))}
      <div class="preset-row" style="margin-top:8px">
        <button class="btn-sm btn-accent" disabled={busy} onClick={() => void save()}>
          Save Profile
        </button>
        <button class="btn-sm" disabled={busy} onClick={() => void save(true)}>
          Reset to Defaults
        </button>
      </div>
      {status && (
        <div role="status" style="margin-top:6px;font-size:11px;color:var(--accent)">
          {status}
        </div>
      )}
    </details>
  );
}
