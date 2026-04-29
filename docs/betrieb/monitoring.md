# Betriebshandbuch - Monitoring

## System-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                     MONITORING LANDSCHAFT                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                PFLENAVIGATOR PORTAL                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │  App        │  │  API        │  │  Health-Check   │   │  │
│  │  │  (Next.js)  │  │  Routes     │  │  /api/health    │   │  │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │  │
│  │         │                │                   │             │  │
│  │         └────────────────┴───────────────────┘             │  │
│  │                          │                                │  │
│  │                   ┌──────▼──────┐                         │  │
│  │                   │   Supabase  │                         │  │
│  │                   │  PostgreSQL │                         │  │
│  │                   └─────────────┘                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Uptime Kuma │  │  Umami       │  │  GlitchTip           │  │
│  │  (Monitoring)│  │  (Analytics) │  │  (Error Tracking)    │  │
│  │  Port: 3001  │  │  Port: 8001  │  │  Port: 8002          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Health-Checks

### API-Endpunkte

| Endpunkt | Beschreibung | Intervall |
|----------|--------------|-----------|
| `/api/health` | Vollständiger System-Check | 60s |
| `/api/health/db` | Datenbank-Verbindung | 30s |
| `/api/ready` | Kubernetes-Readiness | 10s |
| `/api/live` | Kubernetes-Liveness | 10s |

### Health-Check-Details

```json
// GET /api/health
{
  "status": "ok",
  "timestamp": "2026-04-29T06:46:00.000Z",
  "version": "0.1.0",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": 45
    },
    "filesystem": {
      "status": "ok",
      "writable": true
    },
    "memory": {
      "status": "ok",
      "freeMB": 2048,
      "totalMB": 4096,
      "usedPercent": 50
    },
    "cpu": {
      "status": "ok",
      "usagePercent": 30,
      "loadAverage": [0.5, 0.3, 0.2]
    }
  }
}
```

### Status-Codes

| Status | HTTP | Bedeutung | Aktion |
|--------|------|-----------|--------|
| `ok` | 200 | Alles gesund | Keine |
| `degraded` | 200 | Leichte Probleme | Überwachen |
| `error` | 503 | Kritisch | Alert senden |

## Uptime Kuma Einrichtung

### Installation (Docker)

```bash
# Docker-Compose
docker-compose up -d uptime-kuma

# Oder einzeln
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

### Konfiguration

1. **Erst-Setup**: `http://your-server:3001`
2. **Benutzer**: Admin-Konto erstellen

### Monitore einrichten

#### 1. Portal-Homepage
```yaml
Type: HTTP(s)
Name: Portal - Homepage
URL: https://pflegenavigatoreu.com
Interval: 60 seconds
Max Retries: 3
Heartbeat Interval: 60

# Keywords (optional)
Expected Keywords:
  - "PflegeNavigator"
  - "Pflegegrad-Rechner"

# Notifications
Notification:
  - Type: Telegram
  - Bot Token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
  - Chat ID: ${{ secrets.TELEGRAM_CHAT_ID }}
```

#### 2. API-Health
```yaml
Type: HTTP(s) - Json Query
Name: API - Health Check
URL: https://pflegenavigatoreu.com/api/health
Interval: 60 seconds

Json Query:
  Query: $.status
  Expected Value: ok

# Alert wenn degraded/error
```

#### 3. Datenbank-Health
```yaml
Type: HTTP(s) - Json Query
Name: Database Connection
URL: https://pflegenavigatoreu.com/api/health/db
Interval: 30 seconds

Json Query:
  Query: $.status
  Expected Value: ok
```

#### 4. SSL-Zertifikat
```yaml
Type: HTTP(s)
Name: SSL Certificate
URL: https://pflegenavigatoreu.com
Interval: 86400 seconds (1 Tag)

Certificate Expiry Notification: 14 Tage vorher
```

### Notification-Kanäle

#### Telegram
```
Settings → Notifications → Telegram
- Bot Token: Von @BotFather
- Chat ID: @username oder Gruppen-ID
```

#### Email (SMTP)
```
Settings → Notifications → Email (SMTP)
- Host: smtp.gmail.com
- Port: 587
- Username: alerts@pflegenavigatoreu.com
- Password: App-Specific Password
```

#### Webhook
```
Settings → Notifications → Webhook
- URL: https://hooks.slack.com/services/...
- Method: POST
- Body: {"text": "Alert: $MSG"}
```

## Umami Analytics

### Einrichtung

```bash
# Docker-Compose starten
docker-compose up -d umami umami-db

# Erst-Login
URL: http://your-server:8001
Default: admin / umami
```

### Website hinzufügen

1. **Settings → Websites → Add Website**
```yaml
Name: PflegeNavigator EU
domain: pflegenavigatoreu.com
Enable share URL: Yes (für Team-Zugriff)
```

2. **Tracking-Code**
```html
<!-- In src/components/Analytics.tsx -->
<script async defer 
  src="https://your-umami.com/script.js" 
  data-website-id="YOUR-ID">
</script>
```

### Events tracken

```typescript
// Pflegegrad-Rechner
window.umami?.track('pflegegrad-started')
window.umami?.track('pflegegrad-completed', { level: 3 })

// Brief-Generator
window.umami?.track('brief-generated', { type: 'versorgungsamt' })

// Widerspruch
window.umami?.track('widerspruch-created')

// Fehler
window.umami?.track('error', { type: 'api-failed' })
```

### Wichtige Metriken

