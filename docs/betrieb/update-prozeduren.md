# Betriebshandbuch - Update-Prozeduren

## Update-Strategie

### Versionierung

```
Semantic Versioning: MAJOR.MINOR.PATCH

MAJOR: Breaking Changes (z.B. neue Auth-System)
MINOR: Neue Features (z.B. neuer Brief-Generator)
PATCH: Bugfixes (z.B. PDF-Timeout-Fix)
```

### Update-Typen

| Typ | Frequenz | Downtime | Beispiel |
|-----|----------|----------|----------|
| Security | Sofort | 0-5 Min | CVE-Patch |
| Bugfix | Wöchentlich | 0-2 Min | PDF-Fix |
| Feature | Monatlich | Geplant | Neuer Rechner |
| Major | Quartalsweise | Geplant | Next.js Upgrade |

---

## Dependency-Updates

### Sicherheit (Dependabot)

```bash
# Automatische PRs für Security-Updates
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
    security-updates-only: true
```

### Manuelle Updates

```bash
# Outdated Packages anzeigen
npm outdated

# Patch-Updates
npm update

# Minor-Updates (mit Care)
npm install next@latest react@latest

# Lock-File aktualisieren
npm audit fix
```

### Major-Updates

```bash
# 1. Test-Branch erstellen
git checkout -b update/nextjs-17

# 2. Update durchführen
npm install next@17

# 3. Breaking Changes prüfen
# CHANGELOG lesen!

# 4. Tests laufen lassen
npm run test
npm run test:e2e

# 5. Build testen
npm run build

# 6. Merge wenn OK
```

---

## Deployments

### Blue-Green Deployment (Zero-Downtime)

```bash
#!/bin/bash
# blue-green-deploy.sh

# 1. Neue Version auf "Green" deployen
docker-compose -f docker-compose.yml -f docker-compose.green.yml up -d portal-green

# 2. Health-Check
until curl -f http://localhost:3001/api/health; do
  echo "Waiting for green..."
  sleep 5
done

# 3. Traffic umschalten (nginx)
sed -i 's/blue/green/g' /etc/nginx/conf.d/upstream.conf
nginx -s reload

# 4. Alte Version stoppen
docker-compose stop portal-blue

# 5. Cleanup
docker-compose rm portal-blue
```

### Rolling Update (Kubernetes/PM2)

```bash
# PM2 Rolling-Update
pm2 reload ecosystem.config.js --update-env

# Mit Zero-Downtime
pm2 start ecosystem.config.js \
  --name portal-new

# Health-Check...
pm2 delete portal
pm2 rename portal-new portal
```

### Feature-Flags (Gradual Rollout)

```typescript
// src/lib/feature-flags.ts
const FEATURES = {
  NEW_CALCULATOR: process.env.FF_NEW_CALCULATOR === 'true',
  BETA_PDF: process.env.FF_BETA_PDF === 'true'
}

// Verwendung
export function BriefGenerator() {
  if (FEATURES.NEW_CALCULATOR) {
    return <NewCalculator />
  }
  return <OldCalculator />
}
```

---

## Datenbank-Updates

### Migrationen

```sql
-- prisma/migrations/
-- 001_add_user_preferences.sql
BEGIN;

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  theme VARCHAR(20) DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
```

### Migration-Strategie

```bash
# 1. Backup erstellen!
./scripts/backup-db.sh

# 2. Migration testen (Staging)
npx supabase db push --dry-run

# 3. Migration durchführen
npx supabase db push

# 4. Verifizieren
psql $DATABASE_URL -c "SELECT * FROM schema_migrations ORDER BY id DESC LIMIT 5;"
```

### Backwards-Compatible Changes

```sql
-- Schritt 1: Neue Spalte hinzufügen (nullable)
ALTER TABLE cases ADD COLUMN new_field VARCHAR(255);

-- App deployed, schreibt in beide Spalten

-- Schritt 2: Daten migrieren
UPDATE cases SET new_field = old_field;

-- Schritt 3: NOT NULL setzen
ALTER TABLE cases ALTER COLUMN new_field SET NOT NULL;

-- Schritt 4: Alte Spalte entfernen (später)
-- ALTER TABLE cases DROP COLUMN old_field;
```

---

## Update-Checkliste

### Pre-Update

- [ ] Backup erstellt
- [ ] CHANGELOG gelesen
- [ ] Breaking Changes identifiziert
- [ ] Test-Plan vorbereitet
- [ ] Rollback-Plan dokumentiert
- [ ] Maintenance-Window (falls nötig)

### Update-Durchführung

