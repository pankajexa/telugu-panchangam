import React, { useState, useCallback } from 'react';
import { WISH_TEMPLATES } from '../data/wishTemplates';

const WA = '#25D366';
const TELUGU = "'Noto Serif Telugu', serif";
const SERIF = "'Inter', system-ui, sans-serif";
const INK = '#3a150a';
const INK2 = '#6b2d15';
const INK3 = '#915838';
const INK4 = '#b88050';

function shareToWhatsApp(message, festivalName) {
  const text = `🙏 *${festivalName} శుభాకాంక్షలు* 🙏\n\n${message}\n\nShared from ManaCalendar.com`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.location.href = url;
}

export default function FestivalWishes({ festival }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleOpen = useCallback(() => {
    setShowPicker(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowPicker(false);
  }, []);

  const handleSelect = useCallback((template) => {
    setShowPicker(false);
    shareToWhatsApp(template.message, festival.telugu);
  }, [festival]);

  if (!festival || !festival.major) return null;

  return (
    <>
      <button style={styles.btn} onClick={handleOpen}>
        <span style={styles.icon}>✦</span>
        <span style={styles.text}>శుభాకాంక్షలు పంపండి</span>
      </button>

      {showPicker && (
        <div style={styles.overlay} onClick={handleClose}>
          <div style={styles.panel} onClick={e => e.stopPropagation()}>
            <div style={styles.panelHeader}>
              <span style={styles.panelTitle}>సందేశం ఎంచుకోండి</span>
              <button style={styles.closeBtn} onClick={handleClose}>✕</button>
            </div>
            <div style={styles.templateList}>
              {WISH_TEMPLATES.map((t, i) => (
                <button key={i} style={styles.templateBtn} onClick={() => handleSelect(t)}>
                  <div style={styles.templateTheme}>
                    <span style={styles.themeIcon}>✦</span>
                    <span style={styles.themeName}>{t.theme}</span>
                    <span style={styles.themeEn}>{t.themeEn}</span>
                  </div>
                  <div style={styles.templatePreview}>
                    {t.message.split('\n')[0].slice(0, 50)}...
                  </div>
                </button>
              ))}
            </div>
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
    gap: '8px',
    background: 'rgba(37,211,102,0.1)',
    border: '1.5px solid rgba(37,211,102,0.4)',
    borderRadius: '28px',
    padding: '10px 22px',
    cursor: 'pointer',
  },
  icon: { fontSize: '16px', color: WA },
  text: { fontFamily: TELUGU, fontWeight: 700, fontSize: '14px', color: WA },

  // Full-screen overlay
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  // Bottom panel
  panel: {
    width: '100%',
    maxWidth: '432px',
    maxHeight: '70vh',
    background: 'linear-gradient(to top, #1a120e, #2a1e14)',
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px 10px',
    borderBottom: '1px solid rgba(214,168,32,0.15)',
  },
  panelTitle: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '16px',
    color: '#d6a820',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#d6a820',
    opacity: 0.5,
    cursor: 'pointer',
    padding: '4px 8px',
  },

  // Template list
  templateList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 12px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  templateBtn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    background: 'rgba(214,168,32,0.06)',
    border: '1px solid rgba(214,168,32,0.15)',
    borderRadius: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 150ms',
  },
  templateTheme: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  themeIcon: {
    fontSize: '10px',
    color: '#d6a820',
    opacity: 0.6,
  },
  themeName: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '14px',
    color: '#d6a820',
  },
  themeEn: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '10px',
    color: INK4,
    letterSpacing: '0.5px',
  },
  templatePreview: {
    fontFamily: TELUGU,
    fontWeight: 400,
    fontSize: '11px',
    color: '#b88050',
    lineHeight: 1.4,
    opacity: 0.7,
  },
};
