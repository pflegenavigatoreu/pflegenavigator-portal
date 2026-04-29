#!/bin/bash
echo "=== PflegeNavigator Portal Starter ==="
echo ""

# Zum Verzeichnis wechseln
cd /data/.openclaw/workspace

# Alte Prozesse beenden
pkill -f "next" 2>/dev/null
pkill -f "ngrok" 2>/dev/null
sleep 2

echo "1. Starte Portal-Server..."
npm run dev > /tmp/portal.log 2>&1 &
sleep 8

echo "2. Starte ngrok Tunnel..."
ngrok http 3000 > /tmp/ngrok.log 2>&1 &
sleep 5

echo ""
echo "=== WICHTIGE LINKS ==="
echo ""
echo "Lokaler Link:"
echo "http://localhost:3000"
echo ""
echo "Öffentlicher Link (für Beta-Tester):"
grep -o "https://[a-z0-9]*\.ngrok\.io" /tmp/ngrok.log | head -1
echo ""
echo "Der öffentliche Link funktioniert nur solange dieser Laptop läuft!"
echo ""
echo "Um zu stoppen: Strg+C drücken"
echo ""
read -p "Enter drücken zum Öffnen im Browser..."
chromium http://localhost:3000 2>/dev/null || firefox http://localhost:3000 2>/dev/null || echo "Bitte selbst Browser öffnen"

# Warten
echo ""
echo "Portal läuft. Schließen Sie dieses Fenster nicht!"
wait