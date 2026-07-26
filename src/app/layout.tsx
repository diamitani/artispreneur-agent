import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Artispreneur Agent — Your AI Music Business Team",
    template: "%s | Artispreneur Agent",
  },
  description:
    "Plan, create, and grow your music business with AI agents that draft — you approve. EPK, outreach, releases, and more.",
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
