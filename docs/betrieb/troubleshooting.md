# Betriebshandbuch - Troubleshooting

## Schnellhilfe

### System-Status prüfen
```bash
# Gesundheit
curl https://pflegenavigatoreu.com/api/health | jq

# Datenbank
curl https://pflegenavigatoreu.com/api/health/db | jq

# Alle Services
docker-compose ps
# oder
pm2 status
```

### Log-Files
```bash
# Aktuelle Logs
tail -f /workspace/logs/app.log
docker-compose logs -f portal
pm2 logs pflegenavigator

# Letzte 100 Zeilen
docker-compose logs --tail 100 portal
```

---

## Kategorien

### 1. API/Server-Fehler

#### Server nicht erreichbar (503)
**Symptome:**
- Uptime-Check failed
- HTTP 503
- Connection refused

**Ursachen:**
- Container/App nicht gestartet
- Port belegt
- Crash/Restart-Loop

**Lösung:**
```bash
# Status prüfen
docker-compose ps
pm2 status

# Container neu starten
docker-compose restart portal
# oder
pm2 restart pflegenavigator

# Logs prüfen
docker-compose logs --tail 50 portal
```

#### Timeout bei API-Requests
**Symptome:**
- Requests hängen >30s
- Gateway Timeout (504)
- Langsame Antwortzeiten

**Ursachen:**
- PDF-Generierung blockiert
- Supabase-Verbindung langsam
- CPU/IO-Überlastung

**Lösung:**
```bash
# Ressourcen prüfen
htop
df -h

# Timeout erhöhen (temporär)
# In nginx.conf:
proxy_read_timeout 120s;

# PDF-Queue prüfen
# Max 5 PDFs parallel, Rest queued
```

#### 500 - Internal Server Error
**Symptome:**
- HTTP 500
- Error in Logs
- Unhandled Exception

**Ursachen:**
- Code-Fehler
- Fehlende ENV-Variablen
- Typ-Fehler

**Lösung:**
```bash
# Stack-Trace finden
grep "Error" /workspace/logs/app.log

# ENV prüfen
echo $NEXT_PUBLIC_SUPABASE_URL
cat .env.local | grep -E "SUPABASE|API"

# TypeScript-Check
npx tsc --noEmit
```

---

### 2. Datenbank-Fehler

#### Connection Timeout
**Symptome:**
- Health-Check: DB error
- "Connection terminated unexpectedly"

**Ursachen:**
- Supabase-Rate-Limit
- Netzwerk-Problem
- Connection-Pool erschöpft

**Lösung:**
```bash
# Supabase-Status
curl https://status.supabase.com/

# Connection-String prüfen
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/

# App neustarten (Pool reset)
docker-compose restart portal
```

#### RLS Policy Error
**Symptome:**
- "new row violates row-level security policy"
- Insert/Update wird blockiert

**Ursachen:**
- Falscher Key verwendet (Anon statt Service)
- Policy zu restriktiv
- User hat keine Rechte

**Lösung:**
```typescript
// Prüfen: Server-Code verwendet Service-Role-Key
// src/lib/supabase.ts
export const supabaseServer = createClient(url, serviceRoleKey, {...})
// NICHT: createClient(url, anonKey) im Server-Code!

// SQL: Policy prüfen
SELECT * FROM pg_policies WHERE tablename = 'cases';
```

#### Datenbank voll
**Symptome:**
- "disk full"
- Inserts schlagen fehl

**Lösung:**
```bash
# Supabase-Dashboard → Database → Size

# Alte Fälle löschen (anonym, >90 Tage)
DELETE FROM cases WHERE created_at < NOW() - INTERVAL '90 days';

# VACUUM
VACUUM FULL;
```

---

### 3. PDF-Generierung

#### Chromium-Fehler
**Symptome:**
- "Failed to launch browser"
- PDF-Download failed
- Container-Crash bei PDF

**Ursachen:**
- Chromium nicht installiert
- Fehlende System-Libs
- Sandbox-Problem

