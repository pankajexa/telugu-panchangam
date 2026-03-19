import React, { useState, useCallback } from 'react';
import { useLocation } from '../context/LocationContext';
import { LOCATIONS, createCustomLocation } from '../data/locations';

const TELUGU = "'Noto Serif Telugu', serif";
const SERIF = "'Inter', system-ui, sans-serif";

export default function LocationPicker() {
  const { location, setLocation } = useLocation();
  const [open, setOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleSelect = useCallback((loc) => {
    setLocation(loc);
    setOpen(false);
  }, [setLocation]);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = createCustomLocation(pos.coords.latitude, pos.coords.longitude);
        setLocation(loc);
        setGeoLoading(false);
        setOpen(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [setLocation]);

  // Group by country
  const india = LOCATIONS.filter(l => l.country === 'IN');
  const us = LOCATIONS.filter(l => l.country === 'US');

  return (
    <>
      <button style={styles.trigger} onClick={() => setOpen(true)}>
        <span style={styles.pin}>&#x1F4CD;</span>
        <span style={styles.cityName}>{location.labelEn}</span>
      </button>

      {open && (
        <div style={styles.backdrop} onClick={() => setOpen(false)}>
          <div style={styles.panel} onClick={e => e.stopPropagation()}>
            <div style={styles.title}>ప్రాంతం ఎంచుకోండి</div>
            <div style={styles.subtitle}>Select Location</div>

            {/* India */}
            <div style={styles.groupLabel}>భారతదేశం</div>
            {india.map(l => (
              <CityRow key={l.id} loc={l} active={location.id === l.id} onSelect={handleSelect} />
            ))}

            {/* US */}
            <div style={styles.groupLabel}>అమెరికా (USA)</div>
            <div style={styles.usGrid}>
              {us.map(l => (
                <CityRow key={l.id} loc={l} active={location.id === l.id} onSelect={handleSelect} compact />
              ))}
            </div>

            {/* Geolocation */}
            <button style={styles.geoBtn} onClick={handleGeolocate} disabled={geoLoading}>
              <span>{geoLoading ? 'గుర్తిస్తోంది...' : 'నా ఖచ్చితమైన లొకేషన్ వాడండి'}</span>
              <span style={styles.geoSub}>{geoLoading ? 'Detecting...' : 'Use my exact location'}</span>
            </button>

            {location.id === 'custom' && (
              <div style={styles.customInfo}>
                {location.labelEn}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CityRow({ loc, active, onSelect, compact }) {
  return (
    <button
      style={{
        ...styles.cityBtn,
        ...(compact ? styles.cityBtnCompact : {}),
        ...(active ? styles.cityBtnActive : {}),
      }}
      onClick={() => onSelect(loc)}
    >
      <span style={styles.cityTelugu}>{loc.label}</span>
      <span style={styles.cityEnglish}>{loc.labelEn}</span>
    </button>
  );
}

const styles = {
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  pin: { fontSize: '12px' },
  cityName: {
    fontFamily: SERIF,
    fontSize: '11px',
    fontWeight: 600,
    color: '#d6a820',
    letterSpacing: '0.3px',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(214,168,32,0.3)',
    textUnderlineOffset: '2px',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: '420px',
    maxHeight: '80vh',
    overflowY: 'auto',
    background: 'linear-gradient(to top, rgba(214,168,32,0.98), rgba(240,194,48,0.96))',
    borderRadius: '14px 14px 0 0',
    padding: '16px 14px 20px',
    boxShadow: '0 -8px 30px rgba(60,30,10,0.3)',
  },
  title: {
    fontFamily: TELUGU,
    fontWeight: 800,
    fontSize: '18px',
    color: '#3a150a',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: SERIF,
    fontWeight: 600,
    fontSize: '11px',
    color: '#6b2d15',
    textAlign: 'center',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  groupLabel: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '13px',
    color: '#6b2d15',
    padding: '8px 4px 4px',
    borderBottom: '1px solid rgba(58,21,10,0.1)',
  },
  usGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2px',
  },
  cityBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0px',
    padding: '8px 10px',
    background: 'none',
    border: '1.5px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  cityBtnCompact: {
    padding: '6px 8px',
  },
  cityBtnActive: {
    background: 'rgba(58,21,10,0.08)',
    border: '1.5px solid rgba(58,21,10,0.2)',
  },
  cityTelugu: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '14px',
    color: '#3a150a',
    lineHeight: 1.3,
  },
  cityEnglish: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '10px',
    color: '#915838',
    letterSpacing: '0.3px',
  },
  geoBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    width: '100%',
    margin: '12px 0 4px',
    padding: '10px',
    background: 'rgba(58,21,10,0.06)',
    border: '1.5px dashed rgba(58,21,10,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '13px',
    color: '#3a150a',
  },
  geoSub: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '9px',
    color: '#915838',
    letterSpacing: '0.5px',
  },
  customInfo: {
    fontFamily: SERIF,
    fontSize: '10px',
    color: '#915838',
    textAlign: 'center',
    marginTop: '4px',
  },
};
