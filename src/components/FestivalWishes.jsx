import React, { useState, useCallback } from 'react';
import { track } from '@vercel/analytics';
import { useLanguage } from '../context/LanguageContext';
import { getGreetingConfig } from '../data/festivalGreetings';
import { getFestivalTemplates } from '../data/cardTemplates';
import { renderFestivalCard } from '../imageCard/cardRenderer';
import { shareImage } from '../utils/sharingService';

// Track which template+quote combo to use — cycles on each press
let festivalPressCount = 0;

export default function FestivalWishes({ festival }) {
  const [generating, setGenerating] = useState(false);
  const { t, font, language } = useLanguage();

  const handleShare = useCallback(async () => {
    if (!festival || generating) return;
    track('share_wishes', { festival: festival.english });

    const greetingConfig = getGreetingConfig(festival.english);
    const templates = getFestivalTemplates(festival.english);

    if (templates.length === 0) return;

    // Cycle through templates and quotes on each press
    const templateIdx = festivalPressCount % templates.length;
    const quoteIdx = festivalPressCount;
    festivalPressCount++;

    const template = templates[templateIdx];
    const customName = localStorage.getItem('manacalendar-custom-name') || '';
    const lang = language === 'te' ? 'te' : 'en';
    const isTe = language === 'te';

    const shareText = isTe
      ? `${greetingConfig?.greetingText || festival.telugu + ' శుభాకాంక్షలు'} 🙏\n\n_shared from manacalendar.com_`
      : `Happy ${festival.english}! 🙏\n\n_shared from manacalendar.com_`;

    setGenerating(true);
    try {
      const blob = await renderFestivalCard(template, festival, greetingConfig, quoteIdx, customName, lang);
      await shareImage(blob, `${festival.english}-wishes.jpg`, shareText);
    } catch (_) {
      // Fallback to text
      if (navigator.share) {
        navigator.share({ text: shareText }).catch(() => {});
      } else {
        window.location.href = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
      }
    } finally {
      setGenerating(false);
    }
  }, [festival, language, generating]);

  if (!festival || !festival.major) return null;

  return (
    <button style={{ ...styles.btn, opacity: generating ? 0.6 : 1 }} onClick={handleShare} disabled={generating}>
      {generating ? (
        <span style={styles.spinner} />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.31-.726-5.993-1.957l-.418-.306-2.65.887.886-2.648-.335-.433A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="#25D366" opacity="0.7" />
        </svg>
      )}
      <span style={{ ...styles.text, fontFamily: font }}>
        {generating ? (t('wishes.send') + '...') : t('wishes.send')}
      </span>
    </button>
  );
}

const styles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#FFFFFF',
    border: '1.5px solid rgba(37,211,102,0.35)',
    borderRadius: '24px',
    padding: '8px 14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 4px rgba(45,24,16,0.06)',
    transition: 'opacity 200ms',
  },
  text: {
    fontFamily: "'Noto Sans Telugu', serif",
    fontWeight: 700,
    fontSize: '13px',
    color: '#25D366',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(37,211,102,0.2)',
    borderTopColor: '#25D366',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    flexShrink: 0,
  },
};
