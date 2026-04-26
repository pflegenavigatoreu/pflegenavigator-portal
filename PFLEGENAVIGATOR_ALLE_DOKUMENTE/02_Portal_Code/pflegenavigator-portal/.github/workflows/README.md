# GitHub Actions CI/CD Pipeline

## Übersicht

Diese Repository enthält automatisierte CI/CD-Pipelines für das PflegeNavigator Portal.

## Workflows

### 1. CI - Build & Test (`ci.yml`)
**Trigger:** Push auf main/develop/feature-Branches, Pull Requests

**Jobs:**
- **Build:** Installiert Dependencies, Lint, Type-Check, Build
- **Test:** Führt Tests aus
- **Security:** NPM Audit, Secrets-Scan mit TruffleHog

### 2. CD - Deploy to Vercel (`cd.yml`)
**Trigger:** Push auf main, Manuelle Ausführung

**Umgebungen:**
- **Preview:** Für Feature-Branches und manuelle Preview-Deploys
- **Production:** Automatisch bei Push auf main

### 3. Database - Supabase Migrations (`database.yml`)
**Trigger:** Änderungen in `supabase/migrations/**`, Manuelle Ausführung

**Aktionen:**
- Führt Migrationen aus
- Generiert TypeScript-Typen automatisch
- Committet aktualisierte Types

## Erforderliche Secrets

Im GitHub Repository unter Settings → Secrets → Actions hinzufügen:

| Secret | Beschreibung | Woher? |
|--------|--------------|--------|
| `VERCEL_TOKEN` | Vercel API Token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel Organization ID | Vercel CLI: `vercel teams ls` |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Vercel CLI: `vercel project ls` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Supabase Dashboard → Settings → API |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI Token | Supabase Dashboard → Access Tokens |
| `SUPABASE_PROJECT_ID` | Supabase Project ID | Supabase Dashboard → General Settings |
| `SUPABASE_DB_PASSWORD` | Supabase Database Password | Supabase Dashboard → Database → Connection |
| `SLACK_WEBHOOK_URL` | Slack Webhook (optional) | Slack App → Incoming Webhooks |

## Lokale Entwicklung

### Vercel CLI einrichten:
```bash
npm install -g vercel
vercel login
```

### Supabase CLI einrichten:
```bash
npm install -g supabase
supabase login
```

## Deployment-Strategie

1. **Feature Development:**
   ```bash
   git checkout -b feature/xyz
   # ... changes ...
   git push origin feature/xyz
   # CI läuft automatisch
   # Erstelle Pull Request
   ```

2. **Review & Merge:**
   - CI muss passieren
   - Code Review erforderlich
   - Merge auf `main`

3. **Automatisches Deployment:**
   - Merge auf `main` → CI läuft → Production Deploy
   - Migrationen werden automatisch angewendet

## Troubleshooting

### Build schlägt fehl
- Prüfe ob alle Secrets gesetzt sind
- Lokal testen: `npm run build`

### Migration schlägt fehl
- Supabase CLI lokal testen: `supabase db push --dry-run`
- Konflikte manuell auflösen

### Deploy schlägt fehl
- Vercel CLI testen: `vercel --prod`
- Logs in Vercel Dashboard prüfen
