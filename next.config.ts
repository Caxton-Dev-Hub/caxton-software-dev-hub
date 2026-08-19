import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root — there is an unrelated lockfile above this
    // directory that Turbopack would otherwise try to inherit.
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
