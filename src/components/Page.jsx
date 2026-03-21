import React, { memo } from 'react';
import BindingStrip from './BindingStrip';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';

function to12Hr(time24) {
  const [hh, mm] = time24.split(':').map(Number);
  const period = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return { time: `${h}:${mm.toString().padStart(2, '0')}`, period };
}

const SUN_COLOR = '#d45500'; // reddish-orange

function SunriseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <line x1="1" y1="18" x2="23" y2="18" stroke={SUN_COLOR} strokeWidth="0.7" opacity="0.35" />
      <path d="M6 18 A6 6 0 0 1 18 18" fill="none" stroke={SUN_COLOR} strokeWidth="1.5" />
      <line x1="12" y1="5" x2="12" y2="8.5" stroke={SUN_COLOR} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="7.2" y1="7" x2="9" y2="9.2" stroke={SUN_COLOR} strokeWidth="1" strokeLinecap="round" />
      <line x1="16.8" y1="7" x2="15" y2="9.2" stroke={SUN_COLOR} strokeWidth="1" strokeLinecap="round" />
      <line x1="4" y1="12" x2="6.8" y2="12.5" stroke={SUN_COLOR} strokeWidth="1" strokeLinecap="round" />
      <line x1="20" y1="12" x2="17.2" y2="12.5" stroke={SUN_COLOR} strokeWidth="1" strokeLinecap="round" />
      <polyline points="10,5.5 12,3.2 14,5.5" fill="none" stroke={SUN_COLOR} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunsetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <line x1="1" y1="18" x2="23" y2="18" stroke={SUN_COLOR} strokeWidth="0.7" opacity="0.35" />
      <path d="M6 18 A6 6 0 0 1 18 18" fill="none" stroke={SUN_COLOR} strokeWidth="1.5" />
      <line x1="12" y1="6" x2="12" y2="9" stroke={SUN_COLOR} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="7.5" y1="8" x2="9" y2="10" stroke={SUN_COLOR} strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
      <line x1="16.5" y1="8" x2="15" y2="10" stroke={SUN_COLOR} strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
      <line x1="4" y1="12" x2="6.8" y2="12.5" stroke={SUN_COLOR} strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
      <line x1="20" y1="12" x2="17.2" y2="12.5" stroke={SUN_COLOR} strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
      <line x1="12" y1="18.5" x2="12" y2="22" stroke={SUN_COLOR} strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
      <polyline points="10,20.5 12,22.5 14,20.5" fill="none" stroke={SUN_COLOR} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

