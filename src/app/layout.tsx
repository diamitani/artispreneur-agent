import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
    default: "Agent by Artispreneur — Run the business like you mean it",
    template: "%s · Artispreneur Agent",
  },
  description:
    "For independent artists, managers, agencies, and labels. EPKs, outreach, deals, releases — drafted by your Agent, approved by you. Art Means Business.",
  openGraph: {
    title: "Agent by Artispreneur",
    description:
      "Run the business side of music. Drafts wait for your approval. Art Means Business.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${libre.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
