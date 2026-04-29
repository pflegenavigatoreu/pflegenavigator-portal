# ADMIN TECHNIK-HANDBUCH
## Für: Frankie (Technischer Administrator)
## Inhaber: André Schulze (8751444625)
## Projekt: PflegeNavigator EU

**Deine Rolle:** Alles Technische einrichten und warten
**Was du brauchst:** Keys vom Inhaber André
**Status:** Code fertig, Systeme müssen verbunden werden

---

## SYSTEM 1: SERVER (Hetzner CX11)

**Was du tust:**
1. [ ] Hetzner bestellen: https://www.hetzner.com/cloud
2. [ ] Server-Typ: CX11 (1 vCPU, 2 GB RAM, 20 GB SSD)
3. [ ] Standort: Falkenstein (DE) oder Nürnberg (DE)
4. [ ] Betriebssystem: Ubuntu 22.04 LTS
5. [ ] SSH-Key erstellen/hinzufügen:
```bash
ssh-keygen -t ed25519 -C "frankie@pflegenavigatoreu"
cat ~/.ssh/id_ed25519.pub
```
6. [ ] SSH-Verbindung testen:
```bash
ssh root@DEINE-SERVER-IP
```
7. [ ] Docker installieren:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```
8. [ ] Docker Compose installieren:
```bash
sudo apt update
sudo apt install docker-compose-plugin
```

**Ergebnis:** Server läuft, Docker bereit

---

## SYSTEM 2: DATENBANK (Supabase)

**Warte auf Inhaber André:**
- Supabase-Account muss er erstellen (seine E-Mail nötig)
- Er gibt dir 3 Keys:
  1. `NEXT_PUBLIC_SUPABASE_URL`
  2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  3. `SUPABASE_SERVICE_ROLE_KEY`

**Was du tust (nachdem du Keys hast):**
1. [ ] `.env.local` Datei erstellen:
```bash
cd /data/.openclaw/workspace
nano .env.local
```

2. [ ] Keys einfügen:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

3. [ ] SQL-Tabellen erstellen (André muss das im Supabase-Dashboard machen ODER du machst es mit psql wenn er dir Zugang gibt)

4. [ ] Test:
```bash
npm install
npm run build
npm start
```

**Ergebnis:** Portal läuft mit Datenbank

---

## SYSTEM 3: E-MAIL (Brevo)

**Warte auf Inhaber André:**
- Brevo-Account muss er erstellen
- Er gibt dir API-Key: `xkeysib-...`

**Was du tust:**
1. [ ] In `.env.local` eintragen:
```bash
BREVO_API_KEY=xkeysib-...
EMAIL_FROM=info@pflegenavigatoreu.com
```

2. [ ] Code-Integration testen (ist bereits im Portal integriert)

3. [ ] Test-E-Mail senden:
```bash
curl --request POST \
  --url https://api.brevo.com/v3/smtp/email \
  --header 'accept: application/json' \
  --header 'api-key: DEIN-API-KEY' \
  --header 'content-type: application/json' \
  --data '{
    "sender": {"name": "PflegeNavigator", "email": "info@pflegenavigatoreu.com"},
    "to": [{"email": "test@example.com"}],
    "subject": "Test",
    "htmlContent": "<h1>Test</h1>"
  }'
```

**Ergebnis:** E-Mails funktionieren

---

## SYSTEM 4: ÖFFENTLICHER ZUGRIFF (Cloudflare Tunnel)

**Warte auf Inhaber André:**
- Cloudflare-Account muss er erstellen
- Er gibt dir Token: `eyJhbG...`

**Was du tust:**
1. [ ] In `.env.local` eintragen:
```bash
CLOUDFLARE_TUNNEL_TOKEN=eyJhbG...
```

2. [ ] Tunnel starten:
```bash
docker run --net=host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token=DEIN-TOKEN
```

3. [ ] URL notieren (z.B. `https://pflegenavigatoreu-xxx.trycloudflare.com`)

4. [ ] In `.env.local` eintragen:
```bash
NEXT_PUBLIC_APP_URL=https://pflegenavigatoreu-xxx.trycloudflare.com
```

5. [ ] Portal neu starten:
```bash
npm start
```

**Ergebnis:** Portal öffentlich erreichbar

---

## SYSTEM 5: MONITORING (Docker-Compose)

**Was du tust:**
1. [ ] Alle Services starten:
```bash
cd /data/.openclaw/workspace
docker-compose up -d
```

2. [ ] Prüfen ob läuft:
```bash
docker-compose ps
```

3. [ ] Dashboards öffnen:
- Umami: http://DEINE-SERVER-IP:8001
- Uptime Kuma: http://DEINE-SERVER-IP:3001
- GlitchTip: http://DEINE-SERVER-IP:8002

4. [ ] Admin-Accounts erstellen (in jedem Dashboard)

**Ergebnis:** Monitoring läuft

---

## SYSTEM 6: BACKUP

**Was du tust:**
1. [ ] Supabase-Backup einrichten (im Dashboard)
2. [ ] ODER: Manuell mit pg_dump:
```bash
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

3. [ ] Automatisch per Cron (wöchentlich):
```bash
0 2 * * 0 cd /data/.openclaw/workspace && pg_dump ... > backup_$(date +\%Y\%m\%d).sql
```

**Ergebnis:** Datenbank gesichert

---

## DAILY CHECKLISTE (Deine täglichen Aufgaben)

| Zeit | Aufgabe | Befehl |
|:---|:---|:---|
| Morgens | Server-Status prüfen | `docker ps` |
| Morgens | Logs ansehen | `docker-compose logs -f` |
| Wöchentlich | Backup durchführen | `pg_dump ...` |
| Wöchentlich | Updates prüfen | `apt update && apt upgrade` |
| Bei Fehler | Inhaber informieren | Threema/Telegram |

---

## TROUBLESHOOTING

### Problem: Portal startet nicht
```bash
# Lösung:
cd /data/.openclaw/workspace
rm -rf .next node_modules
npm install
npm run build
npm start
```

### Problem: Datenbankverbindung fehlgeschlagen
```bash
# Prüfen:
curl -I https://xxx.supabase.co/rest/v1/
# Sollte 401 oder 200 zurückgeben (nicht 404)
```

### Problem: Tunnel läuft nicht
```bash
# Lösung:
docker ps  # Container sehen?
docker logs cloudflared  # Fehler lesen
```

---

## KONTAKT

**Bei Problemen:**
1. Erst selbst versuchen (Dokumentation)
2. Dann Inhaber André fragen (Telegram: 8751444625)
3. Bei technischen Fehlern: Agent fragen

---

**Erstellt:** 28. April 2026
**Version:** 1.0
**Nächste Aktualisierung:** Nach Einrichtung aller Systeme
