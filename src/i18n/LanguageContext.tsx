import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  translateRegion: (region: string) => string;
  translateProcessing: (proc: string) => string;
  translateStatus: (status: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial language from localStorage if available, default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('coffeeintel_lang');
      if (saved === 'am' || saved === 'en') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('coffeeintel_lang', lang);
    } catch {
      // ignore
    }
  };

  // Helper translations for domain entities
  const translateRegion = (region: string): string => {
    if (language === 'en') return region;
    switch (region) {
      case 'Yirgacheffe': return 'ይርጋጨፌ';
      case 'Sidama': return 'ሲዳማ';
      case 'Guji': return 'ጉጂ';
      case 'Limu': return 'ሊሙ';
      case 'Jimma': return 'ጅማ';
      case 'Harar': return 'ሀረር';
      case 'Keffa/Nekemte': return 'ከፋ/ነቀምቴ';
      default: return region;
    }
  };

  const translateProcessing = (proc: string): string => {
    if (language === 'en') return proc;
    switch (proc) {
      case 'Washed': return 'የታጠበ';
      case 'Natural (Unwashed)': return 'ያልታጠበ (ተፈጥሯዊ)';
      case 'Specialty Micro-lot': return 'ልዩ ማይክሮ-ሎት';
      default: return proc;
    }
  };

  const translateStatus = (status: string): string => {
    if (language === 'en') return status;
    switch (status) {
      case 'High Demand': return 'ከፍተኛ ተፈላጊነት';
      case 'Stable': return 'የተረጋጋ';
      case 'Tight Supply': return 'አነስተኛ አቅርቦት';
      case 'Discounted': return 'ቅናሽ ያለበት';
      default: return status;
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: TRANSLATIONS[language],
    translateRegion,
    translateProcessing,
    translateStatus,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
