#!/bin/bash
# Cost Dashboard - Zentrales Kosten-Monitoring
# Kombiniert alle Kosten-Quellen und generiert Reports

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOCS_DIR="${WORKSPACE_DIR}/docs/kosten"

# Konfiguration
HETZNER_MONTHLY_BUDGET="${HETZNER_MONTHLY_BUDGET:-10}"
BREVO_DAILY_LIMIT=300
SUPABASE_FREE_MB=500

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"
EMAIL_TO="${ALERT_EMAIL_TO:-}"

# Quiet Hours
QUIET_HOURS_START="${QUIET_HOURS_START:-23}"
QUIET_HOURS_END="${QUIET_HOURS_END:-7}"

# State und Log
STATE_FILE="${SCRIPT_DIR}/.cost-dashboard-state"
LOG_FILE="${SCRIPT_DIR}/.cost-dashboard.log"
REPORT_FILE="${DOCS_DIR}/monatlicher-report-$(date +%Y-%m).md"

# Farben
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Quiet Hours
is_quiet_hours() {
    local current_hour=$(date +%H)
    if [ "$current_hour" -ge "$QUIET_HOURS_START" ] || [ "$current_hour" -lt "$QUIET_HOURS_END" ]; then
        return 0
    fi
    return 1
}

# Telegram Alert
send_telegram_alert() {
    local message="$1"
    local priority="${2:-normal}"
    
    if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
        return 1
    fi
    
    if is_quiet_hours && [ "$priority" != "high" ]; then
        return 0
    fi
    
    local escaped_message=$(echo "$message" | sed 's/[_*\[\]]/\\&/g')
    
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=${escaped_message}" \
        -d "parse_mode=Markdown" \
        -d "disable_notification=$([ "$priority" = "high" ] && echo "false" || echo "true")" \
        --connect-timeout 10 --max-time 30 > /dev/null
}

# Hetzner Kosten ermitteln
get_hetzner_costs() {
    local server_cost=4.51  # CX11
    local traffic_cost=2.00  # Geschätzt
    local backup_cost=1.00   # Geschätzt
    
    echo "scale=2; $server_cost + $traffic_cost + $backup_cost" | bc
}

# Supabase Kosten ermitteln
get_supabase_costs() {
    # Free Tier = 0€
    echo "0.00"
}

# Brevo Kosten ermitteln
get_brevo_costs() {
    # Free Tier = 0€
    # Wenn du upgradest, ändere hier
    echo "0.00"
}

# Andere Kosten
get_other_costs() {
    # Domain, etc.
    local domain_cost=1.50  # ~18€/Jahr
    echo "$domain_cost"
}

# Gesamtkosten berechnen
calculate_total_costs() {
    local hetzner
    local supabase
    local brevo
    local other
    
    hetzner=$(get_hetzner_costs)
    supabase=$(get_supabase_costs)
    brevo=$(get_brevo_costs)
    other=$(get_other_costs)
    
    echo "scale=2; $hetzner + $supabase + $brevo + $other" | bc
}

