import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import useLocalStorage from './components/hooks/useLocalStorage';

type Language = 'en' | 'pl';
// Use a generic type for translations since they are loaded dynamically
type Translations = { [key: string]: any };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('prometheus_language', 'en');
  const [translations, setTranslations] = useState<Record<Language, Translations> | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enResponse, plResponse] = await Promise.all([
          fetch('./locales/en.json'),
          fetch('./locales/pl.json')
        ]);
        const enData = await enResponse.json();
        const plData = await plResponse.json();
        setTranslations({ en: enData, pl: plData });
      } catch (error) {
        console.error("Failed to load translation files:", error);
        // Fallback to empty objects to prevent app from crashing
        setTranslations({ en: {}, pl: {} });
      }
    };
    fetchTranslations();
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
      if (!translations) {
        return ''; // Return empty string or key during load
      }
      
      const keys = key.split('.');
      let text = keys.reduce((obj, k) => (obj as any)?.[k], translations[language]);

      if (typeof text !== 'string') {
        // Fallback to English if key not found in current language
        text = keys.reduce((obj, k) => (obj as any)?.[k], translations['en']);
        if (typeof text !== 'string') {
          return key; // Return the key if translation is not found in any language
        }
      }

      if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
          text = (text as string).replace(new RegExp(`{{${placeholder}}}`, 'g'), String(value));
        });
      }

      return text;
    },
    [language, translations]
  );
  
  // Render nothing while translations are loading to prevent flicker of untranslated text
  if (!translations) {
      return null;
  }
  
  return React.createElement(I18nContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
