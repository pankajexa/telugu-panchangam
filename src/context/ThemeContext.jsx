import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

const LIGHT_COLORS = {
  text: '#1A1A1A',
  textSecondary: '#777',
  textMuted: '#999',
  textFaint: '#BBB',
  cardBg: '#FFFFFF',
  pageBg: '#FAFAF8',
  border: 'rgba(0,0,0,0.05)',
  tabBarBg: 'linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.92))',
  tabBarBorder: 'rgba(0,0,0,0.06)',
  topBarBg: 'rgba(255,255,255,0.85)',
  iconColor: '#666',
  iconActiveColor: '#E63B2E',
  // Festival banner
  festivalBg: 'linear-gradient(135deg, #FFF1F0, #FFE4E1)',
  festivalText: '#C62828',
  // Chip/pill
  chipBg: '#FFF9F0',
  chipBorder: 'rgba(0,0,0,0.08)',
  chipText: '#999',
};

const THEME_VALUE = {
  mode: 'day',
  isNight: false,
  colors: LIGHT_COLORS,
};

export function ThemeProvider({ children }) {
  // Always light mode — set data-theme to day on mount
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', 'day');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = '#FAFAF8';
  }

  return (
    <ThemeContext.Provider value={THEME_VALUE}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
