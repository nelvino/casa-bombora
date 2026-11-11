'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { blurFor } from '@/lib/data/image-blur'

const SLIDES = [
  {
    src: '/images/shared/hero-night.webp',
    alt: 'Casa Bombora villa glowing at night over the private pool',
  },
  {
    src: '/images/shared/hero-aerial.webp',
    alt: 'Aerial view of the twin arched villas at golden hour',
  },
  {
    src: '/images/shared/hero-interior.webp',
    alt: 'Open-plan living room with rattan pendant lights',
  },
  {
    src: '/images/shared/hero-bath.webp',
    alt: 'Outdoor stone bath lit beside the pool at night',
  },
]

const INTERVAL_MS = 6500

export function HeroSlideshow() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === 0 ? slide.alt : ''}
          aria-hidden={i !== 0}
          fill
          priority={i === 0}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurFor(slide.src)}
          className={`object-cover transition-opacity duration-[1800ms] ease-out motion-safe:animate-kenburns ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
