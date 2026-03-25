import { useNavigate } from 'react-router-dom';
import { useLocation as useAppLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Settings } from 'lucide-react';

export default function TopBar() {
  const navigate = useNavigate();
  const { location } = useAppLocation();
  const { pick, font } = useLanguage();

  return (
    <div style={styles.bar}>
      <div style={styles.locationWrap}>
        <MapPin size={14} color="#E63B2E" strokeWidth={2.2} />
        <span style={{ ...styles.locationText, fontFamily: font }}>
          {pick(location.label, location.labelEn || location.label)}
        </span>
      </div>
      <button style={styles.gearBtn} onClick={() => navigate('/settings')} aria-label="Settings">
        <Settings size={20} color="#666" strokeWidth={1.8} />
      </button>
    </div>
  );
}

const styles = {
  bar: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)',
    background: 'rgba(254,252,248,0.82)',
    backdropFilter: 'blur(24px) saturate(200%)',
    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    zIndex: 40,
    boxShadow: '0 1px 8px rgba(0,0,0,0.02)',
  },
  locationWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  locationText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1A1A1A',
    letterSpacing: '0.01em',
  },
  gearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
};
