#!/bin/bash
# Cloudflare Tunnel Start-Skript für PflegeNavigator

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="/data/.openclaw/workspace/cloudflare"
LOG_DIR="/var/log/cloudflared"
PID_FILE="/var/run/cloudflared-tunnel.pid"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== PflegeNavigator Cloudflare Tunnel ===${NC}"

# Prüfe ob cloudflared installiert ist
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}FEHLER: cloudflared nicht installiert${NC}"
    echo "Installiere mit: curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb | sudo dpkg -i"
    exit 1
fi

# Log-Verzeichnis erstellen
sudo mkdir -p "$LOG_DIR"
sudo chmod 755 "$LOG_DIR"

# Prüfe Konfiguration
if [ ! -f "$CONFIG_DIR/config.yml" ]; then
    echo -e "${RED}FEHLER: config.yml nicht gefunden in $CONFIG_DIR${NC}"
    exit 1
fi

# Prüfe ob bereits läuft
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${YELLOW}Tunnel läuft bereits (PID: $PID)${NC}"
        echo "Verwende tunnel-status.sh für Status oder tunnel-stop.sh zum Stoppen"
        exit 0
    fi
fi

echo -e "${GREEN}Starte Cloudflare Tunnel für beta.pflegenavigatoreu.com...${NC}"
echo "Lokaler Service: http://localhost:3000"
echo "Logdatei: $LOG_DIR/tunnel.log"

# Starte Tunnel
sudo nohup cloudflared tunnel run \
    --config "$CONFIG_DIR/config.yml" \
    --pidfile "$PID_FILE" \
    >> "$LOG_DIR/tunnel.log" 2>&1 &

sleep 3

# Prüfe ob gestartet
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Tunnel gestartet (PID: $PID)${NC}"
        echo -e "${GREEN}✓ https://beta.pflegenavigatoreu.com ist jetzt erreichbar${NC}"
        echo ""
        echo "Nützliche Befehle:"
        echo "  ./tunnel-status.sh  - Status prüfen"
        echo "  ./tunnel-logs.sh    - Logs anzeigen"
        echo "  sudo systemctl stop cloudflared  - Systemd Service stoppen"
    else
        echo -e "${RED}FEHLER: Tunnel konnte nicht gestartet werden${NC}"
        echo "Prüfe Logs: $LOG_DIR/tunnel.log"
        exit 1
    fi
else
    echo -e "${RED}FEHLER: PID-Datei nicht erstellt${NC}"
    exit 1
fi