| Metrik | Normalwert | Alert bei |
|--------|------------|-----------|
| Page Views / Tag | > 1000 | < 500 |
| Unique Visitors / Tag | > 500 | < 200 |
| Average Session | > 3 Min | < 1 Min |
| Bounce Rate | < 40% | > 60% |

## GlitchTip Error Tracking

### Einrichtung

```bash
# Docker-Compose
docker-compose up -d glitchtip glitchtip-db

# Erst-Login
URL: http://your-server:8002
```

### Projekt einrichten

1. **Create Project**
   - Name: PflegeNavigator EU
   - Platform: JavaScript (Next.js)

2. **DSN kopieren**
```javascript
// .env.local
NEXT_PUBLIC_GLITCHTIP_DSN=https://...@glitchtip.your-server.com/1
```

3. **SDK einbauen**
```typescript
// src/lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

### Error-Alerts

```
GlitchTip → Settings → Alerts
- New Issues: Email + Telegram
- Regression: Email
- Comments: Off
```

## Dashboards

### Uptime Kuma
```
https://status.pflegenavigatoreu.com

Status Page:
- Portal: ✅ Operational
- API: ✅ Operational  
- Database: ✅ Operational
- SSL Certificate: ✅ Valid (expires in 45 days)
```

### Umami
```
https://analytics.pflegenavigatoreu.com/share/...

Dashboard zeigt:
- Real-time Visitors
- Top Pages
- Top Referrers
- Device/Browser/Country
- Events (Pflegegrad, Briefe, etc.)
```

### GlitchTip
```
https://errors.pflegenavigatoreu.com

Dashboard zeigt:
- Open Issues
- Trends
- Affected Users
- Release Health
```

## Alert-Regeln

### Kritische Alerts (Sofort)

| Bedingung | Kanal | Timeout |
|-----------|-------|---------|
| Health-Check: `error` | Telegram + Email | 1 Min |
| Database: `error` | Telegram + Email | 1 Min |
| SSL < 7 Tage gültig | Email | - |
| Error-Rate > 10% | Telegram | 5 Min |

### Warnungen (Überwachung)

| Bedingung | Kanal | Timeout |
|-----------|-------|---------|
| Health-Check: `degraded` | Telegram | 10 Min |
| Memory > 80% | Telegram | 15 Min |
| CPU > 80% | Telegram | 15 Min |
| Response Time > 2s | Telegram | 5 Min |

## Health-Alert-System

### Automatische Alerts

```typescript
// src/lib/health-alerts.ts

// Bei kritischen Fehlern
await sendHealthAlert(
  'database',           // Service
  'fail',               // Status
  'Connection timeout', // Message
  'critical'            // Level
)

// Bei Wiederherstellung
await sendHealthAlert(
  'database',
  'recover',
  'Database connection restored',
  'warning'
)
```

### Alert-Logik

```
Failure Count:
  1. Fehler → Log only
  2. Fehler → Log + Warning
  3. Fehler → Log + Alert
  Recovery → Recovery Alert

Cooldown: 15 Min zwischen gleichen Alerts
```

## Log-Management

### Application Logs

```bash
# Lokale Logs
tail -f /workspace/logs/app.log

# Docker
docker-compose logs -f portal

# PM2
pm2 logs pflegenavigator
```

### Log-Format

```json
{
  "timestamp": "2026-04-29T06:46:00.000Z",
  "level": "error",
  "service": "portal",
  "requestId": "req-123",
  "message": "Database connection failed",
  "error": {
    "code": "CONNECTION_TIMEOUT",
    "stack": "..."
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "ip": "192.168.1.1"
  }
}
```

### Log-Rotation

```bash
# Logrotate Konfiguration
/var/www/portal/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Performance-Monitoring

### Core Web Vitals

| Metrik | Gut | Verbessern | Schlecht |
|--------|-----|------------|----------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| FID | < 100ms | 100-300ms | > 300ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

### Lighthouse CI

```bash
# Automatisierte Performance-Checks
npm run lighthouse

# Budget-Checks
lhci autorun --config=lighthouserc.json
```

### Performance-Budgets

```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "interactive": ["warn", { "maxNumericValue": 3500 }]
      }
    }
  }
}
```

## Wartungsfenster

### Geplante Wartung

```
Vor der Wartung:
1. Status-Page auf "Maintenance"
2. Health-Checks pausieren
3. Backup erstellen
4. Wartung durchführen
5. Tests durchführen
6. Health-Checks aktivieren
7. Status-Page auf "Operational"
```

### Automatische Wartung

```bash
# Nightly-Checks (Cron)
0 3 * * * /workspace/scripts/nightly-check.sh
```

```bash
#!/bin/bash
# nightly-check.sh

echo "$(date) - Starting nightly checks"

# Health-Check
curl -f https://pflegenavigatoreu.com/api/health || alert

# SSL-Check (30 Tage vorher)
expiry=$(openssl s_client -connect pflegenavigatoreu.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
# ... Logik für Alert

# Backup-Check
ls -la /backups/latest.sql.gz || alert

echo "$(date) - Nightly checks complete"
```

## Eskalation

### Level 1 (Automatisch)
- Telegram-Benachrichtigung
- Email an Tech-Team
- Auto-Retry für recoverable Fehler

### Level 2 (Manuell - 30 Min)
- Phone-Call an On-Call
- Team Slack-Channel
- Incident Ticket erstellen

### Level 3 (Kritisch - 1 Stunde)
- Manager-Benachrichtigung
- Status-Page Update
- Public-Communication (Twitter/Mastodon)

## Ressourcen

- Uptime Kuma: https://uptime.kuma.pet
- Umami: https://umami.is
- GlitchTip: https://glitchtip.com
- Web Vitals: https://web.dev/vitals