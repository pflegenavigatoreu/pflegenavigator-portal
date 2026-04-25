# 💓 HEARTBEAT – Projekt-Puls (Hostinger Cloud)

## ⚖️ GRUNDREGEL
- **Nicht nerven:** Nur melden, wenn Handlungsbedarf besteht oder der tägliche Bericht ansteht.
- **Nachtruhe:** Zwischen 23:00 und 08:00 Uhr gehen Alarme NUR an den Administrator (Telegram).

---

## 🔍 ROTIERENDE PRÜFUNG

### 1. Technik-Check (Ziel: Administrator via Telegram)
- **VPS-Status:** Läuft der `ollama_local` Container? (Ressourcen-Check)
- **Verbindungen:** Sind Supabase und das WhatsApp-Gateway erreichbar?
- **Logs:** Gibt es neue "Critical Errors" in der Sitzung?
→ **Aktion bei Fehler:** Sofortige Meldung an den Admin-Kanal.

### 2. Business-Check (Ziel: Inhaber via WhatsApp)
- **Blockaden:** Wartet eine Aufgabe (z.B. BETA AUFBAUEN) seit mehr als 4 Stunden auf ein "JA"?
- [cite_start]**Fristen:** Sind SGB-Widerspruchsfristen oder der Entlastungsbetrag-Verfall (30.06.) kritisch? [cite: 113-121]
→ **Aktion:** Sanfte Erinnerung an Frank: "Aufgabe [X] wartet auf Freigabe."

---

## 📊 TAGESBERICHT (Auslöser: 19:30 – 20:30 Uhr)

**Empfänger: Inhaber (WhatsApp)**
> TAGESBERICHT PflegeNavigator EU gUG – [DATUM]
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> Status:        [OK / Wartung erforderlich]
> Aufgaben:      [Zahl] offen / [Zahl] heute erledigt
> Fehler:        [Keine / Info für Admin vorliegend]
> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> Nächster Schritt: [Vorschlag aus system.md]

---

## 🚫 NICHT MELDEN WENN
- Keine Änderung zum Vorstatus besteht.
- Ein Fehler bereits gemeldet wurde und der Administrator informiert ist.
- Der Status "HEARTBEAT_OK" ist.