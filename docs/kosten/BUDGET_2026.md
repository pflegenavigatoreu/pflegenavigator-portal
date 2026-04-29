# 💰 Budget-Planung 2026

## Executive Summary

| Zeitraum | Geschätzte Kosten | Risiko-Level |
|----------|------------------|--------------|
| **Gesamt 2026** | **108€ - 516€** | Mittel |
| **Q1 2026** | 27€ | Niedrig |
| **Q2 2026** | 27€ | Niedrig |
| **Q3 2026** | 50-150€ | Mittel |
| **Q4 2026** | 50-150€ | Mittel |

---

## Aktuelle Kostenstruktur

### Monatliche Übersicht

| Dienst | Aktuell | Budget | Status |
|--------|---------|--------|--------|
| Hetzner Cloud | ~7.51€ | 10€ | ✅ OK |
| Supabase | 0€ | 0€ | ✅ Free Tier |
| Brevo | 0€ | 0€ | ✅ Free Tier |
| Domain | 1.50€ | 2€ | ✅ OK |
| **Gesamt** | **~9€** | **12€** | ✅ OK |

### Jährliche Kosten

```
Hetzner Cloud:       90.12€ (CX11 + Traffic + Backups)
Supabase Free Tier:   0.00€
Brevo Free Tier:      0.00€
Domain (jährl.):     18.00€
────────────────────────────
AKTUELL:            ~108€/Jahr
```

---

## Szenario-Planung

### 🟢 Best Case Szenario

**Annahmen:**
- Alle Free Tiers ausreichend
- Keine Traffic-Spitzen
- Keine Upgrades nötig

| Monat | Kosten |
|-------|--------|
| Januar | 9€ |
| Februar | 9€ |
| März | 9€ |
| April | 9€ |
| Mai | 9€ |
| Juni | 9€ |
| Juli | 9€ |
| August | 9€ |
| September | 9€ |
| Oktober | 9€ |
| November | 9€ |
| Dezember | 9€ |
| **Gesamt** | **108€** |

**Maßnahmen:**
- [x] Monitoring aktiv
- [x] Alerts konfiguriert
- [ ] CDN einrichten (zusätzliche Einsparung)

---

### 🟡 Realistisches Szenario

**Annahmen:**
- Hetzner bleibt stabil
- Supabase Upgrade Q3 (Datenbank wächst über 500MB)
- Brevo bleibt Free Tier
- Leichter Traffic-Anstieg

| Monat | Hetzner | Supabase | Brevo | Sonst | Gesamt |
|-------|---------|----------|-------|-------|--------|
| Q1 | 7.51€ | 0€ | 0€ | 4.50€ | 12.01€ |
| Q2 | 8.00€ | 0€ | 0€ | 4.50€ | 12.50€ |
| Q3 | 8.50€ | 25€ | 0€ | 4.50€ | 38.00€ |
| Q4 | 9.00€ | 25€ | 0€ | 4.50€ | 38.50€ |
| **Gesamt** | **33.01€** | **50€** | **0€** | **18€** | **101.01€** |

**Korrektur:**
Mit monatlicher Berechnung:
- Januar-Juni: 9€/Monat = 54€
- Juli-Dezember: 34€/Monat = 204€
- **Gesamt: 258€ + Domain 18€ = 276€**

**Risiko-Faktoren:**
- Supabase DB wächst schneller als erwartet
- Traffic-Anstieg bei Viralität
- Mehr Auth-User als erwartet

---

### 🔴 Worst Case Szenario

**Annahmen:**
- Alle Services upgraden
- Hoher Traffic (viral)
- Viele Benutzer

| Dienst | Kosten/Monat | Begründung |
|--------|-------------|------------|
| Hetzner | 15€ | Traffic-Spitzen, Backups |
| Supabase | 25€ | Pro Plan (unlimited DB) |
| Brevo | 25€ | Business Plan (100k emails) |
| Domain | 1.50€ | Unverändert |
| **Gesamt** | **66.50€** | |

| Monat | Kosten |
|-------|--------|
| Januar | 15€ |
| Februar | 20€ |
| März | 25€ |
| April | 40€ |
| Mai | 50€ |
| Juni | 55€ |
| Juli | 60€ |
| August | 65€ |
| September | 66€ |
| Oktober | 66€ |
| November | 66€ |
| Dezember | 66€ |
| **Gesamt** | **~599€** |

---

## Quartals-Planung

### Q1 2026 (Jan-Mar)

**Budget:** 27€

**Schwerpunkte:**
- ✅ Monitoring einrichten
- [ ] Baseline festlegen
- [ ] Traffic-Muster analysieren
- [ ] Einsparungen identifizieren

