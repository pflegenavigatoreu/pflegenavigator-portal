import { useCase } from "@/hooks/use-case";
import { useGetExportData } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { format, parseISO } from "date-fns";

export function TagebuchExport() {
  const { caseCode } = useCase();
  const { data, isLoading } = useGetExportData(caseCode || "", {
    query: { enabled: !!caseCode }
  });

  if (isLoading) return <div className="p-12 text-center">Lade Daten...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold">Pflegetagebuch Export</h2>
        <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Drucken</Button>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-8 text-center">Pflegetagebuch Dokumentation</h1>
          
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">Fallcode: {caseCode}</p>
            <p className="text-sm text-muted-foreground">Erstellt am: {format(new Date(), "dd.MM.yyyy")}</p>
          </div>

          <div className="space-y-6">
            {data?.diaryEntries && data.diaryEntries.length > 0 ? data.diaryEntries.map(entry => (
              <div key={entry.id} className="border-b pb-4 mb-4 page-break-inside-avoid">
                <h3 className="font-bold text-lg mb-2">{format(parseISO(entry.entryDate), "dd.MM.yyyy")}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div><strong>Pflegeaufwand:</strong> {entry.careHours} Stunden</div>
                  <div><strong>Mobilität:</strong> {entry.mobility || "-"}</div>
                  <div><strong>Stimmung:</strong> {entry.mood || "-"}</div>
                </div>
                <div className="mb-2">
                  <strong>Aktivitäten:</strong> {entry.careActivities?.join(", ") || "-"}
                </div>
                {entry.notes && (
                  <div>
                    <strong>Notizen:</strong>
                    <p className="mt-1 p-2 bg-muted rounded text-sm">{entry.notes}</p>
                  </div>
                )}
              </div>
            )) : (
              <p>Keine Einträge vorhanden.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
