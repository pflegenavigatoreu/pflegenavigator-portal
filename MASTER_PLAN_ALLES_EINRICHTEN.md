# MASTER-PLAN: ALLES EINRICHTEN
**Basierend auf: Blogs, Voice Commands, MASTER.md, SYSTEM.md**
**Stand:** 27.04.2026
**Status:** VORBEREITET - Warte auf "JA" für Ausführung

---

## 📋 GEFUNDENE ANFORDERUNGEN (Aus allen Dokumenten)

### 1. PORTAL (Aus MASTER.md 77 Blöcke)
- ✅ 11 Seiten gebaut
- ✅ Supabase API verbunden
- ❌ Noch nicht online (wartet auf Admin)
- ❌ Cron-Job fehlt

### 2. VIDEOS (Aus ALLE_TOOLS_PORTAL_KOMPLETT.md)
- 🎥 Synthesia - Erklärvideos (10 Testvideos gratis)
- 🎥 HeyGen - Social Media
- 🎥 Colossyan - EU-Alternative für Schulungen

### 3. BRIEF-TOOLS (Aus BRIEF_TOOLS_EU_GDPR.md)
- 📝 Mistral Le Chat - Kostenlos, beste KI
- 📝 Aleph Alpha - Deutsch-Spezialist
- 📝 Widerspruch-Generator (im Portal)

### 4. GESETZE (Aus RECHERCHE_AKTUELL.md)
- 📚 bundesAPI - Kostenlos, alle Gesetze
- 📚 Normattiva - API 0,10€/Abruf
- 📚 Pflegegeld 2026: PG2 347€, PG3 599€, PG4 800€, PG5 990€

### 5. MONITORING (Aus TOOLS_RECHERCHE_EU_USA.md)
- 📊 Umami - Analytics (kostenlos)
- 📊 Uptime Kuma - Monitoring (kostenlos)
- 📊 GlitchTip - Error Tracking (kostenlos)

### 6. SPRACHSTEUERUNG (Aus VOICE_COMMANDS.md)
- 🎤 "Zeig mir das Portal" → Browser öffnen
- 🎤 "Starte den Server neu" → npm run dev
- 🎤 "Mach einen Screenshot" → + Telegram senden
- 🎤 "Lies mir das vor" → TTS Kokoro

---

## 🎯 TOOLS-ZUORDNUNG: WAS WOFÜR

| Dein Bedarf | Bestes Tool | Kosten | Status |
|-------------|-------------|--------|--------|
| **Uni-Anschreiben** | Mistral Le Chat | 0€ | ✅ Bereit |
| **Widerspruch Pflegegrad** | Portal-Generator | 0€ | ❌ Noch bauen |
| **Erklärvideos Portal** | Synthesia | 0€ (10 Test) | ❌ Noch machen |
| **Behördenbriefe** | Aleph Alpha | 0€ | ✅ Bereit |
| **Gesetze recherchieren** | bundesAPI | 0€ | ✅ Bereit |
| **Portal überwachen** | Uptime Kuma | 0€ | ✅ Docker-Config |
| **Fehler finden** | GlitchTip | 0€ | ✅ Docker-Config |
| **Besucher zählen** | Umami | 0€ | ✅ Docker-Config |
| **35 Sprachen** | LibreTranslate | 0€ | ✅ Docker-Config |
| **Voice Commands** | Kokoro TTS | 0€ | ❌ Noch einbauen |

---

## 🔧 WAS ICH JETZT VORBEREITE (Code geschrieben, wartet auf JA)

### A) PORTAL-ERWEITERUNGEN
- [ ] Widerspruch-Generator API (`/api/widerspruch`)
- [ ] Brief-Generator API (`/api/brief`)
- [ ] Gesetze-API Integration (`/api/gesetze`)
- [ ] Voice-Command Handler (Kokoro TTS)
- [ ] 35-Sprachen-Checker

