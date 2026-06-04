import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageCode = 'en' | 'fr' | 'hi' | 'ur';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (screen: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@medier_language';

const languageCodeMap: Record<string, LanguageCode> = {
  'English': 'en',
  'French': 'fr',
  'Hindi': 'hi',
  'Urdu': 'ur',
};

const reverseLanguageCodeMap: Record<LanguageCode, string> = {
  'en': 'English',
  'fr': 'French',
  'hi': 'Hindi',
  'ur': 'Urdu',
};

// Pre-load all translation files
const translations: Record<string, Record<LanguageCode, any>> = {
  login: {
    en: require('./login/en.json'),
    fr: require('./login/fr.json'),
    hi: require('./login/hi.json'),
    ur: require('./login/ur.json'),
  },
  register: {
    en: require('./register/en.json'),
    fr: require('./register/fr.json'),
    hi: require('./register/hi.json'),
    ur: require('./register/ur.json'),
  },
  forgotPassword: {
    en: require('./forgotPassword/en.json'),
    fr: require('./forgotPassword/fr.json'),
    hi: require('./forgotPassword/hi.json'),
    ur: require('./forgotPassword/ur.json'),
  },
  languageSelection: {
    en: require('./languageSelection/en.json'),
    fr: require('./languageSelection/fr.json'),
    hi: require('./languageSelection/hi.json'),
    ur: require('./languageSelection/ur.json'),
  },
  onBoarding: {
    en: require('./onBoarding/en.json'),
    fr: require('./onBoarding/fr.json'),
    hi: require('./onBoarding/hi.json'),
    ur: require('./onBoarding/ur.json'),
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr' || savedLanguage === 'hi' || savedLanguage === 'ur')) {
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
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (screen: string, key: string): string => {
    try {
      const screenTranslations = translations[screen];
      if (!screenTranslations) {
        console.error(`Translation screen not found: ${screen}`);
        return key;
      }
      const langTranslations = screenTranslations[language];
      if (!langTranslations) {
        console.error(`Translation language not found: ${screen}/${language}`);
        return key;
      }
      const keys = key.split('.');
      let value: any = langTranslations;
      for (const k of keys) {
        value = value[k];
      }
      return value || key;
    } catch (error) {
      console.error(`Failed to load translation for ${screen}/${language}:`, error);
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
