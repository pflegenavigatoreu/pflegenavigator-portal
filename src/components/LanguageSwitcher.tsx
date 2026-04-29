'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { isRTL } from '@/i18n/config';

interface Language {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}

const languages: Language[] = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'en', name: 'English', flag: '🇬🇧', rtl: false },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', rtl: false },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'bg', name: 'Български', flag: '🇧🇬', rtl: false },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷', rtl: false },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿', rtl: false },
  { code: 'da', name: 'Dansk', flag: '🇩🇰', rtl: false },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', rtl: false },
  { code: 'et', name: 'Eesti', flag: '🇪🇪', rtl: false },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮', rtl: false },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', rtl: false },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺', rtl: false },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪', rtl: false },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻', rtl: false },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹', rtl: false },
  { code: 'mt', name: 'Malti', flag: '🇲🇹', rtl: false },
  { code: 'no', name: 'Norsk', flag: '🇳🇴', rtl: false },
  { code: 'pt', name: 'Português', flag: '🇵🇹', rtl: false },
  { code: 'ro', name: 'Română', flag: '🇷🇴', rtl: false },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', rtl: false },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮', rtl: false },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', rtl: false },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', rtl: false },
  { code: 'sr', name: 'Српски', flag: '🇷🇸', rtl: false },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰', rtl: false },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱', rtl: false },
  { code: 'bs', name: 'Bosanski', flag: '🇧🇦', rtl: false },
  { code: 'is', name: 'Íslenska', flag: '🇮🇸', rtl: false },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language || 'de');

  useEffect(() => {
    const detectedLang = i18n.language || localStorage.getItem('i18nextLng') || 'de';
    if (detectedLang !== currentLang) {
      setCurrentLang(detectedLang);
    }
  }, [i18n.language, currentLang]);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    await i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);

    // RTL handling
    const isRtl = isRTL(langCode);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    
    // Store preference
    localStorage.setItem('i18nextLng', langCode);

    // Reload page for RTL styles to take full effect
    if (isRtl !== isRTL(currentLang)) {
      window.location.reload();
    }
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];
  const displayLanguages = languages.slice(0, 10); // Show top 10 by default
  const moreLanguages = languages.slice(10);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                   transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('language.select')}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="max-w-[100px] truncate">{currentLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute right-0 mt-2 w-64 max-h-[400px] overflow-y-auto 
                       bg-white rounded-xl shadow-xl border border-gray-200 z-50"
            role="listbox"
          >
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
                {t('language.current')}
              </div>
              
              {displayLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                             transition-colors ${
                               currentLang === lang.code
                                 ? 'bg-blue-50 text-blue-700'
                                 : 'hover:bg-gray-50 text-gray-700'
                             }`}
                  role="option"
                  aria-selected={currentLang === lang.code}
                  dir={lang.rtl ? 'rtl' : 'ltr'}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1">{lang.name}</span>
                  {currentLang === lang.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}

              {moreLanguages.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-2" />
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
                    Weitere Sprachen
                  </div>
                  {moreLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                                 transition-colors ${
                                   currentLang === lang.code
                                     ? 'bg-blue-50 text-blue-700'
                                     : 'hover:bg-gray-50 text-gray-700'
                                 }`}
                      role="option"
                      aria-selected={currentLang === lang.code}
                      dir={lang.rtl ? 'rtl' : 'ltr'}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="flex-1">{lang.name}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
