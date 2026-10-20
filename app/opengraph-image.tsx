import { ImageResponse } from "next/og";
import { smoothPath, scaleLinear } from "@/components/charts/chartMath";
import { activeUsers } from "@/lib/mockData";

/*
 * The link-preview image (1200×630) shown when the site is shared on LinkedIn,
 * Upwork, Slack, WhatsApp, X… Next.js renders this JSX to a PNG at BUILD time
 * and adds the <meta property="og:image"> tags automatically.
 *
 * Rules of this renderer ("Satori"): it supports a subset of CSS, every element
 * with several children needs display:flex, and it can't read our CSS
 * variables — so the palette below copies the token values from globals.css.
 * The font is Geist, which ships with next/og (no extra files needed).
 */
export const alt = "PULSE — Understand every user, in real time. A product-analytics SaaS landing page concept by Waleed Atiq.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = { bg: "#07070b", panel: "#111119", line: "rgba(255,255,255,0.08)", ink: "#f2f2f7", muted: "#8e8ea6", accent: "#7756ff", accentHi: "#a593ff", chart2: "#4cc9f0" };

// The same growth curve as the Hero chart, drawn with the site's own smoothPath()
const CHART = { w: 440, h: 230 };
const x = scaleLinear([0, activeUsers.length - 1], [0, CHART.w]);
const y = scaleLinear([10000, 25000], [CHART.h, 10]);
const points = activeUsers.map((v, i) => [x(i), y(v)] as [number, number]);
const line = smoothPath(points);
const area = `${line} L ${CHART.w},${CHART.h} L 0,${CHART.h} Z`;
const last = points[points.length - 1];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: `radial-gradient(circle at 85% 20%, rgba(119,86,255,0.35), transparent 55%), ${C.bg}`,
          color: C.ink,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="48" height="48" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill={C.accent} />
            <path d="M5 17h5l3-7 5 13 3-6h6" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 32, letterSpacing: 6 }}>PULSE</div>
          <div style={{ marginLeft: 12, fontSize: 18, color: C.muted, border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 14px" }}>
            Concept build
          </div>
        </div>

        {/* Headline + chart */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {/* Two explicit lines (each its own div) so the headline breaks exactly where we want */}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 590 }}>
            <div style={{ fontSize: 58, lineHeight: 1.05, letterSpacing: -2 }}>Understand every user,</div>
            <div style={{ fontSize: 58, lineHeight: 1.05, letterSpacing: -2, color: C.accentHi }}>in real time.</div>
            <div style={{ marginTop: 24, fontSize: 24, color: C.muted, lineHeight: 1.4 }}>
              A product-analytics SaaS landing page with live, hand-built dashboard demos.
            </div>
          </div>

          <div style={{ display: "flex", padding: 20, borderRadius: 20, border: `1px solid ${C.line}`, background: C.panel }}>
            <svg width={CHART.w} height={CHART.h} viewBox={`0 0 ${CHART.w} ${CHART.h}`}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#fill)" />
              <path d={line} fill="none" stroke={C.accent} strokeWidth="4" strokeLinecap="round" />
              <circle cx={last[0] - 6} cy={last[1]} r="7" fill={C.accent} stroke={C.ink} strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* Footer line */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: C.muted }}>
          <div style={{ display: "flex" }}>Next.js · TypeScript · Tailwind · GSAP · SVG charts</div>
          <div style={{ display: "flex", color: C.ink }}>Designed &amp; developed by Waleed Atiq</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
