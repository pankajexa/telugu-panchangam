import React, { memo } from 'react';
import { TELUGU_MONTHS } from '../data/teluguMonths';
import { generateAllDates, formatDateStr } from '../data/panchangam';

const MONTH_INDICES = (() => {
  const dates = generateAllDates();
  return TELUGU_MONTHS.map(month => {
    const idx = dates.findIndex(d => formatDateStr(d) >= month.start);
    return {
      telugu: month.telugu,
      english: month.english,
      short: month.english.slice(0, 3),
      index: idx >= 0 ? idx : 0,
    };
  });
})();

const MonthStrip = memo(function MonthStrip({ visible, onSelectMonth, currentMonthIndex }) {
  if (!visible) return null;

  let activeMonth = 0;
  for (let i = MONTH_INDICES.length - 1; i >= 0; i--) {
    if (currentMonthIndex >= MONTH_INDICES[i].index) {
      activeMonth = i;
      break;
    }
  }

  return (
    <div style={styles.backdrop} onClick={() => onSelectMonth(-1)}>
      <div style={styles.overlay} onClick={(e) => e.stopPropagation()}>
        <div style={styles.strip}>
        <div style={styles.grid}>
          {MONTH_INDICES.map((month, i) => (
            <button
              key={i}
              style={{
                ...styles.btn,
                ...(i === activeMonth ? styles.activeBtn : {}),
              }}
              onClick={() => onSelectMonth(month.index, i)}
            >
              <span style={styles.btnTelugu}>{month.telugu}</span>
              <span style={styles.btnEnglish}>{month.short}</span>
            </button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
});

export default MonthStrip;

const styles = {
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
  btn: {
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
  activeBtn: {
    background: 'rgba(58, 21, 10, 0.08)',
    border: '1px solid rgba(58, 21, 10, 0.15)',
    borderRadius: '6px',
  },
  btnTelugu: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 700,
    fontSize: '11px',
    color: '#3a150a',
    lineHeight: 1.3,
  },
  btnEnglish: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    fontSize: '8px',
    color: '#915838',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};
