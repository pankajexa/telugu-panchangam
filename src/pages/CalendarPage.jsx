import { useState, useMemo, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { getPanchangamForDate } from '../data/panchangam';
import { TITHIS, TITHIS_EN } from '../data/constants';
import { ChevronLeft, ChevronRight, Grid3x3, CalendarDays, Sunrise, Sunset } from 'lucide-react';
import { DiyaIcon, MalaIcon, CrescentIcon } from '../components/icons/HinduIcons';
import { getPractices } from '../data/festivalPractices';
import PracticesCard from '../components/today/PracticesCard';

// ═══════════════════════════════════════════════════
// Moon badges
// ═══════════════════════════════════════════════════
const FullMoonBadge = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12">
    <circle cx="6" cy="6" r="5" fill="#FFF3D4" stroke="#D4A800" strokeWidth="0.8" />
    <circle cx="4.5" cy="4.5" r="1" fill="#E8D080" opacity="0.5" />
  </svg>
);
const NewMoonBadge = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12">
    <circle cx="6" cy="6" r="5" fill="#2A2A2A" stroke="#555" strokeWidth="0.8" />
  </svg>
);

// ═══════════════════════════════════════════════════
// Hindu month color palette
// ═══════════════════════════════════════════════════
const HINDU_MONTH_COLORS = {
  Phalguna:     { bg: 'linear-gradient(145deg, #F5EDE4, #EDE3D8)', bgSolid: '#F0E8DC', border: 'rgba(180,155,120,0.18)', text: '#7A6548', dot: '#B8956A' },
  Chaitra:      { bg: 'linear-gradient(145deg, #FFF8E7, #FFF3D6)', bgSolid: '#FFF5DC', border: 'rgba(200,170,100,0.15)', text: '#8B7332', dot: '#E8A817' },
  Vaishakha:    { bg: 'linear-gradient(145deg, #FFF0EC, #FFE8E2)', bgSolid: '#FFECE6', border: 'rgba(200,130,110,0.15)', text: '#9B5A48', dot: '#E63B2E' },
  Jyeshtha:     { bg: 'linear-gradient(145deg, #F0F5ED, #E6EDE2)', bgSolid: '#ECF2E8', border: 'rgba(120,160,100,0.15)', text: '#5A7348', dot: '#6B8F4E' },
  Ashadha:      { bg: 'linear-gradient(145deg, #EDF2F8, #E2EAF4)', bgSolid: '#E8EFF8', border: 'rgba(100,140,190,0.15)', text: '#4A6580', dot: '#5A8AB5' },
  Shravana:     { bg: 'linear-gradient(145deg, #F5F0F8, #EDE6F4)', bgSolid: '#F0EAF6', border: 'rgba(140,110,170,0.15)', text: '#6A4E80', dot: '#8B6AAF' },
  Bhadrapada:   { bg: 'linear-gradient(145deg, #FFF5E8, #FFEFD8)', bgSolid: '#FFF2E0', border: 'rgba(190,155,80,0.15)', text: '#806832', dot: '#C4961E' },
  Ashwina:      { bg: 'linear-gradient(145deg, #FFF3F0, #FFECE6)', bgSolid: '#FFF0EC', border: 'rgba(200,120,100,0.15)', text: '#904840', dot: '#D45A4A' },
  Kartika:      { bg: 'linear-gradient(145deg, #FFF8E0, #FFF2CC)', bgSolid: '#FFF5D6', border: 'rgba(200,170,60,0.15)', text: '#8A7020', dot: '#D4A818' },
  Margashirsha: { bg: 'linear-gradient(145deg, #EFF8F5, #E4F2EE)', bgSolid: '#EAF5F0', border: 'rgba(100,170,150,0.15)', text: '#3E7A68', dot: '#4EA88A' },
  Pausha:       { bg: 'linear-gradient(145deg, #F0F3F8, #E6ECF5)', bgSolid: '#ECF0F8', border: 'rgba(110,130,180,0.15)', text: '#4A5A80', dot: '#6478B0' },
  Magha:        { bg: 'linear-gradient(145deg, #F8F0F2, #F2E6EA)', bgSolid: '#F5ECF0', border: 'rgba(170,110,130,0.15)', text: '#804A5A', dot: '#B06478' },
};
const DEFAULT_MC = { bg: 'linear-gradient(145deg, #FFF8E7, #FFF3D6)', bgSolid: '#FFF5DC', border: 'rgba(200,170,100,0.15)', text: '#8B7332', dot: '#E8A817' };
function getMC(masaEnglish) {
  if (!masaEnglish) return DEFAULT_MC;
  // Strip "Adhika " prefix
  const base = masaEnglish.replace(/^Adhika\s+/, '');
  return HINDU_MONTH_COLORS[base] || DEFAULT_MC;
}

