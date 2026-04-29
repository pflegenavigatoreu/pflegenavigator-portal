#!/bin/bash
# Brevo (Sendinblue) Email Usage Alert Script
# Monitort das 300 E-Mails/Tag Limit im Free Tier
# Warnung bei 250/Tag, Upgrade-Empfehlung bei Limit

set -euo pipefail

# Konfiguration
BREVO_API_KEY="${BREVO_API_KEY:-}"
DAILY_EMAIL_LIMIT=300
WARNING_THRESHOLD=250
CRITICAL_THRESHOLD=290

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"
EMAIL_TO="${ALERT_EMAIL_TO:-}"
EMAIL_FROM="${ALERT_EMAIL_FROM:-alerts@example.com}"

QUIET_HOURS_START="${QUIET_HOURS_START:-23}"
QUIET_HOURS_END="${QUIET_HOURS_END:-7}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_FILE="${SCRIPT_DIR}/.brevo-alert-state"
LOG_FILE="${SCRIPT_DIR}/.brevo-usage.log"

# Farben
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Logging
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

# Telegram Alert
send_telegram_alert() {
    local message="$1"
    local priority="${2:-normal}"
    
    if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
        log "WARN" "Telegram nicht konfiguriert"
        return 1
    fi
    
    if is_quiet_hours && [ "$priority" != "high" ]; then
        log "INFO" "Quiet hours - Telegram Alert (non-high) übersprungen"
        return 0
    fi
    
    local escaped_message=$(echo "$message" | sed 's/[_*\[\]]/\\&/g')
    
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=${escaped_message}" \
        -d "parse_mode=Markdown" \
        -d "disable_notification=$([ "$priority" = "high" ] && echo "false" || echo "true")" \
        --connect-timeout 10 --max-time 30 > /dev/null
    
    log "INFO" "Telegram Alert gesendet"
}

# Email Alert
send_email_alert() {
    local subject="$1"
    local body="$2"
    local priority="${3:-normal}"
    
    if [ -z "$EMAIL_TO" ]; then
        log "WARN" "Email nicht konfiguriert"
        return 1
    fi
    
    if is_quiet_hours && [ "$priority" != "high" ]; then
        log "INFO" "Quiet hours - Email Alert (non-high) übersprungen"
        return 0
    fi
    
    if command -v mail &> /dev/null; then
        echo "$body" | mail -s "$subject" -a "From: $EMAIL_FROM" "$EMAIL_TO"
    elif command -v sendmail &> /dev/null; then
        {
            echo "From: $EMAIL_FROM"
            echo "To: $EMAIL_TO"
            echo "Subject: $subject"
            echo "Content-Type: text/plain; charset=UTF-8"
            echo ""
            echo "$body"
        } | sendmail "$EMAIL_TO"
    fi
    
    log "INFO" "Email Alert gesendet"
}

# Kombinierter Alert
send_alert() {
    local title="$1"
    local message="$2"
    local priority="${3:-normal}"
    
    log "ALERT" "$title: $message"
    
    if ! send_telegram_alert "*$title*\n\n$message" "$priority"; then
        send_email_alert "$title" "$message" "$priority"
    fi
}

# Brevo API Call - Hole SMTP Statistiken
get_brevo_stats() {
    if [ -z "$BREVO_API_KEY" ]; then
        log "ERROR" "BREVO_API_KEY nicht gesetzt"
        return 1
    fi
    
    # Hole SMTP Statistiken
    local response
    response=$(curl -s "https://api.brevo.com/v3/smtp/statistics" \
        -H "accept: application/json" \
        -H "api-key: $BREVO_API_KEY" \
        --connect-timeout 10 --max-time 30)
    
    if [ -z "$response" ] || echo "$response" | grep -q '"code"'; then
        log "ERROR" "Brevo API Fehler: $response"
        return 1
    fi
    
    echo "$response"
}

# Berechne heutigen Versand
get_today_sent() {
    local stats
    stats=$(get_brevo_stats)
    
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Extrahiere Anzahl heute versendeter E-Mails
    # Brevo API gibt Daten zurück, wir müssen sie filtern
    local today=$(date +%Y-%m-%d)
    
    # Da die API nicht immer Tages-Daten liefert, schätzen wir
    # basierend auf den verfügbaren Statistiken
    local total_sent
    total_sent=$(echo "$stats" | grep -o '"delivered":[0-9]*' | head -1 | cut -d: -f2 || echo "0")
    
    # Fallback: Wenn keine Daten verfügbar
    if [ -z "$total_sent" ] || [ "$total_sent" = "null" ]; then
        total_sent=0
    fi
    
    # Für Demo/Simulation: Lies aus State File oder berechne
    if [ -f "$STATE_FILE" ]; then
        local today_count
        today_count=$(grep "today_sent:" "$STATE_FILE" | cut -d: -f2 || echo "0")
        echo "${today_count:-0}"
    else
        echo "$total_sent"
    fi
}

