import { generateAllDates, getPanchangamForDate } from './panchangam';

const _cache = new Map();

/**
 * Get all festivals and vrathams for the entire calendar year.
 * Iterates through all dates and collects festival/vratham entries.
 * Cached by location.id.
 */
export function getAllFestivals(location) {
  if (_cache.has(location.id)) return _cache.get(location.id);

  const allDates = generateAllDates();
  const results = [];

  for (const date of allDates) {
    const data = getPanchangamForDate(date, location);
    if (!data) continue;

    // Main festival
    if (data.festival) {
      results.push({
        date,
        english: data.festival.english || '',
        telugu: data.festival.telugu || '',
        type: 'festival',
        major: data.festival.major || false,
      });
    }

    // Vrathams (Ekadashi, Pradosham, etc.)
    if (data.vrathams && data.vrathams.length > 0) {
      for (const v of data.vrathams) {
        results.push({
          date,
          english: v.english || v.name || '',
          telugu: v.telugu || v.nameTe || '',
          type: 'vrat',
          major: false,
        });
      }
    }
  }

  _cache.set(location.id, results);
  return results;
}
