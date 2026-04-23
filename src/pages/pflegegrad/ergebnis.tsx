import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetScores, useGetExportData } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Download, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

export function PflegegradErgebnis() {
  const { caseCode } = useCase();
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: scores, isLoading } = useGetScores(caseCode || "", { module: "pflegegrad" }, {
    query: {
      enabled: !!caseCode
    }
  });
  
  const { refetch: getExportData } = useGetExportData(caseCode || "", {
    query: { enabled: false }
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data } = await getExportData();
      if (data) {
        // In a real app, generate a PDF using html2canvas/jsPDF or similar.
        // Here we'll just trigger the browser print dialog
        window.print();
      }
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl flex justify-center">
        <div className="animate-pulse text-primary font-medium">Ergebnis wird berechnet...</div>
      </div>
    );
  }

  const score = scores?.[0];

  const getTrafficLightColor = (color?: string) => {
    switch (color) {
      case "green": return "bg-[#166534] text-white";
      case "yellow": return "bg-[#92400e] text-white";
      case "red": return "bg-[#991b1b] text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getTrafficLightIcon = (color?: string) => {
    switch (color) {
      case "green": return <CheckCircle className="mr-2 h-4 w-4" />;
      case "yellow": return <AlertTriangle className="mr-2 h-4 w-4" />;
      case "red": return <AlertTriangle className="mr-2 h-4 w-4" />;
      default: return <Info className="mr-2 h-4 w-4" />;
    }
  };

  const getTrafficLightText = (color?: string) => {
    switch (color) {
      case "green": return "Gute Ausgangslage";
      case "yellow": return "Weitere Prüfung empfohlen";
      case "red": return "Dringender Handlungsbedarf";
      default: return "Keine Daten";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Ihr Ergebnis</h1>
          <p className="text-muted-foreground">Basierend auf Ihren Angaben haben wir eine erste Einschätzung vorgenommen.</p>
        </div>

        {score ? (
          <Card className="mb-8 overflow-hidden border-2 border-primary/10">
            <div className={`h-2 w-full ${getTrafficLightColor(score.trafficLight)}`} />
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Voraussichtlicher</h2>
                  <div className="text-4xl font-bold text-primary">{score.resultText}</div>
                </div>
                <Badge className={`${getTrafficLightColor(score.trafficLight)} hover:${getTrafficLightColor(score.trafficLight)} text-sm px-3 py-1 flex items-center`}>
                  {getTrafficLightIcon(score.trafficLight)}
                  {getTrafficLightText(score.trafficLight)}
                </Badge>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  Orientierungshinweis
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Dieses Ergebnis dient ausschließlich zur persönlichen Einschätzung und stellt keine Rechtsberatung oder medizinische Diagnose dar.
                  Ein offizieller Pflegegrad kann nur durch den Medizinischen Dienst (MD) oder Medicproof nach Antragstellung vergeben werden.
                </p>
                <p className="text-sm text-muted-foreground">
                  Berechneter NBA-Punktwert: <strong className="text-foreground">{score.scoreValue} Punkte</strong>
                </p>
              </div>

              {score.recommendedActions && score.recommendedActions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Empfohlene nächste Schritte</h3>
                  <ul className="space-y-3">
                    {score.recommendedActions.map((action, i) => (
                      <li key={i} className="flex items-start">
                        <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-8 text-center text-muted-foreground">
              Es konnten keine Ergebnisse gefunden werden.
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
          <Button onClick={handleExport} disabled={isExporting} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Wird exportiert..." : "Als PDF exportieren"}
          </Button>
          <Button asChild className="flex-1">
            <Link href="/tagebuch/uebersicht">Pflegetagebuch starten</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
