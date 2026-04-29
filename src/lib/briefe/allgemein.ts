// Allgemeiner Brief-Generator für Behörden, Universitäten, Versicherungen
// PflegeNavigator EU - Universal Brief-Baukasten

export interface AllgemeinerBriefData {
  empfaenger: {
    name: string;
    strasse?: string;
    plz?: string;
    ort?: string;
    referenz?: string;  // z.B. Aktenzeichen, Kundennummer
    ansprechpartner?: string;
    abteilung?: string;
  };
  absender: {
    name: string;
    strasse: string;
    plz: string;
    ort: string;
    telefon?: string;
    email?: string;
    kundennummer?: string;
  };
  brief: {
    betreff: string;
    art: 'antrag' | 'beschwerde' | 'kuendigung' | 'anfrage' | 'widerspruch' | 'kuendigung' | 'mitteilung';
    inhalt: string;
    frist?: string;
    eilbeduerftig?: boolean;
  };
  anlagen?: string[];
}

// Vorlagen für verschiedene Behörden-/Institutionen-Typen
export const BEHOERDEN_VORLAGEN = {
  uni_pruefungsamt: {
    betreff_muster: "Antrag auf {aktion} - Studierende/r {name}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "hiermit beantrage ich als immatrikulierte/r Studierende/r {aktion}.",
    pflicht_anlagen: ["Studierendenausweis", "Immatrikulationsbescheinigung"],
  },
  versicherung_kranken: {
    betreff_muster: "{aktion} - Versicherte/r {name}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "bezüglich meiner Mitgliedschaft beantrage/widerspreche ich folgendes:",
    pflicht_anlagen: ["Versicherungskarte", "Ärztliche Bescheinigung"],
  },
  finanzamt: {
    betreff_muster: "{aktion} - Steuer-Nr. {nummer}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "in Steuersache {nummer} erlaube ich mir folgendes mitzuteilen:",
    pflicht_anlagen: ["Lohnsteuerkarte", "Belege"],
  },
  amt_gericht: {
    betreff_muster: "{aktion} - AZ: {aktenzeichen}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "in Sachen {aktenzeichen} erlaube ich mir folgendes vorzutragen:",
    pflicht_anlagen: ["Vollmacht", "Bescheid"],
  },
  vermieter: {
    betreff_muster: "{aktion} - Mietverhältnis {adresse}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "als Mieter/in der Wohnung {adresse} teile ich folgendes mit:",
    pflicht_anlagen: ["Mietvertrag", "Übergabeprotokoll"],
  },
  arbeitgeber: {
    betreff_muster: "{aktion} - Personal-Nr. {nummer}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "als Arbeitnehmer/in beantrage/widerspreche ich:",
    pflicht_anlagen: ["Arbeitsvertrag", "Lohnabrechnung"],
  },
  inkasso: {
    betreff_muster: "Widerspruch gegen Forderung - AZ: {nummer}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "ich bestreite die Forderung aus folgenden Gründen:",
    pflicht_anlagen: ["Zahlungsnachweise", "Widerspruchsbegründung"],
  },
  verbraucherschutz: {
    betreff_muster: "Beschwerde über {unternehmen}",
    anrede: "Sehr geehrte Damen und Herren",
    einleitung: "hiermit beschwere ich mich über folgende Praktiken:",
    pflicht_anlagen: ["Vertrag", "Korrespondenz"],
  }
};

// Briefarten mit rechtlichen Hinweisen
export const BRIEFARTEN_INFO = {
  antrag: {
    label: "Antrag",
    rechtshinweis: "Anträge müssen schriftlich erfolgen (§ 14 SGB I)",
    frist_relevant: true,
  },
  beschwerde: {
    label: "Beschwerde",
    rechtshinweis: "Beschwerden sollten begründet sein",
    frist_relevant: false,
  },
  widerspruch: {
    label: "Widerspruch",
    rechtshinweis: "Widerspruchsfrist: 1 Monat (§ 78 SGB X)",
    frist_relevant: true,
  },
  kuendigung: {
    label: "Kündigung",
    rechtshinweis: "Beachten Sie Kündigungsfristen",
    frist_relevant: true,
  },
  anfrage: {
    label: "Anfrage",
    rechtshinweis: "Anfragen nach VwVfG/IFG",
    frist_relevant: false,
  },
  mitteilung: {
    label: "Mitteilung",
    rechtshinweis: "Informationspflichten beachten",
    frist_relevant: false,
  }
};

export class AllgemeinerBriefGenerator {

