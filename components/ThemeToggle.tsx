"use client";

import { THEME_KEY } from "@/lib/site"; // localStorage key, also read by the inline script in layout.tsx

/*
 * Light / dark theme switch.
 *
 * The theme lives on <html data-theme="…">, and globals.css swaps every color
 * token based on it — so this button only has to flip one attribute.
 *
 * Notice there's no React state: which icon shows is decided by CSS
 * (`light:hidden` / `hidden light:block`) from that same attribute. The server
 * can't know a visitor's saved theme, so state here would render the wrong icon
 * first and "flash"; CSS always matches what's actually applied.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";

    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next); // remember it for the next visit
      } catch {
        // storage can be blocked (private mode) — the switch still works for this visit
      }
      // Recolor the mobile browser's address bar to match
      const bg = getComputedStyle(root).getPropertyValue("--color-bg").trim();
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
    };

    // View Transitions API: the browser cross-fades old → new theme.
    // Not in every browser yet, and skipped for reduced motion — then it's instant.
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
      className={`grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-panel-2 hover:text-ink ${className}`}
    >
      {/* Sun — shown on the dark theme (click for light) */}
      <svg viewBox="0 0 24 24" className="size-[18px] light:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon — shown on the light theme (click for dark) */}
      <svg viewBox="0 0 24 24" className="hidden size-[18px] light:block" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
      </svg>
    </button>
  );
}
