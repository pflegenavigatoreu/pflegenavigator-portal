# ⚡ Quickstart - Cloudflare Tunnel

## Einmalige Einrichtung (2 Minuten)

```bash
# Ins Verzeichnis wechseln
cd /data/.openclaw/workspace

# Schnellstart-Skript ausführen
./scripts/tunnel-quickstart.sh
```

Das Skript erledigt alles automatisch:
- ✅ Cloudflare Login (falls nötig)
- ✅ Tunnel erstellen
- ✅ DNS Route einrichten
- ✅ Systemd Service installieren
- ✅ Autostart aktivieren

## Danach: Next.js starten

```bash
cd /pfad/zu/pflegenavigator
npm run start
```

Fertig! Deine App ist unter `https://beta.pflegenavigatoreu.com` erreichbar.

## Manuelle Steuerung

```bash
# Status
./scripts/tunnel-status.sh

# Logs live ansehen
./scripts/tunnel-logs.sh -f

# Tunnel stoppen
./scripts/tunnel-stop.sh

# Neustarten
sudo systemctl restart cloudflared
```

## Fehlerbehebung

**Tunnel verbindet nicht?**
```bash
# Prüfe ob Next.js läuft
curl http://localhost:3000

# Logs checken
sudo journalctl -u cloudflared -f
```

**Login abgelaufen?**
```bash
cloudflared tunnel login
./scripts/tunnel-quickstart.sh
```
