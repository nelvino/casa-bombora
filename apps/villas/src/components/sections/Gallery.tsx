'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { blurFor } from '@/lib/data/image-blur'

// Descriptive alt text from the filename: "bedroom-mezzanine.webp" → "bedroom mezzanine"
function labelFor(src: string): string {
  const file = src.split('/').pop() ?? ''
  return file.replace(/\.[a-z0-9]+$/i, '').replace(/-/g, ' ')
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

interface GalleryProps {
  images: string[]
  alt: string
}

interface GestureState {
  mode: 'idle' | 'pending' | 'swipe' | 'pan' | 'pinch'
  x0: number
  y0: number
  dx: number
  dy: number
  dist0: number
  scale0: number
  midX0: number
  midY0: number
  panX0: number
  panY0: number
  moved: boolean
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function Gallery({ images, alt }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [heroIndex, setHeroIndex] = useState(0)

  // Lightbox gesture state: scale/pan for pinch-zoom, drag for swipe preview
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [drag, setDrag] = useState(0)
  const [gesturing, setGesturing] = useState(false)
  const gesture = useRef<GestureState>({
    mode: 'idle', x0: 0, y0: 0, dx: 0, dy: 0,
    dist0: 0, scale0: 1, midX0: 0, midY0: 0, panX0: 0, panY0: 0, moved: false,
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)

  const resetZoom = useCallback(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
    setDrag(0)
  }, [])

  const open = (index: number) => {
    setActiveIndex(index)
    resetZoom()
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    resetZoom()
  }

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
    resetZoom()
  }, [images.length, resetZoom])

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
    resetZoom()
  }, [images.length, resetZoom])

  const toggleZoom = () => {
    if (gesture.current.moved) return
    if (scale > 1) resetZoom()
    else setScale(2)
  }

  // ---- touch gestures (swipe navigate + pinch zoom + pan while zoomed) ----

  const touchDist = (t: React.TouchList) =>
    Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
  const touchMidX = (t: React.TouchList) => (t[0].clientX + t[1].clientX) / 2
  const touchMidY = (t: React.TouchList) => (t[0].clientY + t[1].clientY) / 2

  const onTouchStart = (e: React.TouchEvent) => {
    const g = gesture.current
    g.moved = false
    setGesturing(true)
    if (e.touches.length === 2) {
      g.mode = 'pinch'
      g.dist0 = touchDist(e.touches)
      g.scale0 = scale
      g.midX0 = touchMidX(e.touches)
      g.midY0 = touchMidY(e.touches)
      g.panX0 = pan.x
      g.panY0 = pan.y
    } else if (e.touches.length === 1) {
      g.mode = scale > 1 ? 'pan' : 'pending'
      g.x0 = e.touches[0].clientX
      g.y0 = e.touches[0].clientY
      g.dx = 0
      g.dy = 0
      g.panX0 = pan.x
      g.panY0 = pan.y
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const g = gesture.current
    if (g.mode === 'pinch' && e.touches.length === 2) {
      const nextScale = clamp((g.scale0 * touchDist(e.touches)) / g.dist0, 1, 4)
      setScale(nextScale)
      setPan({
        x: g.panX0 + touchMidX(e.touches) - g.midX0,
        y: g.panY0 + touchMidY(e.touches) - g.midY0,
      })
      g.moved = true
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - g.x0
      const dy = e.touches[0].clientY - g.y0
      if (g.mode === 'pending' && Math.hypot(dx, dy) > 8) {
        g.mode = Math.abs(dx) > Math.abs(dy) * 1.5 ? 'swipe' : 'idle'
      }
      if (g.mode === 'pan') {
        setPan({ x: g.panX0 + dx, y: g.panY0 + dy })
        g.moved = true
      } else if (g.mode === 'swipe') {
        g.dx = dx
        g.dy = dy
        setDrag(dx)
        g.moved = true
      }
    }
  }

  const onTouchEnd = () => {
    const g = gesture.current
    if (g.mode === 'swipe') {
      if (g.dx < -60) next()
      else if (g.dx > 60) prev()
      else setDrag(0)
    }
    if (g.mode === 'pinch' && scale <= 1.05) resetZoom()
    g.mode = 'idle'
    setGesturing(false)
  }

  // ---- scroll helpers ----

  const scrollHero = (direction: 'left' | 'right') => {
    if (!heroRef.current) return
    const delta = heroRef.current.clientWidth * (direction === 'left' ? -1 : 1)
    heroRef.current.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!thumbsRef.current) return
    const delta = 280
    thumbsRef.current.scrollBy({ left: direction === 'left' ? -delta : delta, behavior: 'smooth' })
  }

  const onHeroScroll = () => {
    const el = heroRef.current
    if (!el || el.clientWidth === 0) return
    setHeroIndex(clamp(Math.round(el.scrollLeft / el.clientWidth), 0, images.length - 1))
  }

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, prev, next])

  if (images.length === 0) return null

  const thumbnails = images.slice(1)

  return (
    <>
      <div className="space-y-4">
        {/* Swipeable hero carousel — native scroll-snap on touch, arrows on desktop */}
        <div className="group/hero relative">
          <div
            ref={heroRef}
            onScroll={onHeroScroll}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl"
          >
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => open(i)}
                className="group relative aspect-[16/9] w-full flex-none snap-start overflow-hidden bg-gunmetal/5"
                aria-label={`Open gallery at photo ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} — ${labelFor(src)}`}
                  fill
                  priority={i === 0}
                  placeholder="blur"
                  blurDataURL={blurFor(src)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={() => scrollHero('left')}
                className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-gunmetal shadow-sm transition-opacity hover:bg-white sm:block"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollHero('right')}
                className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 text-gunmetal shadow-sm transition-opacity hover:bg-white sm:block"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-4 right-4 rounded-full bg-gunmetal/60 px-3 py-1.5 text-xs font-medium text-alabaster backdrop-blur-sm">
                {heroIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {thumbnails.length > 0 && (
          <div className="group/thumbs relative">
            {thumbnails.length > 3 && (
              <>
                <button
                  onClick={() => scrollThumbnails('left')}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-gunmetal shadow-sm transition-opacity hover:bg-white"
                  aria-label="Scroll thumbnails left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollThumbnails('right')}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-gunmetal shadow-sm transition-opacity hover:bg-white"
                  aria-label="Scroll thumbnails right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div
              ref={thumbsRef}
              className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
            >
              {thumbnails.map((src, index) => (
                <button
                  key={src}
                  onClick={() => open(index + 1)}
                  className="group relative aspect-[4/3] w-36 flex-none snap-start overflow-hidden rounded-xl bg-gunmetal/5 sm:w-44 md:w-52"
                  aria-label={`View ${alt} photo ${index + 2}`}
                >
                  <Image
                    src={src}
                    alt={`${alt} — ${labelFor(src)}`}
                    fill
                    placeholder="blur"
                    blurDataURL={blurFor(src)}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 40vw, 25vw"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gunmetal/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-alabaster transition-colors hover:bg-white/20"
            aria-label="Close gallery"
          >
            <XIcon className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-alabaster transition-colors hover:bg-white/20 sm:block"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-alabaster transition-colors hover:bg-white/20 sm:block"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => { e.stopPropagation(); toggleZoom() }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`relative h-[80vh] w-full max-w-5xl overflow-hidden ${scale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            style={{ touchAction: 'none' }}
          >
            <div
              className={`absolute inset-0 ${gesturing ? '' : 'transition-transform duration-300'}`}
              style={{
                transform: `translate(${pan.x + drag}px, ${pan.y}px) scale(${scale})`,
              }}
            >
              <Image
                src={images[activeIndex]}
                alt={`${alt} — ${labelFor(images[activeIndex])}`}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 80vw"
              />
            </div>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); resetZoom() }}
                  className={`h-2 w-2 rounded-full transition-colors ${i === activeIndex ? 'bg-alabaster' : 'bg-alabaster/40'}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
