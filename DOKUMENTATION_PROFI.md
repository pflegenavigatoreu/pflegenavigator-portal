# 📚 PFLEGENAVIGATOR EU - PROFESSIONELLE DOKUMENTATION

*Vollständige technische und Benutzerdokumentation*

**Version:** 1.0.0  
**Datum:** April 2026  
**Projekt:** PflegeNavigator EU Portal  
**Lizenz:** Proprietary / Gemeinnützige Unternehmergesellschaft

---

## 📋 Inhaltsverzeichnis

### 1. API-Dokumentation
- [OpenAPI/Swagger Spezifikation](./docs/api/openapi.yaml) - Vollständige API-Dokumentation
- Alle API-Endpunkte dokumentiert
- Request/Response Beispiele
- Fehler-Codes und Authentifizierung

### 2. Entwickler-Handbuch
- [Setup & Installation](./docs/entwickler/setup.md) - Erste Schritte
- [Architektur-Übersicht](./docs/entwickler/architektur.md) - System-Architektur
- [Coding Standards](./docs/entwickler/coding-standards.md) - Code-Stil und Best Practices
- [Deployment Guide](./docs/entwickler/deployment.md) - Vercel, Docker, Self-Hosted

### 3. Betriebshandbuch
- [Monitoring](./docs/betrieb/monitoring.md) - System-Monitoring und Alerts
- [Troubleshooting](./docs/betrieb/troubleshooting.md) - Fehlerbehebung
- [Backup & Recovery](./docs/betrieb/backup-recovery.md) - Backup-Strategie
- [Update-Prozeduren](./docs/betrieb/update-prozeduren.md) - Deployments und Updates

### 4. Benutzer-Handbuch
- [Für Endnutzer](./docs/benutzer/endnutzer.md) - Einfache Sprache für alle
- [Für Pflegekräfte](./docs/benutzer/pflegekraefte.md) - Professionelle Nutzung
- [Für Angehörige](./docs/benutzer/angehoerige.md) - Unterstützung für Familien
- [FAQ](./docs/benutzer/faq.md) - Häufig gestellte Fragen

### 5. API-Referenz (src/lib/)
- [Vollständige API-Referenz](./docs/api-referenz/lib-api.md) - Alle Funktionen dokumentiert
- [JSDoc Dokumentation](./docs/api-referenz/jsdoc.md) - TypeScript/JS Referenz

---

## 🚀 Schnellstart

### Für Entwickler

```bash
# Repository klonen
git clone https://github.com/pflegenavigatoreu/portal.git
cd portal

# Dependencies installieren
npm install

# Umgebungsvariablen kopieren und anpassen
cp .env.example .env.local

# Entwicklungsserver starten
npm run dev

# Tests ausführen
npm run test
npm run test:e2e
```

### Für Betrieb

```bash
# Docker-Umgebung starten
docker-compose up -d

# Health-Check
curl http://localhost:3000/api/health

# Logs anzeigen
docker-compose logs -f portal
```

### Für Benutzer

1. **Webseite öffnen:** https://pflegenavigatoreu.com
2. **Sprache wählen:** Oben rechts (25 Sprachen verfügbar)
3. **Funktion wählen:**
   - Pflegegrad berechnen
   - Briefe generieren
   - Widerspruch vorbereiten
   - Leistungen berechnen

---

## 🏗️ Projektübersicht

### Tech Stack

| Schicht | Technologie |
|---------|-------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS Modules |
| State | Zustand, React Server Components |
| Backend | Next.js API Routes, Supabase |
| Database | PostgreSQL (Supabase) |
| i18n | next-intl (25 Sprachen) |
| PDF | Puppeteer + Chromium |
| Monitoring | Umami, Uptime Kuma, GlitchTip |
| Testing | Vitest, Playwright |

### Features

- ✅ **Pflegegrad-Rechner** - Nach NBA-Kriterien (6 Module)
- ✅ **Brief-Generator** - 7 verschiedene Brief-Typen
- ✅ **Widerspruchs-Assistent** - Mit Erfolgschance-Berechnung
- ✅ **Leistungsrechner** - Aktuelle Beträge 2026
- ✅ **Avatar-Chat** - KI-basierte Unterstützung
- ✅ **Multi-Language** - 25 Sprachen (inkl. RTL)
- ✅ **Barrierefrei** - WCAG 2.1 AA konform
- ✅ **Privacy-First** - Keine Registrierung nötig

---

## 📖 Dokumentationsstruktur

```
docs/
├── api/
│   └── openapi.yaml              # OpenAPI 3.0 Spezifikation
├── entwickler/
│   ├── setup.md                  # Installation & Einrichtung
│   ├── architektur.md            # System-Architektur
│   ├── coding-standards.md       # Code-Stil & Standards
│   └── deployment.md             # Deployment-Guide
├── betrieb/
│   ├── monitoring.md             # Monitoring & Alerting
│   ├── troubleshooting.md        # Fehlerbehebung
│   ├── backup-recovery.md        # Backup & Recovery
│   └── update-prozeduren.md      # Update-Prozesse
├── benutzer/
│   ├── endnutzer.md              # Für Endnutzer (einfach)
│   ├── pflegekraefte.md          # Für Pflegekräfte
│   ├── angehoerige.md            # Für Angehörige
│   └── faq.md                    # Häufige Fragen
└── api-referenz/
    ├── lib-api.md                # Vollständige API-Ref
    └── jsdoc.md                  # JSDoc Dokumentation
```

---

