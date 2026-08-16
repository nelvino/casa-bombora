import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Set SITE_LIVE=false in Netlify / production environment variables to show the
// coming-soon page. Leave it unset or set to true in development and during the
// Next.js build so pages can be generated normally.
const siteLive = process.env.SITE_LIVE !== 'false'

export const config = {
  matcher: ['/((?!_next|coming-soon|api/webhooks|.*\\..*).*)'],
}

export function middleware(req: NextRequest) {
  if (!siteLive) {
    return NextResponse.rewrite(new URL('/coming-soon', req.url))
  }
  return NextResponse.next()
}