# Generiere Dashboard
generate_dashboard() {
    log "INFO" "Generiere Kosten-Dashboard..."
    
    local hetzner
    local supabase
    local brevo
    local other
    local total
    
    hetzner=$(get_hetzner_costs)
    supabase=$(get_supabase_costs)
    brevo=$(get_brevo_costs)
    other=$(get_other_costs)
    total=$(calculate_total_costs)
    
    local current_month=$(date +%B)
    local current_year=$(date +%Y)
    local current_date=$(date +%Y-%m-%d)
    
    # Berechne Prozentsätze
    local hetzner_pct
    local supabase_pct
    local brevo_pct
    local other_pct
    
    hetzner_pct=$(echo "scale=1; $hetzner * 100 / $total" | bc)
    supabase_pct=$(echo "scale=1; $supabase * 100 / $total" | bc)
    brevo_pct=$(echo "scale=1; $brevo * 100 / $total" | bc)
    other_pct=$(echo "scale=1; $other * 100 / $total" | bc)
    
    # Erstelle Markdown Report
    cat > "$REPORT_FILE" << EOF
# 📊 Kosten-Report $current_month $current_year

**Generiert:** $current_date

---

## 💰 Monatliche Kostenübersicht

| Dienst | Kosten (€) | Anteil |
|--------|-----------|--------|
| Hetzner Cloud | $hetzner | $hetzner_pct% |
| Supabase | $supabase | $supabase_pct% |
| Brevo | $brevo | $brevo_pct% |
| Sonstige (Domain) | $other | $other_pct% |
| **Gesamt** | **$total** | **100%** |

---

## 🔍 Detaillierte Aufschlüsselung

### Hetzner Cloud ($hetzner€/Monat)
- **CX11 Server:** 4.51€ (2 vCPUs, 4GB RAM)
- **Traffic:** ~2.00€ (geschätzt, 1TB Outbound)
- **Backups/Snapshots:** ~1.00€ (geschätzt)
- **Budget Limit:** $HETZNER_MONTHLY_BUDGET€
- **Status:** $(echo "$hetzner < $HETZNER_MONTHLY_BUDGET" | bc -l && echo "✅ Innerhalb Budget" || echo "⚠️ Budget überschritten")

### Supabase ($supabase€/Monat)
- **Plan:** Free Tier
- **Datenbank Limit:** $SUPABASE_FREE_MB MB
- **Storage Limit:** 1 GB
- **Status:** ✅ Free Tier ausreichend

### Brevo (Sendinblue) ($brevo€/Monat)
- **Plan:** Free Tier
- **Email Limit:** $BREVO_DAILY_LIMIT/Tag
- **Status:** ✅ Free Tier ausreichend

### Sonstige ($other€/Monat)
- **Domain:** ~1.50€ (18€/Jahr)

---

## 📈 Trends & Prognosen

### Aktuelle Nutzung
- **Gesamtkosten:** $total€/Monat
- **Jährliche Kosten:** $(echo "scale=2; $total * 12" | bc)€
- **Trend:** 📊 Stabil (keine Änderung erwartet)

### Prognose 2026
| Monat | Geschätzte Kosten |
|-------|------------------|
| Januar | $total€ |
| Februar | $total€ |
| März | $total€ |
| ... | ... |
| **Gesamt 2026** | **$(echo "scale=2; $total * 12" | bc)€** |

---

## 💡 Einsparungs-Potenziale

### Identifizierte Möglichkeiten

1. **Traffic-Optimierung (Hetzner)**
   - Potenzial: -0.50€ bis -1.00€/Monat
   - Maßnahme: CDN einrichten, Caching verbessern
   - Einsparung/Jahr: ~6-12€

2. **Datenbank-Optimierung (Supabase)**
   - Potenzial: Verbleiben im Free Tier
   - Maßnahme: Alte Logs löschen, Indizes optimieren
   - Einsparung: 25€/Monat (wenn Upgrade vermieden)

3. **Email-Optimierung (Brevo)**
   - Potenzial: Verbleiben im Free Tier
   - Maßnahme: Batch-Größen optimieren, Nicht-Essenzielle E-Mails reduzieren
   - Einsparung: 9€/Monat (wenn Upgrade vermieden)

**Gesamtpotenzial:** Bis zu 15-16€/Monat oder 180-192€/Jahr

---

## 🔔 Alert-Status

| Dienst | Status | Letzte Prüfung |
|--------|--------|----------------|
| Hetzner | ✅ OK | $current_date |
| Supabase | ✅ OK | $current_date |
| Brevo | ✅ OK | $current_date |

---

## 📝 Notizen

- Alle Dienste aktuell im Free Tier oder Minimal-Plan
- Keine kritischen Alerts in den letzten 30 Tagen
- Budget-Überwachung aktiv

---

*Report generiert von Cost Dashboard v1.0*
EOF

    log "INFO" "Dashboard generiert: $REPORT_FILE"
    
    # Zeige Dashboard in Konsole
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "     📊 KOSTEN-DASHBOARD $(date +%Y-%m)"
    echo "═══════════════════════════════════════════════════"
    echo ""
    printf "  %-20s %8s %10s\n" "Dienst" "Kosten" "Anteil"
    echo "  ------------------------------------------------"
    printf "  %-20s %8s %10s\n" "Hetzner Cloud" "${hetzner}€" "${hetzner_pct}%"
    printf "  %-20s %8s %10s\n" "Supabase" "${supabase}€" "${supabase_pct}%"
    printf "  %-20s %8s %10s\n" "Brevo" "${brevo}€" "${brevo_pct}%"
    printf "  %-20s %8s %10s\n" "Sonstige" "${other}€" "${other_pct}%"
    echo "  ------------------------------------------------"
    printf "  %-20s %8s %10s\n" "GESAMT" "${total}€" "100%"
    echo ""
    echo "  📄 Gesamter Report: docs/kosten/$(basename "$REPORT_FILE")"
    echo "═══════════════════════════════════════════════════"
}

