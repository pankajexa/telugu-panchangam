// Panchangam calculations powered by @ishubhamx/panchangam-js
// Drik Ganita system, Lahiri ayanamsha — validated against Drik Panchang

import {
  getPanchangam as libGetPanchangam,
  Observer,
  findSankrantisInRange,
} from '@ishubhamx/panchangam-js';
import { TITHIS, TITHIS_EN, NAKSHATRAS, NAKSHATRAS_EN, YOGAMS, YOGAMS_EN, PAKSHAS_EN, TELUGU_DAYS, ENGLISH_DAYS, ENGLISH_MONTHS } from './constants.js';
import { getTimezoneOffsetMinutes } from './locations.js';
import { getFestival as getHardcodedFestival } from './festivals.js';
import {
  isGandamool, getAnandadiYoga, RITU_TELUGU, AYANA_TELUGU,
  DIRECTION_TELUGU, SAMVATSARA_NAMES_TE, RASHIS_TELUGU, RASHIS_EN,
} from './customYogas.js';

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

// Sankranti names for all 12 solar months
const SANKRANTI_NAMES = {
  'Mesha Sankranti': { telugu: 'మేష సంక్రాంతి', english: 'Mesha Sankranti', major: false },
  'Vrishabha Sankranti': { telugu: 'వృషభ సంక్రాంతి', english: 'Vrishabha Sankranti', major: false },
  'Mithuna Sankranti': { telugu: 'మిథున సంక్రాంతి', english: 'Mithuna Sankranti', major: false },
  'Karka Sankranti': { telugu: 'కర్కాటక సంక్రాంతి (దక్షిణాయనం)', english: 'Karka Sankranti (Dakshinayana)', major: true },
  'Simha Sankranti': { telugu: 'సింహ సంక్రాంతి', english: 'Simha Sankranti', major: false },
  'Kanya Sankranti': { telugu: 'కన్యా సంక్రాంతి', english: 'Kanya Sankranti', major: false },
  'Tula Sankranti': { telugu: 'తులా సంక్రాంతి', english: 'Tula Sankranti', major: false },
  'Vrishchika Sankranti': { telugu: 'వృశ్చిక సంక్రాంతి', english: 'Vrishchika Sankranti', major: false },
  'Dhanu Sankranti': { telugu: 'ధనుర్ సంక్రాంతి', english: 'Dhanu Sankranti', major: false },
  'Makar Sankranti': { telugu: 'మకర సంక్రాంతి', english: 'Makara Sankranti', major: true },
  'Kumbha Sankranti': { telugu: 'కుంభ సంక్రాంతి', english: 'Kumbha Sankranti', major: false },
  'Meena Sankranti': { telugu: 'మీన సంక్రాంతి', english: 'Meena Sankranti', major: false },
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
      const exact = new Date(s.exactTime);
      const localDate = new Date(exact.toLocaleString('en-US', { timeZone: location.tz }));
      const sd = formatDateStr(localDate);

      if (s.name === 'Makar Sankranti') {
        dates[sd] = { telugu: 'మకర సంక్రాంతి', english: 'Makara Sankranti', major: true };
        const bhogi = new Date(localDate); bhogi.setDate(bhogi.getDate() - 1);
        dates[formatDateStr(bhogi)] = { telugu: 'భోగి', english: 'Bhogi', major: true };
        const kanuma = new Date(localDate); kanuma.setDate(kanuma.getDate() + 1);
        dates[formatDateStr(kanuma)] = { telugu: 'కనుమ', english: 'Kanuma', major: true };
      } else if (SANKRANTI_NAMES[s.name]) {
        dates[sd] = { ...SANKRANTI_NAMES[s.name] };
      }
    }
  } catch (e) { /* ignore */ }
  _sankrantiCache = { locationId: location.id, dates };
  return dates;
}

// ══════════════════════════════════════════════════════════════
// Vratham / recurring observance resolution
// ══════════════════════════════════════════════════════════════

