// Bugsink / GlitchTip Error Tracking
// EU-konform, self-hosted

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

interface ErrorContext {
  user?: string;
  module?: string;
  caseCode?: string;
  type?: string;
}

export function initErrorTracking() {
  // Wird initialisiert wenn Bugsink/Sentry eingerichtet
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      logError(event.error, { type: "window.error" });
    });

    window.addEventListener("unhandledrejection", (event) => {
      logError(event.reason, { type: "unhandledrejection" });
    });
  }
}

export function logError(error: Error | unknown, context?: ErrorContext) {
  // Lokales Logging (bis Bugsink aktiv)
  console.error("[Error]", error, context);

  // TODO: An Bugsink senden wenn eingerichtet
  // fetch("https://bugsink.pflegenavigatoreu.com/api/error", {
  //   method: "POST",
  //   body: JSON.stringify({ error: error?.toString(), context }),
  // });
}

export function logEvent(event: string, data?: Record<string, unknown>) {
  // Privacy-first Analytics (Umami-kompatibel)
  // Umami wird über Docker gestartet
  if (typeof window !== "undefined") {
    // @ts-ignore - Umami Analytics
    if (window.umami) {
      // @ts-ignore
      window.umami.track(event, data);
    }
  }
}
