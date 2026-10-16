import { AnswerIllustration, InstallIllustration, TrackIllustration } from "@/components/how-it-works/StepIllustrations";

const STEPS = [
  {
    title: "Install the SDK",
    description: "Add one package and a single line of setup. Works with React, Vue, iOS, Android and your backend.",
    Illustration: InstallIllustration,
  },
  {
    title: "Track what matters",
    description: "Send the events you care about — signups, purchases, feature use. PULSE handles the volume, from day one to billions.",
    Illustration: TrackIllustration,
  },
  {
    title: "Ask, and get answers",
    description: "Build funnels, cohorts and dashboards in a few clicks. Every chart answers a real question about your product.",
    Illustration: AnswerIllustration,
  },
];

/*
 * "How it works": three step cards, each with a small animated illustration.
 * A Server Component — the only browser code is inside the illustrations.
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="heading">
            From install to insight <span className="text-gradient">in an afternoon.</span>
          </h2>
          <p className="lead mx-auto mt-5">No data team, no SQL, no six-week setup. Three steps and you&apos;re reading real answers.</p>
        </div>

        {/* <ol> because the order matters — screen readers announce "1 of 3" */}
        <ol className="mt-14 grid grid-cols-1 gap-5 desktop:mt-16 desktop:grid-cols-3">
          {STEPS.map(({ title, description, Illustration }, i) => (
            <li key={title} className="reveal card flex flex-col overflow-hidden">
              <div className="h-[210px] border-b border-line p-4">
                <Illustration />
              </div>
              <div className="p-6">
                <div className="mb-3 font-mono text-xs text-accent-hi">0{i + 1}</div>
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
