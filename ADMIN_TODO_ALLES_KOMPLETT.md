# ADMIN TODO ALLES KOMPLETT
## PflegeNavigator EU - Komplette Einrichtungs-Checkliste
**Erstellt:** 28. April 2026
**Für:** André Schulze
**Status:** Portal gebaut, Systeme müssen eingerichtet werden

---

## 🚨 KRITISCH - MUSS SOFORT GEMACHT WERDEN

### 1. SUPABASE (Datenbank läuft nicht)
| Status | ⚠️ Noch nicht eingerichtet |
|--------|---------------------------|
| **Was** | PostgreSQL-Datenbank für Fall-Management |
| **Warum** | Ohne Supabase: Keine Fall-Codes, kein Tagebuch, keine Speicherung |
| **Kosten** | Kostenlos (Free Tier) bis 500MB |
| **Dauer** | 15 Minuten |

**Schritte:**
1. [ ] Gehe zu https://supabase.com
2. [ ] Account erstellen (mit GitHub oder Email)
3. [ ] Neues Projekt: "pflegenavigatoreu"
4. [ ] Region: **Frankfurt (eu-central-1)** ← WICHTIG!
5. [ ] Passwort: Starkes Passwort wählen
6. [ ] Warten bis "Project is ready"
7. [ ] Project Settings → API
8. [ ] **Diese 3 Werte kopieren:**
   - Project URL: `https://xxx.supabase.co`
   - anon public: `eyJhbG...`
   - service_role secret: `eyJhbG...`
9. [ ] In `.env.local` eintragen (siehe unten)

---

### 2. BREVO (E-Mail-Verteiler - KRITISCH)
| Status | ❌ Noch nicht eingerichtet |
|--------|--------------------------|
| **Was** | E-Mail-Versand für Newsletter, Benachrichtigungen, Tagesberichte |
| **Warum** | Ohne Brevo: Keine E-Mails, kein Verteiler, keine automatischen Berichte |
| **Kosten** | 300 E-Mails/Tag kostenlos |
| **Dauer** | 20 Minuten |

**Schritte:**
1. [ ] Gehe zu https://www.brevo.com
2. [ ] Account erstellen
3. [ ] Domain verifizieren (pflegenavigatoreu.com oder anderes)
4. [ ] API-Key erstellen:
   - Dashboard → API-Keys → "Create a new API key"
   - Name: "PflegeNavigator-Production"
   - Rechte: "SMTP + API"
5. [ ] API-Key kopieren: `xkeysib-...`
6. [ ] In `.env.local` eintragen:
   ```
   BREVO_API_KEY=xkeysib-...
   EMAIL_FROM=info@pflegenavigatoreu.com
   ```
7. [ ] In Next.js integrieren (Code siehe unten)

**Wichtig:**
- 300 E-Mails/Tag = 9.000/Monat (reicht für Start)
- Ab 900€/Jahr: 100.000 E-Mails/Monat

---

### 3. CLOUDFLARE TUNNEL (Externer Zugriff)
| Status | ❌ Noch nicht eingerichtet |
|--------|--------------------------|
| **Was** | Öffentliche URL für Portal (QR-Codes funktionieren) |
| **Warum** | Ohne Tunnel: Nur localhost, QR-Codes nicht von außen erreichbar |
| **Kosten** | Kostenlos |
| **Dauer** | 10 Minuten |

**Schritte:**
1. [ ] https://dash.cloudflare.com → Anmelden
2. [ ] Zero Trust → Networks → Tunnels
3. [ ] "Create a tunnel"
4. [ ] Name: "pflegenavigatoreu"
5. [ ] Docker wählen
6. [ ] Token kopieren: `eyJhbG...`
7. [ ] Auf Server ausführen:
   ```bash
   docker run --net=host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token=DEIN-TOKEN
   ```
8. [ ] URL notieren: `https://pflegenavigator-xxx.trycloudflare.com`
9. [ ] In `.env.local` eintragen:
   ```
   NEXT_PUBLIC_APP_URL=https://pflegenavigator-xxx.trycloudflare.com
   ```

---

### 4. .ENV.LOCAL (Umgebungsvariablen)
| Status | ❌ Noch nicht erstellt |
|--------|------------------------|
| **Was** | Alle API-Keys und Secrets |
| **Warum** | Ohne .env.local: Portal startet nicht |

**Datei erstellen:** `/data/.openclaw/workspace/.env.local`

**Inhalt (Vorlage):**
```bash
# ============================================
# SUPABASE (Werte aus Schritt 1!)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://DEINE-URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...DEIN-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...DEIN-SERVICE-KEY

# ============================================
# BREVO E-MAIL (Werte aus Schritt 2!)
# ============================================
BREVO_API_KEY=xkeysib-...DEIN-API-KEY
EMAIL_FROM=info@pflegenavigatoreu.com

# ============================================
# APP URL (Werte aus Schritt 3!)
# ============================================
# Lokal erstmal:
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Später mit Tunnel:
# NEXT_PUBLIC_APP_URL=https://pflegenavigatoreu-xxx.trycloudflare.com

# ============================================
# CLOUDFLARE (Werte aus Schritt 3!)
# ============================================
CLOUDFLARE_TUNNEL_TOKEN=eyJhbG...DEIN-TOKEN

# ============================================
# OPTIONAL (später)
# ============================================
# UMAMI_WEBSITE_ID=...
# STRIPE_PUBLIC_KEY=...
# STRIPE_SECRET_KEY=...
```

