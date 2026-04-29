#!/bin/bash
# Hetzner Cloud Budget Alert Script
# Monatliches Limit: 10€ (CX11 + Traffic)
# Benachrichtigung bei 80% des Limits

set -euo pipefail

# Konfiguration
HETZNER_API_TOKEN="${HETZNER_API_TOKEN:-}"
MONTHLY_BUDGET_EUR="${HETZNER_MONTHLY_BUDGET:-10}"
ALERT_THRESHOLD_PERCENT="${HETZNER_ALERT_THRESHOLD:-80}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"
EMAIL_TO="${ALERT_EMAIL_TO:-}"
EMAIL_FROM="${ALERT_EMAIL_FROM:-alerts@example.com}"
QUIET_HOURS_START="${QUIET_HOURS_START:-23}"
QUIET_HOURS_END="${QUIET_HOURS_END:-7}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_FILE="${SCRIPT_DIR}/.hetzner-alert-state"
LOG_FILE="${SCRIPT_DIR}/.hetzner-budget.log"

# Farben für Logging
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Logging-Funktion
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    echo -e "[$level] $message"
}

# Quiet Hours Check
is_quiet_hours() {
    local current_hour=$(date +%H)
    if [ "$current_hour" -ge "$QUIET_HOURS_START" ] || [ "$current_hour" -lt "$QUIET_HOURS_END" ]; then
        return 0
    fi
    return 1
}

# Telegram Benachrichtigung
send_telegram_alert() {
    local message="$1"
    local priority="${2:-normal}"
    
    if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
        log "WARN" "Telegram nicht konfiguriert"
        return 1
    fi
    
    # Bei quiet hours nur HIGH-Priority Alerts
    if is_quiet_hours && [ "$priority" != "high" ]; then
        log "INFO" "Quiet hours - Telegram Alert (non-high) übersprungen"
        return 0
    fi
    
    local escaped_message=$(echo "$message" | sed 's/[_*\[\]/]/\\&/g')
    
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=${escaped_message}" \
        -d "parse_mode=Markdown" \
        -d "disable_notification=$([ "$priority" = "high" ] && echo "false" || echo "true")" \
        --connect-timeout 10 --max-time 30 > /dev/null
    
    log "INFO" "Telegram Alert gesendet"
}

# Email Benachrichtigung (Fallback)
send_email_alert() {
    local subject="$1"
    local body="$2"
    local priority="${3:-normal}"
    
    if [ -z "$EMAIL_TO" ]; then
        log "WARN" "Email nicht konfiguriert"
        return 1
    fi
    
    # Bei quiet hours nur HIGH-Priority Alerts
    if is_quiet_hours && [ "$priority" != "high" ]; then
        log "INFO" "Quiet hours - Email Alert (non-high) übersprungen"
        return 0
    fi
    
    if command -v mail &> /dev/null; then
        echo "$body" | mail -s "$subject" -a "From: $EMAIL_FROM" "$EMAIL_TO"
        log "INFO" "Email Alert gesendet"
    elif command -v sendmail &> /dev/null; then
        {
            echo "From: $EMAIL_FROM"
            echo "To: $EMAIL_TO"
            echo "Subject: $subject"
            echo "Content-Type: text/plain; charset=UTF-8"
            echo ""
            echo "$body"
        } | sendmail "$EMAIL_TO"
        log "INFO" "Email Alert gesendet"
    else
        log "WARN" "Kein Mail-Client verfügbar"
        return 1
    fi
}

# Sende Alert über alle Kanäle
send_alert() {
    local title="$1"
    local message="$2"
    local priority="${3:-normal}"
    
    log "ALERT" "$title: $message"
    
    # Versuche Telegram, dann Email als Fallback
    if ! send_telegram_alert "*$title*\n\n$message" "$priority"; then
        send_email_alert "$title" "$message" "$priority"
    fi
}

# Hetzner API Call
hetzner_api_call() {
    local endpoint="$1"
    
    if [ -z "$HETZNER_API_TOKEN" ]; then
        log "ERROR" "HETZNER_API_TOKEN nicht gesetzt"
        return 1
    fi
    
    curl -s -H "Authorization: Bearer $HETZNER_API_TOKEN" \
         "https://api.hetzner.cloud/v1/${endpoint}" \
         --connect-timeout 10 --max-time 30
}

