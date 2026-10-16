"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { formatValue, type NumberFormat } from "@/lib/format";

type Props = {
  value: number; // starting value (also what the server renders)
  format?: NumberFormat;
  interval?: number; // ms between ticks
  minStep?: number; // smallest change per tick (negative = can go down)
  maxStep?: number; // largest change per tick
};

/*
 * A number that behaves like a live metric:
 *   1. on load it counts up from 0 to `value`
 *   2. then every `interval` ms it drifts by a small random amount, tweening
 *      smoothly to the new number and flashing green (up) or red (down).
 *
 * Two deliberate choices worth knowing:
 * - We write to the <span> directly (el.textContent) instead of using React
 *   state. The tween updates ~60 times a second; going through state would
 *   re-render the component 60×/s for no benefit. Same pattern as ECLIPSE's
 *   [data-count] counters.
 * - Math.random() is fine HERE because it only runs in the browser, after the
 *   page has loaded. (It must never run during render — see mockData.ts.)
 */
export default function LiveNumber({ value, format = "number", interval = 1600, minStep = -4, maxStep = 11 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { n: reduceMotion ? value : 0 }; // GSAP animates this object's `n`
    const render = () => {
      el.textContent = formatValue(counter.n, format);
    };

    // 1. Count up from 0 on load (skipped for reduced motion)
    if (!reduceMotion) {
      render(); // show 0 straight away
      gsap.to(counter, { n: value, duration: 1.8, delay: 0.4, ease: "power3.out", onUpdate: render });
    }

    // 2. Drift a little every `interval` ms
    let target = value;
    let flashTimer: number | undefined;
    const ticker = window.setInterval(() => {
      const change = Math.round(minStep + Math.random() * (maxStep - minStep));
      if (change === 0) return;
      target += change;

      // Flash green/red: set data-trend, then remove it so CSS fades the color back
      el.dataset.trend = change > 0 ? "up" : "down";
      window.clearTimeout(flashTimer);
      flashTimer = window.setTimeout(() => delete el.dataset.trend, 450);

      if (reduceMotion) {
        counter.n = target;
        render();
      } else {
        // overwrite: true cancels any tween still running (e.g. the count-up)
        gsap.to(counter, { n: target, duration: 0.7, ease: "power2.out", onUpdate: render, overwrite: true });
      }
    }, interval);

    // Cleanup when the component unmounts: stop the timers and tweens
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(flashTimer);
      gsap.killTweensOf(counter);
    };
  }, [value, format, interval, minStep, maxStep]);

  // The server renders the real value, so the HTML is correct even before JS loads
  return (
    <span ref={ref} className="live-number">
      {formatValue(value, format)}
    </span>
  );
}