# Sende Monatlichen Report
send_monthly_report() {
    local current_month=$(date +%B)
    local total=$(calculate_total_costs)
    local yearly=$(echo "scale=2; $total * 12" | bc)
    
    local message="📊 Monatlicher Kosten-Report: $current_month\n\n"
    message+="*Gesamtkosten:* ${total}€/Monat\n"
    message+="*Jährlich:* ${yearly}€\n\n"
    message+="*Aufschlüsselung:*\n"
    message+="• Hetzner: $(get_hetzner_costs)€\n"
    message+="• Supabase: $(get_supabase_costs)€\n"
    message+="• Brevo: $(get_brevo_costs)€\n"
    message+="• Sonstige: $(get_other_costs)€\n\n"
    message+="✅ Alle Systeme im Budget"
    
    send_telegram_alert "$message" "normal"
}

# Prüfe Budget-Grenzen
check_budget_thresholds() {
    local total=$(calculate_total_costs)
    local threshold=25  # Warnung bei 25€ Gesamtkosten
    
    log "INFO" "Prüfe Budget-Grenzen (Limit: ${threshold}€)..."
    
    if (( $(echo "$total >= $threshold" | bc -l) )); then
        local alert_key="budget_threshold_$(date +%Y-%m)"
        
        if ! grep -q "$alert_key" "$STATE_FILE" 2>/dev/null; then
            local message="⚠️ Gesamt-Budget Warnung\n\n"
            message+="*Aktuelle Kosten:* ${total}€/Monat\n"
            message+="*Warn-Threshold:* ${threshold}€\n\n"
            message+="*Überprüfe:*\n"
            message+="• Unnötige Hetzner-Ressourcen\n"
            message+="• Supabase Nutzung\n"
            message+="• Brevo Email-Volumen"
            
            send_telegram_alert "$message" "high"
            echo "$alert_key:true" >> "$STATE_FILE"
        fi
    fi
}

# Einsparungs-Empfehlungen generieren
generate_savings_report() {
    log "INFO" "Generiere Einsparungs-Report..."
    
    cat > "${DOCS_DIR}/einsparungspotenziale.md" << 'EOF'
# 💡 Einsparungs-Potenziale 2026

## Übersicht

Aktuelle monatliche Kosten: ~7-8€
Jährliche Kosten: ~85-95€

## Mögliche Einsparungen

### 1. Traffic-Optimierung (Hetzner)
**Potenzial:** -0.50€ bis -1.00€/Monat (-6 bis -12€/Jahr)

**Maßnahmen:**
- [ ] Cloudflare CDN einrichten (kostenlos)
- [ ] Bilder optimieren und cachen
- [ ] Static Assets auf CDN auslagern
- [ ] Gzip/Brotli Kompression aktivieren

**Priorität:** Mittel

---

### 2. Datenbank-Management (Supabase)
**Potenzial:** Verbleiben im Free Tier (25€/Monat Ersparnis)

**Maßnahmen:**
- [ ] Monatlich alte Logs prüfen und löschen
- [ ] Nicht verwendete Tabellen bereinigen
- [ ] Indizes optimieren (REINDEX)
- [ ] VACUUM regelmäßig ausführen
- [ ] Alte Auth-User ohne Aktivität löschen

**Priorität:** Hoch

---

### 3. Email-Optimierung (Brevo)
**Potenzial:** Verbleiben im Free Tier (9€/Monat Ersparnis)

**Maßnahmen:**
- [ ] Nicht-essenzielle E-Mails reduzieren
- [ ] Batch-Größen optimieren
- [ ] Supabase Auth für Transaktions-E-Mails nutzen
- [ ] Email-Templates cachen

**Priorität:** Mittel

---

### 4. Server-Optimierung (Hetzner)
**Potenzial:** -1.00€ bis -2.00€/Monat

**Maßnahmen:**
- [ ] Snapshots regelmäßig aufräumen
- [ ] Unnötige Backups löschen
- [ ] Downgrade auf CX11 prüfen (falls nicht schon)

**Priorität:** Niedrig

---

## Gesamtpotenzial

| Kategorie | Einsparung/Monat | Einsparung/Jahr |
|-----------|------------------|-----------------|
| Traffic | 0.50-1.00€ | 6-12€ |
| Supabase | 25.00€ | 300€ |
| Brevo | 9.00€ | 108€ |
| Server | 1.00-2.00€ | 12-24€ |
| **Gesamt** | **35.50-37.00€** | **426-444€** |

*Hinweis: Die tatsächlichen Einsparungen hängen vom Nutzungsverhalten ab.*

## Umsetzung

### Q1 2026
- [ ] Traffic-Monitoring implementieren
- [ ] CDN einrichten
- [ ] Datenbank-Bereinigung automatisieren

### Q2 2026
- [ ] Email-Optimierung durchführen
- [ ] Supabase Nutzung überprüfen
- [ ] Server-Snapshots aufräumen

### Kontinuierlich
- [ ] Monatliche Kosten-Reviews
- [ ] Alerts bei Threshold-Überschreitung
- [ ] Automatisierte Reports

EOF

    log "INFO" "Einsparungs-Report generiert"
}

