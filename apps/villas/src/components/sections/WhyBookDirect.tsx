import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

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
    title: 'Flexible payment',
    body: 'Pay securely online or arrange payment directly with our team.',
  },
]

export function WhyBookDirect() {
  return (
    <section className="bg-gunmetal py-20 text-alabaster md:py-28">
      <Container>
        <Reveal className="mb-14 text-center">
          <p className="mb-3 font-sans text-sm uppercase tracking-widest text-blue-green">
            Why us
          </p>
          <h2 className="mb-4">
            Why book direct?
          </h2>
          <p className="mx-auto max-w-2xl text-alabaster/70">
            Skip the noise of the big platforms. Booking here is simpler, faster, and fully supported.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 100}>
              <div className="group h-full rounded-2xl border border-alabaster/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-green/20 font-serif text-lg text-blue-green transition-transform duration-300 group-hover:scale-110">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="mb-2 font-serif text-lg text-alabaster">{reason.title}</h3>
                <p className="mb-0 text-sm leading-relaxed text-alabaster/70">{reason.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
