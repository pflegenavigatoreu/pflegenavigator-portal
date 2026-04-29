# BLOCK-KONFIGURATION MIT ALTERNATIVEN
**Systematische Tool-Auswahl für jeden MASTER.md Block**
**Haupttool + 2 Alternativen auf gleichem Niveau**

---

## BLOCK 7: 10 PORTAL-SEITEN (Frontend)

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Framework | Next.js 16 | 0€ | ✅ |
| UI Library | shadcn/ui | 0€ | ✅ |
| Styling | Tailwind CSS | 0€ | ✅ |
| Icons | Lucide React | 0€ | ✅ |

### Alternative 1 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Framework | Remix | 0€ | ✅ |
| UI Library | Chakra UI | 0€ | ✅ |
| Styling | Styled Components | 0€ | ✅ |
| Icons | Heroicons | 0€ | ✅ |

### Alternative 2 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Framework | SvelteKit | 0€ | ✅ |
| UI Library | Skeleton UI | 0€ | ✅ |
| Styling | UnoCSS | 0€ | ✅ |
| Icons | Phosphor Icons | 0€ | ✅ |

**Fallback-Strategie:**
- Wenn Next.js Probleme → Remix migrieren (ähnliche Struktur)
- Wenn shadcn/ui nicht passt → Chakra UI (beide React-basiert)

---

## BLOCK 8: NBA-MODULE BERECHNUNG (Logik)

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Berechnung | Eigene TypeScript Logik | 0€ | ✅ |
| Validierung | Zod | 0€ | ✅ |
| State | React Hook Form | 0€ | ✅ |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Berechnung | Ramda (FP Library) | 0€ | ✅ |
| Validierung | Yup | 0€ | ✅ |
| State | Formik | 0€ | ✅ |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Berechnung | Lodash + Eigenlogik | 0€ | ✅ |
| Validierung | Joi | 0€ | ✅ |
| State | React Final Form | 0€ | ✅ |

**Fallback-Strategie:**
- Eigene Logik ist robust, kein externes Tool nötig
- Bei Validierungs-Problemen: Zod → Yup → Joi

---

## BLOCK 10: DATENBANK

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGDO |
|------------|------|-------|-------|
| Datenbank | Supabase (PostgreSQL) | 0€ | ✅ EU |
| Auth | Supabase Auth | 0€ | ✅ |
| Storage | Supabase Storage | 0€ | ✅ |

### Alternative 1 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Datenbank | PostgreSQL selbst | 0€ | ✅ |
| Auth | Keycloak | 0€ | ✅ |
| Storage | MinIO | 0€ | ✅ |

### Alternative 2 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Datenbank | PlanetScale (MySQL) | 0€ | ✅ |
| Auth | Auth0 (EU-Region) | 0€ | ✅ |
| Storage | AWS S3 (EU) | 0€ | ⚠️ |

**Fallback-Strategie:**
- Supabase Free Tier voll → PlanetScale Free Tier
- Beide nicht verfügbar → Selbst-hosten (Hetzner + PostgreSQL)

---

## BLOCK 13: E-MAIL

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO | Limit |
|------------|------|-------|-------|-------|
| Provider | Brevo | 0€ | ✅ Frankreich | 300/Tag |

### Alternative 1 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO | Limit |
|------------|------|-------|-------|-------|
| Provider | Mailjet | 0€ | ✅ Frankreich | 200/Tag |

### Alternative 2 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO | Limit |
|------------|------|-------|-------|-------|
| Provider | Keila (Self-hosted) | 0€ | ✅ Deutschland | ∞ |

**Fallback-Strategie:**
- Brevo 300/Tag voll → Mailjet 200/Tag (parallel)
- Beide limitiert → Keila selbst hosten (kein Limit)

---

## BLOCK 14: WIDERSPRUCH (Brief-Generierung)

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| AI | Mistral Le Chat API | 0€ | ✅ Frankreich |
| Templates | Eigene (Verbraucherzentrale-basiert) | 0€ | ✅ |
| PDF | Puppeteer + Chromium | 0€ | ✅ |

