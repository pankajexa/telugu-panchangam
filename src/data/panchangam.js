// Panchangam calculations powered by @ishubhamx/panchangam-js
// Drik Ganita system, Lahiri ayanamsha — validated against Drik Panchang

import {
  getPanchangam as libGetPanchangam,
  Observer,
  findSankrantisInRange,
} from '@ishubhamx/panchangam-js';
import { TITHIS, NAKSHATRAS, YOGAMS, TELUGU_DAYS, ENGLISH_DAYS, ENGLISH_MONTHS } from './constants.js';
import { getTimezoneOffsetMinutes } from './locations.js';
import { getFestival as getHardcodedFestival } from './festivals.js';

// ══════════════════════════════════════════════════════════════
// Telugu name mappings for library output
// ══════════════════════════════════════════════════════════════

const TELUGU_MASA = {
  'Chaitra': 'చైత్రం', 'Vaishakha': 'వైశాఖం', 'Jyeshtha': 'జ్యేష్ఠం',
  'Ashadha': 'ఆషాఢం', 'Shravana': 'శ్రావణం', 'Bhadrapada': 'భాద్రపదం',
  'Ashwina': 'ఆశ్వయుజం', 'Kartika': 'కార్తీకం', 'Margashirsha': 'మార్గశిరం',
  'Pausha': 'పుష్యం', 'Magha': 'మాఘం', 'Phalguna': 'ఫాల్గుణం',
};

const TELUGU_KARANA = {
  'Bava': 'బవ', 'Balava': 'బాలవ', 'Kaulava': 'కౌలవ', 'Taitila': 'తైతిల',
  'Gara': 'గర', 'Vanija': 'వణిజ', 'Vishti': 'విష్టి', 'Shakuni': 'శకుని',
  'Chatushpada': 'చతుష్పాద', 'Naga': 'నాగ', 'Kimstughna': 'కింస్తుఘ్న',
};

// Map library festival names → Telugu festival data
const FESTIVAL_MAP = {
  'Ugadi / Gudi Padwa': { telugu: 'ఉగాది', english: 'Ugadi', description: 'శ్రీ పరాభవ నామ సంవత్సరారంభం', major: true },
  'Rama Navami': { telugu: 'శ్రీ రామ నవమి', english: 'Sri Rama Navami', major: true },
  'Akshaya Tritiya': { telugu: 'అక్షయ తృతీయ', english: 'Akshaya Tritiya', major: true, isMuhurtham: true },
  'Buddha Purnima': { telugu: 'వైశాఖ పూర్ణిమ / బుద్ధ పూర్ణిమ', english: 'Buddha Purnima', major: true },
  'Varalakshmi Vratam': { telugu: 'వరలక్ష్మీ వ్రతం', english: 'Varalakshmi Vratam', major: true },
  'Krishna Janmashtami': { telugu: 'శ్రీ కృష్ణ జన్మాష్టమి', english: 'Krishna Janmashtami', major: true },
  'Ganesh Chaturthi': { telugu: 'వినాయక చవితి', english: 'Vinayaka Chavithi', major: true },
  'Navaratri Ghatasthapana': { telugu: 'దసరా నవరాత్రులు ప్రారంభం', english: 'Dasara Navaratri begins', major: true },
  'Durga Ashtami (Maha Ashtami)': { telugu: 'దుర్గాష్టమి', english: 'Durga Ashtami', major: true },
  'Maha Navami': { telugu: 'మహా నవమి', english: 'Maha Navami', major: true },
  'Vijaya Dashami (Dussehra)': { telugu: 'విజయదశమి', english: 'Vijaya Dashami', major: true },
  'Naraka Chaturdashi (Choti Diwali)': { telugu: 'నరక చతుర్దశి', english: 'Naraka Chaturdashi', major: true },
  'Diwali (Lakshmi Puja)': { telugu: 'దీపావళి', english: 'Deepavali', major: true },
  'Dhanteras (Dhanatrayodashi)': { telugu: 'ధన త్రయోదశి', english: 'Dhanteras', major: true },
  'Govardhan Puja': { telugu: 'గోవర్ధన పూజ', english: 'Govardhan Puja', major: false },
  'Kartik Purnima / Dev Diwali': { telugu: 'కార్తీక పూర్ణిమ', english: 'Kartika Purnima', major: true },
  'Maha Shivaratri': { telugu: 'మహా శివరాత్రి', english: 'Maha Shivaratri', major: true },
  'Ratha Saptami': { telugu: 'రథ సప్తమి', english: 'Ratha Saptami', major: true },
  'Bhogi': { telugu: 'భోగి', english: 'Bhogi', major: true },
  'Holika Dahan': { telugu: 'హోళి', english: 'Holi', major: true },
  'Holi': { telugu: 'హోళి', english: 'Holi', major: true },
};

