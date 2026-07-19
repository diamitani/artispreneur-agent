import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["700", "800", "900"],
});

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Agent by Artispreneur — Hire your AI business team",
    template: "%s · Artispreneur Agent",
  },
  description:
    "Hermes Agent for independent musicians. PAL-compiled Soul, specialist roster, Skills Library — approval-first on AWS. Art Means Business.",
  openGraph: {
    title: "Agent by Artispreneur",
    description: "Hire your AI business team. Approval-first. Art Means Business.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${libre.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-[color:var(--color-bg-page)] text-[color:var(--color-text-primary)]">{children}</body>
    </html>
  );
}
