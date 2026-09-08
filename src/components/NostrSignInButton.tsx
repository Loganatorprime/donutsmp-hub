'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import type { NostrEvent } from '@/types/nostr'

export function NostrSignInButton({
  mode = 'signin',
}: {
  mode?: 'signin' | 'signup'
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)

    if (typeof window === 'undefined' || !window.nostr) {
      setError(
        'No Nostr signer found. Install a NIP-07 extension (e.g. Alby, nos2x) and try again.',
      )
      return
    }

    setPending(true)
    try {
      const pubkey = await window.nostr.getPublicKey()

      const res = await fetch(
        `/api/auth/nostr/challenge?pubkey=${encodeURIComponent(pubkey)}`,
      )
      if (!res.ok) throw new Error('Could not get sign-in challenge.')
      const { challenge } = (await res.json()) as { challenge: string }

      const unsigned: NostrEvent = {
        kind: 22242,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['challenge', challenge]],
        content:
          mode === 'signup'
            ? 'Create your DonutSMP Hub account'
            : 'Sign in to DonutSMP Hub',
        pubkey,
      }
      const signed = await window.nostr.signEvent(unsigned)

      const result = await signIn('nostr', {
        event: JSON.stringify(signed),
        redirect: false,
      })

      if (result?.error) throw new Error('Sign-in failed. Please try again.')

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full"
      >
        {pending
          ? 'Check your Nostr signer…'
          : mode === 'signup'
            ? 'Sign up with Nostr'
            : 'Continue with Nostr'}
      </Button>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
