import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { scheduleDailyShare, cancelDailyShare, setupNotificationListener } from '../utils/notifications';

const ReminderContext = createContext(null);
const STORAGE_KEY = 'manacalendar-reminders';

const DEFAULT_PREFS = {
  permissionGranted: false,

  // Daily panchangam share reminder
  dailyShare: false,
  dailyShareTime: '06:00',

  // Festival reminders
  festivals: true,
  festivalDays: [0, 1],
  festivalTime: '06:00',

  // Vratham reminders
  vrathams: false,
  vrathamEkadashi: true,
  vrathamPradosham: true,
  vrathamSankashti: true,
  vrathamShivaratri: true,
  vrathamPurnima: false,
  vrathamAmavasya: false,
  vrathamDays: [0, 1],
  vrathamTime: '06:00',

  // Puja reminder
  puja: false,
  pujaTime: '06:30',

  // Sunrise/Sunset
  sunrise: false,
  sunriseOffset: 0,
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

  // Check permission on mount + set up notification listener
  useEffect(() => {
    setupNotificationListener();
    if (window.Capacitor?.isNativePlatform?.()) return;
    if ('Notification' in window && Notification.permission === 'granted') {
      updatePref('permissionGranted', true);
    }
  }, []);

  // Schedule/cancel daily share notification when prefs change
  useEffect(() => {
    if (prefs.dailyShare && prefs.permissionGranted) {
      scheduleDailyShare(prefs.dailyShareTime);
    } else {
      cancelDailyShare();
    }
  }, [prefs.dailyShare, prefs.dailyShareTime, prefs.permissionGranted]);

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
