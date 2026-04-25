import { Card, CardContent } from "@/components/ui/card";

export function Datenschutz() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Datenschutzerklärung</h1>
      
      <Card>
        <CardContent className="p-8 prose prose-slate max-w-none">
          <h2>1. Datenschutz auf einen Blick</h2>
          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
          
          <h3>Datenerfassung auf dieser Website</h3>
          <p>
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>
          
          <p>
            <strong>Wie erfassen wir Ihre Daten?</strong><br />
            Wir verwenden ein Fallcode-System (PF-XXXX-XXXX). Dadurch werden Ihre Gesundheits- und Pflegedaten pseudonymisiert gespeichert. Ohne den Fallcode können wir keine Zuordnung zu Ihrer Person vornehmen.
          </p>

          <h2>2. Hosting und Content Delivery Networks (CDN)</h2>
          <p>Diese Website wird bei einem externen Dienstleister gehostet.</p>

          <h2>3. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
          </p>
          
          <div className="bg-muted p-4 rounded-md mt-6">
            <p className="text-sm font-medium mb-0">
              Hinweis: Bitte bewahren Sie Ihren Fallcode sicher auf. Da wir keine Klarnamen oder E-Mail-Adressen mit den Pflegedaten verknüpfen, können wir Ihren Zugang ohne den Fallcode nicht wiederherstellen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default Datenschutz;
