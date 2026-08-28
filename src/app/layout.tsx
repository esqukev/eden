import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/components/experience/Providers";
import { Loader } from "@/components/experience/Loader";
import { Navigation } from "@/components/nav/Navigation";
import "./globals.css";
import "lenis/dist/lenis.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eden.vercel.app"),
  title: "Edén",
  description: "La noche como recinto. Cultura electrónica.",
  openGraph: {
    title: "Edén",
    description: "La noche como recinto. Cultura electrónica.",
    type: "website",
    locale: "es_CR",
    siteName: "Edén",
    images: [{ url: "/images/crowd.jpg", width: 1600, height: 1067, alt: "Edén" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edén",
    description: "La noche como recinto. Cultura electrónica.",
    images: ["/images/crowd.jpg"],
  },
  icons: {
    icon: [
      { url: "/images/eden-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#080704",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={mono.variable}>
      <body>
        <Providers>
          <Loader />
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
