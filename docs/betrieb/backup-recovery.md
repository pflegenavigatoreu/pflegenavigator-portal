# Betriebshandbuch - Backup & Recovery

## Backup-Strategie

### 3-2-1-Regel

```
3 Kopien der Daten
2 verschiedene Medien
1 externer/offsite Standort
```

### Backup-Typen

| Typ | Frequenz | Inhalt | Speicherort |
|-----|----------|--------|-------------|
| Datenbank | Täglich | PostgreSQL (Supabase) | Supabase + S3 |
| Filesystem | Wöchentlich | /workspace, config | S3 + Local |
| Container | Nach Änderung | Docker-Images | Registry |
| Config | Nach Änderung | .env, nginx.conf | Git + S3 |

---

## Datenbank-Backup (Supabase)

### Automatische Backups

Supabase erstellt automatisch:
- **Täglich**: 7 Tage Aufbewahrung
- **Wöchentlich**: 4 Wochen Aufbewahrung
- **Monatlich**: 12 Monate Aufbewahrung

### Manuelles Backup

```bash
# Via Supabase CLI
supabase login
supabase db dump -f backup_$(date +%Y%m%d).sql

# Via pg_dump (lokal)
pg_dump \
  --host=db.xxxxx.supabase.co \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --file=backup_$(date +%Y%m%d).sql

# Komprimieren
gzip backup_20260429.sql
```

### Automatisiertes Backup (Cron)

```bash
# backup-db.sh
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/db"
RETENTION_DAYS=30

# Backup erstellen
docker exec -i pflegenavigator-postgres \
  pg_dump -U postgres -d pflegenavigator \
  | gzip > ${BACKUP_DIR}/backup_${DATE}.sql.gz

# Auf S3 uploaden
aws s3 cp ${BACKUP_DIR}/backup_${DATE}.sql.gz \
  s3://pflegenavigator-backups/db/

# Alte Backups löschen (lokal)
find ${BACKUP_DIR} -name "backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# Alte Backups löschen (S3 - älter 90 Tage)
aws s3 ls s3://pflegenavigator-backups/db/ | \
  awk '$1 < "'$(date -d "90 days ago" +%Y-%m-%d)'" {print $4}' | \
  xargs -I {} aws s3 rm s3://pflegenavigator-backups/db/{}
```

```bash
# Cron (täglich 2:00 Uhr)
0 2 * * * /workspace/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### Point-in-Time Recovery (PITR)

Supabase bietet PITR für Pro-Projekte:
- Recovery bis zu jeder Sekunde
- Retention: 7-90 Tage (Plan-abhängig)

**Aktivierung:**
```
Supabase Dashboard → Database → Backups → Point-in-Time
```

---

## Filesystem-Backup

### Wichtige Dateien

```
/workspace/
├── .env.local              # Environment-Variablen
├── next.config.ts          # Next.js-Config
├── docker-compose.yml      # Docker-Config
├── nginx.conf              # Reverse-Proxy
├── src/                    # Source-Code (Git)
├── public/                 # Statische Assets
├── logs/                   # Application-Logs
└── prisma/                 # DB-Schema/Migrationen
```

### Backup-Script

```bash
# backup-files.sh
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/files"

# Config-Dateien sichern
tar czf ${BACKUP_DIR}/config_${DATE}.tar.gz \
  .env.local \
  next.config.ts \
  docker-compose.yml \
  nginx.conf

# Logs sichern (optional)
tar czf ${BACKUP_DIR}/logs_${DATE}.tar.gz \
  logs/

# Auf S3
aws s3 cp ${BACKUP_DIR}/config_${DATE}.tar.gz \
  s3://pflegenavigator-backups/config/

# Cleanup
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +30 -delete
```

### Docker-Volumes

```bash
# Volumes backuppen
# 1. Container stoppen (konsistent)
docker-compose stop portal

# 2. Volumes packen
docker run --rm -v pflegenavigator-data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/volumes_$(date +%Y%m%d).tar.gz -C /data .

# 3. Starten
docker-compose start portal

# 4. Auf S3
aws s3 cp volumes_$(date +%Y%m%d).tar.gz \
  s3://pflegenavigator-backups/volumes/