// Fixed-date festivals (not tithi-dependent, same date everywhere)
const FIXED_FESTIVALS = {
  '08-15': { telugu: 'స్వాతంత్ర్య దినోత్సవం', english: 'Independence Day', major: true },
  '01-26': { telugu: 'గణతంత్ర దినోత్సవం', english: 'Republic Day', major: true },
  '12-25': { telugu: 'క్రిస్మస్', english: 'Christmas', major: false },
  '10-02': { telugu: 'గాంధీ జయంతి', english: 'Gandhi Jayanti', major: false },
};

// Sankranti dates (computed once per location, cached)
let _sankrantiCache = { locationId: null, dates: {} };

function getSankrantiDates(location) {
  if (_sankrantiCache.locationId === location.id) return _sankrantiCache.dates;
  const obs = new Observer(location.lat, location.lng, location.elev || 0);
  const start = new Date(Date.UTC(2026, 2, 1));
  const end = new Date(Date.UTC(2027, 4, 1));
  const tzOffset = getTimezoneOffsetMinutes(location.tz, start);
  const dates = {};
  try {
    const sankrantis = findSankrantisInRange(start, end, obs, tzOffset);
    for (const s of sankrantis) {
      if (s.name === 'Makar Sankranti') {
        // Sankranti spans: Bhogi (day before), Sankranti, Kanuma (day after)
        const exact = new Date(s.exactTime);
        const sankrantiDate = new Date(exact.toLocaleString('en-US', { timeZone: location.tz }));
        const sd = formatDateStr(sankrantiDate);
        dates[sd] = { telugu: 'మకర సంక్రాంతి', english: 'Makara Sankranti', major: true };
        // Bhogi (day before)
        const bhogi = new Date(sankrantiDate);
        bhogi.setDate(bhogi.getDate() - 1);
        dates[formatDateStr(bhogi)] = { telugu: 'భోగి', english: 'Bhogi', major: true };
        // Kanuma (day after)
        const kanuma = new Date(sankrantiDate);
        kanuma.setDate(kanuma.getDate() + 1);
        dates[formatDateStr(kanuma)] = { telugu: 'కనుమ', english: 'Kanuma', major: true };
      }
    }
  } catch (e) { /* ignore */ }
  _sankrantiCache = { locationId: location.id, dates };
  return dates;
}

// ══════════════════════════════════════════════════════════════
// Formatting helpers
// ══════════════════════════════════════════════════════════════

function fmtInTz(date, tz, opts) {
  if (!date) return '';
  return date.toLocaleString('en-US', { timeZone: tz, ...opts });
}