// Named Ekadashi map — library name → Telugu
const EKADASHI_TELUGU = {
  'Kamada Ekadashi': 'కామద ఏకాదశి',
  'Varuthini Ekadashi': 'వరూధిని ఏకాదశి',
  'Mohini Ekadashi': 'మోహిని ఏకాదశి',
  'Apara Ekadashi': 'అపర ఏకాదశి',
  'Nirjala Ekadashi': 'నిర్జల ఏకాదశి',
  'Yogini Ekadashi': 'యోగిని ఏకాదశి',
  'Devshayani Ekadashi': 'దేవశయని ఏకాదశి',
  'Kamika Ekadashi': 'కామికా ఏకాదశి',
  'Shravana Putrada Ekadashi': 'శ్రావణ పుత్రద ఏకాదశి',
  'Aja Ekadashi': 'అజ ఏకాదశి',
  'Parsva Ekadashi': 'పరివర్తిని ఏకాదశి',
  'Indira Ekadashi': 'ఇందిర ఏకాదశి',
  'Papankusha Ekadashi': 'పాపాంకుశ ఏకాదశి',
  'Rama Ekadashi': 'రామ ఏకాదశి',
  'Devutthana Ekadashi': 'దేవోత్థాన ఏకాదశి',
  'Utpanna Ekadashi': 'ఉత్పన్న ఏకాదశి',
  'Mokshada Ekadashi': 'వైకుంఠ ఏకాదశి',
  'Saphala Ekadashi': 'సఫల ఏకాదశి',
  'Pausha Putrada Ekadashi': 'పౌష్య పుత్రద ఏకాదశి',
  'Shattila Ekadashi': 'షట్తిల ఏకాదశి',
  'Jaya Ekadashi': 'జయ ఏకాదశి',
  'Vijaya Ekadashi': 'విజయ ఏకాదశి',
  'Amalaki Ekadashi': 'ఆమలకి ఏకాదశి',
  'Papmochani Ekadashi': 'పాపమోచని ఏకాదశి',
};

