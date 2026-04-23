import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSaveAnswer, useSaveScore } from "@workspace/api-client-react";
import { ArrowRight } from "lucide-react";

export function EmrArbeit() {
  const { caseCode } = useCase();
  const [, setLocation] = useLocation();
  const saveAnswer = useSaveAnswer();
  const saveScore = useSaveScore();
  
  const [capacity, setCapacity] = useState("");

  const handleNext = async () => {
    if (!caseCode || !capacity) return;
    
    await saveAnswer.mutateAsync({
      caseCode,
      data: { module: "emr", questionKey: "arbeitsfaehigkeit", answerValue: capacity }
    });
    
    await saveScore.mutateAsync({
      caseCode,
      data: {
        module: "emr",
        trafficLight: "yellow",
        resultText: capacity === "unter_3" ? "Volle EM-Rente möglich" : "Teilweise EM-Rente möglich",
        recommendedActions: ["Reha vor Rente prüfen", "Renteninformation anfordern"]
      }
    });
    
    setLocation("/emr/ergebnis");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">Arbeitsfähigkeit auf dem allgemeinen Arbeitsmarkt</h3>
          <p className="mb-4 text-sm text-muted-foreground">Wie viele Stunden am Tag können Sie aus gesundheitlichen Gründen noch arbeiten?</p>
          <RadioGroup value={capacity} onValueChange={setCapacity} className="space-y-3">
            <div className="flex items-center space-x-2"><RadioGroupItem value="unter_3" id="u3" /><Label htmlFor="u3">Unter 3 Stunden</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="3_bis_6" id="3b6" /><Label htmlFor="3b6">3 bis unter 6 Stunden</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="ueber_6" id="o6" /><Label htmlFor="o6">6 Stunden und mehr</Label></div>
          </RadioGroup>
        </CardContent>
      </Card>
      <Button onClick={handleNext} disabled={!capacity}>Weiter <ArrowRight className="ml-2 h-4 w-4" /></Button>
    </div>
  );
}