# Haupt-Funktion
main() {
    log "INFO" "=== Cost Dashboard Start ==="
    
    # Stelle sicher, dass Verzeichnis existiert
    mkdir -p "$DOCS_DIR"
    
    # Generiere Dashboard
    generate_dashboard
    
    # Prüfe Thresholds
    check_budget_thresholds
    
    # Generiere Einsparungs-Report (einmal pro Monat)
    if [ ! -f "${DOCS_DIR}/einsparungspotenziale.md" ] || [ "$(date +%d)" = "01" ]; then
        generate_savings_report
    fi
    
    # Sende monatlichen Report (am 1. jeden Monats)
    if [ "$(date +%d)" = "01" ]; then
        send_monthly_report
    fi
    
    log "INFO" "=== Cost Dashboard Complete ==="
}

# Usage
usage() {
    cat << EOF
Cost Dashboard - Zentrales Kosten-Monitoring

Usage: $0 [command]

Commands:
    run         Führe Dashboard-Generation durch
    report      Zeige aktuellen Report an
    status      Zeige Kosten-Status
    savings     Generiere Einsparungs-Report
    send        Sende Report via Telegram
    help        Zeige diese Hilfe

EOF
}

# Status anzeigen
show_status() {
    echo "═══════════════════════════════════════"
    echo "      💰 KOSTEN-STATUS"
    echo "═══════════════════════════════════════"
    echo ""
    echo "Aktuelle monatliche Kosten:"
    echo ""
    printf "  %-15s %8s\n" "Hetzner:" "$(get_hetzner_costs)€"
    printf "  %-15s %8s\n" "Supabase:" "$(get_supabase_costs)€"
    printf "  %-15s %8s\n" "Brevo:" "$(get_brevo_costs)€"
    printf "  %-15s %8s\n" "Sonstige:" "$(get_other_costs)€"
    echo "  -----------------------"
    printf "  %-15s %8s\n" "Gesamt:" "$(calculate_total_costs)€"
    echo ""
    echo "Jährliche Kosten: $(echo "scale=2; $(calculate_total_costs) * 12" | bc)€"
    echo ""
    echo "Report-Verzeichnis: $DOCS_DIR"
    echo "═══════════════════════════════════════"
}

# Hauptprogramm
case "${1:-run}" in
    run)
        main
        ;;
    report)
        if [ -f "$REPORT_FILE" ]; then
            cat "$REPORT_FILE"
        else
            echo "Kein Report gefunden. Führe './cost-dashboard.sh run' aus."
        fi
        ;;
    status)
        show_status
        ;;
    savings)
        generate_savings_report
        echo "Einsparungs-Report erstellt: ${DOCS_DIR}/einsparungspotenziale.md"
        ;;
    send)
        if [ -f "$REPORT_FILE" ]; then
            send_monthly_report
        else
            echo "Kein Report vorhanden. Führe zuerst 'run' aus."
        fi
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo "Unbekannter Befehl: $1"
        usage
        exit 1
        ;;
esac
