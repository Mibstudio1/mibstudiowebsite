import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/client/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/client",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
