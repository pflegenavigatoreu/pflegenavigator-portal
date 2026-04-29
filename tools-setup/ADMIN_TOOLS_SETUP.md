# Admin Docker Tools - Setup Dokumentation

**Erstellt für:** Frankie  
**Datum:** 2026-04-28  
**Standort:** `/data/.openclaw/workspace/tools-setup/`

---

## Übersicht der Services

| Service | Port | URL | Zweck |
|---------|------|-----|-------|
| Umami Analytics | 8001 | http://localhost:8001 | Website Analytics |
| Uptime Kuma | 3002 | http://localhost:3002 | Monitoring/Status-Seiten |
| LibreTranslate | 5000 | http://localhost:5000 | Übersetzungs-API (35+ Sprachen) |
| LibreChat | 3080 | http://localhost:3080 | Lokale OpenAI-Alternative |

---

## Vor der ersten Nutzung

### Schritt 1: Umgebungsvariablen konfigurieren

```bash
cd /data/.openclaw/workspace/tools-setup
cp .env.example .env
nano .env  # oder dein bevorzugter Editor
```

**Wichtige Änderungen in `.env`:**
- `UMAMI_DB_PASSWORD` - Starkes Passwort für Umami Datenbank
- `UMAMI_APP_SECRET` - Mindestens 32 Zeichen zufällig
- `LIBRECHAT_JWT_SECRET` - Mindestens 32 Zeichen zufällig
- `MEILI_MASTER_KEY` - Master Key für LibreChat Suche

### Schritt 2: Services starten

```bash
./start.sh
```

Das Script:
- Pullt alle Docker Images
- Startet alle Services
- Zeigt den Status
- Gibt Links aus

---

## Service-Details

### 1. Umami Analytics (Port 8001)

**Was ist das?** Self-hosted Website Analytics (Google Analytics Alternative)

**Zugriff:** http://localhost:8001

**Default Login:**
- **Username:** `admin`
- **Password:** `umami`

⚠️ **ÄNDERE DAS PASSWORT SOFORT NACH DEM ERSTEN LOGIN!**

#### Erste Schritte in Umami:

1. Login mit admin/umami
2. **Einstellungen** → **Profil** → Passwort ändern
3. **Websites** → **Add Website**
   - Name: z.B. "Meine Website"
   - Domain: z.B. "example.com"
   - **WICHTIG:** Die "Website ID" kopieren!

#### Tracking-Code einbauen:

```html
<script async src="http://DEIN-SERVER:8001/umami.js" data-website-id="HIER-DIE-WEBSITE-ID-EINTRAGEN"></script>
```

Die `data-website-id` findest du in Umami unter **Websites** → deine Website → **Edit** → kopiere die UUID.

#### Konfiguration speichern unter:
- Datenbank: Docker Volume `umami-db-data`
- Keine extra Konfigurationsdatei nötig

---

### 2. Uptime Kuma (Port 3002)

**Was ist das?** Monitoring für Websites/Dienste mit Status-Seiten

**Zugriff:** http://localhost:3002

**Erste Schritte:**

1. Öffne http://localhost:3002
2. Erstelle ein **Admin-Konto** (Erst-Setup)
3. Füge deine ersten Monitore hinzu:

#### Basis-Monitoring für localhost:3000

1. **Add New Monitor**
2. Monitor Type: **HTTP(s)**
3. Name: `Localhost-3000`
4. URL: `http://localhost:3000`
5. Heartbeat Interval: 60 Sekunden
6. **Save**

#### Weitere empfohlene Monitore:

| Name | Typ | URL |
|------|-----|-----|
| Umami | HTTP | http://localhost:8001 |
| LibreTranslate | HTTP | http://localhost:5000 |
| LibreChat | HTTP | http://localhost:3080 |

#### Status-Seite erstellen:

1. **Status Pages** → **New Status Page**
2. Name: z.B. "Admin Tools Status"
3. Slug: z.B. "status"
4. Füge deine Monitore hinzu
5. **Speichern** - Seite erreichbar unter `http://localhost:3002/status/status`

#### Konfiguration speichert sich:
- Alle Daten in Docker Volume `uptime-kuma-data`
- Keine manuelle Backup-Datei nötig

---

### 3. LibreTranslate (Port 5000)

**Was ist das?** Kostenlose Übersetzungs-API (35 Sprachen)

**Zugriff:** http://localhost:5000

**Features:**
- 35+ Sprachen verfügbar
- Text-Übersetzung
- Auto-Detect Spracherkennung
- REST API

#### Test mit curl:

```bash
# Übersetzung (Deutsch -> Englisch)
curl -X POST "http://localhost:5000/translate" \
  -H "Content-Type: application/json" \
  -d '{"q":"Hallo Welt","source":"de","target":"en"}'

# Antwort: {"translatedText":"Hello World"}
```

**Oder einfach:**
```bash
./test-translation.sh
```

#### Verfügbare Sprachen (35):

`en,de,fr,es,it,pt,ru,zh,ja,ko,ar,nl,pl,tr,sv,cs,da,fi,el,he,hi,hu,id,vi,th,uk,ro,bg,sr,hr,sk,sl,lt,lv,et,ta,te,ml`

#### API Beispiele:

```bash
# Auto-Detect
curl -X POST "http://localhost:5000/detect" \
  -H "Content-Type: application/json" \
  -d '{"q":"Bonjour le monde"}'

# Sprachen auflisten
curl "http://localhost:5000/languages"
```

---

### 4. LibreChat (Port 3080)

**Was ist das?** OpenAI-Alternative mit lokalem Ollama-Integration

**Zugriff:** http://localhost:3080

