import { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { NAKSHATRAS, NAKSHATRAS_EN } from '../../data/constants';
import { NAKSHATRA_TO_RASHI, saveBirthData } from '../../data/personalMuhurtha';
import { Star, ChevronDown } from 'lucide-react';

const SERIF = "'Plus Jakarta Sans', sans-serif";
const TELUGU = "'Noto Sans Telugu', sans-serif";

export default function BirthDataForm({ onSave }) {
  const { pick, font, language } = useLanguage();
  const [selectedNak, setSelectedNak] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = useCallback((index) => {
    setSelectedNak(index);
    setDropdownOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    if (selectedNak < 0) return;
    const data = {
      mode: 'nakshatra',
      janmaNakshatra: selectedNak,
      janmaRashi: NAKSHATRA_TO_RASHI[selectedNak],
    };
    saveBirthData(data);
    onSave?.(data);
  }, [selectedNak, onSave]);

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

      {/* Nakshatra Dropdown */}
      <div style={S.dropdownWrapper}>
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
      </div>

      {/* Save Button */}
      <button
        style={{
          ...S.saveBtn,
          fontFamily: font,
          opacity: selectedNak >= 0 ? 1 : 0.4,
          pointerEvents: selectedNak >= 0 ? 'auto' : 'none',
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
};
