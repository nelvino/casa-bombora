// Scheduled keep-alive — calls the site's /api/keep-alive route daily so the
// Supabase free-tier project never hits the 7-day inactivity pause. Runs on
// Netlify's scheduler; a daily invocation is far within free limits.

export const config = { schedule: '@daily' }

export default async () => {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://stay.casabombora.com'
  const secret = process.env.CRON_SECRET

  const res = await fetch(`${base}/api/keep-alive`, {
    headers: secret ? { 'x-cron-secret': secret } : {},
  })

  const body = await res.text()
  console.log(`keep-alive: ${res.status} ${body}`)
  return new Response(body, { status: res.status })
}
