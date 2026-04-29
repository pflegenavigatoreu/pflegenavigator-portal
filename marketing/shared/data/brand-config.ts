// Branding-Konfiguration für alle Marketing-Materialien
export const BRAND = {
  name: 'PflegePro',
  tagline: 'Mehr Wertschätzung für Pflegekräfte',
  colors: {
    primary: '#0066CC',
    secondary: '#00AA66',
    accent: '#FF6B35',
    background: '#F5F7FA',
    text: '#1A1A2E',
    textLight: '#4A5568',
    white: '#FFFFFF',
    warning: '#FFB800',
    success: '#00AA66',
    error: '#E53E3E',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  urls: {
    website: 'https://pflegepro.de',
    app: 'https://app.pflegepro.de',
    support: 'https://hilfe.pflegepro.de',
    imprint: 'https://pflegepro.de/impressum',
    privacy: 'https://pflegepro.de/datenschutz',
  },
  contact: {
    email: 'kontakt@pflegepro.de',
    pressEmail: 'presse@pflegepro.de',
    phone: '+49 800 1234567',
    address: 'Musterstraße 123, 10115 Berlin',
  },
  social: {
    instagram: '@pflegepro',
    linkedin: 'pflegepro',
    tiktok: '@pflegepro',
    twitter: '@pflegepro',
  },
  logo: {
    primary: '/assets/logo-primary.svg',
    white: '/assets/logo-white.svg',
    icon: '/assets/logo-icon.svg',
    favicon: '/assets/favicon.ico',
  },
} as const;

export type BrandConfig = typeof BRAND;
