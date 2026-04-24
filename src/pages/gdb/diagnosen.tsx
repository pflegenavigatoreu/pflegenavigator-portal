import { useState } from "react";
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSaveAnswer, useSaveScore } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

export function GdbDiagnosen() {
  const { caseCode } = useCase();
  const router = useRouter();
  const { toast } = useToast();
  const saveAnswer = useSaveAnswer();
  const saveScore = useSaveScore();
  
  const [diagnosen, setDiagnosen] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!caseCode || !diagnosen.trim()) return;

    setIsSubmitting(true);
    try {
      await saveAnswer.mutateAsync({
        caseCode,
        data: { module: "gdb", questionKey: "diagnosen_text", answerValue: diagnosen }
      });
      
      // Dummy score for demo
      await saveScore.mutateAsync({
        caseCode,
        data: {
          module: "gdb",
          trafficLight: "yellow",
          scoreValue: 30,
          resultText: "GdB 30 - 40",
          recommendedActions: ["Arztberichte sammeln", "Gleichstellungsantrag prüfen"]
        }
      });
      
      router.push("/gdb/ergebnis");
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Ihre Diagnosen</h2>
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="mb-4 text-muted-foreground">
            Bitte listen Sie hier Ihre Diagnosen und vor allem die daraus resultierenden Einschränkungen im Alltag auf. 
            Für das Versorgungsamt sind die konkreten Einschränkungen oft wichtiger als der reine Name der Diagnose.
          </p>
          <Textarea 
            value={diagnosen}
            onChange={(e) => setDiagnosen(e.target.value)}
            placeholder="Beispiel: Chronische Rückenbeschwerden - Kann nicht länger als 30 Min. sitzen..."
            rows={8}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={isSubmitting || !diagnosen.trim()}>
          Auswerten <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
export default GdbDiagnosen;
