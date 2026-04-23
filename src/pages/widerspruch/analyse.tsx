import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSaveAnswer } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function WiderspruchAnalyse() {
  const { caseCode } = useCase();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const saveAnswer = useSaveAnswer();
  
  const [bescheidDatum, setBescheidDatum] = useState("");
  const [ablehnungsgrund, setAblehnungsgrund] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!caseCode) return;
    
    if (!bescheidDatum || !ablehnungsgrund) {
      toast({
        title: "Bitte füllen Sie alle Felder aus",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await saveAnswer.mutateAsync({
        caseCode,
        data: { module: "widerspruch", questionKey: "bescheid_datum", answerValue: bescheidDatum }
      });
      await saveAnswer.mutateAsync({
        caseCode,
        data: { module: "widerspruch", questionKey: "ablehnungsgrund", answerValue: ablehnungsgrund }
      });
      setLocation("/widerspruch/fristen");
    } catch (error) {
      toast({ title: "Fehler beim Speichern", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Analyse des Ablehnungsbescheids</h2>
      
      <Card className="mb-8">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bescheidDatum">Wann haben Sie den Bescheid erhalten? (Datum des Poststempels oder Empfangs)</Label>
            <input 
              type="date" 
              id="bescheidDatum" 
              value={bescheidDatum} 
              onChange={(e) => setBescheidDatum(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ablehnungsgrund">Was ist die Hauptbegründung für die Ablehnung/Einstufung laut Gutachten?</Label>
            <Textarea 
              id="ablehnungsgrund" 
              value={ablehnungsgrund} 
              onChange={(e) => setAblehnungsgrund(e.target.value)}
              placeholder="Zum Beispiel: Modul 4 wurde zu niedrig bewertet..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setLocation("/widerspruch/start")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? "Speichert..." : "Weiter zu Fristen"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
