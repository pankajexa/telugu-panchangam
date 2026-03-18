import React, { memo, useMemo, useCallback } from 'react';
import { TELUGU_MONTHS } from '../data/teluguMonths';
import { getFestival } from '../data/festivals';

const ENG_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const ENG_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const INK  = '#3a150a';
const INK2 = '#6b2d15';
const INK3 = '#915838';
const INK4 = '#b88050';
const FEST = '#d45500';
const GREEN = 'rgba(46, 125, 50, 0.28)';
const GREEN_BORDER = 'rgba(46, 125, 50, 0.55)';
const SERIF = "'Inter', system-ui, sans-serif";
const DATE_FONT = "'Abril Fatface', Georgia, serif";
const TELUGU = "'Noto Serif Telugu', serif";

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateShort(str) {
  const d = parseDate(str);
  return `${ENG_MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date, startStr, endStr) {
  const s = parseDate(startStr);
  const e = parseDate(endStr);
  s.setHours(0,0,0,0);
  e.setHours(0,0,0,0);
  date.setHours(0,0,0,0);
  return date >= s && date <= e;
}

function isRangeStart(date, startStr) {
  return isSameDay(date, parseDate(startStr));
}

function isRangeEnd(date, endStr) {
  return isSameDay(date, parseDate(endStr));
}

// Build a standard western calendar grid for a month
function buildCalGrid(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [];
  let week = Array(7).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (firstDay + d - 1) % 7;
    const weekIdx = Math.floor((firstDay + d - 1) / 7);
    if (!weeks[weekIdx]) weeks[weekIdx] = Array(7).fill(null);
    weeks[weekIdx][dow] = d;
  }

  // Fill remaining
  const totalWeeks = Math.ceil((daysInMonth + firstDay) / 7);
  for (let i = 0; i < totalWeeks; i++) {
    if (!weeks[i]) weeks[i] = Array(7).fill(null);
  }

  return weeks;
}

// Mini English month calendar with highlighted date range
const MiniMonth = memo(function MiniMonth({ year, month, startStr, endStr, onSelectDate }) {
  const weeks = useMemo(() => buildCalGrid(year, month), [year, month]);
  const today = useMemo(() => new Date(), []);

  return (
    <div style={styles.miniMonth}>
      <div style={styles.miniMonthName}>{ENG_MONTHS[month]} {year}</div>
      <div style={styles.miniDayHeaders}>
        {ENG_DAYS.map(d => (
          <div key={d} style={styles.miniDayHeader}>{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} style={styles.miniWeekRow}>
          {week.map((day, di) => {
            if (!day) return <div key={di} style={styles.miniCell} />;

            const date = new Date(year, month, day);
            const inRange = isInRange(new Date(year, month, day), startStr, endStr);
            const isStart = isRangeStart(new Date(year, month, day), startStr);
            const isEnd = isRangeEnd(new Date(year, month, day), endStr);
            const isToday = isSameDay(date, today);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const festival = getFestival(dateStr);

            return (
              <div
                key={di}
                style={{
                  ...styles.miniCell,
                  ...(inRange ? styles.miniCellInRange : {}),
                  ...(isStart ? styles.miniCellStart : {}),
                  ...(isEnd ? styles.miniCellEnd : {}),
                }}
                onClick={() => onSelectDate && onSelectDate(year, month, day)}
              >
                <span style={{
                  ...styles.miniDay,
                  ...(di === 0 ? styles.miniSunday : {}),
                  ...(isToday ? styles.miniToday : {}),
                  ...(festival?.major ? styles.miniFestival : {}),
                }}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

const TeluguMonthView = memo(function TeluguMonthView({ teluguMonthIndex, onPrev, onNext, onSelectDate }) {
  const tm = TELUGU_MONTHS[teluguMonthIndex];
  if (!tm) return null;

  const startDate = parseDate(tm.start);
  const endDate = parseDate(tm.end);

  // Which English months does this Telugu month span?
  const engMonths = useMemo(() => {
    const months = [];
    let cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    while (cur <= endMonth) {
      months.push({ year: cur.getFullYear(), month: cur.getMonth() });
      cur.setMonth(cur.getMonth() + 1);
    }
    return months;
  }, [teluguMonthIndex]);

  return (
    <div className="paper-texture page-paper" style={styles.container}>
      {/* Telugu month header */}
      <div style={styles.header}>
        <button style={styles.navBtn} onClick={onPrev}>‹</button>
        <div style={styles.titleBlock}>
          <div style={styles.teluguName}>{tm.telugu}</div>
          <div style={styles.englishName}>{tm.english}</div>
          <div style={styles.dateRange}>
            {formatDateShort(tm.start)} – {formatDateShort(tm.end)}
          </div>
        </div>
        <button style={styles.navBtn} onClick={onNext}>›</button>
      </div>

      {/* English month grids with highlighting */}
      <div style={styles.monthsWrap}>
        {engMonths.map(({ year, month }) => (
          <MiniMonth
            key={`${year}-${month}`}
            year={year}
            month={month}
            startStr={tm.start}
            endStr={tm.end}
            onSelectDate={onSelectDate}
          />
        ))}
      </div>
    </div>
  );
});

export default TeluguMonthView;

const styles = {
  container: {
    width: '100%',
    borderRadius: '3px',
    overflow: 'hidden',
    padding: '6px 0 8px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 12px 6px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    fontFamily: SERIF,
    fontSize: '28px',
    color: INK2,
    cursor: 'pointer',
    padding: '0 8px',
    lineHeight: 1,
    opacity: 0.7,
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  teluguName: {
    fontFamily: TELUGU,
    fontWeight: 800,
    fontSize: '20px',
    color: INK,
  },
  englishName: {
    fontFamily: SERIF,
    fontWeight: 600,
    fontSize: '11px',
    color: INK3,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  dateRange: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '10px',
    color: INK4,
    marginTop: '2px',
  },

  // Month grids
  monthsWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '4px 10px',
  },
  miniMonth: {
    width: '100%',
  },
  miniMonthName: {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: '12px',
    color: INK2,
    textAlign: 'center',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  miniDayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0',
  },
  miniDayHeader: {
    fontFamily: SERIF,
    fontWeight: 600,
    fontSize: '8px',
    color: INK4,
    textAlign: 'center',
    padding: '2px 0',
    letterSpacing: '0.5px',
  },
  miniWeekRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0',
  },
  miniCell: {
    textAlign: 'center',
    padding: '4px 0',
    cursor: 'pointer',
  },
  miniCellInRange: {
    background: GREEN,
  },
  miniCellStart: {
    borderRadius: '10px 0 0 10px',
    background: GREEN,
    borderLeft: `2px solid ${GREEN_BORDER}`,
  },
  miniCellEnd: {
    borderRadius: '0 10px 10px 0',
    background: GREEN,
    borderRight: `2px solid ${GREEN_BORDER}`,
  },
  miniDay: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '12px',
    color: INK,
    lineHeight: 1,
  },
  miniSunday: {
    fontWeight: 600,
  },
  miniToday: {
    color: '#a03020',
    fontWeight: 700,
  },
  miniFestival: {
    color: FEST,
    fontWeight: 700,
  },
};
