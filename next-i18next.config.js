/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: [
      'de', 'en', 'tr', 'pl', 'ru', 'it', 'es', 'fr', 'ar', 'fa',
      'bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'el', 'hu', 'ga',
      'lv', 'lt', 'mt', 'no', 'pt', 'ro', 'sk', 'sl', 'sv', 'uk',
      'sr', 'mk', 'sq', 'bs', 'is'
    ],
  },
  localePath: './public/locales',
  defaultNS: 'common',
  ns: ['common', 'navigation', 'pflegegrad', 'buttons', 'errors', 'results'],
  localeStructure: '{{lng}}/{{ns}}',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  react: {
    useSuspense: false,
  },
};
