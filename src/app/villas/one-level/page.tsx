import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RoiWithCards from "@/components/roi/RoiWithCards";

import oneLevelPng from "@/images/villaImages/1-level/1 Level-01.webp";

export default function OneLevelVillaPage() {
  const images = [{ src: oneLevelPng, caption: "Ground level" }];

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
            1 Level <span className="text-blue-green">Villa</span>
          </h1>
          <p className="mt-4 text-gunmetal/70 max-w-3xl mx-auto">
            Thoughtfully designed 1‑story, 1‑bedroom villa with a cosy indoor–outdoor flow.
            A private backyard pool with a sunbed creates a calm retreat for lazy afternoons and evening dips.
          </p>
        </Container>
      </section>

      <section className="pb-10 md:pb-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map(({ src, caption }, i) => (
              <div key={i} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md bg-blue-green">
                <Image
                  src={src}
                  alt={`1 Level Villa image ${i + 1}`}
                  fill
                  className="object-contain p-2 pb-14"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={i === 0}
                />
                {caption && (
                  <p className="absolute bottom-0 left-0 right-0 text-center text-white text-md md:text-lg">{caption}</p>
                )}
              </div>
            ))}
          </div>

          {/* ROI Calculator + dynamic cards */}
          <div className="mt-8">
            <RoiWithCards
              investmentMin={100_000}
              investmentMax={120_000}
              defaultInvestment={110_000}
              rateMin={80}
              rateMax={250}
              defaultRate={140}
              occupancyMin={65}
              occupancyMax={90}
              defaultOccupancy={75}
              managementFeeDefault={20}
              managementFeeMin={15}
              managementFeeMax={25}
              taxPercent={10}
              currency="USD"
              location="Petjatu, Uluwatu"
              configuration="1 Bedroom · 1 Bathroom · Private Pool"
              leaseYears={25}
            />
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/#contact">
              <Button size="lg">Register Interest</Button>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
