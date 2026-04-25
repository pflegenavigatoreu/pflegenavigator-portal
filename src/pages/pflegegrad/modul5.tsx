import { useState } from "react";
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSaveAnswer } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const questions = [
  {
    id: "m5_1",
    key: "medikation",
    title: "Medikation",
    description: "Wie oft benötigt die Person Hilfe bei der Einnahme von Medikamenten?",
    options: [
      { value: "nie", label: "Nie" },
      { value: "einmal_taeglich", label: "Einmal täglich" },
      { value: "mehrmals_taeglich", label: "Mehrmals täglich" }
    ]
  },
  {
    id: "m5_2",
    key: "wundversorgung",
    title: "Wundversorgung / Verbandswechsel",
    description: "Wie oft ist Hilfe bei der Wundversorgung nötig?",
    options: [
      { value: "nie", label: "Nie" },
      { value: "selten", label: "Selten (1-3x im Monat)" },
      { value: "taeglich", label: "Täglich" }
    ]
  },
  {
    id: "m5_3",
    key: "arztbesuche",
    title: "Arztbesuche",
    description: "Wie oft muss die Person zu Ärzten oder Therapien begleitet werden?",
    options: [
      { value: "nie", label: "Nie" },
      { value: "selten", label: "Selten (1x pro Halbjahr)" },
      { value: "gelegentlich", label: "Gelegentlich (1x pro Quartal)" },
      { value: "haeufig", label: "Häufig (1x pro Monat oder öfter)" }
    ]
  }
];

export function PflegegradModul5() {
  const { caseCode } = useCase();
  const router = useRouter();
  const { toast } = useToast();
  const saveAnswer = useSaveAnswer();
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionKey: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
  };

  const handleNext = async () => {
    if (!caseCode) return;
    
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
      router.push("/pflegegrad/modul6");
    } catch (error) {
      toast({
        title: "Fehler beim Speichern",
        description: "Ihre Antworten konnten nicht gespeichert werden.",
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
          <p className="text-sm font-medium text-muted-foreground">Schritt 5 von 6</p>
          <p className="text-sm font-medium text-primary">Modul 5: Krankheitsumgang</p>
        </div>
        <Progress value={83.3} className="h-2" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-foreground mb-6">Umgang mit krankheitsbedingten Anforderungen</h2>
        
        <div className="space-y-8 mb-10">
          {questions.map((q) => (
            <Card key={q.id} className="border-border">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{q.title}</h3>
                  <p className="text-muted-foreground text-sm">{q.description}</p>
                </div>
                <RadioGroup value={answers[q.key]} onValueChange={(val) => handleAnswer(q.key, val)} className="space-y-3">
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
          <Button variant="outline" onClick={() => router.push("/pflegegrad/modul4")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? "Wird gespeichert..." : "Weiter zu Modul 6"}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
export default PflegegradModul5;
