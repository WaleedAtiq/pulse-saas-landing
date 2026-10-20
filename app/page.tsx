import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollEffects from "@/components/ScrollEffects";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Features from "@/components/sections/Features";
import Metrics from "@/components/sections/Metrics";
import HowItWorks from "@/components/sections/HowItWorks";
import Integrations from "@/components/sections/Integrations";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import DemoRequest from "@/components/demo/DemoRequest";

/*
 * The page shell: Nav on top, sections in <main>, Footer at the bottom.
 * This is a Server Component — it renders to static HTML at build time. Only
 * the interactive pieces inside it (Nav, charts, live widgets) are Client Components.
 *
 * The sections below appear in page order. Each one lives in
 * components/sections/ and its content/data in lib/.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <ScrollEffects />
      <Nav />

      <main id="top">
        <Hero />
        <SocialProof />
        <Features />
        <Metrics />
        <HowItWorks />
        <Integrations />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <Footer />

      {/* The "Book a demo" dialog — mounted once, opened by any [data-demo-trigger] button */}
      <DemoRequest />
    </>
  );
}
