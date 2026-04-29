# ============================================
# PFLEGENAVIGATOR EU - PRODUCTION BUILD
# Next.js 16 + Standalone Output
# ============================================

FROM node:20-alpine AS base

# ============================================
# 1. DEPENDENCIES
# ============================================
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Dependencies installieren
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ============================================
# 2. BUILD
# ============================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build durchführen
RUN npm run build

# ============================================
# 3. PRODUCTION
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Nur notwendige Dateien kopieren
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Security: Nicht als root laufen
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

# ============================================
# BUILD MIT:
# docker build -t pflegenavigator-portal .
#
# ODER via docker-compose:
# docker-compose up -d
# ============================================
