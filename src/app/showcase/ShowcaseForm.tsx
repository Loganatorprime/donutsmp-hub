'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createShowcase, type ShowcaseFormState } from './actions'

const initial: ShowcaseFormState = { error: null }

export function ShowcaseForm() {
  const [state, formAction, pending] = useActionState(createShowcase, initial)

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <Input name="title" required placeholder="e.g. My 64-module kelp empire" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Owner (IGN)</label>
          <Input name="owner" required placeholder="e.g. kelpKing" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <Textarea
          name="description"
          rows={2}
          placeholder="How long did it take? What does it produce?"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Upload screenshot
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm text-muted-foreground file:mr-3 file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:text-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            ...or paste image URL
          </label>
          <Input name="imageUrl" placeholder="https://i.imgur.com/..." />
        </div>
      </div>
      {state.error && (
        <p className="text-sm text-red-500" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? 'Posting...' : 'Post to showcase'}
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
      to show off your base. Anyone can browse and upvote.
    </p>
  )
}