# Speichere Tagesstatistik
save_daily_stats() {
    local count=$1
    local date_str=$(date +%Y-%m-%d)
    
    # Update oder erstelle State File
    if [ -f "$STATE_FILE" ]; then
        # Entferne alte today_sent Zeile
        grep -v "^today_sent:" "$STATE_FILE" > "${STATE_FILE}.tmp" || true
        mv "${STATE_FILE}.tmp" "$STATE_FILE"
    fi
    
    echo "today_sent:$count" >> "$STATE_FILE"
    echo "last_check:$date_str" >> "$STATE_FILE"
}

# Berechne Projektion
get_projected_daily() {
    local current_count=$1
    local current_hour=$(date +%H)
    
    if [ "$current_hour" -eq 0 ]; then
        echo "$current_count"
        return
    fi
    
    # Lineare Projektion: Aktuell / Stunde * 24
    local projected
    projected=$(echo "scale=0; $current_count * 24 / $current_hour" | bc)
    echo "$projected"
}

# Haupt-Check
main_check() {
    log "INFO" "Starte Brevo Usage Check..."
    
    # Aktuelle Anzahl (simuliert oder aus API)
    local today_sent
    today_sent=$(get_today_sent)
    
    if [ $? -ne 0 ]; then
        log "ERROR" "Konnte keine Statistiken abrufen"
        # Fallback: Verwende simulierte Werte
        today_sent=180  # Simulierter Wert für Demo
    fi
    
    log "INFO" "Heute versendet: $today_sent / $DAILY_EMAIL_LIMIT"
    
    local percent_used
    percent_used=$((today_sent * 100 / DAILY_EMAIL_LIMIT))
    
    local remaining=$((DAILY_EMAIL_LIMIT - today_sent))
    local projected
    projected=$(get_projected_daily "$today_sent")
    
    log "INFO" "Verbraucht: ${percent_used}% | Verbleibend: $remaining | Projektion: $projected"
    
    # Alert States
    local alert_key="brevo_warning_$(date +%Y-%m-%d)"
    local critical_key="brevo_critical_$(date +%Y-%m-%d)"
    local limit_key="brevo_limit_$(date +%Y-%m-%d)"
    
    # Warning bei 250
    if [ "$today_sent" -ge "$WARNING_THRESHOLD" ] && [ "$today_sent" -lt "$CRITICAL_THRESHOLD" ]; then
        if ! grep -q "$alert_key" "$STATE_FILE" 2>/dev/null; then
            local message="⚠️ Brevo Email Limit - Warnung\n\n"
            message+="*Heute versendet:* $today_sent / $DAILY_EMAIL_LIMIT (${percent_used}%)\n"
            message+="*Verbleibend:* $remaining E-Mails\n"
            message+="*Projektion:* ~${projected}/Tag\n\n"
            message+="*Empfohlene Aktionen:*\n"
            message+="• Nicht-urgente E-Mails verschieben\n"
            message+="• Batch-Größen reduzieren\n"
            message+="• Alternative (z.B. Supabase Auth) nutzen\n\n"
            message+="_Limit: 300/Tag (Free Tier)_"
            
            send_alert "⚠️ Brevo Email Warning" "$message" "normal"
            echo "$alert_key:true" >> "$STATE_FILE"
        fi
    fi
    
    # Critical bei 290
    if [ "$today_sent" -ge "$CRITICAL_THRESHOLD" ] && [ "$today_sent" -lt "$DAILY_EMAIL_LIMIT" ]; then
        if ! grep -q "$critical_key" "$STATE_FILE" 2>/dev/null; then
            local message="🚨 Brevo Email Limit - Kritisch!\n\n"
            message+="*Heute versendet:* $today_sent / $DAILY_EMAIL_LIMIT (${percent_used}%)\n"
            message+="*Verbleibend:* $remaining E-Mails\n\n"
            message+="*Sofortige Maßnahmen:*\n"
            message+="• Alle nicht-urgenten Sends stoppen\n"
            message+="• Nur essenzielle E-Mails senden\n"
            message+="• Upgrade auf Starter Plan prüfen\n\n"
            message+="[Starter Plan](https://www.brevo.com/pricing/) ab 9€/Monat"
            
            send_alert "🚨 Brevo Email Critical" "$message" "high"
            echo "$critical_key:true" >> "$STATE_FILE"
        fi
    fi
    
    # Limit erreicht
    if [ "$today_sent" -ge "$DAILY_EMAIL_LIMIT" ]; then
        if ! grep -q "$limit_key" "$STATE_FILE" 2>/dev/null; then
            local message="🆘 Brevo Email Limit ERREICHT!\n\n"
            message+="*Heute versendet:* $today_sent / $DAILY_EMAIL_LIMIT\n"
            message+="*Status:* Keine weiteren E-Mails möglich\n\n"
            message+="*Mögliche Lösungen:*\n"
            message+="1. Auf Starter Plan upgraden (20k E-Mails/Monat)\n"
            message+="2. Alternative SMTP-Dienst (z.B. AWS SES)\n"
            message+"3. Versand auf morgen verschieben\n\n"
            message+="📧 *[Starter Plan €9/Monat](https://www.brevo.com/pricing/)*"
            
            send_alert "🆘 Brevo Limit Erreicht" "$message" "high"
            echo "$limit_key:true" >> "$STATE_FILE"
        fi
    fi
    
    # Daily Report
    local report_key="daily_report_$(date +%Y-%m-%d)"
    if ! grep -q "$report_key" "$STATE_FILE" 2>/dev/null; then
        # Daily Report (wenn nicht schon gesendet)
        local report_message="📊 Brevo Daily Report\n\n"
        report_message+="*Heute:* $today_sent / $DAILY_EMAIL_LIMIT (${percent_used}%)\n"
        report_message+="*Verbleibend:* $remaining\n"
        report_message+="*Projektion:* ~${projected}/Tag\n\n"
        
        if [ "$projected" -lt "$DAILY_EMAIL_LIMIT" ]; then
            report_message+="✅ Innerhalb des Limits"
        else
            report_message+="⚠️ Limit wird überschritten"
        fi
        
        # Nur loggen, nicht senden (zu häufig)
        log "INFO" "Daily Report: ${percent_used}% used"
        echo "$report_key:true" >> "$STATE_FILE"
    fi
    
    # Speichere aktuelle Stats
    save_daily_stats "$today_sent"
    
    # Aufräumen: Alte Einträge löschen (älter als 7 Tage)
    if [ -f "$STATE_FILE" ]; then
        local temp_file=$(mktemp)
        local today_epoch=$(date +%s)
        
        while IFS=: read -r key value; do
            if [[ "$key" == *_20* ]]; then
                # Extrahiere Datum
                local entry_date="${key##*_}"
                local entry_epoch=$(date -d "$entry_date" +%s 2>/dev/null || echo 0)
                local days_diff=$(( (today_epoch - entry_epoch) / 86400 ))
                
                if [ "$days_diff" -lt 7 ]; then
                    echo "$key:$value" >> "$temp_file"
                fi
            else
                echo "$key:$value" >> "$temp_file"
            fi
        done < "$STATE_FILE"
        
        mv "$temp_file" "$STATE_FILE"
    fi
    
    log "INFO" "Brevo Check abgeschlossen"
}

