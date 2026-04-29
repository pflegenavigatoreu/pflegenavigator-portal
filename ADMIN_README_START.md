# ADMINISTRATOR ANLEITUNG - ALLES AUF EINMAL
**PflegeNavigator EU Portal Setup**
**Stand:** 27.04.2026

---

## 🚨 WICHTIG (Zuerst das!)

### 1. OPENCLAW TIMEOUT KONFIGURATION

**Problem:** Agent wird nach 30 Sekunden gekillt
**Lösung:** Config-Datei anpassen

**Schritt 1:** Config finden
```bash
# Mögliche Pfade:
~/.openclaw/config.yaml
/etc/openclaw/config.yaml
/data/.openclaw/config.json
```

**Schritt 2:** Timeout erhöhen
```yaml
execution:
  timeoutSeconds: 3600  # 1 Stunde statt 30 Sekunden
  allowLongRunning: true
  backgroundTasks: true

subagents:
  maxRuntimeSeconds: 7200  # 2 Stunden
  maxConcurrent: 5
```

**Schritt 3:** Gateway restart
```bash
openclaw gateway restart
```

---

## 🚀 PORTAL STARTEN

### Option A: Docker (Empfohlen - Alles auf einmal)

```bash
cd /data/.openclaw/workspace

# Alle Services starten
docker-compose up -d

# Status prüfen
docker-compose ps

# Logs ansehen
docker-compose logs -f portal
```

**Läuft dann:**
- Portal: http://localhost:3000
- Umami Analytics: http://localhost:8001
- Monitoring: http://localhost:3001
- Error Tracking: http://localhost:8002
- Übersetzung: http://localhost:5000

---

### Option B: Ohne Docker (Nur Portal)

```bash
cd /data/.openclaw/workspace
npm run build
npm start
```

**Dann ngrok:**
```bash
ngrok http 3000
```

**Link kopieren und an Frank schicken!**

---

## 📋 ENVIRONMENT VARIABLEN

**.env Datei erstellen:**
```bash
cd /data/.openclaw/workspace
nano .env
```

**Inhalt:**
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Umami (kostenlos)
UMAMI_SECRET=dein-geheimer-key-hier

# GlitchTip (kostenlos)
GLITCHTIP_SECRET=dein-geheimer-key-hier

# Ngrok (optional)
NGROK_AUTHTOKEN=dein-token-hier
```

---

## 🔧 FALLS ETWAS NICHT KLAPPT

### Docker Container startet nicht
```bash
# Logs prüfen
docker-compose logs portal

# Ports prüfen
netstat -tlnp | grep 3000

# Container neustarten
docker-compose restart portal
```

### ngrok Link nicht erreichbar
```bash
# ngrok Status
curl http://localhost:4040/api/tunnels

# Ngrok neu starten
pkill ngrok
ngrok http 3000
```

### Build Fehler
```bash
# Clean build
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

---

## ⏰ CRONJOB (Automatisch)

**Alle 30 Minuten prüfen:**
```bash
crontab -e
```

**Zeile hinzufügen:**
```
*/30 * * * * cd /data/.openclaw/workspace && docker-compose ps | grep -q "Up" || docker-compose up -d
```

---

## 📞 SUPPORT

**Frank kontaktieren:**
- Telegram: @frank_pflegenavigator

**OpenClaw Doku:**
- https://docs.openclaw.ai

**Docker Doku:**
- https://docs.docker.com

---

## ✅ CHECKLISTE

- [ ] OpenClaw Config angepasst (Timeout 3600s)
- [ ] Gateway neu gestartet
- [ ] .env Datei erstellt
- [ ] docker-compose up -d ausgeführt
- [ ] Alle Container laufen (docker-compose ps)
- [ ] ngrok gestartet
- [ ] Link an Frank geschickt
- [ ] Cronjob eingerichtet

---

**Nach Erledigung:** Frank Bescheid sagen!
**Dann:** Portal ist online und läuft!