### Alternative 1 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| AI | Aleph Alpha API | 0€ | ✅ Deutschland |
| Templates | Eigene | 0€ | ✅ |
| PDF | React-PDF | 0€ | ✅ |

### Alternative 2 (Gleiches Niveau)
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| AI | InnoGPT | 9,99€/Monat | ✅ Deutschland |
| Templates | Eigene | 0€ | ✅ |
| PDF | Playwright | 0€ | ✅ |

**Fallback-Strategie:**
- Mistral API down → Aleph Alpha (deutsches Modell)
- Beide nicht verfügbar → Eigene Templates ohne AI (funktioniert sofort)

---

## BLOCK 16: DiPA PFLEGETAGEBUCH

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Speicherung | Supabase Database | 0€ | ✅ |
| Export | Puppeteer PDF | 0€ | ✅ |
| Erinnerungen | OpenClaw Cron | 0€ | ✅ |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Speicherung | LocalStorage + Sync | 0€ | ✅ |
| Export | jsPDF (Client) | 0€ | ✅ |
| Erinnerungen | Browser Notifications | 0€ | ✅ |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Speicherung | IndexedDB | 0€ | ✅ |
| Export | PDFKit | 0€ | ✅ |
| Erinnerungen | Service Worker | 0€ | ✅ |

**Fallback-Strategie:**
- Supabase down → LocalStorage (Offline-Modus)
- PDF Export Server-seitig → Client-seitig (jsPDF)

---

## BLOCK 19: PDF EXPORT

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Puppeteer + Chromium | 0€ | ✅ |
| Hosting | Docker (eigen) | 0€ | ✅ |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | React-PDF | 0€ | ✅ |
| Hosting | Client-seitig | 0€ | ✅ |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Playwright | 0€ | ✅ |
| Hosting | Docker | 0€ | ✅ |

**Fallback-Strategie:**
- Puppeteer zu schwer für Server → React-PDF (Client-seitig)
- Beide nicht ideal → Playwright (lighter als Puppeteer)

---

## BLOCK 21: 35 SPRACHEN (Übersetzung)

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | LibreTranslate (Self-hosted) | 0€ | ✅ |
| Fallback | DeepL API | 20€/Monat | ✅ EU |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Argos Translate (Self) | 0€ | ✅ |
| Fallback | Google Translate API | Pay-per-use | ⚠️ USA |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Marian NMT (Self) | 0€ | ✅ |
| Fallback | Microsoft Translator | 0€ (Limit) | ⚠️ USA |

**Fallback-Strategie:**
- LibreTranslate überlastet → DeepL API (bessere Qualität, aber bezahlt)
- Beide nicht verfügbar → Argos Translate (andere Open-Source)
- Notfall: Google Translate (nur wenn unbedingt nötig, USA!)

---

## BLOCK 22: ANALYTICS

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Umami (Self-hosted) | 0€ | ✅ |
| Hosting | Docker | 0€ | ✅ |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Plausible (Cloud) | 9€/Monat | ✅ EU |
| Hosting | EU-Server | 9€ | ✅ |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Matomo (Self-hosted) | 0€ | ✅ |
| Hosting | Docker | 0€ | ✅ |

**Fallback-Strategie:**
- Umami Docker Problem → Plausible Cloud (9€, sofort einsatzbereit)
- Zu teuer → Matomo (mehr Features, auch kostenlos)

---

## BLOCK 23: MONITORING

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Uptime Kuma (Self) | 0€ | ✅ |
| Alerts | Telegram Bot | 0€ | ✅ |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Gatus (Self) | 0€ | ✅ |
| Alerts | Email (Brevo) | 0€ | ✅ |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Engine | Better Stack (Free) | 0€ | ⚠️ USA |
| Alerts | Slack/Discord | 0€ | ⚠️ |

