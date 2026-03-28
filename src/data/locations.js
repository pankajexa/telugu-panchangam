// City locations for panchangam calculation
// Each city has coordinates, timezone, and Telugu/English labels

export const LOCATIONS = [
  // ── India — Telangana & Andhra Pradesh ────────────────
  { id: 'hyderabad', label: 'హైదరాబాద్', labelEn: 'Hyderabad', lat: 17.385, lng: 78.4867, elev: 500, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'vijayawada', label: 'విజయవాడ', labelEn: 'Vijayawada', lat: 16.5062, lng: 80.6480, elev: 12, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'visakhapatnam', label: 'విశాఖపట్నం', labelEn: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, elev: 18, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'tirupati', label: 'తిరుపతి', labelEn: 'Tirupati', lat: 13.6288, lng: 79.4192, elev: 150, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'warangal', label: 'వరంగల్', labelEn: 'Warangal', lat: 17.9784, lng: 79.5941, elev: 300, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'rajahmundry', label: 'రాజమహేంద్రవరం', labelEn: 'Rajahmundry', lat: 17.0005, lng: 81.8040, elev: 14, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'guntur', label: 'గుంటూరు', labelEn: 'Guntur', lat: 16.3067, lng: 80.4365, elev: 30, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'nellore', label: 'నెల్లూరు', labelEn: 'Nellore', lat: 14.4426, lng: 79.9865, elev: 20, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'kakinada', label: 'కాకినాడ', labelEn: 'Kakinada', lat: 16.9891, lng: 82.2475, elev: 5, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'kurnool', label: 'కర్నూలు', labelEn: 'Kurnool', lat: 15.8281, lng: 78.0373, elev: 275, tz: 'Asia/Kolkata', country: 'IN' },

  // ── India — South ─────────────────────────────────────
  { id: 'chennai', label: 'చెన్నై', labelEn: 'Chennai', lat: 13.0827, lng: 80.2707, elev: 6, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'bangalore', label: 'బెంగళూరు', labelEn: 'Bengaluru', lat: 12.9716, lng: 77.5946, elev: 920, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'kochi', label: 'కొచ్చి', labelEn: 'Kochi', lat: 9.9312, lng: 76.2673, elev: 5, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'thiruvananthapuram', label: 'తిరువనంతపురం', labelEn: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, elev: 10, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'coimbatore', label: 'కోయంబత్తూరు', labelEn: 'Coimbatore', lat: 11.0168, lng: 76.9558, elev: 410, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'madurai', label: 'మధురై', labelEn: 'Madurai', lat: 9.9252, lng: 78.1198, elev: 130, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'mangalore', label: 'మంగళూరు', labelEn: 'Mangaluru', lat: 12.9141, lng: 74.8560, elev: 20, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'mysore', label: 'మైసూరు', labelEn: 'Mysuru', lat: 12.2958, lng: 76.6394, elev: 770, tz: 'Asia/Kolkata', country: 'IN' },

  // ── India — North ─────────────────────────────────────
  { id: 'delhi', label: 'ఢిల్లీ / NCR', labelEn: 'Delhi / NCR', lat: 28.6139, lng: 77.2090, elev: 210, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'mumbai', label: 'ముంబై', labelEn: 'Mumbai', lat: 19.0760, lng: 72.8777, elev: 10, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'pune', label: 'పూణే', labelEn: 'Pune', lat: 18.5204, lng: 73.8567, elev: 560, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'ahmedabad', label: 'అహ్మదాబాద్', labelEn: 'Ahmedabad', lat: 23.0225, lng: 72.5714, elev: 50, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'kolkata', label: 'కోల్‌కతా', labelEn: 'Kolkata', lat: 22.5726, lng: 88.3639, elev: 10, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'jaipur', label: 'జైపూర్', labelEn: 'Jaipur', lat: 26.9124, lng: 75.7873, elev: 430, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'varanasi', label: 'వారణాసి', labelEn: 'Varanasi', lat: 25.3176, lng: 82.9739, elev: 80, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'lucknow', label: 'లక్నో', labelEn: 'Lucknow', lat: 26.8467, lng: 80.9462, elev: 120, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'bhopal', label: 'భోపాల్', labelEn: 'Bhopal', lat: 23.2599, lng: 77.4126, elev: 500, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'nagpur', label: 'నాగ్‌పూర్', labelEn: 'Nagpur', lat: 21.1458, lng: 79.0882, elev: 310, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'indore', label: 'ఇండోర్', labelEn: 'Indore', lat: 22.7196, lng: 75.8577, elev: 550, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'patna', label: 'పాట్నా', labelEn: 'Patna', lat: 25.6093, lng: 85.1376, elev: 50, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'chandigarh', label: 'చండీగఢ్', labelEn: 'Chandigarh', lat: 30.7333, lng: 76.7794, elev: 320, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'shimla', label: 'షిమ్లా', labelEn: 'Shimla', lat: 31.1048, lng: 77.1734, elev: 2200, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'guwahati', label: 'గువాహాటి', labelEn: 'Guwahati', lat: 26.1445, lng: 91.7362, elev: 55, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'bhubaneswar', label: 'భువనేశ్వర్', labelEn: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, elev: 45, tz: 'Asia/Kolkata', country: 'IN' },

  // ── India — Other notable ─────────────────────────────
  { id: 'srisailam', label: 'శ్రీశైలం', labelEn: 'Srisailam', lat: 15.8513, lng: 78.8687, elev: 460, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'puri', label: 'పూరి', labelEn: 'Puri (Jagannath)', lat: 19.8135, lng: 85.8312, elev: 5, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'ujjain', label: 'ఉజ్జయిని', labelEn: 'Ujjain', lat: 23.1765, lng: 75.7885, elev: 490, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'haridwar', label: 'హరిద్వార్', labelEn: 'Haridwar', lat: 29.9457, lng: 78.1642, elev: 310, tz: 'Asia/Kolkata', country: 'IN' },
  { id: 'rishikesh', label: 'ఋషికేశ్', labelEn: 'Rishikesh', lat: 30.0869, lng: 78.2676, elev: 370, tz: 'Asia/Kolkata', country: 'IN' },

  // ── UK ────────────────────────────────────────────────
  { id: 'london', label: 'లండన్', labelEn: 'London', lat: 51.5074, lng: -0.1278, elev: 10, tz: 'Europe/London', country: 'UK' },

  // ── Australia ─────────────────────────────────────────
  { id: 'sydney', label: 'సిడ్నీ', labelEn: 'Sydney', lat: -33.8688, lng: 151.2093, elev: 40, tz: 'Australia/Sydney', country: 'AU' },
  { id: 'melbourne', label: 'మెల్బోర్న్', labelEn: 'Melbourne', lat: -37.8136, lng: 144.9631, elev: 30, tz: 'Australia/Melbourne', country: 'AU' },

  // ── Canada ────────────────────────────────────────────
  { id: 'toronto', label: 'టొరంటో', labelEn: 'Toronto', lat: 43.6532, lng: -79.3832, elev: 75, tz: 'America/Toronto', country: 'CA' },
  { id: 'vancouver', label: 'వ్యాంకూవర్', labelEn: 'Vancouver', lat: 49.2827, lng: -123.1207, elev: 70, tz: 'America/Vancouver', country: 'CA' },

  // ── Singapore / UAE ───────────────────────────────────
  { id: 'singapore', label: 'సింగపూర్', labelEn: 'Singapore', lat: 1.3521, lng: 103.8198, elev: 15, tz: 'Asia/Singapore', country: 'SG' },
  { id: 'dubai', label: 'దుబాయ్', labelEn: 'Dubai', lat: 25.2048, lng: 55.2708, elev: 5, tz: 'Asia/Dubai', country: 'AE' },

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
      'America/Toronto': 'toronto',
      'America/Vancouver': 'vancouver',
      'Asia/Kolkata': 'hyderabad',
      'Asia/Calcutta': 'hyderabad',
      'Asia/Singapore': 'singapore',
      'Asia/Dubai': 'dubai',
      'Europe/London': 'london',
      'Australia/Sydney': 'sydney',
      'Australia/Melbourne': 'melbourne',
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
