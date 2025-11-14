"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const last = useRef<{x:number;y:number}>({x:0,y:0});
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

  return (
    <div className="fixed inset-0 z-50 bg-gunmetal/80 flex items-center justify-center p-4" onClick={handleClose}>
      <div ref={containerRef} className="relative w-full max-w-5xl aspect-[16/10]" onWheel={onWheel} onDoubleClick={(e)=>{e.stopPropagation(); toggleZoom();}}>
        <Image
          src={items[index].src}
          alt={items[index].alt}
          fill
          className="object-contain"
          placeholder="blur"
          quality={90}
          style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transition: dragging.current ? "none" : "transform 120ms ease" }}
          onPointerDown={(e)=>{e.stopPropagation(); onPointerDown(e);}}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {items[index].caption && (
          <div className="absolute left-3 bottom-3 text-sm px-2.5 py-1 rounded bg-gunmetal/70 text-white">
            {items[index].caption}
          </div>
        )}
        {/* Controls */}
        <button
          aria-label="Previous image"
          onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, index - 1)); }}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white"
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          onClick={(e) => { e.stopPropagation(); onChange(Math.min(items.length - 1, index + 1)); }}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow border border-gunmetal/10 hover:bg-white"
        >
          ›
        </button>
        <button
          aria-label="Close"
          ref={closeBtnRef}
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="absolute top-3 right-8 sm:right-12 md:right-20 h-9 w-9 rounded-full bg-white/90 border border-gunmetal/10 text-gunmetal shadow hover:bg-white flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
