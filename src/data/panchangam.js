// Tier 3: Algorithmic approximation for panchangam data
// Seeded from known reference points for Parabhava Nama Samvatsaram
// This provides approximate data for all 384 days

import { TITHIS, NAKSHATRAS, YOGAMS, KARANAMS, TELUGU_DAYS, ENGLISH_DAYS, ENGLISH_MONTHS } from './constants.js';
import { getTeluguMonth } from './teluguMonths.js';
import { getFestival } from './festivals.js';

// ══════════════════════════════════════════════════════════════
// REFERENCE DATA — sourced from drikpanchang.com / prokerala.com
// for Ugadi 2026, March 19, Hyderabad (17.385°N, 78.4867°E)
//
// Uttara Bhadrapada nakshatra:  05:21 AM Mar 19 → 04:04 AM Mar 20
// Shukla Pratipada tithi:       06:52 AM Mar 19 → 04:52 AM Mar 20
// Sunrise: 06:21 AM, Sunset: 06:27 PM
// ══════════════════════════════════════════════════════════════

const REFERENCE_DATE = new Date(2026, 2, 19); // Mar 19, 2026 midnight

// Nakshatra: Uttara Bhadrapada (index 25)
// Started at 05:21 AM on Mar 19 = 5.35 hours after midnight
// Ends at 04:04 AM on Mar 20 = 28.067 hours after midnight of Mar 19
// Duration: 28.067 - 5.35 = 22.717 hours (this instance)
const REFERENCE_NAKSHATRA_INDEX = 25;
const NAKSHATRA_REF_START_OFFSET = 5 + 21 / 60; // 5.35 hours after midnight Mar 19

// Tithi: Shukla Pratipada (index 0)
// Started at 06:52 AM on Mar 19 = 6.867 hours after midnight
// Ends at 04:52 AM on Mar 20 = 28.867 hours after midnight of Mar 19
const REFERENCE_TITHI_INDEX = 0;
const TITHI_REF_START_OFFSET = 6 + 52 / 60; // 6.867 hours after midnight Mar 19

const REFERENCE_YOGAM_INDEX = 22; // Shubha
const REFERENCE_KARANAM_INDEX = 0; // Bava

// Approximate cycle lengths
const TITHI_CYCLE = 29.53;  // Synodic month in days (30 tithis per cycle)
const NAKSHATRA_CYCLE = 27.32; // Sidereal month in days (27 nakshatras)
const YOGAM_CYCLE = 27.32;
const KARANAM_HALF_TITHI = TITHI_CYCLE / 30 / 2;

// Accurate sunrise/sunset for Hyderabad using NOAA solar equations
// Location: 17.385°N, 78.4867°E — IST (UTC+5:30)
const LAT = 17.385;
const LNG = 78.4867;
const TZ_OFFSET = 5.5; // IST

function getSunTimes(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian day number
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
              Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn - 0.5; // Julian date at midnight UT
  const n = jd - 2451545.0; // days since J2000.0

  // Solar mean anomaly (degrees)
  const M = (357.5291 + 0.98560028 * n) % 360;
  const Mrad = M * Math.PI / 180;

  // Equation of center
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);

  // Ecliptic longitude
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = lambda * Math.PI / 180;

  // Solar declination
  const sinDec = Math.sin(lambdaRad) * Math.sin(23.4393 * Math.PI / 180);
  const decRad = Math.asin(sinDec);

  // Equation of time (minutes) — approximate
  const B = (360 / 365) * (n - 81) * Math.PI / 180;
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // Solar noon in local time (hours)
  const solarNoon = 12 - (LNG / 15 - TZ_OFFSET) - EoT / 60;

  // Hour angle for sunrise/sunset
  const latRad = LAT * Math.PI / 180;
  // Standard refraction correction: -0.833 degrees
  const cosHA = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(latRad) * sinDec) /
                (Math.cos(latRad) * Math.cos(decRad));

  // Clamp for polar edge cases (shouldn't happen at 17°N)
  const clampedCosHA = Math.max(-1, Math.min(1, cosHA));
  const HA = Math.acos(clampedCosHA) * 180 / Math.PI; // degrees
  const HAhours = HA / 15; // convert to hours

  const sunrise = solarNoon - HAhours;
  const sunset = solarNoon + HAhours;

  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
  };
}

