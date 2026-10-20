import HeroDashboard from "@/components/dashboard/HeroDashboard";
import LiveEventFeed from "@/components/dashboard/LiveEventFeed";

const TRUST_POINTS = ["Free up to 10M events", "No credit card", "5-minute setup"];

/*
 * The Hero: headline + CTAs on the left, the live dashboard on the right
 * (stacked on mobile). Everything fades up in sequence on load using the
 * `animate-rise` utility from globals.css — each element just gets a slightly
 * later animation-delay, which is what creates the "cascade".
 */
export default function Hero() {
  return (
    // `isolate` starts a new stacking context, so the -z-10 background layers
    // sit behind this section's content but not behind the page itself.
    <section className="relative isolate overflow-hidden pb-24 pt-32 desktop:pb-36 desktop:pt-40">
      {/* Background: faint grid + two soft color glows */}
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="glow absolute -right-[290px] -top-[34px] -z-10 h-[780px] w-[980px] text-accent [--glow-strength:22%]" />
      <div aria-hidden="true" className="glow absolute -left-[290px] -top-[290px] -z-10 h-[680px] w-[780px] text-chart-2 [--glow-strength:12%]" />

      {/* grid-cols-1 = minmax(0, 1fr): on mobile the single column may never grow
          wider than the screen, even if something inside it can't shrink */}
      <div className="container-x grid grid-cols-1 items-center gap-16 desktop:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] desktop:gap-14">
        {/* ── Left: copy ─────────────────────────────────────────── */}
        <div>
          {/* Announcement pill — a common SaaS pattern for "what's new" */}
          <a
            href="#features"
            className="animate-rise group mb-7 inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel/60 py-1 pl-1 pr-3 text-xs text-muted backdrop-blur transition-colors hover:border-accent/50 hover:text-ink"
          >
            <span className="rounded-full bg-accent/20 px-2 py-0.5 font-medium text-accent-hi">New</span>
            Real-time cohorts are here
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>

          <h1
            className="animate-rise text-[clamp(40px,5.4vw,66px)] font-semibold leading-[1.02] tracking-[-0.04em]"
            style={{ animationDelay: "80ms" }}
          >
            Understand every user, <span className="text-gradient">in real time.</span>
          </h1>

          <p className="lead animate-rise mt-6" style={{ animationDelay: "160ms" }}>
            PULSE turns raw product events into funnels, retention curves and live dashboards your whole team can
            read — no SQL, no waiting on the data team.
          </p>

          <div className="animate-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <a href="#pricing" className="btn-primary h-12 px-6">
              Start free
              <span aria-hidden="true">→</span>
            </a>
            <a href="#features" className="btn-ghost h-12 px-6">
              See how it works
            </a>
          </div>

          <ul className="animate-rise mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted" style={{ animationDelay: "320ms" }}>
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="size-3.5 text-accent-hi" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: the live dashboard ──────────────────────────── */}
        <div className="animate-rise relative" style={{ animationDelay: "300ms" }}>
          <HeroDashboard />

          {/* Floating live feed hanging off the dashboard's bottom-left corner.
              It sits out in the column gap and below the window, so it only
              covers the quiet night-time bars of the chart.
              Shown from 1100px up — a deliberate exception to the single 861px
              breakpoint: between 861–1100px the dashboard is too narrow and the
              card would hide half the chart. It's decoration, so it can go. */}
          <div
            className="card animate-rise absolute -bottom-24 -left-14 hidden w-[230px] bg-panel/90 p-3.5 shadow-window backdrop-blur-xl min-[1100px]:block"
            style={{ animationDelay: "900ms" }}
          >
            <LiveEventFeed />
          </div>
        </div>
      </div>
    </section>
  );
}
