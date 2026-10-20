"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

// Each href matches the id="" of a section in app/page.tsx
const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#integrations", label: "Integrations" },
  { href: "#pricing", label: "Pricing" },
  { href: "#customers", label: "Customers" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false); // has the page scrolled at all?
  const [open, setOpen] = useState(false); // is the mobile menu open?

  // Add the bottom border + stronger background once the page is scrolled,
  // so the nav separates from the content passing underneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // run once on load, in case the page opens already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu (expected keyboard behaviour for menus)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        // open menu: nearly solid so page content doesn't show through the links
        open ? "border-line bg-bg/95" : scrolled ? "border-line bg-bg/75" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Main">
        <a href="#top" aria-label="PULSE home">
          <Logo />
        </a>

        {/* Desktop links (hidden below 861px) */}
        <ul className="hidden items-center gap-8 desktop:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="inline-block py-2 text-sm text-muted transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 desktop:flex">
          <ThemeToggle className="-mr-2" />
          <a href="#" className="inline-block py-2 text-sm text-muted transition-colors hover:text-ink">
            Log in
          </a>
          <a href="#pricing" className="btn-primary h-9 px-4 text-[13px]">
            Start free
          </a>
        </div>

        {/* Mobile: theme switch + menu button (☰ / ✕ drawn with two SVG lines) */}
        <div className="flex items-center gap-1 desktop:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="-mr-2 grid size-10 place-items-center"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="size-6 stroke-ink" fill="none" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu: tapping any link closes it */}
      {open && (
        <div id="mobile-menu" className="container-x border-t border-line pb-6 pt-2 desktop:hidden">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-4 text-lg text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href="#" className="btn-ghost">
              Log in
            </a>
            <a href="#pricing" onClick={() => setOpen(false)} className="btn-primary">
              Start free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
