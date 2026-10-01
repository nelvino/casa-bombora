'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { notFound } from 'next/navigation'
import { addDays, addMonths, differenceInCalendarDays, format, parseISO } from 'date-fns'
import { VILLAS, type Villa } from '@/lib/data/villas'
import {
  getAvailability,
  createBookingHold,
  createPaymentSession,
} from '@/app/villa/[slug]/book/actions'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { PriceBreakdown } from '@/components/booking/PriceBreakdown'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { BackLink } from '@/components/ui/BackLink'
import { CONTACT_EMAIL, whatsappLink } from '@/lib/site'
import { formatIdr } from '@/lib/currency'
import { Price } from '@/components/currency/Price'

function formatInputDate(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

function SubmitButton({
  children,
  pendingLabel = 'Working…',
  disabled,
}: {
  children: React.ReactNode
  pendingLabel?: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? pendingLabel : children}
    </Button>
  )
}

interface BookingPageClientProps {
  slug: string
  success?: string
  token?: string
  paymentsEnabled?: boolean
}

export default function BookingPageClient({ slug, success, token, paymentsEnabled = false }: BookingPageClientProps) {
  const villaFromList = VILLAS.find((v) => v.slug === slug)
  const [villa, setVilla] = useState<Villa | undefined>(villaFromList)
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [holdDates, setHoldDates] = useState<string[]>([])
  const [availabilityError, setAvailabilityError] = useState(false)

  const [checkIn, setCheckIn] = useState<string>(formatInputDate(addMonths(new Date(), 1)))
  const [checkOut, setCheckOut] = useState<string>(
    formatInputDate(addDays(addMonths(new Date(), 1), 3))
  )
  const [promoCode, setPromoCode] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const [holdState, holdAction] = useFormState(createBookingHold, {
    ok: false,
    error: '',
  })
  const [paymentState, paymentAction] = useFormState(createPaymentSession, {
    ok: false,
    error: '',
  })

  // When the hold lands, scroll the confirmation into view — otherwise the
  // success state sits below the fold and the action feels like it did nothing.
  const confirmationRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (holdState.ok) {
      confirmationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [holdState.ok])

  const loadAvailability = useCallback(async () => {
    const from = formatInputDate(new Date())
    const to = formatInputDate(addMonths(new Date(), 2))
    try {
      const result = await getAvailability(slug, from, to)
      if (result.ok && result.villa) {
        setVilla(result.villa as Villa)
        setBlockedDates(result.blockedDates)
        setHoldDates(result.holdDates ?? [])
        setAvailabilityError(false)
      } else {
        setAvailabilityError(true)
      }
    } catch {
      setAvailabilityError(true)
    }
  }, [slug])

  useEffect(() => {
    loadAvailability()
  }, [loadAvailability])

  const estimatedNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    return Math.max(0, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)))
  }, [checkIn, checkOut])

  const holdMinutes = paymentsEnabled ? 15 : 72 * 60
  const holdLabel =
    holdMinutes >= 60
      ? `${Math.round(holdMinutes / 60)}-hour hold`
      : `${holdMinutes}-minute hold`

  const enquiryMessage = useMemo(() => {
    if (!villa || !holdState.ok) return ''
    const lines = [
      `Hi Casa Bombora team,`,
      ``,
      `I'd like to book ${villa.name} in Uluwatu.`,
      ``,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      `Nights: ${holdState.nights ?? 0}`,
      `Estimated total: ${formatIdr(holdState.totalIdr ?? 0)}`,
      `Name: ${holdState.guestName || guestName}`,
      `Email: ${holdState.guestEmail || guestEmail}`,
      `Enquiry ref: ${holdState.token ?? ''}`,
      ``,
      `Thanks!`,
    ]
    return lines.join('\n')
  }, [villa, holdState, checkIn, checkOut, guestName, guestEmail])

  const enquiryMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Booking enquiry — ${villa?.name ?? ''} (${checkIn} → ${checkOut})`
  )}&body=${encodeURIComponent(enquiryMessage)}`

  if (!villa) notFound()

  return (
    <Container size="large" className="pt-28 pb-10 md:pt-32 md:pb-16">
      <div className="mb-6">
        <BackLink href={`/villa/${slug}`} label="Villa details" />
      </div>

      <div className="mb-8">
        <p className="mb-1 font-serif text-lion">{villa.location}</p>
        <h1 className="mb-2 text-3xl text-gunmetal md:text-4xl">{villa.name}</h1>
        <p className="font-sans text-lg text-gunmetal/70">
          From <Price amountIdr={villa.pricePerNight} /> / night
        </p>
      </div>

      {success && (
        <div className="mb-8 rounded-lg border border-blue-green/30 bg-blue-green/10 p-4 text-blue-green">
          <p className="mb-0 font-medium">
            Payment received. We are confirming your booking and will be in touch shortly.
          </p>
        </div>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr),420px]">
        <section className="min-w-0 space-y-8">
          <div className="rounded-xl border border-gunmetal/10 bg-white p-4 shadow-sm md:p-6">
            <h2 className="mb-4 font-serif text-2xl text-gunmetal">Availability</h2>
            {availabilityError && (
              <p className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                We couldn&apos;t load live availability — the calendar may not
                reflect the latest bookings. Please{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                  email us
                </a>{' '}
                to double-check your dates, or{' '}
                <button
                  type="button"
                  onClick={loadAvailability}
                  className="underline"
                >
                  try again
                </button>
                .
              </p>
            )}
            <BookingCalendar
              blockedDates={blockedDates}
              holdDates={holdDates}
              checkIn={checkIn}
              checkOut={checkOut}
              onDatesChange={({ checkIn: inDate, checkOut: outDate }) => {
                setCheckIn(inDate ?? '')
                setCheckOut(outDate ?? '')
              }}
            />
          </div>

          {holdState.ok ? (
            <div className="rounded-xl border border-blue-green/20 bg-blue-green/5 p-6">
              <h3 className="mb-4 font-serif text-xl text-gunmetal">Price summary</h3>
              <PriceBreakdown
                nights={holdState.nights ?? 0}
                pricePerNightIdr={villa.pricePerNight}
                discountPercent={holdState.discountPercent ?? 0}
              />
              <p className="mt-4 text-xs text-gunmetal/60">
                {holdLabel} — your dates are reserved while{' '}
                {paymentsEnabled
                  ? 'you complete payment'
                  : 'we confirm your enquiry'}
                .
              </p>
              {holdState.token && (
                <p className="mt-1 text-xs text-gunmetal/60">
                  Hold reference: <span className="font-mono">{holdState.token}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-gunmetal/10 bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-serif text-xl text-gunmetal">Price estimate</h3>
              <p className="mb-0 text-gunmetal/70">
                {estimatedNights > 0
                  ? `${estimatedNights} nights from ${formatIdr(
                      estimatedNights * villa.pricePerNight
                    )}`
                  : 'Select your check-in and check-out dates to see a quote.'}
              </p>
            </div>
          )}
        </section>

        <section className="h-fit min-w-0 space-y-6 lg:sticky lg:top-32">
          <form action={holdAction} className="rounded-xl border border-gunmetal/10 bg-white p-6 shadow-sm">
            <input type="hidden" name="slug" value={slug} />

            <h2 className="mb-5 font-serif text-2xl text-gunmetal">Book your stay</h2>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm text-gunmetal/80">
                Check in
                <input
                  type="date"
                  name="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1 w-full rounded-md border border-lion bg-transparent p-2 text-gunmetal focus:border-blue-green focus:outline-none focus:ring-1 focus:ring-blue-green"
                />
              </label>
              <label className="block text-sm text-gunmetal/80">
                Check out
                <input
                  type="date"
                  name="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1 w-full rounded-md border border-lion bg-transparent p-2 text-gunmetal focus:border-blue-green focus:outline-none focus:ring-1 focus:ring-blue-green"
                />
              </label>
            </div>

            <label className="mb-4 block text-sm text-gunmetal/80">
              Guest name
              <input
                type="text"
                name="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="mt-1 w-full rounded-md border border-lion bg-transparent p-2 text-gunmetal focus:border-blue-green focus:outline-none focus:ring-1 focus:ring-blue-green"
                required
              />
            </label>

            <label className="mb-4 block text-sm text-gunmetal/80">
              Guest email
              <input
                type="email"
                name="guestEmail"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-lion bg-transparent p-2 text-gunmetal focus:border-blue-green focus:outline-none focus:ring-1 focus:ring-blue-green"
                required
              />
            </label>

            <label className="mb-6 block text-sm text-gunmetal/80">
              Promo code
              <input
                type="text"
                name="promoCode"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="mt-1 w-full rounded-md border border-lion bg-transparent p-2 text-gunmetal focus:border-blue-green focus:outline-none focus:ring-1 focus:ring-blue-green"
              />
            </label>

            <SubmitButton
              pendingLabel={
                paymentsEnabled ? 'Checking availability…' : 'Sending request…'
              }
            >
              {paymentsEnabled
                ? 'Check availability / Hold dates'
                : 'Request these dates'}
            </SubmitButton>

            {holdState.error && (
              <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{holdState.error}</p>
            )}
          </form>

          {holdState.ok && (
            <div
              ref={confirmationRef}
              className="scroll-mt-28 rounded-xl border border-blue-green/40 bg-white p-6 shadow-md"
            >
              <div className="mb-4">
                <p className="mb-1 flex items-center gap-2 font-serif text-xl text-blue-green">
                  <span aria-hidden>✓</span>
                  {paymentsEnabled
                    ? 'Dates held — complete your payment'
                    : 'Request received — your dates are on hold'}
                </p>
                <p className="mb-2 font-serif text-xl text-gunmetal">
                  {holdState.nights ?? 0} nights &middot; Total{' '}
                  <Price amountIdr={holdState.totalIdr ?? 0} />
                </p>
                {(holdState.discountPercent ?? 0) > 0 && (
                  <Badge variant="blue">Promo applied: {holdState.discountPercent}% off</Badge>
                )}
                {!paymentsEnabled && (
                  <p className="mt-2 text-sm text-gunmetal/70">
                    We emailed you a confirmation — now send us the enquiry so we
                    can lock in your stay:
                  </p>
                )}
              </div>

              {paymentsEnabled ? (
                <>
                  <form action={paymentAction}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="token" value={holdState.token ?? ''} />
                    <input type="hidden" name="amount" value={holdState.totalIdr ?? 0} />
                    <input type="hidden" name="guestName" value={holdState.guestName || guestName} />
                    <input type="hidden" name="guestEmail" value={holdState.guestEmail || guestEmail} />
                    <SubmitButton pendingLabel="Redirecting to checkout…">
                      Pay now
                    </SubmitButton>
                  </form>

                  {paymentState.error && (
                    <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                      {paymentState.error}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="mb-4 text-sm text-gunmetal/70">
                    No online payment needed — send us your enquiry and
                    we&apos;ll confirm your stay and arrange payment directly.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button asChild className="w-full rounded-full bg-blue-green text-alabaster hover:bg-blue-green/90">
                      <a href={enquiryMailto}>Email your enquiry</a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full border-gunmetal/20 text-gunmetal hover:border-blue-green hover:text-blue-green"
                    >
                      <a
                        href={whatsappLink(enquiryMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp us instead
                      </a>
                    </Button>
                  </div>
                  <p className="mt-4 text-center text-xs text-gunmetal/50">
                    We reply within 24 hours. Your dates stay held in the
                    meantime.
                  </p>
                </>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-gunmetal/60">
            <span className="rounded-full bg-gunmetal/5 px-3 py-1.5">
              {paymentsEnabled
                ? '15-minute hold while you pay'
                : '72-hour hold while we confirm'}
            </span>
            <span className="rounded-full bg-gunmetal/5 px-3 py-1.5">
              {paymentsEnabled
                ? 'Secure online checkout'
                : 'No online payment required'}
            </span>
            <span className="rounded-full bg-gunmetal/5 px-3 py-1.5">
              Free cancellation until payment
            </span>
          </div>
        </section>
      </div>
    </Container>
  )
}
