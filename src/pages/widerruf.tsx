import { Card, CardContent } from "@/components/ui/card";

export function Widerruf() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Widerrufsbelehrung</h1>
      
      <Card>
        <CardContent className="p-8 prose prose-slate max-w-none">
          <h2>Widerrufsrecht</h2>
          <p>
            Da die Nutzung unseres Basis-Angebots kostenfrei ist und keine bindenden Verträge über kostenpflichtige Dienstleistungen abgeschlossen werden, entfällt ein klassisches Widerrufsrecht für Verbraucherverträge.
          </p>
          
          <h2>Löschung Ihrer Daten</h2>
          <p>
            Sie können Ihre gespeicherten Daten (Fallakte) jederzeit löschen. Nutzen Sie dafür die entsprechende Funktion in den Einstellungen oder löschen Sie Ihre Browser-Daten (LocalStorage), um die Verknüpfung zu Ihrem Fallcode aufzuheben.
          </p>
          <p>
            Die anonymen Falldaten verbleiben zur statistischen Auswertung im System, können aber nicht mehr Ihnen zugeordnet werden.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
