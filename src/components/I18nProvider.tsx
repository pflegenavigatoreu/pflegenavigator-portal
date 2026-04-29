'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { initI18n } from '@/i18n/config';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Initialize i18n on client side
    initI18n().catch(console.error);
    
    // Check for stored language preference
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
    }
    
    // Set RTL direction based on language
    const currentLang = storedLang || i18n.language || 'de';
    const rtlLanguages = ['ar', 'fa', 'he', 'ur'];
    if (rtlLanguages.includes(currentLang)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
