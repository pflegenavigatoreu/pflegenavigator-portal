// Schwerbehindertenausweis (GdB) - Antrag beim Versorgungsamt
// PflegeNavigator EU - Bei Pflegegrad 3+ automatisch GdB 50+ möglich

export interface SchwerbehindertenausweisData {
  empfaenger: {
    name: string; // z.B. "Versorgungsamt Bielefeld"
    strasse: string;
    plz: string;
    ort: string;
  };
  antragsteller: {
    name: string;
    strasse: string;
    plz: string;
    ort: string;
    telefon: string;
    geburtsdatum: string;
    staatsangehoerigkeit: string;
    beruf: string;
    versichertennummer?: string;
  };
  // Gesundheitliche Einschränkungen
  behinderungen: {
    krankheit: string;
    icd10?: string;
    seit: string;
    voraussichtlich_dauerhaft: boolean;
    behandelnder_arzt: string;
  }[];
  // GdB (Grad der Behinderung)
  angestrebter_gdb: number; // 20, 30, 40, 50, 60, 70, 80, 90, 100
  pflegegrad?: string; // z.B. "Pflegegrad 3"
  // Merkzeichen (wenn GdB 50+)
  merkzeichen?: {
    aG?: boolean; // außergewöhnliche Gehbehinderung
    Bl?: boolean; // Blind
    Gl?: boolean; // Gehörlos
    H?: boolean; // Hilflos
    B?: boolean; // Begleitung erforderlich
    G?: boolean; // Gleichgestellt (Schwerbehindertenausweis)
    RF?: boolean; // Rufen/Finden
    T?: boolean; // Tätigkeit nicht möglich
    Tb?: boolean; // Tageszeitenabhängig
    GdS?: boolean; // Gaststättenrecht
  };
  // Berufliche Einschränkungen
  berufseinschraenkungen?: string[];
  // Vorsorge
  vorsorge_untersuchungen?: boolean;
  begruendung?: string;
  anlagen?: string[];
}

export const SCHWERBEHINDERTENAUSWEIS_PARAGRAPHEN = {
  sgb_ix_2: {
    paragraph: "§ 2 SGB IX",
    titel: "Schwerbehinderte Menschen",
    text: "Schwerbehindert ist, wer einen Grad der Behinderung (GdB) von mindestens 50 hat",
  },
  sgb_ix_3: {
    paragraph: "§ 3 SGB IX",
    titel: "Feststellung der Behinderung",
    text: "Das Versorgungsamt stellt den GdB auf Antrag fest",
  },
  sgb_ix_4: {
    paragraph: "§ 4 SGB IX",
    titel: "Merkzeichen",
    text: "Besondere Auswirkungen der Behinderung werden durch Merkzeichen gekennzeichnet",
  },
  sgb_ix_33: {
    paragraph: "§ 33 SGB IX",
    titel: "Nachteilsausgleich im öffentlichen Dienst",
    text: "Schwerbehinderte haben Anspruch auf Einstellung und verstärkten Kündigungsschutz",
  },
  sgb_ix_34: {
    paragraph: "§ 34 SGB IX",
    titel: "Vergünstigungen für Schwerbehinderte",
    text: "Freifahrt, Steuerermäßigung, Parkausweis, etc.",
  },
  sgb_v_24: {
    paragraph: "§ 24 SGB V",
    titel: "Vorsorgeuntersuchungen",
    text: "Schwerbehinderte haben Anspruch auf Vorsorgeuntersuchungen",
  },
};

// GdB-Tabelle für häufige Krankheiten
export const GDB_LEITLINIEN = {
  pflegegrad_1: { gdb: 20, merkzeichen: [] },
  pflegegrad_2: { gdb: 40, merkzeichen: [] },
  pflegegrad_3: { gdb: 50, merkzeichen: ['G'] },
  pflegegrad_4: { gdb: 70, merkzeichen: ['G', 'aG'] },
  pflegegrad_5: { gdb: 90, merkzeichen: ['G', 'aG', 'H'] },
  // Häufige Krankheiten
  diabetes_mellitus: { gdb: 20, merkzeichen: [] },
  bluthochdruck: { gdb: 20, merkzeichen: [] },
  depression_mittelgradig: { gdb: 30, merkzeichen: [] },
  depression_schwer: { gdb: 50, merkzeichen: ['G'] },
  krebs_in_behandlung: { gdb: 50, merkzeichen: ['G'] },
  herzinsuffizienz_nyha_3: { gdb: 50, merkzeichen: ['G'] },
  herzinsuffizienz_nyha_4: { gdb: 80, merkzeichen: ['G', 'aG'] },
  schlaganfall_mit_folgen: { gdb: 60, merkzeichen: ['G', 'aG'] },
  parkinson: { gdb: 60, merkzeichen: ['G', 'aG'] },
  multiple_sklerose: { gdb: 70, merkzeichen: ['G', 'aG'] },
};

