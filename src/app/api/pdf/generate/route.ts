import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface PDFGenerateRequest {
  html: string;
  title?: string;
  footer?: {
    text?: string;
    pageNumbers?: boolean;
  };
  header?: {
    text?: string;
    logo?: string;
  };
  options?: {
    format?: 'A4' | 'A5' | 'Letter';
    landscape?: boolean;
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    printBackground?: boolean;
  };
}

const DEFAULT_STYLES = `
  <style>
    @page {
      margin: 20mm 15mm 25mm 15mm;
    }
    body {
      font-family: 'DejaVu Sans', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
    }
    h1 { font-size: 18pt; color: #003366; margin-bottom: 12pt; }
    h2 { font-size: 14pt; color: #004080; margin-top: 16pt; margin-bottom: 8pt; }
    h3 { font-size: 12pt; color: #0059b3; margin-top: 12pt; }
    p { margin-bottom: 8pt; }
    table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f0f0f0; }
    .footer { font-size: 9pt; color: #666; text-align: center; }
    .logo { max-height: 40px; }
  </style>
`;

export async function POST(request: NextRequest): Promise<Response> {
  let browser;
  
  try {
    // Rate Limiting Check (einfache Implementierung)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    
    const body: PDFGenerateRequest = await request.json();
    const { html, title, footer, header, options } = body;

    if (!html || typeof html !== 'string') {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400, headers: getCorsHeaders() }
      );
    }

    // HTML Template mit Styles
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title || 'PDF Dokument'}</title>
        ${DEFAULT_STYLES}
      </head>
      <body>
        ${header?.logo ? `<img src="${header.logo}" class="logo" alt="Logo" />` : ''}
        ${header?.text ? `<div class="header-text">${header.text}</div>` : ''}
        ${html}
      </body>
      </html>
    `;

    // Puppeteer starten
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // Footer Template
    const footerTemplate = footer ? `
      <div style="font-size: 9px; width: 100%; text-align: center; color: #666; padding: 10px;">
        ${footer.text || ''}
        ${footer.pageNumbers ? '<span class="pageNumber"></span> / <span class="totalPages"></span>' : ''}
      </div>
    ` : undefined;

    // PDF generieren
    const pdfBuffer = await page.pdf({
      format: options?.format || 'A4',
      landscape: options?.landscape || false,
      printBackground: options?.printBackground ?? true,
      margin: {
        top: options?.margin?.top || '20mm',
        right: options?.margin?.right || '15mm',
        bottom: options?.margin?.bottom || '25mm',
        left: options?.margin?.left || '15mm'
      },
      displayHeaderFooter: true,
      footerTemplate,
      headerTemplate: '<div></div>'
    });

    await browser.close();

    // PDF als Response zurückgeben
    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(title || 'dokument')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });

  } catch (error) {
    if (browser) await browser.close();
    
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9äöüß\-]/gi, '_').substring(0, 50);
}

function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}
