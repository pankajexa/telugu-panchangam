// Telugu month boundaries — computed from panchangam library per location
// Using Amanta system (month ends on Amavasya)
// Optimized: samples every 5 days + binary search at boundaries

import { getPanchangam as libGetPanchangam, Observer } from '@ishubhamx/panchangam-js';
import { getTimezoneOffsetMinutes } from './locations.js';

const TELUGU_MASA = {
  'Chaitra': 'చైత్రం', 'Vaishakha': 'వైశాఖం', 'Jyeshtha': 'జ్యేష్ఠం',
  'Ashadha': 'ఆషాఢం', 'Shravana': 'శ్రావణం', 'Bhadrapada': 'భాద్రపదం',
  'Ashwina': 'ఆశ్వయుజం', 'Kartika': 'కార్తీకం', 'Margashirsha': 'మార్గశిరం',
  'Pausha': 'పుష్యం', 'Magha': 'మాఘం', 'Phalguna': 'ఫాల్గుణం',
};

let _monthCache = { locationId: null, months: null };

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMasaForDay(dayOffset, obs, location) {
  const date = new Date(2026, 2, 19 + dayOffset);
  const offset = getTimezoneOffsetMinutes(location.tz, date);
  const utcH = 6 - (offset / 60);
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(utcH), (utcH % 1) * 60, 0));
  const p = libGetPanchangam(utcDate, obs, { timezoneOffset: offset, calendarType: 'amanta' });
  return {
    key: (p.masa?.isAdhika ? 'Adhika ' : '') + (p.masa?.name || ''),
    isAdhika: !!p.masa?.isAdhika,
    name: p.masa?.name || '',
    tithi: p.tithi,
  };
}

export function computeTeluguMonths(location) {
  if (_monthCache.locationId === location.id) return _monthCache.months;

  const obs = new Observer(location.lat, location.lng, location.elev || 0);
  const TOTAL = 385;

  // Phase 1: Sample every 5 days to find rough boundary regions
  const samples = [];
  for (let d = 0; d < TOTAL; d += 5) {
    samples.push({ day: d, masa: getMasaForDay(d, obs, location) });
  }
  // Always include last day
  if (samples[samples.length - 1].day !== TOTAL - 1) {
    samples.push({ day: TOTAL - 1, masa: getMasaForDay(TOTAL - 1, obs, location) });
  }

  // Phase 2: Find exact boundaries via binary search where masa changes
  const boundaries = [{ day: 0, masa: samples[0].masa }]; // first day
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].masa.key !== samples[i - 1].masa.key) {
      // Binary search between samples[i-1].day and samples[i].day
      let lo = samples[i - 1].day;
      let hi = samples[i].day;
      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        const midMasa = getMasaForDay(mid, obs, location);
        if (midMasa.key === samples[i - 1].masa.key) lo = mid;
        else hi = mid;
      }
      boundaries.push({ day: hi, masa: getMasaForDay(hi, obs, location) });
    }
  }

  // Phase 3: Build month array from boundaries
  const rawMonths = [];
  for (let i = 0; i < boundaries.length; i++) {
    const startDay = boundaries[i].day;
    const endDay = (i + 1 < boundaries.length) ? boundaries[i + 1].day - 1 : TOTAL - 1;
    const startDate = new Date(2026, 2, 19 + startDay);
    const endDate = new Date(2026, 2, 19 + endDay);
    const m = boundaries[i].masa;
    rawMonths.push({
      name: m.key,
      baseName: m.name,
      isAdhika: m.isAdhika,
      start: fmtDate(startDate),
      end: fmtDate(endDate),
      span: endDay - startDay + 1,
    });
  }

  // Phase 4: Split long months (Adhika detection fallback)
  const months = [];
  for (const m of rawMonths) {
    if (m.span > 40 && !m.isAdhika) {
      // Find Amavasya that splits the two cycles
      const startDay = rawMonths.indexOf(m);
      const baseDay = new Date(m.start + 'T00:00:00');
      const dayOffset = Math.round((baseDay - new Date(2026, 2, 19)) / 86400000);
      let splitAt = null;
      for (let s = 25; s < m.span - 5; s++) {
        const info = getMasaForDay(dayOffset + s, obs, location);
        if (info.tithi === 29) { splitAt = s; break; }
      }
      if (splitAt) {
        const splitDate = new Date(2026, 2, 19 + dayOffset + splitAt);
        const nextDate = new Date(2026, 2, 19 + dayOffset + splitAt + 1);
        months.push({
          telugu: 'అధిక ' + (TELUGU_MASA[m.baseName] || m.baseName),
          english: 'Adhika ' + m.baseName,
          start: m.start, end: fmtDate(splitDate), isAdhika: true,
        });
        months.push({
          telugu: TELUGU_MASA[m.baseName] || m.baseName,
          english: m.baseName,
          start: fmtDate(nextDate), end: m.end,
        });
      } else {
        months.push({
          telugu: TELUGU_MASA[m.baseName] || m.baseName,
          english: m.baseName, start: m.start, end: m.end,
        });
      }
    } else {
      months.push({
        telugu: m.isAdhika ? 'అధిక ' + (TELUGU_MASA[m.baseName] || m.baseName) : (TELUGU_MASA[m.baseName] || m.baseName),
        english: m.isAdhika ? 'Adhika ' + m.baseName : m.baseName,
        start: m.start, end: m.end,
        ...(m.isAdhika ? { isAdhika: true } : {}),
      });
    }
  }

  // Filter out tiny fragments (partial months at calendar edges)
  const filtered = months.filter(m => {
    const s = new Date(m.start + 'T00:00:00');
    const e = new Date(m.end + 'T00:00:00');
    return Math.round((e - s) / 86400000) >= 5;
  });

  _monthCache = { locationId: location.id, months: filtered };
  return filtered;
}

export const PRE_CHAITRA = { telugu: 'ఫాల్గుణం', english: 'Phalguna' };

export function getTeluguMonth(dateStr, location) {
  const months = location ? computeTeluguMonths(location) : [];
  for (const month of months) {
    if (dateStr >= month.start && dateStr <= month.end) {
      return { telugu: month.telugu, english: month.english };
    }
  }
  if (dateStr < '2026-03-20') return PRE_CHAITRA;
  if (dateStr >= '2027-04-07') return { telugu: 'చైత్రం', english: 'Chaitra' };
  return PRE_CHAITRA;
}
