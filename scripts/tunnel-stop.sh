#!/bin/bash
# Cloudflare Tunnel Stop-Skript

PID_FILE="/var/run/cloudflared-tunnel.pid"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== PflegeNavigator Tunnel Stoppen ===${NC}"
echo ""

# Stoppe Systemd Service falls aktiv
if systemctl is-active --quiet cloudflared 2>/dev/null; then
    echo "Stoppe Systemd Service..."
    sudo systemctl stop cloudflared
    sleep 2
    if systemctl is-active --quiet cloudflared 2>/dev/null; then
        echo -e "${RED}FEHLER: Systemd Service läuft noch${NC}"
    else
        echo -e "${GREEN}✓ Systemd Service gestoppt${NC}"
    fi
fi

# Stoppe manuellen Prozess
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Stoppe manuellen Tunnel (PID: $PID)..."
        sudo kill -TERM "$PID"
        sleep 2
        
        # Prüfe ob noch läuft
        if ps -p "$PID" > /dev/null 2>&1; then
            echo "Erzwinge Beenden..."
            sudo kill -KILL "$PID"
        fi
        
        if ps -p "$PID" > /dev/null 2>&1; then
            echo -e "${RED}FEHLER: Konnte Prozess nicht stoppen${NC}"
        else
            echo -e "${GREEN}✓ Manueller Tunnel gestoppt${NC}"
            rm -f "$PID_FILE"
        fi
    else
        echo "PID-Datei existiert aber Prozess nicht - bereinige..."
        rm -f "$PID_FILE"
    fi
else
    # Suche nach laufenden cloudflared Prozessen
    PIDS=$(pgrep -f "cloudflared.*tunnel" || true)
    if [ -n "$PIDS" ]; then
        echo "Gefundene cloudflared Prozesse: $PIDS"
        echo "Stoppe..."
        sudo kill -TERM $PIDS 2>/dev/null || true
        sleep 2
        sudo kill -KILL $(pgrep -f "cloudflared.*tunnel" || echo "") 2>/dev/null || true
        echo -e "${GREEN}✓ Tunnel-Prozesse gestoppt${NC}"
    else
        echo "Keine laufenden Tunnel-Prozesse gefunden"
    fi
fi

echo ""
echo -e "${GREEN}Tunnel gestoppt. https://beta.pflegenavigatoreu.com ist nicht mehr erreichbar.${NC}"