const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS_EN = ['Mo','Tu','We','Th','Fr','Sa','Su'];
const WEEKDAYS_TE = ['సో','మం','బు','గు','శు','శ','ఆ'];
const WEEKDAYS_TINY = ['M','T','W','T','F','S','S'];

// ═══════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════
function buildGrid(year, month, location) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const data = getPanchangamForDate(date, location);
    cells.push({ day: d, date, data });
  }
  return cells;
}

// Find which two Hindu months a Gregorian month spans + boundary day
function findHinduSpan(year, month, location, teluguMonths) {
  const first = getPanchangamForDate(new Date(year, month, 1), location);
  const last = getPanchangamForDate(new Date(year, month + 1, 0), location);
  const m1 = first?.masam?.english || '';
  const m2 = last?.masam?.english || '';
  if (m1 === m2) return { hindu1: m1, hindu2: m1, boundaryDay: 0, singleMonth: true };
  // Find boundary day (last day of m1)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let boundary = Math.floor(daysInMonth / 2);
  for (let d = 1; d <= daysInMonth; d++) {
    const data = getPanchangamForDate(new Date(year, month, d), location);
    if (data?.masam?.english !== m1) { boundary = d - 1; break; }
  }
  return { hindu1: m1, hindu2: m2, boundaryDay: boundary, singleMonth: false };
}

