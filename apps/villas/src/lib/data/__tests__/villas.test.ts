import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { VILLAS } from '../villas'

function publicPath(src: string) {
  return path.join(process.cwd(), 'public', src)
}

describe('VILLAS data', () => {
  it('has exactly two villas', () => {
    expect(VILLAS).toHaveLength(2)
  })

  it('has unique slugs', () => {
    const slugs = VILLAS.map((v) => v.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has all required fields', () => {
    for (const villa of VILLAS) {
      expect(villa.slug).toBeTruthy()
      expect(villa.name).toBeTruthy()
      expect(villa.description).toBeTruthy()
      expect(villa.location).toBeTruthy()
      expect(villa.bedrooms).toBeGreaterThan(0)
      expect(villa.bathrooms).toBeGreaterThan(0)
      expect(villa.maxGuests).toBeGreaterThan(0)
      expect(villa.pricePerNight).toBeGreaterThan(0)
      expect(villa.amenities.length).toBeGreaterThan(0)
    }
  })

  it('has a hero image and gallery images that exist in public/', () => {
    for (const villa of VILLAS) {
      expect(villa.image.startsWith('/')).toBe(true)
      expect(fs.existsSync(publicPath(villa.image))).toBe(true)

      expect(villa.galleryImages.length).toBeGreaterThan(0)
      for (const src of villa.galleryImages) {
        expect(src.startsWith('/')).toBe(true)
        expect(fs.existsSync(publicPath(src))).toBe(true)
      }
    }
  })

  it('has no duplicate gallery images within a villa', () => {
    for (const villa of VILLAS) {
      expect(new Set(villa.galleryImages).size).toBe(villa.galleryImages.length)
    }
  })
})
