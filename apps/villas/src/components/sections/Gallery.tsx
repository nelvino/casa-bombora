'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

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

export function Gallery({ images, alt }: GalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const open = (index: number) => {
    setActiveIndex(index)
    setIsZoomed(false)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  const prev = () => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
    setIsZoomed(false)
  }

  const next = () => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
    setIsZoomed(false)
  }

  const toggleZoom = () => setIsZoomed((z) => !z)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const delta = 280
    scrollRef.current.scrollBy({ left: direction === 'left' ? -delta : delta, behavior: 'smooth' })
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
  }, [isOpen])

  if (images.length === 0) return null

  const mainImage = images[0]
  const thumbnails = images.slice(1)

  return (
    <>
      <div className="space-y-4">
        <button
          onClick={() => open(0)}
          className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gunmetal/5"
          aria-label="Open image gallery"
        >
          <Image
            src={mainImage}
            alt={`${alt} hero`}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
            unoptimized={mainImage.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gunmetal/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="absolute bottom-4 right-4 rounded-full bg-alabaster/90 px-3 py-1.5 text-xs font-medium text-gunmetal opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            Open gallery
          </span>
        </button>

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
              ref={scrollRef}
              className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
            >
              {thumbnails.map((src, index) => (
                <button
                  key={src}
                  onClick={() => open(index + 1)}
                  className="group relative aspect-[4/3] w-36 flex-none snap-start overflow-hidden rounded-xl bg-gunmetal/5 sm:w-44 md:w-52"
                  aria-label={`View ${alt} photo ${index + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${alt} photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 40vw, 25vw"
                    unoptimized={src.startsWith('http')}
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
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-alabaster transition-colors hover:bg-white/20"
            aria-label="Close gallery"
          >
            <XIcon className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-alabaster transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-alabaster transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => { e.stopPropagation(); toggleZoom() }}
            className="relative h-[80vh] w-full max-w-5xl cursor-zoom-in overflow-hidden"
          >
            <Image
              src={images[activeIndex]}
              alt={`${alt} view ${activeIndex + 1}`}
              fill
              className="object-contain transition-transform duration-500"
              style={{ transform: isZoomed ? 'scale(1.35)' : 'scale(1)' }}
              sizes="(max-width: 1280px) 100vw, 80vw"
              unoptimized={images[activeIndex].startsWith('http')}
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
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
