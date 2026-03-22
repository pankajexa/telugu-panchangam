import React, { memo, useMemo } from 'react';
import FESTIVALS from '../data/festivals.js';
import { useLocation } from '../context/LocationContext';

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

const TELUGU_MONTH_COLORS = [
  'rgba(255, 152, 0, 0.18)',   // warm saffron
  'rgba(76, 175, 80, 0.18)',   // soft green
  'rgba(33, 150, 243, 0.18)',  // calm blue
  'rgba(156, 39, 176, 0.18)',  // gentle purple
  'rgba(0, 150, 136, 0.18)',   // teal
  'rgba(233, 30, 99, 0.18)',   // soft rose
  'rgba(121, 85, 72, 0.18)',   // warm brown
  'rgba(63, 81, 181, 0.18)',   // indigo
  'rgba(255, 87, 34, 0.18)',   // deep orange
  'rgba(0, 188, 212, 0.18)',   // cyan
  'rgba(139, 195, 74, 0.18)',  // light green
  'rgba(255, 193, 7, 0.18)',   // amber
  'rgba(103, 58, 183, 0.18)',  // deep purple
];

// Stronger opacity version for legend dots
const TELUGU_MONTH_DOT_COLORS = [
  'rgba(255, 152, 0, 0.6)',
  'rgba(76, 175, 80, 0.6)',
  'rgba(33, 150, 243, 0.6)',
  'rgba(156, 39, 176, 0.6)',
  'rgba(0, 150, 136, 0.6)',
  'rgba(233, 30, 99, 0.6)',
  'rgba(121, 85, 72, 0.6)',
  'rgba(63, 81, 181, 0.6)',
  'rgba(255, 87, 34, 0.6)',
  'rgba(0, 188, 212, 0.6)',
  'rgba(139, 195, 74, 0.6)',
  'rgba(255, 193, 7, 0.6)',
  'rgba(103, 58, 183, 0.6)',
];

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

// Returns the index of the Telugu month for a given date, or -1 if not found
function getTeluguMonthIndex(year, month, day, teluguMonths) {
  if (!teluguMonths || teluguMonths.length === 0) return -1;
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  for (let i = 0; i < teluguMonths.length; i++) {
    if (dateStr >= teluguMonths[i].start && dateStr <= teluguMonths[i].end) {
      return i;
    }
  }
  return -1;
}

function MiniMonth({ year, month, isCurrentMonth, onSelectMonth, onSelectDate, monthStyle, teluguMonths }) {
  const isTelugu = monthStyle === 'telugu';

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
          const teluguIdx = isTelugu ? getTeluguMonthIndex(year, month, d, teluguMonths) : -1;
          const teluguBg = teluguIdx >= 0
            ? TELUGU_MONTH_COLORS[teluguIdx % TELUGU_MONTH_COLORS.length]
            : undefined;
          return (
            <div
              key={d}
              style={{
                ...miniStyles.dateCell,
                ...(teluguBg ? { background: teluguBg, borderRadius: '2px' } : {}),
              }}
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

// Legend showing Telugu month names with color dots
const TeluguMonthLegend = memo(function TeluguMonthLegend({ teluguMonths }) {
  if (!teluguMonths || teluguMonths.length === 0) return null;
  return (
    <div style={legendStyles.container}>
      {teluguMonths.map((tm, i) => (
        <span key={i} style={legendStyles.item}>
          <span style={{
            ...legendStyles.dot,
            background: TELUGU_MONTH_DOT_COLORS[i % TELUGU_MONTH_DOT_COLORS.length],
          }} />
          <span style={legendStyles.label}>{tm.telugu}</span>
        </span>
      ))}
    </div>
  );
});

const YearView = memo(function YearView({ onSelectMonth, onSelectDate, currentYear, currentMonth, monthStyle = 'english' }) {
  const { teluguMonths } = useLocation();
  const isTelugu = monthStyle === 'telugu';

  // Calendar range: March 2026 - April 2027
  // Group: 2026 -> Mar-Dec, 2027 -> Jan-Apr
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
      {/* Telugu month legend */}
      {isTelugu && <TeluguMonthLegend teluguMonths={teluguMonths} />}

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
            monthStyle={monthStyle}
            teluguMonths={isTelugu ? teluguMonths : undefined}
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
            monthStyle={monthStyle}
            teluguMonths={isTelugu ? teluguMonths : undefined}
          />
        ))}
      </div>
    </div>
  );
});

export default YearView;

const legendStyles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '4px 8px',
    marginBottom: '10px',
    padding: '0 4px',
  },
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
  },
  dot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  label: {
    fontFamily: TELUGU,
    fontSize: '10px',
    color: INK2,
    lineHeight: 1.2,
  },
};

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
