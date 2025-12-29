import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage: Language }> = ({ children, initialLanguage }) => {
  const [language] = useState<Language>(initialLanguage);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Only used for persistence preferences, not routing authority
    localStorage.setItem('language', language);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Manage language specific classes
    document.body.classList.remove('font-arabic');
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    }
  }, [language, dir]);

  const setLanguage = (newLang: Language) => {
    if (newLang === language) return;
    
    // To change language with the new Router basename strategy,
    // we must perform a full URL rewrite/navigation to the new prefix.
    // e.g. /en/explore -> /ar/explore
    
    const currentPath = window.location.pathname; // includes /en/...
    // We assume the first segment is always the language code due to App.tsx logic
    const pathSegments = currentPath.split('/');
    // pathSegments[0] is empty, pathSegments[1] is old lang
    pathSegments[1] = newLang;
    const newPath = pathSegments.join('/');
    
    // Perform hard navigation to reload app with new basename context
    window.location.href = `${newPath}${window.location.search}${window.location.hash}`;
  };

  const t = (key: string) => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};