# Hole Server-Kosten
get_server_costs() {
    local servers_json
    servers_json=$(hetzner_api_call "servers")
    
    if [ -z "$servers_json" ] || [ "$servers_json" = "null" ]; then
        log "ERROR" "Konnte Server-Daten nicht abrufen"
        return 1
    fi
    
    echo "$servers_json" | jq -r '.servers[] | select(.server_type.name == "cx11") | "\(.name): \(.server_type.prices[0].price_monthly.gross)"' 2>/dev/null || echo ""
}

# Berechne aktuelle monatliche Kosten (geschätzt)
calculate_monthly_costs() {
    # CX11 Server: ca. 4.51€/Monat
    local server_cost=4.51
    
    # Schätze Traffic-Kosten (basierend auf typischem Verbrauch)
    # 1TB Outbound = ca. 1€ bei Hetzner
    local estimated_traffic_cost=2.00
    
    # Snapshots/Backups (falls vorhanden)
    local estimated_backup_cost=1.00
    
    echo "scale=2; $server_cost + $estimated_traffic_cost + $estimated_backup_cost" | bc
}

# Haupt-Check-Funktion
check_budget() {
    log "INFO" "Starte Hetzner Budget-Check..."
    
    local current_cost
    current_cost=$(calculate_monthly_costs)
    
    local budget_limit=$MONTHLY_BUDGET_EUR
    local threshold_cost
    threshold_cost=$(echo "scale=2; $budget_limit * $ALERT_THRESHOLD_PERCENT / 100" | bc)
    
    local percent_used
    percent_used=$(echo "scale=0; $current_cost * 100 / $budget_limit" | bc)
    
    log "INFO" "Aktuelle Kosten: ${current_cost}€ / ${budget_limit}€ (${percent_used}%)"
    log "INFO" "Schwellenwert: ${threshold_cost}€ (${ALERT_THRESHOLD_PERCENT}%)"
    
    # Status speichern
    local alert_key="hetzner_80_percent"
    local alert_sent=false
    
    if [ -f "$STATE_FILE" ]; then
        alert_sent=$(grep -q "$alert_key" "$STATE_FILE" && echo "true" || echo "false")
    fi
    
    # Warnung bei 80%
    if (( $(echo "$current_cost >= $threshold_cost" | bc -l) )) && [ "$alert_sent" = "false" ]; then
        local message="⚠️ Hetzner Cloud Budget bei ${percent_used}% (${current_cost}€ / ${budget_limit}€)\n\n"
        message+="*Server:* CX11 (~4.51€/Monat)\n"
        message+="*Geschätzter Traffic:* ~2.00€/Monat\n"
        message+="*Empfohlene Aktionen:*\n"
        message+="• Traffic optimieren (CDN, Caching)\n"
        message+="• Unnötige Snapshots löschen\n"
        message+="• Downgrade prüfen (falls möglich)"
        
        send_alert "🚨 Hetzner Budget Warnung" "$message" "high"
        
        # Markiere als gesendet
        echo "$alert_key:$(date +%Y-%m-%d)" >> "$STATE_FILE"
    fi
    
    # Kritisch bei 95%
    if (( $(echo "$current_cost >= $budget_limit * 0.95" | bc -l) )); then
        local critical_key="hetzner_95_percent"
        local critical_sent=false
        
        if [ -f "$STATE_FILE" ]; then
            critical_sent=$(grep -q "$critical_key" "$STATE_FILE" && echo "true" || echo "false")
        fi
        
        if [ "$critical_sent" = "false" ]; then
            local critical_message="🆘 Hetzner Budget KRITISCH bei ${percent_used}%!\n\n"
            critical_message+="*Sofortige Maßnahmen erforderlich:*\n"
            critical_message+="• Traffic-Daten prüfen\n"
            critical_message+="• Unnötige Ressourcen stoppen\n"
            critical_message+="• Server-Downgrade in Erwägung ziehen\n\n"
            critical_message+="Limit: ${budget_limit}€ | Aktuell: ${current_cost}€"
            
            send_alert "🆘 HETZNER BUDGET KRITISCH" "$critical_message" "high"
            echo "$critical_key:$(date +%Y-%m-%d)" >> "$STATE_FILE"
        fi
    fi
    
    # Tägliche Status-Report (nur einmal pro Tag)
    local daily_report_key="daily_report_$(date +%Y-%m-%d)"
    if ! grep -q "$daily_report_key" "$STATE_FILE" 2>/dev/null; then
        local report_message="📊 Hetzner Daily Report\n\n"
        report_message+="*Kosten:* ${current_cost}€ / ${budget_limit}€ (${percent_used}%)\n"
        report_message+="*Verfügbar:* $(echo "scale=2; $budget_limit - $current_cost" | bc)€\n\n"
        report_message+="*Ressourcen:*\n"
        report_message+="• Server: CX11 (2 vCPUs, 4GB RAM)\n"
        report_message+="• Traffic: ~20GB/Monat geschätzt\n"
        
        # Nicht senden, nur loggen (zu häufig)
        log "INFO" "Tagesreport: ${percent_used}% verbraucht"
        echo "$daily_report_key:true" >> "$STATE_FILE"
    fi
    
    # Alte State-Einträge aufräumen (älter als 7 Tage)
    if [ -f "$STATE_FILE" ]; then
        local temp_file=$(mktemp)
        while IFS=: read -r key date; do
            if [[ "$key" == daily_report_* ]]; then
                local entry_date="${key#daily_report_}"
                local days_diff=$(( ($(date +%s) - $(date -d "$entry_date" +%s 2>/dev/null || echo 0)) / 86400 ))
                if [ "$days_diff" -lt 7 ]; then
                    echo "$key:$date" >> "$temp_file"
                fi
            else
                echo "$key:$date" >> "$temp_file"
            fi
        done < "$STATE_FILE" 2>/dev/null || true
        mv "$temp_file" "$STATE_FILE"
    fi
    
    log "INFO" "Budget-Check abgeschlossen"
}

