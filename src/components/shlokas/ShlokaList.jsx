import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SHLOKAS, CATEGORY_LABELS } from '../../data/shlokas';

const DEVANAGARI = "'Noto Sans Devanagari', sans-serif";
const TELUGU     = "'Noto Sans Telugu', serif";
const SERIF      = "'Plus Jakarta Sans', system-ui, sans-serif";
const GOLD       = '#C49B2A';
const INK        = '#3a150a';
const INK2       = '#6b2d15';
const INK3       = '#915838';
const PAPER      = '#FBF0CA';
const PAPER_DARK = '#F0DC90';

function ShlokaListCard({ shloka, onTap }) {
  const { language } = useLanguage();
  const catLabel = CATEGORY_LABELS[shloka.purposeCategory];
  const purposeLabel = language === 'te' ? catLabel?.te : catLabel?.en;
  const devanagariLine = shloka.sanskritDevanagari.split('\n')[0];
  const teluguLine     = shloka.teluguTransliteration.split('\n')[0];

  return (
    <div style={styles.card} onClick={onTap} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onTap?.()}>
      <div style={styles.cardTop}>
        <span style={styles.omSmall}>ॐ</span>
        <span style={styles.purposeChip}>{purposeLabel}</span>
      </div>
      <div style={styles.devanagari}>{devanagariLine} …</div>
      <div style={styles.telugu}>{teluguLine}</div>
      <div style={styles.meaning}>
        {shloka.englishMeaning.length > 90
          ? shloka.englishMeaning.slice(0, 90) + '…'
          : shloka.englishMeaning}
      </div>
      <div style={styles.cardFooter}>
        <span style={styles.source}>{shloka.source}</span>
        <span style={styles.tapHint}>
          {language === 'te' ? 'పూర్తిగా చదవండి ›' : 'Read full ›'}
        </span>
      </div>
    </div>
  );
}

export default function ShlokaList({ onSelectShloka }) {
  const { language } = useLanguage();

  // Group shlokas by category
  const categories = Object.entries(CATEGORY_LABELS).map(([key, labels]) => ({
    key,
    label: language === 'te' ? labels.te : labels.en,
    shlokas: SHLOKAS.filter(s => s.purposeCategory === key),
  })).filter(c => c.shlokas.length > 0);

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <span style={styles.pageOm}>ॐ</span>
        <div>
          <div style={styles.pageTitle}>
            {language === 'te' ? 'రామాయణ శ్లోకాలు' : 'Ramayana Shlokas'}
          </div>
          <div style={styles.pageSubtitle}>
            {language === 'te'
              ? `${SHLOKAS.length} శ్లోకాలు · వాల్మీకి రామాయణం`
              : `${SHLOKAS.length} shlokas · Valmiki Ramayana`}
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      {categories.map(cat => (
        <div key={cat.key} style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>{cat.label}</div>
            <div style={styles.sectionCount}>{cat.shlokas.length}</div>
          </div>
          {cat.shlokas.map(shloka => (
            <ShlokaListCard
              key={shloka.id}
              shloka={shloka}
              onTap={() => onSelectShloka(shloka)}
            />
          ))}
        </div>
      ))}

      <div style={{ height: '20px' }} />
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '0 16px',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    paddingTop: '8px',
    paddingBottom: '14px',
  },
  pageOm: {
    fontFamily: DEVANAGARI,
    fontSize: '38px',
    color: GOLD,
    lineHeight: 1,
  },
  pageTitle: {
    fontFamily: TELUGU,
    fontSize: '20px',
    fontWeight: 700,
    color: INK,
    lineHeight: 1.3,
  },
  pageSubtitle: {
    fontFamily: SERIF,
    fontSize: '11px',
    color: INK3,
    marginTop: '2px',
  },
  divider: {
    height: '1px',
    background: 'rgba(196,155,42,0.25)',
    marginBottom: '16px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  sectionTitle: {
    fontFamily: SERIF,
    fontSize: '11px',
    fontWeight: 700,
    color: GOLD,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontFamily: SERIF,
    fontSize: '10px',
    color: INK3,
    background: 'rgba(196,155,42,0.1)',
    border: '1px solid rgba(196,155,42,0.25)',
    borderRadius: '20px',
    padding: '1px 8px',
  },
  card: {
    background: `linear-gradient(160deg, ${PAPER} 0%, ${PAPER_DARK} 100%)`,
    borderRadius: '12px',
    border: '1px solid rgba(196,155,42,0.3)',
    boxShadow: '0 2px 10px rgba(58,21,10,0.07)',
    padding: '12px 14px 10px',
    marginBottom: '10px',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  omSmall: {
    fontFamily: DEVANAGARI,
    fontSize: '15px',
    color: GOLD,
    lineHeight: 1,
  },
  purposeChip: {
    fontFamily: SERIF,
    fontSize: '10px',
    fontWeight: 600,
    color: GOLD,
    background: 'rgba(196,155,42,0.12)',
    border: '1px solid rgba(196,155,42,0.3)',
    borderRadius: '20px',
    padding: '2px 8px',
  },
  devanagari: {
    fontFamily: DEVANAGARI,
    fontSize: '17px',
    fontWeight: 600,
    color: INK,
    lineHeight: 1.5,
    marginBottom: '4px',
  },
  telugu: {
    fontFamily: TELUGU,
    fontSize: '13px',
    fontWeight: 500,
    color: INK2,
    lineHeight: 1.45,
    marginBottom: '4px',
  },
  meaning: {
    fontFamily: SERIF,
    fontSize: '12px',
    color: INK3,
    lineHeight: 1.5,
    fontStyle: 'italic',
    marginBottom: '8px',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(196,155,42,0.15)',
    paddingTop: '8px',
  },
  source: {
    fontFamily: SERIF,
    fontSize: '10px',
    color: INK3,
    opacity: 0.7,
  },
  tapHint: {
    fontFamily: SERIF,
    fontSize: '11px',
    fontWeight: 600,
    color: GOLD,
  },
};
