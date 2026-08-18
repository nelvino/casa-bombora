'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'
import { confirmDemoPayment } from '../actions'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      Confirm payment
    </Button>
  )
}

function DemoPayForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [state, action] = useFormState(confirmDemoPayment, {
    ok: false,
    error: '',
  })

  if (state.ok) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-gunmetal">Payment simulated</h1>
        <p className="text-blue-green">
          Your booking has been confirmed. Booking #{state.bookingId}.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="grid max-w-md gap-4">
      <input type="hidden" name="token" value={token} />

      <p className="text-gunmetal/80">
        This is a demo payment page. No real charge will be made.
      </p>

      <label className="block text-sm text-gunmetal/80">
        Name
        <input
          type="text"
          name="guestName"
          required
          className="mt-1 w-full border border-lion bg-transparent p-2 text-gunmetal"
        />
      </label>

      <label className="block text-sm text-gunmetal/80">
        Email
        <input
          type="email"
          name="guestEmail"
          required
          className="mt-1 w-full border border-lion bg-transparent p-2 text-gunmetal"
        />
      </label>

      <SubmitButton />

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  )
}

export default function DemoPayPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <Container size="large" className="pt-32 pb-16">
      <h1 className="mb-8 text-gunmetal">Demo payment</h1>
      <Suspense
        fallback={<p className="text-gunmetal/60">Loading payment form...</p>}
      >
        <DemoPayForm />
      </Suspense>
    </Container>
  )
}