- [ ] Staging-Environment testen
- [ ] Smoke-Tests durchführen
- [ ] Performance-Metriken prüfen
- [ ] Logs auf Fehler überwachen
- [ ] Monitoring aktivieren

### Post-Update

- [ ] Health-Check OK
- [ ] Key-Metriken normal
- [ ] Keine Fehler in Logs
- [ ] Benutzer-Feedback gesammelt
- [ ] Dokumentation aktualisiert

---

## Emergency-Rollback

### Schneller Rollback

```bash
# Git-Tag wiederherstellen
git checkout v1.2.3
npm ci
npm run build

# Deploy
pm2 restart all
# oder
docker-compose up -d
```

### Datenbank-Rollback

```bash
# 1. App auf Maintenance
MAINTENANCE_MODE=true

# 2. Backup einspielen
./scripts/restore-db.sh backup_20260429.sql.gz

# 3. App neustarten
MAINTENANCE_MODE=false
pm2 restart all
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/update.yml
name: Deploy Update

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Test
        run: |
          npm ci
          npm run test
          npm run test:e2e
      
      - name: Build
        run: npm run build

  deploy-staging:
    needs: test
    environment: staging
    steps:
      - name: Deploy to Staging
        run: |
          # Deploy
          # Integration-Tests
          # Warten auf Approval

  deploy-production:
    needs: deploy-staging
    environment: production  # Required reviewer
    steps:
      - name: Backup
        run: ./scripts/backup-pre-deploy.sh
      
      - name: Deploy
        run: ./scripts/deploy-production.sh
      
      - name: Smoke Tests
        run: ./scripts/smoke-tests.sh
      
      - name: Notify
        run: |
          curl -X POST $WEBHOOK_URL \
            -d '{"text":"Deployment successful: ${{ github.ref }}"}'
```

### Canary Deployment

```bash
# 10% Traffic auf neue Version
# nginx upstream
upstream portal {
  server localhost:3000 weight=9;  # Old
  server localhost:3001 weight=1;  # New
}

# Monitoring für 30 Min
# Fehler-Rate < 1%?
# Latenz OK?

# Dann: 50/50
# Dann: 100% neue Version
```

---

## Version-Management

### Release-Prozess

```bash
# 1. Version bump
npm version minor  # oder major/patch

# 2. Changelog aktualisieren
# CHANGELOG.md editieren

# 3. Commit & Tag
git add CHANGELOG.md package.json
git commit -m "Release v1.3.0"
git tag v1.3.0
git push origin main --tags

# 4. GitHub Release erstellen
gh release create v1.3.0 \
  --title "Release v1.3.0" \
  --notes-file CHANGELOG.md
```

### CHANGELOG-Format

```markdown
# Changelog

## [1.3.0] - 2026-04-29

### Added
- Neuer GDB-Rechner für Grundsicherung
- Unterstützung für Rumänisch und Griechisch

### Fixed
- PDF-Timeout bei großen Dokumenten
- i18n-Routing für RTL-Sprachen

### Security
- Next.js auf 16.2.3 aktualisiert
- Puppeteer-Sandbox härten

## [1.2.0] - 2026-04-15
...
```

---

## Update-Historie (Log)

| Datum | Version | Typ | Beschreibung | Downtime |
|-------|---------|-----|--------------|----------|
| 2026-04-29 | 1.3.0 | Feature | GDB-Rechner, neue Sprachen | 0s |
| 2026-04-28 | 1.2.1 | Patch | PDF-Fix | 0s |
| 2026-04-15 | 1.2.0 | Feature | Avatar-Chat | 30s |
| 2026-04-01 | 1.1.0 | Minor | i18n-Update | 0s |
| 2026-03-15 | 1.0.0 | Major | Initial Release | 5min |

---

## Kommunikation

### Intern (Team)

- Slack-Channel #deployments
- Post-Mortem nach Incidents
- Weekly Review: Was ist gut/schlecht gelaufen?

### Extern (Nutzer)

- Status-Page: https://status.pflegenavigatoreu.com
- Twitter/Mastodon: @pflegenavigatoreu
- Email-Newsletter bei Major-Updates

### Wartungsfenster

```
Geplante Wartung:
- Datum: Dienstag, 29.04.2026
- Zeit: 02:00 - 04:00 Uhr (CET)
- Dauer: ~30 Minuten
- Betroffen: Portal kurzzeitig nicht erreichbar
- Update: Sicherheits-Updates und Performance-Verbesserungen
```

---

## Tools

- **Renovate**: Automatische Dependency-Updates
- **Snyk**: Security-Scanning
- **semantic-release**: Automatische Versionierung
- **helm**: Kubernetes-Deployments