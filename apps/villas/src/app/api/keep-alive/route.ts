import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Keep-alive ping — a trivial DB read so the Supabase project never hits the
// free-tier 7-day inactivity pause. Invoked daily by a Netlify scheduled
// function. When CRON_SECRET is set, the caller must send it as a header.
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('x-cron-secret') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  try {
    const villas = await prisma.villa.count()
    return NextResponse.json({ ok: true, villas })
  } catch (error) {
    console.error('[keep-alive] DB ping failed:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
