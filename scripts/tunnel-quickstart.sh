#!/bin/bash
# Schnellstart für Cloudflare Tunnel

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       PflegeNavigator - Cloudflare Tunnel Quickstart          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Prüfe Installation
if ! command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}⚠ cloudflared nicht installiert${NC}"
    echo "Installiere jetzt..."
    curl -L --output /tmp/cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i /tmp/cloudflared.deb
fi

# Prüfe Login
if [ ! -f ~/.cloudflared/cert.pem ]; then
    echo -e "${YELLOW}🔐 Cloudflare Login erforderlich${NC}"
    echo ""
    echo "Führe aus: cloudflared tunnel login"
    echo "(Öffnet Browser zur Authentifizierung)"
    echo ""
    echo -e "${YELLOW}Danach erneut ausführen:${NC} ./scripts/tunnel-quickstart.sh"
    exit 1
fi

echo -e "${GREEN}✓ cloudflared installiert und authentifiziert${NC}"

# Prüfe ob Tunnel existiert
TUNNEL_NAME="pflegenavigatoreu"
if ! cloudflared tunnel list 2>/dev/null | grep -q "$TUNNEL_NAME"; then
    echo -e "${YELLOW}📦 Erstelle Tunnel '$TUNNEL_NAME'...${NC}"
    cloudflared tunnel create "$TUNNEL_NAME"
fi

# Hole Tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
echo -e "${GREEN}✓ Tunnel ID: $TUNNEL_ID${NC}"

# DNS Route erstellen
echo -e "${YELLOW}🌐 Erstelle DNS Route für beta.pflegenavigatoreu.com...${NC}"
cloudflared tunnel route dns "$TUNNEL_NAME" beta.pflegenavigatoreu.com 2>/dev/null || echo "Route existiert bereits"

# Credentials kopieren
echo -e "${YELLOW}🔑 Kopiere Credentials...${NC}"
sudo mkdir -p /root/.cloudflared/
sudo cp ~/.cloudflared/${TUNNEL_ID}.json /root/.cloudflared/ 2>/dev/null || true
sudo cp ~/.cloudflared/cert.pem /root/.cloudflared/ 2>/dev/null || true

# Config aktualisieren
CONFIG_FILE="/data/.openclaw/workspace/cloudflare/config.yml"
sed -i "s/<DEIN_TUNNEL_ID>/${TUNNEL_ID}/g" "$CONFIG_FILE"

# Log-Verzeichnis
sudo mkdir -p /var/log/cloudflared

# Systemd Service installieren
echo -e "${YELLOW}⚙️  Installiere Systemd Service...${NC}"
sudo cp /data/.openclaw/workspace/cloudflare/cloudflared.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cloudflared

# Starte Services
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    🚀 STARTE TUNNEL                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}1. Starte Cloudflare Tunnel...${NC}"
sudo systemctl restart cloudflared
sleep 3

if systemctl is-active --quiet cloudflared; then
    echo -e "${GREEN}✓ Tunnel läuft!${NC}"
else
    echo -e "${RED}✗ Tunnel konnte nicht gestartet werden${NC}"
    sudo systemctl status cloudflared --no-pager
    exit 1
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🎉 ERLEDIGT! Dein PflegeNavigator ist jetzt online!          ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BLUE}Öffentliche URL:${NC} https://beta.pflegenavigatoreu.com"
echo -e "  ${BLUE}Lokaler Port:${NC}    http://localhost:3000"
echo ""
echo -e "  ${YELLOW}Wichtig:${NC} Stelle sicher, dass deine Next.js App läuft:"
echo -e "           npm run start  (im PflegeNavigator Verzeichnis)"
echo ""
echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
echo "Nützliche Befehle:"
echo "  ./tunnel-status.sh    - Status prüfen"
echo "  ./tunnel-logs.sh -f   - Live Logs"
echo "  ./tunnel-stop.sh      - Tunnel stoppen"
echo ""
echo -e "QR-Code: cat /data/.openclaw/workspace/cloudflare/qr-code.txt"
echo ""