```

---

## Git-Backup

### Repository-Sicherung

```bash
# Mirror-Klon (alle Branches, Tags, Commits)
git clone --mirror https://github.com/org/portal.git

# Backup nach S3
cd portal.git
git bundle create /backups/repo_$(date +%Y%m%d).bundle --all
gzip /backups/repo_$(date +%Y%m%d).bundle
aws s3 cp /backups/repo_$(date +%Y%m%d).bundle.gz \
  s3://pflegenavigator-backups/git/

# Oder: Zu zweitem Remote pushen
git remote add backup https://backup-server/org/portal.git
git push backup --mirror
```

---

## Recovery

### Datenbank-Wiederherstellung

#### Letztes Backup

```bash
# 1. Backup von S3 holen
aws s3 cp s3://pflegenavigator-backups/db/backup_20260429.sql.gz .
gunzip backup_20260429.sql.gz

# 2. Supabase-Connection herstellen
supabase login

# 3. Wiederherstellen
supabase db restore --file backup_20260429.sql

# 4. Verifizieren
psql $DATABASE_URL -c "SELECT COUNT(*) FROM cases;"
```

#### Point-in-Time Recovery

```bash
# Supabase CLI
supabase db restore --target '2026-04-29T10:00:00Z'

# Oder über Dashboard:
# Database → Backups → Point-in-Time → Zeit wählen → Restore
```

#### Notfall-Recovery (neue Instanz)

```sql
-- 1. Neue Supabase-Instanz erstellen
-- 2. Schema importieren
psql $NEW_DATABASE_URL -f backup_schema.sql

-- 3. Daten importieren
psql $NEW_DATABASE_URL -f backup_data.sql

-- 4. Sequenzen zurücksetzen
SELECT setval('cases_id_seq', (SELECT MAX(id) FROM cases));
```

### Filesystem-Wiederherstellung

```bash
# Config wiederherstellen
aws s3 cp s3://pflegenavigator-backups/config/config_20260429.tar.gz .
tar xzf config_20260429.tar.gz

# Docker-Volumes
aws s3 cp s3://pflegenavigator-backups/volumes/volumes_20260429.tar.gz .
docker-compose stop
docker volume rm pflegenavigator-data || true

# Volume erstellen und entpacken
docker volume create pflegenavigator-data
docker run --rm -v pflegenavigator-data:/data \
  -v $(pwd):/backup alpine \
  tar xzf /backup/volumes_20260429.tar.gz -C /data

docker-compose up -d
```

### Komplettes Recovery

```bash
#!/bin/bash
# disaster-recovery.sh

RECOVERY_DATE="20260429"

# 1. System vorbereiten
cd /workspace
mkdir -p /backups/recovery

