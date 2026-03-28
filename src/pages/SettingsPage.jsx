import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useReminders } from '../context/ReminderContext';
import { usePanchangamPrefs } from '../context/PanchangamPrefsContext';
import { Globe, MapPin, Bell, Sun, Moon, SunMoon, Info, ArrowLeft } from 'lucide-react';
import { DiyaIcon, TrishulIcon, MalaIcon } from '../components/icons/HinduIcons';

// Wrapper to match old API: { size, color } props
const GlobeIcon = ({ size = 18, color }) => <Globe size={size} color={color} strokeWidth={1.8} />;
const PinIcon = ({ size = 18, color }) => <MapPin size={size} color={color} strokeWidth={1.8} />;
const BellIcon = ({ size = 18, color }) => <Bell size={size} color={color} strokeWidth={1.8} />;
const SunIcon = ({ size = 18, color }) => <Sun size={size} color={color} strokeWidth={1.8} />;
const InfoIcon = ({ size = 18, color }) => <Info size={size} color={color} strokeWidth={1.8} />;
const NamasteIcon = ({ size = 18, color }) => <MalaIcon size={size} color={color} />;

const TELUGU = "'Noto Sans Telugu', serif";
const SERIF = "'Plus Jakarta Sans', system-ui, sans-serif";

function Toggle({ on, onToggle }) {
  return (
    <button style={{ ...toggleStyles.track, ...(on ? toggleStyles.trackOn : {}) }} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      <div style={{ ...toggleStyles.thumb, ...(on ? toggleStyles.thumbOn : {}) }} />
    </button>
  );
}

const toggleStyles = {
  track: {
    width: '44px', height: '24px', borderRadius: '12px',
    background: '#DDD', border: 'none', padding: '2px',
    cursor: 'pointer', flexShrink: 0, transition: 'background 200ms',
    display: 'flex', alignItems: 'center',
  },
  trackOn: { background: '#E63B2E' },
  thumb: {
    width: '20px', height: '20px', borderRadius: '50%',
    background: '#FFFFFF', transition: 'transform 200ms',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  thumbOn: { transform: 'translateX(20px)' },
};

function TimeSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={timeStyles.select}
    >
      {['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00'].map(t => (
        <option key={t} value={t}>{formatTime(t)}</option>
      ))}
    </select>
  );
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
}

const timeStyles = {
  select: {
    fontFamily: SERIF, fontSize: '12px', fontWeight: 600,
    color: '#1A1A1A', background: '#FFF9F0',
    border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px',
    padding: '4px 8px', cursor: 'pointer', outline: 'none',
  },
};

function OffsetSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={timeStyles.select}
    >
      <option value={0}>At time</option>
      <option value={15}>15 min before</option>
      <option value={30}>30 min before</option>
    </select>
  );
}

function AdvanceDaysSelector({ value, onChange, language }) {
  const pick = (te, en) => language === 'te' ? te : en;
  const selected = Array.isArray(value) ? value : [value];

  const toggle = (d) => {
    const has = selected.includes(d);
    if (has) {
      // Don't allow deselecting all — keep at least one
      if (selected.length <= 1) return;
      onChange(selected.filter(v => v !== d));
    } else {
      onChange([...selected, d].sort());
    }
  };

  const labels = [
    pick('అదే రోజు', 'Same day'),
    pick('1 రోజు ముందు', '1 day before'),
    pick('2 రోజులు ముందు', '2 days before'),
  ];

  return (
    <div style={advStyles.row}>
      {[0, 1, 2].map(d => {
        const active = selected.includes(d);
        return (
          <button
            key={d}
            style={{ ...advStyles.pill, ...(active ? advStyles.pillActive : {}) }}
            onClick={(e) => { e.stopPropagation(); toggle(d); }}
          >
            {active && <span style={advStyles.check}>✓</span>}
            {labels[d]}
          </button>
        );
      })}
    </div>
  );
}

