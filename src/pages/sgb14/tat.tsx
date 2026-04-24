import { useState } from "react";
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSaveAnswer, useSaveScore } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export function Sgb14Tat() {
  const { caseCode } = useCase();
  const router = useRouter();
  const saveAnswer = useSaveAnswer();
  const saveScore = useSaveScore();
  
  const [hergang, setHergang] = useState("");
  const [datum, setDatum] = useState("");

  const handleNext = async () => {
    if (!caseCode || !hergang || !datum) return;
    
    await saveAnswer.mutateAsync({
      caseCode,
      data: { module: "sgb14", questionKey: "tat_datum", answerValue: datum }
    });
    await saveAnswer.mutateAsync({
      caseCode,
      data: { module: "sgb14", questionKey: "tat_hergang", answerValue: hergang }
    });
    
    await saveScore.mutateAsync({
      caseCode,
      data: {
        module: "sgb14",
        trafficLight: "yellow",
        resultText: "Grundsätzlicher Anspruch möglich",
        recommendedActions: ["Strafanzeige stellen (falls noch nicht geschehen)", "Ärztliches Attest einholen", "Antrag beim Versorgungsamt stellen"]
      }
    });
    
    router.push("/sgb14/ergebnis");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-8">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-bold text-lg">Ereignis Dokumentation</h3>
          <div className="space-y-2">
            <Label>Wann fand das schädigende Ereignis statt?</Label>
            <input type="date" value={datum} onChange={e => setDatum(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <Label>Was ist passiert? (Kurze Beschreibung)</Label>
            <Textarea value={hergang} onChange={e => setHergang(e.target.value)} placeholder="Bitte beschreiben Sie das Ereignis sachlich." rows={6} />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!datum || !hergang}>Weiter <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </div>
    </div>
  );
}
export default Sgb14Tat;
