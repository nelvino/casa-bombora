import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Introduction } from "@/components/sections/Introduction";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
// import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/sections/FAQ";
import { Portfolio } from "@/components/sections/Portfolio";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="relative overflow-hidden py-5 bg-gunmetal text-alabaster border-y border-white/5">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-gunmetal to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-gunmetal to-transparent" />
          <Marquee duration={40}>
            <div className="flex shrink-0 items-center gap-10 px-6">
              {['Invest', 'Design', 'Build', 'Manage', 'Uluwatu', 'Bali', '18–28% ROI'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-3 text-sm md:text-base font-medium uppercase tracking-widest text-alabaster/70"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-green" />
                  {item}
                </span>
              ))}
            </div>
          </Marquee>
        </section>
        <Introduction />
        <Services />
        <Process />
        <Projects />
        <Portfolio />
        <FAQ />
        {/* <Testimonials /> */}
        <Contact />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
