import Logo from "./Logo";

/*
 * Footer link columns. Kept as data so adding/removing a link is a one-line
 * change. Links point to "#" because this is a concept site with one page.
 */
const COLUMNS = [
  { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog", "Roadmap"] },
  { title: "Resources", links: ["Documentation", "API reference", "Guides", "Status"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
];

// Server Component: no state or browser APIs, so it ships zero JavaScript.
export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-2">
      <div className="container-x grid grid-cols-1 gap-12 py-16 desktop:grid-cols-[1.4fr_repeat(4,1fr)] desktop:py-20">
        <div>
          <Logo />
          <p className="mt-4 max-w-[260px] text-sm text-muted">
            Product analytics for modern teams. Understand every click, funnel and cohort — in real time.
          </p>
        </div>

        {/* 2 columns of links on mobile, 4 beside the brand block on desktop */}
        <div className="grid grid-cols-2 gap-10 desktop:col-span-4 desktop:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-medium text-ink">{col.title}</h3>
              {/* py-1 makes each link a 26px-tall tap target (accessibility minimum is 24px);
                  space-y-1 shrinks the gap by the same amount, so it looks unchanged */}
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="inline-block py-1 text-sm text-muted transition-colors hover:text-ink">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-faint desktop:flex-row desktop:justify-between">
          <p>© 2026 PULSE — concept build. Not a real product; all data, logos and testimonials are fictional.</p>
          <p>
            Designed &amp; developed by <span className="text-muted">Waleed Atiq</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
