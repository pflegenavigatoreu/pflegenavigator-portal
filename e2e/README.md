# Playwright E2E Tests - PflegeNavigator Portal

Diese umfassende E2E-Test-Suite deckt alle kritischen Funktionen des PflegeNavigator-Portals ab.

## Installation

```bash
# Playwright installieren
npm install -D @playwright/test

# Browser binaries installieren
npx playwright install
```

## Test-Suiten

### 1. Pflegegrad-Rechner E2E
- **Kompletter Durchlauf** durch alle 6 Module
- **Progress-Bar** Validierung
- **Ampel-System** Prüfung
- **PDF-Export** Test
- **Navigation** Vor/Zurück
- **Fallcode** Laden

### 2. Brief-Generatoren
Alle 8 Brief-Typen:
- Antrag Pflegegrad
- Widerspruch Pflegegrad
- Betreuungsrecht
- Erbrecht
- Allgemeiner Brief
- Erwerbsminderungsrente
- Versorgungsamt
- Schwerbehindertenausweis

### 3. API Tests
- POST /api/briefe
- GET /api/briefe/pdf
- POST /api/cases
- Error-Handling (400, 404, 500)

### 4. Responsiveness
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1920x1080)

### 5. A11y Tests (Axe)
- WCAG 2.1 AA Prüfung
- Kontrast-Prüfung
- Screen-Reader Labels
- Tastatur-Navigation
- Alt-Texte

### 6. Performance
- Lighthouse Scores >90
- LCP <2.5s
- CLS <0.1
- Core Web Vitals

## Ausführung

```bash
# Alle Tests ausführen
npx playwright test

# Spezifische Test-Suite
npx playwright test --grep "Pflegegrad-Rechner"
npx playwright test --grep "Brief-Generatoren"
npx playwright test --grep "API Tests"

# Mit UI-Modus
npx playwright test --ui

# Headless mit Reporting
npx playwright test --reporter=html

# Nur Chrome Desktop
npx playwright test --project="Desktop Chrome"

# Debug-Modus
npx playwright test --debug
```

## Konfiguration

Die `playwright.config.ts` enthält:
- 3 Projekte: Desktop Chrome, Mobile Safari, Tablet
- Screenshots bei Fehlern
- Videos bei Retry
- HTML-Report

## Testdaten

Alle Tests verwenden konsistente Testdaten:
- Antragsteller: Maria Mustermann
- Empfänger: Pflegekasse Musterstadt

## Wartung

Bei UI-Änderungen:
1. Selektoren anpassen (suchen nach Text, Role, Placeholder)
2. Timeout-Werte prüfen
3. Neue Features ergänzen
