"use client";

import { useEffect, useState } from "react";
import LiveDot from "./LiveDot";
import { colorVar } from "@/components/charts/chartMath";
import { liveEvents, type LiveEvent } from "@/lib/mockData";

const VISIBLE = 3; // how many events are on screen at once
const TICK_MS = 2600; // a new event every 2.6s
const AGES = ["just now", "4s ago", "9s ago"]; // label for each row position

type FeedItem = LiveEvent & { id: number };

// Event number `id` → the matching mock event (cycling through the list forever).
// The id also becomes the React key, so each new row is a NEW element and plays
// its slide-in animation, while existing rows are left alone.
const itemAt = (id: number): FeedItem => ({ ...liveEvents[id % liveEvents.length], id });

/*
 * A "live" stream of user events: every few seconds a new event slides in at
 * the top and the oldest drops off the bottom.
 */
export default function LiveEventFeed() {
  // Start with events 2, 1, 0 (newest first). Fixed, so server and browser match.
  const [items, setItems] = useState<FeedItem[]>(() => [2, 1, 0].map(itemAt));

  useEffect(() => {
    // Users who turned off motion get a calm, static list
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      // Add the next event on top, keep only the newest VISIBLE
      setItems((prev) => [itemAt(prev[0].id + 1), ...prev].slice(0, VISIBLE));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-ink">Live events</span>
        <LiveDot />
      </div>
      {/* aria-live is left off on purpose: announcing a fake event every 2.6s
          would be noise for screen-reader users. */}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={item.id}
            className={`flex items-center gap-3 rounded-lg bg-panel-2/70 px-3 py-2 ${i === 0 ? "animate-feed-in" : ""}`}
          >
            <span className="size-2 shrink-0 rounded-full" style={{ background: colorVar(item.color) }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs text-ink">{item.name}</div>
              <div className="truncate text-[11px] text-faint">{item.place}</div>
            </div>
            <span className="shrink-0 text-[10px] text-faint">{AGES[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
