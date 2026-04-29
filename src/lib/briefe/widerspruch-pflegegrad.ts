// Widerspruch gegen Pflegegrad-Bescheid
// PflegeNavigator EU - Kernfunktion des Portals

export interface WiderspruchPflegegradData {
  empfaenger: {
    name: string; // z.B. "MDK Nordrhein-Westfalen" oder "Pflegekasse"
    strasse: string;
    plz: string;
    ort: string;
    aktenzeichen?: string;
  };
  antragsteller: {
    name: string;
    strasse: string;
    plz: string;
    ort: string;
    geburtsdatum: string;
    telefon?: string;
    email?: string;
    versichertennummer?: string;
  };
  bescheid: {
    datum: string; // TT.MM.JJJJ
    pflegegrad_aktuell: string; // z.B. "Pflegegrad 2"
    punkte_aktuell?: number;
    punkte_benoetigt?: number;
    begruendung_mdk?: string;
  };
  widerspruch: {
    gewuenschter_pflegegrad: string; // z.B. "Pflegegrad 3"
    begruendung: string;
    neue_befunde?: string[];
    verschlimmerung_seit?: string;
  };
  anlagen?: string[];
}

export const WIDERSPRUCH_PARAGRAPHEN = {
  sgb_x_78: {
    paragraph: "§ 78 SGB X",
    titel: "Widerspruch",
    text: "Widerspruchsfrist: 1 Monat ab Zustellung des Bescheids",
    frist_tage: 30,
  },
  sgb_xi_18: {
    paragraph: "§ 18 SGB XI",
    titel: "Überprüfung und Änderung der Pflegegrad-Einstufung",
    text: "Bei Verschlechterung des Gesundheitszustands kann eine erneute Überprüfung beantragt werden",
  },
  sgb_x_80: {
    paragraph: "§ 80 SGB X",
    titel: "Aufschiebende Wirkung",
    text: "Der Widerspruch hat aufschiebende Wirkung - Leistungen werden bis zur Entscheidung weiter gewährt",
  },
};

export class WiderspruchPflegegradGenerator {

