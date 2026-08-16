"use client";

import VillaGallery, { VillaRenderItem } from "./VillaGallery";

// Imports (required for next/image optimization)
import BathDay from "@/images/villaImages/mezzanine/renders/bath-day.w1920.webp";
import BathDayThumb from "@/images/villaImages/mezzanine/renders/bath-day.w640.webp";
import BathNight from "@/images/villaImages/mezzanine/renders/bath-night.w1920.webp";
import BathNightThumb from "@/images/villaImages/mezzanine/renders/bath-night.w640.webp";
import Bathroom1 from "@/images/villaImages/mezzanine/renders/bathroom-1.w1920.webp";
import Bathroom1Thumb from "@/images/villaImages/mezzanine/renders/bathroom-1.w640.webp";
import Bathroom2 from "@/images/villaImages/mezzanine/renders/bathroom-2.w1920.webp";
import Bathroom2Thumb from "@/images/villaImages/mezzanine/renders/bathroom-2.w640.webp";
import Bathroom3 from "@/images/villaImages/mezzanine/renders/bathroom-3.w1920.webp";
import Bathroom3Thumb from "@/images/villaImages/mezzanine/renders/bathroom-3.w640.webp";

import Bedroom1 from "@/images/villaImages/mezzanine/renders/bedroom-1.w1920.webp";
import Bedroom1Thumb from "@/images/villaImages/mezzanine/renders/bedroom-1.w640.webp";
import Bedroom2 from "@/images/villaImages/mezzanine/renders/bedroom-2.w1920.webp";
import Bedroom2Thumb from "@/images/villaImages/mezzanine/renders/bedroom-2.w640.webp";

import Livingroom from "@/images/villaImages/mezzanine/renders/livingroom.w1920.webp";
import LivingroomThumb from "@/images/villaImages/mezzanine/renders/livingroom.w640.webp";
import Livingroom2 from "@/images/villaImages/mezzanine/renders/livingroom-2.w1920.webp";
import Livingroom2Thumb from "@/images/villaImages/mezzanine/renders/livingroom-2.w640.webp";
import Dining from "@/images/villaImages/mezzanine/renders/dinning.w1920.webp";
import DiningThumb from "@/images/villaImages/mezzanine/renders/dinning.w640.webp";

import FrontDay from "@/images/villaImages/mezzanine/renders/front-day.w1920.webp";
import FrontDayThumb from "@/images/villaImages/mezzanine/renders/front-day.w640.webp";
import FrontFacade from "@/images/villaImages/mezzanine/renders/front-facade.w1920.webp";
import FrontFacadeThumb from "@/images/villaImages/mezzanine/renders/front-facade.w640.webp";
import FrontNight from "@/images/villaImages/mezzanine/renders/front-night.w1920.webp";
import FrontNightThumb from "@/images/villaImages/mezzanine/renders/front-night.w640.webp";

import BackArea from "@/images/villaImages/mezzanine/renders/back-area.w1920.webp";
import BackAreaThumb from "@/images/villaImages/mezzanine/renders/back-area.w640.webp";
import PoolDay from "@/images/villaImages/mezzanine/renders/pool-day.w1920.webp";
import PoolDayThumb from "@/images/villaImages/mezzanine/renders/pool-day.w640.webp";
import PoolNight from "@/images/villaImages/mezzanine/renders/pool-night.w1920.webp";
import PoolNightThumb from "@/images/villaImages/mezzanine/renders/pool-night.w640.webp";

import Workstation1 from "@/images/villaImages/mezzanine/renders/workstation-1.w1920.webp";
import Workstation1Thumb from "@/images/villaImages/mezzanine/renders/workstation-1.w640.webp";
import Workstation2 from "@/images/villaImages/mezzanine/renders/workstation-2.w1920.webp";
import Workstation2Thumb from "@/images/villaImages/mezzanine/renders/workstation-2.w640.webp";

import Stairs from "@/images/villaImages/mezzanine/renders/stairs.w1920.webp";
import StairsThumb from "@/images/villaImages/mezzanine/renders/stairs.w640.webp";

const DATA: VillaRenderItem[] = [
  // Exterior
  { src: FrontFacade, thumbSrc: FrontFacadeThumb, group: "Exterior", alt: "Front Facade" },
  { src: FrontDay, thumbSrc: FrontDayThumb, group: "Exterior", alt: "Front Day View" },
  { src: FrontNight, thumbSrc: FrontNightThumb, group: "Exterior", alt: "Front Night View" },
  // Pool/Backyard
  { src: BackArea, thumbSrc: BackAreaThumb, group: "Pool/Backyard", alt: "Backyard Area" },
  { src: PoolDay, thumbSrc: PoolDayThumb, group: "Pool/Backyard", alt: "Pool Day View" },
  { src: PoolNight, thumbSrc: PoolNightThumb, group: "Pool/Backyard", alt: "Pool Night View" },
  // Living/Dining
  { src: Livingroom, thumbSrc: LivingroomThumb, group: "Living/Dining", alt: "Living Room" },
  { src: Livingroom2, thumbSrc: Livingroom2Thumb, group: "Living/Dining", alt: "Living Room" },
  { src: Dining, thumbSrc: DiningThumb, group: "Living/Dining", alt: "Dining Area" },
  // Bedroom
  { src: Bedroom1, thumbSrc: Bedroom1Thumb, group: "Bedroom", alt: "Bedroom" },
  { src: Bedroom2, thumbSrc: Bedroom2Thumb, group: "Bedroom", alt: "Bedroom" },
  // Bathroom
  { src: BathDay, thumbSrc: BathDayThumb, group: "Bathroom", alt: "Bathroom Day View" },
  { src: BathNight, thumbSrc: BathNightThumb, group: "Bathroom", alt: "Bathroom Night View" },
  { src: Bathroom1, thumbSrc: Bathroom1Thumb, group: "Bathroom", alt: "Bathroom" },
  { src: Bathroom2, thumbSrc: Bathroom2Thumb, group: "Bathroom", alt: "Bathroom" },
  { src: Bathroom3, thumbSrc: Bathroom3Thumb, group: "Bathroom", alt: "Bathroom" },
  // Workstation
  { src: Workstation1, thumbSrc: Workstation1Thumb, group: "Workstation", alt: "Workstation" },
  { src: Workstation2, thumbSrc: Workstation2Thumb, group: "Workstation", alt: "Workstation" },
  // Stairs
  { src: Stairs, thumbSrc: StairsThumb, group: "Interior", alt: "Stairs" },
];

const TABS = ["All", "Exterior", "Pool/Backyard", "Living/Dining", "Bedroom", "Bathroom", "Workstation", "Interior"] as const;

export default function MezzanineRenders({ className }: { className?: string }) {
  return <VillaGallery data={DATA} tabs={TABS} storageKey="mezz_gallery" className={className} />;
}
