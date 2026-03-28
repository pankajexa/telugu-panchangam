import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { useReminders } from '../context/ReminderContext';
import { getAllFestivals } from '../data/festivalList';
import { getPractices, FESTIVAL_PRACTICES, VRATA_PRACTICES } from '../data/festivalPractices';
import { DiyaIcon, MalaIcon } from '../components/icons/HinduIcons';
import { ChevronRight, X } from 'lucide-react';
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
  const [selectedFestival, setSelectedFestival] = useState(null);

  // Lock body scroll when overlay is open (prevents background scroll stealing touch)
  useEffect(() => {
    if (selectedFestival?.practices) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [selectedFestival]);

  // Compute festival list AFTER first paint so the tab switches instantly
  useEffect(() => {
    setLoading(true);
    // setTimeout(0) truly yields to the browser — lets the loading UI paint first
    const t = setTimeout(() => {
      const fests = getAllFestivals(location);
      setAllFestivals(fests);
      setLoading(false);

      // Feed festival/vratham data to ReminderContext for notification scheduling
      const festivals = fests.filter(f => f.type === 'festival');
      const vrathams = fests.filter(f => f.type === 'vrat');
      if (festivals.length) setFestivalData(festivals);
      if (vrathams.length) setVrathamData(vrathams);
    }, 0);
    return () => clearTimeout(t);
  }, [location]);

  const filtered = useMemo(() => {
    if (filter === 'all') return allFestivals;
    return allFestivals.filter(f => f.type === filter.replace(/s$/, '')); // 'festivals' → 'festival'
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

        {/* Loading state */}
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {language === 'te' ? 'పండుగలు లోడ్ అవుతున్నాయి...' : 'Loading festivals...'}
            </div>
          </div>
        )}

        {/* Festival list */}
        {!loading && grouped.map((group, gi) => (
          <div key={gi} style={styles.group}>
            <div style={{ ...styles.monthHeader, color: colors.textFaint }}>{group.label}</div>
            <div style={styles.list}>
              {group.items.map((f, i) => {
                const color = TYPE_COLORS[f.type] || '#E8A817';
                const IconComp = TYPE_ICON_COMPONENT[f.type] || DiyaIcon;
                const name = pick(f.telugu, f.english) || f.english;
                const dateStr = `${f.date.getDate()} ${MONTH_NAMES_EN[f.date.getMonth()].slice(0, 3)}`;
                const typeLabel = language === 'te'
                  ? (f.type === 'vrat' ? 'వ్రతం' : 'పండుగ')
                  : (f.type === 'vrat' ? 'Vrat' : 'Festival');

                // Check if this festival/vrat has practices
                const practicesData = f.type === 'vrat'
                  ? (VRATA_PRACTICES[f.type === 'vrat' ? 'ekadashi' : f.type] ? true : false)
                  : (FESTIVAL_PRACTICES[f.english] ? true : false);

                return (
                  <div key={i} style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${color}`, cursor: 'pointer' }}
                    onClick={() => {
                      const p = f.type === 'vrat'
                        ? getPractices(null, [{ type: f.english?.toLowerCase().includes('ekadashi') ? 'ekadashi' : f.english?.toLowerCase().includes('pradosh') ? 'pradosham' : f.english?.toLowerCase().includes('chaturthi') ? 'chaturthi' : f.english?.toLowerCase().includes('shivaratri') ? 'shivaratri' : f.english?.toLowerCase().includes('purnima') ? 'purnima' : f.english?.toLowerCase().includes('amavasya') ? 'amavasya' : 'ekadashi' }])
                        : getPractices({ english: f.english }, null);
                      if (p) setSelectedFestival({ ...f, practices: p });
                    }}
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
                    <ChevronRight size={16} color={colors.textFaint} strokeWidth={1.8} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!loading && grouped.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: 14, color: colors.textMuted }}>{language === 'te' ? 'పండుగలు లేవు' : 'No festivals found'}</div>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ ...styles.empty, color: colors.textMuted }}>{t('festivals.noFestival')}</div>
        )}
      </div>

      {/* Practices detail overlay */}
      {selectedFestival?.practices && (
        <div style={styles.overlay} onClick={() => setSelectedFestival(null)}>
          <div style={{ ...styles.overlaySheet, background: colors.pageBg }} onClick={e => e.stopPropagation()}>
            <div style={{ ...styles.overlayHeader, borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ ...styles.overlayTitle, fontFamily: font, color: colors.text }}>
                {pick(selectedFestival.telugu, selectedFestival.english)}
              </div>
              <button style={styles.overlayClose} onClick={() => setSelectedFestival(null)}>
                <X size={20} color={colors.iconColor} />
              </button>
            </div>
            <div style={styles.overlayScroll}>
              <PracticesCard practices={selectedFestival.practices} />
            </div>
          </div>
        </div>
      )}
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
  // Overlay styles
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  overlaySheet: {
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxWidth: 480,
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  overlayHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px 12px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  overlayClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 10,
    display: 'flex',
    WebkitTapHighlightColor: 'transparent',
  },
  overlayScroll: {
    flex: 1,
    overflowY: 'scroll',
    padding: '16px 20px 40px',
    WebkitOverflowScrolling: 'touch',
    touchAction: 'pan-y',
    overscrollBehavior: 'contain',
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
