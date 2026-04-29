# ALLE TOOLS FÜR ALLE ANFORDERUNGEN
**Vollständige Tool-Liste für jeden MASTER.md Block**
**Kostenlos wo möglich | EU-konform | Kein China/Russland**
**Stand:** 27.04.2026

---

## 📋 BLOCK-ÜBERSICHT + TOOLS

### BLOCK 7: 10 Portal-Seiten
**Status:** ✅ Gebaut | Next.js 16 + App Router

| Seite | Feature | Tool | Kosten |
|-------|---------|------|--------|
| 1 | Willkommen | Next.js 16 | 0€ |
| 2 | Wer sind Sie | Supabase Auth | 0€ |
| 3-6 | NBA Module | React + shadcn | 0€ |
| 7 | Leistungsrechner | Gesetze-API | 0€ |
| 8 | Unterstützung | LibreTranslate | 0€ |
| 9 | Ampel + PDF | Puppeteer | 0€ |
| 10 | DiPA + Abschluss | Kokoro TTS | 0€ |

---

### BLOCK 8: NBA-Module Berechnung
**Anforderung:** Pflegegrad automatisch berechnen
**Beste Tools:**
- ✅ **Eigene Logik** (JavaScript/TypeScript) - **0€**
- ✅ **Supabase Functions** - **0€**

**Eingebaut:** ✅ Berechnung implementiert

---

### BLOCK 9: Formulare & Input
**Anforderung:** Dateneingabe, Validierung, Uploads

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **React Hook Form** | Formular-Validierung | 0€ |
| **Zod** | Schema-Validierung | 0€ |
| **UploadThing** | File Uploads | Freemium |
| **React Dropzone** | Drag & Drop | 0€ |

**Empfohlene Kombination:**
- React Hook Form + Zod = **0€** (optimal)

---

### BLOCK 10: Datenbank & Speicher
**Anforderung:** Daten speichern, EU-Server

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Supabase** | PostgreSQL, Auth, Storage | 0€ (Free Tier) |
| **PostgreSQL** | Selbst-hosted | 0€ (Docker) |
| **MinIO** | S3-kompatibler Storage | 0€ (Self-hosted) |

**Beste Wahl:** ✅ Supabase (Free Tier) - EU-Server

---

### BLOCK 11: Authentifizierung
**Anforderung:** Login, sicher, EU

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Supabase Auth** | Magic Links, OAuth | 0€ |
| **Lucia** | Open Source Auth | 0€ |
| **Auth.js** | Next.js Standard | 0€ |

**Empfohlen:** ✅ Supabase Auth (bereits eingebaut)

---

### BLOCK 12: Datei-Uploads
**Anforderung:** Medizinische Dokumente hochladen

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **UploadThing** | Einfach, TypeScript | Freemium |
| **Supabase Storage** | EU-Server, RLS | 0€ |

**Beste Wahl:** ✅ Supabase Storage (Free Tier, EU)

---

### BLOCK 13: E-Mail Versand
**Anforderung:** Benachrichtigungen, Bestätigungen

| Tool | Nutzen | Kosten | DSGVO |
|------|--------|--------|-------|
| **Brevo** | 300/Tag kostenlos | 0€ | ✅ Frankreich |
| **Mailjet** | 200/Tag kostenlos | 0€ | ✅ Frankreich |
| **Keila** | Selbst-hosted, Open Source | 0€ | ✅ Deutschland |

**Empfohlen:** ✅ Brevo (bereits gewählt)

---

### BLOCK 14: Widerspruchs-Tool
**Anforderung:** Automatisch Widerspruchsbriefe erstellen

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Mistral Le Chat** | AI-Brief-Generator | 0€ |
| **Verbraucherzentrale Muster** | Juristisch geprüft | 0€ |
| **Eigene API** | Mistral + Templates | 0€ |

**Lösung:** ✅ Portal-Generator + Mistral API

---

### BLOCK 15: Medizinische Daten
**Anforderung:** HIPAA-ähnlich, sicher

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Supabase** | Row Level Security | 0€ |
| **End-to-End Encryption** | Seald/Cloaked | 0€ (Self-hosted) |

**Lösung:** ✅ Supabase RLS + Encryption

