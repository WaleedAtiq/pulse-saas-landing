import PricingTable from "@/components/pricing/PricingTable";

/*
 * Pricing: heading, the interactive PricingTable (toggle + 3 tiers), and an
 * Enterprise strip for customers who outgrow the self-serve plans.
 */
export default function Pricing() {
  return (
    <section id="pricing" className="section isolate overflow-hidden">
      {/* Glow behind the highlighted middle card */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[600px] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <h2 className="heading">
            Simple pricing that <span className="text-gradient">scales with you.</span>
          </h2>
          <p className="lead mx-auto mt-5">
            Start free. Upgrade when you need more events, history or seats — no surprise bills.
          </p>
        </div>

        <PricingTable />

        {/* Enterprise strip */}
        <div className="reveal card mt-5 flex flex-col gap-5 p-7 desktop:flex-row desktop:items-center desktop:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Enterprise</h3>
            <p className="mt-1 text-sm text-muted">
              1B+ events a month, custom contracts, SAML SSO, audit logs and a dedicated success manager.
            </p>
          </div>
          <a href="#" className="btn-ghost shrink-0">
            Talk to sales <span aria-hidden="true">→</span>
          </a>
        </div>

        <p className="reveal mt-6 text-center text-xs text-faint">Prices in USD, excluding tax. Concept pricing for a fictional product.</p>
      </div>
    </section>
  );
}
