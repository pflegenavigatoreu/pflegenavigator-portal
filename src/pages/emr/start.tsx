import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { ArrowRight } from "lucide-react";

export function EmrStart() {
  const { initializeCase, isInitializing } = useCase();
  const router = useRouter();

  const handleStart = async () => {
    const code = await initializeCase("emr");
    if (code) {
      router.push("/emr/arbeit");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
      <h1 className="text-3xl font-bold text-primary mb-6">Erwerbsminderungsrente (EM-Rente)</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Prüfen Sie die medizinischen und versicherungsrechtlichen Voraussetzungen für eine Erwerbsminderungsrente.
      </p>
      
      <Button size="lg" onClick={handleStart} disabled={isInitializing}>
        {isInitializing ? "Lade..." : "Fragenkatalog starten"} 
        {!isInitializing && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </div>
  );
}
export default EmrStart;
