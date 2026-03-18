import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Page from './Page';
import PageStack from './PageStack';
import NavigationHint from './NavigationHint';
import MonthStrip from './MonthStrip';
import MonthView from './MonthView';
import TeluguMonthView from './TeluguMonthView';
import ShareButton from './ShareButton';
import FestivalWishes from './FestivalWishes';
import { computeClipPath, drawFlip } from '../physics/drawFlip';
import { getAllPanchangam, getTodayIndex, generateAllDates } from '../data/panchangam';
import { TELUGU_MONTHS, getTeluguMonth } from '../data/teluguMonths';

const allData = getAllPanchangam();

// Easing functions
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeOutBack(t) {
  return 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
}

export default function CalendarPad({ onDateChange }) {
  // === React state ===
  const [currentIndex, setCurrentIndex] = useState(() => getTodayIndex());
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showMonthStrip, setShowMonthStrip] = useState(false);
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'month' | 'telugu-month'

  // For conditional DOM rendering (under-page, canvas)
  const [flipping, setFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);

  // === Refs (imperative, no re-renders during animation) ===
  const containerRef = useRef(null);
  const currentPageRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pageHeightRef = useRef(460);
  const pageWidthRef = useRef(360);
  const canvasReady = useRef(false);

  // Current flip progress (0 = flat, 1 = fully flipped)
  const progressRef = useRef(0);
  // Phase: 'idle' | 'dragging' | 'animating'
  const phaseRef = useRef('idle');
  // Direction for current flip
  const dirRef = useRef(null);
  // Stash currentIndex in ref to avoid stale closures
  const indexRef = useRef(currentIndex);
  useEffect(() => { indexRef.current = currentIndex; }, [currentIndex]);

  // Touch state
  const touchRef = useRef({
    active: false,
    startY: 0,
    startTime: 0,
    lastY: 0,
    hasMoved: false,
  });

  // Long press
  const longPressRef = useRef(null);

  // =================================================================
  //  CANVAS MANAGEMENT
  // =================================================================
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const page = currentPageRef.current;
    if (!canvas || !page) return;

    const w = page.offsetWidth;
    const h = page.offsetHeight;
    if (w === 0 || h === 0) return;

    pageWidthRef.current = w;
    pageHeightRef.current = h;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = (h + 80) * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h + 80}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvasReady.current = true;
  }, []);

  // Setup canvas once it's mounted (after flipping becomes true)
  useEffect(() => {
    if (flipping) {
      // Wait one frame for React to mount the canvas element
      requestAnimationFrame(() => {
        setupCanvas();
      });
    } else {
      canvasReady.current = false;
    }
  }, [flipping, setupCanvas]);

  // =================================================================
  //  RENDER LOOP — runs via rAF during drag and animation
  // =================================================================
  const renderFrame = useCallback(() => {
    const p = progressRef.current;
    const dir = dirRef.current;

    // Update clip-path on current page
    if (currentPageRef.current) {
      currentPageRef.current.style.clipPath = computeClipPath(p, pageHeightRef.current, dir);
    }

    // Draw canvas curl + shadow
    if (canvasRef.current && canvasReady.current) {
      const ctx = canvasRef.current.getContext('2d');
      drawFlip(ctx, p, pageWidthRef.current, pageHeightRef.current, dir);
    }
  }, []);

  // =================================================================
  //  ANIMATION DRIVER
  // =================================================================
  const animateTo = useCallback((targetProgress, duration, easeFn, onComplete) => {
    phaseRef.current = 'animating';
    const startProgress = progressRef.current;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeFn(t);

      progressRef.current = startProgress + (targetProgress - startProgress) * eased;
      renderFrame();

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        progressRef.current = targetProgress;
        renderFrame();
        onComplete();
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [renderFrame]);

  // =================================================================
  //  FLIP LIFECYCLE
  // =================================================================
  const beginFlip = useCallback((direction) => {
    dirRef.current = direction;
    progressRef.current = 0;
    phaseRef.current = 'dragging';

    setFlipping(true);
    setFlipDirection(direction);
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  const finishFlip = useCallback(() => {
    cancelAnimationFrame(rafRef.current);

    // Advance page — use dirRef (stable) not flipDirection (React state, possibly stale)
    const dir = dirRef.current;
    if (dir === 'forward') {
      setCurrentIndex(prev => Math.min(prev + 1, allData.length - 1));
    } else if (dir === 'backward') {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }

    // DON'T clear clip-path here — the old page would flash for one frame.
    // The useEffect below clears it after React has rendered the new page.
    progressRef.current = 0;
    phaseRef.current = 'idle';
    dirRef.current = null;
    setFlipping(false);
    setFlipDirection(null);
  }, []);

  const cancelFlipAnim = useCallback(() => {
    cancelAnimationFrame(rafRef.current);

    const currentP = progressRef.current;
    if (currentP < 0.01) {
      // Already at 0, just clean up
      phaseRef.current = 'idle';
      dirRef.current = null;
      if (currentPageRef.current) currentPageRef.current.style.clipPath = 'none';
      setFlipping(false);
      setFlipDirection(null);
      return;
    }

    animateTo(0, 250 + currentP * 150, easeOutBack, () => {
      phaseRef.current = 'idle';
      dirRef.current = null;
      if (currentPageRef.current) currentPageRef.current.style.clipPath = 'none';
      if (canvasRef.current && canvasReady.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setFlipping(false);
      setFlipDirection(null);
    });
  }, [animateTo]);

  const commitFlip = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const currentP = progressRef.current;
    const remaining = 1 - currentP;
    const duration = Math.max(200, remaining * 450);

    animateTo(1, duration, easeOutCubic, () => {
      finishFlip();
    });
  }, [animateTo, finishFlip]);

  // Quick flip (keyboard, wheel, click) — start and immediately commit
  const quickFlip = useCallback((direction) => {
    if (phaseRef.current !== 'idle') return;
    if (direction === 'forward' && indexRef.current >= allData.length - 1) return;
    if (direction === 'backward' && indexRef.current <= 0) return;

    beginFlip(direction);

    // We need the canvas to be mounted first. Use rAF to wait for React + setup.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupCanvas();
        progressRef.current = 0.02; // small initial progress
        animateTo(1, 480, easeOutCubic, () => {
          finishFlip();
        });
      });
    });
  }, [beginFlip, setupCanvas, animateTo, finishFlip]);

  // =================================================================
  //  TOUCH / MOUSE HANDLERS
  // =================================================================
  const onPointerDown = useCallback((e) => {
    if (phaseRef.current !== 'idle') return;
    // Ignore multi-touch (pinch zoom)
    if (e.touches && e.touches.length > 1) return;

    const y = e.touches ? e.touches[0].clientY : e.clientY;
    touchRef.current = {
      active: true,
      startY: y,
      startTime: performance.now(),
      lastY: y,
      hasMoved: false,
    };

    clearTimeout(longPressRef.current);
    longPressRef.current = setTimeout(() => {
      if (touchRef.current.active && !touchRef.current.hasMoved) {
        setShowMonthStrip(s => !s);
      }
    }, 500);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!touchRef.current.active) return;
    if (phaseRef.current === 'animating') return;
    // If second finger added mid-gesture, cancel the swipe
    if (e.touches && e.touches.length > 1) {
      if (phaseRef.current === 'dragging') cancelFlipAnim();
      touchRef.current.active = false;
      return;
    }

    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = touchRef.current.startY - y; // positive = swipe up

    if (Math.abs(delta) < 10 && phaseRef.current === 'idle') return;

    clearTimeout(longPressRef.current);
    touchRef.current.hasMoved = true;
    touchRef.current.lastY = y;

    const direction = delta > 0 ? 'forward' : 'backward';

    // Bounds check
    if (direction === 'forward' && indexRef.current >= allData.length - 1) return;
    if (direction === 'backward' && indexRef.current <= 0) return;

    // Start flip if not already
    if (phaseRef.current === 'idle') {
      beginFlip(direction);
      // Give canvas a frame to mount
      return;
    }

    // Update progress based on drag
    const ph = pageHeightRef.current || 460;
    const progress = Math.min(Math.abs(delta) / (ph * 0.65), 0.95);
    progressRef.current = progress;
    renderFrame();
  }, [beginFlip, renderFrame]);

  const onPointerUp = useCallback(() => {
    clearTimeout(longPressRef.current);
    if (!touchRef.current.active) return;
    touchRef.current.active = false;

    if (phaseRef.current !== 'dragging') return;

    // Decide: commit or cancel
    const delta = Math.abs(touchRef.current.startY - touchRef.current.lastY);
    const elapsed = (performance.now() - touchRef.current.startTime) / 1000;
    const velocity = elapsed > 0 ? delta / elapsed : 0;
    const progress = progressRef.current;

    if (progress > 0.28 || velocity > 350) {
      commitFlip();
    } else {
      cancelFlipAnim();
    }
  }, [commitFlip, cancelFlipAnim]);

  // Click (desktop — only if no drag happened)
  const onClickHandler = useCallback((e) => {
    if (touchRef.current.hasMoved) return;
    if (phaseRef.current !== 'idle') return;
    if (showMonthStrip) { setShowMonthStrip(false); return; }

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / rect.height;

    if (ratio < 0.4 && indexRef.current < allData.length - 1) {
      quickFlip('forward');
    } else if (ratio > 0.6 && indexRef.current > 0) {
      quickFlip('backward');
    }
  }, [quickFlip, showMonthStrip]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (phaseRef.current !== 'idle') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') quickFlip('forward');
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') quickFlip('backward');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [quickFlip]);

  // Wheel
  const wheelCooldown = useRef(false);
  const onWheel = useCallback((e) => {
    if (phaseRef.current !== 'idle' || wheelCooldown.current) return;
    if (Math.abs(e.deltaY) < 20) return;
    wheelCooldown.current = true;
    setTimeout(() => { wheelCooldown.current = false; }, 650);
    if (e.deltaY > 0) quickFlip('forward');
    else quickFlip('backward');
  }, [quickFlip]);

  // Double tap
  const lastTapRef = useRef(0);
  const onDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300 && phaseRef.current === 'idle') {
      setCurrentIndex(getTodayIndex());
    }
    lastTapRef.current = now;
  }, []);

  // Month strip
  const handleSelectMonth = useCallback((dayIndex, teluguIdx) => {
    // teluguIdx is the index into TELUGU_MONTHS array
    if (teluguIdx !== undefined) {
      setTeluguMonthIdx(teluguIdx);
      setShowMonthStrip(false);
      setViewMode('telugu-month');
    } else {
      setCurrentIndex(dayIndex);
      setShowMonthStrip(false);
    }
  }, []);

  // Clear clip-path AFTER React has rendered the new page content
  useEffect(() => {
    if (!flipping && currentPageRef.current) {
      currentPageRef.current.style.clipPath = 'none';
    }
  }, [flipping, currentIndex]);

  // Measure page on mount + resize
  useEffect(() => {
    const measure = () => {
      if (currentPageRef.current) {
        const h = currentPageRef.current.offsetHeight;
        const w = currentPageRef.current.offsetWidth;
        if (h > 0) pageHeightRef.current = h;
        if (w > 0) pageWidthRef.current = w;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Report current festival to parent
  useEffect(() => {
    const data = allData[currentIndex];
    if (onDateChange) onDateChange(data?.festival);
  }, [currentIndex, onDateChange]);

  // Global touch listeners — swipe works anywhere on the screen (day view only)
  useEffect(() => {
    if (viewMode !== 'day') return;
    const down = (e) => onPointerDown(e);
    const move = (e) => onPointerMove(e);
    const up = (e) => onPointerUp(e);
    document.addEventListener('touchstart', down, { passive: true });
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', up, { passive: true });
    return () => {
      document.removeEventListener('touchstart', down);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };
  }, [viewMode, onPointerDown, onPointerMove, onPointerUp]);

  // Cleanup
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // =================================================================
  //  MONTH VIEW LOGIC
  // =================================================================
  // Derive current month/year from the current day index
  const allDates = useMemo(() => generateAllDates(), []);
  const currentDate = allDates[currentIndex] || new Date(2026, 2, 19);
  const [monthViewYear, setMonthViewYear] = useState(currentDate.getFullYear());
  const [monthViewMonth, setMonthViewMonth] = useState(currentDate.getMonth());

  // Telugu month index state
  const [teluguMonthIdx, setTeluguMonthIdx] = useState(() => {
    // Find which Telugu month the current date falls in
    const d = allDates[0] || new Date(2026, 2, 19);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const idx = TELUGU_MONTHS.findIndex(m => dateStr >= m.start && dateStr <= m.end);
    return idx >= 0 ? idx : 0;
  });

  const switchToEnglishMonth = useCallback(() => {
    const d = allDates[currentIndex];
    if (d) {
      setMonthViewYear(d.getFullYear());
      setMonthViewMonth(d.getMonth());
    }
    setViewMode('month');
  }, [allDates, currentIndex]);

  const switchToTeluguMonth = useCallback(() => {
    setShowMonthStrip(true);
  }, []);

  const switchToDay = useCallback(() => {
    setViewMode('day');
  }, []);

  const handleMonthSelectDate = useCallback((day) => {
    // Find the index in allData for this date
    const target = new Date(monthViewYear, monthViewMonth, day);
    target.setHours(0, 0, 0, 0);
    const start = new Date(2026, 2, 19);
    start.setHours(0, 0, 0, 0);
    const idx = Math.round((target - start) / 86400000);
    if (idx >= 0 && idx < allData.length) {
      setCurrentIndex(idx);
      setViewMode('day');
    }
  }, [monthViewYear, monthViewMonth]);

  const handlePrevMonth = useCallback(() => {
    setMonthViewMonth(m => {
      if (m === 0) { setMonthViewYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setMonthViewMonth(m => {
      if (m === 11) { setMonthViewYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  // Telugu month navigation
  const handlePrevTeluguMonth = useCallback(() => {
    setTeluguMonthIdx(i => Math.max(0, i - 1));
  }, []);
  const handleNextTeluguMonth = useCallback(() => {
    setTeluguMonthIdx(i => Math.min(TELUGU_MONTHS.length - 1, i + 1));
  }, []);
  const handleTeluguMonthSelectDate = useCallback((year, month, day) => {
    const target = new Date(year, month, day);
    target.setHours(0, 0, 0, 0);
    const start = new Date(2026, 2, 19);
    start.setHours(0, 0, 0, 0);
    const idx = Math.round((target - start) / 86400000);
    if (idx >= 0 && idx < allData.length) {
      setCurrentIndex(idx);
      setViewMode('day');
    }
  }, []);

  // Wheel navigation for month view
  const monthWheelCooldown = useRef(false);
  const onMonthWheel = useCallback((e) => {
    if (monthWheelCooldown.current) return;
    if (Math.abs(e.deltaY) < 30) return;
    monthWheelCooldown.current = true;
    setTimeout(() => { monthWheelCooldown.current = false; }, 500);
    if (e.deltaY > 0) handleNextMonth();
    else handlePrevMonth();
  }, [handleNextMonth, handlePrevMonth]);

  // =================================================================
  //  RENDER
  // =================================================================
  const currentData = allData[currentIndex];
  const nextData = currentIndex < allData.length - 1 ? allData[currentIndex + 1] : null;
  const prevData = currentIndex > 0 ? allData[currentIndex - 1] : null;
  const underData = flipDirection === 'backward' ? prevData : nextData;

  return (
    <div
      ref={containerRef}
      style={styles.padOuter}
      onWheel={viewMode === 'day' ? onWheel : viewMode === 'month' ? onMonthWheel : undefined}
      onMouseDown={viewMode === 'day' ? onPointerDown : undefined}
      onMouseMove={viewMode === 'day' ? onPointerMove : undefined}
      onMouseUp={viewMode === 'day' ? onPointerUp : undefined}
      tabIndex={0}
    >
      <div style={styles.pad}>
        {viewMode === 'day' ? (
          <>
            <div style={styles.flipScene}>
              {flipping && underData && (
                <div style={styles.underPage}>
                  <Page
                    data={underData}
                    dayIndex={flipDirection === 'backward' ? currentIndex - 1 : currentIndex + 1}
                    totalDays={allData.length}
                  />
                </div>
              )}

              <div
                ref={currentPageRef}
                style={styles.currentPage}
                onClick={(e) => { onDoubleTap(); onClickHandler(e); }}
              >
                <Page
                  data={currentData}
                  dayIndex={currentIndex}
                  totalDays={allData.length}
                />
              </div>

              {flipping && (
                <canvas ref={canvasRef} style={styles.canvas} />
              )}
            </div>
            <PageStack dayIndex={currentIndex} totalDays={allData.length} />
          </>
        ) : viewMode === 'month' ? (
          <MonthView
            year={monthViewYear}
            month={monthViewMonth}
            onSelectDate={handleMonthSelectDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        ) : (
          <TeluguMonthView
            teluguMonthIndex={teluguMonthIdx}
            onPrev={handlePrevTeluguMonth}
            onNext={handleNextTeluguMonth}
            onSelectDate={handleTeluguMonthSelectDate}
          />
        )}
      </div>

      {/* Controls below the calendar */}
      <div style={styles.belowPad}>
        <div style={styles.buttonRow}>
          {viewMode === 'day' ? (
            <>
              <button style={styles.viewToggle} onClick={switchToTeluguMonth}>
                <span style={styles.toggleText}>తెలుగు నెల</span>
              </button>
              <button style={styles.viewToggle} onClick={switchToEnglishMonth}>
                <span style={styles.toggleText}>ఇంగ్లీష్ నెల</span>
              </button>
              <ShareButton data={allData[currentIndex]} />
            </>
          ) : (
            <button style={styles.viewToggle} onClick={switchToDay}>
              <span style={styles.toggleIcon}>◉</span>
              <span style={styles.toggleText}>రోజు</span>
            </button>
          )}
        </div>
        {viewMode === 'day' && (
          <FestivalWishes festival={allData[currentIndex]?.festival} />
        )}
        {viewMode === 'day' && !flipping && <NavigationHint />}
        {viewMode === 'month' && <MonthNavHint />}
      </div>

      <MonthStrip
        visible={showMonthStrip}
        onSelectMonth={handleSelectMonth}
        currentMonthIndex={currentIndex}
      />
    </div>
  );
}

function MonthNavHint() {
  return (
    <div style={monthHintStyles.container}>
      <span style={monthHintStyles.arrow}>←</span>
      <span style={monthHintStyles.label}>నెల మార్చండి</span>
      <span style={monthHintStyles.arrow}>→</span>
    </div>
  );
}

const monthHintStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '6px',
    pointerEvents: 'none',
  },
  arrow: {
    fontSize: '20px',
    color: '#d6a820',
    opacity: 0.35,
  },
  label: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontSize: '11px',
    fontWeight: 500,
    color: '#d6a820',
    opacity: 0.35,
  },
};

const styles = {
  padOuter: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    position: 'relative',
    outline: 'none',
  },
  pad: {
    position: 'relative',
    width: '100%',
  },
  flipScene: {
    position: 'relative',
    width: '100%',
    borderRadius: '3px',
  },
  underPage: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    borderRadius: '3px',
    overflow: 'hidden',
  },
  currentPage: {
    position: 'relative',
    zIndex: 2,
    cursor: 'grab',
    borderRadius: '3px',
    willChange: 'clip-path',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
    pointerEvents: 'none',
  },

  // Below pad area
  belowPad: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '8px',
  },
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  viewToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(214,168,32,0.08)',
    border: '1.5px solid rgba(214,168,32,0.3)',
    borderRadius: '28px',
    padding: '10px 24px',
    cursor: 'pointer',
    transition: 'border-color 200ms, background 200ms',
  },
  toggleIcon: {
    fontSize: '18px',
    color: '#d6a820',
    opacity: 0.85,
  },
  toggleText: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#d6a820',
    letterSpacing: '0.5px',
  },
};
