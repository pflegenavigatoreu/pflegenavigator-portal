# APP-ENTWICKLUNG - PROFI KONFIGURATION
## PflegeNavigator EU gUG
**Für:** Inhaber Frank (8751446925) | **Datum:** 28.04.2026  
**Status:** Vollständige Spezifikation | **Kosten:** 0€ (nur kostenlose Tools)

---

## 📱 STRATEGIE: PORTAL → PWA → NATIVE APP

### Entscheidungsbaum:

```
Portal läuft?
    ↓ JA
PWA erstellen (kostenlos)
    ↓ Stabil?
Native App (Capacitor, kostenlos)
    ↓ Fertig?
Download vom Portal (kein Store, 0€)
```

---

## SCHRITT 1: PWA (PROGRESSIVE WEB APP)

### 1.1 Manifest.json

**Datei:** `public/manifest.json`

| Feld | Wert | Beschreibung |
|------|------|--------------|
| `name` | "PflegeNavigator EU" | Voller Name |
| `short_name` | "PflegeNav" | Kurzname (max 12 Zeichen) |
| `description` | "Pflegegrad-Rechner, Briefe, Widerspruch" | Beschreibung |
| `start_url` | "/" | Startseite bei Öffnen |
| `display` | "standalone" | Ohne Browser-UI |
| `background_color` | "#ffffff" | Hintergrund beim Laden |
| `theme_color` | "#0066cc" | Theme-Farbe |
| `orientation` | "portrait" | Hochformat |
| `scope` | "/" | Gültigkeitsbereich |
| `icons` | Array (siehe unten) | Alle Icon-Größen |

**Icons Array:**
```json
{
  "src": "/icon-72x72.png",
  "sizes": "72x72",
  "type": "image/png",
  "purpose": "maskable any"
}
```

| Größe | Pfad | Verwendung |
|-------|------|------------|
| 72x72 | `/icon-72x72.png` | Android Launcher |
| 96x96 | `/icon-96x96.png` | Android Launcher |
| 128x128 | `/icon-128x128.png` | Chrome Web Store |
| 144x144 | `/icon-144x144.png` | iOS/iPad |
| 152x152 | `/icon-152x152.png` | iOS/iPad |
| 192x192 | `/icon-192x192.png` | Android, Chrome |
| 384x384 | `/icon-384x384.png` | Android |
| 512x512 | `/icon-512x512.png` | Android, Splash |

**Icon-Generierung:**
```bash
npx pwa-asset-generator logo.svg public/ --padding 0.1
```

### 1.2 Service Worker (sw.js)

**Datei:** `public/sw.js`

| Funktion | Implementierung | Status |
|----------|-----------------|--------|
| **Cache-Strategie** | Stale-while-revalidate | ✅ |
| **Cache-Name** | `pflegenav-v1` | ✅ |
| **Zu cachende Seiten** | /, /pflegegrad/start, /briefe, /widerspruch | ✅ |
| **Zu cachende Assets** | CSS, JS, Icons, Fonts | ✅ |
| **Offline-Fallback** | /offline.html | ✅ |
| **Background Sync** | Für Formular-Daten | ✅ |
| **Push-Notifications** | (optional, siehe Schritt 2) | 🔄 |

**Cache-Strategie-Code:**
```javascript
// Cache-First für statische Assets
if (request.destination === 'image' || request.destination === 'style') {
  return caches.match(request).then(response => {
    return response || fetch(request);
  });
}

// Network-First für API-Calls
if (request.url.includes('/api/')) {
  return fetch(request).catch(() => caches.match(request));
}
```

### 1.3 Service Worker Registration

**Datei:** `src/app/layout.tsx` (oder _app.tsx)

```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW failed'));
  }
}, []);
```

### 1.4 PWA Testing

| Test | Tool/Befehl | Erfolg wenn |
|------|-------------|-------------|
| **Lighthouse PWA** | Chrome DevTools → Lighthouse | Score >90 |
| **Manifest valid** | `pwa-manifest-checker` | Keine Fehler |
| **Offline-Test** | Chrome DevTools → Network → Offline | Seite lädt |
| **Android Install** | Chrome → "Zum Startbildschirm" | Icon erscheint |
| **iOS Install** | Safari → "Zum Home-Bildschirm" | Icon erscheint |

