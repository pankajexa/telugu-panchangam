import { useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useReminders } from '../context/ReminderContext';
import { getPanchangamForDate, getDetailedPanchangam } from '../data/panchangam';
import { getAlarmTimes } from '../utils/sandhyaTimes';
import DayHeader from '../components/today/DayHeader';
import SunMoonStrip from '../components/today/SunMoonStrip';
import FestivalBanner from '../components/today/FestivalBanner';
import PanchangCards from '../components/today/PanchangCards';
import AdditionalInfoCard from '../components/today/AdditionalInfoCard';
import PracticesCard from '../components/today/PracticesCard';
import { getPractices } from '../data/festivalPractices';

// All prefs enabled for detailed data fetch
const ALL_PREFS = {
  rashi: true, rashi_sunRashi: true, rashi_moonRashi: true, rashi_dishaShoola: true,
  timings: true, timings_moonrise: true, timings_moonset: true,
  dt_tithiTransitions: true, dt_nakshatraTransitions: true,
  dt_yogaTransitions: true, dt_karanaTransitions: true,
};

export default function TodayPage() {
  const { t, pick, font, language } = useLanguage();
  const { location } = useLocation();
  const { setSunData, setAlarmTimes } = useReminders();

  const today = useMemo(() => new Date(), []);
  const data = useMemo(() => getPanchangamForDate(today, location), [today, location]);
  const detailed = useMemo(() => getDetailedPanchangam(today, location, ALL_PREFS), [today, location]);
  const practices = useMemo(() => data ? getPractices(data.festival, data.vrathams) : null, [data]);

  // Feed sunrise/sunset data to ReminderContext for alarm scheduling
  useEffect(() => {
    if (!data?.sunrise || !data?.sunset) return;
    setSunData(data.sunrise, data.sunset);
    const times = getAlarmTimes(data.sunrise, data.sunset);
    if (times) setAlarmTimes(times);
  }, [data?.sunrise, data?.sunset, setSunData, setAlarmTimes]);

  if (!data) return null;

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        {/* Header: Day name + Moon phase */}
        <DayHeader data={data} detailed={detailed} font={font} pick={pick} language={language} t={t} />

        {/* Sunrise / Sunset / Moonrise strip */}
        <SunMoonStrip data={data} detailed={detailed} t={t} />

        {/* Festival banner with integrated practices (expandable) */}
        {data.festival && (
          <FestivalBanner festival={data.festival} font={font} pick={pick} t={t} practices={practices} />
        )}

        {/* Standalone practices card — only if there are practices but no festival banner */}
        {practices && !data.festival && <PracticesCard practices={practices} />}

        {/* Panchang cards: Tithi, Nakshatra, Yoga, Karana — with expandable transitions */}
        <PanchangCards data={data} detailed={detailed} font={font} pick={pick} t={t} />

        {/* Additional info: Rashi, Chandrabala, Disha Shool */}
        <AdditionalInfoCard detailed={detailed} t={t} font={font} pick={pick} />

      </div>
    </div>
  );
}

const styles = {
  page: {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    minHeight: '100%',
  },
  content: {
    padding: '8px 20px 100px',
  },
};
