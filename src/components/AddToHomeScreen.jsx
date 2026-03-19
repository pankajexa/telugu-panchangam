import React, { useState, useEffect, useCallback } from 'react';
import { track } from '@vercel/analytics';

const TELUGU = "'Noto Serif Telugu', serif";
const SERIF = "'Inter', system-ui, sans-serif";

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

  // Don't show if already installed as PWA
  if (isStandalone()) return null;

  return (
    <>
      <button style={styles.btn} onClick={handleClick}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
          <rect x="4" y="2" width="16" height="20" rx="3" stroke="#d6a820" strokeWidth="1.5" fill="none" />
          <line x1="12" y1="8" x2="12" y2="16" stroke="#d6a820" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="#d6a820" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={styles.text}>హోమ్ స్క్రీన్ కు జోడించండి</span>
      </button>

      {/* iOS instruction overlay */}
      {showIOSGuide && (
        <div style={styles.overlay} onClick={() => setShowIOSGuide(false)}>
          <div style={styles.guide} onClick={e => e.stopPropagation()}>
            <div style={styles.guideTitle}>హోమ్ స్క్రీన్ కు జోడించడం</div>
            <div style={styles.guideSteps}>
              <div style={styles.step}>
                <span style={styles.stepNum}>1</span>
                <span style={styles.stepText}>Safari లో <strong>Share</strong> బటన్ నొక్కండి (⬆ icon)</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>2</span>
                <span style={styles.stepText}><strong>"Add to Home Screen"</strong> ఎంచుకోండి</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>3</span>
                <span style={styles.stepText}><strong>"Add"</strong> నొక్కండి</span>
              </div>
            </div>
            <button style={styles.guideClose} onClick={() => setShowIOSGuide(false)}>
              అర్థమైంది
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
    background: 'rgba(214,168,32,0.04)',
    border: '1px solid rgba(214,168,32,0.15)',
    borderRadius: '24px',
    padding: '7px 18px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  text: {
    fontFamily: TELUGU,
    fontWeight: 600,
    fontSize: '11px',
    color: '#d6a820',
    opacity: 0.6,
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
    background: '#2a1e14',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '320px',
    width: '100%',
    border: '1px solid rgba(214,168,32,0.2)',
  },
  guideTitle: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '16px',
    color: '#d6a820',
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
    color: '#d6a820',
    background: 'rgba(214,168,32,0.1)',
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
    color: '#b88050',
    lineHeight: 1.4,
  },
  guideClose: {
    display: 'block',
    width: '100%',
    marginTop: '16px',
    padding: '10px',
    background: 'rgba(214,168,32,0.1)',
    border: '1px solid rgba(214,168,32,0.25)',
    borderRadius: '10px',
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '14px',
    color: '#d6a820',
    cursor: 'pointer',
    textAlign: 'center',
  },
};
