# CI/CD Pipeline Documentation

Dieses Projekt verwendet eine professionelle CI/CD Pipeline mit GitHub Actions für automatisierte Tests, Builds und Deployments.

## 📋 Inhalt

- [Workflows](#workflows)
- [Lokale Entwicklung](#lokale-entwicklung)
- [GitHub Actions Secrets](#github-actions-secrets)
- [Branch-Konventionen](#branch-konventionen)
- [Deployment](#deployment)

---

## Workflows

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Wird ausgelöst bei:**
- Push auf `main`, `develop`, `staging`
- Pull Requests auf `main`, `develop`
- Nightly Security Audit (Montags 3 Uhr)

**Jobs:**

| Job | Beschreibung |
|-----|--------------|
| 🔍 Lint & Format | ESLint + Prettier Checks |
| 🔎 Type Check | TypeScript Typ-Prüfung |
| 🧪 Unit Tests | Jest Tests mit Coverage |
| 🏗️ Build | Next.js Build mit Turbo Caching |
| 🎭 E2E Tests | Playwright End-to-End Tests |
| 🔒 Security | npm audit + Trivy Sicherheitscheck |
| ⚡ Lighthouse | Performance Tests |
| 📦 Dependencies | Veraltete Pakete prüfen |

### 2. Deploy Preview (`.github/workflows/deploy-preview.yml`)

**Wird ausgelöst bei:**
- Neue Pull Requests
- Updates in PRs

**Features:**
- Automatisches Vercel Preview Deployment
- Lighthouse Performance Check
- PR Kommentar mit Preview URL

### 3. Deploy Production (`.github/workflows/deploy-production.yml`)

**Wird ausgelöst bei:**
- Manuellem Trigger (`workflow_dispatch`)
- Push auf `main` mit Version Tag (`v*`)

**Features:**
- Pre-Deploy Checks
- Production Deployment
- Post-Deploy Smoke Tests
- Slack/Telegram Notifications
- Automatischer GitHub Release

---

## Lokale Entwicklung

### CI Checks vor Push

```bash
# Alle Checks ausführen
./scripts/ci-checks.sh

# Mit automatischer Fehlerbehebung
./scripts/ci-checks.sh --fix

# Schneller Check (nur kritische Prüfungen)
./scripts/ci-checks.sh --quick
```

### Pre-commit Hooks

Die Hooks wurden mit Husky konfiguriert:

```bash
# Husky installieren (nur beim ersten Setup)
npx husky install

# Oder mit pnpm
pnpm exec husky install
```

**Pre-commit:**
- Branch-Namensprüfung
- Große Datei-Erkennung
- Secrets-Check
- Lint für staged Files

**Pre-push:**
- Vollständige CI Checks

---

## GitHub Actions Secrets

Die folgenden Secrets müssen im Repository konfiguriert werden:

### Erforderlich

| Secret | Beschreibung | Woher |
|--------|--------------|-------|
| `VERCEL_TOKEN` | Vercel API Token | [Vercel Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel Organization ID | Vercel Project Settings |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Vercel Project Settings |
| `SUPABASE_URL` | Supabase Project URL | Supabase Dashboard → API |
| `BREVO_API_KEY` | Brevo API Key | Brevo Dashboard → SMTP & API |

### Optional (für Notifications)

| Secret | Beschreibung | Woher |
|--------|--------------|-------|
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook | Slack App |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | @BotFather |
| `TELEGRAM_CHAT_ID` | Telegram Chat ID | @userinfobot |
| `CODECOV_TOKEN` | Codecov Upload Token | Codecov Dashboard |
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI Token | GitHub App |

### Secrets hinzufügen

1. Repository → Settings → Secrets and variables → Actions
2. "New repository secret"
3. Name und Wert eingeben
4. "Add secret"

---

## Branch-Konventionen

### Erlaubte Branch-Namen

```
main                    # Produktions-Branch
develop                 # Entwicklungs-Branch
staging                 # Staging-Branch

feature/beschreibung    # Neue Features
feat/beschreibung       # Kurzform
bugfix/beschreibung     # Bugfixes
fix/beschreibung        # Kurzform
hotfix/beschreibung     # Kritische Hotfixes
release/v1.0.0          # Releases
refactor/beschreibung   # Refactorings
docs/beschreibung       # Dokumentation
test/beschreibung       # Tests
chore/beschreibung      # Wartungsarbeiten
```

### Beispiele

```bash
# Feature Branch erstellen
git checkout -b feature/user-authentication

# Bugfix Branch erstellen
git checkout -b bugfix/login-validation

# Hotfix Branch erstellen
git checkout -b hotfix/critical-security-fix
```

---

## Deployment

### Preview Deployment (Automatisch)

Bei jedem Pull Request wird automatisch ein Preview auf Vercel deployed.
- Die Preview URL wird als Kommentar im PR gepostet
- Lighthouse Tests werden auf der Preview ausgeführt

### Production Deployment (Manuell)

**Option 1: Via GitHub Actions**

1. Gehe zu Actions → Deploy Production
2. Klicke "Run workflow"
3. Wähle Environment (production/staging)
4. Optional: Slack/Telegram Notification
5. Klicke "Run workflow"

**Option 2: Via Tag**

```bash
# Version tag erstellen
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

Das Deployment wird automatisch ausgelöst und:
- Erstellt einen GitHub Release
- Sendet Notifications
- Führt Post-Deploy Tests aus

---

## 🔧 Troubleshooting

### Build schlägt fehl

```bash
# Dependencies neu installieren
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Build Cache leeren
rm -rf .next .turbo
pnpm run build
```

### Tests schlagen fehl

```bash
# Playwright Browser neu installieren
pnpm exec playwright install --with-deps

# Tests einzeln ausführen
pnpm run test:e2e --grep "test-name"
```

### Secrets nicht gefunden

Prüfe ob alle Secrets in den Repository Settings hinterlegt sind:
- Settings → Secrets and variables → Actions

---

## 📚 Weitere Dokumentation

- [Vercel CLI](https://vercel.com/docs/cli)
- [GitHub Actions](https://docs.github.com/actions)
- [Playwright](https://playwright.dev)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
