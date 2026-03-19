import React, { useState, useCallback } from 'react';
import { track } from '@vercel/analytics';
import { WISH_TEMPLATES } from '../data/wishTemplates';
const WA = '#25D366';
const TELUGU = "'Noto Serif Telugu', serif";
const SERIF = "'Inter', system-ui, sans-serif";
const INK = '#3a150a';
const INK3 = '#915838';
const INK4 = '#b88050';

function shareWish(message, festivalName) {
  const text = `*శ్రీ పరాభవ నామ సంవత్సర ${festivalName} శుభాకాంక్షలు*\n\n${message}\n\n_shared from manacalendar.com_`;

  // Synchronous from click — never blocked
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
    return;
  }

  // Fallback: whatsapp:// opens app directly
  window.location.href = `whatsapp://send?text=${encodeURIComponent(text)}`;
}

export default function FestivalWishes({ festival }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleOpen = useCallback(() => setShowPicker(true), []);
  const handleClose = useCallback(() => setShowPicker(false), []);
  const handleSelect = useCallback((template) => {
    setShowPicker(false);
    track('share_wishes', { festival: festival.english, theme: template.themeEn });
    shareWish(template.message, festival.telugu);
  }, [festival]);

  if (!festival || !festival.major) return null;

  return (
    <>
      <button style={styles.btn} onClick={handleOpen}>
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.726-5.993-1.957l-.418-.306-2.65.887.886-2.648-.335-.433A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366" opacity="0.7" />
        </svg>
        <span style={styles.text}>Wishes పంపండి</span>
      </button>

      {showPicker && (
        <div style={styles.backdrop} onClick={handleClose}>
          <div style={styles.overlay} onClick={(e) => e.stopPropagation()}>
            <div style={styles.strip}>
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
        </div>
      )}
    </>
  );
}

const styles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(37,211,102,0.1)',
    border: '1.5px solid rgba(37,211,102,0.4)',
    borderRadius: '24px',
    padding: '8px 14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  icon: { fontSize: '14px', color: WA },
  text: { fontFamily: TELUGU, fontWeight: 700, fontSize: '13px', color: WA },

  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 19,
    background: 'transparent',
  },
  overlay: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    padding: '0 4px',
    display: 'flex',
    justifyContent: 'center',
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
