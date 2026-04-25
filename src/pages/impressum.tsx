import { Card, CardContent } from "@/components/ui/card";

export function Impressum() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Impressum</h1>
      
      <Card>
        <CardContent className="p-8 prose prose-slate max-w-none">
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            PflegeNavigator EU gUG (haftungsbeschränkt)<br />
            Musterstraße 1<br />
            10115 Berlin
          </p>
          
          <h2>Vertreten durch</h2>
          <p>Geschäftsführung: Max Mustermann</p>
          
          <h2>Kontakt</h2>
          <p>
            Telefon: +49 (0) 30 12345678<br />
            E-Mail: kontakt@pflegenavigator.eu
          </p>
          
          <h2>Registereintrag</h2>
          <p>
            Eintragung im Handelsregister.<br />
            Registergericht: Amtsgericht Charlottenburg (Berlin)<br />
            Registernummer: HRB 123456 B
          </p>
          
          <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
          
          <h2>Orientierungshinweis</h2>
          <p>
            Alle auf dieser Website bereitgestellten Informationen dienen ausschließlich der allgemeinen Orientierung. Sie stellen keine Rechtsberatung, medizinische Diagnose oder rechtlich bindende Auskunft dar. Im Einzelfall empfehlen wir die Konsultation von Fachanwälten, Pflegeberatern oder ärztlichem Fachpersonal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
export default Impressum;
