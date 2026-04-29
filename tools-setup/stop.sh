#!/bin/bash

# Stoppe alle Services

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🛑 Stopping all services..."
docker-compose down

echo "✓ Alle Services gestoppt."
