// One-off: process real villa photos -> optimized webp + OG images + blur map.
// Run: node scripts/process-photos.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC = path.join(ROOT, 'photo-src')
const IMG = path.join(ROOT, 'public', 'images')

const src = (n) => path.join(SRC, `DR-BOMBORA${n}.jpg`)

// stem -> [source file, target dir]
const MAP = {
  'villa-teduh': {
    hero: '01831',               // golden-hour aerial, twin arches
    facade: '01850',             // arch gable + terracotta wall
    'pool-aerial': '01851',      // arrival: through the gate to the pool
    living: '01866',             // wide living + dining + bamboo window
    kitchen: '01872',            // kitchen shelves + counter
    dining: '01882',             // overhead table settings
    stairs: '01887',             // floating staircase over pebbles
    'bedroom-mezzanine': '01878',// mezzanine bedroom, arch wardrobe
    bedroom: '01886',            // bed + rattan pendants detail
    bathroom: '01895',           // rain shower + bamboo window
    terrace: '01892',            // branded towels on lounger
    'night-bath': '01907',       // lit stone bath beside the pool
  },
  'villa-langit': {
    hero: '01854',               // twin arches from below, glass glow
    facade: '01835',             // arch roofline + bamboo + sky
    'pool-aerial': '01910',      // night: villa glowing over the pool
    living: '01859',             // wide living room + garden
    'living-alt': '01867',       // living room portrait
    kitchen: '01864',            // kitchen + dining wide
    dining: '01873',             // place settings detail
    'bedroom-mezzanine': '01875',// mezzanine view down to living/pool
    bedroom: '01862',            // rattan pendant at mezzanine edge
    bathroom: '01896',           // bathroom + bamboo ceiling
    vanity: '01897',             // stone vessel sink + mirror
    stairs: '01856',             // staircase + monstera + cushions
    terrace: '01915',            // night: lounger + towels at pool edge
    'night-arches': '01911',     // arches against the night sky
    'night-pool': '01913',       // LED-lit pool edge, night
    'bamboo-night': '01916',     // lit bamboo wall, night
    detail: '01905',             // monstera in clay pot by the stairs
  },
  shared: {
    'hero-night': '01910',       // homepage hero slideshow
    'hero-aerial': '01831',
    'hero-interior': '01859',
    'hero-bath': '01907',
  },
}
// fix langit terrace (01856 already used for stairs)
MAP['villa-langit'].terrace = '01915'



const OG = {
  'og-cover.jpg': '01910',
  'og-teduh.jpg': '01831',
  'og-langit.jpg': '01854',
}

const blurs = {}

async function toWebp(srcFile, destFile, width = 2400) {
  const img = sharp(srcFile).rotate()
  const meta = await img.metadata()
  const long = Math.max(meta.width, meta.height)
  if (long > width) {
    img.resize(meta.width >= meta.height ? { width } : { height: width })
  }
  await img.webp({ quality: 80, effort: 5 }).toFile(destFile)
}

async function blurFor(srcFile) {
  const buf = await sharp(srcFile).rotate().resize(16).webp({ quality: 40 }).toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

for (const [dir, files] of Object.entries(MAP)) {
  const outDir = path.join(IMG, dir)
  await mkdir(outDir, { recursive: true })
  for (const [stem, srcN] of Object.entries(files)) {
    const s = src(srcN)
    const dest = path.join(outDir, `${stem}.webp`)
    await toWebp(s, dest, stem.startsWith('hero') || stem === 'pool-aerial' ? 2560 : 2200)
    if (!(stem in blurs)) blurs[stem] = await blurFor(s)
    console.log(`${dir}/${stem}.webp <- ${srcN}`)
  }
}

for (const [name, srcN] of Object.entries(OG)) {
  await sharp(src(srcN))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(IMG, name))
  console.log(`${name} <- ${srcN}`)
}

const blurTs = `// Blur placeholders (16px WebP, base64) for local villa images.
// Regenerate with: node scripts/process-photos.mjs
const BLURS: Record<string, string> = {
${Object.entries(blurs).map(([k, v]) => `  '${k}': '${v}',`).join('\n')}
}

// Maps an image path like '/images/villa-teduh/hero.webp' to its blur data URL.
export function blurFor(src?: string): string | undefined {
  if (!src) return undefined
  const name = src.split('/').pop()?.replace(/\\.[^.]+$/, '')
  return name ? BLURS[name] : undefined
}
`
await writeFile(path.join(ROOT, 'src/lib/data/image-blur.ts'), blurTs)
console.log('\nimage-blur.ts regenerated:', Object.keys(blurs).length, 'entries')
