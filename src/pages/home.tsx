import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, ArrowRight, HeartHandshake } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ihre Orientierung im deutschen Pflegesystem
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/80">
            Wir begleiten Sie Schritt für Schritt durch Anträge, Widersprüche und den Pflegealltag. Verständlich, sicher und in Ihrem Tempo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link href="/pflegegrad/start">
                Pflegegrad einschätzen <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/widerspruch/start">Widerspruch einlegen</Link>
            </Button>
          </div>
          <div className="mt-8">
            <Button asChild variant="link" className="text-primary-foreground/80 hover:text-white">
              <Link href="/gdb/start">Ich weiß nicht, wo ich anfangen soll</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Wie wir Ihnen helfen können</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unsere digitalen Assistenten führen Sie durch die komplexesten Prozesse – ohne juristisches Fachchinesisch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Pflegegrad-Rechner</CardTitle>
                <CardDescription>
                  Bereiten Sie sich optimal auf den Gutachterbesuch vor. Wir fragen genau das, worauf es ankommt.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between group">
                  <Link href="/pflegegrad/start">
                    Jetzt starten <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Widerspruchs-Assistent</CardTitle>
                <CardDescription>
                  Pflegegrad abgelehnt oder zu niedrig? Wir prüfen Ihre Möglichkeiten und Fristen für einen Widerspruch.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between group">
                  <Link href="/widerspruch/start">
                    Chancen prüfen <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Pflegetagebuch</CardTitle>
                <CardDescription>
                  Dokumentieren Sie den Pflegeaufwand rechtssicher und übersichtlich für Kassen und Gutachter.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between group">
                  <Link href="/tagebuch/uebersicht">
                    Tagebuch führen <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ein sicherer Ort für Ihre Anliegen</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Wir speichern Ihre Daten anonymisiert über Fallcodes. Keine Klarnamen, keine unnötige Datensammelei. Wir finanzieren uns transparent und unabhängig.
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            Orientierungshinweis: Dieses Angebot ersetzt keine rechtliche Beratung im Einzelfall.
          </p>
        </div>
      </section>
    </div>
  );
}
export default Home;
