import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  typedRoutes: true,
  productionBrowserSourceMaps: true, // generate source maps for the js, which might be security issue. but we are ignoring the security issue for now
  // Add security headers
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  cacheComponents: true,
  logging: {
    // Forward browser logs to the terminal for easier debugging
    browserToTerminal: true,
  },
  experimental: {
    authInterrupts: true,
    webVitalsAttribution: ["CLS", "LCP", "INP", "FCP", "TTFB"],
  },
};

// Define security headers
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
];

export default withBundleAnalyzer(nextConfig);
