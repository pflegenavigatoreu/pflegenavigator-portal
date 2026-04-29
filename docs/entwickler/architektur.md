# Entwickler-Handbuch - Architektur

## Übersicht

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PFLEGENAVIGATOR EU ARCHITEKTUR                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │   Browser    │  │   Browser    │  │   Browser    │     │
│  │   (Client)   │  │   (Client)   │  │   (Client)   │  │   (Client)   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                │                │                │              │
│         └────────────────┴────────────────┴────────────────┘              │
│                          │                                                │
│                    ┌─────▼─────┐                                         │
│                    │   CDN     │  (Vercel Edge/Cloudflare)               │
│                    └─────┬─────┘                                         │
│                          │                                                │
│  ┌───────────────────────▼──────────────────────────────────────┐        │
│  │                   NEXT.JS 16 SERVER                           │        │
│  │  ┌─────────────────┬─────────────────┬─────────────────┐     │        │
│  │  │   App Router    │   API Routes    │   Middleware    │     │        │
│  │  │                 │                 │                 │     │        │
│  │  │  ┌───────────┐  │  ┌───────────┐  │                 │     │        │
│  │  │  │  Pages    │  │  │  Cases    │  │  ┌─────────┐   │     │        │
│  │  │  │  Briefe   │  │  │  Briefe   │  │  │ i18n    │   │     │        │
│  │  │  │  PG-Rechner│  │  │  Health   │  │  │ Auth    │   │     │        │
│  │  │  │  ...      │  │  │  Avatar   │  │  │ Routes  │   │     │        │
│  │  │  └───────────┘  │  └───────────┘  │  └─────────┘   │     │        │
│  │  └─────────────────┴─────────────────┴─────────────────┘     │        │
│  └───────────────────────────┬───────────────────────────────────┘        │
│                              │                                            │
│                    ┌─────────┴─────────┐                                 │
│                    │   SUPABASE        │                                 │
│                    │   ┌──────────────┐  │                                 │
│                    │   │   Auth       │  │                                 │
│                    │   │   Database   │  │                                 │
│                    │   │   Storage    │  │                                 │
│                    │   │   Edge       │  │                                 │
│                    │   │   Functions  │  │                                 │
│                    │   └──────────────┘  │                                 │
│                    └─────────────────────┘                                 │
│                              │                                            │
│         ┌────────────────────┼────────────────────┐                      │
│         │                    │                    │                      │
│  ┌──────▼──────┐   ┌─────────▼──────────┐   ┌────▼──────┐             │
│  │  Puppeteer  │   │  LibreTranslate    │   │  Umami    │             │
│  │  (PDF)      │   │  (Übersetzung)     │   │  (Analytics│             │
│  └─────────────┘   └────────────────────┘   └───────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Schicht | Technologie | Zweck |
|---------|-------------|-------|
| Frontend | Next.js 16, React 19, TypeScript | SSR, App Router, Type Safety |
| Styling | Tailwind CSS 4, CSS Modules | Utility-First CSS |
| State | Zustand, React Server Components | Lokal + Server State |
| Backend | Next.js API Routes, Supabase | Serverless API, DB |
| Database | PostgreSQL (Supabase) | Relationale Daten |
| Auth | Anonyme Cases (keine Auth nötig) | Privacy-First |
| i18n | next-intl | 25 Sprachen |
| PDF | Puppeteer + Chromium | Serverseitige PDF |
| Monitoring | Umami, Uptime Kuma | Self-Hosted |
| Testing | Vitest, Playwright | Unit + E2E |

## App Router Struktur

```
src/app/
├── layout.tsx              # Root-Layout mit i18n
├── page.tsx                # Startseite (Landing)
├── not-found.tsx           # 404 Seite
├── globals.css             # Globale Styles
│
├── api/                    # API-Routen (Route Handlers)
│   ├── health/             # System-Health-Checks
│   │   └── route.ts
│   ├── health/db/          # DB-Health
│   │   └── route.ts
│   ├── briefe/             # Brief-Generierung
│   │   └── route.ts
│   ├── briefe/pdf/         # Brief-PDF
│   │   └── route.ts
│   ├── cases/              # Fall-Management
│   │   └── route.ts
│   ├── cases/[code]/       # Fall-Details
│   │   └── route.ts
│   ├── cases/[code]/scores/  # Pflegegrad-Berechnung
│   │   └── route.ts
│   ├── widerspruch/        # Widerspruchs-API
│   │   └── route.ts
│   └── avatar/chat/        # Avatar-Chat
│       └── route.ts
│
├── pflegegrad/             # Pflegegrad-Rechner
│   ├── page.tsx            # Einstieg
│   ├── start/page.tsx      # Start-Seite
│   ├── ergebnis/page.tsx   # Ergebnis-Seite
│   └── modul{1-6}/page.tsx # Module 1-6
│
├── briefe/                 # Brief-Generator
│   └── page.tsx
│
├── widerspruch/            # Widerspruchs-Assistent
│   └── page.tsx
│
├── hilfe/                  # Hilfe-Center
│   └── page.tsx
│
├── datenschutz/            # Datenschutz
│   ├── page.tsx
│   ├── auskunft/page.tsx
│   └── loeschen/page.tsx
│
└── [lang]/                 # i18n-Routen (25 Sprachen)
    └── layout.tsx
```

## Datenmodell

### Supabase-Schema

```sql
-- Fälle (anonym, 90 Tage Gültigkeit)
create table cases (
  id uuid primary key default gen_random_uuid(),
  case_code text unique not null,  -- z.B. "PN2024X7"
  status text default 'draft',      -- draft, active, completed, archived
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  care_level_guess int,             -- geschätzter PG
  module_count int default 0,
  expires_at timestamptz default now() + interval '90 days'
);

-- Antworten pro Modul
create table answers (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade,
  module_number int not null,
  module_name text not null,
  answers jsonb not null,           -- Modul-spezifische Daten
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(case_id, module_number)
);

-- NBA-Module Definitionen
create table modules (
  id int primary key,
  module_number int unique not null,
  name text not null,
  description text,
  estimated_duration_minutes int default 5,
  is_active boolean default true,
  sgb_coverage text[]              -- z.B. {"SGB XI", "SGB V"}
);
```

### TypeScript-Typen

```typescript
// src/lib/supabase.ts
export interface Case {
  id: string
  case_code: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
  care_level_guess?: number
  module_count: number
}

export interface Answer {
  id: string
  case_id: string
  module_number: number
  module_name: string
  answers: Record<string, any>
  completed_at?: string
  created_at: string
}

export interface Module {
  id: number
  module_number: number
  name: string
  description?: string
  estimated_duration_minutes: number
  is_active: boolean
  sgb_coverage: string[]
}
```

## Komponenten-Architektur

### Server Components (Standard)

```typescript
// src/app/pflegegrad/page.tsx
export default async function PflegegradPage() {
  // Server-seitige Logik
  const modules = await getModules()
  
  return (
    <main>
      <h1>Pflegegrad-Rechner</h1>
      <ModuleList modules={modules} />  {/* Client Component */}
    </main>
  )
}
```

### Client Components (interaktiv)

```typescript
'use client'

// src/components/BriefGenerator.tsx
import { useState } from 'react'
import { useCaseStore } from '@/lib/store'

export function BriefGenerator() {
  const [type, setType] = useState('')
  const saveAnswers = useCaseStore(state => state.saveModuleAnswers)
  
  // Interaktive Logik
}
```

### Komponenten-Hierarchie

```
RootLayout
├── Analytics (Server)
├── I18nProvider (Client)
│   └── PageContent
│       ├── Header (Server)
│       ├── CookieBanner (Client)
│       ├── SkipLink (Client)
│       └── MainContent
│           ├── ServerComponent (default)
│           │   └── ClientComponent (interaktiv)
│           └── ErrorBoundary
└── Footer (Server)
```

## State-Management

### Zustand Store (Client)

```typescript
// src/lib/store.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCaseStore = create<CaseState>()(
  persist(
    (set, get) => ({
      caseId: null,
      caseCode: null,
      currentModule: 1,
      answers: [],
      
      setCase: (caseId, caseCode) => set({ caseId, caseCode }),
      
      saveModuleAnswers: (moduleNumber, moduleName, answers) => {
        // Upsert-Logik
      },
      
      getModuleAnswers: (moduleNumber) => {
        return get().answers.find(a => a.moduleNumber === moduleNumber)
      },
      
      isModuleCompleted: (moduleNumber) => {
        return get().answers.some(a => a.moduleNumber === moduleNumber)
      }
    }),
    {
      name: 'pflege-navigator-case',
      skipHydration: true
    }
  )
)
```

### Server State (Supabase)

```typescript
// src/lib/supabase.ts
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

// Nur in API-Routen verwenden!
export const supabase = createClient(supabaseUrl, anonKey)
// Für Client-Code
```

## API-Architektur

### Route Handler Pattern

```typescript
// src/app/api/briefe/route.ts
import { NextRequest, NextResponse } from 'next/server'

// GET - Liste der Brief-Typen
export async function GET() {
  return NextResponse.json({ types: [...] })
}

// POST - Brief generieren
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validierung
    if (!body.type || !body.data) {
      return NextResponse.json(
        { error: 'Typ und Daten erforderlich' },
        { status: 400 }
      )
    }
    
    // Business-Logik
    const brief = await generateBrief(body.type, body.data)
    
    return NextResponse.json({
      success: true,
      briefText: brief
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  }
}
```

### Middleware-Pipeline

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/',
    '/(de|en|fr|es|it|pt|nl|pl|ro|el|hu|cs|sv|bg|da|fi|sk|lt|sl|lv|et|mt|ga|hr|tr|uk|sr|mk|sq|bs|me)/:path*'
  ]
}
```

## PDF-Generierung

```typescript
// src/lib/pdf.ts
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function generatePDF(options: PDFOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  })
  
  const page = await browser.newPage()
  
  const html = generateHTMLTemplate(options)
  
  await page.setContent(html, { waitUntil: 'networkidle0' })
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  })
  
  await browser.close()
  return Buffer.from(pdf)
}
```

## i18n-Architektur

```
├── src/
│   ├── i18n/
│   │   ├── config.ts           # i18n-Konfiguration
│   │   ├── routing.ts          # Sprach-Routing
│   │   └── rtl.ts              # RTL-Sprachen
│   └── middleware.ts           # next-intl Middleware
│
├── messages/                   # Übersetzungs-Dateien
│   ├── de.json                 # Deutsch (Default)
│   ├── en.json                 # Englisch
│   ├── fr.json                 # Französisch
│   └── ...                     # 25 Sprachen
```

## Fehler-Handling

```
┌─────────────────────────────────────────────────┐
│              ERROR ARCHITECTURE                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐                              │
│  │  try/catch   │  API Routes                   │
│  │  in Routes   │  ┌─────────────┐              │
│  └──────┬───────┘  │ Business    │              │
│         │          │ Logic       │              │
│  ┌──────▼───────┐  └──────┬──────┘              │
│  │ CustomError  │         │                     │
│  │ Classes      │  ┌───────▼────────┐           │
│  │ (lib/errors) │  │ normalizeError() │           │
│  └──────┬───────┘  └───────┬────────┘           │
│         │                  │                    │
│  ┌──────▼───────┐  ┌──────▼───────┐           │
│  │ Error Logger  │  │ User Message │           │
│  │ (GlitchTip)   │  │ (Friendly)   │           │
│  └───────────────┘  └───────────────┘           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Performance-Optimierung

### Server Components
- Standard: Server-seitiges Rendering
- Kein JS-Bundle für statische Inhalte

### Streaming
```typescript
// Suspense für progressive Loading
<Suspense fallback={<ModuleSkeleton />}>
  <ModuleData />
</Suspense>
```

### Image-Optimierung
```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="PflegeNavigator"
  width={800}
  height={400}
  priority  // Für LCP-Bilder
/>
```

### Code-Splitting
- Route-basiertes Splitting automatisch
- Dynamische Imports für schwere Komponenten

## Deployment

### Vercel (Empfohlen)
```bash
npm i -g vercel
vercel --prod
```

### Docker
```bash
docker build -t pflegenavigator .
docker run -p 3000:3000 pflegenavigator
```

### Self-Hosted
```bash
npm run build
npm start
```