# OPTIMALE KONFIGURATION 2025 - PflegeNavigator EU

Basierend auf aktuellen Best Practices (April 2026 recherchiert)

---

## 1. NEXT.JS 16 APP ROUTER - OPTIMALE STRUKTUR

### Empfohlene Architektur (2025 Best Practice)

```
src/
├── app/                    # App Router (Pages Router vermeiden!)
│   ├── (marketing)/        # Route Groups für Marketing-Seiten
│   ├── (dashboard)/        # Route Groups für Dashboard
│   ├── api/                # API Routes
│   │   ├── cases/route.ts
│   │   ├── briefe/route.ts
│   │   └── avatar/chat/route.ts
│   ├── pflegegrad/
│   │   ├── start/page.tsx
│   │   ├── modul1-6/page.tsx
│   │   └── ergebnis/page.tsx
│   ├── layout.tsx          # Root Layout
│   └── page.tsx            # Home
├── components/
│   ├── ui/                 # shadcn/ui Komponenten
│   ├── avatar/
│   ├── forms/
│   └── layout/
├── lib/
│   ├── supabase.ts         # Client + Server clients
│   ├── api.ts              # API Helpers
│   └── utils.ts
├── hooks/
│   ├── use-supabase.ts
│   └── use-store.ts
└── types/
    └── index.ts
```

### Kritische Einstellungen (next.config.ts)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',           // Docker optimiert
  distDir: '.next',
  
  // Performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Images
  images: {
    unoptimized: true,              // Docker-Ready
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  
  // Sicherheit
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ]
      }
    ];
  }
};

export default nextConfig;
```

---

## 2. SUPABASE RLS - PRODUKTIONS-PATTERNS

### RLS Best Practices (MakerKit 2026 Pattern)

**WICHTIGE REGELN:**
1. **RLS MUSS auf JEDER Tabelle aktiviert sein**
2. **Niemals user_metadata für Auth verwenden** (user kann modifizieren)
3. **Service Role Key nur serverseitig**
4. **Policies mit (select auth.uid()) wickeln** für Performance

### Optimierte RLS Policies

```sql
-- FALLS Tabelle
CREATE TABLE public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,  -- PF-XXXX-XXXX
  user_id uuid REFERENCES auth.users(id),
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS aktivieren
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Performance-kritisch: (select auth.uid()) NICHT auth.uid()
CREATE POLICY "Users read own cases"
ON public.cases
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ODER: CaseCode-basierter Zugriff (für Magic Links)
CREATE POLICY "Access via case code"
ON public.cases
FOR SELECT
TO anon  -- Anonymous erlaubt!
USING (code = CURRENT_SETTING('request.headers')::jsonb->>'x-case-code');

-- Index für Performance
CREATE INDEX idx_cases_code ON public.cases(code);
CREATE INDEX idx_cases_user_id ON public.cases(user_id);
```

### Supabase Client Konfiguration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Client (Browser) - RLS enforced
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server - Service Role (bypasses RLS)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

---

## 3. DOCKER PRODUKTIONS-SETUP

### Optimiertes Dockerfile (2025 Pattern)

```dockerfile
# Multi-stage Build für minimale Image-Größe
FROM node:22-alpine AS base

# Dependencies installieren
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production Stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Nur nötige Files kopieren
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml (Production Stack)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
    networks:
      - pflegenavigator

  # LibreTranslate für 35 Sprachen
  translate:
    image: libretranslate/libretranslate:latest
    ports:
      - "5000:5000"
    environment:
      - LT_LOAD_ONLY=en,de,tr,pl,ru,it,es,fr,ar,fa,uk,ro,bg,hr,sl,sr,hu,el,pt,nl,da,sv,no,fi,et,lv,lt,cs,sk,ja,ko,zh,hi,th,vi
    volumes:
      - libretranslate_data:/home/libretranslate/.local
    restart: unless-stopped
    networks:
      - pflegenavigator

  # Umami Analytics (DSGVO-konform)
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://umami:umami@db:5432/umami
      - DATABASE_TYPE=postgresql
      - APP_SECRET=${UMAMI_SECRET}
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - pflegenavigator

  # PostgreSQL für Umami
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=umami
      - POSTGRES_USER=umami
      - POSTGRES_PASSWORD=umami
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - pflegenavigator

  # Uptime Kuma Monitoring
  kuma:
    image: louislam/uptime-kuma:1
    ports:
      - "3002:3001"
    volumes:
      - uptime_data:/app/data
    restart: unless-stopped
    networks:
      - pflegenavigator

  # GlitchTip Error Tracking
  glitchtip:
    image: glitchtip/glitchtip:latest
    ports:
      - "8000:8080"
    environment:
      - DATABASE_URL=postgresql://glitchtip:glitchtip@db:5432/glitchtip
      - SECRET_KEY=${GLITCHTIP_SECRET}
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - pflegenavigator

