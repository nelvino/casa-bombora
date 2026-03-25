"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

export type LightboxItem = { src: any; alt: string; caption?: string };

export default function GalleryLightbox({
  items,
  index,
  onChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Focus trap + restore
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); handleClose(); }
      if (e.key === "ArrowLeft") onChange(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onChange(Math.min(items.length - 1, index + 1));
      if (e.key === "Tab") {
        // trap within lightbox buttons
        const focusables = containerRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables || focusables.length === 0) return;
        const list = Array.from(focusables);
        const current = document.activeElement as HTMLElement | null;
        const i = Math.max(0, list.indexOf(current || list[0]));
        e.preventDefault();
        const next = e.shiftKey ? list[(i - 1 + list.length) % list.length] : list[(i + 1) % list.length];
        next.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length]);

  function handleClose() {
    setScale(1); setTx(0); setTy(0);
    onClose();
  }

  // Zoom controls
  function toggleZoom() {
    setScale((s) => (s > 1 ? 1 : 2));
    if (scale <= 1) { setTx(0); setTy(0); }
  }

  function onWheel(e: React.WheelEvent) {
    const delta = -e.deltaY * 0.001;
    setScale((s) => {
      const ns = Math.min(3, Math.max(1, s + delta));
      if (ns === 1) { setTx(0); setTy(0); }
      return ns;
    });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (scale === 1) return;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    last.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setTx((v) => v + dx);
    setTy((v) => v + dy);
  }
  function onPointerUp(e: React.PointerEvent) {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  // Swipe logic
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gunmetal/80 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl aspect-[16/10]"
        onWheel={onWheel}
        onDoubleClick={(e) => { e.stopPropagation(); toggleZoom(); }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag={scale === 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                if (index < items.length - 1) onChange(index + 1);
              } else if (swipe > swipeConfidenceThreshold) {
                if (index > 0) onChange(index - 1);
              }
            }}
            style={{
              touchAction: scale === 1 ? "pan-y" : "none",
              cursor: scale === 1 ? "grab" : "default"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[index].src}
              alt={items[index].alt}
              fill
              className="object-contain"
              placeholder="blur"
              quality={85}
              sizes="90vw"
              priority
              style={{
                transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                transition: dragging.current ? "none" : "transform 120ms ease",
                pointerEvents: scale > 1 ? "auto" : "none" // Allow pointer events on image only when zoomed for panning
              }}
              draggable={false}
              onPointerDown={(e) => {
                if (scale > 1) { e.stopPropagation(); onPointerDown(e); }
              }}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          </motion.div>
        </AnimatePresence>

        {items[index].caption && (
          <div className="absolute left-3 bottom-3 text-sm px-2.5 py-1 rounded bg-gunmetal/70 text-white z-10">
            {items[index].caption}
          </div>
        )}
        {/* Controls */}
        <button
          aria-label="Previous image"
          onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, index - 1)); }}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white z-20"
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          onClick={(e) => { e.stopPropagation(); onChange(Math.min(items.length - 1, index + 1)); }}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white z-20"
        >
          ›
        </button>
        <button
          aria-label="Close"
          ref={closeBtnRef}
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 h-9 w-9 rounded-full bg-white/90 border border-gunmetal/10 text-gunmetal shadow hover:bg-white flex items-center justify-center z-20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
