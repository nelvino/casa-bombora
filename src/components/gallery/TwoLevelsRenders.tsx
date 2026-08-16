"use client";

import VillaGallery, { VillaRenderItem } from "./VillaGallery";

// Imports (required for next/image optimization)
import Backyard from "@/images/villaImages/2-levels/renders/Backyard_2Levels.w1920.webp";
import BackyardThumb from "@/images/villaImages/2-levels/renders/Backyard_2Levels.w640.webp";
import Backyard2 from "@/images/villaImages/2-levels/renders/Villa-2-levels-pool.w1920.webp";
import Backyard2Thumb from "@/images/villaImages/2-levels/renders/Villa-2-levels-pool.w640.webp";
import Bedroom1 from "@/images/villaImages/2-levels/renders/Beedroom1_2Levels.w1920.webp";
import Bedroom1Thumb from "@/images/villaImages/2-levels/renders/Beedroom1_2Levels.w640.webp";
import Bedroom2 from "@/images/villaImages/2-levels/renders/Beedroom2_2Levels.w1920.webp";
import Bedroom2Thumb from "@/images/villaImages/2-levels/renders/Beedroom2_2Levels.w640.webp";
import Livingroom from "@/images/villaImages/2-levels/renders/Livingroom_2Levels.w1920.webp";
import LivingroomThumb from "@/images/villaImages/2-levels/renders/Livingroom_2Levels.w640.webp";
import Terrace from "@/images/villaImages/2-levels/renders/Terrace_2Levels.w1920.webp";
import TerraceThumb from "@/images/villaImages/2-levels/renders/Terrace_2Levels.w640.webp";

const DATA: VillaRenderItem[] = [
  { src: Backyard, thumbSrc: BackyardThumb, group: "Backyard", alt: "Backyard" },
  { src: Backyard2, thumbSrc: Backyard2Thumb, group: "Backyard", alt: "Backyard" },
  { src: Livingroom, thumbSrc: LivingroomThumb, group: "Livingroom/Kitchen", alt: "Livingroom/Kitchen" },
  { src: Bedroom1, thumbSrc: Bedroom1Thumb, group: "Bedroom", alt: "Bedroom" },
  { src: Bedroom2, thumbSrc: Bedroom2Thumb, group: "Bedroom", alt: "Bedroom" },
  { src: Terrace, thumbSrc: TerraceThumb, group: "Terrace", alt: "Terrace" },
];

const TABS = ["All", "Backyard", "Livingroom/Kitchen", "Bedroom", "Terrace"] as const;

export default function TwoLevelsRenders({ className }: { className?: string }) {
  return <VillaGallery data={DATA} tabs={TABS} storageKey="two_levels_gallery" className={className} />;
}
