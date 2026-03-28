import { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AdditionalInfoCard = memo(function AdditionalInfoCard({ detailed, t, font, pick }) {
  const { isNight, colors } = useTheme();
  // Extract from detailed panchangam data
  const rows = [];

  if (detailed?.rashi?.moonRashi) {
    rows.push({ label: t('today.rashi'), value: detailed.rashi.moonRashi, dot: '#E8A817' });
  }
  if (detailed?.rashi?.sunRashi) {
    rows.push({ label: t('field.sunRashi'), value: detailed.rashi.sunRashi, dot: '#E63B2E' });
  }
  if (detailed?.rashi?.dishaShoola) {
    rows.push({ label: t('today.dishaShool'), value: detailed.rashi.dishaShoola, dot: '#E63B2E' });
  }

  if (rows.length === 0) return null;

  return (
    <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
      <div style={{ ...styles.sectionLabel, color: colors.textFaint }}>{t('today.moreDetails')}</div>
      {rows.map((item, i) => (
        <div key={i} style={{ ...styles.row, borderTop: i > 0 ? `1px solid ${colors.border}` : 'none' }}>
          <span style={{ ...styles.label, fontFamily: font, color: colors.textMuted }}>{item.label}</span>
          <div style={styles.valueWrap}>
            <span style={{ ...styles.value, fontFamily: font, color: colors.text }}>{item.value}</span>
            <div style={{ ...styles.dot, background: item.dot }} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default AdditionalInfoCard;

const styles = {
  card: {
    background: 'white',
    borderRadius: 14,
    padding: '16px 18px',
    border: '1px solid rgba(0,0,0,0.04)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#BBB',
    marginBottom: 14,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  label: {
    fontSize: 15,
    color: '#999',
  },
  valueWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1A1A1A',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
};
