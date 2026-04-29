# PflegeNavigator EU - Einrichtungs-Checkliste

**Projekt:** PflegeNavigator EU Portal  
**Datum:** 27. April 2026  
**Version:** 1.0 - Final  
**Status:** Bereit zur Einrichtung

---

## Überblick

Diese Checkliste führt Sie Schritt für Schritt durch die Einrichtung des PflegeNavigator EU Portals. Das Portal wurde vollständig entwickelt und ist bereit für den Echtbetrieb.

**Geschätzte Zeit:** 30-45 Minuten  
**Schwierigkeit:** Mittel (Anleitung befolgen)  
**Support:** Bei Fragen info@pflegenavigatoreu.com

---

## Voraussetzungen

- [ ] Server/Computer mit Ubuntu/Linux oder macOS
- [ ] Node.js 18+ installiert (`node --version`)
- [ ] npm installiert (`npm --version`)
- [ ] Docker installiert (optional, für Cloudflare Tunnel)
- [ ] Internetzugang
- [ ] E-Mail-Zugang (für Registrierungen)

---

## Schritt 1: Supabase Einrichten (10 Min)

### 1.1 Account erstellen
- [ ] Gehe zu https://supabase.com
- [ ] Klicke "Start your project"
- [ ] Melde dich mit GitHub oder E-Mail an
- [ ] Warte auf Bestätigungs-E-Mail
- [ ] Einloggen

### 1.2 Projekt erstellen
- [ ] "New Project" klicken
- [ ] Organization auswählen (oder neue erstellen)
- [ ] Project Name: `pflegenavigator-eu`
- [ ] Database Password: **Starkes Passwort wählen!** (min. 12 Zeichen, Buchstaben + Zahlen + Sonderzeichen)
- [ ] Region: **Frankfurt (eu-central-1)** ← WICHTIG für DSGVO!
- [ ] Pricing Tier: Free (für Start ausreichend)
- [ ] "Create new project" klicken
- [ ] Warten bis "Your project is ready" erscheint (2-3 Minuten)

### 1.3 API-Keys kopieren
Gehe zu: Project Settings → API

**Diese 3 Werte kopieren und sicher speichern:**

```
1. Project URL:
   https://[DEIN-PROJECT].supabase.co

2. anon public:
   eyJhbG...
   (langer String, beginnt mit eyJ)

3. service_role secret:
   eyJhbG...
   (NOCH längerer String - GEHEIM HALTEN!)
```

**Sicherheitshinweis:**  
- Service Role Key niemals öffentlich teilen!  
- In Passwort-Manager speichern!  
- Anon Key ist für das Frontend (weniger kritisch)

---

## Schritt 2: Umgebungsvariablen Setzen (5 Min)

### 2.1 Datei erstellen
```bash
# Terminal öffnen
cd /data/.openclaw/workspace

# Datei erstellen
nano .env.local
```

### 2.2 Werte eintragen
Folgenden Text einfügen und **DEINE Werte** einsetzen:

```bash
# ============================================
# SUPABASE (Werte aus Schritt 1!)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://[DEINE-URL].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...[DEIN-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...[DEIN-SERVICE-KEY]

# ============================================
# APP URL (wichtig für QR-Codes!)
# ============================================
# Lokal erstmal:
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Später mit Cloudflare Tunnel:
# NEXT_PUBLIC_APP_URL=https://deine-url.trycloudflare.com

# ============================================
# CLOUDFLARE TUNNEL (optional, siehe Schritt 5)
# ============================================
# CLOUDFLARE_TUNNEL_TOKEN=eyJhbG...

# ============================================
# E-MAIL (optional)
# ============================================
# RESEND_API_KEY=re_...
# EMAIL_FROM=info@pflegenavigatoreu.com
```

### 2.3 Speichern
```
Strg+O (Speichern)
Enter (Bestätigen)
Strg+X (Beenden)
```

**Prüfung:** Datei existiert mit `ls -la .env.local`

---

## Schritt 3: Datenbank-Tabellen Erstellen (5 Min)

