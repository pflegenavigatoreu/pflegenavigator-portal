#!/bin/bash
#
# CI Checks Script
# Lokale CI-Prüfungen vor Push
# Usage: ./scripts/ci-checks.sh [options]
#

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguration
VERBOSE=false
FIX_MODE=false
SKIP_BRANCH_CHECK=false
SKIP_TESTS=false

# Logging-Funktionen
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Hilfe anzeigen
show_help() {
    cat << EOF
CI Checks Script - Lokale Prüfungen vor Push

Usage: $0 [OPTIONS]

Options:
    -h, --help          Diese Hilfe anzeigen
    -v, --verbose       Ausführliche Ausgabe
    -f, --fix           Automatische Fehlerbehebung (lint --fix, prettier --write)
    --skip-branch       Branch-Namensprüfung überspringen
    --skip-tests        Tests überspringen
    --quick             Schneller Check (nur kritische Prüfungen)

Beispiele:
    $0                  Standard-Prüfungen
    $0 --fix            Mit automatischer Fehlerbehebung
    $0 --quick          Schneller Check
    $0 -v               Ausführliche Ausgabe

EOF
}

# Argumente parsen
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -f|--fix)
            FIX_MODE=true
            shift
            ;;
        --skip-branch)
            SKIP_BRANCH_CHECK=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --quick)
            SKIP_TESTS=true
            shift
            ;;
        *)
            log_error "Unbekannte Option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Verbose-Modus aktivieren
if [ "$VERBOSE" = true ]; then
    set -x
fi

log_info "Starte CI Checks..."
echo ""

# ============================================================
# 1. BRANCH-NAMENSKONVENTIONEN
# ============================================================
if [ "$SKIP_BRANCH_CHECK" = false ]; then
    log_info "Prüfe Branch-Namenskonvention..."
    
    BRANCH_NAME=$(git branch --show-current 2>/dev/null || echo "")
    
    if [ -z "$BRANCH_NAME" ]; then
        log_warning "Konnte aktuellen Branch nicht ermitteln"
    else
        # Erlaubte Patterns:
        # - main, develop, staging
        # - feature/*, feat/*
        # - bugfix/*, fix/*
        # - hotfix/*
        # - release/*
        # - refactor/*
        # - docs/*
        # - test/*
        # - chore/*
        
        VALID_PATTERN="^(main|develop|staging|master)$|^(feature|feat|bugfix|fix|hotfix|release|refactor|docs|test|chore)\/[a-z0-9-]+$"
        
        if [[ $BRANCH_NAME =~ $VALID_PATTERN ]]; then
            log_success "Branch-Name '$BRANCH_NAME' ist gültig"
        else
            log_error "Branch-Name '$BRANCH_NAME' entspricht nicht den Konventionen"
            echo ""
            echo "Erlaubte Formate:"
            echo "  - main, develop, staging"
            echo "  - feature/beschreibung, feat/beschreibung"
            echo "  - bugfix/beschreibung, fix/beschreibung"
            echo "  - hotfix/beschreibung"
            echo "  - release/v1.0.0"
            echo "  - refactor/beschreibung"
            echo "  - docs/beschreibung"
            echo "  - test/beschreibung"
            echo "  - chore/beschreibung"
            echo ""
            exit 1
        fi
    fi
    echo ""
fi

# ============================================================
# 2. UNCOMMITTED CHANGES
# ============================================================
log_info "Prüfe auf uncommitted Changes..."

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    log_warning "Es gibt uncommitted Changes:"
    git status --short
    echo ""
    read -p "Trotzdem fortfahren? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    log_success "Working tree ist clean"
fi
echo ""

# ============================================================
# 3. PACKAGE MANAGER CHECK
# ============================================================
log_info "Prüfe Package Manager..."

if [ -f "pnpm-lock.yaml" ]; then
    PKG_MANAGER="pnpm"
    LOCKFILE="pnpm-lock.yaml"
elif [ -f "yarn.lock" ]; then
    PKG_MANAGER="yarn"
    LOCKFILE="yarn.lock"
