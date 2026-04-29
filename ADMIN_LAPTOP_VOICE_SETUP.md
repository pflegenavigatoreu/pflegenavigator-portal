# ADMIN KONFIGURATION - LAPTOP-ZUGRIFF & VOICE-COMMANDS
## Für: Inhaber Frank (8751446925) | Admin: Frankie
**Datum:** 28.04.2026 | **Priorität:** KRITISCH | **Zeitaufwand:** ~2-3 Stunden

---

## 🎯 ZIEL

**WICHTIG:** Der Agent läuft in der Cloud (OpenClaw Gateway), NICHT lokal.

**Kommunikations-Fluss:**
```
FRANK (Voice/Text in Telegram)
    ↓
[Cloud-Agent empfängt Nachricht]
    ↓
ENTSCHEIDUNG:
    ├─→ A) Antwort direkt in Telegram
    └─→ B) Aktion auf Laptop via SSH/Remote-Desktop
            ↓
        [Router mit Port-Forwarding 2222]
            ↓
        [FRANKS LAPTOP]
            ↓
        [Ergebnis: Anzeige auf Laptop + Rückmeldung Telegram]
```

**Beispiele:**
- "Zeige mir Video auf Laptop" → Video öffnet sich auf Laptop + Bestätigung in Telegram
- "Schicke mir Bericht" → PDF kommt direkt in Telegram
- "Generiere Video auf Laptop" → Video wird auf Laptop erstellt + Link/Datei in Telegram

**Frank steuert ALLES per Telegram → Cloud-Agent arbeitet auf Laptop oder antwortet direkt**

---

## 📊 TABELLE: ADMIN KONFIGURATION (15 Schritte)

| # | System | Was zu tun ist | Exakte Befehle/Steps | Zeit | Ergebnis |
|---|--------|---------------|----------------------|------|----------|
| **1** | **SSH Server** | OpenSSH-Server auf Franks Laptop installieren | `sudo apt update && sudo apt install openssh-server` (Linux) ODER aktivieren in Windows Einstellungen → Apps → Optionale Features → OpenSSH-Server | 10 min | Remote SSH-Zugriff möglich |
| **2** | **SSH Port** | Port 22 öffnen + Firewall-Regel | `sudo ufw allow 22/tcp && sudo ufw enable` (Linux) ODER Windows Firewall → Eingehende Regeln → Port 22 erlauben | 5 min | SSH von außen erreichbar |
| **3** | **Static IP** | Laptop fixe IP im Netzwerk geben | Router Admin-Oberfläche → DHCP → Statische Lease für Franks MAC-Adresse (z.B. 192.168.1.100) | 10 min | Laptop immer unter gleicher IP erreichbar |
| **4** | **Port Forwarding** | Router: externer Port 2222 → intern 192.168.1.100:22 | Router → Port Forwarding → External Port 2222 → Internal IP 192.168.1.100:22 | 10 min | Von außen via Internet erreichbar |
| **5** | **Public IP** | Franks öffentliche IP herausfinden | Auf Franks Laptop: `curl ifconfig.me` → Notieren (z.B. 87.123.45.67) | 2 min | Agent weiß wohin verbinden |
| **6** | **SSH Key** | SSH-Key für Agent erstellen (kein Passwort!) | Auf Agent-Server: `ssh-keygen -t ed25519 -f ~/.ssh/frank_laptop` → Public Key an Frankie senden | 5 min | Schlüssel-basierte Authentifizierung |
| **7** | **SSH Config** | Public Key auf Franks Laptop eintragen | Auf Franks Laptop: `mkdir -p ~/.ssh && echo "ssh-ed25519 AAA... agent@server" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys` | 5 min | Agent kann sich ohne Passwort einloggen |
| **8** | **VPN/WireGuard** | (OPTIONAL aber sicherer) WireGuard VPN einrichten | `sudo apt install wireguard` → Keys generieren → Config erstellen → Agent im selben Netzwerk | 30 min | Sichere verschlüsselte Verbindung |
| **9** | **Voice Control** | Voice-Command Software auf Laptop installieren | **Linux:** `sudo apt install python3-piper` + `whisper.cpp` konfigurieren ODER **Windows:** Windows Speech Recognition aktivieren + PowerToys installieren | 20 min | Laptop versteht Sprachbefehle |
| **10** | **Voice Hotkey** | Globaler Hotkey für Voice-Commands | **Linux:** `xdotool` + Custom Script (Strg+Leertaste) → startet Voice-Erkennung ODER **Windows:** Win+H (Windows Speech) | 10 min | Frank drückt Taste → spricht Befehl |
| **11** | **TTS Install** | Text-to-Speech auf Laptop für Agent-Antworten | **Linux:** `sudo apt install espeak-ng` + `paplay` ODER **Windows:** Windows TTS (SAPI5) bereits integriert | 10 min | Laptop kann Agent-Antworten vorlesen |
| **12** | **Screen Share** | Remote Desktop für visuelle Rückmeldung | **Linux:** `sudo apt install x11vnc` ODER **Windows:** RDP aktivieren (Einstellungen → System → Remotedesktop) | 15 min | Agent sieht Bildschirm und kann zeigen |
| **13** | **Video Tools** | FFmpeg + Python + OpenCV installieren für Video-Gen | `sudo apt install ffmpeg python3 python3-pip python3-opencv` + `pip3 install moviepy imageio[ffmpeg]` | 15 min | Videos können lokal generiert werden |
| **14** | **File Sync** | Ordner für Agent-Zugriff freigeben | `mkdir -p ~/AgentWorkspace && chmod 777 ~/AgentWorkspace` + Symlink zu Cloud (optional) | 5 min | Geteilter Arbeitsbereich |
| **15** | **Test Verbindung** | Alles testen | Von Agent-Server: `ssh -p 2222 frank@87.123.45.67 "echo Verbindung OK"` | 10 min | Alles funktioniert |

