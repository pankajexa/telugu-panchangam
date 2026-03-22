import React, { memo, useMemo } from 'react';
import FESTIVALS from '../data/festivals.js';

const SERIF = "'Inter', system-ui, sans-serif";
const TELUGU = "'Noto Serif Telugu', serif";
const INK = '#3a150a';
const INK2 = '#6b2d15';
const INK3 = '#915838';
const GOLD = '#C49B2A';
const FEST_DOT = '#d45500';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Precompute major festival date keys for fast lookup
const majorFestivalKeys = new Set(
  Object.entries(FESTIVALS)
    .filter(([, f]) => f.major)
    .map(([key]) => key)
);

function isMajorFestival(year, month, day) {
  const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return majorFestivalKeys.has(key);
}

function MiniMonth({ year, month, isCurrentMonth, onSelectMonth, onSelectDate }) {
  const today = useMemo(() => {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() === month) return now.getDate();
    return null;
  }, [year, month]);

  const { days, firstDow, daysInMonth } = useMemo(() => {
    const dim = new Date(year, month + 1, 0).getDate();
    const fdow = new Date(year, month, 1).getDay();
    const arr = [];
    for (let d = 1; d <= dim; d++) {
      arr.push(d);
    }
    return { days: arr, firstDow: fdow, daysInMonth: dim };
  }, [year, month]);

  const numWeeks = Math.ceil((daysInMonth + firstDow) / 7);

  return (
    <div
      style={{
        ...miniStyles.container,
        ...(isCurrentMonth ? miniStyles.currentMonth : {}),
      }}
      onClick={(e) => {
        // If clicking on a specific date cell, that handler takes priority
        // This catches clicks on the month name area
        if (e.target === e.currentTarget || e.target.dataset.role === 'monthName') {
          onSelectMonth(year, month);
        }
      }}
    >
      <div
        style={miniStyles.monthName}
        data-role="monthName"
      >
        {MONTH_NAMES[month].substring(0, 3)}
      </div>

      {/* Day name headers */}
      <div style={miniStyles.dayHeaders}>
        {DAY_LABELS.map((lbl, i) => (
          <div key={i} style={{
            ...miniStyles.dayLabel,
            ...(i === 0 ? { color: INK } : {}),
          }}>
            {lbl}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div style={miniStyles.dateGrid}>
        {/* Empty cells before first day */}
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`e${i}`} style={miniStyles.dateCell} />
        ))}
        {days.map((d) => {
          const isToday = d === today;
          const hasMajorFestival = isMajorFestival(year, month, d);
          return (
            <div
              key={d}
              style={miniStyles.dateCell}
              onClick={(e) => {
                e.stopPropagation();
                onSelectDate(year, month, d);
              }}
            >
              <div style={{
                ...miniStyles.dateNumber,
                ...(isToday ? miniStyles.todayNumber : {}),
              }}>
                {d}
              </div>
              {hasMajorFestival && (
                <div style={miniStyles.festivalDot} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MiniMonthMemo = memo(MiniMonth);

const YearView = memo(function YearView({ onSelectMonth, onSelectDate, currentYear, currentMonth }) {
  // Calendar range: March 2026 - April 2027
  // Group: 2026 → Mar-Dec, 2027 → Jan-Apr
  const months2026 = useMemo(() => {
    const arr = [];
    for (let m = 2; m <= 11; m++) { // Mar=2 to Dec=11
      arr.push({ year: 2026, month: m });
    }
    return arr;
  }, []);

  const months2027 = useMemo(() => {
    const arr = [];
    for (let m = 0; m <= 3; m++) { // Jan=0 to Apr=3
      arr.push({ year: 2027, month: m });
    }
    return arr;
  }, []);

  return (
    <div className="paper-texture page-paper" style={yearStyles.container}>
      {/* 2026 section */}
      <div style={yearStyles.yearHeader}>2026</div>
      <div style={yearStyles.monthsGrid}>
        {months2026.map(({ year, month }) => (
          <MiniMonthMemo
            key={`${year}-${month}`}
            year={year}
            month={month}
            isCurrentMonth={year === currentYear && month === currentMonth}
            onSelectMonth={onSelectMonth}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>

      {/* 2027 section */}
      <div style={{ ...yearStyles.yearHeader, marginTop: '16px' }}>2027</div>
      <div style={yearStyles.monthsGrid}>
        {months2027.map(({ year, month }) => (
          <MiniMonthMemo
            key={`${year}-${month}`}
            year={year}
            month={month}
            isCurrentMonth={year === currentYear && month === currentMonth}
            onSelectMonth={onSelectMonth}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
});

export default YearView;

const yearStyles = {
  container: {
    width: '100%',
    borderRadius: '3px',
    overflow: 'auto',
    padding: '12px 8px 16px',
    boxSizing: 'border-box',
  },
  yearHeader: {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: '20px',
    color: GOLD,
    letterSpacing: '4px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  monthsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
  },
};

const miniStyles = {
  container: {
    padding: '6px 4px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 200ms',
    border: '1px solid transparent',
  },
  currentMonth: {
    background: 'rgba(196,155,42,0.08)',
    border: '1px solid rgba(196,155,42,0.25)',
    borderRadius: '4px',
  },
  monthName: {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: '11px',
    color: INK2,
    textAlign: 'center',
    marginBottom: '3px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  dayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '1px',
  },
  dayLabel: {
    fontFamily: SERIF,
    fontSize: '7px',
    fontWeight: 600,
    color: INK3,
    textAlign: 'center',
    lineHeight: 1,
    padding: '1px 0',
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
  },
  dateCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '1px 0',
    cursor: 'pointer',
    minHeight: '14px',
    position: 'relative',
  },
  dateNumber: {
    fontFamily: SERIF,
    fontSize: '9px',
    fontWeight: 500,
    color: INK,
    lineHeight: 1,
    width: '14px',
    height: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  todayNumber: {
    background: 'rgba(196,155,42,0.35)',
    fontWeight: 700,
    color: INK,
  },
  festivalDot: {
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    background: FEST_DOT,
    marginTop: '-1px',
  },
};
