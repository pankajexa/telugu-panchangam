import React, { useState, useCallback } from 'react';
import { WISH_TEMPLATES } from '../data/wishTemplates';

const WA = '#25D366';
const TELUGU = "'Noto Serif Telugu', serif";
const SERIF = "'Inter', system-ui, sans-serif";
const INK = '#3a150a';
const INK3 = '#915838';
const INK4 = '#b88050';

function shareToWhatsApp(message, festivalName) {
  const text = `🍃🌺🍃🌺🍃🪷🍃🌺🍃🌺🍃\n\n🙏 *శ్రీ పరాభవ నామ సంవత్సర ${festivalName} శుభాకాంక్షలు* 🙏\n\n${message}\n\n🍃🌺🍃🌺🍃🪷🍃🌺🍃🌺🍃\n\n_shared from manacalendar.com_`;
  window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export default function FestivalWishes({ festival }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleOpen = useCallback(() => setShowPicker(true), []);
  const handleClose = useCallback(() => setShowPicker(false), []);
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
          <div style={styles.strip} onClick={e => e.stopPropagation()}>
            <div style={styles.grid}>
              {WISH_TEMPLATES.map((t, i) => (
                <button key={i} style={styles.templateBtn} onClick={() => handleSelect(t)}>
                  <span style={styles.themeName}>{t.theme}</span>
                  <span style={styles.themeEn}>{t.themeEn}</span>
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

  // Same overlay style as MonthStrip
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    padding: '0 4px',
  },
  strip: {
    width: '100%',
    background: 'linear-gradient(to top, rgba(214, 168, 32, 0.98), rgba(240, 194, 48, 0.96))',
    borderTop: '1px solid rgba(58, 21, 10, 0.12)',
    borderRadius: '10px 10px 0 0',
    boxShadow: '0 -6px 20px rgba(60, 30, 10, 0.2)',
    padding: '10px 6px 14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '4px',
    padding: '0 4px',
  },
  templateBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1px',
    padding: '6px 2px',
    background: 'none',
    border: '1px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  themeName: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '11px',
    color: INK,
    lineHeight: 1.3,
  },
  themeEn: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '8px',
    color: INK3,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};
