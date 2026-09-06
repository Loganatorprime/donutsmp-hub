import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { PriceChart } from '@/components/PriceChart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FARMS } from '@/lib/farms'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: PageProps<'/prices/[symbol]'>): Promise<Metadata> {
  const { symbol } = await params
  const item = await prisma.item.findUnique({ where: { symbol } })
  if (!item) return { title: 'Item not found' }
  return {
    title: `${item.name} price`,
    description: `Live ${item.name} price, 24h change, and price history on DonutSMP.`,
  }
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(1)}K`
  return `$${price.toLocaleString()}`
}

export default async function ItemDetailPage({
  params,
}: PageProps<'/prices/[symbol]'>) {
  const { symbol } = await params
  const item = await prisma.item.findUnique({
    where: { symbol },
    include: { history: { orderBy: { createdAt: 'asc' }, take: 500 } },
  })

  if (!item) notFound()

  const relatedFarms = FARMS.filter((f) => f.itemSymbol === item.symbol)
  const up = item.change24h >= 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <Badge
          className={
            up ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-600'
          }
        >
          {up ? '+' : ''}
          {item.change24h.toFixed(1)}%
        </Badge>
        <span className="text-sm text-muted-foreground">{item.symbol}</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${item.price.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              24h Change
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-bold ${up ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {up ? '+' : ''}
            {item.change24h.toFixed(1)}%
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              24h Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {formatPrice(item.volume24h)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Listings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{item.listings}</CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          {item.history.length > 1 ? (
            <PriceChart
              data={item.history.map((h) => ({
                time: h.createdAt.toISOString(),
                price: h.price,
              }))}
            />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Not enough history yet — prices are captured hourly. Check back soon.
            </p>
          )}
        </CardContent>
      </Card>

      {relatedFarms.length > 0 && (
        <Card className="mt-8 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardHeader>
            <CardTitle className="text-xl">Money-making meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedFarms.map((farm) => (
              <div key={farm.id}>
                <p className="font-medium">
                  {farm.name}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {farm.estimate}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {farm.description}
                </p>
              </div>
            ))}
            <Link
              href="/meta"
              className="inline-block text-sm font-medium text-amber-600 hover:underline"
            >
              View full farm meta →
            </Link>
          </CardContent>
        </Card>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Last updated {item.updatedAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  )
}
