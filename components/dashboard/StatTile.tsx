type Props = {
  label: React.ReactNode; // e.g. "Conversion" (can include an icon/dot)
  value: React.ReactNode; // a string, or a component like <LiveNumber />
  delta?: string; // change vs. last period, e.g. "+0.6pt"
  trend?: "up" | "down"; // colors the delta green or red
  className?: string; // extra classes, e.g. to hide a tile on mobile
};

/*
 * A small KPI box: label, big number, and how it changed.
 * `value` accepts any React content, so a static "4.8%" and a ticking
 * <LiveNumber /> both fit in the same tile.
 */
export default function StatTile({ label, value, delta, trend = "up", className = "" }: Props) {
  return (
    <div className={`panel min-w-0 p-3 ${className}`}>
      <div className="flex items-center gap-1.5 truncate text-[11px] text-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold tracking-tight tabular-nums desktop:text-xl">{value}</div>
      {delta && <div className={`text-[11px] font-medium ${trend === "up" ? "text-up" : "text-down"}`}>{delta}</div>}
    </div>
  );
}
