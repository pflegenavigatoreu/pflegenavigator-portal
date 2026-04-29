#!/bin/bash

# Zeige Logs aller Services

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -z "$1" ]; then
    echo "📋 Logs aller Services (Strg+C zum Beenden):"
    docker-compose logs -f
else
    echo "📋 Logs für Service: $1 (Strg+C zum Beenden):"
    docker-compose logs -f "$1"
fi
