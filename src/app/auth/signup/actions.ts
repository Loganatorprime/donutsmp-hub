'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/password'

export interface SignupState {
  error: string | null
}

export async function signupAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (!email || !password || !confirm) {
    return { error: 'Fill in all required fields.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Enter a valid email address.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  if (password !== confirm) {
    return { error: 'Passwords do not match.' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'An account with that email already exists.' }
  }

  await prisma.user.create({
    data: {
      email,
      name: name || email.split('@')[0],
      passwordHash: await hashPassword(password),
    },
  })

  try {
    await signIn('credentials', { email, password, redirectTo: '/' })
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'Could not sign you in after signing up. Try logging in.' }
    }
    throw err
  }

  return { error: null }
}
