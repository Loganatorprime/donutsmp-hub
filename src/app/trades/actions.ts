'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export interface TradeFormState {
  error: string | null
}

export async function createOffer(
  _prev: TradeFormState,
  formData: FormData,
): Promise<TradeFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Sign in to post an offer.' }

  const type = String(formData.get('type') ?? 'sell')
  const item = String(formData.get('item') ?? '').trim()
  const quantity = Number(formData.get('quantity'))
  const price = Number(formData.get('price'))
  const note = String(formData.get('note') ?? '').trim()
  const contact = String(formData.get('contact') ?? '').trim()

  if (!item || !contact) return { error: 'Item and contact are required.' }
  if (!Number.isFinite(quantity) || quantity <= 0)
    return { error: 'Quantity must be a positive number.' }
  if (!Number.isFinite(price) || price < 0)
    return { error: 'Price must be a valid number.' }
  if (!['buy', 'sell'].includes(type)) return { error: 'Invalid offer type.' }

  await prisma.tradeOffer.create({
    data: {
      type,
      item,
      quantity: Math.floor(quantity),
      price,
      note: note || null,
      contact,
      createdBy: session.user.id,
    },
  })
  revalidatePath('/trades')
  return { error: null }
}

export async function deleteOffer(formData: FormData) {
  'use server'
  const session = await auth()
  const id = String(formData.get('id') ?? '')
  if (!session?.user?.id || !id) return

  await prisma.tradeOffer.deleteMany({
    where: { id, createdBy: session.user.id },
  })
  revalidatePath('/trades')
}
