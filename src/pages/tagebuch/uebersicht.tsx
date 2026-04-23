import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDiaryEntries } from "@workspace/api-client-react";
import { Plus, Download, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

export function TagebuchUebersicht() {
  const { caseCode, initializeCase } = useCase();
  const { data: entries, isLoading } = useGetDiaryEntries(caseCode || "", {}, {
    query: { enabled: !!caseCode }
  });

  if (!caseCode) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-4">Pflegetagebuch</h1>
        <p className="text-muted-foreground mb-8">Beginnen Sie Ihr digitales Pflegetagebuch, um den Pflegeaufwand rechtssicher zu dokumentieren.</p>
        <Button onClick={() => initializeCase("tagebuch")}>Tagebuch starten</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Pflegetagebuch Übersicht</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/tagebuch/export"><Download className="mr-2 h-4 w-4" /> Export</Link>
          </Button>
          <Button asChild>
            <Link href="/tagebuch/neu"><Plus className="mr-2 h-4 w-4" /> Neuer Eintrag</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p>Lade Einträge...</p>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map(entry => (
            <Card key={entry.id}>
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                  <Calendar className="h-6 w-6 text-primary mb-1" />
                  <span className="font-semibold text-sm">{format(parseISO(entry.entryDate), "dd.MM.yyyy")}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">{entry.careHours ? `${entry.careHours} Stunden Pflegeaufwand` : "Keine Zeitangabe"}</h3>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      {entry.mood && <span>Stimmung: {entry.mood}</span>}
                      {entry.mobility && <span>Mobilität: {entry.mobility}</span>}
                    </div>
                  </div>
                  {entry.careActivities && entry.careActivities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.careActivities.map(act => (
                        <span key={act} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{act}</span>
                      ))}
                    </div>
                  )}
                  {entry.notes && <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-12 text-center text-muted-foreground">
            <p className="mb-4">Noch keine Einträge vorhanden.</p>
            <Button variant="outline" asChild>
              <Link href="/tagebuch/neu">Ersten Eintrag erstellen</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
