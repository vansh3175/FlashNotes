import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  webpack: (config) => {
    config.externals.push("prisma/client", ".prisma/client");
    return config;
  },
};

export default nextConfig;