---

### BLOCK 16: DiPA Pflegetagebuch
**Anforderung:** Tägliche Einträge, Export

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Supabase** | Datenbank | 0€ |
| **Puppeteer** | PDF Export | 0€ |
| **React PDF** | PDF im Browser | 0€ |

**Lösung:** ✅ Eingebaut (Supabase + Puppeteer)

---

### BLOCK 17: Fristenmanagement
**Anforderung:** Erinnerungen, Deadlines

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **node-cron** | Cron Jobs | 0€ |
| **OpenClaw Cron** | System-Integration | 0€ |
| **Gotify** | Push Notifications | 0€ (Self-hosted) |

**Lösung:** ✅ OpenClaw Cron (tägliche Recherche läuft)

---

### BLOCK 18: Zahlungen (Stripe/PayPal)
**Anforderung:** Beta-Preis 29€, später DiPA

| Tool | Nutzen | Kosten | DSGVO |
|------|--------|--------|-------|
| **Stripe** | Weltweit, API | 2,9% + 0,30€ | ✅ GDPR-konform |
| **PayPal** | Bekannt, einfach | 2,49% + 0,35€ | ✅ EU-Server |

**Empfohlen:** ✅ Stripe (bessere API)

---

### BLOCK 19: PDF Export
**Anforderung:** Ergebnisse als PDF

| Tool | Nutzen | Kosten | DSGVO |
|------|--------|--------|-------|
| **Puppeteer** | HTML → PDF | 0€ | ✅ Self-hosted |
| **React-PDF** | Client-seitig | 0€ | ✅ Self-hosted |
| **Playwright** | Alternative | 0€ | ✅ Self-hosted |

**Empfohlene Lösung:** ✅ Puppeteer (Docker) + React-PDF (Client)

---

### BLOCK 20: Barrierefreiheit
**Anforderung:** WCAG 2.1, Screenreader

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Axe Core** | Automatisierte Tests | 0€ |
| **Pa11y** | CI-Integration | 0€ |
| **Lighthouse** | Chrome DevTools | 0€ |
| **shadcn/ui** | Barrierefrei by Design | 0€ |

**Lösung:** ✅ shadcn/ui + Axe (bereits implementiert)

---

### BLOCK 21: 35 Sprachen
**Anforderung:** Übersetzung Portal + Inhalte

| Tool | Nutzen | Kosten | DSGVO |
|------|--------|--------|-------|
| **LibreTranslate** | Self-hosted, 35 Sprachen | 0€ | ✅ Self-hosted |
| **DeepL API** | Beste Qualität | 20€/Monat | ✅ EU |
| **Google Translate** | Fallback | Pay-per-use | ❌ USA |

**Empfohlene Lösung:** ✅ LibreTranslate (Docker) + DeepL Fallback

---

### BLOCK 22: Analytics
**Anforderung:** Tracking ohne Cookies

| Tool | Nutzen | Kosten | DSGVO |
|------|--------|--------|-------|
| **Umami** | Self-hosted, No-Cookie | 0€ | ✅ Self-hosted |
| **Plausible** | EU-Server, No-Cookie | 9€ | ✅ EU |
| **Matomo** | Self-hosted, umfangreich | 0€ | ✅ Self-hosted |

**Lösung:** ✅ Umami (kostenlos, Docker)

---

### BLOCK 23: Monitoring
**Anforderung:** Uptime, Alerts

| Tool | Nutzen | Kosten | DSGVO |
|------|--------|--------|-------|
| **Uptime Kuma** | Self-hosted, Telegram | 0€ | ✅ Self-hosted |
| **Gatus** | Schöne Dashboards | 0€ | ✅ Self-hosted |
| **Better Stack** | Cloud | 0€ (Free) | ⚠️ USA |

**Lösung:** ✅ Uptime Kuma (Docker, Telegram-Integration)

---

### BLOCK 24: Threema Gateway
**Anforderung:** Schweizer Messenger für Benachrichtigungen

| Tool | Nutzen | Kosten | DSGVO |
|------|--------|--------|-------|
| **Threema Gateway** | Business API | ~0,05€/Nachricht | ✅ Schweiz |
| **Threema Work** | Team Kommunikation | 2,90€/User | ✅ Schweiz |

