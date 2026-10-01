'use server'

import { redirect } from 'next/navigation'
import { timingSafeEqual } from 'crypto'
import { getAdminSession } from '@/lib/auth/session'

// Exponential backoff: 15s, 30s, 1m, 2m, 4m, 8m… capped at 15 minutes.
const BASE_LOCK_MS = 15_000
const MAX_LOCK_MS = 15 * 60_000

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Compare against itself to keep timing roughly constant.
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export async function loginAdmin(prevState: unknown, formData: FormData) {
  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')

  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD

  if (!expectedUser || !expectedPass) {
    return { ok: false, error: 'Admin login is not configured' }
  }

  const session = await getAdminSession()

  const lockedUntil = session.loginLockedUntil ?? 0
  if (lockedUntil > Date.now()) {
    const mins = Math.ceil((lockedUntil - Date.now()) / 60000)
    return {
      ok: false,
      error: `Too many failed attempts. Try again in about ${mins} minute${mins === 1 ? '' : 's'}.`,
    }
  }

  const valid =
    safeEqual(username, expectedUser) && safeEqual(password, expectedPass)

  if (!valid) {
    const attempts = (session.loginAttempts ?? 0) + 1
    session.loginAttempts = attempts
    session.loginLockedUntil =
      Date.now() + Math.min(BASE_LOCK_MS * 2 ** (attempts - 1), MAX_LOCK_MS)
    await session.save()
    return { ok: false, error: 'Invalid username or password' }
  }

  session.loginAttempts = 0
  session.loginLockedUntil = 0
  session.isAdmin = true

  try {
    await session.save()
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Could not create session. Check ADMIN_SESSION_SECRET.',
    }
  }

  redirect('/admin')
}

export async function logoutAdmin() {
  const session = await getAdminSession()
  session.destroy()
  redirect('/admin')
}
