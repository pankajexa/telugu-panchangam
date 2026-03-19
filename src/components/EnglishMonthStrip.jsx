import React, { memo } from 'react';

const MONTHS = [
  { name: 'March', short: 'Mar', year: 2026, month: 2 },
  { name: 'April', short: 'Apr', year: 2026, month: 3 },
  { name: 'May', short: 'May', year: 2026, month: 4 },
  { name: 'June', short: 'Jun', year: 2026, month: 5 },
  { name: 'July', short: 'Jul', year: 2026, month: 6 },
  { name: 'August', short: 'Aug', year: 2026, month: 7 },
  { name: 'September', short: 'Sep', year: 2026, month: 8 },
  { name: 'October', short: 'Oct', year: 2026, month: 9 },
  { name: 'November', short: 'Nov', year: 2026, month: 10 },
  { name: 'December', short: 'Dec', year: 2026, month: 11 },
  { name: 'January', short: 'Jan', year: 2027, month: 0 },
  { name: 'February', short: 'Feb', year: 2027, month: 1 },
  { name: 'March', short: 'Mar', year: 2027, month: 2 },
  { name: 'April', short: 'Apr', year: 2027, month: 3 },
];

const EnglishMonthStrip = memo(function EnglishMonthStrip({ visible, onSelectMonth, currentYear, currentMonth }) {
  if (!visible) return null;

  const activeIdx = MONTHS.findIndex(m => m.year === currentYear && m.month === currentMonth);

  return (
    <div style={styles.backdrop} onClick={() => onSelectMonth(null, null)}>
      <div style={styles.overlay} onClick={(e) => e.stopPropagation()}>
        <div style={styles.strip}>
          <div style={styles.grid}>
            {MONTHS.map((m, i) => (
              <button
                key={i}
                style={{
                  ...styles.btn,
                  ...(i === activeIdx ? styles.activeBtn : {}),
                }}
                onClick={() => onSelectMonth(m.year, m.month)}
              >
                <span style={styles.btnName}>{m.short}</span>
                <span style={styles.btnYear}>{m.year}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default EnglishMonthStrip;

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
  btnName: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: '13px',
    color: '#3a150a',
    lineHeight: 1.3,
  },
  btnYear: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    fontSize: '9px',
    color: '#915838',
    letterSpacing: '0.5px',
  },
};
