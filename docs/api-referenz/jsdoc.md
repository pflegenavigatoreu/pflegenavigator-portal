# API-Referenz - JSDoc Dokumentation

## utils.ts

### `cn`

```typescript
/**
 * Kombiniert Tailwind-CSS-Klassen mit clsx und tailwind-merge.
 * 
 * Diese Funktion vereinfacht die Arbeit mit bedingten Klassen in React/Tailwind.
 * Sie akzeptiert beliebige Klassen-Inputs (Strings, Arrays, Objects) und merged
 sie zu einer einzigen, deduplizierten Klassen-String.
 * 
 * @param inputs - Beliebige Klassen-Inputs (ClassValue[])
 * @returns Gemergte, deduplizierte Klassen-String
 * @example
 * ```tsx
 * cn('btn', 'btn-primary', condition && 'btn-large')
 * // => 'btn btn-primary btn-large' (wenn condition true)
 * 
 * cn('px-2 py-1', 'px-4')
 * // => 'py-1 px-4' (px-4 überschreibt px-2 durch tailwind-merge)
 * ```
 */
export function cn(...inputs: ClassValue[]): string
```

---

## errors.ts

### `PflegeNavigatorError`

```typescript
/**
 * Basis-Fehler-Klasse für alle Anwendungsfehler im PflegeNavigator.
 * 
 * Erweitert die native Error-Klasse um anwendungsspezifische Metadaten
 * wie Fehler-Code, HTTP-Status, User-Nachricht und Retry-Fähigkeit.
 * 
 * @extends Error
 * @example
 * ```typescript
 * throw new PflegeNavigatorError({
 *   code: ErrorCode.DATABASE_ERROR,
 *   message: 'Connection failed',
 *   userMessage: 'Datenbank nicht erreichbar. Bitte später erneut versuchen.',
 *   statusCode: 503,
 *   retryable: true,
 *   logLevel: 'error'
 * })
 * ```
 */
export class PflegeNavigatorError extends Error {
  /**
   * Erstellt einen neuen Anwendungsfehler.
   * @param details - Fehler-Details (code, message, userMessage, etc.)
   * @param context - Zusätzlicher Kontext für Logging/Debugging
   */
  constructor(details: ErrorDetails, context?: Record<string, any>)
  
  /**
   * Serialisiert den Fehler zu JSON für Logging/API-Responses.
   * @returns Fehler als JSON-Objekt
   */
  toJSON(): object
}
```

### `ValidationError`

```typescript
/**
 * Fehler für ungültige Benutzer-Eingaben.
 * 
 * HTTP-Status: 400 (Bad Request)
 * Log-Level: info
 * Retryable: true (User kann es korrigieren)
 * 
 * @example
 * ```typescript
 * if (!email.includes('@')) {
 *   throw new ValidationError('Ungültige Email-Adresse', { field: 'email' })
 * }
 * ```
 */
export class ValidationError extends PflegeNavigatorError {
  /**
   * @param message - Technische Fehlermeldung
   * @param context - Kontext (z.B. welches Feld ungültig ist)
   */
  constructor(message: string, context?: Record<string, any>)
}
```

### `NotFoundError`

```typescript
/**
 * Fehler wenn eine Ressource nicht gefunden wird.
 * 
 * HTTP-Status: 404 (Not Found)
 * Log-Level: info
 * Retryable: false
 * 
 * @example
 * ```typescript
 * const case_ = await getCaseByCode('INVALID')
 * if (!case_) {
 *   throw new NotFoundError('Fall', 'INVALID')
 * }
 * // User sieht: "Die angeforderte Ressource wurde nicht gefunden."
 * ```
 */
export class NotFoundError extends PflegeNavigatorError {
  /**
   * @param resource - Art der Ressource (z.B. 'Fall', 'Benutzer')
   * @param identifier - ID oder Code der Ressource
   */
  constructor(resource: string, identifier?: string)
}
```

### `DatabaseError`

