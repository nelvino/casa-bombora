'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAdmin } from '@/app/admin/login/actions'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Signing in...' : 'Sign in'}
    </Button>
  )
}

export function LoginForm() {
  const [state, action] = useFormState(loginAdmin, { ok: false, error: '' })

  return (
    <Container size="small" className="py-24">
      <div className="mx-auto max-w-md rounded-2xl border border-gunmetal/10 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-gunmetal">Admin sign in</h1>
        <p className="mb-8 text-gunmetal/70">
          Enter your admin credentials to manage bookings and holds.
        </p>

        <form action={action} className="space-y-4">
          <label className="block text-sm text-gunmetal/80">
            Username
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-md border border-lion bg-transparent p-2 text-gunmetal focus:border-blue-green focus:outline-none focus:ring-1 focus:ring-blue-green"
            />
          </label>

          <label className="block text-sm text-gunmetal/80">
            Password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-lion bg-transparent p-2 text-gunmetal focus:border-blue-green focus:outline-none focus:ring-1 focus:ring-blue-green"
            />
          </label>

          {state.error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </Container>
  )
}
