import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { widerspruchPflegegradGenerator } from '@/lib/briefe/widerspruch-pflegegrad';
import { antragPflegegradGenerator } from '@/lib/briefe/antrag-pflegegrad';
import { allgemeinerBriefGenerator } from '@/lib/briefe/allgemein';
import { betreuungsrechtGenerator } from '@/lib/briefe/betreuungsrecht';
import { erbrechtGenerator } from '@/lib/briefe/erbrecht';

export const runtime = 'nodejs';
export const maxDuration = 60;

type BriefType = 'versorgungsamt' | 'em-rente' | 'antrag-pflegegrad' | 'antrag-pflegegeld' | 'zusatzleistungen' | 'custom' | 'widerspruch-pflegegrad' | 'widerspruch-pflegegeld' | 'allgemein' | 'betreuungsrecht' | 'erbrecht';

interface BriefData {
  type: BriefType;
  absender: {
    name: string;
    vorname?: string;
    strasse: string;
    plz: string;
    ort: string;
    telefon?: string;
    email?: string;
    geburtsdatum?: string;
  };
  empfaenger: {
    name: string;
    strasse?: string;
    plz: string;
    ort: string;
    aktenzeichen?: string;
  };
  betreff: string;
  inhalt: {
    anrede: string;
    einleitung: string;
    hauptteil: string;
    schluss: string;
  };
  anlagen?: string[];
  datum?: string;
  ort?: string;
  aktenzeichen?: string;
  customTemplate?: string;
  // Zusätzliche Felder für spezialisierte Briefe
  antragsteller?: any;
  bescheid?: any;
  widerspruch?: any;
  pflegebeduerftiger?: any;
  verfahrensart?: any;
  betreuungsbereich?: any;
  vorsorgebevollmaechtigter?: any;
  dringlichkeit?: string;
  erben?: any;
  vermoegen?: any;
  testament_details?: any;
}

const PDF_STYLES = `
  <style>
    @page { margin: 25mm 20mm 30mm 20mm; }
    body { 
      font-family: 'DejaVu Sans', Arial, sans-serif; 
      font-size: 11pt; 
      line-height: 1.6;
      color: #000;
    }
    .absender { font-size: 9pt; color: #666; margin-bottom: 20pt; }
    .empfaenger { margin-bottom: 30pt; }
    .datum-ort { text-align: right; margin-bottom: 20pt; }
    .betreff { font-weight: bold; margin-bottom: 15pt; }
    .aktenzeichen { font-size: 10pt; margin-bottom: 10pt; }
    .anrede { margin-bottom: 10pt; }
    .text-block { margin-bottom: 12pt; text-align: justify; }
    .hinweis-box { 
      border: 1px solid #999; 
      padding: 12pt; 
      margin: 15pt 0;
      background-color: #f5f5f5;
      font-size: 10pt;
    }
    .anlagen { margin-top: 20pt; }
    .anlagen-list { margin-left: 20pt; }
    .schluss { margin-top: 30pt; }
    .unterschrift { margin-top: 40pt; }
  </style>
`;

