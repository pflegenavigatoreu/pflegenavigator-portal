# BLOCK-ANALYSE KOMPLETT - PflegeNavigator EU gUG
**Erstellt:** 27. April 2026  
**Quelle:** MASTER.md (77 Blöcke)  
**Regeln:** EU-konforme Tools, kostenlos wo möglich, keine chinesischen/russischen Tools

---

## ÜBERSICHT: BESONDERS WICHTIGE BLÖCKE

| Block | Thema | Priorität |
|-------|-------|-----------|
| 7 | 10-Seiten Pflegegrad-Rechner | 🔴 KRITISCH |
| 8 | NBA-Module Berechnung | 🔴 KRITISCH |
| 14 | Widerspruchsmodul | 🔴 KRITISCH |
| 16 | DiPA Pflegetagebuch | 🔴 KRITISCH |
| 19 | PDF Export | 🔴 KRITISCH |
| 24 | Threema Gateway | 🔴 KRITISCH |
| 28 | 35 Sprachen | 🔴 KRITISCH |
| 31 | Barrierefreiheit | 🔴 KRITISCH |

---

## BLOCK 1-3: GRUNDLEGENDE PROJEKTINFOS & REGELN

**Anforderungen:**
- Projekt-Identity: Name, Inhaber, Domain, Beta-Start (02.04.2026)
- Eiserne Regeln: Keine Rechtsberatung, keine Diagnosen, keine Garantien
- 6-stufige Pipeline: Kontext → Kontrolle → Fach → Recht → Sprache → Final-Check
- Disclaimer auf jeder Seite

**Bestes Tool:**
- **OpenClaw** (lokaler KI-Agent) - bereits festgelegt
- **Next.js 14** - Frontend Framework (bereits festgelegt)

**Warum:** OpenClaw ist bereits als KI-Agent definiert, Next.js 14 als Framework in Block 5 festgelegt. Keine Alternativen sinnvoll.

**Kosten:** 0 € (OpenClaw lokal, Next.js Open Source)

**Implementations-Status:** ✅ BEREITS FESTGELEGT

---

## BLOCK 4: TRIGGER-BEFEHLE

**Anforderungen:**
- Befehlssystem: STATUS, TAGESBERICHT, NAECHSTER_SCHRITT, BETA_VORBEREITEN, ADMINISTRATOR, STOP, SAFE_MODE, RECAP, BETA_AUFBAUEN
- Integration mit Threema für Benachrichtigungen

**Bestes Tool:**
- **OpenClaw interne Befehlsverarbeitung** - nativ implementiert
- **Threema Gateway** (Block 24) - für externe Benachrichtigungen

**Warum:** Befehle werden intern im Agent verarbeitet. Threema für externe Kommunikation.

**Kosten:** 0 € (interne Implementierung)

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN (Teil von OpenClaw-Konfiguration)

---

## BLOCK 5: TECHNOLOGIE-STACK (FINAL)

**Anforderungen:**
| Komponente | Tool (bereits festgelegt) |
|------------|---------------------------|
| KI-Agent | OpenClaw |
| KI-Modell | Ollama + Llama 3.3 / Gemma 4 |
| Spracherkennung | Whisper.cpp |
| Sprachausgabe | Kokoro TTS |
| Datenbank | Supabase Frankfurt |
| Frontend | Vercel |
| E-Mail | Brevo |
| Automatisierung | Make.com |
| Payment | Stripe + PayPal Business |
| Messenger | Threema Gateway |
| VPS Server | Hetzner CX11 |
| Übersetzung | LibreTranslate (lokal) + Google Translate API (Fallback) |
| Testing | Playwright + Axe + Lighthouse |

**Analyse der festgelegten Tools:**

| Tool | EU-konform | Kosten | Self-hosted | Status |
|------|------------|--------|-------------|--------|
| OpenClaw | ✅ Ja (lokal) | Kostenlos | Ja | ✅ Akzeptiert |
| Ollama | ✅ USA (Meta) | Kostenlos | Ja | ✅ Akzeptiert |
| Llama 3.3 | ✅ USA (Meta) | Kostenlos | Ja | ✅ Akzeptiert |
| Gemma 4 | ✅ USA (Google) | Kostenlos | Ja | ✅ Akzeptiert |
| Whisper.cpp | ✅ Open Source | Kostenlos | Ja | ✅ Akzeptiert |
| Kokoro TTS | ✅ MIT-Lizenz | Kostenlos | Ja | ✅ Akzeptiert |
| Supabase | ✅ EU (Frankfurt) | Free Tier / 25$/Monat | Nein | ✅ Akzeptiert |
| Vercel | ✅ USA (vertrauenswürdig) | Kostenlos | Nein | ✅ Akzeptiert |
| Brevo | ✅ Frankreich/EU | 300/Tag kostenlos | Nein | ✅ Akzeptiert |
| Make.com | ✅ Tschechien/EU | Free Tier | Nein | ✅ Akzeptiert |
| Stripe | ✅ USA (GDPR-konform) | 1,4% + 0,25€ | Nein | ✅ Akzeptiert |
| PayPal | ✅ USA (GDPR-konform) | Gebühren | Nein | ✅ Akzeptiert |
| Threema | ✅ Schweiz | Kostenpflichtig | Nein | ✅ Akzeptiert |
| Hetzner | ✅ Deutschland | CX11 ~4€/Monat | Nein (VPS) | ✅ Akzeptiert |
| LibreTranslate | ✅ Open Source | Kostenlos | Ja | ✅ Akzeptiert |
| Google Translate | ⚠️ USA (Fallback nur) | API-Kosten | Nein | ⚠️ Fallback akzeptiert |
| Playwright | ✅ Open Source | Kostenlos | Ja | ✅ Akzeptiert |
| Axe | ✅ Open Source | Kostenlos | Ja | ✅ Akzeptiert |
| Lighthouse | ✅ Google Open Source | Kostenlos | Ja | ✅ Akzeptiert |

**Kosten gesamt:** ~75€/Monat (Fixkosten)

**Implementations-Status:** ✅ ALLE TOOLS GEPRÜFT UND AKZEPTIERT

---

## BLOCK 6: SYSTEM-ARCHITEKTUR

**Anforderungen:**
- Inhaber → OpenClaw-Agent → Vorschlag → Inhaber-Freigabe → Administrator → Umsetzung → Threema-Meldung zurück
- Keine Aktion ohne Freigabe des Inhabers

**Bestes Tool:**
- **Threema Gateway** (für Kommunikation)
- **OpenClaw** (für Agent-Logik)
- **Make.com** (für Automation/Workflows)

**Warum:** Threema für sichere Kommunikation, Make.com für Workflow-Automation zwischen Systemen.

**Kosten:** Enthalten in Block 5

**Implementations-Status:** ✅ ARCHITEKTUR DEFINIERT

---

## BLOCK 7: 10-SEITEN-PLAN (PFLEGEGRAD-RECHNER) 🔴 KRITISCH

