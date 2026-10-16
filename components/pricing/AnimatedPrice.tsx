"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/*
 * A number that tweens to its new value whenever `value` changes
 * (e.g. $49 → $39 when switching to yearly billing).
 *
 * Like LiveNumber, it writes to the <span> directly rather than through React
 * state, because the tween updates ~60×/second. Two details make that safe:
 *  - React only ever renders the FIRST value (useState keeps it fixed), so
 *    React and the tween never fight over the text.
 *  - `shown` remembers the number currently on screen, so each tween starts
 *    from wherever the last one stopped — even if the visitor toggles quickly.
 */
export default function AnimatedPrice({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef({ n: value });
  const [initial] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const counter = shown.current;
    const render = () => {
      el.textContent = String(Math.round(counter.n));
    };

    // Reduced motion: jump straight to the new number
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      counter.n = value;
      render();
      return;
    }

    const tween = gsap.to(counter, { n: value, duration: 0.5, ease: "power2.out", onUpdate: render });
    return () => {
      tween.kill(); // a new toggle interrupts this tween; the next starts from counter.n
    };
  }, [value]);

  return <span ref={ref}>{initial}</span>;
}
