'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export interface TableItem {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  listings: number
  stackSize: number
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(1)}K`
  return `$${price.toLocaleString()}`
}

function formatFullPrice(price: number): string {
  return `$${price.toLocaleString()}`
}

export function PriceTable({ items }: { items: TableItem[] }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<keyof TableItem>('volume24h')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    const filtered = items.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.symbol.toLowerCase().includes(search.toLowerCase()),
    )
    return [...filtered].sort((a, b) => {
      const av = a[sort]
      const bv = b[sort]
      if (typeof av === 'number' && typeof bv === 'number') {
        return dir === 'asc' ? av - bv : bv - av
      }
      const as = String(av)
      const bs = String(bv)
      return dir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as)
    })
  }, [items, search, sort, dir])

  function toggleSort(key: keyof TableItem) {
    if (key === sort) {
      setDir(dir === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(key)
      setDir('desc')
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => toggleSort('name')} className="cursor-pointer">
              Item
            </TableHead>
            <TableHead onClick={() => toggleSort('price')} className="cursor-pointer">
              Price
            </TableHead>
            <TableHead onClick={() => toggleSort('change24h')} className="cursor-pointer">
              24h Change
            </TableHead>
            <TableHead onClick={() => toggleSort('volume24h')} className="cursor-pointer">
              24h Volume
            </TableHead>
            <TableHead onClick={() => toggleSort('listings')} className="cursor-pointer">
              Listings
            </TableHead>
            <TableHead>Stack</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((item) => (
              <TableRow key={item.symbol}>
                <TableCell>
                  <Link
                    href={`/prices/${item.symbol}`}
                    className="font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {item.symbol}
                  </span>
                </TableCell>
                <TableCell title={formatFullPrice(item.price)}>
                  {formatPrice(item.price)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.change24h >= 0 ? 'default' : 'destructive'}
                    className={
                      item.change24h >= 0
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-red-500/15 text-red-600'
                    }
                  >
                    {item.change24h >= 0 ? '+' : ''}
                    {item.change24h.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell>{formatPrice(item.volume24h)}</TableCell>
                <TableCell>{item.listings}</TableCell>
                <TableCell>{item.stackSize}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
