import type { NextConfig } from "next";

/**
 * Baseline security headers.
 *
 * No CSP here: the app uses Next's inline bootstrap and Tailwind's injected
 * styles, so a useful policy needs per-request nonces rather than a static
 * header, and a `unsafe-inline` policy would be theatre. The headers below are
 * the ones that are unambiguously correct without that work.
 */
const securityHeaders = [
  // Payment pages must never be framed — clickjacking on a checkout flow.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here uses these; deny by default rather than inheriting the UA's.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Two years, subdomains included. Vercel terminates TLS, so this is safe;
  // browsers ignore it over plain HTTP, which keeps local dev working.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root — there is an unrelated lockfile above this
    // directory that Turbopack would otherwise try to inherit.
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
