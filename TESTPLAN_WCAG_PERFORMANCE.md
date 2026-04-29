# TESTPLAN - WCAG 2.1 & Performance
**PflegeNavigator EU - Qualitätssicherung**
**Datum:** 27.04.2026

---

## 1. WCAG 2.1 AA Tests (Barrierefreiheit)

### Automatisierte Tests
**Tool:** axe-core (Playwright)

```typescript
// tests/wcag.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/pflegegrad/start',
  '/pflegegrad/modul1',
  '/pflegegrad/ergebnis',
  '/tagebuch',
  '/unterstuetzung',
  '/impressum',
  '/datenschutz',
];

for (const page of pages) {
  test(`WCAG check: ${page}`, async ({ page: p }) => {
    await p.goto(page);
    
    const accessibilityScanResults = await new AxeBuilder({ page: p })
      .include('[data-testid="main-content"]')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
}
```

### Manuelle Tests

#### Tastatur-Navigation
- [ ] Tab-Reihenfolge logisch (oben → unten, links → rechts)
- [ ] Alle interaktiven Elemente erreichbar
- [ ] Fokus-Indikatoren sichtbar (mindestens 2px Outline)
- [ ] Enter aktiviert Buttons
- [ ] Space aktiviert Checkboxen
- [ ] Esc schließt Dialoge
- [ ] Keine Tastaturfallen (Tab-Falle)

#### Screenreader (NVDA/VoiceOver)
- [ ] Überschriften-Hierarchie korrekt (h1 > h2 > h3)
- [ ] Alt-Texte für alle Bilder
- [ ] ARIA-Labels für Icons/Buttons
- [ ] Formular-Labels mit Feldern verbunden
- [ ] Live-Regions für dynamische Inhalte

#### Farbkontrast
**Tool:** WebAIM Contrast Checker
- [ ] Text zu Hintergrund: mind. 4.5:1
- [ ] Großer Text (18pt+): mind. 3:1
- [ ] UI-Elemente: mind. 3:1

**Kritische Kombinationen prüfen:**
```
#0f2744 (Blau) auf Weiß: 12.5:1 ✅
#20b2aa (Türkis) auf Weiß: 2.9:1 ⚠️ (Nur für großen Text)
Grün (Ampel) auf Weiß: Prüfen
Rot (Ampel) auf Weiß: Prüfen
```

#### Zoom-Test
- [ ] 200% Zoom: Layout nicht gebrochen
- [ ] 400% Zoom: Alle Inhalte erreichbar
- [ ] Kein horizontaler Scroll bei 1280px + 400% Zoom

---

## 2. Performance Tests

### Lighthouse CI

```json
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
      },
    },
  },
};
```

### Core Web Vitals Ziele

| Metrik | Ziel | Gut |
|--------|------|-----|
| LCP (Largest Contentful Paint) | < 2.5s | < 1.8s |
| FID (First Input Delay) | < 100ms | < 50ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 |
| TTFB (Time to First Byte) | < 600ms | < 200ms |
| FCP (First Contentful Paint) | < 1.8s | < 1.0s |
| TTI (Time to Interactive) | < 3.8s | < 2.5s |

### Performance-Optimierungen implementiert

#### Bilder
- [ ] WebP Format
- [ ] Lazy Loading (außer Hero)
- [ ] Responsive Images (srcset)
- [ ] Alt-Texte

#### JavaScript
- [ ] Code-Splitting (dynamic imports)
- [ ] Tree Shaking
- [ ] Minification
- [ ] Defer/Async für non-critical

#### CSS
- [ ] Critical CSS inline
- [ ] Rest async laden
- [ ] Unused CSS entfernen (PurgeCSS)

#### Netzwerk
- [ ] Gzip/Brotli Kompression
- [ ] HTTP/2 oder HTTP/3
- [ ] CDN für statische Assets
- [ ] Caching-Header

---

## 3. Mobile Tests

### Geräte-Test-Matrix

| Gerät | OS | Browser | Priorität |
|-------|----|---------|-----------|
| iPhone 14 | iOS 17 | Safari | Hoch |
| iPhone SE | iOS 16 | Safari | Hoch |
| Samsung S23 | Android 14 | Chrome | Hoch |
| Pixel 7 | Android 14 | Chrome | Mittel |
| iPad Pro | iPadOS | Safari | Mittel |

