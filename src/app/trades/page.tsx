import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { TradeForm, SignInNote } from './TradeForm'
import { deleteOffer } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Trade Board',
  description:
    'Community buy and sell offers for DonutSMP — find buyers for your farm output or sellers for your next build.',
}

function formatCoins(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toLocaleString()}`
}

export default async function TradesPage({
  searchParams,
}: PageProps<'/trades'>) {
  const sp = await searchParams
  const filter = sp.type === 'buy' || sp.type === 'sell' ? sp.type : 'all'
  const q = typeof sp.q === 'string' ? sp.q.trim() : ''

  const [session, offers] = await Promise.all([
    auth(),
    prisma.tradeOffer.findMany({
      where: {
        ...(filter !== 'all' ? { type: filter } : {}),
        ...(q ? { item: { contains: q } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl tracking-wide">Trade Board</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Buy and sell directly with other players. Post what you&apos;re farming
        or what you need — meet in-game to close the deal.
      </p>

      <Card className="mt-8">
        <CardContent className="p-6">
          {session?.user ? <TradeForm /> : <SignInNote />}
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {[
            { v: 'all', label: 'All' },
            { v: 'sell', label: 'Selling' },
            { v: 'buy', label: 'Buying' },
          ].map((t) => (
            <Link
              key={t.v}
              href={t.v === 'all' ? '/trades' : `/trades?type=${t.v}`}
              className={`border px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === t.v
                  ? 'border-primary/60 bg-primary/15 text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <form action="/trades" method="GET" className="flex gap-2">
          {filter !== 'all' && <input type="hidden" name="type" value={filter} />}
          <Input name="q" defaultValue={q} placeholder="Search items..." className="w-48" />
        </form>
      </div>

      {offers.length === 0 ? (
        <p className="mt-8 border border-primary/30 bg-primary/10 p-4 text-sm">
          No offers yet — be the first to post one above.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {offers.map((o) => {
            const selling = o.type === 'sell'
            return (
              <li key={o.id}>
                <Card>
                  <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
                    <Badge
                      className={`uppercase tracking-wide ${
                        selling
                          ? 'bg-emerald-500/15 text-emerald-500'
                          : 'bg-sky-500/15 text-sky-400'
                      }`}
                    >
                      {selling ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {selling ? 'Selling' : 'Buying'}
                    </Badge>
                    <div className="min-w-40">
                      <p className="font-semibold">{o.item}</p>
                      <p className="text-xs text-muted-foreground">
                        ×{o.quantity.toLocaleString()} @ {formatCoins(o.price)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total{' '}
                      <span className="font-medium text-foreground">
                        {formatCoins(o.quantity * o.price)}
                      </span>
                    </p>
                    {o.note && (
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{o.note}&rdquo;
                      </p>
                    )}
                    <p className="ml-auto text-sm">
                      <span className="text-muted-foreground">Contact:</span>{' '}
                      <span className="font-medium">{o.contact}</span>
                    </p>
                    {session?.user?.id && o.createdBy === session.user.id && (
                      <form action={deleteOffer}>
                        <input type="hidden" name="id" value={o.id} />
                        <button
                          type="submit"
                          aria-label="Delete offer"
                          className="text-muted-foreground transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
