import { NextRequest, NextResponse } from 'next/server';
import { emRenteGenerator, EMRenteData } from '@/lib/briefe/em-rente';

// EM-Rente / Erwerbsminderungsrente Brief-Generierung
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: EMRenteData = body;

    // Validierung
    if (!data.empfaenger?.name || !data.antragsteller?.name || !data.krankheit?.diagnose) {
      return NextResponse.json(
        { 
          error: 'Fehlende Pflichtfelder',
          required: ['empfaenger.name', 'antragsteller.name', 'krankheit.diagnose', 'krankheit.sozialversicherungsnummer']
        },
        { status: 400 }
      );
    }

    // Brief generieren
    const briefText = emRenteGenerator.generateBrief(data);

    // Renten-spezifische Hinweise
    const hinweise = [];
    if (data.rentenart === 'volle') {
      hinweise.push('Volle EM-Rente: Mindestens 6 Stunden täglich nicht arbeitsfähig');
      hinweise.push('Höhe: ca. 2/3 des letzten Nettogehalts (abzüglich Abschläge)');
    } else if (data.rentenart === 'teilweise') {
      hinweise.push('Teilweise EM-Rente: 3-6 Stunden täglich arbeitsfähig');
      hinweise.push('Höhe: ca. 1/3 des letzten Nettogehalts');
    } else if (data.rentenart === 'vorlaeufige') {
      hinweise.push('Vorläufige EM: Heilungsaussicht ungewiss/unwahrscheinlich');
    }

    if (data.dringlichkeit === 'hoch') {
      hinweise.push('Wichtig: Krankengeld endet nach 72 Wochen - rechtzeitig EM-Rente beantragen!');
    }

    return NextResponse.json({
      success: true,
      brief: briefText,
      typ: 'em-rente',
      meta: {
        empfaenger: data.empfaenger.name,
        rentenart: data.rentenart,
        diagnose: data.krankheit.diagnose,
        zeichenAnzahl: briefText.length,
        rentennavigator: true
      },
      rechtshinweise: hinweise,
      zeitstrahl: [
        { phase: 'Antragstellung', dauer: 'Sofort', status: 'Aktuell' },
        { phase: 'Gutachten', dauer: '4-12 Wochen', status: 'Ausstehend' },
        { phase: 'Bescheid', dauer: 'Nach Gutachten', status: 'Ausstehend' },
        { phase: 'Zahlung', dauer: 'Ab 7. Monat (rückwirkend)', status: 'Ausstehend' }
      ],
      checkliste: [
        'Sozialversicherungsnummer korrekt?',
        'Ärztliche Bescheinigung der letzten 6 Monate',
        'Letzte Lohnabrechnungen (12 Monate)',
        'Arbeitsvertrag/Kündigungsschreiben',
        'Krankengeld-Bescheide',
        'Reha-Berichte (falls vorhanden)'
      ],
      gutachtenFragen: emRenteGenerator.generateGutachtenFragen()
    });

  } catch (error) {
    console.error('EM-Rente Brief Error:', error);
    return NextResponse.json(
      { 
        error: 'Fehler bei der Brief-Generierung',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET für Renten-Informationen
export async function GET() {
  return NextResponse.json({
    rentenarten: [
      { 
        id: 'volle', 
        name: 'Volle Erwerbsminderungsrente',
        beschreibung: 'Nicht mehr mindestens 6 Stunden täglich arbeitsfähig',
        paragraph: '§ 240 SGB VI',
        hoehe: '~2/3 letztes Netto (mit Abschlägen)'
      },
      { 
        id: 'teilweise', 
        name: 'Teilweise Erwerbsminderungsrente',
        beschreibung: '3-6 Stunden täglich arbeitsfähig',
        paragraph: '§ 240 SGB VI',
        hoehe: '~1/3 letztes Netto'
      },
      { 
        id: 'vorlaeufige', 
        name: 'Vorläufige Erwerbsminderungsrente',
        beschreibung: 'Heilungsaussicht ungewiss/unwahrscheinlich',
        paragraph: '§ 241 SGB VI',
        hoehe: 'Wie volle EM-Rente'
      },
      { 
        id: 'berufsunfaehigkeit', 
        name: 'Berufsunfähigkeitsrente',
        beschreibung: 'Nicht mehr im erlernten Beruf tätig',
        paragraph: '§ 237 SGB VI',
        hoehe: 'Individuelle Berechnung',
        hinweis: 'Alte Leistung - nur bei vor 2004 Versicherten'
      }
    ],
    rentenversicherungen: [
      { name: 'Deutsche Rentenversicherung Bund', url: 'www.deutsche-rentenversicherung.de' },
      { name: 'Deutsche Rentenversicherung Westfalen', url: 'www.deutsche-rentenversicherung-westfalen.de' },
      { name: 'Deutsche Rentenversicherung Berlin-Brandenburg', url: 'www.deutsche-rentenversicherung-berlin-brandenburg.de' },
      { name: 'Deutsche Rentenversicherung Schwaben', url: 'www.deutsche-rentenversicherung-schwaben.de' },
      { name: 'Deutsche Rentenversicherung Mitteldeutschland', url: 'www.deutsche-rentenversicherung-mitteldeutschland.de' },
      { name: 'Deutsche Rentenversicherung Knappschaft-Bahn-See', url: 'www.deutsche-rentenversicherung-knappschaft-bahn-see.de', spezial: 'Für Bergleute, Bahn, See' }
    ],
    wichtigeFristen: [
      { frist: 'EM-Antrag stellen', zeitpunkt: 'Spätestens 7 Monate nach Arbeitsunfähigkeit', wichtig: true },
      { frist: 'Rückwirkend', zeitpunkt: 'Maximal 4 Monate vor Antragstellung', wichtig: true },
      { frist: 'Widerspruch', zeitpunkt: '1 Monat nach Bescheid', wichtig: true },
      { frist: 'Sozialgericht', zeitpunkt: '1 Monat nach Widerspruchsbescheid', wichtig: false }
    ],
    tipps: [
      'Arztgespräche dokumentieren',
      'Einschränkungen konkret beschreiben',
      'Tätigkeitsbericht früh erstellen',
      'Rechtsanwalt/Sozialverband bei Ablehnung konsultieren'
    ]
  });
}
