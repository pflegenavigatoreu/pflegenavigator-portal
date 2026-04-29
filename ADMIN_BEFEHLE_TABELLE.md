# ADMIN BEFEHLE - EXAKTE AUSFÜHRUNG
## PflegeNavigator EU gUG
**Für:** Administrator Frankie | **Datum:** 28.04.2026 | **Niveau:** Profi

---

## ⚡ EXAKTE BEFEHLE - SCHRITT FÜR SCHRITT

### Phase 1: ACCOUNTS ERSTELLEN (Ohne Befehle, nur Web)

| Schritt | Zeit | Aktion | Befehl/URL | Output an Agent |
|---------|------|--------|------------|-----------------|
| **1** | 15 min | Supabase Account erstellen | `https://supabase.com` → Sign Up → New Project → Name: pflegenavigatoreu → Region: Frankfurt | 3 Keys kopieren |
| **2** | 2 min | Supabase Keys extrahieren | Dashboard → Project Settings → API → Copy: URL, anon key, service_role key | URL: `https://xxx.supabase.co` |
| **3** | 20 min | Brevo Account erstellen | `https://brevo.com` → Sign Up → Verify Email → Domain hinzufügen | API-Key generieren |
| **4** | 1 min | Brevo API-Key kopieren | Dashboard → Account → SMTP & API → Create API Key → Copy | `xkeysib-...` |
| **5** | 15 min | Cloudflare Account erstellen | `https://dash.cloudflare.com/sign-up` → Zero Trust → Tunnels → Create Tunnel | Token extrahieren |
| **6** | 1 min | Cloudflare Token kopieren | Tunnel erstellen → Docker → Token nach `--token=` kopieren | `eyJhbG...` |

---

### Phase 2: SERVER EINRICHTEN (Mit SSH-Befehlen)

| Schritt | Zeit | Aktion | Exakter Befehl | Erwartetes Ergebnis |
|---------|------|--------|----------------|---------------------|
| **7** | 15 min | Hetzner CX11 bestellen | `https://console.hetzner.cloud` → Create Server → CX11 → Ubuntu 22.04 → SSH Key hinzufügen → Create | Server IP notieren |
| **8** | 10 min | SSH-Key generieren (lokal) | `ssh-keygen -t ed25519 -C "frankie@pflegenavigatoreu.com"` | Key in `~/.ssh/id_ed25519.pub` |
| **9** | 5 min | SSH-Key anzeigen | `cat ~/.ssh/id_ed25519.pub` | Ausgabe kopieren & zu Hetzner hinzufügen |
| **10** | 2 min | Zu Server verbinden | `ssh root@123.123.123.123` (IP einsetzen) | Verbunden mit Server |
| **11** | 10 min | Docker installieren | `curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh` | Docker installiert |
| **12** | 2 min | Docker starten | `systemctl start docker && systemctl enable docker` | Docker läuft |
| **13** | 3 min | Docker Compose installieren | `curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose` | docker-compose verfügbar |
| **14** | 1 min | Installation testen | `docker --version && docker-compose --version` | Versionen werden angezeigt |

---

### Phase 3: OPTIONAL (Domain)

| Schritt | Zeit | Aktion | Befehl/URL | Output |
|---------|------|--------|------------|--------|
| **15** | 10 min | Domain kaufen | `https://cloudflare.com/registrar` → Suchen: pflegenavigatoreu.com → Kaufen | Domain gehört dir |
| **16** | 10 min | DNS A-Record setzen | Cloudflare Dashboard → DNS → Add Record → Type: A, Name: @, Content: [Server IP], Proxy: ON | Domain zeigt auf Server |

---

## 📤 SENDE AN AGENT (Kopier-Template)

### Nach Schritt 2 (Supabase):
```
SUPABASE KEYS:
URL: https://deine-url.supabase.co
ANON: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0NTk1NjQwMCwiZXhwIjoyMDYxNTMyMDAwfQ.xxx
SERVICE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzQ1OTU2NDAwLCJleHAiOjIwNjE1MzIwMDB9.xxx
```

