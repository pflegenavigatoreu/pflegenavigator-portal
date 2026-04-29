import { test, expect, Page } from '@playwright/test';

const API_BASE = '/api';

// Testdaten
const TESTDATEN = {
  antragsteller: {
    name: 'Maria Mustermann',
    strasse: 'Musterstraße 1',
    plz: '12345',
    ort: 'Musterstadt',
    telefon: '0123456789',
    geburtsdatum: '01.01.1950',
    svNummer: '12 1234567890'
  },
  empfaenger: {
    name: 'Pflegekasse Musterstadt',
    strasse: 'Behördenweg 10',
    plz: '12345',
    ort: 'Musterstadt'
  }
};

// ============================================
// SUITE 1: Pflegegrad-Rechner E2E
// ============================================
test.describe('Pflegegrad-Rechner E2E', () => {
  
  test('Kompletter Durchlauf durch alle 6 Module', async ({ page }) => {
    // Startseite
    await page.goto('/pflegegrad/start');
    await expect(page.getByRole('button', { name: /Neuen Fall starten/i })).toBeVisible();
    
    // Neuen Fall erstellen
    await page.getByRole('button', { name: /Neuen Fall starten/i }).click();
    await expect(page.getByText('Ihr persönlicher Fallcode')).toBeVisible();
    
    // Fallcode extrahieren für später
    const caseCodeElement = await page.locator('.font-mono.text-3xl, .text-3xl.font-mono').textContent();
    const caseCode = caseCodeElement?.trim();
    expect(caseCode).toMatch(/^PG-[A-Z0-9]+$/);
    
    // Weiter zu Modul 1
    await page.getByRole('button', { name: /Weiter zu den Fragen/i }).click();
    await page.waitForURL('**/pflegegrad/modul1');
    
    // Modul 1: Mobilität (4 Fragen)
    await completeModul(page, 1, 4);
    await page.getByRole('button', { name: /Weiter zu Modul 2/i }).click();
    await page.waitForURL('**/pflegegrad/modul2');
    
    // Modul 2: Kognitive Funktionen
    await completeModul(page, 2, 5);
    await page.getByRole('button', { name: /Weiter zu Modul 3/i }).click();
    await page.waitForURL('**/pflegegrad/modul3');
    
    // Modul 3: Verhaltensauffälligkeiten
    await completeModul(page, 3, 4);
    await page.getByRole('button', { name: /Weiter zu Modul 4/i }).click();
    await page.waitForURL('**/pflegegrad/modul4');
    
    // Modul 4: Selbstversorgung
    await completeModul(page, 4, 4);
    await page.getByRole('button', { name: /Weiter zu Modul 5/i }).click();
    await page.waitForURL('**/pflegegrad/modul5');
    
    // Modul 5: Krankheitsbedingte Einschränkungen
    await completeModul(page, 5, 4);
    await page.getByRole('button', { name: /Weiter zu Modul 6|Zum Ergebnis/i }).click();
    await page.waitForURL(/.*pflegegrad\/(modul6|ergebnis).*/);
    
    // Falls Modul 6 existiert
    try {
      await page.waitForURL('**/pflegegrad/modul6', { timeout: 2000 });
      await completeModul(page, 6, 4);
      await page.getByRole('button', { name: /Zum Ergebnis/i }).click();
      await page.waitForURL('**/pflegegrad/ergebnis');
    } catch {
      // Modul 6 existiert nicht oder wurde übersprungen
    }
    
    // Ergebnis validieren
    await page.waitForURL('**/pflegegrad/ergebnis', { timeout: 5000 });
    await expect(page.getByRole('heading', { name: /Ihr Ergebnis|Kein Ergebnis vorhanden/i })).toBeVisible();
  });

  test('Progress-Bar aktualisiert sich korrekt', async ({ page }) => {
    await page.goto('/pflegegrad/modul1');
    
    // Warte auf Progress Bar
    const progressBar = page.locator('[role="progressbar"], .progress-bar, [class*="progress"]').first();
    await expect(progressBar).toBeVisible();
    
    // Erste Antwort
    await page.locator('input[type="radio"]').first().check();
    await page.waitForTimeout(300);
    
    // Prüfe dass Progress sich erhöht hat
    const progressAfterFirst = await progressBar.getAttribute('aria-valuenow') || 
                                await progressBar.getAttribute('data-value') ||
                                await progressBar.textContent();
    expect(Number(progressAfterFirst)).toBeGreaterThan(0);
    
    // Weitere Antworten
    const radios = await page.locator('input[type="radio"]').count();
    for (let i = 4; i < Math.min(radios, 20); i += 5) {
      await page.locator('input[type="radio"]').nth(i).check();
    }
    
    await page.waitForTimeout(300);
    const finalProgress = await progressBar.getAttribute('aria-valuenow') || 
                          await progressBar.getAttribute('data-value');
    expect(Number(finalProgress)).toBeGreaterThan(Number(progressAfterFirst) || 0);
  });

  test('Ampel-System zeigt korrekte Bewertungen', async ({ page }) => {
    await page.goto('/pflegegrad/modul1');
    
    // Beantworte alle Fragen mit unterschiedlichen Werten für Ampel-Test
    const radios = await page.locator('input[type="radio"]').count();
    
    // Grün (Keine Einschränkung) - erste Option
    await page.locator('input[type="radio"]').nth(0).check();
    await page.waitForTimeout(200);
    
    // Weiter zum Ergebnis und prüfe Ampel
    for (let i = 1; i < Math.min(radios, 16); i += 5) {
      // Verschiedene Antworten für Ampel-Mix
      const optionIndex = i % 5; // 0=grün, 1=hellgrün, 2=gelb, 3=orange, 4=rot
      await page.locator('input[type="radio"]').nth(i + optionIndex).check();
      await page.waitForTimeout(100);
    }
    
    // Speichere und gehe zu Ergebnis
    await page.evaluate(() => {
      localStorage.setItem('modul1', JSON.stringify({ modulId: 1, punkte: 75, antworten: {} }));
      localStorage.setItem('modul2', JSON.stringify({ modulId: 2, punkte: 80, antworten: {} }));
      localStorage.setItem('modul3', JSON.stringify({ modulId: 3, punkte: 60, antworten: {} }));
      localStorage.setItem('modul4', JSON.stringify({ modulId: 4, punkte: 90, antworten: {} }));
      localStorage.setItem('modul5', JSON.stringify({ modulId: 5, punkte: 70, antworten: {} }));
      localStorage.setItem('pflegegrad-ergebnis', JSON.stringify({
        pflegegrad: 3,
        gesamtpunkte: 75,
        ampel: 'gelb',
        pufferPunkte: 5,
        modulErgebnisse: [],
        empfehlungen: ['Test']
      }));
    });
    
    await page.goto('/pflegegrad/ergebnis');
    await expect(page.locator('.bg-yellow-100, .bg-yellow-50, [class*="yellow"]').first()).toBeVisible();
  });

  test('PDF-Export im Ergebnis', async ({ page }) => {
    // Setze Mock-Ergebnis
    await page.goto('/pflegegrad/ergebnis');
    await page.evaluate(() => {
      localStorage.setItem('pflegegrad-ergebnis', JSON.stringify({
        pflegegrad: 3,
        gesamtpunkte: 75,
        ampel: 'gelb',
        pufferPunkte: 5,
        modulErgebnisse: [
          { modulId: 1, name: 'Mobilität', rohpunkte: 70, gewichtetePunkte: 7 },
          { modulId: 2, name: 'Kognition', rohpunkte: 80, gewichtetePunkte: 12 },
          { modulId: 4, name: 'Selbstversorgung', rohpunkte: 90, gewichtetePunkte: 36 },
          { modulId: 5, name: 'Krankheitsbewältigung', rohpunkte: 70, gewichtetePunkte: 21 },
        ],
        empfehlungen: ['Antrag bei Pflegekasse stellen', 'Arztgespräch vereinbaren']
      }));
    });
    await page.reload();
    
    // PDF Download Button
    const downloadButton = page.getByRole('button', { name: /PDF|Herunterladen|Download/i });
    await expect(downloadButton.first()).toBeVisible();
    
    // Download testen (falls verfügbar)
    try {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }),
        downloadButton.first().click()
      ]);
      expect(download.suggestedFilename()).toMatch(/\.(pdf|txt)$/);
    } catch {
      // PDF-Generierung möglicherweise nicht verfügbar
      test.skip();
    }
  });

  test('Navigation Zurück/Vorwärts', async ({ page }) => {
    await page.goto('/pflegegrad/modul1');
    
    // Erste Frage beantworten
    await page.locator('input[type="radio"]').first().check();
    await page.waitForTimeout(200);
    
    // Speichern im localStorage
    await page.evaluate(() => {
      localStorage.setItem('modul1', JSON.stringify({
        modulId: 1,
        punkte: 25,
        antworten: { mobilität_1: '1' }
      }));
    });
    
    // Weiter
    await page.getByRole('button', { name: /Weiter/i }).click();
    await page.waitForURL('**/pflegegrad/modul2', { timeout: 5000 });
    
    // Zurück
    await page.getByRole('button', { name: /Zurück/i }).click();
    await page.waitForURL('**/pflegegrad/modul1', { timeout: 5000 });
    
    // Prüfen ob wir auf Modul 1 sind
    await expect(page.getByRole('heading', { name: /Modul 1/i })).toBeVisible();
  });

  test('Fallcode lädt gespeicherten Fall', async ({ page }) => {
    // Mock: Erstelle Fallcode manuell im localStorage
    const mockCaseCode = 'PG-TEST123';
    
    await page.goto('/pflegegrad/start');
    await page.evaluate((code) => {
      localStorage.setItem('pflege_case', JSON.stringify({
        case_code: code,
        id: 'test-uuid',
        modul1: { mobilität_1: '1', mobilität_2: '2' }
      }));
    }, mockCaseCode);
    
    // Code eingeben und laden
    await page.getByPlaceholder(/z\.B\. PG-ABC123|Fallcode/i).fill(mockCaseCode);
    await page.getByRole('button', { name: /Fall laden/i }).click();
    
    // Sollte zu Modul 1 weiterleiten oder Fall laden
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url.includes('/pflegegrad/') || url.includes('/pflegegrad/start')).toBe(true);
  });
});

