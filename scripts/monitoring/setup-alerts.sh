#!/bin/bash
# Setup Alert Configuration
# Konfiguriere Telegram Bot, Email, Quiet Hours, und Cron Jobs

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Farben
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       🔔 ALERT SETUP - Kosten-Monitoring${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Prüfe Umgebung
check_prerequisites() {
    echo "📋 Prüfe Voraussetzungen..."
    
    local missing=()
    
    if ! command -v curl &> /dev/null; then
        missing+=("curl")
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️ jq nicht gefunden (optional, aber empfohlen)${NC}"
    fi
    
    if [ ${#missing[@]} -gt 0 ]; then
        echo -e "${RED}❌ Fehlende Tools: ${missing[*]}${NC}"
        echo "Installiere mit: sudo apt-get install ${missing[*]}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Alle Voraussetzungen erfüllt${NC}"
}

# Telegram Bot Setup
setup_telegram() {
    echo ""
    echo "📱 Telegram Bot Konfiguration"
    echo "────────────────────────────────────────────"
    echo ""
    
    echo "Um Telegram Alerts zu erhalten, benötigst du:"
    echo "1. Einen Telegram Bot (erstelle ihn mit @BotFather)"
    echo "2. Deine Chat ID (finde sie mit @userinfobot)"
    echo ""
    
    read -p "Möchtest du Telegram einrichten? (j/n): " setup_tg
    
    if [ "$setup_tg" = "j" ] || [ "$setup_tg" = "J" ]; then
        echo ""
        echo "Schritte:"
        echo "1. Öffne Telegram und suche nach @BotFather"
        echo "2. Sende /newbot und folge den Anweisungen"
        echo "3. Speichere das Bot Token"
        echo "4. Suche nach @userinfobot und starte ihn"
        echo "5. Speichere deine Chat ID"
        echo ""
        
        read -p "Bot Token (z.B. 123456789:ABCdef...): " bot_token
        read -p "Chat ID (z.B. 123456789): " chat_id
        
        if [ -n "$bot_token" ] && [ -n "$chat_id" ]; then
            # Speichere in .env Datei
            echo "TELEGRAM_BOT_TOKEN=$bot_token" >> "$WORKSPACE_DIR/.env"
            echo "TELEGRAM_CHAT_ID=$chat_id" >> "$WORKSPACE_DIR/.env"
            
            # Teste Verbindung
            echo ""
            echo "🧪 Teste Telegram Verbindung..."
            
            local test_response
            test_response=$(curl -s "https://api.telegram.org/bot${bot_token}/getMe" || echo "{}")
            
            if echo "$test_response" | grep -q '"ok":true'; then
                echo -e "${GREEN}✅ Bot Verbindung erfolgreich${NC}"
                
                # Sende Test-Nachricht
                curl -s -X POST "https://api.telegram.org/bot${bot_token}/sendMessage" \
                    -d "chat_id=${chat_id}" \
                    -d "text=✅ Kosten-Monitoring Alerts aktiviert!" \
                    > /dev/null
                
                echo -e "${GREEN}✅ Test-Nachricht gesendet${NC}"
            else
                echo -e "${RED}❌ Bot Verbindung fehlgeschlagen${NC}"
                echo "Überprüfe dein Token und versuche es erneut."
            fi
        else
            echo -e "${YELLOW}⚠️ Keine Werte eingegeben, überspringe Telegram Setup${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Telegram Setup übersprungen${NC}"
    fi
}

# Email Setup
setup_email() {
    echo ""
    echo "📧 Email Konfiguration"
    echo "────────────────────────────────────────────"
    echo ""
    
    read -p "Möchtest du Email Alerts einrichten? (j/n): " setup_email
    
    if [ "$setup_email" = "j" ] || [ "$setup_email" = "J" ]; then
        read -p "Email-Adresse für Alerts: " email_to
        read -p "Absender-Email (optional): " email_from
        
        if [ -n "$email_to" ]; then
            echo "ALERT_EMAIL_TO=$email_to" >> "$WORKSPACE_DIR/.env"
            if [ -n "$email_from" ]; then
                echo "ALERT_EMAIL_FROM=$email_from" >> "$WORKSPACE_DIR/.env"
            fi
            
            # Prüfe ob mail/sendmail verfügbar
            if command -v mail > /dev/null 2>&1 || command -v sendmail > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Email-Tool gefunden${NC}"
            else
                echo -e "${YELLOW}⚠️ Kein mail/sendmail gefunden. Installiere postfix oder sendmail für Email-Alerts.${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️ Keine Email eingegeben, überspringe Email Setup${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Email Setup übersprungen${NC}"
    fi
}

# Quiet Hours Setup
setup_quiet_hours() {
    echo ""
    echo "🌙 Quiet Hours Konfiguration"
    echo "────────────────────────────────────────────"
    echo ""
    echo "Während Quiet Hours werden nur HIGH-Priority Alerts gesendet."
    echo ""
    
    read -p "Quiet Hours Start (0-23, Default: 23): " quiet_start
    read -p "Quiet Hours Ende (0-23, Default: 7): " quiet_end
    
    quiet_start=${quiet_start:-23}
    quiet_end=${quiet_end:-7}
    
    echo "QUIET_HOURS_START=$quiet_start" >> "$WORKSPACE_DIR/.env"
    echo "QUIET_HOURS_END=$quiet_end" >> "$WORKSPACE_DIR/.env"
    
    echo ""
    echo -e "${GREEN}✅ Quiet Hours: ${quiet_start}:00 - ${quiet_end}:00${NC}"
}

# Hetzner API Setup
setup_hetzner() {
    echo ""
    echo "☁️ Hetzner Cloud Konfiguration"
    echo "────────────────────────────────────────────"
    echo ""
    
    read -p "Möchtest du Hetzner Monitoring einrichten? (j/n): " setup_hetz
    
    if [ "$setup_hetz" = "j" ] || [ "$setup_hetz" = "J" ]; then
        echo ""
        echo "1. Gehe zu https://console.hetzner.cloud/"
        echo "2. Wähle dein Projekt"
        echo "3. Gehe zu 'Sicherheit' → 'API-Tokens'"
        echo "4. Erstelle einen neuen Token mit 'Read' Berechtigung"
        echo ""
        
        read -p "Hetzner API Token: " hetzner_token
        read -p "Monatliches Budget in € (Default: 10): " hetzner_budget
        
        if [ -n "$hetzner_token" ]; then
            echo "HETZNER_API_TOKEN=$hetzner_token" >> "$WORKSPACE_DIR/.env"
            echo "HETZNER_MONTHLY_BUDGET=${hetzner_budget:-10}" >> "$WORKSPACE_DIR/.env"
            
            # Teste Token
            echo ""
            echo "🧪 Teste Hetzner API..."
            
            local test_response
            test_response=$(curl -s -H "Authorization: Bearer $hetzner_token" \
                "https://api.hetzner.cloud/v1/servers" || echo "{}")
            
            if echo "$test_response" | grep -q '"servers"'; then
                echo -e "${GREEN}✅ Hetzner API Verbindung erfolgreich${NC}"
            else
                echo -e "${YELLOW}⚠️ API Test unklar - Token möglicherweise ungültig${NC}"
            fi
        fi
    fi
}

# Brevo API Setup
setup_brevo() {
    echo ""
    echo "📨 Brevo (Sendinblue) Konfiguration"
    echo "────────────────────────────────────────────"
    echo ""
    
    read -p "Möchtest du Brevo Monitoring einrichten? (j/n): " setup_brevo
    
    if [ "$setup_brevo" = "j" ] || [ "$setup_brevo" = "J" ]; then
        echo ""
        echo "1. Gehe zu https://app.brevo.com/settings/keys/smtp"
        echo "2. Kopiere deinen API Key"
        echo ""
        
        read -p "Brevo API Key: " brevo_key
        
        if [ -n "$brevo_key" ]; then
            echo "BREVO_API_KEY=$brevo_key" >> "$WORKSPACE_DIR/.env"
            echo -e "${GREEN}✅ Brevo API Key gespeichert${NC}"
        fi
    fi
}

# Cron Jobs einrichten
setup_cron() {
    echo ""
    echo "⏰ Cron Jobs Konfiguration"
    echo "────────────────────────────────────────────"
    echo ""
    
    read -p "Möchtest du automatische Checks einrichten? (j/n): " setup_cron
    
    if [ "$setup_cron" = "j" ] || [ "$setup_cron" = "J" ]; then
        echo ""
        echo "Folgende Jobs werden eingerichtet:"
        echo "• Hetzner Check: Alle 6 Stunden"
        echo "• Brevo Check: Alle 4 Stunden"
        echo "• Cost Dashboard: Täglich um 9 Uhr"
        echo "• Monatlicher Report: 1. jeden Monats"
        echo ""
        
        read -p "Fortfahren? (j/n): " confirm
        
        if [ "$confirm" = "j" ] || [ "$confirm" = "J" ]; then
            # Erstelle Cron Jobs
            local cron_file="/tmp/cost-monitoring-cron"
            
            cat > "$cron_file" <> EOF
# Cost Monitoring Cron Jobs
# Hetzner Check alle 6 Stunden
0 */6 * * * cd $SCRIPT_DIR && ./hetzner-budget-alert.sh check >> /tmp/hetzner-check.log 2>&1

# Brevo Check alle 4 Stunden
0 */4 * * * cd $SCRIPT_DIR && ./brevo-usage-alert.sh check >> /tmp/brevo-check.log 2>&1

# Cost Dashboard täglich um 9 Uhr
0 9 * * * cd $SCRIPT_DIR && ./cost-dashboard.sh run >> /tmp/cost-dashboard.log 2>&1

# Monatlicher Report am 1. um 10 Uhr
0 10 1 * * cd $SCRIPT_DIR && ./cost-dashboard.sh send >> /tmp/cost-report.log 2>&1
EOF
            
            # Zeige dem User was gemacht wird
            echo ""
            echo "Cron Jobs die hinzugefügt werden:"
            cat "$cron_file"
            echo ""
            
            read -p "Zu crontab hinzufügen? (j/n): " add_cron
            
            if [ "$add_cron" = "j" ] || [ "$add_cron" = "J" ]; then
                # Füge zu crontab hinzu (ohne bestehende zu überschreiben)
                (crontab -l 2>/dev/null; cat "$cron_file") | crontab -
                echo -e "${GREEN}✅ Cron Jobs hinzugefügt${NC}"
                echo ""
                echo "Zeige aktuelle crontab:"
                crontab -l | grep -A 20 "Cost Monitoring"
            else
                echo -e "${YELLOW}⚠️ Cron Jobs nicht hinzugefügt${NC}"
                echo "Du kannst sie später manuell hinzufügen:"
                echo "  crontab -e"
                echo "Und füge den Inhalt von $cron_file ein."
            fi
            
            rm -f "$cron_file"
        fi
    else
        echo -e "${YELLOW}⚠️ Cron Jobs übersprungen${NC}"
        echo ""
        echo "Du kannst Checks manuell ausführen:"
        echo "  ./scripts/monitoring/hetzner-budget-alert.sh check"
        echo "  ./scripts/monitoring/brevo-usage-alert.sh check"
        echo "  ./scripts/monitoring/cost-dashboard.sh run"
    fi
}

# Erstelle .env Beispieldatei
create_env_template() {
    echo ""
    echo "📝 Erstelle .env Template..."
    
    cat > "$WORKSPACE_DIR/.env.example" <> EOF
# Cost Monitoring Environment Variables

# Telegram Alerts
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Email Alerts (optional)
ALERT_EMAIL_TO=your@email.com
ALERT_EMAIL_FROM=alerts@yourdomain.com

# Quiet Hours (keine Alerts zwischen diesen Stunden, außer HIGH priority)
QUIET_HOURS_START=23
QUIET_HOURS_END=7

# Hetzner Cloud
HETZNER_API_TOKEN=your_hetzner_token
HETZNER_MONTHLY_BUDGET=10

# Supabase (optional - für erweiterte Monitoring)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Brevo (Sendinblue)
BREVO_API_KEY=your_brevo_api_key
EOF
    
    echo -e "${GREEN}✅ .env.example erstellt${NC}"
}

# Teste Alerts
test_alerts() {
    echo ""
    echo "🧪 Teste Alerts"
    echo "────────────────────────────────────────────"
    echo ""
    
    read -p "Sollen Test-Alerts gesendet werden? (j/n): " test_alerts
    
    if [ "$test_alerts" = "j" ] || [ "$test_alerts" = "J" ]; then
        echo ""
        echo "Sende Test-Alerts..."
        
        cd "$SCRIPT_DIR"
        
        echo "1. Hetzner Test..."
        ./hetzner-budget-alert.sh test 2>/dev/null || echo -e "${YELLOW}⚠️ Hetzner Test fehlgeschlagen${NC}"
        
        echo "2. Brevo Test..."
        ./brevo-usage-alert.sh test 2>/dev/null || echo -e "${YELLOW}⚠️ Brevo Test fehlgeschlagen${NC}"
        
        echo ""
        echo -e "${GREEN}✅ Test-Alerts gesendet!${NC}"
        echo "Überprüfe deine Benachrichtigungen."
    fi
}

# Haupt-Setup
main() {
    check_prerequisites
    
    # Erstelle/Backup .env
    if [ -f "$WORKSPACE_DIR/.env" ]; then
        cp "$WORKSPACE_DIR/.env" "$WORKSPACE_DIR/.env.backup.$(date +%Y%m%d%H%M%S)"
        echo -e "${YELLOW}📦 Bestehende .env gesichert${NC}"
    fi
    
    setup_telegram
    setup_email
    setup_quiet_hours
    setup_hetzner
    setup_brevo
    create_env_template
    setup_cron
    test_alerts
    
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}       ✅ SETUP ABGESCHLOSSEN!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Nächste Schritte:"
    echo "1. Überprüfe die .env Datei: cat .env"
    echo "2. Lade Umgebungsvariablen: source .env"
    echo "3. Führe erste Checks durch:"
    echo "   ./scripts/monitoring/hetzner-budget-alert.sh status"
    echo "   ./scripts/monitoring/brevo-usage-alert.sh status"
    echo "   ./scripts/monitoring/cost-dashboard.sh status"
    echo ""
    echo "Dokumentation: docs/kosten/KOSTEN_MONITORING.md"
    echo ""
}

# Usage
usage() {
    cat << EOF
Alert Setup - Konfiguriere Kosten-Monitoring

Usage: $0 [command]

Commands:
    (none)      Interaktives Setup
    quick       Schnelles Setup (nur .env erstellen)
    test        Sende Test-Alerts
    status      Zeige Setup-Status
    help        Zeige diese Hilfe

EOF
}

# Quick Setup (nur .env erstellen)
quick_setup() {
    echo "Schnelles Setup..."
    create_env_template
    echo ""
    echo "✅ .env.example erstellt"
    echo "Kopiere es zu .env und fülle deine Werte aus:"
    echo "  cp .env.example .env"
    echo "  nano .env"
}

# Zeige Status
show_status() {
    echo "═══════════════════════════════════════"
    echo "       🔧 SETUP STATUS"
    echo "═══════════════════════════════════════"
    echo ""
    
    # Prüfe .env
    if [ -f "$WORKSPACE_DIR/.env" ]; then
        echo -e "${GREEN}✅ .env Datei vorhanden${NC}"
        echo ""
        echo "Konfigurierte Werte:"
        grep -E "^[A-Z_]+=" "$WORKSPACE_DIR/.env" | while read -r line; do
            local key="${line%%=*}"
            local value="${line#*=}"
            # Maskiere sensitive Daten
            if [[ "$key" == *TOKEN* ]] || [[ "$key" == *KEY* ]]; then
                echo "  $key: ${value:0:10}..."
            else
                echo "  $key: $value"
            fi
        done
    else
        echo -e "${YELLOW}⚠️ Keine .env Datei gefunden${NC}"
    fi
    
    echo ""
    
    # Prüfe Cron Jobs
    if crontab -l 2>/dev/null | grep -q "cost-monitoring"; then
        echo -e "${GREEN}✅ Cron Jobs konfiguriert${NC}"
    else
        echo -e "${YELLOW}⚠️ Keine Cron Jobs gefunden${NC}"
    fi
    
    echo ""
    
    # Prüfe Scripts
    echo "Scripts Status:"
    for script in hetzner-budget-alert.sh brevo-usage-alert.sh cost-dashboard.sh; do
        if [ -x "$SCRIPT_DIR/$script" ]; then
            echo -e "  ${GREEN}✅${NC} $script"
        else
            echo -e "  ${YELLOW}⚠️${NC} $script (nicht ausführbar)"
        fi
    done
}

# Hauptprogramm
case "${1:-}" in
    quick)
        quick_setup
        ;;
    test)
        cd "$SCRIPT_DIR"
        test_alerts
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        usage
        ;;
    "")
        main
        ;;
    *)
        echo "Unbekannter Befehl: $1"
        usage
        exit 1
        ;;
esac
