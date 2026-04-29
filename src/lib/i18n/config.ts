import { LocalePrefix } from 'next-intl/routing';

// Alle 35 unterstützten Sprachen
export const locales = [
  // EU-Hauptsprachen
  'de', 'en', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ro', 'el', 'hu', 'cs', 'sv', 'bg', 'da', 'fi', 'sk', 'lt', 'sl', 'lv', 'et', 'mt', 'ga', 'hr',
  // Weitere europäische Sprachen
  'tr', 'uk', 'sr', 'mk', 'sq', 'bs', 'me'
] as const;

export type Locale = (typeof locales)[number];

// Standardsprache
export const defaultLocale: Locale = 'de';

// Locale-Prefix Konfiguration für next-intl v3
export const localePrefix: LocalePrefix<typeof locales> = 'always';

// Sprachen-Display-Namen
export const localeLabels: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ro: 'Română',
  el: 'Ελληνικά',
  hu: 'Magyar',
  cs: 'Čeština',
  sv: 'Svenska',
  bg: 'Български',
  da: 'Dansk',
  fi: 'Suomi',
  sk: 'Slovenčina',
  lt: 'Lietuvių',
  sl: 'Slovenščina',
  lv: 'Latviešu',
  et: 'Eesti',
  mt: 'Malti',
  ga: 'Gaeilge',
  hr: 'Hrvatski',
  tr: 'Türkçe',
  uk: 'Українська',
  sr: 'Српски',
  mk: 'Македонски',
  sq: 'Shqip',
  bs: 'Bosanski',
  me: 'Crnogorski',
};

// Länder-Codes für Flaggen (ISO 3166-1 alpha-2)
export const localeFlags: Record<Locale, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  it: '🇮🇹',
  pt: '🇵🇹',
  nl: '🇳🇱',
  pl: '🇵🇱',
  ro: '🇷🇴',
  el: '🇬🇷',
  hu: '🇭🇺',
  cs: '🇨🇿',
  sv: '🇸🇪',
  bg: '🇧🇬',
  da: '🇩🇰',
  fi: '🇫🇮',
  sk: '🇸🇰',
  lt: '🇱🇹',
  sl: '🇸🇮',
  lv: '🇱🇻',
  et: '🇪🇪',
  mt: '🇲🇹',
  ga: '🇮🇪',
  hr: '🇭🇷',
  tr: '🇹🇷',
  uk: '🇺🇦',
  sr: '🇷🇸',
  mk: '🇲🇰',
  sq: '🇦🇱',
  bs: '🇧🇦',
  me: '🇲🇪',
};

// RTL-Sprachen
export const rtlLocales: Locale[] = [];

// Cookie-Einstellungen
export const cookieName = 'pflegenavigator-locale';
export const cookieMaxAge = 365 * 24 * 60 * 60; // 1 Jahr

// Hilfsfunktionen
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleDisplayName(locale: Locale): string {
  return localeLabels[locale];
}

export function getLocaleFlag(locale: Locale): string {
  return localeFlags[locale];
}

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
