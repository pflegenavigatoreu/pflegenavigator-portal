import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher für alle Seiten außer statische Dateien und API-Routen
  matcher: [
    // Alle Root-Pfade
    '/',
    // Sprach-spezifische Pfade
    '/(de|en|fr|es|it|pt|nl|pl|ro|el|hu|cs|sv|bg|da|fi|sk|lt|sl|lv|et|mt|ga|hr|tr|uk|sr|mk|sq|bs|me)/:path*',
    // Optional: Root mit Sprach-Parameter
    '/:locale((de|en|fr|es|it|pt|nl|pl|ro|el|hu|cs|sv|bg|da|fi|sk|lt|sl|lv|et|mt|ga|hr|tr|uk|sr|mk|sq|bs|me))/:path*',
  ],
};
