import { useState, useCallback } from 'react';
import LocationPicker from '../components/LocationPicker';
import { useLanguage } from '../context/LanguageContext';
import { useReminders } from '../context/ReminderContext';
import { usePanchangamPrefs } from '../context/PanchangamPrefsContext';
import { GlobeIcon, PinIcon, BellIcon, DiyaIcon, NamasteIcon, TrishulIcon, SunIcon, InfoIcon } from '../components/HinduIcons';

const TELUGU = "'Noto Serif Telugu', serif";
const SERIF = "'Inter', system-ui, sans-serif";

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
    background: '#E0DAD2', border: 'none', padding: '2px',
    cursor: 'pointer', flexShrink: 0, transition: 'background 200ms',
    display: 'flex', alignItems: 'center',
  },
  trackOn: { background: '#C49B2A' },
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
    color: '#2D1810', background: '#FDF8EF',
    border: '1px solid rgba(45,24,16,0.1)', borderRadius: '8px',
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
    color: '#8A7568', background: '#FDF8EF',
    border: '1.5px solid rgba(45,24,16,0.08)', borderRadius: '20px',
    padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
    display: 'flex', alignItems: 'center', gap: '4px',
    transition: 'all 150ms',
  },
  pillActive: {
    color: '#C49B2A', background: 'rgba(196,155,42,0.1)',
    border: '1.5px solid #C49B2A',
  },
  check: {
    fontSize: '10px', fontWeight: 800,
  },
};

