import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AllgemeinerBriefGenerator,
  AllgemeinerBriefData,
  BEHOERDEN_VORLAGEN,
  BRIEFARTEN_INFO,
  allgemeinerBriefGenerator,
} from '../allgemein';

describe('Allgemeiner Brief Generator', () => {
  let generator: AllgemeinerBriefGenerator;

  beforeEach(() => {
    generator = new AllgemeinerBriefGenerator();
  });

  // ============================================
  // Basis-Brief Generierung
  // ============================================
  describe('generateBrief', () => {
    const mockData: AllgemeinerBriefData = {
      empfaenger: {
        name: 'Sozialamt Musterstadt',
        strasse: 'Behördenweg 1',
        plz: '12345',
        ort: 'Musterstadt',
        referenz: 'AZ-2024-001',
        ansprechpartner: 'Herr Müller',
        abteilung: 'Sozialabteilung',
      },
      absender: {
        name: 'Max Mustermann',
        strasse: 'Musterstraße 1',
        plz: '12345',
        ort: 'Musterstadt',
        telefon: '01234-567890',
        email: 'max@example.com',
        kundennummer: 'KN123456',
      },
      brief: {
        betreff: 'Antrag auf Pflegeleistungen',
        art: 'antrag',
        inhalt: 'ich stelle hiermit einen Antrag auf Pflegeleistungen.',
        frist: '01.06.2024',
        eilbeduerftig: true,
      },
      anlagen: ['Antragsformular', 'Ärztliches Attest', 'Kopie des Personalausweises'],
    };

    it('sollte einen vollständigen Brief generieren', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain(mockData.absender.name);
      expect(brief).toContain(mockData.absender.strasse);
      expect(brief).toContain(mockData.empfaenger.name);
      expect(brief).toContain(mockData.brief.betreff);
      expect(brief).toContain(mockData.brief.inhalt);
      expect(brief).toContain('Sehr geehrte Damen und Herren');
    });

    it('sollte Absender-Daten korrekt formatieren', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('Max Mustermann');
      expect(brief).toContain('Musterstraße 1');
      expect(brief).toContain('12345 Musterstadt');
    });

    it('sollte Empfänger-Daten korrekt formatieren', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('Sozialamt Musterstadt');
      expect(brief).toContain('z. Hd. Sozialabteilung');
      expect(brief).toContain('z. Hd. Herr Müller');
      expect(brief).toContain('Behördenweg 1');
      expect(brief).toContain('Aktenzeichen: AZ-2024-001');
    });

    it('sollte Kontaktdaten des Absenders einfügen', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('Tel.: 01234-567890');
      expect(brief).toContain('E-Mail: max@example.com');
    });

    it('sollte aktuelles Datum verwenden', () => {
      const brief = generator.generateBrief(mockData);
      const heute = new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      expect(brief).toContain(heute);
    });

    it('sollte EILT-Marker bei eilbedürftigen Briefen anzeigen', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('*EILT*');
    });

    it('sollte Fristtext einfügen', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('Frist: 01.06.2024');
    });

    it('sollte rechtlichen Hinweis für Anträge einfügen', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('Hinweis:');
      expect(brief).toContain(BRIEFARTEN_INFO.antrag.rechtshinweis);
    });

    it('sollte alle Anlagen auflisten', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('Anlagen:');
      expect(brief).toContain('Antragsformular');
      expect(brief).toContain('Ärztliches Attest');
      expect(brief).toContain('Kopie des Personalausweises');
    });

    it('sollte Grußformel und Unterschrift enthalten', () => {
      const brief = generator.generateBrief(mockData);

      expect(brief).toContain('Mit freundlichen Grüßen');
      expect(brief).toContain('Max Mustermann');
    });

    it('sollte ohne optionale Felder funktionieren', () => {
      const minimalData: AllgemeinerBriefData = {
        empfaenger: {
          name: 'Finanzamt',
        },
        absender: {
          name: 'Erika Muster',
          strasse: 'Teststraße 1',
          plz: '12345',
          ort: 'Testort',
        },
        brief: {
          betreff: 'Steuererklärung',
          art: 'mitteilung',
          inhalt: 'ich reiche meine Steuererklärung ein.',
        },
      };

      const brief = generator.generateBrief(minimalData);

      expect(brief).toContain('Erika Muster');
      expect(brief).toContain('Finanzamt');
      expect(brief).not.toContain('undefined');
    });
  });

  // ============================================
  // Briefarten
  // ============================================
  describe('Briefarten', () => {
    it('sollte Widerspruch mit korrektem Hinweis generieren', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Behörde' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Widerspruch',
          art: 'widerspruch',
          inhalt: 'ich lege Widerspruch ein.',
          frist: '15.03.2024',
          eilbeduerftig: true,
        },
      };

      const brief = generator.generateBrief(data);

      expect(brief).toContain('Widerspruchsfrist: 1 Monat');
      expect(brief).toContain('§ 78 SGB X');
    });

    it('sollte Kündigung mit Hinweis generieren', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Versicherung' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Kündigung',
          art: 'kuendigung',
          inhalt: 'ich kündige meinen Vertrag.',
          frist: 'zum nächstmöglichen Termin',
        },
      };

      const brief = generator.generateBrief(data);

      expect(brief).toContain('Kündigungsfristen');
    });

    it('sollte Beschwerde ohne Frist-Hinweis generieren', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Service' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Beschwerde',
          art: 'beschwerde',
          inhalt: 'ich beschwere mich.',
        },
      };

      const brief = generator.generateBrief(data);

      expect(brief).not.toContain('Frist:');
      expect(brief).toContain('Beschwerden sollten begründet sein');
    });
  });

  // ============================================
  // Spezialisierte Generatoren
  // ============================================
  describe('Spezialisierte Generatoren', () => {
    it('sollte Uni-Brief mit Studenten-Vorlage generieren', () => {
      const uniDaten = {
        name: 'Prüfungsamt Universität',
        strasse: 'Universitätsstraße 1',
        plz: '12345',
        ort: 'Uni-Stadt',
      };

      const studiDaten = {
        name: 'Max Studi',
        strasse: 'Studentenweg 5',
        plz: '12345',
        ort: 'Uni-Stadt',
        telefon: '0123-456789',
        email: 'max@uni.de',
      };

      const brief = generator.generateUniBrief(
        uniDaten,
        studiDaten,
        'Urlaubssemester',
        'Ich muss aus gesundheitlichen Gründen pausieren.'
      );

      expect(brief).toContain('Prüfungsamt Universität');
      expect(brief).toContain('Max Studi');
      expect(brief).toContain('Urlaubssemester');
      expect(brief).toContain('immatrixulierte/r Studierende/r');
      expect(brief).toContain('gesundheitlichen Gründen');
      expect(brief).toContain('Studierendenausweis');
    });

    it('sollte Versicherungs-Brief generieren', () => {
      const versicherung = {
        name: 'AOK Musterstadt',
        strasse: 'Versicherungsweg 10',
        plz: '12345',
        ort: 'Musterstadt',
      };

      const versicherter = {
        name: 'Erika Gesund',
        strasse: 'Gesundheitsstraße 3',
        plz: '12345',
        ort: 'Musterstadt',
        kundennummer: 'AOK123456',
      };

      const brief = generator.generateVersicherungBrief(
        versicherung,
        versicherter,
        'Kostenübernahme für Physiotherapie',
        'antrag'
      );

      expect(brief).toContain('AOK Musterstadt');
      expect(brief).toContain('Erika Gesund');
      expect(brief).toContain('Versicherten-Nr. AOK123456');
      expect(brief).toContain('Kostenübernahme für Physiotherapie');
      expect(brief).toContain('Versicherungskarte');
    });

    it('sollte Versicherungs-Widerspruch generieren', () => {
      const versicherung = { name: 'TK' };
      const versicherter = {
        name: 'Test',
        strasse: 'Test 1',
        plz: '12345',
        ort: 'Test',
      };

      const brief = generator.generateVersicherungBrief(
        versicherung,
        versicherter,
        'Ablehnung der Kostenübernahme',
        'widerspruch'
      );

      expect(brief).toContain('Widerspruch');
    });

    it('sollte Widerspruchs-Brief mit Frist berechnen', () => {
      const empfaenger = { name: 'Jobcenter' };
      const absender = {
        name: 'Arbeitsloser',
        strasse: 'Arbeitsweg 1',
        plz: '12345',
        ort: 'Stadt',
      };

      const brief = generator.generateWiderspruch(
        empfaenger,
        absender,
        'Leistungsablehnung vom 01.01.2024',
        'Die Ablehnung war nicht gerechtfertigt.',
        '01.01.2024'
      );

      expect(brief).toContain('Widerspruch gegen Leistungsablehnung vom 01.01.2024');
      expect(brief).toContain('fristgerecht');
      expect(brief).toContain('Begründung');
      expect(brief).toContain('aufschiebende Wirkung');
      expect(brief).toContain('§ 80 VwGO');
      expect(brief).toContain('Widerspruchsfrist bis');

      // Frist sollte ca. 1 Monat in der Zukunft sein
      const fristMatch = brief.match(/Widerspruchsfrist bis (\d{2}\.\d{2}\.\d{4})/);
      expect(fristMatch).toBeTruthy();
    });
  });

  // ============================================
  // Behörden-Vorlagen
  // ============================================
  describe('BEHOERDEN_VORLAGEN', () => {
    it('sollte alle 8 Vorlagen haben', () => {
      expect(Object.keys(BEHOERDEN_VORLAGEN)).toHaveLength(8);
    });

    it('sollte Uni-Vorlage mit Pflichtanlagen haben', () => {
      const vorlage = BEHOERDEN_VORLAGEN.uni_pruefungsamt;

      expect(vorlage.anrede).toBe('Sehr geehrte Damen und Herren');
      expect(vorlage.pflicht_anlagen).toContain('Studierendenausweis');
      expect(vorlage.pflicht_anlagen).toContain('Immatrikulationsbescheinigung');
    });

    it('sollte Finanzamt-Vorlage haben', () => {
      const vorlage = BEHOERDEN_VORLAGEN.finanzamt;

      expect(vorlage.betreff_muster).toContain('Steuer-Nr.');
      expect(vorlage.pflicht_anlagen).toContain('Lohnsteuerkarte');
    });

    it('sollte Gerichts-Vorlage haben', () => {
      const vorlage = BEHOERDEN_VORLAGEN.amt_gericht;

      expect(vorlage.betreff_muster).toContain('AZ:');
      expect(vorlage.einleitung).toContain('in Sachen');
    });

    it('sollte Inkasso-Vorlage haben', () => {
      const vorlage = BEHOERDEN_VORLAGEN.inkasso;

      expect(vorlage.betreff_muster).toContain('Widerspruch gegen Forderung');
      expect(vorlage.einleitung).toContain('bestreite die Forderung');
    });
  });

  // ============================================
  // Briefarten-Info
  // ============================================
  describe('BRIEFARTEN_INFO', () => {
    it('sollte alle 6 Briefarten definieren', () => {
      expect(Object.keys(BRIEFARTEN_INFO)).toHaveLength(6);
    });

    it('sollte Antrag mit rechtlichem Hinweis haben', () => {
      const info = BRIEFARTEN_INFO.antrag;

      expect(info.label).toBe('Antrag');
      expect(info.rechtshinweis).toContain('§ 14 SGB I');
      expect(info.frist_relevant).toBe(true);
    });

    it('sollte Widerspruch mit Frist-Hinweis haben', () => {
      const info = BRIEFARTEN_INFO.widerspruch;

      expect(info.label).toBe('Widerspruch');
      expect(info.rechtshinweis).toContain('1 Monat');
      expect(info.rechtshinweis).toContain('§ 78 SGB X');
    });

    it('sollte fristrelevante Arten markieren', () => {
      expect(BRIEFARTEN_INFO.antrag.frist_relevant).toBe(true);
      expect(BRIEFARTEN_INFO.widerspruch.frist_relevant).toBe(true);
      expect(BRIEFARTEN_INFO.kuendigung.frist_relevant).toBe(true);
    });

    it('sollte nicht-fristrelevante Arten markieren', () => {
      expect(BRIEFARTEN_INFO.beschwerde.frist_relevant).toBe(false);
      expect(BRIEFARTEN_INFO.anfrage.frist_relevant).toBe(false);
      expect(BRIEFARTEN_INFO.mitteilung.frist_relevant).toBe(false);
    });
  });

  // ============================================
  // AI Vorschläge
  // ============================================
  describe('getAIvorschlaege', () => {
    it('sollte Vorschläge für Antrag zurückgeben', async () => {
      const vorschlaege = await generator.getAIvorschlaege('antrag', 'Pflegegeld');

      expect(vorschlaege).toHaveLength(3);
      expect(vorschlaege[0]).toContain('Formulierungsvorschlag');
      expect(vorschlaege[1]).toContain('Rechtlicher Hinweis');
      expect(vorschlaege[2]).toContain('Empfohlene Anlage');
    });

    it('sollte Vorschläge für Widerspruch zurückgeben', async () => {
      const vorschlaege = await generator.getAIvorschlaege('widerspruch', 'Ablehnung');

      expect(vorschlaege.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Singleton-Export
  // ============================================
  describe('Singleton', () => {
    it('sollte als Singleton exportiert sein', () => {
      expect(allgemeinerBriefGenerator).toBeInstanceOf(AllgemeinerBriefGenerator);
    });

    it('sollte mit Singleton Brief generieren können', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Test' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Test',
          art: 'antrag',
          inhalt: 'Test.',
        },
      };

      const brief = allgemeinerBriefGenerator.generateBrief(data);
      expect(brief).toContain('Test');
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe('Edge Cases', () => {
    it('sollte leere Anlagen-Liste verarbeiten', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Test' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Test',
          art: 'antrag',
          inhalt: 'Test.',
        },
        anlagen: [],
      };

      const brief = generator.generateBrief(data);
      expect(brief).toContain('Anlagen:');
    });

    it('sollte ohne Anlagen-Array funktionieren', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Test' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Test',
          art: 'antrag',
          inhalt: 'Test.',
        },
      };

      const brief = generator.generateBrief(data);
      expect(brief).not.toContain('undefined');
    });

    it('sollte EILT nicht anzeigen wenn nicht eilbedürftig', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Test' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Test',
          art: 'antrag',
          inhalt: 'Test.',
          eilbeduerftig: false,
        },
      };

      const brief = generator.generateBrief(data);
      expect(brief).not.toContain('*EILT*');
    });

    it('sollte lange Inhalte korrekt verarbeiten', () => {
      const langerText = 'A'.repeat(5000);
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Test' },
        absender: {
          name: 'Test',
          strasse: 'Test 1',
          plz: '12345',
          ort: 'Test',
        },
        brief: {
          betreff: 'Test',
          art: 'antrag',
          inhalt: langerText,
        },
      };

      const brief = generator.generateBrief(data);
      expect(brief).toContain(langerText);
    });

    it('sollte Sonderzeichen korrekt verarbeiten', () => {
      const data: AllgemeinerBriefData = {
        empfaenger: { name: 'Töst & Cömpany' },
        absender: {
          name: 'Müller-Straßer',
          strasse: 'Größenstraße 1',
          plz: '12345',
          ort: 'Überlingen',
        },
        brief: {
          betreff: 'Änderung: Öffentlichkeit',
          art: 'antrag',
          inhalt: 'Überprüfung der Änderungsänderung.',
        },
      };

      const brief = generator.generateBrief(data);
      expect(brief).toContain('Müller-Straßer');
      expect(brief).toContain('Überlingen');
      expect(brief).toContain('Änderung');
    });
  });
});
