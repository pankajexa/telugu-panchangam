import { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { getPanchangamForDate } from '../data/panchangam';
import { getSavedBirthData } from '../data/personalMuhurtha';
import { Clock, Star, ChevronRight } from 'lucide-react';
import BirthDataForm from '../components/muhurtha/BirthDataForm';
import PersonalMuhurthaView from '../components/muhurtha/PersonalMuhurthaView';

const QualityBadge = ({ quality, t }) => {
  const config = {
    excellent: { bg: '#F0FFF0', color: '#2D8A39', border: '#D4F5D4', label: t('muhurta.shubh') },
    good: { bg: '#FFF9E6', color: '#B8860B', border: '#FFF0B3', label: t('muhurta.good') },
    avoid: { bg: '#FFF1F0', color: '#CC3333', border: '#FFD6D6', label: t('muhurta.avoid') },
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

/**
 * Parse an AM/PM time string like "6:42 AM" or "3:12 PM" to minutes from midnight.
 * Also handles 24h format "06:42" as fallback.
 */
function parseTimeToMin(str) {
  if (!str || str === '--') return null;
  str = str.trim().replace('+', '');

  // Check for AM/PM
  const ampmMatch = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let h = parseInt(ampmMatch[1]);
    const m = parseInt(ampmMatch[2]);
    const period = ampmMatch[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }

  // Fallback: 24h format "HH:MM"
  const parts = str.split(':');
  if (parts.length >= 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return null;
}

/**
 * Parse a range string like "6:42 AM–3:12 PM" into { startMin, endMin }.
 * The separator is en-dash (–) U+2013, possibly with surrounding spaces.
 */
function parseRange(rangeStr) {
  if (!rangeStr || rangeStr === '--') return null;
  // Split on en-dash or regular dash, with optional spaces
  const parts = rangeStr.split(/\s*[\u2013\u2014-]\s*/);
  if (parts.length < 2) return null;
  const startMin = parseTimeToMin(parts[0]);
  const endMin = parseTimeToMin(parts[1]);
  if (startMin === null || endMin === null) return null;
  return { startMin, endMin: endMin <= startMin ? endMin + 1440 : endMin };
}

/**
 * Build 24h timeline segments from muhurta data.
 */
function buildTimeline(data) {
  const slots = [];

  // Collect all named time periods
  const periods = [
    { name: 'Brahma', range: data.brahmaMuhurta, bg: '#E8E8FF' },
    { name: 'Yama.', range: data.yamagandam, bg: '#FFE0E0' },
    { name: 'Abhijit', range: data.abhijitMuhurta, bg: '#E0FFE0' },
    { name: 'Gulika', range: data.gulikaKalam, bg: '#FFE0E0' },
    { name: 'Rahu', range: data.rahuKalam, bg: '#FFE0E0' },
  ];

  // Also add Amrit Kalam if present
  if (data.amritKalam && data.amritKalam !== '--') {
    periods.push({ name: 'Amrit', range: data.amritKalam, bg: '#E0FFE0' });
  }

  // Parse all ranges
  const parsed = [];
  for (const p of periods) {
    const r = parseRange(p.range);
    if (!r) continue;
    // Clamp to 0-1440 for display (wrap-around periods split at midnight)
    let { startMin, endMin } = r;
    if (endMin > 1440) endMin = 1440; // cap at midnight
    if (startMin < 0) startMin = 0;
    parsed.push({ name: p.name, bg: p.bg, startMin, endMin });
  }

  // Sort by start time
  parsed.sort((a, b) => a.startMin - b.startMin);

  // Build segments filling gaps with neutral
  const segments = [];
  let cursor = 0;
  for (const p of parsed) {
    if (p.startMin > cursor) {
      segments.push({ w: ((p.startMin - cursor) / 1440) * 100, bg: '#F0F0F0', label: '' });
    }
    const w = ((p.endMin - p.startMin) / 1440) * 100;
    if (w > 0) {
      segments.push({ w, bg: p.bg, label: p.name });
    }
    cursor = Math.max(cursor, p.endMin);
  }
  if (cursor < 1440) {
    segments.push({ w: ((1440 - cursor) / 1440) * 100, bg: '#F0F0F0', label: '' });
  }

  return segments;
}

function WidgetCard({ icon, title, subtitle, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '16px 14px', background: active ? 'rgba(230,59,46,0.06)' : '#FFF',
      border: active ? '1.5px solid rgba(230,59,46,0.2)' : '1px solid rgba(0,0,0,0.06)',
      borderRadius: 16, cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      display: 'flex', flexDirection: 'column', gap: 8,
      WebkitTapHighlightColor: 'transparent', transition: 'all 200ms',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: active ? 'rgba(230,59,46,0.1)' : '#F5F3EF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <ChevronRight size={14} color="#CCC" />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#E63B2E' : '#1A1A1A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</div>
      <div style={{ fontSize: 11, color: '#999', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4 }}>{subtitle}</div>
    </button>
  );
}

function GeneralMuhurthaSection({ data, t, font }) {
  const segments = useMemo(() => data ? buildTimeline(data) : [], [data]);

  if (!data) return null;

  const durmuhurthamArr = Array.isArray(data.durmuhurtham)
    ? data.durmuhurtham.filter(d => d && d !== '--')
    : (data.durmuhurtham && data.durmuhurtham !== '--' ? [data.durmuhurtham] : []);

  const auspicious = [
    { name: t('muhurta.abhijit'), time: data.abhijitMuhurta, quality: 'excellent' },
    { name: t('muhurta.amrit'), time: data.amritKalam, quality: 'excellent' },
    { name: t('muhurta.brahma'), time: data.brahmaMuhurta, quality: 'good' },
  ].filter(m => m.time && m.time !== '--');

  const inauspicious = [
    { name: t('muhurta.rahu'), time: data.rahuKalam, quality: 'avoid' },
    { name: t('muhurta.yamaganda'), time: data.yamagandam, quality: 'avoid' },
    { name: t('muhurta.gulika'), time: data.gulikaKalam, quality: 'avoid' },
    { name: t('muhurta.varjyam'), time: data.varjyam, quality: 'avoid' },
    ...durmuhurthamArr.map((time, i) => ({
      name: t('muhurta.durmuhurtham') + (durmuhurthamArr.length > 1 ? ` ${i + 1}` : ''),
      time, quality: 'avoid',
    })),
  ].filter(m => m.time && m.time !== '--');

  return (
    <>
      {/* Timeline bar */}
      <div style={styles.timelineCard}>
        <div style={styles.timelineLabel}>{t('muhurta.overview')}</div>
        <div style={styles.timelineBar}>
          {segments.map((seg, i) => (
            <div key={i} style={{
              width: `${seg.w}%`, background: seg.bg, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: seg.w > 5 ? 8 : 0, fontWeight: 600, color: '#666', height: 36,
              fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden',
              whiteSpace: 'nowrap', minWidth: seg.label ? 2 : 0,
            }}>{seg.w > 5 ? seg.label : ''}</div>
          ))}
        </div>
        <div style={styles.timeLabels}>
          {['12AM', '6AM', '12PM', '6PM', '12AM'].map((label, i) => (
            <span key={i} style={styles.timeLabel}>{label}</span>
          ))}
        </div>
        <div style={styles.legend}>
          <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#E0FFE0' }} /><span style={styles.legendText}>{t('muhurta.shubh')}</span></div>
          <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#FFE0E0' }} /><span style={styles.legendText}>{t('muhurta.avoid')}</span></div>
          <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: '#E8E8FF' }} /><span style={styles.legendText}>{t('muhurta.brahma')}</span></div>
        </div>
      </div>

      {auspicious.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.dot, background: '#2D8A39' }} />
            <span style={{ ...styles.sectionLabel, color: '#2D8A39' }}>{t('muhurta.auspicious')}</span>
          </div>
          <div style={styles.list}>
            {auspicious.map((m, i) => (
              <div key={i} style={styles.card}>
                <div>
                  <div style={{ ...styles.name, fontFamily: font }}>{m.name}</div>
                  <div style={styles.time}>{m.time}</div>
                </div>
                <QualityBadge quality={m.quality} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}

      {inauspicious.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.dot, background: '#E63B2E' }} />
            <span style={{ ...styles.sectionLabel, color: '#E63B2E' }}>{t('muhurta.inauspicious')}</span>
          </div>
          <div style={styles.list}>
            {inauspicious.map((m, i) => (
              <div key={i} style={styles.card}>
                <div>
                  <div style={{ ...styles.name, fontFamily: font }}>{m.name}</div>
                  <div style={styles.time}>{m.time}</div>
                </div>
                <QualityBadge quality={m.quality} t={t} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function MuhurtaPage() {
  const { t, pick, font } = useLanguage();
  const { location } = useLocation();

  const today = useMemo(() => new Date(), []);
  const data = useMemo(() => getPanchangamForDate(today, location), [today, location]);

  const [activeSection, setActiveSection] = useState('general');
  const [birthData, setBirthData] = useState(() => getSavedBirthData());

  const handleBirthDataSave = useCallback((data) => {
    setBirthData(data);
  }, []);

  const handleEditBirthData = useCallback(() => {
    setBirthData(null);
  }, []);

  const toggleSection = useCallback((section) => {
    setActiveSection(prev => prev === section ? null : section);
  }, []);

  if (!data) return null;

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <h1 style={styles.title}>{t('muhurta.title')}</h1>
        <div style={styles.subtitle}>{t('muhurta.subtitle')}</div>

        {/* Widget Cards */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <WidgetCard
            icon={<Clock size={20} color={activeSection === 'general' ? '#E63B2E' : '#999'} strokeWidth={1.8} />}
            title={pick('సాధారణ ముహూర్తం', 'General Muhurtha')}
            subtitle={pick('శుభ & అశుభ సమయాలు', 'Auspicious & inauspicious times')}
            active={activeSection === 'general'}
            onClick={() => toggleSection('general')}
          />
          <WidgetCard
            icon={<Star size={20} color={activeSection === 'personal' ? '#E63B2E' : '#999'} fill={activeSection === 'personal' ? 'rgba(230,59,46,0.15)' : 'none'} strokeWidth={1.8} />}
            title={pick('వ్యక్తిగత ముహూర్తం', 'Personal Muhurtha')}
            subtitle={pick('మీ జన్మ నక్షత్రం ఆధారంగా', 'Based on your birth star')}
            active={activeSection === 'personal'}
            onClick={() => toggleSection('personal')}
          />
        </div>

        {/* General Section */}
        {activeSection === 'general' && (
          <GeneralMuhurthaSection data={data} t={t} font={font} />
        )}

        {/* Personal Section */}
        {activeSection === 'personal' && (
          birthData
            ? <PersonalMuhurthaView birthData={birthData} onEdit={handleEditBirthData} />
            : <BirthDataForm onSave={handleBirthDataSave} />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { width: '100%', maxWidth: '480px', margin: '0 auto' },
  content: { padding: '8px 20px 100px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' },
  subtitle: { fontSize: 13, color: '#999', marginBottom: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  timelineCard: {
    background: 'white', borderRadius: 16, padding: '18px 20px', marginBottom: 24,
    border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  timelineLabel: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#CCC', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  timelineBar: { display: 'flex', height: 36, borderRadius: 10, overflow: 'hidden', gap: 2 },
  timeLabels: { display: 'flex', justifyContent: 'space-between', marginTop: 8 },
  timeLabel: { fontSize: 9, color: '#CCC', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  legend: { display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 9, color: '#999', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  section: { marginBottom: 24 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sectionLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: {
    background: 'white', borderRadius: 14, padding: '14px 18px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  name: { fontSize: 14, fontWeight: 600, color: '#1A1A1A' },
  time: { fontSize: 12, color: '#999', marginTop: 3, fontFamily: "'Plus Jakarta Sans', sans-serif" },
};
