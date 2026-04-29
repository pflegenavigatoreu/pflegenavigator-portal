# PflegeNavigator EU - Einrichtung (Tabellarisch)

**Datum:** 27.04.2026 | **Zeit:** 30-45 Min | **Support:** info@pflegenavigatoreu.com

---

## SCHRITT 1: Supabase Account (10 Min)

| # | Aktion | Wo / Wie | Ergebnis |
|---|--------|----------|----------|
| 1.1 | Website öffnen | https://supabase.com | Login-Seite |
| 1.2 | Anmelden | "Start your project" | Eingeloggt |
| 1.3 | Neues Projekt | "New Project" | Maske öffnet |
| 1.4 | Name eingeben | `pflegenavigator-eu` | Name gesetzt |
| 1.5 | Passwort wählen | Starkes PW (12+ Zeichen) | PW eingegeben |
| 1.6 | Region wählen | **Frankfurt (eu-central-1)** | DSGVO-konform |
| 1.7 | Tier wählen | Free | Kostenlos |
| 1.8 | Erstellen klicken | "Create new project" | Warten (2-3 Min) |
| 1.9 | Dashboard öffnen | Warte bis "Project is ready" | Dashboard sichtbar |

### 🔑 KEYS KOPIEREN (Dashboard → Project Settings → API)

| Variable | Wo | Wert (Beispiel) | In .env.local |
|----------|-----|-----------------|---------------|
| URL | Project URL | `https://abc123.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL=` |
| Anon Key | anon public | `eyJhbGc...` (lang) | `NEXT_PUBLIC_SUPABASE_ANON_KEY=` |
| Service Key | service_role | `eyJhbGc...` (länger) | `SUPABASE_SERVICE_ROLE_KEY=` |

**⚠️ Wichtig:** Service Key niemals teilen! In Passwort-Manager speichern!

---

## SCHRITT 2: .env.local Datei (5 Min)

### Terminal:
```bash
cd /data/.openclaw/workspace
nano .env.local
```

### Inhalt einfügen:
```bash
# Supabase (Werte aus Schritt 1 einsetzen!)
NEXT_PUBLIC_SUPABASE_URL=https://DEINE-URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...DEIN-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...DEIN-SERVICE-KEY

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional später:
# CLOUDFLARE_TUNNEL_TOKEN=eyJhbG...
```

### Speichern:
| Taste | Aktion |
|-------|--------|
| `Strg+O` | Speichern |
| `Enter` | Bestätigen |
| `Strg+X` | Beenden |

---

## SCHRITT 3: SQL-Datenbank (5 Min)

| # | Aktion | Wo | Detail |
|---|--------|-----|--------|
| 3.1 | SQL Editor öffnen | Dashboard → SQL Editor | Editor sichtbar |
| 3.2 | Neue Query | "New Query" | Leeres Feld |
| 3.3 | SQL kopieren | Siehe unten | Code eingefügt |
| 3.4 | Ausführen | "Run" oder ▶️ | Warten |
| 3.5 | Erfolg prüfen | "Success" muss erscheinen | ✅ |

### SQL-Code (komplett kopieren):
```sql
-- Tabellen erstellen
CREATE TABLE cases (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, case_code TEXT UNIQUE NOT NULL, status TEXT DEFAULT 'draft', created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(), care_level_guess INTEGER, module_count INTEGER DEFAULT 0);

CREATE TABLE answers (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, case_id UUID REFERENCES cases(id) ON DELETE CASCADE, module_number INTEGER NOT NULL, module_name TEXT NOT NULL, answers JSONB NOT NULL, completed_at TIMESTAMP DEFAULT NOW(), created_at TIMESTAMP DEFAULT NOW(), UNIQUE(case_id, module_number));

CREATE TABLE diary_entries (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, case_id UUID REFERENCES cases(id) ON DELETE CASCADE, entry_date DATE NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE modules (id SERIAL PRIMARY KEY, module_number INTEGER UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT, estimated_duration_minutes INTEGER, is_active BOOLEAN DEFAULT true, sgb_coverage TEXT[]);

-- Funktion für Fall-Codes
CREATE OR REPLACE FUNCTION create_case() RETURNS JSON AS $$ DECLARE new_code TEXT; new_id UUID; BEGIN new_code := 'PF-' || upper(substring(md5(random()::text), 1, 6)); WHILE EXISTS (SELECT 1 FROM cases WHERE case_code = new_code) LOOP new_code := 'PF-' || upper(substring(md5(random()::text), 1, 6)); END LOOP; INSERT INTO cases (case_code) VALUES (new_code) RETURNING id INTO new_id; RETURN json_build_object('id', new_id, 'case_code', new_code); END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Module einfügen
INSERT INTO modules (module_number, name, description, estimated_duration_minutes, sgb_coverage) VALUES (1, 'Mobilität', 'Bewegung im Alltag', 5, ARRAY['SGB XI', 'SGB V']), (2, 'Kognitive Funktionen', 'Geistige Fähigkeiten', 5, ARRAY['SGB XI']), (3, 'Verhalten', 'Psychische Verhaltensweisen', 5, ARRAY['SGB XI']), (4, 'Krankheitsbilder', 'Medizinische Diagnosen', 5, ARRAY['SGB XI', 'SGB V']), (5, 'Behandlung', 'Therapien und Pflege', 5, ARRAY['SGB XI', 'SGB V']), (6, 'Selbstständigkeit', 'Alltagsbewältigung', 5, ARRAY['SGB XI']);

-- Sicherheit (RLS)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous case access" ON cases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous answers access" ON answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous diary access" ON diary_entries FOR ALL USING (true) WITH CHECK (true);
```

