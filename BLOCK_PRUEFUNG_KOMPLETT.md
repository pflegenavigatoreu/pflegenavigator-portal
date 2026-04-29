# SYSTEMATISCHE BLOCK-PRÜFUNG - ALLE 77 MASTER.md BLÖCKE

**Stand:** 27.04.2026 20:04
**Prüfer:** OpenClaw Agent
**Ziel:** Jedes Element einzeln analysieren A-B-C

---

## BLOCK 1: IDENTITÄT ✓
| Element | Status | Ort |
|---------|--------|-----|
| Name | ✅ | MASTER.md |
| Inhaber | ✅ | MASTER.md |
| Domain | ✅ | pflegenavigatoreu.com |
| E-Mail | ✅ | info@pflegenavigatoreu.com |
| Anwalt | ⚠️ | Platzhalter - MUSS gefüllt |
| Beta-Start | ⚠️ | 02.04.2026 vorbei - neues Datum? |
| Adresse | ⚠️ | Clevver-Adresse Bielefeld - MUSS eingetragen |

**Aktion:** Adresse + Anwalt eintragen

---

## BLOCK 2: EISERNE REGELN ✓
| Regel | Status | Implementiert |
|-------|--------|---------------|
| Keine Rechtsberatung | ✅ | Disclaimer auf allen Seiten |
| Kein Pflegegrad versprechen | ✅ | Ampel-System verwendet |
| Keine Diagnosen | ✅ | Nur NBA-Module |
| Keine Inhalte erfinden | ✅ | Nur Gesetze/facts |
| Keine E-Mails selbst versenden | ⚠️ | QR-Code System gebaut, Versand braucht Admin |
| Kein Geld ausgeben | ✅ | Keine Zahlungsfunktion |
| Freigabe vor externem Senden | ✅ | Warte auf JA |
| Kein staatliches Angebot | ✅ | Private gUG |
| Keine Privatadresse | ✅ | Nicht in Code |
| Keine chinesischen Tools | ✅ | Kein DeepSeek etc. |

**Aktion:** Admin für E-Mail-Versand-Freigabe

---

## BLOCK 3: 6-STUFIGE PIPELINE ✓
| Stufe | Status | Implementiert |
|-------|--------|---------------|
| Kontextagent | ✅ | MASTER.md wird gelesen |
| Kontrollagent | ✅ | Widersprüche prüfen |
| Fachagent | ✅ | Entwicklung läuft |
| Rechtsagent | ✅ | Disclaimer eingebaut |
| Sprachagent | ✅ | Einfache Sprache |
| Final-Check | ✅ | Self-Review |

---

## BLOCK 4: TRIGGER-BEFEHLE ⚠️
| Befehl | Status | Implementierung |
|--------|--------|-----------------|
| STATUS | ⚠️ | Manuelle Abfrage, nicht automatisch |
| TAGESBERICHT | ❌ | Noch nicht automatisiert |
| NAECHSTER SCHRITT | ⚠️ | Manuelle Empfehlung |
| BETA VORBEREITEN | ✅ | Block-Prüfung läuft |
| ADMINISTRATOR | ✅ | ADMIN_README_START.md |
| STOP | ✅ | Warte-Modus implementiert |
| SAFE MODE | ✅ | Keine Änderungen ohne JA |
| RECAP | ⚠️ | Manuelle Zusammenfassung |
| BETA AUFBAUEN | ⚠️ | Baue ohne Freigabe? Nein, warte auf JA |

**Aktion:** Automatische Status/Berichte einrichten

---

## BLOCK 5: TECH-STACK ✓
| Komponente | Tool | Status |
|------------|------|--------|
| KI-Agent | OpenClaw | ✅ Läuft |
| KI-Modell | Ollama + Llama | ✅ Konfiguriert |
| Spracherkennung | Whisper.cpp | ⚠️ Recherchiert, nicht integriert |
| Sprachausgabe | Kokoro TTS | ⚠️ Recherchiert, nicht integriert |
| Datenbank | Supabase Frankfurt | ✅ Eingerichtet |
| Frontend | Next.js 16 | ✅ Gebaut |
| E-Mail | Brevo | ⚠️ Account fehlt |
| Automatisierung | Make.com | ⚠️ Account fehlt |
| Payment | Stripe + PayPal | ⚠️ Accounts fehlen |
| Messenger | Threema Gateway | ⚠️ API-Key fehlt |
| VPS | Hetzner CX11 | ⚠️ Server nicht gestartet |
| Übersetzung | LibreTranslate | ✅ Docker-Config |
| Testing | Playwright | ⚠️ Noch nicht eingerichtet |