**Anforderungen:**
| Seite | Inhalt | Besonderheit |
|-------|--------|--------------|
| 1 | Willkommen & Orientierung | 3 Buttons: Pflegegrad / Widerspruch / Ich weiß nicht |
| 2 | Wer sind Sie? | Rolle, Alter, Versicherung, Upload |
| 3 | Mobilität & Körper | NBA Modul 1 (10%) |
| 4 | Selbstversorgung | NBA Modul 4 (40% - höchste Gewichtung) |
| 5 | Kognition, Psyche & Krankheiten | NBA Module 2+3+5 |
| 6 | Belastung & Schlaf | NBA Modul 3+6 |
| 7 | Leistungen & Geld | Alle Beträge 2026, Kombinationsrechner §38 |
| 8 | Unterstützung & Netzwerk | Pflegedienst, Kurse, Entlastungsgeld |
| 9 | Zusammenfassung & Ampel | Grün/Gelb/Rot, PDF-Export |
| 10 | Abschluss & DiPA | Pflegetagebuch, Fristen, Beta-Preis 29€ |

**Regeln für alle Seiten:**
- Max. 3-4 Fragen pro Seite
- Weiter-Button deaktiviert bis Pflichtfelder ausgefüllt
- Haftungsausschluss im Footer
- Voice-First: Mikrofon + Lautsprecher
- Abkürzungen rot markiert
- Fallcode PF-XXXX-XXXX statt Name

**Bestes Tool:**
- **Next.js 14** (bereits festgelegt) - Frontend
- **React Hook Form** - Formularvalidierung
- **Zod** - Schema-Validierung
- **Tailwind CSS** - Styling

**Alternative Tools evaluiert:**
| Tool | EU-konform | Kosten | Warum nicht |
|------|------------|--------|-------------|
| Vue.js | ✅ Ja | Kostenlos | Framework-Wechsel nicht sinnvoll |
| Angular | ✅ Ja | Kostenlos | Zu komplex für das Projekt |
| Svelte | ✅ Ja | Kostenlos | Weniger Ökosystem als React/Next.js |

**Warum Next.js 14:**
- Bereits in Block 5 festgelegt
- React-basiert = größtes Ökosystem
- Server-Side Rendering für SEO
- API Routes für Backend-Logik
- Excellent TypeScript-Support

**Kosten:** 0 € (Open Source)

**Implementations-Status:** ⚠️ MUSS GEBAUT WERDEN (Seite für Seite nach Freigabe)

**Implementations-Plan:**
1. Layout-Komponenten erstellen (Header, Footer, Navigation)
2. Voice-First Komponenten (Mikrofon, Lautsprecher)
3. Formular-Komponenten mit Validierung
4. Ampel-System (Grün/Gelb/Rot)
5. Seite 1-10 einzeln bauen (nach Freigabe)

---

## BLOCK 8: NBA-MODULE BERECHNUNG 🔴 KRITISCH

**Anforderungen:**
| Modul | Thema | Gewichtung |
|-------|-------|------------|
| 1 | Mobilität | 10% |
| 2 | Kognition & Kommunikation | 15% |
| 3 | Verhaltensweisen & Psyche | 15% |
| 4 | Selbstversorgung | 40% |
| 5 | Krankheitsbewältigung | 20% |
| 6 | Alltagsgestaltung | 0% (aber relevant für Widerspruch) |

**KRITISCH:** Von Modul 2 und 3 zählt nur der HÖHERE Wert – nicht addieren!

**Pflegegrad-Schwellen:**
- PG 1: 12,5 bis unter 27 Punkte
- PG 2: 27 bis unter 47,5 Punkte
- PG 3: 47,5 bis unter 70 Punkte
- PG 4: 70 bis unter 90 Punkte
- PG 5: 90 bis 100 Punkte

**Ampel-Logik:**
- Grün: Über Schwelle mit mehr als 5 Punkten Puffer
- Gelb: Knapp – 0 bis 5 Punkte Puffer oder Datenlücken
- Rot: Deutlich unter Schwelle

**Bestes Tool:**
- **TypeScript/JavaScript** - Berechnungslogik (eigene Implementierung)
- **Zod** - Validierung der Eingaben
- **Supabase** - Speicherung der Ergebnisse

**Alternative Tools evaluiert:**
| Tool | Warum nicht |
|------|-------------|
| Python/NumPy | Overkill, JS/TS reicht völlig |
| Excel-Integration | Zu komplex, nicht skalierbar |
| Externe API | Datenschutzrisiko, unnötig |

**Warum eigene Implementierung:**
- Berechnung ist deterministisch und einfach
- Keine komplexe Mathematik nötig
- Datenschutz: Keine Daten an externe APIs
- Performance: Lokal berechnen

**Kosten:** 0 € (eigene Entwicklung)

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

**Implementations-Plan:**
```typescript
// Pseudocode für Berechnung
type NBAModule = {
  rawPoints: number;
  weight: number;
  weightedPoints: number;
};

function calculateCareGrade(modules: NBAModule[]): {
  grade: 1 | 2 | 3 | 4 | 5;
  totalPoints: number;
  trafficLight: 'green' | 'yellow' | 'red';
} {
  // Modul 2 und 3: nur höherer Wert zählt
  const cognitionModule = Math.max(modules[2].weightedPoints, modules[3].weightedPoints);
  
  // Gesamtpunkte berechnen
  const total = modules[1].weightedPoints + 
                cognitionModule + 
                modules[4].weightedPoints + 
                modules[5].weightedPoints;
  
  // Pflegegrad bestimmen
  let grade: 1 | 2 | 3 | 4 | 5;
  if (total < 27) grade = 1;
  else if (total < 47.5) grade = 2;
  else if (total < 70) grade = 3;
  else if (total < 90) grade = 4;
  else grade = 5;
  
  // Ampel-Logik
  const threshold = getThreshold(grade);
  const buffer = total - threshold;
  const trafficLight = buffer > 5 ? 'green' : buffer >= 0 ? 'yellow' : 'red';
  
  return { grade, totalPoints: total, trafficLight };
}
```

---

## BLOCK 9: LEISTUNGSBETRÄGE 2026

**Anforderungen:**
- Pflegegeld §37 SGB XI (2025/2026 identisch)
- Sachleistungen ambulant §36 SGB XI
- Tagespflege/Nachtpflege §41 SGB XI
- Stationärer Eigenanteil-Zuschlag §43c
- Entlastungsbetrag, Budget, Wohnraumanpassung, etc.

**Bestes Tool:**
- **Statische JSON-Datei** mit allen Beträgen
- **TypeScript-Typen** für Typsicherheit
- Automatisierte Tests auf Aktualität

**Alternative Tools evaluiert:**
| Tool | Warum nicht |
|------|-------------|
| Externe API | Zu langsam, Abhängigkeit |
| Datenbank für statische Werte | Overkill |
| CMS | Nicht nötig für 1x/Jahr Änderungen |

**Warum statische JSON:**
- Werte ändern sich maximal 1x/Jahr
- Schnellste Performance
- Keine externe Abhängigkeit
- Einfache Versionierung

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS ERSTELLT WERDEN

---

## BLOCK 10: PREISMODELL

**Anforderungen:**
| Paket | Preis |
|-------|-------|
| Beta-Special | 29€ einmalig (12 Monate, erste 1.000 Tester) |
| Standard | 39€/Monat oder 349€/Jahr |
| Profi (Anwälte/Ärzte) | 399€/Monat |
| DiPA (nach Zulassung) | Kasse zahlt 40€/Monat |

**Bestes Tool:**
- **Stripe** - für Kartenzahlung, SEPA, Apple Pay, Google Pay
- **PayPal Business** - als Alternative

**Warum Stripe + PayPal:**
- Bereits in Block 5 festgelegt
- Beide DSGVO-konform
- Stripe: 1,4% + 0,25€ für EU-Karten
- PayPal: breite Akzeptanz

