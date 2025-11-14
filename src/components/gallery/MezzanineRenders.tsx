"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
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
  const [mode, setMode] = useState<"Carousel" | "Grid">("Carousel");
  const images = useMemo(() => {
    return tab === "All" ? DATA : DATA.filter((d) => d.group === tab);
  }, [tab]);

  return (
    <section className={cn("mt-5", className)}>
      <h3 className="text-2xl font-serif text-gunmetal mb-4">Gallery</h3>

      {/* Tabs + View toggle in one row */}
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex rounded-md border border-gunmetal/20 bg-white p-1 shadow-sm">
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
        <div className="ml-auto inline-flex rounded-md border border-gunmetal/20 bg-white p-1 shadow-sm">
          {(["Carousel", "Grid"] as const).map((m) => (
            <button
              key={m}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                m === mode ? "bg-blue-green text-white" : "text-gunmetal hover:bg-gunmetal/5"
              )}
              onClick={() => setMode(m)}
              aria-pressed={m === mode}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      {mode === "Carousel" ? (
        <Carousel items={images} />
      ) : (
        <GridGallery items={images} />
      )}
    </section>
  );
}

function Carousel({ items }: { items: { src: any; alt: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [itemsPerView, setItemsPerView] = useState(1);

  const scrollTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, []);

  const prev = useCallback(() => {
    const i = Math.max(0, index - itemsPerView);
    setIndex(i); scrollTo(i);
  }, [index, scrollTo, itemsPerView]);

  const next = useCallback(() => {
    const i = Math.min(Math.max(0, items.length - itemsPerView), index + itemsPerView);
    setIndex(i); scrollTo(i);
  }, [index, items.length, scrollTo, itemsPerView]);

  // Measure items per view (based on container and first child widths)
  useEffect(() => {
    function measure() {
      const root = ref.current;
      if (!root) return;
      const first = root.children[0] as HTMLElement | undefined;
      const gap = 16; // tailwind gap-4
      const childW = first?.clientWidth || root.clientWidth;
      const per = Math.max(1, Math.floor((root.clientWidth + gap) / (childW + gap)));
      setItemsPerView(per);
    }
    measure();
    const root = ref.current;
    if (!root) return;
    const obs = new ResizeObserver(measure);
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightbox !== null) {
        if (e.key === "Escape") setLightbox(null);
        if (e.key === "ArrowLeft") setLightbox((v) => (v !== null ? Math.max(0, v - 1) : v));
        if (e.key === "ArrowRight") setLightbox((v) => (v !== null ? Math.min(items.length - 1, v + 1) : v));
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, lightbox, items.length]);

  return (
    <div>
      <div className="relative">
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2"
          onScroll={(e) => {
            const el = e.currentTarget;
            const childWidth = (el.children[0] as HTMLElement)?.clientWidth || el.clientWidth;
            const step = childWidth + 16; // gap-4
            const firstVisible = Math.round(el.scrollLeft / step);
            setIndex(Math.max(0, Math.min(items.length - 1, firstVisible)));
          }}
        >
          {items.map((it, i) => (
            <button
              key={i}
              className="snap-center shrink-0 relative w-[80vw] md:w-[48%] lg:w-[36%] aspect-[4/3] rounded-lg overflow-hidden bg-gunmetal/5"
              onClick={() => setLightbox(i)}
            >
              <Image
                src={it.src}
                alt={it.alt}
                fill
                sizes="(min-width:1024px) 36vw, (min-width:768px) 48vw, 80vw"
                className="object-cover"
                placeholder="blur"
                quality={80}
              />
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
            <Image
              src={items[lightbox].src}
              alt={items[lightbox].alt}
              fill
              className="object-contain"
              placeholder="blur"
              quality={90}
            />
            {/* Lightbox controls */}
            <button
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, (lightbox ?? 0) - 1)); }}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white"
            >
              ‹
            </button>
            <button
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(items.length - 1, (lightbox ?? 0) + 1)); }}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white"
            >
              ›
            </button>
            <button
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-3 right-8 sm:right-12 md:right-20 h-9 w-9 rounded-full bg-white/90 border border-gunmetal/10 text-gunmetal shadow hover:bg-white flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GridGallery({ items }: { items: { src: any; alt: string }[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <button key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gunmetal/5" onClick={() => setLightbox(i)}>
            <Image src={it.src} alt={it.alt} fill className="object-cover" placeholder="blur" quality={80} />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-gunmetal/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-5xl aspect-[16/10]">
            <Image src={items[lightbox].src} alt={items[lightbox].alt} fill className="object-contain" placeholder="blur" quality={90} />
            <button
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-6 right-6 h-9 w-9 rounded-full bg-white/90 border border-gunmetal/10 text-gunmetal shadow hover:bg-white flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
