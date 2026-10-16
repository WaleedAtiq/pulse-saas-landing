import DashboardFrame from "./DashboardFrame";
import StatTile from "./StatTile";
import LiveNumber from "./LiveNumber";
import LiveDot from "./LiveDot";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import BarList from "@/components/charts/BarList";
import { activeUsers, activeUsersPrevious, eventsByHour, last30Days, topEvents } from "@/lib/mockData";

// Sidebar icons (simple 24×24 line drawings). The first one is "active".
const NAV_ICONS = [
  { label: "Overview", d: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { label: "Insights", d: "M5 20V11M12 20V4M19 20v-6" },
  { label: "Funnels", d: "M3 4h18l-7 8v6l-4 2v-8z" },
  { label: "People", d: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 20v-1a4 4 0 0 0-3-3.9" },
  { label: "Settings", d: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4" },
];

/*
 * The fake analytics app shown in the Hero. A Server Component: it only lays
 * things out. The parts that move (charts, LiveNumber) are Client Components
 * nested inside, so only they ship JavaScript to the browser.
 *
 * Mobile shows the KPI row + main chart; the sidebar and bottom row appear
 * from 861px up, where there's room for them.
 */
export default function HeroDashboard() {
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
          {/* Page header */}
          <div className="flex items-center justify-between px-1">
            <div className="text-sm font-medium">Overview</div>
            <div className="rounded-md border border-line px-2 py-1 text-[11px] text-muted">Last 30 days</div>
          </div>

          {/* KPI row — the first tile ticks live. Two tiles on mobile (three
              don't fit legibly on a phone), the third joins from 861px up. */}
          <div className="grid grid-cols-2 gap-2 desktop:grid-cols-3 desktop:gap-3">
            <StatTile label={<LiveDot label="Online now" />} value={<LiveNumber value={1284} />} delta="+12% vs. avg" />
            <StatTile label="Conversion" value="4.8%" delta="+0.6pt" />
            <StatTile label="Avg. session" value="6m 12s" delta="−3%" trend="down" className="hidden desktop:block" />
          </div>

          {/* Main chart */}
          <div className="panel p-3 desktop:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] text-muted">Active users</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold tracking-tight tabular-nums">24.1K</span>
                  <span className="text-[11px] font-medium text-up">+40.9%</span>
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
            <LineChart
              label="Daily active users over the last 30 days, rising from 12,400 to 24,100"
              series={[
                { name: "This period", values: activeUsers },
                { name: "Previous", values: activeUsersPrevious, color: "muted" },
              ]}
              labels={last30Days}
              height={210}
              live
              delay={500}
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
