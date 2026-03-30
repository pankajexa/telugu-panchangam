import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { useReminders } from '../context/ReminderContext';
import { loadFestivalsProgressively } from '../data/festivalList';
import { getPractices, FESTIVAL_PRACTICES, VRATA_PRACTICES } from '../data/festivalPractices';
import { DiyaIcon, MalaIcon } from '../components/icons/HinduIcons';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PracticesCard from '../components/today/PracticesCard';

const FILTERS = ['all', 'festivals', 'vrats'];

const FILTER_KEYS = {
  all: 'festivals.all',
  festivals: 'festivals.festivals',
  vrats: 'festivals.vrats',
};

const TYPE_COLORS = {
  festival: '#E8A817',
  vrat: '#E63B2E',
};

const TYPE_ICON_COMPONENT = {
  festival: DiyaIcon,
  vrat: MalaIcon,
};

const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function FestivalsPage() {
  const { t, pick, font, language } = useLanguage();
  const { isNight, colors } = useTheme();
  const { location } = useLocation();
  const { setFestivalData, setVrathamData } = useReminders();
  const [filter, setFilter] = useState('all');
  const [allFestivals, setAllFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const cancelRef = useRef(null);

  // Progressive loading — festivals stream in month-by-month
  useEffect(() => {
    setLoading(true);
    setDone(false);
    setAllFestivals([]);
    setExpandedIdx(null);

    cancelRef.current = loadFestivalsProgressively(
      location,
      (partial) => {
        setAllFestivals(partial);
        setLoading(false); // Hide spinner as soon as first chunk arrives
      },
      (final) => {
        setDone(true);
        const festivals = final.filter(f => f.type === 'festival');
        const vrathams = final.filter(f => f.type === 'vrat');
        if (festivals.length) setFestivalData(festivals);
        if (vrathams.length) setVrathamData(vrathams);
      },
    );
    return () => { if (cancelRef.current) cancelRef.current(); };
  }, [location]);

  const filtered = useMemo(() => {
    if (filter === 'all') return allFestivals;
    return allFestivals.filter(f => f.type === filter.replace(/s$/, ''));
  }, [allFestivals, filter]);

  // Group by month
  const grouped = useMemo(() => {
    const groups = {};
    for (const f of filtered) {
      const key = `${f.date.getFullYear()}-${f.date.getMonth()}`;
      if (!groups[key]) groups[key] = { label: `${MONTH_NAMES_EN[f.date.getMonth()]} ${f.date.getFullYear()}`, items: [] };
      groups[key].items.push(f);
    }
    return Object.values(groups);
  }, [filtered]);

  // Build a global flat index for expand tracking
  const flatItems = useMemo(() => {
    const arr = [];
    for (const g of grouped) for (const item of g.items) arr.push(item);
    return arr;
  }, [grouped]);

  const handleToggle = useCallback((globalIdx) => {
    setExpandedIdx(prev => prev === globalIdx ? null : globalIdx);
  }, []);

  // Get practices for a festival/vrat
  const getPracticesFor = useCallback((f) => {
    if (f.type === 'vrat') {
      const en = (f.english || '').toLowerCase();
      const vrataType = en.includes('ekadashi') ? 'ekadashi'
        : en.includes('pradosh') ? 'pradosham'
        : en.includes('chaturthi') ? 'chaturthi'
        : en.includes('shivaratri') ? 'shivaratri'
        : en.includes('purnima') ? 'purnima'
        : en.includes('amavasya') ? 'amavasya'
        : 'ekadashi';
      return getPractices(null, [{ type: vrataType }]);
    }
    return getPractices({ english: f.english }, null);
  }, []);

  let globalIdx = 0;

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        {/* Header */}
        <h1 style={{ ...styles.title, color: colors.text }}>{t('festivals.title')}</h1>
        <div style={{ ...styles.subtitle, color: colors.textMuted }}>{language === 'te' ? 'పండుగలు & వ్రతాలు' : 'Festivals & Vratas'}</div>

        {/* Filter chips */}
        <div style={styles.chipRow}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                style={{
                  ...styles.chip,
                  background: active ? colors.text : colors.cardBg,
                  color: active ? (isNight ? '#0B0F19' : 'white') : colors.textMuted,
                  border: active ? 'none' : `1px solid ${colors.chipBorder}`,
                }}
                onClick={() => setFilter(f)}
              >
                {t(FILTER_KEYS[f])}
              </button>
            );
          })}
        </div>

        {/* Loading state — only shown until first chunk */}
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {language === 'te' ? 'పండుగలు లోడ్ అవుతున్నాయి...' : 'Loading festivals...'}
            </div>
          </div>
        )}

        {/* Festival list — renders progressively */}
        {!loading && grouped.map((group, gi) => (
          <div key={gi} style={styles.group}>
            <div style={{ ...styles.monthHeader, color: colors.textFaint }}>{group.label}</div>
            <div style={styles.list}>
              {group.items.map((f, i) => {
                const idx = globalIdx++;
                const isExpanded = expandedIdx === idx;
                const color = TYPE_COLORS[f.type] || '#E8A817';
                const IconComp = TYPE_ICON_COMPONENT[f.type] || DiyaIcon;
                const name = pick(f.telugu, f.english) || f.english;
                const dateStr = `${f.date.getDate()} ${MONTH_NAMES_EN[f.date.getMonth()].slice(0, 3)}`;
                const typeLabel = language === 'te'
                  ? (f.type === 'vrat' ? 'వ్రతం' : 'పండుగ')
                  : (f.type === 'vrat' ? 'Vrat' : 'Festival');
                const hasPractices = f.type === 'vrat'
                  ? !!VRATA_PRACTICES[(f.english || '').toLowerCase().includes('ekadashi') ? 'ekadashi' : (f.english || '').toLowerCase().includes('pradosh') ? 'pradosham' : (f.english || '').toLowerCase().includes('chaturthi') ? 'chaturthi' : (f.english || '').toLowerCase().includes('shivaratri') ? 'shivaratri' : (f.english || '').toLowerCase().includes('purnima') ? 'purnima' : (f.english || '').toLowerCase().includes('amavasya') ? 'amavasya' : 'ekadashi']
                  : !!FESTIVAL_PRACTICES[f.english];

                return (
                  <div key={i}>
                    <div
                      style={{
                        ...styles.card,
                        background: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        borderLeft: `4px solid ${color}`,
                        cursor: hasPractices ? 'pointer' : 'default',
                        borderBottomLeftRadius: isExpanded ? 0 : 16,
                        borderBottomRightRadius: isExpanded ? 0 : 16,
                        borderBottom: isExpanded ? 'none' : `1px solid ${colors.border}`,
                      }}
                      onClick={() => hasPractices && handleToggle(idx)}
                    >
                      <div style={{ ...styles.iconBox, background: f.type === 'vrat' ? 'var(--tithi-icon-bg)' : 'var(--nakshatra-icon-bg)' }}>
                        <IconComp size={24} color={color} />
                      </div>
                      <div style={styles.info}>
                        <div style={{ ...styles.name, fontFamily: font, color: colors.text }}>{name}</div>
                        <div style={styles.meta}>
                          <span style={{
                            ...styles.badge,
                            background: f.type === 'vrat' ? '#FFF1F0' : '#FFF9E6',
                            color: f.type === 'vrat' ? '#E63B2E' : '#B8860B',
                          }}>{typeLabel}</span>
                          <span style={{ ...styles.date, color: colors.textFaint }}>{dateStr}</span>
                        </div>
                      </div>
                      {hasPractices && (
                        isExpanded
                          ? <ChevronDown size={16} color={colors.textFaint} strokeWidth={1.8} />
                          : <ChevronRight size={16} color={colors.textFaint} strokeWidth={1.8} />
                      )}
                    </div>
                    {/* Inline-expanded practices */}
                    {isExpanded && (
                      <div style={{
                        background: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        borderTop: 'none',
                        borderLeft: `4px solid ${color}`,
                        borderRadius: '0 0 16px 16px',
                        padding: '4px 16px 16px',
                      }}>
                        <PracticesCard practices={getPracticesFor(f)} defaultExpanded />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still loading indicator at bottom */}
        {!loading && !done && (
          <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
            <div style={{ ...styles.spinner, width: 18, height: 18, borderWidth: 2, display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: colors.textFaint, marginLeft: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {language === 'te' ? 'మరిన్ని లోడ్ అవుతున్నాయి...' : 'Loading more...'}
            </span>
          </div>
        )}

        {!loading && done && filtered.length === 0 && (
          <div style={{ ...styles.empty, color: colors.textMuted }}>{t('festivals.noFestival')}</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
  },
  content: {
    padding: '8px 20px 100px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 24,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  chipRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    padding: '7px 16px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
  },
  group: {
    marginBottom: 24,
  },
  monthHeader: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 12,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: 600,
  },
  meta: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  badge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  date: {
    fontSize: 12,
    color: '#BBB',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  empty: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 60,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: 28,
    height: 28,
    border: '3px solid rgba(230,59,46,0.15)',
    borderTopColor: '#E63B2E',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
};
