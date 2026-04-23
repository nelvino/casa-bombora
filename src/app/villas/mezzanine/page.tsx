import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RoiWithCards from "@/components/roi/RoiWithCards";
import MezzanineRenders from "@/components/gallery/MezzanineRenders";

import mezzanineGround from "@/images/villaImages/mezzanine/Mezzanine-01.webp";
import mezzaninePlan from "@/images/villaImages/mezzanine/Mezzanine-02.webp";

export default function MezzanineVillaPage() {
  const images = [
    { src: mezzanineGround, caption: "Ground level" },
    { src: mezzaninePlan, caption: "Mezzanine level" },
  ];

  return (
    <main className="bg-alabaster relative">
      <section className="py-10 md:py-16">
        <Container className="text-center">
          <div className="text-left mb-4 md:mb-6">
            <Link href="/#projects">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-gunmetal">
            Mezzanine <span className="text-blue-green">Villa</span>
          </h1>
          <p className="mt-4 text-gunmetal/70 max-w-3xl mx-auto">
            Compact mezzanine concept: bedroom upstairs for privacy; open living room and kitchen downstairs for relaxed entertaining.
            Lush greenery frames a backyard pool with sunbed and an outdoor bath for spa‑like evenings.
          </p>
        </Container>
      </section>

      <section className="pb-2 md:pb-3">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map(({ src, caption }, i) => (
              <div key={i}>
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md bg-blue-green">
                  <Image
                    src={src}
                    alt={`Mezzanine Villa image ${i + 1}`}
                    fill
                    className="object-contain p-2 pb-14"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  {caption && (
                    <p className="absolute bottom-0 left-0 right-0 text-center text-white text-md md:text-lg">{caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ROI Calculator + dynamic cards */}
          <div className="mt-8">
            <RoiWithCards
              investmentMin={120_000}
              investmentMax={140_000}
              defaultInvestment={130_000}
              rateMin={120}
              rateMax={280}
              defaultRate={180}
              occupancyMin={65}
              occupancyMax={90}
              defaultOccupancy={75}
              managementFeeDefault={20}
              managementFeeMin={15}
              managementFeeMax={25}
              taxPercent={10}
              currency="USD"
              location="Petjatu, Uluwatu"
              configuration="1 Bedroom · 1 Bathroom · Mezzanine · Private Pool"
              leaseYears={25}
            />
          </div>
        </Container>
      </section>
      <section className="pb-4 md:pb-5">
        <Container>
          <MezzanineRenders />
        </Container>
        <div className="mt-10 flex justify-center">
          <Link href="/#contact">
            <Button size="lg">Register Interest</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
