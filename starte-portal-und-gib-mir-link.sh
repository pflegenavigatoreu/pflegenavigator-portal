#!/bin/bash
# PFLEGENAVIGATOR PORTAL STARTER
# Kopiere dies in Terminal und drücke Enter

echo "=== PflegeNavigator Portal wird gestartet ==="
cd /data/.openclaw/workspace

# Server im Hintergrund starten
echo "1. Starte Portal-Server..."
nohup npm run dev > /tmp/portal.log 2>&1 &
sleep 5

# Prüfen ob Server läuft
echo "2. Prüfe Server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server läuft auf http://localhost:3000"
else
    echo "❌ Server startet noch... warte 5 Sekunden"
    sleep 5
fi

# Ngrok starten
echo "3. Starte öffentlichen Tunnel..."
echo "Warte auf ngrok-Link..."
nohup ngrok http 3000 > /tmp/ngrok.log 2>&1 &
sleep 8

# Link extrahieren
LINK=$(grep -o "https://[a-z0-9]*\.ngrok\.io" /tmp/ngrok.log | head -1)

if [ -n "$LINK" ]; then
    echo ""
    echo "=========================================="
    echo "✅ DEIN PORTAL IST ONLINE!"
    echo ""
    echo "Lokal: http://localhost:3000"
    echo "Öffentlich: $LINK"
    echo ""
    echo "🔗 Diesen Link in Telegram an Agent schicken!"
    echo "=========================================="
    
    # Link in Datei speichern für einfachen Zugriff
    echo "$LINK" > /tmp/portal-link.txt
    
    # Browser öffnen
    chromium http://localhost:3000 2>/dev/null || firefox http://localhost:3000 2>/dev/null || echo "Browser öffnen: http://localhost:3000"
else
    echo "❌ Ngrok-Link nicht gefunden. Nochmal warten..."
    sleep 5
    LINK=$(grep -o "https://[a-z0-9]*\.ngrok\.io" /tmp/ngrok.log | head -1)
    echo "Link: $LINK"
fi

echo ""
echo "Um zu stoppen: killall node ngrok"
echo "Portal läuft im Hintergrund weiter..."
