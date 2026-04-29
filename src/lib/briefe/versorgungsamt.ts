// Brief-Generator für Sozialamt / Versorgungsamt
// PflegeNavigator EU - Offizielle Brief-Vorlagen

export interface BriefData {
  empfaenger: {
    name: string;
    strasse: string;
    plz: string;
    ort: string;
  };
  antragsteller: {
    name: string;
    strasse: string;
    plz: string;
    ort: string;
    geburtsdatum: string;
    telefon?: string;
    email?: string;
  };
  pflegebeduerftiger?: {
    name: string;
    geburtsdatum: string;
    pflegegrad?: string;
  };
  inhalt: {
    betreff: string;
    antragsgrund: string;
    dringlichkeit?: 'normal' | 'hoch' | 'sehr_hoch';
    besonderheiten?: string[];
  };
}

// Muster-Vorlagen für Versorgungsamt/Sozialamt
export const MUSTER_VORLAGEN = {
  pflegegeld_antrag: {
    betreff: "Antrag auf Pflegegeld nach SGB XI",
    einleitung: "hiermit stelle ich Antrag auf Pflegegeld gemäß § 37 Sozialgesetzbuch XI.",
    paragraphen: ["§ 37 SGB XI", "§ 14 SGB XI"],
  },
  pflegegrad_pruefung: {
    betreff: "Antrag auf Überprüfung des Pflegegrades",
    einleitung: "hiermit beantrage ich eine Überprüfung meines aktuellen Pflegegrades.",
    paragraphen: ["§ 18 SGB XI"],
  },
  hilfsmittel_antrag: {
    betreff: "Antrag auf Hilfsmittel/Haushaltshilfe",
    einleitung: "hiermit stelle ich Antrag auf Bewilligung von Hilfsmitteln/Haushaltshilfe.",
    paragraphen: ["§ 40 SGB XI", "§ 45 SGB XI"],
  },
  widerspruch: {
    betreff: "Widerspruch gegen Bescheid vom {datum}",
    einleitung: "lege ich hiermit fristgerecht Widerspruch ein gegen den Bescheid vom {datum}.",
    paragraphen: ["§ 78 SGB X"],
  },
  vollmacht: {
    betreff: "Vollmacht für Pflegeantrags-Stellvertretung",
    einleitung: "erteile ich hiermit Vollmacht zur Antragsstellung und Korrespondenz.",
    paragraphen: [],
  },
  dringlichkeit_akut: {
    betreff: "Dringender Antrag - Akute Pflegesituation",
    einleitung: "liegt eine akute Pflegebedürftigkeit vor. Eine zügige Bearbeitung wird dringend gebeten.",
    paragraphen: ["§ 13 SGB XI"],
  }
};

export class VersorgungsamtBriefGenerator {
  
  generateBrief(data: BriefData): string {
    const heute = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const dringlichkeitText = this.getDringlichkeitText(data.inhalt.dringlichkeit);
    
    const brief = `\\
${data.antragsteller.name}\\
${data.antragsteller.strasse}\\
${data.antragsteller.plz} ${data.antragsteller.ort}\\
\\
\\
${data.empfaenger.name}\\
${data.empfaenger.strasse}\\
${data.empfaenger.plz} ${data.empfaenger.ort}\\
\\
\\
${data.antragsteller.ort}, den ${heute}\\
\\
\\
Betreff: ${data.inhalt.betreff}${dringlichkeitText}\\
\\
\\
Sehr geehrte Damen und Herren,\\
\\
${this.generateEinleitung(data)}\\
\\
${this.generateHauptteil(data)}\\
\\
${this.generateSchluss(data)}\\
\\
\\
Mit freundlichen Grüßen\\
\\
\\
_______________________\\
${data.antragsteller.name}\\
\\
\\
Anlagen:\\
${this.generateAnlagen(data)}\\
`;

    return brief;
  }

  private getDringlichkeitText(dringlichkeit?: string): string {
    switch(dringlichkeit) {
      case 'sehr_hoch': return '\\n\\n*** DRINGEND - AKUTE SITUATION ***';
      case 'hoch': return '\\n\\n*Eilbedürftig*';
      default: return '';
    }
  }

  private generateEinleitung(data: BriefData): string {
    const vorlage = MUSTER_VORLAGEN.pflegegeld_antrag;
    return vorlage.einleitung;
  }

  private generateHauptteil(data: BriefData): string {
    let text = data.inhalt.antragsgrund;
    
    if (data.pflegebeduerftiger && data.pflegebeduerftiger.name !== data.antragsteller.name) {
      text += `\\n\\nIch pflege ${data.pflegebeduerftiger.name}`;
      if (data.pflegebeduerftiger.geburtsdatum) {
        text += ` (geb. ${data.pflegebeduerftiger.geburtsdatum})`;
      }
      if (data.pflegebeduerftiger.pflegegrad) {
        text += `\\nAktueller Pflegegrad: ${data.pflegebeduerftiger.pflegegrad}`;
      }
    }

    if (data.inhalt.besonderheiten?.length) {
      text += `\\n\\nBesondere Umstände:`;
      data.inhalt.besonderheiten.forEach(b => {
        text += `\\n- ${b}`;
      });
    }

    return text;
  }

  private generateSchluss(data: BriefData): string {
    return `\\nIch bitte um zügige Bearbeitung meines Antrags.\\
\\
Kontakt: ${data.antragsteller.telefon || 'Tel. siehe Briefkopf'}`;
  }

  private generateAnlagen(data: BriefData): string {
    const anlagen = [
      "Kopie Personalausweis",
      "Ärztliche Bescheinigung",
      "Pflegegrad-Bescheid (falls vorhanden)"
    ];
    
    return anlagen.join("\\n- ");
  }

  // AI-generierte Brief-Erweiterung
  async generateMitAI(data: BriefData, aiEnhancement: string): Promise<string> {
    const basisBrief = this.generateBrief(data);
    return `${basisBrief}\\n\\n--- AI-Optimierter Abschnitt ---\\n${aiEnhancement}`;
  }
}

export const versorgungsamtGenerator = new VersorgungsamtBriefGenerator();
