import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getSavedLocation, saveLocation, createCustomLocation, LOCATIONS } from '../data/locations.js';
import { clearCache } from '../data/panchangam.js';
import { computeTeluguMonths } from '../data/teluguMonths.js';

const LocationContext = createContext(null);
const FIRST_LAUNCH_KEY = 'manacalendar-location-prompted';

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(() => getSavedLocation());
  const [teluguMonths, setTeluguMonths] = useState([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [geoDetecting, setGeoDetecting] = useState(false);

  // Check if first launch — show location prompt
  useEffect(() => {
    try {
      const prompted = localStorage.getItem(FIRST_LAUNCH_KEY);
      if (!prompted) {
        // Small delay so splash screen finishes first
        const t = setTimeout(() => setShowLocationPrompt(true), 2000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  // Compute Telugu months when location changes (deferred to not block first paint)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTeluguMonths(computeTeluguMonths(location));
    });
    return () => cancelAnimationFrame(id);
  }, [location]);

  const setLocation = useCallback((loc) => {
    clearCache();
    saveLocation(loc);
    setLocationState(loc);
  }, []);

  const handleAutoDetect = useCallback(() => {
    if (!navigator.geolocation) {
      dismissPrompt();
      return;
    }
    setGeoDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Check if close to a preset location (within ~50km)
        const nearby = LOCATIONS.find(l => {
          const dlat = l.lat - latitude;
          const dlng = l.lng - longitude;
          return Math.sqrt(dlat * dlat + dlng * dlng) < 0.5; // ~50km
        });
        const loc = nearby || createCustomLocation(latitude, longitude);
        setLocation(loc);
        setGeoDetecting(false);
        dismissPrompt();
      },
      () => {
        // Permission denied or error — keep default
        setGeoDetecting(false);
        dismissPrompt();
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [setLocation]);

  const dismissPrompt = useCallback(() => {
    setShowLocationPrompt(false);
    try { localStorage.setItem(FIRST_LAUNCH_KEY, 'true'); } catch {}
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, teluguMonths }}>
      {children}
      {showLocationPrompt && (
        <LocationPromptOverlay
          onAutoDetect={handleAutoDetect}
          onSkip={dismissPrompt}
          detecting={geoDetecting}
        />
      )}
    </LocationContext.Provider>
  );
}

/** First-launch location prompt overlay */
function LocationPromptOverlay({ onAutoDetect, onSkip, detecting }) {
  return (
    <div style={promptStyles.backdrop}>
      <div style={promptStyles.card}>
        {/* Om symbol */}
        <div style={promptStyles.om}>🙏</div>

        <div style={promptStyles.title}>Location for Accurate Panchangam</div>
        <div style={promptStyles.titleTe}>ఖచ్చితమైన పంచాంగం కోసం మీ లొకేషన్</div>

        <div style={promptStyles.desc}>
          Tithi, Nakshatra, Sunrise, Sunset, Muhurta and all Panchangam calculations
          depend on your location. We use your location only for these calculations —
          nothing is sent to any server.
        </div>
        <div style={promptStyles.descTe}>
          తిథి, నక్షత్రం, సూర్యోదయం, సూర్యాస్తమయం, ముహూర్తం — అన్ని పంచాంగ గణనలు
          మీ ప్రాంతం ఆధారంగా లెక్కించబడతాయి. మీ లొకేషన్ ఫోన్ లోనే ఉంటుంది, ఎక్కడికీ పంపబడదు.
        </div>

        <button
          style={{
            ...promptStyles.detectBtn,
            opacity: detecting ? 0.7 : 1,
          }}
          onClick={onAutoDetect}
          disabled={detecting}
        >
          {detecting ? (
            <span>Detecting...</span>
          ) : (
            <>
              <span style={promptStyles.detectIcon}>📍</span>
              <span>Auto-detect my location</span>
            </>
          )}
        </button>

        <button style={promptStyles.skipBtn} onClick={onSkip}>
          Skip — use Hyderabad as default
        </button>

        <div style={promptStyles.privacy}>
          🔒 Your location stays on your device. No data is collected or shared.
        </div>
      </div>
    </div>
  );
}

const promptStyles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    background: '#FAFAF8',
    borderRadius: 24,
    padding: '32px 24px 24px',
    maxWidth: 380,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  om: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  titleTe: {
    fontFamily: "'Noto Sans Telugu', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: '#666',
    marginBottom: 16,
  },
  desc: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    color: '#555',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  descTe: {
    fontFamily: "'Noto Sans Telugu', sans-serif",
    fontSize: 12,
    color: '#777',
    lineHeight: 1.7,
    marginBottom: 24,
  },
  detectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #E63B2E, #C42E23)',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(230,59,46,0.3)',
    marginBottom: 12,
  },
  detectIcon: {
    fontSize: 18,
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: 13,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    cursor: 'pointer',
    padding: '8px 16px',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(0,0,0,0.15)',
    textUnderlineOffset: 3,
  },
  privacy: {
    marginTop: 16,
    fontSize: 11,
    color: '#AAA',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
};

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
