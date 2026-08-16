"use client";

import Image from "next/image";
import type { VillaRenderItem } from "./VillaGallery";

export default function GridGallery({
  items,
  onItemClick,
  className,
}: {
  items: readonly VillaRenderItem[];
  onItemClick: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <button key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gunmetal/5" onClick={() => onItemClick(i)}>
            <Image
              src={it.thumbSrc ?? it.src}
              alt={it.alt}
              fill
              className="object-cover"
              placeholder="blur"
              quality={80}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              decoding="async"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
