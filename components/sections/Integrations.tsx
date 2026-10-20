import { colorVar } from "@/components/charts/chartMath";
import { INTEGRATIONS, type Integration } from "@/lib/integrations";

/** One integration tile: tinted icon square + name + category */
function Tile({ item }: { item: Integration }) {
  return (
    <div className="card flex w-[220px] items-center gap-3 p-3.5">
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl"
        // color-mix makes a see-through tint of the token color for the background
        style={{ background: `color-mix(in srgb, ${colorVar(item.color)} 16%, transparent)`, color: colorVar(item.color) }}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={item.icon} />
        </svg>
      </span>
      <div className="min-w-0">
        <div className="text-sm font-medium">{item.name}</div>
        <div className="text-xs text-muted">{item.category}</div>
      </div>
    </div>
  );
}

/*
 * One endlessly scrolling row. Pure CSS — no JavaScript:
 *  - the track contains the tiles TWICE, and the `marquee` animation slides it
 *    left by exactly half its width, so the end frame matches the start frame
 *    and the loop has no visible jump
 *  - spacing is padding on each tile (not `gap`), so both copies are exactly
 *    the same width — required for the -50% trick to line up perfectly
 *  - hovering the row pauses it, so people can actually read a tile
 *  - the second copy is aria-hidden so screen readers don't read every name twice
 */
function MarqueeRow({ items, reverse = false }: { items: Integration[]; reverse?: boolean }) {
  return (
    <div className="group overflow-hidden">
      <div
        className={`animate-marquee flex w-max group-hover:[animation-play-state:paused] ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex" aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item) => (
              <li key={item.name} className="pr-3">
                <Tile item={item} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/*
 * Integrations: heading, then two marquee rows drifting in opposite directions.
 * The edges fade out (mask-image) so tiles glide in and out instead of being cut.
 */
export default function Integrations() {
  const half = Math.ceil(INTEGRATIONS.length / 2);

  return (
    <section id="integrations" className="section overflow-hidden">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Integrations</span>
          <h2 className="heading">
            Plugs into the stack <span className="text-gradient">you already use.</span>
          </h2>
          <p className="lead mx-auto mt-5">
            Send insights to where your team works, and pull in billing, CRM and support data for the full picture.
          </p>
        </div>

        <div className="reveal mt-14 space-y-3 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] desktop:mt-16">
          <MarqueeRow items={INTEGRATIONS.slice(0, half)} />
          <MarqueeRow items={INTEGRATIONS.slice(half)} reverse />
        </div>

        <div className="reveal mt-10 text-center">
          <a href="#" className="btn-ghost">
            Browse all 120+ integrations <span aria-hidden="true">→</span>
          </a>
          <p className="mt-4 text-[11px] text-faint">Integration names are fictional — concept build.</p>
        </div>
      </div>
    </section>
  );
}
