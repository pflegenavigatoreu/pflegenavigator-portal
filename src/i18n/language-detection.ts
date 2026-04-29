import { isRTL } from './rtl';

/**
 * Language detection utilities for automatic language selection
 */

export type LanguageInfo = {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
};

export const supportedLanguages: LanguageInfo[] = [
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', rtl: false },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', rtl: false },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', rtl: false },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', rtl: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', rtl: false },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', rtl: false },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', rtl: false },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', rtl: false },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', rtl: false },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', rtl: false },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', rtl: false },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', rtl: false },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', rtl: false },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', rtl: false },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', rtl: false },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', rtl: false },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', rtl: false },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', rtl: false },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', rtl: false },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', rtl: false },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', rtl: false },
];

const languageCodeMap: Record<string, string> = {
  // Browser codes to our codes
  'de': 'de', 'de-DE': 'de', 'de-AT': 'de', 'de-CH': 'de',
  'en': 'en', 'en-US': 'en', 'en-GB': 'en', 'en-AU': 'en', 'en-CA': 'en',
  'tr': 'tr', 'tr-TR': 'tr',
  'pl': 'pl', 'pl-PL': 'pl',
  'ru': 'ru', 'ru-RU': 'ru',
  'it': 'it', 'it-IT': 'it', 'it-CH': 'it',
  'es': 'es', 'es-ES': 'es', 'es-MX': 'es', 'es-AR': 'es',
  'fr': 'fr', 'fr-FR': 'fr', 'fr-CH': 'fr', 'fr-BE': 'fr', 'fr-CA': 'fr',
  'ar': 'ar', 'ar-SA': 'ar', 'ar-AE': 'ar', 'ar-EG': 'ar', 'ar-IQ': 'ar', 'ar-MA': 'ar',
  'fa': 'fa', 'fa-IR': 'fa', 'fa-AF': 'fa',
  'bg': 'bg', 'bg-BG': 'bg',
  'hr': 'hr', 'hr-HR': 'hr',
  'cs': 'cs', 'cs-CZ': 'cs',
  'da': 'da', 'da-DK': 'da',
  'nl': 'nl', 'nl-NL': 'nl', 'nl-BE': 'nl',
  'et': 'et', 'et-EE': 'et',
  'fi': 'fi', 'fi-FI': 'fi',
  'el': 'el', 'el-GR': 'el',
  'hu': 'hu', 'hu-HU': 'hu',
  'ga': 'ga', 'ga-IE': 'ga',
  'lv': 'lv', 'lv-LV': 'lv',
  'lt': 'lt', 'lt-LT': 'lt',
  'mt': 'mt', 'mt-MT': 'mt',
  'nb': 'no', 'nn': 'no', 'no': 'no', 'no-NO': 'no',
  'pt': 'pt', 'pt-PT': 'pt', 'pt-BR': 'pt',
  'ro': 'ro', 'ro-RO': 'ro',
  'sk': 'sk', 'sk-SK': 'sk',
  'sl': 'sl', 'sl-SI': 'sl',
  'sv': 'sv', 'sv-SE': 'sv', 'sv-FI': 'sv',
  'uk': 'uk', 'uk-UA': 'uk',
  'sr': 'sr', 'sr-RS': 'sr', 'sr-Latn': 'sr',
  'mk': 'mk', 'mk-MK': 'mk',
  'sq': 'sq', 'sq-AL': 'sq',
  'bs': 'bs', 'bs-BA': 'bs',
  'is': 'is', 'is-IS': 'is',
};

/**
 * Detect language from browser settings
 */
export function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'de';
  }

  // Get browser languages
  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const lang of browserLanguages) {
    const normalizedLang = languageCodeMap[lang.toLowerCase()];
    if (normalizedLang) {
      return normalizedLang;
    }
    
    // Try base language code (e.g., 'en' from 'en-US')
    const baseLang = lang.split('-')[0].toLowerCase();
    if (isSupportedLanguage(baseLang)) {
      return baseLang;
    }
  }

  return 'de'; // Default to German
}

/**
 * Check if language is supported
 */
export function isSupportedLanguage(code: string): boolean {
  return supportedLanguages.some(lang => lang.code === code.toLowerCase());
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: string): LanguageInfo | undefined {
  return supportedLanguages.find(lang => lang.code === code.toLowerCase());
}

/**
 * Get fallback language chain
 */
export function getFallbackChain(preferredLang: string): string[] {
  const chain: string[] = [];
  
  // Add preferred language
  if (isSupportedLanguage(preferredLang)) {
    chain.push(preferredLang);
  }
  
  // Add common fallbacks
  if (preferredLang !== 'de') chain.push('de');
  if (preferredLang !== 'en') chain.push('en');
  
  return chain;
}

/**
 * Storage key for language preference
 */
const STORAGE_KEY = 'pflegenavigator-language';

/**
 * Get stored language preference
 */
export function getStoredLanguage(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Store language preference
 */
export function storeLanguage(code: string): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, code);
}

/**
 * Full language detection with storage and fallback
 */
export function detectLanguage(): string {
  // 1. Check stored preference
  const stored = getStoredLanguage();
  if (stored && isSupportedLanguage(stored)) {
    return stored;
  }

  // 2. Detect from browser
  const browserLang = detectBrowserLanguage();
  if (isSupportedLanguage(browserLang)) {
    return browserLang;
  }

  // 3. Default to German
  return 'de';
}
