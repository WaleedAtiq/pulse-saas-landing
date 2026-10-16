import type { ChartColor } from "@/components/charts/chartMath";

/*
 * Testimonials — CONCEPT CONTENT. The people are fictional and the companies
 * are the made-up brands from the Social proof row. Avatars are initials, not
 * photos, so nothing implies a real person said this.
 */
export type Testimonial = {
  stat: string; // the headline result, e.g. "+18%"
  statLabel: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  color: ChartColor; // avatar tint
};

export const TESTIMONIALS: Testimonial[] = [
  {
    stat: "+18%",
    statLabel: "activation in one month",
    quote:
      "We found the leak in our signup funnel on day one. One fix later, activation was up 18% — and we could prove exactly why.",
    name: "Maya Okafor",
    role: "Head of Product",
    company: "Northwind",
    color: "accent",
  },
  {
    stat: "−60%",
    statLabel: "time to answer a product question",
    quote:
      "Our weekly product review used to be an argument about whose numbers were right. Now it's one PULSE dashboard and a decision.",
    name: "Daniel Reyes",
    role: "Growth Lead",
    company: "Kitebase",
    color: "chart-2",
  },
  {
    stat: "2B",
    statLabel: "events a month, moved in a weekend",
    quote:
      "We moved two billion events a month over in a weekend. Queries that used to take minutes now come back before I've finished typing.",
    name: "Priya Nair",
    role: "CTO",
    company: "orbit.io",
    color: "chart-3",
  },
];
