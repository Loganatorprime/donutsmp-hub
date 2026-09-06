import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShardCalculator } from './ShardCalculator'

export const metadata = {
  title: 'Server Guides',
  description:
    'DonutSMP economy commands, shards and spawner mechanics, and a spawner calculator.',
}

const COMMANDS = [
  {
    cmd: '/ah',
    title: 'Auction House',
    body: 'List and bid on items. High-value goods (spawners, netherite, totems, piglin heads) trade here. Watch for underpriced snipes.',
  },
  {
    cmd: '/orders',
    title: 'Buy & Sell Orders',
    body: 'Bulk trading — farm output like kelp, petals, and fungus sells best by stacking sell orders. Check the spread before you build.',
  },
  {
    cmd: '/shop',
    title: 'Server Shop',
    body: 'Fixed-price essentials. Baseline prices make it useful for flipping when demand spikes above shop rates.',
  },
  {
    cmd: '/sell',
    title: 'Quick Sell',
    body: 'Instantly dump farmed items for coin. Lower margin than orders, but zero waiting.',
  },
]

const MECHANICS = [
  {
    title: 'Shards',
    body: 'Earned passively in the AFK zone (1 per minute) and from player kills (10 each). Spent on spawners.',
  },
  {
    title: 'Spawners',
    body: 'Bought with shards and placed to generate mob loot around the clock. Per-spawner output falls as you add more — use the calculator below before expanding.',
  },
  {
    title: 'AFK Zone',
    body: 'Safe spot to accumulate shards while offline-ish. Overnight AFK sessions fund your first spawners.',
  },
  {
    title: 'Netherite & Ancient Debris',
    body: 'Always in demand as a long-term hold. Mine it, craft ingots, and ride the price charts on this site.',
  },
]

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl tracking-wide">Server Guides</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Everything a new DonutSMP player needs: how the economy commands work,
        how shards turn into spawners, and where the money actually is.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Economy commands</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {COMMANDS.map((c) => (
            <Card key={c.cmd}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Badge className="bg-primary/15 font-mono text-primary normal-case">
                    {c.cmd}
                  </Badge>
                  {c.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{c.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Mechanics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {MECHANICS.map((m) => (
            <Card key={m.title}>
              <CardContent className="p-6">
                <h3 className="font-semibold">{m.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{m.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Spawner calculator</h2>
        <p className="mt-2 text-muted-foreground">
          Turn AFK time and kills into spawner counts.
        </p>
        <Card className="mt-4">
          <CardContent className="p-6">
            <ShardCalculator />
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Where to go next</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/prices"
            className="border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            Check live prices
          </Link>
          <Link
            href="/meta"
            className="border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            Compare farm money-makers
          </Link>
          <Link
            href="/schematics"
            className="border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            Grab a farm schematic
          </Link>
          <Link
            href="/recommender"
            className="border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            Find your ideal farm
          </Link>
        </div>
      </section>
    </div>
  )
}
