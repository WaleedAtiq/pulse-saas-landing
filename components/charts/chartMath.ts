/*
 * Small math helpers shared by every chart. No React here — just functions
 * that turn numbers into SVG coordinates and path strings.
 */

/** The colors a chart may use. Each maps to a token in globals.css. */
export type ChartColor = "accent" | "chart-2" | "chart-3" | "muted";

/** "accent" → "var(--color-accent)", so charts only ever use theme tokens. */
export const colorVar = (c: ChartColor) => `var(--color-${c})`;

/**
 * A "scale" converts a data value into a pixel position.
 * e.g. scaleLinear([0, 100], [200, 0]) maps 0 → 200 (bottom) and 100 → 0 (top).
 * (SVG's y axis points DOWN, which is why charts map high values to small y.)
 */
export function scaleLinear([d0, d1]: [number, number], [r0, r1]: [number, number]) {
  return (value: number) => r0 + ((value - d0) / (d1 - d0 || 1)) * (r1 - r0);
}

type Point = [x: number, y: number];

/**
 * Builds a smooth curved SVG path through the points (a "Catmull-Rom spline").
 * Straight lines between points look jagged; this bends each segment using its
 * neighbours so the curve flows through every point — the look you see on
 * Stripe / Linear dashboards.
 */
export function smoothPath(points: Point[], smoothing = 0.18): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  let d = `M ${first[0]},${first[1]}`;

  rest.forEach((p, i) => {
    const p0 = points[i - 1] ?? points[i]; // point before the segment start
    const p1 = points[i]; // segment start
    const p2 = p; // segment end
    const p3 = points[i + 2] ?? p2; // point after the segment end

    // Two control points that "pull" the curve toward the neighbours' direction
    const c1x = p1[0] + (p2[0] - p0[0]) * smoothing;
    const c1y = p1[1] + (p2[1] - p0[1]) * smoothing;
    const c2x = p2[0] - (p3[0] - p1[0]) * smoothing;
    const c2y = p2[1] - (p3[1] - p1[1]) * smoothing;

    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  });
  return d;
}

/**
 * A rectangle with only its TOP corners rounded (bars should sit flat on the
 * baseline). SVG's <rect rx> rounds all four corners, so we draw a path instead.
 */
export function roundedTopRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h)); // radius can't exceed the bar's size
  return [
    `M ${x},${y + h}`, // bottom-left
    `V ${y + rr}`, // up the left side
    `Q ${x},${y} ${x + rr},${y}`, // top-left curve
    `H ${x + w - rr}`, // across the top
    `Q ${x + w},${y} ${x + w},${y + rr}`, // top-right curve
    `V ${y + h}`, // down the right side
    "Z",
  ].join(" ");
}
