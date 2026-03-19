// City locations for panchangam calculation
// Each city has coordinates, timezone, and Telugu/English labels

export const LOCATIONS = [
  // India
  { id: 'hyderabad', label: 'హైదరాబాద్', labelEn: 'Hyderabad', lat: 17.385, lng: 78.4867, elev: 500, tz: 'Asia/Kolkata', country: 'IN' },

  // US - Eastern
  { id: 'new-york', label: 'న్యూయార్క్ / న్యూజెర్సీ', labelEn: 'New York / NJ', lat: 40.7128, lng: -74.0060, elev: 10, tz: 'America/New_York', country: 'US' },
  { id: 'washington-dc', label: 'వాషింగ్టన్ DC / వర్జీనియా', labelEn: 'Washington DC / VA', lat: 38.9072, lng: -77.0369, elev: 10, tz: 'America/New_York', country: 'US' },
  { id: 'atlanta', label: 'అట్లాంటా', labelEn: 'Atlanta', lat: 33.7490, lng: -84.3880, elev: 320, tz: 'America/New_York', country: 'US' },
  { id: 'detroit', label: 'డెట్రాయిట్', labelEn: 'Detroit', lat: 42.3314, lng: -83.0458, elev: 190, tz: 'America/Detroit', country: 'US' },
  { id: 'charlotte', label: 'షార్లెట్', labelEn: 'Charlotte', lat: 35.2271, lng: -80.8431, elev: 230, tz: 'America/New_York', country: 'US' },
  { id: 'columbus', label: 'కొలంబస్', labelEn: 'Columbus', lat: 39.9612, lng: -82.9988, elev: 230, tz: 'America/New_York', country: 'US' },

  // US - Central
  { id: 'dallas', label: 'డాలస్', labelEn: 'Dallas', lat: 32.7767, lng: -96.7970, elev: 130, tz: 'America/Chicago', country: 'US' },
  { id: 'houston', label: 'హ్యూస్టన్', labelEn: 'Houston', lat: 29.7604, lng: -95.3698, elev: 15, tz: 'America/Chicago', country: 'US' },
  { id: 'chicago', label: 'చికాగో', labelEn: 'Chicago', lat: 41.8781, lng: -87.6298, elev: 180, tz: 'America/Chicago', country: 'US' },

  // US - Mountain
  { id: 'denver', label: 'డెన్వర్', labelEn: 'Denver', lat: 39.7392, lng: -104.9903, elev: 1600, tz: 'America/Denver', country: 'US' },
  { id: 'phoenix', label: 'ఫీనిక్స్', labelEn: 'Phoenix', lat: 33.4484, lng: -112.0740, elev: 340, tz: 'America/Phoenix', country: 'US' },

  // US - Pacific
  { id: 'bay-area', label: 'బే ఏరియా', labelEn: 'Bay Area / San Jose', lat: 37.3382, lng: -121.8863, elev: 25, tz: 'America/Los_Angeles', country: 'US' },
  { id: 'los-angeles', label: 'లాస్ ఏంజెలిస్', labelEn: 'Los Angeles', lat: 34.0522, lng: -118.2437, elev: 70, tz: 'America/Los_Angeles', country: 'US' },
  { id: 'seattle', label: 'సియాటిల్', labelEn: 'Seattle', lat: 47.6062, lng: -122.3321, elev: 60, tz: 'America/Los_Angeles', country: 'US' },
];

const STORAGE_KEY = 'manacalendar-location';

// Get UTC offset in minutes for a timezone at a given date (handles DST)
export function getTimezoneOffsetMinutes(timeZone, date) {
  const str = date.toLocaleString('en-US', { timeZone, timeZoneName: 'longOffset' });
  const match = str.match(/GMT([+-]\d{1,2}):?(\d{2})?/);
  if (!match) return 0;
  const sign = match[1].startsWith('+') ? 1 : -1;
  const hours = parseInt(match[1].replace(/[+-]/, ''), 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return sign * (hours * 60 + minutes);
}

// Auto-detect the best default city based on browser timezone
export function detectDefaultLocation() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const exact = LOCATIONS.find(l => l.tz === tz);
    if (exact) return exact;

    const tzMap = {
      'America/New_York': 'new-york',
      'America/Chicago': 'dallas',
      'America/Denver': 'denver',
      'America/Los_Angeles': 'bay-area',
      'America/Phoenix': 'phoenix',
      'America/Detroit': 'detroit',
      'Asia/Kolkata': 'hyderabad',
      'Asia/Calcutta': 'hyderabad',
    };
    const id = tzMap[tz];
    if (id) return LOCATIONS.find(l => l.id === id);
  } catch (e) { /* ignore */ }
  return LOCATIONS[0]; // default: Hyderabad
}

// Load saved location from localStorage, or auto-detect
export function getSavedLocation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.id === 'custom') return parsed;
      const found = LOCATIONS.find(l => l.id === parsed.id);
      if (found) return found;
    }
  } catch (e) { /* ignore */ }
  return detectDefaultLocation();
}

// Save location to localStorage
export function saveLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      id: location.id, label: location.label, labelEn: location.labelEn,
      lat: location.lat, lng: location.lng, elev: location.elev,
      tz: location.tz, country: location.country,
    }));
  } catch (e) { /* ignore */ }
}

// Create a custom location from geolocation coordinates
export function createCustomLocation(lat, lng) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    id: 'custom', label: 'నా లొకేషన్', labelEn: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
    lat, lng, elev: 0, tz, country: 'custom',
  };
}
