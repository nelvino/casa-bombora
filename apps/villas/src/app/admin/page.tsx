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
  convertHold,
  blockDateRange,
  unblockDate,
} from './actions'
import { logoutAdmin } from './login/actions'
import { formatIdr } from '@/lib/currency'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
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

  const [bookings, holds, villas, blockedDates, bookingCount, holdCount] =
    await Promise.all([
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
      prisma.villa.findMany({ orderBy: { name: 'asc' } }),
      prisma.blockedDate.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        include: { villa: true },
        take: 200,
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
                    <a
                      href={`mailto:${b.guestEmail}`}
                      className="text-xs text-lion underline"
                    >
                      {b.guestEmail}
                    </a>
                  </td>
                  <td className="px-4 py-3">{formatDate(b.checkIn)}</td>
                  <td className="px-4 py-3">{formatDate(b.checkOut)}</td>
                  <td className="px-4 py-3">{formatIdr(b.totalAmount)}</td>
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
                <th className="whitespace-nowrap px-4 py-3 font-medium">Villa</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Guest</th>
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
                  <td className="px-4 py-3">
                    {h.villa.name}
                    <br />
                    <span className="font-mono text-xs text-gunmetal/50">
                      {h.token.slice(0, 8)}…
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {h.guestName ?? '—'}
                    <br />
                    {h.guestEmail ? (
                      <a
                        href={`mailto:${h.guestEmail}`}
                        className="text-xs text-lion underline"
                      >
                        {h.guestEmail}
                      </a>
                    ) : (
                      <span className="text-xs text-gunmetal/40">no email</span>
                    )}
                  </td>
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
                      <div className="flex flex-col gap-2">
                        <form
                          action={convertHold}
                          className="flex flex-wrap items-center gap-1"
                        >
                          <input type="hidden" name="id" value={h.id} />
                          <input
                            type="text"
                            name="guestName"
                            defaultValue={h.guestName ?? ''}
                            placeholder="Guest name"
                            required
                            className="w-28 rounded border border-gunmetal/20 px-2 py-1 text-xs"
                          />
                          <input
                            type="email"
                            name="guestEmail"
                            defaultValue={h.guestEmail ?? ''}
                            placeholder="Guest email"
                            required
                            className="w-36 rounded border border-gunmetal/20 px-2 py-1 text-xs"
                          />
                          <Button type="submit" size="sm" variant="primary">
                            Confirm booking
                          </Button>
                        </form>
                        <form action={releaseHold}>
                          <input type="hidden" name="id" value={h.id} />
                          <Button type="submit" size="sm" variant="ghost">
                            Release
                          </Button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl text-gunmetal">Blocked dates</h2>
        <div className="mb-6 rounded-xl border border-gunmetal/10 bg-white p-5 shadow-sm">
          <form
            action={blockDateRange}
            className="flex flex-wrap items-end gap-3"
          >
            <label className="flex flex-col gap-1 text-xs text-gunmetal/70">
              Villa
              <select
                name="villaId"
                required
                className="rounded border border-gunmetal/20 px-2 py-1.5 text-sm"
              >
                {villas.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-gunmetal/70">
              From
              <input
                type="date"
                name="from"
                required
                className="rounded border border-gunmetal/20 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-gunmetal/70">
              To
              <input
                type="date"
                name="to"
                required
                className="rounded border border-gunmetal/20 px-2 py-1.5 text-sm"
              />
            </label>
            <Button type="submit" size="sm" variant="primary">
              Block dates
            </Button>
          </form>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gunmetal/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gunmetal/5 text-gunmetal/70">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Villa</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Source</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gunmetal divide-y divide-gunmetal/10">
              {blockedDates.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-gunmetal/50" colSpan={4}>
                    No upcoming blocked dates.
                  </td>
                </tr>
              )}
              {blockedDates.map((d) => (
                <tr key={d.id} className="hover:bg-gunmetal/[0.02]">
                  <td className="px-4 py-3">{d.villa.name}</td>
                  <td className="px-4 py-3">{formatDate(d.date)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={d.source === 'manual' ? 'lion' : 'blue'}>
                      {d.source}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <form action={unblockDate}>
                      <input type="hidden" name="id" value={d.id} />
                      <Button type="submit" size="sm" variant="ghost">
                        Remove
                      </Button>
                    </form>
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
