'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { placeBet, type BetFormState } from './actions'

const initial: BetFormState = { error: null }

export interface BetItem {
  symbol: string
  name: string
  price: number
}

const QUICK_STAKES = [25, 50, 100, 250]

function formatPrice(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toLocaleString()}`
}

export function BetForm({
  items,
  balance,
  multiplier,
  minStake,
  maxStake,
}: {
  items: BetItem[]
  balance: number
  multiplier: number
  minStake: number
  maxStake: number
}) {
  const [state, formAction, pending] = useActionState(placeBet, initial)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const [symbol, setSymbol] = useState(items[0]?.symbol ?? '')
  const [stake, setStake] = useState(50)

  const selected = items.find((i) => i.symbol === symbol)
  const cap = Math.min(maxStake, Math.floor(balance))
  const potential = Math.floor(stake * multiplier)

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Your dough</p>
        <p className="text-2xl font-semibold text-primary">
          {formatPrice(balance)}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Item</label>
        <select
          name="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none"
          required
        >
          {items.map((item) => (
            <option key={item.symbol} value={item.symbol}>
              {item.name} — {formatPrice(item.price)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Call it</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDirection('up')}
            className={`flex-1 border px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
              direction === 'up'
                ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-500'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <TrendingUp className="mr-1 inline h-4 w-4" />
            Pump
          </button>
          <button
            type="button"
            onClick={() => setDirection('down')}
            className={`flex-1 border px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
              direction === 'down'
                ? 'border-red-500/60 bg-red-500/15 text-red-500'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <TrendingDown className="mr-1 inline h-4 w-4" />
            Dump
          </button>
          <input type="hidden" name="direction" value={direction} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Stake ({minStake}–{maxStake.toLocaleString()})
        </label>
        <div className="flex gap-2">
          <Input
            name="stake"
            type="number"
            min={minStake}
            max={cap}
            step={1}
            required
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="w-32"
          />
          <div className="flex flex-1 flex-wrap gap-1.5">
            {QUICK_STAKES.filter((s) => s <= cap).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStake(s)}
                className="border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setStake(cap)}
              className="border border-primary/40 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="border border-primary/30 bg-primary/5 p-3 text-sm">
        {selected ? (
          <p>
            {selected.name} @ {formatPrice(selected.price)} — if your call lands
            at the next sync you win{' '}
            <span className="font-semibold text-primary">
              {formatPrice(potential)}
            </span>
            . Ties are refunded.
          </p>
        ) : (
          <p className="text-muted-foreground">Pick an item to see your payout.</p>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending || cap < minStake}>
          {pending ? 'Placing...' : 'Place bet'}
        </Button>
        <span className="text-xs text-muted-foreground">
          Resolves at the next hourly price sync.
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
      to bet — every account starts with 1,000 dough.
    </p>
  )
}