---

## SCHRITT 2: NATIVE APP (CAPACITOR)

### 2.1 Installation

**Befehle:**
```bash
# Capacitor Core installieren
npm install @capacitor/core @capacitor/cli

# Android Plattform
npm install @capacitor/android

# iOS Plattform (nur auf Mac)
npm install @capacitor/ios

# Plugins
npm install @capacitor/push-notifications
npm install @capacitor/local-notifications
npm install @capacitor/camera
npm install @capacitor/preferences
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/browser
npm install @capacitor/clipboard
npm install @capacitor/share
npm install @capacitor/toast
npm install @capacitor-community/biometric-auth
```

### 2.2 Plattformen hinzufügen

| Plattform | Befehl | Ergebnis |
|-----------|--------|----------|
| Android | `npx cap add android` | Ordner `android/` erstellt |
| iOS | `npx cap add ios` | Ordner `ios/` erstellt |

### 2.3 Build & Sync

**Workflow:**
```bash
# 1. Next.js Build
npm run build

# 2. Capacitor Sync (kopiert Build zu nativem Projekt)
npx cap sync

# 3. Android Studio öffnen (zum Testen)
npx cap open android

# 4. Xcode öffnen (nur Mac)
npx cap open ios
```

### 2.4 Native Konfiguration

**Android:** `android/app/src/main/res/`
| Datei | Inhalt |
|-------|--------|
| `values/strings.xml` | App-Name |
| `values/colors.xml` | Theme-Farben |
| `drawable/ic_launcher.png` | App-Icon |
| `xml/network_security_config.xml` | HTTP erlauben (für Dev) |

**iOS:** `ios/App/App/`
| Datei | Inhalt |
|-------|--------|
| `Info.plist` | Berechtigungen, Name |
| `Assets.xcassets/` | Icons |
| `config.xml` | Whitelist, Features |

### 2.5 Plugins - Detaillierte Konfiguration

#### Push Notifications

**Installation:**
```bash
npm install @capacitor/push-notifications
npx cap sync
```

**Konfiguration Android:**
- Firebase Console: Projekt erstellen
- `google-services.json` nach `android/app/` kopieren
- `build.gradle` aktualisieren

**Konfiguration iOS:**
- Apple Developer: Push-Zertifikat erstellen
- Xcode: Push Notifications Capability hinzufügen

**Code:**
```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// Registrieren
await PushNotifications.requestPermissions();
await PushNotifications.register();

// Token erhalten
PushNotifications.addListener('registration', token => {
  console.log('Push token:', token.value);
  // An Server senden
});

// Notification empfangen
PushNotifications.addListener('pushNotificationReceived', notification => {
  console.log('Notification:', notification);
});
```

#### Biometrische Anmeldung

**Installation:**
```bash
npm install @capacitor-community/biometric-auth
npx cap sync
```

**Code:**
```typescript
import { BiometricAuth } from '@capacitor-community/biometric-auth';

const verify = async () => {
  try {
    const result = await BiometricAuth.verify({
      reason: 'Zur App anmelden',
      title: 'Biometrische Anmeldung',
      subtitle: 'Fingerabdruck oder Face ID',
      description: 'Bitte authentifizieren'
    });
    
    if (result.verified) {
      // Login erfolgreich
    }
  } catch (error) {
    // Fallback zu Passwort
  }
};
```

#### Kamera (Dokumente scannen)

**Installation:**
```bash
npm install @capacitor/camera
npx cap sync
```

**Android Berechtigungen:**
`AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

**iOS Berechtigungen:**
`Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Für das Scannen von Dokumenten</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Für das Speichern von Dokumenten</string>
```

**Code:**
```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const scanDocument = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera
  });
  
  // Bild zu Server senden
  // oder OCR mit Tesseract.js
  return image.dataUrl;
};
```

#### Offline-Speicherung

**Installation:**
```bash
npm install @capacitor/preferences
npm install @capacitor-community/sqlite
```

**Code:**
```typescript
import { Preferences } from '@capacitor/preferences';

// Speichern
await Preferences.set({
  key: 'user_data',
  value: JSON.stringify(data)
});

// Lesen
const { value } = await Preferences.get({ key: 'user_data' });

