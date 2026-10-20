"use client";

import { useState } from "react";
import DashboardFrame from "./DashboardFrame";
import StatTile from "./StatTile";
import LiveNumber from "./LiveNumber";
import LiveDot from "./LiveDot";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import BarList from "@/components/charts/BarList";
import { formatValue } from "@/lib/format";
import { HERO_RANGES, eventsByHour, topEvents, type HeroRange } from "@/lib/mockData";

const RANGE_OPTIONS: { id: HeroRange; label: string; long: string }[] = [
  { id: "7d", label: "7D", long: "7 days" },
  { id: "30d", label: "30D", long: "30 days" },
  { id: "90d", label: "90D", long: "90 days" },
];

const average = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

// Sidebar icons (simple 24×24 line drawings). The first one is "active".
const NAV_ICONS = [
  { label: "Overview", d: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { label: "Insights", d: "M5 20V11M12 20V4M19 20v-6" },
  { label: "Funnels", d: "M3 4h18l-7 8v6l-4 2v-8z" },
  { label: "People", d: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 20v-1a4 4 0 0 0-3-3.9" },
  { label: "Settings", d: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4" },
];

/*
 * The fake analytics app shown in the Hero.
 *
 * It's a Client Component because of the 7D / 30D / 90D switcher: the chosen
 * range is state, and changing it updates the KPIs and redraws the main chart.
 * The headline number and its change are CALCULATED from the chart data (not
 * typed in), so they can never disagree with what the chart shows.
 *
 * Mobile shows the KPI row + main chart; the sidebar and bottom row appear
 * from 861px up, where there's room for them.
 */
export default function HeroDashboard() {
  const [range, setRange] = useState<HeroRange>("30d");
  const [switched, setSwitched] = useState(false); // after a click, redraw without the on-load delay
  const data = HERO_RANGES[range];
  const rangeName = RANGE_OPTIONS.find((r) => r.id === range)!.long;

  const avgNow = average(data.current);
  const change = (avgNow / average(data.previous) - 1) * 100;

  return (
    <DashboardFrame path="app.pulse.dev/acme/overview">
      <div className="flex">
        {/* Icon sidebar (desktop only) */}
        <nav className="hidden flex-col items-center gap-2 border-r border-line px-2.5 py-4 desktop:flex" aria-hidden="true">
          {NAV_ICONS.map((icon, i) => (
            <span
              key={icon.label}
              className={`grid size-8 place-items-center rounded-lg ${i === 0 ? "bg-accent/15 text-accent-hi" : "text-faint"}`}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon.d} />
              </svg>
            </span>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-3 p-3 desktop:p-4">
          {/* Page header with the date-range switcher */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="text-sm font-medium">Overview</div>
            <div role="group" aria-label="Date range" className="flex rounded-md border border-line p-0.5">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={range === option.id}
                  // The spoken name must START with the visible text ("7D"), so people using
                  // voice control can say "click 7D" — WCAG's "label in name" rule
                  aria-label={`${option.label}, last ${option.long}`}
                  onClick={() => {
                    setRange(option.id);
                    setSwitched(true);
                  }}
                  className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                    range === option.id ? "bg-panel-2 text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI row — the first tile ticks live. Two tiles on mobile (three
              don't fit legibly on a phone), the third joins from 861px up. */}
          <div className="grid grid-cols-2 gap-2 desktop:grid-cols-3 desktop:gap-3">
            <StatTile label={<LiveDot label="Online now" />} value={<LiveNumber value={1284} />} delta="+12% vs. avg" />
            <StatTile label="Conversion" value={data.conversion} delta={data.conversionDelta} />
            <StatTile
              label="Avg. session"
              value={data.session}
              delta={data.sessionDelta}
              trend={data.sessionTrend}
              className="hidden desktop:block"
            />
          </div>

          {/* Main chart */}
          <div className="panel p-3 desktop:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] text-muted">Avg. daily active users · {rangeName}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tracking-tight tabular-nums">{formatValue(avgNow, "compact")}</span>
                  <span className={`text-[11px] font-medium ${change >= 0 ? "text-up" : "text-down"}`}>
                    {change >= 0 ? "+" : "−"}
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* Legend */}
              <div className="hidden gap-3 text-[11px] text-muted desktop:flex">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-accent" /> This period
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted" /> Previous
                </span>
              </div>
            </div>
            {/* key={range}: a new range mounts a fresh chart, so it draws in again */}
            <LineChart
              key={range}
              label={`Daily active users over the last ${rangeName}, averaging ${formatValue(avgNow, "compact")}`}
              series={[
                { name: "This period", values: data.current },
                { name: "Previous", values: data.previous, color: "muted" },
              ]}
              labels={data.labels}
              height={210}
              live
              delay={switched ? 0 : 500}
            />
          </div>

          {/* Bottom row (desktop only) */}
          <div className="hidden grid-cols-2 gap-3 desktop:grid">
            <div className="panel p-4">
              <div className="mb-3 text-[11px] text-muted">Events today</div>
              <BarChart label="Events per two-hour block today" data={eventsByHour} format="compact" highlight={7} height={260} labelEvery={2} delay={800} />
            </div>
            <div className="panel p-4">
              <div className="mb-2 text-[11px] text-muted">Top events</div>
              <BarList label="Most-tracked events this week" data={topEvents} delay={900} />
            </div>
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
}
