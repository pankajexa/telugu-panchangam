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
  const results = _processDates(allDates, location);

  _cache.set(location.id, results);
  return results;
}

/**
 * Progressive festival loader — processes dates in chunks and calls
 * onChunk(resultsSoFar) after each batch so the UI can render immediately.
 * Returns a cancel function.
 */
export function loadFestivalsProgressively(location, onChunk, onDone) {
  // If cached, return instantly
  if (_cache.has(location.id)) {
    const cached = _cache.get(location.id);
    onChunk(cached);
    onDone(cached);
    return () => {};
  }

  const allDates = generateAllDates();
  const results = [];
  const sampradaya = typeof localStorage !== 'undefined' ? localStorage.getItem('sampradaya') || 'smartha' : 'smartha';
  const CHUNK = 30; // ~1 month at a time
  let i = 0;
  let cancelled = false;

  function processChunk() {
    if (cancelled) return;
    const end = Math.min(i + CHUNK, allDates.length);
    for (; i < end; i++) {
      const date = allDates[i];
      const data = getPanchangamForDate(date, location);
      if (!data) continue;
      _collectEntries(results, data, date, sampradaya);
    }
    // Notify UI with results so far
    onChunk([...results]);

    if (i < allDates.length) {
      setTimeout(processChunk, 0);
    } else {
      _cache.set(location.id, results);
      onDone(results);
    }
  }

  setTimeout(processChunk, 0);
  return () => { cancelled = true; };
}

function _processDates(allDates, location) {
  const results = [];
  const sampradaya = typeof localStorage !== 'undefined' ? localStorage.getItem('sampradaya') || 'smartha' : 'smartha';
  for (const date of allDates) {
    const data = getPanchangamForDate(date, location);
    if (!data) continue;
    _collectEntries(results, data, date, sampradaya);
  }
  return results;
}

function _collectEntries(results, data, date, sampradaya) {
  if (data.festival) {
    results.push({
      date,
      english: data.festival.english || '',
      telugu: data.festival.telugu || '',
      type: 'festival',
      major: data.festival.major || false,
    });
  }
  if (data.vrathams && data.vrathams.length > 0) {
    for (const v of data.vrathams) {
      if (v.type === 'ekadashi' && sampradaya === 'vaishnava' && v.vaishnava === false) continue;
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
