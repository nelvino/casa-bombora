"use client";

import { useEffect, useMemo, useState } from "react";
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/utils/cn";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import GalleryToolbar, { GalleryMode, ModeToggle } from "./GalleryToolbar";
import CarouselGallery from "./CarouselGallery";
import GridGallery from "./GridGallery";
import GalleryLightbox from "./GalleryLightbox";

export type VillaRenderItem = {
  src: StaticImageData;
  thumbSrc?: StaticImageData;
  group: string;
  alt: string;
};

export default function VillaGallery({
  data,
  tabs,
  storageKey,
  className,
}: {
  data: readonly VillaRenderItem[];
  tabs: readonly string[];
  storageKey: string;
  className?: string;
}) {
  const [tab, setTab] = useLocalStorage<string>(
    `${storageKey}_tab`,
    tabs[0],
    (v): v is string => (tabs as readonly string[]).includes(v)
  );
  const [mode, setMode] = useLocalStorage<GalleryMode>(
    `${storageKey}_mode`,
    "Carousel",
    (v): v is GalleryMode => v === "Carousel" || v === "Grid"
  );
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = useMemo(() => (tab === tabs[0] ? data : data.filter((d) => d.group === tab)), [data, tab, tabs]);

  // reset index when switching tabs
  useEffect(() => setLightbox(null), [tab]);

  return (
    <section className={cn("mt-5", className)}>
      <div className="mb-2 flex items-center">
        <h3 className="text-2xl font-serif text-gunmetal">Gallery</h3>
        <div className="ml-auto md:hidden">
          <ModeToggle mode={mode} onMode={setMode} />
        </div>
      </div>
      <GalleryToolbar tabs={tabs} tab={tab} onTab={setTab} mode={mode} onMode={setMode} />

      {mode === "Carousel" ? (
        <CarouselGallery items={images} onItemClick={setLightbox} />
      ) : (
        <GridGallery items={images} onItemClick={setLightbox} />
      )}

      {lightbox !== null && (
        <GalleryLightbox items={images} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