function resolveVrathams(libraryFestivals, tithiIndex, masaIndex, vara) {
  const vrathams = [];

  // 1. Collect library-detected recurring events
  if (libraryFestivals) {
    for (const f of libraryFestivals) {
      // Named Ekadashis
      if (f.name.endsWith('Ekadashi')) {
        const te = EKADASHI_TELUGU[f.name] || f.name;
        vrathams.push({ telugu: te, english: f.name, type: 'ekadashi' });
      }
      // Pradosham
      if (f.name.startsWith('Pradosham')) {
        let te = 'ప్రదోషం';
        let en = 'Pradosham';
        if (vara === 1) { te = 'సోమ ప్రదోషం'; en = 'Soma Pradosham'; }
        else if (vara === 6) { te = 'శని ప్రదోషం'; en = 'Shani Pradosham'; }
        else if (vara === 2) { te = 'భౌమ ప్రదోషం'; en = 'Bhauma Pradosham'; }
        vrathams.push({ telugu: te, english: en, type: 'pradosham' });
      }
      // Sankashti Chaturthi
      if (f.name === 'Sankashti Chaturthi') {
        if (vara === 2) {
          vrathams.push({ telugu: 'అంగారక చతుర్థి', english: 'Angaraki Chaturthi', type: 'chaturthi' });
        } else {
          vrathams.push({ telugu: 'సంకష్టహర చతుర్థి', english: 'Sankashti Chaturthi', type: 'chaturthi' });
        }
      }
      // Vinayaka Chaturthi (monthly Shukla)
      if (f.name === 'Vinayaka Chaturthi' && f.category !== 'major') {
        vrathams.push({ telugu: 'వినాయక చతుర్థి', english: 'Vinayaka Chaturthi', type: 'chaturthi' });
      }
      // Masik Shivaratri
      if (f.name === 'Masik Shivaratri') {
        vrathams.push({ telugu: 'మాస శివరాత్రి', english: 'Masik Shivaratri', type: 'shivaratri' });
      }
      // Purnima (monthly)
      if (f.name === 'Purnima') {
        vrathams.push({ telugu: 'పూర్ణిమ', english: 'Purnima', type: 'purnima' });
      }
      // Amavasya (monthly)
      if (f.name === 'Amavasya') {
        if (vara === 1) {
          vrathams.push({ telugu: 'సోమవతి అమావాస్య', english: 'Somavati Amavasya', type: 'amavasya' });
        } else {
          vrathams.push({ telugu: 'అమావాస్య', english: 'Amavasya', type: 'amavasya' });
        }
      }
    }
  }

  // 2. Custom tithi+masa+vara combinations not detected by library

  // Shukla Shashthi — monthly Skanda Shashthi
  if (tithiIndex === 5) {
    vrathams.push({ telugu: 'స్కంద షష్ఠి', english: 'Skanda Shashthi', type: 'shashthi' });
  }

  // Shravana month special days (masa index 4 = Shravana)
  if (masaIndex === 4) {
    if (vara === 1) vrathams.push({ telugu: 'శ్రావణ సోమవారం', english: 'Shravana Somavaram', type: 'masa-vrata' });
    if (vara === 2) vrathams.push({ telugu: 'మంగళ గౌరీ వ్రతం', english: 'Mangala Gauri Vratham', type: 'masa-vrata' });
    if (vara === 5 && tithiIndex < 15) vrathams.push({ telugu: 'శ్రావణ శుక్రవారం', english: 'Shravana Shukravaram', type: 'masa-vrata' });
  }

  // Kartika month Mondays (masa index 7 = Kartika)
  if (masaIndex === 7 && vara === 1) {
    vrathams.push({ telugu: 'కార్తీక సోమవారం', english: 'Kartika Somavaram', type: 'masa-vrata' });
  }

  return vrathams;
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
// Raw library result cache — used by getDetailedPanchangam()
const _rawCache = new Map();

export function clearCache() {
  _cache.clear();
  _rawCache.clear();
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

  // Store raw result for detailed panchangam access
  const rawKey = `${dateStr}-${location.id}`;
  _rawCache.set(rawKey, { p, tz, obs, tzOffset, utcDate });

  // Telugu name mappings
  const tithiName = TITHIS[p.tithi];
  const tithiNameEn = TITHIS_EN[p.tithi] || p.tithi?.toString();
  const paksha = p.tithi < 15 ? 'శుక్ల' : 'కృష్ణ';
  const pakshaEn = p.tithi < 15 ? PAKSHAS_EN[0] : PAKSHAS_EN[1];
  const nakshatraName = NAKSHATRAS[p.nakshatra];
  const nakshatraNameEn = NAKSHATRAS_EN[p.nakshatra] || p.nakshatra?.toString();
  const yogamName = YOGAMS[p.yoga];
  const yogamNameEn = YOGAMS_EN[p.yoga] || p.yoga?.toString();
  const karanaName = TELUGU_KARANA[p.karana] || p.karana;
  const karanaNameEn = p.karana || '';
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

  // Yogam end (library doesn't provide start time, only end)
  const yogamEnd = formatDT(p.yogaEndTime, refDate, tz);

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

  // Vrathams / recurring observances
  const masaIndex = p.masa?.index ?? -1;
  const vrathams = resolveVrathams(p.festivals, p.tithi, masaIndex, date.getDay());

  // Gulika Kalam
  const gulikaKalam = formatTimeRange(p.gulikaKalam?.start, p.gulikaKalam?.end, tz);

  // Shubha muhurtams for main page display
  const abhijitMuhurta = formatTimeRange(p.abhijitMuhurta?.start, p.abhijitMuhurta?.end, tz);
  const sunrise_dt2 = p.sunrise;
  const nextSunrise2 = sunrise_dt2 ? new Date(sunrise_dt2.getTime() + 24 * 3600 * 1000) : null;
  const amritToday = (p.amritKalam || []).find(v =>
    v.start && sunrise_dt2 && nextSunrise2 && v.start >= sunrise_dt2 && v.start < nextSunrise2
  );
  const amritKalam = amritToday ? formatTimeRange(amritToday.start, amritToday.end, tz) : '--';
  const brahmaMuhurta = formatTimeRange(p.brahmaMuhurta?.start, p.brahmaMuhurta?.end, tz);

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
    pakshaEn,
    tithi: { name: tithiName, nameEn: tithiNameEn, start: tithiStart, end: tithiEnd },
    nakshatra: { name: nakshatraName, nameEn: nakshatraNameEn, start: nakshatraStart, end: nakshatraEnd },
    yogam: { name: yogamName, nameEn: yogamNameEn, end: yogamEnd },
    karanam: { name: karanaName, nameEn: karanaNameEn },
    sunrise,
    sunset,
    rahuKalam,
    yamagandam,
    varjyam,
    durmuhurtham,
    gulikaKalam,
    abhijitMuhurta,
    amritKalam,
    brahmaMuhurta,
    tithiIndex: p.tithi,  // 0-29 numeric index for moon phase computation
    festival,
    vrathams,
    isSunday: date.getDay() === 0,
  };

  _cache.set(cacheKey, result);
  return result;
}