```typescript
/**
 * Fehler bei Datenbank-Operationen.
 * 
 * HTTP-Status: 500 (Internal Server Error)
 * Log-Level: error
 * Retryable: true (bei Transient-Fehlern)
 * 
 * @example
 * ```typescript
 * try {
 *   await supabase.from('cases').insert(data)
 * } catch (err) {
 *   throw new DatabaseError('Insert failed', err)
 * }
 * ```
 */
export class DatabaseError extends PflegeNavigatorError {
  /**
   * @param message - Beschreibung des Fehlers
   * @param originalError - Ursprünglicher Fehler für Logging
   */
  constructor(message: string, originalError?: any)
}
```

### `SupabaseError`

```typescript
/**
 * Fehler bei Supabase-Verbindung oder -Operationen.
 * 
 * HTTP-Status: 503 (Service Unavailable)
 * Log-Level: error
 * Retryable: true (meist temporäre Verbindungsprobleme)
 * 
 * @example
 * ```typescript
 * const { error } = await supabase.rpc('health_check')
 * if (error) {
 *   throw new SupabaseError(error.message, error.code)
 * }
 * ```
 */
export class SupabaseError extends PflegeNavigatorError {
  /**
   * @param message - Supabase-Fehlermeldung
   * @param supabaseCode - Supabase-spezifischer Fehler-Code
   */
  constructor(message: string, supabaseCode?: string)
}
```

### `NetworkError`

```typescript
/**
 * Fehler bei Netzwerk-Verbindung (Client-seitig).
 * 
 * HTTP-Status: 0 (Network Error, kein HTTP)
 * Log-Level: warning
 * Retryable: true (wenn Verbindung wiederhergestellt)
 * 
 * @example
 * ```typescript
 * try {
 *   await fetch('/api/data')
 * } catch (err) {
 *   if (err.message.includes('fetch')) {
 *     throw new NetworkError('Keine Internetverbindung')
 *   }
 * }
 * ```
 */
export class NetworkError extends PflegeNavigatorError {
  /**
   * @param message - Beschreibung des Netzwerk-Problems
   */
  constructor(message?: string)
}
```

### `TimeoutError`

```typescript
/**
 * Fehler wenn eine Operation das Zeitlimit überschreitet.
 * 
 * HTTP-Status: 504 (Gateway Timeout)
 * Log-Level: warning
 * Retryable: true (bei Retry mit längerem Timeout)
 * 
 * @example
 * ```typescript
 * const timeout = 30000 // 30 Sekunden
 * const timeoutId = setTimeout(() => {
 *   controller.abort()
 * }, timeout)
 * 
 * try {
 *   await fetch(url, { signal: controller.signal })
 * } catch (err) {
 *   if (err.name === 'AbortError') {
 *     throw new TimeoutError('PDF-Generierung', timeout)
 *   }
 * }
 * ```
 */
export class TimeoutError extends PflegeNavigatorError {
  /**
   * @param operation - Name der Zeitüberschrittenen Operation
   * @param timeoutMs - Zeitlimit in Millisekunden
   */
  constructor(operation: string, timeoutMs: number)
}
```

### `normalizeError`

```typescript
/**
 * Normalisiert beliebige Fehler zu PflegeNavigatorError.
 * 
 * Diese Funktion wandelt unbekannte Fehler (strings, native Errors,
 * etc.) in konsistente PflegeNavigatorError um. Sie erkennt auch
 * spezifische Fehler-Typen (Network, Timeout) anhand der Message.
 * 
 * @param error - Beliebiger Fehler (any)
 * @returns Normalisierter PflegeNavigatorError
 * @example
 * ```typescript
 * try {
 *   await riskyOperation()
 * } catch (err) {
 *   const appError = normalizeError(err)
 *   console.log(appError.userMessage) // Für User anzeigen
 *   console.log(appError.code) // Für Logging
 * }
 * ```
 */
export function normalizeError(error: unknown): PflegeNavigatorError
```

### `isRetryableError`

