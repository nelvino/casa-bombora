import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth/session'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoginForm } from '@/components/admin/LoginForm'
import {
  confirmBooking,
  cancelBooking,
  markBookingPaid,
  releaseHold,
} from './actions'
import { logoutAdmin } from './login/actions'

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function bookingStatusVariant(status: string) {
  return status === 'CONFIRMED' ? 'blue' : 'lion'
}

export default async function AdminPage() {
  const admin = await isAdmin()

  if (!admin) {
    return <LoginForm />
  }

  const [bookings, holds, bookingCount, holdCount] = await Promise.all([
    prisma.booking.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { villa: true },
    }),
    prisma.hold.findMany({
      take: 50,
      orderBy: { expiresAt: 'desc' },
      include: { villa: true },
    }),
    prisma.booking.count(),
    prisma.hold.count(),
  ])

  const occupancy =
    bookingCount + holdCount > 0
      ? Math.round((bookingCount / (bookingCount + holdCount)) * 100)
      : 0

  return (
    <Container size="large" className="pt-28 pb-10 md:pt-32 md:pb-16">
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-gunmetal">Admin</h1>
          <p className="text-gunmetal/70">Overview of bookings and active holds.</p>
        </div>
        <form action={logoutAdmin}>
          <Button type="submit" variant="secondary" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total bookings" value={bookingCount} />
        <SummaryCard label="Total holds" value={holdCount} />
        <SummaryCard label="Conversion rate" value={`${occupancy}%`} />
        <SummaryCard label="Villas live" value={2} />
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl text-gunmetal">Recent bookings</h2>
        <div className="overflow-x-auto rounded-xl border border-gunmetal/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gunmetal/5 text-gunmetal/70">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Villa</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Guest</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Check in</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Check out</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Amount</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Created</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gunmetal divide-y divide-gunmetal/10">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gunmetal/[0.02]">
                  <td className="px-4 py-3">{b.villa.name}</td>
                  <td className="px-4 py-3">
                    {b.guestName}
                    <br />
                    <span className="text-xs text-gunmetal/60">{b.guestEmail}</span>
                  </td>
                  <td className="px-4 py-3">{formatDate(b.checkIn)}</td>
                  <td className="px-4 py-3">{formatDate(b.checkOut)}</td>
                  <td className="px-4 py-3">{formatCents(b.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={bookingStatusVariant(b.status)}>{b.status}</Badge>
                    {b.paymentStatus === 'PAID' && (
                      <span className="ml-2 text-xs text-gunmetal/60">paid</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDate(b.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {b.status === 'PENDING' && (
                        <form action={confirmBooking}>
                          <input type="hidden" name="id" value={b.id} />
                          <Button type="submit" size="sm" variant="primary">
                            Confirm
                          </Button>
                        </form>
                      )}
                      {b.paymentStatus === 'UNPAID' && b.status !== 'CANCELLED' && (
                        <form action={markBookingPaid}>
                          <input type="hidden" name="id" value={b.id} />
                          <Button type="submit" size="sm" variant="secondary">
                            Mark paid
                          </Button>
                        </form>
                      )}
                      {b.status !== 'CANCELLED' && (
                        <form action={cancelBooking}>
                          <input type="hidden" name="id" value={b.id} />
                          <Button type="submit" size="sm" variant="ghost">
                            Cancel
                          </Button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl text-gunmetal">Recent holds</h2>
        <div className="overflow-x-auto rounded-xl border border-gunmetal/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gunmetal/5 text-gunmetal/70">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Token</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Villa</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Check in</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Check out</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Expires</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gunmetal divide-y divide-gunmetal/10">
              {holds.map((h) => (
                <tr key={h.id} className="hover:bg-gunmetal/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs">{h.token}</td>
                  <td className="px-4 py-3">{h.villa.name}</td>
                  <td className="px-4 py-3">{formatDate(h.checkIn)}</td>
                  <td className="px-4 py-3">{formatDate(h.checkOut)}</td>
                  <td className="px-4 py-3">{formatDate(h.expiresAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={h.status === 'ACTIVE' ? 'blue' : 'lion'}>
                      {h.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {h.status === 'ACTIVE' && (
                      <form action={releaseHold}>
                        <input type="hidden" name="id" value={h.id} />
                        <Button type="submit" size="sm" variant="ghost">
                          Release
                        </Button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Container>
  )
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gunmetal/10 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm text-gunmetal/60">{label}</p>
      <p className="font-serif text-3xl text-gunmetal">{value}</p>
    </div>
  )
}
