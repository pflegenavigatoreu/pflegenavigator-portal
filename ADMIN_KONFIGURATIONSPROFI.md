# ADMIN KONFIGURATIONSPROFI
## PflegeNavigator EU gUG - Vollständige Einrichtung
**Für:** Administrator Frankie  
**Erstellt:** 28. April 2026, 20:18 Uhr  
**Version:** 1.0 - Profi-Niveau  
**Wichtig:** Nach Abschluss dieser Schritte arbeitet der Agent vollständig autonom

---

## 🎯 ÜBERSICHT

| Phase | Dauer | Was du machst | Was der Agent danach macht |
|-------|-------|---------------|---------------------------|
| **Vorbereitung** | 10 Min | Accounts erstellen | - |
| **Phase 1** | 45 Min | Keys extrahieren & senden | System-Integration (automatisch) |
| **Phase 2** | 30 Min | Server einrichten | Deployment (automatisch) |
| **Phase 3** | 15 Min | Domain & SSL | Finalisierung (automatisch) |
| **GESAMT** | **~100 Min** | **Deine Arbeit** | **~5h Agent-Arbeit** |

---

## 📋 VORBEREITUNG (Mach das zuerst)

### Benötigte Accounts (kostenlos erstellen):

1. **E-Mail für alles:** `info@pflegenavigatoreu.com` (oder deine bestehende)
2. **Passwort-Manager:** Bitwarden oder KeePass (empfohlen!)
3. **Telegram/Signal:** Für sichere Key-Übertragung

---

## PHASE 1: KEYS EXTRAHIEREN (45 Minuten)

### Schritt 1.1: Supabase (15 Min)

#### A) Account erstellen
```
1. Gehe zu: https://supabase.com
2. Klicke: "Start your project"
3. Sign in with: GitHub (einfachster Weg)
4. Wähle: "New project"
5. Organization: Dein GitHub-Name
6. Project name: pflegenavigatoreu
7. Database password: [STARKES PASSWORT - notieren!]
8. Region: Frankfurt (eu-central-1) ⚠️ WICHTIG!
9. Klicke: "Create new project"
10. Warte bis "Your project has been created" erscheint (~2 Min)
```

#### B) API-Keys kopieren
```
1. Im Supabase Dashboard:
2. Linke Seitenleiste → Project Settings → API
3. Kopiere folgende 3 Werte EXAKT:

   [ ] Project URL: https://[xxxxx].supabase.co
   [ ] anon public: eyJhbGciOiJIUzI1NiIs... (lang)
   [ ] service_role secret: eyJhbGciOiJIUzI1NiIs... (lang, geheim!)

4. SPEICHERN in Passwort-Manager unter:
   - Supabase Project URL
   - Supabase Anon Key
   - Supabase Service Role Key
```

#### C) Keys an Agent senden
```
Telegram-Nachricht an Agent:
"SUPABASE KEYS PHASE 1 KOMPLETT:
URL: https://xxxxx.supabase.co
ANON: eyJhbG...
SERVICE: eyJhbG...
[Dein Name]"
```

**✅ CHECKPOINT 1:** Agent bestätigt Empfang

---

### Schritt 1.2: Brevo (15 Min)

#### A) Account erstellen
```
1. Gehe zu: https://www.brevo.com
2. Klicke: "Sign up free"
3. E-Mail: info@pflegenavigatoreu.com
4. Passwort: [STARKES PASSWORT - notieren!]
5. Verifiziere E-Mail (Link in Inbox klicken)
6. Fülle Profil aus:
   - Company: PflegeNavigator EU gUG
   - Website: https://pflegenavigatoreu.com
   - Address: Bielefeld, Deutschland
```

#### B) Domain verifizieren
```
1. Dashboard → Senders & IP → Domains
2. Klicke: "Add a domain"
3. Domain: pflegenavigatoreu.com
4. Klicke: "Save"
5. DNS-Einträge werden angezeigt:
   - Brevo gibt dir: DKIM, SPF, TXT Records
   
6. [OPTIONAL - nur wenn du Domain schon hast]
   - Bei deinem Domain-Provider (Cloudflare/Namecheap)
   - Füge die 3 DNS-Einträge hinzu
   - Warte 5-10 Min bis verifiziert
   
   [ODER: Skippe jetzt, mach später]
   - Domain-Verifizierung kann später nachgeholt werden
   - E-Mails funktionieren auch ohne (mit Einschränkungen)
```