**Aktion:** Accounts anlegen / Server starten

---

## BLOCK 6: SYSTEM-ARCHITEKTUR ⚠️
| Element | Status | Problem |
|---------|--------|---------|
| Inhaber → OpenClaw | ✅ | Kommunikation läuft |
| Agent schlägt vor | ✅ | Warte auf Freigabe |
| Inhaber sagt JA/NEIN | ✅ | JA wartend |
| Threema an Admin | ⚠️ | Kein Threema API-Key |
| Administrator setzt um | ⚠️ | Admin nicht aktiv |
| Threema zurück | ⚠️ | Kein Threema |
| Agent meldet fertig | ⚠️ | Schritt fehlt |

**Aktion:** Threema + Admin Setup

---

## BLOCK 7: 10 SEITENPLAN V2.0 ⚠️
| Seite | Inhalt | Status |
|-------|--------|--------|
| 1 | Willkommen | ⚠️ /page.tsx existiert, aber nicht 3-Button-Version |
| 2 | Wer sind Sie? | ⚠️ /pflegegrad/start existiert, aber kein Rollen-Check |
| 3 | Mobilität | ✅ /pflegegrad/modul1 - ABER: AvatarChat muss noch rein |
| 4 | Selbstversorgung | ✅ /pflegegrad/modul4 - ABER: AvatarChat fehlt noch |
| 5 | Kognition/Psyche | ✅ /pflegegrad/modul2+3+5 kombiniert |
| 6 | Belastung & Schlaf | ⚠️ Integriert in Modul 3+6, aber nicht eigene Seite |
| 7 | Leistungen & Geld | ⚠️ Ergebnis-Seite hat Beträge, aber kein Rechner |
| 8 | Unterstützung & Netzwerk | ❌ NOCH NICHT GEBAUT |
| 9 | Zusammenfassung & Ampel | ✅ /pflegegrad/ergebnis - ABER: QR-Code, Widerspruch, PDF fehlen noch |
| 10 | Abschluss & DiPA | ⚠️ /tagebuch existiert, aber nicht als Seite 10 konzipiert |

**Aktion:**
- Seite 1: 3-Button Version bauen
- Seite 8: NEU bauen (Unterstützung & Netzwerk)
- Seite 9: QR-Code, Widerspruch, PDF integrieren
- AvatarChat in alle Module einbauen (läuft)

---

## BLOCK 8: NBA-MODULE UND BERECHNUNG ✓
| Modul | Gewichtung | Status |
|-------|-----------|--------|
| 1 Mobilität | 10% | ✅ Implementiert |
| 2 Kognition | 15% | ✅ Implementiert |
| 3 Verhalten | 15% | ✅ Implementiert |
| 4 Selbstversorgung | 40% | ✅ Implementiert |
| 5 Krankheiten | 20% | ✅ Implementiert |
| 6 Alltagsgestaltung | 0% | ✅ Implementiert |
| Schwellen PG 1-5 | ✓ | ✅ Korrekt |
| Ampel-Logik | ✓ | ✅ Grün/Gelb/Rot |
| Kinder-Pflegegrad | ⚠️ | Logik gebaut, aber kein UI-Switch |
| MedicProof (privat) | ⚠️ | Frage existiert, aber keine MEDICPROOF-Integration |

**Aktion:** Kinder-Modus UI + MEDICPROOF Hinweis

---

## BLOCK 9: SICHTBARKEIT / MARKETING
| Kanal | Status | Aktion |
|-------|--------|--------|
| Website | ⚠️ | Domain existiert, aber kein Content |
| Threema Broadcast | ❌ | Kein API-Key |
| YouTube Erklärfilme | ❌ | Keine Videos produziert |
| Podcast | ❌ | Keine Aufnahme |
| TIKTOK | ❌ | Keine Videos |
| Print Flyer | ❌ | Kein Design |
| Medienpartnerschaft | ❌ | Kein Kontakt |