export default function SettingsPage() {
  const { t, font, language, setLanguage } = useLanguage();
  const { prefs, updatePref, requestPermission } = useReminders();
  const { prefs: pPrefs, updatePref: updatePPref } = usePanchangamPrefs();
  const [expandedSection, setExpandedSection] = useState(null);

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

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.title, fontFamily: font }}>{t('settings.title')}</h1>

      {/* ═══ Language ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}><GlobeIcon size={18} color="#C49B2A" /><span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.language')}</span></div>
        <div style={styles.card}>
          <div style={styles.langRow}>
            <button
              style={{ ...styles.langBtn, ...(language === 'te' ? styles.langBtnActive : {}) }}
              onClick={() => setLanguage('te')}
            >
              <span style={{ fontFamily: TELUGU, fontWeight: 700, fontSize: '14px', color: language === 'te' ? '#C49B2A' : '#8A7568' }}>
                తెలుగు
              </span>
              {language === 'te' && <span style={styles.langCheck}>✓</span>}
            </button>
            <button
              style={{ ...styles.langBtn, ...(language === 'en' ? styles.langBtnActive : {}) }}
              onClick={() => setLanguage('en')}
            >
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '14px', color: language === 'en' ? '#C49B2A' : '#8A7568' }}>
                English
              </span>
              {language === 'en' && <span style={styles.langCheck}>✓</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Location ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}><PinIcon size={18} color="#C49B2A" /><span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.location')}</span></div>
        <div style={styles.card}><LocationPicker /></div>
      </div>

      {/* ═══ Reminders ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}>
          <BellIcon size={18} color="#C49B2A" />
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{pick('గుర్తుపెట్టుకోండి', 'Reminders')}</span>
        </div>

        {/* Daily Panchangam Share */}
        <div style={styles.card}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('dailyShare')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#C49B2A"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.726-5.993-1.957l-.418-.306-2.65.887.886-2.648-.335-.433A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#C49B2A" opacity="0.7"/></svg>
              </span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>
                  {pick('రోజూ పంచాంగం షేర్', 'Daily Panchangam Share')}
                </div>
                <div style={styles.reminderSub}>
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
              <div style={{ ...styles.subLabel, fontSize: '10px', color: '#B5A899', paddingTop: '6px' }}>
                {pick(
                  'ఈ సమయానికి నోటిఫికేషన్ వస్తుంది. ట్యాప్ చేస్తే పంచాంగం ఇమేజ్ తో షేర్ డైలాగ్ ఓపెన్ అవుతుంది.',
                  'You\'ll get a notification at this time. Tap it to open share with today\'s panchangam image.'
                )}
              </div>
            </div>
          )}
        </div>

        {/* Festival Reminders */}
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('festivals')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><DiyaIcon size={22} color="#C49B2A" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>
                  {pick('పండుగ రిమైండర్లు', 'Festival Reminders')}
                </div>
                <div style={styles.reminderSub}>
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
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('vrathams')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><NamasteIcon size={22} color="#C49B2A" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>
                  {pick('వ్రతం రిమైండర్లు', 'Vratham Reminders')}
                </div>
                <div style={styles.reminderSub}>
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
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('ఏకాదశి', 'Ekadashi')}</span>
                <Toggle on={prefs.vrathamEkadashi} onToggle={() => updatePref('vrathamEkadashi', !prefs.vrathamEkadashi)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('ప్రదోషం', 'Pradosham')}</span>
                <Toggle on={prefs.vrathamPradosham} onToggle={() => updatePref('vrathamPradosham', !prefs.vrathamPradosham)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('సంకష్టహర చతుర్థి', 'Sankashti Chaturthi')}</span>
                <Toggle on={prefs.vrathamSankashti} onToggle={() => updatePref('vrathamSankashti', !prefs.vrathamSankashti)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('మాస శివరాత్రి', 'Masik Shivaratri')}</span>
                <Toggle on={prefs.vrathamShivaratri} onToggle={() => updatePref('vrathamShivaratri', !prefs.vrathamShivaratri)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('పూర్ణిమ', 'Purnima')}</span>
                <Toggle on={prefs.vrathamPurnima} onToggle={() => updatePref('vrathamPurnima', !prefs.vrathamPurnima)} />
              </div>
              <div style={styles.subRow}>
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('అమావాస్య', 'Amavasya')}</span>
                <Toggle on={prefs.vrathamAmavasya} onToggle={() => updatePref('vrathamAmavasya', !prefs.vrathamAmavasya)} />
              </div>
              <div style={{ ...styles.subRow, borderTop: '1px solid rgba(45,24,16,0.06)', paddingTop: '8px', marginTop: '4px' }}>
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
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('puja')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><TrishulIcon size={22} color="#C49B2A" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>
                  {pick('ఉదయ పూజ గుర్తు', 'Morning Puja Reminder')}
                </div>
                <div style={styles.reminderSub}>
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
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('sun')}>
            <div style={styles.reminderHeaderLeft}>
              <span style={styles.reminderEmoji}><SunIcon size={22} color="#C49B2A" /></span>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>
                  {pick('సూర్యోదయ / అస్తమయం', 'Sunrise / Sunset')}
                </div>
                <div style={styles.reminderSub}>
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
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('సూర్యోదయం', 'Sunrise')}</span>
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
                <span style={{ ...styles.subLabel, fontFamily: font }}>{pick('సూర్యాస్తమయం', 'Sunset')}</span>
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

      {/* ═══ Panchangam Details ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}>
          <span style={{ fontSize: '16px', color: '#C49B2A' }}>☉</span>
          <span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.panchangamFields')}</span>
        </div>

        {/* Shubha Muhurtham */}
        <div style={styles.card}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-shubha')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>{t('detailed.shubha')}</div>
                <div style={styles.reminderSub}>{pick('అభిజిత్, అమృతకాలం, బ్రహ్మ ముహూ.', 'Abhijit, Amrit, Brahma')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.shubha} onToggle={() => updatePPref('shubha', !pPrefs.shubha)} />
          </div>
          {expandedSection === 'panch-shubha' && pPrefs.shubha && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.abhijit')}</span><Toggle on={pPrefs.shubha_abhijit} onToggle={() => updatePPref('shubha_abhijit', !pPrefs.shubha_abhijit)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.amritKalam')}</span><Toggle on={pPrefs.shubha_amritKalam} onToggle={() => updatePPref('shubha_amritKalam', !pPrefs.shubha_amritKalam)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.brahmaMuhurta')}</span><Toggle on={pPrefs.shubha_brahmaMuhurta} onToggle={() => updatePPref('shubha_brahmaMuhurta', !pPrefs.shubha_brahmaMuhurta)} /></div>
            </div>
          )}
        </div>

        {/* Ashubha Muhurtham */}
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-ashubha')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>{t('detailed.ashubha')}</div>
                <div style={styles.reminderSub}>{pick('యమగండం, గుళిక కాలం', 'Yamaganda, Gulika')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.ashubha} onToggle={() => updatePPref('ashubha', !pPrefs.ashubha)} />
          </div>
          {expandedSection === 'panch-ashubha' && pPrefs.ashubha && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.yamaganda')}</span><Toggle on={pPrefs.ashubha_yamaganda} onToggle={() => updatePPref('ashubha_yamaganda', !pPrefs.ashubha_yamaganda)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.gulika')}</span><Toggle on={pPrefs.ashubha_gulika} onToggle={() => updatePPref('ashubha_gulika', !pPrefs.ashubha_gulika)} /></div>
            </div>
          )}
        </div>

        {/* Calendar Systems */}
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-cal')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>{t('detailed.calendar')}</div>
                <div style={styles.reminderSub}>{pick('విక్రమ, శక, ఋతువు, అయనం', 'Vikram, Shaka, Ritu, Ayana')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.calendar} onToggle={() => updatePPref('calendar', !pPrefs.calendar)} />
          </div>
          {expandedSection === 'panch-cal' && pPrefs.calendar && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.vikramSamvat')}</span><Toggle on={pPrefs.cal_vikramSamvat} onToggle={() => updatePPref('cal_vikramSamvat', !pPrefs.cal_vikramSamvat)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.shakaSamvat')}</span><Toggle on={pPrefs.cal_shakaSamvat} onToggle={() => updatePPref('cal_shakaSamvat', !pPrefs.cal_shakaSamvat)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.samvatsara')}</span><Toggle on={pPrefs.cal_samvatsaraName} onToggle={() => updatePPref('cal_samvatsaraName', !pPrefs.cal_samvatsaraName)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.amantaPurnimanta')}</span><Toggle on={pPrefs.cal_amantaPurnimanta} onToggle={() => updatePPref('cal_amantaPurnimanta', !pPrefs.cal_amantaPurnimanta)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.ritu')}</span><Toggle on={pPrefs.cal_ritu} onToggle={() => updatePPref('cal_ritu', !pPrefs.cal_ritu)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.ayana')}</span><Toggle on={pPrefs.cal_ayana} onToggle={() => updatePPref('cal_ayana', !pPrefs.cal_ayana)} /></div>
            </div>
          )}
        </div>

        {/* Detailed Timings */}
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-timings')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>{t('detailed.timings')}</div>
                <div style={styles.reminderSub}>{pick('తిథి, నక్షత్ర, యోగ, కరణ మార్పులు', 'Tithi, Nakshatra, Yoga transitions')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.timings} onToggle={() => updatePPref('timings', !pPrefs.timings)} />
          </div>
          {expandedSection === 'panch-timings' && pPrefs.timings && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.tithiTransitions')}</span><Toggle on={pPrefs.dt_tithiTransitions} onToggle={() => updatePPref('dt_tithiTransitions', !pPrefs.dt_tithiTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.nakshatraTransitions')}</span><Toggle on={pPrefs.dt_nakshatraTransitions} onToggle={() => updatePPref('dt_nakshatraTransitions', !pPrefs.dt_nakshatraTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.yogaTransitions')}</span><Toggle on={pPrefs.dt_yogaTransitions} onToggle={() => updatePPref('dt_yogaTransitions', !pPrefs.dt_yogaTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.karanaTransitions')}</span><Toggle on={pPrefs.dt_karanaTransitions} onToggle={() => updatePPref('dt_karanaTransitions', !pPrefs.dt_karanaTransitions)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.moonrise')}</span><Toggle on={pPrefs.dt_moonrise} onToggle={() => updatePPref('dt_moonrise', !pPrefs.dt_moonrise)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.moonset')}</span><Toggle on={pPrefs.dt_moonset} onToggle={() => updatePPref('dt_moonset', !pPrefs.dt_moonset)} /></div>
            </div>
          )}
        </div>

        {/* Rashi & Graha */}
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-rashi')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>{t('detailed.rashi')}</div>
                <div style={styles.reminderSub}>{pick('సూర్య, చంద్ర రాశి, దిశా శూల', 'Sun, Moon Rashi, Disha Shoola')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.rashi} onToggle={() => updatePPref('rashi', !pPrefs.rashi)} />
          </div>
          {expandedSection === 'panch-rashi' && pPrefs.rashi && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.sunRashi')}</span><Toggle on={pPrefs.rg_sunRashi} onToggle={() => updatePPref('rg_sunRashi', !pPrefs.rg_sunRashi)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.moonRashi')}</span><Toggle on={pPrefs.rg_moonRashi} onToggle={() => updatePPref('rg_moonRashi', !pPrefs.rg_moonRashi)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.moonRashiTransition')}</span><Toggle on={pPrefs.rg_moonRashiTransition} onToggle={() => updatePPref('rg_moonRashiTransition', !pPrefs.rg_moonRashiTransition)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.dishaShoola')}</span><Toggle on={pPrefs.rg_dishaShoola} onToggle={() => updatePPref('rg_dishaShoola', !pPrefs.rg_dishaShoola)} /></div>
            </div>
          )}
        </div>

        {/* Special Yogas */}
        <div style={{ ...styles.card, marginTop: '8px' }}>
          <div style={styles.reminderHeader} onClick={() => toggleSection('panch-yogas')}>
            <div style={styles.reminderHeaderLeft}>
              <div>
                <div style={{ ...styles.reminderTitle, fontFamily: font }}>{t('detailed.yogas')}</div>
                <div style={styles.reminderSub}>{pick('ఆనందాది యోగం, గండమూల', 'Anandadi Yoga, Gandamool')}</div>
              </div>
            </div>
            <Toggle on={pPrefs.yogas} onToggle={() => updatePPref('yogas', !pPrefs.yogas)} />
          </div>
          {expandedSection === 'panch-yogas' && pPrefs.yogas && (
            <div style={styles.expandedContent}>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.anandadiYoga')}</span><Toggle on={pPrefs.sy_anandadiYoga} onToggle={() => updatePPref('sy_anandadiYoga', !pPrefs.sy_anandadiYoga)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.gandamool')}</span><Toggle on={pPrefs.sy_gandamool} onToggle={() => updatePPref('sy_gandamool', !pPrefs.sy_gandamool)} /></div>
              <div style={styles.subRow}><span style={{ ...styles.subLabel, fontFamily: font }}>{t('field.specialYogas')}</span><Toggle on={pPrefs.sy_specialYogas} onToggle={() => updatePPref('sy_specialYogas', !pPrefs.sy_specialYogas)} /></div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ About ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitleRow}><InfoIcon size={18} color="#C49B2A" /><span style={{ ...styles.sectionTitle, fontFamily: font }}>{t('settings.about')}</span></div>
        <div style={styles.card}>
          <div style={styles.aboutRow}>
            <span style={styles.aboutLabel}>Version</span>
            <span style={styles.aboutValue}>1.0.0</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.aboutRow}>
            <span style={{ ...styles.aboutLabel, fontFamily: font }}>{t('settings.year')}</span>
            <span style={{ ...styles.aboutValue, fontFamily: font }}>{t('settings.yearValue')}</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.aboutRow}>
            <span style={styles.aboutLabel}>Website</span>
            <span style={styles.aboutValue}>manacalendar.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '0 20px 20px', maxWidth: '432px', margin: '0 auto', overflowY: 'auto', height: '100%' },
  title: { fontSize: '24px', fontWeight: 800, color: '#2D1810', textAlign: 'center', margin: '0 0 16px' },
  section: { marginBottom: '20px' },
  sectionTitleRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  sectionTitle: { fontSize: '15px', fontWeight: 700, color: '#C49B2A' },
  card: {
    background: '#FFFFFF',
    border: '1px solid rgba(45,24,16,0.06)',
    borderRadius: '16px',
    padding: '0',
    boxShadow: '0 2px 12px rgba(45,24,16,0.06), 0 1px 3px rgba(45,24,16,0.04)',
    overflow: 'hidden',
  },

  // Language
  langRow: { display: 'flex', gap: '8px', padding: '14px 16px' },
  langBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '12px 10px', background: '#FDF8EF', border: '1.5px solid rgba(45,24,16,0.08)',
    borderRadius: '12px', cursor: 'pointer', transition: 'all 200ms',
  },
  langBtnActive: { background: 'rgba(196,155,42,0.08)', border: '1.5px solid #C49B2A' },
  langCheck: { fontSize: '14px', color: '#C49B2A', fontWeight: 700 },

  // Reminder cards
  reminderHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', cursor: 'pointer',
  },
  reminderHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  reminderEmoji: { fontSize: '22px', flexShrink: 0 },
  reminderTitle: { fontSize: '13px', fontWeight: 700, color: '#2D1810', lineHeight: 1.3 },
  reminderSub: { fontFamily: SERIF, fontSize: '10px', color: '#B5A899', marginTop: '1px' },
  chevron: { fontSize: '14px', color: '#B5A899', flexShrink: 0 },

  expandedContent: {
    padding: '0 16px 14px',
    borderTop: '1px solid rgba(45,24,16,0.05)',
    marginTop: '-2px',
  },
  subRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 0 4px', gap: '8px',
  },
  subLabel: { fontFamily: SERIF, fontSize: '12px', color: '#5C3D2E', flex: 1 },

  // About
  divider: { height: '1px', background: 'rgba(45,24,16,0.06)', margin: '0 16px' },
  aboutRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' },
  aboutLabel: { fontFamily: SERIF, fontSize: '12px', color: '#8A7568' },
  aboutValue: { fontSize: '12px', fontWeight: 600, color: '#2D1810' },
};