**Fallback-Strategie:**
- Uptime Kuma down → Gatus (ähnlich, auch Docker)
- Beide nicht verfügbar → Better Stack (USA, nur Notfall)

---

## BLOCK 24: THREEMA GATEWAY

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Messenger | Threema Gateway | ~0,05€/Nachricht | ✅ Schweiz |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Messenger | Signal API | 0€ | ✅ |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| Messenger | E-Mail (Brevo) | 0€ | ✅ |

**Fallback-Strategie:**
- Threema zu teuer/Problem → Signal (kostenlos, auch sicher)
- Beide nicht verfügbar → E-Mail (funktioniert immer)

---

## BLOCK 25: VOICE-FIRST / AVATAR

### Haupt-Konfiguration
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| TTS | Kokoro TTS (Self) | 0€ | ✅ |
| STT | Web Speech API | 0€ | ✅ |
| Avatar | Eigene Animation | 0€ | ✅ |

### Alternative 1
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| TTS | Piper TTS | 0€ | ✅ |
| STT | Whisper.cpp | 0€ | ✅ |
| Avatar | Synthesia (10 Videos) | 0€ | ✅ UK |

### Alternative 2
| Komponente | Tool | Preis | DSGVO |
|------------|------|-------|-------|
| TTS | Web Speech API | 0€ | ✅ |
| STT | Browser API | 0€ | ✅ |
| Avatar | D-ID | Bezahlt | ⚠️ USA |

**Fallback-Strategie:**
- Kokoro nicht verfügbar → Piper TTS (ähnliche Qualität)
- Web Speech API nicht verfügbar → Whisper.cpp (lokal)
- Synthesia nur 10 Videos → D-ID (bezahlt, Notfall)

---

## BLOCK 28: VIDEOS (Erklärvideos)

### Haupt-Konfiguration
| Tool | Preis | Nutzen | DSGVO |
|------|-------|--------|-------|
| Synthesia | 22€/Monat | Beste Avatare | ✅ UK |

### Alternative 1 (Gleiches Niveau)
| Tool | Preis | Nutzen | DSGVO |
|------|-------|--------|-------|
| HeyGen | 24€/Monat | Emotionalste Avatare | ✅ USA* |

### Alternative 2 (Gleiches Niveau)
| Tool | Preis | Nutzen | DSGVO |
|------|-------|--------|-------|
| Colossyan | 27€/Monat | EU-Alternative | ✅ EU |

**Fallback-Strategie:**
- Synthesia zu teuer → HeyGen (ähnlicher Preis, mehr Features)
- Beide nicht DSGVO-konform genug → Colossyan (EU)
- Kostenlos: Pictory (nur 3 Videos/Monat, keine Avatare)

---

## ZUSAMMENFASSUNG FALLBACK-KETTE

```
BLOCK 7 (Frontend):
  Next.js → Remix → SvelteKit

BLOCK 8 (Logik):
  Eigene Logik (robust, keine Alternative nötig)

BLOCK 10 (Datenbank):
  Supabase → PlanetScale → Selbst-hosten

BLOCK 13 (E-Mail):
  Brevo → Mailjet → Keila (Self-hosted)

BLOCK 14 (Widerspruch):
  Mistral → Aleph Alpha → Eigene Templates

BLOCK 16 (DiPA):
  Supabase → LocalStorage → IndexedDB

BLOCK 19 (PDF):
  Puppeteer → React-PDF → Playwright

BLOCK 21 (Übersetzung):
  LibreTranslate → DeepL → Argos

BLOCK 22 (Analytics):
  Umami → Plausible → Matomo

BLOCK 23 (Monitoring):
  Uptime Kuma → Gatus → Better Stack (Notfall)

BLOCK 24 (Messenger):
  Threema → Signal → E-Mail

BLOCK 25 (Voice):
  Kokoro → Piper → Web Speech API

BLOCK 28 (Videos):
  Synthesia → HeyGen → Colossyan
```

---

**KONFIGURATION FERTIG! Alle Blöcke haben 3 Optionen auf gleichem Niveau!** ✅
