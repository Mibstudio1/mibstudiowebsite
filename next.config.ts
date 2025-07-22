import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;
