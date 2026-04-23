import { Card, CardContent } from "@/components/ui/card";

export function Agb() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Allgemeine Geschäftsbedingungen</h1>
      
      <Card>
        <CardContent className="p-8 prose prose-slate max-w-none">
          <h2>1. Geltungsbereich</h2>
          <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform PflegeNavigator EU gUG.</p>
          
          <h2>2. Leistungen und Orientierungshinweis</h2>
          <p>
            Die Plattform bietet digitale Assistenten zur Vorbereitung von Anträgen, Widersprüchen und Dokumentationen im Pflegebereich. 
            <strong>Wichtig: Wir bieten ausdrücklich keine Rechtsberatung oder medizinische Beratung an.</strong> Alle Ergebnisse sind als grobe Orientierung und Ersteinschätzung zu verstehen.
          </p>
          
          <h2>3. Nutzungsrechte und Fallcodes</h2>
          <p>
            Die Nutzung erfolgt anonym über einen automatisch generierten Fallcode. Die Nutzer sind selbst dafür verantwortlich, ihren Fallcode zu notieren, falls sie den Browserverlauf löschen oder das Gerät wechseln.
          </p>
          
          <h2>4. Haftungsausschluss</h2>
          <p>
            Wir übernehmen keine Haftung für die Richtigkeit der Einschätzungen oder den Erfolg von Anträgen und Widersprüchen bei den Behörden oder Pflegekassen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