### B) MONITORING (Docker)
- [x] Umami Config ✅
- [x] Uptime Kuma Config ✅
- [x] GlitchTip Config ✅
- [x] LibreTranslate Config ✅
- [x] docker-compose.yml ✅

### C) VIDEOS (Erklärvideos)
- [ ] Synthesia-Account erstellen
- [ ] 10 Testvideos produzieren
- [ ] Scripte schreiben (Pflegegrad-Module)

### D) BRIEF-TOOLS
- [x] Mistral-Integration ✅
- [x] Aleph-Alpha-Integration ✅
- [ ] Portal-UI für Brief-Generator

---

## 💰 GESAMT-KOSTEN (Minimal-Setup)

| Tool | Preis | Nutzen |
|------|-------|--------|
| Portal Hosting (Hetzner) | 4,51€/Monat | Online sein |
| Supabase (Free Tier) | 0€ | Datenbank |
| Alle Docker-Tools | 0€ | Monitoring |
| Mistral/Aleph Alpha | 0€ | AI-Briefe |
| Synthesia (10 Videos) | 0€ | Erklärvideos |
| bundesAPI Gesetze | 0€ | Recht aktuell |
| **GESAMT** | **4,51€/Monat** | **Alles dabei** |

---

## 🚨 SELBST-KONTROLLE (Mache ich JETZT)

### Check 1: Hab ich alles aus den Blogs?
- [x] Videos → Synthesia/HeyGen/Colossyan ✅
- [x] Briefe → Mistral/Aleph Alpha ✅
- [x] Gesetze → bundesAPI/Normattiva ✅
- [x] Widersprüche → Verbraucherzentrale + Generator ✅
- [x] Portal → Next.js + Supabase ✅
- [x] Sprachsteuerung → Voice Commands Tabelle gefunden ✅

### Check 2: EU/GDPR konform?
- [x] Keine chinesischen Tools (DeepSeek, etc.) ❌
- [x] Keine russischen Tools ❌
- [x] EU-Server wo möglich ✅
- [x] Self-Hosted für Datenschutz ✅
- [x] DSGVO-konform dokumentiert ✅

### Check 3: Kostenlos wo möglich?
- [x] Monitoring: 0€ ✅
- [x] Error-Tracking: 0€ ✅
- [x] Analytics: 0€ ✅
- [x] Übersetzung: 0€ ✅
- [x] AI-Briefe: 0€ ✅
- [x] Gesetze: 0€ ✅

---

## ⏳ WAS PASSIERT WENN DU "JA" SAGST

### Sofort (5 Min):
1. Widerspruch-Generator Code schreiben
2. Brief-Generator API bauen
3. Gesetze-Endpoint einbauen

### Heute (30 Min):
4. Docker-Compose starten
5. Alle 6 Services laufen lassen
6. Ngrok für öffentlichen Link

### Diese Woche:
7. Synthesia-Account + Videos
8. Portal-UI für Briefe
9. Voice-Commands testen

---

## 🎯 DEINE ENTSCHEIDUNG

**Soll ich JETZT ausführen?**

- [ ] **"JA"** → Ich baue alles (Widerspruch, Briefe, Gesetze, Videos)
- [ ] **"ERST PORTAL"** → Nur Docker starten, Rest später
- [ ] **"ERST BRIEFE"** → Nur Brief-Generator bauen
- [ ] **"ZEIG MIR ALLES"** → Liste nochmal detailliert

---

## 📁 ALLE DATEIEN BEREIT

- `docker-compose.yml` - Alle 6 Services
- `next.config.ts` - Docker-ready
- `ADMIN_README_START.md` - Anleitung für Admin
- `ALLE_TOOLS_PORTAL_KOMPLETT.md` - Alle Tools erklärt
- `BRIEF_TOOLS_EU_GDPR.md` - Brief-Schreib Tools
- `DATENSCHUTZ_TOP_KONFIGURATION.md` - Datenschutz-Setup

**Warte auf dein "JA"!** ⏳