```typescript
/**
 * Prüft ob ein Fehler wiederholt werden sollte.
 * 
 * Nützlich für Retry-Logik in API-Clients oder Hintergrund-Jobs.
 * 
 * @param error - Zu prüfender Fehler
 * @returns true wenn der Fehler wiederholbar ist
 * @example
 * ```typescript
 * async function fetchWithRetry(url: string, retries = 3) {
 *   try {
 *     return await fetch(url)
 *   } catch (err) {
 *     if (retries > 0 && isRetryableError(err)) {
 *       await sleep(1000)
 *       return fetchWithRetry(url, retries - 1)
 *     }
 *     throw err
 *   }
 * }
 * ```
 */
export function isRetryableError(error: unknown): boolean
```

### `shouldLogError`

```typescript
/**
 * Entscheidet ob ein Fehler geloggt werden sollte.
 * 
 * Nicht alle Fehler müssen geloggt werden (z.B. ValidationErrors
 * sind erwartetes User-Verhalten). Diese Funktion berücksichtigt
 * das logLevel des Fehlers.
 * 
 * @param error - Zu prüfender Fehler
 * @returns true wenn der Fehler geloggt werden soll
 * @example
 * ```typescript
 * catch (err) {
 *   const appError = normalizeError(err)
 *   if (shouldLogError(appError)) {
 *     logger.error(appError.toJSON())
 *   }
 * }
 * ```
 */
export function shouldLogError(error: unknown): boolean
```

---

## supabase.ts

### `createCase`

```typescript
/**
 * Erstellt einen neuen anonymen Fall mit eindeutigem Case-Code.
 * 
 * Ruft die PostgreSQL-Funktion `create_case()` auf, die einen
 * eindeutigen 8-stelligen Code generiert (z.B. "PN2024X7").
 * 
 * @returns Object mit Fall-ID (UUID) und Case-Code
 * @throws SupabaseError wenn die Datenbank nicht erreichbar ist
 * @example
 * ```typescript
 * const { id, case_code } = await createCase()
 * console.log(`Ihr Fall-Code: ${case_code}`) // "PN2024X7"
 * // Speichern für späteren Zugriff!
 * ```
 */
export async function createCase(): Promise<{ id: string; case_code: string }>
```

### `getCaseByCode`

```typescript
/**
 * Lädt einen Fall anhand seines Case-Codes.
 * 
 * @param caseCode - Der Case-Code (z.B. "PN2024X7")
 * @returns Fall-Objekt mit allen Metadaten
 * @throws NotFoundError wenn der Code nicht existiert
 * @throws SupabaseError bei Datenbank-Fehlern
 * @example
 * ```typescript
 * try {
 *   const case_ = await getCaseByCode('PN2024X7')
 *   console.log(case_.status) // 'draft'
 *   console.log(case_.module_count) // 3
 * } catch (err) {
 *   if (err instanceof NotFoundError) {
 *     showError('Fall nicht gefunden. Code prüfen oder neu erstellen.')
 *   }
 * }
 * ```
 */
export async function getCaseByCode(caseCode: string): Promise<Case>
```

### `saveAnswers`

```typescript
/**
 * Speichert Antworten für ein Modul (Upsert-Operation).
 * 
 * Wenn für dieses Modul bereits Antworten existieren, werden sie
 * aktualisiert. Sonst werden neue Antworten erstellt.
 * 
 * @param caseId - UUID des Falls
 * @param moduleNumber - Nummer des Moduls (1-6)
 * @param moduleName - Name des Moduls (z.B. "Mobilität")
 * @param answers - Beliebiges JSON-Objekt mit Antworten
 * @returns Gespeicherte Antwort-Daten
 * @throws DatabaseError bei Speicherfehlern
 * @example
 * ```typescript
 * await saveAnswers(
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   1,
 *   'Mobilität',
 *   {
 *     aufstehenHilfe: 80,
 *     treppensteigen: 60,
 *     zeitaufwand: '20 Minuten'
 *   }
 * )
 * ```
 */
export async function saveAnswers(
  caseId: string,
  moduleNumber: number,
  moduleName: string,
  answers: Record<string, any>
): Promise<any>
```

### `getAnswersForCase`