**Kosten:** Transaktionsgebühren (1,4% + 0,25€)

**Implementations-Status:** ⚠️ MUSS KONFIGURIERT WERDEN

---

## BLOCK 11: RECHTSPAKET

**Anforderungen:**
| Dokument | Status |
|----------|--------|
| Impressum | Fertig – wartet auf Clevver-Adresse |
| AGB Version 2.0 | Beim Anwalt zur Prüfung |
| Datenschutzerklärung | Beim Anwalt zur Prüfung |
| Widerrufsbelehrung | Beim Anwalt zur Prüfung |
| Cookie-Einwilligungen | Beim Anwalt zur Prüfung |
| Barrierefreiheitserklärung | OFFEN |

**DSGVO-Pflichten technisch:**
- Art. 15: Auskunftsrecht → Export-Button
- Art. 17: Löschungsrecht → Löschungs-Button
- Art. 20: Datenportabilität → Download JSON/PDF
- Art. 21: Widerspruchsrecht → DSGVO-Formular

**Bestes Tool:**
- **Rechtsanwalt** (Tim Gruner) - für Texte
- **Cookiebot** oder **Usercentrics** - für Cookie-Einwilligungen (EU-konform)
- **Eigene Implementation** - für DSGVO-Funktionen

**Alternative Cookie-Tools evaluiert:**
| Tool | EU-konform | Kosten | DSGVO-konform |
|------|------------|--------|---------------|
| Cookiebot | ✅ Dänemark | Kostenlos bis 1 Subdomain | ✅ Ja |
| Usercentrics | ✅ Deutschland | Ab 49€/Monat | ✅ Ja |
| CookieYes | ✅ Indien | Kostenlos | ⚠️ Prüfen |
| Osano | ✅ USA | Kostenlos | ✅ Ja |

**Empfehlung Cookiebot:**
- EU-Unternehmen (Dänemark)
- Kostenlos für kleine Projekte
- Einfache Integration
- Automatische Cookie-Erkennung

**Kosten:** Cookiebot: 0 € (Free Tier)

**Implementations-Status:** ⚠️ ANWALT MÜSSEN FERTIGSTELLEN, TECHNIK BEREIT

---

## BLOCK 12: ADMINISTRATOR-ANLEITUNG

**Anforderungen:**
- 14 Installationsschritte
- 10 Pflicht-Tests
- Sicherheit: bind: 127.0.0.1:18789

**Bestes Tool:**
- **Shell-Skripte** für Automation
- **Docker** (optional) für Containerisierung
- **GitHub Actions** oder **GitLab CI** für CI/CD

**Alternative Tools evaluiert:**
| Tool | EU-konform | Kosten | Warum/nicht |
|------|------------|--------|-------------|
| Docker | ✅ Open Source | Kostenlos | Gut für Containerisierung |
| Ansible | ✅ Open Source | Kostenlos | Gut für Server-Konfiguration |
| Terraform | ✅ Open Source | Kostenlos | Overkill für einzelnen VPS |
| Kubernetes | ✅ Open Source | Kostenlos | Viel zu komplex |

**Empfehlung:**
- **Docker** für lokale Entwicklung und Deployment
- **Shell-Skripte** für Server-Setup
- **GitHub Actions** für CI/CD (kostenlos für öffentliche Repos)

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS ERSTELLT WERDEN

---

## BLOCK 13: SUPABASE-SCHEMA

**Anforderungen:**
- Tabellen: cases, answers, scores, payments
- Row Level Security (RLS) aktiviert
- UUID als Primärschlüssel
- Fallcode-System PF-XXXX-XXXX

**Bestes Tool:**
- **Supabase** (bereits festgelegt) - PostgreSQL + RLS
- **Prisma** oder **Drizzle** - ORM für TypeScript

**Alternative ORMs evaluiert:**
| Tool | EU-konform | Kosten | Features |
|------|------------|--------|----------|
| Prisma | ✅ Open Source | Kostenlos | Ausgereift, großes Ökosystem |
| Drizzle | ✅ Open Source | Kostenlos | Leichtgewichtig, schneller |
| TypeORM | ✅ Open Source | Kostenlos | Umfassend, aber komplexer |
| Supabase Client | ✅ Open Source | Kostenlos | Direkte Supabase-Integration |

**Empfehlung Drizzle:**
- Moderner als Prisma
- Bessere Performance
- Einfachere Migrationen
- TypeScript-first

**Kosten:** 0 €

**Implementations-Status:** ⚠️ SCHEMA DEFINIERT, MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 14: PORTAL-ROUTEN 🔴 KRITISCH

**Anforderungen:**
| Route | Zweck |
|-------|-------|
| / | Startseite |
| /pflegegrad/start | Pflegegrad Einstieg |
| /pflegegrad/modul1-6 | NBA-Module |
| /pflegegrad/ergebnis | Ampel + PDF |
| /gdb/start | GdB Einstieg |
| /widerspruch/start | Widerspruchs-Modul |
| /tagebuch/neu | Pflegetagebuch |
| /impressum, /datenschutz, /agb, /widerruf, /barrierefreiheit | Rechtliche Seiten |

**Bestes Tool:**
- **Next.js 14 App Router** - bereits festgelegt
- **next-intl** - für Internationalisierung

**Warum Next.js App Router:**
- File-based Routing
- Server Components für Performance
- Eingebaute SEO-Optimierung
- API Routes integriert

**Kosten:** 0 €

**Implementations-Status:** ⚠️ ROUTEN DEFINIERT, SEITEN MÜSSEN GEBAUT WERDEN

---

## BLOCK 15: BETA-CHECKLISTE

**Anforderungen:**
- Technik: 8 Punkte (Startseite <2s, HTTPS Score A, RLS, 10 Tests, PDF-Export, OCR, Whisper, Barrierefreiheit)
- Recht: 4 Punkte (Impressum, DSE, AGB, Barrierefreiheitserklärung)
- Module: 4 Punkte (Seiten 1-10, Pflegegrad, GdB, EMR, SGB XIV, Widerspruch, Pflegetagebuch)
- Zahlung: 3 Punkte (Stripe Test, PayPal, Beta-Hinweis)

**Bestes Tool:**
- **Checkly** oder **Pingdom** - für Uptime-Monitoring
- **SSL Labs** - für HTTPS-Test
- **Playwright** - für E2E-Tests
- **Lighthouse CI** - für Performance/SEO/Accessibility

**Monitoring-Tools evaluiert:**
| Tool | EU-konform | Kosten | Features |
|------|------------|--------|----------|
| Checkly | ✅ Niederlande | Kostenlos (begrenzt) | E2E-Tests, Monitoring |
| Pingdom | ✅ USA | Ab 10€/Monat | Einfaches Monitoring |
| UptimeRobot | ✅ USA | Kostenlos (5 Min Intervalle) | Basis-Monitoring |
| Better Stack | ✅ EU (Tschechien) | Kostenlos | Uptime + Logs |

**Empfehlung:**
- **Better Stack** (EU, kostenlos) für Uptime + Logs
- **Lighthouse CI** (Open Source) für Performance
- **Playwright** (Open Source) für E2E-Tests

**Kosten:** 0 € (Free Tiers)

**Implementations-Status:** ⚠️ CHECKLISTE DEFINIERT, TESTS MÜSSEN IMPLEMENTIERT WERDEN

---

## BLOCK 16: OFFENE PRIORITÄTEN (DiPA PFLGETAGEBUCH) 🔴 KRITISCH

