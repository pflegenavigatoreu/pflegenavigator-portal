# Entwickler-Handbuch - Coding Standards

## Code-Stil

### TypeScript

#### Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### Typendefinitionen
```typescript
// ✓ Gut: Explizite Typen
interface PflegegradResult {
  careLevel: number | null
  totalScore: number
  moduleScores: ModuleScores
  trafficLight: 'green' | 'yellow' | 'red'
}

// ✗ Schlecht: Implizite/any-Typen
function calculate(data: any) {
  return data.score // Wer weiß, was data ist?
}

// ✓ Gut: Type Guards
function isPflegegradResult(obj: unknown): obj is PflegegradResult {
  return typeof obj === 'object' && 
         obj !== null && 
         'careLevel' in obj &&
         'totalScore' in obj
}
```

#### Funktionen
```typescript
// ✓ Gut: Benannte Parameter-Objekt
interface CalculateOptions {
  scores: ModuleScores
  isChild?: boolean
  childAge?: number
}

function calculatePflegegrad(options: CalculateOptions): PflegegradResult {
  const { scores, isChild = false, childAge } = options
  // ...
}

// ✗ Schlecht: Viele einzelne Parameter
function calculatePflegegrad(
  scores: ModuleScores,
  isChild?: boolean,
  childAge?: number
  // ... weitere Parameter?
): PflegegradResult
```

### React-Komponenten

#### Naming
```typescript
// ✓ Gut: PascalCase für Komponenten
function BriefGenerator() { }
function AvatarChat() { }

// ✗ Schlecht: camelCase für Komponenten
function briefGenerator() { }

// ✓ Gut: camelCase für Hooks
function useCaseStore() { }
function useFocusRing() { }

// ✗ Schlecht: PascalCase für Hooks
function UseCaseStore() { }
```

#### Server vs Client Components
```typescript
// Server Component (default)
// src/app/pflegegrad/page.tsx
export default async function PflegegradPage() {
  const data = await fetchModules()
  return <main>...</main>
}

// Client Component (explizit)
// src/components/BriefGenerator.tsx
'use client'

import { useState } from 'react'

export function BriefGenerator() {
  const [type, setType] = useState('')
  return <div>...</div>
}
```

#### Props-Definition
```typescript
// ✓ Gut: Interface + Destrukturierung
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ✗ Schlecht: Unklare Props
type ButtonProps = any
function Button(props) {
  return <button {...props} />
}
```

### Tailwind CSS

#### Utility-Order
```typescript
// ✓ Gut: Systematische Reihenfolge
<div className="
  /* Layout */
  flex items-center justify-between
  
  /* Sizing */
  w-full h-12
  
  /* Spacing */
  px-4 py-2 m-2
  
  /* Border */
  border border-gray-200 rounded-lg
  
  /* Background */
  bg-white
  
  /* Typography */
  text-sm font-medium text-gray-900
  
  /* Effects */
  shadow-sm hover:shadow-md
  
  /* Transitions */
  transition-shadow duration-200
  
  /* Conditional */
  disabled:opacity-50
"/>

// ✗ Schlecht: Durcheinander
<div className="text-sm flex bg-white px-4 hover:shadow-md m-2 shadow-sm"/>
```

#### Klassen-Komposition
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Verwendung
<div className={cn(
  'btn-base',
  variant === 'primary' && 'btn-primary',
  variant === 'secondary' && 'btn-secondary',
  size === 'sm' && 'btn-sm',
  disabled && 'opacity-50 cursor-not-allowed',
  className  // Benutzer-Klassen überschreiben
)}/>
```

## Projekt-Struktur

### Datei-Organisation

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── briefe/
│   │   │   └── route.ts      # Route Handler
│   │   └── ...
│   ├── pflegegrad/
│   │   └── page.tsx          # Page Component
│   └── layout.tsx            # Root Layout
│
├── components/               # React-Komponenten
│   ├── ui/                   # UI-Komponenten (radix-based)
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── BriefGenerator.tsx    # Feature-Komponenten
│   └── AvatarChat.tsx
│
├── lib/                      # Bibliotheken
│   ├── briefe/               # Domain-Logik
│   │   ├── index.ts          # Public API
│   │   ├── antrag-pflegegrad.ts
│   │   └── widerspruch-pflegegrad.ts
│   ├── utils.ts              # Utilities
│   └── errors.ts             # Error-Klassen
│
├── hooks/                    # Custom Hooks
│   └── useFocusRing.ts
│
└── types/                    # Globale Typen
    └── index.ts
```

