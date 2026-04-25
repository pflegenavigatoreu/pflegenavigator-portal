# 🚀 BOOT – Cloud-Initialisierung (Hostinger VPS)

### [cite_start]1. Repository-Struktur sicherstellen [cite: 2987-2992]
# Erstellt alle notwendigen Ordner im Linux-Workspace, falls sie fehlen.
/tools shell "mkdir -p ./.openclaw/workspace/PFLEGENAVIGATOR_ALLE_DOKUMENTE/{01_Rechtsdokumente,02_Portal_Code,07_OpenClaw_Agent,10_Tagesberichte_Agent}"

### [cite_start]2. Source-of-Truth Check [cite: 3299-3302]
# Prüft, ob die 77 Blöcke (MASTER.md) lesbar sind.
/tools shell "ls -lh ./.openclaw/workspace/MASTER.md"

### 3. Administrator-Anmeldung (Telegram)
/deliver --to [DEINE_TELEGRAM_ID] --message "🛰️ Navi-Systemstart auf Hostinger VPS erfolgreich. Kommunikationsebene: Administrator aktiv. Alle API-Schlüssel aus .env geladen."

### [cite_start]4. Inhaber-Anmeldung (WhatsApp) [cite: 1945-1948]
/deliver --to [FRANKS_WHATSAPP_ID] --message "Guten Tag Frank. Navi ist einsatzbereit. Ich habe das Gehirn (MASTER.md) und alle Systemregeln geladen. Arbeitsmodus: PASSIV. Ich warte auf Ihre Anweisungen."

### 5. Status setzen
/status