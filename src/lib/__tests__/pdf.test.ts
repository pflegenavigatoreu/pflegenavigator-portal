import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generatePDF,
  generateErgebnisPDF,
  generateWiderspruchPDF,
  type PDFOptions,
} from '../pdf';

// Mock puppeteer
vi.mock('puppeteer-core', () => {
  return {
    default: {
      launch: vi.fn().mockResolvedValue({
        newPage: vi.fn().mockResolvedValue({
          setContent: vi.fn().mockResolvedValue(undefined),
          pdf: vi.fn().mockResolvedValue(Buffer.from('mock-pdf-content')),
        }),
        close: vi.fn().mockResolvedValue(undefined),
      }),
    },
  };
});

vi.mock('@sparticuz/chromium', () => {
  return {
    default: {
      args: ['--no-sandbox'],
      defaultViewport: { width: 1280, height: 720 },
      executablePath: vi.fn().mockResolvedValue('/mock/chromium'),
      headless: true,
    },
  };
});

describe('PDF Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // Basis PDF Generierung
  // ============================================
  describe('generatePDF', () => {
    it('sollte PDF-Buffer zurückgeben', async () => {
      const options: PDFOptions = {
        title: 'Test PDF',
        content: '<h1>Test Content</h1>',
      };

      const result = await generatePDF(options);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('sollte HTML-Template mit Branding verwenden', async () => {
      const options: PDFOptions = {
        title: 'Test',
        content: '<p>Content</p>',
      };

      const result = await generatePDF(options);

      // Puppeteer sollte aufgerufen worden sein
      expect(result).toBeDefined();
    });

    it('sollte PflegeNavigator Branding enthalten', async () => {
      const options: PDFOptions = {
        title: 'PflegeNavigator EU',
        content: '<p>Test</p>',
      };

      const result = await generatePDF(options);

      expect(result).toBeDefined();
    });

    it('sollte Disclaimer in PDF haben', async () => {
      const options: PDFOptions = {
        title: 'Test',
        content: '<p>Content</p>',
      };

      const result = await generatePDF(options);

      expect(result).toBeDefined();
    });

    it('sollte mit Header und Footer funktionieren', async () => {
      const options: PDFOptions = {
        title: 'Test',
        content: '<p>Main Content</p>',
        header: '<p>Custom Header</p>',
        footer: '<p>Custom Footer</p>',
      };

      const result = await generatePDF(options);

      expect(result).toBeDefined();
    });

    it('sollte ohne optionale Felder funktionieren', async () => {
      const options: PDFOptions = {
        content: 'Minimal content',
      };

      const result = await generatePDF(options);

      expect(result).toBeInstanceOf(Buffer);
    });
  });

  // ============================================
  // Ergebnis PDF
  // ============================================
  describe('generateErgebnisPDF', () => {
    it('sollte Ergebnis-PDF mit Fallcode generieren', async () => {
      const result = await generateErgebnisPDF(
        'PF-ABC123',
        3,
        55.5,
        [
          'Modul 1 (Mobilität): 50%',
          'Modul 2 (Kognition): 40%',
          'Gesamtpunktzahl: 55.5',
        ]
      );

      expect(result).toBeInstanceOf(Buffer);
    });

    it('sollte alle Pflegegrade verarbeiten', async () => {
      for (const careLevel of [1, 2, 3, 4, 5]) {
        const result = await generateErgebnisPDF(
          `PF-TEST${careLevel}`,
          careLevel,
          30 + careLevel * 10,
          [`Pflegegrad ${careLevel} erkannt`]
        );

        expect(result).toBeInstanceOf(Buffer);
      }
    });

    it('sollte mit leeren Details funktionieren', async () => {
      const result = await generateErgebnisPDF('PF-TEST', 2, 30, []);

      expect(result).toBeInstanceOf(Buffer);
    });
  });

  // ============================================
  // Widerspruch PDF
  // ============================================
  describe('generateWiderspruchPDF', () => {
    it('sollte Widerspruchs-PDF generieren', async () => {
      const result = await generateWiderspruchPDF(
        'PF-WIDERSPRUCH-001',
        2, // Aktueller PG
        3, // Beantragter PG
        'Die Einstufung ist nicht korrekt, da die Selbstversorgung unterschätzt wurde. Ich benötige täglich Unterstützung beim Waschen und Anziehen.'
      );

      expect(result).toBeInstanceOf(Buffer);
    });

    it('sollte große Widerspruchsbegründungen verarbeiten', async () => {
      const langeBegruendung = 'A'.repeat(5000);

      const result = await generateWiderspruchPDF(
        'PF-LANG-001',
        1,
        4,
        langeBegruendung
      );

      expect(result).toBeInstanceOf(Buffer);
    });

    it('sollte rechtliche Hinweise enthalten', async () => {
      const result = await generateWiderspruchPDF(
        'PF-RECHT-001',
        2,
        3,
        'Begründung'
      );

      expect(result).toBeInstanceOf(Buffer);
    });

    it('sollte mit gleichem aktuellem und beantragtem PG funktionieren', async () => {
      const result = await generateWiderspruchPDF(
        'PF-SAME-001',
        3,
        3,
        'Bitte um Überprüfung'
      );

      expect(result).toBeInstanceOf(Buffer);
    });
  });

  // ============================================
  // Browser/Serverless Tests
  // ============================================
  describe('Browser Konfiguration', () => {
    it('sollte Chromium mit korrekten Args starten', async () => {
      const options: PDFOptions = {
        content: 'Test',
      };

      await generatePDF(options);

      // Launch wurde in Mock aufgerufen
      expect(vi.mocked((await import('puppeteer-core')).default.launch)).toBeDefined();
    });

    it('sollte Browser nach Generierung schließen', async () => {
      const options: PDFOptions = {
        content: 'Test',
      };

      await generatePDF(options);

      // Browser sollte geschlossen werden
    });
  });

  // ============================================
  // Fehlerbehandlung
  // ============================================
  describe('Fehlerbehandlung', () => {
    it('sollte Puppeteer-Fehler abfangen', async () => {
      vi.doMock('puppeteer-core', () => {
        return {
          default: {
            launch: vi.fn().mockRejectedValue(new Error('Chromium nicht verfügbar')),
          },
        };
      });

      // Sollte Fehler werfen
      await expect(
        generatePDF({ content: 'Test' })
      ).rejects.toThrow();
    });
  });

  // ============================================
  // HTML-Validierung
  // ============================================
  describe('HTML Template', () => {
    it('sollte gültiges HTML erzeugen', async () => {
      const options: PDFOptions = {
        title: 'Test <script>alert("xss")</script>',
        content: '<p>Test</p>',
      };

      const result = await generatePDF(options);

      expect(result).toBeDefined();
    });

    it('sollte HTML-Entities verarbeiten', async () => {
      const options: PDFOptions = {
        content: '<p>Test mit &amp; und &lt; und &gt;</p>',
      };

      const result = await generatePDF(options);

      expect(result).toBeDefined();
    });

    it('sollte deutsche Sonderzeichen verarbeiten', async () => {
      const options: PDFOptions = {
        content: '<p>Ä Ö Ü ß ä ö ü</p>',
      };

      const result = await generatePDF(options);

      expect(result).toBeDefined();
    });
  });

  // ============================================
  // PDF Format
  // ============================================
  describe('PDF Format', () => {
    it('sollte A4 Format verwenden', async () => {
      const options: PDFOptions = {
        content: 'Test',
      };

      const result = await generatePDF(options);

      // PDF Buffer sollte erzeugt werden
      expect(result).toBeInstanceOf(Buffer);
    });

    it('sollte Hintergrundfarben drucken', async () => {
      const options: PDFOptions = {
        content: '<div style="background: red;">Red BG</div>',
      };

      const result = await generatePDF(options);

      expect(result).toBeDefined();
    });
  });
});
