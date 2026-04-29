"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Volume2, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string, isCommand: boolean) => void;
  onCommand?: (command: 'hilfe' | 'weiter' | 'zurueck' | 'start' | 'stop') => void;
  disabled?: boolean;
  className?: string;
}

// Voice Command Keywords
const COMMANDS = {
  hilfe: ['hilfe', 'help', 'assistent', 'unterstützung', 'support'],
  weiter: ['weiter', 'next', 'nächste', 'continue', 'fortfahren', 'vor'],
  zurueck: ['zurück', 'zurueck', 'back', 'vorherige', 'zurückgehen'],
  start: ['start', 'anfang', 'beginnen', 'los', 'go'],
  stop: ['stop', 'pause', 'ende', 'halt', 'abbrechen']
};

export default function VoiceInput({ 
  onTranscript, 
  onCommand, 
  disabled,
  className = '' 
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'de-DE';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        handleTranscript(finalTranscript);
      }
      setInterimTranscript(interim);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const detectCommand = useCallback((text: string): string | null => {
    const lower = text.toLowerCase();
    
    for (const [command, keywords] of Object.entries(COMMANDS)) {
      if (keywords.some(kw => lower.includes(kw))) {
        return command;
      }
    }
    return null;
  }, []);

  const handleTranscript = (text: string) => {
    const command = detectCommand(text);
    
    if (command && onCommand) {
      onCommand(command as any);
      onTranscript(text, true);
    } else {
      onTranscript(text, false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        Spracheingabe nicht unterstützt
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
          ${isListening 
            ? 'bg-red-500 text-white animate-pulse shadow-lg' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isListening ? (
          <>
            <Square className="w-5 h-5" />
            <span>Zuhören...</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span>Spracheingabe</span>
          </>
        )}
      </button>

      {/* Live Transkription */}
      {(transcript || interimTranscript) && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-500">Erkannt:</span>
          </div>
          <p className="text-sm text-gray-800">{transcript}</p>
          {interimTranscript && (
            <p className="text-sm text-gray-400 italic">{interimTranscript}</p>
          )}
        </div>
      )}

      {/* Command Hints */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-700 z-10">
          <div className="flex flex-wrap gap-1">
            <span className="font-medium">Sprachbefehle:</span>
            <span className="bg-white px-2 py-0.5 rounded">"Hilfe"</span>
            <span className="bg-white px-2 py-0.5 rounded">"Weiter"</span>
            <span className="bg-white px-2 py-0.5 rounded">"Zurück"</span>
          </div>
        </div>
      )}
    </div>
  );
}
