import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import BarList from "@/components/charts/BarList";
import DonutChart from "@/components/charts/DonutChart";
import StatTile from "@/components/dashboard/StatTile";
import LiveNumber from "@/components/dashboard/LiveNumber";
import LiveDot from "@/components/dashboard/LiveDot";
import LiveEventFeed from "@/components/dashboard/LiveEventFeed";
import type { FeatureId } from "@/lib/features";
import {
  eventsPerMinute,
  funnelSteps,
  minutesAgo,
  retentionCohorts,
  retentionWeeks,
  topCountries,
  usersByPlan,
} from "@/lib/mockData";

/*
 * The dashboard shown inside the preview window for each feature tab.
 * Every preview is built from the same chart + dashboard pieces as the Hero —
 * that reuse is the payoff of building the chart kit first.
 */

/** Title row at the top of each preview: name on the left, headline number on the right */
function PreviewHeader({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="flex items-end justify-between gap-4 px-1">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-right">
        <div className="text-xl font-semibold tracking-tight tabular-nums">{value}</div>
        <div className="text-[11px] text-muted">{note}</div>
      </div>
    </div>
  );
}

/** A color dot + label, for chart legends */
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${color}`} /> {label}
    </span>
  );
}

// ─── Funnels ──────────────────────────────────────────────────────────────────
function FunnelPreview() {
  const first = funnelSteps[0].value;
  const last = funnelSteps[funnelSteps.length - 1].value;

  // Conversion from the previous step, for every step after the first
  const stepRates = funnelSteps.map((step, i) => (i === 0 ? 100 : (step.value / funnelSteps[i - 1].value) * 100));
  // The step with the lowest conversion = the biggest leak. We highlight it.
  const worstStep = stepRates.indexOf(Math.min(...stepRates.slice(1)));

  return (
    <div className="space-y-3">
      <PreviewHeader title="Signup → paid funnel" value={`${((last / first) * 100).toFixed(1)}%`} note="overall conversion" />
      <div className="panel p-4">
        <BarChart label="Users reaching each funnel step" data={funnelSteps} height={250} highlight={worstStep} />
        {/* Step-to-step conversion, one column per bar so they line up */}
        <div className="mt-3 flex border-t border-line pt-3 text-center">
          {funnelSteps.map((step, i) => (
            <div key={step.label} className="flex-1">
              <div className={`text-sm font-medium tabular-nums ${i === worstStep ? "text-down" : "text-ink"}`}>
                {i === 0 ? "—" : `${stepRates[i].toFixed(1)}%`}
              </div>
              <div className="text-[10px] text-faint">{i === 0 ? "entry" : i === worstStep ? "biggest drop" : "from prev."}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Retention ────────────────────────────────────────────────────────────────
function RetentionPreview() {
  return (
    <div className="space-y-3">
      <PreviewHeader title="Weekly retention by cohort" value="38%" note="still active at week 8" />
      <div className="panel p-4">
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          <LegendItem color="bg-accent" label="This month" />
          <LegendItem color="bg-chart-2" label="Last month" />
          <LegendItem color="bg-muted" label="3 months ago" />
        </div>
        <LineChart
          label="Retention curves for three monthly cohorts; this month's cohort keeps 38% of users by week 8"
          series={[
            { name: "This month", values: retentionCohorts.thisMonth },
            { name: "Last month", values: retentionCohorts.lastMonth, color: "chart-2" },
            { name: "3 months ago", values: retentionCohorts.threeMonthsAgo, color: "muted" },
          ]}
          labels={retentionWeeks}
          min={0}
          max={100}
          format="percent"
          height={270}
        />
      </div>
    </div>
  );
}

// ─── Real-time ────────────────────────────────────────────────────────────────
function RealtimePreview() {
  return (
    <div className="space-y-3">
      {/* Two tiles on mobile, three from 861px up (same as the Hero dashboard) */}
      <div className="grid grid-cols-2 gap-2 desktop:grid-cols-3 desktop:gap-3">
        <StatTile
          label={<LiveDot label="Events/min" />}
          value={<LiveNumber value={8420} interval={1100} minStep={-180} maxStep={260} />}
          delta="+18% vs. 1h"
        />
        <StatTile label="Online now" value={<LiveNumber value={1284} />} delta="+12% vs. avg" />
        <StatTile label="Latency" value="0.6s" delta="p95 · 5 min" className="hidden desktop:block" />
      </div>
      <div className="grid grid-cols-1 gap-3 desktop:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="panel p-4">
          <div className="mb-3 text-[11px] text-muted">Events per minute · last 30 min</div>
          <LineChart
            label="Events per minute over the last 30 minutes, rising to 8,420"
            series={[{ name: "Events / min", values: eventsPerMinute }]}
            labels={minutesAgo}
            min={6000}
            height={300}
            live
          />
        </div>
        <div className="panel p-3.5">
          <LiveEventFeed />
        </div>
      </div>
    </div>
  );
}

// ─── Segments ─────────────────────────────────────────────────────────────────
function SegmentsPreview() {
  return (
    <div className="space-y-3">
      {/* Fake filter chips — the kind of UI a real segment builder has */}
      <div className="flex flex-wrap items-center gap-2 px-1 text-[11px]">
        <span className="text-muted">Segment:</span>
        <span className="rounded-md border border-accent/40 bg-accent/10 px-2 py-1 text-accent-hi">Signed up in last 90 days</span>
        <span className="rounded-md border border-line px-2 py-1 text-muted">AND</span>
        <span className="rounded-md border border-accent/40 bg-accent/10 px-2 py-1 text-accent-hi">Used Funnels ≥ 3×</span>
        <span className="rounded-md border border-dashed border-line-strong px-2 py-1 text-faint">+ Add filter</span>
      </div>
      <div className="grid grid-cols-1 gap-3 desktop:grid-cols-2">
        <div className="panel p-4">
          <div className="mb-4 text-[11px] text-muted">Users by plan</div>
          <DonutChart label="Users in this segment by plan" segments={usersByPlan} size={132} centerValue="41.4K" centerLabel="users" />
        </div>
        <div className="panel p-4">
          <div className="mb-3 text-[11px] text-muted">Top countries</div>
          <BarList label="Users in this segment by country" data={topCountries} color="chart-2" delay={200} />
        </div>
      </div>
    </div>
  );
}

/**
 * Picks the preview for a tab. A plain switch (rather than a lookup object of
 * components) keeps it obvious which id shows which dashboard.
 */
export function renderPreview(id: FeatureId) {
  switch (id) {
    case "funnels":
      return <FunnelPreview />;
    case "retention":
      return <RetentionPreview />;
    case "realtime":
      return <RealtimePreview />;
    case "segments":
      return <SegmentsPreview />;
  }
}
