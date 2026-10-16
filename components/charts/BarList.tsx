"use client";

import { colorVar, type ChartColor } from "./chartMath";
import { useInView } from "./useInView";
import type { BarDatum } from "./BarChart";
import { formatValue, type NumberFormat } from "@/lib/format";

type Props = {
  data: BarDatum[];
  label: string; // describes the list for screen readers
  color?: ChartColor;
  format?: NumberFormat;
  delay?: number; // ms before the bars start growing
};

/*
 * A "top N" list where each row has a bar behind it showing its size relative
 * to the biggest row — the classic "Top pages" / "Top events" dashboard widget.
 *
 * Plain HTML, not SVG: it's really a list of text rows, and HTML keeps the
 * text crisp and lets the rows size naturally. The bars grow in from the left
 * when scrolled into view (class "chart-hbar" in globals.css).
 */
export default function BarList({ data, label, color = "accent", format = "compact", delay = 0 }: Props) {
  const [ref, inView] = useInView<HTMLUListElement>();
  const max = Math.max(...data.map((d) => d.value));

  return (
    <ul ref={ref} data-drawn={inView} aria-label={label} className="space-y-1.5">
      {data.map((d, i) => (
        <li
          key={d.label}
          className="relative flex items-center justify-between gap-3 overflow-hidden rounded-md px-2.5 py-1.5 text-xs"
        >
          {/* The bar: width = this row's share of the largest row.
              color-mix() makes a see-through version of the token color. */}
          <span
            aria-hidden="true"
            className="chart-hbar absolute inset-y-0 left-0 rounded-md"
            style={{
              width: `${(d.value / max) * 100}%`,
              background: `color-mix(in srgb, ${colorVar(color)} 22%, transparent)`,
              transitionDelay: `${delay + i * 80}ms`,
            }}
          />
          <span className="relative truncate text-muted">{d.label}</span>
          <span className="relative tabular-nums text-ink">{formatValue(d.value, format)}</span>
        </li>
      ))}
    </ul>
  );
}
