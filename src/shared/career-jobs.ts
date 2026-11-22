export interface FlightJob {
  id: string;
  origin: string;
  destination: string;
  distanceNm: number;
  jobType: 'PASSENGER' | 'CARGO' | 'VIP CHARTER';
  payloadKg: number;
  rewardXp: number;
  createdAt: number;
}

export interface CareerProfile {
  xp: number;
  completedCount: number;
  activeJob: FlightJob | null;
}

const CAREER_KEY = 'geofs_ext_career_profile';

const CAREER_AIRPORTS: ReadonlyArray<{ icao: string; lat: number; lon: number }> = [
  { icao: 'KSFO', lat: 37.6213, lon: -122.379 },
  { icao: 'KLAX', lat: 33.9416, lon: -118.4085 },
  { icao: 'KLAS', lat: 36.084, lon: -115.1537 },
  { icao: 'KSEA', lat: 47.4502, lon: -122.3088 },
  { icao: 'KJFK', lat: 40.6413, lon: -73.7781 },
  { icao: 'KBOS', lat: 42.3656, lon: -71.0096 },
  { icao: 'KMIA', lat: 25.7959, lon: -80.287 },
  { icao: 'EGLL', lat: 51.47, lon: -0.4543 },
  { icao: 'LFPG', lat: 49.0097, lon: 2.5479 },
  { icao: 'EDDF', lat: 50.0379, lon: 8.5622 },
  { icao: 'LEMD', lat: 40.4983, lon: -3.5676 },
  { icao: 'OMDB', lat: 25.2532, lon: 55.3657 },
  { icao: 'RJTT', lat: 35.5494, lon: 139.7798 },
  { icao: 'VHHH', lat: 22.308, lon: 113.9185 },
  { icao: 'WSSS', lat: 1.3644, lon: 103.9915 },
  { icao: 'YSSY', lat: -33.9399, lon: 151.1753 }
];

export function getPilotRank(xp: number): string {
  if (xp >= 10000) return 'Chief Pilot';
  if (xp >= 5000) return 'Senior Captain';
  if (xp >= 2000) return 'Captain';
  if (xp >= 600) return 'First Officer';
  return 'Student Pilot';
}

function haversineNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 3440.065 * Math.asin(Math.min(1, Math.sqrt(a))));
}

export function generateRandomJob(): FlightJob {
  const aIdx = Math.floor(Math.random() * CAREER_AIRPORTS.length);
  let bIdx = Math.floor(Math.random() * CAREER_AIRPORTS.length);
  if (bIdx === aIdx) bIdx = (aIdx + 1) % CAREER_AIRPORTS.length;
  const a = CAREER_AIRPORTS[aIdx];
  const b = CAREER_AIRPORTS[bIdx];
  const distanceNm = Math.max(85, haversineNm(a.lat, a.lon, b.lat, b.lon));
  const types: FlightJob['jobType'][] = ['PASSENGER', 'CARGO', 'VIP CHARTER'];
  const jobType = types[Math.floor(Math.random() * types.length)];
  const payloadKg = jobType === 'CARGO' ? 18500 : jobType === 'VIP CHARTER' ? 2400 : 12800;
  const rewardXp = Math.round(150 + Math.min(1200, distanceNm * 0.35));
  return {
    id: `job-${Date.now()}`,
    origin: a.icao,
    destination: b.icao,
    distanceNm,
    jobType,
    payloadKg,
    rewardXp,
    createdAt: Date.now()
  };
}

export async function loadCareerProfile(): Promise<CareerProfile> {
  const fallback: CareerProfile = { xp: 0, completedCount: 0, activeJob: null };
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return fallback;
  return new Promise((resolve) => {
    chrome.storage.local.get([CAREER_KEY], (res) => {
      const saved = res?.[CAREER_KEY] as Partial<CareerProfile> | undefined;
      resolve({
        xp: Number(saved?.xp) || 0,
        completedCount: Number(saved?.completedCount) || 0,
        activeJob: saved?.activeJob ?? null
      });
    });
  });
}

export async function saveCareerProfile(profile: CareerProfile): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  return new Promise((resolve) => {
    chrome.storage.local.set({ [CAREER_KEY]: profile }, () => resolve());
  });
}
