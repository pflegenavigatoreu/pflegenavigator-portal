# ✅ ADMIN CHECKLISTE KOMPLETT
# PflegeNavigator EU Portal - Finale Einrichtung

**Datum:** 27. April 2026, 22:25 Uhr  
**Status:** Portal gebaut - Nur noch Konfiguration nötig  
**Ziel:** Portal mit QR-Code/Barcode ERREICHBAR machen

---

## 🚨 WICHTIG - DIES MUSS ALLES GEMACHT WERDEN!

### REIHENFOLGE BEACHTEN:
1. Supabase einrichten (Datenbank)
2. Umgebungsvariablen setzen
3. Datenbank-Tabellen erstellen
4. Build testen
5. Server starten
6. QR-Code/Cloudflare Tunnel (optional)

---

## ✅ SCHRITT 1: SUPABASE EINRICHTEN (Kritisch!)

### Warum:
Ohne Supabase funktionieren:
- ❌ Fall-Codes nicht speicherbar
- ❌ Tagebuch nicht speicherbar
- ❌ QR-Codes funktionieren nicht richtig
- ❌ Nutzerdaten gehen verloren

### Ablauf:

#### 1.1 Account erstellen (10 Minuten)
```
1. Gehe zu: https://supabase.com
2. Klicke "Start your project"
3. Melde dich mit GitHub oder Email an
4. Wähle: "New Project"
```

#### 1.2 Projekt erstellen
```
Organization: (Dein Name oder "PflegeNavigator")
Project Name: pflegenavigator-eu
Database Password: [STARKES Passwort!]
Region: Frankfurt (eu-central-1) ← WÄHLEN!
Pricing Tier: Free (reicht für Start)
```

#### 1.3 Warten (2-3 Minuten)
- "Setting up your database..."
- Warte bis "Project is ready" erscheint

#### 1.4 API-Keys holen
```
Links im Menü: Project Settings → API

Kopiere diese 3 Werte:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Project URL:
   https://xyz123abc456.supabase.co

2. anon public:
   eyJhbG... (langer String)

3. service_role secret:
   eyJhbG... (NOCH längerer String)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**SICHERHEIT:**
- service_role niemals im Browser/Frontend verwenden!
- Speichere Keys in Passwort-Manager!

---

## ✅ SCHRITT 2: UMGEBUNGSVARIABLEN SETZEN

### 2.1 .env.local Datei erstellen

```bash
# Terminal öffnen:
cd /data/.openclaw/workspace

# Datei erstellen:
nano .env.local
```

### 2.2 Diese Werte eintragen:

```bash
# ============================================
# SUPABASE (Diese Werte von Schritt 1!)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://DEINE-URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...DEIN-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...DEIN-SERVICE-KEY

# ============================================
# QR-CODE / MAGIC LINKS (Wichtig für Barcodes!)
# ============================================
# Lokal: http://localhost:3000
# Tunnel: https://deine-url.trycloudflare.com
# Domain: https://pflegenavigatoreu.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# ANALYTICS (Optional - kannst du überspringen)
# ============================================
NEXT_PUBLIC_UMAMI_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=

# ============================================
# E-MAIL (Optional - für Magic Link Versand)
# ============================================
RESEND_API_KEY=
EMAIL_FROM=info@pflegenavigatoreu.com

# ============================================
# CLOUDFLARE TUNNEL (Optional - für externen Zugriff)
# ============================================
CLOUDFLARE_TUNNEL_TOKEN=
```

### 2.3 Speichern
```
Strg+O (Speichern)
Enter (Bestätigen)
Strg+X (Beenden)
```

---

## ✅ SCHRITT 3: DATENBANK-TABELLEN ERSTELLEN

### 3.1 SQL Editor öffnen
```
Im Supabase Dashboard:
→ Table Editor
→ SQL Editor (oben rechts)
→ "New Query"
```

### 3.2 SQL ausführen

Kopiere DIESEN Code und führe ihn aus:

```sql
-- ============================================
-- TABELLEN FÜR PFLEGENAVIGATOR EU
-- ============================================

-- 1. FÄLLE / TRIAGE
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  care_level_guess INTEGER,
  module_count INTEGER DEFAULT 0
);

-- 2. ANTWORTEN
CREATE TABLE answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL,
  module_name TEXT NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(case_id, module_number)
);

-- 3. TAGEBUCHEINTRÄGE
CREATE TABLE diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. MODULE
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  module_number INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  estimated_duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  sgb_coverage TEXT[]
);

-- 5. FUNKTION: Fall-Code generieren
CREATE OR REPLACE FUNCTION create_case()
RETURNS JSON AS $$
DECLARE
  new_code TEXT;
  new_id UUID;