volumes:
  libretranslate_data:
  postgres_data:
  uptime_data:

networks:
  pflegenavigator:
    driver: bridge
```

---

## 4. SHADCN/UI OPTIMALE KONFIGURATION

### Installation & Setup

```bash
# Init mit bestem Design-System
npx shadcn@latest init --yes --template next --base-color slate

# Wichtige Komponenten
npx shadcn@latest add button card input textarea select tabs dialog
npx shadcn@latest add radio-group checkbox label badge
npx shadcn@latest add scroll-area separator skeleton
npx shadcn@latest add sonner toast  # Für Notifications
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tooltip
npx shadcn@latest add sheet  # Mobile Navigation

# Icons
npm install lucide-react
```

### Design Tokens (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* PflegeNavigator EU Brand Colors */
  --pn-primary: 215 65% 16%;      /* #0f2744 */
  --pn-secondary: 174 60% 41%;  /* #20b2aa */
  --pn-accent: 174 60% 41%;      /* #20b2aa */
  
  --background: 0 0% 100%;
  --foreground: 215 65% 16%;
  
  --card: 0 0% 100%;
  --card-foreground: 215 65% 16%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 215 65% 16%;
  
  --primary: 215 65% 16%;
  --primary-foreground: 0 0% 100%;
  
  --secondary: 174 60% 41%;
  --secondary-foreground: 0 0% 100%;
  
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  
  --accent: 174 60% 41%;
  --accent-foreground: 0 0% 100%;
  
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 174 60% 41%;
  
  --radius: 0.75rem;
}

.dark {
  --background: 215 65% 8%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

---

## 5. KOKORO TTS + WEB SPEECH API INTEGRATION

### Best Practice Pattern (2025)

```typescript
// lib/voice.ts

// 1. Kokoro für TTS (lokal, datenschutzkonform)
import { KokoroTTS } from 'kokoro-js';

let kokoroInstance: any = null;

export async function initKokoro() {
  if (!kokoroInstance) {
    kokoroInstance = await KokoroTTS.from_pretrained(
      'onnx-community/Kokoro-82M-ONNX',
      { dtype: 'q8' }  // Quantized für Performance
    );
  }
  return kokoroInstance;
}

export async function speakWithKokoro(text: string, voiceId = 'af_bella') {
  const tts = await initKokoro();
  const audio = await tts.generate(text, { voice: voiceId });
  
  // Web Audio API für Abspielen
  const buffer = audio.toWav();
  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  
  const audioElement = new Audio(url);
  await audioElement.play();
  
  return url;
}

// 2. Web Speech API für STT (kostenlos, offline)
export function initSpeechRecognition(
  onResult: (text: string, isFinal: boolean) => void,
  onError?: (error: any) => void
) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    throw new Error('Speech Recognition nicht unterstützt');
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    onResult(finalTranscript || interimTranscript, !!finalTranscript);
  };
  
  recognition.onerror = onError || console.error;
  
  return recognition;
}

// 3. Voice Commands
export const VOICE_COMMANDS = {
  HILFE: ['hilfe', 'help', 'unterstützung'],
  WEITER: ['weiter', 'next', 'fortfahren'],
  ZURUECK: ['zurück', 'back', 'zurueck'],
  START: ['start', 'beginnen', 'los'],
  STOP: ['stop', 'pause', 'ende'],
  JA: ['ja', 'yes', 'ok'],
  NEIN: ['nein', 'no'],
  WIDERSPRUCH: ['widerspruch', 'beschwerde'],
  BRIEF: ['brief', 'schreiben'],
  ERGEBNIS: ['ergebnis', 'resultat'],
};
```

---

## 6. AUTOMATISIERTE TESTS (pgTap)

### RLS Testing Pattern

```sql
-- tests/rls_cases.sql
BEGIN;

