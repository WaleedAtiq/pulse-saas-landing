import type { BarDatum } from "@/components/charts/BarChart";
import type { DonutSegment } from "@/components/charts/DonutChart";
import type { ChartColor } from "@/components/charts/chartMath";

/*
 * All the fake numbers behind the demo dashboards.
 *
 * They are written out by hand on purpose — NOT generated with Math.random().
 * Next.js renders the page on the server first, then React "hydrates" it in the
 * browser. Random numbers would differ between the two and React would throw
 * a hydration mismatch error. Fixed data also means the demo looks the same
 * (and equally good) for every visitor.
 */

/** "Sep 17" … "Oct 16": 30 daily labels for the charts' x-axis */
export const last30Days: string[] = [
  ...Array.from({ length: 14 }, (_, i) => `Sep ${17 + i}`),
  ...Array.from({ length: 16 }, (_, i) => `Oct ${1 + i}`),
];

/** Daily active users over the last 30 days — a healthy upward trend with weekly dips */
export const activeUsers: number[] = [
  12400, 12900, 12600, 13300, 14100, 13800, 13200, 14000, 14800, 15400, 15100, 15900, 16700, 16300, 15800,
  16600, 17500, 18200, 17900, 18800, 19600, 19200, 18700, 19800, 20900, 21600, 21200, 22400, 23300, 24100,
];

/** The same metric for the previous 30 days, drawn as a fainter comparison line */
export const activeUsersPrevious: number[] = [
  10800, 11200, 11000, 11500, 11900, 11600, 11100, 11700, 12200, 12600, 12300, 12800, 13300, 13000, 12600,
  13100, 13700, 14100, 13800, 14300, 14800, 14500, 14100, 14800, 15400, 15800, 15500, 16200, 16700, 17100,
];

/** Events tracked per weekday — busy mid-week, quiet weekends */
export const eventsByWeekday: BarDatum[] = [
  { label: "Mon", value: 182000 },
  { label: "Tue", value: 214000 },
  { label: "Wed", value: 236000 },
  { label: "Thu", value: 228000 },
  { label: "Fri", value: 196000 },
  { label: "Sat", value: 118000 },
  { label: "Sun", value: 104000 },
];

/** Where sessions come from (shares add up to 100) */
export const trafficSources: DonutSegment[] = [
  { label: "Organic search", value: 48, color: "accent" },
  { label: "Direct", value: 27, color: "chart-2" },
  { label: "Referral", value: 16, color: "chart-3" },
  { label: "Paid", value: 9, color: "muted" },
];

/* ─── Hero dashboard ───────────────────────────────────────────────────────── */

/** Events per 2-hour block today — quiet at night, peaking mid-afternoon */
export const eventsByHour: BarDatum[] = [
  { label: "00", value: 4200 },
  { label: "02", value: 2600 },
  { label: "04", value: 1900 },
  { label: "06", value: 3100 },
  { label: "08", value: 8800 },
  { label: "10", value: 14600 },
  { label: "12", value: 18900 },
  { label: "14", value: 21400 },
  { label: "16", value: 19800 },
  { label: "18", value: 17200 },
  { label: "20", value: 13500 },
  { label: "22", value: 9100 },
];

/** Most-tracked events this week */
export const topEvents: BarDatum[] = [
  { label: "Page viewed", value: 48200 },
  { label: "Signed up", value: 12900 },
  { label: "Project created", value: 8400 },
  { label: "Invite sent", value: 5100 },
  { label: "Plan upgraded", value: 1900 },
];

/** The "live" feed cycles through these in order, forever */
export type LiveEvent = { name: string; place: string; color: ChartColor };
export const liveEvents: LiveEvent[] = [
  { name: "Signed up", place: "Berlin, DE", color: "accent" },
  { name: "Upgraded to Pro", place: "Toronto, CA", color: "chart-2" },
  { name: "Built a dashboard", place: "London, UK", color: "chart-3" },
  { name: "Invited teammate", place: "Austin, US", color: "accent" },
  { name: "Finished setup", place: "Lagos, NG", color: "chart-2" },
  { name: "Exported a report", place: "Sydney, AU", color: "chart-3" },
  { name: "Started a trial", place: "São Paulo, BR", color: "accent" },
];

/* ─── Feature tabs ─────────────────────────────────────────────────────────── */

/** Funnels tab: how many users reach each step */
export const funnelSteps: BarDatum[] = [
  { label: "Visited site", value: 48200 },
  { label: "Signed up", value: 12900 },
  { label: "Activated", value: 7400 },
  { label: "Subscribed", value: 2100 },
];

/** Retention tab: % of each cohort still active, week 0 → week 8 */
export const retentionWeeks: string[] = Array.from({ length: 9 }, (_, i) => `Week ${i}`);
export const retentionCohorts = {
  thisMonth: [100, 62, 51, 46, 43, 41, 40, 39, 38],
  lastMonth: [100, 55, 44, 38, 35, 33, 32, 31, 30],
  threeMonthsAgo: [100, 48, 37, 31, 28, 26, 25, 24, 23],
};

/** Real-time tab: events per minute over the last 30 minutes */
export const minutesAgo: string[] = Array.from({ length: 30 }, (_, i) => (i === 29 ? "now" : `${29 - i}m ago`));
export const eventsPerMinute: number[] = [
  7120, 7340, 7210, 7480, 7690, 7520, 7410, 7630, 7880, 7760, 7590, 7820, 8040, 7910, 7730, 7960, 8180, 8050,
  7870, 8090, 8310, 8160, 7990, 8240, 8460, 8290, 8130, 8380, 8550, 8420,
];

/** Segments tab: users by plan, and the top countries */
export const usersByPlan: DonutSegment[] = [
  { label: "Free", value: 52, color: "muted" },
  { label: "Pro", value: 28, color: "accent" },
  { label: "Team", value: 14, color: "chart-2" },
  { label: "Enterprise", value: 6, color: "chart-3" },
];
export const topCountries: BarDatum[] = [
  { label: "United States", value: 18400 },
  { label: "Germany", value: 7900 },
  { label: "United Kingdom", value: 6200 },
  { label: "India", value: 5800 },
  { label: "Brazil", value: 3100 },
];
