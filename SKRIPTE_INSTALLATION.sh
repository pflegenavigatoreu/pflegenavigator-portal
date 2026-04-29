#!/bin/bash
# INSTALLATIONSSKRIPTE für PflegeNavigator
# Einmalig ausführen nach Setup

echo "🏥 PflegeNavigator EU - Installation"
echo "======================================"
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Prüfe Root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}❌ Bitte als root ausführen: sudo bash $0${NC}"
  exit 1
fi

# 1. System-Updates
echo "📦 System-Updates..."
apt-get update && apt-get upgrade -y

# 2. Node.js 22 installieren
echo "📦 Node.js 22 installieren..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# 3. npm global packages
echo "📦 npm packages..."
npm install -g npm@latest
npm install -g pm2

# 4. Git
echo "📦 Git..."
apt-get install -y git

# 5. Docker (optional)
echo "📦 Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $SUDO_USER
  systemctl enable docker
  systemctl start docker
fi

# 6. Docker Compose
echo "📦 Docker Compose..."
apt-get install -y docker-compose-plugin

# 7. Cloudflared
echo "📦 Cloudflared..."
if ! command -v cloudflared &> /dev/null; then
  curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
  dpkg -i cloudflared.deb
fi

# 8. Projekt-Verzeichnis
echo "📁 Projekt-Verzeichnis..."
PROJECT_DIR="/data/.openclaw/workspace"
cd $PROJECT_DIR

# 9. Dependencies
echo "📦 npm install..."
npm install

# 10. Build
echo "🔨 Build..."
npm run build

# 11. PM2 Setup
echo "🚀 PM2 Setup..."
pm2 start npm --name "pflegenavigator" -- start

# 12. PM2 Autostart
echo "🔄 PM2 Autostart..."
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
npm2 save

# 13. Cloudflare Tunnel (Interaktiv)
echo ""
echo -e "${YELLOW}☁️  Cloudflare Tunnel einrichten...${NC}"
echo "Dies öffnet einen Browser-Link zum Login."
read -p "Weiter? (j/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Jj]$ ]]; then
  cloudflared tunnel login
  
  echo "Tunnel erstellen..."
  cloudflared tunnel create pflegenavigator
  
  echo "DNS Route erstellen..."
  cloudflared tunnel route dns pflegenavigator beta.pflegenavigatoreu.com
  
  # Config kopieren
  mkdir -p /root/.cloudflared
  cp ~/.cloudflared/*.json /root/.cloudflared/ 2>/dev/null || true
  
  # Service installieren
  cp $PROJECT_DIR/cloudflare/cloudflared.service /etc/systemd/system/
  systemctl daemon-reload
  systemctl enable cloudflared
  systemctl start cloudflared
  
  echo -e "${GREEN}✅ Cloudflare Tunnel aktiv!${NC}"
fi

# 14. Docker-Stack (optional)
echo ""
read -p "Docker-Stack starten? (j/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Jj]$ ]]; then
  docker-compose up -d
  echo -e "${GREEN}✅ Docker-Stack läuft!${NC}"
fi

# 15. Firewall
echo "🛡️  Firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# 16. Fertig
echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}✅ Installation abgeschlossen!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "📊 Status prüfen:"
echo "  - PM2: pm2 status"
echo "  - Docker: docker-compose ps"
echo "  - Cloudflare: systemctl status cloudflared"
echo ""
echo "🌐 Portal: https://beta.pflegenavigatoreu.com"
echo ""
echo "📖 Dokumentation:"
echo "  - Admin-TODO: cat ADMIN_TODO_FINAL.md"
echo "  - Status: cat STATUS_FINAL.md"
echo ""