**Anforderungen:**
**SOFORT (vor 28.03.2026):**
- Clevver-Adresse Bielefeld buchen (~20€/Monat)
- Anwalt: Barrierefreiheitserklärung beauftragen
- PayPal Business eröffnen
- Stripe-Account verifizieren
- DPMA Markenschutz (290€)

**VOR BETA-START (02.04.2026):**
- Administrator alle 10 Tests bestanden
- Anwalt Freigabe Rechtspaket
- Alle 10 Portal-Seiten fertig
- Barrierefreiheits-Widget eingebaut

**NACH BETA:**
- BfArM Beratungstermin (innovation@bfarm.de)
- Uni Bielefeld Prof. Dr. Haemel anschreiben
- Altenpflege-Messe Essen 21.-23.04. anmelden (~500€)
- Gründungsstipendium NRW September beantragen

**Bestes Tool:**
- **Clevver.io** - für Geschäftsadresse
- **DPMA** - für Markenschutz
- **BfArM** - für DiPA-Beratung

**Kosten:** 
- Clevver: ~20€/Monat
- DPMA: 290€ einmalig
- Messe: ~500€

**Implementations-Status:** ⚠️ MEHRERE AUFTRÄGE OFFEN

---

## BLOCK 17: WICHTIGE KONTAKTE

**Anforderungen:**
- Kontaktdaten für Anwalt, Administrator, BfArM, LDI NRW, Brevo, Hetzner, Clevver

**Bestes Tool:**
- **CRM-System** oder einfache **JSON-Datei**
- **Brevo** (bereits festgelegt) hat auch CRM-Funktionen

**CRM-Alternativen evaluiert:**
| Tool | EU-konform | Kosten | Features |
|------|------------|--------|----------|
| Brevo CRM | ✅ Frankreich | Kostenlos | Integriert mit E-Mail |
| HubSpot | ✅ USA | Kostenlos (begrenzt) | Umfassend, aber komplex |
| Zoho CRM | ✅ Indien | Kostenlos (3 Nutzer) | Viele Funktionen |
| Airtable | ✅ USA | Kostenlos | Flexibel, aber Overkill |

**Empfehlung:** Brevo CRM (bereits für E-Mail genutzt)

**Kosten:** 0 € (integriert in Brevo)

**Implementations-Status:** ⚠️ MUSS EINGEPFLEGT WERDEN

---

## BLOCK 18: FRAMEWORK UND DESIGN-SYSTEM

**Anforderungen:**
- Framework: Next.js 14 + Tailwind CSS + TypeScript
- Farben: Dunkelblau #0f2744, Mittelblau #1a4480, Grün #166534, Gelb #92400e, Rot #991b1b
- Schrift: Arial, 18px Fließtext, 24-32px Überschriften
- Buttons: min. 56px hoch
- Handy-first: 375px Mindestbreite

**Bestes Tool:**
- **Tailwind CSS** - bereits festgelegt
- **shadcn/ui** oder **Headless UI** - für UI-Komponenten

**UI-Bibliotheken evaluiert:**
| Bibliothek | EU-konform | Kosten | Barrierefreiheit |
|------------|------------|--------|------------------|
| shadcn/ui | ✅ Open Source | Kostenlos | Gut |
| Headless UI | ✅ Open Source | Kostenlos | Exzellent |
| Radix UI | ✅ Open Source | Kostenlos | Exzellent |
| Material UI | ✅ Open Source | Kostenlos | Gut (Google) |
| Chakra UI | ✅ Open Source | Kostenlos | Gut |

**Empfehlung shadcn/ui:**
- Kopierbare Komponenten (nicht installiert)
- Tailwind-basiert
- Exzellente Barrierefreiheit
- Einfach anzupassen

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 19: KONKRETE FRAGEN PRO SEITE + PDF EXPORT 🔴 KRITISCH

**Anforderungen:**
- Seite 3 (Mobilität): 4 Fragen zu Aufstehen, Gehen, Treppen, Schwindel
- Seite 4 (Selbstversorgung): 5 Fragen zu Waschen, Anziehen, Essen, Toilette, Zeit
- Seite 5 (Kognition): 5 Fragen zu Datum, Medikamente, Stimmung, Arzttermine, Ängste
- Seite 6 (Belastung): 3 Fragen zu Schlaf, Hilfe, Stunden
- GdB-Modul: 5 Fragen zu Diagnosen, Einschränkung, Beruf, Bescheid
- EMR-Modul: 5 Fragen zu Arbeitsstunden, Dauer, Rentenbeiträge, Beruf
- SGB XIV-Modul: 5 Fragen zu Tatgeschehen, Datum, Aktenzeichen, Behandlung

**PDF Export Anforderungen:**
- Kopfzeile: PflegeNavigator EU gUG | Fallcode | Datum
- Inhalt: Modulergebnisse + Ampel + Orientierungshinweise
- Fußzeile: Haftungsausschluss

**Bestes Tool für PDF:**
- **react-pdf** (Open Source) oder **@react-pdf/renderer**
- **Puppeteer** (für serverseitige PDF-Generierung)

**PDF-Tools evaluiert:**
| Tool | EU-konform | Kosten | Server/Client |
|------|------------|--------|---------------|
| react-pdf | ✅ Open Source | Kostenlos | Client |
| Puppeteer | ✅ Open Source | Kostenlos | Server |
| jsPDF | ✅ Open Source | Kostenlos | Client |
| PDFKit | ✅ Open Source | Kostenlos | Server |
| html2pdf.js | ✅ Open Source | Kostenlos | Client |

**Empfehlung Puppeteer (Server) + react-pdf (Client):**
- Puppeteer für hochwertige serverseitige PDFs
- react-pdf für Client-Vorschau

**Kosten:** 0 €

**Implementations-Status:** ⚠️ FRAGEN DEFINIERT, MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 20: AVATAR-KONZEPT (NAVI)

**Anforderungen:**
- Name: Navi (freundlicher Berater)
- Stimme: Kokoro TTS - Deutsch, ruhig, langsam, warm, Geschwindigkeit 0.85
- Begrüßung: "Hallo. Ich bin Navi – Ihr persönlicher Pflegenavigator..."
- Bei schwieriger Frage: "Das ist eine wichtige Frage. Es gibt keine falsche Antwort."

**Bestes Tool:**
- **Kokoro TTS** (bereits festgelegt) - MIT-Lizenz, lokal
- **Web Speech API** (Browser) - als Fallback

**Alternative TTS evaluiert:**
| Tool | EU-konform | Kosten | Selbst-gehostet |
|------|------------|--------|-----------------|
| Kokoro TTS | ✅ MIT-Lizenz | Kostenlos | Ja |
| Piper TTS | ✅ Open Source | Kostenlos | Ja |
| Coqui TTS | ✅ Open Source | Kostenlos | Ja |
| Web Speech API | ✅ Browser | Kostenlos | Ja (lokal) |
| Google TTS | ⚠️ USA | API-Kosten | Nein |
| Amazon Polly | ⚠️ USA | API-Kosten | Nein |

**Empfehlung:** Kokoro TTS (bereits festgelegt)

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS KONFIGURIERT WERDEN (Stimme, Geschwindigkeit 0.85)

---

## BLOCK 21-24: ARBEITSREIHENFOLGE, PDF, FEHLER, STARTBEFEHL