// ══════════════════════════════════════════════════════════════
// Detailed panchangam — extracts additional fields from library
// Only formats fields that are enabled in user preferences
// ══════════════════════════════════════════════════════════════

export function getDetailedPanchangam(date, location, prefs) {
  const dateStr = formatDateStr(date);
  const rawKey = `${dateStr}-${location.id}`;

  // Ensure raw cache is populated
  if (!_rawCache.has(rawKey)) {
    getPanchangamForDate(date, location);
  }
  const cached = _rawCache.get(rawKey);
  if (!cached) return null;

  const { p, tz } = cached;
  const result = {};

  // Helper: format muhurta time range
  const fmtRange = (mt) => {
    if (!mt || !mt.start || !mt.end) return null;
    return formatTimeRange(mt.start, mt.end, tz);
  };

  const fmtTime = (dt) => {
    if (!dt) return null;
    return formatTime24(dt, tz);
  };

  const fmtDT = (dt) => {
    if (!dt) return null;
    const refDate = p.sunrise || date;
    return formatDT(dt, refDate, tz);
  };

  // ── Group 1: Shubha Muhurtham ──
  if (prefs.shubha) {
    const shubha = {};
    if (prefs.shubha_abhijit) {
      shubha.abhijit = fmtRange(p.abhijitMuhurta);
    }
    if (prefs.shubha_amritKalam) {
      const sunrise_dt = p.sunrise;
      const nextSunrise = sunrise_dt ? new Date(sunrise_dt.getTime() + 24 * 3600 * 1000) : null;
      const amritToday = (p.amritKalam || []).find(v =>
        v.start && sunrise_dt && nextSunrise && v.start >= sunrise_dt && v.start < nextSunrise
      );
      shubha.amritKalam = fmtRange(amritToday);
    }
    if (prefs.shubha_brahmaMuhurta) {
      shubha.brahmaMuhurta = fmtRange(p.brahmaMuhurta);
    }
    result.shubha = shubha;
  }

  // ── Group 2: Ashubha Muhurtham ──
  if (prefs.ashubha) {
    const ashubha = {};
    if (prefs.ashubha_yamaganda) {
      ashubha.yamaganda = fmtRange(p.yamagandaKalam);
    }
    if (prefs.ashubha_gulika) {
      ashubha.gulika = fmtRange(p.gulikaKalam);
    }
    result.ashubha = ashubha;
  }

  // ── Group 3: Calendar Systems ──
  if (prefs.calendar) {
    const cal = {};
    if (prefs.cal_vikramSamvat && p.samvat) {
      cal.vikramSamvat = p.samvat.vikram;
    }
    if (prefs.cal_shakaSamvat && p.samvat) {
      cal.shakaSamvat = p.samvat.shaka;
    }
    if (prefs.cal_samvatsaraName && p.samvat) {
      const idx = p.samvat.shaka ? (p.samvat.shaka + 11) % 60 : -1;
      cal.samvatsaraName = {
        telugu: SAMVATSARA_NAMES_TE[idx] || p.samvat.samvatsara,
        english: p.samvat.samvatsara,
      };
    }
    if (prefs.cal_amantaPurnimanta && p.masa) {
      cal.amanta = { telugu: TELUGU_MASA[p.masa.name] || p.masa.name, english: p.masa.name };
      // For purnimanta, we'd need a separate library call — approximate from amanta
      cal.purnimanta = cal.amanta; // Same for most months; differs near full moon
    }
    if (prefs.cal_ritu && p.ritu) {
      cal.ritu = { telugu: RITU_TELUGU[p.ritu] || p.ritu, english: p.ritu };
    }
    if (prefs.cal_ayana && p.ayana) {
      cal.ayana = { telugu: AYANA_TELUGU[p.ayana] || p.ayana, english: p.ayana };
    }
    result.calendar = cal;
  }

  // ── Group 4: Detailed Timings ──
  if (prefs.timings) {
    const dt = {};
    if (prefs.dt_tithiTransitions && p.tithiTransitions?.length) {
      dt.tithiTransitions = p.tithiTransitions.map(t => ({
        telugu: TITHIS[t.index] || t.name,
        english: TITHIS_EN[t.index] || t.name,
        start: fmtDT(t.startTime),
        end: fmtDT(t.endTime),
      }));
    }
    if (prefs.dt_nakshatraTransitions && p.nakshatraTransitions?.length) {
      dt.nakshatraTransitions = p.nakshatraTransitions.map(t => ({
        telugu: NAKSHATRAS[t.index] || t.name,
        english: NAKSHATRAS_EN[t.index] || t.name,
        start: fmtDT(t.startTime),
        end: fmtDT(t.endTime),
      }));
    }
    if (prefs.dt_yogaTransitions && p.yogaTransitions?.length) {
      dt.yogaTransitions = p.yogaTransitions.map(t => ({
        telugu: YOGAMS[t.index] || t.name,
        english: YOGAMS_EN[t.index] || t.name,
        start: fmtDT(t.startTime),
        end: fmtDT(t.endTime),
      }));
    }
    if (prefs.dt_karanaTransitions && p.karanaTransitions?.length) {
      dt.karanaTransitions = p.karanaTransitions.map(t => ({
        telugu: TELUGU_KARANA[t.name] || t.name,
        english: t.name,
        start: fmtDT(t.startTime),
        end: fmtDT(t.endTime),
      }));
    }
    if (prefs.dt_moonrise) {
      dt.moonrise = fmtDT(p.moonrise);
    }
    if (prefs.dt_moonset) {
      dt.moonset = fmtDT(p.moonset);
    }
    result.timings = dt;
  }

  // ── Group 5: Rashi & Graha ──
  if (prefs.rashi) {
    const rg = {};
    if (prefs.rg_sunRashi && p.sunRashi) {
      const idx = p.sunRashi.index ?? p.sunRashi;
      rg.sunRashi = {
        telugu: RASHIS_TELUGU[idx] || '',
        english: RASHIS_EN[idx] || p.sunRashi.name || '',
      };
    }
    if (prefs.rg_moonRashi && p.moonRashi) {
      const idx = p.moonRashi.index ?? p.moonRashi;
      rg.moonRashi = {
        telugu: RASHIS_TELUGU[idx] || '',
        english: RASHIS_EN[idx] || p.moonRashi.name || '',
      };
    }
    if (prefs.rg_moonRashiTransition && p.moonRashiTransitions?.length > 1) {
      rg.moonRashiTransitions = p.moonRashiTransitions.map(t => ({
        telugu: RASHIS_TELUGU[t.rashi] || t.name,
        english: RASHIS_EN[t.rashi] || t.name,
        time: fmtDT(t.startTime),
      }));
    }
    if (prefs.rg_dishaShoola && p.dishaShoola) {
      rg.dishaShoola = {
        telugu: DIRECTION_TELUGU[p.dishaShoola.inauspiciousDirection] || p.dishaShoola.inauspiciousDirection,
        english: p.dishaShoola.inauspiciousDirection,
      };
    }
    result.rashi = rg;
  }

  // ── Group 6: Special Yogas ──
  if (prefs.yogas) {
    const sy = {};
    if (prefs.sy_specialYogas && p.specialYogas?.length) {
      sy.specialYogas = p.specialYogas.map(y => ({
        name: y.name || y,
      }));
    }
    if (prefs.sy_gandamool) {
      sy.gandamool = isGandamool(p.nakshatra);
    }
    if (prefs.sy_anandadiYoga) {
      sy.anandadiYoga = getAnandadiYoga(p.vara, p.nakshatra);
    }
    result.yogas = sy;
  }

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
