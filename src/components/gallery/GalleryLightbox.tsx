"use client";

import { useMemo } from "react";
import type { StaticImageData } from "next/image";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";

export type LightboxItem = { src: StaticImageData; thumbSrc?: StaticImageData; alt: string; caption?: string };

export default function GalleryLightbox({
  items,
  index,
  onChange,
  onClose,
}: {
  items: readonly LightboxItem[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const slides = useMemo(
    () =>
      items.map((it) => {
        const full = { src: it.src.src, width: it.src.width, height: it.src.height };
        const thumb = it.thumbSrc ? { src: it.thumbSrc.src, width: it.thumbSrc.width, height: it.thumbSrc.height } : undefined;
        return {
          ...full,
          alt: it.alt,
          description: it.caption,
          thumbnail: (it.thumbSrc ?? it.src).src,
          // ascending by width: lets Zoom pick the highest-res source when zoomed in
          srcSet: thumb ? [thumb, full] : undefined,
        };
      }),
    [items]
  );

  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      on={{ view: ({ index: i }) => onChange(i) }}
      plugins={[Zoom, Thumbnails, Captions, Counter]}
      animation={{ swipe: 250 }}
      carousel={{ preload: 1, imageFit: "contain" }}
      zoom={{
        maxZoomPixelRatio: 4,
        scrollToZoom: true,
        pinchZoomV4: true,
        doubleClickMaxStops: 2,
        doubleTapDelay: 300,
      }}
      thumbnails={{ position: "bottom", border: 0, padding: 0, gap: 8, imageFit: "cover" }}
      controller={{ closeOnBackdropClick: true, closeOnPullUp: true, closeOnPullDown: true }}
      styles={{ container: { backgroundColor: "rgb(15, 20, 25)" } }}
    />
  );
}
