import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { DiyaIcon, TrishulIcon, LotusIcon, MalaIcon, NamasteIcon, ScrollIcon, SunIcon, BellIcon } from '../components/HinduIcons';

const ICON_MAP = {
  diya: DiyaIcon,
  trishul: TrishulIcon,
  lotus: LotusIcon,
  mala: MalaIcon,
  namaste: NamasteIcon,
  scroll: ScrollIcon,
  sun: SunIcon,
};

function PujaItemIcon({ name }) {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp size={24} color="#C49B2A" /> : null;
}

export default function PujaPage() {
  const { t, font } = useLanguage();
  const { colors } = useTheme();

  const pujaItems = t('puja.items');
  const stotraItems = t('puja.stotras');
  const minLabel = t('puja.min');

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.title, fontFamily: font, color: colors.text }}>{t('puja.title')}</h1>
      <p style={{ ...styles.subtitle, color: colors.textMuted }}>{t('puja.subtitle')}</p>

      {/* Daily Pujas */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('puja.dailyTitle')}</span>
          <span style={styles.sectionSubtitle}>{t('puja.dailySub')}</span>
        </div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          {pujaItems.map((item, i) => (
            <div key={item.name}>
              <div style={styles.itemRow}>
                <span style={styles.cardIcon}><PujaItemIcon name={item.icon} /></span>
                <div style={styles.cardContent}>
                  <span style={{ ...styles.cardName, fontFamily: font, color: colors.text }}>{item.name}</span>
                  <span style={styles.cardDuration}>{item.duration} {minLabel}</span>
                </div>
                <div style={styles.playBtn}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke="#C49B2A" strokeWidth="1.5" opacity="0.3" />
                    <path d="M13 10.5L21 16L13 21.5V10.5Z" fill="#C49B2A" opacity="0.5" />
                  </svg>
                </div>
              </div>
              {i < pujaItems.length - 1 && <div style={styles.divider} />}
            </div>
          ))}
        </div>
      </div>

      {/* Stotras */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('puja.stotraTitle')}</span>
          <span style={styles.sectionSubtitle}>{t('puja.stotraSub')}</span>
        </div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          {stotraItems.map((item, i) => (
            <div key={item.name}>
              <div style={styles.itemRow}>
                <span style={styles.cardIcon}><PujaItemIcon name={item.icon} /></span>
                <div style={styles.cardContent}>
                  <span style={{ ...styles.cardName, fontFamily: font, color: colors.text }}>{item.name}</span>
                  <span style={styles.cardDuration}>{item.duration} {minLabel}</span>
                </div>
                <div style={styles.playBtn}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke="#C49B2A" strokeWidth="1.5" opacity="0.3" />
                    <path d="M13 10.5L21 16L13 21.5V10.5Z" fill="#C49B2A" opacity="0.5" />
                  </svg>
                </div>
              </div>
              {i < stotraItems.length - 1 && <div style={styles.divider} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.comingSoon, background: colors.cardBg, border: `1px dashed ${colors.border}` }}>
        <div style={styles.comingSoonIcon}><BellIcon size={32} color="#C49B2A" /></div>
        <p style={{ ...styles.comingSoonText, fontFamily: font }}>{t('puja.comingSoon')}</p>
        <p style={styles.comingSoonSubtext}>{t('puja.comingSoonSub')}</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '0 20px', maxWidth: '432px', margin: '0 auto' },
  title: { fontSize: '24px', fontWeight: 800, textAlign: 'center', margin: '0 0 4px' },
  subtitle: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: '12px', textAlign: 'center', margin: '0 0 24px' },
  section: { marginBottom: '20px' },
  sectionHeader: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#C49B2A' },
  sectionSubtitle: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: '11px', color: '#B5A899' },
  card: {
    borderRadius: '16px',
    padding: '4px 16px',
    boxShadow: '0 2px 12px rgba(45,24,16,0.06), 0 1px 3px rgba(45,24,16,0.04)',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
  },
  divider: { height: '1px', background: 'rgba(45,24,16,0.06)' },
  cardIcon: { fontSize: '22px', flexShrink: 0 },
  cardContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  cardName: { fontSize: '14px', fontWeight: 600 },
  cardDuration: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: '11px', color: '#B5A899' },
  playBtn: { flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  comingSoon: {
    textAlign: 'center',
    padding: '24px 16px',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(45,24,16,0.06)',
  },
  comingSoonIcon: { fontSize: '32px', marginBottom: '8px' },
  comingSoonText: { fontSize: '14px', fontWeight: 600, color: '#C49B2A', margin: '0 0 4px' },
  comingSoonSubtext: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: '11px', color: '#B5A899', margin: 0, lineHeight: 1.5 },
};