-- Test-Extension laden
CREATE EXTENSION IF NOT EXISTS "basejump-supabase_test_helpers";

SELECT no_plan();

-- Test-User erstellen
SELECT tests.create_supabase_user('test_user', 'test@test.com');
SELECT tests.create_supabase_user('other_user', 'other@test.com');

-- Test-Daten (als service_role)
SET LOCAL ROLE service_role;

INSERT INTO public.cases (id, code, user_id, data)
VALUES (
  gen_random_uuid(),
  'PF-TEST-1234',
  tests.get_supabase_uid('test_user'),
  '{"modul1": {"score": 20}}'::jsonb
);

-- TEST 1: Eigener Case sichtbar
SELECT tests.authenticate_as('test_user');
SELECT isnt_empty(
  $$ SELECT * FROM public.cases WHERE code = 'PF-TEST-1234' $$,
  'User should see own case'
);

-- TEST 2: Fremder Case NICHT sichtbar
SELECT tests.authenticate_as('other_user');
SELECT is_empty(
  $$ SELECT * FROM public.cases WHERE code = 'PF-TEST-1234' $$,
  'Other user should NOT see case'
);

-- TEST 3: Magic Link Zugriff (als anon)
SELECT tests.authenticate_as('test_user');
-- ... mehr Tests

SELECT * FROM finish();
ROLLBACK;
```

---

## 7. PERFORMANCE CHECKLIST

### Vor Production Deployment

- [ ] `output: 'standalone'` in next.config.ts
- [ ] Alle Bilder optimiert (`next/image` oder `unoptimized: true`)
 [ ] `optimizePackageImports` für große Libraries
- [ ] Supabase RLS auf ALLEN Tabellen aktiviert
- [ ] Indexe auf `user_id`, `code`, `created_at`
- [ ] `(select auth.uid())` Pattern in Policies
- [ ] Service Role Key NUR serverseitig
- [ ] Docker Multi-stage Build
- [ ] Umami Analytics (DSGVO-konform) eingerichtet
- [ ] Uptime Kuma Monitoring
- [ ] GlitchTip Error Tracking
- [ ] pgTap Tests für RLS
- [ ] Kokoro TTS für Voice (offline)
- [ ] LibreTranslate für 35 Sprachen
- [ ] Keine chinesischen/russischen Tools (DeepSeek, etc.)

---

## 8. SICHERHEITSCHECKLISTE

### DSGVO / EU-Konformität

- [ ] Alle Daten in EU (Supabase EU-Region)
- [ ] Keine US-Cloud-Services (kein Google Analytics)
- [ ] Umami statt Google Analytics
- [ ] LibreTranslate statt Google Translate
- [ ] Kokoro TTS (lokal) statt Cloud-TTS
- [ ] Keine Telemetrie ohne Consent
- [ ] Impressum + Datenschutz vorhanden
- [ ] Cookie-Banner (nur wenn nötig)
- [ ] Auskunft/Löschung-Funktion

---

## 9. DEPLOYMENT WORKFLOW

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Type check
        run: npx tsc --noEmit
        
      - name: Run RLS tests
        run: supabase test db

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t pflegenavigator:latest .
        
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push pflegenavigator:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        run: |
          ssh ${{ secrets.SERVER }} "
            cd /opt/pflegenavigator &&
            docker-compose pull &&
            docker-compose up -d
          "
```

---

**QUELLEN / RECHERCHE:**
1. MakerKit Supabase RLS Best Practices (Jan 2026)
2. Next.js 16 Docker Deployment Guide (Nov 2025)
3. Kokoro.js TTS Integration Guide (Mar 2025)
4. shadcn/ui Best Practices (2026)
5. pgTap Testing Documentation

**ERSTELLT:** April 2026
**FÜR:** PflegeNavigator EU Portal
