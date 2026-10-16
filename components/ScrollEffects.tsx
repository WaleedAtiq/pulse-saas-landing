"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * Page-wide scroll effects (same idea as ECLIPSE's ScrollEffects.tsx):
 *
 *   .reveal       → fades + slides up when it scrolls into view
 *   [data-count]  → number counts to its value when it scrolls into view
 *                   options: data-decimals="1"  (2.4, 99.99…)
 *                            data-from="900"    (start value — lets latency count DOWN)
 *
 * One improvement over ECLIPSE: the hidden starting state of .reveal is set in
 * CSS (globals.css), not here. JavaScript runs after the page is painted, so
 * hiding things from JS can make on-screen content flash (shown → hidden →
 * faded in). With CSS doing the hiding, there's nothing to flash.
 *
 * Everything uses GSAP ScrollTrigger, so it runs on the same clock as Lenis
 * smooth scrolling (see SmoothScroll.tsx).
 */
export default function ScrollEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // "Reduce motion" on: the CSS already shows everything, and the real
    // numbers are already in the HTML — so there's nothing to do.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // gsap.context() records the triggers/tweens created inside it, so one
    // ctx.revert() cleans them all up if this component unmounts.
    const ctx = gsap.context(() => {
      // batch() groups elements that enter the screen at the same moment and
      // hands them over together, so we can stagger them (a row of logos
      // fades in left-to-right instead of all at once).
      ScrollTrigger.batch(".reveal", {
        start: "top 90%", // when the element's top passes 90% down the screen
        end: "max", // stay "active" to the page bottom, so jumping past (nav links) still reveals
        once: true,
        onEnter: (elements) => {
          // Jumping far down the page (e.g. clicking "Pricing" in the nav) makes
          // EVERY element we skipped "enter" at once, in one big batch. Staggering
          // all of them would make the section you landed on wait seconds for its
          // turn. So: elements already scrolled past (above the screen) appear
          // instantly, and only the ones actually on screen get the cascade.
          const above = elements.filter((el) => el.getBoundingClientRect().bottom < 0);
          const onScreen = elements.filter((el) => !above.includes(el));
          // (the length checks avoid GSAP's "target not found" warning for empty lists)
          if (above.length) gsap.set(above, { opacity: 1, y: 0 });
          if (onScreen.length) {
            gsap.to(onScreen, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true });
          }
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const from = Number(el.dataset.from ?? 0);
        const decimals = Number(el.dataset.decimals ?? 0);
        const format = (n: number) =>
          n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

        const counter = { value: from };
        el.textContent = format(from); // reset to the start value until it scrolls into view
        gsap.to(counter, {
          value: end,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", end: "max", once: true },
          onUpdate: () => {
            el.textContent = format(counter.value);
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