// Build Hindu month grid: iterate from start to end date
function buildHinduGrid(teluguMonth, location) {
  if (!teluguMonth) return [];
  const startDate = new Date(teluguMonth.start + 'T00:00:00');
  const endDate = new Date(teluguMonth.end + 'T00:00:00');
  const days = [];
  const d = new Date(startDate);
  while (d <= endDate) {
    const data = getPanchangamForDate(d, location);
    days.push({
      date: new Date(d),
      gregDay: d.getDate(),
      gregMonth: d.getMonth(),
      gregYear: d.getFullYear(),
      data,
    });
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// ═══════════════════════════════════════════════════
// Mini month for year view
// ═══════════════════════════════════════════════════
function MiniMonth({ year, month, today, location, onSelectMonth, pick, font }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const dayInfo = useMemo(() => {
    const info = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const data = getPanchangamForDate(new Date(year, month, d), location);
      if (data) info[d] = { festival: data.festival || null, tithiIndex: data.tithiIndex };
    }
    return info;
  }, [year, month, daysInMonth, location]);
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const isTodayDay = (d) => d === today.getDate() && isCurrentMonth;
  return (
    <div style={miniS.card} onClick={() => onSelectMonth(year, month)}>
      <div style={{ ...miniS.monthName, color: isCurrentMonth ? '#E63B2E' : '#1A1A1A' }}>{MONTH_SHORT[month]}</div>
      <div style={miniS.weekRow}>{WEEKDAYS_TINY.map((d, i) => <div key={i} style={miniS.weekDay}>{d}</div>)}</div>
      <div style={miniS.grid}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} style={miniS.emptyCell} />;
          const isTd = isTodayDay(d);
          const info = dayInfo[d];
          const isMF = info?.festival?.major;
          return (
            <div key={d} style={{ ...miniS.dayCell, background: isTd ? '#E63B2E' : isMF ? '#FFF0E8' : 'transparent', color: isTd ? 'white' : isMF ? '#C44020' : '#555', fontWeight: isTd || isMF ? 700 : 400, borderRadius: isTd ? 4 : isMF ? 3 : 0, }}>
              {d}
              {!isTd && (info?.tithiIndex === 14 || info?.tithiIndex === 29) && <div style={{ position: 'absolute', top: -1, right: -1 }}>{info.tithiIndex === 14 ? <FullMoonBadge size={7} /> : <NewMoonBadge size={7} />}</div>}
              {info?.festival && !isTd && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: isMF ? 4 : 3, height: isMF ? 4 : 3, borderRadius: '50%', background: isMF ? '#E63B2E' : '#E8A817' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
const miniS = {
  card: { background: 'white', borderRadius: 12, padding: '10px 8px 8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },
  monthName: { fontSize: 12, fontWeight: 700, textAlign: 'center', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  weekRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' },
  weekDay: { fontSize: 7, color: '#CCC', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, padding: '1px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' },
  emptyCell: { aspectRatio: '1' },
  dayCell: { fontSize: 9, textAlign: 'center', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' },
};

// ═══════════════════════════════════════════════════
// Main CalendarPage
// ═══════════════════════════════════════════════════
export default function CalendarPage() {
  const { t, pick, font, language } = useLanguage();
  const { location, teluguMonths } = useLocation();

  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'year'
  const [calendarMode, setCalendarMode] = useState('english'); // 'english' | 'hindu'
  const [hinduMonthIdx, setHinduMonthIdx] = useState(() => {
    // Find today's Telugu month
    if (!teluguMonths) return 0;
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const idx = teluguMonths.findIndex(m => todayStr >= m.start && todayStr <= m.end);
    return idx >= 0 ? idx : 0;
  });
  const [selectedTithiIdx, setSelectedTithiIdx] = useState(-1);

  const weekdays = language === 'te' ? WEEKDAYS_TE : WEEKDAYS_EN;

  // ── English view data ──
  const cells = useMemo(() => viewMode === 'month' && calendarMode === 'english' ? buildGrid(currentYear, currentMonth, location) : [], [currentYear, currentMonth, location, viewMode, calendarMode]);
  const hinduSpan = useMemo(() => viewMode === 'month' && calendarMode === 'english' ? findHinduSpan(currentYear, currentMonth, location, teluguMonths) : null, [currentYear, currentMonth, location, teluguMonths, viewMode, calendarMode]);
  const firstDayData = useMemo(() => getPanchangamForDate(new Date(currentYear, currentMonth, 1), location), [currentYear, currentMonth, location]);
  const masaLabel = pick(firstDayData?.masam?.telugu, firstDayData?.masam?.english) || '';

  // ── Hindu view data ──
  const currentTeluguMonth = teluguMonths?.[hinduMonthIdx] || null;
  const hinduDays = useMemo(() => calendarMode === 'hindu' && currentTeluguMonth ? buildHinduGrid(currentTeluguMonth, location) : [], [calendarMode, currentTeluguMonth, location]);
  const hinduStartDow = useMemo(() => {
    if (!hinduDays.length) return 0;
    return (hinduDays[0].date.getDay() + 6) % 7;
  }, [hinduDays]);
  const hmc = getMC(currentTeluguMonth?.english);

  // ── Selected day data (both views) ──
  const selectedData = useMemo(() => {
    if (calendarMode === 'hindu') {
      if (selectedTithiIdx < 0 || !hinduDays[selectedTithiIdx]) return null;
      return hinduDays[selectedTithiIdx].data;
    }
    if (!selectedDay || viewMode !== 'month') return null;
    return getPanchangamForDate(new Date(currentYear, currentMonth, selectedDay), location);
  }, [calendarMode, selectedTithiIdx, hinduDays, currentYear, currentMonth, selectedDay, location, viewMode]);

  const selectedPractices = useMemo(() => selectedData ? getPractices(selectedData.festival, selectedData.vrathams) : null, [selectedData]);

  const isToday = (day) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  const isTodayDate = (date) => date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

  // ── Navigation ──
  const handlePrev = useCallback(() => {
    if (calendarMode === 'hindu') { setHinduMonthIdx(i => i > 0 ? i - 1 : 0); setSelectedTithiIdx(-1); return; }
    if (viewMode === 'year') { setCurrentYear(y => y - 1); return; }
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); } else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  }, [currentMonth, viewMode, calendarMode]);

  const handleNext = useCallback(() => {
    if (calendarMode === 'hindu') { setHinduMonthIdx(i => i < (teluguMonths?.length || 1) - 1 ? i + 1 : i); setSelectedTithiIdx(-1); return; }
    if (viewMode === 'year') { setCurrentYear(y => y + 1); return; }
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); } else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  }, [currentMonth, viewMode, calendarMode, teluguMonths]);

  const handleSelectMonth = useCallback((year, month) => { setCurrentYear(year); setCurrentMonth(month); setViewMode('month'); setSelectedDay(null); }, []);

  // Touch swipe
  const touchRef = useRef({ startX: 0 });
  const onTouchStart = useCallback((e) => { touchRef.current.startX = e.touches[0].clientX; }, []);
  const onTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    if (Math.abs(dx) > 60) { dx < 0 ? handleNext() : handlePrev(); }
  }, [handleNext, handlePrev]);

  // Year view months
  const yearMonths = useMemo(() => Array.from({ length: 12 }, (_, m) => ({ year: currentYear, month: m })), [currentYear]);

  // Hindu month Gregorian span label
  const hinduSpanLabel = useMemo(() => {
    if (!hinduDays.length) return '';
    const f = hinduDays[0], l = hinduDays[hinduDays.length - 1];
    return `${MONTH_SHORT[f.gregMonth]} ${f.gregDay} – ${MONTH_SHORT[l.gregMonth]} ${l.gregDay}, ${l.gregYear}`;
  }, [hinduDays]);

  // ─── Render ────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.content}>

        {/* ═══ HEADER ═══ */}
        <div style={S.header}>
          <div style={{ flex: 1 }}>
            {calendarMode === 'english' ? (
              <>
                <h1 style={S.title}>{viewMode === 'month' ? `${MONTH_NAMES_EN[currentMonth]} ${currentYear}` : currentYear}</h1>
                <div style={S.subtitle}>{viewMode === 'month' ? t('page.samvatsaram') : (language === 'te' ? 'సంవత్సర వీక్షణ' : 'Year View')}</div>
              </>
            ) : (
              <>
                <h1 style={{ ...S.title, color: hmc.text }}>{pick(currentTeluguMonth?.telugu, currentTeluguMonth?.english)}</h1>
                <div style={S.subtitle}>{hinduSpanLabel}</div>
              </>
            )}
          </div>
          <div style={S.headerActions}>
            {calendarMode === 'english' && (
              <button style={{ ...S.viewToggle, background: viewMode === 'year' ? '#E63B2E' : 'white' }} onClick={() => setViewMode(v => v === 'month' ? 'year' : 'month')}>
                {viewMode === 'month' ? <Grid3x3 size={16} color="#666" strokeWidth={1.8} /> : <CalendarDays size={16} color="white" strokeWidth={1.8} />}
              </button>
            )}
            <button style={S.navBtn} onClick={handlePrev}><ChevronLeft size={18} color="#666" /></button>
            <button style={S.navBtn} onClick={handleNext}><ChevronRight size={18} color="#666" /></button>
          </div>
        </div>

        {/* ═══ VIEW MODE TOGGLE ═══ */}
        {viewMode === 'month' && (
          <div style={S.toggleTrack}>
            {['english', 'hindu'].map(mode => (
              <div key={mode} onClick={() => { setCalendarMode(mode); if (mode === 'hindu') setSelectedTithiIdx(-1); }} style={{
                ...S.toggleOption,
                background: calendarMode === mode ? 'white' : 'transparent',
                color: calendarMode === mode ? '#1A1A1A' : '#999',
                boxShadow: calendarMode === mode ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>
                {mode === 'english' ? (language === 'te' ? 'ఇంగ్లీష్ నెల' : 'English Month') : (language === 'te' ? 'తెలుగు నెల' : 'Telugu Month')}
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ═══ ENGLISH MONTH VIEW ═══ */}
        {/* ═══════════════════════════════════════════ */}
        {viewMode === 'month' && calendarMode === 'english' && (
          <>
            {/* Hindu month span bar */}
            {hinduSpan && !hinduSpan.singleMonth && (() => {
              const mc1 = getMC(hinduSpan.hindu1), mc2 = getMC(hinduSpan.hindu2);
              const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
              const pct = Math.round((hinduSpan.boundaryDay / daysInMonth) * 100);
              return (
                <div style={{ marginBottom: 14 }}>
                  <div style={S.spanBar}>
                    <div onClick={() => { const idx = teluguMonths?.findIndex(m => m.english === hinduSpan.hindu1); if (idx >= 0) { setCalendarMode('hindu'); setHinduMonthIdx(idx); setSelectedTithiIdx(-1); }}} style={{ width: `${pct}%`, background: mc1.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', borderRight: '2.5px dashed rgba(0,0,0,0.12)' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: mc1.text }}>{pick(undefined, hinduSpan.hindu1)}</span>
                    </div>
                    <div onClick={() => { const idx = teluguMonths?.findIndex(m => m.english === hinduSpan.hindu2); if (idx >= 0) { setCalendarMode('hindu'); setHinduMonthIdx(idx); setSelectedTithiIdx(-1); }}} style={{ width: `${100 - pct}%`, background: mc2.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: mc2.text }}>{pick(undefined, hinduSpan.hindu2)}</span>
                    </div>
                  </div>
                  <div style={S.spanLegend}>
                    {[{ n: hinduSpan.hindu1, c: mc1 }, { n: hinduSpan.hindu2, c: mc2 }].map(h => (
                      <div key={h.n} style={S.spanLegendItem}><div style={{ width: 8, height: 8, borderRadius: 4, background: h.c.dot }} /><span style={S.spanLegendText}>{h.n}</span></div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Weekday headers */}
            <div style={S.weekRow}>{weekdays.map(d => <div key={d} style={{ ...S.weekDay, fontFamily: font }}>{d}</div>)}</div>

            {/* Grid */}
            <div style={S.grid} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {cells.map((cell, i) => {
                if (!cell) return <div key={`e${i}`} />;
                const { day, data } = cell;
                const isTodayCell = isToday(day);
                const isSelected = selectedDay === day && !isTodayCell;
                const tithiText = data ? pick(data.tithi.name, data.tithi.nameEn) : '';
                const shortTithi = tithiText ? tithiText.slice(0, 8) : '';
                const fest = data?.festival;
                const isMF = fest?.major;
                const hasVrat = data?.vrathams?.length > 0;
                const isPurnima = data?.tithiIndex === 14;
                const isAmavasya = data?.tithiIndex === 29;
                const mc = getMC(data?.masam?.english);
                const isBoundary = hinduSpan && !hinduSpan.singleMonth && day === hinduSpan.boundaryDay;
                const isNewMonth = hinduSpan && !hinduSpan.singleMonth && day === hinduSpan.boundaryDay + 1;

                return (
                  <div key={day} onClick={() => setSelectedDay(day)} style={{
                    ...S.cell,
                    background: isTodayCell ? 'linear-gradient(135deg, #E63B2E, #C62828)' : isSelected ? mc.bg : mc.bg,
                    border: isTodayCell ? 'none' : isSelected ? `1.5px solid ${mc.dot}` : isBoundary ? `1.5px dashed ${mc.dot}66` : `1px solid ${mc.border}`,
                    boxShadow: isTodayCell ? '0 2px 8px rgba(230,59,46,0.3)' : isSelected ? `0 2px 8px ${mc.dot}22` : 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.02)',
                  }}>
                    {isNewMonth && !isTodayCell && <div style={{ position: 'absolute', top: -1, left: -1, right: -1, height: 3, borderRadius: '12px 12px 0 0', background: `linear-gradient(90deg, ${mc.dot}, ${mc.dot}88)` }} />}
                    <div style={{ fontSize: 14, fontWeight: isTodayCell || isMF ? 700 : 600, color: isTodayCell ? 'white' : mc.text }}>{day}</div>
                    <div style={{ fontSize: 7, color: isTodayCell ? 'rgba(255,255,255,0.8)' : `${mc.text}88`, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px', fontFamily: font }}>{shortTithi}</div>
                    {!isTodayCell && (isPurnima || isAmavasya) && <div style={{ position: 'absolute', top: 2, right: 2 }}>{isPurnima ? <FullMoonBadge size={11} /> : <NewMoonBadge size={11} />}</div>}
                    {(fest || hasVrat) && !isTodayCell && <div style={{ position: 'absolute', bottom: 3, display: 'flex', gap: 2 }}>{isMF && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#E63B2E' }} />}{fest && !isMF && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8A817' }} />}{hasVrat && !fest && <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#2D8A39' }} />}</div>}
                    {isTodayCell && fest && <div style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: '50%', background: 'white' }} />}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={S.legend}>
              <div style={S.legendItem}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E63B2E' }} /><span style={S.legendText}>{language === 'te' ? 'పండుగ' : 'Festival'}</span></div>
              <div style={S.legendItem}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8A817' }} /><span style={S.legendText}>{language === 'te' ? 'ఇతర' : 'Observance'}</span></div>
              <div style={S.legendItem}><div style={{ width: 4, height: 4, borderRadius: '50%', background: '#2D8A39' }} /><span style={S.legendText}>{language === 'te' ? 'వ్రతం' : 'Vrat'}</span></div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ═══ HINDU MONTH VIEW ═══ */}
        {/* ═══════════════════════════════════════════ */}
        {viewMode === 'month' && calendarMode === 'hindu' && currentTeluguMonth && (
          <>
            {/* Paksha bar */}
            <div style={{ ...S.pakshaBar, border: `1px solid ${hmc.border}` }}>
              <div style={{ width: '50%', background: hmc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `2px solid ${hmc.dot}33` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: hmc.text, letterSpacing: '0.06em' }}>☽ {language === 'te' ? 'శుక్ల పక్షం' : 'Shukla Paksha'}</span>
              </div>
              <div style={{ width: '50%', background: `linear-gradient(135deg, ${hmc.bgSolid}88, ${hmc.bgSolid}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: `${hmc.text}BB`, letterSpacing: '0.06em' }}>☾ {language === 'te' ? 'కృష్ణ పక్షం' : 'Krishna Paksha'}</span>
              </div>
            </div>

            {/* Weekday headers */}
            <div style={S.weekRow}>{weekdays.map(d => <div key={d} style={{ ...S.weekDay, fontFamily: font }}>{d}</div>)}</div>

            {/* Hindu grid */}
            <div style={S.grid} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {Array.from({ length: hinduStartDow }, (_, i) => <div key={`he${i}`} />)}
              {hinduDays.map((hd, idx) => {
                const todayCell = isTodayDate(hd.date);
                const selected = selectedTithiIdx === idx;
                const ti = hd.data?.tithiIndex ?? idx;
                const isPurnima = ti === 14;
                const isAmavasya = ti === 29;
                const isKrishna = ti >= 15;
                const fest = hd.data?.festival;
                const cellBg = todayCell ? 'linear-gradient(135deg, #E63B2E, #C62828)' : isKrishna ? `linear-gradient(145deg, ${hmc.bgSolid}AA, ${hmc.bgSolid}66)` : hmc.bg;
                const cellBorder = todayCell ? 'none' : selected ? `1.5px solid ${hmc.dot}` : isPurnima ? `1.5px solid ${hmc.dot}66` : isAmavasya ? `1.5px dashed ${hmc.dot}66` : `1px solid ${hmc.border}`;

                return (
                  <div key={idx} onClick={() => { setSelectedTithiIdx(idx); setSelectedDay(hd.gregDay); }} style={{
                    ...S.cell, gap: 0, background: cellBg, border: cellBorder,
                    boxShadow: todayCell ? '0 2px 8px rgba(230,59,46,0.3)' : selected ? `0 2px 8px ${hmc.dot}22` : 'inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.02)',
                  }}>
                    {isPurnima && !todayCell && <div style={{ position: 'absolute', top: 2, right: 3 }}><FullMoonBadge size={9} /></div>}
                    {isAmavasya && !todayCell && <div style={{ position: 'absolute', top: 2, right: 3 }}><NewMoonBadge size={9} /></div>}
                    <div style={{ fontSize: 15, fontWeight: todayCell ? 700 : 600, color: todayCell ? 'white' : isKrishna ? `${hmc.text}CC` : hmc.text, lineHeight: 1.1 }}>{idx + 1}</div>
                    <div style={{ fontSize: 7, fontWeight: 500, color: todayCell ? 'rgba(255,255,255,0.7)' : `${hmc.text}77`, marginTop: 1 }}>{MONTH_SHORT[hd.gregMonth]} {hd.gregDay}</div>
                    {fest && <div style={{ position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 2, background: todayCell ? 'white' : '#E63B2E' }} />}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ═══ YEAR VIEW ═══ */}
        {viewMode === 'year' && (
          <div style={S.yearGrid}>
            {yearMonths.map(({ year, month }) => <MiniMonth key={`${year}-${month}`} year={year} month={month} today={today} location={location} onSelectMonth={handleSelectMonth} pick={pick} font={font} />)}
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ═══ SELECTED DAY DETAIL ═══ */}
        {/* ═══════════════════════════════════════════ */}
        {selectedData && viewMode === 'month' && (calendarMode === 'english' ? selectedDay : selectedTithiIdx >= 0) && (
          <div style={S.dayDetail}>
            {/* Date header */}
            <div style={S.dayDetailHeader}>
              <div>
                <div style={S.dayDetailDate}>
                  {calendarMode === 'hindu'
                    ? pick(TITHIS[selectedData.tithiIndex], TITHIS_EN[selectedData.tithiIndex])
                    : `${selectedData.dateNum} ${MONTH_NAMES_EN[calendarMode === 'hindu' ? hinduDays[selectedTithiIdx]?.gregMonth : currentMonth]} ${currentYear}`
                  }
                </div>
                <div style={{ ...S.dayDetailDay, fontFamily: font }}>
                  {calendarMode === 'hindu'
                    ? `${selectedData.dateNum} ${MONTH_NAMES_EN[hinduDays[selectedTithiIdx]?.gregMonth]} ${hinduDays[selectedTithiIdx]?.gregYear} • ${language === 'te' ? 'తిథి' : 'Tithi'} ${selectedTithiIdx + 1}`
                    : pick(selectedData.vaaram, selectedData.englishDay)
                  }
                </div>
              </div>
              {/* Hindu month badge */}
              <div style={{ padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: getMC(selectedData.masam?.english).bg, color: getMC(selectedData.masam?.english).text, border: `1px solid ${getMC(selectedData.masam?.english).border}` }}>
                {calendarMode === 'hindu' ? (selectedData.tithiIndex < 15 ? (language === 'te' ? 'శుక్ల' : 'Shukla') : (language === 'te' ? 'కృష్ణ' : 'Krishna')) : pick(selectedData.masam?.telugu, selectedData.masam?.english)}
              </div>
            </div>

            {/* Tithi badge */}
            <div style={S.dayDetailTithi}>
              <CrescentIcon size={16} color="#E8A817" />
              <div>
                <div style={{ ...S.dayDetailTithiName, fontFamily: font }}>{pick(selectedData.tithi.name, selectedData.tithi.nameEn)}</div>
                <div style={S.dayDetailPaksha}>{pick(selectedData.paksha, selectedData.pakshaEn)}</div>
              </div>
            </div>

            {/* Purnima/Amavasya special card */}
            {selectedData.tithiIndex === 14 && (
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'linear-gradient(135deg, #FFFDE6, #FFF8CC)', border: '1px solid #FFF0B3', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FullMoonBadge size={18} />
                <div><div style={{ fontSize: 12, fontWeight: 600, color: '#B8860B' }}>{language === 'te' ? 'పూర్ణిమ — పూర్ణచంద్రుడు' : 'Purnima — Full Moon'}</div></div>
              </div>
            )}
            {selectedData.tithiIndex === 29 && (
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'linear-gradient(135deg, #2A2A2A, #1A1A1A)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <NewMoonBadge size={18} />
                <div><div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{language === 'te' ? 'అమావాస్య — అమావాస్య' : 'Amavasya — New Moon'}</div></div>
              </div>
            )}

            {/* Festival banner */}
            {selectedData.festival && (
              <div style={S.dayFestBanner}>
                <DiyaIcon size={18} color="#C44020" />
                <div style={{ flex: 1 }}>
                  <div style={{ ...S.dayFestName, fontFamily: font }}>{pick(selectedData.festival.telugu, selectedData.festival.english)}</div>
                  {selectedData.festival.major && <div style={S.dayFestBadge}>{language === 'te' ? 'ప్రధాన పండుగ' : 'Major Festival'}</div>}
                </div>
              </div>
            )}
            {!selectedData.festival && selectedData.vrathams?.length > 0 && (
              <div style={S.dayVratBanner}>
                <MalaIcon size={18} color="#2D8A39" />
                <div>{selectedData.vrathams.map((v, vi) => <div key={vi} style={{ ...S.dayVratName, fontFamily: font }}>{pick(v.telugu || v.nameTe, v.english || v.name)}</div>)}</div>
              </div>
            )}

            {/* Sunrise / Sunset */}
            <div style={S.daySunRow}>
              <div style={S.daySunItem}><Sunrise size={15} color="#D4790A" strokeWidth={1.8} /><div><div style={S.daySunLabel}>{t('today.sunrise')}</div><div style={S.daySunTime}>{selectedData.sunrise}</div></div></div>
              <div style={S.daySunDivider} />
              <div style={S.daySunItem}><Sunset size={15} color="#C74530" strokeWidth={1.8} /><div><div style={S.daySunLabel}>{t('today.sunset')}</div><div style={S.daySunTime}>{selectedData.sunset}</div></div></div>
            </div>

            {/* Panchang summary */}
            <div style={S.dayPanchRow}>
              {[
                { label: t('today.nakshatra'), value: pick(selectedData.nakshatra.name, selectedData.nakshatra.nameEn) },
                { label: t('today.yoga'), value: pick(selectedData.yogam.name, selectedData.yogam.nameEn) },
                { label: t('today.karana'), value: pick(selectedData.karanam.name, selectedData.karanam.nameEn) },
              ].map((item, idx, arr) => (
                <div key={idx} style={{ ...S.dayPanchItem, borderRight: idx < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                  <div style={S.dayPanchLabel}>{item.label}</div>
                  <div style={{ ...S.dayPanchValue, fontFamily: font }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Practices */}
            {selectedPractices && <div style={{ marginTop: 16 }}><PracticesCard practices={selectedPractices} /></div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════
const S = {
  page: { width: '100%', maxWidth: '480px', margin: '0 auto' },
  content: { padding: '8px 20px 100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#1A1A1A', margin: 0 },
  subtitle: { fontSize: 13, color: '#999', marginTop: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  headerActions: { display: 'flex', gap: 8, alignItems: 'center' },
  viewToggle: { width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', outline: 'none', transition: 'background 0.2s ease' },
  navBtn: { width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },

  // Toggle
  toggleTrack: { display: 'flex', background: '#F0EEEA', borderRadius: 12, padding: 3, marginBottom: 16 },
  toggleOption: { flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.03em', transition: 'all 0.2s ease', fontFamily: "'Plus Jakarta Sans', sans-serif" },

  // Span bar
  spanBar: { display: 'flex', height: 38, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' },
  spanLegend: { display: 'flex', justifyContent: 'center', gap: 14, marginTop: 8 },
  spanLegendItem: { display: 'flex', alignItems: 'center', gap: 5 },
  spanLegendText: { fontSize: 10, color: '#999', fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" },

  // Paksha bar (Hindu view)
  pakshaBar: { display: 'flex', height: 28, borderRadius: 10, overflow: 'hidden', marginBottom: 14 },

  // Grid shared
  weekRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 },
  weekDay: { textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#CCC', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 },
  cell: { aspectRatio: '1', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', gap: 1, transition: 'all 0.15s ease', WebkitTapHighlightColor: 'transparent' },

  legend: { display: 'flex', gap: 16, justifyContent: 'center', marginTop: 14, marginBottom: 6 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 4 },
  legendText: { fontSize: 10, color: '#999', fontFamily: "'Plus Jakarta Sans', sans-serif" },

  yearGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },

  // Day detail
  dayDetail: { marginTop: 18 },
  dayDetailHeader: { background: 'white', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dayDetailDate: { fontSize: 20, fontWeight: 700, color: '#1A1A1A', fontFamily: "'Playfair Display', serif" },
  dayDetailDay: { fontSize: 14, color: '#777', marginTop: 3 },
  dayDetailTithi: { marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #FFFCF0, #FFF8E6)', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(232,168,23,0.12)' },
  dayDetailTithiName: { fontSize: 14, fontWeight: 700, color: '#1A1A1A' },
  dayDetailPaksha: { fontSize: 11, color: '#B8860B', marginTop: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  dayFestBanner: { marginTop: 12, padding: '14px 18px', borderRadius: 14, background: 'linear-gradient(135deg, #FFF0E8, #FFE4D4)', border: '1px solid rgba(230,59,46,0.12)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(230,59,46,0.06)' },
  dayFestName: { fontSize: 16, fontWeight: 700, color: '#C44020' },
  dayFestBadge: { fontSize: 10, fontWeight: 600, color: '#E63B2E', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  dayVratBanner: { marginTop: 12, padding: '14px 18px', borderRadius: 14, background: 'linear-gradient(135deg, #F0FFF0, #E8FFE8)', border: '1px solid rgba(45,138,57,0.12)', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(45,138,57,0.06)' },
  dayVratName: { fontSize: 14, fontWeight: 600, color: '#2D8A39' },
  daySunRow: { marginTop: 12, background: 'white', borderRadius: 14, padding: '14px 18px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center' },
  daySunItem: { flex: 1, display: 'flex', alignItems: 'center', gap: 10 },
  daySunDivider: { width: 1, height: 28, background: 'rgba(0,0,0,0.06)', margin: '0 14px', flexShrink: 0 },
  daySunLabel: { fontSize: 10, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  daySunTime: { fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginTop: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  dayPanchRow: { marginTop: 12, background: 'white', borderRadius: 14, padding: '14px 18px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', display: 'flex' },
  dayPanchItem: { flex: 1, textAlign: 'center', padding: '0 4px' },
  dayPanchLabel: { fontSize: 10, fontWeight: 600, color: '#BBB', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  dayPanchValue: { fontSize: 13, fontWeight: 600, color: '#1A1A1A' },
};
