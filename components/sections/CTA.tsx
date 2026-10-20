import LineChart from "@/components/charts/LineChart";
import { activeUsers } from "@/lib/mockData";

const TRUST_POINTS = ["Free up to 10M events", "No credit card", "5-minute setup"];

/*
 * The final call to action: one big gradient band, the last thing before the
 * footer. Behind the text, the Hero's growth line draws itself in again as a
 * faint decoration — a quiet callback to the top of the page, reusing LineChart.
 */
export default function CTA() {
  return (
    <section className="pb-24 desktop:pb-36">
      <div className="container-x">
        <div className="reveal cta-band relative isolate overflow-hidden rounded-[28px] border border-line-strong px-6 py-16 text-center desktop:px-16 desktop:py-24">
          {/* Decorative chart along the bottom. aria-hidden: it's decoration, not data.
              The mask fades it out toward the top so it never sits behind the text. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 opacity-30 [mask-image:linear-gradient(to_top,black_30%,transparent)]"
          >
            <LineChart
              label="Decorative growth line"
              series={[{ name: "Growth", values: activeUsers, color: "chart-2" }]}
              height={90}
              showGrid={false}
              interactive={false}
              live
              delay={300}
            />
          </div>

          <h2 className="mx-auto max-w-3xl text-[clamp(34px,5.5vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
            Start understanding your users today.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[clamp(16px,1.6vw,18px)] text-ink/80">
            Connect your product in five minutes and get your first funnel before lunch.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="#pricing" className="btn-light h-12 px-6">
              Start free <span aria-hidden="true">→</span>
            </a>
            {/* data-demo-trigger opens the "Book a demo" dialog (DemoRequest.tsx) */}
            <button type="button" data-demo-trigger className="btn-ghost h-12 border-ink/30 px-6 hover:border-ink/60">
              Book a demo
            </button>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-ink/70">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
