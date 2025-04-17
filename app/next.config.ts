// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ignoreDuringBuilds: true,
  images: {
    domains: ["localhost", "marketing.sosep.in"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "marketing.sosep.in",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
