# 📊 Kosten-Monitoring Dokumentation

Zentrale Dokumentation für das automatisierte Kosten-Monitoring-System.

---

## Übersicht

Dieses System überwacht alle Cloud-Kosten und sendet automatisch Alerts bei:
- Überschreitung von Budget-Grenzen
- Annäherung an Free-Tier Limits
- Kritischen Zuständen (z.B. Speicher voll)

### Unterstützte Dienste

| Dienst | Limit | Alert bei | Priorität |
|--------|-------|-----------|-----------|
| **Hetzner Cloud** | 10€/Monat | 80% (8€) | Hoch |
| **Supabase** | 500MB DB, 1GB Storage | 80% | Mittel |
| **Brevo** | 300 Emails/Tag | 250/Tag | Mittel |

---

## Schnellstart

### 1. Einrichtung

```bash
# Führe das Setup-Script aus
cd scripts/monitoring
./setup-alerts.sh

# Oder schnelles Setup:
./setup-alerts.sh quick
cp ../../.env.example ../../.env
nano ../../.env
```

### 2. Konfiguration (.env)

```bash
# Telegram Alerts
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Email (optional)
ALERT_EMAIL_TO=alerts@example.com

# Quiet Hours (keine Alerts 23-07 Uhr außer kritisch)
QUIET_HOURS_START=23
QUIET_HOURS_END=7

# Hetzner
HETZNER_API_TOKEN=your_hetzner_token
HETZNER_MONTHLY_BUDGET=10

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key

# Brevo
BREVO_API_KEY=your_brevo_key
```

### 3. Manuelle Checks

```bash
# Hetzner Status
cd scripts/monitoring
./hetzner-budget-alert.sh status
./hetzner-budget-alert.sh check

# Brevo Status
./brevo-usage-alert.sh status
./brevo-usage-alert.sh check

# Gesamt-Dashboard
./cost-dashboard.sh run
./cost-dashboard.sh status
```

---

## Architektur

### Verzeichnisstruktur

```
scripts/monitoring/
├── hetzner-budget-alert.sh    # Hetzner Cloud Monitoring
├── brevo-usage-alert.sh       # Brevo Email Monitoring
├── cost-dashboard.sh          # Zentrales Dashboard
├── setup-alerts.sh            # Setup-Assistent
├── .hetzner-alert-state       # Alert-State (automatisch)
├── .brevo-alert-state         # Alert-State (automatisch)
└── .cost-dashboard-state      # Dashboard-State

src/lib/monitoring/
├── supabase-usage.ts          # Supabase Monitoring (TypeScript)
└── supabase-monitoring-functions.sql  # SQL Functions

docs/kosten/
├── KOSTEN_MONITORING.md       # Diese Dokumentation
├── monatlicher-report-YYYY-MM.md      # Automatische Reports
└── einsparungspotenziale.md   # Einsparungs-Empfehlungen
```

### Datenfluss

```
┌─────────────────────────────────────────────────────────┐
│                    KOSTEN-MONITORING                     │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  Hetzner    │  Supabase   │   Brevo     │   Dashboard     │
│   (Bash)    │    (TS)     │   (Bash)    │    (Bash)       │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│  CX11 Cost  │  DB Size    │  Emails/Day │  Gesamt-Report  │
│  Traffic    │  Storage    │  Rate Limit │  Prognosen      │
│  Backups    │  Connections│             │  Einsparungen   │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬────────┘
       │             │             │               │
       └─────────────┴─────────────┴───────────────┘
                          │
                    ┌─────┴─────┐
                    │  Alerts   │
                    ├───────────┤
                    │ Telegram  │
                    │ Email     │
                    │ Quiet Hrs │
                    └───────────┘
```

---

## Monitoring-Komponenten

### 1. Hetzner Cloud (`hetzner-budget-alert.sh`)

**Überwacht:**
- Server-Kosten (CX11: ~4.51€/Monat)
- Traffic-Kosten (geschätzt: ~2€/Monat)
- Backup/Snapshot-Kosten (~1€/Monat)

**Alerts:**
| Threshold | Aktion | Priorität |
|-----------|--------|-----------|
| 80% (8€) | Warnung mit Empfehlungen | Hoch |
| 95% (9.50€) | Kritisch + Sofortmaßnahmen | Hoch |

