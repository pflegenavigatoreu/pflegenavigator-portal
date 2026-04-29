#!/bin/bash

# ============================================
# Admin Docker Tools - Start Script
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}    Admin Docker Tools - Setup${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# Prüfe ob .env existiert
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ .env Datei nicht gefunden. Kopiere .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠ Bitte bearbeite .env und passe die Secrets an!${NC}"
    echo ""
fi

# Erstelle LibreChat Config-Verzeichnis
mkdir -p librechat-config
cp -n librechat.example.yml librechat-config/librechat.yml 2>/dev/null || true

echo -e "${BLUE}📥 Pulling Docker Images...${NC}"
docker-compose pull

echo ""
echo -e "${BLUE}🚀 Starting Services...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}✓ Services werden gestartet...${NC}"
echo ""

# Warte auf Services
echo -e "${BLUE}⏳ Warte auf Services...${NC}"
sleep 5

# Prüfe Status
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}    Alle Services gestartet!${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""
echo -e "${GREEN}🌐 Verfügbare Services:${NC}"
echo -e "   • Umami Analytics:    http://localhost:8001"
echo -e "   • Uptime Kuma:        http://localhost:3002"
echo -e "   • LibreTranslate:     http://localhost:5000"
echo -e "   • LibreChat:          http://localhost:3080"
echo ""
echo -e "${YELLOW}⚠ Wichtige Hinweise:${NC}"
echo -e "   • Umami Default Login: admin / umami"
echo -e "   • Uptime Kuma: Erst-Konfiguration bei http://localhost:3002"
echo -e "   • LibreChat: Erstelle einen Account bei http://localhost:3080"
echo ""
echo -e "${BLUE}📋 Verfügbare Befehle:${NC}"
echo -e "   ./stop.sh        - Alle Services stoppen"
echo -e "   ./logs.sh        - Logs anzeigen"
echo -e "   docker-compose logs -f [service]  - Logs für einen Service"
echo ""
