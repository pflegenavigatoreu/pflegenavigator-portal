# ZUGANGSDATEN ÜBERSICHT - PflegeNavigator EU
**SENSIBEL - Nur für Inhaber und Admin**
**Erstellt:** 27.04.2026
**Letzte Aktualisierung:** 27.04.2026

---

## 🔐 KRITISCHE ZUGANGSDATEN

### 1. DOMAIN & HOSTING

#### Domain: pflegenavigatoreu.com
| Feld | Wert | Status |
|------|------|--------|
| Registrar | [Noch einzutragen] | ❌ Offen |
| Login-URL | [Noch einzutragen] | ❌ Offen |
| Benutzername | [Noch einzutragen] | ❌ Offen |
| Passwort | [Noch einzutragen] | ❌ Offen |
| 2FA | [Noch einzutragen] | ❌ Offen |
| Ablaufdatum | [Noch einzutragen] | ❌ Offen |

#### Subdomain: beta.pflegenavigatoreu.com
| Feld | Wert | Status |
|------|------|--------|
| DNS-Provider | Cloudflare | ✅ Konfiguriert |
| CNAME Record | → Cloudflare Tunnel | ✅ Konfiguriert |
| SSL | Cloudflare (Auto) | ✅ Konfiguriert |

---

### 2. CLOUDFLARE ACCOUNT

| Feld | Wert | Status |
|------|------|--------|
| E-Mail | [Noch einzutragen] | ❌ Offen |
| Passwort | [Noch einzutragen] | ❌ Offen |
| 2FA | [Noch einzutragen] | ❌ Offen |
| Tunnel ID | [Nach Einrichtung] | ❌ Offen |
| Account-ID | [Nach Einrichtung] | ❌ Offen |
| API-Token | [Nach Einrichtung] | ❌ Offen |

**Wichtige Einstellungen:**
- SSL/TLS Mode: Full (strict)
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON
- Brotli Compression: ON

---

### 3. SUPABASE (Datenbank)

| Feld | Wert | Status |
|------|------|--------|
| Projekt-Name | pflegenavigator-eu | ✅ |
| Region | eu-central-1 (Frankfurt) | ✅ |
| Projekt-ID | [Noch einzutragen] | ❌ Offen |
| Dashboard | https://app.supabase.com | ✅ |
| Login-E-Mail | [Noch einzutragen] | ❌ Offen |
| Passwort | [Noch einzutragen] | ❌ Offen |
| 2FA | [Noch einzutragen] | ❌ Offen |

**API-Keys (aus .env):**
```
NEXT_PUBLIC_SUPABASE_URL=[Aus .env kopieren]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Aus .env kopieren]
SUPABASE_SERVICE_ROLE_KEY=[Aus .env kopieren]
```

**Wichtige Tabellen:**
- `public.cases` - Fall-Daten
- `public.answers` - Antworten zu Modulen
- `public.diary_entries` - Tagebuch-Einträge
- `auth.users` - Benutzer (Supabase Auth)

---

### 4. SERVER / HOSTING

#### Hetzner Cloud (Empfohlen)
| Feld | Wert | Status |
|------|------|--------|
| Server-Typ | CX11 (oder größer) | ❌ Noch nicht erstellt |
| IP-Adresse | [Noch einzutragen] | ❌ Offen |
| Root-Passwort | [Noch einzutragen] | ❌ Offen |
| SSH-Key | [Noch einzutragen] | ❌ Offen |
| Login-URL | https://console.hetzner.cloud | ✅ |
| Projekt-Name | pflegenavigator | ❌ Offen |

**Alternative: Anderer VPS-Provider**
- DigitalOcean
- Linode
- Vultr
- AWS EC2

---

### 5. EXTERNE DIENSTE (Accounts erforderlich)

#### Stripe (Zahlungen)
| Feld | Wert | Status |
|------|------|--------|
| Login | https://dashboard.stripe.com | ✅ |
| E-Mail | [Noch einzutragen] | ❌ Offen |
| Passwort | [Noch einzutragen] | ❌ Offen |
| 2FA | [Noch einzutragen] | ❌ Offen |
| Test API Key | [Nach Einrichtung] | ❌ Offen |
| Live API Key | [Nach Einrichtung] | ❌ Offen |
| Webhook Secret | [Nach Einrichtung] | ❌ Offen |

