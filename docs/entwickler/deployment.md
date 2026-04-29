# Entwickler-Handbuch - Deployment

## Deployment-Optionen

### 1. Vercel (Empfohlen)

#### Voraussetzungen
- Vercel-Konto: https://vercel.com
- GitHub/GitLab/Bitbucket-Repository

#### Automatisches Deployment
```bash
# Vercel CLI installieren
npm i -g vercel

# Einmalig einrichten
vercel

# Production-Deployment
vercel --prod
```

#### Environment-Variablen in Vercel
```bash
# In Vercel Dashboard → Project → Settings → Environment Variables

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Vercel-Konfiguration (vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store"
        }
      ]
    }
  ]
}
```

---

### 2. Docker-Deployment

#### Dockerfile
```dockerfile
# Multi-Stage Build

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Chromium für PDF-Generierung
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

# Nicht-root User
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Assets kopieren
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker-Build
```bash
# Image bauen
docker build -t pflegenavigator:latest .

# Test-Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  pflegenavigator:latest

# Push zu Registry
docker tag pflegenavigator:latest ghcr.io/your-org/pflegenavigator:latest
docker push ghcr.io/your-org/pflegenavigator:latest
```

#### Docker-Compose (Full Stack)
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  portal:
    image: pflegenavigator:latest
    container_name: pflegenavigator-portal
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: pflegenavigator-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - portal
    restart: unless-stopped
    networks:
      - app-network

  # Monitoring
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: pflegenavigator-uptime
    ports:
      - "3001:3001"
    volumes:
      - uptime-data:/app/data
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  uptime-data:
```

---

### 3. Self-Hosted (Node.js)

#### Voraussetzungen
- Node.js 20+
- PM2 (Process Manager)
- Nginx (Reverse Proxy)

#### Installation
```bash
# Server vorbereiten
ssh server
cd /var/www

# Repository klonen
git clone https://github.com/your-org/portal.git
cd portal

# Dependencies
npm ci --production

# Build
npm run build

# PM2 starten
npm i -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### PM2-Konfiguration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'pflegenavigator',
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/portal',
      instances: 'max',  // Cluster-Modus
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
      restart_delay: 3000,
      max_restarts: 5,
      min_uptime: '10s',
      watch: false,
      kill_timeout: 5000
    }
  ]
}
```

#### Nginx-Konfiguration
```nginx
# /etc/nginx/sites-available/pflegenavigator
server {
    listen 80;
    server_name pflegenavigatoreu.com www.pflegenavigatoreu.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pflegenavigatoreu.com;
    
    # SSL-Zertifikate
    ssl_certificate /etc/letsencrypt/live/pflegenavigatoreu.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pflegenavigatoreu.com/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
    
    # Proxy zu Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static Assets (optional CDN)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
    
    # Health-Check
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
```

---

## Umgebungsvariablen

### Erforderlich

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Projekt URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key für Client | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Key für Server | `eyJhbG...` |

### Optional

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `NODE_ENV` | `development` | `production` für Deploy |
| `PORT` | `3000` | Server-Port |
| `NEXT_PUBLIC_APP_VERSION` | `0.1.0` | App-Version |
| `UMAMI_SECRET` | - | Für Self-Hosted Analytics |

---

## SSL/TLS

### Let's Encrypt (Certbot)
```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# Zertifikat erstellen
sudo certbot --nginx -d pflegenavigatoreu.com -d www.pflegenavigatoreu.com

# Auto-Renewal testen
sudo certbot renew --dry-run
```

### Cloudflare (Empfohlen)
1. DNS zu Cloudflare umleiten
2. SSL/TLS → Full (Strict)
3. Always Use HTTPS: On
4. Automatic HTTPS Rewrites: On

---

## Monitoring & Alerting

### Health-Checks
```bash
# Manuelle Checks
curl https://pflegenavigatoreu.com/api/health
curl https://pflegenavigatoreu.com/api/health/db

# Automatisiert (Uptime Kuma)
# → HTTP(s) Monitoring
# → Keyword: "status":"ok"
# → Interval: 60s
```

### Logging
```bash
# PM2 Logs
pm2 logs pflegenavigator
pm2 logs pflegenavigator --lines 100

# Nginx Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application Logs
tail -f /var/www/portal/logs/app.log
```

---

## Deployment-Checkliste

### Pre-Deployment
- [ ] Alle Tests bestehen (`npm test`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Linting fehlerfrei (`npm run lint`)
- [ ] E2E-Tests bestanden (`npm run test:e2e`)
- [ ] CHANGELOG.md aktualisiert
- [ ] Version in package.json erhöht

### Deployment
- [ ] Environment-Variablen gesetzt
- [ ] Datenbank-Migrationen durchgeführt
- [ ] Static-Assets bereinigt
- [ ] Cache invalidiert

### Post-Deployment
- [ ] Health-Check OK
- [ ] Smoke-Tests durchgeführt
- [ ] Monitoring aktiviert
- [ ] Fehler-Tracking überprüft
- [ ] Performance-Metriken OK

---

## Rollback

### Vercel
```bash
# Vorherige Deployment wiederherstellen
vercel rollback

# Spezifisches Deployment
vercel --version [deployment-url]
```

### Docker
```bash
# Voriges Image
docker-compose pull
docker-compose up -d

# Manueller Rollback
docker-compose down
git checkout [vorige-version]
docker-compose up -d --build
```

### PM2
```bash
# Git-Tag checkout
git checkout v1.1.0
npm ci
npm run build
pm2 restart pflegenavigator
```

---

## CI/CD-Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      # Vercel
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

      # Oder: Docker
      - name: Build and Push Docker
        run: |
          docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} .
          docker push ghcr.io/${{ github.repository }}:${{ github.sha }}
```

---

## Troubleshooting

### Build-Fehler
```bash
# Clean install
rm -rf node_modules .next
npm ci
npm run build
```

### Speicherprobleme
```bash
# Swap erhöhen
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### PM2-Probleme
```bash
# PM2 zurücksetzen
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### Datenbank-Verbindung
```bash
# Supabase testen
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/

# Network-Check
ping $NEXT_PUBLIC_SUPABASE_URL
```