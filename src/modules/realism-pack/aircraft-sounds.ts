import type { FlightTelemetry } from '../../types/module';
import type { GeoFSAnimationValues, GeoFSAircraftInstance, GeoFSSound } from '../../types/geofs.d';

const SOUND_BASE = 'https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/';
const BOEING_777_IDS = new Set(['240', '25', '4402']);
const AIRBUS_IDS = new Set(['2865', '2870', '2871', '242', '2843', '2899', '24', '2973']);

function engineLayer(id: string, file: string, volumeRamp: number[], pitchRamp: number[], offset: number, ratio: number): GeoFSSound {
  return {
    id,
    file: SOUND_BASE + file,
    effects: {
      volume: { value: 'rpm', ramp: volumeRamp, ratio: 100 },
      pitch: { value: 'rpm', ramp: pitchRamp, offset, ratio }
    }
  };
}

const CALLOUTS = [
  [1000, 900], [500, 400], [400, 300], [300, 200], [200, 100], [100, 50],
  [50, 40], [40, 30], [30, 20], [20, 10], [10, 5]
] as const;

const soundKey = (cue: string) => 'geofs-ext-realism-' + cue;

export function hasAircraftCallouts(): boolean {
  return Boolean(window.audio?.sounds?.[soundKey('50')]);
}

interface AircraftSounds {
  update: (telemetry: FlightTelemetry, values: GeoFSAnimationValues) => void;
  restore: () => void;
}

export function installAircraftSounds(aircraft: GeoFSAircraftInstance): AircraftSounds | undefined {
  const id = String(aircraft.id);
  const is777 = BOEING_777_IDS.has(id);
  if (!is777 && !AIRBUS_IDS.has(id)) return;
  const audio = window.audio;
  const sounds = audio?.sounds;
  const player = audio?.soundplayer;
  const definition = aircraft.definition?.sounds;
  if (!sounds || !player?.stopSound || !definition?.length) return;

  const installed = new Map<string, { original: GeoFSSound | undefined; replacement: GeoFSSound }>();
  const install = (replacement: GeoFSSound) => {
    const original = sounds[replacement.id];
    if (original) player.stopSound?.(original);
    installed.set(replacement.id, { original, replacement });
    sounds[replacement.id] = replacement;
  };
  const files = is777
    ? ['777enginelow.mp3', '777enginemid.mp3', '777enginehigh.mp3', '777enginehigh.mp3']
    : ['neo2.mp3', 'neo2.mp3', 'neo3.mp3'];

  files.forEach((file, index) => {
    const sound = sounds[definition[index]?.id];
    if (!sound?.effects?.volume || !sound.effects.pitch) return;
    const volume = { ...sound.effects.volume, lastValue: null, ratio: 100 };
    const pitch = { ...sound.effects.pitch, lastValue: null };
    if (is777 && index === 0) volume.ramp = [100, 500, 2000, 10000];
    if (!is777) {
      volume.value = 'rpm';
      pitch.value = 'rpm';
    }
    install({ id: sound.id, loop: sound.loop, file: SOUND_BASE + file, effects: { volume, pitch } });
  });

  if (!is777) {
    const startup = sounds[definition[5]?.id];
    if (startup?.id === 'startup') install({ id: startup.id, file: SOUND_BASE + 'startupneo.mp3' });
    install(engineLayer('rpm4', 'neo2.mp3', [800, 950, 2500, 3500], [0, 20000, 20000, 20000], 1, 1));
    install(engineLayer('rpm5', 'neo2.mp3', [1000, 2500, 10000, 10000], [0, 20000, 20000, 20000], 1, 1.5));
    install(engineLayer('rpm6', 'neo3.mp3', [6000, 20000, 20000, 20000], [1000, 20000, 20000, 20000], 1, 1.5));
  }

  const cues = new Map<string, string>([
    ['flaps', '777flap.mp3'], ['gear', 'tlg.mp3'], ['tooLowFlaps', 'tlf.mp3'],
    ['terrain', 'tlt.mp3'], ['pullUp', 'pullup.mp3']
  ]);
  if (is777) cues.set('bank', 'bankangle.mp3');
  else {
    cues.set('retard', 'retard.mp3');
    cues.set('stall', 'https://sage-narwhal-290a3c.netlify.app/airbusstall.mp3');
  }
  for (const [height] of CALLOUTS) {
    const file = is777
      ? height === 500 ? '500correct.mp3' : `${height}gpws_merged.mp3`
      : height === 100 ? '100abtrue.mp3' : `${height}ab.mp3`;
    cues.set(String(height), file);
  }
  for (const [cue, file] of cues) {
    const key = soundKey(cue);
    install({ id: key, file: file.startsWith('https://') ? file : SOUND_BASE + file, effects: { play: { value: key } } });
  }

  const originalValues = new Map<GeoFSAnimationValues, Map<string, unknown>>();
  const update = (telemetry: FlightTelemetry, values: GeoFSAnimationValues) => {
    if (audio.sounds !== sounds) return;
    let saved = originalValues.get(values);
    if (!saved) {
      saved = new Map();
      originalValues.set(values, saved);
    }
    const set = (cue: string, active: boolean) => {
      const key = soundKey(cue);
      if (!saved.has(key)) saved.set(key, values[key]);
      values[key] = Number(active);
    };
    const sink = typeof values.climbrate === 'number' ? values.climbrate : telemetry.vs;
    const airborne = !telemetry.groundContact && !telemetry.crashed;
    const agl = telemetry.aglFeet;
    const extended = values.gearPosition === 0;
    const pullUp = airborne && extended && ((agl <= 5000 && sink <= -2000) || (agl <= 1000 && sink <= -5000));
    const gear = airborne && agl <= 500 && values.gearPosition === 1 && sink < 0 && !pullUp;
    const flaps = airborne && agl <= 1000 && values.flapsPosition === 0 && sink < 0 && !pullUp;
    const approach = airborne && !gear && !flaps && sink <= -1;
    set('flaps', typeof values.flapsPosition === 'number' && typeof values.flapsTarget === 'number' &&
      values.flapsPosition !== values.flapsTarget);
    set('gear', gear);
    set('tooLowFlaps', flaps);
    set('terrain', airborne && extended && agl <= 1000 && sink <= -100 && sink >= -5000 && !approach && !gear && !flaps);
    set('pullUp', pullUp);
    const radioHeight = agl - (is777 ? 16.152139372973117 : 12.232906828403847);
    for (const [height, lowerBound] of CALLOUTS) {
      set(String(height), approach && radioHeight > lowerBound && radioHeight <= height);
    }
    if (is777) set('bank', airborne && Math.abs(telemetry.roll) > 35);
    else {
      set('retard', approach && radioHeight > 5 && radioHeight <= 20 && (telemetry.throttles[0] ?? 0) >= 0.1);
      set('stall', agl > 20 && Boolean(aircraft.stalling));
    }
  };

  const restore = () => {
    for (const [values, saved] of originalValues) {
      for (const [key, original] of saved) {
        if (original === undefined) delete values[key];
        else values[key] = original;
      }
    }
    if (audio.sounds !== sounds) return;
    for (const [key, { original, replacement }] of installed) {
      if (sounds[key] !== replacement) continue;
      player.stopSound?.(replacement);
      if (original) sounds[key] = original;
      else delete sounds[key];
    }
  };
  return { update, restore };
}