```typescript
/**
 * Lädt alle Antworten für einen Fall.
 * 
 * @param caseId - UUID des Falls
 * @returns Array von Antworten, sortiert nach Modul-Nummer
 * @throws DatabaseError bei Lade-Fehlern
 * @example
 * ```typescript
 * const answers = await getAnswersForCase(caseId)
 * answers.forEach(a => {
 *   console.log(`Modul ${a.module_number}: ${a.module_name}`)
 * })
 * ```
 */
export async function getAnswersForCase(caseId: string): Promise<Answer[]>
```

### `getModules`

```typescript
/**
 * Lädt alle aktiven NBA-Module.
 * 
 * @returns Array von Modul-Definitionen
 * @throws DatabaseError bei Lade-Fehlern
 * @example
 * ```typescript
 * const modules = await getModules()
 * modules.forEach(m => {
 *   console.log(`${m.module_number}. ${m.name}`)
 *   console.log(`  Dauer: ca. ${m.estimated_duration_minutes} Min`)
 * })
 * ```
 */
export async function getModules(): Promise<Module[]>
```

---

## store.ts

### `useCaseStore`

```typescript
/**
 * Zustand-Store für Case- und Modul-Management.
 * 
 * Persistiert im localStorage (Name: 'pflege-navigator-case').
 * Verwendet Zustand für React-Integration.
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { caseCode, saveModuleAnswers } = useCaseStore()
 *   
 *   const handleSave = () => {
 *     saveModuleAnswers(1, 'Mobilität', { score: 80 })
 *   }
 * }
 * ```
 */
export const useCaseStore: StoreApi<CaseState>

interface CaseState {
  /** Aktuelle Fall-ID (UUID) */
  caseId: string | null
  
  /** Aktueller Case-Code (z.B. "PN2024X7") */
  caseCode: string | null
  
  /** Aktuell ausgewähltes Modul (1-6) */
  currentModule: number
  
  /** Alle gespeicherten Modul-Antworten */
  answers: ModuleAnswer[]
  
  /**
   * Setzt Fall-ID und Case-Code.
   * @param caseId - UUID des Falls
   * @param caseCode - Kurzer Code für den Nutzer
   */
  setCase: (caseId: string, caseCode: string) => void
  
  /**
   * Wechselt zum angegebenen Modul.
   * @param module - Modul-Nummer (1-6)
   */
  setCurrentModule: (module: number) => void
  
  /**
   * Speichert Antworten für ein Modul.
   * @param moduleNumber - 1-6
   * @param moduleName - Name (z.B. "Mobilität")
   * @param answers - Beliebiges JSON
   */
  saveModuleAnswers: (moduleNumber: number, moduleName: string, answers: Record<string, any>) => void
  
  /**
   * Lädt gespeicherte Antworten für ein Modul.
   * @param moduleNumber - 1-6
   * @returns ModuleAnswer oder undefined
   */
  getModuleAnswers: (moduleNumber: number) => ModuleAnswer | undefined
  
  /**
   * Prüft ob ein Modul bereits ausgefüllt wurde.
   * @param moduleNumber - 1-6
   * @returns true wenn Modul fertig
   */
  isModuleCompleted: (moduleNumber: number) => boolean
  
  /**
   * Zählt fertige Module.
   * @returns Anzahl fertiger Module (0-6)
   */
  getCompletedCount: () => number
  
  /**
   * Löscht alle Case-Daten (localStorage).
   */
  clearCase: () => void
}
```

---

## pdf.ts

### `generatePDF`

```typescript
/**
 * Generiert PDF aus HTML mit Puppeteer/Chromium.
 * 
 * Nutzt @sparticuz/chromium für Serverless/Container-Umgebungen.
 * Das PDF enthält PflegeNavigator-Branding und Disclaimer.
 * 
 * @param options - PDF-Optionen (title, content, footer, header)
 * @returns PDF als Buffer
 * @throws TimeoutError wenn Generierung >120s dauert
 * @throws Error wenn Chromium nicht startet
 * @example
 * ```typescript
 * const pdf = await generatePDF({
 *   title: 'Mein Brief',
 *   content: `
 *     <h1>Antrag auf Pflegegrad</h1>
 *     <p>Sehr geehrte Damen und Herren,...</p>
 *   `,
 *   footer: 'Seite 1 von 1'
 * })
 * 
 * // Als Download
 * res.setHeader('Content-Type', 'application/pdf')
 * res.setHeader('Content-Disposition', 'attachment; filename="brief.pdf"')
 * res.send(pdf)
 * ```
 */
