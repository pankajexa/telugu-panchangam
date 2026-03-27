import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  GANAPATHI_PUJA_STEPS,
  PUJA_ITEMS_NEEDED,
  PUJA_META,
  TOTAL_DURATION,
} from '../data/pujaData';
import {
  VAHANA_PUJA_STEPS,
  VAHANA_PUJA_ITEMS,
  VAHANA_PUJA_META,
  VAHANA_TOTAL_DURATION,
} from '../data/vahanaPujaData';
import BreathingGuide from '../components/puja/BreathingGuide';
import { ArrowLeft, ChevronRight, Pause, Play, SkipForward } from 'lucide-react';
import { OmIcon, DiyaIcon, KalashIcon, LotusIcon } from '../components/icons/HinduIcons';

// ---------------------------------------------------------------------------
// Puja data lookup by type
// ---------------------------------------------------------------------------
const PUJA_CONFIGS = {
  ganapathi: {
    steps: GANAPATHI_PUJA_STEPS,
    items: PUJA_ITEMS_NEEDED,
    meta: PUJA_META,
    totalDuration: TOTAL_DURATION,
  },
  vahana: {
    steps: VAHANA_PUJA_STEPS,
    items: VAHANA_PUJA_ITEMS,
    meta: VAHANA_PUJA_META,
    totalDuration: VAHANA_TOTAL_DURATION,
  },
};

// ---------------------------------------------------------------------------
// GuidedPujaPage
// ---------------------------------------------------------------------------

