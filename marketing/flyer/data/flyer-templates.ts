// Flyer-Templates für verschiedene Themen und Formate
import { BRAND } from '../../shared/data/brand-config';

export type FlyerFormat = 'A4' | 'A5' | 'DL' | 'A6';
export type FlyerTheme = 'pflegegrad' | 'widerspruch' | 'dipa' | 'allgemein' | 'app-download';

export interface FlyerTemplate {
  id: string;
  name: string;
  format: FlyerFormat;
  theme: FlyerTheme;
  orientation: 'portrait' | 'landscape';
  pages: number;
  description: string;
}

export interface FlyerContent {
  headline: string;
  subheadline: string;
  mainContent: string[];
  bulletPoints: string[];
  callToAction: string;
  ctaUrl: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  qrCodeUrl: string;
  disclaimer: string;
}

// Format-Dimensionen in mm
export const FLYER_DIMENSIONS: Record<FlyerFormat, { width: number; height: number; name: string }> = {
  A4: { width: 210, height: 297, name: 'A4 (210×297mm)' },
  A5: { width: 148, height: 210, name: 'A5 (148×210mm)' },
  DL: { width: 210, height: 99, name: 'DL (210×99mm)' },
  A6: { width: 105, height: 148, name: 'A6 (105×148mm)' },
};

// Flyer-Inhalte für verschiedene Themen
export const FLYER_CONTENTS: Record<FlyerTheme, FlyerContent> = {
  pflegegrad: {
    headline: 'Pflegegrad beantragen – Wir helfen Ihnen!',
    subheadline: 'Sichern Sie sich Ihre Pflegeleistungen',
    mainContent: [
      'Der Pflegegrad ist die Grundlage für alle Pflegeleistungen. Er bestimmt, welche Unterstützung Ihnen zusteht.',
      'Viele Pflegebedürftige wissen nicht, dass sie Anspruch auf finanzielle Unterstützung haben.',
    ],
    bulletPoints: [
      'Kostenlose Beratung vor Ort',
      'Hilfe beim Ausfüllen der Anträge',
      'Begleitung zum Medizinischen Dienst',
      'Widerspruch bei Ablehnung einlegen',
      'Keine versteckten Kosten',
    ],
    callToAction: 'Jetzt kostenlosen Beratungstermin vereinbaren',
    ctaUrl: `${BRAND.urls.website}/termin-buchen`,
    contactInfo: BRAND.contact,
    qrCodeUrl: `${BRAND.urls.app}/pflegegrad`,
    disclaimer: 'Dieser Flyer dient nur der Information und stellt keine Rechtsberatung dar.',
  },
  widerspruch: {
    headline: 'Widerspruch einlegen – Ihre Rechte durchsetzen!',
    subheadline: 'Ablehnung der Pflegeversicherung? Wir kämpfen für Sie!',
    mainContent: [
      'Ein Widerspruch kann sich lohnen! Viele Ablehnungen werden nach Widerspruch revidiert.',
      'Sie haben 4 Wochen Zeit, nachdem Sie den Bescheid erhalten haben.',
    ],
    bulletPoints: [
      'Widerspruch innerhalb von 4 Wochen einlegen',
      'Kostenlose Rechtsberatung',
      'Erfolgsquote bei über 60%',
      'Unterstützung durch Experten',
      'Keine Kosten, kein Risiko',
    ],
    callToAction: 'Jetzt Widerspruch vorbereiten',
    ctaUrl: `${BRAND.urls.website}/widerspruch`,
    contactInfo: BRAND.contact,
    qrCodeUrl: `${BRAND.urls.app}/widerspruch`,
    disclaimer: 'Widerspruchsfrist: 4 Wochen ab Erhalt des Bescheids. Keine Rechtsberatung im engeren Sinne.',
  },
  dipa: {
    headline: 'DiPA – Digitaler Pflegeantrag',
    subheadline: 'Pflegeantrag digital und unkompliziert',
    mainContent: [
      'Mit DiPA können Sie Ihren Pflegeantrag ganz bequem von zu Hause aus online stellen.',
      'Schneller, einfacher, papierlos – das ist die Zukunft der Pflegeanträge.',
    ],
    bulletPoints: [
      '24/7 online verfügbar',
      'Keine Wartezeiten',
      'Sichere Übermittlung',
      'Live-Status-Tracking',
      'Kostenlos und unverbindlich',
    ],
    callToAction: 'Jetzt DiPA ausprobieren',
    ctaUrl: `${BRAND.urls.app}/dipa`,
    contactInfo: BRAND.contact,
    qrCodeUrl: `${BRAND.urls.app}/dipa`,
    disclaimer: 'DiPA ist ein Angebot der Pflegekassen. Unterstützung durch PflegePro ist kostenlos.',
  },
  allgemein: {
    headline: 'PflegePro – Ihr Partner in der Pflege',
    subheadline: 'Wertschätzung für Pflegekräfte und Angehörige',
    mainContent: [
      'Wir unterstützen Pflegebedürftige, Angehörige und Pflegekräfte bei allen Fragen rund um die Pflege.',
      'Von der Pflegegrad-Bewertung bis zum Widerspruch – wir sind für Sie da.',
    ],
    bulletPoints: [
      'Kostenlose Beratung',
      'Digitale Tools',
      'Persönliche Betreuung',
      'Erfahrene Fachkräfte',
      'Schnelle Hilfe',
    ],
    callToAction: 'Mehr erfahren',
    ctaUrl: BRAND.urls.website,
    contactInfo: BRAND.contact,
    qrCodeUrl: BRAND.urls.app,
    disclaimer: 'PflegePro ist ein unabhängiger Serviceanbieter.',
  },
  'app-download': {
    headline: 'PflegePro App – Pflege leicht gemacht',
    subheadline: 'Alle Pflege-Themen in einer App',
    mainContent: [
      'Laden Sie jetzt die PflegePro App herunter und haben Sie alle wichtigen Informationen immer dabei.',
      'Checklisten, Erinnerungen, Fristen-Tracker und mehr.',
    ],
    bulletPoints: [
      'Fristen-Tracker',
      'Checklisten',
      'Erinnerungen',
      'Kontakte speichern',
      'Offline verfügbar',
    ],
    callToAction: 'App jetzt downloaden',
    ctaUrl: BRAND.urls.app,
    contactInfo: BRAND.contact,
    qrCodeUrl: BRAND.urls.app,
    disclaimer: 'Kostenlos im App Store und Google Play.',
  },
};