export async function generatePDF(options: PDFOptions): Promise<Buffer>

interface PDFOptions {
  /** Titel des Dokuments (im Header) */
  title?: string
  
  /** HTML-Inhalt (Body) */
  content: string
  
  /** HTML-Footer (optional) */
  footer?: string
  
  /** HTML-Header (optional) */
  header?: string
}
```

### `generateErgebnisPDF`

```typescript
/**
 * Generiert PDF für Pflegegrad-Ergebnis.
 * 
 * Spezialisiertes Template mit:
 * - Fallcode-Anzeige
 * - Pflegegrad-Box
 * - Punktzahl-Details
 * - Nächste-Schritte-Liste
 * - Rechtlichem Disclaimer
 * 
 * @param caseCode - Der Fall-Code
 * @param careLevel - Berechneter Pflegegrad (1-5)
 * @param score - Gewichtete Gesamtpunktzahl
 * @param details - Array von Berechnungsdetails als Strings
 * @returns PDF als Buffer
 * @example
 * ```typescript
 * const pdf = await generateErgebnisPDF(
 *   'PN2024X7',
 *   3,
 *   52.5,
 *   [
 *     'Mobilität: 8 Punkte (gewichtet: 0.8)',
 *     'Kognition: 12 Punkte (gewichtet: 1.8)',
 *     'Selbstversorgung: 85 Punkte (gewichtet: 34.0)'
 *   ]
 * )
 * ```
 */
export async function generateErgebnisPDF(
  caseCode: string,
  careLevel: number,
  score: number,
  details: string[]
): Promise<Buffer>
```

### `generateWiderspruchPDF`

```typescript
/**
 * Generiert PDF für Widerspruch.
 * 
 * Template enthält:
 * - Widerspruchs-Formulierung
 * - Bescheid-Informationen
 * - Rechtliche Grundlagen (§ 124 SGB XI)
 * - Beantragte Leistungen
 * 
 * @param caseCode - Fall-Code
 * @param currentLevel - Aktueller Pflegegrad
 * @param requestedLevel - Beantragter Pflegegrad
 * @param reasons - Widerspruchsbegründung
 * @returns PDF als Buffer
 * @example
 * ```typescript
 * const pdf = await generateWiderspruchPDF(
 *   'PN2024X7',
 *   2,
 *   3,
 *   'Die Einstufung berücksichtigt nicht meinen Hilfebedarf...'
 * )
 * ```
 */
export async function generateWiderspruchPDF(
  caseCode: string,
  currentLevel: number,
  requestedLevel: number,
  reasons: string
): Promise<Buffer>
```

---

## pflegegrad-berechnung.ts

### `calculatePflegegrad`

```typescript
/**
 * Berechnet Pflegegrad nach NBA-Kriterien.
 * 
 * **WICHTIGE NBA-REGELN:**
 * - Gewichtung: Modul 4 (40%) ist am wichtigsten!
 * - Nur HÖHERER Wert von Modul 2 ODER 3 zählt (max 15%)!
 * - Modul 6 (Alltag) hat 0% Gewichtung, nur für Widerspruch relevant
 * 
 * @param scores - Punkte für alle 6 Module (0-100 pro Modul)
 * @param isChild - true für unter 18 Jahre (besondere Regeln)
 * @param childAge - Alter des Kindes in Monaten (wenn isChild)
 * @returns Pflegegrad-Ergebnis mit allen Details
 * @throws ValidationError wenn scores ungültig (z.B. >100)
 * @example
 * ```typescript
 * // Normale Berechnung
 * const result = calculatePflegegrad({
 *   1: 80,  // Mobilität
 *   2: 60,  // Kognition
 *   3: 40,  // Verhalten (wird ignoriert, da 2 > 3!)
 *   4: 85,  // Selbstversorgung (40% Gewichtung!)
 *   5: 70,  // Therapie (20% Gewichtung)
 *   6: 50   // Alltag (0%)
 * })
 * 
 * console.log(result.careLevel)      // 3
 * console.log(result.totalScore)   // 52.5
 * console.log(result.trafficLight) // 'green'
 * console.log(result.benefits.monthlyAmount) // 599
 * 
 * // Kinder (unter 18)
 * const childResult = calculatePflegegrad(scores, true, 24)
 * ```
 */
