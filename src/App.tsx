import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import { Home } from "@/pages/home";
import { PflegegradStart } from "@/pages/pflegegrad/start";
import { PflegegradModul1 } from "@/pages/pflegegrad/modul1";
import { PflegegradModul2 } from "@/pages/pflegegrad/modul2";
import { PflegegradModul3 } from "@/pages/pflegegrad/modul3";
import { PflegegradModul4 } from "@/pages/pflegegrad/modul4";
import { PflegegradModul5 } from "@/pages/pflegegrad/modul5";
import { PflegegradModul6 } from "@/pages/pflegegrad/modul6";
import { PflegegradErgebnis } from "@/pages/pflegegrad/ergebnis";

import { WiderspruchStart } from "@/pages/widerspruch/start";
import { WiderspruchAnalyse } from "@/pages/widerspruch/analyse";
import { WiderspruchFristen } from "@/pages/widerspruch/fristen";
import { WiderspruchPdf } from "@/pages/widerspruch/pdf";

import { GdbStart } from "@/pages/gdb/start";
import { GdbDiagnosen } from "@/pages/gdb/diagnosen";
import { GdbErgebnis } from "@/pages/gdb/ergebnis";

import { EmrStart } from "@/pages/emr/start";
import { EmrArbeit } from "@/pages/emr/arbeit";
import { EmrErgebnis } from "@/pages/emr/ergebnis";

import { Sgb14Start } from "@/pages/sgb14/start";
import { Sgb14Tat } from "@/pages/sgb14/tat";
import { Sgb14Ergebnis } from "@/pages/sgb14/ergebnis";

import { TagebuchNeu } from "@/pages/tagebuch/neu";
import { TagebuchUebersicht } from "@/pages/tagebuch/uebersicht";
import { TagebuchExport } from "@/pages/tagebuch/export";

import { AdminFeedback } from "@/pages/admin/feedback";

import { Barrierefreiheit } from "@/pages/barrierefreiheit";
import { Impressum } from "@/pages/impressum";
import { Datenschutz } from "@/pages/datenschutz";
import { Agb } from "@/pages/agb";
import { Widerruf } from "@/pages/widerruf";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Pflegegrad */}
        <Route path="/pflegegrad/start" component={PflegegradStart} />
        <Route path="/pflegegrad/modul1" component={PflegegradModul1} />
        <Route path="/pflegegrad/modul2" component={PflegegradModul2} />
        <Route path="/pflegegrad/modul3" component={PflegegradModul3} />
        <Route path="/pflegegrad/modul4" component={PflegegradModul4} />
        <Route path="/pflegegrad/modul5" component={PflegegradModul5} />
        <Route path="/pflegegrad/modul6" component={PflegegradModul6} />
        <Route path="/pflegegrad/ergebnis" component={PflegegradErgebnis} />

        {/* Widerspruch */}
        <Route path="/widerspruch/start" component={WiderspruchStart} />
        <Route path="/widerspruch/analyse" component={WiderspruchAnalyse} />
        <Route path="/widerspruch/fristen" component={WiderspruchFristen} />
        <Route path="/widerspruch/pdf" component={WiderspruchPdf} />

        {/* GdB */}
        <Route path="/gdb/start" component={GdbStart} />
        <Route path="/gdb/diagnosen" component={GdbDiagnosen} />
        <Route path="/gdb/ergebnis" component={GdbErgebnis} />

        {/* EM-Rente */}
        <Route path="/emr/start" component={EmrStart} />
        <Route path="/emr/arbeit" component={EmrArbeit} />
        <Route path="/emr/ergebnis" component={EmrErgebnis} />

        {/* SGB XIV */}
        <Route path="/sgb14/start" component={Sgb14Start} />
        <Route path="/sgb14/tat" component={Sgb14Tat} />
        <Route path="/sgb14/ergebnis" component={Sgb14Ergebnis} />

        {/* Tagebuch */}
        <Route path="/tagebuch/neu" component={TagebuchNeu} />
        <Route path="/tagebuch/uebersicht" component={TagebuchUebersicht} />
        <Route path="/tagebuch/export" component={TagebuchExport} />

        {/* Admin */}
        <Route path="/admin/feedback" component={AdminFeedback} />

        {/* Legal */}
        <Route path="/barrierefreiheit" component={Barrierefreiheit} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/agb" component={Agb} />
        <Route path="/widerruf" component={Widerruf} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
