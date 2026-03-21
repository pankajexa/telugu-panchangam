import { createContext, useContext, useState, useCallback } from 'react';

const PanchangamPrefsContext = createContext(null);
const STORAGE_KEY = 'manacalendar-panchangam-fields';

const DEFAULT_PREFS = {
  // Group 1: Shubha Muhurtham — DEFAULT OFF (shown on main page already)
  shubha: false,
  shubha_abhijit: true,
  shubha_amritKalam: true,
  shubha_brahmaMuhurta: true,

  // Group 2: Ashubha Muhurtham — DEFAULT OFF (opt-in via settings)
  ashubha: false,
  ashubha_yamaganda: true,
  ashubha_gulika: true,

  // Group 3: Calendar Systems — DEFAULT OFF
  calendar: false,
  cal_vikramSamvat: true,
  cal_shakaSamvat: true,
  cal_samvatsaraName: true,
  cal_amantaPurnimanta: true,
  cal_ritu: true,
  cal_ayana: true,

  // Group 4: Detailed Timings — DEFAULT OFF
  timings: false,
  dt_tithiTransitions: true,
  dt_nakshatraTransitions: true,
  dt_yogaTransitions: true,
  dt_karanaTransitions: true,
  dt_moonrise: true,
  dt_moonset: true,

  // Group 5: Rashi & Graha — DEFAULT OFF
  rashi: false,
  rg_sunRashi: true,
  rg_moonRashi: true,
  rg_moonRashiTransition: true,
  rg_dishaShoola: true,

  // Group 6: Special Yogas — DEFAULT OFF
  yogas: false,
  sy_specialYogas: true,
  sy_gandamool: true,
  sy_anandadiYoga: true,
};

// Group keys for checking if any group is enabled
const GROUP_KEYS = ['shubha', 'ashubha', 'calendar', 'timings', 'rashi', 'yogas'];

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...DEFAULT_PREFS, ...saved } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(prefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
}

export function PanchangamPrefsProvider({ children }) {
  const [prefs, setPrefsState] = useState(() => loadPrefs());

  const updatePref = useCallback((key, value) => {
    setPrefsState(prev => {
      const next = { ...prev, [key]: value };
      savePrefs(next);
      return next;
    });
  }, []);

  const isGroupEnabled = useCallback((groupKey) => !!prefs[groupKey], [prefs]);

  const isFieldEnabled = useCallback((groupKey, fieldKey) => {
    return !!prefs[groupKey] && !!prefs[fieldKey];
  }, [prefs]);

  const isAnyGroupEnabled = GROUP_KEYS.some(k => prefs[k]);

  return (
    <PanchangamPrefsContext.Provider value={{ prefs, updatePref, isGroupEnabled, isFieldEnabled, isAnyGroupEnabled }}>
      {children}
    </PanchangamPrefsContext.Provider>
  );
}

export function usePanchangamPrefs() {
  const ctx = useContext(PanchangamPrefsContext);
  if (!ctx) throw new Error('usePanchangamPrefs must be used within PanchangamPrefsProvider');
  return ctx;
}
