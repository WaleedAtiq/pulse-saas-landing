import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css"; // small stylesheet Lenis needs to work correctly
import "./globals.css";

/*
 * next/font downloads these fonts at BUILD time and serves them from our own
 * domain, so visitors never make a request to Google. Each font is exposed as
 * a CSS variable, which globals.css maps to Tailwind's font-sans / font-mono.
 */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PULSE — Product analytics for modern teams (Concept)",
  description:
    "Concept landing page for a fictional product-analytics SaaS — interactive dashboard demos, hand-built animated SVG charts and live pricing. Designed & developed by Waleed Atiq.",
};

export const viewport: Viewport = {
  themeColor: "#07070b", // browser UI color on mobile; matches --color-bg
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
