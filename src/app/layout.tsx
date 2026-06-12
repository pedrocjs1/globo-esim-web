// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Globiesim | Viajar es más fácil conectado",
    template: "%s | Globiesim",
  },
  description:
    "Comprá tu eSIM en minutos, evitá el roaming y mantenete online desde que aterrizás. Pensado para viajeros latinoamericanos.",
  icons: {
    icon: "/icon-globo-esim.svg",      // pestaña normal
    shortcut: "/icon-globo-esim.svg",  // atajos
    apple: "/icon-globo-esim.svg",     // iOS / macOS
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
