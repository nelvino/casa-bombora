import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface AdminSession {
  isAdmin?: boolean
}

const cookieName = 'admin-session'

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set. Add a strong random string to your .env.local and Netlify environment variables.'
    )
  }
  return secret
}

export async function getAdminSession() {
  return getIronSession<AdminSession>(cookies(), {
    cookieName,
    password: getSecret(),
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  })
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getAdminSession()
    return session.isAdmin === true
  } catch {
    return false
  }
}
