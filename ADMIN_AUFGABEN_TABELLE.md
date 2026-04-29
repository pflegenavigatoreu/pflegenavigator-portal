# ADMIN AUFGABEN - TABELLARISCHE ÜBERSICHT
## PflegeNavigator EU gUG
**Für:** Administrator Frankie | **Datum:** 28.04.2026 | **Niveau:** Profi

---

## 📊 TABELLE: ADMIN AUFGABEN (10 Schritte)

| # | Priorität | System | Was zu tun ist | Website/Tool | Zeit | Kosten | Ergebnis für Agent | Checkpoint |
|---|-----------|--------|----------------|--------------|------|--------|-------------------|------------|
| **1** | 🔴 **KRITISCH** | **Supabase Account** | 1. Account erstellen (GitHub/E-Mail)<br>2. Projekt "pflegenavigatoreu"<br>3. Region: Frankfurt wählen<br>4. Passwort setzen | supabase.com | 15 min | 0€ | Datenbank funktioniert | ✅ |
| **2** | 🔴 **KRITISCH** | **Supabase Keys** | 3 Keys kopieren & an Agent senden:<br>• Project URL<br>• anon public key<br>• service_role key | Telegram | 2 min | 0€ | Fall-Codes speicherbar | ✅ |
| **3** | 🔴 **KRITISCH** | **Brevo Account** | 1. Account erstellen<br>2. Domain verifizieren (optional)<br>3. API-Key mit SMTP+API Rechten | brevo.com | 20 min | 0€ | E-Mail-Versand möglich | ✅ |
| **4** | 🔴 **KRITISCH** | **Brevo API-Key** | Key kopieren (beginnt mit "xkeysib-") & an Agent senden | Telegram | 1 min | 0€ | Newsletter/Benachrichtigungen | ✅ |
| **5** | 🔴 **KRITISCH** | **Cloudflare Account** | 1. Account erstellen<br>2. Zero Trust → Tunnels<br>3. Tunnel "pflegenavigatoreu" erstellen | cloudflare.com | 15 min | 0€ | Öffentlicher Zugriff | ✅ |
| **6** | 🔴 **KRITISCH** | **Cloudflare Token** | Token extrahieren (--token=...) & an Agent senden | Telegram | 1 min | 0€ | QR-Codes funktionieren | ✅ |
| **7** | 🟡 **WICHTIG** | **Hetzner Server** | 1. CX11 bestellen<br>2. Ubuntu 22.04 wählen<br>3. SSH-Key hinzufügen<br>4. Notiere IP-Adresse | hetzner.com | 15 min | 4,51€/Monat | Server für Deployment | ✅ |
| **8** | 🟡 **WICHTIG** | **Docker Install** | Via SSH auf Server:<br>`curl -fsSL https://get.docker.com \| sh` | SSH/Terminal | 10 min | 0€ | Container laufen | ✅ |
| **9** | 🟢 **OPTIONAL** | **Domain kaufen** | pflegenavigatoreu.com kaufen (Cloudflare/Namecheap) | cloudflare.com | 10 min | ~10€/Jahr | Professionelle URL | ⭕ |
| **10** | 🟢 **OPTIONAL** | **Clevver-Adresse** | Impressum-Adresse buchen (ID hochladen) | clevver.io | 20 min | ~20€/Monat | Rechtssicheres Impressum | ⭕ |

---

## ⏱️ ZEITPLAN

| Phase | Schritte | Dauer | Wann |
|-------|----------|-------|------|
| **Vorbereitung** | - | 10 min | Vorher |
| **Phase 1** | 1-6 (Keys) | 45 min | Am Stück |
| **Phase 2** | 7-8 (Server) | 30 min | Nach Phase 1 |
| **Phase 3** | 9-10 (Optional) | 30 min | Später möglich |
| **TOTAL** | **Alle 10** | **~100 min** | **~1,5 Stunden** |

---

## 💰 KOSTENÜBERSICHT

| Posten | Monatlich | Jährlich |
|--------|-----------|----------|
| Supabase (Free Tier) | 0€ | 0€ |
| Brevo (300 Mails/Tag) | 0€ | 0€ |
| Cloudflare Tunnel | 0€ | 0€ |
| Hetzner CX11 | 4,51€ | 54,12€ |
| Domain (optional) | ~0,83€ | ~10€ |
| Clevver (optional) | ~20€ | ~240€ |
| **Minimum** | **4,51€** | **54,12€** |
| **Mit Optional** | **25,34€** | **~304€** |

---

## 🚀 NACH ABSCHLUSS (Agent übernimmt)

Sobald du alle ✅ Checkpoints gemeldet hast:

| Aufgabe | Dauer | Was passiert |
|---------|-------|--------------|
| Supabase Integration | 10 min | Tabellen, RLS, Testdaten |
| Cloudflare Tunnel | 15 min | Öffentliche URL, SSL |
| Brevo E-Mail | 20 min | Templates, Cron-Jobs |
| Hetzner Deploy | 30 min | Code bauen, Container starten |
| Monitoring | 20 min | Umami, Uptime Kuma |
| Internet-Recherche | 4-6h | Beste Tools, APIs, KI-Integration |
| **GESAMT** | **~6h** | **Portal LIVE** |

---

## 📱 SENDE-FORMAT AN AGENT

**Nach jedem Schritt sende an Agent:**

```
SCHRITT [X] ERLEDIGT:
[SYSTEM]: [Was erledigt]
[WERT]: [Key/Token/IP]
[DEIN NAME]
```

**Beispiel:**
```
SCHRITT 2 ERLEDIGT:
SUPABASE KEYS:
URL: https://abc123.supabase.co
ANON: eyJhbGc...
SERVICE: eyJhbGc...
Frankie
```

---

## ✅ ABSCHLUSS-CHECKLISTE

Kopiere und hänge ab:

```
□ Supabase Account erstellt
□ Supabase 3 Keys an Agent gesendet
□ Brevo Account erstellt  
□ Brevo API-Key an Agent gesendet
□ Cloudflare Account erstellt
□ Cloudflare Token an Agent gesendet
□ Hetzner CX11 bestellt
□ Docker auf Server installiert
□ Domain gekauft (optional)
□ Clevver gebucht (optional)

ALLE KEYS SIND DA - Agent kann starten!
```

---

**Erstellt:** 28.04.2026 um 20:20 Uhr  
**Version:** 1.0 - Profi-Niveau  
**Gültig bis:** Neue Version