export function calculatePflegegrad(
  scores: Partial<ModuleScores>,
  isChild?: boolean,
  childAge?: number
): PflegegradResult

interface PflegegradResult {
  /** Berechneter Pflegegrad (1-5) oder null wenn zu wenig Punkte */
  careLevel: number | null
  
  /** Gewichtete Gesamtpunktzahl (12.5 - 100) */
  totalScore: number
  
  /** Roh-Punkte pro Modul (0-100) */
  moduleScores: ModuleScores
  
  /** Gewichtete Punkte (nach NBA-Gewichtungen) */
  weightedScores: { 1: number, 2: number, 3: number, 4: number, 5: number }
  
  /** Höherer Wert von Modul 2 oder 3 */
  maxOf23: number
  
  /** Zuverlässigkeit: 'green' | 'yellow' | 'red' */
  trafficLight: 'green' | 'yellow' | 'red'
  
  /** Punkte-Puffer bis zur nächsten Schwelle */
  buffer: number
  
  /** true wenn Module fehlen oder 0 sind */
  missingData: boolean
  
  /** Zugehörige Leistungen */
  benefits: {
    monthlyAmount: number      // Pflegegeld €/Monat
    reliefBudget: number       // Entlastungsbudget €
    additionalBenefits: string[] // Weitere Leistungen
  }
}
```

### `calculateWiderspruchChance`

```typescript
/**
 * Berechnet Erfolgschance eines Widerspruchs.
 * 
 * Die Berechnung basiert auf:
 * - Differenz zwischen aktuellem und erwartetem Pflegegrad
 * - NBA-Modul-Scores (besonders Modul 4 - Selbstversorgung)
 * - Qualität der vorhandenen Daten
 * 
 * @param currentLevel - Aktueller Pflegegrad (1-5)
 * @param expectedLevel - Gewünschter Pflegegrad (1-5)
 * @param scores - NBA-Modul-Scores
 * @returns Chance ('high' | 'medium' | 'low') und Begründung
 * @example
 * ```typescript
 * const { chance, reason } = calculateWiderspruchChance(
 *   2,  // Aktuell PG 2
 *   3,  // Gewünscht PG 3
 *   {
 *     1: 80, 2: 60, 3: 40, 4: 85, 5: 70, 6: 50
 *   }
 * )
 * 
 * console.log(chance) // 'high'
 * console.log(reason) // 'Nur 1 Level Unterschied, starke 
 *                     // Selbstversorgungs-Einschränkungen...'
 * 
 * // UI-Anzeige:
 * if (chance === 'high') {
 *   showSuccess('Gute Erfolgsaussichten! Widerspruch empfohlen.')
 * }
 * ```
 */
export function calculateWiderspruchChance(
  currentLevel: number,
  expectedLevel: number,
  scores: ModuleScores
): { chance: 'high' | 'medium' | 'low'; reason: string }
```

### `getMDPreparationChecklist`

```typescript
/**
 * Gibt Checkliste für MD-Begutachtung vor Ort.
 * 
 * Diese Checkliste sollte Pflegekräfte und Angehörige
 * bei der Vorbereitung unterstützen.
 * 
 * @returns Array von Vorbereitungspunkten
 * @example
 * ```typescript
 * const checklist = getMDPreparationChecklist()
 * checklist.forEach(item => {
 *   console.log(`☐ ${item}`)
 * })
 * // Ausgabe:
 * // ☐ Alle Medikamente bereitlegen
 * // ☐ Ärztliche Berichte parat haben
 * // ☐ Pflegeprotokoll/Tagebuch aktuell (letzte 4 Wochen)
 * // ...
 * ```
 */
