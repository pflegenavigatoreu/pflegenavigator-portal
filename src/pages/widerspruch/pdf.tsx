import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import { useCase } from "@/hooks/use-case";
import { useGetAnswers } from "@workspace/api-client-react";

export function WiderspruchPdf() {
  const { caseCode } = useCase();
  const { data: answers } = useGetAnswers(caseCode || "", { module: "widerspruch" }, {
    query: { enabled: !!caseCode }
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold">Widerspruchs-Dokumente</h2>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Drucken / PDF
        </Button>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8 prose max-w-none">
          <div className="text-right text-sm text-muted-foreground mb-8">
            Datum: {new Date().toLocaleDateString('de-DE')}
          </div>
          
          <h1 className="text-xl font-bold mb-6">Widerspruch gegen den Pflegegrad-Bescheid</h1>
          
          <p>Sehr geehrte Damen und Herren,</p>
          <p>
            hiermit lege ich form- und fristgerecht <strong>Widerspruch</strong> gegen Ihren Bescheid ein.
          </p>
          <p>
            Ich beantrage gleichzeitig die Zusendung des vollständigen Gutachtens des Medizinischen Dienstes (MD) in Kopie, falls dieses noch nicht vorliegt.
          </p>
          <p>
            Die ausführliche Begründung meines Widerspruchs werde ich nach eingehender Prüfung des Gutachtens unaufgefordert nachreichen.
          </p>
          <br/>
          <p>Mit freundlichen Grüßen,</p>
          <br/>
          <br/>
          <p>___________________________<br/>(Unterschrift)</p>
          
          <div className="mt-12 p-4 bg-muted text-sm print:hidden">
            <strong>Orientierungshinweis:</strong> Dies ist ein Muster-Muster für einen fristwahrenden Widerspruch. Bitte ergänzen Sie Ihre persönlichen Daten (Absender, Versicherungsnummer, Aktenzeichen) händisch nach dem Ausdrucken. Wir speichern diese Daten absichtlich nicht, um Ihre Privatsphäre zu schützen (Fallcode-System).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
