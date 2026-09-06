import { prisma } from '@/lib/db'
import { PriceTable } from '@/components/PriceTable'

export const dynamic = 'force-dynamic'

export default async function PricesPage() {
  const items = await prisma.item.findMany({
    orderBy: { volume24h: 'desc' },
    take: 200,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Item Prices</h1>
        <p className="mt-2 text-muted-foreground">
          Live DonutSMP market prices, updated hourly. Sorted by 24h volume.
        </p>
        {items.length === 0 && (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            No price data yet. Run <code>npm run sync</code> to fetch the first batch,
            or wait for the hourly cron job to populate the cache.
          </p>
        )}
      </div>
      <PriceTable items={items} />
    </div>
  )
}
