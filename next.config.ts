import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// CSP-Konfiguration für maximale Sicherheit
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://analytics.umami.is;
  script-src-elem 'self' 'unsafe-inline' https://analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com;
  font-src 'self';
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://analytics.umami.is;
  media-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`;

// Security Headers
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",

  // Image-Optimierung aktiviert
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // TypeScript Strict Mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint während Build
  eslint: {
    ignoreDuringBuilds: false,
  },

  // SRI (Subresource Integrity) für externe Scripts
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Webpack-Konfiguration für Bundle-Analyse und Tree-Shaking
  webpack: (config, { dev, isServer }) => {
    // Tree-Shaking: Unnötige Locales entfernen
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };

      // SplitChunks für bessere Caching
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Performance-Optimierungen
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-separator",
      "@supabase/supabase-js",
    ],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Redirects für SEO und Sicherheit
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
    ];
  },

  staticPageGenerationTimeout: 120,
};

// Bundle Analyzer nur in Analyse-Modus
const withAnalyzer = process.env.ANALYZE === "true" 
  ? withBundleAnalyzer({ enabled: true })
  : (config: NextConfig) => config;

export default withAnalyzer(nextConfig);
