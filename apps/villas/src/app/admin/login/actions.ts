'use server'

import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth/session'

export async function loginAdmin(prevState: unknown, formData: FormData) {
  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')

  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD

  if (!expectedUser || !expectedPass) {
    return { ok: false, error: 'Admin login is not configured' }
  }

  if (username !== expectedUser || password !== expectedPass) {
    return { ok: false, error: 'Invalid username or password' }
  }

  try {
    const session = await getAdminSession()
    session.isAdmin = true
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
