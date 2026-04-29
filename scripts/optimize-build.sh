#!/bin/bash
# Build-Optimierung für PflegeNavigator

echo "🚀 Starte Build-Optimierung..."

# 1. Node Modules bereinigen
echo "📦 Bereinige node_modules..."
rm -rf node_modules/.cache

# 2. Next.js Build
echo "🔨 Starte Production Build..."
npm run build 2>&1 | tee build.log

# 3. Build-Größe analysieren
echo "📊 Analysiere Bundle-Größe..."
du -sh .next/
du -sh .next/static/

# 4. Lighthouse CI (falls verfügbar)
if command -v lighthouse &> /dev/null; then
    echo "🌐 Starte Lighthouse Audit..."
    lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html
fi

# 5. Ergebnis
echo "✅ Build-Optimierung abgeschlossen!"
echo "📁 Build-Log: build.log"
echo "🌐 Lighthouse-Report: lighthouse-report.html"
