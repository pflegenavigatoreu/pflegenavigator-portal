import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { ArrowRight } from "lucide-react";

export function GdbStart() {
  const { initializeCase, isInitializing } = useCase();
  const router = useRouter();

  const handleStart = async () => {
    const code = await initializeCase("gdb");
    if (code) {
      router.push("/gdb/diagnosen");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
      <h1 className="text-3xl font-bold text-primary mb-6">Grad der Behinderung (GdB) einschätzen</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Erfassen Sie Ihre Diagnosen und Beschwerden, um eine erste Einschätzung für Ihren GdB-Antrag zu erhalten.
        Wir helfen Ihnen zu verstehen, welche Unterlagen das Versorgungsamt benötigt.
      </p>
      
      <Button 
        size="lg" 
        onClick={handleStart} 
        disabled={isInitializing}
      >
        {isInitializing ? "Wird geladen..." : "Assistent starten"} 
        {!isInitializing && <ArrowRight className="ml-2 h-5 w-5" />}
      </Button>
    </div>
  );
}
export default GdbStart;
