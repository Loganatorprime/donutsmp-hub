export interface DonutItem {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  listings: number
  stackSize: number
}

export interface MarketItemsResponse {
  data: DonutItem[]
  cursor?: string | null
  total: number
}

export interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface MoverItem {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  listings: number
}

const BASE_URL =
  process.env.DONUTSMP_API_BASE || 'https://api.donutsmp-mc.com/v1'

async function get<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  const headers: Record<string, string> = { Accept: 'application/json' }
  const apiKey = process.env.DONUTSMP_API_KEY
  if (apiKey) headers['X-API-Key'] = apiKey

  const res = await fetch(url.toString(), { headers, cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`DonutSMP API error ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

export async function fetchAllItems(): Promise<DonutItem[]> {
  const items: DonutItem[] = []
  let cursor: string | null = null
  let page = 0

  do {
    const marketData: MarketItemsResponse = await get<MarketItemsResponse>(
      '/market/items',
      {
        limit: 200,
        ...(cursor ? { cursor } : {}),
      },
    )
    items.push(...marketData.data)
    cursor = marketData.cursor ?? null
    page++

    if (page > 20) break
  } while (cursor)

  return items
}

export async function fetchItem(symbol: string): Promise<DonutItem> {
  return get<DonutItem>(`/market/items/${encodeURIComponent(symbol)}`)
}

export async function fetchCandles(
  symbol: string,
  interval: string = '1h',
  limit: number = 168,
): Promise<CandleData[]> {
  const res = await get<{ data?: CandleData[] } | CandleData[]>(
    `/market/items/${encodeURIComponent(symbol)}/candles`,
    { interval, limit },
  )
  return Array.isArray(res) ? res : res.data ?? []
}

export async function fetchMovers(): Promise<MoverItem[]> {
  const res = await get<{ data?: MoverItem[] } | MoverItem[]>('/market/movers', {
    limit: 50,
  })
  return Array.isArray(res) ? res : res.data ?? []
}
