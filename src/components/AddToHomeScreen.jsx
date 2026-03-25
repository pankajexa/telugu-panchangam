import React, { useState, useEffect, useCallback } from 'react';
import { track } from '@vercel/analytics';
import { useLanguage } from '../context/LanguageContext';

const TELUGU = "'Noto Sans Telugu', serif";
const SERIF = "'Plus Jakarta Sans', system-ui, sans-serif";

// Stash the install prompt globally
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

export default function AddToHomeScreen() {
  const [canPrompt, setCanPrompt] = useState(!!deferredPrompt);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setCanPrompt(false));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleClick = useCallback(async () => {
    track('pwa_install_click');

    // Android/Chrome — use the native prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        track('pwa_installed');
      }
      deferredPrompt = null;
      setCanPrompt(false);
      return;
    }

    // iOS — show guide overlay
    if (isIOS()) {
      setShowIOSGuide(true);
      return;
    }

    // Desktop/other — share the URL
    if (navigator.share) {
      navigator.share({ title: 'మనCalendar', url: window.location.href });
    }
  }, []);

  const { t, font } = useLanguage();

  // Don't show if already installed as PWA
  if (isStandalone()) return null;

  return (
    <>
      <button style={styles.btn} onClick={handleClick}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
          <rect x="4" y="2" width="16" height="20" rx="3" stroke="#C49B2A" strokeWidth="1.5" fill="none" />
          <line x1="12" y1="8" x2="12" y2="16" stroke="#C49B2A" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="#C49B2A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ ...styles.text, fontFamily: font }}>{t('pwa.add')}</span>
      </button>

      {/* iOS instruction overlay */}
      {showIOSGuide && (
        <div style={styles.overlay} onClick={() => setShowIOSGuide(false)}>
          <div style={styles.guide} onClick={e => e.stopPropagation()}>
            <div style={{ ...styles.guideTitle, fontFamily: font }}>{t('pwa.guideTitle')}</div>
            <div style={styles.guideSteps}>
              <div style={styles.step}>
                <span style={styles.stepNum}>1</span>
                <span style={styles.stepText} dangerouslySetInnerHTML={{ __html: t('pwa.step1') }} />
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>2</span>
                <span style={styles.stepText} dangerouslySetInnerHTML={{ __html: t('pwa.step2') }} />
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>3</span>
                <span style={styles.stepText} dangerouslySetInnerHTML={{ __html: t('pwa.step3') }} />
              </div>
            </div>
            <button style={{ ...styles.guideClose, fontFamily: font }} onClick={() => setShowIOSGuide(false)}>
              {t('pwa.understood')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'transparent',
    border: '1px solid rgba(196,155,42,0.2)',
    borderRadius: '24px',
    padding: '7px 18px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  text: {
    fontFamily: TELUGU,
    fontWeight: 600,
    fontSize: '11px',
    color: '#C49B2A',
    opacity: 0.7,
  },

  // iOS guide overlay
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  guide: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '320px',
    width: '100%',
    border: '1px solid rgba(45,24,16,0.08)',
    boxShadow: '0 8px 32px rgba(45,24,16,0.15)',
  },
  guideTitle: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '16px',
    color: '#C49B2A',
    textAlign: 'center',
    marginBottom: '16px',
  },
  guideSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  stepNum: {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: '16px',
    color: '#C49B2A',
    background: 'rgba(196,155,42,0.08)',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    fontFamily: SERIF,
    fontSize: '13px',
    color: '#5C3D2E',
    lineHeight: 1.4,
  },
  guideClose: {
    display: 'block',
    width: '100%',
    marginTop: '16px',
    padding: '10px',
    background: 'linear-gradient(to bottom, #D4AB3A, #C49B2A)',
    border: 'none',
    borderRadius: '12px',
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '14px',
    color: '#FFFFFF',
    boxShadow: '0 2px 8px rgba(196,155,42,0.3)',
    cursor: 'pointer',
    textAlign: 'center',
  },
};