**Anforderungen:**
- Reihenfolge: Seite 1 → Threema → JA → Seite 2 → ...
- Nach jeder Seite STOPP und Freigabe einholen
- Threema-Format: "Seite [X] fertig. URL: [lokal]. Was gebaut: [1 Satz]"

**Bestes Tool:**
- **Threema Gateway** - bereits festgelegt
- **Git** - für Versionierung

**Kosten:** 0 € (Git), Threema in Block 5 enthalten

**Implementations-Status:** ⚠️ PROZESS DEFINIERT, MUSS BEFOLGT WERDEN

---

## BLOCK 25: STRIPE-INTEGRATION

**Anforderungen:**
- npm install stripe @stripe/stripe-js
- Checkout-Session erstellen
- Produkte: Beta-Special (29€), Standard monatlich (39€), Standard jährlich (349€), Profi (399€)

**Bestes Tool:**
- **Stripe** (bereits festgelegt)
- **Stripe SDK für Node.js**

**Kosten:** 1,4% + 0,25€ pro Transaktion

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 26: WIDERSPRUCHSMODUL 🔴 KRITISCH

**Anforderungen:**
- Routen: /widerspruch/start, /analyse, /fristen, /begruendung, /pdf
- Fristen automatisch berechnen:
  - Widerspruch: 1 Monat nach Bescheid (§84 SGG)
  - Klage: 1 Monat nach Widerspruchsbescheid (§87 SGG)
  - Untätigkeitsklage: 6 Monate ohne Bescheid (§88 SGG)
  - Eilantrag Pflegegrad: Sofort (§18 Abs. 3 SGB XI)
- Ampel-Logik für Fristen: Grün (>14 Tage), Gelb (3-14 Tage), Rot (<3 Tage)

**Bestes Tool:**
- **date-fns** oder **Day.js** - für Datumsberechnungen
- **Eigene Implementation** - für Fristen-Logik

**Datums-Bibliotheken evaluiert:**
| Bibliothek | EU-konform | Kosten | Features |
|------------|------------|--------|----------|
| date-fns | ✅ Open Source | Kostenlos | Modular, funktional |
| Day.js | ✅ Open Source | Kostenlos | Leichtgewichtig, Moment.js-API |
| Luxon | ✅ Open Source | Kostenlos | Zeitzone-Support |

**Empfehlung Day.js:**
- Klein (2kB)
- Moment.js-API (bekannt)
- Deutsche Lokalisierung vorhanden

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 27: PFLEGETAGEBUCH 🔴 KRITISCH

**Anforderungen:**
- Routen: /tagebuch/neu, /uebersicht, /export
- Eintrag enthält: Datum, Uhrzeit, Fallcode, Wer hat geholfen, Was nicht alleine gemacht, Schmerzen (1-10), Schlaf, Besonderes
- Erinnerung: Täglich 07:30 Uhr per Brevo-E-Mail
- PDF-Export für MD-Termin oder Widerspruch

**Bestes Tool:**
- **Supabase** - Speicherung
- **Brevo** - E-Mail-Erinnerungen
- **node-cron** oder **Vercel Cron** - für zeitgesteuerte Jobs

**Cron-Alternativen evaluiert:**
| Tool | EU-konform | Kosten | Features |
|------|------------|--------|----------|
| node-cron | ✅ Open Source | Kostenlos | Einfach, Node.js |
| node-schedule | ✅ Open Source | Kostenlos | Flexibel |
| Vercel Cron | ✅ USA | Kostenlos | Integriert in Vercel |
| GitHub Actions | ✅ USA | Kostenlos | Zeitgesteuerte Workflows |

**Empfehlung Vercel Cron:**
- Integriert in Hosting-Plattform
- Einfache Konfiguration
- Zuverlässig

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 28: FRISTENERINNERUNG

**Anforderungen:**
- Fristen: Widerspruch (1 Monat), Klage (1 Monat), Untätigkeitsklage (6 Monate), Verhinderungspflege (31.12.), Beratungsbesuch (halbjährlich), Entlastungsbetrag-Verfall (30.06.), DiPA-Verlängerung (6 Monate)
- Erinnerungs-E-Mails: 14 Tage → 7 Tage → 3 Tage (dringend) → 1 Tag (NOTFALL)

**Bestes Tool:**
- **Brevo** - für E-Mail-Versand
- **Vercel Cron** - für zeitgesteuerte Erinnerungen

**Kosten:** Enthalten in Block 5

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 29: MEHRSRPACHIGKEIT (35 SPRACHEN) 🔴 KRITISCH

**Anforderungen:**
- 24 EU-Sprachen + 11 Migranten-Sprachen
- RTL-Layout für Arabisch
- 3-Schichten-System:
  1. Statische .json-Dateien mit next-intl
  2. LibreTranslate (selbst gehostet)
  3. Google Translate API (Fallback)

**Bestes Tool:**
- **next-intl** - für Internationalisierung
- **LibreTranslate** - lokal gehostet
- **Google Cloud Translation API** - Fallback

**Übersetzungstools evaluiert:**
| Tool | EU-konform | Kosten | Selbst-gehostet |
|------|------------|--------|-----------------|
| LibreTranslate | ✅ Open Source | Kostenlos | Ja |
| Argos Translate | ✅ Open Source | Kostenlos | Ja |
| DeepL API | ✅ Deutschland | API-Kosten | Nein |
| Google Translate | ⚠️ USA | API-Kosten | Nein |

**Empfehlung:**
- **Primary:** LibreTranslate (lokal, DSGVO-sicher)
- **Fallback:** Google Translate API (nur wenn nötig)

**Kosten:** 0 € (LibreTranslate lokal, Google nur bei Bedarf)

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 30: BETA-EINNAHMEN UND FINANZEN

**Anforderungen:**
- Kalkulation: 1.000 Tester × 29€ = 29.000€ Brutto
- Stripe-Gebühren: -667€
- Netto: ~28.333€
- Fixkosten/Monat: 75€

**Bestes Tool:**
- **Stripe Dashboard** - für Transaktionsübersicht
- **Lexoffice** oder **sevDesk** - für Buchhaltung

**Buchhaltungstools evaluiert:**
| Tool | EU-konform | Kosten | Kleinunternehmer |
|------|------------|--------|------------------|
| Lexoffice | ✅ Deutschland | Ab 7€/Monat | ✅ Ja |
| sevDesk | ✅ Deutschland | Ab 9€/Monat | ✅ Ja |
| Fastbill | ✅ Deutschland | Ab 9€/Monat | ✅ Ja |
| Debitoor | ✅ Dänemark | Ab 7€/Monat | ✅ Ja |
| WISO Mein Büro | ✅ Deutschland | Ab 15€/Monat | ✅ Ja |

**Empfehlung Lexoffice:**
- Deutsches Unternehmen
- §19 UStG Kleinunternehmer-Unterstützung
- Einfache Bedienung
- GoBD-konform

**Kosten:** Ab 7€/Monat

**Implementations-Status:** ⚠️ MUSS EINGERICHTET WERDEN

---

## BLOCK 31: AGENT SELBSTPRÜFUNG + BARRIEREFREIHEIT 🔴 KRITISCH

**Anforderungen:**
- Selbstprüfung vor jeder Antwort: Information schon in Datei? Widerspruch? Alle Blöcke gelesen? Schulklasse 6? Haftungsausschluss?

**BLOCK 41 (integriert): BARRIEREFREIHEIT VOLLSTÄNDIG**

