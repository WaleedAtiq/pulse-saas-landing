/*
 * A green dot with a ring that keeps expanding outward — the universal
 * "this is live" signal. `animate-ping` is a built-in Tailwind animation;
 * `motion-reduce:hidden` removes the ring for users who turned off motion.
 */
export default function LiveDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-up">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-up" />
      </span>
      {label}
    </span>
  );
}
