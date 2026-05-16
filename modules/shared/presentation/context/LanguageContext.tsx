'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { allLocales as translations } from '@/modules/registry/locales';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, module?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [direction, setDirection] = useState<Direction>('rtl');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      // Default to Arabic
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    localStorage.setItem('lang', lang);
    
    // Update document attributes
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  };

  const t = (key: string, moduleName: string = 'shared'): string => {
    const keys = key.split('.');
    let value = translations[moduleName]?.[language];
    
    if (!value) {
      // Fallback to shared if module not found
      value = translations['shared']?.[language];
    }

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key itself
      }
    }
    
    return value;
  };

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      <div dir={direction} className={direction === 'rtl' ? 'font-noto' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
