import { colorVar } from "@/components/charts/chartMath";
import { TESTIMONIALS } from "@/lib/testimonials";

/** "Maya Okafor" → "MO" */
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

/*
 * Testimonials: three quote cards, each led by the result the customer got.
 * Leading with a number ("+18% activation") is more persuasive than a quote
 * alone — the quote then explains HOW. Server Component, no JavaScript.
 * id="customers" is the target of the Nav's "Customers" link.
 */
export default function Testimonials() {
  return (
    <section id="customers" className="section">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Customers</span>
          <h2 className="heading">
            Teams ship better products <span className="text-gradient">with PULSE.</span>
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 desktop:mt-16 desktop:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name} className="reveal">
              {/* <figure> + <blockquote> + <figcaption> is the proper HTML for a quote with its author */}
              <figure className="card flex h-full flex-col p-7">
                <div>
                  <div className="text-gradient text-4xl font-semibold tracking-[-0.04em]">{t.stat}</div>
                  {/* desktop:min-h-8 reserves two lines (2 × 16px) for the label, so the
                      three quotes always start at the same height — even when one
                      label wraps at narrow desktop widths */}
                  <div className="mt-1 text-xs text-muted desktop:min-h-8">{t.statLabel}</div>
                </div>

                <blockquote className="mt-6 flex-1 border-t border-line pt-6 text-[15px] leading-relaxed text-ink/90">
                  <p>“{t.quote}”</p>
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold"
                    style={{
                      background: `color-mix(in srgb, ${colorVar(t.color)} 20%, transparent)`,
                      color: colorVar(t.color),
                    }}
                  >
                    {initials(t.name)}
                  </span>
                  <div className="text-sm">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-muted">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="reveal mt-8 text-center text-[11px] text-faint">
          Concept testimonials — the people and companies are fictional.
        </p>
      </div>
    </section>
  );
}
