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
