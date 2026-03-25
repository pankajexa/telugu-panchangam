import { memo, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CrescentIcon, NakshatraIcon, ChakraIcon, VajraIcon } from '../icons/HinduIcons';

const ICON_COMPONENTS = {
  tithi: CrescentIcon,
  nakshatra: NakshatraIcon,
  yoga: ChakraIcon,
  karana: VajraIcon,
};

const ICON_BGS = {
  tithi: 'var(--tithi-icon-bg)',
  nakshatra: 'var(--nakshatra-icon-bg)',
  yoga: 'var(--yoga-icon-bg)',
  karana: 'var(--karana-icon-bg)',
};

const ACCENT_COLORS = {
  tithi: '#E63B2E',
  nakshatra: '#E8A817',
  yoga: '#E63B2E',
  karana: '#E8A817',
};

// Transition data keys in detailed panchangam
const TRANSITION_KEYS = {
  tithi: 'tithiTransitions',
  nakshatra: 'nakshatraTransitions',
  yoga: 'yogaTransitions',
  karana: 'karanaTransitions',
};

/**
 * Format a formatDT object { time, date, sameDay } into display string.
 * Shows "Mar 25 01:50 PM" format for full context.
 */
function fmtFull(dt) {
  if (!dt || typeof dt === 'string') return dt || '--';
  if (dt.time === '--') return '--';
  return dt.sameDay ? dt.time : `${dt.date} ${dt.time}`;
}

/**
 * Format a short time from formatDT, with + for next day.
 */
function fmtShort(dt) {
  if (!dt || typeof dt === 'string') return dt || '--';
  if (dt.time === '--') return '--';
  return dt.sameDay ? dt.time : `${dt.time}+`;
}

function timeRange(start, end) {
  const s = fmtShort(start);
  const e = fmtShort(end);
  if (s === '--' && e === '--') return '';
  return `${s} – ${e}`;
}

/**
 * Single expandable panchang card.
 */
function PanchangCardItem({ cardKey, label, name, time, transitions, iconBg, font, pick }) {
  const [expanded, setExpanded] = useState(false);
  const IC = ICON_COMPONENTS[cardKey];
  const accentColor = ACCENT_COLORS[cardKey];
  const hasTransitions = transitions && transitions.length > 0;

  const toggle = useCallback(() => {
    if (hasTransitions) setExpanded(e => !e);
  }, [hasTransitions]);

  return (
    <div style={styles.card}>
      {/* Main row — always visible */}
      <div style={styles.cardMain} onClick={toggle}>
        <div style={{ ...styles.iconBox, background: iconBg }}>
          <IC size={22} color={accentColor} />
        </div>
        <div style={styles.info}>
          <div style={styles.cardLabel}>{label}</div>
          <div style={{ ...styles.cardName, fontFamily: font }}>{name}</div>
          {time && <div style={styles.cardTime}>{time}</div>}
        </div>
        {hasTransitions && (
          <div style={styles.chevron}>
            {expanded
              ? <ChevronUp size={20} color="#999" strokeWidth={2} />
              : <ChevronDown size={20} color="#999" strokeWidth={2} />
            }
          </div>
        )}
      </div>

      {/* Expanded transition details */}
      {expanded && hasTransitions && (
        <div style={styles.transitions}>
          {transitions.map((tr, i) => {
            const trName = pick(tr.telugu, tr.english);
            const startStr = fmtFull(tr.start);
            const endStr = fmtFull(tr.end);
            return (
              <div key={i} style={{
                ...styles.transitionRow,
                borderTop: i > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              }}>
                <div style={styles.transitionNum}>{i + 1}</div>
                <div style={styles.transitionInfo}>
                  <div style={{ ...styles.transitionName, fontFamily: font }}>{trName}</div>
                  <div style={styles.transitionTime}>
                    {startStr} – {endStr}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const PanchangCards = memo(function PanchangCards({ data, detailed, font, pick, t }) {
  const cards = [
    {
      key: 'tithi',
      label: t('today.tithi'),
      name: pick(data.tithi.name, data.tithi.nameEn),
      time: timeRange(data.tithi.start, data.tithi.end),
    },
    {
      key: 'nakshatra',
      label: t('today.nakshatra'),
      name: pick(data.nakshatra.name, data.nakshatra.nameEn),
      time: timeRange(data.nakshatra.start, data.nakshatra.end),
    },
    {
      key: 'yoga',
      label: t('today.yoga'),
      name: pick(data.yogam.name, data.yogam.nameEn),
      time: fmtShort(data.yogam.end) !== '--' ? `till ${fmtShort(data.yogam.end)}` : '',
    },
    {
      key: 'karana',
      label: t('today.karana'),
      name: pick(data.karanam.name, data.karanam.nameEn),
      time: '',
    },
  ];

  return (
    <div style={styles.section}>
      <div style={styles.sectionLabel}>{t('today.panchang')}</div>
      <div style={styles.grid}>
        {cards.map((card) => (
          <PanchangCardItem
            key={card.key}
            cardKey={card.key}
            label={card.label}
            name={card.name}
            time={card.time}
            transitions={detailed?.timings?.[TRANSITION_KEYS[card.key]]}
            iconBg={ICON_BGS[card.key]}
            font={font}
            pick={pick}
          />
        ))}
      </div>
    </div>
  );
});

export default PanchangCards;

const styles = {
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#BBB',
    marginBottom: 12,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  card: {
    background: 'white',
    borderRadius: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  cardMain: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#999',
    marginBottom: 3,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  cardName: {
    fontSize: 17,
    fontWeight: 600,
    color: '#1A1A1A',
  },
  cardTime: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  chevron: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ═══ Transition detail rows ═══
  transitions: {
    padding: '0 16px 14px',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    marginTop: 0,
  },
  transitionRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '10px 0',
  },
  transitionNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    background: 'rgba(0,0,0,0.04)',
    color: '#999',
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    marginTop: 1,
  },
  transitionInfo: {
    flex: 1,
  },
  transitionName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1A1A1A',
  },
  transitionTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
};
