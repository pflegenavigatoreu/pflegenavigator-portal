# 💡 Einsparungs-Potenziale 2026

## Übersicht

Aktuelle monatliche Kosten: ~7-9€
Jährliche Kosten: ~85-110€

**Gesamtpotenzial:** Bis zu **15-16€/Monat** oder **180-192€/Jahr**

---

## Identifizierte Einsparmöglichkeiten

### 1. 🌐 Traffic-Optimierung (Hetzner)

**Potenzial:** -0.50€ bis -1.00€/Monat (-6 bis -12€/Jahr)

**Status:** 🔵 Nicht umgesetzt

**Maßnahmen:**

- [ ] **Cloudflare CDN einrichten** (kostenlos)
  - Reduziert Outbound Traffic um 30-60%
  - Globale Edge-Caching
  - DDoS Schutz inklusive

- [ ] **Bilder optimieren**
  - WebP Format statt PNG/JPEG
  - Responsive Bilder
  - Lazy Loading
  - Einsparung: ~20-30% Traffic

- [ ] **Static Assets cachen**
  - Lange Cache-Header setzen
  - Immutable Assets hash-basiert
  - Browser Caching optimieren

- [ ] **Gzip/Brotli Kompression**
  - Text-basierte Assets komprimieren
  - Einsparung: 60-80% bei HTML/JS/CSS

**Implementierung:**
```bash
# Cloudflare Setup
# 1. Domain zu Cloudflare DNS umziehen
# 2. Caching Rules konfigurieren
# 3. Auto-Minify aktivieren

# Nginx Konfiguration
# gzip on;
# gzip_types text/plain text/css application/json;
# gzip_min_length 1000;
```

**ROI:** Sofort nach Implementierung

---

### 2. 🗄️ Datenbank-Management (Supabase)

**Potenzial:** Verbleiben im Free Tier (**25€/Monat** Ersparnis)

**Status:** 🟢 Aktiv überwacht

**Maßnahmen:**

- [ ] **Logs regelmäßig bereinigen**
  ```sql
  -- Alte Logs löschen (älter als 30 Tage)
  DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';
  ```
  - Einsparung: 50-200MB/Monat

- [ ] **Temporäre Daten löschen**
  - Sessions aufräumen
  - Veraltete Cache-Einträge
  - Test-Daten bereinigen

- [ ] **Indizes optimieren**
  ```sql
  -- REINDEX regelmäßig ausführen
  REINDEX DATABASE CONCURRENTLY;
  ```
  - Bessere Performance
  - Kleinerer Speicherbedarf

- [ ] **VACUUM ausführen**
  ```sql
  -- Dead Tuples entfernen
  VACUUM ANALYZE;
  ```
  - Reclaim Speicher
  - Verbessert Performance

- [ ] **Alte Auth-User bereinigen**
  ```sql
  -- Nicht-verifizierte User löschen
  DELETE FROM auth.users 
  WHERE email_confirmed_at IS NULL 
    AND created_at < NOW() - INTERVAL '7 days';
  ```

**Automatisierung:**
```bash
# Cron Job für monatliche Bereinigung
0 2 1 * * psql $DATABASE_URL -f /path/to/cleanup.sql
```

**Überwachung:**
- Weekly: DB-Größe checken
- Monthly: Aufräumen durchführen
- Alert bei >400MB (80%)

---

### 3. 📧 Email-Optimierung (Brevo)

**Potenzial:** Verbleiben im Free Tier (**9€/Monat** Ersparnis)

**Status:** 🟢 Aktiv überwacht

**Maßnahmen:**

- [ ] **Nicht-essenzielle E-Mails reduzieren**
  - In-App Notifications statt Emails
  - Digest-Emails statt einzelne
  - Opt-in für Marketing

- [ ] **Batch-Größen optimieren**
  ```typescript
  // Statt einzelner Emails
  await sendEmail(user, 'notification');
  
  // Batches zusammenfassen
  await sendBatchEmails(users, 'digest');
  ```

- [ ] **Supabase Auth für Transaktionen**
  - Password Reset: Supabase statt Brevo
  - Email Verification: Supabase statt Brevo
  - Magic Links: Supabase statt Brevo

- [ ] **Email-Templates optimieren**
  - Kleinere Templates = weniger Overhead
  - Keine unnötigen Bilder
  - Plain Text Fallbacks

- [ ] **Rate Limiting implementieren**
  ```typescript
  // Max 1 Email pro User pro Stunde
  const rateLimit = new Map();
  
  function canSendEmail(userId: string): boolean {
    const lastSent = rateLimit.get(userId);
    if (!lastSent) return true;
    return Date.now() - lastSent > 3600000; // 1h
  }
  ```

**Monitoring:**
- Täglich: Emails/Tag zählen
- Alert bei >250/Tag (83%)

---

### 4. 🖥️ Server-Optimierung (Hetzner)

**Potenzial:** -1.00€ bis -2.00€/Monat (-12 bis -24€/Jahr)

**Status:** 🟡 Teilweise umgesetzt

**Maßnahmen:**

- [x] **CX11 ausgewählt** (kleinster Server)
  - 2 vCPUs, 4GB RAM
  - Kosteneffizient für kleine Projekte

