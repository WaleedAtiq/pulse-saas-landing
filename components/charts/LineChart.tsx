"use client";

import { useId, useState } from "react";
import { colorVar, scaleLinear, smoothPath, type ChartColor } from "./chartMath";
import { useInView } from "./useInView";
import { formatValue, type NumberFormat } from "@/lib/format";

export type LineSeries = {
  name: string;
  values: number[];
  color?: ChartColor; // defaults to the accent
};

type Props = {
  series: LineSeries[]; // one or more lines; the FIRST one is the "main" line
  label: string; // describes the chart for screen readers
  labels?: string[]; // x-axis labels shown under the chart (a few is enough)
  height?: number; // in viewBox units; width is always 600, so 200 ≈ a 3:1 chart
  min?: number; // y-axis range; defaults to 0 → a bit above the highest value
  max?: number;
  format?: NumberFormat; // how values show in the hover tooltip
  showGrid?: boolean; // faint horizontal guide lines
  showArea?: boolean; // gradient fill under the main line
  live?: boolean; // pulsing dot on the newest value of the main line
  interactive?: boolean; // hover crosshair + tooltip
  delay?: number; // ms to wait before drawing (to stagger several charts)
};

// Drawing area inside the SVG. Padding keeps strokes and the live dot from
// being clipped at the edges.
const W = 600;
const PAD = { top: 14, right: 10, bottom: 8, left: 4 };

/*
 * A hand-built SVG line chart: smooth curves, optional gradient area, a "live"
 * pulse on the latest point, and a hover tooltip. It draws itself in when it
 * scrolls into view (CSS in globals.css does the actual animation).
 *
 * Tip: to replay the draw-in (e.g. when a tab changes), give it a new `key`.
 * React then treats it as a brand-new chart and it animates again.
 */
export default function LineChart({
  series,
  label,
  labels,
  height = 200,
  min = 0,
  max,
  format = "number",
  showGrid = true,
  showArea = true,
  live = false,
  interactive = true,
  delay = 0,
}: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null); // index under the cursor

  // useId gives this chart instance a unique id, so two charts on the page
  // don't share (and overwrite) each other's gradient. We strip characters that
  // aren't safe inside url(#…).
  const gradientId = `line-grad-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // ── Scales: data values → SVG coordinates ────────────────────────────────
  const count = Math.max(...series.map((s) => s.values.length));
  const highest = Math.max(...series.flatMap((s) => s.values));
  const yMax = max ?? highest * 1.15; // 15% headroom above the highest point
  const x = scaleLinear([0, count - 1], [PAD.left, W - PAD.right]);
  const y = scaleLinear([min, yMax], [height - PAD.bottom, PAD.top]);

  const pointsOf = (values: number[]) => values.map((v, i) => [x(i), y(v)] as [number, number]);
  const main = series[0];
  const mainPoints = pointsOf(main.values);
  const last = mainPoints[mainPoints.length - 1];

  // Area = the main line, then down to the baseline and back to the start
  const baseline = height - PAD.bottom;
  const areaPath = `${smoothPath(mainPoints)} L ${last[0]},${baseline} L ${mainPoints[0][0]},${baseline} Z`;

  // ── Hover: which data point is closest to the cursor? ────────────────────
  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const xInChart = ((e.clientX - box.left) / box.width) * W; // screen px → viewBox units
    const step = (W - PAD.left - PAD.right) / (count - 1);
    const index = Math.round((xInChart - PAD.left) / step);
    setHover(Math.min(count - 1, Math.max(0, index)));
  }

  // Tooltip sits beside the crosshair: on its right in the first half of the
  // chart, on its left in the second half, so it never runs off the edge.
  const tooltipShift = hover !== null && hover > (count - 1) / 2 ? "calc(-100% - 14px)" : "14px";

  return (
    <div ref={ref} data-drawn={inView} className="relative" style={{ "--delay": `${delay}ms` } as React.CSSProperties}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={label}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerLeave={interactive ? () => setHover(null) : undefined}
      >
        <defs>
          {/* Fades from the line color at the top to transparent at the bottom */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorVar(main.color ?? "accent")} stopOpacity="0.32" />
            <stop offset="100%" stopColor={colorVar(main.color ?? "accent")} stopOpacity="0" />
          </linearGradient>
        </defs>

        {showGrid &&
          [0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={0}
              x2={W}
              y1={PAD.top + (baseline - PAD.top) * t}
              y2={PAD.top + (baseline - PAD.top) * t}
              stroke="var(--color-line)"
              strokeDasharray={t === 1 ? undefined : "3 5"} // solid baseline, dashed guides
            />
          ))}

        {showArea && <path d={areaPath} fill={`url(#${gradientId})`} className="chart-fade" style={{ transitionDelay: "calc(var(--delay) + 0.5s)" }} />}

        {/* The lines. pathLength={1} makes the CSS draw-in work for any line length.
            Later series are drawn first so the main line sits on top. */}
        {[...series].reverse().map((s, i) => (
          <path
            key={s.name}
            d={smoothPath(pointsOf(s.values))}
            pathLength={1}
            fill="none"
            stroke={colorVar(s.color ?? "accent")}
            strokeWidth={s === main ? 2.5 : 1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={s === main ? 1 : 0.7}
            className="chart-line"
            style={{ transitionDelay: `calc(var(--delay) + ${(series.length - 1 - i) * 150}ms)` }}
          />
        ))}

        {/* "Live" indicator: a solid dot plus an expanding ring on the newest value */}
        {live && (
          <g className="chart-fade" style={{ transitionDelay: "calc(var(--delay) + 1.2s)" }}>
            <circle cx={last[0]} cy={last[1]} r={5} fill={colorVar(main.color ?? "accent")} className="chart-pulse" />
            <circle cx={last[0]} cy={last[1]} r={4.5} fill={colorVar(main.color ?? "accent")} stroke="var(--color-ink)" strokeWidth={2} />
          </g>
        )}

        {/* Hover crosshair + a dot on each line at the hovered point */}
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={baseline} stroke="var(--color-line-strong)" />
            {series.map((s) => (
              <circle
                key={s.name}
                cx={x(hover)}
                cy={y(s.values[hover])}
                r={4.5}
                fill="var(--color-bg)"
                stroke={colorVar(s.color ?? "accent")}
                strokeWidth={2}
              />
            ))}
          </g>
        )}

        {/* An invisible rectangle covering the chart, so hovering empty space
            (not just the thin lines) still moves the crosshair */}
        {interactive && <rect width={W} height={height} fill="transparent" />}
      </svg>

      {/* Tooltip is HTML (not SVG text) so it stays crisp and readable at any chart size */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 rounded-lg border border-line-strong bg-panel-2/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${tooltipShift})` }}
          aria-hidden="true"
        >
          {labels?.[hover] && <div className="mb-1 text-faint">{labels[hover]}</div>}
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-2 whitespace-nowrap">
              <span className="size-2 rounded-full" style={{ background: colorVar(s.color ?? "accent") }} />
              <span className="text-muted">{s.name}</span>
              <span className="ml-auto pl-3 font-medium tabular-nums text-ink">{formatValue(s.values[hover], format)}</span>
            </div>
          ))}
        </div>
      )}

      {/* X-axis labels, also HTML. We show only first / middle / last to avoid clutter. */}
      {labels && labels.length > 0 && (
        <div className="mt-2 flex justify-between text-[11px] text-faint" aria-hidden="true">
          <span>{labels[0]}</span>
          <span>{labels[Math.floor(labels.length / 2)]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