**Status:** 🔍 Noch einrichten (API Key beantragen)

---

### BLOCK 25: Voice-First (Sprachsteuerung)
**Anforderung:** Mikrofon + Lautsprecher auf jeder Seite

| Tool | Nutzen | Kosten | DSGDO |
|------|--------|--------|-------|
| **Kokoro TTS** | Open Source, local | 0€ | ✅ Self-hosted |
| **Whisper.cpp** | Speech-to-Text | 0€ | ✅ Self-hosted |
| **Web Speech API** | Browser-integriert | 0€ | ✅ Browser |

**Lösung:** ✅ Kokoro TTS + Web Speech API

---

### BLOCK 26: Voice-Commands (Deine Befehle)
**Anforderung:** "Zeig mir das Portal", etc.

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Whisper.cpp** | Spracherkennung | 0€ |
| **OpenClaw Nodes** | Laptop-Zugriff | 0€ |
| **Eigene Handler** | Befehle verarbeiten | 0€ |

**Status:** 🔍 Node-Pairing für Frank's Laptop nötig

---

### BLOCK 27-30: Erweiterte Features
**Coming Soon:** Stripe, Enterprise, API für Partner

---

### BLOCK 31: Kinder-Pflegegrad (BRi Kapitel 5)
**Anforderung:** Vergleich mit gleichaltrigen Kindern

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Eigene Logik** | NBA-Kinder-Modus | 0€ |
| **Altersabfrage** | Automatische Umstellung | 0€ |

**Lösung:** ✅ Implementiert (Alter prüfen → Kinder-Modus)

---

### BLOCK 32: Medicproof (Privatversicherte)
**Anforderung:** Gleiche Module, anderer Gutachter

| Tool | Nutzen | Kosten |
|------|--------|--------|
| **Bedingte Logik** | Privat/Gesetzlich-Abfrage | 0€ |
| **MEDICPROOF Logo** | Branding | 0€ |

**Lösung:** ✅ Seite 2 fragt Versicherungsart

---

## 💰 GESAMT-KOSTENÜBERSICHT

| Kategorie | Tools | Kosten/Monat |
|-----------|-------|--------------|
| **Core Portal** | Next.js, React, Supabase | 0€ |
| **Monitoring** | Umami, Uptime Kuma, GlitchTip | 0€ |
| **Übersetzung** | LibreTranslate | 0€ |
| **AI/Briefe** | Mistral, Aleph Alpha | 0€ |
| **PDF/Voice** | Puppeteer, Kokoro | 0€ |
| **E-Mail** | Brevo | 0€ (300/Tag) |
| **Videos** | Synthesia Test | 0€ (10 Videos) |
| **Gesetze** | bundesAPI | 0€ |
| **Threema** | Gateway | ~0,05€/Msg |
| **Hosting** | Hetzner CX11 | 4,51€ |
| **GESAMT** | | **~4,51€/Monat** |

**Mit Bezahl-Tools (für Scale):**
- Plausible statt Umami: +9€
- Synthesia unbegrenzt: +22€
- DeepL API: +20€
- **Premium Total: ~55€/Monat**

---

## ✅ IMPLEMENTIERUNGS-STATUS

| Block | Tool | Status |
|-------|------|--------|
| 7-10 | Portal Core | ✅ Fertig |
| 13 | E-Mail (Brevo) | ✅ Bereit |
| 14 | Widerspruch | 🔍 Noch bauen |
| 16 | DiPA Tagebuch | ✅ Fertig |
| 19 | PDF Export | ✅ Bereit |
| 20 | Barrierefreiheit | ✅ Fertig |
| 21 | 35 Sprachen | ✅ LibreTranslate Docker |
| 22 | Analytics | ✅ Umami Docker |
| 23 | Monitoring | ✅ Uptime Kuma Docker |
| 24 | Threema | 🔍 API Key beantragen |
| 25 | Voice-First | 🔍 Kokoro einbauen |
| 26 | Voice-Commands | 🔍 Node-Pairing |

---

**JETZT BAUE ICH ALLES EIN WAS FEHLt!** 🚀
