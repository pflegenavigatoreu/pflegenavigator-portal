// QR-Code Generator Utilities
export interface QRCodeOptions {
  data: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: string;
  backgroundColor?: string;
}

export function generateQRCodeSVG(options: QRCodeOptions): string {
  const { data, size = 200, color = '#000000', backgroundColor = '#FFFFFF' } = options;
  
  // Vereinfachte QR-Code-Darstellung (in Produktion: qrcode.js Bibliothek)
  const encodedData = btoa(data).replace(/=/g, '');
  const pattern = generateQRPattern(encodedData);
  
  const moduleSize = Math.floor(size / 25); // Standard QR-Code ist 25x25 Module
  const actualSize = moduleSize * 25;
  
  let svg = `<svg width="${actualSize}" height="${actualSize}" viewBox="0 0 ${actualSize} ${actualSize}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${actualSize}" height="${actualSize}" fill="${backgroundColor}"/>`;
  
  // Zeichne QR-Code-Muster
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 25; x++) {
      if (isModuleActive(x, y, pattern)) {
        svg += `<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${color}"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

function generateQRPattern(data: string): string {
  // Vereinfachtes Pattern-Generierung (nur für Demo)
  return data.split('').map(c => c.charCodeAt(0).toString(2)).join('');
}

function isModuleActive(x: number, y: number, pattern: string): boolean {
  // Findungs-Muster (vereinfacht)
  const pos = (y * 25 + x) % pattern.length;
  return pattern[pos] === '1';
}

export function generateQRCodeDataURL(options: QRCodeOptions): string {
  const svg = generateQRCodeSVG(options);
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

// Positionierungs-Muster für QR-Codes
export function getFinderPatterns(): { x: number; y: number }[] {
  return [
    { x: 0, y: 0 },      // Oben links
    { x: 18, y: 0 },     // Oben rechts
    { x: 0, y: 18 },     // Unten links
  ];
}
