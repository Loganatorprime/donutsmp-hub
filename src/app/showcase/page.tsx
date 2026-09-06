import { ThumbsUp, Trash2, User } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShowcaseForm, SignInNote } from './ShowcaseForm'
import { upvoteShowcase, deleteShowcase } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Base Showcase',
  description:
    'Screenshot gallery of DonutSMP bases and farms — show off your builds and upvote the best.',
}

export default async function ShowcasePage() {
  const [session, entries] = await Promise.all([
    auth(),
    prisma.showcase.findMany({ orderBy: { upvotes: 'desc' }, take: 60 }),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl tracking-wide">Base Showcase</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Bragging rights central — post screenshots of your bases and farms,
        upvote the best builds.
      </p>

      <Card className="mt-8">
        <CardContent className="p-6">
          {session?.user ? <ShowcaseForm /> : <SignInNote />}
        </CardContent>
      </Card>

      {entries.length === 0 ? (
        <p className="mt-8 border border-primary/30 bg-primary/10 p-4 text-sm">
          Nothing here yet — post the first showcase above.
        </p>
      ) : (
        <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {entries.map((e) => (
            <Card key={e.id} className="mb-6 break-inside-avoid">
              <div className="overflow-hidden border-b">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.imageUrl}
                  alt={e.title}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{e.title}</h3>
                  <div className="flex shrink-0 items-center gap-2">
                    <form action={upvoteShowcase}>
                      <input type="hidden" name="id" value={e.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 border px-2 py-1 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {e.upvotes}
                      </button>
                    </form>
                    {session?.user?.id && e.createdBy === session.user.id && (
                      <form action={deleteShowcase}>
                        <input type="hidden" name="id" value={e.id} />
                        <button
                          type="submit"
                          aria-label="Delete post"
                          className="text-muted-foreground transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {e.owner}
                </p>
                {e.description && (
                  <p className="text-sm text-muted-foreground">{e.description}</p>
                )}
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {new Date(e.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