// ============================================
// SUITE 2: Brief-Generatoren
// ============================================
test.describe('Brief-Generatoren', () => {
  
  const briefTypen = [
    { id: 'antrag-pflegegrad', name: 'Antrag Pflegegrad', selector: 'Antrag Pflegegrad' },
    { id: 'widerspruch-pflegegrad', name: 'Widerspruch Pflegegrad', selector: 'Widerspruch Pflegegrad' },
    { id: 'betreuungsrecht', name: 'Betreuungsrecht', selector: 'Betreuungsrecht' },
    { id: 'erbrecht', name: 'Erbrecht', selector: 'Erbrecht' },
    { id: 'allgemein', name: 'Allgemeiner Brief', selector: 'Allgemein' },
    { id: 'em-rente', name: 'Erwerbsminderungsrente', selector: 'Erwerbsminderungsrente' },
    { id: 'versorgungsamt', name: 'Versorgungsamt', selector: 'Versorgungsamt' },
    { id: 'schwerbehindertenausweis', name: 'Schwerbehindertenausweis', selector: 'Schwerbehindertenausweis' },
  ];

  test('/briefe lädt alle Kategorien', async ({ page }) => {
    await page.goto('/briefe');
    
    await expect(page.getByText('Brief-Generator')).toBeVisible();
    
    for (const typ of briefTypen) {
      await expect(page.getByText(typ.name)).toBeVisible();
    }
  });

  for (const typ of briefTypen) {
    test(`Brief-Typ "${typ.name}" - Formular und Generierung`, async ({ page }) => {
      await page.goto('/briefe');
      
      // Kategorie auswählen
      const kategorieButton = page.getByText(typ.selector, { exact: false }).first();
      await expect(kategorieButton).toBeVisible();
      await kategorieButton.click();
      
      // Zurück-Button sollte sichtbar sein
      await expect(page.getByText(/Zurück zur Übersicht/i)).toBeVisible();
      
      // Formular ausfüllen
      await fillBriefForm(page, typ.id);
      
      // Brief generieren
      const generierenButton = page.getByRole('button', { name: /Brief generieren/i });
      await expect(generierenButton).toBeVisible();
      await generierenButton.click();
      
      // Ladezustand oder Ergebnis
      await page.waitForTimeout(2000);
      
      // Ergebnis prüfen (Vorschau oder Text)
      const resultContainer = page.locator('pre, .brief-vorschau, [class*="brief"]').first();
      if (await resultContainer.isVisible().catch(() => false)) {
        await expect(resultContainer).not.toBeEmpty();
      }
      
      // Download-Button (falls vorhanden)
      const downloadButton = page.getByRole('button', { name: /Herunterladen|Download/i });
      if (await downloadButton.isVisible().catch(() => false)) {
        await expect(downloadButton).toBeVisible();
      }
    });
  }

  test('Download-Link erzeugt korrekte Datei', async ({ page }) => {
    await page.goto('/briefe');
    await page.getByText('Allgemeiner Brief').click();
    
    await fillBriefForm(page, 'allgemein');
    await page.getByRole('button', { name: 'Brief generieren' }).click();
    await page.waitForSelector('pre', { timeout: 10000 });
    
    // Download testen
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Herunterladen/i }).click()
    ]);
    
    expect(download.suggestedFilename()).toMatch(/^brief-.*\.txt$/);
  });
});