### 3.1 SQL Editor öffnen
- [ ] Im Supabase Dashboard: "SQL Editor" (oben)
- [ ] "New Query"
- [ ] Name: "Initial Setup"

### 3.2 SQL-Code ausführen
Folgenden Code **komplett kopieren und einfügen**:

```sql
-- ============================================
-- PFLEGENAVIGATOR EU - DATENBANK-SETUP
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
  new_code := 'PF-' || upper(substring(md5(random()::text), 1, 6));
  
  WHILE EXISTS (SELECT 1 FROM cases WHERE case_code = new_code) LOOP
    new_code := 'PF-' || upper(substring(md5(random()::text), 1, 6));
  END LOOP;
  
  INSERT INTO cases (case_code) 
  VALUES (new_code) 
  RETURNING id INTO new_id;
  
  RETURN json_build_object('id', new_id, 'case_code', new_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. INITIALE MODULE
INSERT INTO modules (module_number, name, description, estimated_duration_minutes, sgb_coverage) VALUES
(1, 'Mobilität', 'Bewegung und Fortbewegung im Alltag', 5, ARRAY['SGB XI', 'SGB V']),
(2, 'Kognitive Funktionen', 'Geistige Fähigkeiten und Orientierung', 5, ARRAY['SGB XI']),
(3, 'Verhalten', 'Psychische Verhaltensweisen', 5, ARRAY['SGB XI']),
(4, 'Krankheitsbilder', 'Medizinische Diagnosen und Zustände', 5, ARRAY['SGB XI', 'SGB V']),
(5, 'Behandlung', 'Therapien und Pflege', 5, ARRAY['SGB XI', 'SGB V']),
(6, 'Selbstständigkeit', 'Alltagsbewältigung', 5, ARRAY['SGB XI']);

-- 7. SICHERHEIT: RLS AKTIVIEREN
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

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

- [ ] "Run" oder ▶️ klicken
- [ ] Warten bis "Success" erscheint
- [ ] Prüfen: Table Editor zeigt Tabellen an

---

## Schritt 4: Build & Server Start (10 Min)

### 4.1 Dependencies installieren (falls nötig)
```bash
cd /data/.openclaw/workspace

# Falls noch nicht gemacht:
npm install

# Oder bei Problemen:
npm install --legacy-peer-deps
```

### 4.2 Build erstellen
```bash
npm run build
```

**Erwartetes Ergebnis:**
```
✓ Linting and checking validity of types  
✓ Collecting page data  
✓ Generating static pages  
✓ Finalizing page optimization

Build Successful!
```

### 4.3 Server starten
```bash
# Produktion:
npm start

# ODER Entwicklung (mit Auto-Reload):
npm run dev
```

**Server läuft auf:** http://localhost:3000

### 4.4 Testen
- [ ] Browser öffnen: http://localhost:3000
- [ ] Startseite sollte erscheinen
- [ ] Navigation sollte funktionieren
- [ ] "Pflegegrad berechnen" klicken
- [ ] "Neuen Fall starten" klicken
- [ ] **Fall-Code sollte erscheinen** (z.B. PF-A3F7B2)
- [ ] **QR-Code sollte generiert werden**

**Wenn das funktioniert: ALLES RICHTIG!** ✅

---

## Schritt 5: Cloudflare Tunnel (Optional, 10 Min)

**Nur nötig wenn externer Zugriff gewünscht (Handy, andere Geräte)**

### 5.1 Account erstellen
- [ ] https://dash.cloudflare.com → Anmelden oder registrieren
- [ ] Bestätigungs-E-Mail abwarten

### 5.2 Tunnel erstellen
- [ ] Zero Trust → Networks → Tunnels
- [ ] "Create a tunnel"
- [ ] Choose Cloudflared
- [ ] Name: `pflegenavigator-eu`
- [ ] "Save tunnel"
- [ ] **Token kopieren** (langer String, beginnt mit eyJh...)

### 5.3 Token speichern
In `.env.local` eintragen:
```bash
CLOUDFLARE_TUNNEL_TOKEN=eyJhbGc...[DEIN-TOKEN]
```

### 5.4 Tunnel starten
```bash
# Im Terminal:
docker run --net=host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token=eyJhbGc...[DEIN-TOKEN]

