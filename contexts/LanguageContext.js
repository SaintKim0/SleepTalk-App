import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // 브라우저 언어 설정 확인
    const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
    const savedLang = localStorage.getItem('sleeptalk-language');
    setLanguage(savedLang || browserLang);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('sleeptalk-language', newLanguage);
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // 번역이 없으면 영어로 폴백
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && value[fallbackKey] !== undefined) {
            value = value[fallbackKey];
          } else {
            return key; // 번역 키 자체를 반환
          }
        }
      }
    }

    // 파라미터 치환
    if (typeof value === 'string') {
      Object.keys(params).forEach((param) => {
        value = value.replace(`{${param}}`, params[param]);
      });
    }

    return value;
  };

  const value = {
    language,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
