import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Syne } from "next/font/google";
import { CustomCursor } from "@/components/experience/CustomCursor";
import { Grain } from "@/components/experience/Grain";
import { Providers } from "@/components/experience/Providers";
import { MenuOverlay } from "@/components/nav/MenuOverlay";
import { Navigation } from "@/components/nav/Navigation";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "800"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SOUNDCTUARY — El santuario del sonido",
  description: "Cultura electrónica en Costa Rica. Un santuario para el cuerpo, la frecuencia y la noche.",
  icons: {
    icon: "/images/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#070605",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/crowd.jpg" />
      </head>
      <body style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
        <Providers>
          <Grain />
          <CustomCursor />
          <Navigation />
          <MenuOverlay />
          {children}
        </Providers>
      </body>
    </html>
  );
}