**Aktion:** Content-Produktion nach Beta-Start

---

## BLOCK 10: ERSTKONTAKT-SYSTEM
| Element | Status |
|---------|--------|
| QR-Code zur Erfassung | ⚠️ Gebaut, aber nicht deployed |
| Nur Fallcode PF-XXXX-XXXX | ✅ Implementiert |
| Keine Namen in Datenbank | ✅ Anonymisiert |
| E-Mail nur auf Wunsch | ✅ Optional |
| Upload nur bei Bedarf | ✅ Optional |
| Threema Broadcast-Anmeldung | ⚠️ API-Key fehlt |

---

## BLOCK 11-15: Brief-Generatoren ✓
| Generator | Status | Datei |
|-----------|--------|-------|
| Widerspruch (MD/Medicproof) | ✅ | widerspruch.ts |
| Antrag Pflegegrad (MD) | ✅ | em-rente.ts erweiterbar |
| Antrag Pflegegeld (SGB XI) | ⚠️ | Logik vorhanden, keine separate UI |
| Schwerbehindertenausweis (GdB) | ⚠️ | Recherchiert, nicht gebaut |
| Krankenkassenwechsel | ❌ | Nicht gebaut |
| Hilfsmittelantrag | ❌ | Nicht gebaut |
| Antrag Entlastungsbudget | ⚠️ | Hinweis vorhanden, kein Formular |
| Eigenanteil-Befreiung | ❌ | Nicht gebaut |
| Antrag Pflegeunterstützungsgeld | ❌ | Nicht gebaut |
| Schadensersatz (SGB XIV) | ⚠️ | Recherchiert, nicht vollständig |

**Aktion:** Fehlende Generator-UIs bauen

---

## BLOCK 16: DiPA PFLEGETAGEBUCH ⚠️
| Feature | Status |
|---------|--------|
| Speicherung | ⚠️ localStorage, nicht Supabase |
| Tägliche Einträge | ✅ UI vorhanden |
| Bilder & PDFs | ⚠️ Upload nicht implementiert |
| Automatische Auswertung | ❌ Nicht gebaut |
| Fristenerinnerung | ❌ Kein Cron-Job |
| Übergabe an MD/Medicproof | ❌ Kein Export-Format |
| Kontext für Widerspruch | ⚠️ Teilweise |
| Digitale Unterschrift | ❌ Nicht implementiert |
| Backup in 3 Speicherorte | ❌ Nicht implementiert |
| Compliance: DIN-Format | ❌ Nicht geprüft |

**Aktion:** Supabase-Integration + Export + Cron-Job

---

## BLOCK 17-18: IMPRESSUM & DATENSCHUTZ
| Element | Status |
|---------|--------|
| Impressum mit Clevver-Adresse | ❌ Noch nicht erstellt |
| Datenschutzerklärung | ⚠️ Vorlage muss angepasst werden |
| Cookie-Banner | ⚠️ Umami-Integration geplant |
| DSGVO-Auskunftsformular | ❌ Nicht gebaut |
| Löschfunktion | ⚠️ API existiert, UI fehlt |
| Auftragsverarbeitung (Hosting) | ⚠️ Supabase DPA nötig |
| Auskunft über Dritte | ❌ Nicht dokumentiert |

**Aktion:** Impressum + DSE erstellen

---

## BLOCK 19: PDF-EXPORT ✓
| Feature | Status |
|---------|--------|
| PDF-Generator (Puppeteer) | ✅ Gebaut |
| API-Route | ✅ /api/pdf/generate |
| Widerspruch-PDF | ✅ /api/widerspruch/pdf |
| Brief-Generator Integration | ✅ /api/briefe/pdf |
| Alle 10 Seiten als PDF | ⚠️ Einzeln möglich, nicht kombiniert |
| Din-A4 optimiert | ⚠️ Muss geprüft werden |
| Barrierefrei | ❌ Nicht getestet |

**Aktion:** Multi-Page PDF + Barrierefreiheit testen

---

