import { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ReminderProvider } from './context/ReminderContext';
import { PanchangamPrefsProvider } from './context/PanchangamPrefsContext';
import TabBar from './layout/TabBar';
import TopBar from './layout/TopBar';
import { useLanguage } from './context/LanguageContext';
import TodayPage from './pages/TodayPage';
import SplashScreen from './components/SplashScreen';
import { useLocation as useAppLocation } from './context/LocationContext';
import useFestivalAudio from './hooks/useFestivalAudio';
import './styles/paper.css';

// Lazy load heavier pages — but preload them after splash so tabs feel instant
const calendarImport = () => import('./pages/CalendarPage');
const festivalsImport = () => import('./pages/FestivalsPage');
const muhurtaImport = () => import('./pages/MuhurtaPage');
const shareCenterImport = () => import('./pages/ShareCenterPage');
const settingsImport = () => import('./pages/SettingsPage');
const privacyImport = () => import('./pages/PrivacyPolicyPage');

const CalendarPage = lazy(calendarImport);
const FestivalsPage = lazy(festivalsImport);
const MuhurtaPage = lazy(muhurtaImport);
const ShareCenterPage = lazy(shareCenterImport);
const SettingsPage = lazy(settingsImport);
const PrivacyPolicyPage = lazy(privacyImport);

// Preload all page chunks so tab switches are instant
function preloadAllPages() {
  calendarImport();
  festivalsImport();
  muhurtaImport();
  shareCenterImport();
  settingsImport();
  privacyImport();
}

// Only load Vercel Analytics on the web (not inside Capacitor)
const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

function PageLoader() {
  return (
    <div style={styles.pageLoader}>
      {/* Rotating lotus */}
      <svg width="56" height="56" viewBox="0 0 200 200" style={styles.loaderLotus}>
        <defs>
          <radialGradient id="plGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFB8B0" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse key={i} cx="100" cy="100" rx="10" ry="38" fill="url(#plGrad)" opacity="0.5"
            transform={`rotate(${angle} 100 100) translate(0 -18)`} />
        ))}
        <circle cx="100" cy="100" r="12" fill="white" opacity="0.9" />
      </svg>
      <div style={styles.loaderText}>Loading...</div>
    </div>
  );
}

function AppShell() {
  const { t, font } = useLanguage();
  const { location } = useAppLocation();
  const { isPlaying, isMuted, toggle, festivalHasAudio } = useFestivalAudio(location);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFontsLoaded(true), 2000);
    if (document.fonts) {
      document.fonts.ready.then(() => { setFontsLoaded(true); clearTimeout(timeout); });
    }
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={styles.shell}>
      {/* Main app content — visible once splash finishes */}
      <div style={{
        ...styles.content,
        opacity: splashDone ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}>
        <TopBar
          audioPlaying={isPlaying}
          audioMuted={isMuted}
          onToggleAudio={toggle}
          hasAudio={festivalHasAudio}
        />
        <div style={styles.scrollArea}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<TodayPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/share" element={<ShareCenterPage />} />
              <Route path="/festivals" element={<FestivalsPage />} />
              <Route path="/muhurta" element={<MuhurtaPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>

      {splashDone && <TabBar />}

      {/* Splash screen — shows on first load */}
      <SplashScreen visible={!splashDone} onDone={() => { setSplashDone(true); preloadAllPages(); }} />
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
    height: '100dvh',
    background: '#FAFAF8',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
  },
  content: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 'calc(70px + env(safe-area-inset-bottom, 0px))',
  },
  pageLoader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: 16,
  },
  loaderLotus: {
    animation: 'spin 2.5s ease-in-out infinite',
    filter: 'drop-shadow(0 2px 8px rgba(230,59,46,0.2))',
  },
  loaderText: {
    fontSize: 13,
    color: '#BBB',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '0.05em',
  },
};
