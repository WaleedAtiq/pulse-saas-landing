/*
 * Number formatting for charts and metrics.
 *
 * Why a string name ("compact") instead of passing a formatting function?
 * Charts are Client Components, and pages are Server Components. Props sent
 * from server to client must be plain data (strings, numbers, arrays) —
 * functions can't be sent over that boundary. So callers pick a format by name.
 *
 * The locale is fixed to "en-US" so the server and the browser produce exactly
 * the same text (otherwise React would warn about a hydration mismatch).
 */
export type NumberFormat = "number" | "compact" | "percent" | "ms";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const plain = new Intl.NumberFormat("en-US");

export function formatValue(value: number, format: NumberFormat = "number"): string {
  switch (format) {
    case "compact":
      return compact.format(value); // 12400 → "12.4K"
    case "percent":
      // Number(…toFixed(1)) drops a trailing ".0": 42.13 → "42.1%", 64 → "64%"
      return `${Number(value.toFixed(1))}%`;
    case "ms":
      return `${Math.round(value)}ms`; // 139.6 → "140ms"
    default:
      return plain.format(Math.round(value)); // 12400 → "12,400"
  }
}
