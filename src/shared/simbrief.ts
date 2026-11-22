export interface SimBriefOfp {
  username: string;
  callsign: string;
  aircraftIcao: string;
  origin: string;
  destination: string;
  route: string;
  cruiseAltFt: number;
  blockFuelKg: number;
  fetchedAt: number;
}

const OFP_KEY = 'geofs_ext_simbrief_ofp';

export async function loadCachedSimBriefOfp(): Promise<SimBriefOfp | null> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return null;
  return new Promise((resolve) => {
    chrome.storage.local.get([OFP_KEY], (res) => {
      resolve((res?.[OFP_KEY] as SimBriefOfp | undefined) ?? null);
    });
  });
}

export async function clearCachedSimBriefOfp(): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  return new Promise((resolve) => {
    chrome.storage.local.remove([OFP_KEY], () => resolve());
  });
}

export async function fetchSimBriefOfp(username: string): Promise<SimBriefOfp> {
  const cleanUser = username.trim();
  if (!cleanUser) throw new Error('Enter a SimBrief username or Pilot ID.');
  const url = `https://www.simbrief.com/api/xml.fetcher.php?username=${encodeURIComponent(cleanUser)}&json=1`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`SimBrief HTTP ${resp.status}`);
  }
  const data = (await resp.json()) as {
    fetch?: { status?: string };
    origin?: { icao_code?: string };
    destination?: { icao_code?: string };
    general?: { route?: string; initial_altitude?: string; icao_airline?: string; flight_number?: string };
    atc?: { callsign?: string };
    aircraft?: { icaocode?: string };
    fuel?: { plan_ramp?: string };
  };
  if (data.fetch?.status && data.fetch.status !== 'Success') {
    throw new Error(data.fetch.status);
  }
  const ofp: SimBriefOfp = {
    username: cleanUser,
    callsign: data.atc?.callsign || `${data.general?.icao_airline ?? ''}${data.general?.flight_number ?? ''}` || 'N/A',
    aircraftIcao: data.aircraft?.icaocode || '----',
    origin: data.origin?.icao_code || '----',
    destination: data.destination?.icao_code || '----',
    route: data.general?.route || 'DCT',
    cruiseAltFt: Number(data.general?.initial_altitude) || 0,
    blockFuelKg: Math.round(Number(data.fuel?.plan_ramp) || 0),
    fetchedAt: Date.now()
  };
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    await new Promise<void>((resolve) => {
      chrome.storage.local.set({ [OFP_KEY]: ofp }, () => resolve());
    });
  }
  return ofp;
}
