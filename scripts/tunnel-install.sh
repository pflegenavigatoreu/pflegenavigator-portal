#!/bin/bash
# Cloudflare Tunnel Setup-Skript für PflegeNavigator
# Einmalig ausführen nach cloudflared login

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

WORKSPACE="/data/.openclaw/workspace"
CLOUDFLARE_DIR="$WORKSPACE/cloudflare"

echo -e "${BLUE}=== PflegeNavigator Cloudflare Tunnel Setup ===${NC}"
echo ""

# Prüfe ob cloudflared installiert
if ! command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}Installiere cloudflared...${NC}"
    curl -L --output /tmp/cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i /tmp/cloudflared.deb
fi

echo -e "${GREEN}✓ cloudflared installiert${NC}"

# Prüfe ob Login erfolgt
if [ ! -f ~/.cloudflared/cert.pem ]; then
    echo -e "${YELLOW}⚠ Login erforderlich!${NC}"
    echo "Führe aus: cloudflared tunnel login"
    echo "Dann dieses Skript erneut starten."
    exit 1
fi

echo -e "${GREEN}✓ Cloudflare Login vorhanden${NC}"

# Prüfe ob Tunnel existiert
if ! cloudflared tunnel list 2>/dev/null | grep -q "pflegenavigator"; then
    echo -e "${YELLOW}Erstelle Tunnel 'pflegenavigator'...${NC}"
    cloudflared tunnel create pflegenavigatoreu
else
    echo -e "${GREEN}✓ Tunnel 'pflegenavigatoreu' existiert${NC}"
fi

# Hole Tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep "pflegenavigatoreu" | awk '{print $1}')
echo "Tunnel ID: $TUNNEL_ID"

# DNS Route
if ! cloudflared tunnel route dns pflegenavigatoreu beta.pflegenavigatoreu.com 2>/dev/null; then
    echo "DNS Route existiert bereits oder wird erstellt..."
fi

# Credentials kopieren
sudo mkdir -p /root/.cloudflared/
if [ -f ~/.cloudflared/${TUNNEL_ID}.json ]; then
    sudo cp ~/.cloudflared/${TUNNEL_ID}.json /root/.cloudflared/
    sudo cp ~/.cloudflared/cert.pem /root/.cloudflared/ 2>/dev/null || true
    echo -e "${GREEN}✓ Credentials kopiert${NC}"
fi

# Config aktualisieren
sed -i "s/<DEIN_TUNNEL_ID>/${TUNNEL_ID}/g" "$CLOUDFLARE_DIR/config.yml"
echo -e "${GREEN}✓ Konfiguration aktualisiert${NC}"

# Log-Verzeichnis
sudo mkdir -p /var/log/cloudflared

# Systemd Service installieren
echo -e "${YELLOW}Installiere Systemd Service...${NC}"
sudo cp "$CLOUDFLARE_DIR/cloudflared.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cloudflared

echo ""
echo -e "${GREEN}=== Setup abgeschlossen! ===${NC}"
echo ""
echo "Nächste Schritte:"
echo "1. Next.js starten: npm run start (im Projektverzeichnis)"
echo "2. Tunnel starten: sudo systemctl start cloudflared"
echo "   ODER: ./scripts/tunnel-start.sh"
echo ""
echo "Status prüfen:"
echo "  sudo systemctl status cloudflared"
echo "  ./scripts/tunnel-status.sh"
echo ""
echo "Domain wird verfügbar sein unter:"
echo "  https://beta.pflegenavigatoreu.com"
