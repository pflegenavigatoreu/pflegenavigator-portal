'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react';

interface FeedbackFormProps {
  onClose?: () => void;
  context?: string;
}

type FeedbackType = 'bug' | 'feature' | 'praise' | 'other';

interface FeedbackData {
  type: FeedbackType;
  rating: number;
  message: string;
  email: string;
  context?: string;
}

export default function FeedbackForm({ onClose, context }: FeedbackFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [feedback, setFeedback] = useState<FeedbackData>({
    type: 'other',
    rating: 0,
    message: '',
    email: '',
    context
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'bug' as FeedbackType, label: 'Fehler melden', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'feature' as FeedbackType, label: 'Funktion vorschlagen', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'praise' as FeedbackType, label: 'Lob & Anregungen', icon: ThumbsUp, color: 'text-green-500' },
    { id: 'other' as FeedbackType, label: 'Sonstiges', icon: MessageSquare, color: 'text-slate-500' }
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Speichere Feedback (lokal oder API)
    const feedbacks = JSON.parse(localStorage.getItem('pflegenavigator-feedback') || '[]');
    feedbacks.push({
      ...feedback,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    localStorage.setItem('pflegenavigator-feedback', JSON.stringify(feedbacks));
    
    setIsSubmitting(false);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#20b2aa] rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Ihr Feedback</CardTitle>
              <CardDescription>Helfen Sie uns, das Portal zu verbessern</CardDescription>
            </div>
          </div>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step 1: Typ wählen */}
        {step === 1 && (
          <CardContent className="pt-6 space-y-6">
            <p className="text-slate-600 mb-4">
              Was möchten Sie uns mitteilen?
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setFeedback({ ...feedback, type: type.id });
                      setStep(2);
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:border-[#20b2aa] ${
                      feedback.type === type.id 
                        ? 'border-[#20b2aa] bg-[#20b2aa]/5' 
                        : 'border-slate-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${type.color} mb-2`} />
                    <p className="font-medium text-sm">{type.label}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <CardContent className="pt-6 space-y-6">
            {/* Bewertung */}
            <div className="space-y-2">
              <Label>Wie gefällt Ihnen das Portal?</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className="p-1 transition-transform hover:scale-110"
                    aria-label={`${star} Sterne`}
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= feedback.rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Nachricht */}
            <div className="space-y-2">
              <Label htmlFor="message">Ihre Nachricht</Label>
              <Textarea
                id="message"
                placeholder="Beschreiben Sie Ihr Anliegen..."
                value={feedback.message}
                onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                className="min-h-[120px]"
              />
            </div>

            {/* E-Mail (optional) */}
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail (optional, für Rückfragen)</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={feedback.email}
                onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
              />
            </div>

            {context && (
              <Alert className="bg-slate-50">
                <AlertDescription className="text-xs text-slate-500">
                  Kontext: {context}
                </AlertDescription>
              </Alert>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Zurück
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !feedback.message.trim()}
                className="flex-1 bg-[#20b2aa]"
              >
                {isSubmitting ? (
                  'Wird gesendet...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Absenden
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        )}

        {/* Step 3: Bestätigung */}
        {step === 3 && (
          <CardContent className="pt-6 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-[#0f2744]">
              Vielen Dank!
            </h3>
            
            <p className="text-slate-600">
              Ihr Feedback hilft uns, PflegeNavigator EU zu verbessern. 
              {feedback.email && 'Wir melden uns bei Ihnen, falls wir Rückfragen haben.'}
            </p>

            <Button 
              onClick={onClose}
              className="w-full bg-[#20b2aa]"
            >
              Schließen
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
