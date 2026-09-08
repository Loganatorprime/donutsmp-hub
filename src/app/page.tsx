import Link from 'next/link'
import { prisma } from '@/lib/db'
import { bestFarm } from '@/lib/farms'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Dices,
  Sprout,
  TrendingUp,
  Wallet,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const FEATURES = [
  {
    href: '/prices',
    icon: TrendingUp,
    title: 'Live Prices',
    description:
      'Every item, updated hourly — search, sort, and track 24h movers across the whole market.',
  },
  {
    href: '/movers',
    icon: TrendingUp,
    title: 'Market Movers',
    description:
      'Top gainers, losers, and highest-volume items over the last 24 hours.',
  },
  {
    href: '/predictions',
    icon: Dices,
    title: 'Predictions',
    description:
      'Bet play-money dough on hourly pumps and dumps — correct calls pay 1.95×. Climb the leaderboard.',
  },
  {
    href: '/meta',
    icon: Sprout,
    title: 'Farm Meta',
    description:
      'Ranked money-making methods with live profitability, difficulty, and upfront cost.',
  },
  {
    href: '/schematics',
    icon: Boxes,
    title: 'Schematics',
    description:
      'Real community farm builds — download the .litematic and paste it straight into your world.',
  },
  {
    href: '/guides',
    icon: BookOpen,
    title: 'Guides',
    description:
      'Economy commands, shard and spawner mechanics, and a spawner calculator for new players.',
  },
  {
    href: '/portfolio',
    icon: Wallet,
    title: 'Portfolio',
    description:
      'Sign in to track the items you hold and watch your profit and loss in real time.',
  },
]

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(1)}K`
  return `$${price.toLocaleString()}`
}

export default async function Home() {
  const [itemCount, topGainers, topLosers] = await Promise.all([
    prisma.item.count(),
    prisma.item.findMany({ orderBy: { change24h: 'desc' }, take: 5 }),
    prisma.item.findMany({ orderBy: { change24h: 'asc' }, take: 5 }),
  ])
  const best = bestFarm()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <section className="text-center">
        <Badge className="border border-primary/40 bg-primary/10 text-primary">
          Community project · Not affiliated with DonutSMP
        </Badge>
        <h1 className="font-heading mx-auto mt-6 max-w-3xl text-4xl leading-tight tracking-wide sm:text-5xl">
          The DonutSMP economy,{' '}
          <span className="text-primary">at a glance</span>
        </h1>
        <div
          aria-hidden
          className="mx-auto mt-6 flex w-fit items-center gap-2"
        >
          <span className="h-1.5 w-8 -rotate-12 bg-primary" />
          <span className="h-1.5 w-8 rotate-6 bg-amber-400" />
          <span className="h-1.5 w-8 -rotate-6 bg-sky-400" />
          <span className="h-1.5 w-8 rotate-12 bg-emerald-400" />
          <span className="h-1.5 w-8 -rotate-12 bg-violet-400" />
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Live item prices, the current money-making meta, and community
          schematics — everything you need to get rich on DonutSMP.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/prices"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Browse prices
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/meta"
            className="inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Farm meta
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Tracking {itemCount} items, updated hourly.
        </p>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-emerald-600">Top Gainers</CardTitle>
            <Link href="/movers" className="text-sm text-muted-foreground hover:text-foreground">
              All movers →
            </Link>
          </CardHeader>
          <CardContent>
            {topGainers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No data yet — run <code>npm run sync</code> to fetch prices.
              </p>
            ) : (
              <ul className="space-y-2">
                {topGainers.map((item) => (
                  <li key={item.symbol} className="flex items-center justify-between text-sm">
                    <Link href={`/prices/${item.symbol}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <span className="flex items-center gap-3">
                      <span className="text-muted-foreground">{formatPrice(item.price)}</span>
                      <span className="w-16 text-right text-emerald-600">
                        +{item.change24h.toFixed(1)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-red-600">Top Losers</CardTitle>
            <Link href="/movers" className="text-sm text-muted-foreground hover:text-foreground">
              All movers →
            </Link>
          </CardHeader>
          <CardContent>
            {topLosers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {topLosers.map((item) => (
                  <li key={item.symbol} className="flex items-center justify-between text-sm">
                    <Link href={`/prices/${item.symbol}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <span className="flex items-center gap-3">
                      <span className="text-muted-foreground">{formatPrice(item.price)}</span>
                      <span className="w-16 text-right text-red-600">
                        {item.change24h.toFixed(1)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/15 to-transparent">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
              <Badge className="bg-primary text-primary-foreground">Current Best Farm</Badge>
              {best.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{best.description}</p>
            <Link
              href="/meta"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See the full ranking
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Link key={feature.href} href={feature.href} className="group">
            <Card className="h-full transition-colors group-hover:border-amber-500/40">
              <CardContent className="space-y-3 p-6">
                <feature.icon className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  )
}
