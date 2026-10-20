"use client";

import { useEffect, useRef, useState } from "react";

type Values = { name: string; email: string; size: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", size: "", message: "" };
const MAX_MESSAGE = 500;
const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];
// B2B demo forms usually ask for a work address — personal inboxes don't tell sales which company it is
const PERSONAL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "proton.me", "protonmail.com"];

/** Returns a message for every invalid field (an empty object means the form is valid). */
function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";

  const email = v.email.trim().toLowerCase();
  if (!email) errors.email = "Please enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "That doesn't look like a valid email address.";
  else if (PERSONAL_DOMAINS.includes(email.split("@")[1])) errors.email = "Please use your work email, so we can find your team.";

  if (!v.size) errors.size = "Please choose your team size.";
  if (v.message.length > MAX_MESSAGE) errors.message = `Please keep it under ${MAX_MESSAGE} characters.`;
  return errors;
}

/*
 * The "Book a demo" dialog + form. Mounted ONCE on the page (app/page.tsx).
 *
 * Opening: any element with `data-demo-trigger` opens it. One click listener on
 * the document catches them all ("event delegation"), so the buttons themselves
 * can stay in Server Components with no JavaScript of their own.
 *
 * <dialog> + showModal() is the browser's built-in modal. For free it gives:
 * focus moves inside and is trapped there, Esc closes it, everything behind it
 * becomes inert, and focus returns to the button that opened it on close.
 *
 * Validation, the friendly way:
 *  - errors appear only after someone leaves a field (blur) or presses submit,
 *    never while they're still typing their first attempt
 *  - each error is linked to its field (aria-describedby), the field is marked
 *    aria-invalid, and on submit focus jumps to the first problem
 *
 * Nothing is sent anywhere — this is a concept site with no backend. The
 * success message says so honestly.
 */
export default function DemoRequest() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [submitted, setSubmitted] = useState(false); // has the person pressed "Request demo" yet?
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [announcement, setAnnouncement] = useState(""); // read out by screen readers

  const errors = validate(values);
  const showError = (field: keyof Values) => (submitted || touched[field]) && errors[field];

  // Open the dialog when any [data-demo-trigger] is clicked
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest("[data-demo-trigger]")) return;
      e.preventDefault();
      dialogRef.current?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  function update(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's default "reload the page" submit
    setSubmitted(true);
    const problems = Object.keys(errors) as (keyof Values)[];
    if (problems.length > 0) {
      setAnnouncement(`${problems.length} ${problems.length === 1 ? "field needs" : "fields need"} attention.`);
      // Move focus to the first field with a problem, in form order
      const first = (["name", "email", "size", "message"] as const).find((f) => errors[f]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setAnnouncement("");
    setStatus("sending");
    // Pretend to send it (no backend), so the loading state can be shown
    timerRef.current = window.setTimeout(() => setStatus("sent"), 900);
  }

  // Closing after a successful "send" resets the form for next time
  function handleClose() {
    if (status === "sent") {
      setValues(EMPTY);
      setTouched({});
      setSubmitted(false);
      setStatus("idle");
    }
  }

  const firstName = values.name.trim().split(" ")[0];

  // Shared props for each field: error wiring + "touched" tracking
  const fieldProps = (field: keyof Values) => ({
    id: `demo-${field}`,
    name: field,
    value: values[field],
    onBlur: () => setTouched((t) => ({ ...t, [field]: true })),
    "aria-invalid": showError(field) ? true : undefined,
    "aria-describedby": showError(field) ? `demo-${field}-error` : undefined,
    className: "field",
  });

  // A plain function (not a component defined inside this one, which React
  // would recreate on every render): returns the error line for a field, if any
  const errorText = (field: keyof Values) =>
    showError(field) ? (
      <p id={`demo-${field}-error`} className="mt-1.5 text-xs text-down">
        {errors[field]}
      </p>
    ) : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      // A click on the dimmed backdrop counts as a click on the <dialog> itself — close it
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      aria-labelledby="demo-title"
      data-lenis-prevent // let this scroll natively instead of through Lenis smooth scroll
      className="demo-dialog"
    >
      <div className="relative p-6 desktop:p-8">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-panel-2 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {status === "sent" ? (
          // ── Success ────────────────────────────────────────────
          <div className="py-6 text-center" role="status">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-up/15 text-up">
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 id="demo-title" className="mt-5 text-xl font-semibold">
              Thanks{firstName ? `, ${firstName}` : ""}!
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              This is a concept site, so no request was actually sent — but this is where you&apos;d hear from our team
              within one business day.
            </p>
            <button type="button" onClick={() => dialogRef.current?.close()} className="btn-primary mt-7">
              Done
            </button>
          </div>
        ) : (
          // ── Form ───────────────────────────────────────────────
          <>
            <h2 id="demo-title" className="pr-10 text-xl font-semibold tracking-tight">
              Book a demo
            </h2>
            <p className="mt-1.5 text-sm text-muted">A 30-minute walkthrough of PULSE, tailored to your product.</p>

            {/* noValidate: we show our own friendlier messages instead of the browser's pop-ups */}
            <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="demo-name" className="mb-1.5 block text-sm font-medium">
                  Full name
                </label>
                <input {...fieldProps("name")} type="text" autoComplete="name" autoFocus onChange={(e) => update("name", e.target.value)} />
                {errorText("name")}
              </div>

              <div>
                <label htmlFor="demo-email" className="mb-1.5 block text-sm font-medium">
                  Work email
                </label>
                <input
                  {...fieldProps("email")}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  onChange={(e) => update("email", e.target.value)}
                />
                {errorText("email")}
              </div>

              <div>
                <label htmlFor="demo-size" className="mb-1.5 block text-sm font-medium">
                  Team size
                </label>
                <select {...fieldProps("size")} onChange={(e) => update("size", e.target.value)}>
                  <option value="" disabled>
                    Choose one…
                  </option>
                  {TEAM_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} people
                    </option>
                  ))}
                </select>
                {errorText("size")}
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor="demo-message" className="block text-sm font-medium">
                    What would you like to see? <span className="font-normal text-faint">(optional)</span>
                  </label>
                  <span className={`text-[11px] tabular-nums ${values.message.length > MAX_MESSAGE ? "text-down" : "text-faint"}`}>
                    {values.message.length}/{MAX_MESSAGE}
                  </span>
                </div>
                <textarea {...fieldProps("message")} rows={3} onChange={(e) => update("message", e.target.value)} />
                {errorText("message")}
              </div>

              {/* Screen readers announce this when it changes (e.g. "2 fields need attention.") */}
              <p aria-live="polite" className="sr-only">
                {announcement}
              </p>

              <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">
                {status === "sending" ? (
                  <>
                    <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent" />
                    Sending…
                  </>
                ) : (
                  "Request demo"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