// Für komplexe Daten: SQLite
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
const sqlite = new SQLiteConnection(CapacitorSQLite);
```

---

## SCHRITT 3: DOWNLOAD VOM PORTAL

### 3.1 Download-Seite

**Route:** `/app/download`

| Inhalt | Beschreibung |
|--------|--------------|
| **Android** | APK-Download-Button |
| **iOS** | Hinweis: PWA empfohlen (iOS IPA schwierig) |
| **QR-Code** | Direktlink zur Download-Seite |
| **Anleitung** | Installations-Schritte |

### 3.2 APK Generierung

**Automatisiert via GitHub Actions:**

`.github/workflows/build-apk.yml`:
```yaml
name: Build APK
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Build APK
        working-directory: ./android
        run: ./gradlew assembleRelease
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 3.3 APK Signierung (für Installation)

**Lokal:**
```bash
cd android/app/build/outputs/apk/release/

# Keystore erstellen (einmalig)
keytool -genkey -v -keystore pflegenav.keystore -alias pflegenav -keyalg RSA -keysize 2048 -validity 10000

# APK signieren
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore pflegenav.keystore app-release-unsigned.apk pflegenav

# ZIP align
zipalign -v 4 app-release-unsigned.apk PflegeNavigator.apk
```

### 3.4 Download-Schutz

| Maßnahme | Implementierung |
|----------|-----------------|
| **Rate-Limiting** | Max 5 Downloads/Minute pro IP |
| **Referrer-Check** | Nur von eigener Domain |
| **Version-Check** | Aktuelle Version ausgeben |
| **Hash-Verification** | SHA256 der APK anzeigen |

---

## SCHRITT 4: AUTO-UPDATE (OHNE STORE)

### 4.1 Strategie

| Plattform | Methode | Implementierung |
|-----------|---------|-----------------|
| **PWA** | Service Worker | Auto-Update beim nächsten Besuch |
| **Android** | In-App Update | Capacitor App-Update Plugin |
| **iOS** | PWA bevorzugen | Kein Auto-Update möglich ohne Store |

### 4.2 Version-Check API

**Endpoint:** `GET /api/version`

**Response:**
```json
{
  "version": "1.2.3",
  "build": 123,
  "required": false,
  "url": "https://beta.pflegenavigator.com/PflegeNavigator-v1.2.3.apk",
  "changelog": "Neue Funktionen: Biometrische Anmeldung"
}
```

### 4.3 Update-Dialog

**Code:**
```typescript
const checkUpdate = async () => {
  const currentVersion = '1.2.2';
  const response = await fetch('/api/version');
  const data = await response.json();
  
  if (data.version !== currentVersion) {
    // Update-Dialog anzeigen
    if (confirm('Update verfügbar. Jetzt installieren?')) {
      // Download starten
      window.location.href = data.url;
    }
  }
};

// Beim App-Start prüfen
useEffect(() => {
  checkUpdate();
}, []);
```

---

## SCHRITT 5: TESTING & QUALITÄT

### 5.1 Test-Plan

| Test | Tool | Frequenz |
|------|------|----------|
| **Unit Tests** | Jest | Jeder Commit |
| **E2E Tests** | Playwright | Vor Release |
| **PWA Tests** | Lighthouse CI | Jeder PR |
| **Mobile Tests** | BrowserStack | Wöchentlich |
| **Performance** | Web Vitals | Jeder Commit |
| **Accessibility** | Axe-Core | Jeder PR |

### 5.2 Device-Testing

| Gerät | OS-Version | Test |
|-------|------------|------|
| Samsung Galaxy | Android 12+ | APK Install |
| Google Pixel | Android 13+ | APK + PWA |
| iPhone 12+ | iOS 16+ | PWA Only |
| iPad Pro | iPadOS 16+ | PWA Only |
| Huawei | Android 11+ | APK Install |
| Xiaomi | MIUI 14+ | APK + PWA |

### 5.3 Beta-Tester Programm

| Phase | Anzahl | Methode |
|-------|--------|---------|
| **Internal** | 5 | Team + Familie |
| **Closed Beta** | 50 | Einladung via Portal |
| **Open Beta** | 500 | Registrierung öffentlich |

---

