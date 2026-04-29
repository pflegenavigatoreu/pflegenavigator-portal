# ANFRAGE: ERWEITERTER ZUGRIFF FÜR AGENT

**Von:** Frank (Inhaber PflegeNavigator)
**Datum:** 27.04.2026
**Priorität:** HOCH

---

## ANFRAGE

Der Agent soll Zugriff auf den Laptop/Desktop des Inhabers erhalten um:
- Dateien direkt auf dem Desktop speichern zu können
- Den Browser auf dem Laptop fernsteuern zu können
- Screenshots vom Laptop-Bildschirm machen zu können
- Programme auf dem Laptop starten zu können

---

## TECHNISCHE LÖSUNGSOPTIONEN

### OPTION A: Node-Pairing (Empfohlen)
```
OpenClaw Node auf dem Laptop installieren
→ Agent kann über sichere Verbindung auf Laptop zugreifen
→ Alle Aktionen werden protokolliert
→ Vollständige Fernsteuerung möglich
```

### OPTION B: SSH-Zugriff + X11-Forwarding
```
SSH-Key für Agent erstellen
→ Agent kann über SSH auf Laptop zugreifen
→ X11-Forwarding für grafische Anwendungen
→ Sicher aber begrenzt
```

### OPTION C: Remote-Desktop-Integration
```
VNC oder RDP auf dem Laptop aktivieren
→ Agent kann Desktop sehen und steuern
→ Höchste Berechtigung erforderlich
→ Sicherheitsrisiko höher
```

---

## EMPFEHLUNG DES AGENTEN

**Option A (Node-Pairing)** ist am besten:
- ✅ Sicher (verschlüsselte Verbindung)
- ✅ Protokolliert alle Aktionen
- ✅ Einfach zu installieren
- ✅ OpenClaw-native Lösung

---

## BENÖTIGTE AKTION DES ADMINS

1. **Auf dem Laptop (Frank's Gerät):**
   ```bash
   # OpenClaw Node installieren
   curl -fsSL https://openclaw.ai/install.sh | bash
   
   # Node mit Gateway verbinden
   openclaw node pair --gateway=178.13.52.69
   ```

2. **Im OpenClaw Gateway:**
   - Node autorisieren
   - Berechtigungen setzen (Dateien, Browser, Desktop)
   - Sicherheitsrichtlinien konfigurieren

3. **Testen:**
   - Agent versucht Datei auf Desktop zu erstellen
   - Agent versucht Browser zu öffnen

---

## SICHERHEIT

- Jede Aktion wird protokolliert
- Frank kann jederzeit den Zugriff widerrufen
- Nur explizit erlaubte Aktionen möglich
- Kein unsichtbarer Zugriff

---

**WICHTIG:** Der Agent hat aktuell KEINEN Zugriff auf den Laptop. Alle Dateien landen nur im Container (`/data/.openclaw/workspace/`).

---

**Kontakt bei Fragen:** Frank per Telegram oder Threema