function formatTime24(date, tz) {
  if (!date) return '00:00';
  const parts = date.toLocaleString('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).split(':');
  return `${parts[0].padStart(2, '0')}:${parts[1]}`;
}

function formatDT(dateObj, referenceDate, tz) {
  if (!dateObj) return { time: '--', date: '--', sameDay: true };
  const h = parseInt(fmtInTz(dateObj, tz, { hour: 'numeric', hour12: false }));
  const m = parseInt(fmtInTz(dateObj, tz, { minute: 'numeric' }));
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const timeStr = `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  const monthAbbr = fmtInTz(dateObj, tz, { month: 'short' });
  const dayNum = parseInt(fmtInTz(dateObj, tz, { day: 'numeric' }));
  const dateStr = `${monthAbbr} ${dayNum}`;

  // Same day check
  const refDay = parseInt(fmtInTz(referenceDate, tz, { day: 'numeric' }));
  const refMonth = fmtInTz(referenceDate, tz, { month: 'short' });
  const sameDay = dayNum === refDay && monthAbbr === refMonth;

  return { time: timeStr, date: dateStr, sameDay };
}

function formatTimeRange(start, end, tz) {
  if (!start || !end) return '--';
  const fmt = (d) => {
    const h = parseInt(fmtInTz(d, tz, { hour: 'numeric', hour12: false }));
    const m = parseInt(fmtInTz(d, tz, { minute: 'numeric' }));
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };
  return `${fmt(start)}\u2013${fmt(end)}`;
}

// ══════════════════════════════════════════════════════════════
// Durmuhurtham — computed from sunrise/sunset with correct table
// (Library uses wrong muhurta indices, so we compute our own)
// Standard table per Drik Panchang / TTD / Prokerala:
// ══════════════════════════════════════════════════════════════

// Muhurta indices (1-indexed) that are inauspicious, by weekday (0=Sun)
// Validated against Prokerala Telugu Panchangam for all 7 days
const DUR_MUHURTA_TABLE = [
  [14],     // Sunday
  [9, 12],  // Monday
  [4],      // Tuesday
  [8],      // Wednesday
  [6, 12],  // Thursday
  [4, 9],   // Friday
  [3],      // Saturday
];

function computeDurmuhurtham(sunrise, sunset, dayOfWeek, tz) {
  if (!sunrise || !sunset) return ['--'];
  const dayMs = sunset.getTime() - sunrise.getTime();
  const muhurtaMs = dayMs / 15;
  const indices = DUR_MUHURTA_TABLE[dayOfWeek] || [];
  return indices.map(idx => {
    const start = new Date(sunrise.getTime() + (idx - 1) * muhurtaMs);
    const end = new Date(sunrise.getTime() + idx * muhurtaMs);
    return formatTimeRange(start, end, tz);
  });
}

// ══════════════════════════════════════════════════════════════
// Festival resolution for a date
// ══════════════════════════════════════════════════════════════

function resolveFestival(libraryFestivals, date, location) {
  // 1. Check library festivals (location-aware, tithi-based)
  if (libraryFestivals && libraryFestivals.length > 0) {
    // Prefer major festivals, find the best match
    const sorted = [...libraryFestivals].sort((a, b) =>
      (b.category === 'major' ? 1 : 0) - (a.category === 'major' ? 1 : 0)
    );
    for (const f of sorted) {
      // Skip standalone Amavasya/Purnima (shown via tithi display)
      if (f.name === 'Amavasya' || f.name === 'Purnima') continue;
      if (f.name.endsWith('Purnima') && !FESTIVAL_MAP[f.name]) continue;
      // Skip generic Navratri day labels
      if (/^Chaitra Navratri Day \d/.test(f.name)) continue;
      if (/^Ganesh Chaturthi \(Day \d/.test(f.name)) continue;
      if (/^Ganesh Panchami/.test(f.name)) continue;
      if (/Day \d\)$/.test(f.name) && !FESTIVAL_MAP[f.name]) continue;

      const mapped = FESTIVAL_MAP[f.name];
      if (mapped) return { ...mapped };

      // Unmapped but major library festival — show with English name
      if (f.category === 'major') {
        return { telugu: f.name, english: f.name, major: true };
      }
    }
  }

  const dateStr = formatDateStr(date);

  // 2. Check Sankranti dates (solar, computed per location)
  const sankrantiDates = getSankrantiDates(location);
  if (sankrantiDates[dateStr]) return { ...sankrantiDates[dateStr] };

  // 3. Check fixed-date festivals
  const mmdd = dateStr.slice(5); // "MM-DD"
  if (FIXED_FESTIVALS[mmdd]) return { ...FIXED_FESTIVALS[mmdd] };

  // 4. Fallback to hardcoded list (for regional/Telugu-specific festivals)
  const hardcoded = getHardcodedFestival(dateStr);
  if (hardcoded) return hardcoded;

  return null;
}

// ══════════════════════════════════════════════════════════════
// Main panchangam computation — replaces linear approximation
// with astronomical library (Drik Ganita, Lahiri ayanamsha)
// ══════════════════════════════════════════════════════════════

// Cache for computed panchangam data (keyed by date+location)
const _cache = new Map();

export function clearCache() {
  _cache.clear();
  _sankrantiCache = { locationId: null, dates: {} };
}

export function getPanchangamForDate(date, location) {
  const dateStr = formatDateStr(date);
  const cacheKey = `${dateStr}-${location.id}-${location.lat.toFixed(4)}`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  const obs = new Observer(location.lat, location.lng, location.elev || 0);
  const tz = location.tz;
  const tzOffset = getTimezoneOffsetMinutes(tz, date);

  // Create UTC date representing ~6AM local time for this date
  const utcHour = 6 - (tzOffset / 60);
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(utcHour), (utcHour % 1) * 60, 0));

  const p = libGetPanchangam(utcDate, obs, { timezoneOffset: tzOffset, calendarType: 'amanta' });

  // Telugu name mappings
  const tithiName = TITHIS[p.tithi];
  const paksha = p.tithi < 15 ? 'శుక్ల' : 'కృష్ణ';
  const nakshatraName = NAKSHATRAS[p.nakshatra];
  const yogamName = YOGAMS[p.yoga];
  const karanaName = TELUGU_KARANA[p.karana] || p.karana;
  const masaTelugu = TELUGU_MASA[p.masa?.name] || p.masa?.name || '';
  const masaEnglish = p.masa?.name || '';

  // Handle Adhika masa
  const masaPrefix = p.masa?.isAdhika ? 'అధిక ' : '';

  // Sunrise/sunset as HH:MM strings
  const sunrise = formatTime24(p.sunrise, tz);
  const sunset = formatTime24(p.sunset, tz);

  // Reference date for same-day checks (sunrise in local tz)
  const refDate = p.sunrise || utcDate;

  // Tithi start/end
  const tithiStart = formatDT(p.tithiStartTime, refDate, tz);
  const tithiEnd = formatDT(p.tithiEndTime, refDate, tz);

  // Nakshatra start/end
  const nakshatraStart = formatDT(p.nakshatraStartTime, refDate, tz);
  const nakshatraEnd = formatDT(p.nakshatraEndTime, refDate, tz);

  // Yogam end
  const yogamEnd = formatTime24(p.yogaEndTime, tz);

  // Inauspicious timings
  const rahuKalam = formatTimeRange(p.rahuKalamStart, p.rahuKalamEnd, tz);
  const yamagandam = formatTimeRange(p.yamagandaKalam?.start, p.yamagandaKalam?.end, tz);

  // Varjyam: library returns entries spanning 3 days — filter to current day only
  // "Current day" = between this sunrise and next sunrise
  const sunrise_dt = p.sunrise;
  const nextSunrise = sunrise_dt ? new Date(sunrise_dt.getTime() + 24 * 3600 * 1000) : null;
  const varjyamToday = (p.varjyam || []).find(v =>
    v.start && sunrise_dt && nextSunrise && v.start >= sunrise_dt && v.start < nextSunrise
  );
  const varjyam = varjyamToday ? formatTimeRange(varjyamToday.start, varjyamToday.end, tz) : '--';

  // Durmuhurtham: compute ourselves (library has wrong muhurta table)
  const durmuhurtham = computeDurmuhurtham(p.sunrise, p.sunset, date.getDay(), tz);

  // Festival
  const festival = resolveFestival(p.festivals, date, location);

  const result = {
    date: dateStr,
    dayOfWeek: date.getDay(),
    vaaram: TELUGU_DAYS[date.getDay()],
    englishDay: ENGLISH_DAYS[date.getDay()],
    dateNum: date.getDate(),
    englishMonth: ENGLISH_MONTHS[date.getMonth()],
    year: date.getFullYear(),
    masam: { telugu: masaPrefix + masaTelugu, english: masaEnglish },
    paksha,
    tithi: { name: tithiName, start: tithiStart, end: tithiEnd },
    nakshatra: { name: nakshatraName, start: nakshatraStart, end: nakshatraEnd },
    yogam: { name: yogamName, end: yogamEnd },
    karanam: { name: karanaName },
    sunrise,
    sunset,
    rahuKalam,
    yamagandam,
    varjyam,
    durmuhurtham,
    festival,
    isSunday: date.getDay() === 0,
  };

  _cache.set(cacheKey, result);
  return result;
}

export function formatDateStr(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Generate all dates from Ugadi 2026 to Ugadi 2027
export function generateAllDates() {
  const start = new Date(2026, 2, 19);
  const end = new Date(2027, 3, 7);
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Get the day index for today (or closest date in range)
export function getTodayIndex() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(2026, 2, 19);
  start.setHours(0, 0, 0, 0);
  const end = new Date(2027, 3, 7);
  end.setHours(0, 0, 0, 0);
  if (today < start) return 0;
  if (today > end) return 0;
  return Math.floor((today - start) / 86400000);
}
