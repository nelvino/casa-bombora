import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { BOOKING_ENGINE_LIVE } from '@/lib/site'

// Set SITE_LIVE=false in Netlify / production environment variables to show the
// coming-soon page. Leave it unset or set to true in development and during the
// Next.js build so pages can be generated normally.
const siteLive = process.env.SITE_LIVE !== 'false'

// V1: the booking engine stays in the codebase for V2 but is not public.
// BOOKING_ENGINE_LIVE is a build-time constant (src/lib/site.ts), so the
// redirect branch below is dead-code-eliminated when it flips to true.

export const config = {
  matcher: ['/((?!_next|coming-soon|api/|.*\\..*).*)'],
}

export function middleware(req: NextRequest) {
  if (!siteLive) {
    return NextResponse.rewrite(new URL('/coming-soon', req.url))
  }

  // /villa/[slug]/book and /villa/[slug]/book/demo-pay -> the villa page.
  if (!BOOKING_ENGINE_LIVE) {
    const match = req.nextUrl.pathname.match(/^\/villa\/([^/]+)\/book(\/.*)?$/)
    if (match) {
      const url = req.nextUrl.clone()
      url.pathname = `/villa/${match[1]}`
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}
