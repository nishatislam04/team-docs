import bundleAnalyzer from "@next/bundle-analyzer";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  typedRoutes: true,
  productionBrowserSourceMaps: true, // generate source maps for the js, which might be security issue. but we are ignoring the security issue for now
  // Add security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  cacheComponents: true,
  experimental: {
    authInterrupts: true,
    useCache: true,
    webVitalsAttribution: ["CLS", "LCP", "INP", "FCP", "TTFB"],
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: {
      depthLimit: 20,
      edgeLimit: 150,
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

// Define security headers
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

export default withBundleAnalyzer(nextConfig);
