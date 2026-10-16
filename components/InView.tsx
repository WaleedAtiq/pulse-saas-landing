"use client";

import { useInView } from "@/components/charts/useInView";

/*
 * A plain <div> that gets data-drawn="true" once it scrolls into view —
 * the same switch the charts use. Wrap anything in it and CSS rules like
 * `[data-drawn="true"] .type-line { … }` start their animation on scroll.
 *
 * This small Client Component is what lets SERVER components (which can't use
 * hooks) still have "animate when visible" behaviour.
 */
export default function InView({ className, children }: { className?: string; children: React.ReactNode }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-drawn={inView} className={className}>
      {children}
    </div>
  );
}
