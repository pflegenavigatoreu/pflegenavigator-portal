'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ChevronRight, Book, HelpCircle, FileText, Video } from 'lucide-react';

interface QuickHelpProps {
  onClose?: () => void;
}

interface HelpArticle {
  id: string;
  title: string;
  icon: typeof Book;
  content: string;
  category: string;
}

const helpArticles: HelpArticle[] = [
  {
    id: 'start',
    title: 'Erste Schritte',
    icon: Book,
    category: 'Grundlagen',
    content: 'Willkommen beim PflegeNavigator! Hier lernen Sie die Grundlagen kennen:\n\n1. Pflegegrad-Check: Finden Sie heraus, welcher Pflegegrad für Sie infrage kommt\n2. Brief-Generator: Erstellen Sie professionelle Anträge und Widersprüche\n3. Alle Funktionen sind kostenlos und ohne Anmeldung nutzbar'
  },
  {
    id: 'pflegegrad',
    title: 'Wie funktioniert der Pflegegrad-Check?',
    icon: HelpCircle,
    category: 'Pflegegrad',
    content: 'Der Pflegegrad-Check führt Sie durch 6 Module:\n\n• Mobilität\n• Körperpflege\n• Ernährung\n• Ausscheidung\n• hauswirtschaftliche Versorgung\n• Behandlungspflege/cognitive Leistungen\n\nAm Ende erhalten Sie eine Einschätzung, welcher Pflegegrad wahrscheinlich ist.'
  },
  {
    id: 'widerspruch',
    title: 'Widerspruch einlegen',
    icon: FileText,
    category: 'Widerspruch',
    content: 'Wenn Sie mit einem Bescheid nicht einverstanden sind:\n\n1. Sie haben 1 Monat Zeit für Widerspruch\n2. Nutzen Sie unseren Widerspruchsgenerator\n3. Der Brief wird automatisch mit allen notwendigen Angaben erstellt\n4. Unterschreiben und an Ihre Pflegekasse senden'
  },
  {
    id: 'briefe',
    title: 'Briefe generieren',
    icon: FileText,
    category: 'Briefe',
    content: 'So erstellen Sie Briefe:\n\n1. Wählen Sie den Brief-Typ (Antrag, Widerspruch, etc.)\n2. Tragen Sie Ihre Daten ein\n3. Das System fügt automatisch die aktuellen Paragrafen und Formulierungen ein\n4. Laden Sie den Brief als PDF herunter oder senden Sie ihn direkt'
  },
  {
    id: 'sprachen',
    title: 'Sprachen ändern',
    icon: Book,
    category: 'Bedienung',
    content: 'Das Portal ist in 35 Sprachen verfügbar:\n\n1. Klicken Sie oben rechts auf die Sprachauswahl\n2. Wählen Sie Ihre Sprache\n3. Alle Inhalte werden automatisch übersetzt\n4. Die Briefe können auch mehrsprachig erstellt werden'
  }
];

export default function QuickHelp({ onClose }: QuickHelpProps) {
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  if (selectedArticle) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-[#20b2aa] mb-4 flex items-center gap-1 hover:underline"
          >
            ← Zurück zur Übersicht
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#20b2aa]/10 rounded-lg flex items-center justify-center">
              <selectedArticle.icon className="w-6 h-6 text-[#20b2aa]" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{selectedArticle.category}</p>
              <h3 className="font-semibold text-lg">{selectedArticle.title}</h3>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
              paragraph.startsWith('•') || paragraph.startsWith('1.') || paragraph.startsWith('2.') ? (
                <ul key={idx} className="list-disc pl-5 space-y-1 mb-4">
                  {paragraph.split('\n').map((item, itemIdx) => (
                    item.startsWith('•') || /^\d\./.test(item) ? (
                      <li key={itemIdx} className="text-slate-600">
                        {item.replace(/^[•\d\.\s]+/, '')}
                      </li>
                    ) : null
                  ))}
                </ul>
              ) : (
                <p key={idx} className="text-slate-600 mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedArticle(null)}
              className="flex-1"
            >
              Zurück
            </Button>
            {onClose && (
              <Button 
                onClick={onClose}
                className="flex-1 bg-[#20b2aa]"
              >
                Schließen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#20b2aa] rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Schnelle Hilfe</h3>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-slate-600 mb-4">
          Wählen Sie ein Thema für eine schnelle Erklärung:
        </p>

        <div className="space-y-2">
          {helpArticles.map((article) => {
            const Icon = article.icon;
            return (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-[#20b2aa] hover:bg-[#20b2aa]/5 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-[#20b2aa]/10">
                    <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#20b2aa]" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{article.title}</p>
                    <p className="text-sm text-slate-500">{article.category}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#20b2aa]" />
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/hilfe'}
          >
            Alle Hilfethemen anzeigen
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
