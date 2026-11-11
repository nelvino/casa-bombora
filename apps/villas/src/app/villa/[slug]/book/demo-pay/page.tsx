import { redirect } from 'next/navigation'
import { BOOKING_ENGINE_LIVE } from '@/lib/site'
import { DemoPayClient } from './DemoPayClient'

export const dynamic = 'force-dynamic'

export default function DemoPayPage({
  params,
}: {
  params: { slug: string }
}) {
  if (!BOOKING_ENGINE_LIVE) redirect(`/villa/${params.slug}`)

  return <DemoPayClient />
}
