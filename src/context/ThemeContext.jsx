import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext(null);

/**
 * Auto day/night theme based on current time vs sunrise/sunset.
 * Falls back to 6AM-6PM if panchangam data isn't available.
 */
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    // Check stored preference
    const stored = localStorage.getItem('themeMode');
    if (stored === 'day' || stored === 'night') return stored;
    if (stored === 'auto' || !stored) return computeMode();
    return 'day';
  });

  const [preference, setPreference] = useState(() =>
    localStorage.getItem('themeMode') || 'auto'
  );

  // Apply theme to document
  useEffect(() => {
    const effectiveMode = preference === 'auto' ? computeMode() : preference;
    setMode(effectiveMode);
    document.documentElement.setAttribute('data-theme', effectiveMode);

    // Update meta theme-color for browser chrome
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = effectiveMode === 'night' ? '#0B0F19' : '#FAFAF8';
    }
  }, [preference]);

  // Auto-update every minute if on auto mode
  useEffect(() => {
    if (preference !== 'auto') return;
    const interval = setInterval(() => {
      const newMode = computeMode();
      setMode(prev => {
        if (prev !== newMode) {
          document.documentElement.setAttribute('data-theme', newMode);
          const meta = document.querySelector('meta[name="theme-color"]');
          if (meta) meta.content = newMode === 'night' ? '#0B0F19' : '#FAFAF8';
        }
        return newMode;
      });
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [preference]);

  const setThemePreference = useCallback((pref) => {
    setPreference(pref);
    localStorage.setItem('themeMode', pref);
  }, []);

  const isNight = mode === 'night';

  // Night-aware color palette for components with hardcoded colors
  const colors = useMemo(() => ({
    text: isNight ? '#E8E0D4' : '#1A1A1A',
    textSecondary: isNight ? '#A0987E' : '#777',
    textMuted: isNight ? '#7A7060' : '#999',
    textFaint: isNight ? '#554D40' : '#BBB',
    cardBg: isNight ? 'rgba(20, 28, 45, 0.85)' : '#FFFFFF',
    pageBg: isNight ? '#0B0F19' : '#FAFAF8',
    border: isNight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    tabBarBg: isNight
      ? 'linear-gradient(to top, rgba(11,15,25,0.98), rgba(20,28,45,0.95))'
      : 'linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.92))',
    tabBarBorder: isNight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    topBarBg: isNight
      ? 'rgba(11,15,25,0.85)'
      : 'rgba(255,255,255,0.85)',
    iconColor: isNight ? '#A0987E' : '#666',
    iconActiveColor: isNight ? '#E8C840' : '#E63B2E',
    // Festival banner
    festivalBg: isNight
      ? 'linear-gradient(135deg, #2A1520, #1E1028)'
      : 'linear-gradient(135deg, #FFF1F0, #FFE4E1)',
    festivalText: isNight ? '#F0C8C0' : '#C62828',
    // Chip/pill
    chipBg: isNight ? 'rgba(255,255,255,0.06)' : '#FFF9F0',
    chipBorder: isNight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    chipText: isNight ? '#C0B8A0' : '#999',
  }), [isNight]);

  const value = useMemo(() => ({
    mode, isNight, colors, preference, setThemePreference,
  }), [mode, isNight, colors, preference, setThemePreference]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/**
 * Compute if it's currently night based on stored sunrise/sunset
 * or fallback to 6AM-6PM.
 */
function computeMode() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  // Try to use cached sunrise/sunset from panchangam
  try {
    const cached = localStorage.getItem('lastPanchangam');
    if (cached) {
      const data = JSON.parse(cached);
      const sunriseMin = parseTimeToMinutes(data.sunrise);
      const sunsetMin = parseTimeToMinutes(data.sunset);
      if (sunriseMin != null && sunsetMin != null) {
        // Night = before sunrise or after sunset
        // Add 30 min buffer for twilight
        return (currentMinutes < sunriseMin - 20 || currentMinutes > sunsetMin + 20)
          ? 'night' : 'day';
      }
    }
  } catch (_) {}

  // Fallback: night between 6:30 PM and 5:30 AM
  return (currentMinutes < 330 || currentMinutes > 1110) ? 'night' : 'day';
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;
  // Handle "06:14" (24h) or "6:14 AM/PM" (12h)
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return null;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  if (match[3]) {
    if (match[3].toUpperCase() === 'PM' && h < 12) h += 12;
    if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
  }
  return h * 60 + m;
}
