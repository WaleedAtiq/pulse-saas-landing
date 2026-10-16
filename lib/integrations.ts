import type { ChartColor } from "@/components/charts/chartMath";

/*
 * Integration tiles for the Integrations marquee.
 *
 * The names are FICTIONAL on purpose: drawing real brands' logos (Slack,
 * Stripe…) would mean reproducing their trademarks. Each tile shows its
 * category, so "Relay — Team chat" still reads instantly. For a real client
 * you'd swap in their actual integrations and official logo files.
 */
export type Integration = {
  name: string;
  category: string;
  icon: string; // SVG path (24×24, drawn as a line)
  color: ChartColor; // tint of the icon tile
};

export const INTEGRATIONS: Integration[] = [
  { name: "Relay", category: "Team chat", color: "accent", icon: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" },
  { name: "Ledgerly", category: "Billing", color: "chart-2", icon: "M3 6h18v12H3zM3 10h18M7 15h3" },
  {
    name: "Stackhouse",
    category: "Data warehouse",
    color: "chart-3",
    icon: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  },
  {
    name: "Hookline",
    category: "Webhooks",
    color: "accent",
    icon: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  },
  {
    name: "Northdesk",
    category: "Support",
    color: "chart-2",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6",
  },
  {
    name: "Pipewise",
    category: "CRM",
    color: "chart-3",
    icon: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 20v-1a4 4 0 0 0-3-3.9M15 4.1a3.5 3.5 0 0 1 0 6.8",
  },
  { name: "Mailroom", category: "Email", color: "accent", icon: "M3 6h18v12H3zM3 7l9 6 9-6" },
  { name: "Flagship", category: "Feature flags", color: "chart-2", icon: "M5 21V4M5 4h11l-2 4 2 4H5" },
  { name: "Shipyard", category: "CI / CD", color: "chart-3", icon: "M12 3 4 7.5v9L12 21l8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" },
  { name: "Sheetly", category: "Spreadsheets", color: "accent", icon: "M3 4h18v16H3zM3 10h18M3 15h18M9 4v16" },
  { name: "Beacon", category: "Alerts", color: "chart-2", icon: "M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 21h4" },
  { name: "Querybox", category: "SQL", color: "chart-3", icon: "M4 5h16v14H4zM8 10l3 2-3 2M13 15h3" },
];
