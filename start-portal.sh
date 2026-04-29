#!/bin/bash
# PflegeNavigator Portal Starter
cd /data/.openclaw/workspace
npm run dev > /tmp/portal.log 2>&1 &
sleep 4
echo "Portal wird gestartet..."
echo "Öffne Browser in 3 Sekunden..."
sleep 3
chromium http://localhost:3000 &