const Page = memo(function Page({ data, dayIndex, totalDays }) {
  const { location } = useLocation();
  const { t, pick, font } = useLanguage();
  if (!data) return null;

  const isSunday = data.isSunday;
  const hasFestival = !!data.festival;
  const isMajor = hasFestival && data.festival.major;
  const isMuhurtham = data.festival?.isMuhurtham;

  const rise = to12Hr(data.sunrise);
  const set = to12Hr(data.sunset);

  // Language-aware values
  const dayName = pick(data.vaaram, data.englishDay);
  const monthName = pick(data.masam.telugu, data.masam.english);
  const pakshaName = pick(data.paksha, data.pakshaEn);
  const tithiName = pick(data.tithi.name, data.tithi.nameEn);
  const nakshatraName = pick(data.nakshatra.name, data.nakshatra.nameEn);
  const yogamName = pick(data.yogam.name, data.yogam.nameEn);
  const karanamName = pick(data.karanam.name, data.karanam.nameEn);
  const festivalName = hasFestival ? pick(data.festival.telugu, data.festival.english) : '';

  return (
    <div className="paper-texture page-paper" style={styles.page}>
      <BindingStrip />

      <div style={styles.content}>

        {/* ── Header: day + month ── */}
        <div style={styles.headerRow}>
          <span style={{ ...styles.teluguDay, fontFamily: font }}>{dayName}</span>
          <span style={{ ...styles.teluguMonth, fontFamily: font }}>{monthName}</span>
        </div>

        {/* ── Sub-header: English date + masa ── */}
        <div style={styles.subHeaderRow}>
          <span style={styles.subText}>{data.englishDay}</span>
          <span style={styles.subTextCenter}>{data.englishMonth} {data.year}</span>
          <span style={styles.subText}>{data.masam.english}</span>
        </div>

        {/* ── Centerpiece: Sunrise · Date · Sunset ── */}
        <div style={styles.dateBlock}>
          <div style={styles.sunCol}>
            <div style={styles.sunIcon}><SunriseIcon /></div>
            <div style={styles.sunTime}>{rise.time}</div>
            <div style={styles.sunPeriod}>{rise.period}</div>
          </div>

          <div style={{
            ...styles.dateNumber,
            ...(isSunday ? styles.sundayDate : {}),
            ...(isMajor ? styles.festivalDate : {}),
          }}>
            {isMuhurtham && <span style={styles.star}>✦</span>}
            {data.dateNum}
          </div>

          <div style={styles.sunCol}>
            <div style={styles.sunIcon}><SunsetIcon /></div>
            <div style={styles.sunTime}>{set.time}</div>
            <div style={styles.sunPeriod}>{set.period}</div>
          </div>
        </div>

        {/* ── Festival name ── */}
        {hasFestival ? (
          <div style={styles.festivalZone}>
            {isMajor && <div style={styles.festivalOrnament}>✦&ensp;✦&ensp;✦</div>}
            <div style={{ ...(isMajor ? styles.festivalNameMajor : styles.festivalName), fontFamily: font }}>
              {festivalName}
            </div>
            {data.festival.description && (
              <div style={{ ...styles.festivalDesc, fontFamily: font }}>{data.festival.description}</div>
            )}
          </div>
        ) : (
          <div style={styles.flourish}>
            <svg width="50" height="6" viewBox="0 0 50 6">
              <path d="M5,3 Q12,0 18,3 T32,3 T45,3"
                fill="none" stroke={INK4} strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
        )}

        {/* ── Vrathams / observances ── */}
        {data.vrathams && data.vrathams.length > 0 && (
          <div style={styles.vrathamLine}>
            {data.vrathams.map((v, i) => (
              <span key={i} style={{ ...styles.vrathamText, fontFamily: font }}>
                {i > 0 && <span style={styles.vrathamDot}> · </span>}
                {pick(v.telugu, v.english)}
              </span>
            ))}
          </div>
        )}

        {/* ── Paksha · Tithi with start/end times ── */}
        <div style={styles.tithiLine}>
          <TithiDT dt={data.tithi.start} />
          <span style={styles.tithiDash}>──</span>
          <span style={{ ...styles.tithiText, fontFamily: font }}>{pakshaName} {tithiName}</span>
          <span style={styles.tithiDash}>──</span>
          <TithiDT dt={data.tithi.end} />
        </div>

        {/* ── Nakshatra ── */}
        <div style={styles.nakshatraBlock}>
          <div style={{ ...styles.nakshatraLabel, fontFamily: font }}>{t('page.nakshatra')}</div>
          <div style={{ ...styles.nakshatraName, fontFamily: font }}>{nakshatraName}</div>
          <div style={styles.nakshatraTimes}>
            <NakshatraDT dt={data.nakshatra.start} />
            <span style={styles.nakshatraSep}> ─ </span>
            <NakshatraDT dt={data.nakshatra.end} />
          </div>
        </div>

        {/* ── Yogam · Karanam ── */}
        <div style={styles.panchRow}>
          <div style={styles.panchItem}>
            <span style={{ ...styles.panchLabel, fontFamily: font }}>{t('page.yogam')}</span>
            <span style={{ ...styles.panchValue, fontFamily: font }}>{yogamName}</span>
          </div>
          <div style={styles.panchDot}>·</div>
          <div style={styles.panchItem}>
            <span style={{ ...styles.panchLabel, fontFamily: font }}>{t('page.karanam')}</span>
            <span style={{ ...styles.panchValue, fontFamily: font }}>{karanamName}</span>
          </div>
        </div>

        {/* ── Separator ── */}
        <div style={styles.sep} />

        {/* ── Auspicious timings (Shubha Muhurtham) ── */}
        <div style={styles.timingsBlock}>
          <div style={styles.timingsRow}>
            <Timing label={pick('అభిజిత్', 'Abhijit')} value={data.abhijitMuhurta} font={font} />
            <Timing label={pick('అమృతకాలం', 'Amrit')} value={data.amritKalam} font={font} />
            <Timing label={pick('బ్రహ్మ ము.', 'Brahma')} value={data.brahmaMuhurta} font={font} />
          </div>
        </div>

        {/* ── Inauspicious timings (Ashubha Muhurtham) ── */}
        <div style={styles.timingsBlock}>
          <div style={styles.timingsRow}>
            <Timing label={t('page.rahu')} value={data.rahuKalam} font={font} />
            <Timing label={t('page.varjyam')} value={data.varjyam} font={font} />
            <Timing label={t('page.durmuhurtham')} value={data.durmuhurtham} font={font} />
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ ...styles.footer, fontFamily: font }}>
          {t('page.samvatsaram')} · {pick(location.label, location.labelEn)}
        </div>
      </div>
    </div>
  );
});

function TithiDT({ dt }) {
  if (dt.sameDay) {
    return <span style={styles.tithiTime}>{dt.time}</span>;
  }
  return (
    <span style={styles.tithiTime}>
      <span style={styles.tithiTimeDate}>{dt.date} </span>{dt.time}
    </span>
  );
}

