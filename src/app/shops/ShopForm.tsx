'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createShop, type ShopFormState } from './actions'

const initial: ShopFormState = { error: null }

export function ShopForm() {
  const [state, formAction, pending] = useActionState(createShop, initial)

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Shop name</label>
          <Input name="name" required placeholder="e.g. Kelp Empire Outlet" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Owner (IGN)</label>
          <Input name="owner" required placeholder="e.g. kelpKing" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Warp / coords</label>
          <Input name="warp" required placeholder="e.g. /p h kelpKing or 1200, 64, -800" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            What do you sell? (tags, comma-separated)
          </label>
          <Input name="tags" placeholder="e.g. kelp, smokers, redstone" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Description (optional)
          </label>
          <Input name="description" placeholder="e.g. Bulk discounts on 10+ stacks" />
        </div>
      </div>
      {state.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Listing...' : 'List my shop'}
      </Button>
    </form>
  )
}

export function SignInNote() {
  return (
    <p className="text-sm text-muted-foreground">
      <Link href="/auth/login" className="text-primary hover:underline">
        Sign in
      </Link>{' '}
      to list your shop. Anyone can browse.
    </p>
  )
}