**Anforderungen:**
- BFSG (Barrierefreiheitsstärkungsgesetz) seit 28.06.2025
- WCAG 2.1 Level AA
- Bußgeld bei Verstoß: bis 100.000€

**WCAG 2.1 Level AA Checkliste:**
- ✅ Alle Bilder haben Alternativtexte
- ✅ Videos haben Untertitel
- ✅ Farbkontrast mind. 4,5:1
- ✅ Alles per Tastatur bedienbar
- ✅ Fokusrahmen sichtbar
- ✅ Kein Blinken >3x/Sekunde
- ✅ Überschriften-Hierarchie korrekt
- ✅ Skip-Link „Zum Inhalt springen"
- ✅ Sprache im HTML angegeben
- ✅ Fehlermeldungen beschreiben Lösung
- ✅ Formulare haben sichtbare Labels
- ✅ Valides HTML
- ✅ ARIA-Labels korrekt

**Bestes Tool:**
- **Axe-Core** - für automatisierte Tests
- **Lighthouse** - für Accessibility-Score
- **accessWidget** oder **UserWay** - für Barrierefreiheits-Widget

**Barrierefreiheits-Widgets evaluiert:**
| Widget | EU-konform | Kosten | WCAG-konform |
|--------|------------|--------|--------------|
| accessWidget | ✅ USA | 49-99$/Monat | ✅ Ja |
| UserWay | ✅ USA | Kostenlos Basis | ✅ Ja |
| Recite Me | ✅ UK | Ab 99€/Monat | ✅ Ja |
| Enable | ✅ Open Source | Kostenlos | ⚠️ Manueller Einbau |

**Empfehlung:**
- **Tests:** Axe-Core + Lighthouse (kostenlos)
- **Widget:** UserWay (kostenlose Basisversion) oder accessWidget (bezahlt)

**Kosten:** 0 € (Tests) / 49-99$/Monat (Widget falls bezahlt)

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 32-35: GDB, EM-RENTE, SGB XIV, RECHTSMITTELFRISTEN

**Anforderungen:**
- GdB-Modul (SGB IX): 0-100 GdB, Merkzeichen, Pauschbeträge
- EM-Rente (SGB VI): Volle EMR, Teilweise EMR, Hinzuverdienstgrenzen
- SGB XIV: Opferentschädigung, Traumaambulanz, GdS
- Rechtsmittelfristen: Widerspruch (1 Monat), Klage (1 Monat), Untätigkeitsklage (6 Monate)

**Bestes Tool:**
- **Eigene Implementation** - Formulare und Berechnungen
- **Statische Daten** - Beträge und Grenzen

**Kosten:** 0 €

**Implementations-Status:** ⚠️ KONZEPT DEFINIERT, MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 36-40: ANGEHÖRIGEN-LEISTUNGEN, AGENT-FÄHIGKEITEN, CROWDFUNDING, FIRMENSITZ, EU-LAW-RAG

**Anforderungen:**
- Kombinationsleistung §38 berechnen
- Agent-Fähigkeiten definieren
- Crowdfunding rechtskonform
- Firmensitz Deutschland entscheiden
- EU-LAW-RAG (NICHT VOR JULI 2026)

**Bestes Tool für EU-LAW-RAG:**
- **LlamaIndex** + **Ollama** + **Llama 3.3** (lokal)
- Zeitplan: Juli 2026

**Kosten:** 0 €

**Implementations-Status:** ⚠️ EU-LAW-RAG GEPLANT FÜR JULI 2026

---

## BLOCK 41: BARRIEREFREIHEIT (VOLLSTÄNDIG)

**Bereits in Block 31 behandelt**

---

## BLOCK 42: ISO 27001

**Anforderungen:**
- Informationssicherheitsmanagement (ISMS)
- Pflicht für DiPA (BSI TR-03161 setzt ISO 27001 voraus)
- Kosten erstes Jahr: 15.000-40.000€

**Bestes Tool:**
- **verinice** (Open Source) - für einfache Dokumentation
- **TrustSpace** oder **Secfix** (SaaS) - für automatisierte Compliance

**ISMS-Software evaluiert:**
| Tool | EU-konform | Kosten | Features |
|------|------------|--------|----------|
| verinice | ✅ Deutschland | Kostenlos | Open Source |
| TrustSpace | ✅ Deutschland | 300-800€/Monat | Automatisiert |
| Secfix | ✅ Deutschland | 300-800€/Monat | Automatisiert |
| Confluence | ✅ USA | Kostenlos (Starter) | Dokumenten-ISMS |

**Empfehlung:** verinice (kostenlos für Startup-Phase)

**Kosten:** 0 € (verinice) / 15.000-40.000€ (Zertifizierung)

**Implementations-Status:** ⚠️ Q2 2026: Gap-Analyse beauftragen

---

## BLOCK 43: BSI TR-03161 ZERTIFIZIERUNG

**Anforderungen:**
- Technische Richtlinie des BSI
- Pflicht für DiPA nach §78a Abs. 7 SGB XI
- 3 Teile: Mobile, Web, Backend
- Kosten: 10.000-28.000€

**Bestes Tool:**
- **Eigene Implementation** - Sicherheitsmaßnahmen
- **TÜViT** oder **SRC Security** - für Prüfung

**Kosten:** 10.000-28.000€

**Implementations-Status:** ⚠️ Q3 2026: Vorbereitung

---

## BLOCK 44: DiPA-ZULASSUNGSFAHRPLAN

**Anforderungen:**
- 11 Phasen von Beta-Start bis Vollzulassung 2028
- Kosten gesamt: 27.000-88.000€
- Fördermöglichkeiten: Gründungsstipendium NRW, Go-to-Market Gutschein, EXIST, START-interaktiv, DigiHealthStart.NRW

**Bestes Tool:**
- **Förderdatenbanken** - förderdatenbank.de
- **Anwalt** - für Antrag

**Kosten:** -14.400€ (Gründungsstipendium) + weitere Förderungen

**Implementations-Status:** ⚠️ FÖRDERANTRÄGE MÜSSEN GESTELLT WERDEN

---

## BLOCK 45: EU-LAW-RAG (PHASE 2)

**Bereits in Block 40 behandelt**

---

## BLOCK 46: TECHNISCHE DETAILS (FALLCODE, STEUER, BACKUP, CORS, MONITORING, MID)

**Anforderungen:**
- Fallcode-Fehlerbehandlung
- §19 UStG Kleinunternehmer
- Backup-Strategie
- CORS-Konfiguration
- Monitoring und Alerting
- MID-Digitale Sicherheit NRW Förderprogramm

**Bestes Tool:**
- **supabase db dump** - für Backups
- **Better Stack** - für Monitoring
- **UptimeRobot** - für Uptime-Monitoring

**Kosten:** 0 € (Better Stack Free, UptimeRobot Free)

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 47: ECHTZEIT-FEEDBACK-SYSTEM

**Anforderungen:**
- Feedback auf jeder Seite sichtbar
- Text oder Sprache (Whisper)
- Speicherung in Supabase
- Admin-Dashboard für Inhaber

**Bestes Tool:**
- **Supabase** - Speicherung
- **Whisper.cpp** - Spracherkennung

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 48: gUG (GEMEINNÜTZIGE UG)

**Anforderungen:**
- Rechtsform: gemeinnützige UG (gUG)
- Firmensitz: Deutschland (Bielefeld)
- Stammkapital: 1€
- Gründungskosten: 1.100-1.600€