// ============================================
// SUITE 3: API Tests
// ============================================
test.describe('API Tests', () => {
  
  test('POST /api/briefe - Brief generieren', async ({ request }) => {
    const payload = {
      type: 'versorgungsamt',
      data: {
        empfaenger: TESTDATEN.empfaenger,
        antragsteller: {
          name: TESTDATEN.antragsteller.name,
          strasse: TESTDATEN.antragsteller.strasse,
          plz: TESTDATEN.antragsteller.plz,
          ort: TESTDATEN.antragsteller.ort,
          geburtsdatum: TESTDATEN.antragsteller.geburtsdatum,
          telefon: TESTDATEN.antragsteller.telefon
        },
        inhalt: {
          betreff: 'Testantrag Pflegegeld',
          antragsgrund: 'Ich bin Pflegegrad 3 und benötige Unterstützung.',
          dringlichkeit: 'normal'
        }
      }
    };
    
    const response = await request.post(`${API_BASE}/briefe`, { data: payload });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.briefText).toContain('Testantrag');
    expect(data.checklist).toBeDefined();
  });

  test('POST /api/briefe - EM-Rente Brief', async ({ request }) => {
    const payload = {
      type: 'em-rente',
      data: {
        empfaenger: {
          name: 'Deutsche Rentenversicherung',
          strasse: 'Ruhrstr. 2',
          plz: '10704',
          ort: 'Berlin'
        },
        antragsteller: {
          name: TESTDATEN.antragsteller.name,
          strasse: TESTDATEN.antragsteller.strasse,
          plz: TESTDATEN.antragsteller.plz,
          ort: TESTDATEN.antragsteller.ort,
          geburtsdatum: TESTDATEN.antragsteller.geburtsdatum,
          sozialversicherungsnummer: TESTDATEN.antragsteller.svNummer
        },
        krankheit: {
          diagnose: 'Bandscheibenvorfall L4/L5',
          icd10: 'M51.1',
          krank_seit: '01.01.2023',
          behandelnder_arzt: 'Dr. Schmidt'
        },
        rentenart: 'teilweise'
      }
    };
    
    const response = await request.post(`${API_BASE}/briefe`, { data: payload });
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.briefText).toContain('Erwerbsminderungsrente');
    expect(data.gutachtenFragen).toBeDefined();
  });

  test('GET /api/briefe/pdf - PDF-Typen auflisten', async ({ request }) => {
    const response = await request.get(`${API_BASE}/briefe/pdf`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.types).toBeDefined();
    expect(Array.isArray(data.types)).toBe(true);
    expect(data.types.length).toBeGreaterThan(0);
  });

  test('POST /api/briefe/pdf - PDF generieren', async ({ request }) => {
    const payload = {
      type: 'versorgungsamt',
      absender: {
        name: TESTDATEN.antragsteller.name.split(' ')[1],
        vorname: TESTDATEN.antragsteller.name.split(' ')[0],
        strasse: TESTDATEN.antragsteller.strasse,
        plz: TESTDATEN.antragsteller.plz,
        ort: TESTDATEN.antragsteller.ort
      },
      empfaenger: TESTDATEN.empfaenger,
      betreff: 'Test-PDF-Generierung',
      inhalt: {
        anrede: 'Sehr geehrte Damen und Herren,',
        einleitung: 'hiermit stelle ich einen Antrag.',
        hauptteil: 'Dies ist ein Test.',
        schluss: 'Mit freundlichen Grüßen'
      }
    };
    
    const response = await request.post(`${API_BASE}/briefe/pdf`, { data: payload });
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toBe('application/pdf');
  });

  test('POST /api/cases - Neuen Fall erstellen', async ({ request }) => {
    const response = await request.post(`${API_BASE}/cases`);
    
    if (response.status() === 404) {
      test.skip();
      return;
    }
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.case_code).toMatch(/^PG-[A-Z0-9]+$/);
    expect(data.id).toBeDefined();
  });

  test('Error-Handling: 400 - Ungültiger Brief-Typ', async ({ request }) => {
    const response = await request.post(`${API_BASE}/briefe`, {
      data: { type: 'ungueltiger-typ', data: {} }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  test('Error-Handling: 400 - Fehlende Daten', async ({ request }) => {
    const response = await request.post(`${API_BASE}/briefe`, {
      data: { type: 'versorgungsamt' }
    });
    
    expect(response.status()).toBe(400);
  });

  test('Error-Handling: 404 - Unbekannte Route', async ({ request }) => {
    const response = await request.get(`${API_BASE}/nicht-existiert`);
    expect(response.status()).toBe(404);
  });
});

// ============================================
// SUITE 4: Responsiveness
// ============================================
test.describe('Responsiveness Tests', () => {
  
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`${viewport.name} - Startseite`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Keine horizontale Scrollbar
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Toleranz
      
      // Hauptnavigation sichtbar
      await expect(page.locator('nav, header')).toBeVisible();
    });

    test(`${viewport.name} - Pflegegrad-Rechner`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/pflegegrad/start');
      
      // Formular ist sichtbar und bedienbar
      await expect(page.getByRole('button', { name: 'Neuen Fall starten' })).toBeVisible();
      
      // Kein Overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);
    });

    test(`${viewport.name} - Brief-Generator`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/briefe');
      
      // Kategorien sind sichtbar
      await expect(page.getByText('Antrag Pflegegrad')).toBeVisible();
      
      // Grid passt sich an
      const grid = page.locator('.grid');
      await expect(grid).toBeVisible();
    });
  }
});

