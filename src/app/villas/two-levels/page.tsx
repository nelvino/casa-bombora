import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import groundLevel from "@/images/villaImages/2-levels/2 Levels-01.webp";
import levelOne from "@/images/villaImages/2-levels/2 Levels-02.webp";
import plans from "@/images/villaImages/2 Levels arwuitectomic plans.png";
import qrCode from "@/images/QR_Code.jpeg";

export default function TwoLevelsVillaPage() {
  const images = [groundLevel, levelOne, plans, qrCode];

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
            2 Levels <span className="text-blue-green">Villa</span>
          </h1>
          <p className="mt-4 text-gunmetal/70 max-w-3xl mx-auto">
            Elegant 2‑story, 2‑bedroom layout—one bedroom on each level. An upper‑level terrace features a soaking bath; below, a beautiful backyard pool with sunbed and outdoor shower completes the resort vibe.
          </p>
        </Container>
      </section>

      <section className="pb-10 md:pb-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((src, i) => (
              <div key={i} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md bg-blue-green">
                <Image
                  src={src}
                  alt={`2 Levels Villa image ${i + 1}`}
                  fill
                  className="object-contain p-3"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-gunmetal/80">
            Scan the QR code or click{' '}
            <a
              href="https://cloud.chaos.com/collaboration/n/DKXBPD82AVntq4ibNEvbNa?pan="
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-green underline hover:text-blue-green/80"
            >
              HERE
            </a>
            {' '}to see the 3D model!
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-serif text-lg text-gunmetal mb-1">Annual ROI</h3>
              <p className="text-blue-green font-medium">17%</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-serif text-lg text-gunmetal mb-1">Location</h3>
              <p className="text-gunmetal/80">Petjatu, Uluwatu</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-serif text-lg text-gunmetal mb-1">Configuration</h3>
              <p className="text-gunmetal/80">2 Bedrooms · 2 Bathrooms · Terrace · Private Pool</p>
            </div>
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
