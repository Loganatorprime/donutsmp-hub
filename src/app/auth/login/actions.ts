'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/lib/auth'

export interface LoginState {
  error: string | null
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter both email and password.' }
  }

  try {
    await signIn('credentials', { email, password, redirectTo: '/' })
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'Invalid email or password.' }
    }
    throw err
  }

  return { error: null }
}
