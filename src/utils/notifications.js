/**
 * Local notification scheduling for daily panchangam share reminders
 * and smart sandhya alarms.
 * Uses @capacitor/local-notifications on native, no-op on web.
 */

const SHARE_NOTIFICATION_ID = 1001;
const FESTIVAL_NOTIFICATION_BASE_ID = 2000;

// Smart alarm IDs (fixed per alarm type)
const ALARM_IDS = {
  brahmaMuhurta: 3001,
  pratahSandhya: 3002,
  madhyahnaSandhya: 3003,
  sayamSandhya: 3004,
};

let LocalNotifications = null;
let channelCreated = false;

// Alarm notification channel for Android (HIGH importance = heads-up + sound)
const ALARM_CHANNEL = {
  id: 'sandhya-alarms',
  name: 'Sandhya Alarms',
  description: 'Smart alarms for Brahma Muhurta and Sandhya times',
  importance: 4, // HIGH — heads-up notification with sound
  visibility: 1, // PUBLIC — show on lock screen
  vibration: true,
  sound: undefined, // Use system default notification sound
};

async function getPlugin() {
  if (LocalNotifications) return LocalNotifications;
  if (!window.Capacitor?.isNativePlatform?.()) return null;
  try {
    const mod = await import('@capacitor/local-notifications');
    LocalNotifications = mod.LocalNotifications;
    return LocalNotifications;
  } catch {
    return null;
  }
}

/** Create the Android notification channel (no-op on iOS, idempotent) */
async function ensureAlarmChannel() {
  if (channelCreated) return;
  const plugin = await getPlugin();
  if (!plugin) return;
  try {
    await plugin.createChannel(ALARM_CHANNEL);
    channelCreated = true;
  } catch {}
}

/**
 * Schedule a daily repeating notification for panchangam share.
 * @param {string} time - "HH:MM" format (e.g., "06:00")
 */
export async function scheduleDailyShare(time) {
  const plugin = await getPlugin();
  if (!plugin) return false;

  const [hour, minute] = time.split(':').map(Number);

  // Cancel existing before rescheduling
  try {
    await plugin.cancel({ notifications: [{ id: SHARE_NOTIFICATION_ID }] });
  } catch {}

  await plugin.schedule({
    notifications: [{
      id: SHARE_NOTIFICATION_ID,
      title: 'మన Calendar — నేటి పంచాంగం',
      body: 'Tap to share today\'s panchangam 🙏',
      schedule: {
        on: { hour, minute },
        repeats: true,
        every: 'day',
      },
      smallIcon: 'ic_launcher', // Uses app launcher icon as notification icon
      iconColor: '#C49B2A',
      extra: { action: 'share_panchangam' },
    }],
  });

  return true;
}

/**
 * Cancel the daily share notification.
 */
export async function cancelDailyShare() {
  const plugin = await getPlugin();
  if (!plugin) return;
  try {
    await plugin.cancel({ notifications: [{ id: SHARE_NOTIFICATION_ID }] });
  } catch {}
}

/**
 * Set up listener for notification taps.
 * Dispatches a 'share-panchangam' custom event on the window.
 */
export async function setupNotificationListener() {
  const plugin = await getPlugin();
  if (!plugin) return;

  plugin.addListener('localNotificationActionPerformed', (event) => {
    const extra = event.notification?.extra;
    if (extra?.action === 'share_panchangam') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('share-panchangam'));
      }, 500);
    }
    if (extra?.action === 'sandhya_alarm') {
      // Open the app — the alarm sound already played via notification
      // Future: could navigate to a sadhana screen
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('sandhya-alarm', { detail: { type: extra.type } }));
      }, 500);
    }
  });
}

/**
 * Request notification permissions.
 * @returns {boolean} whether permission was granted
 */
export async function requestNotificationPermission() {
  const plugin = await getPlugin();
  if (!plugin) {
    // Web fallback
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      return result === 'granted';
    }
    return false;
  }

  const result = await plugin.requestPermissions();
  return result.display === 'granted';
}

// ─── SMART SANDHYA ALARMS ─────────────────────────────────

