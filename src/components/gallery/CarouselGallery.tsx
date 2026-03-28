"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

// Preload adjacent images for smoother carousel navigation
function usePreloadAdjacentImages(items: { src: any; alt: string }[], currentIndex: number) {
  const preloaded = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Preload next and previous images
    const indicesToPreload = [
      (currentIndex + 1) % items.length,
      (currentIndex - 1 + items.length) % items.length,
    ];
    
    indicesToPreload.forEach((idx) => {
      const src = items[idx]?.src;
      if (src && !preloaded.current.has(src.src || src)) {
        const img = new window.Image();
        img.src = src.src || src;
        preloaded.current.add(src.src || src);
      }
    });
  }, [currentIndex, items]);
}

export default function CarouselGallery({
  items,
  onItemClick,
  className,
}: {
  items: { src: any; alt: string }[];
  onItemClick: (index: number) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Preload adjacent images for instant navigation
  usePreloadAdjacentImages(items, index);

  const scrollTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, []);

  const prev = useCallback(() => {
    const i = Math.max(0, index - itemsPerView);
    setIndex(i); scrollTo(i);
  }, [index, itemsPerView, scrollTo]);

  const next = useCallback(() => {
    const i = Math.min(Math.max(0, items.length - itemsPerView), index + itemsPerView);
    setIndex(i); scrollTo(i);
  }, [index, items.length, itemsPerView, scrollTo]);

  // Measure items per view
  useEffect(() => {
    function measure() {
      const root = ref.current;
      if (!root) return;
      const first = root.children[0] as HTMLElement | undefined;
      const gap = 16; // gap-4
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

  // Keyboard navigation for carousel view
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    const slider = ref.current;
    if (!slider) return;
    isDown.current = true;
    slider.classList.add('active'); // Optional: for cursor grabbing style if you add css
    startX.current = e.pageX - slider.offsetLeft;
    scrollLeft.current = slider.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const slider = ref.current;
    if (!slider) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX.current) * 2; // scroll-fast
    slider.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className={className}>
      <div className="relative">
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 cursor-grab active:cursor-grabbing no-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
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
              onClick={(e) => {
                // Prevent click if dragged significantly (optional refinement, but simple click is fine for now)
                onItemClick(i)
              }}
            >
              <Image
                src={it.src}
                alt={it.alt}
                fill
                sizes="(min-width:1024px) 36vw, (min-width:768px) 48vw, 80vw"
                className="object-cover pointer-events-none"
                placeholder="blur"
                quality={75}
                priority={i <= 2}
                decoding="async"
              />
            </button>
          ))}
        </div>
        {/* Controls (desktop) */}
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
    </div>
  );
}