function NakshatraDT({ dt }) {
  if (dt.sameDay) {
    return <span style={styles.nakshatraTime}>{dt.time}</span>;
  }
  return (
    <span style={styles.nakshatraTime}>
      <span style={styles.nakshatraDate}>{dt.date}, </span>{dt.time}
    </span>
  );
}

function Timing({ label, value, font }) {
  const values = Array.isArray(value) ? value : [value];
  return (
    <div style={styles.timingItem}>
      <div style={{ ...styles.timingLabel, fontFamily: font }}>{label}</div>
      {values.map((v, i) => (
        <div key={i} style={styles.timingValue}>{v}</div>
      ))}
    </div>
  );
}

// Hindu lotus blossom watermark — pointed overlapping petals like temple art
function LotusWatermark() {
  const C = '#9A7A3A';

  // Outer petal: pointed tip, concave sides curving to base
  // Each petal is a path that starts at center-base, curves out to a pointed tip, curves back
  function petalPath(angle, r1, r2, spread) {
    const rad = (a) => (a * Math.PI) / 180;
    const cx = 150, cy = 150;
    // Tip point
    const tx = cx + r2 * Math.sin(rad(angle));
    const ty = cy - r2 * Math.cos(rad(angle));
    // Base left
    const blx = cx + r1 * Math.sin(rad(angle - spread));
    const bly = cy - r1 * Math.cos(rad(angle - spread));
    // Base right
    const brx = cx + r1 * Math.sin(rad(angle + spread));
    const bry = cy - r1 * Math.cos(rad(angle + spread));
    // Control points for concave sides (pull inward)
    const cl1x = cx + (r2 * 0.55) * Math.sin(rad(angle - spread * 0.35));
    const cl1y = cy - (r2 * 0.55) * Math.cos(rad(angle - spread * 0.35));
    const cl2x = cx + (r2 * 0.55) * Math.sin(rad(angle + spread * 0.35));
    const cl2y = cy - (r2 * 0.55) * Math.cos(rad(angle + spread * 0.35));

    return `M${blx},${bly} Q${cl1x},${cl1y} ${tx},${ty} Q${cl2x},${cl2y} ${brx},${bry} Z`;
  }

  const outerAngles = Array.from({ length: 8 }, (_, i) => i * 45);
  const innerAngles = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);

  return (
    <svg
      viewBox="0 0 300 300"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.025,
      }}
    >
      {/* Outer layer — 8 large pointed petals */}
      {outerAngles.map((angle) => (
        <path
          key={`o-${angle}`}
          d={petalPath(angle, 42, 130, 18)}
          fill="none"
          stroke={C}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      ))}
      {/* Inner layer — 8 petals rotated 22.5°, slightly smaller */}
      {innerAngles.map((angle) => (
        <path
          key={`i-${angle}`}
          d={petalPath(angle, 38, 100, 16)}
          fill="none"
          stroke={C}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      ))}
      {/* Center circle */}
      <circle cx="150" cy="150" r="40" fill="none" stroke={C} strokeWidth="2.2" />
      <circle cx="150" cy="150" r="34" fill="none" stroke={C} strokeWidth="1" />
    </svg>
  );
}

export default Page;

// ─────────────────────────────────────────────
const INK  = '#3a150a';
const INK2 = '#6b2d15';
const INK3 = '#915838';
const INK4 = '#b88050';
const FEST = '#d45500';  // festival orange
const SERIF = "'Inter', system-ui, sans-serif";
const DATE_NUM = "'Abril Fatface', Georgia, serif";
const TELUGU = "'Noto Serif Telugu', serif";

