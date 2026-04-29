# ANFRAGE AN ADMINISTRATOR

## PROBLEM
Der OpenClaw-Agent wird beim Ausführen langer Prozesse (npm run dev, Sub-Agent-Tasks) ständig vom System unterbrochen (SIGTERM/SIGKILL).

## BENÖTIGTE ÄNDERUNGEN (alles auf einmal einrichten)

### 1. EXECUTION TIMEOUT ERHÖHEN
```json
// In openclaw.json oder gateway-config
{
  "execution": {
    "timeoutSeconds": 3600,
    "allowLongRunning": true,
    "backgroundTasks": true
  }
}
```

### 2. BACKGROUND PROCESSES ERLAUBEN
```yaml
# In openclaw-config.yaml
exec:
  background:
    enabled: true
    maxConcurrent: 5
    allowPersistence: true
  security:
    allowLongRunning: true
    killSignal: none
```

### 3. SUB-AGENT LIMITS AUFHEBEN
```json
{
  "subagents": {
    "maxRuntimeSeconds": 7200,
    "maxConcurrent": 10,
    "autoRestart": true
  }
}
```

### 4. CRON/HEARTBEAT EINRICHTEN (optional)
Für automatische Tasks ohne manuelle Nachrichten:
```json
{
  "cron": {
    "enabled": true,
    "allowAgentTasks": true
  }
}
```

### 5. SPEICHERORT FÜR TASKS
Einrichten:
```bash
mkdir -p /data/.openclaw/tasks
chmod 755 /data/.openclaw/tasks
```

## ZIEL
Der Agent soll:
- `npm run dev` dauerhaft laufen lassen können
- Sub-Agents 1+ Stunden laufen lassen können
- Nicht bei jedem zweiten Befehl unterbrochen werden

## AKTION DES ADMINS
Bitte diese Config-Änderungen vornehmen und OpenClaw Gateway neu starten.
