"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

// Imports (required for next/image optimization)
import Backyard_0 from "@/images/villaImages/mezzanine/renders/Backyard_Mezzanine.jpg";
import Backyard_1 from "@/images/villaImages/mezzanine/renders/Backyard_Mezzanine1.jpg";
import Backyard_2 from "@/images/villaImages/mezzanine/renders/Backyard_Mezzanine2.jpg";
import Backyard_3 from "@/images/villaImages/mezzanine/renders/Backyard_Mezzanine3.jpg";

import Bathroom_0 from "@/images/villaImages/mezzanine/renders/Bathroom_Mezzanine.jpg";
import Bathroom_1 from "@/images/villaImages/mezzanine/renders/Bathroom_Mezzanine1.jpg";
import Bathroom_2 from "@/images/villaImages/mezzanine/renders/Bathroom_Mezzanine2.jpg";

import Bedroom_1 from "@/images/villaImages/mezzanine/renders/Bedroom_Mezzanine1.jpg";
import Bedroom_2 from "@/images/villaImages/mezzanine/renders/Bedroom_Mezzanine2.jpg";
import Bedroom_3 from "@/images/villaImages/mezzanine/renders/Bedroom_Mezzanine3.jpg";

import Living_0 from "@/images/villaImages/mezzanine/renders/Livingroom_Mezzanine.jpg";
import Living_1 from "@/images/villaImages/mezzanine/renders/Livingroom_Mezzanine1.jpg";
import Living_2 from "@/images/villaImages/mezzanine/renders/Livingroom_Mezzanine2.jpg";
import Living_3 from "@/images/villaImages/mezzanine/renders/Livingroom_Mezzanine3.jpg";

import Scene14 from "@/images/villaImages/mezzanine/renders/Scene 14 Edit.jpg";

const DATA = [
  { src: Backyard_0, group: "Backyard", alt: "Backyard" },
  { src: Backyard_1, group: "Backyard", alt: "Backyard" },
  { src: Backyard_2, group: "Backyard", alt: "Backyard" },
  { src: Backyard_3, group: "Backyard", alt: "Backyard" },
  { src: Living_0, group: "Livingroom/Kitchen", alt: "Livingroom/Kitchen" },
  { src: Living_1, group: "Livingroom/Kitchen", alt: "Livingroom/Kitchen" },
  { src: Living_2, group: "Livingroom/Kitchen", alt: "Livingroom/Kitchen" },
  { src: Living_3, group: "Livingroom/Kitchen", alt: "Livingroom/Kitchen" },
  { src: Bedroom_1, group: "Bedroom", alt: "Bedroom" },
  { src: Bedroom_2, group: "Bedroom", alt: "Bedroom" },
  { src: Bedroom_3, group: "Bedroom", alt: "Bedroom" },
  { src: Bathroom_0, group: "Bathroom", alt: "Bathroom" },
  { src: Bathroom_1, group: "Bathroom", alt: "Bathroom" },
  { src: Bathroom_2, group: "Bathroom", alt: "Bathroom" },
  { src: Scene14, group: "Other", alt: "Scene" },
];

const TABS = ["All", "Backyard", "Livingroom/Kitchen", "Bedroom", "Bathroom"] as const;

type Tab = typeof TABS[number];

export default function MezzanineRenders({ className }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("All");
  const images = useMemo(() => {
    return tab === "All" ? DATA : DATA.filter((d) => d.group === tab);
  }, [tab]);

  return (
    <section className={cn("mt-5", className)}>
      <h3 className="text-2xl font-serif text-gunmetal mb-4">Gallery</h3>

      {/* Tabs */}
      <div className="inline-flex rounded-md border border-gunmetal/20 bg-white p-1 shadow-sm mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              t === tab ? "bg-blue-green text-white" : "text-gunmetal hover:bg-gunmetal/5"
            )}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <Carousel items={images} />
    </section>
  );
}

function Carousel({ items }: { items: { src: any; alt: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const scrollTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, []);

  const prev = useCallback(() => {
    const i = Math.max(0, index - 1);
    setIndex(i); scrollTo(i);
  }, [index, scrollTo]);

  const next = useCallback(() => {
    const i = Math.min(items.length - 1, index + 1);
    setIndex(i); scrollTo(i);
  }, [index, items.length, scrollTo]);

  return (
    <div>
      <div className="relative">
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2"
          onScroll={(e) => {
            const el = e.currentTarget;
            // compute nearest snap index
            const w = el.clientWidth;
            const childWidth = (el.children[0] as HTMLElement)?.clientWidth || w;
            const i = Math.round(el.scrollLeft / (childWidth + 16));
            setIndex(Math.max(0, Math.min(items.length - 1, i)));
          }}
        >
          {items.map((it, i) => (
            <button
              key={i}
              className="snap-center shrink-0 relative w-[80vw] md:w-[48%] lg:w-[36%] aspect-[4/3] rounded-lg overflow-hidden bg-gunmetal/5"
              onClick={() => setLightbox(i)}
            >
              <Image src={it.src} alt={it.alt} fill sizes="(min-width:1024px) 36vw, (min-width:768px) 48vw, 80vw" className="object-cover" />
            </button>
          ))}
        </div>
        {/* Controls */}
        <button
          aria-label="Previous"
          onClick={prev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); scrollTo(i); }}
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              i === index ? "bg-blue-green" : "bg-gunmetal/30"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-gunmetal/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-5xl aspect-[16/10]">
            <Image src={items[lightbox].src} alt={items[lightbox].alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
