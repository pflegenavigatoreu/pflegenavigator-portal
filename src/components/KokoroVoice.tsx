'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  Loader2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface KokoroVoiceProps {
  onTranscript?: (text: string, isCommand: boolean) => void;
  onCommand?: (command: 'hilfe' | 'weiter' | 'zurueck' | 'start' | 'stop' | 'ja' | 'nein') => void;
  disabled?: boolean;
  className?: string;
  autoStart?: boolean;
}

// Voice Command Keywords
const COMMANDS = {
  hilfe: ['hilfe', 'help', 'assistent', 'unterstützung', 'support'],
  weiter: ['weiter', 'next', 'nächste', 'continue', 'fortfahren', 'vor'],
  zurueck: ['zurück', 'zurueck', 'back', 'vorherige', 'zurückgehen'],
  start: ['start', 'anfang', 'beginnen', 'los', 'go'],
  stop: ['stop', 'pause', 'ende', 'halt', 'abbrechen'],
  ja: ['ja', 'yes', 'ok', 'richtig'],
  nein: ['nein', 'no', 'falsch', 'stopp']
};

export default function KokoroVoice({ 
  onTranscript, 
  onCommand, 
  disabled,
  className = '',
  autoStart = false
}: KokoroVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('af_bella');
  const recognitionRef = React.useRef<any>(null);

  // Check browser support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    
    if (!hasSpeechRecognition || !hasSpeechSynthesis) {
      setIsSupported(false);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isSupported || typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'de-DE';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (finalTranscript) {
        setTranscript(finalTranscript);
        processCommand(finalTranscript);
        
        if (onTranscript) {
          onTranscript(finalTranscript, false);
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setIsSupported(false);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported, onTranscript]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && isSupported && !isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Auto-start failed:', e);
      }
    }
  }, [autoStart, isSupported]);

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    let command: keyof typeof COMMANDS | null = null;
    
    for (const [cmd, keywords] of Object.entries(COMMANDS)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        command = cmd as keyof typeof COMMANDS;
        break;
      }
    }

    if (command && onCommand) {
      onCommand(command);
    }

    return command;
  }, [onCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  };

  // TTS with browser's speech synthesis (Kokoro placeholder for future integration)
  const speak = async (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;

    // Try to find a German voice
    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find(v => v.lang.startsWith('de'));
    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Available voices (placeholder for future Kokoro voices)
  const voices = [
    { id: 'af_bella', name: 'Bella (Weiblich)', lang: 'de' },
    { id: 'am_adam', name: 'Adam (Männlich)', lang: 'de' },
    { id: 'af_sarah', name: 'Sarah (Weiblich)', lang: 'de' },
  ];

  if (!isSupported) {
    return (
      <Card className="p-4 bg-slate-100 border-slate-200">
        <CardContent className="p-0 text-center">
          <p className="text-sm text-slate-600">
            Sprachsteuerung wird von diesem Browser nicht unterstützt.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Bitte verwenden Sie Chrome, Edge oder Safari.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="p-4">
        <CardContent className="p-0 space-y-4">
          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleListening}
                disabled={disabled}
                size="lg"
                className={`
                  rounded-full w-16 h-16 transition-all duration-300
                  ${isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-[#20b2aa] hover:bg-[#20b2aa]/90'
                  }
                `}
              >
                {isListening ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
              
              <div>
                <p className="font-semibold text-[#0f2744]">
                  {isListening ? 'Zuhören...' : 'Sprachsteuerung'}
                </p>
                <p className="text-sm text-slate-500">
                  {isListening 
                    ? 'Sagen Sie "Hilfe", "Weiter" oder "Zurück"' 
                    : 'Tippen Sie, um zu sprechen'
                  }
                </p>
              </div>
            </div>

            {/* TTS Button */}
            <Button
              onClick={() => speak('Wie kann ich Ihnen helfen?')}
              disabled={isSpeaking || disabled}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              {isSpeaking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Transcript Display */}
          {(transcript || interimTranscript) && (
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-[#0f2744]">{transcript || interimTranscript}</p>
              {interimTranscript && !transcript && (
                <p className="text-sm text-slate-400 mt-1">...höre zu</p>
              )}
            </div>
          )}

          {/* Settings Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showSettings ? 'Einstellungen schließen' : 'Stimme ändern'}
          </Button>

          {/* Voice Settings */}
          {showSettings && (
            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
              <p className="font-medium text-sm text-[#0f2744]">Stimme auswählen:</p>
              <div className="grid gap-2">
                {voices.map((voice) => (
                  <Button
                    key={voice.id}
                    variant={selectedVoice === voice.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedVoice(voice.id);
                      speak(`Das ist die Stimme ${voice.name}`);
                    }}
                    className="justify-start"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {voice.name}
                  </Button>
                ))}
              </div>
              
              <div className="text-xs text-slate-500 pt-2 border-t">
                <p>Verfügbare Befehle:</p>
                <ul className="mt-1 space-y-1">
                  <li>• "Hilfe" - Hilfe anfordern</li>
                  <li>• "Weiter" - Nächste Seite</li>
                  <li>• "Zurück" - Vorherige Seite</li>
                  <li>• "Ja/Nein" - Bestätigen/Ablehnen</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
