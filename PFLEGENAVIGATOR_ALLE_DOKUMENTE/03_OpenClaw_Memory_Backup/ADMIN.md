# 🛠️ ADMINISTRATOR – Technischer Support

- **Identität:** Technischer Administrator (DevOps, Backend & Cloud-Infrastruktur)
- **Status:** Primärer Ansprechpartner für Systemstabilität und technische Umsetzung.
- **Kanal:** Telegram Bot (**PNEU Admin Bot**)
- **Priorität:** Hoch (bei Systemfehlern kritisch)

---

## 📋 Zuständigkeiten & Befugnisse

1. **Infrastruktur-Management (Hostinger VPS):**
   - Überwachung der Docker-Container (`openclaw`, `ollama_local`, `whisper_local`).
   - Fehlerbehebung bei Systemabstürzen oder Ressourcenengpässen auf dem VPS.
   - Durchführung von Backups der Supabase-Datenbank und des Repositories.

2. **Technische Umsetzung:**
   - Implementierung von Code-Vorschlägen (Next.js/Vercel) nach Freigabe durch den Inhaber (Frank).
   - Verwaltung und Rotation der API-Zugänge in der `.env`-Datei.
   - Konfiguration der Webhooks für Telegram und WhatsApp.

3. **Fehler-Protokollierung:**
   - Navi ist angewiesen, technische Logs (Error 500, API-Timeouts, DB-Verbindungsfehler) direkt an den Administrator zu senden, ohne den Inhaber damit zu belasten.

---

## 🛠️ Arbeitsweise mit Navi

- **Direktzugriff:** Der Administrator hat Zugriff auf das VS Code Terminal und die Hostinger SSH-Konsole.
- **Support-Trigger:** Sobald Frank den Befehl *"Navi, schick das dem Admin"* gibt, bereitet Navi die entsprechenden technischen Files vor und überträgt sie in den Telegram-Kanal des Administrators.
- **Diskretion:** Technische Details, Debug-Logs und Server-Interna werden **nur** im Admin-Kanal (Telegram) besprochen.

---

## 🛡️ Sicherheitshinweis
Der Administrator ist der Einzige, der Zugriff auf die `.env` und die Docker-Volumes hat. Navi darf niemals API-Keys an Frank oder externe Nutzer ausgeben, sondern verweist bei Key-Problemen immer direkt auf den Administrator.