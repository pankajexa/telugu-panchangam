import { memo } from 'react';
import MoonPhase from './MoonPhase';
import { useTheme } from '../../context/ThemeContext';

const ENGLISH_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TELUGU_DAYS = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

const DayHeader = memo(function DayHeader({ data, detailed, font, pick, language, t }) {
  const { isNight, colors } = useTheme();
  const today = new Date();
  const dayName = pick(TELUGU_DAYS[today.getDay()], ENGLISH_DAYS[today.getDay()]);
  const dateStr = `${data.dateNum} ${data.englishMonth}, ${data.year}`;
  const masaLabel = pick(data.masam?.telugu, data.masam?.english) || '';

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        {/* Hindu month name */}
        <div style={styles.masaRow}>
          <span style={{ ...styles.masaName, fontFamily: font }}>{masaLabel}</span>
        </div>
        {/* Large date (primary) */}
        <h1 style={{ ...styles.dateNum, color: colors.text }}>{dateStr}</h1>
        {/* Day name (secondary, smaller) */}
        <div style={{ ...styles.dayName, fontFamily: font, color: colors.iconColor }}>{dayName}</div>
      </div>
      {/* Moon phase */}
      <MoonPhase
        tithiIndex={data.tithiIndex}
        tithiName={pick(data.tithi.name, data.tithi.nameEn)}
        paksha={pick(data.paksha, data.pakshaEn)}
        t={t}
        isNight={isNight}
      />
    </div>
  );
});

export default DayHeader;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  left: {
    flex: 1,
  },
  masaRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  masaName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#E63B2E',
    letterSpacing: '0.03em',
  },
  masaDot: {
    fontSize: 11,
    color: '#E63B2E',
    opacity: 0.5,
  },
  samvatsara: {
    fontSize: 11,
    fontWeight: 500,
    color: '#E63B2E',
    opacity: 0.7,
    letterSpacing: '0.04em',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  dateNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 30,
    fontWeight: 700,
    color: '#1A1A1A',
    margin: 0,
    lineHeight: 1.15,
  },
  dayName: {
    fontSize: 19,
    fontWeight: 500,
    color: '#666',
    marginTop: 6,
    letterSpacing: '0.01em',
  },
};
