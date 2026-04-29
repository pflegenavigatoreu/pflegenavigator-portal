# APP-ENTWICKLUNG - AUFTRAG VOM INHABER
## PflegeNavigator EU gUG
**Von:** Frank (8751446925) | **Datum:** 28.04.2026, 21:32 Uhr  
**Status:** WARTET AUF PORTAL-LAUF | **Freigabe:** AUTOMATISCH bei beta.pflegenavigatoreu.com

---

## 🚀 AUFTRAG: APP-ENTWICKLUNG (3 SCHRITTE)

### SCHRITT 1: PWA (Progressive Web App) - SOFORT wenn Portal läuft

**Was zu tun ist:**
- [ ] `manifest.json` erstellen
- [ ] Service Worker implementieren
- [ ] App-Icons in allen Größen generieren
- [ ] Offline-Funktion für wichtige Seiten
- [ ] Test auf Android (Chrome → "Zum Startbildschirm hinzufügen")
- [ ] Test auf iOS (Safari → "Zum Home-Bildschirm")
- [ ] Screenshot an Frank senden wenn installiert

**Kosten:** 0€
**Technologie:** PWA (Web-Standard)
**Voraussetzung:** Portal läuft unter beta.pflegenavigatoreu.com

---

### SCHRITT 2: NATIVE APP (Capacitor oder Expo)

**Wann starten:** Wenn PWA stabil läuft

**Was zu tun ist:**
- [ ] Capacitor installieren: `npm install @capacitor/core @capacitor/cli`
- [ ] Android-Projekt generieren: `npx cap add android`
- [ ] iOS-Projekt generieren: `npx cap add ios` (nur auf Mac)
- [ ] Portal-Build kopieren: `npx cap copy`
- [ ] Zusätzliche native Funktionen einbauen:
  * [ ] Push-Benachrichtigungen (Fristenalarme)
  * [ ] Offline-Modus (wichtige Funktionen)
  * [ ] Biometrische Anmeldung (Fingerabdruck/Face ID)
  * [ ] Kamera-Funktion (Dokumente scannen)

**Kosten:** 0€ (Capacitor/Expo sind Open Source)
**Technologie:** Capacitor oder Expo
**Voraussetzung:** PWA läuft stabil

---

### SCHRITT 3: APP STORE VORBEREITUNG

**Wann starten:** Wenn native App fertig

**Was zu tun ist:**
- [ ] App-Icon in allen Store-Größen (bereits vorhanden aus Logo)
- [ ] Screenshots aller 10 Portal-Seiten
  * [ ] Startseite
  * [ ] Pflegegrad-Rechner
  * [ ] Widerspruchsmodul
  * [ ] Brief-Generatoren
  * [ ] Tagebuch
  * [ ] etc.
- [ ] App-Beschreibung Deutsch (menschlich, nicht KI-Ton)
- [ ] App-Beschreibung Englisch (menschlich, nicht KI-Ton)
- [ ] Datenschutzrichtlinie (bereits vorhanden)
- [ ] Store-Materialien vorbereiten

**Was Admin tun muss (NICHT ich):**
- [ ] Google Play Store Account: 25$ einmalig
- [ ] Apple Developer Account: 99$/Jahr
- [ ] Apps einreichen
- [ ] Auf Freigabe warten

**Kosten:** 25$ + 99$/Jahr (nur Admin kann zahlen)
**Technologie:** Google Play Console, Apple App Store Connect
**Voraussetzung:** Native App fertig

---

## 📋 REIHENFOLGE (STRENG EINHALTEN)

```
1. PWA → 2. Native App → 3. Store
     ↓           ↓            ↓
  Sofort      Danach       Zuletzt
```

**NIE umgekehrt!** Erst PWA, dann native, dann Store.

---

## ⏰ FORTSCHRITTSBERICHTE

| Was | Wann | Format |
|-----|------|--------|
| PWA installierbar | Bei Fertigstellung | Screenshot + "PWA läuft auf [Android/iOS]" |
| Native App Android | Alle 30 Min | "Android: [X]% - [was gerade]" |
| Native App iOS | Alle 30 Min | "iOS: [X]% - [was gerade]" |
| Store-Materialien | Bei Fertigstellung | Liste der erstellten Assets |

---

## 🎯 AUSLÖSER

**START SIGNAL:**
```
Portal läuft unter: beta.pflegenavigatoreu.com
Admin-Keys sind eingetragen
Health-Checks zeigen: ✅ Alle Systeme grün
```

**Dann automatisch beginnen mit:**
1. PWA-Entwicklung
2. Tests auf Android/iOS
3. Screenshot an Frank

**Kein extra JA nötig - Freigabe hiermit erteilt!**

---

## 📱 APP-FUNKTIONEN CHECKLISTE

### PWA-Funktionen:
- [ ] Installierbar (Android Chrome)
- [ ] Installierbar (iOS Safari)
- [ ] Offline-Cache für Startseite
- [ ] Offline-Cache für Pflegegrad-Rechner
- [ ] Push-Benachrichtigungen (wenn Browser unterstützt)

### Native App-Funktionen:
- [ ] Android APK bauen
- [ ] iOS IPA bauen (nur auf Mac möglich)
- [ ] Push-Benachrichtigungen nativ
- [ ] Biometrischer Login (Android)
- [ ] Biometrischer Login (iOS)
- [ ] Kamera-Zugriff (Dokumente scannen)
- [ ] Offline-Speicherung (SQLite)

---

## 💰 KOSTENÜBERSICHT

| Phase | Kosten | Wer zahlt |
|-------|--------|-----------|
| PWA | 0€ | - |
| Native App (Capacitor) | 0€ | - |
| Google Play Store | 25$ einmalig | Admin Frankie |
| Apple Developer | 99$/Jahr | Admin Frankie |
| **GESAMT** | **25$ + 99$/Jahr** | **Nur Admin** |

---

## 📁 SPEICHERORT

**Dateien:**
- `pwa/manifest.json`
- `pwa/sw.js` (Service Worker)
- `android/` (Capacitor Android)
- `ios/` (Capacitor iOS)
- `app-store/` (Store-Materialien)
- `APP_ENTWICKLUNG_FORTSCHRITT.md`

---

**Dieser Auftrag startet AUTOMATISCH sobald Portal läuft.**
**Keine weitere Freigabe nötig.**
**Erstellt:** 28.04.2026 um 21:32 Uhr
