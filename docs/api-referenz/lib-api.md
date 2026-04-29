# API-Referenz - src/lib/

## Inhaltsverzeichnis

- [utils.ts](#utils) - CSS/Tailwind-Utilities
- [errors.ts](#errors) - Fehler-Klassen und Error-Handling
- [supabase.ts](#supabase) - Datenbank-Client und CRUD-Funktionen
- [store.ts](#store) - Zustand-State-Management
- [pdf.ts](#pdf) - PDF-Generierung mit Puppeteer
- [pdf-multi-page.ts](#pdf-multi-page) - Multi-Page PDF-Templates
- [pflegegrad-berechnung.ts](#pflegegrad-berechnung) - NBA-Pflegegrad-Berechnung
- [widerspruch.ts](#widerspruch) - Widerspruchs-Logik
- [magic-links.ts](#magic-links) - Magic-Link-Generierung
- [voice.ts](#voice) - Text-to-Speech Integration
- [qr-delivery.ts](#qr-delivery) - QR-Code-Generierung
- [portal-qr.ts](#portal-qr) - Portal-spezifische QR-Codes
- [health-alerts.ts](#health-alerts) - Health-Alert-System
- [monitoring.ts](#monitoring) - Monitoring-Utilities
- [aktuelle-daten-2026.ts](#aktuelle-daten) - Aktuelle Beträge 2026
- [leistungsbeträge-2026.ts](#leistungsbeträge) - Leistungsbeträge Übersicht
- [wcag-checkliste.ts](#wcag) - WCAG-Checkliste
- [gesetze.ts](#gesetze) - Gesetzes-Utilities

---

## utils.ts

### `cn(...inputs: ClassValue[]): string`

Kombiniert Tailwind-Klassen mit `clsx` und `tailwind-merge`.

```typescript
import { cn } from '@/lib/utils'

// Beispiel
const className = cn(
  'btn-base',
  variant === 'primary' && 'btn-primary',
  size === 'sm' && 'text-sm',
  className
)
```

**Parameter:**
- `inputs` - Beliebige Klassen (string, array, object, undefined)

**Rückgabe:**
- Gemergte Klassen-String ohne Duplikate

---

## errors.ts

### ErrorCode-Enum

```typescript
enum ErrorCode {
  // Client-Fehler (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  
  // Server-Fehler (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Spezifische Fehler
  SUPABASE_ERROR = 'SUPABASE_ERROR',
  STRIPE_ERROR = 'STRIPE_ERROR',
  N8N_ERROR = 'N8N_ERROR',
  
  // Allgemein
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}
```

### `PflegeNavigatorError`

Basis-Fehler-Klasse für alle Anwendungsfehler.

```typescript
class PflegeNavigatorError extends Error {
  readonly code: ErrorCode
  readonly userMessage: string
  readonly statusCode: number
  readonly retryable: boolean
  readonly logLevel: 'debug' | 'info' | 'warning' | 'error' | 'critical'
  readonly timestamp: string
  readonly context?: Record<string, any>
}
```

### Spezifische Error-Klassen

| Klasse | Verwendung | HTTP-Code |
|--------|-----------|-----------|
| `ValidationError` | Ungültige Eingaben | 400 |
| `NotFoundError` | Ressource nicht gefunden | 404 |
| `DatabaseError` | Datenbank-Probleme | 500 |
| `SupabaseError` | Supabase-Spezifisch | 503 |
| `NetworkError` | Netzwerk-Probleme | 0 |
| `TimeoutError` | Timeout | 504 |

**Beispiele:**

```typescript
import { ValidationError, NotFoundError, normalizeError } from '@/lib/errors'

// Validierungsfehler
throw new ValidationError('Email ist erforderlich', { field: 'email' })

// Nicht gefunden
throw new NotFoundError('Case', caseCode)

// Fehler normalisieren
try {
  await riskyOperation()
} catch (err) {
  const appError = normalizeError(err)
  console.log(appError.userMessage) // Für Nutzer anzeigen
}
```

### `normalizeError(error: unknown): PflegeNavigatorError`

Wandelt beliebige Fehler in PflegeNavigatorError um.

**Parameter:**
- `error` - Beliebiger Fehler

**Rückgabe:**
- Normalisierter PflegeNavigatorError

### `isRetryableError(error: unknown): boolean`

Prüft, ob ein Fehler wiederholbar ist.

### `shouldLogError(error: unknown): boolean`

Prüft, ob ein Fehler geloggt werden soll.

---

## supabase.ts

### Supabase-Clients

```typescript
// Server-seitig (API Routes)
import { supabaseServer } from '@/lib/supabase'

// Client-seitig (Browser)
import { supabase } from '@/lib/supabase'
```

**WICHTIG:** Im Server-Code immer `supabaseServer` verwenden (mit Service Role Key)!

### Typen

#### `Case`

```typescript
interface Case {
  id: string              // UUID
  case_code: string       // z.B. "PN2024X7"
  status: 'draft' | 'active' | 'completed' | 'archived'
  created_at: string      // ISO 8601
  updated_at: string
  care_level_guess?: number
  module_count: number
}
```

#### `Answer`

```typescript
interface Answer {
  id: string
  case_id: string
  module_number: number   // 1-6
  module_name: string
  answers: Record<string, any>
  completed_at?: string
  created_at: string
}
```

#### `Module`

```typescript
interface Module {
  id: number
  module_number: number
  name: string
  description?: string
  estimated_duration_minutes: number
  is_active: boolean
  sgb_coverage: string[]  // z.B. ["SGB XI", "SGB V"]
}
```

### Hilfsfunktionen

#### `createCase(): Promise<{ id: string; case_code: string }>`

Erstellt einen neuen anonymen Fall.

```typescript
const { id, case_code } = await createCase()
console.log(case_code) // "PN2024X7"
```

**Rückgabe:**
- `id` - UUID des Falls
- `case_code` - Kurzer Code für den Nutzer

#### `getCaseByCode(caseCode: string): Promise<Case>`

Lädt einen Fall nach Code.

**Parameter:**
- `caseCode` - Der Case-Code (z.B. "PN2024X7")

**Rückgabe:**
- Case-Objekt oder Fehler (404)

**Beispiel:**

```typescript
try {
  const case_ = await getCaseByCode('PN2024X7')
  console.log(case_.status)
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log('Fall nicht gefunden')
  }
}
```

#### `saveAnswers(caseId, moduleNumber, moduleName, answers): Promise<any>`

Speichert Antworten für ein Modul.

**Parameter:**
- `caseId` - UUID des Falls
- `moduleNumber` - 1-6
- `moduleName` - Name des Moduls
- `answers` - Beliebiges JSON-Objekt

**Beispiel:**

```typescript
await saveAnswers(
  caseId,
  1,
  'Mobilität',
  {
    aufstehenHilfe: 80,
    treppensteigen: 60
  }
)
```

#### `getAnswersForCase(caseId: string): Promise<Answer[]>`

Lädt alle Antworten für einen Fall.

**Rückgabe:**
- Array von Answer-Objekten, sortiert nach module_number

#### `getModules(): Promise<Module[]>`

Lädt alle aktiven Module.

**Rückgabe:**
- Array von Module-Objekten

---

## store.ts

### Zustand-Store

```typescript
import { useCaseStore } from '@/lib/store'

function MyComponent() {
  const { caseCode, saveModuleAnswers } = useCaseStore()
  // ...
}
```

### State-Interface

```typescript
interface CaseState {
  // State
  caseId: string | null
  caseCode: string | null
  currentModule: number
  answers: ModuleAnswer[]
  
  // Actions
  setCase: (caseId: string, caseCode: string) => void
  setCurrentModule: (module: number) => void
  saveModuleAnswers: (moduleNumber, moduleName, answers) => void
  getModuleAnswers: (moduleNumber) => ModuleAnswer | undefined
  isModuleCompleted: (moduleNumber) => boolean
  getCompletedCount: () => number
  clearCase: () => void
}
```

### Verwendung

```typescript
// Case setzen
const { setCase } = useCaseStore()
setCase('uuid', 'PN2024X7')

// Antworten speichern
const { saveModuleAnswers } = useCaseStore()
saveModuleAnswers(1, 'Mobilität', { score: 80 })

// Prüfen ob Modul fertig
const { isModuleCompleted } = useCaseStore()
const done = isModuleCompleted(1) // boolean

// Alle Antworten laden
const { answers } = useCaseStore()
console.log(answers) // Array aller Module
```

**Wichtig:** State ist mit `persist` middleware gespeichert (localStorage).

---

## pdf.ts

### `generatePDF(options: PDFOptions): Promise<Buffer>`

Generiert PDF aus HTML mit Puppeteer/Chromium.

```typescript
interface PDFOptions {
  title?: string       // PDF-Titel
  content: string      // HTML-Content
  footer?: string      // HTML-Footer
  header?: string      // HTML-Header
}
```

**Beispiel:**

```typescript
import { generatePDF } from '@/lib/pdf'

const pdf = await generatePDF({
  title: 'Mein Brief',
  content: `
    <h1>Hallo Welt</h1>
    <p>Mein Brief-Text...</p>
  `
})

// Als Download anbieten
res.setHeader('Content-Type', 'application/pdf')
res.send(pdf)
```

### `generateErgebnisPDF(caseCode, careLevel, score, details): Promise<Buffer>`

Spezialisiertes Template für Pflegegrad-Ergebnisse.

**Parameter:**
- `caseCode` - Der Fall-Code
- `careLevel` - Berechneter Pflegegrad (1-5)
- `score` - Gesamtpunktzahl
- `details` - Array von Berechnungsdetails

**Beispiel:**

```typescript
const pdf = await generateErgebnisPDF(
  'PN2024X7',
  3,
  52.5,
  [
    'Mobilität: 8 Punkte (gewichtet: 0.8)',
    'Selbstversorgung: 85 Punkte (gewichtet: 34.0)'
  ]
)
```

### `generateWiderspruchPDF(caseCode, currentLevel, requestedLevel, reasons): Promise<Buffer>`

Template für Widerspruchs-PDF.

**Parameter:**
- `caseCode` - Fall-Code
- `currentLevel` - Aktueller Pflegegrad
- `requestedLevel` - Beantragter Pflegegrad
- `reasons` - Widerspruchsbegründung

---

## pdf-multi-page.ts

### Multi-Page PDF-Templates

Für lange Dokumente mit automatischer Seitenumbruch.

```typescript
import { generateMultiPagePDF } from '@/lib/pdf-multi-page'

const pdf = await generateMultiPagePDF({
  title: 'Ausführlicher Bericht',
  sections: [
    { title: 'Teil 1', content: '...' },
    { title: 'Teil 2', content: '...' }
  ]
})
```

---

## pflegegrad-berechnung.ts

### `calculatePflegegrad(scores, isChild?, childAge?): PflegegradResult`

Berechnet Pflegegrad nach NBA-Kriterien.

**WICHTIG:** Von Modul 2 (Kognition) und Modul 3 (Verhalten) zählt nur der HÖHERE Wert!

```typescript
interface ModuleScores {
  1: number  // Mobilität (10%)
  2: number  // Kognition (15%)
  3: number  // Verhalten (15%)
  4: number  // Selbstversorgung (40%)
  5: number  // Therapie (20%)
  6: number  // Alltag (0%)
}

interface PflegegradResult {
  careLevel: number | null      // 1-5 oder null
  totalScore: number            // Gewichtete Summe
  moduleScores: ModuleScores    // Roh-Punkte
  weightedScores: object       // Gewichtete Punkte
  trafficLight: 'green' | 'yellow' | 'red'
  buffer: number                // Puffer bis nächste Schwelle
  missingData: boolean          // Fehlen Daten?
  benefits: {
    monthlyAmount: number       // Pflegegeld
    reliefBudget: number
    additionalBenefits: string[]
  }
}
```

**Beispiel:**

```typescript
import { calculatePflegegrad } from '@/lib/pflegegrad-berechnung'

const result = calculatePflegegrad({
  1: 80,   // Mobilität
  2: 60,   // Kognition
  3: 40,   // Verhalten (niedriger als 2 → wird ignoriert!)
  4: 85,   // Selbstversorgung (40% Gewichtung!)
  5: 70,   // Therapie
  6: 50    // Alltag
})

console.log(result.careLevel)  // z.B. 3
console.log(result.totalScore) // z.B. 52.5
console.log(result.trafficLight) // 'green'
```

### `calculateWiderspruchChance(currentLevel, expectedLevel, scores): object`

Berechnet Erfolgschance eines Widerspruchs.

**Rückgabe:**
```typescript
{
  chance: 'high' | 'medium' | 'low',
  reason: string  // Erklärung
}
```

**Beispiel:**

```typescript
const { chance, reason } = calculateWiderspruchChance(
  2,  // Aktuell
  3,  // Gewünscht
  scores
)

console.log(chance) // 'high'
console.log(reason) // 'Nur 1 Level Unterschied...'
```

### `getMDPreparationChecklist(): string[]`

Checkliste für MD-Besuch.

**Rückgabe:**
Array von Vorbereitungspunkten:
- "Alle Medikamente bereitlegen"
- "Ärztliche Berichte parat haben"
- ...

### `getMDQuestionnaire(): array`

Frageliste für MD-Gespräch.

**Rückgabe:**
```typescript
[
  {
    module: 1,
    question: 'Wie gut kann die pflegebedürftige Person alleine aufstehen?',
    tip: 'Schlechte Tage beschreiben - nicht die guten!'
  }
]
```

---

## widerspruch.ts

### Widerspruchs-Logik

```typescript
import { 
  generateWiderspruchBrief,
  getWiderspruchFristen,
  validateWiderspruchDaten 
} from '@/lib/widerspruch'
```

### `generateWiderspruchBrief(data): string`

Generiert Widerspruchsbrief-Text.

**Parameter:**
```typescript
{
  caseCode: string
  currentLevel: number
  expectedLevel: number
  versicherungsnummer?: string
  versicherung?: string
  gruende?: string
}
```

**Rückgabe:**
Vollständiger Brief-Text (string)

---

## magic-links.ts

### `generateMagicLink(caseCode): string`

Generiert Magic-Link für direkten Zugriff auf Fall.

**Beispiel:**

```typescript
const link = generateMagicLink('PN2024X7')
// "https://pflegenavigatoreu.com/magic?token=..."
```

### `validateMagicLink(token): string | null`

Validiert Magic-Link-Token.

**Rückgabe:**
Case-Code oder null (wenn ungültig/abgelaufen)

---

## voice.ts

### Text-to-Speech Integration

```typescript
import { speak, stopSpeaking, isSpeaking } from '@/lib/voice'

// Text vorlesen
await speak('Hallo, ich bin der PflegeNavigator.')

// Stoppen
stopSpeaking()

// Status
console.log(isSpeaking()) // boolean
```

### `speak(text: string, options?): Promise<void>`

**Parameter:**
- `text` - Vorzulesender Text
- `options.lang` - Sprache (default: 'de-DE')
- `options.rate` - Geschwindigkeit (0.1-10, default: 1)
- `options.pitch` - Tonhöhe (0-2, default: 1)

---

## qr-delivery.ts

### QR-Code-Generierung

```typescript
import { generateQRCode, generatePortalQR } from '@/lib/qr-delivery'

// QR-Code für Text/URL
const qrDataUrl = await generateQRCode('https://example.com')

// QR-Code für Portal-Zugriff
const portalQR = await generatePortalQR('PN2024X7')
```

### `generateQRCode(data, options?): Promise<string>`

**Parameter:**
- `data` - Zu kodierende Daten (string)
- `options.width` - Breite in Pixeln (default: 256)
- `options.errorCorrectionLevel` - 'L' | 'M' | 'Q' | 'H'

**Rückgabe:**
Data-URL (Base64 PNG) für Image-Tag

**Beispiel:**

```typescript
const dataUrl = await generateQRCode('Mein Text', { width: 512 })
// "data:image/png;base64,iVBORw0KGgo..."

// In HTML
const img = document.createElement('img')
img.src = dataUrl
```

---

## portal-qr.ts

### Portal-spezifische QR-Codes

```typescript
import { 
  generateCaseQR,
  generateBriefQR,
  generateWiderspruchQR 
} from '@/lib/portal-qr'

// Fall-QR (Zugriff auf Case)
const caseQR = await generateCaseQR('PN2024X7')

// Brief-QR (Link zu generiertem Brief)
const briefQR = await generateBriefQR(briefId)

// Widerspruch-QR (Status-Tracking)
const widerspruchQR = await generateWiderspruchQR(caseCode)
```

---

## health-alerts.ts

### Health-Alert-System

```typescript
import { sendHealthAlert, getFailureCount } from '@/lib/health-alerts'

// Alert senden
await sendHealthAlert('database', 'fail', 'Timeout', 'critical')

// Ausfalls-Zähler prüfen
const failures = getFailureCount('database')
```

### `sendHealthAlert(service, status, message, level)`

**Parameter:**
- `service` - Service-Name (z.B. 'database')
- `status` - 'fail', 'recover', 'warning'
- `message` - Beschreibung
- `level` - 'critical', 'warning', 'info'

### `getFailureCount(service): number`

Gibt Anzahl aufeinanderfolgender Fehler zurück.

### `resetFailureCount(service): void`

Setzt Fehler-Zähler zurück.

---

## monitoring.ts

### `logMetric(name: string, value: number, tags?: object): void`

Loggt Metrik für Monitoring.

```typescript
import { logMetric } from '@/lib/monitoring'

// Timing
logMetric('pdf.generation.time', 2500, { 
  type: 'brief',
  cached: false 
})

// Counter
logMetric('api.requests.count', 1, {
  endpoint: '/api/briefe',
  method: 'POST'
})
```

---

## aktuelle-daten-2026.ts

### Aktuelle Beträge für 2026

```typescript
import { 
  PFLEGELDER_BETRAEGE_2026,
  ENTLASTUNGSBUDGET_2026,
  PFLEGEHILFSMITTEL_2026 
} from '@/lib/aktuelle-daten-2026'

// Pflegegeld 2026
PFLEGELDER_BETRAEGE_2026[2] // 347
PFLEGELDER_BETRAEGE_2026[5] // 990

// Entlastungsbudget
ENTLASTUNGSBUDGET_2026 // 3539 (jährlich)
```

### Konstanten

| Konstante | Wert | Beschreibung |
|-----------|------|--------------|
| `PFLEGELDER_BETRAEGE_2026` | Record<number, number> | Pflegegeld pro PG |
| `ENTLASTUNGSBUDGET_2026` | 3539 | Entlastungsbudget €/Jahr |
| `PFLEGEHILFSMITTEL_2026` | 42 | Pflegehilfsmittel €/Monat |
| `WOHNRAUMANPASSUNG_2026` | 4180 | Wohnraumanpassung € einmalig |

---

## leistungsbeträge-2026.ts

### Leistungsübersicht 2026

```typescript
import { 
  getLeistungenFuerPflegegrad,
  getZuschuesseNachBundesland 
} from '@/lib/leistungsbeträge-2026'

// Leistungen für PG 3
const leistungen = getLeistungenFuerPflegegrad(3)
// [
//   { name: 'Pflegegeld', betrag: 599 },
//   { name: 'Entlastungsbudget', betrag: 3539 }
// ]
```

---

## wcag-checkliste.ts

### WCAG 2.1 AA-Checkliste

```typescript
import { 
  WCAG_CHECKLISTE,
  checkWCAGCompliance 
} from '@/lib/wcag-checkliste'

// Alle Kriterien
console.log(WCAG_CHECKLISTE)

// Compliance prüfen
checkWCAGCompliance(document).then(result => {
  console.log(result.passed)  // Passed checks
  console.log(result.failed) // Failed checks
})
```

### Kategorien

- **Perceptible**: Wahrnehmbar (Alternativtexte, Kontrast)
- **Operable**: Bedienbar (Tastatur-Navigation, Fokus)
- **Understandable**: Verständlich (Sprache, Lesbarkeit)
- **Robust**: Robust (Valides HTML, ARIA)

---

## gesetze.ts

### Gesetzes-Utilities

```typescript
import { 
  getParagraphText,
  getSGBLinks,
  searchGesetze 
} from '@/lib/gesetze'

// Paragraphen-Text laden
const text = await getParagraphText('XI', '15')
// Inhalt von § 15 SGB XI

// Links zu Gesetzen
const links = getSGBLinks()
```

---

## briefe/ (Modul)

### Brief-Generatoren

#### Import

```typescript
// Alle Generatoren
import { 
  versorgungsamtGenerator,
  emRenteGenerator,
  allgemeinerBriefGenerator,
  widerspruchPflegegradGenerator,
  antragPflegegradGenerator,
  betreuungsrechtGenerator,
  erbrechtGenerator
} from '@/lib/briefe'
```

#### `generateBrief(data): string`

Jeder Generator hat eine `generateBrief`-Methode:

```typescript
// Versorgungsamt
const brief = versorgungsamtGenerator.generateBrief({
  absenderName: 'Max Mustermann',
  absenderStrasse: 'Musterstraße 1',
  empfaenger: 'Versorgungsamt Musterstadt',
  betreff: 'Antrag auf Erwerbsminderungsrente'
})

// EM-Rente
const brief = emRenteGenerator.generateBrief({
  // ...
})
```

#### EM-Rente: `generateGutachtenFragen()`

Gibt Liste der wichtigsten Gutachten-Fragen zurück.

```typescript
const fragen = emRenteGenerator.generateGutachtenFragen()
// Array von Fragen für Vorbereitung
```

### Brief-Typen

| Generator | Zweck |
|-----------|-------|
| `versorgungsamtGenerator` | Schwerbehindertenausweis, EM-Rente |
| `emRenteGenerator` | Erwerbsminderungsrente |
| `allgemeinerBriefGenerator` | Universelle Vorlage |
| `widerspruchPflegegradGenerator` | Widerspruch Pflegegrad |
| `antragPflegegradGenerator` | Erstbeantragung |
| `betreuungsrechtGenerator` | Betreuung, Vorsorgevollmacht |
| `erbrechtGenerator` | Testament |

---

## pflegegrad/ (Modul)

### NBA-Module

```typescript
import { 
  NBA_MODULES,
  getModuleByNumber,
  getModuleDescription 
} from '@/lib/pflegegrad/nba-modules'

// Alle Module
console.log(NBA_MODULES)

// Einzelnes Modul
const modul1 = getModuleByNumber(1)
```

### `NBA_MODULES`

```typescript
[
  {
    number: 1,
    name: 'Mobilität',
    description: 'Aufstehen, Gehen, Treppensteigen',
    weight: 0.10,
    maxPoints: 100
  },
  {
    number: 2,
    name: 'Kognition',
    description: 'Gedächtnis, Orientierung, Entscheidungen',
    weight: 0.15,
    maxPoints: 100
  },
  // ...
]
```

---

## Nutzungsbeispiele

### Vollständiger Flow: Pflegegrad berechnen

```typescript
import { createCase, saveAnswers } from '@/lib/supabase'
import { calculatePflegegrad } from '@/lib/pflegegrad-berechnung'
import { generateErgebnisPDF } from '@/lib/pdf'

// 1. Fall erstellen
const { id, case_code } = await createCase()

// 2. Antworten speichern
await saveAnswers(id, 1, 'Mobilität', { score: 80 })
await saveAnswers(id, 2, 'Kognition', { score: 60 })
await saveAnswers(id, 4, 'Selbstversorgung', { score: 85 })

// 3. Pflegegrad berechnen
const result = calculatePflegegrad({
  1: 80,
  2: 60,
  4: 85
})

// 4. PDF generieren
const pdf = await generateErgebnisPDF(
  case_code,
  result.careLevel,
  result.totalScore,
  ['Berechnungsdetails...']
)
```

### Widerspruch mit Erfolgschance

```typescript
import { calculateWiderspruchChance } from '@/lib/pflegegrad-berechnung'
import { generateWiderspruchPDF } from '@/lib/pdf'

// Chancen berechnen
const { chance, reason } = calculateWiderspruchChance(2, 3, scores)

// PDF nur bei guter Chance?
if (chance !== 'low') {
  const pdf = await generateWiderspruchPDF(
    caseCode,
    2,
    3,
    'Meine Begründung...'
  )
}
```

---

## TypeScript-Typen

Alle Typen sind in `src/types/index.ts` exportiert:

```typescript
import type { 
  Case, 
  Answer, 
  Module,
  ModuleScores,
  PflegegradResult 
} from '@/types'
```