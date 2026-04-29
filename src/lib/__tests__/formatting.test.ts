import { describe, it, expect } from 'vitest';
import { 
  formatCurrency, 
  formatNumber, 
  formatDate, 
  truncateText, 
  slugify, 
  isValidEmail,
  isValidPLZ,
  stripHtml,
  sleep 
} from './formatting';

describe('formatCurrency', () => {
  it('sollte Euro-Betrag formatieren', () => {
    expect(formatCurrency(1000)).toBe('1.000,00 €');
  });

  it('sollte Dezimalstellen korrekt anzeigen', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56 €');
  });

  it('sollte mit 0 umgehen koennen', () => {
    expect(formatCurrency(0)).toBe('0,00 €');
  });
});

describe('formatNumber', () => {
  it('sollte Tausendertrennzeichen hinzufuegen', () => {
    expect(formatNumber(1000000)).toBe('1.000.000');
  });

  it('sollte kleine Zahlen nicht aendern', () => {
    expect(formatNumber(123)).toBe('123');
  });
});

describe('formatDate', () => {
  it('sollte Datum im deutschen Format formatieren', () => {
    const date = new Date('2026-04-27');
    expect(formatDate(date)).toBe('27.04.2026');
  });

  it('sollte String-Datum akzeptieren', () => {
    expect(formatDate('2026-04-27')).toBe('27.04.2026');
  });
});

describe('truncateText', () => {
  it('sollte Text kuerzen', () => {
    expect(truncateText('Dies ist ein langer Text', 10)).toBe('Dies ist...');
  });

  it('sollte kurzen Text nicht aendern', () => {
    expect(truncateText('Kurz', 10)).toBe('Kurz');
  });

  it('sollte benutzerdefiniertes Suffix nutzen', () => {
    expect(truncateText('Dies ist ein langer Text', 10, ' [...]')).toBe('Dies ist [...]');
  });
});

describe('slugify', () => {
  it('sollte Umlaute und Leerzeichen ersetzen', () => {
    expect(slugify('Hällo Wörld!')).toBe('hllo-wrld');
  });

  it('sollte mehrfache Bindestriche entfernen', () => {
    expect(slugify('Text   mit    Leerzeichen')).toBe('text-mit-leerzeichen');
  });

  it('sollte in Kleinbuchstaben umwandeln', () => {
    expect(slugify('GROSSBUCHSTABEN')).toBe('grossbuchstaben');
  });
});

describe('isValidEmail', () => {
  it('sollte gueltige E-Mails akzeptieren', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.de')).toBe(true);
  });

  it('sollte ungueltige E-Mails ablehnen', () => {
    expect(isValidEmail('keine-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPLZ', () => {
  it('sollte gueltige PLZ akzeptieren', () => {
    expect(isValidPLZ('33607')).toBe(true);
    expect(isValidPLZ('10115')).toBe(true);
  });

  it('sollte ungueltige PLZ ablehnen', () => {
    expect(isValidPLZ('1234')).toBe(false);  // Zu kurz
    expect(isValidPLZ('123456')).toBe(false); // Zu lang
    expect(isValidPLZ('ABCDE')).toBe(false); // Buchstaben
    expect(isValidPLZ('')).toBe(false);
  });
});

describe('stripHtml', () => {
  it('sollte HTML-Tags entfernen', () => {
    expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
  });

  it('sollte mit verschachteltem HTML umgehen', () => {
    expect(stripHtml('<div><span>Text</span></div>')).toBe('Text');
  });

  it('sollte leeren String bei keinem HTML zurueckgeben', () => {
    expect(stripHtml('Nur Text')).toBe('Nur Text');
  });
});

describe('sleep', () => {
  it('sollte die angegebene Zeit warten', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});
