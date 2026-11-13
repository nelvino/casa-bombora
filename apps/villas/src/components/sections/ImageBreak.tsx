import Image from 'next/image'
import { blurFor } from '@/lib/data/image-blur'
import { Reveal } from '@/components/ui/Reveal'

// Full-bleed editorial break. The image is position:fixed inside a clip-path
// container — a GPU-cheap parallax "window" that also works on iOS, where
// background-attachment:fixed is ignored.
export function ImageBreak() {
  const src = '/images/shared/hero-bath.webp'

  return (
    <section className="relative flex h-[70vh] items-center justify-center overflow-hidden [clip-path:inset(0)] md:h-[85vh]">
      <div className="fixed inset-0 -z-10 motion-safe:animate-kenburns">
        <Image
          src={src}
          alt="The outdoor plunge bath lit beside the pool at night"
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurFor(src)}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gunmetal/40" />
      </div>
      <Reveal className="relative z-10 max-w-3xl px-6 text-center">
        <p className="font-serif text-2xl leading-snug text-alabaster md:text-4xl">
          Evenings slow down here. Still water, warm light, and the bamboo
          glowing after dark.
        </p>
      </Reveal>
    </section>
  )
}
