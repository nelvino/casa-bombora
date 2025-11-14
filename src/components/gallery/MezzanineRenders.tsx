"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import GalleryToolbar, { GalleryMode, ModeToggle } from "./GalleryToolbar";
import CarouselGallery from "./CarouselGallery";
import GridGallery from "./GridGallery";
import GalleryLightbox from "./GalleryLightbox";

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
  const [mode, setMode] = useState<GalleryMode>("Carousel");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = useMemo(() => (tab === "All" ? DATA : DATA.filter((d) => d.group === tab)), [tab]);

  // reset index when switching tabs
  useEffect(() => setLightbox(null), [tab]);

  // Restore preferences
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem("mezz_gallery_tab");
      const savedMode = localStorage.getItem("mezz_gallery_mode") as GalleryMode | null;
      if (savedTab && (TABS as readonly string[]).includes(savedTab)) setTab(savedTab as Tab);
      if (savedMode === "Carousel" || savedMode === "Grid") setMode(savedMode);
    } catch {}
  }, []);
  // Persist preferences
  useEffect(() => {
    try { localStorage.setItem("mezz_gallery_tab", tab); } catch {}
  }, [tab]);
  useEffect(() => {
    try { localStorage.setItem("mezz_gallery_mode", mode); } catch {}
  }, [mode]);

  return (
    <section className={cn("mt-5", className)}>
      <div className="mb-2 flex items-center">
        <h3 className="text-2xl font-serif text-gunmetal">Gallery</h3>
        <div className="ml-auto md:hidden">
          <ModeToggle mode={mode} onMode={setMode} />
        </div>
      </div>
      <GalleryToolbar tabs={TABS} tab={tab} onTab={(t) => setTab(t as Tab)} mode={mode} onMode={setMode} />

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
