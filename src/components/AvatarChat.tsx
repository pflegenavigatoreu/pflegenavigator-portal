"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, Download, Volume2, VolumeX, HelpCircle, ArrowRight, ArrowLeft, Bot, User } from 'lucide-react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Mistral API Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AvatarChatProps {
  initialMessage?: string;
  topic?: string;
  showVoiceHints?: boolean;
  pageContext?: string;
  moduleNumber?: number;
}

// Voice Commands
const VOICE_COMMANDS = {
  HILFE: ['hilfe', 'help', 'assistent', 'unterstützung'],
  WEITER: ['weiter', 'next', 'fortfahren', 'continue'],
  ZURÜCK: ['zurück', 'back', 'zurueck', 'vorherige'],
  START: ['start', 'anfang', 'beginnen'],
  STOP: ['stop', 'pause', 'ende'],
};

export default function AvatarChat({ 
  initialMessage = "Hallo! Ich bin Ihr PflegeNavigator Assistent. Wie kann ich Ihnen helfen?",
  topic = "allgemein",
  showVoiceHints = true 
}: AvatarChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: initialMessage, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarAnimation, setAvatarAnimation] = useState<'idle' | 'talking' | 'listening'>('idle');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showHints, setShowHints] = useState(showVoiceHints);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'de-DE';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setAvatarAnimation('listening');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setAvatarAnimation('idle');
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setAvatarAnimation('idle');
      };
    }
  }, []);

  // Handle Voice Commands
  const handleVoiceCommand = useCallback((transcript: string) => {
    const lowerText = transcript.toLowerCase();
    
    // Check for commands
    if (VOICE_COMMANDS.HILFE.some(cmd => lowerText.includes(cmd))) {
      sendMessage("Ich brauche Hilfe beim Pflegeantrag");
      speakText("Ich helfe Ihnen gerne beim Pflegeantrag. Was möchten Sie wissen?");
      return;
    }
    
    if (VOICE_COMMANDS.WEITER.some(cmd => lowerText.includes(cmd))) {
      sendMessage("Weiter zum nächsten Schritt");
      return;
    }
    
    if (VOICE_COMMANDS.ZURÜCK.some(cmd => lowerText.includes(cmd))) {
      sendMessage("Zurück zum vorherigen Schritt");
      return;
    }

    // Regular message
    sendMessage(transcript);
  }, []);

  // Text-to-Speech
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    synthesisRef.current = new SpeechSynthesisUtterance(text);
    synthesisRef.current.lang = 'de-DE';
    synthesisRef.current.rate = 1;
    synthesisRef.current.pitch = 1;
    
    synthesisRef.current.onstart = () => {
      setIsSpeaking(true);
      setAvatarAnimation('talking');
    };
    
    synthesisRef.current.onend = () => {
      setIsSpeaking(false);
      setAvatarAnimation('idle');
    };
    
    window.speechSynthesis.speak(synthesisRef.current);
  }, [voiceEnabled]);

  // Send Message to Mistral API
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/avatar/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          topic
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (voiceEnabled) {
        speakText(data.response);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Voice Input
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Download Chat
  const downloadChat = () => {
    const chatText = messages.map(m => 
      `${m.role === 'user' ? 'Sie' : 'Assistent'} (${m.timestamp.toLocaleTimeString()}):\n${m.content}\n---\n`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pflegenavigator-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Animated Avatar */}
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ${
              avatarAnimation === 'talking' ? 'scale-110 animate-pulse' : ''
            } ${avatarAnimation === 'listening' ? 'ring-4 ring-yellow-400 animate-ping' : ''}`}>
              <Bot className="w-7 h-7 text-white" />
            </div>
            {avatarAnimation === 'listening' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
            )}
            {avatarAnimation === 'talking' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold">PflegeNavigator Assistent</h3>
            <p className="text-blue-100 text-sm">
              {isListening ? 'Hört zu...' : isSpeaking ? 'Spricht...' : 'Bereit'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title={voiceEnabled ? 'Sprachausgabe aus' : 'Sprachausgabe an'}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={downloadChat}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Chat herunterladen"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Voice Hints */}
      {showHints && (
        <div className="bg-yellow-50 px-4 py-2 flex items-center gap-4 text-sm text-yellow-800 border-b border-yellow-200">
          <span className="font-medium flex items-center gap-1">
            <HelpCircle className="w-4 h-4" /> Sprachbefehle:
          </span>
          <span className="bg-white px-2 py-1 rounded border">"Hilfe"</span>
          <span className="bg-white px-2 py-1 rounded border">"Weiter"</span>
          <span className="bg-white px-2 py-1 rounded border">"Zurück"</span>
          <button 
            onClick={() => setShowHints(false)}
            className="ml-auto text-yellow-600 hover:text-yellow-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className={`text-xs mt-1 block ${
                message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={startListening}
            disabled={isListening}
            className={`p-3 rounded-xl transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
            placeholder="Nachricht schreiben..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 justify-center">
          <button 
            onClick={() => sendMessage("Hilfe")}
            className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" /> Hilfe
          </button>
          <button 
            onClick={() => sendMessage("Weiter")}
            className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4" /> Weiter
          </button>
          <button 
            onClick={() => sendMessage("Zurück")}
            className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
        </div>
      </div>
    </div>
  );
}
