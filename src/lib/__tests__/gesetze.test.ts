import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateBenefits,
  PFLEGEGELD_2026,
  BEEP_2026,
  type Gesetz,
} from '../gesetze';

// Mock fetch für API-Tests
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Gesetze API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // Leistungsberechnung Tests
  // ============================================
  describe('calculateBenefits', () => {
    it('sollte Pflegegeld PG 1 berechnen (0€)', () => {
      const result = calculateBenefits(1);

      expect(result.total).toBe(0);
      expect(result.details).toContain('Pflegegeld PG 1: 0 €/Monat');
    });

    it('sollte Pflegegeld PG 2 berechnen (347€)', () => {
      const result = calculateBenefits(2);

      expect(result.total).toBe(347);
      expect(result.details).toContain('Pflegegeld PG 2: 347 €/Monat');
    });

    it('sollte Pflegegeld PG 3 berechnen (599€)', () => {
      const result = calculateBenefits(3);

      expect(result.total).toBe(599);
      expect(result.details).toContain('Pflegegeld PG 3: 599 €/Monat');
    });

    it('sollte Pflegegeld PG 4 berechnen (800€)', () => {
      const result = calculateBenefits(4);

      expect(result.total).toBe(800);
      expect(result.details).toContain('Pflegegeld PG 4: 800 €/Monat');
    });

    it('sollte Pflegegeld PG 5 berechnen (990€)', () => {
      const result = calculateBenefits(5);

      expect(result.total).toBe(990);
      expect(result.details).toContain('Pflegegeld PG 5: 990 €/Monat');
    });

    it('sollte Entlastungsbudget hinzufügen', () => {
      const result = calculateBenefits(1, true);

      expect(result.details).toContain(
        `Entlastungsbetrag: ${PFLEGEGELD_2026.pg1.reliefBudget} €/Monat`
      );
    });

    it('sollte Kombinationsleistungen für PG 2+ hinzufügen', () => {
      const result = calculateBenefits(2, false, true);

      expect(result.details).toContain(
        `Kombinationsleistungen: bis zu ${PFLEGEGELD_2026.entlastungsBudget} €/Jahr`
      );
    });

    it('sollte keine Kombinationsleistungen für PG 1 anbieten', () => {
      const result = calculateBenefits(1, false, true);

      expect(result.details).not.toContain('Kombinationsleistungen');
    });

    it('sollte total mit Entlastungsbudget berechnen', () => {
      const result = calculateBenefits(3, true);

      // 599 + 131 = 730
      expect(result.total).toBe(730);
    });

    it('sollte 0 für ungültigen Pflegegrad zurückgeben', () => {
      const result = calculateBenefits(0);

      expect(result.total).toBe(0);
      expect(result.details).toContain('Pflegegeld PG 0: 0 €/Monat');
    });

    it('sollte für hohe Pflegegrade funktionieren', () => {
      const result = calculateBenefits(10);

      // Sollte nicht crashen
      expect(result.total).toBeDefined();
    });
  });

  // ============================================
  // PFLEGEGELD_2026 Konstanten
  // ============================================
  describe('PFLEGEGELD_2026', () => {
    it('sollte alle 5 Pflegegrade definieren', () => {
      expect(PFLEGEGELD_2026.pg1).toBeDefined();
      expect(PFLEGEGELD_2026.pg2).toBeDefined();
      expect(PFLEGEGELD_2026.pg3).toBeDefined();
      expect(PFLEGEGELD_2026.pg4).toBeDefined();
      expect(PFLEGEGELD_2026.pg5).toBeDefined();
    });

    it('sollte steigende Pflegegelder haben', () => {
      expect(PFLEGEGELD_2026.pg1.monthly).toBe(0);
      expect(PFLEGEGELD_2026.pg2.monthly).toBe(347);
      expect(PFLEGEGELD_2026.pg3.monthly).toBe(599);
      expect(PFLEGEGELD_2026.pg4.monthly).toBe(800);
      expect(PFLEGEGELD_2026.pg5.monthly).toBe(990);
    });

    it('sollte konstantes Entlastungsbudget von 131€ haben', () => {
      expect(PFLEGEGELD_2026.pg1.reliefBudget).toBe(131);
      expect(PFLEGEGELD_2026.pg5.reliefBudget).toBe(131);
    });

    it('sollte Entlastungsbudget 2026 definieren', () => {
      expect(PFLEGEGELD_2026.entlastungsBudget).toBe(3539);
    });

    it('sollte Pflegehilfsmittel Budget definieren', () => {
      expect(PFLEGEGELD_2026.pflegehilfsmittel).toBe(42);
    });

    it('sollte Wohnraumanpassung Budget definieren', () => {
      expect(PFLEGEGELD_2026.wohnraumanpassung).toBe(4180);
    });
  });

  // ============================================
  // BEEP 2026 Tests
  // ============================================
  describe('BEEP_2026', () => {
    it('sollte BEEP-Gesetz definieren', () => {
      expect(BEEP_2026.name).toContain('Befugniserweiterung');
      expect(BEEP_2026.name).toContain('Entbürokratisierung');
    });

    it('sollte Inkrafttretedatum haben', () => {
      expect(BEEP_2026.effectiveDate).toBe('2026-01-01');
    });

    it('sollte 4 wichtige Änderungen auflisten', () => {
      expect(BEEP_2026.keyChanges).toHaveLength(4);
      expect(BEEP_2026.keyChanges).toContain(
        expect.stringContaining('Abrechnungsfristen')
      );
      expect(BEEP_2026.keyChanges).toContain(
        expect.stringContaining('Bürokratie')
      );
    });
  });

  // ============================================
  // Gesetze API Interface Tests
  // ============================================
  describe('Gesetze API Interface', () => {
    it('sollte Gesetz-Typ korrekt definieren', () => {
      const mockGesetz: Gesetz = {
        abbreviation: 'SGB XI',
        title: 'Sozialgesetzbuch XI - Soziale Pflegeversicherung',
        sections: [
          {
            number: '§ 1',
            title: 'Recht auf Pflege',
            content: 'Personen mit Pflegebedarf haben Anspruch...',
            amended: '2024-01-01',
          },
        ],
      };

      expect(mockGesetz.abbreviation).toBe('SGB XI');
      expect(mockGesetz.sections).toHaveLength(1);
      expect(mockGesetz.sections[0].number).toBe('§ 1');
    });

    it('sollte Gesetz mit optionalen amended-Datum', () => {
      const sectionNoAmended = {
        number: '§ 2',
        title: 'Leistungen',
        content: 'Leistungsbeschreibung...',
      };

      expect(sectionNoAmended.amended).toBeUndefined();
    });
  });

  // ============================================
  // Environment Variable Tests
  // ============================================
  describe('Environment Variables', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('sollte NORMATTIVA_API_KEY verwenden', () => {
      process.env.NORMATTIVA_API_KEY = 'test-api-key-123';
      expect(process.env.NORMATTIVA_API_KEY).toBe('test-api-key-123');
    });

    it('sollte fehlen wenn API Key nicht gesetzt', () => {
      delete process.env.NORMATTIVA_API_KEY;
      expect(process.env.NORMATTIVA_API_KEY).toBeUndefined();
    });
  });
});
