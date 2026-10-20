/*
 * An inline <script> that runs once, straight from the server-rendered HTML.
 *
 * Why the `type` trick (from the Next.js guide "Preventing flash before
 * hydration"): the script must run during the initial HTML load — that's its
 * whole job. But when React later renders the same element in the browser it
 * warns "Encountered a script tag…". Giving it type="text/plain" in the browser
 * marks it as inert data there, which silences the warning;
 * suppressHydrationWarning tells React the server/browser difference is expected.
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
