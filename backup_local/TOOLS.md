# 🛠️ TOOLS – Technischer Spickzettel (Hostinger Cloud-Edition)

Diese Datei dient Navi als Orientierungshilfe auf dem Hostinger VPS. Hier sind die spezifischen Bezeichnungen und Linux-Pfade hinterlegt.

---

### 🗄️ Infrastruktur & Datenbank (Supabase)

- **Primäre Datenbank:** Supabase (Instanz: Frankfurt/Main)
- **Projekt:** PflegeNavigator-Backend
- **Wichtige Tabellen:** - `cases` → Haupttabelle für die anonymisierten Fallcodes (PF-XXXX).
  - `answers` → Speicherort für die Antworten aus den 10 Modulen.
  - `feedback` → Eingangskorb für Nutzer-Verbesserungsvorschläge.

---

### 💻 Entwicklung & Hosting

- **Hoster:** Hostinger VPS (Ubuntu/Linux).
- **GitHub Repository:** `pflegenavigator-main` (Zweig: `main`).
- **Frontend-Hoster:** Vercel (Produktions-URL: pflegenavigatoreu.com).
- **Lokale Dienste:** Docker-Umgebung (Docker Compose).
- **Geheimnisse:** Alle API-Keys (NVIDIA, Supabase, GitHub, Telegram) werden zentral über die `.env`-Datei im Root-Verzeichnis geladen.

---

### 🎙️ Kommunikation & Stimme (TTS/STT)

- **Name der Stimme:** "Navi" (basierend auf Kokoro TTS).
- **Einstellungen:** Deutsch, warm, Geschwindigkeit: 0.85.
- **Spracherkennung:** Whisper (lokal im Docker-Container).
- **Kanäle:**
  - **Inhaber (Frank):** WhatsApp (Primary), Signal, Threema.
  - **Administrator:** Telegram (PNEU Admin Bot).

---

### 📂 Repository-Ordnerstruktur (Linux-Pfade)

Die Dateiablage erfolgt im gemappten Workspace des Repositories auf dem Server:
- **Hauptverzeichnis:** `./.openclaw/workspace/PFLEGENAVIGATOR_ALLE_DOKUMENTE/`
- **Wichtige Unterordner:**
  - `01_Rechtsdokumente` → Vorlagen für SGB-Prüfungen.
  - `02_Portal_Code` → Lokale Kopien der Next.js Komponenten.
  - `07_OpenClaw_Agent` → Speicherort für Admin-Skripte.
  - `10_Tagesberichte_Agent` → Backups der Berichte.

---

### 💳 Zahlungsabwicklung

- **Provider:** Stripe (Testmodus aktiv bis zum 01.05.2026).
- **Produkte:** - `Beta-Special` (29€ einmalig)
  - `Standard-Abo` (39€/Monat)

---

## 📝 Notizen für mich (Navi)

- **Cloud-Check:** Prüfe bei „STATUS“ die Verbindung zu **Supabase** und ob der **Telegram-Admin-Kanal** für Fehlermeldungen bereit ist.
- **Pfade:** Nutze ausschließlich relative Pfade innerhalb des `/workspace`, um Kompatibilität mit dem Repository zu wahren.
- **Source of Truth:** Die `MASTER.md` im Workspace hat Vorrang vor allen anderen Informationen.
- **Code-Flow:** Entwürfe erst in `02_Portal_Code` speichern und Frank per WhatsApp zur Freigabe vorschlagen.