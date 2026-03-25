import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SHLOKAS, CATEGORY_LABELS } from '../../data/shlokas';
import { generateShlokaCard } from '../../imageCard/generateShlokaCard';
import { shareImage } from '../../utils/sharingService';

const DEVANAGARI = "'Noto Sans Devanagari', sans-serif";
const TELUGU     = "'Noto Sans Telugu', sans-serif";
const SERIF      = "'Plus Jakarta Sans', system-ui, sans-serif";
const ACCENT     = '#E63B2E';
const INK        = '#1A1A1A';
const INK2       = '#444';
const INK3       = '#777';
const PAPER      = '#FAFAF8';
const PAPER_DARK = '#F5F3EF';

export default function ShlokaDetail({ shloka, onClose, onNavigate }) {
  const { language } = useLanguage();
  const [sharing, setSharing] = useState(false);

  // Lock body scroll while detail is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Swipe-down to close
  useEffect(() => {
    let startY = 0;
    const onDown = (e) => { startY = e.touches?.[0]?.clientY ?? e.clientY; };
    const onUp = (e) => {
      const endY = e.changedTouches?.[0]?.clientY ?? e.clientY;
      if (endY - startY > 80) onClose();
    };
    window.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchend', onUp, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchend', onUp);
    };
  }, [onClose]);

  const currentIdx = SHLOKAS.findIndex(s => s.id === shloka.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < SHLOKAS.length - 1;

  const handleShare = useCallback(async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const blob = await generateShlokaCard(shloka);
      const text = `${shloka.sanskritDevanagari}\n\n${shloka.teluguTransliteration}\n\n${shloka.englishMeaning}\n\n— ${shloka.source}\n\nమనCalendar — Telugu Panchangam`;
      await shareImage(blob, `shloka_${shloka.id}`, text);
    } catch (e) {
      console.error('Shloka share failed', e);
    } finally {
      setSharing(false);
    }
  }, [shloka, sharing]);

  const catLabel = CATEGORY_LABELS[shloka.purposeCategory];
  const purposeLabel = language === 'te' ? catLabel?.te : catLabel?.en;

  return (
    <div style={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.sheet}>
        {/* Handle bar */}
        <div style={styles.handle} />

        {/* Header row */}
        <div style={styles.header}>
          <div style={styles.omAndTitle}>
            <span style={styles.omLarge}>ॐ</span>
            <div>
              <div style={styles.headerTitle}>
                {language === 'te' ? 'రామాయణ శ్లోకం' : 'Ramayana Shloka'}
              </div>
              <div style={styles.purposeChip}>{purposeLabel}</div>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Scrollable content */}
        <div style={styles.scroll}>
          {/* Devanagari — primary large */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>
              {language === 'te' ? 'సంస్కృత శ్లోకం' : 'Sanskrit (Devanagari)'}
            </div>
            <div style={styles.devanagari}>{shloka.sanskritDevanagari}</div>
          </div>

          <div style={styles.divider} />

          {/* Telugu transliteration */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>
              {language === 'te' ? 'తెలుగు లిప్యంతరీకరణ' : 'Telugu Transliteration'}
            </div>
            <div style={styles.teluguScript}>{shloka.teluguTransliteration}</div>
          </div>

          {/* IAST transliteration */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>IAST Transliteration</div>
            <div style={styles.iast}>{shloka.transliterationIAST}</div>
          </div>

          <div style={styles.divider} />

          {/* Telugu meaning */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>
              {language === 'te' ? 'తెలుగు అర్థం' : 'Telugu Meaning'}
            </div>
            <div style={styles.meaningTe}>{shloka.teluguMeaning}</div>
          </div>

          {/* English meaning */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>English Meaning</div>
            <div style={styles.meaningEn}>{shloka.englishMeaning}</div>
          </div>

          <div style={styles.divider} />

          {/* Purpose & benefit */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>
              {language === 'te' ? 'ప్రయోజనం' : 'Purpose & Benefit'}
            </div>
            <div style={styles.shastraBacking}>{shloka.shastraBacking}</div>
          </div>

          {/* Source */}
          <div style={styles.sourceRow}>
            <span style={styles.sourceIcon}>📖</span>
            <span style={styles.sourceText}>{shloka.source}</span>
          </div>

          {/* Share button */}
          <button
            style={{ ...styles.shareBtn, opacity: sharing ? 0.6 : 1 }}
            onClick={handleShare}
            disabled={sharing}
          >
            <span style={styles.shareBtnIcon}>↑</span>
            <span style={styles.shareBtnLabel}>
              {sharing
                ? (language === 'te' ? 'పంపిస్తున్నాం…' : 'Sharing…')
                : (language === 'te' ? 'WhatsApp కు పంపించండి' : 'Share this Shloka')}
            </span>
          </button>

          {/* Prev / Next navigation */}
          <div style={styles.navRow}>
            <button
              style={{ ...styles.navBtn, opacity: hasPrev ? 1 : 0.3 }}
              onClick={() => hasPrev && onNavigate(SHLOKAS[currentIdx - 1])}
              disabled={!hasPrev}
            >
              ‹ {language === 'te' ? 'మునుపటి' : 'Previous'}
            </button>
            <span style={styles.navCount}>{currentIdx + 1} / {SHLOKAS.length}</span>
            <button
              style={{ ...styles.navBtn, opacity: hasNext ? 1 : 0.3 }}
              onClick={() => hasNext && onNavigate(SHLOKAS[currentIdx + 1])}
              disabled={!hasNext}
            >
              {language === 'te' ? 'తదుపరి' : 'Next'} ›
            </button>
          </div>

          {/* Bottom safe area */}
          <div style={{ height: '16px' }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backdropFilter: 'blur(2px)',
  },
  sheet: {
    background: `linear-gradient(180deg, ${PAPER} 0%, ${PAPER_DARK} 100%)`,
    borderRadius: '20px 20px 0 0',
    maxHeight: '92dvh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 -4px 32px rgba(58,21,10,0.18)',
    border: '1px solid rgba(196,155,42,0.3)',
    borderBottom: 'none',
  },
  handle: {
    width: '40px',
    height: '4px',
    background: 'rgba(58,21,10,0.2)',
    borderRadius: '2px',
    margin: '12px auto 0',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 18px 10px',
    borderBottom: '1px solid rgba(196,155,42,0.2)',
    flexShrink: 0,
  },
  omAndTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  omLarge: {
    fontFamily: DEVANAGARI,
    fontSize: '28px',
    color: ACCENT,
    lineHeight: 1,
  },
  headerTitle: {
    fontFamily: SERIF,
    fontSize: '13px',
    fontWeight: 700,
    color: INK,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  purposeChip: {
    fontFamily: SERIF,
    fontSize: '10px',
    fontWeight: 600,
    color: ACCENT,
    background: 'rgba(196,155,42,0.12)',
    border: '1px solid rgba(196,155,42,0.3)',
    borderRadius: '20px',
    padding: '2px 8px',
    marginTop: '3px',
    display: 'inline-block',
  },
  closeBtn: {
    background: 'rgba(58,21,10,0.08)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: INK2,
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
    WebkitTapHighlightColor: 'transparent',
  },
  scroll: {
    overflowY: 'auto',
    flex: 1,
    padding: '0 18px',
    WebkitOverflowScrolling: 'touch',
  },
  section: {
    paddingTop: '14px',
  },
  sectionLabel: {
    fontFamily: SERIF,
    fontSize: '10px',
    fontWeight: 700,
    color: ACCENT,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  devanagari: {
    fontFamily: DEVANAGARI,
    fontSize: '22px',
    fontWeight: 600,
    color: INK,
    lineHeight: 1.7,
    letterSpacing: '0.3px',
    whiteSpace: 'pre-line',
  },
  teluguScript: {
    fontFamily: TELUGU,
    fontSize: '16px',
    fontWeight: 500,
    color: INK2,
    lineHeight: 1.65,
    whiteSpace: 'pre-line',
  },
  iast: {
    fontFamily: SERIF,
    fontSize: '13px',
    fontStyle: 'italic',
    color: INK3,
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
  meaningTe: {
    fontFamily: TELUGU,
    fontSize: '15px',
    color: INK,
    lineHeight: 1.7,
  },
  meaningEn: {
    fontFamily: SERIF,
    fontSize: '14px',
    color: INK,
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  shastraBacking: {
    fontFamily: SERIF,
    fontSize: '13px',
    color: INK2,
    lineHeight: 1.6,
  },
  divider: {
    height: '1px',
    background: 'rgba(196,155,42,0.25)',
    margin: '14px 0 0',
  },
  sourceRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    padding: '14px 0 2px',
  },
  sourceIcon: {
    fontSize: '13px',
  },
  sourceText: {
    fontFamily: SERIF,
    fontSize: '12px',
    color: INK3,
    fontStyle: 'italic',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    marginTop: '18px',
    padding: '14px 20px',
    background: `linear-gradient(135deg, ${ACCENT} 0%, #A07820 100%)`,
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    boxShadow: '0 4px 16px rgba(196,155,42,0.35)',
  },
  shareBtnIcon: {
    fontSize: '18px',
    color: 'white',
    fontWeight: 700,
    lineHeight: 1,
  },
  shareBtnLabel: {
    fontFamily: SERIF,
    fontSize: '15px',
    fontWeight: 700,
    color: 'white',
    letterSpacing: '0.3px',
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '14px',
    padding: '0 4px',
  },
  navBtn: {
    fontFamily: SERIF,
    fontSize: '13px',
    fontWeight: 600,
    color: INK2,
    background: 'rgba(196,155,42,0.08)',
    border: '1px solid rgba(196,155,42,0.2)',
    borderRadius: '20px',
    padding: '8px 16px',
    cursor: 'pointer',
    minHeight: '44px',
    WebkitTapHighlightColor: 'transparent',
  },
  navCount: {
    fontFamily: SERIF,
    fontSize: '12px',
    color: INK3,
  },
};
