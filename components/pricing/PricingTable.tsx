"use client";

import { useState } from "react";
import AnimatedPrice from "./AnimatedPrice";
import { TIERS, YEARLY_DISCOUNT, pricePerMonth, type Billing, type Tier } from "@/lib/pricing";

/*
 * The billing toggle + the three tier cards. One piece of state — `billing` —
 * drives everything: the slider position, every price, and the "billed …" notes.
 */
export default function PricingTable() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const yearly = billing === "yearly";

  return (
    <div>
      {/* ── Monthly / Yearly toggle ─────────────────────────────── */}
      <div className="reveal mt-10 flex justify-center">
        {/* inline-grid + grid-cols-2 makes both buttons exactly the same width,
            which is what lets the sliding pill move by exactly 100% of itself */}
        <div role="group" aria-label="Billing period" className="relative inline-grid grid-cols-2 rounded-full border border-line bg-panel p-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-panel-2 ring-1 ring-line-strong transition-transform duration-300 ease-out-soft"
            style={{ transform: yearly ? "translateX(100%)" : "none" }}
          />
          {(["monthly", "yearly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={billing === option} // screen readers: "Yearly, toggle button, pressed"
              onClick={() => setBilling(option)}
              className={`relative flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                billing === option ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {option === "monthly" ? "Monthly" : "Yearly"}
              {option === "yearly" && (
                <span className="rounded-full bg-up/15 px-1.5 py-0.5 text-[11px] font-semibold text-up">
                  −{YEARLY_DISCOUNT * 100}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tier cards ─────────────────────────────────────────── */}
      <ul className="mt-12 grid grid-cols-1 gap-5 desktop:grid-cols-3 desktop:items-stretch">
        {TIERS.map((tier) => (
          <li key={tier.id} className="reveal">
            <TierCard tier={tier} billing={billing} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TierCard({ tier, billing }: { tier: Tier; billing: Billing }) {
  const price = pricePerMonth(tier, billing);
  const free = tier.monthly === 0;

  const note = free
    ? "Free forever — no card needed"
    : billing === "yearly"
      ? `$${(price * 12).toLocaleString("en-US")} billed yearly`
      : "Billed monthly";

  const body = (
    // rounded-[17px] = the card's 18px radius minus the 1px gradient border
    <div className={`flex h-full flex-col rounded-[17px] p-7 ${tier.highlighted ? "bg-panel" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{tier.name}</h3>
        {tier.highlighted && (
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent-hi">Most popular</span>
        )}
      </div>
      <p className="mt-2 min-h-[42px] text-sm text-muted">{tier.tagline}</p>

      {/* Price: "$" + tweening number + "/mo" */}
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-muted">$</span>
        <span className="text-5xl font-semibold tracking-[-0.04em] tabular-nums">
          <AnimatedPrice value={price} />
        </span>
        <span className="ml-1 text-sm text-muted">/ month</span>
      </div>
      <p className="mt-1 text-xs text-faint">{note}</p>

      <a href="#" className={`mt-7 w-full ${tier.highlighted ? "btn-primary" : "btn-ghost"}`}>
        {tier.cta}
      </a>

      <div className="mt-8 border-t border-line pt-6">
        {tier.featuresIntro && <p className="mb-4 text-xs font-medium text-muted">{tier.featuresIntro}</p>}
        <ul className="space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <svg
                viewBox="0 0 16 16"
                className={`mt-0.5 size-4 shrink-0 ${tier.highlighted ? "text-accent-hi" : "text-muted"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // The highlighted tier gets a gradient BORDER: a 1px-padded wrapper with a
  // gradient background, and the card's solid background sitting inside it.
  // (CSS borders can't be gradients directly — this is the standard workaround.)
  if (tier.highlighted) {
    return (
      <div className="relative h-full rounded-card bg-linear-to-b from-accent via-accent/40 to-line p-px shadow-glow">
        {body}
      </div>
    );
  }
  return <div className="card h-full">{body}</div>;
}