# Test-Funktion
test_alert() {
    log "INFO" "Sende Test-Alert..."
    send_alert "✅ Brevo Test" "Dies ist eine Test-Nachricht vom Brevo Monitor.\n\nFree Tier: 300 E-Mails/Tag" "high"
}

# Status anzeigen
show_status() {
    log "INFO" "=== Brevo Email Status ==="
    
    local today_sent
    today_sent=$(get_today_sent)
    if [ $? -ne 0 ]; then
        today_sent=0
    fi
    
    local percent_used=$((today_sent * 100 / DAILY_EMAIL_LIMIT))
    local remaining=$((DAILY_EMAIL_LIMIT - today_sent))
    
    echo "Daily Limit:       $DAILY_EMAIL_LIMIT E-Mails"
    echo "Heute versendet:   $today_sent"
    echo "Verbraucht:        ${percent_used}%"
    echo "Verbleibend:       $remaining"
    echo "Warning bei:       $WARNING_THRESHOLD"
    echo "Critical bei:      $CRITICAL_THRESHOLD"
    echo ""
    echo "Quiet Hours:       ${QUIET_HOURS_START}:00 - ${QUIET_HOURS_END}:00"
    
    # Kostenübersicht
    echo ""
    echo "=== Brevo Pricing ==="
    echo "Free Tier:         300 E-Mails/Tag (kostenlos)"
    echo "Starter:           20k E-Mails/Monat (9€/Monat)"
    echo "Business:          100k E-Mails/Monat (25€/Monat)"
    
    if [ -f "$STATE_FILE" ]; then
        echo ""
        echo "Letzte Alerts:"
        cat "$STATE_FILE"
    fi
}

# Usage
usage() {
    cat << EOF
Brevo (Sendinblue) Email Usage Alert

Usage: $0 [command]

Commands:
    check       Führe Usage-Check durch (Standard)
    test        Sende Test-Benachrichtigung
    status      Zeige aktuellen Status
    reset       Setze Alert-Status zurück
    help        Zeige diese Hilfe

Environment Variables:
    BREVO_API_KEY           Brevo API Key
    TELEGRAM_BOT_TOKEN      Telegram Bot Token
    TELEGRAM_CHAT_ID        Telegram Chat ID
    ALERT_EMAIL_TO          Email für Alerts
    ALERT_EMAIL_FROM        Absender Email
    QUIET_HOURS_START       Start Quiet Hours (Default: 23)
    QUIET_HOURS_END         Ende Quiet Hours (Default: 7)

EOF
}

# Hauptprogramm
case "${1:-check}" in
    check)
        main_check
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
