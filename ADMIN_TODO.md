# 🔧 ADMIN_TODO - Finale Einrichtung

**Datum:** 27. April 2026
**Status:** Portal gebaut - Nur noch finale Konfiguration nötig

---

## 🚨 WICHTIG - DIES MUSS FRANK SELBST MACHEN:

### 1. SUPABASE EINRICHTEN (Kritisch!)

**Warum:** Ohne Supabase funktioniert das Fall-Management nicht!

**Schritte:**
```
1. Gehe zu: https://supabase.com
2. Erstelle neuen Account (kostenlos: 500MB, 2GB Traffic)
3. Create New Project
4. Project Name: "pflegenavigator-eu"
5. Database Password: Starkes Passwort wählen!
6. Region: Frankfurt (eu-central-1) ← WICHTIG für DSGVO!
7. Warte bis Projekt bereit ist (2-3 Minuten)
```

**Danach:**
```
Settings → API → Project URL kopieren
Settings → API → Project API Keys → anon public kopieren
Settings → API → Project API Keys → service_role secret kopieren
```

**In .env.local eintragen:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xyz123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

---

### 2. DATENBANK-TABELLEN ERSTELLEN

**In Supabase SQL Editor ausführen:**

```sql
-- Fälle/Triage
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  care_level_guess INTEGER,
  module_count INTEGER DEFAULT 0
);

-- Antworten
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

-- Tagebucheinträge
CREATE TABLE diary_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Module
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  module_number INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  estimated_duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  sgb_coverage TEXT[]
);

-- Funktion für Fall-Codes
CREATE OR REPLACE FUNCTION create_case()
RETURNS JSON AS $$
DECLARE
  new_code TEXT;
  new_id UUID;
BEGIN
  -- Generiere 8-stelligen Code
  new_code := upper(substring(md5(random()::text), 1, 8));
  
  -- Prüfe ob Code existiert
  WHILE EXISTS (SELECT 1 FROM cases WHERE case_code = new_code) LOOP
    new_code := upper(substring(md5(random()::text), 1, 8));
  END LOOP;
  
  -- Erstelle Fall
  INSERT INTO cases (case_code) 
  VALUES (new_code) 
  RETURNING id INTO new_id;
  
  RETURN json_build_object('id', new_id, 'case_code', new_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initial Module einfügen
INSERT INTO modules (module_number, name, description, estimated_duration_minutes, sgb_coverage) VALUES
(1, 'Mobilität', 'Bewegung im Alltag', 5, ARRAY['SGB XI', 'SGB V']),
(2, 'Kognitive Funktionen', 'Geistige Fähigkeiten', 5, ARRAY['SGB XI']),
(3, 'Verhalten', 'Psychische Verhaltensweisen', 5, ARRAY['SGB XI']),
(4, 'Krankheitsbilder', 'Medizinische Diagnosen', 5, ARRAY['SGB XI', 'SGB V']),
(5, 'Behandlung', 'Therapien und Pflege', 5, ARRAY['SGB XI', 'SGB V']),
(6, 'Selbstständigkeit', 'Alltagsbewältigung', 5, ARRAY['SGB XI']);
```

---

### 3. RLS (ROW LEVEL SECURITY) AKTIVIEREN

**In Supabase:**
```
Database → Tables → cases → RLS
"Enable RLS for this table" → AN

Policies → New Policy:
- Name: "Allow anonymous access"
- Target roles: anon
- Using expression: true
- With check expression: true
```

**Für alle Tabellen wiederholen:**
- cases
- answers
- diary_entries

---

### 4. SERVER STARTEN

**Voraussetzung:** .env.local ist fertig!

```bash
# In Terminal:
cd /data/.openclaw/workspace

# Build erstellen
npm run build

# Starten
npm start

# ODER Entwicklung:
npm run dev
```

**Test:** http://localhost:3000

---

### 5. CLOUDFLARE TUNNEL (Für externes Teilen)

**Wenn du möchtest, dass andere von außen zugreifen:**