- [ ] **Snapshots regelmäßig aufräumen**
  ```bash
  # Alte Snapshots löschen (älter als 30 Tage)
  # Manuelle oder API-basierte Bereinigung
  ```
  - Snapshots kosten ~0.01€/GB/Monat

- [ ] **Unnötige Backups löschen**
  - Nur letzte 7 Tage behalten
  - Wichtige Backups extern (S3 Glacier)

- [ ] **Downgrade prüfen**
  - CX11 ist kleinste Option ✅
  - Bei Bedarf: CX21 für kurze Zeit

- [ ] **Docker-Optimierung**
  - Unnötige Images löschen: `docker system prune -a`
  - Logs rotieren: `--log-opt max-size=10m`
  - Multi-Stage Builds für kleinere Images

**Einsparungspotenziale:**
| Ressource | Aktuell | Optimiert | Einsparung |
|-----------|---------|-----------|------------|
| Snapshots | ~3-5 | ~2-3 | ~0.50€ |
| Docker Images | ~5GB | ~2GB | ~0.30€ |
| Logs | ~1GB | ~200MB | ~0.20€ |

---

## Priorisierung

### Hohe Priorität (Sofort umsetzen)

| Maßnahme | Einsparung | Aufwand | ROI |
|----------|-----------|---------|-----|
| Cloudflare CDN | 6-12€/Jahr | 2h | Sehr hoch |
| DB-Aufräumen | 25€/Monat | 4h | Hoch |
| Bild-Optimierung | 3-6€/Jahr | 3h | Hoch |

### Mittlere Priorität (Q2 2026)

| Maßnahme | Einsparung | Aufwand | ROI |
|----------|-----------|---------|-----|
| Email-Batching | 9€/Monat | 4h | Mittel |
| Snapshot-Cleanup | 6€/Jahr | 1h | Mittel |
| Docker-Optimierung | 3-6€/Jahr | 2h | Mittel |

### Niedrige Priorität (Q3-Q4 2026)

| Maßnahme | Einsparung | Aufwand | ROI |
|----------|-----------|---------|-----|
| Provider-Evaluierung | 10-20% | 8h | Unklar |
| Jahreszahlung-Rabatte | 5-10% | 2h | Niedrig |

---

## Umsetzungs-Roadmap

### Q1 2026 (Jan-Mar)

- [ ] Week 1-2: Cloudflare CDN einrichten
- [ ] Week 3-4: Bild-Optimierung implementieren
- [ ] Week 5-6: DB-Bereinigung automatisieren
- [ ] Week 7-8: Monitoring verfeinern
- [ ] Week 9-12: Ergebnisse messen

**Ziel:** 10-15€/Jahr einsparen

### Q2 2026 (Apr-Jun)

- [ ] Email-Batching implementieren
- [ ] Snapshot-Cleanup automatisieren
- [ ] Docker-Optimierung durchführen
- [ ] Kosten-Review

**Ziel:** Weitere 10-20€/Jahr einsparen

### Q3-Q4 2026

- [ ] Alternative Provider evaluieren
- [ ] Jahreszahlung-Rabatte verhandeln
- [ ] Budget-Review 2027

---

## Erfolgsmessung

### KPIs

| Metrik | Aktuell | Ziel Q2 | Ziel Q4 |
|--------|---------|---------|---------|
| Monatliche Kosten | ~9€ | ~8€ | ~7€ |
| Hetzner Traffic | ~20GB | ~15GB | ~10GB |
| Supabase DB | ~300MB | ~350MB | ~400MB |
| Brevo Emails | ~50/Tag | ~100/Tag | ~150/Tag |

### Reviews

- **Monatlich:** Kosten-Report checken
- **Quartal:** Fortschritt bewerten
- **Jährlich:** Strategie anpassen

---

## Tools & Ressourcen

### Monitoring
- Kosten-Dashboard: `./scripts/monitoring/cost-dashboard.sh`
- Hetzner: `./scripts/monitoring/hetzner-budget-alert.sh`
- Supabase: `./src/lib/monitoring/supabase-usage.ts`
- Brevo: `./scripts/monitoring/brevo-usage-alert.sh`

### Optimierung
- Cloudflare: [cloudflare.com](https://cloudflare.com)
- WebP Converter: [squoosh.app](https://squoosh.app)
- Docker Prune: `docker system prune -a`

### Dokumentation
- Kosten-Monitoring: `KOSTEN_MONITORING.md`
- Budget-Planung: `BUDGET_2026.md`

---

## Zusammenfassung

**Gesamtpotenzial:**
- **Konservativ:** 180€/Jahr
- **Optimistisch:** 444€/Jahr (inkl. vermiedener Upgrades)

**Wichtigste Maßnahmen:**
1. CDN einrichten (Sofort, 6-12€/Jahr)
2. DB-Größe managen (Kontinuierlich, 25€/Monat Risiko)
3. Emails optimieren (Kontinuierlich, 9€/Monat Risiko)

**Investition:**
- Zeit: ~20 Stunden Setup
- Laufend: ~2 Stunden/Monat

**ROI:** Sehr hoch (kostenlos außer Zeit)

---

*Letzte Aktualisierung: April 2026*
*Nächste Review: Mai 2026*