**Wichtige Einstellungen:**
- Webhook Endpoint: https://beta.pflegenavigatoreu.com/api/webhooks/stripe
- Events: payment_intent.succeeded, checkout.session.completed

#### Brevo (E-Mails)
| Feld | Wert | Status |
|------|------|--------|
| Login | https://app.brevo.com | ✅ |
| E-Mail | [Noch einzutragen] | ❌ Offen |
| Passwort | [Noch einzutragen] | ❌ Offen |
| 2FA | [Noch einzutragen] | ❌ Offen |
| API-Key | [Nach Einrichtung] | ❌ Offen |
| Sender-Name | PflegeNavigator EU | ✅ |
| Sender-E-Mail | noreply@pflegenavigatoreu.com | ❌ Offen |

**Wichtig:** SPF und DKIM Einträge in DNS setzen!

#### Threema Gateway (Messenger)
| Feld | Wert | Status |
|------|------|--------|
| Login | https://gateway.threema.ch | ✅ |
| E-Mail | [Noch einzutragen] | ❌ Offen |
| Passwort | [Noch einzutragen] | ❌ Offen |
| 2FA | [Noch einzutragen] | ❌ Offen |
| API-Key | [Nach Einrichtung] | ❌ Offen |
| Threema-ID | [Nach Einrichtung] | ❌ Offen |

#### Synthesia (Videos)
| Feld | Wert | Status |
|------|------|--------|
| Login | https://www.synthesia.io | ✅ |
| E-Mail | [Noch einzutragen] | ❌ Offen |
| Passwort | [Noch einzutragen] | ❌ Offen |
| 2FA | [Noch einzutragen] | ❌ Offen |
| API-Key | [Nach Einrichtung] | ❌ Offen |
| Credits/Plan | [Nach Einrichtung] | ❌ Offen |

---

### 6. ANALYTICS & MONITORING

#### Umami (Self-hosted via Docker)
| Feld | Wert | Status |
|------|------|--------|
| URL | http://localhost:3001 (oder Server-IP:3001) | ✅ |
| Login | admin | ✅ |
| Passwort | [Bei Installation setzen] | ❌ Offen |
| Website-ID | [Nach Einrichtung] | ❌ Offen |
| Tracking-Code | [Nach Einrichtung] | ❌ Offen |

#### Uptime Kuma (Self-hosted via Docker)
| Feld | Wert | Status |
|------|------|--------|
| URL | http://localhost:3002 | ✅ |
| Login | [Bei Installation setzen] | ❌ Offen |
| Passwort | [Bei Installation setzen] | ❌ Offen |

#### GlitchTip (Self-hosted via Docker)
| Feld | Wert | Status |
|------|------|--------|
| URL | http://localhost:8000 | ✅ |
| Login | [Bei Installation setzen] | ❌ Offen |
| Passwort | [Bei Installation setzen] | ❌ Offen |
| DSN | [Nach Einrichtung] | ❌ Offen |

---

### 7. BACKUP & SICHERHEIT

#### Backup-Strategie
| Aspekt | Lösung | Status |
|--------|--------|--------|
| Code | GitHub Repository | ✅ (lokal vorhanden) |
| Datenbank | Supabase Auto-Backup | ✅ (inkludiert) |
| Server | Hetzner Snapshots | ❌ Noch nicht eingerichtet |
| Lokal | Täglicher Export | ❌ Noch nicht eingerichtet |

#### Wichtige Dateien
```
/data/.openclaw/workspace/
├── .env                    # SENSIBEL - Niemals committen!
├── cloudflare/
│   └── *.json              # Tunnel Credentials
├── supabase/
│   └── service-key.json    # Admin Keys
└── backups/                # Manuelle Backups
```

---

## 📝 OFFENE AUFGAEN

### Sofort (vor Live-Gang):
1. ❌ Domain bei Registrar kaufen/transferieren
2. ❌ Hetzner Server erstellen
3. ❌ Cloudflare Account erstellen
4. ❌ DNS auf Cloudflare umstellen
5. ❌ Supabase Projekt-Details sichern
6. ❌ .env Datei mit allen Keys füllen

### Kurzfristig (nach Live-Gang):
7. ❌ Stripe Account erstellen
8. ❌ Brevo Account erstellen
9. ❌ Threema Gateway beantragen
10. ❌ Umami/Monitoring Passwörter setzen