const FULL_TEMPLATE = (data: BriefData, contentHtml: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>${data.betreff}</title>
  ${PDF_STYLES}
</head>
<body>
  <div class="absender">
    ${data.absender.name}${data.absender.vorname ? ', ' + data.absender.vorname : ''}<br>
    ${data.absender.strasse}<br>
    ${data.absender.plz} ${data.absender.ort}
    ${data.absender.telefon ? `<br>Tel: ${data.absender.telefon}` : ''}
    ${data.absender.email ? `<br>E-Mail: ${data.absender.email}` : ''}
  </div>

  <div class="empfaenger">
    ${data.empfaenger.name}<br>
    ${data.empfaenger.strasse ? `${data.empfaenger.strasse}<br>` : ''}
    ${data.empfaenger.plz} ${data.empfaenger.ort}
  </div>

  <div class="datum-ort">
    ${data.ort || data.absender.ort}, den ${data.datum || new Date().toLocaleDateString('de-DE')}
  </div>

  ${contentHtml}

  ${data.anlagen && data.anlagen.length > 0 ? `
  <div class="anlagen">
    <strong>Anlagen:</strong>
    <ul class="anlagen-list">
      ${data.anlagen.map(anlage => `<li>${anlage}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <div class="schluss">
    Mit freundlichen Grüßen
  </div>

  <div class="unterschrift">
    _________________________________<br>
    ${data.absender.vorname ? data.absender.vorname + ' ' : ''}${data.absender.name}
  </div>
</body>
</html>
`;

const BRIEF_TEMPLATES: Record<BriefType, (data: BriefData) => { titel: string; html: string }> = {
  'versorgungsamt': (data) => ({
    titel: 'Anfrage_Versorgungsamt',
    html: `
      <div class="betreff">Betreff: ${data.betreff}</div>
      <div class="aktenzeichen">${data.aktenzeichen || ''}</div>
      
      <div class="anrede">${data.inhalt.anrede}</div>
      
      <div class="text-block">${data.inhalt.einleitung}</div>
      
      <div class="text-block">${data.inhalt.hauptteil}</div>
      
      <div class="hinweis-box">
        <strong>Hinweis zum Versorgungsamt:</strong><br>
        Das Versorgungsamt ist zuständig für die Anerkennung von Pflegegraden bei Behinderungen 
        und kann zusätzliche Leistungen nach dem Bundesversorgungsgesetz (BVG) prüfen.
      </div>
      
      <div class="text-block">${data.inhalt.schluss}</div>
    `
  }),
  
  'em-rente': (data) => ({
    titel: 'Anfrage_EM_Rente',
    html: `
      <div class="betreff">Betreff: ${data.betreff}</div>
      <div class="aktenzeichen">${data.aktenzeichen || ''}</div>
      
      <div class="anrede">${data.inhalt.anrede}</div>
      
      <div class="text-block">${data.inhalt.einleitung}</div>
      
      <div class="text-block">${data.inhalt.hauptteil}</div>
      
      <div class="hinweis-box">
        <strong>Hinweis zur Erwerbsminderungsrente:</strong><br>
        Die Erwerbsminderungsrente kann beantragt werden, wenn die Erwerbsfähigkeit 
        auf weniger als 6 Stunden täglich gemindert ist. Die Deutsche Rentenversicherung 
        prüft dies im Rahmen eines Rehabilitationsvorschlags oder auf Antrag.
      </div>
      
      <div class="text-block">${data.inhalt.schluss}</div>
    `
  }),
  
  'antrag-pflegegrad': (data) => ({
    titel: 'Antrag_Pflegegrad',
    html: `
      <div class="betreff">Betreff: Antrag auf Feststellung der Pflegebedürftigkeit (Einstufung in einen Pflegegrad)</div>
      
      <div class="anrede">${data.inhalt.anrede}</div>
      
      <div class="text-block">
        hiermit stelle ich Antrag auf Prüfung der Pflegebedürftigkeit und Einstufung 
        in einen Pflegegrad nach § 14 Sozialgesetzbuch XI.
      </div>
      
      <div class="text-block">
        <strong>Angaben zur Pflegesituation:</strong><br>
        ${data.inhalt.hauptteil}
      </div>
      
      <div class="hinweis-box">
        Die Pflegekasse wird einen Gutachter des Medizinischen Dienstes beauftragen, 
        einen Hausbesuch durchzuführen. Bitte bereiten Sie relevante Unterlagen vor:
        Arztberichte, Medikamentenpläne, bestehende Hilfsmittelversorgung.
      </div>
      
      <div class="text-block">${data.inhalt.schluss}</div>
    `
  }),
  
  'antrag-pflegegeld': (data) => ({
    titel: 'Antrag_Pflegegeld',
    html: `
      <div class="betreff">Betreff: Antrag auf Pflegegeld (§ 15 SGB XI)</div>
      
      <div class="anrede">${data.inhalt.anrede}</div>
      
      <div class="text-block">
        hiermit beantrage ich die Gewährung von Pflegegeld nach § 15 Sozialgesetzbuch XI.
        Ich bin in Pflegegrad ___ eingestuft und möchte die Pflege selbst organisieren.
      </div>
      
      <div class="text-block">
        <strong>Angaben zur Pflegeperson:</strong><br>
        ${data.inhalt.hauptteil}
      </div>
      
      <div class="hinweis-box">
        Das Pflegegeld ist für die selbst organisierte Pflege bestimmt. Es muss für 
        pflegerische Zwecke verwendet werden. Bei Pflegegrad 2+ besteht die Möglichkeit, 
        zwischen Pflegegeld, Sachleistungen oder Kombinationsleistungen zu wählen.
      </div>
      
      <div class="text-block">${data.inhalt.schluss}</div>
    `
  }),
  
  'zusatzleistungen': (data) => ({
    titel: 'Anfrage_Zusatzleistungen',
    html: `
      <div class="betreff">Betreff: ${data.betreff}</div>
      
      <div class="anrede">${data.inhalt.anrede}</div>
      
      <div class="text-block">${data.inhalt.einleitung}</div>
      
      <div class="text-block">
        <strong>Gewünschte Zusatzleistungen:</strong><br>
        ${data.inhalt.hauptteil}
      </div>
      
      <div class="hinweis-box">
        Mögliche Zusatzleistungen: Verhinderungspflege (§ 19 SGB XI), Tages- und 
        Nachtpflege (§ 41 SGB XI), Kurzzeitpflege (§ 42 SGB XI), häusliche 
        Krankenpflege (§ 37 SGB V), Pflegehilfsmittel (§ 40 SGB XI).
      </div>
      
      <div class="text-block">${data.inhalt.schluss}</div>
    `
  }),
  
  'custom': (data) => ({
    titel: 'Brief',
    html: data.customTemplate || `
      <div class="betreff">Betreff: ${data.betreff}</div>
      <div class="anrede">${data.inhalt.anrede}</div>
      <div class="text-block">${data.inhalt.einleitung}</div>
      <div class="text-block">${data.inhalt.hauptteil}</div>
      <div class="text-block">${data.inhalt.schluss}</div>
    `
  }),
  
  'widerspruch-pflegegrad': (data) => {
    const briefText = widerspruchPflegegradGenerator.generateBrief({
      empfaenger: {
        name: data.empfaenger.name,
        strasse: data.empfaenger.strasse || '',
        plz: data.empfaenger.plz,
        ort: data.empfaenger.ort,
        aktenzeichen: data.empfaenger.aktenzeichen,
      },
      antragsteller: {
        name: data.absender.name,
        strasse: data.absender.strasse,
        plz: data.absender.plz,
        ort: data.absender.ort,
        geburtsdatum: data.absender.geburtsdatum || '',
        telefon: data.absender.telefon,
        email: data.absender.email,
      },
      bescheid: data.bescheid,
      widerspruch: data.widerspruch,
      anlagen: data.anlagen,
    });
    return {
      titel: 'Widerspruch_Pflegegrad',
      html: `<div class="text-block" style="white-space: pre-wrap; font-family: monospace;">${briefText.replace(/\n/g, '<br>')}</div>`
    };
  },
  
  'widerspruch-pflegegeld': (data) => ({
    titel: 'Widerspruch_Pflegegeld',
    html: `
      <div class="betreff">Betreff: ${data.betreff}</div>
      <div class="aktenzeichen">${data.aktenzeichen || ''}</div>
      
      <div class="anrede">${data.inhalt.anrede}</div>
      
      <div class="text-block">${data.inhalt.einleitung}</div>
      
      <div class="text-block">${data.inhalt.hauptteil}</div>
      
      <div class="hinweis-box">
        <strong>Hinweis zum Widerspruch gegen Pflegegeld:</strong><br>
        Widerspruchsfrist: 1 Monat ab Zustellung des Bescheids.<br>
        Der Widerspruch hat aufschiebende Wirkung nach § 80 SGB X.
        Bei Ablehnung kann Anspruch auf höheres Pflegegeld geltend gemacht werden.
      </div>
      
      <div class="text-block">${data.inhalt.schluss}</div>
    `
  }),
  
  'allgemein': (data) => {
    const briefText = allgemeinerBriefGenerator.generateBrief({
      empfaenger: {
        name: data.empfaenger.name,
        strasse: data.empfaenger.strasse,
        plz: data.empfaenger.plz,
        ort: data.empfaenger.ort,
      },
      absender: {
        name: data.absender.name,
        strasse: data.absender.strasse,
        plz: data.absender.plz,
        ort: data.absender.ort,
        telefon: data.absender.telefon,
        email: data.absender.email,
      },
      brief: {
        betreff: data.betreff,
        art: 'antrag',
        inhalt: data.inhalt.hauptteil,
      },
      anlagen: data.anlagen,
    });
    return {
      titel: 'Allgemeiner_Brief',
      html: `<div class="text-block" style="white-space: pre-wrap; font-family: monospace;">${briefText.replace(/\n/g, '<br>')}</div>`
    };
  },
  
  'betreuungsrecht': (data) => {
    const briefText = betreuungsrechtGenerator.generateBrief({
      empfaenger: {
        name: data.empfaenger.name,
        strasse: data.empfaenger.strasse || '',
        plz: data.empfaenger.plz,
        ort: data.empfaenger.ort,
      },
      antragsteller: {
        name: data.absender.name,
        strasse: data.absender.strasse,
        plz: data.absender.plz,
        ort: data.absender.ort,
        telefon: data.absender.telefon || '',
        geburtsdatum: data.absender.geburtsdatum || '',
      },
      verfahrensart: data.verfahrensart || 'betreuung',
      begruendung: data.inhalt.hauptteil,
      betreuungsbereich: data.betreuungsbereich,
      vorsorgebevollmaechtigter: data.vorsorgebevollmaechtigter,
      dringlichkeit: data.dringlichkeit as any,
      anlagen: data.anlagen,
    });
    return {
      titel: 'Betreuungsrecht_Antrag',
      html: `<div class="text-block" style="white-space: pre-wrap; font-family: monospace;">${briefText.replace(/\n/g, '<br>')}</div>`
    };
  },
  
  'erbrecht': (data) => {
    const briefText = erbrechtGenerator.generateBrief({
      empfaenger: {
        name: data.empfaenger.name,
        strasse: data.empfaenger.strasse || '',
        plz: data.empfaenger.plz,
        ort: data.empfaenger.ort,
      },
      erblasser: {
        name: data.absender.name,
        strasse: data.absender.strasse,
        plz: data.absender.plz,
        ort: data.absender.ort,
        telefon: data.absender.telefon || '',
        geburtsdatum: data.absender.geburtsdatum || '',
        familienstand: 'verheiratet',
      },
      verfahrensart: data.verfahrensart || 'testament',
      erben: data.erben || [],
      vermoegen: data.vermoegen || {},
      testament_details: data.testament_details,
      begruendung: data.inhalt.hauptteil,
      anlagen: data.anlagen,
    });
    return {
      titel: 'Erbrecht_Vorlage',
      html: `<div class="text-block" style="white-space: pre-wrap; font-family: monospace;">${briefText.replace(/\n/g, '<br>')}</div>`
    };
  },
};

export async function POST(request: NextRequest): Promise<Response> {
  let browser;

  try {
    const body: BriefData = await request.json();
    const { type, absender, empfaenger, betreff, inhalt } = body;

    // Validierung
    if (!type || !absender || !empfaenger || !betreff || !inhalt) {
      return NextResponse.json(
        { 
          error: 'Fehlende Pflichtfelder',
          required: ['type', 'absender', 'empfaenger', 'betreff', 'inhalt']
        },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    const validTypes: BriefType[] = ['versorgungsamt', 'em-rente', 'antrag-pflegegrad', 'antrag-pflegegeld', 'zusatzleistungen', 'custom', 'widerspruch-pflegegrad', 'widerspruch-pflegegeld', 'allgemein', 'betreuungsrecht', 'erbrecht'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Ungültiger Brief-Typ', validTypes },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // Template auswählen und HTML generieren
    const templateFn = BRIEF_TEMPLATES[type];
    const { titel, html: contentHtml } = templateFn(body);
    const fullHtml = FULL_TEMPLATE(body, contentHtml);

    // PDF generieren
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '25mm', right: '20mm', bottom: '30mm', left: '20mm' }
    });

    await browser.close();

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${titel}_${sanitizeFilename(absender.name)}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'X-Brief-Type': type
      }
    });

  } catch (error) {
    if (browser) await browser.close();
    
    console.error('Brief PDF error:', error);
    return NextResponse.json(
      { 
        error: 'PDF Generierung fehlgeschlagen',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  // Liste der verfügbaren Brief-Typen
  return NextResponse.json({
    types: [
      { id: 'versorgungsamt', name: 'Anfrage ans Versorgungsamt', beschreibung: 'Anfragen bezüglich Pflegegrad bei Behinderungen' },
      { id: 'em-rente', name: 'Anfrage EM-Rente', beschreibung: 'Erwerbsminderungsrente beantragen/anfragen' },
      { id: 'antrag-pflegegrad', name: 'Antrag Pflegegrad', beschreibung: 'Erstbeantragung Pflegegrad' },
      { id: 'antrag-pflegegeld', name: 'Antrag Pflegegeld', beschreibung: 'Pflegegeld nach Einstufung beantragen' },
      { id: 'zusatzleistungen', name: 'Zusatzleistungen', beschreibung: 'Verhinderungspflege, Tagespflege etc.' },
      { id: 'custom', name: 'Benutzerdefiniert', beschreibung: 'Freier Brief mit eigenem Template' },
      { id: 'widerspruch-pflegegrad', name: 'Widerspruch Pflegegrad', beschreibung: 'Widerspruch gegen MDK-Bescheid' },
      { id: 'widerspruch-pflegegeld', name: 'Widerspruch Pflegegeld', beschreibung: 'Widerspruch gegen Pflegegeld-Bescheid' },
      { id: 'allgemein', name: 'Allgemeiner Brief', beschreibung: 'Universitäten, Versicherungen, Finanzamt, etc.' },
      { id: 'betreuungsrecht', name: 'Betreuungsrecht', beschreibung: 'Betreuung, Vorsorgevollmacht, Patientenverfügung' },
      { id: 'erbrecht', name: 'Erbrecht', beschreibung: 'Testament, Pflichtteil, Erbschaftsteuer' },
    ]
  }, { status: 200, headers: getCorsHeaders() });
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9äöüß\-]/gi, '_').substring(0, 30);
}

function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}
