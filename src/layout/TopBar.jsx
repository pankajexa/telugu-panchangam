import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation as useAppLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Settings, Volume2, VolumeX, Globe } from 'lucide-react';

export default function TopBar({ audioPlaying, audioMuted, onToggleAudio, hasAudio }) {
  const navigate = useNavigate();
  const { location } = useAppLocation();
  const { pick, font, language, setLanguage } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const handleLangSelect = useCallback((lang) => {
    setLanguage(lang);
    setShowLangPicker(false);
  }, [setLanguage]);

  return (
    <div style={styles.bar}>
      <div style={styles.locationWrap}>
        <MapPin size={14} color="#E63B2E" strokeWidth={2.2} />
        <span style={{ ...styles.locationText, fontFamily: font }}>
          {pick(location.label, location.labelEn || location.label)}
        </span>
      </div>
      <div style={styles.rightWrap}>
        {/* Devotional audio toggle — always visible, muted by default */}
        {hasAudio && (
          <button
            style={styles.audioBtn}
            onClick={onToggleAudio}
            aria-label={audioMuted ? 'Unmute chant' : 'Mute chant'}
          >
            <div style={{
              ...styles.audioBtnInner,
              background: audioMuted
                ? 'rgba(0,0,0,0.04)'
                : 'linear-gradient(135deg, rgba(230,59,46,0.12), rgba(230,59,46,0.06))',
              boxShadow: audioPlaying && !audioMuted
                ? '0 0 0 3px rgba(230,59,46,0.15)'
                : 'none',
            }}>
              {audioMuted ? (
                <VolumeX size={18} color="#999" strokeWidth={1.8} />
              ) : (
                <Volume2 size={18} color="#E63B2E" strokeWidth={1.8} />
              )}
            </div>
            {/* Pulse animation when playing */}
            {audioPlaying && !audioMuted && <div style={styles.pulse} />}
          </button>
        )}
        {/* Language toggle */}
        <button
          style={styles.langBtn}
          onClick={() => setShowLangPicker(v => !v)}
          aria-label="Change language"
        >
          <span style={styles.langLabel}>{language === 'te' ? 'తె' : 'EN'}</span>
        </button>

        <button style={styles.gearBtn} onClick={() => navigate('/settings')} aria-label="Settings">
          <Settings size={20} color="#666" strokeWidth={1.8} />
        </button>
      </div>

      {/* Language picker dropdown */}
      {showLangPicker && (
        <div style={styles.langBackdrop} onClick={() => setShowLangPicker(false)}>
          <div style={styles.langDropdown} onClick={e => e.stopPropagation()}>
            <button
              style={{
                ...styles.langOption,
                ...(language === 'en' ? styles.langOptionActive : {}),
              }}
              onClick={() => handleLangSelect('en')}
            >
              <span style={styles.langOptionLabel}>English</span>
              {language === 'en' && <span style={styles.langCheck}>✓</span>}
            </button>
            <button
              style={{
                ...styles.langOption,
                ...(language === 'te' ? styles.langOptionActive : {}),
                fontFamily: "'Noto Sans Telugu', sans-serif",
              }}
              onClick={() => handleLangSelect('te')}
            >
              <span style={styles.langOptionLabel}>తెలుగు</span>
              {language === 'te' && <span style={styles.langCheck}>✓</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Pulse keyframes via a style tag (injected once)
if (typeof document !== 'undefined' && !document.getElementById('audio-pulse-css')) {
  const style = document.createElement('style');
  style.id = 'audio-pulse-css';
  style.textContent = `
    @keyframes audioPulse {
      0% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.8); opacity: 0; }
      100% { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
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
  rightWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  audioBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
  audioBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  pulse: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 20,
    height: 20,
    marginTop: -10,
    marginLeft: -10,
    borderRadius: '50%',
    background: 'rgba(230,59,46,0.3)',
    animation: 'audioPulse 2s ease-in-out infinite',
    pointerEvents: 'none',
  },
  langBtn: {
    background: 'rgba(0,0,0,0.04)',
    border: 'none',
    cursor: 'pointer',
    width: 36,
    height: 36,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
  langLabel: {
    fontSize: 13,
    fontWeight: 800,
    color: '#555',
    letterSpacing: '-0.3px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  langBackdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: 'transparent',
  },
  langDropdown: {
    position: 'absolute',
    top: 'calc(env(safe-area-inset-top, 0px) + 50px)',
    right: 58,
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    minWidth: 150,
    border: '1px solid rgba(0,0,0,0.06)',
  },
  langOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: '#333',
    WebkitTapHighlightColor: 'transparent',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
  },
  langOptionActive: {
    background: 'rgba(230,59,46,0.05)',
    color: '#E63B2E',
  },
  langOptionLabel: {
    flex: 1,
    textAlign: 'left',
  },
  langCheck: {
    color: '#E63B2E',
    fontWeight: 700,
    fontSize: 16,
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