```bash
# 1. Cloudflare anmelden/Account erstellen
# 2. Zero Trust → Networks → Tunnels → Create a tunnel
# 3. Choose Cloudflared → Docker
# 4. Tunnel-Token kopieren

# 5. In Terminal:
docker run --net=host cloudflare/cloudflared:latest tunnel --no-autoupdate run --token=DEIN_TOKEN

# 6. Public URL wird angezeigt - diese kopieren!
```

**Oder einfacher:**
```bash
# Token in .env.local eintragen:
CLOUDFLARE_TUNNEL_TOKEN=dein-token-hier

# Dann starten:
docker-compose up cloudflare-tunnel
```

---

### 6. UMAmi ANALYTICS (Optional)

**Für Datenschutz-konforme Statistiken:**

```bash
# 1. Bei umami.is anmelden
# 2. Website hinzufügen
# 3. Website-ID kopieren

# 4. In .env.local:
NEXT_PUBLIC_UMAMI_URL=https://stats.deinedomain.de
NEXT_PUBLIC_UMAMI_WEBSITE_ID=deine-website-id
```

---

### 7. E-MAIL VERSAND (Optional)

**Für Magic Links, Bestätigungen:**

**Option A: Resend (Empfohlen)**
- https://resend.com
- 100 E-Mails/Tag kostenlos
- API-Key holen
- In .env.local: `RESEND_API_KEY=re_...`

**Option B: Eigenen SMTP-Server**
- SMTP-Daten in Code eintragen

---

### 8. DOMAIN & SSL (Optional)

**Für professionellen Betrieb:**

```
1. Domain kaufen (z.B. bei cloudflare.com, namecheap.com)
2. DNS-Einträge auf Server/Tunnel zeigen
3. SSL automatisch via Cloudflare
```

**Oder kostenlos:**
- Cloudflare Tunnel gibt dir automatisch HTTPS-URL
- Keine eigene Domain nötig!

---

## ✅ CHECKLISTE VOR DEM START

### Muss haben (Kritisch):
- [ ] Supabase-Account erstellt
- [ ] Datenbank-Tabellen erstellt
- [ ] .env.local mit echten Werten gefüllt
- [ ] Build erfolgreich (`npm run build`)
- [ ] Server startet ohne Fehler
- [ ] http://localhost:3000 erreichbar

### Sollte haben (Empfohlen):
- [ ] RLS aktiviert
- [ ] Einen Test-Fall erstellt
- [ ] Einen Test-Tagebucheintrag gemacht
- [ ] PDF-Generierung getestet

### Optional (Kann später):
- [ ] Cloudflare Tunnel für externen Zugriff
- [ ] Umami Analytics
- [ ] E-Mail-Versand
- [ ] Eigene Domain
- [ ] Logo in allen Varianten

---

## 🆘 PROBLEME?

### Build-Fehler:
```bash
# Cache löschen
rm -rf .next node_modules
npm install
npm run build
```

### Supabase-Verbindung fehlschlägt:
```
- URL prüfen (https://...supabase.co)
- Keys prüfen (nicht vertauschen!)
- Netzwerk prüfen (Firewall?)
- Supabase-Status prüfen (Dashboard)
```

### Port 3000 belegt:
```bash
# Anderen Port nutzen
PORT=3001 npm start
```

---

## 📞 HILFE BEKOMMEN

**Wenn etwas nicht klappt:**
1. Fehlermeldung lesen
2. Diese Datei nochmal prüfen
3. OpenClaw Agent fragen: "Supabase-Verbindung fehlgeschlagen..."
4. Supabase-Dokumentation: https://supabase.com/docs

---

## 🎉 NACH DER EINRICHTUNG

**Wenn alles läuft:**
1. ✅ Startseite testen
2. ✅ Pflegegrad-Rechner durchklicken
3. ✅ Fall-Code erstellen
4. ✅ Tagebuch testen
5. ✅ Sprache wechseln
6. ✅ Mobile-Ansicht testen

**Dann:** 🚀 Portal ist LIVE!

---

*Erstellt für Frank - PflegeNavigator EU*  
*27. April 2026*
