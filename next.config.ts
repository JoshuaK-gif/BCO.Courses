import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["next/link", "next/image"],
  },
  async redirects() {
    return [
      { source: "/course/:slug", destination: "/courses/:slug", permanent: true },
      { source: "/category/:slug", destination: "/courses/category/:slug", permanent: true },
      { source: "/contact", destination: "/opportunities", permanent: true },
    ];
  },
};

export default nextConfig;
