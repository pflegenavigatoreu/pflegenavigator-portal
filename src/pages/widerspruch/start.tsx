import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function WiderspruchStart() {
  const { initializeCase, isInitializing } = useCase();
  const [, setLocation] = useLocation();

  const handleStart = async () => {
    const code = await initializeCase("widerspruch");
    if (code) {
      setLocation("/widerspruch/analyse");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Widerspruch einlegen</h1>
        <p className="text-lg text-muted-foreground">
          Wurde Ihr Pflegegrad abgelehnt oder zu niedrig eingestuft? Wir helfen Ihnen bei der Analyse des Gutachtens und der Fristenwahrung.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        <h2 className="text-xl font-semibold">Wie funktioniert es?</h2>
        
        <div className="grid gap-4">
          {[
            "Situation analysieren (Was genau wurde abgelehnt?)",
            "Fristen prüfen (Wann kam der Bescheid?)",
            "Widerspruchsbegründung vorbereiten",
            "Dokumente für die Pflegekasse erstellen"
          ].map((item, i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                <span className="font-medium">{item}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-10 border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">Hinweis zur Frist</h3>
        <p className="text-sm text-blue-800">
          Ein Widerspruch muss in der Regel innerhalb eines Monats nach Bekanntgabe des Bescheids eingelegt werden.
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={handleStart} 
          disabled={isInitializing}
          className="w-full sm:w-auto"
        >
          {isInitializing ? "Wird geladen..." : "Analyse beginnen"} 
          {!isInitializing && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
