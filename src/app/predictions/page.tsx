import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { MAX_STAKE, MIN_STAKE, PAYOUT_MULTIPLIER } from '@/lib/bets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BetForm, SignInNote } from './BetForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Price Predictions',
  description:
    'Bet dough on whether items pump or dump by the next hourly sync — correct calls pay 1.95×.',
}

function formatPrice(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toLocaleString()}`
}

function DirectionBadge({ direction }: { direction: string }) {
  const up = direction === 'up'
  return (
    <Badge
      className={`uppercase tracking-wide ${
        up
          ? 'bg-emerald-500/15 text-emerald-500'
          : 'bg-red-500/15 text-red-500'
      }`}
    >
      {up ? (
        <ArrowUpRight className="mr-1 h-3 w-3" />
      ) : (
        <ArrowDownRight className="mr-1 h-3 w-3" />
      )}
      {up ? 'Pump' : 'Dump'}
    </Badge>
  )
}

export default async function PredictionsPage() {
  const session = await auth()
  const userId = session?.user?.id

  const [items, me, openBets, history, leaderboard] = await Promise.all([
    prisma.item.findMany({ orderBy: { volume24h: 'desc' }, take: 50 }),
    userId ? prisma.user.findUnique({ where: { id: userId } }) : null,
    userId
      ? prisma.bet.findMany({
          where: { userId, status: 'open' },
          include: { item: true },
          orderBy: { createdAt: 'desc' },
        })
      : [],
    userId
      ? prisma.bet.findMany({
          where: { userId, status: { not: 'open' } },
          include: { item: true },
          orderBy: { resolvedAt: 'desc' },
          take: 10,
        })
      : [],
    prisma.user.findMany({
      where: { bets: { some: {} } },
      orderBy: { coins: 'desc' },
      take: 10,
      select: { id: true, name: true, coins: true },
    }),
  ])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="font-heading text-3xl tracking-wide">Price Predictions</h1>
        <p className="mt-8 border border-primary/30 bg-primary/10 p-4 text-sm">
          No market data yet — run <code>npm run sync</code> to fetch prices
          first.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl tracking-wide">Price Predictions</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Think you can read the market? Bet dough on whether an item will be
        higher or lower at the next hourly sync. Correct calls pay{' '}
        {PAYOUT_MULTIPLIER}×, ties are refunded.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Bet slip</CardTitle>
          </CardHeader>
          <CardContent>
            {session?.user ? (
              <BetForm
                items={items.map((i) => ({
                  symbol: i.symbol,
                  name: i.name,
                  price: i.price,
                }))}
                balance={me?.coins ?? 0}
                multiplier={PAYOUT_MULTIPLIER}
                minStake={MIN_STAKE}
                maxStake={MAX_STAKE}
              />
            ) : (
              <SignInNote />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Your open bets</CardTitle>
          </CardHeader>
          <CardContent>
            {!session?.user ? (
              <p className="text-sm text-muted-foreground">
                Sign in to see your bets.
              </p>
            ) : openBets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No open bets — place your first call on the left.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Call</TableHead>
                    <TableHead className="text-right">Stake</TableHead>
                    <TableHead className="text-right">Entry</TableHead>
                    <TableHead className="text-right">Now</TableHead>
                    <TableHead className="text-right">To win</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openBets.map((bet) => {
                    const winning =
                      bet.item.price === bet.entryPrice
                        ? null
                        : bet.direction === 'up'
                          ? bet.item.price > bet.entryPrice
                          : bet.item.price < bet.entryPrice
                    return (
                      <TableRow key={bet.id}>
                        <TableCell>
                          <Link
                            href={`/prices/${bet.symbol}`}
                            className="font-medium hover:underline"
                          >
                            {bet.item.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <DirectionBadge direction={bet.direction} />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(bet.stake)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatPrice(bet.entryPrice)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            winning === null
                              ? 'text-muted-foreground'
                              : winning
                                ? 'text-emerald-600'
                                : 'text-red-600'
                          }`}
                        >
                          {formatPrice(bet.item.price)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-primary">
                          {formatPrice(Math.floor(bet.stake * PAYOUT_MULTIPLIER))}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent results</CardTitle>
          </CardHeader>
          <CardContent>
            {!session?.user ? (
              <p className="text-sm text-muted-foreground">
                Sign in to see your history.
              </p>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing resolved yet — bets settle at the next hourly sync.
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((bet) => (
                  <li
                    key={bet.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
                  >
                    <DirectionBadge direction={bet.direction} />
                    <Link
                      href={`/prices/${bet.symbol}`}
                      className="font-medium hover:underline"
                    >
                      {bet.item.name}
                    </Link>
                    {bet.status === 'won' ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600">
                        Won +{formatPrice(bet.payout - bet.stake)}
                      </Badge>
                    ) : bet.status === 'lost' ? (
                      <Badge className="bg-red-500/15 text-red-600">
                        Lost −{formatPrice(bet.stake)}
                      </Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground">
                        <Minus className="mr-1 h-3 w-3" />
                        Refunded
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {bet.resolvedAt?.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bettors yet — be the first on the board.
              </p>
            ) : (
              <ol className="space-y-2">
                {leaderboard.map((user, i) => (
                  <li
                    key={user.id}
                    className={`flex items-center gap-3 text-sm ${
                      user.id === userId ? 'text-primary' : ''
                    }`}
                  >
                    <span className="w-6 text-right font-semibold text-muted-foreground">
                      {i + 1}.
                    </span>
                    <span className="font-medium">
                      {user.name ?? 'Anonymous'}
                    </span>
                    <span className="ml-auto font-semibold">
                      {formatPrice(user.coins)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
