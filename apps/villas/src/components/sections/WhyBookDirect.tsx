import { Container } from '@/components/ui/Container'

const reasons = [
  {
    title: 'Best price guarantee',
    body: 'Book directly with us and avoid third-party fees or markups.',
  },
  {
    title: 'No double bookings',
    body: 'Our live calendar updates in real time, so your dates are locked in.',
  },
  {
    title: 'Local support',
    body: 'A Casa Bombora host is on hand from check-in to check-out.',
  },
  {
    title: 'Secure payments',
    body: 'Your payment is processed safely by Stripe with full encryption.',
  },
]

export function WhyBookDirect() {
  return (
    <section className="bg-alabaster py-16 md:py-24">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-gunmetal">Why book direct?</h2>
          <p className="mx-auto max-w-2xl text-gunmetal/70">
            Skip the noise of the big platforms. Booking here is simpler, faster, and fully supported.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-lg border border-gunmetal/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 font-serif text-lg text-gunmetal">{reason.title}</h3>
              <p className="mb-0 text-sm leading-relaxed text-gunmetal/70">{reason.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
