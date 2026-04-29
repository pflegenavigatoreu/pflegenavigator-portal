import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:3000/api';

test.describe('Briefe API Tests', () => {
  
  test('GET /api/briefe - sollte alle Typen zurückgeben', async ({ request }) => {
    const response = await request.get(`${API_BASE}/briefe`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.types).toHaveLength(7);
    expect(data.types.map((t: any) => t.id)).toContain('versorgungsamt');
    expect(data.types.map((t: any) => t.id)).toContain('em-rente');
  });

  test('POST /api/briefe/versorgungsamt - sollte Brief generieren', async ({ request }) => {
    const payload = {
      type: 'versorgungsamt',
      data: {
        empfaenger: {
          name: 'Sozialamt Bielefeld',
          strasse: 'Niederwall 23',
          plz: '33602',
          ort: 'Bielefeld'
        },
        antragsteller: {
          name: 'Maria Mustermann',
          strasse: 'Heeper Str. 205',
          plz: '33607',
          ort: 'Bielefeld',
          geburtsdatum: '01.01.1950',
          telefon: '0521 123456'
        },
        inhalt: {
          betreff: 'Antrag auf Pflegegeld',
          antragsgrund: 'Ich bin Pflegegrad 3 und benötige Unterstützung bei der Pflege.',
          dringlichkeit: 'normal'
        }
      }
    };
    
    const response = await request.post(`${API_BASE}/briefe`, {
      data: payload
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.briefText).toContain('Antrag auf Pflegegeld');
    expect(data.checklist).toBeDefined();
  });

  test('POST /api/briefe/em-rente - sollte EM-Rente Brief generieren', async ({ request }) => {
    const payload = {
      type: 'em-rente',
      data: {
        empfaenger: {
          name: 'Deutsche Rentenversicherung Bund',
          strasse: 'Ruhrstr. 2',
          plz: '10704',
          ort: 'Berlin'
        },
        antragsteller: {
          name: 'Max Mustermann',
          strasse: 'Musterstraße 1',
          plz: '12345',
          ort: 'Musterstadt',
          geburtsdatum: '01.01.1960',
          telefon: '0123456789',
          sozialversicherungsnummer: '12 1234567890'
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
    
    const response = await request.post(`${API_BASE}/briefe`, {
      data: payload
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.briefText).toContain('Erwerbsminderungsrente');
    expect(data.gutachtenFragen).toBeDefined();
  });

  test('POST /api/briefe - sollte Fehler bei ungültigem Typ', async ({ request }) => {
    const response = await request.post(`${API_BASE}/briefe`, {
      data: { type: 'ungueltig', data: {} }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Unbekannter Typ');
  });

  test('POST /api/briefe - sollte Fehler bei fehlenden Daten', async ({ request }) => {
    const response = await request.post(`${API_BASE}/briefe`, {
      data: { type: 'versorgungsamt' }
    });
    
    expect(response.status()).toBe(400);
  });

  test('GET /api/briefe/pdf - sollte PDF-Typen auflisten', async ({ request }) => {
    const response = await request.get(`${API_BASE}/briefe/pdf`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.types).toBeDefined();
    expect(data.types.length).toBeGreaterThan(0);
  });

  test('POST /api/briefe/pdf - sollte PDF generieren', async ({ request }) => {
    const payload = {
      type: 'versorgungsamt',
      absender: {
        name: 'Mustermann',
        vorname: 'Max',
        strasse: 'Musterstr. 1',
        plz: '12345',
        ort: 'Musterstadt'
      },
      empfaenger: {
        name: 'Versorgungsamt',
        strasse: 'Amtstr. 1',
        plz: '12345',
        ort: 'Amtstadt'
      },
      betreff: 'Testantrag',
      inhalt: {
        anrede: 'Sehr geehrte Damen und Herren,',
        einleitung: 'hiermit stelle ich einen Antrag.',
        hauptteil: 'Dies ist ein Test.',
        schluss: 'Mit freundlichen Grüßen'
      }
    };
    
    const response = await request.post(`${API_BASE}/briefe/pdf`, {
      data: payload
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toBe('application/pdf');
  });
});

test.describe('Frontend Tests', () => {
  
  test('Briefe-Seite sollte alle Kategorien anzeigen', async ({ page }) => {
    await page.goto('/briefe');
    
    await expect(page.getByText('Antrag Pflegegrad')).toBeVisible();
    await expect(page.getByText('Widerspruch Pflegegrad')).toBeVisible();
    await expect(page.getByText('Versorgungsamt')).toBeVisible();
    await expect(page.getByText('Erwerbsminderungsrente')).toBeVisible();
  });

  test('Kategorie-Auswahl sollte Generator öffnen', async ({ page }) => {
    await page.goto('/briefe');
    
    await page.getByText('Antrag Pflegegrad').click();
    
    await expect(page.getByText('Zurück zur Übersicht')).toBeVisible();
    await expect(page.getByPlaceholder(/Behördenname/)).toBeVisible();
  });
});