### Naming-Conventions

| Art | Konvention | Beispiel |
|-----|------------|----------|
| Komponenten | PascalCase | `BriefGenerator.tsx` |
| Hooks | camelCase + use | `useCaseStore.ts` |
| Utilities | camelCase | `utils.ts` |
| Konstanten | UPPER_SNAKE | `MAX_MODULES = 6` |
| Interfaces | PascalCase | `interface BriefData` |
| Types | PascalCase | `type CareLevel = 1 \| 2 \| 3` |
| Enums | PascalCase | `enum ErrorCode` |
| API-Routes | kebab-case | `widerspruch/route.ts` |

## Fehler-Handling

### Error-Klassen
```typescript
// src/lib/errors.ts
export class PflegeNavigatorError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly userMessage: string,
    public readonly statusCode: number,
    public readonly retryable: boolean,
    public readonly logLevel: LogLevel
  ) {
    super(message)
  }
}

// Spezifische Fehler
export class ValidationError extends PflegeNavigatorError {
  constructor(message: string, field?: string) {
    super(
      ErrorCode.VALIDATION_ERROR,
      'Bitte überprüfen Sie Ihre Eingaben.',
      400,
      true,
      'info'
    )
  }
}
```

### Try-Catch in API-Routes
```typescript
// src/app/api/briefe/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    if (!body.type) {
      throw new ValidationError('Typ ist erforderlich')
    }
    
    // Business-Logik
    const result = await generateBrief(body.type, body.data)
    
    return NextResponse.json({ success: true, data: result })
    
  } catch (error) {
    // Normalisierung
    const appError = normalizeError(error)
    
    // Logging
    if (shouldLogError(appError)) {
      console.error('[API Error]', appError)
    }
    
    // Response
    return NextResponse.json(
      {
        error: appError.userMessage,
        code: appError.code,
        retryable: appError.retryable
      },
      { status: appError.statusCode }
    )
  }
}
```

### Error Boundaries
```typescript
// src/components/ui/error-boundary.tsx
'use client'

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    logError(error)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

## Tests

### Unit-Tests (Vitest)
```typescript
// src/lib/pflegegrad-berechnung.test.ts
import { describe, it, expect } from 'vitest'
import { calculatePflegegrad } from './pflegegrad-berechnung'

describe('calculatePflegegrad', () => {
  it('berechnet Pflegegrad 3 korrekt', () => {
    const scores = {
      1: 80,  // Mobilität
      2: 60,  // Kognition
      3: 40,  // Verhalten
      4: 85,  // Selbstversorgung
      5: 70,  // Therapie
      6: 50   // Alltag
    }
    
    const result = calculatePflegegrad(scores)
    
    expect(result.careLevel).toBe(3)
    expect(result.totalScore).toBeGreaterThan(47.5)
    expect(result.trafficLight).toBeDefined()
  })

  it('berücksichtigt Regel: nur höherer Wert von Modul 2 oder 3', () => {
    const scoresLow2High3 = {
      1: 0, 2: 10, 3: 80, 4: 0, 5: 0, 6: 0
    }
    
    const scoresHigh2Low3 = {
      1: 0, 2: 80, 3: 10, 4: 0, 5: 0, 6: 0
    }
    
    const result1 = calculatePflegegrad(scoresLow2High3)
    const result2 = calculatePflegegrad(scoresHigh2Low3)
    
    // Beide sollten ähnliche Scores haben
    expect(result1.totalScore).toBeCloseTo(result2.totalScore)
  })
})
```

### E2E-Tests (Playwright)
```typescript
// e2e/pflegegrad.spec.ts
import { test, expect } from '@playwright/test'

