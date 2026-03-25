import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen } from 'lucide-react';
import { CATEGORY_LABELS } from '../../data/shlokas';

const DEVANAGARI = "'Noto Sans Devanagari', sans-serif";
const TELUGU = "'Noto Sans Telugu', sans-serif";

const ShlokaCard = memo(function ShlokaCard({ shloka, onTap, label }) {
  const { pick, font } = useLanguage();
  if (!shloka) return null;

  const purposeLabel = CATEGORY_LABELS[shloka.purposeCategory]
    ? pick(CATEGORY_LABELS[shloka.purposeCategory].te, CATEGORY_LABELS[shloka.purposeCategory].en)
    : shloka.purpose;

  const firstDevanagari = shloka.sanskritDevanagari.split('\n')[0];
  const firstTelugu = shloka.teluguTransliteration.split('\n')[0];
  const shortMeaning = shloka.englishMeaning.length > 90
    ? shloka.englishMeaning.slice(0, 90) + '...'
    : shloka.englishMeaning;

  return (
    <div style={styles.card} onClick={onTap}>
      <div style={styles.header}>
        <BookOpen size={16} color="#E63B2E" strokeWidth={2} />
        <span style={styles.label}>{label || pick('నేటి శ్లోకం', 'Shloka of the Day')}</span>
        <span style={styles.purposeChip}>{purposeLabel}</span>
      </div>
      <div style={{ ...styles.devanagari, fontFamily: DEVANAGARI }}>{firstDevanagari}...</div>
      <div style={{ ...styles.telugu, fontFamily: TELUGU }}>{firstTelugu}</div>
      <div style={styles.meaning}>{shortMeaning}</div>
      <div style={styles.footer}>
        <span style={styles.source}>{shloka.source}</span>
        <span style={styles.readMore}>{pick('చదవండి & షేర్ ›', 'Read & Share ›')}</span>
      </div>
    </div>
  );
});

export default ShlokaCard;

const styles = {
  card: { background: 'white', borderRadius: 16, padding: '16px 18px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' },
  header: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E63B2E', flex: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  purposeChip: { fontSize: 10, fontWeight: 600, color: '#E63B2E', background: 'rgba(230,59,46,0.08)', padding: '3px 10px', borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  devanagari: { fontSize: 17, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.6, marginBottom: 6 },
  telugu: { fontSize: 14, color: '#666', lineHeight: 1.5, marginBottom: 8 },
  meaning: { fontSize: 13, color: '#888', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 10 },
  source: { fontSize: 11, color: '#BBB', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  readMore: { fontSize: 12, fontWeight: 600, color: '#E63B2E', fontFamily: "'Plus Jakarta Sans', sans-serif" },
};