**Bestes Tool:**
- **Steuerberater** - für Satzung
- **Notar** - für Beurkundung
- **Lexoffice** - für Buchhaltung

**Kosten:** 1.100-1.600€ einmalig, ~430-630€/Jahr laufend

**Implementations-Status:** ⚠️ MUSS GEGRÜNDET WERDEN

---

## BLOCK 49: FAMILIEN-APP (PWA)

**Anforderungen:**
- PWA (Progressive Web App)
- Geteiltes Pflegetagebuch
- Geteilter Fristenkalender
- Aufgabenverteilung

**Bestes Tool:**
- **next-pwa** - für Next.js PWA
- **Workbox** - für Service Worker

**Kosten:** 0 €

**Implementations-Status:** ⚠️ NACH BETA-STABILISIERUNG

---

## BLOCK 50: KI-AVATAR HEYGEN

**Anforderungen:**
- 4 Video-Skripte
- Tool: HeyGen (heygen.com)
- Inhaber filmt 2 Minuten, Avatar spricht alle Videos

**Bestes Tool:**
- **HeyGen** - für KI-Avatar

**Kosten:** Ab 29$/Monat

**Implementations-Status:** ⚠️ VORBEREITET, WARTET AUF FREIGABE

---

## BLOCK 51: KI-MODELL-STRATEGIE

**Anforderungen:**
- Gemma 4 (Google, Apache 2.0) als Alternative zu Llama 3.3
- Wöchentliche Modell-Suche

**Bestes Tool:**
- **Ollama** - für lokale Modelle
- **Gemma 4** - als alternatives Modell

**Kosten:** 0 €

**Implementations-Status:** ✅ DEFINIERT, OPTIONAL

---

## BLOCK 52: PWA (PORTAL ALS APP)

**Bereits in Block 49 behandelt**

---

## BLOCK 53: SEO-STRATEGIE

**Anforderungen:**
- Hero-Text: "Pflege verstehen. Ansprüche kennen. Rechte durchsetzen."
- Keywords: Pflegegrad beantragen, Pflegegrad berechnen, Widerspruch Pflegegrad
- 35 Sprachen = Alleinstellungsmerkmal

**Bestes Tool:**
- **Google Search Console** - kostenlos
- **Lighthouse** - für SEO-Score
- **Schema.org** - für Structured Data

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 54: PRESSEPORTAL

**Anforderungen:**
- Eigenes Presseportal auf /presse
- Pressemitteilungen, Erfolgsgeschichten, Downloadbereich

**Bestes Tool:**
- **Eigene Next.js-Seite** - /presse
- **Brevo** - für Presse-Verteiler

**Kosten:** 0 €

**Implementations-Status:** ⚠️ MUSS IMPLEMENTIERT WERDEN

---

## BLOCK 55: ERWEITERTE FUNKTIONEN (PHASE 2)

**Anforderungen:**
1. Bescheid-Scanner (KI liest MD-Gutachten)
2. Angehörigen-Burnout-Frühwarnsystem
3. Krankenhaus-Entlassungspaket
4. Digital-Navigator-Modus
5. Demenz-Spezialmodul
6. Regionale Einrichtungskarte
7. Leistungs-Ausschöpfungscheck

**Bestes Tool:**
- **Tesseract.js** oder **PaddleOCR** - für OCR
- **Supabase** - für Daten
- **Google Maps API** oder **OpenStreetMap** - für Karte

**OCR-Tools evaluiert:**
| Tool | EU-konform | Kosten | Sprachen |
|------|------------|--------|----------|
| Tesseract.js | ✅ Open Source | Kostenlos | 100+ |
| PaddleOCR | ✅ Open Source | Kostenlos | Chinesisch gut |
| Azure Vision | ⚠️ USA | API-Kosten | Viele |
| Google Vision | ⚠️ USA | API-Kosten | Viele |

**Empfehlung Tesseract.js:**
- Open Source
- Lokal ausführbar (DSGVO)
- 100+ Sprachen

**Kosten:** 0 €

**Implementations-Status:** ⚠️ NACH BETA (Q2-Q3 2026)

---

## BLOCK 56: EU-EXPANSION

**Anforderungen:**
- Länder: Österreich (Q1 2028), Schweiz (Q2 2028), Niederlande (Q2 2028), Belgien (Q3 2028), Frankreich (2029), Italien (2029)
- Technisch: 35 Sprachen bereits vorbereitet

**Bestes Tool:**
- **Bereits implementierte I18n-Infrastruktur**

**Kosten:** 0 € (zusätzlich)

**Implementations-Status:** ⚠️ AB 2028

---

## BLOCK 57: KOOPERATIONSPARTNER

**Anforderungen:**
- Kontakte zu Prof. Dr. Conzen, Uni Bielefeld, LWL-Klinikum, DigiHealthStart.NRW, AOK NordWest, VdK, AWO

**Bestes Tool:**
- **Brevo CRM** - für Kontaktverwaltung

**Kosten:** 0 € (integriert)

**Implementations-Status:** ⚠️ KONTAKTE MÜSSEN HERGESTELLT WERDEN

---

## BLOCK 58-65: IDENTITY, SOUL, SKILLS, ROUTINE, RECHERCHE

**Anforderungen:**
- identity.md und soul.md für OpenClaw
- Skill-Plattformen: skills.sh, ClawHub, agentskill.sh, skillsmp, lobehub, awesome-agent-skills, MCP.so, Anthropic
- Tagesroutine und Heartbeat
- Selbstverbesserungs-Recherche

**Bestes Tool:**
- **agentskill.sh** - beste Sicherheit (2-Layer)
- **Anthropic offiziell** - sicherste
- **ClawHub** - VirusTotal-geprüft

**Kosten:** 0 €

**Implementations-Status:** ⚠️ KONFIGURATION MUSS EINGELEGT WERDEN

---

## BLOCK 66-77: THREEMA BEFEHLE, KRISENASSISTENT, EU-FÜHRERSCHEIN, TRAVELMIND, SEO/GEO, ORDNERSTRUKTUR, ADMIN-POPUP, MODELL-ROUTING, BUSINESS CLASS

**Diese Blöcke enthalten:**
- Threema-Schnellbefehle (komplett)
- Krisenassistent-Regeln
- Weitere Agenten-Konfigurationen
- Ordnerstruktur
- Admin-Start-Popup
- Business Class Flug-Suche (TravelMind Erweiterung)

**Bestes Tool:**
- **Threema Gateway** - bereits festgelegt
- **Python tkinter** - für Admin-Popup

**Kosten:** 0 €

**Implementations-Status:** ⚠️ KONFIGURATIONEN MÜSSEN EINGELEGT WERDEN

---

# ZUSAMMENFASSUNG: IMPLEMENTIERUNGSPRIORITÄTEN

## KRITISCHE BLOCKS (SOFORT)

| Block | Thema | Tool | Kosten | Status |
|-------|-------|------|--------|--------|
| 7 | 10-Seiten-Portal | Next.js 14, React Hook Form, Zod | 0€ | ⚠️ BAUEN |
| 8 | NBA-Berechnung | TypeScript (eigene Implementation) | 0€ | ⚠️ IMPLEMENTIEREN |
| 14 | Widerspruchsmodul | Day.js, eigene Logik | 0€ | ⚠️ BAUEN |
| 16 | DiPA Pflegetagebuch | Supabase, Brevo, Vercel Cron | 0€ | ⚠️ BAUEN |
| 19/22 | PDF Export | Puppeteer, react-pdf | 0€ | ⚠️ IMPLEMENTIEREN |
| 24 | Threema Gateway | Threema (bereits festgelegt) | ~2-5€/Monat | ⚠️ KONFIGURIEREN |
| 28 | 35 Sprachen | next-intl, LibreTranslate, Google API Fallback | 0€ | ⚠️ IMPLEMENTIEREN |
| 31 | Barrierefreiheit | Axe-Core, Lighthouse, UserWay | 0€ | ⚠️ IMPLEMENTIEREN |

