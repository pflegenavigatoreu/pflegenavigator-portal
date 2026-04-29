import { NextRequest, NextResponse } from 'next/server';
import { versorgungsamtGenerator, BriefData } from '@/lib/briefe/versorgungsamt';

// Versorgungsamt/Sozialamt Brief-Generierung
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: BriefData = body;

    // Validierung
    if (!data.empfaenger?.name || !data.antragsteller?.name || !data.inhalt?.antragsgrund) {
      return NextResponse.json(
        { 
          error: 'Fehlende Pflichtfelder',
          required: ['empfaenger.name', 'antragsteller.name', 'inhalt.antragsgrund']
        },
        { status: 400 }
      );
    }

    // Brief generieren
    const briefText = versorgungsamtGenerator.generateBrief(data);

    // Pflege-spezifische Hinweise
    const hinweise = [];
    if (data.inhalt.dringlichkeit === 'hoch' || data.inhalt.dringlichkeit === 'sehr_hoch') {
      hinweise.push('⚠️ Dringlichkeit markiert - Bitte zügige Bearbeitung erwähnen');
    }

    return NextResponse.json({
      success: true,
      brief: briefText,
      typ: 'versorgungsamt',
      meta: {
        empfaenger: data.empfaenger.name,
        antragsgrund: data.inhalt.antragsgrund.substring(0, 100),
        dringlichkeit: data.inhalt.dringlichkeit || 'normal',
        zeichenAnzahl: briefText.length,
        versorgungstracker: true
      },
      rechtshinweise: hinweise,
      checkliste: [
        'Personalausweis (Kopie)',
        'Sozialversicherungsnummer',
        'Ärztliche Bescheinigungen (max. 6 Monate alt)',
        'Pflegegrad-Bescheid (falls vorhanden)',
        'Einkommensnachweis (letzte 3 Monate)',
        'Mietvertrag/Wohnflächennachweis'
      ],
      kontaktdaten: {
        empfohlene_adressen: [
          { name: 'Sozialamt [Stadtname]', anmerkung: 'Lokale Behörde prüfen' },
          { name: 'Versorgungsamt [Bundesland]', anmerkung: 'Für Behinderungsgrade' }
        ]
      }
    });

  } catch (error) {
    console.error('Versorgungsamt Brief Error:', error);
    return NextResponse.json(
      { 
        error: 'Fehler bei der Brief-Generierung',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET für Antragstypen und Informationen
export async function GET() {
  return NextResponse.json({
    antragstypen: [
      { 
        id: 'pflegegeld_antrag', 
        name: 'Pflegegeld-Antrag (SGB XI)',
        beschreibung: 'Leistungen für Pflegebedürftige',
        paragraph: '§ 37 SGB XI',
        leistung: 'Je nach Pflegegrad €332-€947/Monat'
      },
      { 
        id: 'pflegegrad_pruefung', 
        name: 'Pflegegrad-Überprüfung',
        beschreibung: 'Verschlechterung/Höherer Grad beantragen',
        paragraph: '§ 18 SGB XI',
        leistung: 'Potentiell höhere Leistungen'
      },
      { 
        id: 'hilfsmittel', 
        name: 'Hilfsmittel/Haushaltshilfe',
        beschreibung: 'Technische/betriebliche Hilfen',
        paragraph: '§ 40-45 SGB XI',
        leistung: 'Kostenübernahme/Geldwerte Leistungen'
      },
      { 
        id: 'eingliederung', 
        name: 'Eingliederungshilfe (SGB XII)',
        beschreibung: 'Für Menschen mit Behinderung',
        paragraph: '§ 54 SGB XII',
        leistung: 'Umfassende soziale Teilhabe'
      }
    ],
    pflegegrade: [
      { grad: 1, beschreibung: 'Geringe Beeinträchtigung', leistung: '€332/Monat' },
      { grad: 2, beschreibung: 'Erhebliche Beeinträchtigung', leistung: '€573/Monat' },
      { grad: 3, beschreibung: 'Schwere Beeinträchtigung', leistung: '€765/Monat' },
      { grad: 4, beschreibung: 'Schwerste Beeinträchtigung', leistung: '€947/Monat' },
      { grad: 5, beschreibung: 'Härteste Fälle', leistung: '€947/Monat + Zulagen' }
    ],
    fristen: [
      { was: 'Antragstellung', hinweis: 'Sofort bei Pflegebedürftigkeit' },
      { was: 'MDK-Gutachten', hinweis: 'Innerhalb 5 Wochen nach Antrag' },
      { was: 'Widerspruch', hinweis: '1 Monat nach Bescheid' },
      { was: 'Leistungsbeginn', hinweis: 'Ab Antragsmonat (rückwirkend)' }
    ],
    tipps: [
      'Alle Einschränkungen dokumentieren',
      'Begutachtung vorbereiten: Tagesablauf aufschreiben',
      'Angehörige bei Gutachterbesuch dabei haben',
      'Ablehnung: Widerspruch + ärztliche Stellungnahme einholen',
      'Sozialverband/Rechtsanwalt bei Problemen einschalten'
    ]
  });
}
