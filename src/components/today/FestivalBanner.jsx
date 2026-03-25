import { memo } from 'react';

const FestivalBanner = memo(function FestivalBanner({ festival, font, pick, t }) {
  const name = pick(festival.telugu, festival.english) || festival.english || '';

  return (
    <div style={styles.banner}>
      {/* Decorative circles */}
      <div style={styles.circle1} />
      <div style={styles.circle2} />
      {/* Content */}
      <div style={styles.label}>{t('today.observance')}</div>
      <div style={{ ...styles.name, fontFamily: font }}>{name}</div>
      {festival.description && (
        <div style={styles.desc}>{pick(festival.descriptionTe, festival.description)}</div>
      )}
    </div>
  );
});

export default FestivalBanner;

const styles = {
  banner: {
    background: 'linear-gradient(135deg, #E63B2E, #C62828)',
    borderRadius: 16,
    padding: '16px 20px',
    marginBottom: 22,
    position: 'relative',
    overflow: 'hidden',
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
  label: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
};
