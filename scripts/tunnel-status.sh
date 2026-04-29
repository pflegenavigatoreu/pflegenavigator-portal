#!/bin/bash
# Cloudflare Tunnel Status-Skript

PID_FILE="/var/run/cloudflared-tunnel.pid"
LOG_FILE="/var/log/cloudflared/tunnel.log"
CONFIG_FILE="/data/.openclaw/workspace/cloudflare/config.yml"

# Farben
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== PflegeNavigator Tunnel Status ===${NC}"
echo ""

# Systemd Service Status
if systemctl is-active --quiet cloudflared 2>/dev/null; then
    echo -e "${GREEN}● Systemd Service: AKTIV${NC}"
    systemctl status cloudflared --no-pager -l | head -6
else
    echo -e "${YELLOW}○ Systemd Service: INAKTIV${NC}"
fi

echo ""

# Manuelle Prozess-Prüfung
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${GREEN}● Manueller Tunnel: LÄUFT (PID: $PID)${NC}"
        ps -p "$PID" -o pid,ppid,cmd,etime
    else
        echo -e "${RED}✗ Manueller Tunnel: NICHT LÄUFEND (stale PID file)${NC}"
        rm -f "$PID_FILE"
    fi
else
    echo -e "${YELLOW}○ Kein manueller Tunnel aktiv${NC}"
fi

echo ""

# Konfiguration
echo -e "${BLUE}--- Konfiguration ---${NC}"
if [ -f "$CONFIG_FILE" ]; then
    echo "Config: $CONFIG_FILE"
    grep -E "^(tunnel:|hostname:|service:)" "$CONFIG_FILE" 2>/dev/null | head -5
else
    echo -e "${RED}Config nicht gefunden!${NC}"
fi

echo ""

# Lokaler Service-Check
echo -e "${BLUE}--- Lokaler Service (Port 3000) ---${NC}"
if nc -z localhost 3000 2>/dev/null || curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\\|301\\|302"; then
    echo -e "${GREEN}✓ Next.js auf Port 3000 erreichbar${NC}"
else
    echo -e "${RED}✗ Next.js auf Port 3000 NICHT erreichbar${NC}"
    echo "  Starte die App: npm run start (im Next.js Verzeichnis)"
fi

echo ""

# Netzwerk-Check
echo -e "${BLUE}--- Öffentliche URL ---${NC}"
echo "Domain: https://beta.pflegenavigatoreu.com"
echo ""
echo "Test: curl -I https://beta.pflegenavigatoreu.com"
echo ""

# Log-Auszug
echo -e "${BLUE}--- Letzte Log-Einträge ---${NC}"
if [ -f "$LOG_FILE" ]; then
    tail -n 5 "$LOG_FILE"
else
    echo "Keine Logdatei gefunden"
fi
