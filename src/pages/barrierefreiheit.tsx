import { Card, CardContent } from "@/components/ui/card";

export function Barrierefreiheit() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Erklärung zur Barrierefreiheit</h1>
      
      <Card>
        <CardContent className="p-8 prose prose-slate max-w-none">
          <p>
            Die PflegeNavigator EU gUG ist bemüht, ihre Website im Einklang mit den nationalen Rechtsvorschriften zur Umsetzung der Richtlinie (EU) 2016/2102 des Europäischen Parlaments und des Rates barrierefrei zugänglich zu machen.
          </p>
          
          <h2>Stand der Vereinbarkeit mit den Anforderungen</h2>
          <p>
            Diese Website ist wegen der folgenden Ausnahmen teilweise mit den Vorgaben harmonisiert.
          </p>
          
          <h2>Nicht barrierefreie Inhalte</h2>
          <p>
            Die nachstehend aufgeführten Inhalte sind aus folgenden Gründen nicht barrierefrei:
            <ul>
              <li>Einige komplexe Tabellen in den exportierten PDF-Dokumenten sind noch nicht vollständig für Screenreader optimiert.</li>
            </ul>
          </p>
          
          <h2>Erstellung dieser Erklärung zur Barrierefreiheit</h2>
          <p>
            Diese Erklärung wurde am {new Date().toLocaleDateString('de-DE')} erstellt.
            Die Einschätzung basiert auf einer Selbstbewertung.
          </p>
          
          <h2>Feedback und Kontaktangaben</h2>
          <p>
            Etwaige Mängel in Bezug auf die Einhaltung der Barrierefreiheitsanforderungen können Sie uns mitteilen. Bitte nutzen Sie hierfür unser Feedback-Widget unten rechts auf der Seite oder kontaktieren Sie uns direkt per E-Mail an barrierefreiheit@pflegenavigator.eu.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
export default Barrierefreiheit;
