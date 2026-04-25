import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import "@/index.css";

const queryClient = new QueryClient();

interface AppWithRouterProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function AppWithRouter({ Component, pageProps }: AppWithRouterProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
