import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Shield, Users, ArrowRight, Phone } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              <span className="font-bold text-xl text-slate-900">PflegeNavigator</span>
            </div>
            <div className="hidden md:flex gap-6">
              <a href="#leistungen" className="text-slate-600 hover:text-slate-900">Leistungen</a>
              <a href="#ablauf" className="text-slate-600 hover:text-slate-900">So funktioniert's</a>
              <a href="#preise" className="text-slate-600 hover:text-slate-900">Preise</a>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Bewertung starten
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Beta-Phase: Jetzt 29€ statt 99€
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Ihre Pflegeleistungen in
            <span className="text-emerald-600"> 15 Minuten</span>
            <br />von zu Hause prüfen
          </h1>
          
          <p className="text-xl text-slate-600 mb-4 max-w-3xl mx-auto">
            Pflegestützpunkt: 2–6 Wochen Wartezeit
          </p>
          <p className="text-xl text-emerald-600 font-semibold mb-8">
            PflegeNavigator: Sofort – unkompliziert – digital
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
              Kostenlose Ersteinschätzung
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Phone className="mr-2 w-5 h-5" />
              Rückruf vereinbaren
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>SSL-verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>4,9 Mio. Pflegebedürftige in DE</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="ablauf" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            So funktioniert's
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            In nur 3 Schritten zu Ihrer persönlichen Pflegebewertung
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Fragebogen ausfüllen",
                description: "Beantworten Sie 10 einfache Fragen zu Ihrer Pflegesituation – dauert nur 15 Minuten.",
                icon: Clock
              },
              {
                step: "2",
                title: "KI-Analyse",
                description: "Unser System prüft Ihre Antworten gegen alle relevanten SGB-Vorschriften.",
                icon: Shield
              },
              {
                step: "3",
                title: "Ergebnis erhalten",
                description: "Sie erhalten sofort ein erstes Einschätzungsergebnis mit nächsten Schritten.",
                icon: CheckCircle
              }
            ].map((item) => (
              <Card key={item.step} className="border-2 border-slate-100 hover:border-emerald-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SGB Coverage */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Wir prüfen alle relevanten Gesetze
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Umfassende Abdeckung des deutschen Sozialrechts
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["SGB V", "SGB VI", "SGB IX", "SGB XI", "SGB XIV"].map((sgb) => (
              <div key={sgb} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <span className="font-bold text-emerald-600">{sgb}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preise" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Transparente Preise
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-slate-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Beta-Special</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-slate-900">29€</span>
                  <span className="text-slate-500 line-through">99€</span>
                  <span className="text-slate-600">einmalig</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Vollständige Pflegebewertung",
                    "10 Modul-Fragebogen",
                    "Erstes Einschätzungsergebnis",
                    "PDF-Zusammenfassung",
                    "30 Tage Nachbetreuung"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Jetzt sichern
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-slate-900">Standard-Abo</h3>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">Empfohlen</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-slate-900">39€</span>
                  <span className="text-slate-600">/Monat</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Alles aus dem Beta-Special",
                    "Unbegrenzte Neubewertungen",
                    "Jährliche Pflegegrade-Updates",
                    "Priorisierter Support",
                    "Exklusive SGB-Änderungen-Updates"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Abo starten
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧭</span>
                <span className="font-bold text-xl text-white">PflegeNavigator</span>
              </div>
              <p className="text-sm">
                EU gUG<br />
                Pflegeleistungen einfach prüfen
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontakt</h4>
              <p className="text-sm">info@pflegenavigatoreu.com</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Impressum</a></li>
                <li><a href="#" className="hover:text-white">Datenschutz</a></li>
                <li><a href="#" className="hover:text-white">AGB</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hinweis</h4>
              <p className="text-xs">
                Wir bieten keine Rechtsberatung. Alle Angaben ohne Gewähr. 
                Verbindliche Entscheidungen treffen die zuständigen Stellen.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            © 2026 PflegeNavigator EU gUG. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </main>
  );
}
