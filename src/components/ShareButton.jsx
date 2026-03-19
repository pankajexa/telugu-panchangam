import React, { useCallback } from 'react';
import { track } from '@vercel/analytics';
import { SAMVATSARAM, CITY } from '../data/constants';

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

function formatNakDT(dt) {
  if (dt.sameDay) return dt.time;
  return `${dt.date}, ${dt.time}`;
}

function buildShareText(data) {
  const teluguMonth = TELUGU_MONTHS_MAP[data.englishMonth] || data.englishMonth;
  const dateStr = `${data.vaaram}, ${teluguMonth} ${data.dateNum}, ${data.year}`;

  let lines = [];

  lines.push(`*శుభోదయం*`);
  lines.push(``);
  lines.push(`*${dateStr}*`);
  lines.push(`${data.masam.telugu} | ${data.paksha} ${data.tithi.name}`);

  if (data.festival) {
    lines.push(`*${data.festival.telugu}*`);
  }

  lines.push(``);
  lines.push(`సూర్యోదయం *${to12Hr(data.sunrise)}*`);
  lines.push(`సూర్యాస్తమయం *${to12Hr(data.sunset)}*`);
  lines.push(`నక్షత్రం *${data.nakshatra.name}*`);
  lines.push(`యోగం ${data.yogam.name}`);
  lines.push(``);
  lines.push(`రాహు ${data.rahuKalam}`);
  lines.push(`వర్జ్యం ${data.varjyam}`);
  lines.push(`దుర్ము. ${data.durmuhurtham}`);
  lines.push(``);
  lines.push(`_${SAMVATSARAM}_`);
  lines.push(`_${CITY} పంచాంగం_`);
  lines.push(``);
  lines.push(`_shared from manacalendar.com_`);

  return lines.join('\n');
}

export default function ShareButton({ data }) {
  const handleShare = useCallback(() => {
    if (!data) return;
    track('share_tithi', { date: data.date, festival: data.festival?.english || 'none' });

    const text = buildShareText(data);

    // Use navigator.share SYNCHRONOUSLY from the click — never blocked by Safari
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
      return;
    }

    // Fallback: whatsapp:// scheme opens the app directly (not browser)
    window.location.href = `whatsapp://send?text=${encodeURIComponent(text)}`;
  }, [data]);

  if (!data) return null;

  return (
    <button style={styles.button} onClick={handleShare}>
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
          fill="#d6a820" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.726-5.993-1.957l-.418-.306-2.65.887.886-2.648-.335-.433A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
          fill="#d6a820" opacity="0.7" />
      </svg>
      <span style={styles.text}>పంచాంగం పంపండి</span>
    </button>
  );
}

const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(214,168,32,0.08)',
    border: '1.5px solid rgba(214,168,32,0.3)',
    borderRadius: '24px',
    padding: '8px 14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  text: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 700,
    fontSize: '13px',
    color: '#d6a820',
    letterSpacing: '0.3px',
  },
};
