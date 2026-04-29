import { NextRequest, NextResponse } from 'next/server';
import { allgemeinerBriefGenerator } from '@/lib/briefe/allgemein';

// Brief-Generierung API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      typ,
      empfaenger,
      absender,
      brief,
      anlagen 
    } = body;

    // Validierung
    if (!empfaenger?.name || !absender?.name || !brief?.inhalt) {
      return NextResponse.json(
        { error: 'Fehlende Pflichtfelder' },
        { status: 400 }
      );
    }

    // Brief generieren
    const briefText = allgemeinerBriefGenerator.generateBrief({
      empfaenger,
      absender,
      brief,
      anlagen: anlagen || []
    });

    return NextResponse.json({
      success: true,
      brief: briefText,
      typ: typ || 'allgemein',
      meta: {
        zeichenAnzahl: briefText.length,
        empfaenger: empfaenger.name,
        betreff: brief.betreff || '',
        art: brief.art
      }
    });

  } catch (error) {
    console.error('Brief Generator Error:', error);
    return NextResponse.json(
      { 
        error: 'Fehler bei der Brief-Generierung',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET für verfügbare Briefarten
export async function GET() {
  return NextResponse.json({
    briefarten: [
      { id: 'antrag', name: 'Antrag', beschreibung: 'Förmlicher Antrag bei Behörden' },
      { id: 'widerspruch', name: 'Widerspruch', beschreibung: 'Widerspruch gegen Bescheid' },
      { id: 'beschwerde', name: 'Beschwerde', beschreibung: 'Beschwerde über Leistung/Verhalten' },
      { id: 'anfrage', name: 'Anfrage', beschreibung: 'Allgemeine Anfrage' },
      { id: 'mitteilung', name: 'Mitteilung', beschreibung: 'Information/Kündigung' },
    ],
    empfaengerTypen: [
      'Versorgungsamt',
      'Rentenversicherung',
      'Krankenkasse',
      'Finanzamt',
      'Universität',
      'Arbeitgeber',
      'Vermieter',
      'Sonstige'
    ]
  });
}
