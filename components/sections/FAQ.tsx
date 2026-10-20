import { FAQ as QUESTIONS } from "@/lib/faq";

/*
 * FAQ: an accordion built from the browser's own <details>/<summary> elements.
 *
 * Why native HTML instead of a JavaScript accordion?
 *  - Keyboard and screen-reader support are built in (Enter/Space toggles,
 *    "collapsed/expanded" is announced) — and it ships zero JavaScript.
 *  - name="faq" groups the items: opening one closes the others (an
 *    "exclusive accordion"), again with no code.
 *  - The open/close animation is CSS (.faq-item in globals.css). Browsers that
 *    don't support animating it simply open instantly — nothing breaks.
 *
 * id="faq" can be linked to directly (e.g. /#faq).
 */
export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container-x grid grid-cols-1 gap-12 desktop:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] desktop:gap-16">
        <div className="reveal">
          <span className="eyebrow">FAQ</span>
          <h2 className="heading">
            Questions, <span className="text-gradient">answered.</span>
          </h2>
          <p className="lead mt-5">Still wondering about something? Our team is happy to walk you through it.</p>
          {/* data-demo-trigger: opens the "Book a demo" dialog (see DemoRequest.tsx) */}
          <button type="button" data-demo-trigger className="btn-ghost mt-8">
            Book a demo <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="reveal border-t border-line">
          {QUESTIONS.map((item, i) => (
            <details key={item.question} name="faq" className="faq-item group border-b border-line" open={i === 0}>
              {/* list-none + the marker rule hide the browser's default ▶ triangle; we draw our own + icon */}
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium transition-colors hover:text-accent-hi [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-transform duration-300 group-open:rotate-45"
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-[60ch] pb-6 pr-12 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