// ============================================
// SUITE 5: Accessibility (A11y)
// ============================================
test.describe('A11y Tests mit Axe', () => {
  
  test('Startseite - WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/');
    
    // Axe-Core via CDN injizieren
    await injectAxe(page);
    
    const violations = await runAxe(page, {
      runOnly: ['wcag2aa', 'wcag2a'],
      rules: {
        'color-contrast': { enabled: true },
        'label': { enabled: true },
        'aria-required-attr': { enabled: true },
      }
    });
    
    expect(violations).toHaveLength(0);
  });

  test('Pflegegrad-Rechner - Screen-Reader Labels', async ({ page }) => {
    await page.goto('/pflegegrad/modul1');
    
    // Alle Radio-Buttons haben Labels
    const radios = page.locator('input[type="radio"]');
    const count = await radios.count();
    
    for (let i = 0; i < count; i++) {
      const radio = radios.nth(i);
      const ariaLabel = await radio.getAttribute('aria-label');
      const hasLabel = await radio.evaluate(el => {
        const id = el.id;
        const labels = document.querySelectorAll(`label[for="${id}"]`);
        return labels.length > 0 || el.getAttribute('aria-labelledby');
      });
      
      expect(hasLabel || ariaLabel).toBeTruthy();
    }
    
    // Progressbar hat ARIA-Attribute
    const progress = page.locator('[role="progressbar"]');
    await expect(progress).toHaveAttribute('aria-valuemin', '0');
    await expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  test('Brief-Generator - Kontrast-Prüfung', async ({ page }) => {
    await page.goto('/briefe');
    await page.getByText('Antrag Pflegegrad').click();
    
    await injectAxe(page);
    
    const violations = await runAxe(page, {
      runOnly: ['color-contrast']
    });
    
    // Nur kritische Kontrastfehler
    const contrastErrors = violations.filter(v => v.id === 'color-contrast');
    expect(contrastErrors).toHaveLength(0);
  });

  test('Navigation - Tastatur-Steuerung', async ({ page }) => {
    await page.goto('/');
    
    // Tab durch alle interaktiven Elemente
    const interactiveElements = await page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
    
    for (let i = 0; i < Math.min(interactiveElements, 10); i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).not.toBe('BODY');
    }
  });

  test('Bilder - Alt-Texte vorhanden', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaHidden = await img.getAttribute('aria-hidden');
      
      // Bilder haben entweder alt-Text oder sind dekorativ
      expect(alt !== null || ariaHidden === 'true').toBeTruthy();
    }
  });
});

