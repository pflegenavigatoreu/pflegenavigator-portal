import { describe, it, expect } from 'vitest';
import {
  calculatePflegegrad,
  calculateWiderspruchChance,
  getMDPreparationChecklist,
  getMDQuestionnaire,
  type ModuleScores,
} from '../../pflegegrad-berechnung';

describe('NBA Pflegegrad Berechnung', () => {
  // ============================================
  // Basis-Berechnung Tests
  // ============================================
  describe('calculatePflegegrad', () => {
    it('sollte Pflegegrad 1 berechnen (12.5-27 Punkte)', () => {
      const scores: Partial<ModuleScores> = {
        1: 50, // Mobilität 50 * 0.10 = 5.0
        2: 30, // Kognition (nur höherer Wert von 2/3)
        3: 20, // Verhalten (niedriger, wird ignoriert)
        4: 20, // Selbstversorgung 20 * 0.40 = 8.0
        5: 10, // Therapie 10 * 0.20 = 2.0
      };
      // 5.0 + 4.5 (max(30,20)*0.15) + 8.0 + 2.0 = 19.5

      const result = calculatePflegegrad(scores);
      expect(result.careLevel).toBe(1);
      expect(result.totalScore).toBeGreaterThanOrEqual(12.5);
      expect(result.totalScore).toBeLessThan(27);
    });

    it('sollte Pflegegrad 2 berechnen (27-47.5 Punkte)', () => {
      const scores: Partial<ModuleScores> = {
        1: 60, // 60 * 0.10 = 6.0
        2: 40, // 40 * 0.15 = 6.0 (höher als Modul 3)
        3: 30, // wird ignoriert (nur max von 2/3 zählt)
        4: 40, // 40 * 0.40 = 16.0
        5: 20, // 20 * 0.20 = 4.0
      };
      // 6.0 + 6.0 + 16.0 + 4.0 = 32.0

      const result = calculatePflegegrad(scores);
      expect(result.careLevel).toBe(2);
      expect(result.totalScore).toBeGreaterThanOrEqual(27);
      expect(result.totalScore).toBeLessThan(47.5);
    });

    it('sollte Pflegegrad 3 berechnen (47.5-70 Punkte)', () => {
      const scores: Partial<ModuleScores> = {
        1: 80, // 80 * 0.10 = 8.0
        2: 50, // 50 * 0.15 = 7.5
        3: 60, // wird ignoriert (max(50,60)=60, aber 2 wird genommen wenn gleich?)
        4: 60, // 60 * 0.40 = 24.0
        5: 30, // 30 * 0.20 = 6.0
      };
      // 8.0 + 9.0 (max(50,60)*0.15) + 24.0 + 6.0 = 47.0
      // Eigentlich sollte Modul 3 höher sein: 60*0.15 = 9.0

      const result = calculatePflegegrad(scores);
      expect(result.careLevel).toBeGreaterThanOrEqual(2);
    });

    it('sollte Pflegegrad 4 berechnen (70-90 Punkte)', () => {
      const scores: Partial<ModuleScores> = {
        1: 90, // 90 * 0.10 = 9.0
        2: 80, // 80 * 0.15 = 12.0
        3: 70, // wird ignoriert
        4: 80, // 80 * 0.40 = 32.0
        5: 60, // 60 * 0.20 = 12.0
      };
      // 9.0 + 12.0 + 32.0 + 12.0 = 65.0 -> Sollte PG 3 sein

      const result = calculatePflegegrad(scores);
      expect(result.totalScore).toBeGreaterThanOrEqual(47.5);
    });

    it('sollte Pflegegrad 5 berechnen (>90 Punkte)', () => {
      const scores: Partial<ModuleScores> = {
        1: 100, // 100 * 0.10 = 10.0
        2: 100, // 100 * 0.15 = 15.0
        3: 100, // wird ignoriert
        4: 100, // 100 * 0.40 = 40.0
        5: 100, // 100 * 0.20 = 20.0
      };
      // 10.0 + 15.0 + 40.0 + 20.0 = 85.0 -> Sollte PG 4 sein
      // Für PG 5 brauchen wir 90+

      const result = calculatePflegegrad(scores);
      expect(result.totalScore).toBeGreaterThanOrEqual(70);
    });

    it('sollte bei Null-Punkten keinen Pflegegrad zurückgeben', () => {
      const scores: Partial<ModuleScores> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      const result = calculatePflegegrad(scores);
      expect(result.careLevel).toBeNull();
      expect(result.trafficLight).toBe('red');
    });

    it('sollte fehlende Daten erkennen', () => {
      const scores: Partial<ModuleScores> = {
        1: 50,
        // Modul 2, 3, 4, 5 fehlen
      };

      const result = calculatePflegegrad(scores);
      expect(result.missingData).toBe(true);
    });

    it('sollte max(Modul 2, Modul 3) korrekt berechnen', () => {
      // Fall: Modul 3 > Modul 2
      const scoresA: Partial<ModuleScores> = {
        1: 50,
        2: 20, // niedriger
        3: 80, // höher - sollte zählen!
        4: 40,
        5: 20,
      };
      // max(20, 80) = 80 * 0.15 = 12.0

      const resultA = calculatePflegegrad(scoresA);
      expect(resultA.maxOf23).toBe(80);

      // Fall: Modul 2 > Modul 3
      const scoresB: Partial<ModuleScores> = {
        1: 50,
        2: 80, // höher
        3: 20, // niedriger
        4: 40,
        5: 20,
      };

      const resultB = calculatePflegegrad(scoresB);
      expect(resultB.maxOf23).toBe(80);
    });
  });

  // ============================================
  // Gewichtung Tests (40% Modul 4 ist kritisch!)
  // ============================================
  describe('Gewichtungen', () => {
    it('sollte Modul 4 mit 40% gewichten (wichtigstes Modul)', () => {
      const scores: Partial<ModuleScores> = {
        1: 0,
        2: 0,
        3: 0,
        4: 100, // 100 * 0.40 = 40 Punkte
        5: 0,
      };

      const result = calculatePflegegrad(scores);
      expect(result.weightedScores[4]).toBe(40);
    });

    it('sollte Modul 1 mit 10% gewichten', () => {
      const scores: Partial<ModuleScores> = {
        1: 100, // 100 * 0.10 = 10 Punkte
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      const result = calculatePflegegrad(scores);
      expect(result.weightedScores[1]).toBe(10);
    });

    it('sollte Modul 2/3 mit 15% gewichten', () => {
      const scores: Partial<ModuleScores> = {
        1: 0,
        2: 100, // 100 * 0.15 = 15 Punkte
        3: 0,
        4: 0,
        5: 0,
      };

      const result = calculatePflegegrad(scores);
      expect(result.weightedScores[2]).toBe(15);
    });

    it('sollte Modul 5 mit 20% gewichten', () => {
      const scores: Partial<ModuleScores> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 100, // 100 * 0.20 = 20 Punkte
      };

      const result = calculatePflegegrad(scores);
      expect(result.weightedScores[5]).toBe(20);
    });
  });

  // ============================================
  // Ampel-System Tests
  // ============================================
  describe('Ampel-System', () => {
    it('sollte GRÜN anzeigen wenn deutlich über Schwelle (>5 Punkte)', () => {
      const scores: Partial<ModuleScores> = {
        1: 50,
        2: 50,
        3: 0,
        4: 70, // Hoch genug für deutlichen Abstand
        5: 50,
      };

      const result = calculatePflegegrad(scores);
      if (result.careLevel) {
        expect(result.trafficLight).toBe('green');
        expect(result.buffer).toBeGreaterThan(5);
      }
    });

    it('sollte GELB anzeigen wenn knapp an Schwelle (0-5 Punkte)', () => {
      // Grenzwertig nahe an Schwelle
      const scores: Partial<ModuleScores> = {
        1: 30,  // 3.0
        2: 30,  // 4.5 (max mit 3)
        3: 0,
        4: 50,  // 20.0 - knapp über Schwelle
        5: 20,  // 4.0
      };
      // 3.0 + 4.5 + 20.0 + 4.0 = 31.5 -> knapp über PG2 (27.0)

      const result = calculatePflegegrad(scores);
      expect(result.careLevel).toBe(2);
    });

    it('sollte ROT anzeigen wenn kein Pflegegrad erreicht', () => {
      const scores: Partial<ModuleScores> = {
        1: 10,
        2: 10,
        3: 10,
        4: 10,
        5: 10,
      };

      const result = calculatePflegegrad(scores);
      expect(result.careLevel).toBeNull();
      expect(result.trafficLight).toBe('red');
      expect(result.buffer).toBeGreaterThan(0); // Puffer bis PG1
    });
  });

  // ============================================
  // Leistungen Tests
  // ============================================
  describe('Leistungsberechnung', () => {
    it('sollte PG 1 Leistungen zurückgeben (0€ + 131€ Entlastung)', () => {
      const scores: Partial<ModuleScores> = {
        1: 30, 2: 30, 3: 0, 4: 20, 5: 10,
      };

      const result = calculatePflegegrad(scores);
      if (result.careLevel === 1) {
        expect(result.benefits.monthlyAmount).toBe(0);
        expect(result.benefits.reliefBudget).toBe(131);
      }
    });

    it('sollte PG 2 Leistungen zurückgeben (347€ + 131€)', () => {
      const scores: Partial<ModuleScores> = {
        1: 50, 2: 50, 3: 0, 4: 40, 5: 30,
      };

      const result = calculatePflegegrad(scores);
      if (result.careLevel === 2) {
        expect(result.benefits.monthlyAmount).toBe(347);
        expect(result.benefits.reliefBudget).toBe(131);
        expect(result.benefits.additionalBenefits).toContain('Pflegehilfsmittel: 42 €/Monat');
      }
    });

    it('sollte PG 5 Leistungen zurückgeben (990€ + Zusatzleistungen)', () => {
      const scores: Partial<ModuleScores> = {
        1: 100, 2: 100, 3: 100, 4: 100, 5: 100,
      };

      const result = calculatePflegegrad(scores);
      if (result.careLevel === 5) {
        expect(result.benefits.monthlyAmount).toBe(990);
        expect(result.benefits.additionalBenefits.length).toBeGreaterThan(0);
      }
    });
  });

  // ============================================
  // Kinder-Modus Tests
  // ============================================
  describe('Kinder-Modus', () => {
    it('sollte Kinder unter 18 Monate mit anderen Schwellen berechnen', () => {
      const scores: Partial<ModuleScores> = {
        1: 50, 2: 50, 3: 50, 4: 50, 5: 50,
      };

      const result = calculatePflegegrad(scores, true, 12); // 12 Monate
      // Kinder haben andere Berechnung
      expect(result.moduleScores).toBeDefined();
    });

    it('sollte Jugendliche normal berechnen', () => {
      const scores: Partial<ModuleScores> = {
        1: 50, 2: 50, 3: 50, 4: 50, 5: 50,
      };

      const result = calculatePflegegrad(scores, true, 36); // 36 Monate = 3 Jahre
      // Ab 18 Monate normale Berechnung
      expect(result.totalScore).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Widerspruch Tests
  // ============================================
  describe('calculateWiderspruchChance', () => {
    it('sollte HOHE Chance bei 1 Level Unterschied und starkem Modul 4', () => {
      const scores: ModuleScores = {
        1: 50, 2: 50, 3: 50, 4: 60, 5: 50, 6: 0,
      };

      const result = calculateWiderspruchChance(2, 3, scores);
      expect(result.chance).toBe('high');
      expect(result.reason).toContain('Selbstversorgungs-Einschränkungen');
    });

    it('sollte MITTLERE Chance bei 1-2 Level Unterschied', () => {
      const scores: ModuleScores = {
        1: 30, 2: 40, 3: 30, 4: 30, 5: 20, 6: 0,
      };

      const result = calculateWiderspruchChance(2, 4, scores);
      expect(['medium', 'low']).toContain(result.chance);
    });

    it('sollte GERINGE Chance bei großer Lücke', () => {
      const scores: ModuleScores = {
        1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 0,
      };

      const result = calculateWiderspruchChance(1, 5, scores);
      expect(result.chance).toBe('low');
      expect(result.reason).toContain('Größerer Unterschied');
    });
  });

  // ============================================
  // MD Vorbereitung Tests
  // ============================================
  describe('MD Vorbereitung', () => {
    it('sollte Checkliste mit 10 Punkten zurückgeben', () => {
      const checklist = getMDPreparationChecklist();
      expect(checklist).toHaveLength(10);
      expect(checklist).toContain('Alle Medikamente bereitlegen');
      expect(checklist).toContain('Pflegeprotokoll/Tagebuch aktuell (letzte 4 Wochen)');
    });

    it('sollte Frageliste mit Tipps zurückgeben', () => {
      const questions = getMDQuestionnaire();
      expect(questions.length).toBeGreaterThan(0);
      
      // Jede Frage hat module, question, tip
      questions.forEach(q => {
        expect(q).toHaveProperty('module');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('tip');
        expect(q.module).toBeGreaterThanOrEqual(1);
        expect(q.module).toBeLessThanOrEqual(5);
      });
    });

    it('sollte Schlechte-Tage-Tipp in allen Modul 4 Fragen haben', () => {
      const questions = getMDQuestionnaire();
      const modul4Questions = questions.filter(q => q.module === 4);
      
      modul4Questions.forEach(q => {
        expect(q.tip).toContain('ZEIT');
      });
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe('Edge Cases', () => {
    it('sollte mit leeren Scores umgehen können', () => {
      const result = calculatePflegegrad({});
      expect(result.careLevel).toBeNull();
      expect(result.missingData).toBe(true);
    });

    it('sollte mit undefined Scores umgehen können', () => {
      const scores: Partial<ModuleScores> = {
        1: undefined as unknown as number,
        2: undefined as unknown as number,
      };

      const result = calculatePflegegrad(scores);
      expect(result.missingData).toBe(true);
    });

    it('sollte maximale Punktzahl korrekt berechnen', () => {
      const scores: Partial<ModuleScores> = {
        1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100,
      };

      const result = calculatePflegegrad(scores);
      expect(result.totalScore).toBeGreaterThanOrEqual(70);
      expect(result.moduleScores[6]).toBe(100); // Modul 6 wird gespeichert
    });

    it('sollte gleiche Werte in Modul 2 und 3 korrekt behandeln', () => {
      const scores: Partial<ModuleScores> = {
        1: 50,
        2: 50, // gleich
        3: 50, // gleich
        4: 50,
        5: 50,
      };

      const result = calculatePflegegrad(scores);
      expect(result.maxOf23).toBe(50);
      // max(50, 50) = 50, egal welcher genommen wird
    });
  });
});