// Vorgefertigte Templates
export const FLYER_TEMPLATES: FlyerTemplate[] = [
  { id: 'a4-pflegegrad', name: 'Pflegegrad A4', format: 'A4', theme: 'pflegegrad', orientation: 'portrait', pages: 2, description: 'Detaillierte Information zum Pflegegrad-Antrag' },
  { id: 'a5-pflegegrad', name: 'Pflegegrad A5', format: 'A5', theme: 'pflegegrad', orientation: 'portrait', pages: 2, description: 'Kompakte Info zum Pflegegrad' },
  { id: 'dl-widerspruch', name: 'Widerspruch DL', format: 'DL', theme: 'widerspruch', orientation: 'landscape', pages: 2, description: 'Handzettel zum Widerspruch' },
  { id: 'a5-widerspruch', name: 'Widerspruch A5', format: 'A5', theme: 'widerspruch', orientation: 'portrait', pages: 2, description: 'Ausführlicher Widerspruchs-Flyer' },
  { id: 'dl-dipa', name: 'DiPA DL', format: 'DL', theme: 'dipa', orientation: 'landscape', pages: 2, description: 'Schnell-Info zu DiPA' },
  { id: 'a4-allgemein', name: 'PflegePro Überblick A4', format: 'A4', theme: 'allgemein', orientation: 'portrait', pages: 2, description: 'Überblick über alle Leistungen' },
  { id: 'a6-app', name: 'App-Download A6', format: 'A6', theme: 'app-download', orientation: 'portrait', pages: 2, description: 'Karte zum App-Download' },
];

// Druck-Spezifikationen
export const PRINT_SPECS = {
  bleed: 3, // Beschnittzugabe in mm
  margin: 10, // Sicherheitsabstand in mm
  resolution: 300, // DPI
  colorMode: 'CMYK',
  fileFormat: ['PDF/X-4', 'PDF/X-1a'],
} as const;