BEGIN
  -- Generiere 8-stelligen Code (z.B. PF-A3F7B2)
  new_code := 'PF-' || upper(substring(md5(random()::text), 1, 6));
  
  -- Prüfe ob Code existiert
  WHILE EXISTS (SELECT 1 FROM cases WHERE case_code = new_code) LOOP
    new_code := 'PF-' || upper(substring(md5(random()::text), 1, 6));
  END LOOP;
  
  -- Erstelle Fall
  INSERT INTO cases (case_code) 
  VALUES (new_code) 
  RETURNING id INTO new_id;
  
  RETURN json_build_object('id', new_id, 'case_code', new_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. INITIALE MODULE EINFÜGEN
INSERT INTO modules (module_number, name, description, estimated_duration_minutes, sgb_coverage) VALUES
(1, 'Mobilität', 'Bewegung und Fortbewegung im Alltag', 5, ARRAY['SGB XI', 'SGB V']),
(2, 'Kognitive Funktionen', 'Geistige Fähigkeiten und Orientierung', 5, ARRAY['SGB XI']),
(3, 'Verhalten', 'Psychische Verhaltensweisen', 5, ARRAY['SGB XI']),
(4, 'Krankheitsbilder', 'Medizinische Diagnosen und Zustände', 5, ARRAY['SGB XI', 'SGB V']),
(5, 'Behandlung', 'Therapien und Pflege', 5, ARRAY['SGB XI', 'SGB V']),
(6, 'Selbstständigkeit', 'Alltagsbewältigung', 5, ARRAY['SGB XI']);

-- ============================================
-- SICHERHEIT: RLS (Row Level Security)
-- ============================================

-- Aktiviere RLS für alle Tabellen
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Erlaube anonymen Zugriff (weil Fall-Codes als "Passwort" dienen)
CREATE POLICY "Allow anonymous case access" ON cases
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous answers access" ON answers
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous diary access" ON diary_entries
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- FERTIG!
-- ============================================
```

### 3.3 Ausführen
```
Klicke: "Run" oder "▶️"
Warte auf "Success"
```

### 3.4 Prüfen
```
Table Editor → Tabellen sollten angezeigt werden:
- cases
- answers
- diary_entries
- modules
```

---

## ✅ SCHRITT 4: BUILD TESTEN

### 4.1 Build starten
```bash
# Terminal:
cd /data/.openclaw/workspace

# Dependencies prüfen (falls nötig):
npm install

# Build:
npm run build
```

### 4.2 Erwartetes Ergebnis
```
✓ Linting and checking validity of types  
✓ Collecting page data  
✓ Generating static pages (xx/xx)
✓ Finalizing page optimization

Build Successful!
```

### 4.3 Falls Fehler:
```
Fehler lesen → mir schicken (OpenClaw Agent)
Oder: npm install --legacy-peer-deps
```

---

## ✅ SCHRITT 5: SERVER STARTEN

### 5.1 Starten
```bash
# Produktion:
npm start

# ODER Entwicklung (mit Live-Reload):
npm run dev
```

### 5.2 Prüfen
```
Im Browser öffnen:
http://localhost:3000

Sollte anzeigen:
- PflegeNavigator EU Startseite
- Navigation oben
- Alle Buttons funktionieren
```

### 5.3 Test: Fall erstellen
```
1. Klicke: "Pflegegrad berechnen"
2. Klicke: "Neuen Fall starten"
3. Fall-Code sollte erscheinen (z.B. PF-A3F7B2)
4. QR-Code sollte generiert werden
```

---

## ✅ SCHRITT 6: QR-CODE / BARCODE / EXTERNER ZUGRIFF

### Option A: Cloudflare Tunnel (Empfohlen!)

#### 6.1 Tunnel erstellen
```
1. Gehe zu: https://dash.cloudflare.com
2. Melde dich an (oder neu registrieren)
3. Links: Zero Trust → Networks → Tunnels
4. "Create a tunnel"
5. Choose Cloudflared
6. Docker auswählen
7. Name: pflegenavigator-eu
8. Klicke: "Save tunnel"
9. Token kopieren (langer String)
```

#### 6.2 Token speichern
```bash
# In .env.local eintragen:
CLOUDFLARE_TUNNEL_TOKEN=eyJh...DEIN-TOKEN
```

#### 6.3 Tunnel starten
```bash
# Terminal:
docker run --net=host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token=DEIN-TOKEN

# ODER mit docker-compose:
docker-compose up cloudflare-tunnel
```

#### 6.4 URL bekommen
```
Terminal zeigt:
✓ Tunnel established
🌐 https://pflegenavigator-eu-abc123.trycloudflare.com

Diese URL kopieren!
```

#### 6.5 In .env.local eintragen
```bash
NEXT_PUBLIC_APP_URL=https://pflegenavigator-eu-abc123.trycloudflare.com
```

#### 6.6 Neu starten
```bash
Strg+C (Server stoppen)
npm start
```

#### 6.7 QR-Code testen
```
1. Browser: https://pflegenavigator-eu-abc123.trycloudflare.com
2. Neuen Fall erstellen
3. QR-Code generieren lassen
4. Mit Handy scannen → Sollte funktionieren!
```

---

### Option B: Eigene Domain (Fortgeschritten)

Falls du eigene Domain hast:
```
1. Domain bei Cloudflare oder anderen kaufen
2. DNS A-Record auf deine IP setzen
3. SSL automatisch via Cloudflare
4. NEXT_PUBLIC_APP_URL=https://deinedomain.de
```

---

## ✅ SCHRITT 7: ALLES TESTEN

### 7.1 Funktions-Checkliste

| Test | Wie | Erwartet |
|------|-----|----------|
| Startseite | http://localhost:3000 | Zeigt Startseite |
| Navigation | Oben klicken | Alle Links gehen |
| Pflegegrad | /pflegegrad/start | Modul 1 lädt |
| Neuer Fall | "Neu starten" klicken | Code erscheint (PF-...) |
| QR-Code | Code anzeigen lassen | QR wird generiert |
| Scannen | Handy auf QR | Portal öffnet sich |
| Tagebuch | /tagebuch | Seite lädt |
| Notfall | /notfall | Notfall-Nummern |
| Sprache | Flagge klicken | Wechselt Sprache |

### 7.2 Mobile Test
```
1. Handy-Browser öffnen
2. URL eingeben (Tunnel-URL oder localhost)
3. Prüfen: Navigation passt sich an?
4. Buttons sind klickbar?
```

---

## ✅ SCHRITT 8: BACKUP & SICHERUNG

### 8.1 .env.local sichern
```bash
# Kopiere .env.local an sicheren Ort:
cp .env.local ~/Documents/pflegenavigator-env-backup.txt

# ODER in Passwort-Manager speichern!
```

### 8.2 Supabase-Keys sichern
```
1. Passwort-Manager öffnen
2. Neuer Eintrag: "PflegeNavigator EU - Supabase"
3. Alle 3 Keys + URL speichern
4. Master-Passwort nicht vergessen!
```

---

## 🚨 PROBLEME & LÖSUNGEN

### Problem: "Supabase connection failed"
```
Lösung:
1. .env.local prüfen - URL richtig?
2. Keys nicht vertauscht?
3. Projekt in Supabase existiert?
4. Netzwerkverbindung OK?
```

### Problem: "Build error"
```
Lösung:
1. npm install
2. rm -rf .next && npm run build
3. Fehlermeldung an mich schicken
```

### Problem: "QR-Code funktioniert nicht"
```
Lösung:
1. NEXT_PUBLIC_APP_URL in .env.local prüfen
2. Tunnel läuft? (docker ps)
3. URL in Browser testen
4. Neu starten nach Änderung
```

### Problem: "Fall wird nicht gespeichert"
```
Lösung:
1. Supabase Tabellen prüfen (existieren?)
2. RLS aktiviert? (Policies)
3. Browser-Konsole prüfen (F12)
4. Netzwerk-Tab prüfen
```

---

## 📋 FINALE CHECKLISTE

### Muss haben (Portal funktioniert nicht ohne):
- [ ] Supabase-Account erstellt
- [ ] .env.local mit allen Werten
- [ ] Datenbank-Tabellen erstellt
- [ ] Build erfolgreich
- [ ] Server läuft auf localhost:3000
- [ ] Fall-Code kann erstellt werden
- [ ] Daten werden gespeichert

### Sollte haben (Empfohlen):
- [ ] Cloudflare Tunnel läuft
- [ ] QR-Code funktioniert
- [ ] Mobile-Ansicht getestet
- [ ] .env.local gesichert
- [ ] Supabase-Keys gesichert

### Optional (Kann später):
- [ ] Eigene Domain
- [ ] Umami Analytics
- [ ] E-Mail-Versand
- [ ] Uptime Monitoring

---

## 🎉 NACH DER EINRICHTUNG

**Wenn alle Checkboxen oben angehakt:**

### QR-Codes funktionieren!
```
1. Nutzer geht auf Portal
2. Erstellt Fall
3. QR-Code wird generiert
4. QR-Code scannen = Direktzugriff auf Fall
5. ODER: Link kopieren und teilen
```

### Portal ist LIVE!
```
- Via localhost (nur du)
- Via Tunnel (alle mit Link)
- Via Domain (wenn du eine hast)
```

---

## 📞 HILFE

**Wenn etwas nicht klappt:**
1. Diese Checkliste nochmal prüfen
2. Fehlermeldung lesen
3. Terminal-Output prüfen
4. Mich fragen: "Schritt X funktioniert nicht..."

**Ich helfe dir!** 💪

---

*Dokument erstellt von OpenClaw Agent*  
*PflegeNavigator EU - Finale Einrichtung*  
*27. April 2026*