**KPIs:**
- Hetzner < 8€/Monat
- Supabase < 400MB
- Brevo < 200 Emails/Tag

---

### Q2 2026 (Apr-Jun)

**Budget:** 27-50€

**Schwerpunkte:**
- [ ] Optimierungen umsetzen
- [ ] CDN einrichten
- [ ] Datenbank-Bereinigung
- [ ] Evaluierung: Upgrade nötig?

**KPIs:**
- Kosten stabil oder sinkend
- Alle Free Tiers unter 80%

---

### Q3 2026 (Jul-Sep)

**Budget:** 50-150€

**Schwerpunkte:**
- [ ] Entscheidung: Supabase Upgrade?
- [ ] Traffic-Planung
- [ ] Brevo Evaluation
- [ ] Kosten-Optimierung

**KPIs:**
- Frühzeitige Alerts bei 70%
- Proaktive Upgrades (nicht reaktiv)

---

### Q4 2026 (Okt-Dez)

**Budget:** 50-150€

**Schwerpunkte:**
- [ ] Budget-Review 2027
- [ ] Vertragsverhandlungen
- [ ] Alternative Provider evaluieren
- [ ] Jahres-Report

---

## Budget-Limits & Alerts

### Monatliche Alerts

| Dienst | Warnung | Kritisch | Aktion |
|--------|---------|----------|--------|
| Hetzner | 8€ (80%) | 9.50€ (95%) | Traffic-Optimierung |
| Supabase | 400MB (80%) | 475MB (95%) | Aufräumen oder Upgrade |
| Brevo | 250/Tag | 290/Tag | Emails reduzieren |
| Gesamt | 20€ | 30€ | Review nötig |

### Quartals-Review

**Pro Quartal:**
- [ ] Kosten-Report generieren
- [ ] Trends analysieren
- [ ] Budget anpassen
- [ ] Prognose aktualisieren

---

## Einsparungs-Strategie

### Kurzfristig (Q1-Q2)

1. **CDN einrichten**
   - Einsparung: 0.50-1€/Monat
   - Kosten: 0€ (Cloudflare Free)
   - ROI: Sofort

2. **Datenbank-Optimierung**
   - Einsparung: Verbleiben im Free Tier
   - Kosten: 0€
   - ROI: 25€/Monat (wenn Upgrade vermieden)

3. **Bild-Optimierung**
   - Einsparung: 0.50€/Monat Traffic
   - Kosten: 0€
   - ROI: Sofort

### Mittelfristig (Q2-Q3)

1. **Alternative Provider evaluieren**
   - Optionen: AWS Lightsail, DigitalOcean, Railway
   - Potenzial: -20% Kosten

2. **Email-Strategie**
   - Batch-Größen optimieren
   - Supabase Auth für Transaktionen nutzen
   - Potenzial: Verbleiben im Free Tier

### Langfristig (Q4+)

1. **Verhandlungen**
   - Jahreszahlung = Rabatt
   - Startup-Programme nutzen

2. **Multi-Cloud Strategie**
   - Best-of-Breed für jeden Service
   - Redundanz + Kosteneinsparung

---

## Risiko-Matrix

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Supabase > 500MB | Hoch | 25€/Monat | Monitoring, Aufräumen |
| Hetzner Traffic ↑ | Mittel | +2-5€/Monat | CDN, Caching |
| Brevo Limit erreicht | Niedrig | 9€/Monat | Optimierung |
| Downtime durch Limits | Mittel | Reputation | Proaktive Upgrades |

---

## Monitoring & Reporting

### Automatisch

- **Täglich:** Hetzner, Brevo Checks
- **Wöchentlich:** Dashboard Update
- **Monatlich:** Report Generation
- **Quartal:** Budget-Review

### Manuell

- Monatliche Kosten-Überprüfung
- Quartalsweise Provider-Evaluation
- Jährliche Strategie-Planung

---

## Zusammenfassung

### Budget-Empfehlung 2026

| Kategorie | Budget | Kommentar |
|-----------|--------|-----------|
| Minimal | 108€ | Alles bleibt Free Tier |
| Realistisch | 250-300€ | Ein Upgrade erwartet |
| Maximal | 500€ | Mehrere Upgrades |

**Empfohlene Planung:**
- **Monatlich:** 25€ Rücklage
- **Jährlich:** 300€ Budget
- **Buffer:** 200€ für unerwartetes Wachstum

---

## Nächste Schritte

1. [x] Monitoring einrichten
2. [ ] Q1 Review durchführen
3. [ ] Einsparungs-Maßnahmen umsetzen
4. [ ] Q2 Prognose aktualisieren

---

*Letzte Aktualisierung: April 2026*
*Nächste Review: Juli 2026 (Q2)*
