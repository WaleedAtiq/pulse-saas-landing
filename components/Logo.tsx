/*
 * PULSE wordmark: a small "heartbeat" mark + the name. Shared by Nav and Footer
 * so the brand is defined in exactly one place.
 */
export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-accent" />
        <path
          d="M5 17h5l3-7 5 13 3-6h6"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-on-accent"
        />
      </svg>
      <span className="text-[17px] font-semibold tracking-[0.12em]">PULSE</span>
    </span>
  );
}
