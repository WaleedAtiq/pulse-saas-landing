/*
 * Loads GSAP + ScrollTrigger on demand, instead of with the page.
 *
 * Why: a normal `import gsap from "gsap"` puts GSAP (~45 KB gzipped together
 * with ScrollTrigger and Lenis) into the JavaScript the browser downloads
 * BEFORE it shows anything. Nothing needs GSAP until the page is already on
 * screen, so components call loadGsap() inside useEffect instead — the
 * browser paints first and fetches GSAP right after. On a slow phone that
 * makes the first paint noticeably faster (it's what moved the mobile
 * Lighthouse score).
 *
 * The promise is created once and shared, so every component that asks gets
 * the same copy and the files are only downloaded once.
 */
type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let loading: Promise<GsapModules> | undefined;

export function loadGsap(): Promise<GsapModules> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loading;
}
