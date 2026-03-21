import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ReminderContext = createContext(null);
const STORAGE_KEY = 'manacalendar-reminders';

const DEFAULT_PREFS = {
  permissionGranted: false,

  // Festival reminders
  festivals: true,
  festivalDays: [0, 1], // array: 0 = same day, 1 = day before, 2 = two days before
  festivalTime: '06:00',

  // Vratham reminders
  vrathams: false,
  vrathamEkadashi: true,
  vrathamPradosham: true,
  vrathamSankashti: true,
  vrathamShivaratri: true,
  vrathamPurnima: false,
  vrathamAmavasya: false,
  vrathamDays: [0, 1], // array: 0 = same day, 1 = day before, 2 = two days before
  vrathamTime: '06:00',

  // Puja reminder
  puja: false,
  pujaTime: '06:30',

  // Sunrise/Sunset
  sunrise: false,
  sunriseOffset: 0, // minutes before (0 = at sunrise)
  sunset: false,
  sunsetOffset: 0,
};

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

export function ReminderProvider({ children }) {
  const [prefs, setPrefsState] = useState(() => loadPrefs());

  const updatePref = useCallback((key, value) => {
    setPrefsState(prev => {
      const next = { ...prev, [key]: value };
      savePrefs(next);
      return next;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    // Try Capacitor first
    if (window.Capacitor?.isNativePlatform?.()) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const result = await LocalNotifications.requestPermissions();
        const granted = result.display === 'granted';
        updatePref('permissionGranted', granted);
        return granted;
      } catch { return false; }
    }
    // Web fallback
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      updatePref('permissionGranted', granted);
      return granted;
    }
    return false;
  }, [updatePref]);

  // Check permission on mount
  useEffect(() => {
    if (window.Capacitor?.isNativePlatform?.()) return; // checked at request time
    if ('Notification' in window && Notification.permission === 'granted') {
      updatePref('permissionGranted', true);
    }
  }, []);

  return (
    <ReminderContext.Provider value={{ prefs, updatePref, requestPermission }}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  const ctx = useContext(ReminderContext);
  if (!ctx) throw new Error('useReminders must be used within ReminderProvider');
  return ctx;
}
