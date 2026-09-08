'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { MAX_STAKE, MIN_STAKE } from '@/lib/bets'

export interface BetFormState {
  error: string | null
}

export async function placeBet(
  _prev: BetFormState,
  formData: FormData,
): Promise<BetFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sign in to place a bet.' }

  const symbol = String(formData.get('symbol') ?? '').trim()
  const direction = String(formData.get('direction') ?? '')
  const stake = Number(formData.get('stake'))

  if (!symbol) return { error: 'Pick an item to bet on.' }
  if (!['up', 'down'].includes(direction))
    return { error: 'Pick a direction — pump or dump.' }
  if (!Number.isFinite(stake) || !Number.isInteger(stake))
    return { error: 'Stake must be a whole number.' }
  if (stake < MIN_STAKE || stake > MAX_STAKE)
    return { error: `Stake must be between ${MIN_STAKE} and ${MAX_STAKE} dough.` }

  const item = await prisma.item.findUnique({ where: { symbol } })
  if (!item) return { error: 'Unknown item — refresh and pick again.' }

  const debited = await prisma.user.updateMany({
    where: { id: session.user.id, coins: { gte: stake } },
    data: { coins: { decrement: stake } },
  })
  if (debited.count !== 1)
    return { error: 'Not enough dough — correct calls pay 1.95×, work for it.' }

  await prisma.bet.create({
    data: {
      userId: session.user.id,
      symbol,
      direction,
      stake,
      entryPrice: item.price,
    },
  })
  revalidatePath('/predictions')
  return { error: null }
}
