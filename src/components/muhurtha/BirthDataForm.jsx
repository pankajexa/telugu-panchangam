import { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useAppLocation } from '../../context/LocationContext';
import { NAKSHATRAS, NAKSHATRAS_EN } from '../../data/constants';
import { NAKSHATRA_TO_RASHI, saveBirthData, computeBirthChart } from '../../data/personalMuhurtha';
import { Star, ChevronDown, Calendar, Clock } from 'lucide-react';

const SERIF = "'Plus Jakarta Sans', sans-serif";
const TELUGU = "'Noto Sans Telugu', sans-serif";

export default function BirthDataForm({ onSave }) {
  const { pick, font, language } = useLanguage();
  const { location } = useAppLocation();
  const [mode, setMode] = useState('nakshatra'); // 'nakshatra' or 'birthchart'
  const [selectedNak, setSelectedNak] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Birth chart mode fields
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [computing, setComputing] = useState(false);
  const [computed, setComputed] = useState(null); // { nakshatra, pada, rashi }

  const handleSelect = useCallback((index) => {
    setSelectedNak(index);
    setDropdownOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    if (mode === 'nakshatra') {
      if (selectedNak < 0) return;
      const data = {
        mode: 'nakshatra',
        janmaNakshatra: selectedNak,
        janmaRashi: NAKSHATRA_TO_RASHI[selectedNak],
      };
      saveBirthData(data);
      onSave?.(data);
    } else {
      if (!computed) return;
      const data = {
        mode: 'birthchart',
        janmaNakshatra: computed.nakshatra,
        janmaRashi: computed.rashi,
        janmaPada: computed.pada,
        birthDate,
        birthTime,
        birthPlace: { lat: location.lat, lng: location.lng, tz: location.tz, label: location.labelEn || location.label },
      };
      saveBirthData(data);
      onSave?.(data);
    }
  }, [mode, selectedNak, computed, birthDate, birthTime, location, onSave]);

  const handleComputeBirthChart = useCallback(() => {
    if (!birthDate || !birthTime) return;
    setComputing(true);
    // Use requestAnimationFrame to let UI update first
    requestAnimationFrame(() => {
      try {
        const result = computeBirthChart(birthDate, birthTime, location);
        setComputed(result);
        setSelectedNak(result.nakshatra);
      } catch (e) {
        console.error('Birth chart computation failed:', e);
      } finally {
        setComputing(false);
      }
    });
  }, [birthDate, birthTime, location]);

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.iconCircle}>
          <Star size={24} color="#E63B2E" fill="rgba(230,59,46,0.15)" strokeWidth={1.8} />
        </div>
        <div style={{ ...S.title, fontFamily: font }}>
          {pick('మీ జన్మ నక్షత్రం ఎంచుకోండి', 'Select Your Birth Star')}
        </div>
      </div>

      {/* Explanation */}
      <div style={{ ...S.explanation, fontFamily: font }}>
        {pick(
          'మీ జన్మ నక్షత్రం ఆధారంగా రోజువారీ తార బల, చంద్ర బల లెక్కించి, మీకు ప్రత్యేకమైన శుభ సమయాలు చూపిస్తాము.',
          'We calculate daily Tara Bala and Chandra Bala based on your birth star to show auspicious times personalized for you.'
        )}
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
        {[
          { key: 'nakshatra', te: 'నక్షత్రం తెలుసు', en: 'I know my star' },
          { key: 'birthchart', te: 'పుట్టిన తేదీ ఇస్తా', en: 'Enter birth details' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => { setMode(opt.key); setComputed(null); }}
            style={{
              flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
              background: mode === opt.key ? '#E63B2E' : '#FFF',
              color: mode === opt.key ? '#FFF' : '#666',
              fontSize: 12, fontWeight: 600, fontFamily: font,
              transition: 'all 200ms',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {pick(opt.te, opt.en)}
          </button>
        ))}
      </div>

      {/* Birth Chart Mode */}
      {mode === 'birthchart' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ ...S.inputLabel, fontFamily: SERIF }}>{pick('పుట్టిన తేదీ', 'Birth Date')}</label>
              <input
                type="date"
                value={birthDate}
                onChange={e => { setBirthDate(e.target.value); setComputed(null); }}
                style={{ ...S.input, fontFamily: SERIF }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ ...S.inputLabel, fontFamily: SERIF }}>{pick('పుట్టిన సమయం', 'Birth Time')}</label>
              <input
                type="time"
                value={birthTime}
                onChange={e => { setBirthTime(e.target.value); setComputed(null); }}
                style={{ ...S.input, fontFamily: SERIF }}
              />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#AAA', fontFamily: SERIF, marginBottom: 12 }}>
            📍 {pick('ప్రస్తుత స్థానం', 'Location')}: {location.labelEn || location.label}
            <span style={{ color: '#CCC' }}> ({pick('సెట్టింగ్స్ లో మార్చగలరు', 'change in Settings')})</span>
          </div>
          <button
            onClick={handleComputeBirthChart}
            disabled={!birthDate || !birthTime || computing}
            style={{
              ...S.computeBtn, fontFamily: font,
              opacity: (!birthDate || !birthTime || computing) ? 0.4 : 1,
            }}
          >
            {computing ? pick('లెక్కిస్తోంది...', 'Computing...') : pick('నక్షత్రం కనుగొనండి', 'Find My Nakshatra')}
          </button>

          {computed && (
            <div style={S.computedResult}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#2D8A39', fontFamily: font, marginBottom: 4 }}>
                ⭐ {NAKSHATRAS[computed.nakshatra]} ({NAKSHATRAS_EN[computed.nakshatra]}) — {pick('పాదం', 'Pada')} {computed.pada}
              </div>
              <div style={{ fontSize: 12, color: '#888', fontFamily: SERIF }}>
                {pick('చంద్ర రాశి', 'Moon Sign')}: {['మేషం','వృషభం','మిథునం','కర్కాటకం','సింహం','కన్య','తుల','వృశ్చికం','ధనస్సు','మకరం','కుంభం','మీనం'][computed.rashi] || ''}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nakshatra Dropdown (only in nakshatra mode) */}
      {mode === 'nakshatra' && <div style={S.dropdownWrapper}>
        <button
          style={{ ...S.dropdown, fontFamily: font }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span style={{ color: selectedNak >= 0 ? '#1A1A1A' : '#AAA' }}>
            {selectedNak >= 0
              ? `${NAKSHATRAS[selectedNak]} (${NAKSHATRAS_EN[selectedNak]})`
              : pick('నక్షత్రం ఎంచుకోండి...', 'Choose your Nakshatra...')}
          </span>
          <ChevronDown size={18} color="#999" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
        </button>

        {dropdownOpen && (
          <div style={S.dropdownList}>
            {NAKSHATRAS_EN.map((nameEn, i) => (
              <button
                key={i}
                style={{
                  ...S.dropdownItem,
                  fontFamily: font,
                  background: i === selectedNak ? 'rgba(230,59,46,0.08)' : 'transparent',
                  color: i === selectedNak ? '#E63B2E' : '#333',
                }}
                onClick={() => handleSelect(i)}
              >
                <span style={{ fontWeight: i === selectedNak ? 700 : 400 }}>
                  {language === 'te' ? `${NAKSHATRAS[i]}` : nameEn}
                </span>
                <span style={{ fontSize: 12, color: '#999', fontFamily: SERIF }}>
                  {language === 'te' ? nameEn : NAKSHATRAS[i]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>}

      {/* Save Button */}
      <button
        style={{
          ...S.saveBtn,
          fontFamily: font,
          opacity: (mode === 'nakshatra' ? selectedNak >= 0 : !!computed) ? 1 : 0.4,
          pointerEvents: (mode === 'nakshatra' ? selectedNak >= 0 : !!computed) ? 'auto' : 'none',
        }}
        onClick={handleSave}
      >
        {pick('తార బల చూడండి', 'See My Tara Bala')}
      </button>

      {/* Privacy note */}
      <div style={{ ...S.privacyNote, fontFamily: SERIF }}>
        {pick(
          '🔒 మీ డేటా మీ ఫోన్‌లోనే భద్రపరచబడుతుంది. ఎక్కడికీ పంపబడదు.',
          '🔒 Your data stays on your device. Nothing is sent anywhere.'
        )}
      </div>
    </div>
  );
}

const S = {
  container: {
    padding: '24px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  iconCircle: {
    width: 48, height: 48, borderRadius: 14,
    background: 'rgba(230,59,46,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontSize: 18, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3,
  },
  explanation: {
    fontSize: 13, color: '#777', lineHeight: 1.7, marginBottom: 24,
  },
  dropdownWrapper: {
    position: 'relative', marginBottom: 20,
  },
  dropdown: {
    width: '100%', padding: '14px 16px',
    background: '#FFF', border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 14, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontSize: 15, fontWeight: 500,
    WebkitTapHighlightColor: 'transparent',
  },
  dropdownList: {
    position: 'absolute', top: '100%', left: 0, right: 0,
    maxHeight: 300, overflowY: 'scroll',
    background: '#FFF', border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 14, marginTop: 4,
    zIndex: 50, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    WebkitOverflowScrolling: 'touch',
  },
  dropdownItem: {
    width: '100%', padding: '12px 16px',
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontSize: 14, textAlign: 'left',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
    WebkitTapHighlightColor: 'transparent',
  },
  saveBtn: {
    width: '100%', padding: '14px',
    background: '#E63B2E', color: '#FFF',
    border: 'none', borderRadius: 14, cursor: 'pointer',
    fontSize: 15, fontWeight: 700,
    transition: 'opacity 200ms',
    WebkitTapHighlightColor: 'transparent',
  },
  privacyNote: {
    fontSize: 11, color: '#BBB', textAlign: 'center',
    marginTop: 16, lineHeight: 1.5,
  },
  inputLabel: {
    fontSize: 11, fontWeight: 600, color: '#999', display: 'block',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  input: {
    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
    background: '#FFF', border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: 12, fontSize: 14, color: '#333',
  },
  computeBtn: {
    width: '100%', padding: '12px',
    background: '#2D8A39', color: '#FFF',
    border: 'none', borderRadius: 12, cursor: 'pointer',
    fontSize: 14, fontWeight: 600,
    WebkitTapHighlightColor: 'transparent',
  },
  computedResult: {
    marginTop: 16, padding: '14px 16px',
    background: '#F0FFF0', border: '1px solid #D4F5D4',
    borderRadius: 12,
  },
};
