# Entwickler-Handbuch - Setup

## Systemanforderungen

### Hardware
- **Minimum**: 4GB RAM, 2 CPU-Kerne, 10GB Speicher
- **Empfohlen**: 8GB RAM, 4 CPU-Kerne, 20GB Speicher
- **Für Docker-Umgebung**: +2GB RAM für Container

### Software
- Node.js 20+ (LTS empfohlen)
- npm 10+ oder yarn 1.22+
- Git 2.40+
- Docker & Docker Compose (optional, für Monitoring)

## Schnellstart

### 1. Repository klonen

```bash
git clone https://github.com/pflegenavigatoreu/portal.git
cd portal
```

### 2. Umgebungsvariablen einrichten

```bash
# .env.local kopieren
cp .env.example .env.local

# Variablen anpassen
nano .env.local
```

**Erforderliche Variablen:**

```env
# Supabase (verbindet mit Datenbank)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Optional: Monitoring
NEXT_PUBLIC_APP_VERSION=0.1.0
```

**Supabase-Setup:**
1. Konto erstellen: https://supabase.com
2. Neues Projekt anlegen
3. SQL-Scripts in `prisma/schema.sql` ausführen
4. Keys aus Project Settings → API kopieren

### 3. Abhängigkeiten installieren

```bash
npm install
# oder
yarn install
```

### 4. Entwicklungsserver starten

```bash
npm run dev
# oder
yarn dev
```

Der Server startet unter `http://localhost:3000`

### 5. Build testen

```bash
npm run build
npm start
```

## Docker-Entwicklung (Optional)

### Komplette Umgebung mit Monitoring

```bash
# Alle Services starten
docker-compose up -d

# Einzelnen Service neu bauen
docker-compose build --no-cache portal
docker-compose up -d portal

# Logs anzeigen
docker-compose logs -f portal
```

**Verfügbare Services:**

| Service | Port | Beschreibung |
|---------|------|--------------|
| Portal | 3000 | Hauptanwendung |
| Umami | 8001 | Analytics |
| Uptime Kuma | 3001 | Monitoring |
| GlitchTip | 8002 | Error Tracking |
| LibreTranslate | 5000 | Übersetzung |

## Projektstruktur

```
/workspace/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API-Routen
│   │   │   ├── health/         # Health-Checks
│   │   │   ├── briefe/         # Brief-Generierung
│   │   │   ├── cases/          # Fall-Management
│   │   │   ├── widerspruch/    # Widerspruchs-API
│   │   │   └── avatar/chat/    # Avatar-Chat
│   │   ├── pflegegrad/         # Pflegegrad-Rechner
│   │   ├── briefe/             # Brief-Generator UI
│   │   ├── widerspruch/        # Widerspruchs-UI
│   │   └── ...                 # Weitere Seiten
│   │
│   ├── lib/                    # Bibliotheken
│   │   ├── briefe/             # Brief-Generatoren
│   │   ├── pflegegrad/           # NBA-Berechnung
│   │   ├── supabase.ts           # DB-Client
│   │   ├── pdf.ts                # PDF-Generator
│   │   └── errors.ts             # Fehler-Klassen
│   │
│   ├── components/             # React-Komponenten
│   │   ├── ui/                   # UI-Komponenten
│   │   ├── BriefGenerator.tsx
│   │   ├── AvatarChat.tsx
│   │   └── ...
│   │
│   ├── hooks/                  # Custom Hooks
│   └── i18n/                   # Internationalisierung
│
├── public/                     # Statische Assets
├── docs/                       # Dokumentation
├── prisma/                     # Datenbank-Schema
├── e2e/                        # Playwright Tests
├── docker-compose.yml          # Docker-Setup
└── package.json
```

## Environment-Variablen

### Erforderlich

| Variable | Beschreibung | Woher |
|----------|--------------|-------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase Projekt URL | Supabase Dashboard |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Anon Key für Client | Supabase Dashboard → API |
| SUPABASE_SERVICE_ROLE_KEY | Service Key für Server | Supabase Dashboard → API |

### Optional

| Variable | Beschreibung | Standard |
|----------|--------------|----------|
| NEXT_PUBLIC_APP_VERSION | App-Version | 0.1.0 |
| PORT | Server-Port | 3000 |
| NODE_ENV | Umgebung | development |

## Troubleshooting

### Port 3000 belegt

```bash
# Prozess finden und beenden
lsof -ti:3000 | xargs kill -9

# Oder anderen Port verwenden
PORT=3001 npm run dev
```

### Supabase-Verbindungsfehler

```bash
# Netzwerk-Check
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/

# Keys prüfen
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY | cut -c1-20
```

### Build-Fehler

```bash
# Clean install
rm -rf node_modules .next
npm install
npm run build

# TypeScript-Check
npx tsc --noEmit
```

### Docker-Probleme

```bash
# Alles zurücksetzen
docker-compose down -v
docker-compose up -d --build

# Speicher bereinigen
docker system prune -a
```

## Nützliche Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:health": "playwright test e2e/health-checks.spec.ts"
}
```

## IDE-Einrichtung

### VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- Thunder Client (API-Testing)

### Einstellungen (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```