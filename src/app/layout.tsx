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
  title: "Agent by Artispreneur",
  description:
    "The AI business team for independent artists. PAL-compiled onboarding, specialist agents, approval-first workflows.",
};

export const viewport: Viewport = {
  themeColor: "#f9f6ef",
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
