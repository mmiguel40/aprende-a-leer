import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GameProvider } from "../context/GameContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aventura de Letras",
  description: "Aprende a leer jugando - Juego Educativo Interactivo",
  manifest: "/manifest.json",
  themeColor: "#38bdf8",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${nunito.variable} antialiased h-[100dvh] w-screen overflow-hidden bg-gradient-to-br from-pastel-blue to-pastel-purple/50`}
      >
        <GameProvider>
          {children}
        </GameProvider>
        {/* Registro del Service Worker para cache offline de audios */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(console.error);
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
