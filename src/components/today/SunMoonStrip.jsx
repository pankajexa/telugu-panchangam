import { memo } from 'react';
import { Sunrise, Sunset, MoonStar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SunMoonStrip = memo(function SunMoonStrip({ data, detailed, t }) {
  const { isNight, colors } = useTheme();
  // Format moonrise from HH:MM 24h to 12h display
  const fmt12 = (t24) => {
    if (!t24 || t24 === '--') return '--';
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const items = [
    { label: t('today.sunrise'), time: fmt12(data.sunrise) || '--', Icon: Sunrise, color: '#D4790A', bg: 'var(--sunrise-bg)' },
    { label: t('today.sunset'), time: fmt12(data.sunset) || '--', Icon: Sunset, color: '#C74530', bg: 'var(--sunset-bg)' },
    { label: t('today.moonrise'), time: fmt12(data.moonrise) || '--', Icon: MoonStar, color: '#6366A0', bg: 'var(--moonrise-bg)' },
  ];

  return (
    <div style={{ ...styles.strip, border: `1px solid ${colors.border}` }}>
      {items.map((item, i) => (
        <div key={i} style={{ ...styles.cell, background: item.bg, borderRight: i < 2 ? `1px solid ${colors.border}` : 'none' }}>
          <div style={styles.icon}><item.Icon size={18} color={item.color} strokeWidth={1.8} /></div>
          <div style={{ ...styles.label, color: colors.textMuted }}>{item.label}</div>
          <div style={{ ...styles.time, color: colors.text }}>{item.time}</div>
        </div>
      ))}
    </div>
  );
});

export default SunMoonStrip;

const styles = {
  strip: {
    display: 'flex',
    gap: 0,
    marginBottom: 22,
    marginTop: 14,
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  cell: {
    flex: 1,
    padding: '12px 8px',
    textAlign: 'center',
  },
  icon: {
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  time: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1A1A1A',
    marginTop: 2,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
};
