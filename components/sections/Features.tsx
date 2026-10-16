import FeatureTabs from "@/components/features/FeatureTabs";

/*
 * Features section: a centered heading, then the interactive tabs.
 * The heading is static (Server Component); only FeatureTabs runs in the browser.
 * id="features" is the target of the Nav link and the Hero's "See how it works".
 */
export default function Features() {
  return (
    // `isolate` keeps the glow behind the preview window inside this section
    <section id="features" className="section isolate overflow-hidden">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Features</span>
          <h2 className="heading">
            Every answer, <span className="text-gradient">one click away.</span>
          </h2>
          <p className="lead mx-auto mt-5">
            Four views cover the questions product teams ask most. Pick one — the dashboard below is live.
          </p>
        </div>

        <FeatureTabs />
      </div>
    </section>
  );
}
