# ADMIN_TODO_FINAL.md
**PflegeNavigator EU - Abschluss Phase**
**Datum:** 27.04.2026 20:54
**Status:** Code 95% fertig - Nur noch Live-Gang nötig

---

## 🚨 WICHTIGSTE 3 AUFGABEN (In dieser Reihenfolge!)

### 1. CLOUDFLARE TUNNEL AKTIVIEREN (15 Min)
**Was:** Öffentlicher Zugang beta.pflegenavigatoreu.com

```bash
# Als root ausführen:

# 1. Cloudflared installieren
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# 2. Login (öffnet Browser-Link)
cloudflared tunnel login

# 3. Tunnel erstellen
cloudflared tunnel create pflegenavigator

# 4. DNS Route
cloudflared tunnel route dns pflegenavigator beta.pflegenavigatoreu.com

# 5. Config kopieren
sudo mkdir -p /root/.cloudflared
sudo cp ~/.cloudflared/*.json /root/.cloudflared/

# 6. Service starten
sudo cp /data/.openclaw/workspace/cloudflare/cloudflared.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

# 7. Prüfen
sudo systemctl status cloudflared
```

**Test:** https://beta.pflegenavigatoreu.com aufrufen

---

### 2. SUPABASE VERBINDUNG TESTEN (5 Min)
**Was:** Datenbank-Verbindung prüfen

```bash
cd /data/.openclaw/workspace

# 1. Build versuchen (wenn möglich)
npm run build 2>&1 | tail -20

# 2. Wenn Build erfolgreich:
# .env prüfen:
cat .env | grep SUPABASE

# 3. Sollte enthalten:
# NEXT_PUBLIC_SUPABASE_URL=https://...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Falls Build fehlschlägt:**
- TypeScript-Fehler → In CODE_FIXES.md nachschauen
- Node-Version → nvm use 22

---

### 3. SERVER STARTEN (10 Min)
**Was:** Next.js laufen lassen

```bash
cd /data/.openclaw/workspace

# Variante A: Direkt (einfacher)
npm install
npm run build  # Wenn möglich
npm run start  # Produktion

# Variante B: Docker (robuster)
docker-compose up -d app

# Variante C: Dev-Mode (nur zu Testen)
npm run dev
```

**Prüfen:** curl http://localhost:3000 sollte HTML zurückgeben

---

## 📋 WEITERE AUFGABEN (Nach den 3 wichtigen)

### 4. Domain DNS Einrichten
**Falls beta.pflegenavigatoreu.com nicht funktioniert:**
- Login bei Domain-Provider
- CNAME Record: beta → cloudflare Tunnel
- ODER: A-Record auf Server-IP

### 5. SSL/HTTPS Prüfen
**Sollte automatisch via Cloudflare gehen**
- Prüfen: https://beta.pflegenavigatoreu.com
- Falls nicht: Cloudflare Dashboard → SSL/TLS → Full (strict)

### 6. Accounts Einrichten
**Wenn Portal läuft, diese Accounts erstellen:**

| Dienst | URL | Wofür | Preis |
|--------|-----|-------|-------|
| Threema | gateway.threema.ch | Admin-Benachrichtigungen | 1-2€/Monat |
| Brevo | brevo.com | E-Mails senden | 300/Tag kostenlos |
| Stripe | stripe.com | Bezahlung | 0€ Setup |
| Umami | cloud.umami.is | Analytics (Alternative zu Self-hosted) | 0€ |

### 7. Docker-Stack Vollständig
```bash
# Alle Services starten
cd /data/.openclaw/workspace
docker-compose up -d

# Prüfen:
docker-compose ps
```

**Services:**
- LibreTranslate (Port 5000) - 35 Sprachen
- Umami (Port 3001) - Analytics
- Uptime Kuma (Port 3002) - Monitoring
- GlitchTip (Port 8000) - Error Tracking

### 8. Cron-Job für Tool-Recherche Prüfen
```bash
# Prüfen ob aktiv:
openclaw cron list

# Sollte zeigen: daily-tool-research
# Wenn nicht → Siehe DAILY_TOOL_RESEARCH.md
```

---

## 🔍 TEST-CHECKLISTE (Nach Live-Gang)

### Funktionale Tests
- [ ] Startseite lädt
- [ ] Pflegegrad-Rechner funktioniert (Modul 1-6)
- [ ] QR-Code wird generiert
- [ ] Magic-Link funktioniert
- [ ] PDF-Export funktioniert
- [ ] AvatarChat antwortet
- [ ] Voice-Input erkennt Sprache
- [ ] Widerspruch-Brief wird generiert

### Inhaltliche Tests
- [ ] Alle 2026-Beträge korrekt (PG2:347€, PG3:599€...)
- [ ] Fristen korrekt angezeigt
- [ ] Impressum erreichbar
- [ ] Datenschutz erreichbar
- [ ] Einfache Sprache überall

### Technische Tests
- [ ] Mobile-Ansicht OK
- [ ] Ladezeit <3 Sekunden
- [ ] Keine 404-Fehler
- [ ] HTTPS aktiv
- [ ] QR-Code scanbar

---

## 📁 WICHTIGE DATEIEN (Für Admin)

| Datei | Zweck |
|-------|-------|
| `/cloudflare/config.yml` | Tunnel-Konfiguration |
| `/cloudflare/cloudflared.service` | Systemd Service |
| `/cloudflare/qr-code.png` | QR-Code für Portal |
| `/.env` | Umgebungsvariablen |
| `/docker-compose.yml` | Alle Services |
| `/STATUS_FINAL.md` | Kompletter Status |
| `/ADMIN_TODO_FINAL.md` | Diese Datei |

---

## 🆘 FALLS ETWAS NICHT FUNKTIONIERT

### Problem: Build fehlschlägt
**Lösung:**
```bash
# Cache löschen
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Problem: Cloudflare Tunnel nicht erreichbar
**Lösung:**
```bash
# Logs checken
sudo journalctl -u cloudflared -f

# Tunnel neu starten
sudo systemctl restart cloudflared
```

### Problem: Supabase Verbindung fehlschlägt
**Lösung:**
- Prüfen: `.env` Datei vorhanden?
- Prüfen: Keys korrekt?
- Test: `curl $SUPABASE_URL/rest/v1/` sollte 401 geben (nicht 404)

### Problem: Port 3000 belegt
**Lösung:**
```bash
# Prozess finden und killen
lsof -ti:3000 | xargs kill -9

# Oder anderen Port nutzen
PORT=3001 npm run start
```

---

## ✅ ERFOLGSKRITERIUM

**Wenn alles funktioniert:**
1. https://beta.pflegenavigatoreu.com lädt
2. Pflegegrad-Rechner läuft durch
3. QR-Code wird generiert
4. PDF wird erstellt
5. AvatarChat antwortet

**Dann:** Frank per Telegram benachrichtigen!

---

## ⏰ ZEITPLAN (Empfohlene Reihenfolge)

| Minute | Aufgabe |
|--------|---------|
| 0-15 | Cloudflare Tunnel |
| 15-20 | Supabase Test |
| 20-30 | Server starten |
| 30-45 | Docker-Stack |
| 45-60 | Tests durchführen |
| 60 | Frank benachrichtigen |

---

**Fragen? Siehe:**
- `/docs` (OpenClaw Dokumentation)
- `/cloudflare/README.md` (Detaillierte Tunnel-Anleitung)
- `/STATUS_FINAL.md` (Kompletter Projektstatus)