elif [ -f "package-lock.json" ]; then
    PKG_MANAGER="npm"
    LOCKFILE="package-lock.json"
else
    log_error "Keine Lockfile gefunden!"
    exit 1
fi

log_success "Package Manager: $PKG_MANAGER"
echo ""

# ============================================================
# 4. DEPENDENCY CHECK
# ============================================================
log_info "Prüfe Dependencies..."

# Prüfe ob node_modules existiert
if [ ! -d "node_modules" ]; then
    log_warning "node_modules nicht gefunden, installiere Dependencies..."
    $PKG_MANAGER install --frozen-lockfile
fi

# Prüfe ob node_modules älter als lockfile ist
if [ "node_modules" -ot "$LOCKFILE" ]; then
    log_warning "Dependencies sind veraltet, aktualisiere..."
    $PKG_MANAGER install --frozen-lockfile
fi

log_success "Dependencies sind aktuell"
echo ""

# ============================================================
# 5. SECURITY AUDIT
# ============================================================
log_info "Führe Security Audit durch..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm audit --audit-level=high || {
        log_warning "Security Audit hat Warnungen gefunden"
        read -p "Trotzdem fortfahren? [y/N] " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }
elif [ "$PKG_MANAGER" = "npm" ]; then
    npm audit --audit-level=high || {
        log_warning "Security Audit hat Warnungen gefunden"
        read -p "Trotzdem fortfahren? [y/N] " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }
fi

log_success "Security Audit abgeschlossen"
echo ""

# ============================================================
# 6. LINTING
# ============================================================
log_info "Führe Linting durch..."

if [ "$FIX_MODE" = true ]; then
    log_info "Auto-fix aktiviert..."
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm run lint -- --fix
    else
        npm run lint -- --fix
    fi
else
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm run lint -- --max-warnings=0
    else
        npm run lint -- --max-warnings=0
    fi
fi

log_success "Linting abgeschlossen"
echo ""

# ============================================================
# 7. PRETTIER FORMAT CHECK
# ============================================================
log_info "Prüfe Code Formatierung..."

if [ "$FIX_MODE" = true ]; then
    log_info "Formatiere Code..."
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm exec prettier --write "**/*.{ts,tsx,js,jsx,json,css,scss,md}"
    else
        npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,scss,md}"
    fi
else
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm exec prettier --check "**/*.{ts,tsx,js,jsx,json,css,scss,md}"
    else
        npx prettier --check "**/*.{ts,tsx,js,jsx,json,css,scss,md}"
    fi
fi

log_success "Code Formatierung geprüft"
echo ""

# ============================================================
# 8. TYPE CHECK
# ============================================================
log_info "Führe TypeScript Check durch..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm run type-check
else
    npm run type-check
fi

log_success "TypeScript Check abgeschlossen"
echo ""

# ============================================================
# 9. UNIT TESTS
# ============================================================
if [ "$SKIP_TESTS" = false ]; then
    log_info "Führe Unit Tests durch..."
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm run test:ci
    else
        npm run test:ci
    fi
    
    log_success "Unit Tests abgeschlossen"
    echo ""
fi

# ============================================================
# 10. BUILD CHECK
# ============================================================
log_info "Führe Build Check durch..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm run build
else
    npm run build
fi

log_success "Build Check abgeschlossen"
echo ""

# ============================================================
# 11. OUTDATED DEPENDENCIES CHECK
# ============================================================
log_info "Prüfe auf veraltete Dependencies..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    echo "Veraltete Packages:"
    pnpm outdated --format=table 2>/dev/null || log_info "Alle Dependencies sind aktuell"
elif [ "$PKG_MANAGER" = "npm" ]; then
    npm outdated 2>/dev/null || log_info "Alle Dependencies sind aktuell"
fi

echo ""

# ============================================================
# ZUSAMMENFASSUNG
# ============================================================
echo ""
echo "========================================"
log_success "Alle CI Checks erfolgreich! 🎉"
echo "========================================"
echo ""

exit 0
