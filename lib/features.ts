/*
 * Content for the Feature tabs section. Each tab's copy lives here as data, so
 * changing wording (or adding a tab) never means touching the component.
 * The `id` decides which dashboard preview is shown (see FeaturePreviews.tsx).
 */
export type FeatureId = "funnels" | "retention" | "realtime" | "segments";

export type Feature = {
  id: FeatureId;
  label: string; // text on the tab button
  icon: string; // SVG path for the tab icon (24×24, drawn as a line)
  title: string;
  description: string;
  points: string[];
  path: string; // fake address shown in the preview window's title bar
};

export const FEATURES: Feature[] = [
  {
    id: "funnels",
    label: "Funnels",
    icon: "M3 4h18l-7 8v6l-4 2v-8z",
    title: "See exactly where users drop off",
    description:
      "Build a funnel from any events in seconds. PULSE shows the conversion between every step — and points straight at the one that leaks.",
    points: ["Unlimited steps, in any order", "Break down by plan, country or campaign", "Click a drop-off to see who left"],
    path: "app.pulse.dev/acme/funnels",
  },
  {
    id: "retention",
    label: "Retention",
    icon: "M4 4v16h16M7 7c2 6 6 9 13 10",
    title: "Know who comes back — and why",
    description:
      "Cohort curves show whether this month's users stick better than last month's, so you know if a release actually helped.",
    points: ["Weekly and monthly cohorts", "Compare cohorts side by side", "Tie retention to the features people used"],
    path: "app.pulse.dev/acme/retention",
  },
  {
    id: "realtime",
    label: "Real-time",
    icon: "M13 2 4 14h7l-1 8 9-12h-7z",
    title: "Watch your product, live",
    description:
      "Events show up within a second of happening. Watch a launch land, or catch a broken checkout before your users report it.",
    points: ["Sub-second event ingestion", "Live event stream with filters", "Slack alerts when a metric spikes"],
    path: "app.pulse.dev/acme/live",
  },
  {
    id: "segments",
    label: "Segments",
    icon: "M12 3a9 9 0 1 0 9 9h-9z M15 3.5A9 9 0 0 1 20.5 9H15z",
    title: "Slice every chart by anyone",
    description:
      "Group users by plan, country, device or any property you track — then reuse that segment across every report.",
    points: ["Unlimited saved segments", "Combine properties with AND / OR", "Share segments with your whole team"],
    path: "app.pulse.dev/acme/segments",
  },
];
