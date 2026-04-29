# ADMIN HANDBUCH - PflegeNavigator EU
## Für: Frankie (Administrator)
## Inhaber: Frank/André (8751446925)

---

## 🚀 SCHNELLSTART (5 Minuten)

### 1. System-Voraussetzungen prüfen
```bash
# Node.js 18+
node --version

# npm 9+
npm --version

# Docker (optional)
docker --version
```

### 2. Repository klonen
```bash
git clone https://github.com/Pflegenavigator-GmbH/pflegenavigator-portal.git
cd pflegenavigator-portal
```

### 3. Abhängigkeiten installieren
```bash
npm install
```

### 4. Umgebungsvariablen einrichten
```bash
cp .env.example .env.local
# Dann: .env.local mit echten Keys bearbeiten
```

### 5. Entwicklungsserver starten
```bash
npm run dev
# Öffne: http://localhost:3000
```

---

## 🔧 SYSTEME EINRICHTEN (von dir zu erledigen)

### SYSTEM 1: Supabase (Datenbank)

**Was du tust:**
1. https://supabase.com → "New Project"
2. Name: `pflegenavigatoreu`
3. Region: **Frankfurt (eu-central-1)** ← Pflicht!
4. Passwort: Starkes Passwort setzen
5. Warten auf "Project Ready"
6. Settings → API → Keys kopieren

**Keys für .env.local:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Test:**
```bash
# Nach npm run dev sollte keine DB-Fehler kommen
```

---

### SYSTEM 2: Cloudflare Tunnel (Öffentlicher Zugang)

**Was du tust:**
1. https://dash.cloudflare.com
2. Zero Trust → Networks → Tunnels
3. "Create a tunnel"
4. Name: `pflegenavigatoreu`
5. Token kopieren

**.env.local:**
```bash
CLOUDFLARE_TUNNEL_TOKEN=eyJhbG...
```

**Docker starten:**
```bash
docker run --net=host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token=DEIN-TOKEN
```

**Test:**
```bash
# URL wird angezeigt, z.B. https://pflegenavigatoreu-xxx.trycloudflare.com
```

---

### SYSTEM 3: Brevo (E-Mail)

**Was du tust:**
1. https://www.brevo.com
2. Account erstellen
3. Domain hinzufügen: `pflegenavigatoreu.com`
4. API-Key erstellen

**.env.local:**
```bash
BREVO_API_KEY=xkeysib-...
```

**Test:**
```bash
# Sende Test-E-Mail über API
```

---

### SYSTEM 4: Hetzner (Server)

**Empfohlen:** CX11 (1 vCPU, 2 GB RAM, 20 GB SSD)

**Einrichtung:**
```bash
# Docker installieren
curl -fsSL https://get.docker.com | sh

# Docker Compose
docker-compose up -d
```

---

## 📋 DAILY CHECKLISTE

| Zeit | Aufgabe | Befehl |
|:---|:---|:---|
| Morgens | Server-Status | `docker ps` |
| Morgens | Logs prüfen | `docker-compose logs -f` |
| Wöchentlich | Backup | Automatisch via Supabase |
| Monatlich | Updates | `apt update && apt upgrade` |

---

## 🐛 TROUBLESHOOTING

### Problem: "Supabase connection failed"
**Lösung:**
```bash
# Prüfe Keys in .env.local
grep SUPABASE .env.local

# Teste Verbindung
curl https://xxx.supabase.co/rest/v1/
```

### Problem: "Build failed"
**Lösung:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Problem: "PDF-Export funktioniert nicht"
**Lösung:**
```bash
# Puppeteer braucht Chromium
sudo apt install chromium-browser
# ODER in Docker: Bereits enthalten
```

---

## 📞 KONTAKTE

| Problem | Ansprechpartner |
|:---|:---|
| Technik | Frankie (1895584628) |
| Inhalt/Entscheidungen | Frank/André (8751446925) |
| Rechtliches | Anwalt Tim Gruner |
| Hosting | Hetzner Support |

---

## 🔒 SICHERHEIT

**Wichtig:**
- `.env.local` niemals in Git committen
- API-Keys regelmäßig rotieren
- Backups täglich überprüfen
- HTTPS erzwingen

**Befehl für sicheren Commit:**
```bash
git add .
git commit -m "feat: update"
git push origin main
```

---

**Version:** 1.0  
**Erstellt:** 28. April 2026  
**Nächste Aktualisierung:** Nach System-Setup
