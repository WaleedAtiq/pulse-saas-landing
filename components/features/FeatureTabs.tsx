"use client";

import { useRef, useState } from "react";
import DashboardFrame from "@/components/dashboard/DashboardFrame";
import { renderPreview } from "./FeaturePreviews";
import { FEATURES } from "@/lib/features";

/*
 * The interactive feature tabs: clicking a tab swaps the copy on the left and
 * the live dashboard preview on the right.
 *
 * How the charts re-animate: the swapped content is rendered with
 * key={active.id}. When the key changes, React discards the old elements and
 * mounts brand-new ones — so every chart starts "undrawn" again and draws in.
 *
 * Accessibility follows the standard WAI-ARIA "tabs" pattern:
 *  - role="tablist" / "tab" / "tabpanel" + aria-selected, so screen readers
 *    announce "Retention, tab 2 of 4, selected"
 *  - only the active tab is in the Tab-key order (tabIndex 0, others -1);
 *    Left/Right arrows move between tabs, Home/End jump to first/last
 */
export default function FeatureTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = FEATURES[activeIndex];

  // Arrow-key navigation between tabs (selects + focuses the new tab)
  function handleKeyDown(e: React.KeyboardEvent) {
    const last = FEATURES.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1, // wraps around
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    const next = targets[e.key];
    if (next === undefined) return; // some other key — ignore it
    e.preventDefault(); // stop Home/End/arrows from scrolling the page
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="mt-14 desktop:mt-16">
      {/* ── Tab buttons: 2×2 grid on mobile, one pill row on desktop ── */}
      <div className="reveal flex justify-center">
        <div
          role="tablist"
          aria-label="Product features"
          onKeyDown={handleKeyDown}
          className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-line bg-panel p-1 desktop:inline-flex desktop:w-auto desktop:rounded-full"
        >
          {FEATURES.map((feature, i) => {
            const selected = i === activeIndex;
            return (
              <button
                key={feature.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`feature-tab-${feature.id}`}
                aria-selected={selected}
                aria-controls="feature-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveIndex(i)}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors desktop:rounded-full ${
                  selected ? "bg-panel-2 text-ink ring-1 ring-line-strong" : "text-muted hover:text-ink"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`size-4 transition-colors ${selected ? "text-accent-hi" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={feature.icon} />
                </svg>
                {feature.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── The panel: copy on the left, live preview on the right ── */}
      <div
        role="tabpanel"
        id="feature-panel"
        aria-labelledby={`feature-tab-${active.id}`}
        className="reveal mt-12 grid grid-cols-1 items-center gap-10 desktop:mt-14 desktop:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] desktop:gap-14"
      >
        {/* key={active.id}: new tab → new element → the fade-in replays */}
        <div key={active.id} className="animate-swap">
          <h3 className="text-[clamp(24px,3vw,32px)] font-semibold leading-tight tracking-[-0.03em]">{active.title}</h3>
          <p className="mt-4 text-muted">{active.description}</p>
          <ul className="mt-7 space-y-3">
            {active.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-hi">
                  <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* The window frame stays put; only its contents swap (and redraw) */}
        <div className="relative">
          {/* Soft accent glow behind the window */}
          <div aria-hidden="true" className="glow absolute -inset-x-12 -inset-y-28 -z-10 text-accent [--glow-strength:18%]" />
          <DashboardFrame path={active.path}>
            {/* min-height stops the page jumping when previews differ in height */}
            <div key={active.id} className="animate-swap p-3 desktop:min-h-[470px] desktop:p-4">
              {renderPreview(active.id)}
            </div>
          </DashboardFrame>
        </div>
      </div>
    </div>
  );
}
