import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSaveAnswer } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const questions = [
  {
    id: "m1_1",
    key: "positionswechsel_bett",
    title: "Positionswechsel im Bett",
    description: "Kann die Person sich selbstständig im Bett drehen und aufrichten?",
    options: [
      { value: "selbstaendig", label: "Selbstständig" },
      { value: "ueberwiegend_selbstaendig", label: "Überwiegend selbstständig" },
      { value: "ueberwiegend_unselbstaendig", label: "Überwiegend unselbstständig" },
      { value: "unselbstaendig", label: "Unselbstständig" }
    ]
  },
  {
    id: "m1_2",
    key: "halten_sitzposition",
    title: "Halten einer stabilen Sitzposition",
    description: "Kann die Person frei sitzen, ohne seitlich oder nach vorn wegzukippen?",
    options: [
      { value: "selbstaendig", label: "Selbstständig" },
      { value: "ueberwiegend_selbstaendig", label: "Überwiegend selbstständig" },
      { value: "ueberwiegend_unselbstaendig", label: "Überwiegend unselbstständig" },
      { value: "unselbstaendig", label: "Unselbstständig" }
    ]
  },
  {
    id: "m1_3",
    key: "umsetzen",
    title: "Umsetzen",
    description: "Vom Bett in den Rollstuhl/Stuhl und zurück.",
    options: [
      { value: "selbstaendig", label: "Selbstständig" },
      { value: "ueberwiegend_selbstaendig", label: "Überwiegend selbstständig" },
      { value: "ueberwiegend_unselbstaendig", label: "Überwiegend unselbstständig" },
      { value: "unselbstaendig", label: "Unselbstständig" }
    ]
  }
];

export function PflegegradModul1() {
  const { caseCode } = useCase();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const saveAnswer = useSaveAnswer();
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionKey: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
  };

  const handleNext = async () => {
    if (!caseCode) return;
    
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.key]);
    if (unanswered.length > 0) {
      toast({
        title: "Bitte beantworten Sie alle Fragen",
        description: "Um fortzufahren, müssen alle Fragen auf dieser Seite beantwortet werden.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save all answers for this module
      for (const [key, value] of Object.entries(answers)) {
        await saveAnswer.mutateAsync({
          caseCode,
          data: {
            module: "pflegegrad",
            questionKey: key,
            answerValue: value
          }
        });
      }
      
      setLocation("/pflegegrad/modul2");
    } catch (error) {
      toast({
        title: "Fehler beim Speichern",
        description: "Ihre Antworten konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <p className="text-sm font-medium text-muted-foreground">Schritt 1 von 6</p>
          <p className="text-sm font-medium text-primary">Modul 1: Mobilität</p>
        </div>
        <Progress value={16.6} className="h-2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Mobilität</h2>
        
        <div className="space-y-8 mb-10">
          {questions.map((q) => (
            <Card key={q.id} className="border-border">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{q.title}</h3>
                  <p className="text-muted-foreground text-sm">{q.description}</p>
                </div>
                
                <RadioGroup 
                  value={answers[q.key]} 
                  onValueChange={(val) => handleAnswer(q.key, val)}
                  className="space-y-3"
                >
                  {q.options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-3 bg-muted/30 p-3 rounded-md border border-transparent hover:border-border transition-colors">
                      <RadioGroupItem value={opt.value} id={`${q.id}_${opt.value}`} />
                      <Label htmlFor={`${q.id}_${opt.value}`} className="flex-1 cursor-pointer font-medium leading-none">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setLocation("/pflegegrad/start")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? "Wird gespeichert..." : "Weiter zu Modul 2"}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
