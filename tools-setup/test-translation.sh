#!/bin/bash

# Test für LibreTranslate API

echo "🧪 Testing LibreTranslate..."
echo ""

# Warte auf den Service
sleep 2

# Test 1: Server läuft?
echo "Test 1: Prüfe ob Server erreichbar..."
if curl -s http://localhost:5000 > /dev/null; then
    echo "   ✓ Server ist erreichbar"
else
    echo "   ✗ Server nicht erreichbar. Warte noch etwas..."
    sleep 5
fi

# Test 2: Übersetzung
echo ""
echo "Test 2: Übersetzung (DE -> EN)..."
curl -s -X POST "http://localhost:5000/translate" \
    -H "Content-Type: application/json" \
    -d '{"q":"Hallo Welt, das ist ein Test","source":"de","target":"en"}' | python3 -m json.tool 2> /dev/null || cat

echo ""

# Test 3: Verfügbare Sprachen
echo ""
echo "Test 3: Verfügbare Sprachen..."
curl -s "http://localhost:5000/languages" | python3 -m json.tool 2> /dev/null || cat

echo ""

# Test 4: Auto-Detect
echo ""
echo "Test 4: Auto-Detection der Sprache..."
curl -s -X POST "http://localhost:5000/detect" \
    -H "Content-Type: application/json" \
    -d '{"q":"Bonjour le monde"}' | python3 -m json.tool 2> /dev/null || cat

echo ""
echo "✓ Tests abgeschlossen!"
