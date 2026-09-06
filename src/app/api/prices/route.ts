import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const sort = searchParams.get('sort') ?? 'volume24h'
  const direction = searchParams.get('direction') === 'asc' ? 'asc' : 'desc'
  const search = searchParams.get('search')?.toLowerCase() ?? ''
  const limit = Math.min(Number(searchParams.get('limit') ?? 200), 200)

  const orderBy: Record<string, 'asc' | 'desc'> =
    sort === 'price' || sort === 'change24h' || sort === 'volume24h' || sort === 'listings' || sort === 'name'
      ? { [sort]: direction }
      : { volume24h: 'desc' }

  const items = await prisma.item.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search } },
            { symbol: { contains: search } },
          ],
        }
      : undefined,
    orderBy,
    take: limit,
  })

  return NextResponse.json({ data: items, total: items.length })
}
