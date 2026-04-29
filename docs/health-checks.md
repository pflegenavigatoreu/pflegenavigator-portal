# Health Check API

Vollständige Health-Check API für das Pflegenavigator Portal mit Kubernetes-Style Probes, Dashboard und automatischen Alerts.

## Endpunkte

### GET /api/health
Haupt-Health-Check mit allen Systemprüfungen:
- **Database**: Supabase Verbindung + Response Time
- **Filesystem**: Schreibbarkeit prüfen
- **Memory**: Freier Speicher (>500MB = OK)
- **CPU**: Load Average (<80% = OK)

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "0.1.0",
  "uptime": 3600,
  "checks": {
    "database": { "status": "ok", "responseTime": 45 },
    "filesystem": { "status": "ok", "writable": true },
    "memory": { "status": "ok", "freeMB": 2048, "totalMB": 4096, "usedPercent": 50 },
    "cpu": { "status": "ok", "loadAverage": [1.5, 1.2, 1.0], "usagePercent": 25 }
  }
}
```

### GET /api/health/db
Spezieller Datenbank-Health-Check mit detaillierten Verbindungsinformationen.

### GET /api/ready
Kubernetes-Style Readiness Probe. Gibt 200 zurück wenn alle Dependencies ready sind (DB, Filesystem, Memory), sonst 503.

### GET /api/live
Kubernetes-Style Liveness Probe. Gibt immer 200 OK zurück - einfacher Ping zum Prüfen ob der Prozess läuft.

## Dashboard

Zugriff über `/admin/health` mit Passwort-Schutz (Standard: `admin2024`, änderbar via `NEXT_PUBLIC_ADMIN_PASSWORD`).

Features:
- Visueller Status aller Services (Grün/Gelb/Rot)
- Echtzeit-Updates alle 30 Sekunden
- Historie der letzten 50 Checks
- DB-Verbindungsdetails

## Alerts

Konfiguration via Environment Variables:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
ADMIN_EMAIL=admin@example.com
FRANK_EMAIL=frank@example.com
HEALTH_FAILURE_THRESHOLD=3
```

### Alert-Regeln
- **Health-Fail**: Telegram an Admin
- **3 aufeinanderfolgende Failures**: E-Mail an Frank
- **Recovery**: Telegram-Benachrichtigung

### Rate Limiting
- Mindestens 5 Minuten zwischen Alerts für denselben Service

## Logs

Health-Checks werden geloggt nach:
- `logs/health-check.log` - JSON-Format
- `logs/health-alerts.log` - Menschenlesbare Alerts

## Tests

### Unit Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### E2E Tests
```bash
npm run test:health
npm run test:e2e
```

## Status Codes

| Status | Bedeutung |
|--------|-----------|
| **ok** | Alle Systeme gesund |
| **degraded** | Ein oder mehrere Warnings |
| **error** | Kritischer Fehler |

## HTTP Status Codes

| Endpoint | OK | Fehler |
|----------|-----|--------|
| /api/health | 200 | 503 |
| /api/ready | 200 | 503 |
| /api/live | 200 | 200 |

## Kubernetes Integration

```yaml
livenessProbe:
  httpGet:
    path: /api/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Dateien

- `src/app/api/health/route.ts` - Haupt-Health-Check
- `src/app/api/health/db/route.ts` - DB-Health-Check
- `src/app/api/ready/route.ts` - Readiness Probe
- `src/app/api/live/route.ts` - Liveness Probe
- `src/components/HealthMonitor.tsx` - Dashboard Komponente
- `src/app/admin/health/page.tsx` - Admin Dashboard Seite
- `src/lib/health-alerts.ts` - Alert-System
- `src/app/api/health/health.test.ts` - Unit Tests
- `e2e/health-checks.spec.ts` - E2E Tests
