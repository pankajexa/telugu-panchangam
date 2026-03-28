import React, { useState, useCallback } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { LOCATIONS, createCustomLocation } from '../data/locations';

const TELUGU = "'Noto Sans Telugu', serif";
const SERIF = "'Plus Jakarta Sans', system-ui, sans-serif";

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
  const others = LOCATIONS.filter(l => !['IN', 'US'].includes(l.country));

  const { t, font, pick } = useLanguage();

  return (
    <>
      <button style={styles.trigger} onClick={() => setOpen(true)}>
        <span style={styles.pin}>&#x1F4CD;</span>
        <span style={styles.cityName}>{location.labelEn}</span>
      </button>

      {open && (
        <div style={styles.backdrop} onClick={() => setOpen(false)}>
          <div style={styles.panel} onClick={e => e.stopPropagation()}>
            <div style={{ ...styles.title, fontFamily: font }}>{t('loc.title')}</div>
            <div style={styles.subtitle}>{t('loc.subtitle')}</div>

            {/* India */}
            <div style={{ ...styles.groupLabel, fontFamily: font }}>{t('loc.india')}</div>
            <div style={styles.usGrid}>
              {india.map(l => (
                <CityRow key={l.id} loc={l} active={location.id === l.id} onSelect={handleSelect} compact />
              ))}
            </div>

            {/* US */}
            <div style={{ ...styles.groupLabel, fontFamily: font }}>{t('loc.usa')}</div>
            <div style={styles.usGrid}>
              {us.map(l => (
                <CityRow key={l.id} loc={l} active={location.id === l.id} onSelect={handleSelect} compact />
              ))}
            </div>

            {/* Other Countries */}
            {others.length > 0 && (
              <>
                <div style={{ ...styles.groupLabel, fontFamily: font }}>{pick('ఇతర దేశాలు', 'Other Countries')}</div>
                <div style={styles.usGrid}>
                  {others.map(l => (
                    <CityRow key={l.id} loc={l} active={location.id === l.id} onSelect={handleSelect} compact />
                  ))}
                </div>
              </>
            )}

            {/* Geolocation */}
            <button style={{ ...styles.geoBtn, fontFamily: font }} onClick={handleGeolocate} disabled={geoLoading}>
              <span>{geoLoading ? t('loc.geoLoading') : t('loc.geoButton')}</span>
              <span style={styles.geoSub}>{t('loc.geoSub')}</span>
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
    color: '#C49B2A',
    letterSpacing: '0.3px',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(196,155,42,0.3)',
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
    background: '#FFFFFF',
    borderRadius: '20px 20px 0 0',
    padding: '16px 14px 20px',
    boxShadow: '0 -8px 30px rgba(45,24,16,0.12)',
  },
  title: {
    fontFamily: TELUGU,
    fontWeight: 800,
    fontSize: '18px',
    color: '#2D1810',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: SERIF,
    fontWeight: 600,
    fontSize: '11px',
    color: '#8A7568',
    textAlign: 'center',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  groupLabel: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '13px',
    color: '#C49B2A',
    padding: '8px 4px 4px',
    borderBottom: '1px solid rgba(45,24,16,0.06)',
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
    background: 'rgba(196,155,42,0.06)',
    border: '1.5px solid rgba(196,155,42,0.3)',
  },
  cityTelugu: {
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '14px',
    color: '#2D1810',
    lineHeight: 1.3,
  },
  cityEnglish: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '10px',
    color: '#8A7568',
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
    background: 'rgba(196,155,42,0.04)',
    border: '1.5px dashed rgba(196,155,42,0.25)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: TELUGU,
    fontWeight: 700,
    fontSize: '13px',
    color: '#2D1810',
  },
  geoSub: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: '9px',
    color: '#8A7568',
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
