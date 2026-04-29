// Antrag auf Pflegegrad (Erstbeantragung)
// PflegeNavigator EU - MDK-Begutachtung

export interface AntragPflegegradData {
  empfaenger: {
    name: string; // Pflegekasse
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
    telefon: string;
    email?: string;
    versichertennummer: string;
    versicherung: string; // z.B. "AOK Nordost"
    pflegekasse?: string; // falls abweichend
  };
  pflegebeduerftiger?: {
    name: string; // Falls nicht Antragsteller selbst
    geburtsdatum: string;
    anspruchsberechtigter: boolean; // § 14 Abs. 2 SGB XI
    wohnort_gleich: boolean;
  };
  versorgung: {
    hausaerztin?: string;
    behandelnde_aerzte: string[];
    krankenhausaufenthalte_letzte_12_monate?: string[];
    hilfsmittel?: string[];
  };
  pflegesituation: {
    wohnsituation: 'allein' | 'mit_partner' | 'mit_familie' | 'pflegeheim' | 'betreutes_wohnen';
    pflege_durch_angehoerige?: boolean;
    professionelle_pflege_bereits?: boolean;
    beantragte_leistungen: ('beratung' | 'mittel_zur_hilfe' | 'zuschlag_kombination' | 'tages_nachtpflege' | 'vollstationaer')[];
  };
  begruendung: string; // Gesundheitliche Einschränkungen
  anlagen?: string[];
}

export const ANTRAG_PFLEGEGRAD_PARAGRAPHEN = {
  sgb_xi_14: {
    paragraph: "§ 14 SGB XI",
    titel: "Antrag auf Einstufung in einen Pflegegrad",
    text: "Die Einstufung erfolgt auf Antrag. Antragsberechtigt sind die Pflegebedürftige Person und deren Angehörige.",
  },
  sgb_xi_15: {
    paragraph: "§ 15 SGB XI",
    titel: "Begutachtung durch den MDK",
    text: "Der Medizinische Dienst ermittelt den Pflegegrad durch Begutachtung vor Ort",
  },
  sgb_xi_13: {
    paragraph: "§ 13 SGB XI",
    titel: "Leistungen bei Pflegebedürftigkeit",
    text: "Ab Pflegegrad 2 besteht Anspruch auf Leistungen der Pflegeversicherung",
  },
};

export class AntragPflegegradGenerator {

