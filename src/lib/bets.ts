import { prisma } from '@/lib/db'

export const PAYOUT_MULTIPLIER = 1.95
export const MIN_STAKE = 10
export const MAX_STAKE = 1000

export async function resolveOpenBets(): Promise<number> {
  const open = await prisma.bet.findMany({
    where: { status: 'open' },
    include: { item: true },
  })

  for (const bet of open) {
    const current = bet.item.price

    if (current === bet.entryPrice) {
      await prisma.$transaction([
        prisma.bet.update({
          where: { id: bet.id },
          data: { status: 'refunded', payout: bet.stake, resolvedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: bet.userId },
          data: { coins: { increment: bet.stake } },
        }),
      ])
      continue
    }

    const won =
      bet.direction === 'up' ? current > bet.entryPrice : current < bet.entryPrice

    if (won) {
      const payout = Math.round(bet.stake * PAYOUT_MULTIPLIER)
      await prisma.$transaction([
        prisma.bet.update({
          where: { id: bet.id },
          data: { status: 'won', payout, resolvedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: bet.userId },
          data: { coins: { increment: payout } },
        }),
      ])
    } else {
      await prisma.bet.update({
        where: { id: bet.id },
        data: { status: 'lost', payout: 0, resolvedAt: new Date() },
      })
    }
  }

  return open.length
}
