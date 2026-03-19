import React, { memo, useMemo, useCallback, useRef } from 'react';
import { getPanchangamForDate } from '../data/panchangam';
import { useLocation } from '../context/LocationContext';

const TELUGU_DAY_SHORT = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const INK  = '#3a150a';
const INK2 = '#6b2d15';
const INK3 = '#915838';
const INK4 = '#b88050';
const FEST = '#d45500';
const SERIF = "'Inter', system-ui, sans-serif";
const DATE_FONT = "'Abril Fatface', Georgia, serif";
const TELUGU = "'Noto Serif Telugu', serif";

// Moon SVG icons — placed in top-right corner of cell
function NewMoonIcon() {
  // Dark filled moon — new moon (no light)
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" style={{ display: 'block' }}>
      <circle cx="8" cy="8" r="6.5" stroke={INK} strokeWidth="1.2" fill="none" opacity="0.5" />
      <circle cx="8" cy="8" r="5" fill={INK} opacity="0.2" />
    </svg>
  );
}

function FullMoonIcon() {
  // Bright moon with craters — full moon
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" style={{ display: 'block' }}>
      <circle cx="8" cy="8" r="6.5" stroke={INK2} strokeWidth="1.2" fill="none" opacity="0.6" />
      <circle cx="8" cy="8" r="5.5" fill={INK4} opacity="0.2" />
      {/* Craters */}
      <circle cx="6" cy="6" r="1.5" stroke={INK2} strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="10" cy="9" r="1" stroke={INK2} strokeWidth="0.4" fill="none" opacity="0.25" />
      <circle cx="7" cy="10.5" r="0.8" stroke={INK2} strokeWidth="0.3" fill="none" opacity="0.2" />
    </svg>
  );
}

function buildMonthGrid(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const numWeeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
  const grid = Array.from({ length: 7 }, () => Array(numWeeks).fill(null));

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (firstDayOfWeek + d - 1) % 7;
    const week = Math.floor((firstDayOfWeek + d - 1) / 7);
    grid[dow][week] = d;
  }

  return { grid, daysInMonth, numWeeks };
}