---

## 🗣️ VOICE-COMMAND SETUP (Zusätzlich zu Schritt 9-11)

| Komponente | Linux-Befehl | Windows-Einstellung |
|------------|--------------|---------------------|
| **Voice Wake Word** | `pvporcupine` (Hey Portal) ODER `openwakeword` | Windows Cortana deaktivieren, stattdessen PowerToys Run |
| **Speech-to-Text** | `whisper.cpp --model base --language de` | Windows Speech Recognition (Win+H) |
| **Command Parser** | Python-Script: `voice_commands.py` | PowerShell-Script: `voice_handler.ps1` |
| **Text-to-Speech** | `espeak-ng -v de "Agent antwortet"` | `Add-Type -AssemblyName System.Speech; $synth.Speak("Agent antwortet")` |
| **Visual Feedback** | `notify-send "Agent" "Aufgabe erledigt"` | `Windows.UI.Notifications` API |

---

## 🔐 SICHERHEITSMASSNAHMEN (MUSS!)

| Massnahme | Warum | Befehl/Setting |
|-----------|-------|----------------|
| **Fail2Ban** | Verhindert Brute-Force | `sudo apt install fail2ban && sudo systemctl enable fail2ban` |
| **Nur SSH-Key** | Keine Passwörter | In `/etc/ssh/sshd_config`: `PasswordAuthentication no` |
| **Port 2222** | Nicht Standard-Port (Sicherheit durch Obscurity) | `/etc/ssh/sshd_config`: `Port 2222` |
| **Ufw Firewall** | Nur notwendige Ports | `sudo ufw default deny incoming && sudo ufw allow 2222/tcp` |
| **Autoupdates** | Sicherheitspatches | `sudo apt install unattended-upgrades` |
| **VPN statt Port-Forwarding** | Wenn möglich, sicherer | WireGuard statt Port-Forwarding verwenden |

---

## 📋 CHECKLISTE FÜR ADMIN (Abhaken!)

```
□ 1. SSH-Server installiert
□ 2. Port 22 (bzw. 2222) geöffnet
□ 3. Statische IP vergeben (192.168.1.XXX)
□ 4. Port-Forwarding im Router eingerichtet
□ 5. Public IP notiert (87.XXX.XXX.XXX)
□ 6. SSH-Key für Agent erstellt
□ 7. Public Key auf Laptop eingetragen
□ 8. VPN/WireGuard (optional aber empfohlen)
□ 9. Voice-Control Software installiert
□ 10. Voice-Hotkey eingerichtet (Strg+Leertaste)
□ 11. TTS installiert (espeak-ng / Windows SAPI)
□ 12. Screen Share / Remote Desktop aktiv
□ 13. Video-Tools installiert (FFmpeg, Python)
□ 14. AgentWorkspace-Ordner erstellt
□ 15. Verbindung getestet (SSH erfolgreich)
□ Sicherheit: Fail2Ban installiert
□ Sicherheit: Nur SSH-Keys (keine Passwörter)
□ Sicherheit: Firewall konfiguriert

ALLES FERTIG - Agent kann auf Laptop zugreifen!
```

---

## 🎤 VOICE-COMMANDS DIE FRANK DANN NUTZT

| Frank sagt... | Was passiert... |
|---------------|-----------------|
| "Agent Video erstellen über Pflegegrad" | Agent generiert Video auf Laptop, zeigt Preview |
| "Agent Dokument schreiben Widerspruch" | Agent erstellt DOCX/PDF, öffnet im Editor |
| "Agent Internet recherchieren neues KI-Tool" | Agent nutzt Browser auf Laptop, sucht, zeigt Ergebnisse |
| "Agent Code verbessern Barrierefreiheit" | Agent editiert Code-Dateien auf Laptop, testet lokal |
| "Agent Statusbericht" | Agent liest aktuellen Status vor |
| "Agent Backup erstellen" | Agent startet Backup-Script auf Laptop |

---

## 🚨 WICHTIGE HINWEISE

1. **Sicherheit zuerst:** VPN bevorzugen über Port-Forwarding!
2. **Keine Passwörter:** Immer SSH-Keys verwenden (keine Passwort-Auth)
3. **Firewall:** Nur Port 2222 (SSH) von außen erlauben
4. **Monitoring:** `tail -f /var/log/auth.log` regelmäßig prüfen
5. **Updates:** Automatische Sicherheitsupdates aktivieren

---

## 📤 NACH KONFIGURATION - AN AGENT SENDEN

```
LAPTOP-ZUGRIFF KONFIGURIERT:

IP: 87.123.45.67 (oder VPN-IP: 10.0.0.2)
Port: 2222
User: frank
SSH-Key: [Private Key an Agent sicher übertragen]

Voice-Command: Aktiviert (Strg+Leertaste)
TTS: Aktiviert
Screen-Share: Aktiviert (VNC/RDP Port 5900/3389)

Test-Befehl: ssh -p 2222 frank@87.123.45.67

[Admin Name]
[Datum]
```

---

**Diese Konfiguration ermöglicht vollständigen Voice-gesteuerten Remote-Zugriff.**
**Erstellt:** 28.04.2026 um 21:20 Uhr | **Version:** 1.0
