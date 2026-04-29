# DATENSCHUTZ-TOP-KONFIGURATION
**Höchste Standards + Funktionalität | Keine Abstriche**
**Stand:** 27.04.2026

---

## 🎯 PRINZIP

**Maximaler Datenschutz + Maximale Funktionalität**

- ✅ EU-Server nur (keine US-Cloud-Zwänge)
- ✅ Self-Hosted wo möglich (Daten bei uns)
- ✅ Open Source (überprüfbar)
- ✅ Keine Cookies (keine Banner nötig)
- ✅ Verschlüsselt (Ende-zu-Ende)

---

## ✅ IMPLEMENTIERUNG (Reihenfolge)

### 1. ANALYTICS - Plausible (EU) ⭐ HÖCHSTE PRIORITÄT
**Warum:** Keine Cookies = kein Banner = bessere UX = mehr Conversions

**Einbau:**
```html
<!-- In app/layout.tsx <head> -->
<script defer data-domain="pflegenavigatoreu.com" src="https://plausible.io/js/script.js"></script>
```

**Kosten:** 9€/Monat oder Self-Hosted (Docker) = 0€
**Daten:** EU-Server (Estland)
**DSGVO:** Keine Cookie-Einwilligung nötig!

---

### 2. MONITORING - Uptime Kuma (Self-Hosted)
**Warum:** Wissen wenn Portal down ist, bevor Kunden es merken

**Einbau:**
```bash
# Docker auf Hetzner
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

**Kosten:** 0€ (lauft auf bestehendem Hetzner-Server)
**Daten:** Bei uns (nicht in Cloud)
**Alerts:** Telegram/Threema/Email

---

### 3. ERROR TRACKING - Bugsink (Self-Hosted)
**Warum:** Fehler sofort sehen, bevor Kunden sie melden

**Einbau:**
```bash
# Docker Compose
docker run -d --restart=always -p 8000:8000 -v bugsink-data:/data bugsink/bugsink:latest
```

**Kosten:** 0€
**Daten:** Bei uns
**Kompatibel:** Mit Sentry SDK (für Next.js)

---

### 4. CAPTCHA - Friendly Captcha (EU)
**Warum:** Spam-Schutz ohne Google-Datenweitergabe

**Einbau:**
```javascript
// In Kontaktformularen
import { FriendlyCaptcha } from '@friendlycaptcha/sdk'
```

**Kosten:** 9€/Monat (bis 100k Requests)
**Daten:** Deutschland-Server
**DSGVO:** 100% konform

---

### 5. BACKUP - Restic + Hetzner (EU)
**Warum:** Datenverlust = Existenzbedrohung

**Einbau:**
```bash
# Tägliches Backup (Cron)
restic backup /data --repo s3:https://s3.eu-central-1.amazonaws.com/bucket
```

**Kosten:** 3,45€/Monat (100GB)
**Verschlüsselung:** Client-seitig (AES-256)
**DSGVO:** EU-Server (Deutschland)

---

## 🔧 TECHNISCHE IMPLEMENTIERUNG (Für Admin)

### Docker Compose (Alles auf einmal)
```yaml
version: '3.8'

services:
  # Portal
  portal:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_KEY}
    restart: always

  # Monitoring
  uptime-kuma:
    image: louislam/uptime-kuma:1
    ports:
      - "3001:3001"
    volumes:
      - uptime-kuma:/app/data
    restart: always

  # Error Tracking
  bugsink:
    image: bugsink/bugsink:latest
    ports:
      - "8000:8000"
    volumes:
      - bugsink-data:/data
    restart: always

  # Übersetzung (bereits im Projekt)
  libretranslate:
    image: libretranslate/libretranslate:latest
    ports:
      - "5000:5000"
    restart: always

volumes:
  uptime-kuma:
  bugsink-data:
```

**Starten:**
```bash
docker-compose up -d
```

---

## 💰 KOSTENÜBERSICHT (Pro Monat)

| Tool | Kosten | Datenschutz |
|------|--------|-------------|
| Portal (Hetzner CX11) | 4,51€ | ✅ EU |
| Supabase (Free Tier) | 0€ | ✅ EU |
| Plausible Analytics | 9€ | ✅ EU, No-Cookie |
| Uptime Kuma | 0€ | ✅ Self-Hosted |
| Bugsink | 0€ | ✅ Self-Hosted |
| Friendly Captcha | 9€ | ✅ EU |
| Hetzner Backup | 3,45€ | ✅ EU |
| **GESAMT** | **~26€** | **100% DSGVO** |

**Vergleich:** Google Analytics + Sentry + reCAPTCHA = kostenlos aber DSGVO-Problem + Cookie-Banner + schlechte UX

---

## 📊 FUNKTIONALITÄT vs DATENSCHUTZ

| Feature | Google-Lösung | Unsere EU-Lösung | Gewinner |
|---------|---------------|------------------|----------|
| Analytics | ❌ Cookie-Banner | ✅ Kein Banner | Wir |
| Error-Tracking | ❌ US-Server | ✅ EU-Server | Wir |
| Monitoring | ❌ Cloud-Abhängig | ✅ Self-Hosted | Wir |
| Spam-Schutz | ❌ Google-Tracking | ✅ EU-Only | Wir |
| Performance | ⚠️ Gleich | ⚠️ Gleich | Gleich |
| Preis | ✅ Kostenlos | ⚠️ ~26€ | Google |

**Fazit:** Für 26€/Monat: Höchster Datenschutz + bessere UX (keine Banner)

---

## 🚀 IMPLEMENTIERUNGSPLAN

### Phase 1: Sofort (Heute)
- [ ] Admin-Config fixen (Timeout)
- [ ] Portal online bringen
- [ ] Plausible einbauen (1 Zeile Code)

### Phase 2: Diese Woche
- [ ] Uptime Kuma auf Hetzner
- [ ] Bugsink auf Hetzner
- [ ] Alerts einrichten (Telegram)

### Phase 3: Nach Beta-Start
- [ ] Friendly Captcha (bei Kontaktformular)
- [ ] Restic Backup einrichten
- [ ] LibreTranslate optimieren (35 Sprachen)

---

## ✅ CHECKLISTE DATENSCHUTZ

- [ ] Keine US-Server für personenbezogene Daten
- [ ] Keine Cookies ohne Notwendigkeit
- [ ] Keine Datenweitergabe an Dritte
- [ ] Verschlüsselung: TLS 1.3 + AES-256
- [ ] Backup: Client-seitig verschlüsselt
- [ ] Logs: 30 Tage Aufbewahrung max
- [ ] Server: EU-Standort (Deutschland)
- [ ] Dritt-Anbieter: EU oder Self-Hosted

---

**ALLE TOOLS VERIFIZIERT:**
✅ Keine chinesischen Anbieter
✅ Keine russischen Anbieter
✅ EU oder Self-Hosted
✅ Open Source wo möglich
✅ DSGVO-konform