const MonthView = memo(function MonthView({ year, month, onSelectDate, onPrevMonth, onNextMonth }) {
  const { location } = useLocation();
  const { grid, numWeeks } = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const today = useMemo(() => {
    const now = new Date();
    if (now.getFullYear() === year && now.getMonth() === month) return now.getDate();
    return null;
  }, [year, month]);

  const panchangamData = useMemo(() => {
    const data = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      data[d] = getPanchangamForDate(new Date(year, month, d), location);
    }
    return data;
  }, [year, month, location]);

  // Swipe handling for month navigation
  const touchRef = useRef({ startX: 0, startY: 0 });

  const onTouchStart = useCallback((e) => {
    if (e.touches.length > 1) return;
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  }, []);

  const onTouchEnd = useCallback((e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.startX;
    const dy = t.clientY - touchRef.current.startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) onNextMonth();
      else onPrevMonth();
    }
  }, [onNextMonth, onPrevMonth]);

  const colWidth = `${(100 / (numWeeks + 1)).toFixed(2)}%`;
  const dayColWidth = `${(100 / (numWeeks + 1) * 1.2).toFixed(2)}%`;

  return (
    <div
      className="paper-texture page-paper"
      style={styles.container}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Month header */}
      <div style={styles.header}>
        <button style={styles.navBtn} onClick={onPrevMonth}>‹</button>
        <div style={styles.monthTitle}>
          <span style={styles.monthName}>{MONTH_NAMES[month]}</span>
          <span style={styles.yearText}>{year}</span>
        </div>
        <button style={styles.navBtn} onClick={onNextMonth}>›</button>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {TELUGU_DAY_SHORT.map((dayName, row) => (
          <div key={row} style={{
            ...styles.row,
            ...(row === 0 ? styles.sundayRow : {}),
            borderBottom: row < 6 ? '1px solid rgba(58,21,10,0.08)' : 'none',
          }}>
            <div style={{
              ...styles.dayNameCell,
              ...(row === 0 ? styles.sundayDayName : {}),
              width: dayColWidth,
            }}>
              {dayName}
            </div>

            {grid[row].map((day, col) => (
              <div
                key={col}
                style={{
                  ...styles.cell,
                  width: colWidth,
                  borderLeft: '1px solid rgba(58,21,10,0.06)',
                }}
                onClick={() => day && onSelectDate(day)}
              >
                {day && (
                  <DayCell
                    day={day}
                    data={panchangamData[day]}
                    isSunday={row === 0}
                    isToday={day === today}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

const DayCell = memo(function DayCell({ day, data, isSunday, isToday }) {
  const hasFestival = !!data?.festival;
  const isMajor = hasFestival && data.festival.major;
  const tithiName = data?.tithi?.name || '';
  const isAmavasya = tithiName === 'అమావాస్య';
  const isPurnima = tithiName === 'పూర్ణిమ';

  return (
    <div style={{
      ...styles.cellInner,
      ...(isMajor ? styles.festivalCellMajor : {}),
      ...(hasFestival && !isMajor ? styles.festivalCellMinor : {}),
    }}>
      {/* Moon icon — top right corner of the cell */}
      {(isAmavasya || isPurnima) && (
        <div style={styles.moonCorner}>
          {isAmavasya ? <NewMoonIcon /> : <FullMoonIcon />}
        </div>
      )}

      {/* Festival star marker — top left */}
      {isMajor && <div style={styles.festivalStar}>✦</div>}

      {/* Date number + today circle */}
      <div style={styles.dateWrap}>
        {isToday && (
          <svg viewBox="0 0 44 44" style={styles.todayCircle}>
            <path
              d="M22,3 Q38,2 40,14 Q43,26 34,36 Q24,44 12,40 Q2,34 2,22 Q1,10 12,4 Q18,2 22,3"
              fill="none" stroke="#a03020" strokeWidth="1.6" strokeLinecap="round" opacity="0.7"
            />
          </svg>
        )}
        <div style={{
          ...styles.cellDate,
          ...(isSunday ? styles.sundayDate : {}),
          ...(isMajor ? styles.majorDate : {}),
          ...(isToday ? styles.todayDate : {}),
        }}>
          {day}
        </div>
      </div>

      {/* Info below date */}
      <div style={styles.cellInfo}>
        {hasFestival ? (
          <div style={isMajor ? styles.festivalNameMajor : styles.festivalNameMinor}>
            {data.festival.telugu}
          </div>
        ) : (isAmavasya || isPurnima) ? (
          <div style={styles.moonLabel}>{isAmavasya ? 'అమావాస్య' : 'పూర్ణిమ'}</div>
        ) : data ? (
          <div style={styles.cellTithi}>{tithiName}</div>
        ) : null}
      </div>
    </div>
  );
});

export default MonthView;

const styles = {
  container: {
    width: '100%',
    borderRadius: '3px',
    overflow: 'hidden',
    padding: '6px 0 4px',
    touchAction: 'pan-y',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 12px 8px',
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
  monthTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  monthName: {
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: '18px',
    color: INK,
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  yearText: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '12px',
    color: INK3,
    letterSpacing: '2px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 4px',
  },
  row: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '54px',
  },
  sundayRow: {
    background: 'rgba(58,21,10,0.02)',
  },
  dayNameCell: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '11px',
    color: INK2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 0',
    flexShrink: 0,
  },
  sundayDayName: {
    color: INK,
    fontWeight: 800,
  },
  cell: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '4px 1px 2px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  cellInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
    width: '100%',
    position: 'relative',
  },
  dateWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    position: 'absolute',
    width: '36px',
    height: '36px',
    pointerEvents: 'none',
  },
  cellDate: {
    fontFamily: DATE_FONT,
    fontWeight: 400,
    fontSize: '22px',
    color: INK,
    lineHeight: 1,
  },
  todayDate: {
    color: '#a03020',
  },
  sundayDate: {
    textShadow: `0.5px 0 0 ${INK}`,
  },
  majorDate: {
    color: FEST,
  },
  cellInfo: {
    marginTop: '4px',
    minHeight: '10px',
  },

  // Festival cells — major festivals get a strong visual treatment
  festivalCellMajor: {
    background: 'rgba(212,85,0,0.06)',
    borderRadius: '4px',
    padding: '3px 2px 2px',
    margin: '-2px 0',
    borderLeft: `2.5px solid rgba(212,85,0,0.4)`,
  },
  festivalCellMinor: {
    background: 'rgba(212,85,0,0.03)',
    borderRadius: '3px',
    padding: '3px 2px 2px',
    margin: '-2px 0',
    borderLeft: `1.5px solid rgba(212,85,0,0.2)`,
  },
  festivalStar: {
    position: 'absolute',
    top: '0',
    left: '1px',
    fontSize: '7px',
    color: FEST,
    opacity: 0.7,
    lineHeight: 1,
  },
  festivalNameMajor: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '7px',
    color: FEST,
    lineHeight: 1.15,
    textAlign: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  festivalNameMinor: {
    fontFamily: TELUGU,
    fontWeight: 600,
    fontSize: '6.5px',
    color: FEST,
    opacity: 0.8,
    lineHeight: 1.15,
    textAlign: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Moon — positioned in top-right corner
  moonCorner: {
    position: 'absolute',
    top: '-1px',
    right: '0',
    lineHeight: 0,
  },
  moonLabel: {
    fontFamily: TELUGU,
    fontWeight: 600,
    fontSize: '6.5px',
    color: INK2,
    lineHeight: 1,
    textAlign: 'center',
  },

  // Regular tithi
  cellTithi: {
    fontFamily: TELUGU,
    fontWeight: 500,
    fontSize: '7px',
    color: INK3,
    lineHeight: 1.2,
    textAlign: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
