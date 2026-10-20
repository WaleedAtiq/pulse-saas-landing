/*
 * "Trusted by" logo row. The brands are FICTIONAL (concept build) — each is
 * just a tiny SVG mark plus the name set in a different type style, which is
 * enough to read as six distinct companies.
 *
 * All logos use `currentColor`, so one class (text-faint) greys them all out
 * evenly — the standard treatment, so no single logo shouts louder than another.
 */
const LOGOS = [
  {
    name: "Northwind",
    text: "text-[17px] font-semibold tracking-tight",
    mark: <path d="M4 19 12 5l8 14M8.5 19 12 12.5l3.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />,
  },
  {
    name: "lumen",
    text: "text-[18px] font-medium lowercase tracking-wide",
    mark: (
      <>
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "ARCFLOW",
    text: "text-[13px] font-semibold tracking-[0.22em]",
    mark: <path d="M3 18a9 9 0 0 1 18 0M7.5 18a4.5 4.5 0 0 1 9 0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  },
  {
    name: "Kitebase",
    text: "text-[17px] font-bold tracking-tight",
    mark: <path d="m12 2 8 10-8 10-8-10z" fill="currentColor" />,
  },
  {
    name: "Quanta",
    text: "text-[17px] font-semibold italic",
    mark: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
        <rect x="13" y="3" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    name: "orbit.io",
    text: "font-mono text-[15px]",
    mark: (
      <>
        <circle cx="11" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="19" cy="7" r="2.6" fill="currentColor" />
      </>
    ),
  },
];

export default function SocialProof() {
  return (
    <section className="border-y border-line bg-bg-2/60 py-14 desktop:py-16">
      <div className="container-x">
        {/* The one-line stat */}
        <p className="reveal text-center text-sm text-muted">
          Powering <span className="font-medium text-ink">2.4B events a day</span> for 4,000+ product teams
        </p>

        <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-8 desktop:grid-cols-6">
          {LOGOS.map((logo) => (
            <li
              key={logo.name}
              // "reveal" on each logo: they enter the screen together, so ScrollEffects
              // staggers them into a left-to-right cascade
              className="reveal flex items-center justify-center gap-2 text-faint transition-colors duration-300 hover:text-muted"
            >
              <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
                {logo.mark}
              </svg>
              {/* Each logo sets its own size: two text-[…] classes on one element would clash */}
              <span className={logo.text}>{logo.name}</span>
            </li>
          ))}
        </ul>

        {/* Honesty note: this is a portfolio concept, not real customers */}
        <p className="reveal mt-9 text-center text-[11px] text-faint">Fictional brands — concept build.</p>
      </div>
    </section>
  );
}