function formatTime(decimalHours) {
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function formatTime12(decimalHours) {
  const h24 = Math.floor(((decimalHours % 24) + 24) % 24);
  const m = Math.round((decimalHours - Math.floor(decimalHours)) * 60) % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatTimeRange(startDecimal, durationHours) {
  const endDecimal = startDecimal + durationHours;
  return `${formatTime12(startDecimal)}–${formatTime12(endDecimal)}`;
}

// Format a Date object to { time: "11:45 PM", date: "Mar 18", day: 18, month: 2, sameDay: bool }
function formatDT(dt, referenceDate) {
  const h = dt.getHours();
  const m = dt.getMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const timeStr = `${h12}:${m.toString().padStart(2, '0')} ${period}`;

  const monthAbbr = ENGLISH_MONTHS[dt.getMonth()].slice(0, 3);
  const dayNum = dt.getDate();
  const dateStr = `${monthAbbr} ${dayNum}`;

  // Check if same calendar day as the reference
  const sameDay = dt.getFullYear() === referenceDate.getFullYear() &&
                  dt.getMonth() === referenceDate.getMonth() &&
                  dt.getDate() === referenceDate.getDate();

  return { time: timeStr, date: dateStr, sameDay };
}

// Rahu Kalam periods by day of week (Sunday=0)
// Traditional Rahu Kalam slots: each 1.5 hours starting from sunrise
const RAHU_KALAM_SLOTS = [8, 2, 7, 5, 6, 4, 3]; // slot index for each day
const YAMAGANDAM_SLOTS = [5, 4, 3, 7, 2, 6, 8];
const GULIKA_SLOTS = [7, 6, 5, 4, 3, 2, 8];

function getInauspiciousTimes(date, sunrise) {
  const day = date.getDay();
  const sunriseDecimal = parseFloat(sunrise.split(':')[0]) + parseFloat(sunrise.split(':')[1]) / 60;
  const slotDuration = 1.5;

  const rahuStart = sunriseDecimal + (RAHU_KALAM_SLOTS[day] - 1) * slotDuration;
  const yamaStart = sunriseDecimal + (YAMAGANDAM_SLOTS[day] - 1) * slotDuration;
  const gulikaStart = sunriseDecimal + (GULIKA_SLOTS[day] - 1) * slotDuration;

  // Approximate varjyam and durmuhurtham based on nakshatra
  const daysSinceRef = Math.floor((date - REFERENCE_DATE) / 86400000);
  const varjyamBase = 8 + (daysSinceRef * 0.7) % 12;
  const durmuhurthamBase = 10 + (daysSinceRef * 0.3) % 8;

  return {
    rahuKalam: formatTimeRange(rahuStart, slotDuration),
    yamagandam: formatTimeRange(yamaStart, slotDuration),
    gulika: formatTimeRange(gulikaStart, slotDuration),
    varjyam: formatTimeRange(varjyamBase % 24, 1.5),
    durmuhurtham: formatTimeRange(durmuhurthamBase % 24, 0.8),
  };
}

function daysBetween(date1, date2) {
  return (date2 - date1) / 86400000;
}

export function getPanchangamForDate(date) {
  const days = daysBetween(REFERENCE_DATE, date);

  // Compute sunrise first — panchangam elements are evaluated at sunrise, not midnight
  const sunTimes = getSunTimes(date);
  const sunriseDecimal = parseFloat(sunTimes.sunrise.split(':')[0]) +
                         parseFloat(sunTimes.sunrise.split(':')[1]) / 60;

  // Hours from midnight of the REFERENCE date to SUNRISE of the current date
  const hoursFromRef = days * 24 + sunriseDecimal;

  // ─── Tithi calculation ───
  const tithiDurationHours = (TITHI_CYCLE / 30) * 24; // ~23.62 hours per tithi
  const hoursSinceTithiRefStart = hoursFromRef - TITHI_REF_START_OFFSET;
  const tithisSinceRef = hoursSinceTithiRefStart / tithiDurationHours;
  const tithiIndex = Math.floor(((REFERENCE_TITHI_INDEX + tithisSinceRef) % 30 + 30) % 30);
  const paksha = tithiIndex < 15 ? 'శుక్ల' : 'కృష్ణ';
  const tithiName = TITHIS[tithiIndex];

  // Tithi fraction: how far through the current tithi at sunrise of this date
  const tithiFraction = (((REFERENCE_TITHI_INDEX + tithisSinceRef) % 1) + 1) % 1;
  const tithiElapsed = tithiFraction * tithiDurationHours;
  const tithiRemaining = (1 - tithiFraction) * tithiDurationHours;

  // Build actual Date objects for tithi start/end (same approach as nakshatra)
  const tithiStartDT = new Date(date);
  tithiStartDT.setHours(0, 0, 0, 0);
  tithiStartDT.setMinutes(Math.round(sunriseDecimal * 60) + Math.round(-tithiElapsed * 60));

  const tithiEndDT = new Date(date);
  tithiEndDT.setHours(0, 0, 0, 0);
  tithiEndDT.setMinutes(Math.round(sunriseDecimal * 60) + Math.round(tithiRemaining * 60));

  // ─── Nakshatra calculation ───
  const nakshatraDurationHours = (NAKSHATRA_CYCLE / 27) * 24; // ~24.28 hours
  const hoursSinceNakRefStart = hoursFromRef - NAKSHATRA_REF_START_OFFSET;
  const nakshatrasSinceRef = hoursSinceNakRefStart / nakshatraDurationHours;
  const nakshatraIndex = Math.floor(((REFERENCE_NAKSHATRA_INDEX + nakshatrasSinceRef) % 27 + 27) % 27);

  // Fraction through the current nakshatra at midnight of this date
  const nakshatraFraction = (((REFERENCE_NAKSHATRA_INDEX + nakshatrasSinceRef) % 1) + 1) % 1;

  // Elapsed and remaining hours measured from SUNRISE of this date
  const nakshatraElapsed = nakshatraFraction * nakshatraDurationHours;
  const nakshatraRemaining = (1 - nakshatraFraction) * nakshatraDurationHours;

  // Build actual Date objects: base = sunrise of this date
  const sunriseMinutes = Math.round(sunriseDecimal * 60);
  const nakshatraStartDT = new Date(date);
  nakshatraStartDT.setHours(0, 0, 0, 0);
  nakshatraStartDT.setMinutes(sunriseMinutes + Math.round(-nakshatraElapsed * 60));

  const nakshatraEndDT = new Date(date);
  nakshatraEndDT.setHours(0, 0, 0, 0);
  nakshatraEndDT.setMinutes(sunriseMinutes + Math.round(nakshatraRemaining * 60));

  // ─── Yogam calculation ───
  const yogamDurationHours = (YOGAM_CYCLE / 27) * 24;
  const hoursSinceYogamRef = hoursFromRef - NAKSHATRA_REF_START_OFFSET;
  const yogamsSinceRef = hoursSinceYogamRef / yogamDurationHours;
  const yogamIndex = Math.floor(((REFERENCE_YOGAM_INDEX + yogamsSinceRef) % 27 + 27) % 27);
  const yogamFraction = (((REFERENCE_YOGAM_INDEX + yogamsSinceRef) % 1) + 1) % 1;
  const yogamRemainingHours = (1 - yogamFraction) * yogamDurationHours;
  const yogamEndHour = (sunriseDecimal + yogamRemainingHours) % 24;

  // Karanam calculation (2 per tithi, 60 per lunar month)
  const karanamProgress = (hoursSinceTithiRefStart / tithiDurationHours) * 2;
  const karanamIndex = Math.floor(((REFERENCE_KARANAM_INDEX + karanamProgress) % 11 + 11) % 11);

  const inauspicious = getInauspiciousTimes(date, sunTimes.sunrise);

  const dateStr = formatDateStr(date);
  const festival = getFestival(dateStr);
  const teluguMonth = getTeluguMonth(dateStr);

  return {
    date: dateStr,
    dayOfWeek: date.getDay(),
    vaaram: TELUGU_DAYS[date.getDay()],
    englishDay: ENGLISH_DAYS[date.getDay()],
    dateNum: date.getDate(),
    englishMonth: ENGLISH_MONTHS[date.getMonth()],
    year: date.getFullYear(),
    masam: teluguMonth,
    paksha,
    tithi: {
      name: tithiName,
      start: formatDT(tithiStartDT, date),
      end: formatDT(tithiEndDT, date),
    },
    nakshatra: {
      name: NAKSHATRAS[nakshatraIndex],
      start: formatDT(nakshatraStartDT, date),
      end: formatDT(nakshatraEndDT, date),
    },
    yogam: {
      name: YOGAMS[yogamIndex],
      end: formatTime(yogamEndHour),
    },
    karanam: {
      name: KARANAMS[karanamIndex],
    },
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    rahuKalam: inauspicious.rahuKalam,
    yamagandam: inauspicious.yamagandam,
    varjyam: inauspicious.varjyam,
    durmuhurtham: inauspicious.durmuhurtham,
    festival,
    isSunday: date.getDay() === 0,
  };
}

export function formatDateStr(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Generate all dates from Ugadi 2026 to Ugadi 2027
export function generateAllDates() {
  const start = new Date(2026, 2, 19); // March 19, 2026
  const end = new Date(2027, 3, 7);    // April 7, 2027
  const dates = [];

  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// Pre-compute panchangam for all dates
let _cache = null;
export function getAllPanchangam() {
  if (_cache) return _cache;
  const dates = generateAllDates();
  _cache = dates.map(d => getPanchangamForDate(d));
  return _cache;
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
