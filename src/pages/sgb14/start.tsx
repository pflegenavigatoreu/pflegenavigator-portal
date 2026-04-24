import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { ArrowRight } from "lucide-react";

export function Sgb14Start() {
  const { initializeCase, isInitializing } = useCase();
  const router = useRouter();

  const handleStart = async () => {
    const code = await initializeCase("sgb14");
    if (code) {
      router.push("/sgb14/tat");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
      <h1 className="text-3xl font-bold text-primary mb-6">Opferentschädigung (SGB XIV)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Erfassen Sie die wesentlichen Informationen für Leistungen nach dem Sozialen Entschädigungsrecht (SGB XIV) – z.B. nach Gewalttaten.
      </p>
      
      <Button size="lg" onClick={handleStart} disabled={isInitializing}>
        {isInitializing ? "Lade..." : "Dokumentation starten"} 
        {!isInitializing && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </div>
  );
}
export default Sgb14Start;
