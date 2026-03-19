import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getSavedLocation, saveLocation } from '../data/locations.js';
import { clearCache } from '../data/panchangam.js';
import { computeTeluguMonths } from '../data/teluguMonths.js';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(() => getSavedLocation());
  const [teluguMonths, setTeluguMonths] = useState([]);

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

  return (
    <LocationContext.Provider value={{ location, setLocation, teluguMonths }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
