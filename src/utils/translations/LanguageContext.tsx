import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Alert } from 'react-native';

type LanguageCode = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@medier_language';

const languageCodeMap: Record<string, LanguageCode> = {
  'English': 'en',
  'French': 'fr',
  'Arabic': 'ar',
};

const reverseLanguageCodeMap: Record<LanguageCode, string> = {
  'en': 'English',
  'fr': 'French',
  'ar': 'Arabic',
};

// Pre-load the unified translation files
const translations: Record<LanguageCode, any> = {
  en: require('./en.json'),
  fr: require('./fr.json'),
  ar: require('./ar.json'),
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr' || savedLanguage === 'ar')) {
        setLanguageState(savedLanguage as LanguageCode);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const setLanguage = async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      
      const isRTL = lang === 'ar';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        I18nManager.allowRTL(isRTL);
        Alert.alert(
          'Restart Required',
          'Please restart the app for the language direction changes to take effect.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): string => {
    try {
      const langTranslations = translations[language];
      if (!langTranslations) {
        console.error(`Translation language not found: ${language}`);
        return key;
      }
      
      return langTranslations[key] || key;
    } catch (error) {
      console.error(`Failed to load translation for ${language}:`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export const languageCodeToName = (code: LanguageCode): string => {
  return reverseLanguageCodeMap[code];
};

export const languageNameToCode = (name: string): LanguageCode => {
  return languageCodeMap[name] || 'en';
};
