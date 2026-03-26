/**
 * Local notification scheduling for daily panchangam share reminders,
 * smart sandhya alarms, festival/vratham/puja reminders.
 * Uses @capacitor/local-notifications on native, no-op on web.
 */

const SHARE_NOTIFICATION_ID = 1001;
const FESTIVAL_NOTIFICATION_BASE_ID = 2000;
const VRATHAM_NOTIFICATION_BASE_ID = 4000;
const PUJA_NOTIFICATION_ID = 5001;
const SUNRISE_NOTIFICATION_ID = 5002;
const SUNSET_NOTIFICATION_ID = 5003;

// Smart alarm IDs (fixed per alarm type)
const ALARM_IDS = {
  brahmaMuhurta: 3001,
  pratahSandhya: 3002,
  madhyahnaSandhya: 3003,
  sayamSandhya: 3004,
};

// Available notification sounds
export const ALARM_SOUNDS = {
  temple_bell: { id: 'temple_bell', label: 'Temple Bell', labelTe: 'గుడి గంట' },
  temple_bell_soft: { id: 'temple_bell_soft', label: 'Soft Bell', labelTe: 'మృదు గంట' },
  conch_shell: { id: 'conch_shell', label: 'Conch Shell', labelTe: 'శంఖనాదం' },
  default: { id: 'default', label: 'System Default', labelTe: 'సిస్టమ్ డిఫాల్ట్' },
};

let LocalNotifications = null;
let channelsCreated = {};