export class SchwerbehindertenausweisGenerator {

  generateBrief(data: SchwerbehindertenausweisData): string {
    const heute = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    let brief = `${data.antragsteller.name}
${data.antragsteller.strasse}
${data.antragsteller.plz} ${data.antragsteller.ort}
Tel.: ${data.antragsteller.telefon}


${data.empfaenger.name}
${data.empfaenger.strasse}
${data.empfaenger.plz} ${data.empfaenger.ort}


${data.antragsteller.ort}, den ${heute}


Betreff: Antrag auf Feststellung einer Behinderung (GdB) gemäß § 2 SGB IX


Sehr geehrte Damen und Herren,

hiermit stelle ich Antrag auf Feststellung eines Grades der Behinderung (GdB) und Ausstellung eines Schwerbehindertenausweises.


1. PERSÖNLICHE DATEN

Name: ${data.antragsteller.name}
Geburtsdatum: ${data.antragsteller.geburtsdatum}
Staatsangehörigkeit: ${data.antragsteller.staatsangehoerigkeit}
Beruf: ${data.antragsteller.beruf}
${data.antragsteller.versichertennummer ? `Versichertennummer: ${data.antragsteller.versichertennummer}` : ''}


2. BEHINDERUNGEN UND KRANKHEITEN

`;

    data.behinderungen.forEach((behinderung, index) => {
      brief += `${index + 1}. ${behinderung.krankheit}${behinderung.icd10 ? ` (ICD-10: ${behinderung.icd10})` : ''}
- Besteht seit: ${behinderung.seit}
- Voraussichtlich dauerhaft: ${behinderung.voraussichtlich_dauerhaft ? 'Ja' : 'Nein'}
- Behandelnder Arzt: ${behinderung.behandelnder_arzt}

`;
    });

    if (data.pflegegrad) {
      brief += `3. PFLAGEGRAD

Aktuell eingestuft in: ${data.pflegegrad}
`;
      // Automatische GdB-Empfehlung
      const pflegegradNummer = data.pflegegrad.match(/\d+/)?.[0];
      if (pflegegradNummer) {
        const leitlinie = GDB_LEITLINIEN[`pflegegrad_${pflegegradNummer}` as keyof typeof GDB_LEITLINIEN];
        if (leitlinie) {
          brief += `
Hinweis: Bei ${data.pflegegrad} wird in der Regel ein GdB von ${leitlinie.gdb} festgestellt.
`;
        }
      }
    }

    brief += `

4. ANGESTREBTER GRAD DER BEHINDERUNG

Ich beantrage die Feststellung eines GdB von ${data.angestrebter_gdb}.
`;

    if (data.angestrebter_gdb >= 50) {
      brief += `
Mit einem GdB von ${data.angestrebter_gdb} wäre ich schwerbehindert im Sinne des § 2 SGB IX.
`;
    }

    if (data.merkzeichen) {
      const aktiveMerkzeichen = Object.entries(data.merkzeichen)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      
      if (aktiveMerkzeichen.length > 0) {
        brief += `

5. BEANTRAGTE MERKZEICHEN

`;
        const merkzeichenBedeutungen: Record<string, string> = {
          aG: 'aG = außergewöhnliche Gehbehinderung (schwere dauerhafte Beeinträchtigung der Bewegungsfähigkeit)',
          Bl: 'Bl = Blind (Sehbehinderung)',
          Gl: 'Gl = Gehörlos (Schwerhörigkeit)',
          H: 'H = Hilflos (Hilfe bei Verrichtungen des täglichen Lebens)',
          B: 'B = Begleitung erforderlich (ständige Begleitung notwendig)',
          G: 'G = Gleichstellung mit Schwerbehinderten (bei GdB 50-100)',
          RF: 'RF = Rufen/Finden (Mobilitätseinschränkung)',
          T: 'T = Tätigkeit nicht möglich (Zeitaufwand für Wege)',
          Tb: 'Tb = Tageszeitenabhängig (nur zu bestimmten Zeiten möglich)',
          GdS: 'GdS = Gaststättenrecht (Schwerbehindertengleichstellung nach Gaststättenrecht)',
        };
        
        aktiveMerkzeichen.forEach(mz => {
          brief += `- ${merkzeichenBedeutungen[mz] || mz}
`;
        });
      }
    }

    if (data.berufseinschraenkungen && data.berufseinschraenkungen.length > 0) {
      brief += `

6. BERUFLICHE EINSCHRÄNKUNGEN

Aufgrund meiner Behinderung sind folgende berufliche Einschränkungen gegeben:
`;
      data.berufseinschraenkungen.forEach(einschraenkung => {
        brief += `- ${einschraenkung}
`;
      });
    }

    if (data.begruendung) {
      brief += `

7. BEGRÜNDUNG

${data.begruendung}
`;
    }

    brief += `

8. RECHTLICHE HINWEISE

• ${SCHWERBEHINDERTENAUSWEIS_PARAGRAPHEN.sgb_ix_2.paragraph}: ${SCHWERBEHINDERTENAUSWEIS_PARAGRAPHEN.sgb_ix_2.titel}
• ${SCHWERBEHINDERTENAUSWEIS_PARAGRAPHEN.sgb_ix_3.paragraph}: Feststellung erfolgt durch das Versorgungsamt
• ${SCHWERBEHINDERTENAUSWEIS_PARAGRAPHEN.sgb_ix_33.paragraph}: Nachteilsausgleich bei Bewerbungen (5% Quote)
• ${SCHWERBEHINDERTENAUSWEIS_PARAGRAPHEN.sgb_ix_34.paragraph}: Vergünstigungen (Steuerfreibetrag, Parkausweis, etc.)
`;

    if (data.vorsorge_untersuchungen) {
      brief += `
• ${SCHWERBEHINDERTENAUSWEIS_PARAGRAPHEN.sgb_v_24.paragraph}: Ich bitte um Überweisung zur Vorsorgeuntersuchung.
`;
    }

    brief += `

Bitte bestätigen Sie den Eingang meines Antrags und teilen Sie mir den Termin für die Begutachtung mit.


Mit freundlichen Grüßen


_______________________
${data.antragsteller.name}


Anlagen:
`;

    const standardAnlagen = [
      "Kopie des Personalausweises",
      "Ärztliche Befunde und Atteste",
      "Befundberichte der letzten 2 Jahre",
      "Pflegegrad-Bescheid (falls vorhanden)",
    ];

    const alleAnlagen = [...standardAnlagen, ...(data.anlagen || [])];
    alleAnlagen.forEach((anlage, index) => {
      brief += `${index + 1}. ${anlage}
`;
    });

    brief += `


HINWEISE:
• Bearbeitungszeit: 3-6 Monate
• Das Versorgungsamt führt eine Begutachtung durch
• Bei Ablehnung: Widerspruch innerhalb 1 Monat möglich
• Mit GdB 50+: Schwerbehindertenausweis mit 5 Jahren Gültigkeit
• Vergünstigungen: Steuerfreibetrag, Parkausweis, kostenlose Bahnfahrt, etc.
`;

    return brief;
  }