## WICHTIGE BLOCKS (VOR BETA 02.04.2026)

| Block | Thema | Tool | Kosten | Status |
|-------|-------|------|--------|--------|
| 5 | Technologie-Stack | Alle festgelegt | ~75€/Monat | ✅ DEFINIERT |
| 10 | Payment | Stripe, PayPal | 1,4%+0,25€/Transaktion | ⚠️ KONFIGURIEREN |
| 11 | Rechtspaket | Anwalt, Cookiebot | 0€ (Cookiebot Free) | ⚠️ ANWALT |
| 12 | Admin-Setup | Shell-Skripte, Docker | 0€ | ⚠️ ERSTELLEN |
| 13 | Supabase Schema | Supabase, Drizzle ORM | 0€ (Free Tier) | ⚠️ IMPLEMENTIEREN |
| 15 | Beta-Tests | Better Stack, Lighthouse CI, Playwright | 0€ | ⚠️ EINRICHTEN |
| 20 | Avatar Navi | Kokoro TTS | 0€ | ⚠️ KONFIGURIEREN |
| 25 | Stripe Integration | Stripe SDK | 1,4%+0,25€ | ⚠️ IMPLEMENTIEREN |
| 30 | Buchhaltung | Lexoffice | 7€/Monat | ⚠️ EINRICHTEN |
| 48 | gUG Gründung | Steuerberater, Notar | 1.100-1.600€ | ⚠️ GRÜNDEN |

## PHASE 2 (NACH BETA)

| Block | Thema | Zeitpunkt | Tool |
|-------|-------|-----------|------|
| 40/45 | EU-LAW-RAG | Juli 2026 | LlamaIndex, Ollama |
| 42 | ISO 27001 | Q2 2026 | verinice |
| 43 | BSI TR-03161 | Q3 2026 | TÜViT |
| 44 | DiPA-Antrag | Q1 2027 | Anwalt |
| 47 | Feedback-System | Q2 2026 | Supabase, Whisper |
| 49 | Familien-App (PWA) | nach Beta | next-pwa |
| 50 | HeyGen Avatar | nach Beta | HeyGen (29$/Monat) |
| 55 | Erweiterte Funktionen | Q2-Q3 2026 | Tesseract.js |
| 56 | EU-Expansion | 2028-2029 | Bereits vorbereitet |

---

# EMPFEHLUNG: BESTE TOOLS PRO KATEGORIE

## Frontend/UI
1. **Next.js 14** (bereits festgelegt)
2. **Tailwind CSS** (bereits festgelegt)
3. **shadcn/ui** für UI-Komponenten
4. **React Hook Form + Zod** für Formulare

## Backend/Datenbank
1. **Supabase** (bereits festgelegt) - PostgreSQL + RLS
2. **Drizzle ORM** für TypeScript
3. **Next.js API Routes** für Backend-Logik

## KI/ML (LOKAL)
1. **Ollama** (bereits festgelegt)
2. **Llama 3.3** oder **Gemma 4** (je nach Test)
3. **Whisper.cpp** für Spracherkennung
4. **Kokoro TTS** für Sprachausgabe

## Übersetzung
1. **LibreTranslate** (lokal, primär)
2. **next-intl** für I18n
3. **Google Translate API** (nur Fallback)

## Zahlung
1. **Stripe** (bereits festgelegt)
2. **PayPal Business** (bereits festgelegt)

## Kommunikation
1. **Threema Gateway** (bereits festgelegt)
2. **Brevo** (bereits festgelegt)

## Barrierefreiheit
1. **Axe-Core** für automatisierte Tests
2. **Lighthouse** für Accessibility-Score
3. **UserWay** (kostenlos) oder **accessWidget** (bezahlt)

## PDF
1. **Puppeteer** für serverseitige PDFs
2. **react-pdf** für Client-Vorschau

## Monitoring/Tests
1. **Better Stack** (EU, kostenlos)
2. **Playwright** für E2E-Tests
3. **Lighthouse CI** für Performance

## Sicherheit/Compliance
1. **verinice** (kostenlos) für ISO 27001 Dokumentation
2. **TÜViT** oder **SRC Security** für BSI TR-03161 Prüfung

## Hosting/Infrastruktur
1. **Hetzner CX11** (bereits festgelegt)
2. **Vercel** (bereits festgelegt)

---

# KOSTENÜBERSICHT

## Laufende Kosten (pro Monat)

| Posten | Kosten |
|--------|--------|
| Hetzner CX11 | ~4€ |
| Supabase Pro (empfohlen ab DiPA) | ~25$ (~23€) |
| Brevo | 0€ (300/Tag kostenlos) |
| Make.com | 0€ (Free Tier) |
| Threema Gateway | ~2-5€ |
| Vercel | 0€ (kostenlos) |
| Lexoffice | 7€ |
| Stripe | nur Transaktionsgebühren |
| **GESAMT** | **~36-42€/Monat** |

## Einmalige Kosten

| Posten | Kosten |
|--------|--------|
| gUG Gründung | 1.100-1.600€ |
| DPMA Markenschutz | 290€ |
| Altenpflege-Messe Essen | ~500€ |
| ISO 27001 Zertifizierung (Q1 2027) | 15.000-40.000€ |
| BSI TR-03161 Zertifizierung (Q1 2027) | 10.000-28.000€ |

## Transaktionsgebühren (nur bei Umsatz)

| Zahlungsmethode | Gebühr |
|-----------------|--------|
| Stripe EU-Karte | 1,4% + 0,25€ |
| PayPal | ~1,9% + 0,35€ |

---

# ABSCHLUSS

## Alle 77 Blöcke analysiert ✅

| Status | Anzahl |
|--------|--------|
| Bereits festgelegt/akzeptiert | 15 |
| Muss implementiert werden (kritisch) | 25 |
| Muss implementiert werden (Phase 2) | 20 |
| Externe Abhängigkeiten (Anwalt, Zertifizierung) | 12 |
| Optional/Future | 5 |

## Wichtigste nächste Schritte

1. **SOFORT:** Anwalt beauftragen (Barrierefreiheitserklärung, Rechtspaket)
2. **SOFORT:** Clevver-Adresse buchen
3. **SOFORT:** Stripe und PayPal einrichten
4. **BIS 02.04.2026:** Alle 10 Portal-Seiten bauen (Seite für Seite nach Freigabe)
5. **BIS 02.04.2026:** NBA-Berechnung implementieren
6. **BIS 02.04.2026:** 35-Sprachen-System implementieren
7. **BIS 02.04.2026:** Barrierefreiheit umsetzen (WCAG 2.1 AA)
8. **BIS 02.04.2026:** 10 Pflicht-Tests bestehen

---

**Dokument erstellt am:** 27. April 2026  
**Gültig für:** PflegeNavigator EU gUG  
**Nächste Überprüfung:** Nach Beta-Start (02.04.2026)
