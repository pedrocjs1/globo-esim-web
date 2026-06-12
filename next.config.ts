import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.airalo.com', // Cubre cdn.airalo.com, cdn-revamp.airalo.com, www.airalo.com, sandbox.airalo.com, etc.
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;