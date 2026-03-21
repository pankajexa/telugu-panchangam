import { useMemo } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { getPanchangamForDate } from '../data/panchangam';
import { StarIcon } from '../components/HinduIcons';

const rashiList = [
  { telugu: 'మేషం', english: 'Aries', symbol: '♈' },
  { telugu: 'వృషభం', english: 'Taurus', symbol: '♉' },
  { telugu: 'మిథునం', english: 'Gemini', symbol: '♊' },
  { telugu: 'కర్కాటకం', english: 'Cancer', symbol: '♋' },
  { telugu: 'సింహం', english: 'Leo', symbol: '♌' },
  { telugu: 'కన్య', english: 'Virgo', symbol: '♍' },
  { telugu: 'తుల', english: 'Libra', symbol: '♎' },
  { telugu: 'వృశ్చికం', english: 'Scorpio', symbol: '♏' },
  { telugu: 'ధనుస్సు', english: 'Sagittarius', symbol: '♐' },
  { telugu: 'మకరం', english: 'Capricorn', symbol: '♑' },
  { telugu: 'కుంభం', english: 'Aquarius', symbol: '♒' },
  { telugu: 'మీనం', english: 'Pisces', symbol: '♓' },
];

export default function JyotishPage() {
  const { location } = useLocation();
  const { t, pick, font } = useLanguage();

  const todayData = useMemo(() => {
    return getPanchangamForDate(new Date(), location);
  }, [location]);

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.title, fontFamily: font }}>{t('jyotish.title')}</h1>
      <p style={styles.subtitle}>{t('jyotish.subtitle')}</p>

      {/* Today's cosmic snapshot */}
      <div style={styles.todayCard}>
        <div style={{ ...styles.todayTitle, fontFamily: font }}>{t('jyotish.todayTitle')}</div>
        <div style={styles.todayGrid}>
          {todayData?.tithi && (
            <div style={styles.todayItem}>
              <span style={{ ...styles.todayLabel, fontFamily: font }}>{t('jyotish.tithi')}</span>
              <span style={{ ...styles.todayValue, fontFamily: font }}>{pick(todayData.tithi.name, todayData.tithi.nameEn)}</span>
            </div>
          )}
          {todayData?.nakshatra && (
            <div style={styles.todayItem}>
              <span style={{ ...styles.todayLabel, fontFamily: font }}>{t('jyotish.nakshatra')}</span>
              <span style={{ ...styles.todayValue, fontFamily: font }}>{pick(todayData.nakshatra.name, todayData.nakshatra.nameEn)}</span>
            </div>
          )}
          {todayData?.yogam && (
            <div style={styles.todayItem}>
              <span style={{ ...styles.todayLabel, fontFamily: font }}>{t('jyotish.yogam')}</span>
              <span style={{ ...styles.todayValue, fontFamily: font }}>{pick(todayData.yogam.name, todayData.yogam.nameEn)}</span>
            </div>
          )}
          {todayData?.karanam && (
            <div style={styles.todayItem}>
              <span style={{ ...styles.todayLabel, fontFamily: font }}>{t('jyotish.karanam')}</span>
              <span style={{ ...styles.todayValue, fontFamily: font }}>{pick(todayData.karanam.name, todayData.karanam.nameEn)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rashi grid */}
      <div style={styles.sectionHeader}>
        <span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('jyotish.rashiTitle')}</span>
        <span style={styles.sectionSubtitle}>{t('jyotish.rashiSub')}</span>
      </div>

      <div style={styles.rashiGrid}>
        {rashiList.map((rashi) => (
          <div key={rashi.english} style={styles.rashiCard}>
            <span style={styles.rashiSymbol}>{rashi.symbol}</span>
            <span style={{ ...styles.rashiPrimary, fontFamily: font }}>{pick(rashi.telugu, rashi.english)}</span>
            <span style={styles.rashiSecondary}>{pick(rashi.english, rashi.telugu)}</span>
          </div>
        ))}
      </div>

      {/* Birth chart CTA */}
      <div style={styles.comingSoon}>
        <div style={styles.comingSoonIcon}><StarIcon size={32} color="#C49B2A" /></div>
        <p style={{ ...styles.comingSoonText, fontFamily: font }}>{t('jyotish.birthChart')}</p>
        <p style={styles.comingSoonSubtext}>{t('jyotish.birthChartSub')}</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '0 20px', maxWidth: '432px', margin: '0 auto' },
  title: { fontSize: '24px', fontWeight: 800, color: '#2D1810', textAlign: 'center', margin: '0 0 4px' },
  subtitle: { fontFamily: "'Inter', system-ui, sans-serif", fontSize: '12px', color: '#8A7568', textAlign: 'center', margin: '0 0 20px' },
  todayCard: {
    background: '#FFFFFF',
    border: '1px solid rgba(45,24,16,0.06)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(45,24,16,0.06), 0 1px 3px rgba(45,24,16,0.04)',
  },
  todayTitle: { fontSize: '15px', fontWeight: 700, color: '#C49B2A', marginBottom: '12px', textAlign: 'center' },
  todayGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  todayItem: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '10px 12px', background: '#FDF8EF', borderRadius: '12px' },
  todayLabel: { fontSize: '11px', fontWeight: 500, color: '#8A7568' },
  todayValue: { fontSize: '13px', fontWeight: 700, color: '#2D1810' },
  sectionHeader: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#C49B2A' },
  sectionSubtitle: { fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', color: '#B5A899' },
  rashiGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' },
  rashiCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    padding: '12px 8px',
    background: '#FFFFFF',
    border: '1px solid rgba(45,24,16,0.06)',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(45,24,16,0.05)',
  },
  rashiSymbol: { fontSize: '24px', marginBottom: '2px' },
  rashiPrimary: { fontSize: '12px', fontWeight: 700, color: '#2D1810' },
  rashiSecondary: { fontFamily: "'Inter', system-ui, sans-serif", fontSize: '9px', color: '#B5A899' },
  comingSoon: {
    textAlign: 'center',
    padding: '24px 16px',
    background: '#FFFFFF',
    border: '1px dashed rgba(45,24,16,0.12)',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(45,24,16,0.06)',
  },
  comingSoonIcon: { fontSize: '32px', marginBottom: '8px' },
  comingSoonText: { fontSize: '14px', fontWeight: 600, color: '#C49B2A', margin: '0 0 4px' },
  comingSoonSubtext: { fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', color: '#B5A899', margin: 0, lineHeight: 1.5 },
};
