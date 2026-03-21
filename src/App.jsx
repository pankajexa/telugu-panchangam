import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ReminderProvider } from './context/ReminderContext';
import { PanchangamPrefsProvider } from './context/PanchangamPrefsContext';
import TabBar from './layout/TabBar';
import { useLanguage } from './context/LanguageContext';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import DivinePattern from './components/DivinePattern';
import './styles/paper.css';
import './styles/flip.css';

// Only load Vercel Analytics on the web (not inside Capacitor)
const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

function AppShell() {
  const { t, font } = useLanguage();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFontsLoaded(true), 2000);
    if (document.fonts) {
      document.fonts.ready.then(() => { setFontsLoaded(true); clearTimeout(timeout); });
    }
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={styles.shell}>
      <DivinePattern />
      <div style={{
        ...styles.content,
        opacity: fontsLoaded ? 1 : 0,
        transition: 'opacity 500ms ease',
      }}>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>

      <TabBar />

      {!fontsLoaded && (
        <div style={styles.loading}>
          <div style={{ ...styles.loadingText, fontFamily: font }}>{t('app.loading')}</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <LanguageProvider>
        <ReminderProvider>
          <PanchangamPrefsProvider>
            <HashRouter>
              <AppShell />
            </HashRouter>
            {!isCapacitor && <VercelAnalytics />}
          </PanchangamPrefsProvider>
        </ReminderProvider>
      </LanguageProvider>
    </LocationProvider>
  );
}

// Lazy-load analytics to keep Capacitor bundle clean
function VercelAnalytics() {
  const [Analytics, setAnalytics] = useState(null);

  useEffect(() => {
    import('@vercel/analytics/react').then((mod) => {
      setAnalytics(() => mod.Analytics);
    }).catch(() => {});
  }, []);

  return Analytics ? <Analytics /> : null;
}

const styles = {
  shell: {
    width: '100%',
    height: '100vh',
    height: '100dvh',
    background: '#F5F2ED',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 32px)',
    paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px) + 4px)',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
  },
  content: {
    width: '100%',
    flex: 1,
    position: 'relative',
    zIndex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  loading: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F2ED',
    zIndex: 100,
  },
  loadingText: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontSize: '28px',
    color: '#C49B2A',
    opacity: 0.7,
  },
};
