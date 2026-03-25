import { memo } from 'react';

const QualityBadge = ({ quality, t }) => {
  const config = {
    excellent: { bg: 'var(--color-shubh-bg)', color: 'var(--color-shubh)', border: 'var(--color-shubh-border)', label: t('muhurta.shubh') },
    good: { bg: 'var(--color-good-bg)', color: 'var(--color-good)', border: 'var(--color-good-border)', label: t('muhurta.good') },
    avoid: { bg: 'var(--color-avoid-bg)', color: 'var(--color-avoid)', border: 'var(--color-avoid-border)', label: t('muhurta.avoid') },
  };
  const s = config[quality] || config.good;
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: '0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>{s.label}</span>
  );
};

const TimingsSection = memo(function TimingsSection({ data, t, font }) {
  const auspicious = [
    { name: t('muhurta.abhijit'), time: data.abhijitMuhurta, quality: 'excellent' },
    { name: t('muhurta.amrit'), time: data.amritKalam, quality: 'excellent' },
    { name: t('muhurta.brahma'), time: data.brahmaMuhurta, quality: 'good' },
  ].filter(m => m.time && m.time !== '--');

  // Durmuhurtham is an array of range strings (1 or 2 entries)
  const durmuhurthamArr = Array.isArray(data.durmuhurtham)
    ? data.durmuhurtham.filter(d => d && d !== '--')
    : (data.durmuhurtham && data.durmuhurtham !== '--' ? [data.durmuhurtham] : []);

  const inauspicious = [
    { name: t('muhurta.rahu'), time: data.rahuKalam, quality: 'avoid' },
    { name: t('muhurta.yamaganda'), time: data.yamagandam, quality: 'avoid' },
    { name: t('muhurta.gulika'), time: data.gulikaKalam, quality: 'avoid' },
    { name: t('muhurta.varjyam'), time: data.varjyam, quality: 'avoid' },
    ...durmuhurthamArr.map((time, i) => ({
      name: t('muhurta.durmuhurtham') + (durmuhurthamArr.length > 1 ? ` ${i + 1}` : ''),
      time,
      quality: 'avoid',
    })),
  ].filter(m => m.time && m.time !== '--');

  return (
    <div style={styles.container}>
      {/* Auspicious */}
      {auspicious.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.dot, background: 'var(--color-shubh)' }} />
            <span style={{ ...styles.sectionLabel, color: 'var(--color-shubh)' }}>{t('muhurta.auspicious')}</span>
          </div>
          <div style={styles.list}>
            {auspicious.map((m, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.info}>
                  <div style={{ ...styles.name, fontFamily: font }}>{m.name}</div>
                  <div style={styles.time}>{m.time}</div>
                </div>
                <QualityBadge quality={m.quality} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inauspicious */}
      {inauspicious.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.dot, background: 'var(--color-avoid)' }} />
            <span style={{ ...styles.sectionLabel, color: 'var(--color-avoid)' }}>{t('muhurta.inauspicious')}</span>
          </div>
          <div style={styles.list}>
            {inauspicious.map((m, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.info}>
                  <div style={{ ...styles.name, fontFamily: font }}>{m.name}</div>
                  <div style={styles.time}>{m.time}</div>
                </div>
                <QualityBadge quality={m.quality} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default TimingsSection;

const styles = {
  container: {
    marginBottom: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  card: {
    background: 'white',
    borderRadius: 14,
    padding: '14px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid rgba(0,0,0,0.04)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  info: {},
  name: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1A1A1A',
  },
  time: {
    fontSize: 14,
    color: '#999',
    marginTop: 3,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
};
