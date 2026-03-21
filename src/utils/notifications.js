/**
 * Local notification scheduling for daily panchangam share reminders.
 * Uses @capacitor/local-notifications on native, no-op on web.
 */

const SHARE_NOTIFICATION_ID = 1001;
const FESTIVAL_NOTIFICATION_BASE_ID = 2000;

let LocalNotifications = null;

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
      smallIcon: 'ic_stat_calendar',
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
      // Give the app a moment to fully render after opening
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('share-panchangam'));
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
