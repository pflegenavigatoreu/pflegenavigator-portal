'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, Check, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Language {
  code: string;
  name: string;
  flag: string;
  complete: boolean;
}

const languages: Language[] = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', complete: true },
  { code: 'en', name: 'English', flag: '🇬🇧', complete: true },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', complete: true },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', complete: true },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', complete: true },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', complete: true },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', complete: true },
  { code: 'fr', name: 'Français', flag: '🇫🇷', complete: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', complete: false },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', complete: false },
  { code: 'ro', name: 'Română', flag: '🇷🇴', complete: false },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', complete: false },
  { code: 'sr', name: 'Српски', flag: '🇷🇸', complete: false },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷', complete: false },
  { code: 'bs', name: 'Bosanski', flag: '🇧🇦', complete: false },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', complete: false },
  { code: 'pt', name: 'Português', flag: '🇵🇹', complete: false },
  { code: 'bg', name: 'Български', flag: '🇧🇬', complete: false },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿', complete: false },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺', complete: false },
  { code: 'zh', name: '中文', flag: '🇨🇳', complete: false },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', complete: false },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', complete: false },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱', complete: false },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', complete: false },
  { code: 'ku', name: 'Kurdî', flag: '🇹🇷', complete: false },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', complete: false },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹', complete: false },
  { code: 'so', name: 'Soomaali', flag: '🇸🇴', complete: false },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿', complete: false },
  { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷', complete: false },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', complete: false },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', complete: false },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', complete: false },
  { code: 'fil', name: 'Filipino', flag: '🇵🇭', complete: false }
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

export default function LanguageSelector({ currentLanguage, onSelect, onClose }: LanguageSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = languages.filter(l => l.complete).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-[#20b2aa]" />
              <CardTitle>Sprache waehlen</CardTitle>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600"
              aria-label="Schliessen"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {completedCount} von {languages.length} Sprachen vollstaendig uebersetzt
          </p>
        </CardHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Sprache suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <CardContent className="overflow-y-auto flex-1 p-6 pt-0">
          <div className="space-y-1">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onSelect(lang.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-[#20b2aa] text-white'
                    : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <span className="font-medium">{lang.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {!lang.complete && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      currentLanguage === lang.code
                        ? 'bg-white/20'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      Beta
                    </span>
                  )}
                  {currentLanguage === lang.code && (
                    <Check className="w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              Keine Sprache gefunden
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