test('kompletter Pflegegrad-Flow', async ({ page }) => {
  // Start
  await page.goto('/pflegegrad/start')
  
  // Fall erstellen
  await page.click('[data-testid="start-assessment"]')
  
  // Modul 1 ausfüllen
  await page.fill('[name="mobility-1"]', '80')
  await page.click('[data-testid="next-module"]')
  
  // Modul 2 ausfüllen
  await page.fill('[name="cognition-1"]', '60')
  await page.click('[data-testid="next-module"]')
  
  // ... weitere Module
  
  // Ergebnis prüfen
  await expect(page.locator('[data-testid="care-level"]'))
    .toBeVisible()
})
```

### Accessibility-Tests
```typescript
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('keine Accessibility-Fehler auf Startseite', async ({ page }) => {
  await page.goto('/')
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('#main-content')
    .analyze()
  
  expect(accessibilityScanResults.violations).toEqual([])
})
```

## Performance

### React-Optimierung
```typescript
// ✓ Gut: useMemo für teure Berechnungen
const weightedScores = useMemo(() => {
  return {
    1: scores[1] * WEIGHTS[1],
    2: scores[2] * WEIGHTS[2],
    // ...
  }
}, [scores])

// ✓ Gut: useCallback für Event-Handler
const handleSubmit = useCallback((data: BriefData) => {
  submitBrief(data)
}, [])

// ✗ Schlecht: Inline-Funktionen bei jedem Render
<button onClick={() => handleSubmit(data)}>
```

### Next.js-Optimierung
```typescript
// ✓ Gut: Dynamische Imports für schwere Komponenten
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(
  () => import('./PDFViewer'),
  { ssr: false, loading: () => <Skeleton /> }
)

// ✓ Gut: Image-Optimierung
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt=""
  width={800}
  height={400}
  priority  // Für LCP
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle-Analyse
```bash
# Analyse durchführen
npm run analyze

# Oder
npx @next/bundle-analyzer
```

## Dokumentation

### JSDoc für exports
```typescript
/**
 * Berechnet Pflegegrad nach NBA-Regeln.
 * 
 * Wichtig: Von Modul 2 (Kognition) und Modul 3 (Verhalten) zählt
 * nur der HÖHERE Wert (15% Gewichtung)!
 * 
 * @param scores - Punkte für alle 6 NBA-Module (0-100)
 * @param isChild - true für unter 18 Jahre
 * @param childAge - Alter des Kindes in Monaten
 * @returns Pflegegrad-Ergebnis mit Gewichtung und Empfehlungen
 * @throws ValidationError wenn scores ungültig
 * 
 * @example
 * ```typescript
 * const result = calculatePflegegrad({
 *   1: 80, 2: 60, 3: 40, 4: 85, 5: 70, 6: 50
 * })
 * console.log(result.careLevel) // 3
 * ```
 */
export function calculatePflegegrad(
  scores: Partial<ModuleScores>,
  isChild?: boolean,
  childAge?: number
): PflegegradResult {
  // Implementation
}
```

### README pro Modul
```
lib/briefe/
├── README.md           # Modul-Dokumentation
├── index.ts            # Public API
├── antrag-pflegegrad.ts
└── widerspruch-pflegegrad.ts
```

## Git-Workflow

### Commit-Messages
```
feat: Brief-Generator für Versorgungsamt
fix: Korrigiert Gewichtung von Modul 2/3
refactor: Extrahiert PDF-Generierung
perf: Optimiere Bild-Ladezeit
docs: API-Dokumentation aktualisiert
test: Füge Tests für Kinder-Pflegegrad hinzu
chore: Aktualisiere Dependencies
```

### Branching
```bash
# Feature entwickeln
git checkout -b feature/brief-versorgungsamt

# Bugfix
git checkout -b fix/pdf-timeout

# Release
git checkout -b release/v1.2.0
```

### Pull Requests
- Mindestens 1 Review erforderlich
- Alle Tests müssen bestehen
- Keine ESLint/TypeScript-Fehler
- CHANGELOG.md aktualisieren