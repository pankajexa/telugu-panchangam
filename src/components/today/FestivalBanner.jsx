import { memo, useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen, UtensilsCrossed, Clock, Music } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FestivalBanner = memo(function FestivalBanner({ festival, font, pick, t, practices }) {
  const name = pick(festival.telugu, festival.english) || festival.english || '';
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, practices]);

  const hasPractices = practices && practices.steps?.length > 0;

  return (
    <div style={styles.card}>
      {/* Red banner — always visible */}
      <div
        style={{
          ...styles.banner,
          borderRadius: hasPractices ? (expanded ? '16px 16px 0 0' : 16) : 16,
          cursor: hasPractices ? 'pointer' : 'default',
        }}
        onClick={() => hasPractices && setExpanded(e => !e)}
      >
        {/* Decorative circles */}
        <div style={styles.circle1} />
        <div style={styles.circle2} />
        <div style={styles.circle3} />

        {/* Content */}
        <div style={styles.topRow}>
          <div style={styles.label}>{t('today.observance')}</div>
          {hasPractices && (
            <div style={{
              ...styles.chevronWrap,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
              <ChevronDown size={20} color="rgba(255,255,255,0.85)" strokeWidth={2.5} />
            </div>
          )}
        </div>
        <div style={{ ...styles.name, fontFamily: font }}>{name}</div>
        {festival.description && (
          <div style={styles.desc}>{pick(festival.descriptionTe, festival.description)}</div>
        )}
        {hasPractices && !expanded && (
          <div style={styles.hint}>
            <BookOpen size={12} color="rgba(255,255,255,0.6)" strokeWidth={2} />
            <span>{pick('ఆచారాలు చూడండి', 'View practices')}</span>
          </div>
        )}
      </div>

      {/* Expandable practices section */}
      {hasPractices && (
        <div style={{
          ...styles.practicesWrap,
          maxHeight: expanded ? contentHeight + 40 : 0,
          opacity: expanded ? 1 : 0,
          padding: expanded ? '18px 18px 20px' : '0 18px',
        }}>
          <div ref={contentRef}>
            {/* Steps */}
            <div style={styles.stepsList}>
              {practices.steps.map((step, i) => (
                <div key={i} style={styles.stepRow}>
                  <div style={styles.stepNum}>{i + 1}</div>
                  <div style={{ ...styles.stepText, fontFamily: font }}>
                    {pick(step.te, step.en)}
                  </div>
                </div>
              ))}
            </div>

            {/* Mantra */}
            {practices.mantra && (
              <div style={styles.mantraBox}>
                <div style={styles.sectionLabel}>
                  <Music size={13} color="#E63B2E" strokeWidth={2} />
                  <span>{pick('మంత్రం', 'Mantra')}</span>
                </div>
                <div style={{ ...styles.mantraText, fontFamily: font }}>
                  {practices.mantra.text}
                </div>
                {practices.mantra.text_en && (
                  <div style={styles.mantraEn}>{practices.mantra.text_en}</div>
                )}
              </div>
            )}

            {/* Food */}
            {practices.food && (
              <div style={styles.foodBox}>
                <div style={styles.sectionLabel}>
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
                <div style={styles.sectionLabel}>
                  <Clock size={13} color="#B8860B" strokeWidth={2} />
                  <span>{pick('సమయం', 'Timing')}</span>
                </div>
                <div style={{ ...styles.timingText, fontFamily: font }}>
                  {pick(practices.timing.te, practices.timing.en)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default FestivalBanner;

const styles = {
  card: {
    borderRadius: 16,
    marginBottom: 22,
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(230,59,46,0.15)',
  },
  banner: {
    background: 'linear-gradient(135deg, #E63B2E, #C62828)',
    padding: '16px 20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-radius 0.3s ease',
  },
  circle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
  },
  circle2: {
    position: 'absolute',
    bottom: -30,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
  },
  circle3: {
    position: 'absolute',
    top: 10,
    left: -15,
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    color: 'white',
    fontFamily: "'Playfair Display', serif",
  },
  desc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    lineHeight: 1.5,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    fontSize: 11,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  // Expandable practices section
  practicesWrap: {
    background: 'white',
    overflow: 'hidden',
    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.4s ease',
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
    color: '#333',
    flex: 1,
  },
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
    color: '#999',
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
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
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
