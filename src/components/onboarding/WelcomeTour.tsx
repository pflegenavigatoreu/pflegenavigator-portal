'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  X,
  CheckCircle,
  Sparkles,
  Languages
} from 'lucide-react';

interface WelcomeTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    id: 1,
    icon: Sparkles,
    title: 'Willkommen beim PflegeNavigator EU!',
    description: 'Ihr Weg durch die Pflege - einfach, schnell und kostenlos. Lassen Sie sich in 2 Minuten zeigen, wie das Portal funktioniert.',
    color: 'bg-gradient-to-br from-[#20b2aa] to-[#3ddbd0]'
  },
  {
    id: 2,
    icon: Calculator,
    title: 'Pflegegrad berechnen',
    description: 'Mit unserem Check finden Sie in 10 Minuten heraus, welcher Pflegegrad für Sie möglich ist. Der Rechner nutzt die offiziellen NBA-Module des MDK.',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    icon: FileText,
    title: 'Briefe generieren',
    description: 'Erstellen Sie automatisch professionelle Briefe für Anträge, Widersprüche und Anfragen. Alles kostenlos und sofort als PDF verfügbar.',
    color: 'bg-amber-500'
  },
  {
    id: 4,
    icon: Languages,
    title: '35 Sprachen verfügbar',
    description: 'Das Portal spricht Ihre Sprache! Wählen Sie oben rechts Ihre bevorzugte Sprache aus - alle Inhalte werden automatisch übersetzt.',
    color: 'bg-purple-500'
  },
  {
    id: 5,
    icon: HelpCircle,
    title: 'Hilfe rund um die Uhr',
    description: 'Bei Fragen nutzen Sie unsere FAQs, kontaktieren Sie uns per E-Mail oder rufen Sie die kostenlose Pflegehotline an.',
    color: 'bg-green-500'
  }
];

export default function WelcomeTour({ onComplete, onSkip }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Prüfen, ob Tour bereits gesehen wurde
    const hasSeenTour = localStorage.getItem('pflegenavigator-tour-seen');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeTour();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const completeTour = () => {
    localStorage.setItem('pflegenavigator-tour-seen', 'true');
    onComplete();
    setIsVisible(false);
  };

  const skipTour = () => {
    localStorage.setItem('pflegenavigator-tour-seen', 'true');
    onSkip();
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg relative animate-in fade-in zoom-in duration-300">
        {/* Skip Button */}
        <button 
          onClick={skipTour}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Tour überspringen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className={`${currentStepData.color} p-8 rounded-t-lg`}>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <div className="flex justify-center gap-2">
            {tourSteps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <CardHeader className="text-center pt-6">
          <CardTitle className="text-2xl">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Navigation */}
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>

            <span className="text-sm text-slate-500">
              Schritt {currentStep + 1} von {tourSteps.length}
            </span>

            <Button 
              onClick={handleNext}
              className={isLastStep ? 'bg-green-500 hover:bg-green-600' : 'bg-[#20b2aa] hover:bg-[#3ddbd0]'}
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Fertig
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Skip hint */}
          <button 
            onClick={skipTour}
            className="w-full mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Tour überspringen
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