export function getMDPreparationChecklist(): string[]
```

### `getMDQuestionnaire`

```typescript
/**
 * Gibt Fragen zurück, die der MD-Assessor wahrscheinlich stellt.
 * 
 * Diese Fragen helfen bei der Vorbereitung auf das
 * Begutachtungsgespräch.
 * 
 * @returns Array von Frage-Objekten
 * @example
 * ```typescript
 * const questions = getMDQuestionnaire()
 * 
 * questions.forEach(q => {
 *   console.log(`Modul ${q.module}: ${q.question}`)
 *   console.log(`  Tipp: ${q.tip}`)
 * })
 * 
 * // Ausgabe:
 * // Modul 1: Wie gut kann die pflegebedürftige Person 
 * //          alleine aufstehen und zu Bett gehen?
 * //   Tipp: Schlechte Tage beschreiben - nicht die guten!
 * ```
 */
export function getMDQuestionnaire(): Array<{
  module: number
  question: string
  tip: string
}>
```

---

## voice.ts

### `speak`

```typescript
/**
 * Liest Text mit Web Speech API vor.
 * 
 * Nutzt Browser-native Text-to-Speech.
 * Falls nicht verfügbar, wird ein Fehler geloggt.
 * 
 * @param text - Vorzulesender Text
 * @param options - Optionale Einstellungen
 * @returns Promise die auflöst wenn Sprache beendet
 * @example
 * ```typescript
 * // Einfach
 * await speak('Hallo, willkommen bei PflegeNavigator.')
 * 
 * // Mit Optionen
 * await speak('Bitte füllen Sie die Module aus.', {
 *   lang: 'de-DE',
 *   rate: 0.8,  // Langsamer
 *   pitch: 1.0
 * })
 * 
 * // In Komponente
 * function ReadAloudButton({ text }) {
 *   const [speaking, setSpeaking] = useState(false)
 *   
 *   const handleClick = async () => {
 *     setSpeaking(true)
 *     await speak(text)
 *     setSpeaking(false)
 *   }
 *   
 *   return <button onClick={handleClick}>
 *     {speaking ? '⏹️ Stop' : '🔊 Vorlesen'}
 *   </button>
 * }
 * ```
 */
export async function speak(
  text: string,
  options?: {
    lang?: string    // 'de-DE', 'en-US', etc.
    rate?: number    // 0.1 - 10 (1 = normal)
    pitch?: number   // 0 - 2 (1 = normal)
  }
): Promise<void>
```

### `stopSpeaking`

```typescript
/**
 * Stoppt aktuelle Sprachausgabe.
 * 
 * @example
 * ```typescript
 * // Stop-Button
 * <button onClick={stopSpeaking}>
 *   ⏹️ Stop
 * </button>
 * 
 * // Automatisch bei Unmount
 * useEffect(() => {
 *   return () => stopSpeaking()
 * }, [])
 * ```
 */
export function stopSpeaking(): void
```

### `isSpeaking`

```typescript
/**
 * Prüft ob aktuell gesprochen wird.
 * 
 * @returns true wenn TTS aktiv
 * @example
 * ```typescript
 * const speaking = isSpeaking()
 * console.log(speaking ? 'Spricht...' : 'Bereit')
 * ```
 */
