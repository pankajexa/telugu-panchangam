/**
 * Sandhya time calculations based on sunrise/sunset.
 *
 * Uses traditional Ghati-based windows:
 * - 1 Ghati = 24 minutes
 * - 1 Muhurta = 2 Ghatis = 48 minutes
 *
 * Brahma Muhurta: 96 min to 48 min before sunrise
 * Pratah Sandhya: 48 min before sunrise to 24 min after sunrise
 * Madhyahna Sandhya: 36 min before solar noon to 36 min after
 * Sayam Sandhya: 24 min before sunset to 48 min after sunset
 */

const GHATI = 24; // minutes

/**
 * Calculate all sandhya-related times for a given day.
 * @param {string} sunriseStr - Sunrise time "HH:MM" (24h format)
 * @param {string} sunsetStr - Sunset time "HH:MM" (24h format)
 * @returns {Object} All computed windows with start/end as "HH:MM" strings
 */
export function computeSandhyaTimes(sunriseStr, sunsetStr) {
  if (!sunriseStr || !sunsetStr || sunriseStr === '--' || sunsetStr === '--') {
    return null;
  }

  const sunrise = parseTime(sunriseStr);
  const sunset = parseTime(sunsetStr);
  const solarNoon = Math.round((sunrise + sunset) / 2);

  return {
    brahmaMuhurta: {
      start: fmtMin(sunrise - 4 * GHATI),  // 96 min before sunrise
      end: fmtMin(sunrise - 2 * GHATI),    // 48 min before sunrise
      label: 'బ్రహ్మ ముహూర్తం',
      labelEn: 'Brahma Muhurta',
    },
    pratahSandhya: {
      start: fmtMin(sunrise - 2 * GHATI),  // 48 min before sunrise
      end: fmtMin(sunrise + GHATI),         // 24 min after sunrise
      label: 'ప్రాతః సంధ్య',
      labelEn: 'Pratah Sandhya',
    },
    madhyahnaSandhya: {
      start: fmtMin(solarNoon - 1.5 * GHATI), // 36 min before noon
      end: fmtMin(solarNoon + 1.5 * GHATI),   // 36 min after noon
      label: 'మధ్యాహ్న సంధ్య',
      labelEn: 'Madhyahna Sandhya',
    },
    sayamSandhya: {
      start: fmtMin(sunset - GHATI),       // 24 min before sunset
      end: fmtMin(sunset + 2 * GHATI),     // 48 min after sunset
      label: 'సాయం సంధ్య',
      labelEn: 'Sayam Sandhya',
    },
    sunrise: sunriseStr,
    sunset: sunsetStr,
    solarNoon: fmtMin(solarNoon),
  };
}

/**
 * Get notification schedule data for smart alarms.
 * Returns alarm times with pre-notification offset (alert X mins before window opens).
 * @param {string} sunriseStr - "HH:MM"
 * @param {string} sunsetStr - "HH:MM"
 * @param {number} [alertBefore=10] - Minutes before window to send notification
 * @returns {Object} Alarm times as {hour, minute} for scheduling
 */
export function getAlarmTimes(sunriseStr, sunsetStr, alertBefore = 10) {
  const times = computeSandhyaTimes(sunriseStr, sunsetStr);
  if (!times) return null;

  return {
    brahmaMuhurta: parseTimeToHM(times.brahmaMuhurta.start, -alertBefore),
    pratahSandhya: parseTimeToHM(times.pratahSandhya.start, -alertBefore),
    madhyahnaSandhya: parseTimeToHM(times.madhyahnaSandhya.start, -alertBefore),
    sayamSandhya: parseTimeToHM(times.sayamSandhya.start, -alertBefore),
  };
}

// ─── Helpers ──────────────────────────────────────────────

/** Parse "HH:MM" to minutes since midnight */
function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

/** Format minutes since midnight to "HH:MM" */
function fmtMin(totalMin) {
  let m = Math.round(totalMin);
  if (m < 0) m += 24 * 60;
  if (m >= 24 * 60) m -= 24 * 60;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

/** Parse "HH:MM" + offset → { hour, minute } */
function parseTimeToHM(str, offsetMin = 0) {
  let total = parseTime(str) + offsetMin;
  if (total < 0) total += 24 * 60;
  if (total >= 24 * 60) total -= 24 * 60;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/**
 * Format "HH:MM" (24h) to 12h display string.
 * @param {string} time24 - "HH:MM"
 * @returns {string} "H:MM AM/PM"
 */
export function to12Hr(time24) {
  if (!time24 || time24 === '--') return '--';
  const [hh, mm] = time24.split(':').map(Number);
  const period = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return `${h}:${mm.toString().padStart(2, '0')} ${period}`;
}
