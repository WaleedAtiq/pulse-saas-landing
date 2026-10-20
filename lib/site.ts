/*
 * Site-wide constants, shared by Server and Client Components.
 *
 * They live in this plain file (no "use client") on purpose: when a Server
 * Component imports something from a "use client" file, it receives a
 * *reference* to it, not the actual value — so a constant like THEME_KEY
 * would arrive broken in layout.tsx.
 */
export const SITE_URL = "https://pulse-saas-landing.vercel.app";
export const SITE_NAME = "PULSE";
export const SITE_TITLE = "PULSE — Product analytics for modern teams (Concept)";
export const SITE_DESCRIPTION =
  "Concept landing page for a fictional product-analytics SaaS — interactive dashboard demos, hand-built animated SVG charts and live pricing. Designed & developed by Waleed Atiq.";

/** localStorage key for the visitor's theme choice ("light" or "dark") */
export const THEME_KEY = "pulse-theme";