### Touch-Tests
- [ ] Touch-Targets mind. 44x44px
- [ ] Keine "Fat Finger" Probleme
- [ ] Swipe-Gesten funktionieren (falls implementiert)
- [ ] Zoom funktioniert (pinch)
- [ ] Kein unerwartetes Zoom beim Fokus

### Responsive Breakpoints

```css
/* Mobile First */
/* Base: Mobile */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

---

## 4. Browser-Kompatibilität

### Browser-Matrix

| Browser | Version | Priorität |
|---------|---------|-----------|
| Chrome | Letzte 2 | Kritisch |
| Firefox | Letzte 2 | Kritisch |
| Safari | Letzte 2 | Kritisch |
| Edge | Letzte 2 | Kritisch |
| Chrome Mobile | Letzte 2 | Kritisch |
| Safari iOS | Letzte 2 | Kritisch |
| Samsung Internet | Letzte 2 | Mittel |

### Polyfills & Fallbacks

```typescript
// Für ältere Browser
// Intersection Observer
// Resize Observer
// Fetch API
// Promises
```

---

## 5. Sicherheitstests

### OWASP Top 10

- [ ] **Injection** - SQL/NoSQL Injection Tests
- [ ] **Broken Authentication** - Session-Management
- [ ] **Sensitive Data Exposure** - HTTPS, Verschlüsselung
- [ ] **XML External Entities** - XML-Parser (nicht genutzt)
- [ ] **Broken Access Control** - RLS Policies getestet
- [ ] **Security Misconfiguration** - Headers prüfen
- [ ] **XSS** - Input-Sanitization
- [ ] **Insecure Deserialization** - JSON parsing (sicher)
- [ ] **Known Vulnerabilities** - npm audit
- [ ] **Insufficient Logging** - Umami Analytics

### Headers-Check

```bash
curl -I https://beta.pflegenavigatoreu.com

# Sollte enthalten:
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
```

---

## 6. Test-Skript

```bash
#!/bin/bash
# test-all.sh

echo "🧪 Starte alle Tests..."

# 1. TypeScript
echo "📋 TypeScript Check..."
npx tsc --noEmit

# 2. ESLint
echo "🔍 ESLint..."
npx eslint src/

# 3. Unit Tests
echo "🧪 Unit Tests..."
npm test

# 4. E2E Tests
echo "🎭 Playwright Tests..."
npx playwright test

# 5. Lighthouse CI
echo "💡 Lighthouse..."
npx lhci autorun

# 6. Build
echo "🔨 Build..."
npm run build

echo "✅ Alle Tests durch!"
```

---

## 7. Manuelle Test-Checkliste

### Funktionale Tests
- [ ] Startseite lädt < 3 Sekunden
- [ ] Pflegegrad-Rechner komplett durchführbar
- [ ] QR-Code wird generiert und ist scanbar
- [ ] Magic-Link funktioniert
- [ ] PDF wird erstellt und ist lesbar
- [ ] AvatarChat antwortet auf "Hilfe"
- [ ] Voice-Input erkennt "Weiter"
- [ ] Widerspruch-Brief wird generiert
- [ ] Alle 35 Sprachen wählbar
- [ ] RTL-Sprachen (Arabisch) korrekt dargestellt

### Inhaltliche Tests
- [ ] Alle 2026-Beträge korrekt (PG2:347€, PG3:599€...)
- [ ] Fristen korrekt angezeigt
- [ ] Impressum erreichbar und vollständig
- [ ] Datenschutz erreichbar und verständlich
- [ ] Einfache Sprache überall (6. Klasse)
- [ ] Keine Rechtsberatung-Disclaimer sichtbar
- [ ] Alle Abkürzungen erklärt (MD, GdB, etc.)

---

## 8. Test-Tools

| Kategorie | Tool | Zweck |
|-----------|------|-------|
| E2E | Playwright | Browser-Automatisierung |
| Unit | Vitest/Jest | Komponenten-Tests |
| WCAG | axe-core | Barrierefreiheit |
| Performance | Lighthouse | Core Web Vitals |
| Performance | WebPageTest | Multi-Region Tests |
| Security | npm audit | Dependencies |
| Security | Snyk | Vulnerability Scan |
| Mobile | BrowserStack | Echte Geräte |
| Visual | Percy/Chromatic | UI-Regression |

---

**NACH ALLEN TESTS:**
🎉 Portal ist bereit für Live-Gang!
