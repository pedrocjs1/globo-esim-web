import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.airalo.com', // Banderas e imágenes de países
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sandbox.airalo.com', // 👈 IMPORTANTE: QRs del Sandbox
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.airalo.com', // QRs de Producción (para el futuro)
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;