const ALARM_CONFIG = {
  brahmaMuhurta: {
    id: ALARM_IDS.brahmaMuhurta,
    title: 'బ్రహ్మ ముహూర్తం',
    titleEn: 'Brahma Muhurta',
    body: 'బ్రహ్మ ముహూర్తం ప్రారంభం — ధ్యానం, ప్రార్థన సమయం',
    bodyEn: 'Brahma Muhurta begins — time for meditation and prayer',
  },
  pratahSandhya: {
    id: ALARM_IDS.pratahSandhya,
    title: 'ప్రాతః సంధ్య',
    titleEn: 'Pratah Sandhya',
    body: 'ప్రాతః సంధ్యా సమయం — సూర్యోదయ ప్రార్థన',
    bodyEn: 'Morning Sandhya time — sunrise prayer',
  },
  madhyahnaSandhya: {
    id: ALARM_IDS.madhyahnaSandhya,
    title: 'మధ్యాహ్న సంధ్య',
    titleEn: 'Madhyahna Sandhya',
    body: 'మధ్యాహ్న సంధ్యా సమయం — మధ్యాహ్న ప్రార్థన',
    bodyEn: 'Noon Sandhya time — midday prayer',
  },
  sayamSandhya: {
    id: ALARM_IDS.sayamSandhya,
    title: 'సాయం సంధ్య',
    titleEn: 'Sayam Sandhya',
    body: 'సాయం సంధ్యా సమయం — సూర్యాస్తమయ ప్రార్థన',
    bodyEn: 'Evening Sandhya time — sunset prayer',
  },
};

/**
 * Schedule a smart alarm for a specific sandhya time.
 * These are NOT repeating — they're scheduled for a specific date+time
 * and must be rescheduled daily (call scheduleAllSmartAlarms daily).
 *
 * @param {string} alarmKey - 'brahmaMuhurta' | 'pratahSandhya' | 'madhyahnaSandhya' | 'sayamSandhya'
 * @param {{ hour: number, minute: number }} time - alarm time
 * @param {string} [lang='te'] - 'te' or 'en'
 */
export async function scheduleSmartAlarm(alarmKey, time, lang = 'te') {
  const plugin = await getPlugin();
  if (!plugin || !time) return;

  const config = ALARM_CONFIG[alarmKey];
  if (!config) return;

  await ensureAlarmChannel();

  const isTe = lang === 'te';

  // Schedule for today if the time hasn't passed yet, otherwise tomorrow
  const now = new Date();
  const alarmDate = new Date();
  alarmDate.setHours(time.hour, time.minute, 0, 0);

  if (alarmDate <= now) {
    alarmDate.setDate(alarmDate.getDate() + 1);
  }

  // Cancel existing alarm of this type
  try {
    await plugin.cancel({ notifications: [{ id: config.id }] });
  } catch {}

  await plugin.schedule({
    notifications: [{
      id: config.id,
      title: isTe ? config.title : config.titleEn,
      body: isTe ? config.body : config.bodyEn,
      schedule: { at: alarmDate },
      channelId: ALARM_CHANNEL.id,  // Android: uses high-importance channel
      smallIcon: 'ic_launcher', // Uses app launcher icon as notification icon
      iconColor: '#C49B2A',
      // Uses system default sound (channel-level)
      extra: { action: 'sandhya_alarm', type: alarmKey },
    }],
  });
}

/**
 * Schedule all enabled smart alarms based on today's sunrise/sunset.
 * Call this on app startup and whenever location changes.
 *
 * @param {Object} alarmPrefs - { brahmaMuhurta: bool, pratahSandhya: bool, ... }
 * @param {Object} alarmTimes - from getAlarmTimes() in sandhyaTimes.js
 * @param {string} [lang='te']
 */
export async function scheduleAllSmartAlarms(alarmPrefs, alarmTimes, lang = 'te') {
  if (!alarmTimes) return;

  const keys = ['brahmaMuhurta', 'pratahSandhya', 'madhyahnaSandhya', 'sayamSandhya'];

  for (const key of keys) {
    if (alarmPrefs[key] && alarmTimes[key]) {
      await scheduleSmartAlarm(key, alarmTimes[key], lang);
    } else {
      await cancelSmartAlarm(key);
    }
  }
}

/**
 * Cancel a specific smart alarm.
 * @param {string} alarmKey
 */
export async function cancelSmartAlarm(alarmKey) {
  const plugin = await getPlugin();
  if (!plugin) return;
  const id = ALARM_IDS[alarmKey];
  if (!id) return;
  try {
    await plugin.cancel({ notifications: [{ id }] });
  } catch {}
}

/**
 * Cancel all smart alarms.
 */
export async function cancelAllSmartAlarms() {
  const plugin = await getPlugin();
  if (!plugin) return;
  try {
    await plugin.cancel({
      notifications: Object.values(ALARM_IDS).map(id => ({ id })),
    });
  } catch {}
}
