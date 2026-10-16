# CLAUDE.md — Project Context for Claude Code

## What this project is
**PULSE** is a marketing landing page for a fictional **product-analytics SaaS** ("product analytics
for modern teams"). It is a **portfolio piece** for Waleed Atiq (front-end developer) to showcase on
Upwork. The goal is to look like a real, high-end SaaS site (think Linear / Vercel / Stripe quality)
with **interactive dashboard demos** — not static screenshots, but mini dashboards that actually
animate and respond.

**Important:** Concept build, not a real product. Footer credits "Designed & developed by Waleed Atiq."

## Why this project matters (positioning)
SaaS landing pages are the **highest-demand front-end category on Upwork**. This piece is the
"practical closer" that pairs with the flashy ECLIPSE 3D watch site. ECLIPSE proves range; PULSE
proves "I can build the thing SaaS clients actually pay for."

## Owner's skill level & how to help (read first)
- The owner is **newer to development** and will present this to clients, so he must **understand,
  explain, and maintain** everything here.
- **Favor clear, readable, well-commented code over clever tricks.** Explain *why* in comments and in
  chat as you build, so he learns it and can defend it in a client call.
- Don't introduce a tool or pattern without a one-line explanation of what it does and why.

## Tech stack (match the ECLIPSE project's conventions)
- **Next.js (App Router) + TypeScript + Tailwind CSS v4.**
- **GSAP ScrollTrigger** for scroll reveals and chart-draw-on-scroll (already familiar from ECLIPSE).
- **Lenis** (optional) for smooth scroll — reuse the ECLIPSE `SmoothScroll.tsx` pattern.
- **Charts: build them in SVG/Canvas by hand** (keeps the bundle light and shows real skill). Only reach
  for a chart library (e.g. Recharts) if a chart gets too complex to hand-build — and explain the tradeoff.
- Keep dependencies minimal. No analytics, no backend, no external calls — all data is local/mock.

## Design direction
- Dark, premium, lots of whitespace, one accent color. A **purple/indigo** accent suits analytics
  (e.g. `--accent: #7c5cff`), but pick what looks best. Define colors as Tailwind theme tokens in
  `app/globals.css` (`@theme`) — reuse tokens, never hardcode hex in components.
- Clean typography, subtle gradients and glows, rounded cards with thin borders (like ECLIPSE panels).
- Mobile-first. Single desktop breakpoint around 861px, same as ECLIPSE.

## Sections to build (in order)
1. **Nav** — fixed, blur background, gains border on scroll. Links + "Start free" CTA + mobile menu.
2. **Hero** — bold headline, subcopy, primary CTA, and an **animated dashboard mockup** on the right
   (charts draw in on load; a live-looking metric ticks up). This is the centerpiece.
3. **Social proof** — a row of fake-but-tasteful company logos (simple SVG wordmarks) + a one-line stat.
4. **Interactive feature tabs** — 3–4 tabs (e.g. "Funnels", "Retention", "Real-time", "Segments").
   Clicking a tab swaps the dashboard preview to a different animated chart. *This is the key interaction.*
5. **Live metrics band** — count-up numbers on scroll (e.g. "2.4B events/day", "140ms query time").
6. **How it works** — 3 simple steps with small animated illustrations.
7. **Integrations** — a grid of integration tiles (SVG icons), maybe a subtle marquee.
8. **Pricing** — 3 tiers with a **monthly/yearly toggle** that updates prices live; highlight the middle tier.
9. **Testimonials** — 2–3 cards (clearly concept content).
10. **Final CTA** — big gradient call-to-action band.
11. **Footer** — columns of links + the Waleed Atiq credit.

## Interaction highlights (the things that make it feel "real")
- Hero dashboard: charts animate their draw on load (SVG `stroke-dashoffset` or GSAP).
- Feature tabs: clicking swaps + re-animates the preview chart.
- Pricing toggle: monthly↔yearly updates numbers with a quick tween.
- Count-up stats on scroll (reuse ECLIPSE's `[data-count]` pattern from `ScrollEffects.tsx`).
- Scroll reveals on every section (reuse the `.reveal` pattern).

## Suggested structure
```
app/            layout.tsx, page.tsx, globals.css (@theme tokens)
components/
  Nav.tsx, Footer.tsx, SmoothScroll.tsx, ScrollEffects.tsx
  sections/     Hero, SocialProof, Features, Metrics, HowItWorks, Integrations, Pricing, Testimonials, CTA
  charts/       LineChart.tsx, BarChart.tsx, DonutChart.tsx  (hand-built SVG, reusable, animated)
lib/
  pricing.ts    tiers + monthly/yearly data
  features.ts   tab content + which chart each shows
  mockData.ts   numbers for the charts
```

## Build order for this session (suggested plan)
1. Scaffold the app: `npx create-next-app@latest . --ts --tailwind --app --eslint` (into THIS folder).
2. Set up design tokens in `globals.css` and a basic page shell + Nav + Footer.
3. Build the reusable SVG chart components in `components/charts/` first (everything else uses them).
4. Build Hero with the animated dashboard.
5. Add the rest of the sections top to bottom.
6. Wire scroll reveals + count-ups.
7. Responsive pass at the 861px breakpoint, then `npm run build` to confirm it's green.

## Guardrails
- Don't claim the product is real; keep testimonials/logos clearly as concept content.
- No analytics/tracking/external network calls. All data is local mock data.
- Keep it fast — this is judged by clients on mobile. Hand-built SVG charts over heavy libraries.
- Explain changes so the owner can defend the code in a client call.
