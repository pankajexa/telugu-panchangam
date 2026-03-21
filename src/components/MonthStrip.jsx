import React, { memo, useMemo } from 'react';
import { generateAllDates, formatDateStr } from '../data/panchangam';
import { useLocation } from '../context/LocationContext';

const allDates = generateAllDates();

function buildMonthIndices(months) {
  return months.map(month => {
    const idx = allDates.findIndex(d => formatDateStr(d) >= month.start);
    return {
      telugu: month.telugu,
      english: month.english,
      short: month.english.replace('Adhika ', 'A.').slice(0, 5),
      index: idx >= 0 ? idx : 0,
    };
  });
}

const MonthStrip = memo(function MonthStrip({ visible, onSelectMonth, currentMonthIndex }) {
  const { teluguMonths } = useLocation();

  const monthIndices = useMemo(() => {
    return buildMonthIndices(teluguMonths);
  }, [teluguMonths]);

  if (!visible) return null;

  let activeMonth = 0;
  for (let i = monthIndices.length - 1; i >= 0; i--) {
    if (currentMonthIndex >= monthIndices[i].index) {
      activeMonth = i;
      break;
    }
  }

  return (
    <div style={styles.backdrop} onClick={() => onSelectMonth(-1)}>
      <div style={styles.overlay} onClick={(e) => e.stopPropagation()}>
        <div style={styles.strip}>
        <div style={styles.grid}>
          {monthIndices.map((month, i) => (
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
    background: 'linear-gradient(to top, #FFFFFF, #FDF8EF)',
    borderTop: '1px solid rgba(45,24,16,0.08)',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -6px 24px rgba(45,24,16,0.1)',
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
    background: 'rgba(196,155,42,0.08)',
    border: '1px solid rgba(196,155,42,0.3)',
    borderRadius: '10px',
  },
  btnTelugu: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 700,
    fontSize: '11px',
    color: '#2D1810',
    lineHeight: 1.3,
  },
  btnEnglish: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    fontSize: '8px',
    color: '#8A7568',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};
