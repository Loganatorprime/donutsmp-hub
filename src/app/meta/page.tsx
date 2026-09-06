import { prisma } from '@/lib/db'
import { FARMS, bestFarm } from '@/lib/farms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const dynamic = 'force-dynamic'

const CATEGORY_LABEL: Record<string, string> = {
  passive: 'Passive Farm',
  combat: 'Combat Farm',
  trade: 'Trading',
  crafting: 'Crafting',
  mining: 'Mining',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-600',
  Medium: 'bg-amber-500/15 text-amber-600',
  Hard: 'bg-red-500/15 text-red-600',
}

export default async function MetaPage() {
  const items = await prisma.item.findMany({
    where: { symbol: { in: FARMS.map((f) => f.itemSymbol).filter(Boolean) as string[] } },
  })
  const priceMap = new Map(items.map((i) => [i.symbol, i.price]))
  const top = bestFarm()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Farm &amp; Money Meta</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Ranked money-making methods for DonutSMP with live profitability where
        available. The &quot;best&quot; method changes as prices move — check back regularly.{' '}
        <Link href="/recommender" className="text-primary hover:underline">
          Not sure where to start? Take the recommender quiz →
        </Link>
      </p>

      <Card className="mt-6 border-primary/40 bg-gradient-to-br from-primary/15 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Badge className="bg-primary text-primary-foreground">Current Best</Badge>
            {top.name}
          </CardTitle>
          <CardDescription>
            Estimated {top.estimate} · Difficulty {top.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{top.description}</p>
        </CardContent>
      </Card>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Farm</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Est. Output</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Upfront Cost</TableHead>
            <TableHead>Sell Method</TableHead>
            <TableHead>Item Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {FARMS.map((farm) => {
            const price = farm.itemSymbol ? priceMap.get(farm.itemSymbol) : undefined
            return (
              <TableRow key={farm.id}>
                <TableCell className="font-medium">{farm.name}</TableCell>
                <TableCell>{CATEGORY_LABEL[farm.category]}</TableCell>
                <TableCell>{farm.estimate}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={DIFFICULTY_COLOR[farm.difficulty]}
                  >
                    {farm.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>{farm.upfrontCost}</TableCell>
                <TableCell>{farm.sellMethod}</TableCell>
                <TableCell>
                  {price !== undefined
                    ? `$${price.toLocaleString()}`
                    : '—'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold">Farm Details</h2>
        {FARMS.map((farm) => (
          <Card key={farm.id}>
            <CardHeader>
              <CardTitle>{farm.name}</CardTitle>
              <CardDescription>
                {CATEGORY_LABEL[farm.category]} · {farm.estimate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{farm.description}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {farm.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
