# SOFORT EINBAUEN - ARBEITSPAKETE
**Alles was JETZT ohne Admin/Internet geht**
**Stand:** 27.04.2026

---

## 🎯 ARBEITSPAKET 1: Widerspruch-Generator (30 Min)
**Dateien:**
- ✅ `src/lib/widerspruch.ts` - BEREITS ERSTELLT
- 🔄 `src/app/api/widerspruch/route.ts` - NOCH BAUEN
- 🔄 `src/app/widerspruch/page.tsx` - UI NOCH BAUEN

**Was es tut:**
1. User gibt Daten ein (aktueller PG, gewünschter PG, Begründung)
2. System generiert Brief nach Verbraucherzentrale-Muster
3. PDF wird erstellt mit Puppeteer
4. Download-Button

**Status:** Code existiert, muss nur verknüpft werden

---

## 🎯 ARBEITSPAKET 2: Gesetze-API Endpunkt (20 Min)
**Dateien:**
- ✅ `src/lib/gesetze.ts` - BEREITS ERSTELLT
- 🔄 `src/app/api/gesetze/route.ts` - NOCH BAUEN
- 🔄 `src/app/api/gesetze/[paragraph]/route.ts` - NOCH BAUEN

**Was es tut:**
1. `/api/gesetze/sgb-xi/33` → Gibt §33 SGB XI zurück
2. Automatisch aktuell via bundesAPI
3. Für Leistungsrechner im Portal

**Status:** Logik fertig, nur API-Routen fehlen

---

## 🎯 ARBEITSPAKET 3: PDF Export für Ergebnis (20 Min)
**Dateien:**
- ✅ `src/lib/pdf.ts` - BEREITS ERSTELLT
- 🔄 `src/app/api/export/pdf/route.ts` - NOCH BAUEN
- 🔄 Button in `src/app/pflegegrad/ergebnis/page.tsx` - NOCH BAUEN

**Was es tut:**
1. User klickt "Ergebnis als PDF"
2. PDF wird mit Puppeteer generiert
3. Download startet automatisch

**Status:** Generator fertig, nur Einbau fehlt

---

## 🎯 ARBEITSPAKET 4: Voice-First Integration (40 Min)
**Dateien:**
- ✅ `src/lib/voice.ts` - BEREITS ERSTELLT
- 🔄 `src/components/VoiceAssistant.tsx` - NOCH BAUEN
- 🔄 Einbau in alle Seiten - NOCH MACHEN

**Was es tut:**
1. Mikrofon-Button auf jeder Seite
2. Sprachbefehle erkennen ("Weiter", "Zurück", "Hilfe")
3. Vorlesen mit Kokoro TTS

**Status:** Library fertig, nur UI-Integration fehlt

---

## 🎯 ARBEITSPAKET 5: Mistral API für Briefe (Braucht API-Key)
**Dateien:**
- 🔄 `.env` - MISTRAL_API_KEY hinzufügen
- 🔄 `src/lib/mistral.ts` - Client erstellen
- 🔄 `src/app/api/brief/route.ts` - Brief-Generator

**Was es tut:**
1. User gibt Stichpunkte ein
2. Mistral generiert formellen Brief
3. PDF Download

**Status:** Braucht API-Key von mistral.ai (kostenlos)

---

## 🎯 ARBEITSPAKET 6: Synthesia Videos (Braucht Account)
**Aktionen:**
1. 🔄 Account bei synthesia.io erstellen
2. 🔄 10 Testvideos kostenlos produzieren
3. 🔄 Scripte schreiben für Pflegegrad-Module
4. 🔄 Videos in Portal einbetten

**Status:** Braucht deine E-Mail für Account

---

## 🎯 ARBEITSPAKET 7: Admin-Deployment (Braucht Admin)
**Aktionen:**
1. ⏳ OpenClaw Config fixen
2. ⏳ Docker starten
3. ⏳ Ngrok für Link
4. ⏳ Testen

**Status:** Wartet auf Admin

---

## 📋 WAS ICH JETZT MACHEN KANN (Ohne Admin/Internet-Blocks)

✅ **Paket 1:** Widerspruch-Generator Code (lokal)
✅ **Paket 2:** Gesetze-API Routen (lokal)
✅ **Paket 3:** PDF Export (lokal)
✅ **Paket 4:** Voice-First UI (lokal)

⏳ **Paket 5:** Mistral API (braucht API-Key)
⏳ **Paket 6:** Synthesia (braucht Account)
⏳ **Paket 7:** Deployment (braucht Admin)

---

## 🚀 FRANKS ENTSCHEIDUNG

**Ich habe 30 Minuten bis ich blockiert werde.**

**Sag mir:**
- **"JA ALLE"** → Ich baue Paket 1+2+3+4 (alles lokale Code-Arbeit)
- **"NUR WIDERSPRUCH"** → Nur Paket 1
- **"NUR PDF"** → Nur Paket 3
- **"API-KEY HOLEN"** → Ich zeige dir wie du Mistral-Key bekommst
- **"SYNTHESIA ACCOUNT"** → Ich zeige dir Registrierung

**Was jetzt?** ⏳