**Lösung:**
```bash
# Docker: Chromium-Deps prüfen
docker exec -it pflegenavigator-portal apk list | grep chromium

# Native: Installation
sudo apt install chromium-browser

# Puppeteer-Cache löschen
rm -rf ~/.cache/puppeteer

# Debug-Mode
DEBUG=puppeteer:* npm run dev
```

#### PDF-Timeout
**Symptome:**
- Request dauert >60s
- User bricht ab
- Gateway Timeout

**Lösung:**
```typescript
// Timeout erhöhen
const browser = await puppeteer.launch({
  timeout: 120000,  // 120 Sekunden
})

// Async-Queue implementieren
// Max N PDFs gleichzeitig
```

#### Font/Rendering-Probleme
**Symptome:**
- PDF hat falsche Schriftarten
- Layout broken
- Symbole fehlen

**Lösung:**
```css
/* Im PDF-Template: System-Fonts verwenden */
body {
  font-family: Arial, Helvetica, sans-serif;
}

/* Oder Fonts einbetten */
@font-face {
  font-family: 'Inter';
  src: url('data:font/woff2;base64,...');
}
```

---

### 4. i18n/Übersetzung

#### 404 bei Sprach-URLs
**Symptome:**
- /de/pflegegrad → 404
- Sprach-Switcher funktioniert nicht

**Ursachen:**
- Middleware nicht konfiguriert
- Locale fehlt in Config
- Routing-Fehler

**Lösung:**
```typescript
// middleware.ts prüfen
export const config = {
  matcher: [
    '/',
    '/(de|en|fr|es|it|...)/:path*'  // Alle Locales
  ]
}

// routing.ts prüfen
export const routing = {
  locales: ['de', 'en', 'fr', ...],  // 25 Sprachen
  defaultLocale: 'de'
}
```

#### Übersetzung fehlt
**Symptome:**
- "message.defaultMessage"
- Leere Strings
- Fallback nicht funktioniert

**Lösung:**
```bash
# Übersetzungs-Dateien prüfen
ls messages/*.json

# JSON validieren
cat messages/de.json | jq empty

# Fehlende Keys finden
# Vergleich de.json mit en.json
```

---

### 5. Memory/Performance

#### High Memory Usage
**Symptome:**
- OOM-Kills
- Langsame Antworten
- Swapping

**Ursachen:**
- Memory-Leak
- Zu viele Connections
- Chromium-Prozesse nicht geschlossen

**Lösung:**
```bash
# Memory-Profil
docker stats
pm2 monit

# Chromium-Prozesse
ps aux | grep chromium | wc -l

# Container-Limit erhöhen
docker run -m 2g ...

# PM2: Auto-Restart bei Memory
pm2 start app.js --max-memory-restart 500M
```

#### CPU-100%
**Symptome:**
- Load Average > Cores
- Server unresponsive
- Timeouts

**Ursachen:**
- Endlosschleife
- PDF-Generierung blockiert
- DDOS/Traffic-Spike

**Lösung:**
```bash
# CPU-Usage pro Prozess
htop

# Node-Profiler
node --prof app.js

# Rate-Limiting erhöhen
# nginx.conf:
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# CDN aktivieren (Cloudflare)
```

---

### 6. Build/Deployment

#### Build schlägt fehl
**Symptome:**
- "npm run build" failed
- TypeScript-Errors
- "Module not found"

**Lösung:**
```bash
# Clean build
rm -rf node_modules .next
npm ci
npm run build

# Type-Check separat
npx tsc --noEmit

# Speicherprobleme?
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Environment-Variablen fehlen
**Symptome:**
- "Cannot read property of undefined"
- API-Calls schlagen fehl
- Build-Errors wegen fehlendem Key

**Lösung:**
```bash
# ENV prüfen
cat .env.local

# In Container verfügbar?
docker exec -it pflegenavigator-portal env | grep SUPABASE