### Mittelfristig:
11. ❌ Synthesia Account erstellen
12. ❌ Backup-Automatisierung einrichten
13. ❌ SSL-Zertifikate prüfen

---

## 🚨 SICHERHEITSHINWEISE

### Passwort-Manager
**EMPFOHLEN:** Bitwarden oder 1Password verwenden!
- Keine Passwörter in Klartext speichern
- Einzigartige Passwörter für jeden Dienst
- 2FA überall aktivieren wo möglich

### .env Datei schützen
```bash
# Nie committen!
echo ".env" >> .gitignore
echo "cloudflare/*.json" >> .gitignore

# Rechte setzen
chmod 600 .env
chmod 700 cloudflare/
```

### SSH-Zugriff sichern
```bash
# Root-Login deaktivieren
# Nur SSH-Key-Auth erlauben
# Fail2ban installieren
```

---

## 📞 NOTFALLKONTAKTE

| Rolle | Name | Kontakt | Verantwortung |
|-------|------|---------|---------------|
| Inhaber | [Name] | [Telefon/E-Mail] | Gesamtverantwortung |
| Technischer Admin | [Name] | [Telefon/E-Mail] | Server, Deployment |
| Rechtsberater | [Name] | [Telefon/E-Mail] | Impressum, DSGVO |
| Notfall (24/7) | [Name] | [Telefon] | Server-Ausfälle |

---

## 🔧 WICHTIGE KOMMANDOS

### Server-Zugriff
```bash
# SSH (nach Einrichtung)
ssh root@[SERVER-IP]

# Oder mit Key
ssh -i ~/.ssh/pflegenavigator root@[SERVER-IP]
```

### Docker-Verwaltung
```bash
# Alle Services starten
cd /opt/pflegenavigator
docker-compose up -d

# Logs ansehen
docker-compose logs -f app
docker-compose logs -f umami

# Updates
docker-compose pull
docker-compose up -d
```

### Cloudflare Tunnel
```bash
# Status prüfen
sudo systemctl status cloudflared

# Neustart
sudo systemctl restart cloudflared

# Logs
sudo journalctl -u cloudflared -f
```

---

## 📊 AKTUELLER STATUS

**Zuletzt aktualisiert:** 27.04.2026 21:08

| Kategorie | Fertig | Offen | % |
|-----------|--------|-------|---|
| Domain | 0 | 1 | 0% |
| Server | 0 | 1 | 0% |
| Cloudflare | 0.5 | 0.5 | 50% |
| Supabase | 0.5 | 0.5 | 50% |
| Externe Dienste | 0 | 4 | 0% |
| Monitoring | 0.5 | 0.5 | 50% |
| Backup | 0 | 1 | 0% |
| **GESAMT** | **2** | **8.5** | **19%** |

---

## ✅ CHECKLISTE EINRICHTUNG

### Tag 1: Infrastruktur
- [ ] Domain kaufen/transferieren
- [ ] Hetzner Server erstellen
- [ ] SSH-Key einrichten
- [ ] Basis-Sicherheit (UFW, Fail2ban)
- [ ] Docker installieren

### Tag 2: Cloud & DNS
- [ ] Cloudflare Account erstellen
- [ ] DNS auf Cloudflare umstellen
- [ ] Cloudflare Tunnel einrichten
- [ ] SSL/TLS konfigurieren
- [ ] beta.pflegenavigatoreu.com testen

### Tag 3: Deployment
- [ ] Code auf Server kopieren
- [ ] .env Datei einrichten
- [ ] Docker-Compose starten
- [ ] Supabase Verbindung testen
- [ ] Erste Test-Seite aufrufen

### Tag 4: Externe Dienste
- [ ] Stripe Account erstellen
- [ ] Brevo Account erstellen
- [ ] API-Keys eintragen
- [ ] Test-Zahlung durchführen
- [ ] Test-E-Mail senden

### Tag 5: Monitoring & Backup
- [ ] Umami einrichten
- [ ] Uptime Kuma einrichten
- [ ] GlitchTip einrichten
- [ ] Backup-Automatisierung
- [ ] Dokumentation finalisieren

---

**Diese Datei ist SENSIBEL und enthält kritische Zugangsdaten.**
**Nur für autorisierte Personen bestimmt!**

**Speicherort:** /data/.openclaw/workspace/ZUGANGSDATEN_UEBERSICHT.md
**Backup:** Auf sicherem USB-Stick + Passwort-Manager
