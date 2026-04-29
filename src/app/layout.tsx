import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UmamiAnalytics } from "@/components/Analytics";
import I18nProvider from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PflegeNavigator EU - Pflegegrad einfach berechnen",
  description: "15 Minuten. Von zu Hause. Kostenlos. Ihre Pflegegrad-Einschätzung mit sofortigem Ergebnis. In 35 Sprachen verfügbar.",
  keywords: ["Pflegegrad", "Pflege", "SGB XI", "MDK", "Pflegegeld", "Einschätzung", "mehrsprachig", "PflegeNavigator"],
  authors: [{ name: "PflegeNavigator EU gUG" }],
  robots: "index, follow",
  openGraph: {
    title: "PflegeNavigator EU",
    description: "Pflegegrad in 15 Minuten - kostenlos von zu Hause",
    type: "website",
    locale: "de_DE",
  },
  alternates: {
    languages: {
      'de': '/de',
      'en': '/en',
      'tr': '/tr',
      'pl': '/pl',
      'ru': '/ru',
      'ar': '/ar',
      'fa': '/fa',
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2744",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <UmamiAnalytics />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8f9fa]">
        <I18nProvider>
          {/* Skip Link für Barrierefreiheit */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-[#0f2744] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
          >
            Zum Inhalt springen
          </a>
          
          {/* Header mit Navigation */}
          <header className="bg-[#0f2744] text-white py-4 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-3">
                <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <svg width="32" height="32" viewBox="0 0 100 100" className="flex-shrink-0">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3"/>
                    <circle cx="50" cy="50" r="38" fill="#0f2744"/>
                    <circle cx="50" cy="12" r="4" fill="#20b2aa"/>
                    <text x="50" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">N</text>
                    <g transform="translate(50, 50) rotate(-45)">
                      <polygon points="0,-28 -5,0 5,0" fill="#20b2aa"/>
                      <polygon points="0,28 -5,0 5,0" fill="white"/>
                      <circle cx="0" cy="0" r="4" fill="#0f2744" stroke="white" strokeWidth="1.5"/>
                    </g>
                  </svg>
                  <h1 className="text-xl font-bold">PflegeNavigator EU</h1>
                </a>
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline text-sm text-gray-300">15 Min. • Kostenlos • 35 Sprachen</span>
                  <LanguageSwitcher />
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex flex-wrap items-center gap-1 text-sm border-t border-white/10 pt-3">
                <a href="/" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Start</a>
                <a href="/pflegegrad/start" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors bg-white/10">Pflegegrad</a>
                <a href="/unterstuetzung" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Unterstützung</a>
                <a href="/tagebuch" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Tagebuch</a>
                <a href="/hilfe" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Hilfe</a>
                <a href="/notfall" className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                  Notfall
                </a>
                <a href="/presse" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto">Presse</a>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>

          {/* Footer mit Haftungsausschluss */}
          <footer className="bg-[#0f2744] text-white py-6 px-4 mt-auto">
            <div className="max-w-6xl mx-auto text-center text-sm">
              <p className="mb-2">
                PflegeNavigator EU gUG bietet keine Rechtsberatung, keine medizinische Beratung 
                und keine verbindliche Auskunft über Leistungsansprüche.
              </p>
              <p className="text-gray-400">
                © 2026 PflegeNavigator EU gUG • Alle Angaben sind Orientierungshilfen.
              </p>
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
