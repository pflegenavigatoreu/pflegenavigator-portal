import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { supportedLanguages, detectBrowserLanguage, isSupportedLanguage } from './language-detection';
import { isRTL } from './rtl';

const languageCodes = supportedLanguages.map(l => l.code);

export const i18nConfig = {
  fallbackLng: 'de',
  debug: process.env.NODE_ENV === 'development',
  
  interpolation: {
    escapeValue: false,
  },
  
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
  },
  
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  
  supportedLngs: languageCodes,
  
  defaultNS: 'common',
  ns: ['common', 'navigation', 'pflegegrad', 'buttons', 'errors', 'results'],
  
  // Load all namespaces for each language
  nsSeparator: '.',
  keySeparator: '.',
  
  react: {
    useSuspense: false,
  },
};

export { isRTL };

export const initI18n = async () => {
  await i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nConfig);
  
  // Listen for language changes to update RTL
  i18n.on('languageChanged', (lng: string) => {
    if (typeof document !== 'undefined') {
      const isRtl = isRTL(lng);
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    }
  });
  
  return i18n;
};

export default i18n;
