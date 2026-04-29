// PDF GENERATOR - Puppeteer (Self-hosted, Kostenlos, DSGVO-konform)
// Für: Ergebnis-PDF, Widerspruchsbriefe, Tagebuch-Export

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export interface PDFOptions {
  title?: string;
  content: string;
  footer?: string;
  header?: string;
}

export async function generatePDF({ title, content, footer, header }: PDFOptions): Promise<Buffer> {
  // Chromium für Serverless/Container
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: (chromium as any).defaultViewport || { width: 1280, height: 720 },
    executablePath: await chromium.executablePath(),
    headless: (chromium as any).headless !== undefined ? (chromium as any).headless : true,
  });

  const page = await browser.newPage();

  // HTML Template mit PflegeNavigator Branding
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || 'PflegeNavigator EU'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #333;
          margin: 40px;
        }
        
        .header {
          background: #0f2744;
          color: white;
          padding: 20px;
          margin: -40px -40px 30px -40px;
          text-align: center;
        }
        
        .header h1 {
          margin: 0;
          font-size: 18pt;
        }
        
        .footer {
          position: fixed;
          bottom: 20px;
          left: 40px;
          right: 40px;
          font-size: 8pt;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        
        .disclaimer {
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          font-size: 9pt;
        }
        
        .content {
          margin-top: 20px;
        }
        
        h2 {
          color: #0f2744;
          border-bottom: 2px solid #20b2aa;
          padding-bottom: 5px;
        }
        
        .result-box {
          background: #f8f9fa;
          border-left: 4px solid #20b2aa;
          padding: 15px;
          margin: 20px 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        
        th {
          background: #0f2744;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title || 'PflegeNavigator EU'}</h1>
        <p style="margin: 5px 0 0 0; font-size: 10pt;">15 Minuten. Von zu Hause. Kostenlos.</p>
      </div>
      
      ${header ? `<div class="content">${header}</div>` : ''}
      
      <div class="content">
        ${content}
      </div>
      
      <div class="disclaimer">
        <strong>Wichtiger Hinweis:</strong> PflegeNavigator EU gUG bietet keine Rechtsberatung, 
        keine medizinische Beratung und keine verbindliche Auskunft über Leistungsansprüche. 
        Die Auswertungen sind Orientierungshilfen. Verbindliche Entscheidungen treffen 
        ausschließlich die zuständigen Stellen.
      </div>
      
      ${footer ? `<div class="footer">${footer}</div>` : `
        <div class="footer">
          © 2026 PflegeNavigator EU gUG | www.pflegenavigatoreu.com | 
          Erstellt am: ${new Date().toLocaleDateString('de-DE')}
        </div>
      `}
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
  });

  await browser.close();
  return Buffer.from(pdf);
}

// Spezifische PDF-Templates

export async function generateErgebnisPDF(
  caseCode: string,
  careLevel: number,
  score: number,
  details: string[]
): Promise<Buffer> {
  const content = `
    <h2>Ihre Pflegegrad-Einschätzung</h2>
    
    <div class="result-box">
      <h3>Fallcode: ${caseCode}</h3>
      <p><strong>Eingeschätzter Pflegegrad: ${careLevel}</strong></p>
      <p>Gesamtpunktzahl: ${score} Punkte</p>
    </div>
    
    <h3>Berechnungsdetails</h3>
    <ul>
      ${details.map(d => `<li>${d}</li>`).join('')}
    </ul>
    
    <h3>Nächste Schritte</h3>
    <ol>
      <li>Wenden Sie sich an Ihre Pflegekasse</li>
      <li>Beantragen Sie ein Begutachtungsverfahren</li>
      <li>Verwenden Sie diese Einschätzung als Orientierung</li>
    </ol>
    
    <h3>Rechtlicher Hinweis</h3>
    <p>Diese Einschätzung ist eine Orientierungshilfe basierend auf Ihren Angaben. 
    Der verbindliche Pflegegrad wird durch den Medizinischen Dienst (MD) oder 
    MEDICPROOF (bei Privatversicherten) festgelegt.</p>
  `;

  return generatePDF({
    title: 'Pflegegrad-Einschätzung',
    content,
  });
}

export async function generateWiderspruchPDF(
  caseCode: string,
  currentLevel: number,
  requestedLevel: number,
  reasons: string
): Promise<Buffer> {
  const content = `
    <h2>Widerspruch gegen Pflegegrad-Einstufung</h2>
    
    <p><strong>Fallcode:</strong> ${caseCode}</p>
    
    <h3>Bescheidinformationen</h3>
    <table>
      <tr>
        <th>Aktueller Pflegegrad</th>
        <th>Beantragter Pflegegrad</th>
      </tr>
      <tr>
        <td>Pflegegrad ${currentLevel}</td>
        <td>Pflegegrad ${requestedLevel}</td>
      </tr>
    </table>
    
    <h3>Widerspruchsbegründung</h3>
    <p>${reasons}</p>
    
    <h3>Rechtliche Grundlagen</h3>
    <p>Gemäß § 124 SGB XI lege ich Widerspruch ein gegen die Einstufung 
    in Pflegegrad ${currentLevel}. Ich beantrage die Einstufung in Pflegegrad ${requestedLevel}.</p>
    
    <h3>Beantragte Leistungen</h3>
    <ul>
      <li>Wiederholungsbegutachtung</li>
      <li>Einstufung in Pflegegrad ${requestedLevel}</li>
    </ul>
    
    <p style="margin-top: 40px;">
      <strong>Hinweis:</strong> Der Widerspruch muss innerhalb von 4 Wochen nach 
      Zugang des Bescheids eingelegt werden.
    </p>
  `;

  return generatePDF({
    title: 'Widerspruch Pflegegrad',
    content,
    footer: 'Widerspruch gemäß § 124 SGB XI | PflegeNavigator EU gUG'
  });
}