# Manuelle Test-Funktion
test_alert() {
    log "INFO" "Sende Test-Benachrichtigung..."
    send_alert "✅ Test Alert" "Dies ist eine Test-Benachrichtigung vom Hetzner Budget Monitor." "high"
}

# Usage
usage() {
    cat << EOF
Hetzner Cloud Budget Alert Script

Usage: $0 [command]

Commands:
    check       Führe Budget-Check durch (Standard)
    test        Sende Test-Benachrichtigung
    status      Zeige aktuellen Status
    reset       Setze Alert-Status zurück
    help        Zeige diese Hilfe

Environment Variables:
    HETZNER_API_TOKEN       Hetzner Cloud API Token
    HETZNER_MONTHLY_BUDGET  Monatliches Budget in € (Default: 10)
    HETZNER_ALERT_THRESHOLD Alert-Schwelle in % (Default: 80)
    TELEGRAM_BOT_TOKEN      Telegram Bot Token
    TELEGRAM_CHAT_ID        Telegram Chat ID
    ALERT_EMAIL_TO          Email für Alerts
    ALERT_EMAIL_FROM        Absender Email
    QUIET_HOURS_START       Start Quiet Hours (Default: 23)
    QUIET_HOURS_END         Ende Quiet Hours (Default: 7)

EOF
}

# Status anzeigen
show_status() {
    log "INFO" "=== Hetzner Budget Status ==="
    
    local current_cost
    current_cost=$(calculate_monthly_costs)
    local budget_limit=$MONTHLY_BUDGET_EUR
    local percent_used
    percent_used=$(echo "scale=0; $current_cost * 100 / $budget_limit" | bc)
    
    echo "Budget Limit:       ${budget_limit}€"
    echo "Geschätzte Kosten:  ${current_cost}€"
    echo "Verbraucht:         ${percent_used}%"
    echo "Verfügbar:          $(echo "scale=2; $budget_limit - $current_cost" | bc)€"
    echo "Alert bei:          ${ALERT_THRESHOLD_PERCENT}%"
    echo ""
    echo "Quiet Hours:        ${QUIET_HOURS_START}:00 - ${QUIET_HOURS_END}:00"
    
    if [ -f "$STATE_FILE" ]; then
        echo ""
        echo "Letzte Alerts:"
        cat "$STATE_FILE"
    fi
}

# Hauptprogramm
case "${1:-check}" in
    check)
        check_budget
        ;;
    test)
        test_alert
        ;;
    status)
        show_status
        ;;
    reset)
        rm -f "$STATE_FILE"
        log "INFO" "Alert-Status zurückgesetzt"
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        log "ERROR" "Unbekannter Befehl: $1"
        usage
        exit 1
        ;;
esac