---

## SCHRITT 4: Build & Start (10 Min)

| # | Befehl | Terminal | Erwartet |
|---|--------|----------|----------|
| 4.1 | `cd /data/.openclaw/workspace` | Eingeben | Im richtigen Ordner |
| 4.2 | `npm install` | Eingeben | Dependencies installiert |
| 4.3 | `npm run build` | Eingeben | Build erfolgreich ✅ |
| 4.4 | `npm start` | Eingeben | Server läuft |
| 4.5 | Browser öffnen | http://localhost:3000 | Portal sichtbar |

### Build-Erfolg prüfen:
```
✓ Linting and checking validity of types  
✓ Collecting page data  
✓ Generating static pages  
✓ Finalizing page optimization
```

### Funktions-Test:
| Test | URL / Aktion | Erwartetes Ergebnis |
|------|--------------|---------------------|
| Startseite | `/` | Seite lädt |
| Pflegegrad | `/pflegegrad/start` | Modul 1 sichtbar |
| Neuer Fall | Button klicken | Code erscheint (PF-...) |
| QR-Code | Anzeigen lassen | QR wird generiert |
| Tagebuch | `/tagebuch` | Seite lädt |

---

## SCHRITT 5: Cloudflare Tunnel (Optional, 10 Min)

**Nur wenn externer Zugriff (Handy) gewünscht!**

| # | Aktion | URL / Befehl | Ergebnis |
|---|--------|--------------|----------|
| 5.1 | Cloudflare öffnen | https://dash.cloudflare.com | Eingeloggt |
| 5.2 | Zero Trust → Networks → Tunnels | Menü | Tunnel-Seite |
| 5.3 | "Create a tunnel" | Klicken | Wizard öffnet |
| 5.4 | Name: `pflegenavigator-eu` | Eingeben | Name gesetzt |
| 5.5 | Cloudflared wählen | Auswählen | Docker-Option |
| 5.6 | Token kopieren | Kopieren-Button | Token in Zwischenablage |
| 5.7 | Token speichern | In `.env.local` eintragen | `CLOUDFLARE_TUNNEL_TOKEN=...` |
| 5.8 | Tunnel starten | `docker run --net=host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token=DEIN-TOKEN` | Läuft... |
| 5.9 | URL notieren | Aus Terminal kopieren | `https://pflegenavigator-eu-xxx.trycloudflare.com` |
| 5.10 | APP_URL ändern | In `.env.local`: `NEXT_PUBLIC_APP_URL=https://...` | Gespeichert |
| 5.11 | Neu starten | `Strg+C` dann `npm start` | Portal läuft |
| 5.12 | Test | URL im Browser + QR scannen | Funktioniert! |

---

## ✅ FINALE CHECKLISTE

### Muss funktionieren:
| # | Check | Status |
|---|-------|--------|
| ⬜ | Supabase-Account erstellt | |
| ⬜ | `.env.local` mit allen Werten | |
| ⬜ | SQL-Tabellen erstellt | |
| ⬜ | `npm run build` erfolgreich | |
| ⬜ | Server läuft auf localhost:3000 | |
| ⬜ | Fall-Code wird erstellt (PF-...) | |
| ⬜ | QR-Code wird generiert | |
| ⬜ | Daten werden gespeichert | |

### Optional (Empfohlen):
| # | Check | Status |
|---|-------|--------|
| ⬜ | Cloudflare Tunnel läuft | |
| ⬜ | Öffentliche URL erreichbar | |
| ⬜ | QR-Code scannen funktioniert | |
| ⬜ | Mobile-Ansicht getestet | |
| ⬜ | `.env.local` gesichert (Backup) | |
| ⬜ | Supabase-Keys im Passwort-Manager | |

---

## 🔧 FEHLERBEHEBUNG

| Problem | Lösung |
|---------|--------|
| Supabase Connection Failed | URL prüfen (https://), Keys nicht vertauscht? |
| Build Error | `rm -rf .next node_modules && npm install && npm run build` |
| Port 3000 belegt | `PORT=3001 npm start` |
| QR-Code funktioniert nicht | `NEXT_PUBLIC_APP_URL` in `.env.local` prüfen |
| Tunnel startet nicht | Token korrrekt kopiert? Docker läuft? |

---

## 📞 SUPPORT

**Bei Problemen:**
- Diese Tabelle prüfen
- Terminal-Fehlermeldung lesen
- E-Mail: info@pflegenavigatoreu.com

**Dokumente:**
- Detaillierte Anleitung: `ADMIN_TODO_WEITERLEITBAR.md`
- Technische Doku: `PORTAL_DOKUMENTATION_FINAL.md`
- Zusammenfassung: `ZUSAMMENFASSUNG_ALLES_FERTIG.md`

---

**© 2026 PflegeNavigator EU gUG | Heeper Straße 205 | 33607 Bielefeld**

*Version 1.0 | 27. April 2026*
