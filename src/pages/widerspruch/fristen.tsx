import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAnswers } from "@/lib/api";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";
import { addMonths, format, parseISO } from "date-fns";

export function WiderspruchFristen() {
  const { caseCode } = useCase();
  const router = useRouter();
  const [frist, setFrist] = useState<string | null>(null);

  const { data: answers, isLoading } = useGetAnswers(caseCode || "", { module: "widerspruch" }, {
    query: { enabled: !!caseCode }
  });

  useEffect(() => {
    if (answers) {
      const datumAnswer = answers.find(a => a.questionKey === "bescheid_datum");
      if (datumAnswer && datumAnswer.answerValue) {
        try {
          const date = parseISO(datumAnswer.answerValue);
          // Widerspruchsfrist ist typischerweise 1 Monat
          const deadline = addMonths(date, 1);
          setFrist(format(deadline, "dd.MM.yyyy"));
        } catch(e) {
          console.error(e);
        }
      }
    }
  }, [answers]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Ihre Fristen & Nächste Schritte</h2>
      
      {isLoading ? (
        <p>Lade Daten...</p>
      ) : (
        <div className="space-y-6">
          <Card className="border-red-200">
            <CardContent className="p-6 flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-red-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-lg text-red-900 mb-1">Achtung: Widerspruchsfrist</h3>
                <p className="text-red-800">
                  Ihr Widerspruch muss spätestens am <strong className="font-bold">{frist || "unbekannt"}</strong> bei der Pflegekasse eingehen.
                  Legen Sie zunächst einen formlosen Widerspruch zur Fristwahrung ein. Die ausführliche Begründung können Sie nachreichen.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Ihre nächsten Schritte</h3>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>Formlosen Widerspruch erstellen und fristgerecht absenden (am besten per Einschreiben mit Rückschein).</li>
                <li>Das vollständige Gutachten (Pflegetagebuch/Assessment) bei der Pflegekasse anfordern, falls noch nicht vorliegend.</li>
                <li>Pflegetagebuch führen, um den tatsächlichen Aufwand detailliert nachzuweisen.</li>
                <li>Zusammen mit Hausarzt oder Pflegeberater eine detaillierte Begründung verfassen und nachreichen.</li>
              </ol>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/widerspruch/analyse")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
            </Button>
            <Button onClick={() => router.push("/widerspruch/pdf")}>
              <FileText className="mr-2 h-4 w-4" /> Dokumente generieren
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default WiderspruchFristen;
