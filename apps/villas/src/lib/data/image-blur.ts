// Blur placeholders (16px WebP, base64) for local villa images.
// Regenerate with sharp if images change.
const BLURS: Record<string, string> = {
  hero: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoQAAsAA4BaJZwAAxPAv5tKAAD+tTRQghJPbSNJZ4xcb3ZNJTY75Ob+oddPeFKWZFz3ijHDq6om00Q9LVzoXGvBwAA=',
  living: 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAgCdASoQAAsAA4BaJYwCdAYubywGdLBaAAD+7Qsk5STBWMBQi7lppnnbyZgfvshNkloqUrxDUKd4h6BvgZJ8t4O5NncMepG/Jt31wZloxWXFEoeq2eG3AAA=',
  bedroom: 'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABwAgCdASoQAAsAA4BaJYwCdAYul215WnM+YXKAAPRz+gwPOWjqgzH9ETq3CrRWdwwNAR7vdlxZWf+66JIo0MlIYfh0ZPdvSZpvboQ5FTMdSdvSO+MYVqkWmXQdydbhXKAAAA==',
  bathroom: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQAQCdASoQAAsAA4BaJQBOgMXwb7agQAD+Cu7peD2BRG39ZbeTgQDmaJvO/fo7i0sMS+9D8uJV1RPYN1N7Ue8EjI5swrf1VX8p5HSThglLd2IH8TJVITbm73RmgzAAAAA=',
  terrace: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAsAA4BaJQBOgCB+t6aBAAD8WisEzVeRj1c92FKlLppi5/cZGbGWFydy/aHJ6+Zgf8t9CNOoVzH4AAA=',
  facade: 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwAgCdASoQAAsAA4BaJZQC7AYv/q1+Fm2ycAD8tNolE0FUAGzE7V6gYC774DAeudLtcXtpAvhXu95T/p8rd0DTY/EXDmqrDsnlQqJ+KRhNbwkcMDQfC7ThslU7c/3aKAf60Y0H/wAAAA==',
  'pool-aerial': 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoQAAsAA4BaJYwAD4/NxCebq8ngAP7BaQWuFQXjQTRhppYfPuUXNGY1anlrgAy2rDovpnCVLIy1tlV5PTNBoBYT0bIiugnEwnI9A52KFxgCSPPhIu0uHAAA',
  'bedroom-mezzanine': 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQAgCdASoQAAsAA4BaJYgCdAEVDwQ/jCAAAP6rsjXZRsUUnUhbHPxg6oIk/slz9btoAP/H9xn+PKYJdTTg1gGdI0ULzZeoOAXjloPLofWg+S6DqS6XIbBNabcAAA==',
}

// Maps an image path like '/images/villa-teduh/hero.webp' to its blur data URL.
export function blurFor(src?: string): string | undefined {
  if (!src) return undefined
  const name = src.split('/').pop()?.replace(/\.[^.]+$/, '')
  return name ? BLURS[name] : undefined
}
