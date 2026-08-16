'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <Container className="py-24 text-center">
      <h1 className="mb-4 text-gunmetal">Something went wrong</h1>
      <p className="mb-8 text-gunmetal/70">
        We could not load this page. Please try again or return home.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/"
          className={cn(
            'inline-flex items-center justify-center rounded-lg border border-gunmetal px-6 py-3 font-sans font-medium text-gunmetal transition-all duration-200 hover:bg-gunmetal/5 focus:outline-none focus:ring-2 focus:ring-gunmetal focus:ring-offset-2'
          )}
        >
          Return home
        </Link>
      </div>
    </Container>
  )
}