// Notification channels for Android
const CHANNELS = {
  sandhya: {
    id: 'sandhya-alarms',
    name: 'Sandhya Alarms',
    description: 'Smart alarms for Brahma Muhurta and Sandhya times',
    importance: 4, // HIGH — heads-up notification with sound
    visibility: 1, // PUBLIC — show on lock screen
    vibration: true,
    sound: 'temple_bell', // Custom temple bell sound from res/raw
  },
  reminders: {
    id: 'daily-reminders',
    name: 'Daily Reminders',
    description: 'Daily panchangam share, puja, and sunrise/sunset reminders',
    importance: 3, // DEFAULT
    visibility: 1,
    vibration: true,
    sound: 'temple_bell_soft',
  },
  festivals: {
    id: 'festival-reminders',
    name: 'Festival & Vratham Reminders',
    description: 'Reminders for upcoming festivals and vrathams',
    importance: 3, // DEFAULT
    visibility: 1,
    vibration: true,
    sound: 'conch_shell',
  },
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

/** Create Android notification channels (no-op on iOS, idempotent) */
async function ensureChannel(channelKey) {
  if (channelsCreated[channelKey]) return;
  const plugin = await getPlugin();
  if (!plugin) return;
  const channel = CHANNELS[channelKey];
  if (!channel) return;
  try {
    await plugin.createChannel(channel);
    channelsCreated[channelKey] = true;
  } catch {}
}

async function ensureAllChannels() {
  for (const key of Object.keys(CHANNELS)) {
    await ensureChannel(key);
  }
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

  await ensureChannel('sandhya');

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
      channelId: CHANNELS.sandhya.id,
      smallIcon: 'ic_launcher',
      iconColor: '#C49B2A',
      sound: 'temple_bell',
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

// ─── FESTIVAL REMINDERS ─────────────────────────────────

/**
 * Schedule festival reminders for the next 30 days.
 * @param {Array} festivals - array of { date: Date, telugu: string, english: string, major: boolean }
 * @param {string} time - "HH:MM" format
 * @param {string} [lang='te']
 */
export async function scheduleFestivalReminders(festivals, time, lang = 'te') {
  const plugin = await getPlugin();
  if (!plugin || !festivals?.length) return;

  await ensureChannel('festivals');
  const [hour, minute] = time.split(':').map(Number);
  const isTe = lang === 'te';

  // Cancel existing festival notifications
  const cancelIds = [];
  for (let i = 0; i < 30; i++) cancelIds.push({ id: FESTIVAL_NOTIFICATION_BASE_ID + i });
  try { await plugin.cancel({ notifications: cancelIds }); } catch {}

  const notifications = [];
  const now = new Date();

  festivals.forEach((fest, idx) => {
    if (idx >= 30) return; // Max 30 festival notifications
    const festDate = new Date(fest.date);
    // Schedule reminder for the day before the festival
    const reminderDate = new Date(festDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    reminderDate.setHours(hour, minute, 0, 0);

    if (reminderDate <= now) return; // Skip past dates

    notifications.push({
      id: FESTIVAL_NOTIFICATION_BASE_ID + idx,
      title: isTe ? `🎊 రేపు: ${fest.telugu}` : `🎊 Tomorrow: ${fest.english}`,
      body: isTe
        ? `${fest.telugu} — పూజ, వ్రతం సన్నాహాలు చేసుకోండి`
        : `${fest.english} — Prepare for puja and observances`,
      schedule: { at: reminderDate },
      channelId: CHANNELS.festivals.id,
      smallIcon: 'ic_launcher',
      iconColor: '#C49B2A',
      sound: 'conch_shell',
      extra: { action: 'festival_reminder', festival: fest.english },
    });
  });

  if (notifications.length > 0) {
    await plugin.schedule({ notifications });
  }
}

/**
 * Cancel all festival reminders.
 */
export async function cancelFestivalReminders() {
  const plugin = await getPlugin();
  if (!plugin) return;
  const cancelIds = [];
  for (let i = 0; i < 30; i++) cancelIds.push({ id: FESTIVAL_NOTIFICATION_BASE_ID + i });
  try { await plugin.cancel({ notifications: cancelIds }); } catch {}
}

// ─── VRATHAM REMINDERS ──────────────────────────────────

/**
 * Schedule vratham reminders (Ekadashi, Sankashti Chaturthi, etc.)
 * @param {Array} vrathams - array of { date: Date, telugu: string, english: string, type: string }
 * @param {string} time - "HH:MM" format
 * @param {string} [lang='te']
 */
export async function scheduleVrathamReminders(vrathams, time, lang = 'te') {
  const plugin = await getPlugin();
  if (!plugin || !vrathams?.length) return;

  await ensureChannel('festivals');
  const [hour, minute] = time.split(':').map(Number);
  const isTe = lang === 'te';

  // Cancel existing
  const cancelIds = [];
  for (let i = 0; i < 30; i++) cancelIds.push({ id: VRATHAM_NOTIFICATION_BASE_ID + i });
  try { await plugin.cancel({ notifications: cancelIds }); } catch {}

  const notifications = [];
  const now = new Date();

  vrathams.forEach((vrat, idx) => {
    if (idx >= 30) return;
    const vratDate = new Date(vrat.date);
    // Remind on the morning of the vratham day
    const reminderDate = new Date(vratDate);
    reminderDate.setHours(hour, minute, 0, 0);

    if (reminderDate <= now) return;

    notifications.push({
      id: VRATHAM_NOTIFICATION_BASE_ID + idx,
      title: isTe ? `🙏 నేడు: ${vrat.telugu}` : `🙏 Today: ${vrat.english}`,
      body: isTe
        ? `${vrat.telugu} వ్రతం — ఉపవాసం, పూజ చేయండి`
        : `${vrat.english} Vratham — Observe fasting and puja`,
      schedule: { at: reminderDate },
      channelId: CHANNELS.festivals.id,
      smallIcon: 'ic_launcher',
      iconColor: '#C49B2A',
      sound: 'temple_bell',
      extra: { action: 'vratham_reminder', type: vrat.type },
    });
  });

  if (notifications.length > 0) {
    await plugin.schedule({ notifications });
  }
}

/**
 * Cancel all vratham reminders.
 */
export async function cancelVrathamReminders() {
  const plugin = await getPlugin();
  if (!plugin) return;
  const cancelIds = [];
  for (let i = 0; i < 30; i++) cancelIds.push({ id: VRATHAM_NOTIFICATION_BASE_ID + i });
  try { await plugin.cancel({ notifications: cancelIds }); } catch {}
}

// ─── PUJA REMINDER ──────────────────────────────────────

/**
 * Schedule a daily puja reminder.
 * @param {string} time - "HH:MM" format
 * @param {string} [lang='te']
 */
export async function schedulePujaReminder(time, lang = 'te') {
  const plugin = await getPlugin();
  if (!plugin) return;

  await ensureChannel('reminders');
  const [hour, minute] = time.split(':').map(Number);
  const isTe = lang === 'te';

  try { await plugin.cancel({ notifications: [{ id: PUJA_NOTIFICATION_ID }] }); } catch {}

  await plugin.schedule({
    notifications: [{
      id: PUJA_NOTIFICATION_ID,
      title: isTe ? '🪷 పూజ సమయం' : '🪷 Puja Time',
      body: isTe ? 'నిత్య పూజ చేయండి — దీపం, ధూపం, నైవేద్యం' : 'Time for daily puja — light the lamp and offer prayers',
      schedule: { on: { hour, minute }, repeats: true, every: 'day' },
      channelId: CHANNELS.reminders.id,
      smallIcon: 'ic_launcher',
      iconColor: '#C49B2A',
      sound: 'temple_bell_soft',
      extra: { action: 'puja_reminder' },
    }],
  });
}

/**
 * Cancel puja reminder.
 */
export async function cancelPujaReminder() {
  const plugin = await getPlugin();
  if (!plugin) return;
  try { await plugin.cancel({ notifications: [{ id: PUJA_NOTIFICATION_ID }] }); } catch {}
}

// ─── SUNRISE / SUNSET REMINDERS ─────────────────────────

/**
 * Schedule sunrise/sunset reminders for today based on actual times.
 * @param {string} sunrise - "HH:MM" format
 * @param {string} sunset - "HH:MM" format
 * @param {Object} prefs - { sunrise: bool, sunriseOffset: number, sunset: bool, sunsetOffset: number }
 * @param {string} [lang='te']
 */
export async function scheduleSunReminders(sunrise, sunset, prefs, lang = 'te') {
  const plugin = await getPlugin();
  if (!plugin) return;

  await ensureChannel('reminders');
  const isTe = lang === 'te';
  const now = new Date();

  // Cancel existing
  try {
    await plugin.cancel({ notifications: [{ id: SUNRISE_NOTIFICATION_ID }, { id: SUNSET_NOTIFICATION_ID }] });
  } catch {}

  if (prefs.sunrise && sunrise && sunrise !== '--') {
    const [h, m] = sunrise.split(':').map(Number);
    const alarmDate = new Date();
    alarmDate.setHours(h, m - (prefs.sunriseOffset || 0), 0, 0);
    if (alarmDate > now) {
      await plugin.schedule({
        notifications: [{
          id: SUNRISE_NOTIFICATION_ID,
          title: isTe ? '🌅 సూర్యోదయం' : '🌅 Sunrise',
          body: isTe ? `సూర్యోదయం ${sunrise} — సూర్యనమస్కారాలు` : `Sunrise at ${sunrise} — Surya Namaskar time`,
          schedule: { at: alarmDate },
          channelId: CHANNELS.reminders.id,
          smallIcon: 'ic_launcher',
          iconColor: '#C49B2A',
          sound: 'temple_bell_soft',
          extra: { action: 'sunrise_reminder' },
        }],
      });
    }
  }

  if (prefs.sunset && sunset && sunset !== '--') {
    const [h, m] = sunset.split(':').map(Number);
    const alarmDate = new Date();
    alarmDate.setHours(h, m - (prefs.sunsetOffset || 0), 0, 0);
    if (alarmDate > now) {
      await plugin.schedule({
        notifications: [{
          id: SUNSET_NOTIFICATION_ID,
          title: isTe ? '🌇 సూర్యాస్తమయం' : '🌇 Sunset',
          body: isTe ? `సూర్యాస్తమయం ${sunset} — సాయం దీపం వెలిగించండి` : `Sunset at ${sunset} — Light the evening lamp`,
          schedule: { at: alarmDate },
          channelId: CHANNELS.reminders.id,
          smallIcon: 'ic_launcher',
          iconColor: '#C49B2A',
          sound: 'temple_bell_soft',
          extra: { action: 'sunset_reminder' },
        }],
      });
    }
  }
}

/**
 * Cancel sunrise/sunset reminders.
 */
export async function cancelSunReminders() {
  const plugin = await getPlugin();
  if (!plugin) return;
  try {
    await plugin.cancel({ notifications: [{ id: SUNRISE_NOTIFICATION_ID }, { id: SUNSET_NOTIFICATION_ID }] });
  } catch {}
}
