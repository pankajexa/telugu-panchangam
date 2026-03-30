import { memo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, ChevronUp, BookOpen, UtensilsCrossed, Clock, Music } from 'lucide-react';

const PracticesCard = memo(function PracticesCard({ practices, defaultExpanded = false }) {
  const { pick, font } = useLanguage();
  const { isNight, colors } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!practices) return null;

  const title = pick(practices.title_te, practices.title_en);

  return (
    <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
      {/* Header — tap to expand/collapse */}
      <button style={styles.header} onClick={() => setExpanded(e => !e)}>
        <div style={styles.headerLeft}>
          <BookOpen size={18} color="#E63B2E" strokeWidth={2} />
          <span style={{ ...styles.title, fontFamily: font, color: colors.text }}>{title}</span>
        </div>
        {expanded
          ? <ChevronUp size={18} color={colors.textMuted} strokeWidth={1.8} />
          : <ChevronDown size={18} color={colors.textMuted} strokeWidth={1.8} />
        }
      </button>

      {expanded && (
        <div style={styles.body}>
          {/* Steps */}
          <div style={styles.stepsList}>
            {practices.steps.map((step, i) => (
              <div key={i} style={styles.stepRow}>
                <div style={styles.stepNum}>{i + 1}</div>
                <div style={{ ...styles.stepText, fontFamily: font, color: colors.text }}>
                  {pick(step.te, step.en)}
                </div>
              </div>
            ))}
          </div>

          {/* Mantra */}
          {practices.mantra && (
            <div style={styles.mantraBox}>
              <div style={{ ...styles.sectionLabel, color: colors.textMuted, marginBottom: 8 }}>
                <Music size={13} color="#E63B2E" strokeWidth={2} />
                <span>{pick('మంత్రం', 'Mantra')}</span>
              </div>
              <div style={{ ...styles.mantraText, fontFamily: font }}>
                {practices.mantra.text}
              </div>
              {practices.mantra.text_en && (
                <div style={{ ...styles.mantraEn, color: colors.textMuted }}>{practices.mantra.text_en}</div>
              )}
            </div>
          )}

          {/* Food */}
          {practices.food && (
            <div style={styles.foodBox}>
              <div style={{ ...styles.sectionLabel, color: colors.textMuted }}>
                <UtensilsCrossed size={13} color="#2D8A39" strokeWidth={2} />
                <span>{pick('ఆహారం', 'Food')}</span>
              </div>
              {(practices.food.offer_te || practices.food.offer_en) && (
                <div style={styles.foodRow}>
                  <span style={styles.foodCheck}>✓</span>
                  <span style={{ ...styles.foodText, fontFamily: font }}>
                    {pick(practices.food.offer_te, practices.food.offer_en)}
                  </span>
                </div>
              )}
              {(practices.food.avoid_te || practices.food.avoid_en) && (
                <div style={styles.foodRow}>
                  <span style={styles.foodCross}>✕</span>
                  <span style={{ ...styles.foodText, fontFamily: font, color: '#CC3333' }}>
                    {pick(practices.food.avoid_te, practices.food.avoid_en)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Timing */}
          {practices.timing && (
            <div style={styles.timingBox}>
              <div style={{ ...styles.sectionLabel, color: colors.textMuted }}>
                <Clock size={13} color="#B8860B" strokeWidth={2} />
                <span>{pick('సమయం', 'Timing')}</span>
              </div>
              <div style={{ ...styles.timingText, fontFamily: font }}>
                {pick(practices.timing.te, practices.timing.en)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default PracticesCard;

const styles = {
  card: {
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    marginBottom: 22,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '16px 18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
  },
  body: {
    padding: '0 18px 18px',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  stepRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #FFF0E8, #FFE4D4)',
    color: '#E63B2E',
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  stepText: {
    fontSize: 13,
    lineHeight: 1.55,
    flex: 1,
  },
  // Mantra section
  mantraBox: {
    marginTop: 16,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #FFF8F5, #FFF0EA)',
    border: '1px solid rgba(230,59,46,0.1)',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  mantraText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#E63B2E',
    lineHeight: 1.5,
  },
  mantraEn: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  // Food section
  foodBox: {
    marginTop: 14,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #F8FFF8, #F0FFF0)',
    border: '1px solid rgba(45,138,57,0.1)',
  },
  foodRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 6,
  },
  foodCheck: {
    color: '#2D8A39',
    fontWeight: 800,
    fontSize: 12,
    flexShrink: 0,
    marginTop: 1,
  },
  foodCross: {
    color: '#CC3333',
    fontWeight: 800,
    fontSize: 12,
    flexShrink: 0,
    marginTop: 1,
  },
  foodText: {
    fontSize: 13,
    lineHeight: 1.5,
    color: '#2D8A39',
  },
  // Timing section
  timingBox: {
    marginTop: 14,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #FFFCF0, #FFF9E6)',
    border: '1px solid rgba(184,134,11,0.1)',
  },
  timingText: {
    fontSize: 13,
    color: '#B8860B',
    lineHeight: 1.5,
  },
};