**API:** [Hetzner Cloud API](https://docs.hetzner.cloud/)

### 2. Supabase (`supabase-usage.ts`)

**Überwacht:**
- Datenbank-Größe (500MB Limit)
- Storage-Nutzung (1GB Limit)
- Connection Pool (10 concurrent)
- Auth-User-Anzahl

**Alerts:**
| Threshold | Aktion | Priorität |
|-----------|--------|-----------|
| 80% (400MB) | Aufräumen empfohlen | Mittel |
| 95% (475MB) | Kritisch - Upgrade oder Bereinigung | Hoch |

**SQL Functions:** Siehe `supabase-monitoring-functions.sql`

### 3. Brevo (`brevo-usage-alert.sh`)

**Überwacht:**
- Emails pro Tag (300 Limit)
- Projektion basierend auf aktuellem Tag

**Alerts:**
| Threshold | Aktion | Priorität |
|-----------|--------|-----------|
| 250/Tag (83%) | Warnung - Nicht-urgentes verschieben | Mittel |
| 290/Tag (97%) | Kritisch - Nur essenzielles senden | Hoch |
| 300/Tag (100%) | Limit erreicht - Upgrade empfohlen | Hoch |

**Upgrade-Optionen:**
- **Free:** 300/Tag (0€)
- **Starter:** 20.000/Monat (9€/Monat)
- **Business:** 100.000/Monat (25€/Monat)

### 4. Cost Dashboard (`cost-dashboard.sh`)

**Funktionen:**
- Zusammenfassung aller Kosten
- Monatliche Reports (automatisch)
- Prognosen für 2026
- Einsparungs-Empfehlungen
- Budget-Grenz-Überwachung

---

## Alert-Konfiguration

### Quiet Hours

Standard: 23:00 - 07:00 Uhr

Während Quiet Hours werden nur HIGH-Priority Alerts gesendet:
- Hetzner: 95%+ Budget
- Supabase: 95%+ Speicher
- Brevo: Limit erreicht

### Kanäle

**Telegram (empfohlen):**
- Sofortige Benachrichtigung
- Markdown Formatierung
- Unterstützt Quiet Hours

**Email (Fallback):**
- SMTP/sendmail erforderlich
- Wird verwendet wenn Telegram fehlschlägt

### Setup

```bash
# Telegram Bot erstellen
1. Öffne @BotFather in Telegram
2. /newbot
3. Name eingeben
4. Token kopieren

# Chat ID finden
1. Öffne @userinfobot
2. /start
3. ID kopieren

# Testen
./setup-alerts.sh test
```

---

## Automation

### Cron Jobs

```bash
# Hetzner Check alle 6 Stunden
0 */6 * * * /path/to/hetzner-budget-alert.sh check

# Brevo Check alle 4 Stunden
0 */4 * * * /path/to/brevo-usage-alert.sh check

# Dashboard täglich um 9 Uhr
0 9 * * * /path/to/cost-dashboard.sh run

# Monatlicher Report am 1.
0 10 1 * * /path/to/cost-dashboard.sh send
```

Automatisches Setup:
```bash
./setup-alerts.sh
# Wähle "Cron Jobs einrichten"
```

---

## Budget-Planung 2026

### Aktuelle Kosten

| Dienst | Monatlich | Jährlich |
|--------|-----------|----------|
| Hetzner | ~7.51€ | ~90.12€ |
| Supabase | 0€ | 0€ |
| Brevo | 0€ | 0€ |
| Domain | ~1.50€ | ~18€ |
| **Gesamt** | **~9€** | **~108€** |

### Szenarien

**Best Case:**
- Alle Free Tiers ausreichend
- Keine Upgrades nötig
- Einsparungen durch Optimierung
- **Gesamt: 108€/Jahr**

**Realistisch:**
- Hetzner bleibt stabil
- Supabase Upgrade Q3 (25€/Monat)
- Brevo bleibt Free
- **Gesamt: 408€/Jahr**

**Worst Case:**
- Alle Services upgraden
- Hetzner: +5€ Traffic
- Supabase: 25€/Monat
- Brevo: 9€/Monat
- **Gesamt: 516€/Jahr**

---

## Troubleshooting

### Hetzner API Fehler

```bash
# Teste API
curl -H "Authorization: Bearer $HETZNER_API_TOKEN" \
  https://api.hetzner.cloud/v1/servers

# Token hat keine Berechtigung?
# Erstelle neuen Token mit "Read" Berechtigung
```

### Telegram nicht erreichbar

```bash
# Teste Bot
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe"

# Teste Nachricht
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=Test message"
```

### Alerts werden nicht gesendet

1. Prüfe .env: `cat .env`
2. Lade Umgebung: `source .env`
3. Teste Script: `./hetzner-budget-alert.sh test`
4. Prüfe Logs: `tail -f /tmp/hetzner-check.log`

---

## Einsparungs-Potenziale

Siehe `docs/kosten/einsparungspotenziale.md`

Schnelle Gewinne:
1. **CDN einrichten** → -1€/Monat Traffic
2. **Datenbank aufräumen** → Verbleiben im Free Tier
3. **Email-Batching** → Verbleiben im Free Tier

---

## API Referenz

### Hetzner
- [API Dokumentation](https://docs.hetzner.cloud/)
- Endpoints: `/servers`, `/volumes`, `/networks`

### Supabase
- [JS Client](https://supabase.com/docs/reference/javascript)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

### Brevo
- [API Dokumentation](https://developers.brevo.com/)
- Endpoints: `/smtp/statistics`

---

## Changelog

### v1.0 (2026-04)
- Initiales Setup
- Hetzner, Supabase, Brevo Monitoring
- Telegram + Email Alerts
- Quiet Hours Support
- Automatische Reports

---

## Support

Bei Problemen:
1. Prüfe Logs in `/tmp/*-check.log`
2. Führe `./setup-alerts.sh status` aus
3. Teste mit `./hetzner-budget-alert.sh test`

---

*Letzte Aktualisierung: $(date +%Y-%m-%d)*
