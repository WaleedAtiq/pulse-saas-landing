/*
 * Pricing data. Only the MONTHLY price is written down for each tier — the
 * yearly price is calculated from it with YEARLY_DISCOUNT, so the two can
 * never drift out of sync. To change a price, change one number.
 */
export type Billing = "monthly" | "yearly";

export const YEARLY_DISCOUNT = 0.2; // 20% off when billed yearly

export type Tier = {
  id: string;
  name: string;
  tagline: string;
  monthly: number; // USD per month on monthly billing (0 = free)
  cta: string;
  highlighted?: boolean; // the "Most popular" middle tier
  featuresIntro?: string; // e.g. "Everything in Starter, plus:"
  features: string[];
};

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For side projects and early products finding their feet.",
    monthly: 0,
    cta: "Start free",
    features: ["10M events / month", "3 dashboards", "Funnels & retention", "7-day data history", "Community support"],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For fast-moving teams that ship every week.",
    monthly: 49,
    cta: "Start 14-day trial",
    highlighted: true,
    featuresIntro: "Everything in Starter, plus:",
    features: [
      "50M events / month",
      "Unlimited dashboards",
      "Real-time streams & alerts",
      "Saved segments",
      "12-month data history",
      "Email support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For companies running their roadmap on product data.",
    monthly: 199,
    cta: "Start 14-day trial",
    featuresIntro: "Everything in Growth, plus:",
    features: [
      "250M events / month",
      "SQL export & warehouse sync",
      "SSO & role-based access",
      "Unlimited data history",
      "Priority support & uptime SLA",
    ],
  },
];

/** The per-month price shown on the card for the chosen billing period */
export function pricePerMonth(tier: Tier, billing: Billing): number {
  return billing === "yearly" ? Math.round(tier.monthly * (1 - YEARLY_DISCOUNT)) : tier.monthly;
}
