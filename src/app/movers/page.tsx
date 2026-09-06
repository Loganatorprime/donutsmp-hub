import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(1)}K`
  return `$${price.toLocaleString()}`
}

export default async function MoversPage() {
  const [topGainers, topLosers, topVolume] = await Promise.all([
    prisma.item.findMany({ orderBy: { change24h: 'desc' }, take: 10 }),
    prisma.item.findMany({ orderBy: { change24h: 'asc' }, take: 10 }),
    prisma.item.findMany({ orderBy: { volume24h: 'desc' }, take: 10 }),
  ])

  function renderList(
    items: typeof topGainers,
    color: (v: number) => string,
  ) {
    if (items.length === 0) {
      return <p className="text-sm text-muted-foreground">No data yet.</p>
    }
    return (
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.symbol} className="flex items-center justify-between text-sm">
            <Link href={`/prices/${item.symbol}`} className="font-medium hover:underline">
              {item.name}
            </Link>
            <span className={color(item.change24h)}>
              {item.change24h >= 0 ? '+' : ''}
              {item.change24h.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Market Movers</h1>
      <p className="mt-2 text-muted-foreground">
        Top gainers, losers, and most-traded items over the last 24 hours.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-600">Top Gainers</CardTitle>
          </CardHeader>
          <CardContent>
            {renderList(topGainers, (v) => (v >= 0 ? 'text-emerald-600' : 'text-red-600'))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Top Losers</CardTitle>
          </CardHeader>
          <CardContent>
            {renderList(topLosers, (v) => (v >= 0 ? 'text-emerald-600' : 'text-red-600'))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Highest Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topVolume.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              ) : (
                topVolume.map((item) => (
                  <li
                    key={item.symbol}
                    className="flex items-center justify-between text-sm"
                  >
                    <Link
                      href={`/prices/${item.symbol}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <span className="text-muted-foreground">
                      {formatPrice(item.volume24h)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
