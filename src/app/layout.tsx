// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Globo eSIM | Viajar es más fácil conectado",
    template: "%s | Globo eSIM",
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
