import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const INHALE_DURATION = 4000;
const HOLD_DURATION = 2000;
const EXHALE_DURATION = 4000;
const HOLD2_DURATION = 2000;
const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION + HOLD2_DURATION;

const GAYATRI_DEVANAGARI =
  'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्';

const PHASES = [
  { key: 'breatheIn', start: 0, end: INHALE_DURATION },
  { key: 'hold1', start: INHALE_DURATION, end: INHALE_DURATION + HOLD_DURATION },
  { key: 'breatheOut', start: INHALE_DURATION + HOLD_DURATION, end: INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION },
  { key: 'hold2', start: INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION, end: CYCLE_DURATION },
];

function getPhase(elapsed) {
  const t = elapsed % CYCLE_DURATION;
  for (const phase of PHASES) {
    if (t >= phase.start && t < phase.end) return phase.key;
  }
  return 'breatheIn';
}

function getScale(elapsed) {
  const t = elapsed % CYCLE_DURATION;
  // inhale: 1 -> 2, hold1: 2, exhale: 2 -> 1, hold2: 1
  if (t < INHALE_DURATION) {
    return 1 + (t / INHALE_DURATION);
  } else if (t < INHALE_DURATION + HOLD_DURATION) {
    return 2;
  } else if (t < INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION) {
    const exhaleT = t - INHALE_DURATION - HOLD_DURATION;
    return 2 - (exhaleT / EXHALE_DURATION);
  }
  return 1;
}

const LABEL_MAP = {
  breatheIn: 'puja.guided.breatheIn',
  hold1: 'puja.guided.hold',
  breatheOut: 'puja.guided.breatheOut',
  hold2: 'puja.guided.hold',
};

export default function BreathingGuide() {
  const { t } = useLanguage();
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);

  useEffect(() => {
    startRef.current = Date.now();
    const tick = () => {
      setElapsed(Date.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const phase = getPhase(elapsed);
  const scale = getScale(elapsed);
  const size = 80 * scale; // 80px to 160px
  const label = t(LABEL_MAP[phase]);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes breathingGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(196,155,42,0.3); }
          50% { box-shadow: 0 0 40px rgba(196,155,42,0.6); }
        }
      `}</style>

      <div
        style={{
          ...styles.circle,
          width: size,
          height: size,
        }}
      >
        <span style={styles.label}>{label}</span>
      </div>

      <p style={styles.gayatri}>{GAYATRI_DEVANAGARI}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
    gap: 24,
  },
  circle: {
    borderRadius: '50%',
    backgroundColor: 'rgba(196, 155, 42, 0.15)',
    border: '2px solid #C49B2A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.1s linear, height 0.1s linear',
    animation: 'breathingGlow 4s ease-in-out infinite',
  },
  label: {
    color: '#C49B2A',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    userSelect: 'none',
  },
  gayatri: {
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    margin: 0,
    padding: '0 24px',
    lineHeight: 1.6,
  },
};
