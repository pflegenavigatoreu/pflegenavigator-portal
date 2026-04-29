# Cloudflare Tunnel für PflegeNavigator

## Überblick
Dauerhafter öffentlicher Zugriff auf PflegeNavigator via Cloudflare Free Tier.

- **Domain:** https://beta.pflegenavigatoreu.com
- **Lokaler Port:** 3000 (Next.js)
- **Kosten:** Kostenlos (Cloudflare Free Tier)

## Ersteinrichtung (Einmalig)

### 1. Cloudflare Account & Token erstellen

```bash
# Login (öffnet Browser)
cloudflared tunnel login
```

Das speichert das Zertifikat unter `~/.cloudflared/cert.pem`.

### 2. Tunnel erstellen

```bash
# Erstelle Tunnel
cloudflared tunnel create pflegenavigator

# Merke dir die Tunnel ID (z.B. 12345-abc...)
# Liste Tunnel: cloudflared tunnel list
```

### 3. DNS Eintrag erstellen

```bash
# Verbinde Domain mit Tunnel
cloudflared tunnel route dns pflegenavigator beta.pflegenavigatoreu.com
```

### 4. Token kopieren

```bash
# Kopiere Credentials-Datei
# Die Datei liegt in ~/.cloudflared/<TUNNEL_ID>.json
# Kopiere nach /root/.cloudflared/ (für root Service)

sudo mkdir -p /root/.cloudflared
sudo cp ~/.cloudflared/<TUNNEL_ID>.json /root/.cloudflared/
sudo cp ~/.cloudflared/cert.pem /root/.cloudflared/ 2>/dev/null || true
```

### 5. Config anpassen

Editiere `/data/.openclaw/workspace/cloudflare/config.yml`:
- Ersetze `<DEIN_TUNNEL_ID>` mit deiner Tunnel ID
- Ersetze `<DEIN_TUNNEL_ID>` im credentials-file Pfad

## Automatischer Start (Systemd)

```bash
# Service installieren
sudo cp /data/.openclaw/workspace/cloudflare/cloudflared.service /etc/systemd/system/
sudo systemctl daemon-reload

# Autostart aktivieren
sudo systemctl enable cloudflared

# Service starten
sudo systemctl start cloudflared

# Status prüfen
sudo systemctl status cloudflared
```

## Manuelle Bedienung

Skripte liegen in `/data/.openclaw/workspace/scripts/`:

```bash
# Tunnel starten
./scripts/tunnel-start.sh

# Status prüfen
./scripts/tunnel-status.sh

# Logs anzeigen
./scripts/tunnel-logs.sh
./scripts/tunnel-logs.sh -f        # Live folgen

# Tunnel stoppen
./scripts/tunnel-stop.sh
```

## Troubleshooting

### Tunnel verbindet nicht

1. Prüfe ob Next.js läuft: `curl http://localhost:3000`
2. Logs checken: `./scripts/tunnel-logs.sh -f`
3. Token prüfen: `ls -la /root/.cloudflared/`

### DNS Fehler

- Domain muss in Cloudflare Dashboard als Zone existieren
- DNS Eintrag wird automatisch via `cloudflared tunnel route dns` erstellt

### Autostart funktioniert nicht

```bash
# Service prüfen
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -f
```

## Verzeichnisstruktur

```
/data/.openclaw/workspace/
├── cloudflare/
│   ├── config.yml              # Tunnel Konfiguration
│   ├── cloudflared.service     # Systemd Service
│   └── README.md               # Diese Datei
└── scripts/
    ├── tunnel-start.sh         # Tunnel starten
    ├── tunnel-status.sh        # Status prüfen
    ├── tunnel-logs.sh          # Logs anzeigen
    └── tunnel-stop.sh          # Tunnel stoppen
```

## QR-Code

Der QR-Code für schnellen Zugriff auf `beta.pflegenavigatoreu.com` liegt unter:
`/data/.openclaw/workspace/cloudflare/qr-code.txt`

## Ressourcen

- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps)
- [Cloudflare Free Tier](https://www.cloudflare.com/plans/)
