"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Tells a component when it has scrolled into view (once — it never flips back).
 * The charts use this to start their draw-in animation only when the visitor
 * can actually see it, instead of animating off-screen on page load.
 *
 * IntersectionObserver is a built-in browser API that reports when an element
 * crosses into the viewport — much cheaper than listening to every scroll event.
 *
 * Usage:  const [ref, inView] = useInView<HTMLDivElement>();
 *         <div ref={ref} data-drawn={inView}>…</div>
 */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animate once, then stop watching
        }
      },
      { threshold }, // 0.35 = start when 35% of the chart is visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}
