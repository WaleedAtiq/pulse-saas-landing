"use client";

import { useState } from "react";
import { COMPARISON, TIERS, type ComparisonValue } from "@/lib/pricing";

/** One table cell: ✓ / — / text. Icons get hidden text so screen readers hear "Included". */
function Cell({ value }: { value: ComparisonValue }) {
  if (value === true) {
    return (
      <>
        <svg viewBox="0 0 16 16" className="mx-auto size-4 text-accent-hi" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <span aria-hidden="true" className="text-faint">
          —
        </span>
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span>{value}</span>;
}

/*
 * "Compare all features": a button that expands a full plan-comparison table.
 *
 * - It's a real <table> (with a caption and header cells), so screen readers
 *   can announce "Growth, Saved segments, Included" as you move between cells.
 * - The expand animation uses the CSS grid trick: animating grid-template-rows
 *   from 0fr to 1fr smoothly opens to the content's natural height, which plain
 *   `height` can't animate to.
 * - While collapsed the content gets `inert`: invisible AND unreachable by Tab
 *   or screen readers — not just visually hidden.
 */
export default function ComparisonTable() {
  const [open, setOpen] = useState(false);

  return (
    <div className="reveal mt-10">
      <div className="text-center">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="plan-comparison"
          onClick={() => setOpen((o) => !o)}
          className="btn-ghost"
        >
          {open ? "Hide feature comparison" : "Compare all features"}
          <svg
            viewBox="0 0 16 16"
            className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div
        id="plan-comparison"
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-soft ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {/* On phones the cells use smaller text and tighter padding so all four columns
              fit; overflow-x-auto is only a safety net for unusually narrow screens */}
          <div className="card mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Feature comparison of the Starter, Growth and Scale plans</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-3 py-4 text-[13px] font-medium text-muted desktop:w-[38%] desktop:px-6 desktop:text-sm">
                    Feature
                  </th>
                  {TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className={`px-1 py-4 text-center text-[13px] font-semibold desktop:px-4 desktop:text-sm ${tier.highlighted ? "bg-accent/8 text-accent-hi" : ""}`}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {COMPARISON.map((group) => (
                // One <tbody> per group is valid HTML and keeps each group's rows together
                <tbody key={group.group}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={TIERS.length + 1}
                      className="bg-panel-2/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-faint desktop:px-6"
                    >
                      {group.group}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.feature} className="border-t border-line">
                      <th scope="row" className="px-3 py-3 text-[13px] font-normal text-muted desktop:px-6 desktop:text-sm">
                        {row.feature}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={TIERS[i].id}
                          className={`px-1 py-3 text-center text-[12px] desktop:px-4 desktop:text-[13px] ${TIERS[i].highlighted ? "bg-accent/8" : ""}`}
                        >
                          <Cell value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