export function isSpeaking(): boolean
```

---

## qr-delivery.ts

### `generateQRCode`

```typescript
/**
 * Generiert QR-Code als Data-URL.
 * 
 * Nutzt die 'qrcode' Library für server-seitige Generierung.
 * 
 * @param data - Zu kodierende Daten (String)
 * @param options - QR-Code-Optionen
 * @returns Data-URL (base64 PNG) für <img src="...">
 * @throws Error wenn Daten zu lang für QR-Code
 * @example
 * ```typescript
 * // Einfacher QR-Code
 * const qr = await generateQRCode('https://pflegenavigatoreu.com')
 * // "data:image/png;base64,iVBORw0KGgo..."
 * 
 * // Im HTML
 * <img src={qr} alt="QR Code" width={200} />
 * 
 * // Mit Optionen
 * const qr = await generateQRCode('Mein Text', {
 *   width: 512,
 *   errorCorrectionLevel: 'H'  // Hohe Fehlerkorrektur
 * })
 * ```
 */
export async function generateQRCode(
  data: string,
  options?: {
    width?: number              // Größe in Pixeln (default: 256)
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'  // L=Low, H=High
  }
): Promise<string>
```

### `generatePortalQR`

```typescript
/**
 * Generiert QR-Code für Portal-Funktionen.
 * 
 * Erstellt Deep-Link zu spezifischen Portal-Funktionen.
 * 
 * @param type - Art des QR-Codes
 * @param data - Typ-spezifische Daten
 * @returns Data-URL
 * @example
 * ```typescript
 * // Fall-Zugriff
 * const caseQR = await generatePortalQR('case', { code: 'PN2024X7' })
 * 
 * // Brief-Zugriff
 * const briefQR = await generatePortalQR('brief', { id: 'brief-123' })
 * 
 * // Widerspruchs-Status
 * const widerspruchQR = await generatePortalQR('widerspruch', { code: 'PN2024X7' })
 * ```
 */
export async function generatePortalQR(
  type: 'case' | 'brief' | 'widerspruch',
  data: Record<string, string>
): Promise<string>
```

---

## health-alerts.ts

### `sendHealthAlert`

```typescript
/**
 * Sendet Health-Alert über konfigurierte Kanäle.
 * 
 * Unterstützt Telegram, Email, Webhook.
 * Implementiert Cooldown (15 Min) zwischen gleichen Alerts.
 * 
 * @param service - Betroffener Service (z.B. 'database')
 * @param status - Status: 'fail', 'recover', 'warning'
 * @param message - Beschreibung des Problems
 * @param level - Priorität: 'critical', 'warning', 'info'
 * @returns Promise die auflöst wenn Alert gesendet
 * @example
 * ```typescript
 * // Kritischer Fehler
 * await sendHealthAlert('database', 'fail', 'Connection timeout', 'critical')
 * 
 * // Wiederherstellung
 * await sendHealthAlert('database', 'recover', 'Connection restored', 'warning')
 * 
 * // Warning
 * await sendHealthAlert('memory', 'warning', 'Memory >80%', 'warning')
 * ```
 */
export async function sendHealthAlert(
  service: string,
  status: 'fail' | 'recover' | 'warning',
  message: string,
  level: 'critical' | 'warning' | 'info'
): Promise<void>
```

### `getFailureCount`

```typescript
/**
 * Gibt Anzahl aufeinanderfolgender Fehler für einen Service zurück.
 * 
 * Nützlich für Eskalations-Logik (z.B. erst ab 3. Fehler alerten).
 * 
 * @param service - Name des Services
 * @returns Anzahl aufeinanderfolgender Fehler
 * @example
 * ```typescript
 * const failures = getFailureCount('database')
 * if (failures >= 3) {
 *   // Kritischer Alert senden
 *   await sendCriticalAlert('Database failed 3 times!')
 * }
 * ```
 */
export function getFailureCount(service: string): number
```

### `resetFailureCount`

```typescript
/**
 * Setzt Fehler-Zähler für einen Service zurück.
 * 
 * Sollte aufgerufen werden wenn Service sich erholt.
 * 
 * @param service - Name des Services
 * @example
 * ```typescript
 * // Nach Recovery
 * if (health.database.status === 'ok') {
 *   resetFailureCount('database')
 *   await sendHealthAlert('database', 'recover', 'OK', 'info')
 * }
 * ```
 */
export function resetFailureCount(service: string): void
```