## 🔐 Security & Datenschutz

### Datenschutz-Prinzipien

- **Privacy by Design** - Keine unnötige Datenerhebung
- **Anonymisierung** - Case-Codes statt persönlicher Daten
- **DSGVO-konform** - Hosting in der EU, keine Datenweitergabe
- **Verschlüsselung** - SSL/TLS, verschlüsselte Backups

### Security-Maßnahmen

- ✅ CORS-Policy
- ✅ Rate Limiting
- ✅ Input-Validierung
- ✅ SQL-Injection Schutz (Supabase RLS)
- ✅ XSS-Prevention (React auto-escaping)
- ✅ Security Headers
- ✅ Dependencies automatisch geprüft (Dependabot)

---

## 📊 API-Übersicht

### Endpunkte

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/health` | GET | System-Health-Check |
| `/api/cases` | POST | Neuen Fall anlegen |
| `/api/cases/[code]` | GET | Fall laden |
| `/api/cases/[code]/answers` | POST | Antworten speichern |
| `/api/briefe` | GET/POST | Brief-Typen / Generieren |
| `/api/briefe/pdf` | POST | Brief als PDF |
| `/api/widerspruch` | POST | Widerspruch erstellen |
| `/api/avatar/chat` | POST | Avatar-Chat |
| `/api/gesetze` | GET | SGB-Übersicht |

### Authentifizierung

- **Client:** Supabase Anon Key (RLS Policies)
- **Server:** Service Role Key (API Routes)
- **Keine User-Accounts:** Case-Codes für Anonymität

---

## 🌐 Internationalisierung (i18n)

### Unterstützte Sprachen (25)

| Code | Sprache | RTL |
|------|---------|-----|
| de | Deutsch | - |
| en | English | - |
| fr | Français | - |
| tr | Türkçe | - |
| uk | Українська | - |
| ru | Русский | - |
| ar | العربية | ✅ |
| ... | 18 weitere | - |

---

## 🧪 Testing

### Test-Suite

```bash
# Unit-Tests (Vitest)
npm run test

# E2E-Tests (Playwright)
npm run test:e2e

# Mit UI
npm run test:e2e:ui

# Coverage
npm run test:coverage
```

### Test-Typen

- **Unit-Tests** - Logik-Funktionen (Pflegegrad-Berechnung)
- **Integration-Tests** - API-Endpunkte
- **E2E-Tests** - Komplette User-Flows
- **A11y-Tests** - Accessibility (Axe-Core)
- **Performance-Tests** - Lighthouse CI

---

## 📈 Monitoring

### Dashboards

| Service | URL | Zweck |
|---------|-----|-------|
| Portal | https://pflegenavigatoreu.com | Hauptanwendung |
| Status | https://status.pflegenavigatoreu.com | Uptime-Status |
| Analytics | https://analytics.pflegenavigatoreu.com | Umami Dashboard |
| Errors | https://errors.pflegenavigatoreu.com | GlitchTip |

### Health-Checks

```bash
# System-Health
curl https://pflegenavigatoreu.com/api/health

# DB-Health
curl https://pflegenavigatoreu.com/api/health/db

# Bereit für Traffic
curl https://pflegenavigatoreu.com/api/ready
```

---

## 🔄 Deployment

### Optionen

1. **Vercel** (empfohlen)
   ```bash
   vercel --prod
   ```

2. **Docker**
   ```bash
   docker-compose up -d
   ```

3. **Self-Hosted**
   ```bash
   npm run build
   npm start
   ```

---

## 🆘 Support

### Technischer Support
- 📧 Email: support@pflegenavigatoreu.com
- 💬 Chat: Auf der Webseite (Avatar)
- 📚 Dokumentation: Dieses Handbuch

### Fachliche Beratung
- **Pflegestützpunkt** (kostenlos, vor Ort)
- **Sozialverband VdK** (Rechtsberatung)
- **Sozialverband SoVD** (Sozialberatung)

---

## 📜 Rechtliches

### Haftungsausschluss

PflegeNavigator bietet **keine Rechtsberatung**. Alle generierten Dokumente enthalten einen Disclaimer:

> "PflegeNavigator EU gUG bietet keine Rechtsberatung, keine medizinische Beratung und keine verbindliche Auskunft über Leistungsansprüche. Die Auswertungen sind Orientierungshilfen. Verbindliche Entscheidungen treffen ausschließlich die zuständigen Stellen."

### Datenschutz

- **DSE:** https://pflegenavigatoreu.com/datenschutz
- **Impressum:** https://pflegenavigatoreu.com/impressum
- **DSGVO:** Vollständig konform

---

## 🤝 Mitwirken

Wir suchen:
- 👩‍💻 **Entwickler** (Next.js, TypeScript)
- 🌍 **Übersetzer** (25 Sprachen)
- 🧪 **Tester** (Barrierefreiheit, UX)
- 💡 **Ideen** - Feedback willkommen!

Kontakt: feedback@pflegenavigatoreu.com

---

## 📝 Änderungshistorie

| Version | Datum | Änderungen |
|---------|-------|--------------|
| 1.0.0 | 2026-04-29 | Initiale Dokumentation |

---

## 🙏 Danksagung

- An alle Pflegekräfte für ihr Feedback
- An die Open-Source-Community für die Tools
- An unsere Nutzer für ihr Vertrauen

---

**© 2026 PflegeNavigator EU gUG**
*Gemeinnützige Unternehmergesellschaft*

*Dokumentation erstellt mit ❤️ für die Pflege-Community*