  generateBrief(data: AllgemeinerBriefData): string {
    const heute = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const briefArt = BRIEFARTEN_INFO[data.brief.art];
    const eilmarker = data.brief.eilbeduerftig ? '\\n\\n*EILT*' : '';
    const fristText = data.brief.frist ? `\\n\\nFrist: ${data.brief.frist}` : '';

    let brief = `\\
${data.absender.name}\\
${data.absender.strasse}\\
${data.absender.plz} ${data.absender.ort}\\
`;

    if (data.absender.telefon || data.absender.email) {
      brief += `\\n`;
      if (data.absender.telefon) brief += `Tel.: ${data.absender.telefon}\\n`;
      if (data.absender.email) brief += `E-Mail: ${data.absender.email}\\n`;
    }

    brief += `\\
\\
\\
`;

    // Empfänger
    if (data.empfaenger.name) {
      brief += `${data.empfaenger.name}\\n`;
    }
    if (data.empfaenger.abteilung) {
      brief += `z. Hd. ${data.empfaenger.abteilung}\\n`;
    }
    if (data.empfaenger.ansprechpartner) {
      brief += `z. Hd. ${data.empfaenger.ansprechpartner}\\n`;
    }
    if (data.empfaenger.strasse) {
      brief += `${data.empfaenger.strasse}\\n`;
    }
    if (data.empfaenger.plz && data.empfaenger.ort) {
      brief += `${data.empfaenger.plz} ${data.empfaenger.ort}\\n`;
    }
    if (data.empfaenger.referenz) {
      brief += `\\nAktenzeichen: ${data.empfaenger.referenz}\\n`;
    }

    brief += `\\
\\
${data.absender.ort}, den ${heute}\\
\\
\\
Betreff: ${data.brief.betreff}${eilmarker}${fristText}\\
\\
\\
Sehr geehrte Damen und Herren,\\
\\
${data.brief.inhalt}\\
\\
`;

    // Rechtshinweis bei wichtigen Arten
    if (briefArt?.rechtshinweis) {
      brief += `\\nHinweis: ${briefArt.rechtshinweis}\\
`;
    }

    brief += `\\
\\
Mit freundlichen Grüßen\\
\\
\\
_______________________\\
${data.absender.name}\\
`;

    // Anlagen
    const anlagen = data.anlagen || [];
    if (anlagen.length > 0) {
      brief += `\\n\\nAnlagen:\
`;
      anlagen.forEach(anlage => {
        brief += `- ${anlage}\\n`;
      });
    }

    return brief;
  }

  // Spezialisierte Generatoren
  generateUniBrief(
    uniDaten: AllgemeinerBriefData['empfaenger'],
    studiDaten: AllgemeinerBriefData['absender'],
    aktion: string,
    begruendung: string
  ): string {
    return this.generateBrief({
      empfaenger: uniDaten,
      absender: studiDaten,
      brief: {
        betreff: `Antrag auf ${aktion}`,
        art: 'antrag',
        inhalt: `als immatrikulierte/r Studierende/r beantrage ich hiermit ${aktion}.\\
\\
Begründung:\
${begruendung}`
      },
      anlagen: BEHOERDEN_VORLAGEN.uni_pruefungsamt.pflicht_anlagen
    });
  }

  generateVersicherungBrief(
    versicherung: AllgemeinerBriefData['empfaenger'],
    versicherter: AllgemeinerBriefData['absender'],
    anliegen: string,
    art: 'antrag' | 'widerspruch' = 'antrag'
  ): string {
    return this.generateBrief({
      empfaenger: versicherung,
      absender: versicherter,
      brief: {
        betreff: `${art === 'widerspruch' ? 'Widerspruch' : 'Antrag'} - ${anliegen}`,
        art,
        inhalt: `bezüglich meiner Mitgliedschaft (${versicherter.kundennummer ? `Versicherten-Nr. ${versicherter.kundennummer}` : ''}) ${art === 'widerspruch' ? 'widerspreche' : 'beantrage'} ich hiermit folgendes:\
\\
${anliegen}`
      },
      anlagen: BEHOERDEN_VORLAGEN.versicherung_kranken.pflicht_anlagen
    });
  }

  generateWiderspruch(
    empfaenger: AllgemeinerBriefData['empfaenger'],
    absender: AllgemeinerBriefData['absender'],
    gegenstand: string,
    begruendung: string,
    bescheiddatum: string
  ): string {
    const fristBis = new Date();
    fristBis.setMonth(fristBis.getMonth() + 1);
    
    return this.generateBrief({
      empfaenger,
      absender,
      brief: {
        betreff: `Widerspruch gegen ${gegenstand}`,
        art: 'widerspruch',
        inhalt: `lege ich hiermit fristgerecht Widerspruch ein gegen den Bescheid vom ${bescheiddatum} betreffend ${gegenstand}.\\
\\
Begründung:\
${begruendung}\\
\\
Ich bitte um schriftliche Bestätigung des Eingangs und aufschiebende Wirkung gemäß § 80 VwGO.`,
        frist: `Widerspruchsfrist bis ${fristBis.toLocaleDateString('de-DE')}`,
        eilbeduerftig: true
      },
      anlagen: ["Bescheid (Kopie)", "Widerspruchsbegründung"]
    });
  }

  // AI-Vorschläge
  async getAIvorschlaege(briefArt: string, kontext: string): Promise<string[]> {
    return [
      `Formulierungsvorschlag für ${briefArt}: "Hiermit beantrage ich..."`,
      `Rechtlicher Hinweis: Beachten Sie §...`,
      `Empfohlene Anlage: Kopie des...`
    ];
  }
}

export const allgemeinerBriefGenerator = new AllgemeinerBriefGenerator();