export default function GuidedPujaPage({ pujaType = 'ganapathi' }) {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [pujaState, setPujaState] = useState('prep'); // 'prep' | 'active' | 'complete'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepElapsed, setStepElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [overallElapsed, setOverallElapsed] = useState(0);

  // Refs for timing
  const stepStartRef = useRef(null);
  const overallStartRef = useRef(null);
  const pausedAtRef = useRef(null);
  const intervalRef = useRef(null);

  // Audio refs
  const ambientRef = useRef(null);
  const bellRef = useRef(null);

  // Wake lock ref
  const wakeLockRef = useRef(null);

  const config = PUJA_CONFIGS[pujaType] || PUJA_CONFIGS.ganapathi;
  const steps = config.steps;
  const currentStep = steps[currentStepIndex];
  const lang = language === 'te' ? 'te' : 'en';

  // ---------------------------------------------------------------------------
  // Wake Lock
  // ---------------------------------------------------------------------------
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Silently fail
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    try {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {
      // Silently fail
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Audio helpers
  // ---------------------------------------------------------------------------
  const initAudio = useCallback(() => {
    const ambient = new Audio('/assets/sounds/sri_rama_chant.mp3');
    ambient.loop = true;
    ambient.volume = 0.15;
    ambientRef.current = ambient;

    const bell = new Audio('/assets/sounds/temple_bell.mp3');
    bellRef.current = bell;
  }, []);

  const playBell = useCallback(() => {
    try {
      if (bellRef.current) {
        bellRef.current.currentTime = 0;
        bellRef.current.play();
      }
    } catch {
      // Silently fail
    }
  }, []);

  const stopAllAudio = useCallback(() => {
    try {
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current.currentTime = 0;
      }
    } catch {
      // Silently fail
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      releaseWakeLock();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stopAllAudio, releaseWakeLock]);

  // ---------------------------------------------------------------------------
  // Timer logic
  // ---------------------------------------------------------------------------
  const advanceStep = useCallback(() => {
    playBell();
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= steps.length) {
      // Puja complete
      setPujaState('complete');
      stopAllAudio();
      releaseWakeLock();
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setCurrentStepIndex(nextIndex);
    setStepElapsed(0);
    stepStartRef.current = Date.now();
  }, [currentStepIndex, steps.length, playBell, stopAllAudio, releaseWakeLock]);

  useEffect(() => {
    if (pujaState !== 'active') return;

    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      const now = Date.now();
      const sElapsed = Math.floor((now - stepStartRef.current) / 1000);
      const oElapsed = Math.floor((now - overallStartRef.current) / 1000);
      setStepElapsed(sElapsed);
      setOverallElapsed(oElapsed);
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pujaState, isPaused]);

  // Check if step duration exceeded
  useEffect(() => {
    if (pujaState !== 'active') return;
    if (stepElapsed >= currentStep.duration) {
      advanceStep();
    }
  }, [stepElapsed, currentStep, pujaState, advanceStep]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleBeginPuja = useCallback(() => {
    initAudio();
    try { ambientRef.current?.play(); } catch {}
    const now = Date.now();
    stepStartRef.current = now;
    overallStartRef.current = now;
    setPujaState('active');
    setCurrentStepIndex(0);
    setStepElapsed(0);
    setOverallElapsed(0);
    setIsPaused(false);
    requestWakeLock();
  }, [initAudio, requestWakeLock]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      // Resume: adjust startRefs by the paused duration
      const pauseDuration = Date.now() - pausedAtRef.current;
      stepStartRef.current += pauseDuration;
      overallStartRef.current += pauseDuration;
      try { ambientRef.current?.play(); } catch {}
      setIsPaused(false);
    } else {
      // Pause
      pausedAtRef.current = Date.now();
      try { ambientRef.current?.pause(); } catch {}
      setIsPaused(true);
    }
  }, [isPaused]);

  const handleSkipStep = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

  const handleReturn = useCallback(() => {
    stopAllAudio();
    releaseWakeLock();
    navigate('/devotion');
  }, [navigate, stopAllAudio, releaseWakeLock]);

  // ---------------------------------------------------------------------------
  // Computed values
  // ---------------------------------------------------------------------------
  const overallProgress = useMemo(
    () => Math.min(overallElapsed / config.totalDuration, 1),
    [overallElapsed]
  );

  const stepProgress = useMemo(
    () => (currentStep ? Math.min(stepElapsed / currentStep.duration, 1) : 0),
    [stepElapsed, currentStep]
  );

  const stepName = currentStep
    ? t(currentStep.nameKey) !== currentStep.nameKey
      ? t(currentStep.nameKey)
      : currentStep.nameEnglish
    : '';

  // ---------------------------------------------------------------------------
  // Render: Preparation
  // ---------------------------------------------------------------------------
  if (pujaState === 'prep') {
    const items = config.items[lang] || config.items.en;
    return (
      <div style={styles.page}>
        {/* Back */}
        <button style={styles.backButton} onClick={() => navigate('/devotion')}>
          <ArrowLeft size={24} color="#fff" />
        </button>

        <div style={styles.prepContent}>
          {/* Om Icon */}
          <div style={styles.omContainer}>
            <OmIcon size={64} color="#C49B2A" />
          </div>

          {/* Title */}
          <h1 style={styles.prepTitle}>
            {config.meta.title[lang] || config.meta.title.en}
          </h1>
          <p style={styles.prepSubtitle}>
            {config.meta.subtitle[lang] || config.meta.subtitle.en}
          </p>

          {/* Items Needed */}
          <div style={styles.itemsCard}>
            <h3 style={styles.itemsTitle}>
              {lang === 'te' ? 'కావలసిన సామగ్రి' : 'Items Needed'}
            </h3>
            <ul style={styles.itemsList}>
              {items.map((item, i) => (
                <li key={i} style={styles.itemRow}>
                  <span style={styles.itemBullet}>{'  '}</span>
                  <span style={styles.itemText}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Begin Button */}
          <button style={styles.beginButton} onClick={handleBeginPuja}>
            {lang === 'te' ? 'పూజ ప్రారంభం' : 'Begin Puja'}
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Active
  // ---------------------------------------------------------------------------
  if (pujaState === 'active') {
    const mantra = currentStep.mantra;
    const instructions = currentStep.instructions[lang] || currentStep.instructions.en;

    return (
      <div style={styles.page}>
        {/* Overall progress bar */}
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${overallProgress * 100}%`,
            }}
          />
        </div>

        {/* Step header */}
        <div style={styles.stepHeader}>
          <p style={styles.stepCounter}>
            {lang === 'te'
              ? `${currentStepIndex + 1} / ${steps.length}`
              : `Step ${currentStepIndex + 1} of ${steps.length}`}
          </p>
          <h2 style={styles.stepName}>{stepName}</h2>
          <p style={styles.stepSanskrit}>{currentStep.nameSanskrit}</p>
        </div>

        {/* Step timer bar */}
        <div style={styles.stepTimerContainer}>
          <div
            style={{
              ...styles.stepTimerFill,
              width: `${stepProgress * 100}%`,
            }}
          />
        </div>
        <p style={styles.stepTimeLabel}>
          {Math.floor(stepElapsed / 60)}:{String(stepElapsed % 60).padStart(2, '0')}
          {' / '}
          {Math.floor(currentStep.duration / 60)}:{String(currentStep.duration % 60).padStart(2, '0')}
        </p>

        {/* Main content */}
        <div style={styles.mainContent}>
          {currentStep.hasBreathingGuide ? (
            <BreathingGuide />
          ) : (
            <div style={styles.mantraBlock}>
              {mantra.devanagari && (
                <p style={styles.mantraDevanagari}>{mantra.devanagari}</p>
              )}
              {mantra.telugu && (
                <p style={styles.mantraTelugu}>{mantra.telugu}</p>
              )}
              {mantra.english && (
                <p style={styles.mantraEnglish}>{mantra.english}</p>
              )}
            </div>
          )}

          {/* Instructions */}
          <div style={styles.instructionBox}>
            <p style={styles.instructionText}>{instructions}</p>
          </div>
        </div>

        {/* Bottom controls */}
        <div style={styles.controls}>
          <button style={styles.controlButton} onClick={handlePauseResume}>
            {isPaused ? <Play size={24} color="#fff" /> : <Pause size={24} color="#fff" />}
          </button>
          <button style={styles.nextButton} onClick={handleSkipStep}>
            <span style={styles.nextButtonText}>
              {lang === 'te' ? 'తదుపరి' : 'Next'}
            </span>
            <SkipForward size={18} color="#fff" />
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Complete
  // ---------------------------------------------------------------------------
  return (
    <div style={styles.page}>
      <div style={styles.completeContent}>
        <LotusIcon size={80} color="#C49B2A" />

        <h1 style={styles.completeTitle}>
          {lang === 'te' ? 'పూజ సంపూర్ణం' : 'Puja Complete'}
        </h1>

        <p style={styles.completeShanti}>
          ॐ शान्तिः शान्तिः शान्तिः
        </p>

        <p style={styles.completeBlessing}>
          {lang === 'te'
            ? 'శ్రీ మహాగణపతి మీకు ఆశీర్వదించు గాక'
            : 'May Lord Ganapathi bless you'}
        </p>

        <button style={styles.returnButton} onClick={handleReturn}>
          {lang === 'te' ? 'భక్తి పేజీకి తిరిగి వెళ్ళు' : 'Return to Devotion'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  // Layout
  page: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: 'linear-gradient(160deg, #1A0F08, #2D1810, #1A0F08)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflow: 'hidden',
  },

  // Back button
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ---- PREP STATE ----
  prepContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '72px 24px 32px',
    gap: 16,
    overflowY: 'auto',
  },
  omContainer: {
    marginBottom: 8,
  },
  prepTitle: {
    fontFamily: "'Playfair Display', serif",
    color: '#C49B2A',
    fontSize: 24,
    fontWeight: 700,
    textAlign: 'center',
    margin: 0,
  },
  prepSubtitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    margin: 0,
  },
  itemsCard: {
    width: '100%',
    maxWidth: 360,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '16px 20px',
    marginTop: 8,
  },
  itemsTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: 600,
    margin: '0 0 12px',
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  itemBullet: {
    color: '#C49B2A',
    fontSize: 8,
  },
  itemText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  beginButton: {
    marginTop: 'auto',
    width: '100%',
    maxWidth: 360,
    height: 50,
    background: '#E63B2E',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    cursor: 'pointer',
    letterSpacing: 0.3,
  },

  // ---- ACTIVE STATE ----
  progressBarContainer: {
    width: '100%',
    height: 3,
    background: 'rgba(255,255,255,0.1)',
    position: 'relative',
    flexShrink: 0,
  },
  progressBarFill: {
    height: '100%',
    background: '#C49B2A',
    borderRadius: 2,
    transition: 'width 0.3s linear',
  },
  stepHeader: {
    textAlign: 'center',
    padding: '20px 24px 0',
    flexShrink: 0,
  },
  stepCounter: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: 500,
    margin: '0 0 4px',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepName: {
    fontFamily: "'Playfair Display', serif",
    color: '#C49B2A',
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 4px',
  },
  stepSanskrit: {
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    margin: 0,
  },
  stepTimerContainer: {
    margin: '16px 24px 0',
    height: 4,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    flexShrink: 0,
  },
  stepTimerFill: {
    height: '100%',
    background: 'rgba(196,155,42,0.6)',
    borderRadius: 2,
    transition: 'width 0.3s linear',
  },
  stepTimeLabel: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    margin: '6px 0 0',
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },

  // Main content
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 24px',
    overflowY: 'auto',
    gap: 16,
  },
  mantraBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  mantraDevanagari: {
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    fontSize: 18,
    color: '#fff',
    lineHeight: 1.8,
    margin: 0,
    whiteSpace: 'pre-line',
  },
  mantraTelugu: {
    fontFamily: "'Noto Sans Telugu', sans-serif",
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.8,
    margin: 0,
    whiteSpace: 'pre-line',
  },
  mantraEnglish: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: 'pre-line',
  },
  instructionBox: {
    background: 'rgba(196,155,42,0.08)',
    borderRadius: 10,
    padding: '12px 16px',
    borderLeft: '3px solid rgba(196,155,42,0.3)',
  },
  instructionText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    lineHeight: 1.6,
    margin: 0,
  },

  // Controls
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px 28px',
    gap: 16,
    flexShrink: 0,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  nextButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    background: 'rgba(196,155,42,0.15)',
    border: '1.5px solid rgba(196,155,42,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  // ---- COMPLETE STATE ----
  completeContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    gap: 20,
  },
  completeTitle: {
    fontFamily: "'Playfair Display', serif",
    color: '#C49B2A',
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
    margin: 0,
  },
  completeShanti: {
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    margin: 0,
  },
  completeBlessing: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    textAlign: 'center',
    margin: 0,
  },
  returnButton: {
    marginTop: 16,
    height: 50,
    padding: '0 32px',
    borderRadius: 14,
    background: 'transparent',
    border: '1.5px solid #C49B2A',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    cursor: 'pointer',
    letterSpacing: 0.3,
  },
};
