import React, { useState, useCallback } from 'react';
import { track } from '@vercel/analytics';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { generatePanchangamCard } from '../imageCard/generatePanchangamCard';
import { shareImageWithFallback } from '../imageCard/cardUtils';

const TELUGU_MONTHS_MAP = {
  'January': 'జనవరి', 'February': 'ఫిబ్రవరి', 'March': 'మార్చి',
  'April': 'ఏప్రిల్', 'May': 'మే', 'June': 'జూన్',
  'July': 'జూలై', 'August': 'ఆగస్టు', 'September': 'సెప్టెంబర్',
  'October': 'అక్టోబర్', 'November': 'నవంబర్', 'December': 'డిసెంబర్',
};

function to12Hr(time24) {
  const [hh, mm] = time24.split(':').map(Number);
  const period = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return `${h}:${mm.toString().padStart(2, '0')} ${period}`;
}

function buildShareText(data, cityLabel, language) {
  const isTe = language === 'te';
  const dateStr = isTe
    ? `${data.vaaram}, ${TELUGU_MONTHS_MAP[data.englishMonth] || data.englishMonth} ${data.dateNum}, ${data.year}`
    : `${data.englishDay}, ${data.englishMonth} ${data.dateNum}, ${data.year}`;

  const lines = [];
  lines.push(isTe ? `*శుభోదయం*` : `*Good Morning*`);
  lines.push('');
  lines.push(`*${dateStr}*`);
  lines.push(isTe
    ? `${data.masam.telugu} | ${data.paksha} ${data.tithi.name}`
    : `${data.masam.english} | ${data.pakshaEn} ${data.tithi.nameEn}`);
  if (data.festival) lines.push(`*${isTe ? data.festival.telugu : data.festival.english}*`);
  lines.push('');
  lines.push(`${isTe ? 'సూర్యోదయం' : 'Sunrise'} *${to12Hr(data.sunrise)}*`);
  lines.push(`${isTe ? 'సూర్యాస్తమయం' : 'Sunset'} *${to12Hr(data.sunset)}*`);
  lines.push(`${isTe ? 'నక్షత్రం' : 'Nakshatra'} *${isTe ? data.nakshatra.name : data.nakshatra.nameEn}*`);
  lines.push(`${isTe ? 'యోగం' : 'Yogam'} ${isTe ? data.yogam.name : data.yogam.nameEn}`);
  lines.push('');
  lines.push(`${isTe ? 'రాహు' : 'Rahu'} ${data.rahuKalam}`);
  lines.push(`${isTe ? 'వర్జ్యం' : 'Varjyam'} ${data.varjyam}`);
  const durText = Array.isArray(data.durmuhurtham) ? data.durmuhurtham.join(', ') : data.durmuhurtham;
  lines.push(`${isTe ? 'దుర్ము.' : 'Durmu.'} ${durText}`);
  lines.push('');
  lines.push(isTe ? `_శ్రీ పరాభవ నామ సంవత్సరం_` : `_Sri Parabhava Nama Samvatsaram_`);
  lines.push(`_${cityLabel} ${isTe ? 'పంచాంగం' : 'Panchangam'}_`);
  lines.push('');
  lines.push(`_shared from manacalendar.com_`);
  return lines.join('\n');
}

export default function ShareButton({ data }) {
  const { location } = useLocation();
  const { t, font, language } = useLanguage();
  const [generating, setGenerating] = useState(false);

  const handleShare = useCallback(async () => {
    if (!data || generating) return;
    track('share_tithi', { date: data.date, festival: data.festival?.english || 'none' });

    const cityLabel = language === 'te' ? location.label : location.labelEn;
    const fallbackText = buildShareText(data, cityLabel, language);

    setGenerating(true);
    try {
      const blob = await generatePanchangamCard(data, cityLabel);
      await shareImageWithFallback(blob, `panchangam-${data.date}.png`, fallbackText);
    } catch (_) {
      // If image generation fails, share text
      if (navigator.share) {
        navigator.share({ text: fallbackText }).catch(() => {});
      } else {
        window.location.href = `whatsapp://send?text=${encodeURIComponent(fallbackText)}`;
      }
    } finally {
      setGenerating(false);
    }
  }, [data, language, location, generating]);

  if (!data) return null;

  return (
    <button style={{ ...styles.button, opacity: generating ? 0.6 : 1 }} onClick={handleShare} disabled={generating}>
      {generating ? (
        <span style={styles.spinner} />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            fill="#C49B2A" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.726-5.993-1.957l-.418-.306-2.65.887.886-2.648-.335-.433A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
            fill="#C49B2A" opacity="0.7" />
        </svg>
      )}
      <span style={{ ...styles.text, fontFamily: font }}>
        {generating ? (t('share.panchangam') + '...') : t('share.panchangam')}
      </span>
    </button>
  );
}

const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#FFFFFF',
    border: '1.5px solid rgba(196,155,42,0.25)',
    borderRadius: '24px',
    padding: '8px 14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 4px rgba(45,24,16,0.06)',
    transition: 'opacity 200ms',
  },
  text: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 700,
    fontSize: '13px',
    color: '#C49B2A',
    letterSpacing: '0.3px',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(196,155,42,0.2)',
    borderTopColor: '#C49B2A',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    flexShrink: 0,
  },
};