## BLOCK 20: MIGRATION - ÜBERGABE
| Element | Status |
|---------|--------|
| System-Dokumentation | ⚠️ Teilweise in OPTIMALE_KONFIGURATION.md |
| Masterplan | ⚠️ MASTER_PLAN_ALLES_EINRICHTEN.md |
| Zugangsdaten | ❌ Noch nicht gesammelt |
| Code-Repository | ✅ Branch feature/supabase-api |
| Notfallkontakt | ❌ Nicht dokumentiert |

**Aktion:** Vollständige Dokumentation + Zugangsdaten

---

## BLOCK 21: 35 SPRACHEN
| Aspekt | Status |
|--------|--------|
| LibreTranslate Docker | ✅ docker-compose.yml |
| Interface-Übersetzung | ⚠️ i18n Struktur fehlt noch |
| Gesetze übersetzen | ❌ Nicht automatisiert |
| Einfache Sprache (Deutsch) | ✅ Implementiert |
| RTL-Sprachen (Arabisch, Farsi) | ⚠️ Rechts-nach-links nicht getestet |
| Fehler-Eskalation | ❌ Kein "Übersetzung unklar"-System |

**Aktion:** i18n Setup + Übersetzungs-UI

---

## BLOCK 22: ANALYTICS
| Tool | Status |
|------|--------|
| Umami (self-hosted) | ✅ docker-compose.yml |
| Plausible (self-hosted) | ⚠️ Alternative dokumentiert |
| Fathom (kostenlos) | ⚠️ Recherchiert |
| Kein Google Analytics | ✅ Verboten |
| Kein Facebook Pixel | ✅ Verboten |
| Opt-out Mechanismus | ❌ Noch nicht gebaut |

**Aktion:** Umami starten + Opt-out bauen

---

## BLOCK 23: MONITORING
| Tool | Status |
|------|--------|
| Uptime Kuma | ✅ docker-compose.yml |
| GlitchTip | ✅ docker-compose.yml |
| Checkly (kostenlos) | ⚠️ Account nötig |
| Better Stack | ⚠️ Recherchiert |
| Sentry | ❌ Nicht eingerichtet |
| PagerDuty (kostenlos) | ❌ Nicht eingerichtet |

**Aktion:** Docker starten + Alerts konfigurieren

---

## BLOCK 24: THREEMA GATEWAY
| Element | Status |
|---------|--------|
| Broadcast-Liste | ❌ Kein API-Key |
| Täglicher Bericht | ❌ Automatisierung fehlt |
| Bestätigung: Gelesen? | ❌ Nicht implementiert |
| Bestätigung: Dauer? | ❌ Nicht implementiert |
| Reaktion: Link angeklickt? | ❌ Tracking nicht implementiert |
| Admin-Benachrichtigung | ❌ Nicht implementiert |
| Alternativen: Signal, WhatsApp | ⚠️ Recherchiert, nicht integriert |

**Aktion:** Threema API-Key beantragen + Integration

---

## BLOCK 25: VOICE-FIRST & AVATAR
| Feature | Status |
|---------|--------|
| Web Speech API (eingebaut) | ✅ In allen Modulen |
| Kokoro TTS (lokal) | ⚠️ Recherchiert, nicht integriert |
| Sprachbefehle | ✅ HILFE, WEITER, ZURÜCK |
| Voice-Steuerung | ⚠️ Implementiert, nicht getestet |
| Avatar-Chat Komponente | ✅ Gebaut |
| Avatar-API | ✅ /api/avatar/chat |
| Avatar-Design | ⚠️ Standard, nicht individualisiert |
| Hörmuster | ❌ Nicht getestet |
| Fehler-Eskalation | ❌ "Verstanden?"-Check fehlt |

**Aktion:** Kokoro TTS integrieren + Testen

---

## BLOCK 26: 3D-AVATAR
| Tool | Status |
|------|--------|
| Inworld.ai | ❌ Nicht eingerichtet |
| Didimo | ❌ Nicht eingerichtet |
| ReadyPlayerMe | ⚠️ Recherchiert |
| Kostenlose Alternative: Botpress | ⚠️ Recherchiert |

**Aktion:** Avatar-Design entscheiden + einrichten

---

