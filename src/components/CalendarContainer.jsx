import React, { useState, useEffect, useCallback } from 'react';
import CalendarPad from './CalendarPad';
import FestivalDecorations from './FestivalDecorations';
import LocationPicker from './LocationPicker';

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
        {/* Brand name + location picker */}
        <div style={styles.brandRow}>
          <span style={styles.brandMana}>మన</span>
          <span style={styles.brandCalendar}>Calendar</span>
          <span style={styles.brandDot}>.com</span>
        </div>
        <div style={styles.locationRow}>
          <LocationPicker />
        </div>

        {/* Festival decoration — below brand, above calendar */}
        <FestivalDecorations festival={currentFestival} position="top" />

        <div style={styles.calendarArea}>
          <CalendarPad onDateChange={handleDateChange} />
        </div>

        {/* Festival decoration — below calendar */}
        <FestivalDecorations festival={currentFestival} position="bottom" />
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
    minHeight: '100vh',
    minHeight: '100dvh',
    background: '#1a120e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '12px',
    paddingBottom: '12px',
    overflow: 'auto',
    position: 'relative',
    boxSizing: 'border-box',
  },
  calendarWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '432px',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '2px',
    paddingBottom: '10px',
  },
  brandMana: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 800,
    fontSize: '22px',
    color: '#d6a820',
    letterSpacing: '0.5px',
  },
  brandCalendar: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: '20px',
    color: '#d6a820',
    letterSpacing: '0.5px',
  },
  brandDot: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    color: '#b88050',
    opacity: 0.6,
  },
  locationRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '4px',
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
