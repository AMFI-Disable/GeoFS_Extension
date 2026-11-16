import type { FlightTelemetry } from '../../types/module';
import type { GeoFSAnimationValues, GeoFSAircraftInstance, GeoFSSound } from '../../types/geofs.d';

const SOUND_BASE = 'https://138772948-227015667470610340.preview.editmysite.com/uploads/1/3/8/7/138772948/';
const AP_DISCONNECT_737_URL = 'https://raw.githubusercontent.com/Ariakim-Taiyo/GeoFs-737-Immersion-SFX/main/737_autopilot_disconnect.mp3';

export const BOEING_737_IDS = new Set(['4', '22', '5203']);
export const BOEING_777_IDS = new Set(['240', '25', '4402']);
export const AIRBUS_IDS = new Set(['2865', '2870', '2871', '242', '2843', '2899', '24', '2973']);

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
  const is737 = BOEING_737_IDS.has(id);
  const is777 = BOEING_777_IDS.has(id);
  const isAirbus = AIRBUS_IDS.has(id);
  if (!is737 && !is777 && !isAirbus) return;

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

  const files = is737
    ? ['englowfront.ogg', 'engmidfront.ogg', 'enghighestfront.ogg', '737rolling.mp3']
    : is777
      ? ['777enginelow.mp3', '777enginemid.mp3', '777enginehigh.mp3', '777enginehigh.mp3']
      : ['neo2.mp3', 'neo2.mp3', 'neo3.mp3'];

  files.forEach((file, index) => {
    const sound = sounds[definition[index]?.id];
    if (!sound?.effects?.volume || !sound.effects.pitch) return;
    const volume = { ...sound.effects.volume, lastValue: null, ratio: 100 };
    const pitch = { ...sound.effects.pitch, lastValue: null };
    if (is777 && index === 0) volume.ramp = [100, 500, 2000, 10000];
    if (isAirbus || is737) {
      volume.value = 'rpm';
      pitch.value = 'rpm';
    }
    install({ id: sound.id, loop: sound.loop, file: SOUND_BASE + file, effects: { volume, pitch } });
  });

  if (is777 || isAirbus) {
    const extraIdx = is777 ? 4 : 3;
    const extra = sounds[definition[extraIdx]?.id];
    if (extra?.effects?.volume) {
      install({
        ...extra,
        effects: {
          ...extra.effects,
          volume: { ...extra.effects.volume, lastValue: null, ratio: 100 }
        }
      });
    }
  }

  if (isAirbus) {
    const startup = sounds[definition[5]?.id];
    if (startup?.id === 'startup') install({ id: startup.id, file: SOUND_BASE + 'startupneo.mp3' });
    install(engineLayer('rpm4', 'neo2.mp3', [800, 950, 2500, 3500], [0, 20000, 20000, 20000], 1, 1));
    install(engineLayer('rpm5', 'neo2.mp3', [1000, 2500, 10000, 10000], [0, 20000, 20000, 20000], 1, 1.5));
    install(engineLayer('rpm6', 'neo3.mp3', [6000, 20000, 20000, 20000], [1000, 20000, 20000, 20000], 1, 1.5));
  } else if (is737) {
    install(engineLayer('rpmback', 'enghighback.ogg', [6000, 10000, 20000, 50000], [1000, 20000, 20000, 20000], 1, 1));
    install(engineLayer('rpmback1', 'enghighback.ogg', [100, 500, 2000, 10000], [1000, 20000, 20000, 20000], 1, 1));
    install(engineLayer('rpmin1', 'lowcab.ogg', [800, 950, 2500, 3500], [0, 20000, 20000, 20000], 1, 1));
    install(engineLayer('rpmin2', 'midcab.ogg', [1000, 2500, 10000, 10000], [0, 20000, 20000, 20000], 1, 1));
    install({
      id: 'buzzsaw',
      file: SOUND_BASE + 'buzzsawcab.ogg',
      effects: { volume: { value: 'rpm', ramp: [3000, 10000, 20000, 20000], ratio: 60 } }
    });
  }

  const cues = new Map<string, string>([
    ['flaps', is737 ? '737flaps.mp3' : '777flap.mp3'],
    ['tooLowFlaps', 'tlf.mp3'],
    ['terrain', 'tlt.mp3'],
    ['pullUp', 'pullup.mp3']
  ]);

  if (is777 || isAirbus) {
    cues.set('gear', 'tlg.mp3');
  }
  if (is777) {
    cues.set('bank', 'bankangle.mp3');
  } else if (isAirbus) {
    cues.set('retard', 'retard.mp3');
    cues.set('stall', 'https://sage-narwhal-290a3c.netlify.app/airbusstall.mp3');
    cues.set('ptu', 'ptu.mp3');
    cues.set('tcas', 'traffic.mp3');
    cues.set('tcasClimb', 'climb.mp3');
    cues.set('tcasDescend', 'descend.mp3');
    cues.set('tcasClear', 'clear.mp3');
  } else if (is737) {
    cues.set('reverse', '737reverse.mp3');
    cues.set('overspeed', 'sounds_overspeed.mp3');
    cues.set('touchHard', 'hardtouch1.mp3');
    cues.set('touchSoft', 'softtouch1.mp3');
    cues.set('tcas', 'traffic.mp3');
    cues.set('tcasClimb', 'climb.mp3');
    cues.set('tcasDescend', 'descend.mp3');
    cues.set('tcasClear', 'clear.mp3');
  }

  for (const [height] of CALLOUTS) {
    const file = is777 || is737
      ? height === 500 ? '500correct.mp3' : `${height}gpws_merged.mp3`
      : height === 100 ? '100abtrue.mp3' : `${height}ab.mp3`;
    cues.set(String(height), file);
  }
  for (const [cue, file] of cues) {
    const key = soundKey(cue);
    install({ id: key, file: file.startsWith('https://') ? file : SOUND_BASE + file, effects: { play: { value: key } } });
  }

  let restoreApTurnOff: (() => void) | undefined;
  let apAudio: HTMLAudioElement | undefined;
  if (is737 && window.geofs?.autopilot?.turnOff) {
    const ap = window.geofs.autopilot;
    const origTurnOff = ap.turnOff;
    apAudio = new Audio(AP_DISCONNECT_737_URL);
    apAudio.preload = 'none';
    ap.turnOff = () => {
      origTurnOff?.call(ap);
      if (audio.on !== false && !window.geofs?.isPaused?.()) {
        void apAudio?.play().catch(() => {});
      }
    };
    restoreApTurnOff = () => {
      if (window.geofs?.autopilot) window.geofs.autopilot.turnOff = origTurnOff;
      apAudio?.pause();
      apAudio = undefined;
    };
  }

  const originalValues = new Map<GeoFSAnimationValues, Map<string, unknown>>();
  let lastWindSampleTime = 0;
  let lastWindSpeed: number | null = null;
  let wasGroundContact = true;
  let tcasActive = false;
  let tcasClearUntil = 0;
  let touchdownUntil = 0;
  let lastTouchHard = false;

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
    if (is777 || isAirbus) set('gear', gear);
    set('tooLowFlaps', flaps);
    set('terrain', airborne && extended && agl <= 1000 && sink <= -100 && sink >= -5000 && !approach && !gear && !flaps);
    set('pullUp', pullUp);

    const restingOffset = is777 ? 16.152139372973117 : isAirbus ? 12.232906828403847 : 0;
    const radioHeight = agl - restingOffset;
    for (const [height, lowerBound] of CALLOUTS) {
      set(String(height), approach && radioHeight > lowerBound && radioHeight <= height);
    }

    if (is777) {
      set('bank', airborne && Math.abs(telemetry.roll) > 35);
    }

    if (isAirbus) {
      const rpm = typeof values.rpm === 'number' ? values.rpm : 0;
      set('retard', approach && radioHeight > 5 && radioHeight <= 20 && (telemetry.throttles[0] ?? 0) >= 0.1);
      set('stall', agl > 20 && Boolean(aircraft.stalling));
      set('ptu', rpm > 400 && rpm < 2400);

      if (telemetry.timestamp - lastWindSampleTime >= 1000) {
        const currentWind = window.weather?.currentWindSpeed ?? 0;
        const shear = approach && lastWindSpeed !== null && Math.abs(currentWind - lastWindSpeed) >= 5;
        if (!saved.has('isWindWarn')) saved.set('isWindWarn', values.isWindWarn);
        values.isWindWarn = Number(shear);
        lastWindSpeed = currentWind;
        lastWindSampleTime = telemetry.timestamp;
      }
    }

    if (isAirbus || is737) {
      const users = Object.values(window.multiplayer?.visibleUsers ?? {});
      const altMeters = typeof values.altitudeMeters === 'number' ? values.altitudeMeters : telemetry.altitude * 0.3048;
      let tcasClimb = false;
      let tcasDescend = false;
      for (const user of users) {
        if (typeof user.distance === 'number' && user.distance <= 1000 && user.referencePoint?.lla) {
          const otherAlt = user.referencePoint.lla[2];
          if (otherAlt >= altMeters && otherAlt <= altMeters + 100) tcasDescend = true;
          else if (otherAlt <= altMeters && otherAlt >= altMeters - 100) tcasClimb = true;
        }
      }
      if (tcasClimb || tcasDescend) {
        tcasActive = true;
      } else if (tcasActive) {
        tcasActive = false;
        tcasClearUntil = telemetry.timestamp + 3000;
      }
      set('tcas', tcasClimb || tcasDescend);
      set('tcasClimb', tcasClimb);
      set('tcasDescend', tcasDescend);
      set('tcasClear', telemetry.timestamp < tcasClearUntil);
    }

    if (is737) {
      const rpm = typeof values.rpm === 'number' ? values.rpm : 0;
      set('reverse', Boolean(values.reverser) || rpm < 0);
      set('overspeed', telemetry.kias > 340 || telemetry.mach > 0.82);

      if (!wasGroundContact && telemetry.groundContact) {
        lastTouchHard = Math.abs(sink) > 300;
        touchdownUntil = telemetry.timestamp + 1500;
      }
      wasGroundContact = telemetry.groundContact;
      set('touchHard', telemetry.timestamp < touchdownUntil && lastTouchHard);
      set('touchSoft', telemetry.timestamp < touchdownUntil && !lastTouchHard);
    }
  };

  const restore = () => {
    restoreApTurnOff?.();
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
