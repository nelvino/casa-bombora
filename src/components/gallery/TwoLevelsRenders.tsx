"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import GalleryToolbar, { GalleryMode, ModeToggle } from "./GalleryToolbar";
import CarouselGallery from "./CarouselGallery";
import GridGallery from "./GridGallery";
import GalleryLightbox from "./GalleryLightbox";

// Imports (required for next/image optimization)
import Backyard from "@/images/villaImages/2-levels/renders/Backyard_2Levels.webp";
import Backyard2 from "@/images/villaImages/2-levels/renders/Villa-2-levels-pool.jpeg";
import Bedroom1 from "@/images/villaImages/2-levels/renders/Beedroom1_2Levels.webp";
import Bedroom2 from "@/images/villaImages/2-levels/renders/Beedroom2_2Levels.webp";
import Livingroom from "@/images/villaImages/2-levels/renders/Livingroom_2Levels.webp";
import Terrace from "@/images/villaImages/2-levels/renders/Terrace_2Levels.webp";

const DATA = [
  { src: Backyard, group: "Backyard", alt: "Backyard" },
  { src: Backyard2, group: "Backyard", alt: "Backyard" },
  { src: Livingroom, group: "Livingroom/Kitchen", alt: "Livingroom/Kitchen" },
  { src: Bedroom1, group: "Bedroom", alt: "Bedroom" },
  { src: Bedroom2, group: "Bedroom", alt: "Bedroom" },
  { src: Terrace, group: "Terrace", alt: "Terrace" },
];

const TABS = ["All", "Backyard", "Livingroom/Kitchen", "Bedroom", "Terrace"] as const;

type Tab = (typeof TABS)[number];

export default function TwoLevelsRenders({ className }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("All");
  const [mode, setMode] = useState<GalleryMode>("Carousel");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = useMemo(
    () => (tab === "All" ? DATA : DATA.filter((d) => d.group === tab)),
    [tab]
  );

  // reset index when switching tabs
  useEffect(() => setLightbox(null), [tab]);

  // Restore preferences
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem("two_levels_gallery_tab");
      const savedMode = localStorage.getItem("two_levels_gallery_mode") as GalleryMode | null;
      if (savedTab && (TABS as readonly string[]).includes(savedTab)) setTab(savedTab as Tab);
      if (savedMode === "Carousel" || savedMode === "Grid") setMode(savedMode);
    } catch { }
  }, []);
  // Persist preferences
  useEffect(() => {
    try {
      localStorage.setItem("two_levels_gallery_tab", tab);
    } catch { }
  }, [tab]);
  useEffect(() => {
    try {
      localStorage.setItem("two_levels_gallery_mode", mode);
    } catch { }
  }, [mode]);

  return (
    <section className={cn("mt-5", className)}>
      <div className="mb-2 flex items-center">
        <h3 className="text-2xl font-serif text-gunmetal">Gallery</h3>
        <div className="ml-auto md:hidden">
          <ModeToggle mode={mode} onMode={setMode} />
        </div>
      </div>
      <GalleryToolbar
        tabs={TABS}
        tab={tab}
        onTab={(t) => setTab(t as Tab)}
        mode={mode}
        onMode={setMode}
      />

      {mode === "Carousel" ? (
        <CarouselGallery items={images} onItemClick={setLightbox} />
      ) : (
        <GridGallery items={images} onItemClick={setLightbox} />
      )}

      {lightbox !== null && (
        <GalleryLightbox
          items={images}
          index={lightbox}
          onChange={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
