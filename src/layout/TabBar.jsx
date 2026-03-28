import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, CalendarDays, Sparkles, Clock } from 'lucide-react';
import { DiyaIcon } from '../components/icons/HinduIcons';

const tabs = [
  { path: '/', labelKey: 'tab.today', Icon: Sun },
  { path: '/calendar', labelKey: 'tab.calendar', Icon: CalendarDays },
  { path: '/devotion', labelKey: 'tab.devotion', Icon: DiyaIcon, isCenter: true },
  { path: '/festivals', labelKey: 'tab.festivals', Icon: Sparkles },
  { path: '/muhurta', labelKey: 'tab.muhurta', Icon: Clock },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, font } = useLanguage();
  const { colors } = useTheme();

  return (
    <nav style={{ ...styles.bar, background: colors.tabBarBg, borderTop: `1px solid ${colors.tabBarBorder}` }}>
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        const color = tab.isCenter ? 'white' : active ? '#E63B2E' : '#B0B0B0';

        if (tab.isCenter) {
          // ── Center accent tab ──
          return (
            <button key={tab.path} style={styles.centerTab} onClick={() => navigate(tab.path)}>
              <div style={{
                ...styles.centerCircle,
                background: active ? '#E63B2E' : '#1A1A1A',
                boxShadow: active ? '0 4px 16px rgba(230,59,46,0.4)' : '0 4px 12px rgba(0,0,0,0.2)',
              }}>
                <tab.Icon size={22} color="white" strokeWidth={2} />
              </div>
              <span style={{
                ...styles.centerLabel,
                fontFamily: font,
                color: active ? '#E63B2E' : '#999',
                fontWeight: active ? 700 : 500,
              }}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        }

        // ── Regular tab ──
        return (
          <button key={tab.path} style={styles.tab} onClick={() => navigate(tab.path)}>
            <tab.Icon size={21} color={color} strokeWidth={active ? 2.2 : 1.8} />
            <span style={{
              ...styles.label,
              fontFamily: font,
              color,
              fontWeight: active ? 700 : 500,
            }}>
              {t(tab.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(24px) saturate(200%)',
    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    padding: '6px 8px 20px',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
    zIndex: 50,
    boxShadow: '0 -2px 12px rgba(0,0,0,0.03)',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    minWidth: '48px',
    padding: '4px 0',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
  },
  label: {
    fontSize: '10px',
    lineHeight: 1.2,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },
  // Center accent tab
  centerTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    minWidth: '48px',
    padding: '0',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    marginTop: '-18px', // Lift the circle above the bar
  },
  centerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease, box-shadow 0.2s ease',
  },
  centerLabel: {
    fontSize: '10px',
    lineHeight: 1.2,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
    marginTop: '2px',
  },
};