  // Automatische GdB-Empfehlung basierend auf Pflegegrad
  empfehleGdB(pflegegrad: string): { gdb: number; merkzeichen: string[]; begruendung: string } {
    const pflegegradNummer = pflegegrad.match(/\d+/)?.[0];
    if (!pflegegradNummer) {
      return { gdb: 50, merkzeichen: ['G'], begruendung: 'Standard-Empfehlung bei unklarem Pflegegrad' };
    }

    const leitlinie = GDB_LEITLINIEN[`pflegegrad_${pflegegradNummer}` as keyof typeof GDB_LEITLINIEN];
    if (leitlinie) {
      return {
        gdb: leitlinie.gdb,
        merkzeichen: leitlinie.merkzeichen,
        begruendung: `Bei ${pflegegrad} wird in der Regel ein GdB von ${leitlinie.gdb} festgestellt.`,
      };
    }

    return { gdb: 50, merkzeichen: ['G'], begruendung: 'Empfohlener Mindest-GdB bei Pflegebedürftigkeit' };
  }

  // Schnell-Generator
  generateQuickAntrag(
    antragsteller: SchwerbehindertenausweisData['antragsteller'],
    pflegegrad: string
  ): string {
    const empfehlung = this.empfehleGdB(pflegegrad);
    
    return this.generateBrief({
      empfaenger: {
        name: "Versorgungsamt",
        strasse: "[Adresse eintragen]",
        plz: "[PLZ]",
        ort: "[Ort]"
      },
      antragsteller,
      behinderungen: [
        {
          krankheit: "Pflegebedürftigkeit",
          seit: "[Datum]",
          voraussichtlich_dauerhaft: true,
          behandelnder_arzt: "[Arztname]",
        }
      ],
      angestrebter_gdb: empfehlung.gdb,
      pflegegrad,
      merkzeichen: { G: true },
    });
  }
}

export const schwerbehindertenausweisGenerator = new SchwerbehindertenausweisGenerator();