#### Erste Schritte:

1. Öffne http://localhost:3080
2. Klicke auf **Sign Up** (Account erstellen)
3. Nach Login: Du kannst Chat-Konversationen starten!

#### Ollama-Integration (Voraussetzung):

**Achtung:** Ollama muss auf dem Host-System installiert sein!

```bash
# Ollama installieren (falls nicht vorhanden)
curl -fsSL https://ollama.com/install.sh | sh

# Ein Modell laden
ollama pull llama3.2

# Ollama läuft nun auf Port 11434
```

#### Konfiguration überprüfen:

Die LibreChat Konfiguration ist unter `librechat-config/librechat.yml`:

```yaml
endpoints:
  ollama:
    baseURL: "http://host.docker.internal:11434"
    models:
      default:
        - "llama3.2"
```

**Wichtig:** Der Container nutzt `host.docker.internal` um auf den Host zuzugreifen.

#### Verfügbare Features:

- Lokale LLMs via Ollama
- Chat-History
- Export/Import von Konversationen
- Mehrere Chat-Endpoints (OpenAI, Anthropic optional)
- Datei-Upload für Chat-Kontext

---

## Nützliche Befehle

### Alle Services starten:
```bash
./start.sh
```

### Alle Services stoppen:
```bash
./stop.sh
```

### Logs ansehen:
```bash
# Alle Services
./logs.sh

# Nur ein Service
./logs.sh umami
./logs.sh libretranslate
./logs.sh librechat
```

### Einzelnen Service neu starten:
```bash
docker-compose restart umami
docker-compose restart librechat
```

### Vollständig neustarten:
```bash
docker-compose down
./start.sh
```

### Container-Status:
```bash
docker-compose ps
```

### Ressourcen-Verbrauch:
```bash
docker stats
```

---

## Datei-Struktur

```
tools-setup/
├── docker-compose.yml          # Haupt-Konfiguration
├── .env.example               # Beispiel-Umgebungsvariablen
├── .env                       # Deine Secrets (wird erstellt)
├── librechat.example.yml     # Beispiel-LibreChat-Config
├── librechat-config/          # Aktive LibreChat-Config
│   └── librechat.yml
├── start.sh                   # Start-Script
├── stop.sh                    # Stop-Script
├── logs.sh                    # Logs-Script
├── test-translation.sh        # Test für LibreTranslate
└── ADMIN_TOOLS_SETUP.md       # Diese Datei
```

---

## Backup

### Volumes sichern:

```bash
# Backup-Verzeichnis erstellen
mkdir -p ~/backups/docker-tools

# Volumes exportieren
docker run --rm -v umami-db-data:/source:ro -v ~/backups/docker-tools:/backup alpine tar czf /backup/umami-db-$(date +%Y%m%d).tar.gz -C /source .
docker run --rm -v uptime-kuma-data:/source:ro -v ~/backups/docker-tools:/backup alpine tar czf /backup/uptime-kuma-$(date +%Y%m%d).tar.gz -C /source .
docker run --rm -v librechat-data:/source:ro -v ~/backups/docker-tools:/backup alpine tar czf /backup/librechat-$(date +%Y%m%d).tar.gz -C /source .
```

### Wichtige Dateien:

- `tools-setup/.env` - Deine Secrets
- `tools-setup/librechat-config/librechat.yml` - LibreChat Konfiguration

---

## Fehlerbehebung

### Umami startet nicht
```bash
# Datenbank prüfen
docker-compose logs umami-db

# Oder komplett reset (ACHTUNG: Daten gehen verloren!)
docker-compose down -v
docker volume rm umami-db-data
```

### LibreTranslate ist langsam
- Das erste Laden kann dauern (Modelle werden heruntergeladen)
- Geduld - das ist normal!

### LibreChat kann nicht auf Ollama zugreifen
```bash
# Prüfe ob Ollama läuft
curl http://localhost:11434/api/tags

# Falls nicht, starte Ollama
ollama serve
```

### Port bereits belegt
```bash
# Prüfe was Port 8001 blockiert
sudo lsof -i :8001

# Oder ändere den Port in docker-compose.yml
```

---

## Zusammenfassung für Frankie

### Nach dem ersten Start musst du:

1. **Umami** (http://localhost:8001)
   - [ ] Mit admin/umami einloggen
   - [ ] Passwort ändern
   - [ ] Website hinzufügen
   - [ ] Website-ID kopieren und im Tracking-Code verwenden

2. **Uptime Kuma** (http://localhost:3002)
   - [ ] Admin-Konto erstellen
   - [ ] Monitor für localhost:3000 hinzufügen
   - [ ] Weitere Services monitoren
   - [ ] Status-Seite erstellen

3. **LibreTranslate** (http://localhost:5000)
   - [ ] Testen mit `./test-translation.sh`
   - [ ] In Anwendungen als Übersetzungs-API nutzen

4. **LibreChat** (http://localhost:3080)
   - [ ] Ollama installieren (falls nicht vorhanden)
   - [ ] Ein Modell laden: `ollama pull llama3.2`
   - [ ] Account bei LibreChat erstellen
   - [ ] Chat-Konversationen starten

### Ports im Überblick:

| Service | URL |
|---------|-----|
| Umami | http://localhost:8001 |
| Uptime Kuma | http://localhost:3002 |
| LibreTranslate | http://localhost:5000 |
| LibreChat | http://localhost:3080 |

### Passwörter merken:

- Umami Default: `admin` / `umami`
- Andere Services: Selbst erstellt bei erstem Setup

---

**Fragen?** Schau in die Logs mit `./logs.sh` oder `docker-compose logs`.

Viel Erfolg! 🚀
