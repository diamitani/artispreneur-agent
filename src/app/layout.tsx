import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["600", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Agent by Artispreneur — Art Means Business",
  description:
    "Your AI business team for independent artists. PAL onboarding, Master Soul.md, contracts, EPK, directory, Academy, and Cataba — approval-first.",
};

export const viewport: Viewport = {
  themeColor: "#C0272D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