const advStyles = {
  row: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  pill: {
    fontFamily: SERIF, fontSize: '11px', fontWeight: 600,
    color: '#999', background: '#FFF9F0',
    border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '20px',
    padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
    display: 'flex', alignItems: 'center', gap: '4px',
    transition: 'all 150ms',
  },
  pillActive: {
    color: '#E63B2E', background: 'rgba(230,59,46,0.1)',
    border: '1.5px solid #E63B2E',
  },
  check: {
    fontSize: '10px', fontWeight: 800,
  },
};

export default function SettingsPage() {
  const { t, font, language, setLanguage } = useLanguage();
  const { isNight, colors, preference, setThemePreference } = useTheme();
  const { prefs, updatePref, requestPermission } = useReminders();
  const { prefs: pPrefs, updatePref: updatePPref } = usePanchangamPrefs();
  const [expandedSection, setExpandedSection] = useState(null);
  const [sampradaya, setSampradaya] = useState(() => localStorage.getItem('sampradaya') || 'smartha');

  const toggleSection = useCallback((section) => {
    setExpandedSection(prev => prev === section ? null : section);
  }, []);

  const handleMasterToggle = useCallback((key) => {
    const newVal = !prefs[key];
    updatePref(key, newVal);
    // Request permission in background if turning on
    if (newVal && !prefs.permissionGranted) {
      requestPermission().catch(() => {});
    }
  }, [prefs, updatePref, requestPermission]);

  const pick = (te, en) => language === 'te' ? te : en;

  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} color={colors.iconColor} strokeWidth={1.8} /></button>
        <h1 style={{ ...styles.title, fontFamily: font, margin: 0, color: colors.text }}>{t('settings.title')}</h1>
      </div>

      {/* ═══ Language ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}><GlobeIcon size={18} color="#E63B2E" /><span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.language')}</span></div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.langRow}>
            <button
              style={{ ...styles.langBtn, ...(language === 'te' ? styles.langBtnActive : {}) }}
              onClick={() => setLanguage('te')}
            >
              <span style={{ fontFamily: TELUGU, fontWeight: 700, fontSize: '14px', color: language === 'te' ? '#E63B2E' : colors.textMuted }}>
                తెలుగు
              </span>
              {language === 'te' && <span style={styles.langCheck}>✓</span>}
            </button>
            <button
              style={{ ...styles.langBtn, ...(language === 'en' ? styles.langBtnActive : {}) }}
              onClick={() => setLanguage('en')}
            >
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '14px', color: language === 'en' ? '#E63B2E' : colors.textMuted }}>
                English
              </span>
              {language === 'en' && <span style={styles.langCheck}>✓</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Theme (Light / Dark / Auto) ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}>
          <SunMoon size={18} color="#E63B2E" />
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{pick('థీమ్', 'Theme')}</span>
        </div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'auto', te: 'ఆటో', en: 'Auto', icon: SunMoon },
              { key: 'day', te: 'లైట్', en: 'Light', icon: Sun },
              { key: 'night', te: 'డార్క్', en: 'Dark', icon: Moon },
            ].map(opt => {
              const active = preference === opt.key;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  onClick={() => setThemePreference(opt.key)}
                  style={{
                    ...advStyles.pill,
                    ...(active ? advStyles.pillActive : {}),
                    flex: 1, justifyContent: 'center', padding: '8px 10px',
                    background: active ? (isNight ? 'rgba(230,59,46,0.15)' : 'rgba(230,59,46,0.1)') : colors.chipBg,
                    border: `1.5px solid ${active ? '#E63B2E' : colors.chipBorder}`,
                  }}
                >
                  <Icon size={14} color={active ? '#E63B2E' : colors.textMuted} strokeWidth={2} />
                  <span style={{ fontSize: 12, color: active ? '#E63B2E' : colors.textMuted, fontWeight: active ? 700 : 500 }}>
                    {pick(opt.te, opt.en)}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: colors.textFaint, marginTop: 8, lineHeight: 1.5, fontFamily: SERIF }}>
            {preference === 'auto'
              ? pick('సూర్యోదయం & సూర్యాస్తమయం ఆధారంగా స్వయంచాలకంగా మారుతుంది', 'Automatically switches based on sunrise & sunset times')
              : preference === 'night'
              ? pick('ఎల్లప్పుడూ డార్క్ మోడ్‌లో ఉంటుంది', 'Always stays in dark mode')
              : pick('ఎల్లప్పుడూ లైట్ మోడ్‌లో ఉంటుంది', 'Always stays in light mode')}
          </div>
        </div>
      </div>

      {/* ═══ Location ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}><PinIcon size={18} color="#E63B2E" /><span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.location')}</span></div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}><LocationPicker /></div>
      </div>

      {/* ═══ Sampradaya (Tradition) ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}>
          <NamasteIcon size={18} color="#E63B2E" />
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{pick('సంప్రదాయం', 'Tradition')}</span>
        </div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 13, color: '#888', fontFamily: SERIF, marginBottom: 10, lineHeight: 1.5 }}>
            {pick(
              'ఏకాదశి వ్రతం ఆచరించే విధానం మీ సంప్రదాయం ప్రకారం మారుతుంది.',
              'Ekadashi observance date differs based on your tradition.'
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { key: 'smartha', te: 'స్మార్త', en: 'Smartha' },
              { key: 'vaishnava', te: 'వైష్ణవ', en: 'Vaishnava' },
            ].map(opt => {
              const active = sampradaya === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => { setSampradaya(opt.key); localStorage.setItem('sampradaya', opt.key); }}
                  style={{
                    ...advStyles.pill,
                    ...(active ? advStyles.pillActive : {}),
                    flex: 1, justifyContent: 'center',
                  }}
                >
                  {active && <span style={advStyles.check}>✓</span>}
                  {pick(opt.te, opt.en)}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: '#AAA', fontFamily: SERIF, marginTop: 8, lineHeight: 1.5 }}>
            {sampradaya === 'smartha'
              ? pick(
                  'స్మార్త: సూర్యోదయం సమయంలో ఏకాదశి తిథి ఉంటే ఆచరించాలి.',
                  'Smartha: Observe Ekadashi if the tithi is present at sunrise.'
                )
              : pick(
                  'వైష్ణవ: అరుణోదయం (సూర్యోదయానికి 96 ని. ముందు) కు ముందే దశమి తిథి ముగియాలి.',
                  'Vaishnava: Dashami must end before Arunodaya (96 min before sunrise).'
                )}
          </div>
        </div>
      </div>

      {/* ═══ Reminders ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}>
          <BellIcon size={18} color="#E63B2E" />
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{pick('గుర్తుపెట్టుకోండి', 'Reminders')}</span>
        </div>

        {/* Daily Panchangam Share */}
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('dailyShare')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#E63B2E"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.726-5.993-1.957l-.418-.306-2.65.887.886-2.648-.335-.433A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#E63B2E" opacity="0.7"/></svg>
              </span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>
                  {pick('రోజూ పంచాంగం షేర్', 'Daily Panchangam Share')}
                </div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>
                  {prefs.dailyShare
                    ? `${pick('ఆన్', 'On')} — ${formatTime(prefs.dailyShareTime)} ${pick('కు గుర్తు', 'reminder')}`
                    : pick('నోటిఫికేషన్ వచ్చినప్పుడు ట్యాప్ చేసి షేర్ చేయండి', 'Tap notification to share panchangam')}
                </div>
              </div>
            </div>
            <Toggle on={prefs.dailyShare} onToggle={() => {
              const newVal = !prefs.dailyShare;
              updatePref('dailyShare', newVal);
              if (newVal && !prefs.permissionGranted) {
                requestPermission().catch(() => {});
              }
            }} />
          </div>
          {expandedSection === 'dailyShare' && prefs.dailyShare && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}>
                <span style={styles.subLabel}>{pick('షేర్ రిమైండర్ సమయం', 'Reminder time')}</span>
                <TimeSelector value={prefs.dailyShareTime} onChange={(v) => updatePref('dailyShareTime', v)} />
              </div>
              <div style={{ ...styles.subLabel, fontSize: '10px', color: '#BBB', paddingTop: '6px' }}>
                {pick(
                  'ఈ సమయానికి నోటిఫికేషన్ వస్తుంది. ట్యాప్ చేస్తే పంచాంగం ఇమేజ్ తో షేర్ డైలాగ్ ఓపెన్ అవుతుంది.',
                  'You\'ll get a notification at this time. Tap it to open share with today\'s panchangam image.'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Festival Reminders */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('festivals')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><DiyaIcon size={22} color="#E63B2E" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>
                  {pick('పండుగ రిమైండర్లు', 'Festival Reminders')}
                </div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>
                  {prefs.festivals
                    ? pick('ఆన్', 'On') + ' — ' + (prefs.festivalDays || [0, 1]).map(d =>
                        d === 0 ? pick('అదే రోజు', 'same day')
                        : d === 1 ? pick('1 ముందు', '1 day before')
                        : pick('2 ముందు', '2 days before')
                      ).join(', ')
                    : pick('ఆఫ్', 'Off')}
                </div>
              </div>
            </div>
            <Toggle on={prefs.festivals} onToggle={() => handleMasterToggle('festivals')} />
          </div>
          {expandedSection === 'festivals' && prefs.festivals && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}>
                <span style={styles.subLabel}>{pick('ఎప్పుడు గుర్తు చేయాలి', 'When to remind')}</span>
              </div>
              <AdvanceDaysSelector value={prefs.festivalDays} onChange={(v) => updatePref('festivalDays', v)} language={language} />
              <div style={styles.subRow}>
                <span style={styles.subLabel}>{pick('సమయం', 'Time')}</span>
                <TimeSelector value={prefs.festivalTime} onChange={(v) => updatePref('festivalTime', v)} />
              </div>
            </div>
          )}
        </div>

        {/* Vratham Reminders */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('vrathams')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><NamasteIcon size={22} color="#E63B2E" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>
                  {pick('వ్రతం రిమైండర్లు', 'Vratham Reminders')}
                </div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>
                  {prefs.vrathams
                    ? pick('ఆన్ — ఎంచుకున్నవి', 'On — selected vrathams')
                    : pick('ఆఫ్', 'Off')}
                </div>
              </div>
            </div>
            <Toggle on={prefs.vrathams} onToggle={() => handleMasterToggle('vrathams')} />
          </div>
          {expandedSection === 'vrathams' && prefs.vrathams && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('ఏకాదశి', 'Ekadashi')}</span>
                <Toggle on={prefs.vrathamEkadashi} onToggle={() => updatePref('vrathamEkadashi', !prefs.vrathamEkadashi)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('ప్రదోషం', 'Pradosham')}</span>
                <Toggle on={prefs.vrathamPradosham} onToggle={() => updatePref('vrathamPradosham', !prefs.vrathamPradosham)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('సంకష్టహర చతుర్థి', 'Sankashti Chaturthi')}</span>
                <Toggle on={prefs.vrathamSankashti} onToggle={() => updatePref('vrathamSankashti', !prefs.vrathamSankashti)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('మాస శివరాత్రి', 'Masik Shivaratri')}</span>
                <Toggle on={prefs.vrathamShivaratri} onToggle={() => updatePref('vrathamShivaratri', !prefs.vrathamShivaratri)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('పూర్ణిమ', 'Purnima')}</span>
                <Toggle on={prefs.vrathamPurnima} onToggle={() => updatePref('vrathamPurnima', !prefs.vrathamPurnima)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('అమావాస్య', 'Amavasya')}</span>
                <Toggle on={prefs.vrathamAmavasya} onToggle={() => updatePref('vrathamAmavasya', !prefs.vrathamAmavasya)} />
              </div>
              <div style={{ ...styles.subRow, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={styles.subLabel}>{pick('ఎప్పుడు గుర్తు చేయాలి', 'When to remind')}</span>
              </div>
              <AdvanceDaysSelector value={prefs.vrathamDays} onChange={(v) => updatePref('vrathamDays', v)} language={language} />
              <div style={styles.subRow}>
                <span style={styles.subLabel}>{pick('సమయం', 'Time')}</span>
                <TimeSelector value={prefs.vrathamTime} onChange={(v) => updatePref('vrathamTime', v)} />
              </div>
            </div>
          )}
        </div>

        {/* Puja Reminder */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('puja')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><TrishulIcon size={22} color="#E63B2E" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>
                  {pick('ఉదయ పూజ గుర్తు', 'Morning Puja Reminder')}
                </div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>
                  {prefs.puja
                    ? `${pick('ఆన్', 'On')} — ${formatTime(prefs.pujaTime)}`
                    : pick('ఆఫ్', 'Off')}
                </div>
              </div>
            </div>
            <Toggle on={prefs.puja} onToggle={() => handleMasterToggle('puja')} />
          </div>
          {expandedSection === 'puja' && prefs.puja && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}>
                <span style={styles.subLabel}>{pick('పూజ సమయం', 'Puja time')}</span>
                <TimeSelector value={prefs.pujaTime} onChange={(v) => updatePref('pujaTime', v)} />
              </div>
            </div>
          )}
        </div>

        {/* Sunrise/Sunset */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('sun')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><SunIcon size={22} color="#E63B2E" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>
                  {pick('సూర్యోదయ / అస్తమయం', 'Sunrise / Sunset')}
                </div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>
                  {(prefs.sunrise || prefs.sunset)
                    ? pick('ఆన్', 'On')
                    : pick('ఆఫ్', 'Off')}
                </div>
              </div>
            </div>
            <span style={styles.chevron}>{expandedSection === 'sun' ? '▾' : '▸'}</span>
          </div>
          {expandedSection === 'sun' && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('సూర్యోదయం', 'Sunrise')}</span>
                <Toggle on={prefs.sunrise} onToggle={() => {
                  updatePref('sunrise', !prefs.sunrise);
                  if (!prefs.sunrise && !prefs.permissionGranted) requestPermission().catch(() => {});
                }} />
              </div>
              {prefs.sunrise && (
                <div style={styles.subRow}>
                  <span style={styles.subLabel}>{pick('ఎప్పుడు', 'When')}</span>
                  <OffsetSelector value={prefs.sunriseOffset} onChange={(v) => updatePref('sunriseOffset', v)} />
                </div>
              )}
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{pick('సూర్యాస్తమయం', 'Sunset')}</span>
                <Toggle on={prefs.sunset} onToggle={() => {
                  updatePref('sunset', !prefs.sunset);
                  if (!prefs.sunset && !prefs.permissionGranted) requestPermission().catch(() => {});
                }} />
              </div>
              {prefs.sunset && (
                <div style={styles.subRow}>
                  <span style={styles.subLabel}>{pick('ఎప్పుడు', 'When')}</span>
                  <OffsetSelector value={prefs.sunsetOffset} onChange={(v) => updatePref('sunsetOffset', v)} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Smart Sandhya Alarms ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}>
          <span style={{ fontSize: '16px', color: '#E63B2E' }}>🙏</span>
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{pick('సాధన అలారాలు', 'Practice Alarms')}</span>
        </div>
        <div style={{ ...styles.subLabel, fontSize: '11px', color: '#BBB', padding: '0 4px 8px' }}>
          {pick(
            'సూర్యోదయం / సూర్యాస్తమయం ఆధారంగా ప్రతిరోజూ మారుతుంది',
            'Changes daily based on sunrise/sunset at your location'
          )}
        </div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          {[
            { key: 'alarmBrahmaMuhurta', te: 'బ్రహ్మ ముహూర్తం', en: 'Brahma Muhurta', desc: pick('సూర్యోదయానికి 96-48 ని. ముందు', '96-48 min before sunrise') },
            { key: 'alarmPratahSandhya', te: 'ప్రాతః సంధ్య', en: 'Pratah Sandhya', desc: pick('సూర్యోదయ సమయంలో', 'Around sunrise') },
            { key: 'alarmMadhyahnaSandhya', te: 'మధ్యాహ్న సంధ్య', en: 'Madhyahna Sandhya', desc: pick('మధ్యాహ్నం', 'Around solar noon') },
            { key: 'alarmSayamSandhya', te: 'సాయం సంధ్య', en: 'Sayam Sandhya', desc: pick('సూర్యాస్తమయ సమయంలో', 'Around sunset') },
          ].map((alarm, i) => (
            <div key={alarm.key} style={{ ...styles.alarmRow, borderTop: i > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
              <div style={styles.alarmInfo}>
                <div style={{ ...styles.reminderTitle, fontFamily: font, fontSize: '13px', color: colors.text }}>
                  {pick(alarm.te, alarm.en)}
                </div>
                <div style={{ ...styles.reminderSub, fontSize: '10px' }}>{alarm.desc}</div>
              </div>
              <Toggle on={prefs[alarm.key]} onToggle={() => {
                updatePref(alarm.key, !prefs[alarm.key]);
                if (!prefs[alarm.key] && !prefs.permissionGranted) requestPermission().catch(() => {});
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Panchangam Details ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}>
          <span style={{ fontSize: '16px', color: '#E63B2E' }}>☉</span>
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.panchangamFields')}</span>
        </div>

        {/* Shubha Muhurtham */}
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-shubha')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>{t('detailed.shubha')}</div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>{pick('అభిజిత్, అమృతకాలం, బ్రహ్మ ముహూ.', 'Abhijit, Amrit, Brahma')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.shubha} onToggle={() => updatePPref('shubha', !pPrefs.shubha)} />
          </div>
          {expandedSection === 'panch-shubha' && pPrefs.shubha && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.abhijit')}</span><Toggle on={pPrefs.shubha_abhijit} onToggle={() => updatePPref('shubha_abhijit', !pPrefs.shubha_abhijit)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.amritKalam')}</span><Toggle on={pPrefs.shubha_amritKalam} onToggle={() => updatePPref('shubha_amritKalam', !pPrefs.shubha_amritKalam)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.brahmaMuhurta')}</span><Toggle on={pPrefs.shubha_brahmaMuhurta} onToggle={() => updatePPref('shubha_brahmaMuhurta', !pPrefs.shubha_brahmaMuhurta)} /></div>
            </div>
          )}
        </div>

        {/* Ashubha Muhurtham */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-ashubha')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>{t('detailed.ashubha')}</div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>{pick('యమగండం, గుళిక కాలం', 'Yamaganda, Gulika')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.ashubha} onToggle={() => updatePPref('ashubha', !pPrefs.ashubha)} />
          </div>
          {expandedSection === 'panch-ashubha' && pPrefs.ashubha && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.yamaganda')}</span><Toggle on={pPrefs.ashubha_yamaganda} onToggle={() => updatePPref('ashubha_yamaganda', !pPrefs.ashubha_yamaganda)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.gulika')}</span><Toggle on={pPrefs.ashubha_gulika} onToggle={() => updatePPref('ashubha_gulika', !pPrefs.ashubha_gulika)} /></div>
            </div>
          )}
        </div>

        {/* Calendar Systems */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-cal')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>{t('detailed.calendar')}</div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>{pick('విక్రమ, శక, ఋతువు, అయనం', 'Vikram, Shaka, Ritu, Ayana')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.calendar} onToggle={() => updatePPref('calendar', !pPrefs.calendar)} />
          </div>
          {expandedSection === 'panch-cal' && pPrefs.calendar && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.vikramSamvat')}</span><Toggle on={pPrefs.cal_vikramSamvat} onToggle={() => updatePPref('cal_vikramSamvat', !pPrefs.cal_vikramSamvat)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.shakaSamvat')}</span><Toggle on={pPrefs.cal_shakaSamvat} onToggle={() => updatePPref('cal_shakaSamvat', !pPrefs.cal_shakaSamvat)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.samvatsara')}</span><Toggle on={pPrefs.cal_samvatsaraName} onToggle={() => updatePPref('cal_samvatsaraName', !pPrefs.cal_samvatsaraName)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.amantaPurnimanta')}</span><Toggle on={pPrefs.cal_amantaPurnimanta} onToggle={() => updatePPref('cal_amantaPurnimanta', !pPrefs.cal_amantaPurnimanta)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.ritu')}</span><Toggle on={pPrefs.cal_ritu} onToggle={() => updatePPref('cal_ritu', !pPrefs.cal_ritu)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.ayana')}</span><Toggle on={pPrefs.cal_ayana} onToggle={() => updatePPref('cal_ayana', !pPrefs.cal_ayana)} /></div>
            </div>
          )}
        </div>

        {/* Detailed Timings */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-timings')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>{t('detailed.timings')}</div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>{pick('తిథి, నక్షత్ర, యోగ, కరణ మార్పులు', 'Tithi, Nakshatra, Yoga transitions')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.timings} onToggle={() => updatePPref('timings', !pPrefs.timings)} />
          </div>
          {expandedSection === 'panch-timings' && pPrefs.timings && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.tithiTransitions')}</span><Toggle on={pPrefs.dt_tithiTransitions} onToggle={() => updatePPref('dt_tithiTransitions', !pPrefs.dt_tithiTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.nakshatraTransitions')}</span><Toggle on={pPrefs.dt_nakshatraTransitions} onToggle={() => updatePPref('dt_nakshatraTransitions', !pPrefs.dt_nakshatraTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.yogaTransitions')}</span><Toggle on={pPrefs.dt_yogaTransitions} onToggle={() => updatePPref('dt_yogaTransitions', !pPrefs.dt_yogaTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.karanaTransitions')}</span><Toggle on={pPrefs.dt_karanaTransitions} onToggle={() => updatePPref('dt_karanaTransitions', !pPrefs.dt_karanaTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.moonrise')}</span><Toggle on={pPrefs.dt_moonrise} onToggle={() => updatePPref('dt_moonrise', !pPrefs.dt_moonrise)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.moonset')}</span><Toggle on={pPrefs.dt_moonset} onToggle={() => updatePPref('dt_moonset', !pPrefs.dt_moonset)} /></div>
            </div>
          )}
        </div>

        {/* Rashi & Graha */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-rashi')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>{t('detailed.rashi')}</div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>{pick('సూర్య, చంద్ర రాశి, దిశా శూల', 'Sun, Moon Rashi, Disha Shoola')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.rashi} onToggle={() => updatePPref('rashi', !pPrefs.rashi)} />
          </div>
          {expandedSection === 'panch-rashi' && pPrefs.rashi && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.sunRashi')}</span><Toggle on={pPrefs.rg_sunRashi} onToggle={() => updatePPref('rg_sunRashi', !pPrefs.rg_sunRashi)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.moonRashi')}</span><Toggle on={pPrefs.rg_moonRashi} onToggle={() => updatePPref('rg_moonRashi', !pPrefs.rg_moonRashi)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.moonRashiTransition')}</span><Toggle on={pPrefs.rg_moonRashiTransition} onToggle={() => updatePPref('rg_moonRashiTransition', !pPrefs.rg_moonRashiTransition)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.dishaShoola')}</span><Toggle on={pPrefs.rg_dishaShoola} onToggle={() => updatePPref('rg_dishaShoola', !pPrefs.rg_dishaShoola)} /></div>
            </div>
          )}
        </div>

        {/* Special Yogas */}
        <div style={{ ...styles.card, marginTop: '8px', background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-yogas')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font, color: colors.text }}>{t('detailed.yogas')}</div>
                <div style={{ ...styles.reminderSub, color: colors.textFaint }}>{pick('ఆనందాది యోగం, గండమూల', 'Anandadi Yoga, Gandamool')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.yogas} onToggle={() => updatePPref('yogas', !pPrefs.yogas)} />
          </div>
          {expandedSection === 'panch-yogas' && pPrefs.yogas && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.anandadiYoga')}</span><Toggle on={pPrefs.sy_anandadiYoga} onToggle={() => updatePPref('sy_anandadiYoga', !pPrefs.sy_anandadiYoga)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.gandamool')}</span><Toggle on={pPrefs.sy_gandamool} onToggle={() => updatePPref('sy_gandamool', !pPrefs.sy_gandamool)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font, color: colors.iconColor }}>{t('field.specialYogas')}</span><Toggle on={pPrefs.sy_specialYogas} onToggle={() => updatePPref('sy_specialYogas', !pPrefs.sy_specialYogas)} /></div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ About ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}><InfoIcon size={18} color="#E63B2E" /><span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.about')}</span></div>
        <div style={{ ...styles.card, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={styles.aboutRow}>
            <span style={{ ...styles.aboutLabel, color: colors.textMuted }}>Version</span>
            <span style={{ ...styles.aboutValue, color: colors.text }}>1.0.0</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.aboutRow}>
            <span style={{ ...styles.aboutLabel, fontFamily: font, color: colors.textMuted }}>{t('settings.year')}</span>
            <span style={{ ...styles.aboutValue, fontFamily: font, color: colors.text }}>{t('settings.yearValue')}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.aboutRow}>
            <span style={{ ...styles.aboutLabel, color: colors.textMuted }}>Website</span>
            <span style={{ ...styles.aboutValue, color: colors.text }}>manacalendar.com</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.aboutRow} onClick={() => navigate('/privacy')} role="button">
            <span style={{ ...styles.aboutLabel, color: colors.textMuted }}>{pick('గోప్యతా విధానం', 'Privacy Policy')}</span>
            <span style={{ ...styles.aboutValue, color: '#E63B2E', cursor: 'pointer' }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '0 20px 20px', maxWidth: '432px', margin: '0 auto', overflowY: 'auto', height: '100%' },
  title: { fontSize: '24px', fontWeight: 800, color: '#1A1A1A', textAlign: 'center', margin: '0 0 16px' },
  section: { marginBottom: '20px' },
  sectionTitleRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  sectionTitle: { fontSize: '15px', fontWeight: 700, color: '#E63B2E' },
  card: {
    background: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '16px',
    padding: '0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },

  // Language
  langRow: { display: 'flex', gap: '8px', padding: '14px 16px' },
  langBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '12px 10px', background: '#FFF9F0', border: '1.5px solid rgba(0,0,0,0.08)',
    borderRadius: '12px', cursor: 'pointer', transition: 'all 200ms',
  },
  langBtnActive: { background: 'rgba(230,59,46,0.08)', border: '1.5px solid #E63B2E' },
  langCheck: { fontSize: '14px', color: '#E63B2E', fontWeight: 700 },

  // Reminder cards
  reminderHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', cursor: 'pointer',
  },
  reminderHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  reminderEmoji: { fontSize: '22px', flexShrink: 0 },
  reminderTitle: { fontSize: '13px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 },
  reminderSub: { fontFamily: SERIF, fontSize: '10px', color: '#BBB', marginTop: '1px' },
  chevron: { fontSize: '14px', color: '#BBB', flexShrink: 0 },

  expandedContent: {
    padding: '0 16px 14px',
    borderTop: '1px solid rgba(0,0,0,0.05)',  // overridden by border in cards
    marginTop: '-2px',
  },
  subRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 0 4px', gap: '8px',
  },
  subLabel: { fontFamily: SERIF, fontSize: '12px', color: '#666', flex: 1 },  // color overridden inline

  // Smart alarm rows
  alarmRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px',
  },
  alarmInfo: { flex: 1 },

  // About
  divider: { height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0 16px' },
  aboutRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' },
  aboutLabel: { fontFamily: SERIF, fontSize: '12px', color: '#999' },
  aboutValue: { fontSize: '12px', fontWeight: 600, color: '#1A1A1A' },
};