## SCHRITT 6: MONITORING & ANALYTICS

### 6.1 App-Monitoring

| Metrik | Tool | Alert bei |
|--------|------|-----------|
| **App-Starts** | Umami | - |
| **Abstürze** | Firebase Crashlytics | >1% Crash-Rate |
| **Performance** | Firebase Performance | <90% gut |
| **Netzwerk** | Chucker (Debug) | Fehler >5% |

### 6.2 User-Analytics

| Event | Beschreibung |
|-------|--------------|
| `app_install` | Erstinstallation |
| `app_open` | App geöffnet |
| `pflegegrad_berechnet` | Rechner benutzt |
| `brief_generiert` | Brief erstellt |
| `offline_mode` | Offline genutzt |
| `biometric_used` | Fingerabdruck genutzt |
| `document_scanned` | Dokument gescannt |

---

## SCHRITT 7: SICHERHEIT

### 7.1 App-Sicherheit

| Maßnahme | Implementierung |
|----------|-----------------|
| **Root-Detection** | `cordova-plugin-root-detection` |
| **Screenshot-Block** | Android: FLAG_SECURE, iOS: screenCapture |
| **SSL-Pinning** | `capacitor-ssl-pinning` |
| **Data Encryption** | AES-256 für lokale Daten |
| **Secure Storage** | Keystore (Android), Keychain (iOS) |

### 7.2 Code-Obfuscation

**Android ProGuard:**
`android/app/proguard-rules.pro`:
```proguard
-keep class com.pflegenavigator.** { *; }
-keepclassmembers class * { @com.google.gson.annotations.SerializedName <fields>; }
```

---

## 📋 IMPLEMENTIERUNGSPHASE

### Phase 1: PWA (Woche 1)
- [ ] Manifest.json erstellen
- [ ] Service Worker implementieren
- [ ] Icons generieren
- [ ] Offline-Funktionalität
- [ ] Lighthouse Score >90

### Phase 2: Native Android (Woche 2)
- [ ] Capacitor installieren
- [ ] Android-Plattform hinzufügen
- [ ] Push-Notifications
- [ ] Biometrie
- [ ] Kamera

### Phase 3: Download-Portal (Woche 3)
- [ ] Download-Seite erstellen
- [ ] APK-Build-Automatisierung
- [ ] Signierung einrichten
- [ ] Update-Mechanismus

### Phase 4: Testing (Woche 4)
- [ ] Interne Tests
- [ ] Beta-Tester
- [ ] Bugfixes
- [ ] Performance-Optimierung

---

## 💰 KOSTENÜBERSICHT (FINAL)

| Posten | Tool | Kosten |
|--------|------|--------|
| PWA | Web-Standard | 0€ |
| Capacitor | Open Source | 0€ |
| Firebase Push | FCM | 0€ |
| Biometrie Plugin | Community | 0€ |
| Kamera Plugin | Offiziell | 0€ |
| Build-Server | GitHub Actions | 0€ |
| Hosting | Portal vorhanden | 0€ |
| Analytics | Umami (selbst) | 0€ |
| **GESAMT** | | **0€** |

---

## 📁 DATEISTRUKTUR

```
workspace/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
├── android/
│   ├── app/
│   │   └── build/
│   │       └── outputs/
│   │           └── apk/
│   │               └── release/
│   │                   └── PflegeNavigator.apk
│   └── ...
├── ios/
│   └── ...
├── src/
│   ├── app/
│   │   └── app/
│   │       └── download/
│   │           └── page.tsx
│   └── components/
│       └── AppDownload.tsx
├── .github/
│   └── workflows/
│       └── build-apk.yml
└── docs/
    └── APP_KONFIGURATION_PROFI.md
```

---

## 🎯 NÄCHSTE SCHRITTE

**Aktueller Status:** Portal läuft noch nicht (wartet auf Admin-Keys)

**Sobald Portal live:**
1. Sofort mit PWA beginnen
2. Lighthouse-Test durchführen
3. Android-Tests
4. Download-Seite aktivieren

**Erst dann:** Native App mit Capacitor

---

**Diese Spezifikation gilt als verbindlich.**
**Erstellt:** 28.04.2026 um 21:37 Uhr
**Version:** 1.0 (Profi-Niveau)
