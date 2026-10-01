import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const session = vi.hoisted(() => ({
  state: {} as Record<string, unknown>,
}))

vi.mock('@/lib/auth/session', () => ({
  getAdminSession: async () => ({
    get isAdmin() {
      return session.state.isAdmin
    },
    set isAdmin(v) {
      session.state.isAdmin = v
    },
    get loginAttempts() {
      return session.state.loginAttempts as number | undefined
    },
    set loginAttempts(v) {
      session.state.loginAttempts = v
    },
    get loginLockedUntil() {
      return session.state.loginLockedUntil as number | undefined
    },
    set loginLockedUntil(v) {
      session.state.loginLockedUntil = v
    },
    save: vi.fn(async () => {}),
    destroy: vi.fn(() => {
      session.state = {}
    }),
  }),
}))

const redirectMock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  })
)
vi.mock('next/navigation', () => ({ redirect: redirectMock }))

function form(data: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(data)) fd.set(k, v)
  return fd
}

const creds = { username: 'admin', password: 'secret' }

beforeEach(() => {
  session.state = {}
  redirectMock.mockClear()
  vi.stubEnv('ADMIN_USERNAME', 'admin')
  vi.stubEnv('ADMIN_PASSWORD', 'secret')
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('loginAdmin', () => {
  it('rejects wrong credentials', async () => {
    const { loginAdmin } = await import('../actions')
    const res = await loginAdmin(null, form({ username: 'x', password: 'y' }))
    expect(res).toEqual({ ok: false, error: 'Invalid username or password' })
  })

  it('locks out after the first failure with exponential backoff', async () => {
    const { loginAdmin } = await import('../actions')
    await loginAdmin(null, form({ username: 'x', password: 'y' }))
    expect(session.state.loginAttempts).toBe(1)
    // first lock: 15s
    expect(session.state.loginLockedUntil).toBe(Date.now() + 15000)
  })

  it('refuses login while locked even with correct credentials', async () => {
    const { loginAdmin } = await import('../actions')
    session.state.loginLockedUntil = Date.now() + 60000
    const res = await loginAdmin(null, form(creds))
    expect(res.ok).toBe(false)
    expect(res.error).toContain('Too many failed attempts')
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('redirects on success and resets the attempt counter', async () => {
    const { loginAdmin } = await import('../actions')
    session.state.loginAttempts = 3
    await expect(loginAdmin(null, form(creds))).rejects.toThrow('NEXT_REDIRECT')
    expect(session.state.isAdmin).toBe(true)
    expect(session.state.loginAttempts).toBe(0)
    expect(session.state.loginLockedUntil).toBe(0)
    expect(redirectMock).toHaveBeenCalledWith('/admin')
  })

  it('reports missing configuration', async () => {
    vi.stubEnv('ADMIN_USERNAME', '')
    const { loginAdmin } = await import('../actions')
    const res = await loginAdmin(null, form(creds))
    expect(res.ok).toBe(false)
    expect(res.error).toContain('not configured')
  })
})
