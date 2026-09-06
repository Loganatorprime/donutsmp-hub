'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginAction, type LoginState } from './actions'

const initial: LoginState = { error: null }

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="demo@donutsmp.gg"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="donutsmp"
        />
      </div>
      {state.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
