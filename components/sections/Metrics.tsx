import LiveDot from "@/components/dashboard/LiveDot";

/*
 * The live metrics band: four big numbers that count to their value when
 * scrolled into view. The counting is done by ScrollEffects.tsx, driven by the
 * data-count / data-decimals / data-from attributes below.
 *
 * The real values are written into the HTML, so search engines, screen readers
 * and no-JS / reduced-motion visitors all see the correct numbers.
 */
type Metric = {
  value: number;
  decimals?: number; // digits after the decimal point
  from?: number; // starting value (defaults to 0)
  suffix: string;
  label: string;
};

const METRICS: Metric[] = [
  { value: 2.4, decimals: 1, suffix: "B", label: "events processed every day" },
  // Counts DOWN from 900: a latency number ticking up would read as "getting slower"
  { value: 140, from: 900, suffix: "ms", label: "median query time on a billion rows" },
  { value: 99.99, decimals: 2, suffix: "%", label: "uptime over the last 12 months" },
  { value: 4000, suffix: "+", label: "product teams, from seed to IPO" },
];

export default function Metrics() {
  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-bg-2 py-20 desktop:py-28">
      {/* Soft accent glow across the middle of the band */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[900px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[110px]"
      />

      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel/60 px-3 py-1">
            <LiveDot label="All systems operational" />
          </span>
          <h2 className="heading">
            Built for <span className="text-gradient">billions of events.</span>
          </h2>
        </div>

        {/* <dl> = a list of label/value pairs — the right HTML for stats.
            flex-col-reverse shows the value (dd) above the label (dt) while
            keeping the label first in the HTML, as <dl> requires.
            justify-end: in a REVERSED column "end" is the top, so every number
            lines up at the top even when a label wraps to two lines. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 desktop:mt-16 desktop:grid-cols-4 desktop:divide-x desktop:divide-line">
          {METRICS.map((m) => (
            <div key={m.label} className="reveal flex flex-col-reverse items-center justify-end px-2 text-center desktop:px-6">
              <dt className="mt-2 max-w-[200px] text-sm text-muted">{m.label}</dt>
              <dd className="text-gradient text-[clamp(38px,5vw,60px)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                <span data-count={m.value} data-decimals={m.decimals} data-from={m.from}>
                  {m.value.toLocaleString("en-US", { minimumFractionDigits: m.decimals ?? 0 })}
                </span>
                {m.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
