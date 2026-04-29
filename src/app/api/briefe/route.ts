import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Typ und Daten erforderlich' },
        { status: 400 }
      );
    }

    let result;
    
    switch (type) {
      case 'versorgungsamt': {
        const { versorgungsamtGenerator } = await import('@/lib/briefe/versorgungsamt');
        const briefText = versorgungsamtGenerator.generateBrief(data);
        result = { 
          briefText, 
          checklist: [
            '☐ Eigene Daten prüfen',
            '☐ Empfänger-Daten prüfen',  
            '☐ Anlagen zusammenstellen',
            '☐ Unterschrift nicht vergessen',
            '☐ Einschreiben/Rückschein',
          ], 
          nextSteps: [
            '1. Brief ausdrucken',
            '2. Unterzeichnen', 
            '3. Anlagen beifügen',
            '4. Absenden',
          ]
        };
        break;
      }
        
      case 'em-rente': {
        const { emRenteGenerator } = await import('@/lib/briefe/em-rente');
        const briefText = emRenteGenerator.generateBrief(data);
        const fragen = emRenteGenerator.generateGutachtenFragen();
        result = { 
          briefText, 
          gutachtenFragen: fragen,
          checklist: [
            '☐ Alle Krankenhausaufenthalte dokumentiert',
            '☐ Alle Arztbesuche der letzten 2 Jahre',
            '☐ Arbeitsunfähigkeitsbescheinigungen (mindestens 6 Monate)',
            '☐ Medikamentenplan aktuell',
            '☐ Therapieberichte (Physio, Ergo, Logo)',
            '☐ Facharzt-Gutachten',
          ],
          nextSteps: [
            '1. Brief ausdrucken und unterschreiben',
            '2. Unterlagen chronologisch sortieren',
            '3. Kopien aller wichtigen Befunde machen',
            '4. An deutsche Rentenversicherung senden',
            '5. Wartezeit 2-6 Monate',
            '6. Gutachten-Arzt der DRV nimmt Kontakt auf',
            '7. Bescheid abwarten',
          ],
          wichtigeHinweise: [
            'WICHTIG: Mindestens 6 Monate Behandlung oder Arbeitsunfähigkeit!',
            'Reha-Antrag gleichzeitig stellen (wichtig für Anerkennung!)',
            'Während Bearbeitung: Krankengeld weiter beantragen (bis 78 Wochen)',
          ],
        };
        break;
      }

      case 'allgemein': {
        const { allgemeinerBriefGenerator } = await import('@/lib/briefe/allgemein');
        const briefText = allgemeinerBriefGenerator.generateBrief(data);
        result = {
          briefText,
          checklist: [
            '☐ Absender-Daten prüfen',
            '☐ Empfänger-Daten prüfen',
            '☐ Betreffzeile prüfen',
            '☐ Inhalt auf Vollständigkeit prüfen',
            '☐ Anlagen-Verzeichnis erstellen',
            '☐ Unterschrift nicht vergessen',
          ],
          nextSteps: [
            '1. Brief überprüfen',
            '2. Ausdrucken',
            '3. Unterschreiben',
            '4. Anlagen beifügen',
            '5. Absenden (Einschreiben empfohlen)',
          ],
        };
        break;
      }

      case 'widerspruch-pflegegrad': {
        const { widerspruchPflegegradGenerator } = await import('@/lib/briefe/widerspruch-pflegegrad');
        const briefText = widerspruchPflegegradGenerator.generateBrief(data);
        result = {
          briefText,
          checklist: [
            '☐ Bescheid-Datum prüfen (Frist 1 Monat!)',
            '☐ Aktuellen Pflegegrad notieren',
            '☐ Gewünschten Pflegegrad festlegen',
            '☐ Begründung ausformulieren',
            '☐ Neue Befunde beifügen',
            '☐ Kopie des angefochtenen Bescheids beifügen',
            '☐ Einschreiben mit Rückschein senden',
          ],
          nextSteps: [
            '1. Brief ausdrucken',
            '2. Unterzeichnen',
            '3. Anlagen beifügen (Bescheid, Befunde)',
            '4. Einschreiben an Pflegekasse/MDK senden',
            '5. Eingangsbestätigung abwarten',
            '6. Aufschiebende Wirkung prüfen',
            '7. Auf Widerspruchsverfahren warten (1-3 Monate)',
          ],
          wichtigeHinweise: [
            '⚠️ WICHTIG: Frist 1 Monat ab Zustellung des Bescheids!',
            'Der Widerspruch hat aufschiebende Wirkung (§ 80 SGB X)',
            'Pflegegeld wird bis zur Entscheidung weitergezahlt',
            'MDK führt neue Begutachtung durch',
          ],
        };
        break;
      }

      case 'antrag-pflegegrad': {
        const { antragPflegegradGenerator } = await import('@/lib/briefe/antrag-pflegegrad');
        const briefText = antragPflegegradGenerator.generateBrief(data);
        result = {
          briefText,
          checklist: [
            '☐ Persönliche Daten vollständig',
            '☐ Versicherungsnummer prüfen',
            '☐ Pflegekasse-Adresse recherchieren',
            '☐ Ärztliche Diagnosen zusammenstellen',
            '☐ Aktuelle Medikation auflisten',
            '☐ Hilfsmittel dokumentieren',
            '☐ Wohnsituation beschreiben',
            '☐ Pflegebedarf darlegen',
          ],
          nextSteps: [
            '1. Brief ausdrucken',
            '2. Unterzeichnen',
            '3. Anlagen beifügen (Personalausweis, Ärztliche Bescheinigungen)',
            '4. An Pflegekasse senden',
            '5. Wartezeit 4-6 Wochen für MDK-Termin',
            '6. Begutachtung durch MDK vor Ort',
            '7. Bescheid abwarten',
          ],
          wichtigeHinweise: [
            'Der Medizinische Dienst (MDK) kommt zu Ihnen nach Hause',
            'Vorbereitung: Alle Medikamente bereitlegen, Alltag zeigen',
            'Pflegegrad 2-5 = Anspruch auf Pflegegeld',
          ],
        };
        break;
      }

      case 'betreuungsrecht': {
        const { betreuungsrechtGenerator } = await import('@/lib/briefe/betreuungsrecht');
        const briefText = betreuungsrechtGenerator.generateBrief(data);
        result = {
          briefText,
          checklist: [
            '☐ Betroffene Person identifiziert',
            '☐ Gesundheitlicher Zustand dokumentiert',
            '☐ Einwilligungsfähigkeit geklärt',
            '☐ Gewünschte Betreuungsbereiche festgelegt',
            '☐ Vorgeschlagener Betreuer benannt (optional)',
            '☐ Ärztliche Atteste vorbereitet',
          ],
          nextSteps: [
            '1. Brief ausdrucken',
            '2. Unterzeichnen',
            '3. Anlagen beifügen (Personalausweis, Atteste)',
            '4. An Betreuungsgericht senden',
            '5. Gerichtsgespräch abwarten',
            '6. Bestellung des Betreuers',
          ],
          wichtigeHinweise: [
            'Betreuung nur bei Einwilligungsunfähigkeit',
            'Vorsorgevollmacht ist die bessere Alternative (wenn noch einwilligungsfähig)',
            'Patientenverfügung ergänzend empfohlen',
          ],
        };
        break;
      }

      case 'erbrecht': {
        const { erbrechtGenerator } = await import('@/lib/briefe/erbrecht');
        const briefText = erbrechtGenerator.generateBrief(data);
        result = {
          briefText,
          checklist: [
            '☐ Vermögen überschlagen',
            '☐ Erben benannt',
            '☐ Pflichtteilsberechtigte identifiziert',
            '☐ Besondere Verfügungen festgelegt',
            '☐ Vordrucke für Notar vorbereitet',
          ],
          nextSteps: [
            '1. Termin beim Notar vereinbaren',
            '2. Unterlagen mitnehmen (Personalausweis, Vermögensnachweise)',
            '3. Notarielle Beurkundung',
            '4. Testament sicher verwahren',
            '5. Vertrauensperson über Verwahrort informieren',
          ],
          wichtigeHinweise: [
            'Testament kann jederzeit geändert werden',
            'Pflichtteil kann nur begrenzt umgangen werden',
            'Notarielle Beurkundung = höchste Sicherheit',
          ],
        };
        break;
      }
        
      default:
        return NextResponse.json(
          { error: `Unbekannter Typ: ${type}`, 
            verfuegbar: ['versorgungsamt', 'em-rente', 'allgemein', 'widerspruch-pflegegrad', 'antrag-pflegegrad', 'betreuungsrecht', 'erbrecht'] 
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      ...result,
    });
  } catch (error) {
    console.error('Brief API Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler', details: error instanceof Error ? error.message : 'Unbekannt' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    types: [
      { id: 'versorgungsamt', name: 'Versorgungsamt/Sozialamt', icon: '🏛️', beschreibung: 'Anfragen an Versorgungs- oder Sozialämter' },
      { id: 'em-rente', name: 'Erwerbsminderungsrente', icon: '💰', beschreibung: 'Antrag auf EM-Rente bei der Deutschen Rentenversicherung' },
      { id: 'allgemein', name: 'Allgemeiner Brief', icon: '📝', beschreibung: 'Universelle Brief-Vorlage für Behörden, Versicherungen, etc.' },
      { id: 'widerspruch-pflegegrad', name: 'Widerspruch Pflegegrad', icon: '⚖️', beschreibung: 'Widerspruch gegen MDK-Bescheid (Pflegegrad)' },
      { id: 'antrag-pflegegrad', name: 'Antrag Pflegegrad', icon: '🏥', beschreibung: 'Erstbeantragung Pflegegrad bei der Pflegekasse' },
      { id: 'betreuungsrecht', name: 'Betreuungsrecht', icon: '👨‍⚖️', beschreibung: 'Betreuung, Vorsorgevollmacht, Patientenverfügung' },
      { id: 'erbrecht', name: 'Erbrecht', icon: '📜', beschreibung: 'Testament, Pflichtteil, Erbschaftsteuer' },
    ],
    usage: 'POST mit { type, data }',
    pdfEndpoint: '/api/briefe/pdf',
  });
}
