'use client'

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns'

function toDateString(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

function parseDate(value?: string): Date | null {
  if (!value) return null
  const d = new Date(`${value}T00:00:00`)
  return isNaN(d.getTime()) ? null : d
}

interface BookingCalendarProps {
  blockedDates?: string[]
  holdDates?: string[]
  checkIn?: string
  checkOut?: string
  months?: number
}

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function BookingCalendar({
  blockedDates = [],
  holdDates = [],
  checkIn,
  checkOut,
  months = 2,
}: BookingCalendarProps) {
  const today = startOfToday()
  const checkInDate = parseDate(checkIn)
  const checkOutDate = parseDate(checkOut)

  const unavailable = new Set([...blockedDates, ...holdDates])

  const monthStarts = Array.from({ length: months }, (_, i) =>
    startOfMonth(addMonths(today, i))
  )

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {monthStarts.map((monthStart, index) => {
        const days = eachDayOfInterval({
          start: startOfWeek(monthStart, { weekStartsOn: 0 }),
          end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 0 }),
        })

        return (
          <div key={index} className="w-full">
            <h4 className="mb-3 text-center font-serif text-lg text-gunmetal">
              {format(monthStart, 'MMMM yyyy')}
            </h4>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-gunmetal/50">
              {weekDays.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const iso = toDateString(day)
                const isUnavailable = unavailable.has(iso) || isBefore(day, today)
                const isCurrentMonth = isSameMonth(day, monthStart)
                const isSelectedStart = checkInDate ? isSameDay(day, checkInDate) : false
                const isSelectedEnd = checkOutDate ? isSameDay(day, checkOutDate) : false
                const isInRange =
                  checkInDate &&
                  checkOutDate &&
                  day > checkInDate &&
                  day < checkOutDate

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!isCurrentMonth || isUnavailable}
                    aria-label={format(day, 'yyyy-MM-dd')}
                    className={
                      'flex aspect-square items-center justify-center rounded-md text-sm font-medium transition-colors ' +
                      (!isCurrentMonth
                        ? 'text-gunmetal/10 pointer-events-none'
                        : isUnavailable
                          ? 'cursor-not-allowed bg-lion/30 text-gunmetal/40 line-through'
                          : isSelectedStart || isSelectedEnd
                            ? 'bg-blue-green text-alabaster shadow-sm'
                            : isInRange
                              ? 'bg-blue-green/20 text-blue-green'
                              : 'text-gunmetal hover:bg-lion/20 hover:text-gunmetal')
                    }
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
