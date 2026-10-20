import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, THEME_KEY } from "@/lib/site";
import InlineScript from "@/components/InlineScript";
import "lenis/dist/lenis.css"; // small stylesheet Lenis needs to work correctly
import "./globals.css";

/*
 * next/font downloads these fonts at BUILD time and serves them from our own
 * domain, so visitors never make a request to Google. Each font is exposed as
 * a CSS variable, which globals.css maps to Tailwind's font-sans / font-mono.
 */
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/*
 * Metadata = everything in <head> that search engines and link previews read.
 * metadataBase turns relative paths (like the generated share image) into the
 * full https:// URLs that LinkedIn, Slack, WhatsApp, X etc. require.
 * The share image itself comes from app/opengraph-image.tsx automatically.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Waleed Atiq" }],
  creator: "Waleed Atiq",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${SITE_NAME} (concept)`,
    title: SITE_TITLE,
    description: "Interactive dashboard demos, hand-built animated SVG charts and live pricing — a SaaS landing page concept by Waleed Atiq.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image", // the big image preview, not the small square one
    title: SITE_TITLE,
    description: "Interactive dashboard demos, hand-built animated SVG charts and live pricing — a concept by Waleed Atiq.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070b", // mobile browser bar color; matches --color-bg (ThemeToggle updates it for light)
};

/*
 * Runs in <head> BEFORE the page is painted: if the visitor chose the light
 * theme last time, apply it now. Doing this later (in React) would show the
 * dark theme for a split second first — the "flash" this prevents.
 * (Pattern from the Next.js guide "Preventing flash before hydration".)
 */
const themeScript = `(function(){try{if(localStorage.getItem("${THEME_KEY}")==="light"){document.documentElement.dataset.theme="light";document.addEventListener("DOMContentLoaded",function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#f6f6f9")})}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the script above may change data-theme before
    // React loads; this tells React that difference is expected (it only
    // applies to this one element's attributes, not the page inside it)
    <html lang="en" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body>{children}</body>
    </html>
  );
}