const styles = {
  page: {
    width: '100%',
    aspectRatio: '1 / 1.15',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '3px 16px 8px',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },

  // Header
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '3px',
  },
  teluguDay:   { fontFamily: TELUGU, fontWeight: 700, fontSize: '18px', color: INK },
  teluguMonth: { fontFamily: TELUGU, fontWeight: 600, fontSize: '15px', color: INK2 },

  subHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  subText:       { fontFamily: SERIF, fontWeight: 500, fontSize: '11px', color: INK3, letterSpacing: '0.4px' },
  subTextCenter: { fontFamily: SERIF, fontWeight: 700, fontSize: '14px', color: INK2, letterSpacing: '3px', textTransform: 'uppercase' },

  // Date block
  dateBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    margin: '4px 0 2px',
  },
  sunCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1px',
  },
  sunIcon:    { lineHeight: 0 },
  sunTime:    { fontFamily: SERIF, fontWeight: 700, fontSize: '16px', color: INK, letterSpacing: '0.3px', lineHeight: 1.1 },
  sunPeriod:  { fontFamily: SERIF, fontWeight: 500, fontSize: '10px', color: INK3, letterSpacing: '1px' },
  dateNumber: {
    fontFamily: DATE_NUM, fontWeight: 400, fontSize: '90px', color: FEST,
    textAlign: 'center', lineHeight: 0.88, letterSpacing: '-1px', padding: '0 20px',
  },
  sundayDate:   { textShadow: `1.5px 0 0 ${INK}, -0.5px 0 0 ${INK}, 0 1px 0 rgba(58,21,10,0.15)` },
  festivalDate: {},
  star: { fontSize: '14px', verticalAlign: 'super', color: INK2, marginRight: '2px' },

  // Festival zone
  festivalZone: {
    textAlign: 'center',
    margin: '0 0 1px',
  },
  festivalOrnament: {
    fontSize: '6px',
    color: INK3,
    letterSpacing: '3px',
    opacity: 0.6,
    lineHeight: 1,
    marginBottom: '1px',
  },
  festivalNameMajor: {
    fontFamily: TELUGU,
    fontWeight: 900,
    fontSize: '18px',
    color: FEST,
    lineHeight: 1.25,
  },
  festivalName: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '15px',
    color: FEST,
    lineHeight: 1.25,
  },
  festivalDesc: {
    fontFamily: TELUGU,
    fontWeight: 400,
    fontSize: '11px',
    color: INK3,
    lineHeight: 1.2,
  },

  // Non-festival flourish
  flourish: {
    textAlign: 'center',
    margin: '0 0 1px',
    lineHeight: 0,
  },

  // Vrathams
  vrathamLine: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
    margin: '2px 0',
  },
  vrathamText: {
    fontFamily: TELUGU,
    fontWeight: 600,
    fontSize: '9px',
    color: '#8B6914',
    letterSpacing: '0.2px',
  },
  vrathamDot: {
    color: INK4,
    fontSize: '8px',
    opacity: 0.5,
  },

  // Tithi
  tithiLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    margin: '4px 0 3px',
  },
  tithiDash: { color: INK4, fontSize: '8px', letterSpacing: '1px', opacity: 0.5 },
  tithiText: { fontFamily: TELUGU, fontWeight: 700, fontSize: '15px', color: INK, whiteSpace: 'nowrap' },
  tithiTime: { fontFamily: SERIF, fontWeight: 500, fontSize: '8px', color: INK3, whiteSpace: 'nowrap' },
  tithiTimeDate: { fontSize: '7px', color: INK4 },

  // Nakshatra
  nakshatraBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '4px 0 3px',
    padding: '4px 0',
    borderTop: `1px solid rgba(58,21,10,0.06)`,
    borderBottom: `1px solid rgba(58,21,10,0.06)`,
  },
  nakshatraLabel: { fontFamily: TELUGU, fontWeight: 500, fontSize: '9px', color: INK4, letterSpacing: '1.5px' },
  nakshatraName:  { fontFamily: TELUGU, fontWeight: 800, fontSize: '18px', color: INK, lineHeight: 1.3 },
  nakshatraTimes: { display: 'flex', alignItems: 'center', marginTop: '2px' },
  nakshatraTime:  { fontFamily: SERIF, fontWeight: 600, fontSize: '13px', color: INK2, whiteSpace: 'nowrap' },
  nakshatraDate:  { fontWeight: 500, fontSize: '10px', color: INK3 },
  nakshatraSep:   { fontFamily: SERIF, fontSize: '11px', color: INK4, margin: '0 3px' },

  // Yogam · Karanam
  panchRow: {
    display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', margin: '3px 0',
  },
  panchItem:  { display: 'flex', alignItems: 'baseline', gap: '5px' },
  panchLabel: { fontFamily: TELUGU, fontWeight: 500, fontSize: '11px', color: INK3 },
  panchValue: { fontFamily: TELUGU, fontWeight: 700, fontSize: '14px', color: INK },
  panchDot:   { fontFamily: SERIF, fontSize: '14px', color: INK4, opacity: 0.5 },

  // Separator
  sep: { width: '70%', margin: '3px auto', borderTop: '1px solid rgba(58,21,10,0.07)' },

  // Timings
  timingsBlock: { margin: '2px 0' },
  timingsRow: { display: 'flex', justifyContent: 'space-between', gap: '6px', padding: '0 2px' },
  timingItem:  { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  timingLabel: { fontFamily: TELUGU, fontWeight: 500, fontSize: '9px', color: INK3, marginBottom: '1px' },
  timingValue: { fontFamily: SERIF, fontWeight: 600, fontSize: '9px', color: INK2, letterSpacing: '0.1px', whiteSpace: 'nowrap' },

  // Footer
  footer: {
    fontFamily: TELUGU, fontWeight: 400, fontSize: '9px', color: INK4,
    textAlign: 'center', marginTop: 'auto', paddingTop: '3px', letterSpacing: '0.3px',
  },
};
