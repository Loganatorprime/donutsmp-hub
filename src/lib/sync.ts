import { prisma } from '@/lib/db'
import { fetchAllItems } from '@/lib/donutsmp'

export async function syncPrices(): Promise<{ upserted: number; snapshots: number }> {
  const items = await fetchAllItems()

  let upserted = 0
  let snapshots = 0

  for (const item of items) {
    await prisma.item.upsert({
      where: { symbol: item.symbol },
      update: {
        name: item.name,
        price: item.price,
        change24h: item.change24h,
        volume24h: item.volume24h,
        listings: item.listings,
        stackSize: item.stackSize,
      },
      create: {
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        change24h: item.change24h,
        volume24h: item.volume24h,
        listings: item.listings,
        stackSize: item.stackSize,
      },
    })
    upserted++

    await prisma.priceHistory.create({
      data: { symbol: item.symbol, price: item.price },
    })
    snapshots++
  }

  return { upserted, snapshots }
}