# Warten bis erscheint:
# "Tunnel established"
# "Your tunnel is running"
```

### 5.5 URL notieren
```
🌐 Öffentliche URL:
https://pflegenavigator-eu-xxx123.trycloudflare.com
```

### 5.6 APP_URL aktualisieren
In `.env.local`:
```bash
# Alte Zeile auskommentieren:
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Neue Zeile:
NEXT_PUBLIC_APP_URL=https://pflegenavigator-eu-xxx123.trycloudflare.com
```

### 5.7 Neu starten
```bash
Strg+C (Server stoppen)
npm start
```

### 5.8 Testen
- [ ] URL im Browser öffnen
- [ ] Fall erstellen
- [ ] QR-Code mit Handy scannen
- [ ] Portal sollte auf Handy öffnen!

---

## Finale Prüfung

### Funktions-Test
| Test | Erwartet | Ergebnis |
|------|----------|----------|
| Startseite lädt | Ja | ⬜ |
| Navigation funktioniert | Ja | ⬜ |
| Neuer Fall erstellbar | Code erscheint | ⬜ |
| QR-Code generiert | Ja | ⬜ |
| Daten werden gespeichert | Ja | ⬜ |
| Mobile-Ansicht OK | Ja | ⬜ |

### Sicherheit
- [ ] `.env.local` ist erstellt
- [ ] Supabase-Keys sind gespeichert (Passwort-Manager)
- [ ] Service Role Key ist geheim
- [ ] RLS ist aktiviert in Supabase

### Backup
- [ ] `.env.local` kopiert (sicherer Ort)
- [ ] Supabase-Dashboard-Zugang gespeichert
- [ ] Cloudflare-Zugang gespeichert (falls verwendet)

---

## Fehlerbehebung

### "Supabase connection failed"
- Prüfen: URL richtig? (mit https://)
- Prüfen: Keys nicht vertauscht?
- Prüfen: Projekt existiert in Supabase?

### "Build error"
```bash
rm -rf .next node_modules
npm install
npm run build
```

### "Port 3000 already in use"
```bash
# Anderen Port verwenden:
PORT=3001 npm start
```

### "QR-Code funktioniert nicht"
- Prüfen: `NEXT_PUBLIC_APP_URL` in `.env.local`
- Prüfen: Tunnel läuft (docker ps)
- Prüfen: URL im Browser erreichbar?

---

## Support

**Bei Problemen:**
- Diese Checkliste nochmals prüfen
- Terminal-Fehlermeldung lesen
- E-Mail an: info@pflegenavigatoreu.com

**Dokumentation:**
- Portal-Doku: `/data/.openclaw/workspace/PORTAL_DOKUMENTATION_FINAL.md`
- Zusammenfassung: `/data/.openclaw/workspace/ZUSAMMENFASSUNG_ALLES_FERTIG.md`

---

## Nach der Einrichtung

**Das Portal ist dann LIVE unter:**
- Lokal: http://localhost:3000
- Extern: https://deine-url.trycloudflare.com (mit Tunnel)

**Funktionen:**
- ✅ Pflegegrad-Rechner (6 Module)
- ✅ Fall-Codes mit QR-Code-Zugriff
- ✅ Tagebuch-Funktion
- ✅ 35 Sprachen
- ✅ Avatar-Chat mit Sprachausgabe
- ✅ PDF-Generierung
- ✅ Widerspruchs-Briefe
- ✅ Notfall-Seite
- ✅ Presseportal

---

**© 2026 PflegeNavigator EU gUG**  
Heeper Straße 205, 33607 Bielefeld  
info@pflegenavigatoreu.com

---

*Checkliste erstellt am 27. April 2026*  
*Version 1.0 - Final*
