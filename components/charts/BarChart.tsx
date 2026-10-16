"use client";

import { useState } from "react";
import { colorVar, roundedTopRect, scaleLinear, type ChartColor } from "./chartMath";
import { useInView } from "./useInView";
import { formatValue, type NumberFormat } from "@/lib/format";

export type BarDatum = { label: string; value: number };

type Props = {
  data: BarDatum[];
  label: string; // describes the chart for screen readers
  color?: ChartColor;
  height?: number; // viewBox units; width is always 600
  highlight?: number; // index of a bar to emphasise when nothing is hovered (e.g. "today")
  format?: NumberFormat; // how the hovered value is shown
  showLabels?: boolean; // x-axis labels under the bars
  labelEvery?: number; // show every Nth label (2 = every other) when space is tight
  delay?: number; // ms before the bars start growing
};

const W = 600;
const GAP = 0.32; // space between bars, as a fraction of each bar's slot

/*
 * A hand-built SVG bar chart. Bars grow up from the baseline one after another
 * when the chart scrolls into view. Hovering a bar highlights it and shows its
 * value; the other bars dim so the eye goes straight to it.
 *
 * Like LineChart, change its `key` to replay the animation.
 */
export default function BarChart({
  data,
  label,
  color = "accent",
  height = 200,
  highlight,
  format = "number",
  showLabels = true,
  labelEvery = 1,
  delay = 0,
}: Props) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? highlight; // which bar is emphasised right now (if any)

  const max = Math.max(...data.map((d) => d.value)) * 1.1; // 10% headroom
  const y = scaleLinear([0, max], [height, 0]);
  const slot = W / data.length; // horizontal space each bar gets
  const barWidth = slot * (1 - GAP);

  return (
    <div ref={ref} data-drawn={inView} className="relative">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={label}
        onPointerLeave={() => setHover(null)}
      >
        {data.map((d, i) => {
          const barX = i * slot + (slot - barWidth) / 2;
          const barY = y(d.value);
          // Dim every bar except the active one (when there is an active one)
          const opacity = active === undefined || active === null || active === i ? 1 : 0.35;
          return (
            // Each bar is a <g> covering its whole column, so hovering the empty
            // space above a short bar still selects it.
            <g key={d.label} onPointerEnter={() => setHover(i)}>
              <rect x={i * slot} y={0} width={slot} height={height} fill="transparent" />
              <path
                d={roundedTopRect(barX, barY, barWidth, height - barY, 6)}
                fill={colorVar(color)}
                opacity={opacity}
                className="chart-bar"
                style={{
                  // Grow-in is staggered per bar; the hover dim is instant and quick
                  transitionProperty: "transform, opacity",
                  transitionDuration: "0.9s, 0.25s",
                  transitionDelay: `${delay + i * 60}ms, 0ms`,
                }}
              />
            </g>
          );
        })}
        {/* Baseline */}
        <line x1={0} x2={W} y1={height} y2={height} stroke="var(--color-line-strong)" />
      </svg>

      {/* Value bubble above the hovered bar (HTML so text stays crisp at any size) */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-line-strong bg-panel-2 px-2 py-1 text-xs font-medium tabular-nums text-ink shadow-lg"
          style={{ left: `${((hover + 0.5) * slot * 100) / W}%`, top: `calc(${(y(data[hover].value) / height) * 100}% - 6px)` }}
          aria-hidden="true"
        >
          {formatValue(data[hover].value, format)}
        </div>
      )}

      {showLabels && (
        <div className="mt-2 flex text-[11px] text-faint" aria-hidden="true">
          {/* Skipped labels still render as empty spans, so the visible ones
              stay lined up under their bars */}
          {data.map((d, i) => (
            <span key={d.label} className={`flex-1 text-center ${active === i ? "text-muted" : ""}`}>
              {i % labelEvery === 0 ? d.label : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