# In Build verfügbar?
# NEXT_PUBLIC_*: Ja
# SERVER_*: Nein (nur Runtime)
```

---

### 7. Browser/Client

#### JavaScript-Fehler
**Symptome:**
- Console-Errors
- Interaktive Features broken
- "Hydration failed"

**Lösung:**
```bash
# Browser-Console prüfen
# F12 → Console

# React DevTools
# Prüfen: Server vs Client Mismatch

# Hydration-Fehler
# "use client" für interaktive Komponenten
```

#### CSS-Broken
**Symptome:**
- Keine Styles
- Layout broken
- White-Screen

**Lösung:**
```bash
# CSS-Build prüfen
ls .next/static/css/

# Tailwind-Konfiguration
npx tailwindcss -i ./input.css -o ./output.css

# CSP-Headers prüfen (blockiert Inline-Styles?)
```

---

## Debug-Tools

### Health-Check Debug
```bash
# Ausführliche Health-Info
curl -s https://pflegenavigatoreu.com/api/health | jq

# Einzelne Checks
curl -s https://pflegenavigatoreu.com/api/health/db
curl -s https://pflegenavigatoreu.com/api/ready
curl -s https://pflegenavigatoreu.com/api/live
```

### API-Test
```bash
# Brief-Generator testen
curl -X POST https://pflegenavigatoreu.com/api/briefe \
  -H "Content-Type: application/json" \
  -d '{
    "type": "allgemein",
    "data": {
      "absenderName": "Max Mustermann",
      "empfaenger": "Test Behörde"
    }
  }'

# Case erstellen
curl -X POST https://pflegenavigatoreu.com/api/cases
```

### Datenbank-Debug
```sql
-- Aktive Fälle
SELECT 
  case_code,
  status,
  created_at,
  module_count
FROM cases
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 10;

-- Antworten pro Modul
SELECT 
  c.case_code,
  a.module_number,
  a.completed_at
FROM cases c
JOIN answers a ON a.case_id = c.id
WHERE c.case_code = 'PN2024X7';

-- Fehlende Antworten
SELECT 
  case_code,
  6 - COUNT(a.id) as missing_modules
FROM cases c
LEFT JOIN answers a ON a.case_id = c.id
GROUP BY c.id
HAVING COUNT(a.id) < 6;
```

---

## Support-Kontakte

| Problem | Kontakt | Response |
|---------|---------|----------|
| Infrastructure | Hosting-Provider | 24/7 |
| Supabase | support@supabase.com | 24h |
| Vercel | vercel.com/support | 4h |
| Domain/SSL | Registrar | 24h |
| Code-Bugs | GitHub Issues | Asap |

---

## Notfall-Wiederherstellung

### Gesamt-Ausfall
```bash
# 1. Status prüfen
docker-compose ps
# oder
pm2 status

# 2. Neu starten
docker-compose down && docker-compose up -d
# oder
pm2 restart all

# 3. Health-Check
curl -f https://pflegenavigatoreu.com/api/health

# 4. Monitoring prüfen
# Uptime Kuma: Alles grün?
```

### Datenbank-Notfall
```bash
# 1. Supabase-Status checken
# https://status.supabase.com

# 2. Fallback-DB aktivieren
# (Read-Only-Modus mit Caching)

# 3. Cache leeren
redis-cli FLUSHALL
# oder: Browser-Cache-Headers

# 4. Wiederherstellung abwarten
# Supabase-Team kontaktieren
```

---

## Checkliste: Bevor du fragst

- [ ] Logs geprüft?
- [ ] Health-Check durchgeführt?
- [ ] ENV-Variablen verifiziert?
- [ ] Letztes Deployment rückgängig gemacht (funktioniert es wieder?)
- [ ] Reproduzierbar? (Schritte dokumentiert)
- [ ] Minimaler Repro-Case erstellt?

**Dann:**
- Issue mit Logs, ENV (ohne Secrets), Repro-Schritten
- Screenshots bei UI-Problemen
- Zeitpunkt des Fehlers