import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const portfolio = await prisma.portfolio.findMany({
    where: { userId: session.user.id },
    include: { item: true },
  })

  const totalValue = portfolio.reduce(
    (sum, p) => sum + p.quantity * p.item.price,
    0,
  )
  const totalCost = portfolio.reduce(
    (sum, p) => sum + p.quantity * p.buyPrice,
    0,
  )
  const pnl = totalValue - totalCost

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Portfolio</h1>
      <p className="mt-2 text-muted-foreground">Track the items you own.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Value
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${totalValue.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cost Basis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${totalCost.toLocaleString()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit / Loss
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-bold ${
              pnl >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {pnl >= 0 ? '+' : '-'}${Math.abs(pnl).toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {portfolio.length === 0 ? (
        <p className="mt-8 text-muted-foreground">
          You haven&apos;t added any items yet. Browse the price list and add
          items to track them here.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {portfolio.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{p.item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {p.quantity.toLocaleString()} × @ {p.item.price.toLocaleString()}
                </p>
              </div>
              <p className="font-semibold">
                ${(p.quantity * p.item.price).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