### Nach Schritt 4 (Brevo):
```
BREVO API KEY:
xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Nach Schritt 6 (Cloudflare):
```
CLOUDFLARE TOKEN:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiIxMjM0NTY3ODkwIiwidHVubmVsSWQiOiJhYmNkLTEyMzQiLCJzZXJ2aWNlIjoidHVubmVsIiwiaWF0IjoxNzQ1OTU2NDAwfQ.xxx
```

### Nach Schritt 14 (Hetzner fertig):
```
HETZNER SERVER BEREIT:
IP: 123.123.123.123
User: root
SSH-Key: ~/.ssh/id_ed25519 (lokal)
Docker: ✅ Installiert & läuft
```

---

## ✅ CHECKLISTE - ABHAKEN UND ABSCHICKEN

```
□ Schritt 1: Supabase Account erstellt (15 min)
   □ Bei supabase.com registriert
   □ Projekt "pflegenavigatoreu" erstellt
   □ Region Frankfurt gewählt
   □ Passwort notiert

□ Schritt 2: Supabase Keys an Agent gesendet (2 min)
   □ Project URL kopiert
   □ anon public key kopiert
   □ service_role key kopiert
   □ An Agent gesendet

□ Schritt 3: Brevo Account erstellt (20 min)
   □ Bei brevo.com registriert
   □ E-Mail verifiziert
   □ Domain verifiziert (optional)
   □ API-Key erstellt

□ Schritt 4: Brevo API-Key an Agent gesendet (1 min)
   □ Key kopiert (beginnt mit xkeysib-)
   □ An Agent gesendet

□ Schritt 5: Cloudflare Account erstellt (15 min)
   □ Bei dash.cloudflare.com registriert
   □ Zero Trust → Tunnels → Create Tunnel
   □ Name: pflegenavigatoreu

□ Schritt 6: Cloudflare Token an Agent gesendet (1 min)
   □ Docker-Option gewählt
   □ Token extrahiert (nach --token=)
   □ An Agent gesendet

□ Schritt 7: Hetzner CX11 bestellt (15 min)
   □ console.hetzner.cloud
   □ CX11 bestellt
   □ Ubuntu 22.04
   □ IP-Adresse notiert

□ Schritt 8-9: SSH-Key erstellt (5 min)
   □ ssh-keygen ausgeführt
   □ Public Key zu Hetzner hinzugefügt

□ Schritt 10: Zu Server verbunden (2 min)
   □ ssh root@[IP] funktioniert

□ Schritt 11-14: Docker installiert (16 min)
   □ get-docker.sh ausgeführt
   □ docker --version zeigt Version
   □ docker-compose --version zeigt Version

□ Schritt 15-16: Domain gekauft (optional, 20 min)
   □ cloudflare.com/registrar
   □ Domain gekauft
   □ DNS A-Record gesetzt

ALLE 14 (bzw. 16) SCHRITTE ERLEDIGT!
Agent kann jetzt alleine arbeiten!
```

---

## 🚀 WAS DER AGENT DANN MACHT

Sobald alle obigen ✅ erledigt sind:

| Agent-Aufgabe | Befehl | Dauer |
|---------------|--------|-------|
| Supabase Tabellen anlegen | `psql -f schema.sql` | 10 min |
| RLS Policies aktivieren | SQL Commands | 10 min |
| Brevo SMTP testen | `curl -X POST smtp.brevo.com` | 5 min |
| Cloudflare Tunnel starten | `docker run cloudflare/cloudflared` | 15 min |
| Code bauen | `npm run build` | 20 min |
| Auf Server deployen | `docker-compose up -d` | 10 min |
| Monitoring starten | `docker-compose up umami` | 10 min |
| Internet-Recherche | - | 4-6 h |

**Gesamt: ~6 Stunden autonome Arbeit**

---

## ⚠️ WICHTIGE HINWEISE

1. **Niemals Keys in Chat außerhalb Telegram/Signal posten**
2. **Keys sofort im Passwort-Manager speichern**
3. **Nachricht an Agent immer mit "SCHRITT X ERLEDIGT:" beginnen**
4. **Bei Fehlern Screenshot machen und an Agent senden**

---

**Diese Tabelle muss vollständig abgearbeitet werden.**
**Erstellt:** 28.04.2026 um 20:22 Uhr
