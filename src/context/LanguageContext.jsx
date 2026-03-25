import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../data/translations.js';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'manacalendar-language';

function getSavedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'te';
  } catch {
    return 'te';
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => getSavedLanguage());

  const setLanguage = useCallback((lang) => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    setLanguageState(lang);
  }, []);

  // Translation function
  const t = useCallback((key) => {
    return translations[language]?.[key] ?? translations['te']?.[key] ?? key;
  }, [language]);

  // Helper: pick Telugu or English value
  const pick = useCallback((teluguVal, englishVal) => {
    return language === 'te' ? teluguVal : englishVal;
  }, [language]);

  // Font helper: returns Telugu font or Plus Jakarta Sans based on language
  const font = language === 'te' ? "'Noto Sans Telugu', sans-serif" : "'Plus Jakarta Sans', system-ui, sans-serif";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, pick, font }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
