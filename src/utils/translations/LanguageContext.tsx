import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Alert } from 'react-native';

type LanguageCode = 'en' | 'fr' | 'ar';

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
  'Arabic': 'ar',
};

const reverseLanguageCodeMap: Record<LanguageCode, string> = {
  'en': 'English',
  'fr': 'French',
  'ar': 'Arabic',
};

// Pre-load all translation files
const translations: Record<string, Record<LanguageCode, any>> = {
  login: {
    en: require('./login/en.json'),
    fr: require('./login/fr.json'),
    ar: require('./login/ar.json'),
  },
  register: {
    en: require('./register/en.json'),
    fr: require('./register/fr.json'),
    ar: require('./register/ar.json'),
  },
  forgotPassword: {
    en: require('./forgotPassword/en.json'),
    fr: require('./forgotPassword/fr.json'),
    ar: require('./forgotPassword/ar.json'),
  },
  languageSelection: {
    en: require('./languageSelection/en.json'),
    fr: require('./languageSelection/fr.json'),
    ar: require('./languageSelection/ar.json'),
  },
  onBoarding: {
    en: require('./onBoarding/en.json'),
    fr: require('./onBoarding/fr.json'),
    ar: require('./onBoarding/ar.json'),
  },
  privacyPolicy: {
    en: require('./privacyPolicy/en.json'),
    fr: require('./privacyPolicy/fr.json'),
    ar: require('./privacyPolicy/ar.json'),
  },
  termsAndConditions: {
    en: require('./termsAndConditions/en.json'),
    fr: require('./termsAndConditions/fr.json'),
    ar: require('./termsAndConditions/ar.json'),
  },
  agendaScreen: {
    en: require('./agendaScreen/en.json'),
    fr: require('./agendaScreen/fr.json'),
    ar: require('./agendaScreen/ar.json'),
  },
  appointmentsScreen: {
    en: require('./appointmentsScreen/en.json'),
    fr: require('./appointmentsScreen/fr.json'),
    ar: require('./appointmentsScreen/ar.json'),
  },
  homeScreen: {
    en: require('./homeScreen/en.json'),
    fr: require('./homeScreen/fr.json'),
    ar: require('./homeScreen/ar.json'),
  },
  matchScreen: {
    en: require('./matchScreen/en.json'),
    fr: require('./matchScreen/fr.json'),
    ar: require('./matchScreen/ar.json'),
  },
  profileScreen: {
    en: require('./profileScreen/en.json'),
    fr: require('./profileScreen/fr.json'),
    ar: require('./profileScreen/ar.json'),
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
