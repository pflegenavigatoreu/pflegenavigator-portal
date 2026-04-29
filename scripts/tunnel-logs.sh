#!/bin/bash
# Cloudflare Tunnel Logs anzeigen

LOG_FILE="/var/log/cloudflared/tunnel.log"
SYSTEMD_LOGS=false
FOLLOW=false
LINES=50

# Hilfe
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Optionen:"
    echo "  -f, --follow    Logs live verfolgen (tail -f)"
    echo "  -s, --systemd   Systemd Journal Logs statt Datei"
    echo "  -n N           Anzahl Zeilen (default: 50)"
    echo "  -h, --help     Diese Hilfe"
    echo ""
    echo "Beispiele:"
    echo "  $0             Letzte 50 Zeilen"
    echo "  $0 -f          Live verfolgen"
    echo "  $0 -s -f       Systemd Logs live"
    echo "  $0 -n 100      Letzte 100 Zeilen"
}

# Argumente parsen
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -s|--systemd)
            SYSTEMD_LOGS=true
            shift
            ;;
        -n)
            LINES="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unbekannte Option: $1"
            show_help
            exit 1
            ;;
    esac
done

echo "=== PflegeNavigator Tunnel Logs ==="
echo ""

if [ "$SYSTEMD_LOGS" = true ]; then
    if [ "$FOLLOW" = true ]; then
        echo "Folge Systemd Logs (Ctrl+C zum Beenden)..."
        sudo journalctl -u cloudflared -f
    else
        echo "Letzte $LINES Zeilen aus Systemd Journal:"
        sudo journalctl -u cloudflared -n "$LINES" --no-pager
    fi
else
    if [ ! -f "$LOG_FILE" ]; then
        echo "Logdatei nicht gefunden: $LOG_FILE"
        echo "Verwende --systemd für Systemd Logs"
        exit 1
    fi
    
    if [ "$FOLLOW" = true ]; then
        echo "Folge Logdatei (Ctrl+C zum Beenden)..."
        tail -f "$LOG_FILE"
    else
        echo "Letzte $LINES Zeilen aus $LOG_FILE:"
        tail -n "$LINES" "$LOG_FILE"
    fi
fi
