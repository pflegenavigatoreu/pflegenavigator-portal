# ADMINISTRATOR TO-DO LISTE
**Für:** Frank (PflegeNavigator EU)
**Datum:** 27.04.2026
**WICHTIG:** Alles auf einmal erledigen, dann läuft es reibungslos!

---

## 🔴 DRINGEND (Portal läuft nicht ohne das)

### 1. OPENCLAW SYSTEM-CONFIG ÄNDERN
**Problem:** Agent wird ständig gekillt (SIGTERM/SIGKILL)
**Lösung:** Timeout-Limits erhöhen

**Datei:** `~/.openclaw/config.yaml` oder `/data/.openclaw/openclaw.json`

**Einträge hinzufügen:**
```yaml
execution:
  timeoutSeconds: 3600  # Von 60 Sekunden auf 1 Stunde
  allowLongRunning: true
  backgroundTasks: true
  killSignal: none      # Nicht mehr automatisch killen

subagents:
  maxRuntimeSeconds: 7200  # 2 Stunden für Sub-Agenten
  maxConcurrent: 5
  autoRestart: true
```

**Dann:** OpenClaw Gateway neu starten
```bash
openclaw gateway restart
```

---

### 2. SERVER + NGROK STARTEN (Einmalig für Frank)
**Terminal öffnen und eingeben:**
```bash
cd /data/.openclaw/workspace
npm install -g ngrok
npm run dev &
sleep 5
ngrok http 3000
```

**Warten bis Link erscheint** (z.B. `https://abc123.ngrok.io`)
**Diesen Link an Frank weitergeben!**

---

## 🟡 WICHTIG (Für stabile Beta)

### 3. CRON-JOB EINRICHTEN
**Damit Agent automatisch alle 30 Minuten arbeitet:**

```bash
crontab -e
```

**Zeile einfügen:**
```
*/30 * * * * cd /data/.openclaw/workspace && /usr/bin/openclaw agent-run --task="portal-bauen"
```

---

### 4. NODE-PAIRING FÜR LAPTOP-ZUGRIFF (Optional aber empfohlen)
**Damit Agent direkt auf Franks Laptop zugreifen kann:**

**Auf Franks Laptop:**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw node pair --gateway=178.13.52.69
```

**Im Gateway autorisieren:**
```bash
openclaw node authorize <node-id>
```

---

## 🟢 KANN WARTEN (Nach Beta-Start)

### 5. API-KEYS HINTERLEGEN (Für später)
- Stripe API Key (für Zahlungen)
- Threema Gateway API (für Nachrichten)
- Brevo API (für E-Mails)

### 6. VERCEL DEPLOY (Für dauerhafte URL)
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📋 CHECKLISTE FÜR ADMIN

- [ ] OpenClaw Config angepasst (Timeout 3600s)
- [ ] Gateway neu gestartet
- [ ] Server + ngrok gestartet
- [ ] Link an Frank gegeben
- [ ] Cron-Job eingerichtet
- [ ] (Optional) Node-Pairing eingerichtet

---

## 🚨 FALLS ETWAS NICHT KLAPPT

**Kontakt Frank:**
- Telegram: @frank_pflegenavigator
- Threema: (siehe MASTER.md)

**Diese Datei liegt auf:**
`/data/.openclaw/workspace/ADMIN_TODO_ALLES_AUF_EINMAL.md`

---

**Nach Erledigung:** Frank Bescheid sagen - dann testet er sofort!