---

## 🟡 WICHTIG - SOLLTE BALD GEMACHT WERDEN

### 5. UMAmi ANALYTICS (Selbst-gehostet)
| Status | ⚠️ Config vorhanden, nicht gestartet |
|--------|-------------------------------------|
| **Was** | Datenschutz-konforme Statistiken (GDPR-konform) |
| **Kosten** | 0€ (Docker) |
| **Dauer** | 15 Minuten |

**Starten:**
```bash
cd /data/.openclaw/workspace
docker-compose up umami -d
```

**Dann:**
- Öffne http://localhost:8001
- Admin-Account erstellen
- Website-ID kopieren
- In `.env.local` eintragen

---

### 6. DOMAIN + SSL (Professionell)
| Status | ❌ Noch nicht eingerichtet |
|--------|--------------------------|
| **Was** | Eigene Domain statt Cloudflare-Subdomain |
| **Empfohlen** | pflegenavigatoreu.com |
| **Kosten** | ~10-15€/Jahr |

**Anbieter:**
- Cloudflare Registrar
- Namecheap
- Domainfactory

**Danach:**
- DNS auf Tunnel/Server zeigen
- SSL automatisch via Cloudflare

---

### 7. STRIPE (Bezahlung - Optional)
| Status | ❌ Noch nicht eingerichtet |
|--------|--------------------------|
| **Was** | Zahlungsabwicklung für Beta-Zugang (29€) |
| **Kosten** | 1,4% + 0,25€ pro Transaktion |

**Nur nötig wenn:** Du den Beta-Zugang automatisch verkaufen willst
**Alternative:** Manuelle Rechnung + Überweisung

---

### 8. THREEMA (Messenger - Optional)
| Status | ❌ Noch nicht eingerichtet |
|--------|--------------------------|
| **Was** | Broadcast-Nachrichten an Beta-Tester |
| **Kosten** | ~300€/Jahr |

**Alternative:** Telegram-Gruppe (kostenlos)

---

## 🔵 OPTIONAL - KANN SPÄTER KOMMEN

### 9. MONITORING (Uptime Kuma + GlitchTip)
| Status | ⚠️ Config vorhanden |
|--------|--------------------|
| **Was** | Überwachung ob Portal online ist |
| **Kosten** | 0€ |

**Starten:**
```bash
docker-compose up uptime-kuma glitchtip -d
```

---

### 10. BACKUP-STRATEGIE
| Status | ❌ Noch nicht eingerichtet |
|--------|--------------------------|
| **Was** | Automatische Backups der Datenbank |

**Option A:** Supabase eigenes Backup (integriert)
**Option B:** Restic (Docker-Volume backup)

---

## 📋 GESAMT-CHECKLISTE

### Muss haben (Portal funktioniert nicht ohne):
- [ ] Supabase Account erstellt
- [ ] .env.local mit allen 3 Supabase-Werten
- [ ] Datenbank-Tabellen erstellt (SQL ausgeführt)
- [ ] Brevo Account + API-Key
- [ ] Cloudflare Tunnel läuft
- [ ] Build erfolgreich (`npm run build`)
- [ ] Server startet ohne Fehler

### Sollte haben (Empfohlen):
- [ ] Eigene Domain (statt Tunnel-Subdomain)
- [ ] Umami Analytics läuft
- [ ] .env.local Backup (sicherer Ort)
- [ ] SSL-Zertifikat (via Cloudflare)

### Optional (Kann später):
- [ ] Stripe für automatische Bezahlung
- [ ] Threema für Broadcast
- [ ] Uptime Monitoring
- [ ] Backup-Automatisierung

---

## 🚀 START-REIHENFOLGE (Schritt für Schritt)

**Tag 1 (60 Minuten):**
1. Supabase einrichten (15 min)
2. .env.local erstellen (5 min)
3. Datenbank-Tabellen erstellen (10 min)
4. Build testen (`npm run build`) (20 min)
5. Server starten (`npm start`) (5 min)
6. Test: http://localhost:3000 öffnen (5 min)

**Tag 2 (40 Minuten):**
1. Brevo einrichten (20 min)
2. Cloudflare Tunnel (15 min)
3. E-Mail-Versand testen (5 min)

**Tag 3 (Optional, 30 Minuten):**
1. Domain kaufen
2. Auf Server umstellen
3. SSL prüfen

---

## 💰 GESAMTKOSTEN PRO MONAT

| Phase | Kosten |
|-------|--------|
| **Start (nur Supabase Free)** | 0€ |
| **Mit Server (Hetzner CX11)** | 4,51€ |
| **Mit Domain** | +1€ |
| **Mit Brevo (kostenlos)** | +0€ |
| **Mit Threema** | +25€ |
| **Gesamt Minimum** | **4,51€/Monat** |

---

## 🆘 HILFE BEI PROBLEMEN

**Wenn etwas nicht klappt:**
1. Diese Checkliste nochmal prüfen
2. Fehlermeldung im Terminal lesen
3. Agent fragen: "Schritt X funktioniert nicht, Fehler: [Fehler einfügen]"

**Support:**
- E-Mail: info@pflegenavigatoreu.com
- Telegram: André Schulze

---

**Dokument erstellt:** 28. April 2026
**Nächste Überprüfung:** Nach Einrichtung aller Systeme
**Version:** 1.0
