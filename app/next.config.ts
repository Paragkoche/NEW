// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ignoreDuringBuilds: true,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