  generateBrief(data: WiderspruchPflegegradData): string {
    const heute = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Frist berechnen
    const fristDatum = this.berechneFrist(data.bescheid.datum);

    let brief = `${data.antragsteller.name}
${data.antragsteller.strasse}
${data.antragsteller.plz} ${data.antragsteller.ort}
${data.antragsteller.versichertennummer ? `Versicherten-Nr.: ${data.antragsteller.versichertennummer}` : ''}


${data.empfaenger.name}
${data.empfaenger.strasse}
${data.empfaenger.plz} ${data.empfaenger.ort}
${data.empfaenger.aktenzeichen ? `\nAktenzeichen: ${data.empfaenger.aktenzeichen}` : ''}


${data.antragsteller.ort}, den ${heute}


Betreff: Widerspruch gegen den Bescheid vom ${data.bescheid.datum} über die Pflegegrad-Einstufung


Sehr geehrte Damen und Herren,

hiermit lege ich fristgerecht Widerspruch ein gegen den Bescheid vom ${data.bescheid.datum}, mit dem mir der ${data.bescheid.pflegegrad_aktuell} zuerkannt wurde.


1. BEGRÜNDUNG DES WIDERSPRUCHS

${data.widerspruch.begruendung}


2. GESUNDHEITLICHE VERSCHLECHTERUNG

Seit dem MDK-Besuch hat sich mein Gesundheitszustand weiter verschlechtert:

`;

    if (data.widerspruch.verschlimmerung_seit) {
      brief += `Die Verschlechterung trat auf ab: ${data.widerspruch.verschlimmerung_seit}\n\n`;
    }

    if (data.widerspruch.neue_befunde && data.widerspruch.neue_befunde.length > 0) {
      brief += `Neue gesundheitliche Einschränkungen:\n`;
      data.widerspruch.neue_befunde.forEach((befund, index) => {
        brief += `${index + 1}. ${befund}\n`;
      });
      brief += `\n`;
    }

    brief += `

3. BEANTRAGTE LÖSUNG

Ich beantrage:
- Eine erneute Begutachtung durch den MDK
- Einstufung in ${data.widerspruch.gewuenschter_pflegegrad}
`;

    if (data.bescheid.punkte_aktuell && data.bescheid.punkte_benoetigt) {
      brief += `

4. HINWEIS AUF PUNKTEBERECHNUNG

Im aktuellen Bescheid wurden ${data.bescheid.punkte_aktuell} Punkte ermittelt.
Für ${data.widerspruch.gewuenschter_pflegegrad} werden ${data.bescheid.punkte_benoetigt} Punkte benötigt.
Die Differenz beträgt ${data.bescheid.punkte_benoetigt - data.bescheid.punkte_aktuell} Punkte, die durch die neuen gesundheitlichen Einschränkungen erreicht werden sollten.
`;
    }

    brief += `

5. RECHTLICHE HINWEISE

`;

    brief += `• ${WIDERSPRUCH_PARAGRAPHEN.sgb_x_78.paragraph}: ${WIDERSPRUCH_PARAGRAPHEN.sgb_x_78.text}
`;
    brief += `• ${WIDERSPRUCH_PARAGRAPHEN.sgb_x_80.paragraph}: ${WIDERSPRUCH_PARAGRAPHEN.sgb_x_80.text}
`;

    brief += `

6. AUFHEBENDE WIRKUNG

Der Widerspruch hat aufschiebende Wirkung nach § 80 SGB X. Die bislang gewährten Leistungen werden bis zur Entscheidung über den Widerspruch weiter gewährt.


Bitte bestätigen Sie mir den Eingang dieses Widerspruchs schriftlich unter Angabe der bei Ihnen entstehenden Widerspruchsnummer.


Mit freundlichen Grüßen


_______________________
${data.antragsteller.name}


Anlagen:
`;

    const standardAnlagen = [
      "Kopie des angefochtenen Bescheids",
      "Kopie des Personalausweises",
      "Aktuelle ärztliche Bescheinigungen",
    ];

    const alleAnlagen = [...standardAnlagen, ...(data.anlagen || [])];
    alleAnlagen.forEach((anlage, index) => {
      brief += `${index + 1}. ${anlage}\n`;
    });

    brief += `


HINWEIS ZUR FRIST:
Der Widerspruch muss innerhalb eines Monats ab Zustellung des Bescheids eingelegt werden.
Spätester Eingang bei der Pflegekasse/MDK: ${fristDatum}
`;

    if (data.antragsteller.telefon || data.antragsteller.email) {
      brief += `

Kontakt:
`;
      if (data.antragsteller.telefon) brief += `Tel.: ${data.antragsteller.telefon}\n`;
      if (data.antragsteller.email) brief += `E-Mail: ${data.antragsteller.email}\n`;
    }

    return brief;
  }

  private berechneFrist(bescheidDatum: string): string {
    // Bescheid-Datum parsen (TT.MM.JJJJ)
    const [tag, monat, jahr] = bescheidDatum.split('.').map(Number);
    const datum = new Date(jahr, monat - 1, tag);
    
    // 1 Monat + 1 Tag (Zustellungsfiktion)
    datum.setMonth(datum.getMonth() + 1);
    
    // Wenn auf Wochenende fällt, auf nächsten Werktag verschieben
    const wochentag = datum.getDay();
    if (wochentag === 0) { // Sonntag
      datum.setDate(datum.getDate() + 1);
    } else if (wochentag === 6) { // Samstag
      datum.setDate(datum.getDate() + 2);
    }

    return datum.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Schnell-Generator mit Minimal-Daten
  generateQuickWiderspruch(
    antragsteller: WiderspruchPflegegradData['antragsteller'],
    aktuellerGrad: string,
    gewuenschterGrad: string,
    begruendung: string
  ): string {
    return this.generateBrief({
      empfaenger: {
        name: "Pflegekasse / MDK",
        strasse: "[Adresse eintragen]",
        plz: "[PLZ]",
        ort: "[Ort]"
      },
      antragsteller,
      bescheid: {
        datum: new Date().toLocaleDateString('de-DE'),
        pflegegrad_aktuell: aktuellerGrad,
      },
      widerspruch: {
        gewuenschter_pflegegrad: gewuenschterGrad,
        begruendung,
      }
    });
  }
}

export const widerspruchPflegegradGenerator = new WiderspruchPflegegradGenerator();
