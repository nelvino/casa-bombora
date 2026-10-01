'use client'

import { useEffect, useState } from 'react'
import { addDays, addMonths, format, startOfToday } from 'date-fns'
import { getAvailability } from '@/app/villa/[slug]/book/actions'

function formatInputDate(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

export function AvailabilityHint({ slug }: { slug: string }) {
  const [hint, setHint] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const from = startOfToday()
        const to = addMonths(from, 3)
        const result = await getAvailability(
          slug,
          formatInputDate(from),
          formatInputDate(to)
        )
        if (cancelled || !result.ok) return

        const unavailable = new Set([
          ...result.blockedDates,
          ...(result.holdDates ?? []),
        ])

        for (let d = new Date(from); d < to; d = addDays(d, 1)) {
          if (!unavailable.has(formatInputDate(d))) {
            if (!cancelled) {
              setHint(
                d.getTime() === from.getTime()
                  ? 'Available tonight'
                  : `Available from ${format(d, 'd MMM')}`
              )
            }
            return
          }
        }
        if (!cancelled) setHint('Fully booked — check back soon')
      } catch {
        // Hint is decorative; hide it if availability can't be loaded.
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (!hint) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-moss">
      <span className="h-1.5 w-1.5 rounded-full bg-moss" />
      {hint}
    </span>
  )
}
