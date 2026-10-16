"use client";

import { useState } from "react";
import { colorVar, type ChartColor } from "./chartMath";
import { useInView } from "./useInView";

export type DonutSegment = { label: string; value: number; color: ChartColor };

type Props = {
  segments: DonutSegment[];
  label: string; // describes the chart for screen readers
  size?: number; // diameter in CSS pixels
  thickness?: number; // ring thickness, in viewBox units (the ring is 120 wide)
  centerValue?: string; // big text in the middle when nothing is hovered, e.g. "48.2K"
  centerLabel?: string; // small text under it, e.g. "sessions"
  legend?: boolean; // list of segments beside the ring
  delay?: number;
};

const VIEW = 120; // the SVG is a 120×120 square
const GAP = 1.2; // gap between segments, in percent of the ring

/*
 * A hand-built SVG donut chart.
 *
 * How it works: each segment is a full <circle> drawn only as a dash.
 * With pathLength="100", a dash of length 25 covers exactly 25% of the ring.
 * We then rotate each circle so its dash starts where the previous one ended.
 * The draw-in hides each dash with stroke-dashoffset and animates it to 0
 * (CSS in globals.css, class "chart-arc").
 *
 * Hovering a segment or legend row focuses it and shows its share in the center.
 */
export default function DonutChart({
  segments,
  label,
  size = 168,
  thickness = 14,
  centerValue,
  centerLabel,
  legend = true,
  delay = 0,
}: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = (VIEW - thickness) / 2; // radius to the middle of the ring
  const center = VIEW / 2;

  // Work out each segment's share, and where it starts (= the sum of all the
  // segments before it). Written without a running counter on purpose: render
  // code must be "pure" (no reassigning variables), which the React Compiler
  // relies on — the linter enforces it.
  const percents = segments.map((s) => (s.value / total) * 100);
  const arcs = segments.map((s, i) => ({
    ...s,
    percent: percents[i],
    startPercent: percents.slice(0, i).reduce((sum, p) => sum + p, 0),
    dash: Math.max(percents[i] - GAP, 0.5),
  }));

  const focused = active !== null ? arcs[active] : null;

  return (
    <div ref={ref} data-drawn={inView} className="flex flex-wrap items-center gap-x-8 gap-y-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="size-full" role="img" aria-label={label}>
          {/* Faint full ring behind the segments */}
          <circle cx={center} cy={center} r={r} fill="none" stroke="var(--color-line)" strokeWidth={thickness} />

          {arcs.map((a, i) => (
            <circle
              key={a.label}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={colorVar(a.color)}
              strokeWidth={active === i ? thickness + 3 : thickness}
              pathLength={100}
              // Dash = this segment; the gap of 100 hides the rest of the circle
              strokeDasharray={`${a.dash} 100`}
              // Circles start drawing at 3 o'clock, so -90° moves the start to 12 o'clock,
              // then each segment is turned to begin where the previous one ended.
              transform={`rotate(${-90 + a.startPercent * 3.6} ${center} ${center})`}
              opacity={active === null || active === i ? 1 : 0.3}
              className="chart-arc cursor-pointer"
              style={
                {
                  "--arc-length": a.dash, // hidden offset before the draw-in
                  // Draw-in is slow and staggered; hover effects are instant and quick
                  transitionProperty: "stroke-dashoffset, opacity, stroke-width",
                  transitionDuration: "1.2s, 0.25s, 0.25s",
                  transitionDelay: `${delay + i * 180}ms, 0ms, 0ms`,
                } as React.CSSProperties
              }
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
            />
          ))}
        </svg>

        {/* Center text: the hovered segment's share, or the overall total */}
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <div className="text-2xl font-semibold tabular-nums tracking-tight">
            {focused ? `${focused.percent.toFixed(0)}%` : centerValue}
          </div>
          <div className="text-[11px] text-muted">{focused ? focused.label : centerLabel}</div>
        </div>
      </div>

      {legend && (
        <ul className="min-w-[140px] flex-1 space-y-2.5 text-sm">
          {arcs.map((a, i) => (
            <li
              key={a.label}
              className={`flex cursor-default items-center gap-2.5 transition-opacity ${
                active === null || active === i ? "opacity-100" : "opacity-40"
              }`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
            >
              <span className="size-2.5 rounded-full" style={{ background: colorVar(a.color) }} />
              <span className="text-muted">{a.label}</span>
              <span className="ml-auto tabular-nums text-ink">{a.percent.toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
