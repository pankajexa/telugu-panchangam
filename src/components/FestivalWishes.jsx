import React, { useState, useCallback } from 'react';
import { SAMVATSARAM } from '../data/constants';

const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';
const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || '';
const MODEL = 'sarvam-m';

async function generateWish(festival) {
  const festivalName = festival.telugu;

  const response = await fetch(SARVAM_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SARVAM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{
        role: 'user',
        content: `"${festivalName}" పండుగ శుభాకాంక్షల సందేశం ఒక paragraph లో రాయండి. పూర్తిగా తెలుగులో రాయాలి. ఇంగ్లీష్ వద్దు. emoji వద్దు. ఒక్క paragraph మాత్రమే output ఇవ్వండి. వేరే ఏమీ రాయకండి.`,
      }],
      model: MODEL,
      temperature: 0.9,
      max_tokens: 500,
    }),
  });

  if (!response.ok) throw new Error(`API ${response.status}`);

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content?.trim() || '';

  // Strip <think>...</think> reasoning block
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (text.includes('<think>')) {
    text = text.replace(/<think>[\s\S]*/gi, '').trim();
  }

  // Keep only Telugu text
  const teluguParts = text.split('\n').filter(line => /[\u0C00-\u0C7F]/.test(line));
  let wish = teluguParts.join(' ').trim();

  // Remove any trailing garbage (non-Telugu at end)
  wish = wish.replace(/[a-zA-Z][\w\-]*$/g, '').trim();

  if (!wish) throw new Error('Empty');

  return `🙏 *${festivalName} శుభాకాంక్షలు* 🙏\n\n${wish}\n\n_${SAMVATSARAM}_`;
}

export default function FestivalWishes({ festival }) {
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  const handleTap = useCallback(async () => {
    if (!festival || state === 'loading') return;

    setState('loading');
    try {
      const text = await generateWish(festival);
      setMessage(text);
      setState('ready');
    } catch (e) {
      console.error('Wish gen failed:', e);
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  }, [festival, state]);

  const handleShare = useCallback(() => {
    if (!message) return;
    // This runs directly from a user click — no popup blocker issue
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  }, [message]);

  const handleRegen = useCallback(() => {
    setState('idle');
    setMessage('');
  }, []);

  if (!festival || !festival.major) return null;

  // Step 1: Generate
  if (state === 'idle' || state === 'loading' || state === 'error') {
    return (
      <button
        style={{ ...styles.btn, ...(state === 'loading' ? styles.btnLoading : {}) }}
        onClick={handleTap}
        disabled={state === 'loading'}
      >
        {state === 'loading' ? (
          <>
            <span style={styles.dots}>···</span>
            <span style={styles.text}>సిద్ధమవుతోంది</span>
          </>
        ) : state === 'error' ? (
          <span style={styles.text}>మళ్ళీ ప్రయత్నించండి</span>
        ) : (
          <>
            <span style={styles.icon}>✦</span>
            <span style={styles.text}>శుభాకాంక్షలు పంపండి</span>
          </>
        )}
      </button>
    );
  }

  // Step 2: Message ready — show share + regenerate buttons
  return (
    <div style={styles.readyRow}>
      <button style={styles.shareBtn} onClick={handleShare}>
        <span style={styles.shareIcon}>↗</span>
        <span style={styles.text}>WhatsApp పంపండి</span>
      </button>
      <button style={styles.regenBtn} onClick={handleRegen}>
        <span style={styles.regenText}>↻</span>
      </button>
    </div>
  );
}

const WA = '#25D366';
const TELUGU = "'Noto Serif Telugu', serif";

const styles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(37,211,102,0.1)',
    border: '1.5px solid rgba(37,211,102,0.4)',
    borderRadius: '28px',
    padding: '10px 22px',
    cursor: 'pointer',
  },
  btnLoading: {
    opacity: 0.7,
    cursor: 'wait',
  },
  icon: { fontSize: '16px', color: WA },
  text: { fontFamily: TELUGU, fontWeight: 700, fontSize: '14px', color: WA },
  dots: { fontSize: '18px', color: WA, letterSpacing: '2px', animation: 'pulse 1s ease-in-out infinite' },

  readyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(37,211,102,0.12)',
    border: '1.5px solid rgba(37,211,102,0.45)',
    borderRadius: '28px',
    padding: '10px 22px',
    cursor: 'pointer',
  },
  shareIcon: { fontSize: '16px', color: WA },
  regenBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: '1.5px solid rgba(214,168,32,0.25)',
    borderRadius: '50%',
    width: '38px',
    height: '38px',
    cursor: 'pointer',
  },
  regenText: { fontSize: '18px', color: '#d6a820', opacity: 0.7 },
};
