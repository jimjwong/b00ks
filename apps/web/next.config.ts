import type { NextConfig } from "next";

// 'unsafe-inline' on script-src is a temporary baseline until nonce-based CSP
// is wired through Next.js middleware (tracked in TASKS.md, Phase 10).
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co https://*.r2.cloudflarestorage.com",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@b00ks/api",
    "@b00ks/auth",
    "@b00ks/database",
    "@b00ks/design-tokens",
    "@b00ks/shared",
    "@b00ks/types",
    "@b00ks/validation",
  ],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