#### C) API-Key erstellen
```
1. Dashboard → Account → SMTP & API
2. Tab: "API Keys"
3. Klicke: "Create a new API key"
4. Name: PflegeNavigator-Production
5. Rechte: ☑️ Access to all Brevo APIs
6. Klicke: "Generate"
7. Kopiere den Key (beginnt mit "xkeysib-...")
8. SPEICHERN in Passwort-Manager
```

#### D) API-Key an Agent senden
```
Telegram-Nachricht:
"BREVO API KEY:
xkeysib-xxxxxxxxxxxxx
[Dein Name]"
```

**✅ CHECKPOINT 2:** Agent bestätigt Empfang

---

### Schritt 1.3: Cloudflare (15 Min)

#### A) Account erstellen
```
1. Gehe zu: https://dash.cloudflare.com/sign-up
2. E-Mail: info@pflegenavigatoreu.com
3. Passwort: [STARKES PASSWORT]
4. Verifiziere E-Mail
```

#### B) Zero Trust einrichten
```
1. Dashboard → linke Seitenleiste: "Zero Trust"
2. Klicke: "Access" → "Tunnels"
3. Klicke: "Create a tunnel"
4. Name: pflegenavigatoreu-tunnel
5. Klicke: "Save"
6. Wähle: "Docker"
7. Kopiere den BEFEHL (wichtig!):
   docker run --net=host cloudflare/cloudflared:latest tunnel run --token=eyJhbG...
   
   Extrahiere nur den TOKEN (nach --token=):
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### C) Token an Agent senden
```
Telegram-Nachricht:
"CLOUDFLARE TUNNEL TOKEN:
eyJhbG...
[Dein Name]"
```

**✅ CHECKPOINT 3:** Agent bestätigt Empfang

---

## PHASE 2: SERVER EINRICHTEN (30 Minuten)

### Schritt 2.1: Hetzner Server bestellen (10 Min)

```
1. Gehe zu: https://www.hetzner.com/cloud
2. Klicke: "Get started"
3. Erstelle Account:
   - E-Mail: info@pflegenavigatoreu.com
   - Passwort: [STARKES PASSWORT]
   - Verifiziere E-Mail
4. Füge Zahlungsmethode hinzu:
   - Kreditkarte oder SEPA
5. Dashboard → "Create server"
6. Konfiguration:
   - Type: CX11 (3,29€/Monat) oder CPX11 (5,35€/Monat)
   - Location: Falkenstein (DE)
   - Image: Ubuntu 22.04
   - Networking: IPv4 + IPv6
   - SSH Key: [Neuen erstellen - siehe 2.2]
   - Server Name: pflegenavigatoreu-prod
7. Klicke: "Create & buy now"
8. Warte bis Server online (~1-2 Min)
9. Notiere die IP-Adresse: 123.123.123.123
```

### Schritt 2.2: SSH-Key erstellen

```bash
# Auf deinem lokalen Computer (Terminal):

# 1. SSH-Key generieren (falls noch nicht vorhanden)
ssh-keygen -t ed25519 -C "frankie@pflegenavigatoreu.com"

# 2. Ausgabe:
# Generating public/private ed25519 key pair.
# Enter file in which to save the key: [Enter drücken]
# Enter passphrase: [Enter drücken für kein Passwort]

# 3. Public Key anzeigen:
cat ~/.ssh/id_ed25519.pub

# 4. Kopiere die Ausgabe (beginnt mit ssh-ed25519...)
```

#### SSH-Key zu Hetzner hinzufügen
```
1. Hetzner Console → Project → Security → SSH Keys
2. Klicke: "Add SSH Key"
3. Name: frankie-local
4. Public Key: [Eingefügt von oben]
5. Klicke: "Add"
```

### Schritt 2.3: Docker installieren (10 Min)

```bash
# Verbinde dich mit dem Server:
ssh root@123.123.123.123

# Docker installieren (Copy-Paste):
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker starten:
systemctl start docker
systemctl enable docker

