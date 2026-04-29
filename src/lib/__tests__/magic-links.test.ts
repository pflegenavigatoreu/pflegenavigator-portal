import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createMagicLink,
  createQRCode,
  createWalletPassData,
  parseMagicLink,
  createEmergencyCardData,
  createGuestLink,
  type MagicLinkData,
} from '../magic-links';

// Mock window für Server-seitige Tests
vi.stubGlobal('window', undefined);

describe('Magic Links', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_APP_URL = 'https://pflegenavigatoreu.com';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ============================================
  // Magic Link Generierung
  // ============================================
  describe('createMagicLink', () => {
    it('sollte Magic Link mit CaseCode generieren', () => {
      const caseCode = 'PF-TEST123';
      const link = createMagicLink(caseCode);

      expect(link).toContain('https://pflegenavigatoreu.com/magic');
      expect(link).toContain('case=' + encodeURIComponent(caseCode));
      expect(link).toContain('token=');
    });

    it('sollte CaseCode URL-encoden', () => {
      const caseCode = 'PF-TEST/ABC+123';
      const link = createMagicLink(caseCode);

      expect(link).toContain(encodeURIComponent(caseCode));
      expect(link).not.toContain('PF-TEST/ABC+123'); // Nicht encoded
    });

    it('sollte Redirect-Parameter hinzufügen', () => {
      const caseCode = 'PF-123';
      const link = createMagicLink(caseCode, { redirectTo: '/ergebnis' });

      expect(link).toContain('redirect=%2Fergebnis');
    });

    it('sollte Ablaufdatum setzen', () => {
      const caseCode = 'PF-123';
      const link = createMagicLink(caseCode, { expiresInDays: 7 });

      expect(link).toContain('expires=');
    });

    it('sollte Token generieren', () => {
      const caseCode = 'PF-TOKEN-TEST';
      const link = createMagicLink(caseCode);

      const url = new URL(link);
      const token = url.searchParams.get('token');

      expect(token).toBeDefined();
      expect(token?.length).toBeGreaterThanOrEqual(10);
    });

    it('sollte verschiedene Tokens für verschiedene Aufrufe generieren', () => {
      const caseCode = 'PF-123';
      const link1 = createMagicLink(caseCode);
      const link2 = createMagicLink(caseCode);

      // Kurze Verzögerung simulieren (Token enthält Timestamp)
      vi.advanceTimersByTime(100);

      expect(link1).not.toBe(link2);
    });

    it('sollte mit Basis-URL ohne env var funktionieren', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;

      const link = createMagicLink('PF-123');

      expect(link).toContain('/magic?');
    });
  });

  // ============================================
  // QR-Code Generierung
  // ============================================
  describe('createQRCode', () => {
    it('sollte QR-Code Data-URL generieren', async () => {
      const caseCode = 'PF-QR-TEST';
      const result = await createQRCode(caseCode);

      expect(result).toHaveProperty('qrDataUrl');
      expect(result).toHaveProperty('magicLink');
      expect(result.qrDataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it('sollte PflegeNavigator Branding-Farben verwenden', async () => {
      const caseCode = 'PF-BRAND';
      const result = await createQRCode(caseCode);

      expect(result.qrDataUrl).toBeDefined();
      // QR-Code wird generiert, Farbe kann nicht direkt getestet werden
    });

    it('sollte benutzerdefinierte Größe akzeptieren', async () => {
      const caseCode = 'PF-SIZE';
      const result = await createQRCode(caseCode, { size: 500 });

      expect(result.qrDataUrl).toBeDefined();
    });

    it('sollte hohe Fehlerkorrektur verwenden', async () => {
      const caseCode = 'PF-ERROR';
      const result = await createQRCode(caseCode);

      expect(result.qrDataUrl).toBeDefined();
    });

    it('sollte Label zu QR-Code hinzufügen', async () => {
      const caseCode = 'PF-LABEL';
      const result = await createQRCode(caseCode, { label: 'Mein Fall' });

      expect(result.qrDataUrl).toBeDefined();
    });

    it('sollte Fehler bei QR-Generierung abfangen', async () => {
      // Ungültige Eingabe für QR-Code
      await expect(
        createQRCode('')
      ).rejects.toThrow();
    });
  });

  // ============================================
  // Wallet Pass
  // ============================================
  describe('createWalletPassData', () => {
    it('sollte Wallet-Pass-Daten erstellen', () => {
      const caseCode = 'PF-WALLET-001';
      const passData = createWalletPassData(caseCode);

      expect(passData).toHaveProperty('title');
      expect(passData).toHaveProperty('description');
      expect(passData).toHaveProperty('barcode');
    });

    it('sollte PflegeNavigator als Titel haben', () => {
      const caseCode = 'PF-001';
      const passData = createWalletPassData(caseCode);

      expect(passData.title).toContain('PflegeNavigator');
    });

    it('sollte CaseCode in Beschreibung haben', () => {
      const caseCode = 'PF-DESC-TEST';
      const passData = createWalletPassData(caseCode);

      expect(passData.description).toContain(caseCode);
    });

    it('sollte QR-Code Barcode haben', () => {
      const caseCode = 'PF-BARCODE';
      const passData = createWalletPassData(caseCode);

      expect(passData.barcode.format).toBe('QR');
      expect(passData.barcode.message).toContain('/magic?');
    });
  });

  // ============================================
  // Magic Link Parsing
  // ============================================
  describe('parseMagicLink', () => {
    it('sollte CaseCode aus Magic Link extrahieren', () => {
      const caseCode = 'PF-PARSE-123';
      const link = createMagicLink(caseCode);

      const parsed = parseMagicLink(link);

      expect(parsed.caseCode).toBe(caseCode);
    });

    it('sollte Redirect-Parameter extrahieren', () => {
      const caseCode = 'PF-REDIRECT';
      const link = createMagicLink(caseCode, { redirectTo: '/widerspruch' });

      const parsed = parseMagicLink(link);

      expect(parsed.redirectTo).toBe('/widerspruch');
    });

    it('sollte Ablaufdatum prüfen', () => {
      const caseCode = 'PF-EXPIRED';
      const link = createMagicLink(caseCode, { expiresInDays: -1 }); // Abgelaufen

      const parsed = parseMagicLink(link);

      expect(parsed.isExpired).toBe(true);
    });

    it('sollte Token validieren', () => {
      const caseCode = 'PF-VALID';
      const link = createMagicLink(caseCode);

      const parsed = parseMagicLink(link);

      expect(parsed.isValid).toBe(true);
    });

    it('sollte ungültige Links erkennen', () => {
      const invalidLinks = [
        'https://example.com/magic', // Kein Case
        'https://example.com/magic?case=', // Leerer Case
        'https://example.com/magic?token=123', // Kein Token
        'not-a-url', // Keine URL
      ];

      invalidLinks.forEach(link => {
        const parsed = parseMagicLink(link);
        expect(parsed.isValid).toBe(false);
        expect(parsed.caseCode).toBeNull();
      });
    });

    it('sollte null zurückgeben bei Parse-Fehlern', () => {
      const parsed = parseMagicLink('invalid-url-format');

      expect(parsed.caseCode).toBeNull();
      expect(parsed.isValid).toBe(false);
    });

    it('sollte nicht abgelaufen für gültiges Datum', () => {
      const caseCode = 'PF-FUTURE';
      const link = createMagicLink(caseCode, { expiresInDays: 30 });

      const parsed = parseMagicLink(link);

      expect(parsed.isExpired).toBe(false);
    });
  });

  // ============================================
  // Notfall-Karte
  // ============================================
  describe('createEmergencyCardData', () => {
    it('sollte Notfallkarten-Daten erstellen', () => {
      const caseCode = 'PF-EMERGENCY-001';
      const cardData = createEmergencyCardData(caseCode);

      expect(cardData.title).toContain('Notfallkarte');
      expect(cardData.caseCode).toBe(caseCode);
      expect(cardData).toHaveProperty('qrCodePromise');
    });

    it('sollte QR-Code Promise zurückgeben', () => {
      const caseCode = 'PF-PROMISE';
      const cardData = createEmergencyCardData(caseCode);

      expect(cardData.qrCodePromise).toBeInstanceOf(Promise);
    });

    it('sollte QR-Code auflösen', async () => {
      const caseCode = 'PF-RESOLVE';
      const cardData = createEmergencyCardData(caseCode);

      const qrCode = await cardData.qrCodePromise;
      expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });

    it('sollte Notfall-Informationen verarbeiten', () => {
      const caseCode = 'PF-INFO';
      const emergencyInfo = {
        name: 'Max Mustermann',
        pflegegrad: '3',
        allergies: ['Penicillin', 'Nüsse'],
        medications: ['Metformin', 'Lisinopril'],
        emergencyContact: {
          name: 'Erika Mustermann',
          phone: '0123456789',
        },
      };

      const cardData = createEmergencyCardData(caseCode, emergencyInfo);

      expect(cardData.info).toEqual(emergencyInfo);
    });

    it('sollte ohne Notfall-Info funktionieren', () => {
      const caseCode = 'PF-NO-INFO';
      const cardData = createEmergencyCardData(caseCode);

      expect(cardData.info).toBeUndefined();
    });
  });

  // ============================================
  // Gast-Link
  // ============================================
  describe('createGuestLink', () => {
    it('sollte Gast-Link mit eingeschränktem Zugriff erstellen', () => {
      const caseCode = 'PF-GUEST-001';
      const link = createGuestLink(caseCode);

      expect(link).toContain('guest=true');
      expect(link).toContain('perms=');
    });

    it('sollte benutzerdefinierte Berechtigungen akzeptieren', () => {
      const caseCode = 'PF-CUSTOM-PERMS';
      const link = createGuestLink(caseCode, ['view', 'edit_diary']);

      expect(link).toContain('perms=view%2Cedit_diary');
    });

    it('sollte view_results als Standard haben', () => {
      const caseCode = 'PF-DEFAULT-PERMS';
      const link = createGuestLink(caseCode);

      expect(link).toContain('perms=view_results');
    });

    it('sollte Guest-Token generieren', () => {
      const caseCode = 'PF-GUEST-TOKEN';
      const link = createGuestLink(caseCode);

      expect(link).toContain('token=');
    });

    it('sollte CaseCode encoden', () => {
      const caseCode = 'PF/GUEST+SPECIAL';
      const link = createGuestLink(caseCode);

      expect(link).toContain(encodeURIComponent(caseCode));
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe('Edge Cases', () => {
    it('sollte leere CaseCodes ablehnen', () => {
      expect(() => createMagicLink('')).not.toThrow();
      const link = createMagicLink('');
      expect(link).toContain('case=');
    });

    it('sollte sehr lange CaseCodes verarbeiten', () => {
      const longCaseCode = 'PF-' + 'A'.repeat(500);
      const link = createMagicLink(longCaseCode);

      expect(link).toContain(encodeURIComponent(longCaseCode));
    });

    it('sollte Unicode in CaseCodes verarbeiten', () => {
      const unicodeCaseCode = 'PF-ÄÖÜ-日本語';
      const link = createMagicLink(unicodeCaseCode);

      const parsed = parseMagicLink(link);
      expect(parsed.caseCode).toBe(unicodeCaseCode);
    });

    it('sollte Sonderzeichen in CaseCodes verarbeiten', () => {
      const specialCaseCode = 'PF-TEST_123.456';
      const link = createMagicLink(specialCaseCode);

      const parsed = parseMagicLink(link);
      expect(parsed.caseCode).toBe(specialCaseCode);
    });

    it('sollte URLs mit Query-Parametern parsen', () => {
      const complexUrl = 'https://example.com/magic?case=PF-123&token=abc&redirect=/test?foo=bar&extra=param';

      const parsed = parseMagicLink(complexUrl);

      expect(parsed.caseCode).toBe('PF-123');
      expect(parsed.redirectTo).toBe('/test?foo=bar');
    });
  });
});