# 2. Code aus Git
rm -rf /workspace/*
git clone https://github.com/org/portal.git /workspace

# 3. Config wiederherstellen
aws s3 cp s3://pflegenavigator-backups/config/config_${RECOVERY_DATE}.tar.gz /tmp/
tar xzf /tmp/config_${RECOVERY_DATE}.tar.gz -C /workspace

# 4. Dependencies
npm ci

# 5. Database
aws s3 cp s3://pflegenavigator-backups/db/backup_${RECOVERY_DATE}.sql.gz /tmp/
gunzip /tmp/backup_${RECOVERY_DATE}.sql.gz
# → Supabase-Restore durchführen

# 6. Build
npm run build

# 7. Starten
pm2 restart all
# oder
docker-compose up -d

echo "Recovery complete at $(date)"
```

---

## Verifizierung

### Backup-Tests

```bash
# Test-Restore (monatlich)
# 1. Test-Instanz erstellen
# 2. Backup einspielen
# 3. Queries ausführen

psql $TEST_DB_URL -c "
  SELECT 
    'cases' as table_name, count(*) as count FROM cases
  UNION ALL
  SELECT 'answers', count(*) FROM answers;
"

# Ergebnis mit Produktion vergleichen
psql $PROD_DB_URL -c "
  SELECT 
    'cases' as table_name, count(*) as count FROM cases
  UNION ALL
  SELECT 'answers', count(*) FROM answers;
"
```

### Checksums

```bash
# Backup-Integrität
md5sum backup_20260429.sql.gz > checksum.txt

# S3 Upload mit Checksum
aws s3 cp backup.sql.gz s3://... --metadata md5ch=$(md5sum backup.sql.gz | cut -d' ' -f1)

# Download-Verifizierung
aws s3 cp s3://... backup_check.sql.gz
md5sum -c checksum.txt
```

---

## Retention-Politik

| Typ | Lokale Kopien | S3-Standard | S3-Glacier |
|-----|---------------|-------------|------------|
| Datenbank (täglich) | 7 Tage | 30 Tage | 1 Jahr |
| Config (wöchentlich) | 4 Wochen | 90 Tage | 1 Jahr |
| Volumes (wöchentlich) | - | 30 Tage | 6 Monate |
| Git (täglich) | - | 90 Tage | 2 Jahre |

**Kostenoptimierung:**
```bash
# Lifecycle-Policy (S3)
# Nach 30 Tagen zu Glacier
aws s3api put-bucket-lifecycle-configuration \
  --bucket pflegenavigator-backups \
  --lifecycle-configuration file://lifecycle.json
```

```json
// lifecycle.json
{
  "Rules": [
    {
      "ID": "ArchiveOldBackups",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "db/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

---

## Verschlüsselung

### Backup-Verschlüsselung

```bash
# Mit GPG verschlüsseln
gpg --symmetric --cipher-algo AES256 \
  --output backup_20260429.sql.gz.gpg \
  backup_20260429.sql.gz

# Entschlüsseln
gpg --decrypt backup_20260429.sql.gz.gpg \
  > backup_20260429.sql.gz

# Passwort aus Umgebungsvariable
export BACKUP_PASSWORD=$(cat /secrets/backup_pass)
echo $BACKUP_PASSWORD | gpg --batch --yes --passphrase-fd 0 \
  --symmetric --cipher-algo AES256 \
  -o backup.sql.gz.gpg backup.sql.gz
```

### S3-Verschlüsselung

```bash
# Server-side encryption
aws s3 cp backup.sql.gz s3://... \
  --sse AES256

# Oder KMS
aws s3 cp backup.sql.gz s3://... \
  --sse aws:kms \
  --sse-kms-key-id alias/pflegenavigator-backup
```

---

## Monitoring

### Backup-Status

```bash
# Letztes Backup prüfen
ls -la /backups/db/*.sql.gz | tail -1

# S3-Backup-Liste
aws s3 ls s3://pflegenavigator-backups/db/ | tail -5

# Backup-Größe
du -sh /backups/
aws s3 ls --human-readable --summarize s3://pflegenavigator-backups/
```

### Alerting

```bash
# backup-check.sh
#!/bin/bash

# Prüfen ob Backup heute erstellt wurde
if [ ! -f "/backups/db/backup_$(date +%Y%m%d)*.sql.gz" ]; then
  echo "ERROR: No backup found for today" | \
    mail -s "Backup Alert - PflegeNavigator" admin@...
fi

# Größe prüfen (min 1MB)
BACKUP_SIZE=$(stat -c%s /backups/db/latest.sql.gz)
if [ $BACKUP_SIZE -lt 1048576 ]; then
  echo "ERROR: Backup file too small" | \
    mail -s "Backup Size Alert" admin@...
fi
```

---

## Disaster-Recovery-Plan

### RTO/RPO

| Kategorie | RTO (Recovery Time) | RPO (Data Loss) |
|-----------|---------------------|-----------------|
| Kritisch | 4 Stunden | 24 Stunden |
| Hoch | 8 Stunden | 24 Stunden |
| Normal | 24 Stunden | 7 Tage |

### Eskalationsstufen

| Stufe | Trigger | Aktion |
|-------|---------|--------|
| 1 | Health-Check Failed | Auto-Restart |
| 2 | Restart failed | Manuelles Recovery |
| 3 | >30 Min Downtime | Disaster Recovery |
| 4 | >4 Stunden | Failover zu Standby |

### Dokumentation

- [ ] Recovery-Verfahren getestet (letzter Test: __________)
- [ ] Backup-Verifizierung OK (letzte Prüfung: __________)
- [ ] Team kontaktiert (letzte Übung: __________)
- [ ] Dokumentation aktuell (letzte Update: __________)