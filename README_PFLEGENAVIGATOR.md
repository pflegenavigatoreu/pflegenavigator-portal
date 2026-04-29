# PflegeNavigator EU - README

## ✅ ERSTELLT IN 30 MINUTEN

### 1. AVATAR-CHAT-SYSTEM ✅
- `/src/components/AvatarChat.tsx` - Vollständiger Chat mit Mistral API
- Sprachsteuerung: "Hilfe", "Weiter", "Zurück"
- Animationen, Sprechblasen
- Voice-Input, Text-to-Speech
- Chat-Download Funktion

### 2. BRIEF-GENERATOREN ✅
- `/src/lib/briefe/versorgungsamt.ts` - Sozialamt/Versorgungsamt
- `/src/lib/briefe/em-rente.ts` - Erwerbsminderungsrente
- `/src/lib/briefe/allgemein.ts` - Uni, Behörden, allgemein
- Muster-Vorlagen + rechtliche Hinweise

### 3. VIDEO-TOOLS ALTERNATIVEN ✅
- `/docs/VIDEO_ALTERNATIVEN.md` - D-ID, Pictory, InVideo, VEED.io
- Preisvergleich, GDPR, Deutsch-Support
- Empfehlung: D-ID für Avatare

### 4. API-ROUTEN ✅
- `/api/avatar/chat` - Mistral API Integration
- `/api/briefe/generate` - Allgemeiner Brief
- `/api/briefe/versorgungsamt` - Sozialamt
- `/api/briefe/em-rente` - Erwerbsminderungsrente

### 5. UI-KOMPONENTEN ✅
- `AvatarChat.tsx` - Chat-Interface
- `BriefGenerator.tsx` - Brief-Erstellung UI
- `VoiceInput.tsx` - Spracheingabe

## Installation

```bash
# Umgebungsvariablen setzen
echo "MISTRAL_API_KEY=your_key_here" > .env.local

# Dependencies installieren
npm install lucide-react

# Next.js Dev Server
npm run dev
```

## Features

### Avatar-Chat
- 🤖 Mistral AI Integration
- 🎤 Sprachsteuerung (de-DE)
- 📱 Mobile-optimiert
- 💬 Echtzeit-Antworten
- 🔊 Text-to-Speech

### Brief-Generatoren
- 📝 Rechtlich korrekte Vorlagen
- ⚡ Instant-Generierung
- 📥 Download als .txt
- 🏛️ Behörden-optimiert
- ⏰ Fristen-Hinweise

### Video-Tools
- 🎬 D-ID (Empfohlen)
- 🎥 Pictory (Content)
- ✂️ VEED (Untertitel)
- 📊 Vergleich in docs/

## API-Nutzung

```typescript
// Avatar Chat
fetch('/api/avatar/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{role: 'user', content: 'Hilfe'}],
    topic: 'pflege'
  })
});

// Brief generieren
fetch('/api/briefe/versorgungsamt', {
  method: 'POST',
  body: JSON.stringify({
    empfaenger: { name: 'Sozialamt Berlin' },
    antragsteller: { name: 'Max Mustermann' },
    inhalt: { betreff: 'Pflegegeld-Antrag' }
  })
});
```

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Mistral AI API
- Web Speech API
- Tailwind CSS (angenommen)

---
Gebaut für PflegeNavigator EU 🏥
