# BLOCK-PRÜFUNG A-B-C (Systematisch)
**Zeit:** 27.04.2026 19:39

---

## BLOCK 7: 10 PORTAL-SEITEN

### A = ANALYSE (Was ist da?)
| Komponente | Status | Prüfung |
|------------|--------|---------|
| Startseite | ✅ | /page.tsx existiert |
| Pflegegrad Start | ✅ | /pflegegrad/start/page.tsx |
| Modul 1-6 | ✅ | /pflegegrad/modul1-6/page.tsx |
| Ergebnis | ✅ | /pflegegrad/ergebnis/page.tsx |
| Tagebuch | ✅ | /tagebuch/page.tsx |
| Bewertung | ✅ | /bewertung/page.tsx |

### B = BAUE (Was fehlt?)
- [ ] AvatarChat in modul1.tsx einbauen
- [ ] AvatarChat in modul2.tsx einbauen
- [ ] AvatarChat in modul3.tsx einbauen
- [ ] AvatarChat in modul4.tsx einbauen
- [ ] AvatarChat in modul5.tsx einbauen
- [ ] AvatarChat in modul6.tsx einbauen
- [ ] Gesetze-API in ergebnis/page.tsx integrieren
- [ ] PDF-Export Button in ergebnis/page.tsx

### C = CHECK (Test?)
- [ ] Build erfolgreich?
- [ ] Alle Seiten erreichbar?
- [ ] AvatarChat funktioniert?

---

## BLOCK 8: NBA-BERECHNUNG

### A = ANALYSE
| Komponente | Status | Datei |
|------------|--------|-------|
| Logik | ✅ | pflegegrad-berechnung.ts |
| Module 1-6 | ✅ | Definiert |
| Gewichtungen | ✅ | 10%,15%,15%,40%,20%,0% |

### B = BAUE
- [x] NICHTS - Bereits fertig!

### C = CHECK
- [ ] Test: PG2 = 27-47 Punkte?
- [ ] Test: PG3 = 47-70 Punkte?
- [ ] Test: Kinder-Modus funktioniert?

---

## BLOCK 10: DATENBANK

### A = ANALYSE
| Komponente | Status | Datei |
|------------|--------|-------|
| Supabase | ✅ | supabase.ts |
| Tabellen | ✅ | Cases, Answers, Diary |
| RLS | ✅ | Aktiviert |

### B = BAUE
- [ ] Supabase URL in .env prüfen
- [ ] Supabase Key in .env prüfen

### C = CHECK
- [ ] Verbindungstest?
- [ ] INSERT Test?
- [ ] SELECT Test?

---

## BLOCK 14: WIDERSPRUCH

### A = ANALYSE
| Komponente | Status | Datei |
|------------|--------|-------|
| Generator | ✅ | widerspruch.ts |
| PDF API | ✅ | /api/widerspruch/pdf/route.ts |
| Verbraucherzentrale-Muster | ✅ | Integriert |

### B = BAUE
- [ ] Widerspruch-Button in ergebnis/page.tsx
- [ ] Widerspruch-Formular erstellen
- [ ] Checkliste anzeigen

### C = CHECK
- [ ] PDF-Generierung funktioniert?
- [ ] Brief-Text korrekt?
- [ ] Checkliste vollständig?

---

## BLOCK 16: DiPA PFLEGETAGEBUCH

### A = ANALYSE
| Komponente | Status | Datei |
|------------|--------|-------|
| UI | ✅ | /tagebuch/page.tsx |
| Speicherung | ⚠️ | Nur localStorage? |
| Export | ⚠️ | PDF-Integration? |

### B = BAUE
- [ ] Supabase-Integration für Tagebuch
- [ ] PDF-Export für Tagebuch
- [ ] Erinnerungen (Cron)

### C = CHECK
- [ ] Einträge werden gespeichert?
- [ ] Export funktioniert?

---

## BLOCK 19: PDF-EXPORT

### A = ANALYSE
| Komponente | Status | Datei |
|------------|--------|-------|
| Generator | ✅ | pdf.ts |
| API | ✅ | /api/pdf/generate/route.ts |
| Widerspruch PDF | ✅ | /api/widerspruch/pdf/route.ts |

### B = BAUE
- [ ] PDF-Buttons in alle Seiten einbauen

### C = CHECK
- [ ] Build erfolgreich?
- [ ] PDF wird generiert?

---

## BLOCK 21-23: DOCKER-TOOLS

### A = ANALYSE
| Komponente | Status | Datei |
|------------|--------|-------|
| LibreTranslate | ✅ | docker-compose.yml |
| Umami | ✅ | docker-compose.yml |
| Uptime Kuma | ✅ | docker-compose.yml |
| GlitchTip | ✅ | docker-compose.yml |

### B = BAUE
- [ ] Admin muss Docker starten: `docker-compose up -d`

### C = CHECK
- [ ] Container laufen?
- [ ] Ports erreichbar?

---

## BLOCK 24: THREEMA

### A = ANALYSE
| Komponente | Status | Problem |
|------------|--------|---------|
| Gateway | ⚠️ | API-Key fehlt |

### B = BAUE
- [ ] Threema-Account erstellen
- [ ] API-Key beantragen
- [ ] Integration bauen

### C = CHECK
- [ ] Test-Nachricht senden?

---

## BLOCK 25: VOICE/AVATAR

### A = ANALYSE
| Komponente | Status | Datei |
|------------|--------|-------|
| Voice-First | ✅ | voice.ts |
| AvatarChat | ✅ | Komponente |
| Avatar API | ✅ | /api/avatar/chat/route.ts |

### B = BAUE
- [ ] AvatarChat in modul1-6 einbauen
- [ ] Voice-Buttons in alle Seiten
- [ ] Sprachsteuerung testen

### C = CHECK
- [ ] Mikrofon funktioniert?
- [ ] TTS funktioniert?
- [ ] Commands werden erkannt?

---

## BLOCK 28: VIDEOS

### A = ANALYSE
| Tool | Status | Preis |
|------|--------|-------|
| Synthesia | ⚠️ | Account fehlt |
| HeyGen | ✅ | Recherchiert |
| Colossyan | ✅ | Recherchiert |

### B = BAUE
- [ ] Synthesia-Account erstellen
- [ ] 10 Testvideos produzieren
- [ ] Alternativen testen (HeyGen)

### C = CHECK
- [ ] Videos in Portal einbetten?

---

## ZUSAMMENFASSUNG: WAS JETZT BAUEN (Priorität)

### SOFORT (Aktueller Block):
1. **AvatarChat in modul1-6 einbauen** ⭐⭐⭐
2. **Widerspruch-UI in ergebnis** ⭐⭐⭐
3. **Build-Fehler beheben** ⭐⭐⭐

### DANN (Nächster Block):
4. **Docker starten (Admin)** ⭐⭐
5. **Supabase verbinden testen** ⭐⭐
6. **PDF-Buttons überall** ⭐⭐

### SPÄTER (Letzter Block):
7. **Threema API-Key** ⭐
8. **Synthesia Account** ⭐
9. **Videos produzieren** ⭐

---

**⏰ STARTE JETZT MIT ITEM 1: AvatarChat in Modul-Seiten!** 🚀
