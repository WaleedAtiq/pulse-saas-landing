import LiveDot from "./LiveDot";

type Props = {
  path: string; // fake address shown in the title bar, e.g. "app.pulse.dev/acme"
  children: React.ReactNode;
  className?: string;
};

/*
 * A fake app window: title bar with three "traffic light" dots, an address,
 * and a Live badge. Wrapping a dashboard in this makes it read instantly as
 * "screenshot of a real product" — but everything inside is live HTML/SVG.
 *
 * Reused by the Hero and (later) the Feature tabs preview.
 */
export default function DashboardFrame({ path, children, className = "" }: Props) {
  return (
    <div className={`card overflow-hidden shadow-window ${className}`}>
      <div className="flex h-10 items-center gap-3 border-b border-line px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        {/* min-w-0 lets this shrink so `truncate` can add "…" — without it, a flex
            item refuses to get narrower than its text and widens the whole page */}
        <div className="mx-auto min-w-0 truncate rounded-md bg-panel-2 px-3 py-0.5 font-mono text-[11px] text-faint">{path}</div>
        <LiveDot label="Live" />
      </div>
      {children}
    </div>
  );
}
