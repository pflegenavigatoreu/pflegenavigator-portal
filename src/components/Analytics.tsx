"use client";

import Script from "next/script";

// Umami Analytics - Self-Hosted, GDPR-konform, KOSTENLOS
export function UmamiAnalytics() {
  // Umami läuft auf Subdomain oder Port 8001
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL || "http://localhost:8001";
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "";

  if (!websiteId) {
    return null; // Noch nicht konfiguriert
  }

  return (
    <Script
      defer
      src={`${umamiUrl}/script.js`}
      data-website-id={websiteId}
      strategy="lazyOnload"
    />
  );
}

// Backup: Lokales Tracking (wenn Umami noch nicht läuft)
export function logEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    // Lokales Logging für Entwicklung
    console.log("[Analytics]", event, data);

    // Wenn Umami verfügbar
    if ((window as any).umami) {
      (window as any).umami.track(event, data);
    }
  }
}
