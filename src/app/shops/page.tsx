import Link from 'next/link'
import { MapPin, Store, ThumbsUp, Trash2, User } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShopForm, SignInNote } from './ShopForm'
import { upvoteShop, deleteShop } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Player Shops',
  description:
    'Directory of DonutSMP player shops — warps, what they sell, and community ratings.',
}

export default async function ShopsPage({
  searchParams,
}: PageProps<'/shops'>) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : ''

  const [session, shops] = await Promise.all([
    auth(),
    prisma.shop.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { owner: { contains: q } },
              { tags: { contains: q } },
            ],
          }
        : {},
      orderBy: { upvotes: 'desc' },
      take: 100,
    }),
  ])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl tracking-wide">Player Shops</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Where to spend your coins — community-run shops ranked by upvotes.
        List yours to get found.
      </p>

      <Card className="mt-8">
        <CardContent className="p-6">
          {session?.user ? <ShopForm /> : <SignInNote />}
        </CardContent>
      </Card>

      <form action="/shops" method="GET" className="mt-8 flex justify-end">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search shops, owners, tags..."
          className="h-8 w-64 border border-input bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
        />
      </form>

      {shops.length === 0 ? (
        <p className="mt-8 border border-primary/30 bg-primary/10 p-4 text-sm">
          No shops listed yet — add yours above.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {shops.map((s) => (
            <Card key={s.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Store className="h-4 w-4 text-primary" />
                      {s.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {s.owner}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={upvoteShop}>
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 border px-2 py-1 text-xs transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {s.upvotes}
                      </button>
                    </form>
                    {session?.user?.id && s.createdBy === session.user.id && (
                      <form action={deleteShop}>
                        <input type="hidden" name="id" value={s.id} />
                        <button
                          type="submit"
                          aria-label="Delete shop"
                          className="text-muted-foreground transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                <p className="flex items-center gap-1.5 font-mono text-sm text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  {s.warp}
                </p>
                {s.description && (
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                )}
                {s.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.split(',').map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="text-xs text-muted-foreground"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Shop availability depends on the owner being online —{' '}
        <Link href="/trades" className="text-primary hover:underline">
          the trade board
        </Link>{' '}
        works offline too.
      </p>
    </div>
  )
}