## BLOCK 27: CHAT-AGENT
| Tool | Status |
|------|--------|
| Botpress | ⚠️ Recherchiert, nicht integriert |
| Voiceflow | ⚠️ Recherchiert, nicht integriert |
| Stack.ai | ⚠️ Recherchiert, nicht integriert |
| Eigene Implementation | ✅ Eigene AvatarChat Komponente |
| GPT-4 + Web Search | ⚠️ API-Schlüssel nötig |
| Fehler-Eskalation | ❌ "Weiterleitung an Mensch" fehlt |

**Aktion:** Chat-System finalisieren

---

## BLOCK 28: VIDEOS
| Tool | Status |
|------|--------|
| Synthesia (10 Videos/Test) | ❌ Account fehlt |
| HeyGen (Alternative) | ⚠️ Recherchiert |
| Colossyan (Alternative) | ⚠️ Recherchiert |
| Kostenlos: Pictory + WellSaid | ⚠️ Recherchiert |
| YouTube-Kanal | ❌ Noch nicht erstellt |
| Videos produziert | ❌ Keine |

**Aktion:** Synthesia Account erstellen + Videos produzieren

---

## BLOCK 29: STRIPE
| Element | Status |
|---------|--------|
| Stripe-Account | ❌ Noch nicht erstellt |
| Preisgestaltung | ✅ 29 € Beta definiert |
| Preisgestaltung 2 | ❌ Abo-Modell nicht definiert |
| Bezahlung 1: Sofort | ❌ Nicht implementiert |
| Bezahlung 2: Nach MD-Bescheid | ❌ Nicht implementiert |
| Rechnung mit MwSt | ❌ Nicht implementiert |
| Mahnwesen | ❌ Nicht implementiert |
| Alternativen: PayPal, Klarna | ⚠️ Recherchiert |

**Aktion:** Stripe-Account + Bezahl-Integration

---

## BLOCK 30: KUNDENBINDUNG
| Tool | Status |
|------|--------|
| Mailchimp | ❌ Account fehlt |
| Brevo (kostenlos) | ⚠️ Account nötig |
| Intercom | ❌ Nicht eingerichtet |
| Zendesk | ❌ Nicht eingerichtet |
| Alternativen: HubSpot, Zoho | ⚠️ Recherchiert |
| Onboarding-Sequenz | ❌ Nicht erstellt |
| Newsletter-System | ❌ Nicht gebaut |

**Aktion:** CRM-System wählen + einrichten

---

## BLOCK 31-40: ERWEITERTE FEATURES
| Block | Feature | Status |
|-------|---------|--------|
| 31 | Automatischer Widerspruch | ⚠️ Generator gebaut, Automatisierung fehlt |
| 32 | KI-gestützter Chat | ✅ Basis implementiert |
| 33 | Predictive Analytics | ❌ Nicht gebaut |
| 34 | Integration Krankenkassen | ❌ Nicht gebaut |
| 35 | Mobile App | ❌ Nicht gebaut (nur Web) |
| 36 | API für Partner | ❌ Nicht gebaut |
| 37 | White-Label | ❌ Nicht gebaut |
| 38 | Mehrmandantenfähigkeit | ❌ Nicht gebaut |
| 39 | Künstlerische Kooperation | ❌ Nicht gebaut |
| 40 | Forschungspartnerschaft | ❌ Nicht gebaut |

---

## ZUSAMMENFASSUNG

### KRITISCH - BLOCKIERT START:
1. **Server läuft nicht** - Admin muss starten
2. **Threema API-Key** - Für Benachrichtigungen
3. **Impressum fehlt** - Rechtlich verpflichtend
4. **Stripe/PayPal** - Für Bezahlung
5. **Domain-Setup** - DNS, SSL, etc.

### WICHTIG - SOLLTE VOR BETA:
6. **Kokoro TTS** - Voice-First komplett
7. **Seite 8 (Netzwerk)** - Fehlt komplett
8. **Videos (Synthesia)** - Marketing
9. **i18n (35 Sprachen)** - Internationale Nutzer
10. **DiPA komplett** - Supabase + Export

### KÖNNTE NACH BETA:
11. Erweiterte Brief-Generatoren
12. Mobile App
13. Analytics-Fortschritt
14. Automatisierte Berichte

---

**EMPFEHLUNG:**
Zuerst die 5 Kritischen lösen (braucht Admin), dann die 10 Wichtigen, dann Beta-Start.

**Nächster Schritt: Admin anschreiben?**
