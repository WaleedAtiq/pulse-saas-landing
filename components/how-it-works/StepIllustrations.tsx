import InView from "@/components/InView";
import BarList from "@/components/charts/BarList";

/*
 * The small animated illustrations at the top of each "How it works" step.
 * None of them needs its own JavaScript: typing is CSS (.type-line), the event
 * flow is SVG's built-in <animateMotion>, and step 3 reuses BarList.
 */

/** Sets when a .type-line starts typing (read by the CSS in globals.css) */
const typeDelay = (ms: number) => ({ "--type-delay": `${ms}ms` }) as React.CSSProperties;

// ─── Step 1: a terminal that types out the install ──────────────────────────
// Lines are kept short (≤ 22 characters) on purpose: at the narrowest desktop
// width each card has only ~190px for code, and wrapped code looks broken.
export function InstallIllustration() {
  return (
    <InView className="panel h-full bg-bg/60 p-4 font-mono text-[12px] leading-6">
      {/* Each line types in after the previous one has finished */}
      <div className="type-line text-muted" style={typeDelay(0)}>
        <span className="text-faint">$</span> npm i @pulse/sdk
      </div>
      <div className="type-line" style={typeDelay(900)}>
        pulse.<span className="text-accent-hi">init</span>(<span className="text-chart-2">&quot;acme&quot;</span>)
      </div>
      <div className="type-line" style={typeDelay(1800)}>
        pulse.<span className="text-accent-hi">track</span>(<span className="text-chart-2">&quot;signup&quot;</span>)
      </div>
      <div className="type-line mt-2 text-up" style={typeDelay(2700)}>
        ✓ Receiving events
        {/* Blinking cursor at the end of the last line */}
        <span className="animate-blink ml-1 inline-block h-3.5 w-[7px] translate-y-0.5 bg-up" aria-hidden="true" />
      </div>
    </InView>
  );
}

// ─── Step 2: events flowing into PULSE ──────────────────────────────────────
const EVENTS = [
  { name: "page_view", y: 30 },
  { name: "signup", y: 85 },
  { name: "purchase", y: 140 },
];
const HUB = { x: 262, y: 85 };

export function TrackIllustration() {
  return (
    <div className="panel grid h-full place-items-center bg-bg/60 p-3">
      <svg viewBox="0 0 320 170" className="h-full w-full" aria-hidden="true">
        {EVENTS.map((event, i) => {
          // A curve from the right edge of the pill to the hub
          const path = `M 104 ${event.y} C 170 ${event.y}, 190 ${HUB.y}, ${HUB.x - 30} ${HUB.y}`;
          return (
            <g key={event.name}>
              <path d={path} fill="none" stroke="var(--color-line-strong)" strokeDasharray="3 4" />

              {/* The pill */}
              <rect x="8" y={event.y - 13} width="96" height="26" rx="13" fill="var(--color-panel-2)" stroke="var(--color-line-strong)" />
              <circle cx="22" cy={event.y} r="3.5" className="fill-accent" />
              <text x="32" y={event.y + 4} className="fill-muted font-mono text-[11px]">
                {event.name}
              </text>

              {/* A dot travelling along the curve, forever. <animateMotion> is
                  SVG's own animation feature — no JavaScript, works in every
                  modern browser. Staggered start times keep the dots apart.
                  motion-reduce:hidden hides them for reduced-motion users. */}
              <circle r="3" className="fill-accent-hi motion-reduce:hidden">
                <animateMotion dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" path={path} />
              </circle>
            </g>
          );
        })}

        {/* The PULSE hub, with a ring that keeps rippling outward (.hub-ring) */}
        <circle cx={HUB.x} cy={HUB.y} r="28" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" className="hub-ring" />
        <circle cx={HUB.x} cy={HUB.y} r="28" fill="var(--color-panel-2)" stroke="var(--color-accent)" strokeWidth="1.5" />
        <path
          d={`M ${HUB.x - 14} ${HUB.y + 1} h 6 l 4 -9 l 6 16 l 4 -7 h 7`}
          fill="none"
          stroke="var(--color-accent-hi)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Step 3: a question, answered with a chart ──────────────────────────────
const ANSWER = [
  { label: "Used Funnels", value: 64 },
  { label: "Used Segments", value: 52 },
  { label: "Used neither", value: 31 },
];

export function AnswerIllustration() {
  return (
    <div className="panel flex h-full flex-col justify-center gap-3 bg-bg/60 p-4">
      <InView className="flex items-center gap-2 text-xs">
        {/* Sparkle icon */}
        <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-accent-hi" fill="currentColor" aria-hidden="true">
          <path d="M12 2l1.8 5.6L19.5 9.5l-5.7 1.9L12 17l-1.8-5.6L4.5 9.5l5.7-1.9zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z" />
        </svg>
        <span className="type-line text-ink">Which feature drives retention?</span>
      </InView>
      <div>
        <div className="mb-1.5 px-2.5 text-[10px] uppercase tracking-wider text-faint">Week-8 retention</div>
        <BarList label="Week-8 retention by feature used" data={ANSWER} format="percent" delay={900} />
      </div>
    </div>
  );
}
