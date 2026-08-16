import Image from 'next/image'

interface GalleryProps {
  images: string[]
  alt: string
}

export function Gallery({ images, alt }: GalleryProps) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((src, index) => (
        <div
          key={index}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gunmetal/5"
        >
          <Image
            src={src}
            alt={`${alt} photo ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized={src.startsWith('http')}
          />
        </div>
      ))}
    </div>
  )
}