# Docker Compose installieren:
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Test:
docker --version
docker-compose --version
```

**✅ CHECKPOINT 4:** Docker läuft

### Schritt 2.4: Server-Daten an Agent senden

```
Telegram-Nachricht:
"HETZNER SERVER:
IP: 123.123.123.123
User: root
SSH-Key: ~/.ssh/id_ed25519 (lokal bei dir)
Docker: ✅ Installiert
[Dein Name]"
```

**✅ CHECKPOINT 5:** Agent übernimmt Deployment

---

## PHASE 3: DOMAIN & SSL (15 Minuten)

### Schritt 3.1: Domain kaufen (optional, aber empfohlen)

```
Option A: Cloudflare Registrar (empfohlen)
1. Cloudflare Dashboard → Registrar
2. Suche: pflegenavigatoreu.com
3. Wenn verfügbar: Kaufen (~10€/Jahr)
4. Bezahlen mit Kreditkarte

Option B: Namecheap
1. namecheap.com
2. Suche Domain
3. Kaufen (~8-12€/Jahr)
4. DNS auf Cloudflare zeigen lassen
```

### Schritt 3.2: DNS konfigurieren (wenn Domain vorhanden)

```
In Cloudflare Dashboard:
1. Domain auswählen
2. Tab: "DNS" → "Records"
3. Füge hinzu:
   
   Type: A
   Name: @
   IPv4: [Hetzner Server IP]
   Proxy: ✅ (orange Wolke)
   TTL: Auto
   
   Type: CNAME
   Name: www
   Target: pflegenavigatoreu.com
   Proxy: ✅
   TTL: Auto

4. Speichern
5. Warte 5-10 Min (Propagation)
```

### Schritt 3.3: Domain an Agent melden

```
Telegram-Nachricht:
"DOMAIN KONFIGURIERT:
Domain: pflegenavigatoreu.com
DNS: ✅ Auf Cloudflare
SSL: ✅ Cloudflare (Auto)
[Dein Name]"
```

**✅ CHECKPOINT 6:** Alle Phasen komplett

---

## ✅ ABSCHLUSS-CHECKLISTE

Kopiere das und hakke ab:

### Phase 1 (Keys)
- [ ] Supabase Account erstellt
- [ ] Supabase 3 Keys an Agent gesendet
- [ ] Brevo Account erstellt
- [ ] Brevo API-Key an Agent gesendet
- [ ] Cloudflare Account erstellt
- [ ] Cloudflare Tunnel Token an Agent gesendet

### Phase 2 (Server)
- [ ] Hetzner CX11 bestellt
- [ ] SSH-Key erstellt
- [ ] SSH-Key zu Hetzner hinzugefügt
- [ ] Docker installiert
- [ ] Server-Daten an Agent gesendet

### Phase 3 (Domain)
- [ ] Domain gekauft (optional)
- [ ] DNS konfiguriert (optional)
- [ ] Domain an Agent gemeldet

---

## 🚀 WAS PASSIERT DANACH (Agent arbeitet autonom)

Sobald du "ALLE KEYS SIND DA" schreibst:

### Automatisch (ohne dein Zutun):
1. **Supabase Integration** (10 Min)
   - Tabellen anlegen
   - RLS aktivieren
   - Test-Daten einspielen

2. **Cloudflare Tunnel** (15 Min)
   - Container starten
   - Public URL generieren
   - SSL validieren

3. **Brevo E-Mail** (20 Min)
   - Templates hochladen
   - SMTP testen
   - Cron-Jobs für Erinnerungen

4. **Hetzner Deployment** (30 Min)
   - Code bauen (npm run build)
   - Docker-Compose starten
   - Health-Checks
   - Domain verbinden

5. **Monitoring** (20 Min)
   - Umami Tracking
   - Uptime Kuma Monitore
   - Fehler-Logging

6. **Internet-Recherche** (2-4 Stunden)
   - Beste Tools finden
   - Video-Generierung
   - Social Media APIs
   - KI-Chat Integration

**Gesamt: ~6 Stunden autonome Agent-Arbeit**

---

## 🆘 HILFE

**Wenn etwas nicht klappt:**
1. Screenshot machen (Fehlermeldung)
2. Text kopieren
3. An Agent senden mit: "HILFE: Phase X, Schritt Y"
4. Der Agent führt dich durch

**Wichtige Links:**
- Supabase: https://app.supabase.com
- Brevo: https://app.brevo.com
- Cloudflare: https://dash.cloudflare.com
- Hetzner: https://console.hetzner.cloud

---

**Diese Datei wurde am 28.04.2026 um 20:18 Uhr erstellt.**
**Version: 1.0 - Profi-Niveau**
**Gültig bis:** Neue Version vom Agent

