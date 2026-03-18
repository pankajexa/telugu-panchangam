import React, { useState, useEffect, useCallback } from 'react';
import CalendarPad from './CalendarPad';
import FestivalDecorations from './FestivalDecorations';

export default function CalendarContainer() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentFestival, setCurrentFestival] = useState(null);

  useEffect(() => {
    // Safety: always show after 2s even if fonts haven't loaded
    const timeout = setTimeout(() => setFontsLoaded(true), 2000);
    if (document.fonts) {
      document.fonts.ready.then(() => { setFontsLoaded(true); clearTimeout(timeout); });
    }
    return () => clearTimeout(timeout);
  }, []);

  const handleDateChange = useCallback((festival) => {
    setCurrentFestival(festival || null);
  }, []);

  return (
    <div style={styles.wall}>
      <div style={{
        ...styles.calendarWrapper,
        opacity: fontsLoaded ? 1 : 0,
        transition: 'opacity 500ms ease',
      }}>
        {/* Decorations are absolutely positioned — they never shift the calendar */}
        <FestivalDecorations festival={currentFestival} position="top" />
        <FestivalDecorations festival={currentFestival} position="bottom" />

        <div style={styles.calendarArea}>
          <CalendarPad onDateChange={handleDateChange} />
        </div>
      </div>

      {!fontsLoaded && (
        <div style={styles.loading}>
          <div style={styles.loadingText}>పంచాంగం</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wall: {
    width: '100%',
    height: '100vh',
    height: '100dvh',
    background: '#1a120e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  calendarWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '432px',
  },
  calendarArea: {
    width: '100%',
    padding: '0 16px',
  },
  loading: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a120e',
  },
  loadingText: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontSize: '28px',
    color: '#d6a820',
    opacity: 0.5,
  },
};
