'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createOffer, type TradeFormState } from './actions'

const initial: TradeFormState = { error: null }

export function TradeForm() {
  const [state, formAction, pending] = useActionState(createOffer, initial)
  const [type, setType] = useState('sell')

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex gap-2">
        {(['sell', 'buy'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`border px-4 py-1.5 text-sm font-medium uppercase tracking-wide transition-colors ${
              type === t
                ? t === 'sell'
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-500'
                  : 'border-sky-500/60 bg-sky-500/15 text-sky-400'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {t === 'sell' ? 'I\'m selling' : 'I\'m buying'}
          </button>
        ))}
        <input type="hidden" name="type" value={type} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Item</label>
          <Input name="item" required placeholder="e.g. Dried Kelp" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Quantity</label>
          <Input name="quantity" type="number" min="1" step="1" required placeholder="6400" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Price per unit</label>
          <Input name="price" type="number" min="0" step="any" required placeholder="12.50" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Contact (IGN or Discord)
          </label>
          <Input name="contact" required placeholder="e.g. BenzFan#0 or IGN: kelpKing" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Note (optional)</label>
          <Input name="note" placeholder="e.g. bulk only, delivery to your base" />
        </div>
      </div>
      {state.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Posting...' : 'Post offer'}
        </Button>
        <span className="text-xs text-muted-foreground">
          Also post it in-game — this board just helps buyers find you.
        </span>
      </div>
    </form>
  )
}

export function SignInNote() {
  return (
    <p className="text-sm text-muted-foreground">
      <Link href="/auth/login" className="text-primary hover:underline">
        Sign in
      </Link>{' '}
      to post an offer. Anyone can browse.
    </p>
  )
}
