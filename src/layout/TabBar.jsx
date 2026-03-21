import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const tabs = [
  {
    path: '/',
    labelKey: 'tab.panchangam',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2.5" stroke={active ? '#C49B2A' : '#A09486'} strokeWidth="1.5" />
        <line x1="3" y1="9" x2="21" y2="9" stroke={active ? '#C49B2A' : '#A09486'} strokeWidth="1.5" />
        <line x1="8" y1="4" x2="8" y2="7" stroke={active ? '#C49B2A' : '#A09486'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="4" x2="16" y2="7" stroke={active ? '#C49B2A' : '#A09486'} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.5" fill={active ? '#C49B2A' : '#A09486'} />
      </svg>
    ),
  },
  // Puja and Jyotish tabs hidden until further developed
  // {
  //   path: '/puja',
  //   labelKey: 'tab.puja',
  // },
  // {
  //   path: '/jyotish',
  //   labelKey: 'tab.jyotish',
  // },
  {
    path: '/settings',
    labelKey: 'tab.settings',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke={active ? '#C49B2A' : '#A09486'} strokeWidth="1.5" />
        <path d="M12 1.5L13.5 4.5H10.5L12 1.5Z" fill={active ? '#C49B2A' : '#A09486'} />
        <path d="M12 22.5L10.5 19.5H13.5L12 22.5Z" fill={active ? '#C49B2A' : '#A09486'} />
        <path d="M1.5 12L4.5 10.5V13.5L1.5 12Z" fill={active ? '#C49B2A' : '#A09486'} />
        <path d="M22.5 12L19.5 13.5V10.5L22.5 12Z" fill={active ? '#C49B2A' : '#A09486'} />
        <path d="M4.5 4.5L7 5.5L5.5 7L4.5 4.5Z" fill={active ? '#C49B2A' : '#A09486'} />
        <path d="M19.5 19.5L17 18.5L18.5 17L19.5 19.5Z" fill={active ? '#C49B2A' : '#A09486'} />
        <path d="M19.5 4.5L18.5 7L17 5.5L19.5 4.5Z" fill={active ? '#C49B2A' : '#A09486'} />
        <path d="M4.5 19.5L5.5 17L7 18.5L4.5 19.5Z" fill={active ? '#C49B2A' : '#A09486'} />
      </svg>
    ),
  },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, font } = useLanguage();

  return (
    <nav style={styles.bar}>
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            style={styles.tab}
            onClick={() => navigate(tab.path)}
          >
            {tab.icon(active)}
            <span style={{
              ...styles.label,
              fontFamily: font,
              color: active ? '#C49B2A' : '#A09486',
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
    alignItems: 'center',
    justifyContent: 'space-around',
    background: '#FFFFFF',
    borderTop: '1px solid rgba(45,24,16,0.08)',
    boxShadow: '0 -2px 10px rgba(45,24,16,0.04)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    zIndex: 50,
    height: '60px',
    boxSizing: 'content-box',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 0',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
  },
  label: {
    fontSize: '10px',
    lineHeight: 1.2,
    letterSpacing: '0.2px',
    whiteSpace: 'nowrap',
  },
};