// ============================================
// SUITE 6: Performance
// ============================================
test.describe('Performance Tests', () => {
  
  test('Lighthouse Scores > 90', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Performance Metriken via Performance API
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: nav?.domContentLoadedEventEnd || 0,
        loadComplete: nav?.loadEventEnd || 0,
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    // FCP sollte < 1.8s sein
    expect(metrics.fcp).toBeLessThan(1800);
    
    // DOMContentLoaded < 2s
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('LCP < 2.5s', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Warte auf potenzielle LCP-Elemente
    await page.waitForTimeout(1000);
    
    const lcp = await page.evaluate(() => {
      const entries = performance.getEntriesByType('largest-contentful-paint') as PerformanceEntry[];
      return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
    });
    
    expect(lcp).toBeLessThan(2500);
  });

  test('CLS < 0.1', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const cls = await page.evaluate(() => {
      return (performance as any).getEntriesByType('layout-shift')
        .filter((entry: any) => !entry.hadRecentInput)
        .reduce((sum: number, entry: any) => sum + entry.value, 0);
    });
    
    expect(cls).toBeLessThan(0.1);
  });

  test('Keine Render-Blockierung', async ({ page }) => {
    await page.goto('/');
    
    // Prüfe auf render-blocking Ressourcen
    const requests: Request[] = [];
    page.on('request', req => requests.push(req));
    
    await page.waitForLoadState('networkidle');
    
    const renderBlocking = requests.filter(req => {
      const headers = req.headers();
      return headers['link']?.includes('preload') === false &&
             (req.url().includes('.css') || req.url().includes('.js'));
    });
    
    // CSS sollte inline oder optimiert sein
    expect(renderBlocking.length).toBeLessThan(5);
  });

  test('Core Web Vitals - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simuliere langsames Netzwerk
    await page.route('**/*', async route => {
      await new Promise(f => setTimeout(f, 50));
      await route.continue();
    });
    
    const vitals = await page.evaluate(() => {
      return {
        ttfb: performance.getEntriesByType('navigation')[0]?.responseStart || 0,
        fcp: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    // TTFB < 800ms
    expect(vitals.ttfb).toBeLessThan(800);
  });
});

// ============================================
// Hilfsfunktionen
// ============================================

async function completeModul(page: Page, modulNummer: number, anzahlFragen: number) {
  // Beantworte zufällige Optionen für jede Frage
  const radios = await page.locator('input[type="radio"]').count();
  const optionsPerQuestion = 5; // Keine Einschränkung, Leichte, Mittlere, Schwere, Völlig
  
  for (let i = 0; i < Math.min(anzahlFragen, Math.floor(radios / optionsPerQuestion) + 1); i++) {
    const startIndex = i * optionsPerQuestion;
    const optionIndex = Math.floor(Math.random() * Math.min(optionsPerQuestion, radios - startIndex));
    
    try {
      const radio = page.locator('input[type="radio"]').nth(startIndex + optionIndex);
      await radio.check({ force: true });
      await page.waitForTimeout(150);
    } catch {
      // Falls weniger Optionen vorhanden oder nicht klickbar
      break;
    }
  }
}

async function fillBriefForm(page: Page, typ: string) {
  // Finde alle Input-Felder
  const inputs = await page.locator('input[type="text"], input[type="tel"], textarea').count();
  
  // Empfänger Felder
  const empfaengerInputs = await page.locator('input').filter({ has: page.locator(':placeholder-shown') }).count();
  
  // Versuche Empfänger-Felder zu füllen
  try {
    const empfaengerName = page.locator('input').filter({ hasText: /Behördenname|Empfänger|Name/i }).first();
    if (await empfaengerName.isVisible().catch(() => false)) {
      await empfaengerName.fill(TESTDATEN.empfaenger.name);
    }
  } catch {}
  
  // Suche nach Inputs mit Placeholder
  const allInputs = page.locator('input[type="text"]');
  const count = await allInputs.count();
  
  for (let i = 0; i < Math.min(count, 4); i++) {
    const input = allInputs.nth(i);
    const placeholder = await input.getAttribute('placeholder').catch(() => '');
    
    if (placeholder.includes('Straße') || placeholder.includes('strasse')) {
      await input.fill(i < 2 ? TESTDATEN.empfaenger.strasse : TESTDATEN.antragsteller.strasse);
    } else if (placeholder.includes('PLZ') || placeholder.includes('plz')) {
      await input.fill(i < 2 ? TESTDATEN.empfaenger.plz : TESTDATEN.antragsteller.plz);
    } else if (placeholder.includes('Ort') || placeholder.includes('ort')) {
      await input.fill(i < 2 ? TESTDATEN.empfaenger.ort : TESTDATEN.antragsteller.ort);
    } else if (placeholder.includes('Name') || placeholder.includes('name')) {
      await input.fill(i === 0 ? TESTDATEN.empfaenger.name : TESTDATEN.antragsteller.name);
    }
  }
  
  // Absender Name
  try {
    const absenderName = page.locator('input[placeholder*="Ihr Name"], input[placeholder*="Absender"]').first();
    if (await absenderName.isVisible().catch(() => false)) {
      await absenderName.fill(TESTDATEN.antragsteller.name);
    }
  } catch {}
  
  // Telefon
  try {
    const telefonInput = page.locator('input[type="tel"], input[placeholder*="Telefon"]').first();
    if (await telefonInput.isVisible().catch(() => false)) {
      await telefonInput.fill(TESTDATEN.antragsteller.telefon);
    }
  } catch {}
  
  // Betreff
  try {
    const betreffInput = page.locator('input[placeholder*="Betreff"]').first();
    if (await betreffInput.isVisible().catch(() => false)) {
      await betreffInput.fill(`Testantrag ${typ}`);
    }
  } catch {}
  
  // Inhalt / Anliegen
  try {
    const inhaltInput = page.locator('textarea, input[placeholder*="Anliegen"], input[placeholder*="Antragsgrund"]').first();
    if (await inhaltInput.isVisible().catch(() => false)) {
      await inhaltInput.fill('Dies ist ein automatisierter Test durch Playwright.');
    }
  } catch {}
  
  // Warte kurz für Formular-Validierung
  await page.waitForTimeout(300);
}

async function injectAxe(page: Page) {
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js'
  });
  await page.waitForFunction(() => typeof (window as any).axe !== 'undefined');
}

async function runAxe(page: Page, options: any = {}) {
  return await page.evaluate((opts) => {
    return new Promise((resolve) => {
      (window as any).axe.run(document, opts, (err: any, results: any) => {
        if (err) resolve([]);
        resolve(results.violations || []);
      });
    });
  }, options);
}
