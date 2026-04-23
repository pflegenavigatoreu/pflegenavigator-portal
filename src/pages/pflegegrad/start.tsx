import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function PflegegradStart() {
  const { initializeCase, isInitializing } = useCase();
  const [, setLocation] = useLocation();

  const handleStart = async () => {
    const code = await initializeCase("pflegegrad");
    if (code) {
      setLocation("/pflegegrad/modul1");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Pflegegrad einschätzen</h1>
        <p className="text-lg text-muted-foreground">
          Dieser Assistent führt Sie durch die 6 Module des Neuen Begutachtungsassessments (NBA). 
          Am Ende erhalten Sie eine Einschätzung des voraussichtlichen Pflegegrads.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        <h2 className="text-xl font-semibold">Was erwartet Sie?</h2>
        
        <div className="grid gap-4">
          {[
            "Modul 1: Mobilität (Wie selbstständig können Sie sich bewegen?)",
            "Modul 2: Kognitive und kommunikative Fähigkeiten",
            "Modul 3: Verhaltensweisen und psychische Problemlagen",
            "Modul 4: Selbstversorgung (Körperpflege, Essen, Trinken)",
            "Modul 5: Bewältigung von und selbstständiger Umgang mit krankheits- oder therapiebedingten Anforderungen",
            "Modul 6: Gestaltung des Alltagslebens und sozialer Kontakte"
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
        <h3 className="font-semibold text-blue-900 mb-2">Wichtiger Hinweis</h3>
        <p className="text-sm text-blue-800">
          Ihre Angaben werden anonym unter einem Fallcode gespeichert. 
          Das Ergebnis dient zur Orientierung und stellt keine verbindliche Einstufung dar. 
          Die tatsächliche Begutachtung erfolgt durch den MDK oder Medicproof.
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={handleStart} 
          disabled={isInitializing}
          className="w-full sm:w-auto"
        >
          {isInitializing ? "Wird geladen..." : "Einschätzung beginnen"} 
          {!isInitializing && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