  generateBrief(data: AntragPflegegradData): string {
    const heute = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    let brief = `${data.antragsteller.name}
${data.antragsteller.strasse}
${data.antragsteller.plz} ${data.antragsteller.ort}
Tel.: ${data.antragsteller.telefon}
${data.antragsteller.email ? `E-Mail: ${data.antragsteller.email}` : ''}
Versicherten-Nr.: ${data.antragsteller.versichertennummer}
Geb.: ${data.antragsteller.geburtsdatum}


${data.empfaenger.name}
${data.empfaenger.strasse}
${data.empfaenger.plz} ${data.empfaenger.ort}
${data.antragsteller.pflegekasse && data.antragsteller.pflegekasse !== data.antragsteller.versicherung ? `\n(Pflegekasse bei ${data.antragsteller.versicherung})` : ''}


${data.antragsteller.ort}, den ${heute}


Betreff: Antrag auf Einstufung in einen Pflegegrad gemäß § 14 SGB XI


Sehr geehrte Damen und Herren,

hiermit stelle ich Antrag auf Einstufung in einen Pflegegrad gemäß § 14 Sozialgesetzbuch XI.
`;

    // Fall: Beantragung für Dritten
    if (data.pflegebeduerftiger && data.pflegebeduerftiger.name !== data.antragsteller.name) {
      brief += `

1. ANTRAGSBERECHTIGUNG

Ich beantrage die Einstufung für:
Name: ${data.pflegebeduerftiger.name}
Geburtsdatum: ${data.pflegebeduerftiger.geburtsdatum}
`;

      if (data.pflegebeduerftiger.anspruchsberechtigter) {
        brief += `
Ich bin anspruchsberechtigt nach § 14 Abs. 2 SGB XI (Angehöriger / in häuslicher Gemeinschaft lebend).
`;
      }

      if (!data.pflegebeduerftiger.wohnort_gleich) {
        brief += `
Hinweis: Der/Die Pflegebedürftige lebt nicht an meiner Adresse. Eine Begutachtung ist an deren Wohnort erforderlich.
`;
      }

      brief += `

2. BEGRÜNDUNG DER PFLEGEBEDÜRFtigkeit

`;
    } else {
      brief += `

1. BEGRÜNDUNG DER PFLEGEBEDÜRFtigkeit

`;
    }

    brief += `${data.begruendung}


2. MEDIZINISCHE VERSORGUNG

`;

    if (data.versorgung.hausaerztin) {
      brief += `Hausärztin/Hausarzt: ${data.versorgung.hausaerztin}\n`;
    }

    if (data.versorgung.behandelnde_aerzte && data.versorgung.behandelnde_aerzte.length > 0) {
      brief += `Weitere behandelnde Ärzte:\n`;
      data.versorgung.behandelnde_aerzte.forEach(arzt => {
        brief += `- ${arzt}\n`;
      });
    }

    if (data.versorgung.krankenhausaufenthalte_letzte_12_monate && data.versorgung.krankenhausaufenthalte_letzte_12_monate.length > 0) {
      brief += `\nKrankenhausaufenthalte (letzte 12 Monate):\n`;
      data.versorgung.krankenhausaufenthalte_letzte_12_monate.forEach(aufenthalt => {
        brief += `- ${aufenthalt}\n`;
      });
    }

    brief += `

3. WOHSITUATION

`;

    const wohnsituationText = {
      allein: "Ich lebe allein in meiner Wohnung.",
      mit_partner: "Ich lebe zusammen mit meinem Partner/meiner Partnerin.",
      mit_familie: "Ich lebe im Familienhaushalt.",
      pflegeheim: "Ich wohne derzeit im Pflegeheim.",
      betreutes_wohnen: "Ich lebe in betreutem Wohnen.",
    };

    brief += `${wohnsituationText[data.pflegesituation.wohnsituation]}\n`;

    if (data.pflegesituation.pflege_durch_angehoerige) {
      brief += `Pflege wird durch Angehörige durchgeführt.\n`;
    }

    if (data.pflegesituation.professionelle_pflege_bereits) {
      brief += `Es ist bereits professionelle Pflege im Einsatz.\n`;
    }

    brief += `

4. BEANTRAGTE LEISTUNGEN

`;

    const leistungsText: Record<string, string> = {
      beratung: "Beratung nach § 37 Abs. 3 SGB XI",
      mittel_zur_hilfe: "Mittel zur Pflege (Hilfsmittel) nach § 40 SGB XI",
      zuschlag_kombination: "Zuschlag für Kombination nach § 38 SGB XI",
      tages_nachtpflege: "Tages- oder Nachtpflege nach § 41 SGB XI",
      vollstationaer: "Leistungen bei vollstationärer Pflege",
    };

    data.pflegesituation.beantragte_leistungen.forEach(leistung => {
      brief += `- ${leistungsText[leistung] || leistung}\n`;
    });

    brief += `

5. BEGUTACHTUNG

`;

    brief += `Ich bitte um Terminierung eines Begutachtungstermins durch den Medizinischen Dienst.
`;

    if (data.pflegebeduerftiger?.wohnort_gleich !== false && data.antragsteller.telefon) {
      brief += `\nTelefonische Erreichbarkeit: ${data.antragsteller.telefon}
`;
    }

    brief += `

6. RECHTLICHE HINWEISE

• ${ANTRAG_PFLEGEGRAD_PARAGRAPHEN.sgb_xi_14.paragraph}: ${ANTRAG_PFLEGEGRAD_PARAGRAPHEN.sgb_xi_14.titel}
• ${ANTRAG_PFLEGEGRAD_PARAGRAPHEN.sgb_xi_15.paragraph}: ${ANTRAG_PFLEGEGRAD_PARAGRAPHEN.sgb_xi_15.titel}
• ${ANTRAG_PFLEGEGRAD_PARAGRAPHEN.sgb_xi_13.paragraph}: ${ANTRAG_PFLEGEGRAD_PARAGRAPHEN.sgb_xi_13.titel}


Bitte bestätigen Sie mir den Eingang dieses Antrags und teilen Sie mir den Termin der Begutachtung mit.


Mit freundlichen Grüßen


_______________________
${data.antragsteller.name}


Anlagen:
`;

    const standardAnlagen = [
      "Kopie des Personalausweises",
      "Kopie der Versicherungskarte",
      "Aktuelle ärztliche Bescheinigung/Diagnosen",
      "Wohnsitznachweis",
    ];

    const alleAnlagen = [...standardAnlagen, ...(data.anlagen || [])];
    alleAnlagen.forEach((anlage, index) => {
      brief += `${index + 1}. ${anlage}\n`;
    });

    brief += `


HINWEIS:
Nach § 14 Abs. 1 Satz 2 SGB XI kann die Pflegekasse die Einstufung in einen Pflegegrad
auch von Amts wegen vornehmen, wenn ihr Umstände bekannt werden, die auf eine
Pflegebedürftigkeit schließen lassen.
`;

    return brief;
  }

  // Schnell-Generator mit Minimal-Daten
  generateQuickAntrag(
    antragsteller: AntragPflegegradData['antragsteller'],
    begruendung: string,
    wohnsituation: AntragPflegegradData['pflegesituation']['wohnsituation']
  ): string {
    return this.generateBrief({
      empfaenger: {
        name: "Pflegekasse",
        strasse: "[Adresse eintragen]",
        plz: "[PLZ]",
        ort: "[Ort]"
      },
      antragsteller,
      versorgung: {
        behandelnde_aerzte: [],
      },
      pflegesituation: {
        wohnsituation,
        beantragte_leistungen: ['beratung'],
      },
      begruendung,
    });
  }
}

export const antragPflegegradGenerator = new AntragPflegegradGenerator();
