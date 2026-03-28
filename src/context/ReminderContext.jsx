import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  scheduleDailyShare, cancelDailyShare,
  setupNotificationListener,
  scheduleAllSmartAlarms, cancelAllSmartAlarms,
  schedulePujaReminder, cancelPujaReminder,
  scheduleSunReminders, cancelSunReminders,
  scheduleFestivalReminders, cancelFestivalReminders,
  scheduleVrathamReminders, cancelVrathamReminders,
} from '../utils/notifications';

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

  // Smart Sandhya Alarms
  alarmBrahmaMuhurta: false,
  alarmPratahSandhya: false,
  alarmMadhyahnaSandhya: false,
  alarmSayamSandhya: false,
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
  const sunDataRef = useRef(null);  // { sunrise: "HH:MM", sunset: "HH:MM" }
  const alarmTimesRef = useRef(null);  // from getAlarmTimes()
  const festivalsRef = useRef(null);
  const vrathamsRef = useRef(null);

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

  // Auto-request permission on native platform on first mount
  useEffect(() => {
    setupNotificationListener();

    if (window.Capacitor?.isNativePlatform?.()) {
      // On Android, always try to get permission status
      (async () => {
        try {
          const { LocalNotifications } = await import('@capacitor/local-notifications');
          const perms = await LocalNotifications.checkPermissions();
          if (perms.display === 'granted') {
            updatePref('permissionGranted', true);
          } else {
            // Request permission proactively
            const result = await LocalNotifications.requestPermissions();
            updatePref('permissionGranted', result.display === 'granted');
          }
        } catch {}
      })();
    } else if ('Notification' in window && Notification.permission === 'granted') {
      updatePref('permissionGranted', true);
    }
  }, []);

  // ─── Schedule daily share ─────────────────────────
  useEffect(() => {
    if (!prefs.permissionGranted) return;
    if (prefs.dailyShare) {
      scheduleDailyShare(prefs.dailyShareTime);
    } else {
      cancelDailyShare();
    }
  }, [prefs.dailyShare, prefs.dailyShareTime, prefs.permissionGranted]);

  // ─── Schedule puja reminder ───────────────────────
  useEffect(() => {
    if (!prefs.permissionGranted) return;
    if (prefs.puja) {
      schedulePujaReminder(prefs.pujaTime);
    } else {
      cancelPujaReminder();
    }
  }, [prefs.puja, prefs.pujaTime, prefs.permissionGranted]);

  // ─── Schedule sunrise/sunset reminders ────────────
  useEffect(() => {
    if (!prefs.permissionGranted) return;
    if ((prefs.sunrise || prefs.sunset) && sunDataRef.current) {
      scheduleSunReminders(
        sunDataRef.current.sunrise,
        sunDataRef.current.sunset,
        { sunrise: prefs.sunrise, sunriseOffset: prefs.sunriseOffset, sunset: prefs.sunset, sunsetOffset: prefs.sunsetOffset }
      );
    } else {
      cancelSunReminders();
    }
  }, [prefs.sunrise, prefs.sunset, prefs.sunriseOffset, prefs.sunsetOffset, prefs.permissionGranted]);

  // ─── Schedule smart alarms ────────────────────────
  useEffect(() => {
    if (!prefs.permissionGranted) return;
    const alarmPrefs = {
      brahmaMuhurta: prefs.alarmBrahmaMuhurta,
      pratahSandhya: prefs.alarmPratahSandhya,
      madhyahnaSandhya: prefs.alarmMadhyahnaSandhya,
      sayamSandhya: prefs.alarmSayamSandhya,
    };
    const anyEnabled = Object.values(alarmPrefs).some(Boolean);
    if (anyEnabled && alarmTimesRef.current) {
      scheduleAllSmartAlarms(alarmPrefs, alarmTimesRef.current);
    } else if (!anyEnabled) {
      cancelAllSmartAlarms();
    }
  }, [prefs.alarmBrahmaMuhurta, prefs.alarmPratahSandhya, prefs.alarmMadhyahnaSandhya, prefs.alarmSayamSandhya, prefs.permissionGranted]);

  // ─── Schedule festival reminders ──────────────────
  useEffect(() => {
    if (!prefs.permissionGranted) return;
    if (prefs.festivals && festivalsRef.current?.length) {
      scheduleFestivalReminders(festivalsRef.current, prefs.festivalTime);
    } else {
      cancelFestivalReminders();
    }
  }, [prefs.festivals, prefs.festivalTime, prefs.permissionGranted]);

  // ─── Schedule vratham reminders ───────────────────
  useEffect(() => {
    if (!prefs.permissionGranted) return;
    const anyVrat = prefs.vrathams && (prefs.vrathamEkadashi || prefs.vrathamPradosham || prefs.vrathamSankashti || prefs.vrathamShivaratri || prefs.vrathamPurnima || prefs.vrathamAmavasya);
    if (anyVrat && vrathamsRef.current?.length) {
      scheduleVrathamReminders(vrathamsRef.current, prefs.vrathamTime);
    } else {
      cancelVrathamReminders();
    }
  }, [prefs.vrathams, prefs.vrathamEkadashi, prefs.vrathamPradosham, prefs.vrathamSankashti, prefs.vrathamShivaratri, prefs.vrathamPurnima, prefs.vrathamAmavasya, prefs.vrathamTime, prefs.permissionGranted]);

  /**
   * Provide sun/alarm data from TodayPage (which has panchangam data).
   * Called once on app load and whenever location changes.
   */
  const setSunData = useCallback((sunrise, sunset) => {
    sunDataRef.current = { sunrise, sunset };
    // Re-trigger sun reminders
    if (prefs.permissionGranted && (prefs.sunrise || prefs.sunset)) {
      scheduleSunReminders(sunrise, sunset, {
        sunrise: prefs.sunrise, sunriseOffset: prefs.sunriseOffset,
        sunset: prefs.sunset, sunsetOffset: prefs.sunsetOffset,
      });
    }
  }, [prefs.permissionGranted, prefs.sunrise, prefs.sunset, prefs.sunriseOffset, prefs.sunsetOffset]);

  const setAlarmTimes = useCallback((times) => {
    alarmTimesRef.current = times;
    // Re-trigger smart alarms
    if (prefs.permissionGranted) {
      const alarmPrefs = {
        brahmaMuhurta: prefs.alarmBrahmaMuhurta,
        pratahSandhya: prefs.alarmPratahSandhya,
        madhyahnaSandhya: prefs.alarmMadhyahnaSandhya,
        sayamSandhya: prefs.alarmSayamSandhya,
      };
      if (Object.values(alarmPrefs).some(Boolean)) {
        scheduleAllSmartAlarms(alarmPrefs, times);
      }
    }
  }, [prefs.permissionGranted, prefs.alarmBrahmaMuhurta, prefs.alarmPratahSandhya, prefs.alarmMadhyahnaSandhya, prefs.alarmSayamSandhya]);

  const setFestivalData = useCallback((festivals) => {
    festivalsRef.current = festivals;
    if (prefs.permissionGranted && prefs.festivals) {
      scheduleFestivalReminders(festivals, prefs.festivalTime);
    }
  }, [prefs.permissionGranted, prefs.festivals, prefs.festivalTime]);

  const setVrathamData = useCallback((vrathams) => {
    vrathamsRef.current = vrathams;
    if (prefs.permissionGranted && prefs.vrathams) {
      scheduleVrathamReminders(vrathams, prefs.vrathamTime);
    }
  }, [prefs.permissionGranted, prefs.vrathams, prefs.vrathamTime]);

  return (
    <ReminderContext.Provider value={{
      prefs, updatePref, requestPermission,
      setSunData, setAlarmTimes, setFestivalData, setVrathamData,
    }}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  const ctx = useContext(ReminderContext);
  if (!ctx) throw new Error('useReminders must be used within ReminderProvider');
  return ctx;
}
