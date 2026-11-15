/**
 * Turns a shared WhatsApp pin (lat/lng) into "City, State" for display.
 *
 * The bot only stores the coordinates of a pin, so without this the Lead Desk card has no place
 * name to show. Uses OpenStreetMap's public Nominatim service:
 *  - results are cached (memory + localStorage, keyed to ~1 km) so each place is looked up once,
 *  - lookups run one at a time, at least 1.1 s apart, to respect Nominatim's 1 request/second rule.
 */
export interface Place {
  city: string;
  state: string;
}

const STORAGE_KEY = 'cp.geocode.v1';
const MIN_GAP_MS = 1100;

const memory = new Map<string, Promise<Place | null>>();
let stored: Record<string, Place> | null = null;
let lastRequestAt = 0;
let queue: Promise<unknown> = Promise.resolve();

const keyFor = (lat: number, lng: number) => `${lat.toFixed(2)},${lng.toFixed(2)}`;

function readStore(): Record<string, Place> {
  if (stored) return stored;
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, Place>;
  } catch {
    stored = {};
  }
  return stored;
}

function writeStore(key: string, place: Place) {
  const all = readStore();
  all[key] = place;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* storage full or blocked: the memory cache still works */
  }
}

/** A place already looked up earlier, or undefined. Lets a card render the name on first paint. */
export function cachedPlace(lat: number, lng: number): Place | undefined {
  return readStore()[keyFor(lat, lng)];
}

async function fetchPlace(lat: number, lng: number): Promise<Place | null> {
  const wait = lastRequestAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();

  const url =
    'https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&addressdetails=1&accept-language=en' +
    `&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return null;
  const body = (await res.json()) as { address?: Record<string, string> };
  const a = body.address;
  if (!a) return null;
  const city = a.city || a.town || a.village || a.municipality || a.county || a.state_district || '';
  const state = a.state || '';
  return city || state ? { city: city || state, state: city ? state : '' } : null;
}

/** Looks up the place for a pin. Resolves to null if the lookup fails (the card then shows "Location pinned"). */
export function reverseGeocode(lat: number, lng: number): Promise<Place | null> {
  const key = keyFor(lat, lng);
  const hit = readStore()[key];
  if (hit) return Promise.resolve(hit);

  let pending = memory.get(key);
  if (!pending) {
    pending = (queue = queue.then(() => fetchPlace(lat, lng)).catch(() => null)) as Promise<Place | null>;
    memory.set(key, pending);
    void pending.then((place) => {
      if (place) writeStore(key, place);
    });
  }
  return pending;
}
