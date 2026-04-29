/**
 * WIDERSPRUCHSMODUL - Fristenberechnung und Management
 * §78 SGB X: Widerspruchsfrist 1 Monat nach Zugang
 * §84 SGG: Klagefrist 1 Monat nach Widerspruchsbescheid
 */

import { addMonths, addDays, isWeekend, isSameDay, format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

// Typen für Widerspruch
export type WiderspruchTyp = 'pflegegrad' | 'mdk-gutachten' | 'klage';

export interface WiderspruchFrist {
  typ: WiderspruchTyp;
  bezeichnung: string;
  gesetz: string;
  fristMonate: number;
  bescheidDatum: Date;
  fristEnde: Date;
  fristEndeWerktag: Date;
  istAbgelaufen: boolean;
  verbleibendeTage: number;
  ampelStatus: 'gruen' | 'gelb' | 'rot' | 'abgelaufen';
}

export interface WiderspruchDaten {
  id?: string;
  typ: WiderspruchTyp;
  bescheidDatum: string; // ISO-Format YYYY-MM-DD
  zustellungDatum?: string;
  versicherterName: string;
  pflegekasse: string;
  versicherungsnummer?: string;
  anschrift?: string;
  begruendung?: string;
  erstelltAm?: string;
  notizen?: string;
}

export interface WiderspruchErgebnis {
  frist: WiderspruchFrist;
  daten: WiderspruchDaten;
  briefVorlage: string;
  checkliste: string[];
  naechsteSchritte: string[];
}

// Deutsche Feiertage (für 2025-2027)
const FEIERTAGE_DE: Record<string, string[]> = {
  '2025': ['01-01', '04-18', '04-21', '05-01', '05-29', '06-09', '10-03', '12-25', '12-26'],
  '2026': ['01-01', '04-03', '04-06', '05-01', '05-14', '05-25', '10-03', '12-25', '12-26'],
  '2027': ['01-01', '03-26', '03-29', '05-01', '05-06', '05-17', '10-03', '12-25', '12-26'],
};

// Konfiguration für verschiedene Widerspruchstypen
const WIDERSPRUCH_KONFIG: Record<WiderspruchTyp, { bezeichnung: string; gesetz: string; fristMonate: number }> = {
  'pflegegrad': {
    bezeichnung: 'Widerspruch gegen Pflegegrad-Bescheid',
    gesetz: '§ 78 SGB X',
    fristMonate: 1
  },
  'mdk-gutachten': {
    bezeichnung: 'Widerspruch gegen MDK-Gutachten',
    gesetz: '§ 78 SGB X',
    fristMonate: 1
  },
  'klage': {
    bezeichnung: 'Klage beim Sozialgericht',
    gesetz: '§ 84 SGG',
    fristMonate: 1
  }
};

/**
 * Prüft ob ein Datum ein Feiertag ist
 */
function istFeiertag(datum: Date): boolean {
  const jahr = datum.getFullYear().toString();
  const tagMonat = format(datum, 'MM-dd');
  const feiertage = FEIERTAGE_DE[jahr] || [];
  return feiertage.includes(tagMonat);
}

/**
 * Prüft ob ein Datum ein Wochenende ist
 */
function istWochenende(datum: Date): boolean {
  const tag = datum.getDay();
  return tag === 0 || tag === 6; // Sonntag = 0, Samstag = 6
}

/**
 * Findet den nächsten Werktag (kein Wochenende, kein Feiertag)
 */
function naechsterWerktag(datum: Date): Date {
  let aktuellesDatum = new Date(datum);
  
  while (istWochenende(aktuellesDatum) || istFeiertag(aktuellesDatum)) {
    aktuellesDatum = addDays(aktuellesDatum, 1);
  }
  
  return aktuellesDatum;
}

/**
 * Berechnet die Widerspruchsfrist
 * §78 SGB X: 1 Monat nach Zugang des Bescheids
 * Feiertags-/Sonntagsregel: Frist endet am nächsten Werktag
 */
export function berechneFrist(
  bescheidDatum: Date,
  typ: WiderspruchTyp = 'pflegegrad'
): WiderspruchFrist {
  const konfig = WIDERSPRUCH_KONFIG[typ];
  
  // Fristende: bescheidDatum + 1 Monat (Kalendermonat)
  const fristEnde = addMonths(bescheidDatum, konfig.fristMonate);
  
  // Wenn Frist auf Wochenende oder Feiertag fällt -> nächster Werktag
  const fristEndeWerktag = naechsterWerktag(fristEnde);
  
  // Heute für Vergleich
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  
  // Verbleibende Tage berechnen
  const verbleibendeTage = differenceInDays(fristEndeWerktag, heute);
  const istAbgelaufen = verbleibendeTage < 0;
  
  // Ampel-System
  let ampelStatus: 'gruen' | 'gelb' | 'rot' | 'abgelaufen';
  if (istAbgelaufen) {
    ampelStatus = 'abgelaufen';
  } else if (verbleibendeTage > 14) {
    ampelStatus = 'gruen';
  } else if (verbleibendeTage >= 7) {
    ampelStatus = 'gelb';
  } else {
    ampelStatus = 'rot';
  }
  
  return {
    typ,
    bezeichnung: konfig.bezeichnung,
    gesetz: konfig.gesetz,
    fristMonate: konfig.fristMonate,
    bescheidDatum: new Date(bescheidDatum),
    fristEnde,
    fristEndeWerktag,
    istAbgelaufen,
    verbleibendeTage: Math.max(0, verbleibendeTage),
    ampelStatus
  };
}

/**
 * Formatierter Text für die Fristanzeige
 */
export function formatiereFristInfo(frist: WiderspruchFrist): string {
  const datumFormat = 'dd.MM.yyyy';
  
  if (frist.istAbgelaufen) {
    return `⚠️ FRIST ABGELAUFEN seit ${format(frist.fristEndeWerktag, datumFormat)}`;
  }
  
  const tageText = frist.verbleibendeTage === 1 ? 'Tag' : 'Tage';
  const emoji = frist.ampelStatus === 'gruen' ? '🟢' : frist.ampelStatus === 'gelb' ? '🟡' : '🔴';
  
  return `${emoji} Noch ${frist.verbleibendeTage} ${tageText} bis ${format(frist.fristEndeWerktag, datumFormat)}`;
}

/**
 * Generiert die Briefvorlage für den Widerspruch
 */
export function generiereWiderspruchBrief(daten: WiderspruchDaten, frist: WiderspruchFrist): string {
  const datumFormat = 'dd.MM.yyyy';
  const heute = format(new Date(), datumFormat);
  const bescheidDatum = format(new Date(daten.bescheidDatum), datumFormat);
  
  const anrede = daten.versicherterName ? 
    `Sehr geehrte Damen und Herren,` : 
    `Sehr geehrte Damen und Herren,`;
  
  const versicherungsnummer = daten.versicherungsnummer ? 
    `Versicherungsnummer: ${daten.versicherungsnummer}` : 
    `Versicherungsnummer: [BITTE EINTRAGEN]`;
  
  const anschrift = daten.anschrift ? 
    `${daten.anschrift}` : 
    `[Ihre Anschrift]`;
  
  const begruendung = daten.begruendung || 
    `[Begründen Sie hier, warum Sie mit dem Bescheid nicht einverstanden sind. ` +
    `Nennen Sie konkrete Punkte des Gutachtens oder Bescheids, die Ihrer Meinung nach nicht zutreffen.]`;

  return `
${daten.versicherterName || '[Ihr Name]'}
${anschrift}


${daten.pflegekasse || '[Name der Pflegekasse]'}
${daten.pflegekasse ? 'z. Hd. Widerspruchsstelle' : '[Anschrift der Pflegekasse]'}



${heute}



Widerspruch gegen Ihren Bescheid vom ${bescheidDatum}


${anrede}

hiermit lege ich fristgerecht Widerspruch gegen Ihren Bescheid vom ${bescheidDatum} ein.

${versicherungsnummer}

BEGRÜNDUNG:
${begruendung}

Ich bitte Sie, meinen Widerspruch zu prüfen und mir einen neuen Bescheid zu erlassen.

Die Frist für diesen Widerspruch läuft gemäß ${frist.gesetz} am ${format(frist.fristEndeWerktag, datumFormat)} ab.

Mit freundlichen Grüßen



${daten.versicherterName || '[Ihre Unterschrift]'}


---
Anlagen:
☐ Kopie des angefochtenen Bescheids
☐ [Weitere Unterlagen/Beweise]
  `.trim();
}

/**
 * Generiert die Checkliste für den Widerspruch
 */
export function generiereCheckliste(daten: WiderspruchDaten): string[] {
  return [
    '☐ Widerspruch innerhalb der Frist einlegen (1 Monat nach Zugang)',
    '☐ Bescheid-Kopie beilegen',
    '☐ Eigene Kopie für Unterlagen aufbewahren',
    '☐ Einschreiben mit Rückschein verwenden',
    '☐ Fristen dokumentieren (Datum Zugang Bescheid)',
    '☐ Antwort der Pflegekasse abwarten (4-6 Wochen)',
    daten.typ === 'pflegegrad' ? '☐ Arztberichte beilegen (falls vorhanden)' : '',
    daten.typ === 'pflegegrad' ? '☐ Pflegeprotokoll/Tagebuch beilegen' : '',
    daten.typ === 'pflegegrad' ? '☐ Zeugen/Aufzeichnungen der Pflege' : '',
    '☐ Nach Widerspruchsbescheid: Klagefrist beachten (1 Monat)'
  ].filter(Boolean);
}

/**
 * Generiert die nächsten Schritte
 */
export function generiereNaechsteSchritte(frist: WiderspruchFrist): string[] {
  const schritte = [
    `1. Widerspruch bis ${format(frist.fristEndeWerktag, 'dd.MM.yyyy')} per Einschreiben senden`,
    '2. Kopie des Bescheids beilegen',
    '3. Kopie für eigene Unterlagen aufbewahren',
    '4. Auf Antwort warten (4-6 Wochen)',
  ];
  
  if (frist.typ === 'pflegegrad') {
    schritte.push('5. Bei Ablehnung: Klage beim Sozialgericht prüfen');
  } else if (frist.typ === 'klage') {
    schritte.push('5. Klage beim zuständigen Sozialgericht einreichen');
  }
  
  return schritte;
}

/**
 * Berechnet die Wochenenden zwischen zwei Daten (für Statistik)
 */
export function zaehleWochenenden(start: Date, ende: Date): number {
  let count = 0;
  let aktuell = new Date(start);
  
  while (aktuell <= ende) {
    if (istWochenende(aktuell)) {
      count++;
    }
    aktuell = addDays(aktuell, 1);
  }
  
  return count;
}

/**
 * Speichert Widerspruchsdaten im localStorage (Client-seitig)
 */
export function speichereWiderspruch(daten: WiderspruchDaten): string {
  const id = daten.id || `WD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const datenMitMeta: WiderspruchDaten = {
    ...daten,
    id,
    erstelltAm: new Date().toISOString()
  };
  
  if (typeof window !== 'undefined') {
    const bestehende = JSON.parse(localStorage.getItem('widersprueche') || '[]');
    const aktualisiert = bestehende.filter((w: WiderspruchDaten) => w.id !== id);
    aktualisiert.push(datenMitMeta);
    localStorage.setItem('widersprueche', JSON.stringify(aktualisiert));
  }
  
  return id;
}

/**
 * Lädt alle gespeicherten Widersprüche
 */
export function ladeWidersprueche(): WiderspruchDaten[] {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('widersprueche') || '[]');
  }
  return [];
}

/**
 * Löscht einen Widerspruch
 */
export function loescheWiderspruch(id: string): void {
  if (typeof window !== 'undefined') {
    const bestehende = JSON.parse(localStorage.getItem('widersprueche') || '[]');
    const gefiltert = bestehende.filter((w: WiderspruchDaten) => w.id !== id);
    localStorage.setItem('widersprueche', JSON.stringify(gefiltert));
  }
}

/**
 * Hauptfunktion: Erstellt ein komplettes Widerspruch-Ergebnis
 */
export function erstelleWiderspruch(daten: WiderspruchDaten): WiderspruchErgebnis {
  const bescheidDatum = new Date(daten.bescheidDatum);
  const frist = berechneFrist(bescheidDatum, daten.typ);
  
  return {
    frist,
    daten,
    briefVorlage: generiereWiderspruchBrief(daten, frist),
    checkliste: generiereCheckliste(daten),
    naechsteSchritte: generiereNaechsteSchritte(frist)
  };
}

// Re-Export für PDF-Generierung (verfügbar in briefe/widerspruch-pdf)
// export { generateWiderspruchPDF } from '@/lib/briefe/widerspruch-pdf';
